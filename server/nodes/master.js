'use strict'

let computeNode = require('app/server/compute-node')
const simulation = require('app/server/simulation')

let loop = () => {
    process.stdout.write('\n')
    
    let time = new Date()
    let [changes, results] = simulation.step()
    let now = new Date()
    let duration = (now - time)/1000
    
    computeNode.send('display', [changes, results, duration, now])
}
let run = () => {
    console.log('master: simulation starting')
    setInterval(loop, 1000)
}

module.exports = {
    run: run,
    source: () => {}
}

