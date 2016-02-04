'use strict'

const graph = require('graph')
const host = require('host')

let workIncrement = (input) => {
    return input + 1
}

let workPrint = (input) => {
    console.log(input)
}

let incrementer = graph.vertice(workIncrement)
let printer = graph.vertice(workPrint)

// The graph models the data flow
let graph = graph.graph({
    vertices: {
        'i': incrementer,
        'p': printer
    },

    // Define the edges. We construct a directed graph.
    edges: [
        ['i', 'p']
    ]
})

// Set up where each vertice will be computed
let roles = hosts.roles({
    // role name => [ verticeName1, verticeName2 ]
    'main': ['i', 'p']
})

// Connect to the hosts
let hostsReadyPromise = hosts.connect(['localhost'])

// Assign the distribution roles from above to devices
let roles = {
    'main': 'localhost'
}

hostsReadyPromise.then (hosts) => {

    //Start the fun.
    hosts.begin(graph, roles, hosts)

}




