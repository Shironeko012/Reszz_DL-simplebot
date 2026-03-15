const workerPool = require("../workers/workerPool")
const validator = require("../utils/validator")
const progressBar = require("../utils/progressBar")
const linkConverter = require("../systems/linkConverter")
const fs = require("fs")

module.exports = {

name:"mp3",

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

const queue = workerPool.stats()

const progressMsg = await sock.sendMessage(jid,{
text:`Audio queued\nQueue: ${queue.queueLength}`
})

let last = 0

try{

const file = await workerPool.add({

url:fixedURL,
type:"mp3",

progress: async(percent,size)=>{

if(percent-last<8) return

last = percent

await sock.sendMessage(jid,{
text:progressBar(percent,size),
edit:progressMsg.key
})

}

})

await sock.sendMessage(jid,{
audio:{url:file},
mimetype:"audio/mpeg"
})

try{ fs.unlinkSync(file) }catch{}

}catch{

await sock.sendMessage(jid,{text:"Audio download failed"})

}

}

}