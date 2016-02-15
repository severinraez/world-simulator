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
