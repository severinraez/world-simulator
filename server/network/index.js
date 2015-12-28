Worker = require('worker.js');
Worker.start();

let putHistory = (records) => {
    // I: Refine records here before sending them

    worker.distribute records
}

api = {
    onCommand: worker.onCommand
    putHistory: putHistory
}

module.exports = api
