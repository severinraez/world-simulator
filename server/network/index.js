'use strict'

let Worker = require('./worker.js');
let worker = new Worker();
worker.start();

let putHistory = (records) => {
    // I: Refine records here before sending them

    worker.distribute(records)
}

let api = {
    onCommand: worker.onCommand,
    putHistory: putHistory
}

module.exports = api
