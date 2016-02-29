'use strict'

const PROTOCOL = require('./protocol')

class Child {
    construct() {
        super()

        this.initialized = false
        this.work = null
    }

    start() {
        this._buildRunner()

        process.on('message', (message) => {
            if(this.initialized) {
                this._compute(message)
                return }

            this._initialize(message.workFilePath)
        })
    }

    _initialize(workFilePath) {
        this.work = require(workFilePath)
        let readyMessage = PROTOCOL.ready
        process.send(readyMessage)
    }

    _buildRunner() {
        this.runner = new Runner()
        runner.setWork(this.work)
    }

    _run(message) {
        let result = this.runner.run(message.workId, message.data)
        process.send(result)
    }
}

new Child().run()
