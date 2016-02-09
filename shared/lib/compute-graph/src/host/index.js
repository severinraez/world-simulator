'use strict';

const compute = require('compute')
const network = require('network')

let roles = (spec) => {
    return spec
}

let buildMission = ( graph, roles, hosts ) => {
    return {
        graph: graph, roles: roles, hosts: hosts }
}

let begin = (work, flow, roles, devices) => {
    // Initialize devices.
    let mission = buildMission(graph, roles, hosts)
    network.setMission(mission)

    // Initialize local device (if needed).
    if(roles['localhost']) {
        compute.start(mission, work)
    }
}

let cooperate = (work) => {
    // Await configuration
    network.getMission().then (mission) => {
        // Initialize local device
        compute.start(mission, work)
    }
}

module.exports = {
    roles: roles
}
