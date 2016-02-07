'use strict'

const host = require('host')
const work = require('work')

if(host.isMaster) {
    // We're the master node. Set up and kick off computation.

    const graph = require('graph')

    // The directed graph models the data flow
    let graph = graph.graph([
        ['i', 'p'] // i -> p
    ])

    // Set up where each vertice will be computed
    let roles = host.roles({
        // role name => [ verticeName, ... ]
        'main': ['i', 'p']
    })

    // Assign the defined distribution roles to devices
    let roles = {
        'main': 'localhost'
    }

    //Start the fun.
    host.begin(graph, roles, host, work)
}
else {
    // We're not the master node. Wait for work assignment.

    host.cooperate(work)
}
