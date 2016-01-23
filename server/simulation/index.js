'use strict'

const nature = require('./nature.js')
const grid = require('./grid.js')

let sizeX = 100
let sizeY = 50

let createWorld = () => {
    let seeds = nature.seedPlants(20, sizeX, sizeY)
    let theNature = grid.applyChanges(seeds, 
				   nature.spawn(sizeX, sizeY))
    
    return {
	nature: theNature
    }
}

let world = createWorld()

let step = () => {
    let natureChanges = nature.step(world.nature, sizeX, sizeY)
    grid.applyChanges(natureChanges, world.nature)

    return [natureChanges, world.nature]
}

module.exports = {
    step: step    
}
