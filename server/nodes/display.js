'use strict'

const _ = require('underscore')
const computeNode = require('app/server/compute-node')

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

let run = () => {
    console.log('display worker: run')
}
let logData = (simulationData) => {
    let now = new Date()	
    let [changes, results, duration, sendStartedAt] = simulationData
    let transferDuration = (now-Date.parse(sendStartedAt))/1000
    process.stdout.write(render(results) + '\n')
    process.stdout.write('(simulated in ' + duration + 's, transferred in ' + transferDuration + 's, ' + changes.length + ' changes)\n')
}

module.exports = {
    source: logData,
    run: run
}
