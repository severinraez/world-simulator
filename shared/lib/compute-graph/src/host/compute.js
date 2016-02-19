'use strict'
/*

 The compute package sets up computing infrastructure and schedules work.

 * Initializes runners for the local node according to its roles

 */

const Runner = require('runner')

class Compute {
    constructor(runner) {
        this.runner = runner

        this.outboxCallback = null
    }

    //TODO: pass work in

    static make() {
        new Compute(new Runner())
    }

    process(workId, data) {
        return this.runner.process(data, this._getWork(workId))
    }

    _getWork(id) {
        return this.work[id];
    }
}

module.exports = Compute
