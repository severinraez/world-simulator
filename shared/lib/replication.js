'use strict'

let _ = require('underscore')

let apply = (changes, target) => {
    let keysToDelete = _.keys(changes).filter((key) => {
	return changes[key] === undefined
    })
    _.each(keysToDelete, (key) => {
	delete changes[key]
    })
    return _.extend(target, changes)
}

module.exports = {
    apply: apply
}
