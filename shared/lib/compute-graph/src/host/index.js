'use strict';

const Compute = require('compute')
const Network = require('network')
const Postman = require('postman')

const graph = require('graph')

class Host {
    construct(network, compute, postman) {
        this.network = network
        this.compute = compute
        this.postman = postman

        this._setupCommunications()
    }

    static make() {
        return new Host(new Network(), Compute.make(), new Postman())
    }

    lead(work, graph, roles, devices)  {
        this.network.serve()

        // Build a mission statement describing the organisation of work.
        let mission = this._buildMission(graph, roles, devices)

        // Distribute the mission.
        this.network.setMission(mission)

        this._startComputing(work)
    }

    cooperate(work, leaderUrl) {
        this.network.listen(leaderUrl)

        this._startComputing(work)
    }

    _startComputing(work) {
        // Await configuration...
        this.network.getMission().then (mission)  {
            this.graph = graph.create(mission.graph)

            // ...and initialize local device.
            this.compute.start(work)
        }
    }

    _buildMission(graph, roles, hosts)  {
        return {
            graph: graph, roles: roles, hosts: hosts }
    }

    _setupCommunications() {
        this.network.onData(this.postman.inbound)
        this.postman.outbound(this.network.send)

        this.postman.inbox(_process)
    }

    _process(message) {
        let nextHops = this._nextHopsFor(role)
        this.compute.process(role, message.data).then((result) => {
            nextHops.forEach((hop) => {
                let message = { role: role, data: result }
                this.postman.outbox(message)
            })
        })
    }

    _nextHopsFor(role) {
        return graph.successors(role)
    }
}

module.exports = Host
