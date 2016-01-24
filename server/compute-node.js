'use strict'

const cluster = require('cluster')
const util = require('util')
const _ = require('underscore')
const Promise = require('bluebird')

let log = require('app/shared/lib/log.js').create('compute-node', (message) => {
    let role = thisNode.role ? thisNode.role : '(unassigned)'
    return 'node ' + role + ': ' + message
})

const MESSAGE_TYPES = {
    init: 'worker-init',
    ready: 'worker-ready'
}

let thisNode = {
    role: null,
    workers: {},
    source: null,
    initialized: false
}

let isMaster = () => {
    return thisNode.role == 'master'
}

let initialize = (config, flowBuilder) => {
    thisNode.role = cluster.isMaster ? 'master' : null
    if(isMaster()) {
	return initMaster(config, flowBuilder) }
    else {
	return initWorker(flowBuilder) }
}

let initMaster = (config, flowBuilder) => {
    thisNode.role = 'master'    
    log('initializing')
    return new Promise((resolve, reject) => {
	let flow = flowBuilder('master')
	thisNode.source = flow.source
	log('spawning workers', config)
	let workersPromise = spawnWorkers(config, thisNode.source)
	workersPromise.then((workers) => {
            log('workers ready')
	    thisNode.workers = groupWorkersByRole(workers)
	    thisNode.initialized = true	    

	    resolve(flow.run)
	})
    })
}

//@param workerData [[role, worker], ...]
//@return {role: [worker, ...]}
let groupWorkersByRole = (workers) => {
    let groupedWorkers = _.groupBy(workers, (workerData) => {
	let [role, worker] = workerData;
	return role;
    })
    _.each(_.keys(groupedWorkers), (role) => {		
	groupedWorkers[role] = _.map(groupedWorkers[role], (workerData) => {
	    let [role, worker] = workerData;
	    return worker;
	})
    })
    return groupedWorkers;
}

let spawnWorkers = (config, sink) => {
    let workerPromises = _.map(config, (workerRole) => {
	return spawnWorker(workerRole, sink)
    })

    return Promise.all(workerPromises)
}

let spawnWorker = (role, sink) => {
    return new Promise((resolve, reject) => {
	let worker = cluster.fork()
	let initialized = false;
	
	worker.on('online', () => {
	    // tell the worker how to initialize
	    worker.send(buildInitMessage(role));
	})

	worker.on('message', (message) => {
	    // use first message from worker to mark him as initialized,
	    // else delegate data to worker sink
	    if(initialized) {
		sink(message)
	    }
	    else {
		if(isReadyMessage(message)) {
		    log('worker with role ' + role + ' initialized')
		    resolve([role, worker])		    
		    initialized = true
		} else {
		    reject('first message from ' + workerRole + ' worker was no init message')
		}
	    }
	})
    })
}

let isReadyMessage = (message) => {
    return message.type && message.type == MESSAGE_TYPES.ready
}

let isInitMessage = (message) => {
    return message.type && message.type == MESSAGE_TYPES.init
}

let buildInitMessage = (role) => {
    return { type: MESSAGE_TYPES.init, role: role }
}

let buildReadyMessage = () => {
    return { type: MESSAGE_TYPES.ready }
}

let initWorker = (flowBuilder) => {
    return new Promise((resolve, reject) => {	
	process.on('message', (message) => {
	    if(thisNode.initialized) {
		thisNode.source(message)
	    } else {		
		if(isInitMessage(message)) {
		    let role = message.role
		    thisNode.role = role

		    let flow = flowBuilder(role)
		    thisNode.source = flow.source

		    thisNode.initialized = true
		    let runTap = () => {			
			workerSend('master', buildReadyMessage())	
			flow.run()
		    }

		    resolve(runTap)
		}
		else {
		    let inspected = util.inspect(initData)
		    reject('malformed init message: ' + inspected)
		}
	    }
	})
    })
}

let workerSend = (role, message) => {
    if(role != 'master') {
	throw 'worker ' + thisNode.role + ' cannot send to ' + role }
    process.send(message)
}

let masterSend = (role, message) => {
    if(role == 'master') {
	throw 'master cannot send to himself' }
    _.each(thisNode.workers[role], (worker) => { worker.send(message) })    
}

let send = (role, message) => {
    if(isMaster) {
	masterSend(role, message) }    
    else {
	workerSend(role, message) }
}

let setDataHandler = (handler) => { thisNode.dataHandler = handler }

module.exports = {
    initialize: initialize,
    send: send,
    onData: setDataHandler
}
