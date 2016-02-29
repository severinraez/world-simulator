'use strict'

class Runner {
    constructor() {
        this.work = null
    }

    setWork(work) {
        this.work = work
    }

    run(workId, data) {
        let work = this._getWork(workId)
        let result = work(data)

        return result;
    }

    _getWork(id) {
        return this.work[id]
    }
}
