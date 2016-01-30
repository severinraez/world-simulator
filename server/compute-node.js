'use strict'

const cluster = require('cluster')
const util = require('util')
const _ = require('underscore')
const Promise = require('bluebird')

/*
  compute-node transforms multiple processes into a master/workers cluster.

  nodes are assigned roles, your responsibility is to provide a compute-node _behaviour_ for each node.
  a compute-node definition is given as follows:

  {
    run: () => {}, // function called to set up the node. setup is considered complete when this function returns
    source: (message) => {} // function called when the node receives a message.
  }

  once node setup is complete, the system will consider the node *initialized*. from now on, the nodes' source may receive messages.
*/

const createLogger = require('app/shared/lib/log.js').create
let log = createLogger('compute-node', (message) => {
    let role = thisNode.role ? thisNode.role : '(unassigned)'
    return 'node ' + role + ': ' + message
})

const MESSAGE_TYPES = { // non-computation internode communication
    init: 'worker-do-init',
    ready: 'worker-is-ready'
}

let thisNode = { // state of current process' compute-node binding
    role: null,
    workers: {}, // { role: [ worker (cluster.fork result), ... ]
    sink: null, // sink for incoming data, (data) => { ... }
    initialized: false // whether initialization is complete and the node can start to compute
}

let isMaster = () => { return thisNode.role == 'master' }

// use the current process as a compute node
let initialize = (config, behaviourBuilder) => {
    if(cluster.isMaster) {
	thisNode.role = 'master'
    }
    if(isMaster()) {
	return initMaster(config, behaviourBuilder) }
    else {
	return initWorker(behaviourBuilder) }
}

// starts the workers, yields nodes' run behaviour once theyre ready
let initMaster = (config, behaviourBuilder) => {
    thisNode.role = 'master'

    log('initializing')
    return new Promise((resolve, reject) => {
	let behaviour = behaviourBuilder('master')
	thisNode.sink = behaviour.source

	log('spawning workers', config)
	let workersPromise = spawnWorkers(config, thisNode.sink)
	workersPromise.then((workers) => {
            log('workers ready')
	    thisNode.workers = groupWorkersByRole(workers)
	    thisNode.initialized = true

	    resolve(behaviour.run)
	})
    })
}

//@param workerData [[role, worker], ...]
//@return {role: [worker, ...]}
let groupWorkersByRole = (workers) => {
    let groupedWorkers = _.groupBy(workers, (workerData) => {
	let [role, ] = workerData;
	return role;
    })
    _.each(_.keys(groupedWorkers), (role) => {
	groupedWorkers[role] = _.map(groupedWorkers[role], (workerData) => {
	    let [, worker] = workerData;
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

/*
  spawns a child process and coordinates it's setup as a node.

  @param role role of the node
  @param sink source part of the compute-node definition. this function makes sure it's called with all messages the node receives
  @return promise that resolves into [worker, ...] as soon as all worker nodes are initialized
*/
let spawnWorker = (role, sink) => {
    return new Promise((resolve, reject) => {
	let worker = cluster.fork()
	let initialized = false;

	worker.on('online', () => {
	    // tell the worker with which node definition to initialize
	    worker.send(buildInitMessage(role));
	})

	worker.on('message', (message) => {
	    /*
	      route internal setup messages and internode communications separately.

	      the first message from the server must be one with which he reports initialization as finished.
	      the following messages are consiedered internode communication and will be forwarded to the respective
	      node source.
	    */
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

let isReadyMessage = (message) => { return message.type && message.type == MESSAGE_TYPES.ready }
let isInitMessage = (message) => { return message.type && message.type == MESSAGE_TYPES.init }
let buildInitMessage = (role) => { return { type: MESSAGE_TYPES.init, role: role } }
let buildReadyMessage = () => { return { type: MESSAGE_TYPES.ready } }

/*
  makes current process a worker.

  awaits configuration instructions from the master and delegates running the node to the caller.

  @return promise that will resolve to run-part of compute node definition as soon as initialization is finished.
*/
let initWorker = (behaviourBuilder) => {
    return new Promise((resolve, reject) => {
	process.on('message', (message) => {
	    if(thisNode.initialized) {
		thisNode.sink(message)
	    } else {
		if(isInitMessage(message)) {
		    let role = message.role
		    thisNode.role = role

		    let behaviour = behaviourBuilder(role)
		    thisNode.sink = behaviour.source

		    thisNode.initialized = true
		    let runTap = () => {
			workerSend('master', buildReadyMessage())
			behaviour.run()
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
