const os = require("os")
const ytWorker = require("./ytWorker")
const logger = require("../utils/logger")

const CPU = os.cpus().length
const MAX_WORKERS = Math.max(2, Math.floor(CPU / 2))

let activeWorkers = 0

const queue = []
const activeJobs = new Map()

function runNext(){

if(queue.length === 0) return
if(activeWorkers >= MAX_WORKERS) return

const job = queue.shift()

activeWorkers++

activeJobs.set(job.url,true)

execute(job)

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

if(activeJobs.has(job.url)){

reject(new Error("Download already running"))
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