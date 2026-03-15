const os = require("os")
const ytWorker = require("./ytWorker")
const logger = require("../utils/logger")

const CPU = os.cpus().length

// Railway biasanya hanya punya 1-2 core
const MAX_WORKERS = Math.max(1, Math.floor(CPU / 2))

let activeWorkers = 0

const queue = []
const activeJobs = new Map()

function runNext(){

while(queue.length > 0 && activeWorkers < MAX_WORKERS){

const job = queue.shift()

activeWorkers++

activeJobs.set(job.url,true)

execute(job)

}

}

async function execute(job){

try{

const file = await ytWorker.download(job)

job.resolve(file)

}catch(e){

job.reject(e)

}finally{

activeWorkers--

activeJobs.delete(job.url)

setImmediate(runNext)

}

}

function add(job){

return new Promise((resolve,reject)=>{

// cek apakah sedang download
if(activeJobs.has(job.url)){

reject(new Error("Download already running"))
return

}

// cek apakah sudah ada di queue
const exists = queue.find(q => q.url === job.url)

if(exists){

reject(new Error("Already in queue"))
return

}

queue.push({

...job,
resolve,
reject

})

logger.info(`Queue add ${job.url}`)

runNext()

})

}

function stats(){

return {

workers: activeWorkers,
maxWorkers: MAX_WORKERS,
queueLength: queue.length,
activeDownloads: activeJobs.size

}

}

module.exports = {

add,
stats

}
