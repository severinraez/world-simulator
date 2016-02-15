'use strict'

const host = require('host')
const work = require('work')
const graph = require('graph')

const process = require('process')
const _ = require('underscore')

// Start as master unless --slave commandline argument is given
let isMaster = _.find(process.argv.slice(2), (argument) => { argument == '--slave' }) == null

if(host.isMaster()) {
    // We're the master node. Set up and kick off organization.

    const graph = require('graph')

    // The directed graph models the data flow.
    let flow = graph.create([
        ['i', 'p'] // i -> p
    ])

    // Set up where each vertice will be computed.
    let roles = host.roles({
        // role name => [ verticeName, ... ]
        'main': ['i', 'p']
    })

    // Assign the defined distribution roles to devices.
    let devices = {
        'main': 'localhost'
    }

    // Initialize networking.
    host.begin(work, flow, roles, devices)
}

// Use the local node to do computation work.
host.cooperate(work)
