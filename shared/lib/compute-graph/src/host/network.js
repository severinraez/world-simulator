'use strict'
/*

 The network package prepares coordination channels for cooperation.

 * establishing websocket connection
 * mission statement distribution
 * provides communication channels for work items

 */

const Promise = require('bluebird')
const ws = require("nodejs-websocket")

class Network {
    constructor() {
        this.missionPromise = null

        this.MODES = { server: 1, client: 2 }
        this.mode = null

        this.onDataCallback = null
    }

    isServer() { return this.mode == this.MODES.server }
    isClient() { return this.mode == this.MODES.client }

    /*** Host API ***/
    getMission() {
        return this.missionPromise;
    }

    setMission(mission) {
        this.missionPromise.resolve(mission)
    }

    serve() {
        this.mode = this.MODES.server

        this.connections = []
        this.server = ws.createServer((connection) => {
            _communicateMission(connection).then(() => {
                connection.on('text', this.onDataCallback)
                this.connections.push(connection)
            })
        })

        this.server.listen(port)
    }

    connect(url) {
        this.mode = this.MODES.client

        this.connection = ws.connect(url)

        let isSetUp = false;
        this.connection.on('text', (data) => {
            if(isSetUp) {
                this.onDataCallback(data)
                return }

            if(isMissionMessage(data)) {
                setMission(data.mission)
                sendReadyMessage(this.connection)
                isSetUp = true }
            else {
                throw "connect: initialization failed" }
        })
    }

    /*** Postman API ***/
    send(data) {
        if(isClient()) {
            this.connection.send(data) }
        else {
            this.connections.forEach((connection) => {
                connections.send(data)
            })
        }
    }

    onData(callback) {
        this.onDataCallback = callback
    }

    /*** Private ***/
    _communicateMission(connection) {
        promise = new Promise()

        this.getMission().then((mission) => {
            connection.send(mission)

            connection.on('text'), (data) => {
                if(isReadyMessage(data)) {
                    promise.resolve()
                }
                else {
                    promise.reject(data)
                }
            }
        })

        return promise
    }
}

module.exports = Network
