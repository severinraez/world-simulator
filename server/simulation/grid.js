let util = require('../../shared/lib/util.js')
let _ = require('underscore');

// delta steps to take to move in a certain direction. starts with 'up' and moves clockwise.
const DIRECTIONS  = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]]

// bounds a number from 0-b
// bound(0, 2) -> 0
// bound(1, 2) -> 1
// bound(3, 2) -> 0
let bound = (n, b) => {
    return n % b
}

// bounds a 2d vector form 0-d1 and 0-d2
let bound2 = (vec, d1, d2) => {
    return [ bound(vec[0], d1), bound(vec[1], d2) ];
}

let build = (sizeX, sizeY) => {
    let grid = _.map(_.range(sizeY), (y) => {
	_.map(_.range(sizeX), (x) => {
	    { coords: [x, y] }
	})
    })
    return grid
}

let neighbours = (grid, coords) => {    
    return () => {
	let cells = _.map(DIRECTIONS, (direction) => {
	    let neighbourCoords = bound2(add2(coords, direction), sizeX, sizeY)
	    return grid[neighbourCoords]
	})
	return cells
    }
}

module.exports = {
    DIRECTIONS: DIRECTIONS,
    bound: bound,
    bound2: bound2,
    build: build,
    neighbours: neighbours
}
