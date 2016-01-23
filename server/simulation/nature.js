'use strict'

let util = require('app/shared/lib/util.js')
let replication = require('app/shared/lib/replication.js')
let grid = require('./grid.js')

let _ = require('underscore')

let pluckPlantCells = (grid) => {
    return util.map2filter(grid, (cell) => { return cell.plant !== undefined })
}
let pluckEmptyCells = (grid) => {
    return util.map2filter(grid, (cell) => { return cell.plant === undefined })
}
let pluckPlants = (cells) => { return _.compact(_.pluck(cells, 'plant')) }

let step = (nature, sizeX, sizeY) => {
    let liveCells = pluckPlantCells(nature);

    let growChanges = _.map(liveCells, (cell) => { 
	let change = growPlant(cell.plant, grid.neighbours(cell.coords, nature, sizeX, sizeY))
	return { coords: cell.coords, plant: change }
    })

    let deadCells = pluckEmptyCells(nature);
    let population = _.size(liveCells) / ( sizeX * sizeY );
    let spawnChanges = _.map(deadCells, (cell) => { 
	let change = spawnOffspring(cell, grid.neighbours(cell.coords, nature, sizeX, sizeY), population)
	if(change) {
	    return { coords: cell.coords, plant: change }
	}
	else {
	    return null;
	}
    })

    return growChanges.concat(_.compact(spawnChanges));
}

let growPlant = (plant, neighbours) => {
    let neighbourPlants = pluckPlants(neighbours())
    let baseFactor = 1.2
    let friendsFactor = _.size(neighbourPlants) * 0.1
    let factor = baseFactor + friendsFactor

    return { size: plant.size * factor }
}
// possibly populates an empty cell with a plant.
// population: number in interval [0,1]
let spawnOffspring = (cell, neighbours, population) => {
    let neighbourPlants = pluckPlants(neighbours())
    let sizes = _.map(neighbourPlants, (p) => { return p.size })
    let totalSize = _.reduce(sizes.concat([0]), (a,b) => { return a + b })

    let spawnProbability = Math.min(1, totalSize/20) * Math.max(0, 0.8 - population)
    if(Math.random() < spawnProbability) {
	return spawnPlant(0.8)
    }
    return null;
}

let seedPlants = (count, d1, d2) => {
    let plants = _.map(_.range(count), () => {
	let coords = [
	    Math.floor(Math.random() * d1),
	    Math.floor(Math.random() * d2)
	]
	return { coords: coords, plant: spawnPlant(1) }
    })
    return plants
}
let spawnPlant = (size) => {
    return { size: size }
}

let spawn = (sizeX, sizeY) => {
    let seeds = seedPlants(20, sizeX, sizeY)
    let nature = grid.applyChanges(seeds, 
				   grid.build(sizeX, sizeY))

    return nature
}

module.exports = {
    spawn: spawn,
    step: step
}