const messageHandler = require("./messageHandler")
const logger = require("../utils/logger")

module.exports = function(sock){

sock.ev.on("messages.upsert", async ({ messages, type }) => {

try{

if(type !== "notify") return

const msg = messages[0]

if(!msg) return

await messageHandler(sock, msg)

}catch(e){

logger.error("eventHandler error: " + e)

}

})

}