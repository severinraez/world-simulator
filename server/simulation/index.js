'use strict'

let nature = require('./nature.js')

let grid = require('./grid.js')

let sizeX = 100
let sizeY = 50

let world = {
    nature: nature.spawn(sizeX, sizeY)
}

let step = () => {
    let natureChanges = nature.step(world.nature, sizeX, sizeY)
    grid.applyChanges(natureChanges, world.nature)

    return world.nature
}


module.exports = {
    step: step
}

