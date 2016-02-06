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

let initialize = (mission) => {
    let graph = graph.graph( mission.graph )

    // Data flow: inbox -> assigner -> runners -> outbox
    let outbox = postman.outbox( mission.roles, mission.hosts )

    let runners = runner.spawn( graph, mission.roles, mission.work, outbox )
    let assigner = workAssigner( runners )

    let inbox = postman.inbox( assigner )

}

host.getMissionAnd(initialize)


