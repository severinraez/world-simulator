'use strict'

class World {
    onHistory(callback) {
	if(this.historyCallback) { throw 'only one callback allowed'; }

	this.historyCallback = callback
    }

    put(objectData, coordinates) {
	let cell = grid.get(coordinates)
	cell.put( object(objectData) )
    }

    object(data) {
	return { data: data }
    }
}

module.exports = World
