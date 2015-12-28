class Worker {
    onCommand(callback) {
	if(this.commandCallback) { throw 'only one callback allowed'; }

	this.commandCallback = callback;
    }

    start() {
	console.log('TODO: Worker should start listening')
    }

    distribute(records) {
	_.each(this.clients, (client) => {
	    client.send(records)
	})
    }
}

module.exports = Worker;
