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
let roles = host.roles({
    // role name => [ verticeName1, verticeName2 ]
    'main': ['i', 'p']
})


// Assign the distribution roles from above to devices
let roles = {
    'main': 'localhost'
}

host.connect(['localhost']).then (host) => {

    //Start the fun.
    host.begin(graph, roles, host)

}




