'use strict'

let util = require('app/shared/lib/util.js')
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
	if(change) { 
	    return { coords: cell.coords, plant: change } }
	else { 
	    return null }
    })

    let deadCells = pluckEmptyCells(nature);
    let population = _.size(liveCells) / ( sizeX * sizeY );
    let spawnChanges = _.map(deadCells, (cell) => { 
	let change = spawnOffspring(cell, grid.neighbours(cell.coords, nature, sizeX, sizeY), population)
	if(change) {
	    return { coords: cell.coords, plant: change } }
	else {
	    return null	}
    })

    return _.compact(growChanges.concat(spawnChanges));
}

let growPlant = (plant, neighbours) => {
    let maxSize = 50
    if(plant.size == maxSize) {
	return null; 
    }

    let neighbourPlants = pluckPlants(neighbours())
    let baseFactor = 1.2

    let friendsFactor = _.size(neighbourPlants) * 0.1
    let factor = baseFactor + friendsFactor    
    let unboundedSize = plant.size * factor

    return { size: Math.min(unboundedSize, maxSize)}
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
    return grid.build(sizeX, sizeY)
}

module.exports = {
    spawn: spawn,
    seedPlants: seedPlants,
    step: step
}
