'use strict'

const runner = require('runner')
const graph = require('graph')
const postman = require('postman')

let workAssigner = (runners) => {
    return (item) => {
        let role  = item.destination
        let message = item.message

        runner.process(message, role, runners)
    }
}

let start = (mission, work) => {
    let graph = graph.graph( mission.graph )

    // Data flow: inbox -> assigner -> runners -> outbox
    let outbox = postman.outbox( mission.roles, mission.hosts )

    let runners = runner.spawn( graph, mission.roles, work, outbox )
    let assigner = workAssigner( runners )

    postman.inbox( mission.roles, assigner )
}

module.exports = {
    start: start
}
