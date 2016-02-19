'use strict'

const Host = require('host')
const work = require('work')
const graph = require('graph')

const process = require('process')
const _ = require('underscore')

// Start as master unless --slave commandline argument is given
let isMaster = _.find(process.argv.slice(2), (argument) => { argument == '--slave' }) == null
let host = Host.make()

if(isMaster) {
    // We're the master node. Set up and kick off organization.

    const graph = require('graph')

    // The directed graph models the data flow.
    let flow = graph.create([
        ['i', 'p'] // i -> p
    ])

    // Set up where each vertice will be computed.
    let roles = {
        // role name => [ verticeName, ... ]
        'main': ['i', 'p']
    }

    // Assign the defined distribution roles to devices.
    let devices = {
        'main': 'localhost'
    }

    // Initialize networking and start computing.
    host.lead(work, flow, roles, devices)
}
else {
    // Wait for network and start computing.
    host.cooperate(work, 'ws://localhost')
}
