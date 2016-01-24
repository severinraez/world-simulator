'use strict'

let create = (title, messageInterceptor) => {
    return (message, arg2) => {
	let composedMessage = title + ' - ' + messageInterceptor(message)
	if(arg2) {
	    console.log(composedMessage, arg2) }
	else {
	    console.log(composedMessage)
	}

    }
}

module.exports = {
    create: create
}
