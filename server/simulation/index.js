let util = require('../../shared/lib/util.js')
let grid = require('./grid.js')
let _ = require('underscore');

let processNature = (nature) => {
    let cells = util.map2filter(nature, (cell) => { return cell.plant !== undefined })
    let change = _.map(cells, (cell) => { 
	growPlant(cell.plant, neighbours(nature, cell.coords)) 
    })
    return change;
}

let pluckPlants = (cells) => { _.compact(_.pluck(cells, 'plant')) }

let growPlant = (plant, neighbours) => {
    let growFactor = 1.2 +  _.length(neighbours()) * 0.1

    return { size: plant.size }
}

let seed = (count, grid, d1, d2) => {
    let plants = _.map(_.range(count), () => {
	let coords = [
	    Math.floor(Math.random() * d1),
	    Math.floor(Math.random() * d2)
	]
	return { coords: coords, plant: { size: 1 } }
    })
    return plants;
}

// imperative part: world state
let sizeX = 50
let sizeY = 50

let world = {
    nature: seed(50, grid.build(sizeX, sizeY), sizeX, sizeY)
}

let spawnPlant = (size) => {
    return { size: size }
}

let step = () => {   
    return world.nature;
    let natureDiff = processNature(world.nature)
    return natureDiff;

    // intentional destructive update (let's pretend we need to be performant)
    let newWorld = applyDiff(world, natureDiff)

    return newWorld
}


module.exports = {
    step: step
}
