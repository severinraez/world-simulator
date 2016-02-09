'use strict'

const Promise = require('bluebird')
const host = require('host')

let sockets = []
let missionPromise = null

let getMission = () => {
    promise = new Promise()

    if(host.isMaster) {
        promise.resolve(mission)
    }
}

let communicateMission = (socket) => {
    readyPromise = new Promise()

    missionPromise.then (mission) => {
        socket.send(mission)

        socket.on('text'), (data) => {
            if(isReadyMessage(data)) {
                readyPromise.resolve()
            }
            else {
                readyPromise.reject(data)
            }
        }
    }

    return readyPromise
}


