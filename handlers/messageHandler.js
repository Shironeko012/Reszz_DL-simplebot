const config = require("../config")

const logger = require("../utils/logger")

const antiCrash = require("../systems/antiCrash")

const rateLimiter = require("../systems/rateLimiter")

const validator = require("../utils/validator")

const commandHandler = require("./commandHandler")

const autoDetect = require("../commands/autoDetect")

module.exports = async function(sock, msg){

try{

if(!antiCrash(msg)) return

const jid = msg.key.remoteJid

const sender = msg.key.participant || jid

if(!rateLimiter(sender)) return

const text =
msg.message?.conversation ||
msg.message?.extendedTextMessage?.text ||
msg.message?.imageMessage?.caption ||
msg.message?.videoMessage?.caption ||
""

if(!text) return

// COMMAND PREFIX
if(text.startsWith(config.PREFIX)){

await commandHandler(sock, msg, text)

return

}

// AUTO LINK DETECT
if(validator.isValidURL(text)){

await autoDetect.execute({
sock,
msg,
text
})

}

}catch(e){

logger.error("messageHandler error: " + e)

}

}