let _ = require('underscore');

// vector operations
let add2 = (v1, v2) => { [ v1[0] + v2[0], v1[1] + v2[1] ] }

// map a 2d matrix to a 1d vector (row by row)
let map2 = (matrix, visitor) => { 
   _.flatten(_.map(matrix), (row) => { _.map(row, visitor) })
}
// map a 2d matrix to a 1d vector (row by row), filtering by the predicate function given
let map2filter = (matrix, predicate) => {
    _.compact(map2(matrix), (cell) => { return predicate(cell) } );
}

module.exports = {
    add2: add2,
    map2: map2,
    map2filter: map2filter
}

