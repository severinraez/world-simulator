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

let begin = (flow, roles, devices) => {
    // Build a mission statement describing the organisation of work.
    let mission = buildMission(graph, roles, hosts)

    // Distribute the mission.
    network.setMission(mission)
}

let cooperate = (work) => {
    // Await configuration...
    network.getMission().then (mission) => {
        // ...and initialize local device.
        compute.start(mission, work)
    }
}

module.exports = {
    begin: begin,
    cooperate: cooperate,
    roles: roles
}
