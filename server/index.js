'use strict'

const _ = require('underscore')
const computeNode = require('./compute-node')

let nodes = ['display']

const ROLES_TO_CODE = {
    master: './nodes/master',
    display: './nodes/display'    
}

let log = require('app/shared/lib/log.js').create('server-index', (message) => {
    return message;
})

let flowPromise = computeNode.initialize(nodes, (role) => {    
    let code = ROLES_TO_CODE[role]
    if(!code) {
	throw 'no code found for role ' + role }

    log('initializing node with role ' + role + '...')
    log('code', code)
    let flow = require(code)

    log('flow', flow)
    return flow;
})

flowPromise.then((flow) => { 
    log('got flow', flow)
    flow()
    log('executed flow')
})

/*
class PutCommand {
    constructor(params) {
	this.object = params.object
	this.coordinates = params.coordinates
    }
    
    apply (world) {
	world.put(this.object, this.coordinates)
    }
}

let commands = {
    'put': PutCommand
}

network.onCommand((commandParams) => {
    let commandKlass = commands[commandParams.name]
    let command = new commandKlass(commandParams)
    
    command.apply(simulation)
})

world.onHistory((records) => {
    network.putHistory(records)
})
*/
