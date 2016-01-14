//let network = require('./network')
let simulation = require('./simulation')
let _ = require('underscore')

let run = () => {
    let time = new Date();
    process.stdout.write('\n');
    let results = simulation.step();
    let duration = ((new Date()) - time)/1000;

    process.stdout.write(render(results) + '\n');

    process.stdout.write('(took ' + duration + 's)\n');
}

let render = (grid) => {
    let rows = _.map(grid, (row) => {
	return _.map(row, renderCell).join('')
    });
    return rows.join('\n');
}

let renderCell = (cell) => {
    if(cell.plant) {
	let size = cell.plant.size;
	if(size < 1) return '.';	    
	if(size < 3) return ',';
	if(size < 6) return '+';
	if(size < 12) return '*';
	return '#';
    }
    else {
	return ' ';
    }
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
