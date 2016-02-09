'use strict'

const host = require('host')
const work = require('work')
const graph = require('graph')

const process = require('process')
const _ = require('underscore')

// start as master unless --slave commandline argument is given
let isMaster = _.find(process.argv.slice(2), (argument) => { argument == '--slave' }) == null

if(host.isMaster()) {
    // We're the master node. Set up and kick off computation.

    const graph = require('graph')

    // The directed graph models the data flow
    let flow = graph.create([
        ['i', 'p'] // i -> p
    ])

    // Set up where each vertice will be computed
    let roles = host.roles({
        // role name => [ verticeName, ... ]
        'main': ['i', 'p']
    })

    // Assign the defined distribution roles to devices
    let devices = {
        'main': 'localhost'
    }

    // Start the fun.
    host.begin(work, flow, roles, devices)
}
else {
    // We're not the master node. Wait for work assignment.

    host.cooperate(work)
}
