'use strict'
/*

 The compute package sets up computing infrastructure and distributes work.

 * Initializes runners for the local node according to its roles
 * Distributes inbound work items

 TODO: With postman doing the IPC, most likely inboxes and outboxes can be maintained by the runners themselves. See TODOs at postman.
 */

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
