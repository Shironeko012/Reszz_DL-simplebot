const os = require("os")
const ytWorker = require("./ytWorker")
const logger = require("../utils/logger")

const CPU = os.cpus().length

// Railway biasanya hanya punya 1–2 core
const MAX_WORKERS = Math.max(1, Math.floor(CPU / 2))

let activeWorkers = 0

const queue = []

// download yang sedang berjalan
const activeJobs = new Set()

// index queue untuk mencegah duplicate
const queueIndex = new Set()


function runNext(){

while(queue.length > 0 && activeWorkers < MAX_WORKERS){

const job = queue.shift()

queueIndex.delete(job.url)

activeWorkers++

activeJobs.add(job.url)

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

// sedang didownload
if(activeJobs.has(job.url)){

logger.info(`Duplicate blocked (active): ${job.url}`)

reject(new Error("Download already running"))

return

}

// sudah ada di queue
if(queueIndex.has(job.url)){

logger.info(`Duplicate blocked (queue): ${job.url}`)

reject(new Error("Already in queue"))

return

}

// lock url agar tidak masuk dua kali
queueIndex.add(job.url)

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
