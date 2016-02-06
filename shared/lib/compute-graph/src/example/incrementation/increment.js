'use strict'

const graph = require('graph')
const host = require('host')
const work = require('work')

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

//Slave bootstrap could look like this:
// host.cooperate(socket, work)
