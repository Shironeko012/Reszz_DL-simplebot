function antiCrash(msg){

try{

if(!msg) return false

if(!msg.key) return false

if(msg.key.fromMe) return false

if(!msg.message) return false


// block status broadcast
if(msg.key.remoteJid === "status@broadcast") return false


// protect oversized payload
const raw = JSON.stringify(msg)

if(raw.length > 50000){

return false

}


// detect empty message structures
const m = msg.message

if(
!m.conversation &&
!m.extendedTextMessage &&
!m.imageMessage &&
!m.videoMessage &&
!m.documentMessage &&
!m.audioMessage
){

return false

}


// block malformed message object
if(typeof m !== "object"){

return false

}


return true

}catch{

return false

}

}

module.exports = antiCrash