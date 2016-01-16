'use strict'

let ws = require("nodejs-websocket")

class Worker {
    constructor() {
	this.port = 8765
    }

    onCommand(callback) {
	if(this.commandCallback) { throw 'only one callback allowed' }

	this.commandCallback = callback
    }

    start() {
	this.server = ws.createServer((connection) => {
	    this.addConnection(connection)
	})
	this.server.listen(this.port)
	console.log('Listening on port ' + this.port)
    }

    distribute(records) {
	_.each(this.connections, (connection) => {
	    connection.send(records)
	})
    }

    addConnection(connection) {
	connection.on('text', (data) =>{ 
	    console.log('Received ' + data)
	})

	connection.on('close', (code, reason) => {
	    console.log('Connection closed')

	    let index = this.connections.indexOf(connection)
	    this.connections.splice(index, 1)
	})

	this.connections.push(connection)
    }
}

module.exports = Worker
