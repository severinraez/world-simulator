//let network = require('./network')
let simulation = require('./simulation')
let _ = require('underscore')

let run = () => {
    let time = new Date();
    process.stdout.write('\n');
    let results = simulation.step();
    console.log(results);

    process.stdout.write('(took ' + ((new Date()) - time)/1000 + 's)\n');
}

setInterval(run, 1000)

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
