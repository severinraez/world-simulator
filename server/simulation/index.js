let util = require('../../shared/lib/util.js')
let grid = require('./grid.js')
let _ = require('underscore')


let pluckPlantCells = (grid) => {
    return util.map2filter(grid, (cell) => { return cell.plant !== undefined })
}
let pluckPlants = (cells) => { return _.compact(_.pluck(cells, 'plant')) }

let processNature = (nature, sizeX, sizeY) => {
    let cells = pluckPlantCells(nature);

    let changes = _.map(cells, (cell) => { 
	let change = growPlant(cell.plant, grid.neighbours(cell.coords, nature, sizeX, sizeY))
	return { coords: cell.coords, plant: change }
    })
    return changes
}

let growPlant = (plant, neighbours) => {
    let neighbourPlants = pluckPlants(neighbours())
    let baseFactor = 1.2
    let friendsFactor = _.size(neighbourPlants) * 0.1
    let factor = baseFactor + friendsFactor

    return { size: plant.size * factor }
}
let seedPlants = (count, grid, d1, d2) => {
    let plants = _.map(_.range(count), () => {
	let coords = [
	    Math.floor(Math.random() * d1),
	    Math.floor(Math.random() * d2)
	]
	return { coords: coords, plant: { size: 1 } }
    })
    return plants
}
let spawnPlant = (size) => {
    return { size: size }
}

/* =============================================

imperative part: world state

*/
let sizeX = 10
let sizeY = 10

let destructiveApply = (changes, targetGrid) => {
    _.each(changes, (change) => {
	let cell = grid.at(change.coords, targetGrid)
	_.extend(cell, change)
    })
}

let spawnNature = () => {
    let nature = grid.build(sizeX, sizeY);    
    let seeds = seedPlants(20, grid, sizeX, sizeY);
    destructiveApply(seeds, nature);
    return nature;
}

let world = {
    nature: spawnNature()
}

let step = () => {
    let natureChanges = processNature(world.nature, sizeX, sizeY)

    destructiveApply(natureChanges, world.nature)

    return pluckPlantCells(world.nature)
}


module.exports = {
    step: step
}

