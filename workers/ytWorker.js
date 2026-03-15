const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")

const config = require("../config")
const logger = require("../utils/logger")

const MAX_RETRY = 2
const PROCESS_TIMEOUT = 1000 * 60 * 10

function spawnYTDLP(args){

let cmd = "yt-dlp"

if(process.platform === "android"){
cmd = "yt-dlp"
}

return spawn(cmd,args)

}

function parseProgress(text){

const percentMatch = text.match(/(\d{1,3}\.\d)%/)
const sizeMatch = text.match(/of\s+([0-9.]+[KMG]i?B)/i)

return {
percent: percentMatch ? parseFloat(percentMatch[1]) : null,
size: sizeMatch ? sizeMatch[1].replace("iB","B") : null
}

}

function buildArgs(job, output){

if(job.type === "mp3"){

return [

"--newline",
"--no-playlist",
"--no-part",
"--no-mtime",

"-x",
"--audio-format","mp3",

"-o",output,

job.url

]

}

return [

"--newline",
"--no-playlist",
"--no-part",
"--no-mtime",

"-f","mp4",

"-o",output,

job.url

]

}

async function runProcess(args,job){

return new Promise((resolve,reject)=>{

let lastProgress = 0

const yt = spawnYTDLP(args)

const timeout = setTimeout(()=>{

try{
yt.kill("SIGKILL")
}catch{}

reject(new Error("Download timeout"))

},PROCESS_TIMEOUT)

yt.stderr.on("data",(data)=>{

const text = data.toString()

const progress = parseProgress(text)

if(progress.percent && job.progress){

if(progress.percent - lastProgress >= 5){

lastProgress = progress.percent

job.progress(progress.percent,progress.size)

}

}

})

yt.on("error",(err)=>{
clearTimeout(timeout)
reject(err)
})

yt.on("close",(code)=>{

clearTimeout(timeout)

if(code !== 0){
reject(new Error("yt-dlp exit "+code))
}else{
resolve()
}

})

})

}

async function verify(file){

try{

if(!fs.existsSync(file)) return false

const stat = fs.statSync(file)

if(stat.size < 10000) return false

return true

}catch{
return false
}

}

async function attempt(job,attempt){

const ext = job.type==="mp3"?"mp3":"mp4"

const name = Date.now()+"-"+Math.floor(Math.random()*9999)

const file = path.join(config.TEMP_DIR,`${name}.${ext}`)

const args = buildArgs(job,file)

logger.info(`Download start (${attempt}) ${job.url}`)

await runProcess(args,job)

const ok = await verify(file)

if(!ok){
throw new Error("Invalid output file")
}

logger.info(`Download finished ${file}`)

return file

}

async function download(job){

for(let i=0;i<=MAX_RETRY;i++){

try{
return await attempt(job,i+1)
}catch(e){

logger.error(`Attempt ${i+1} failed ${e}`)

if(i===MAX_RETRY) throw e

}

}

}

module.exports = { download }