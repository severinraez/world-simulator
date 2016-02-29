'use strict'

const cluster = require('cluster')
const Promise = require('bluebird')

const PROTOCOL = require('./protocol')

class Master {
    construct(numChildren) {
        super()

        this.children = []
        this.numChildren = numChildren
        this.dataReadyPromises = []

        this.onMessageCallback = null
    }

    // @return promise that will resolve once all children are ready to compute
    start() {
        let promises = []
        for(let i = 0; i < numChildren; i++) {
            let promise = this.spawnChild((result) => {
                this._onResult(result, i)
            })

            promise.then((child) => {
                this.children.push(child) })

            promises.push(promise)
        }

        return Promise.all(promises)
    }

    spawnChild(resultCallback) {
        let promise = new Promise()

        let child = cluster.fork();
        child.on('online', () => {
            child.send(buildInitMessage())
        })

        let initialized = false
        child.on('message', (message) => {
            if(initialized) {
                this._onResult(message, child) }
            else {
                let isReadyMessage = message == PROTOCOL.ready
                if(isReadyMessage) {
                    initialized = true
                    promise.resolve() }
                else {
                    promise.reject("first message was no ready message")
                } }
            return promise
        })
    }
    // @return promse that will resolve to the invocations' result
    run(childIndex, workId, data) {
        let child = this.children[childIndex]
        let message = { workId: workId, data: data }
        child.send(message)

        let promise = new Promise()
        if(this.dataReadyPromises[childIndex]) {
            throw "already got a promise for child with index " + childIndex }

        this.dataReadyPromises[childIndex] = promise
        return promise
    }

    _onResult(message, child) {
        let index = this.children.indexOf(index)
        if(index == -1) {
            throw "could not find child" }

        let promise = this.dataReadyPromises[index]
        if(promise == undefined) {
            throw "could not find promise at index " + index }

        promise.resolve(message)
        delete this.dataReadyPromises[index]
    }
}
