//let network = require('./network')
let simulation = require('./simulation')

console.log(simulation.step());

/*
class PutCommand {
    constructor(params) {
	this.object = params.object
	this.coordinates = params.coordinates
    }
    
    apply (world) {
	world.put(this.object, this.coordinates)
    }
}

let commands = {
    'put': PutCommand
}

network.onCommand((commandParams) => {
    let commandKlass = commands[commandParams.name]
    let command = new commandKlass(commandParams)
    
    command.apply(simulation)
})

world.onHistory((records) => {
    network.putHistory(records)
})
*/
