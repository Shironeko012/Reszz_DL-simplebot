const validator = require("../utils/validator")

const linkCache = new Map()
const messageCache = new Set()
const groupCooldown = new Map()

const LINK_TTL = 1000 * 60 * 5
const GROUP_COOLDOWN = 1000 * 30

function cleanup(){

const now = Date.now()

for(const [key,time] of linkCache){

if(now-time > LINK_TTL){

linkCache.delete(key)

}

}

}

setInterval(cleanup,60000)

module.exports = {

name:"autodetect",

async execute({sock,msg,text}){

const jid = msg.key.remoteJid

const url = validator.extractURL(text)

if(!url) return
if(!validator.isValidURL(url)) return
if(!validator.isVideoURL(url)) return


// prevent duplicate message
const msgId = msg.key.id

if(messageCache.has(msgId)) return

messageCache.add(msgId)

setTimeout(()=>{
messageCache.delete(msgId)
},60000)


const now = Date.now()

const cacheKey = jid+":"+url

if(linkCache.has(cacheKey)) return


if(groupCooldown.has(jid)){

if(now-groupCooldown.get(jid) < GROUP_COOLDOWN){

return

}

}

linkCache.set(cacheKey,now)
groupCooldown.set(jid,now)


const reply =
`Link video terdeteksi.

Gunakan command berikut:

.dl ${url} Video

atau

.mp3 ${url} Audio`


await sock.sendMessage(jid,{
text:reply
})

}

}
