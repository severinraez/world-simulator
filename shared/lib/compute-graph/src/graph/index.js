'use strict';

const Graph = require('graphlib')
const _ = require('underscore')

// @param edges an array [ 'from-node', 'to-node' ]
let create = (edges) => {
    let nodeNames = _.uniq(_.flatten(edges))

    let graph = new Graph()
    _.each(nodeNames, (name) => {
        graph.setNode(name)
    })

    _.each(edges, (edge) => {
        let [from, to] = edge
        graph.setEdge(from, to)
    })

    return graph
}

module.exports = {
    create: create
}
