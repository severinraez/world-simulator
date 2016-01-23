'use strict'

//let network = require('./network')
const simulation = require('./simulation')
const _ = require('underscore')
const cluster = require('cluster')

if(cluster.isMaster) {
    let displayWorker = cluster.fork();
    displayWorker.on('online', () => {
	console.log('display worker ready.')
    })

    let run = () => {
	let time = new Date()
	process.stdout.write('\n')
	let [changes, results] = simulation.step()
	let now = new Date()
	let duration = (now - time)/1000
	
	displayWorker.send([changes, results, duration, now])	
    }
       
    setInterval(run, 1000)   
} else {
    let render = (grid) => {
	// grid is [x][y]
    let transposed = _.zip.apply(this, grid)
	let rows = _.map(transposed, (row) => {
	    return _.map(row, renderCell).join('')
	}); 
	
	return rows.join('\n')
    }
    
    let renderCell = (cell) => {
	if(cell.plant) {
	    let size = cell.plant.size
	    if(size < 1) return '.';	    
	    if(size < 3) return ','
	    if(size < 6) return '+'
	    if(size < 12) return '*'
	    return '#'
	}
	else {
	    return ' '
	}
    }

    process.on('message', (simulationData) => {
	let now = new Date()	
	let [changes, results, duration, sendStartedAt] = simulationData
	let transferDuration = (now-Date.parse(sendStartedAt))/1000
	process.stdout.write(render(results) + '\n')
	process.stdout.write('(simulated in ' + duration + 's, transferred in ' + transferDuration + 's, ' + changes.length + ' changes)\n')

    })
}

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
