network = require('network')

world = require('simulation')

class PutCommand {
    constructor(params) {
	this.object = params.object
	this.coordinates = params.coordinates
    }
    
    apply (world) {
	world.put(this.object, this.coordinates)
    }
}

commands = {
    'put': PutCommand
}

network.onCommand (commandParams) => {
    let commandKlass = commands[commandParams.name]
    let command = new commandKlass(commandParams)
    
    command.apply(world)
}

world.onHistory (records) => {
    network.putHistory records
}
