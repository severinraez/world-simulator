'use strict'
/*

 The Postman delivers work messages.

 */

class Postman {

    // localRoles - array of role names where delivery should be done locally
    constructor(localRoles) {
        this.localRoles = localRoles

        this.outboundCallback = null
        this.inboxCallback = null
    }

    // Deliver a message from the outside world.
    inbound(message) {
        this.verify(messsage)

        if(this._isLocalRole(message.role)) {
            this.inboxCallback(message) }
        else {
            throw "I am not a " + message.role }
    }

    // Set a callback that will receive messages to the outside world.
    outbound(callback) { this.outboundCallback = callback }

    // Set a callback that will receive local messages.
    inbox(callback) { this.inboxCallback = callback }

    // Deliver a message with local origin.
    outbox(message) {
        this.verify(message)

        if(this._isLocalRole(message.role)) {
            this.inboxCallback(message) }
        else {
            this.outboundCallback(message) }
    }

    _verify(message) {
        if(!message.role || !message.data) {
            throw "unknown message format" }
    }

    _isLocalRole(role) {
        return this.localRoles.indexOf(role) != -1
    }
}

module.exports = Postman
