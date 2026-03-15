const validator = require("../utils/validator")

const linkCache = new Map()
const groupCooldown = new Map()

const LINK_TTL = 1000 * 60 * 5
const GROUP_COOLDOWN = 1000 * 30

function cleanup(){

const now = Date.now()

for(const [link,time] of linkCache){

if(now-time > LINK_TTL){

linkCache.delete(link)

}

}

}

setInterval(cleanup,60000)

module.exports = {

name:"autodetect",

async execute({sock,msg,text}){

const jid = msg.key.remoteJid

const sender = msg.key.participant || jid

const url = validator.extractURL(text)

if(!url) return

if(!validator.isValidURL(url)) return

if(!validator.isVideoURL(url)) return


const now = Date.now()

// prevent same link spam
if(linkCache.has(url)){

return

}


// group cooldown
if(groupCooldown.has(jid)){

if(now - groupCooldown.get(jid) < GROUP_COOLDOWN){

return

}

}


linkCache.set(url,now)
groupCooldown.set(jid,now)


const reply =
`Link video terdeteksi.

Gunakan command berikut untuk download:

.dl ${url} video 

atau

.mp3 ${url} audio`

await sock.sendMessage(jid,{
text:reply
})

}

}