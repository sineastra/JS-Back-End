const events = require("events")

const publisher = new events.EventEmitter()

publisher.on("ping", firstHandler)
publisher.on("ping", secondHandler)
publisher.on("pong", thirdHandler)

function firstHandler(msg) {
    console.log(`first ${msg}`)
}

function secondHandler(msg) {
    console.log(`second ${msg.length}`)
}

function thirdHandler(a, b) {
    console.log(a + b)
}

console.log("before")

publisher.emit("ping", "Hello world!")
publisher.emit("ping", "Hello again!")

console.log("after")

publisher.emit("pong", 5, 8)
