'use strict'

const _ = require('underscore')
const computeNode = require('./compute-node')

let nodes = ['display']

const ROLES_TO_CODE = {
    master: './nodes/master',
    display: './nodes/display'
}

let log = require('app/shared/lib/log.js').create('server-index', (message) => {
    return message;
})

let flowPromise = computeNode.initialize(nodes, (role) => {
    let code = ROLES_TO_CODE[role]
    if(!code) {
	throw 'no code found for role ' + role }

    let flow = require(code)
    return flow;
})

flowPromise.then((flow) => {
    flow()
})
