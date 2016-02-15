'use strict'
/*

 The postman package provides host-level deliveries.

 Packages are adressed to a role and the postman will route them

 * between processes (including loopback deliveries)
 * from the local host to the network if the role is exercised by another host
 * from the network to the correct process

 TODO: Think about this: Postman will do a lot of plumbing work. Looks like stateful is the pragmatic way to go here?
 TODO: Architectural approach: Create a delivery systems and add inboxes with role address to them so postman can deliver the message only
 */

const network = require('network')

let inboxes = []
let localDelivery = (item) => {
    inboxes.forEach((inbox) => {
        inbox(item)
    })
}

network.onData((data) => {
    let item = data;
    localDelivery(item)
})

let createInbox = ( roles, handler ) => {
    let inbox = (item) => {
        handler(item)
    }
    inboxes.push(inbox)
}

let createOutbox = ( roles, hosts ) => {
    let routing = routing(roles, hosts)
    return (item) => {
        if(isLocal(item, routing)) {
            localDelivery(item, routing)
        }
        if(isRemote(item, routing)) {
            remoteDelivery(item, routing)
        }
    }
}

module.exports = {
    inbox: createInbox,
    outbox: createOutbox
}
