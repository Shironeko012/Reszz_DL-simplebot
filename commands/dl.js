const workerPool = require("../workers/workerPool")
const validator = require("../utils/validator")
const progressBar = require("../utils/progressBar")
const linkConverter = require("../systems/linkConverter")
const fs = require("fs")

module.exports = {

name:"dl",

async execute({sock,msg,args}){

const jid = msg.key.remoteJid
const url = args[0]

if(!url){

await sock.sendMessage(jid,{text:"Send link"})
return

}

if(!validator.isValidURL(url)){

await sock.sendMessage(jid,{text:"Invalid link"})
return

}

const fixedURL = await linkConverter.convert(url)

const stats = workerPool.stats()

const progressMsg = await sock.sendMessage(jid,{
text:`Video queued

Queue: ${stats.queueLength}
Workers: ${stats.workers}/${stats.maxWorkers}`
})

let last = 0
let lastEdit = 0

try{

const file = await workerPool.add({

url:fixedURL,
type:"mp4",

progress: async(percent,size)=>{

const now = Date.now()

if(percent-last < 7) return
if(now-lastEdit < 3000) return

last = percent
lastEdit = now

await sock.sendMessage(jid,{
text:progressBar(percent,size),
edit:progressMsg.key
})

}

})

await sock.sendMessage(jid,{
video:{url:file},
mimetype:"video/mp4"
})

try{ fs.unlinkSync(file) }catch{}

}catch{

await sock.sendMessage(jid,{text:"Video download failed"})

}

}

}
