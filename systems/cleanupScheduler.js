const fs = require("fs")
const path = require("path")

const config = require("../config")
const logger = require("../utils/logger")

const CLEAN_INTERVAL = 1000 * 60 * 60 * 2
const MAX_FILE_AGE = 1000 * 60 * 60 * 2

function cleanupFolder(folder){

try{

const files = fs.readdirSync(folder)

const now = Date.now()

for(const file of files){

const filePath = path.join(folder,file)

const stat = fs.statSync(filePath)

if(!stat.isFile()) continue

const age = now - stat.mtimeMs

if(age > MAX_FILE_AGE){

try{

fs.unlinkSync(filePath)

logger.info(`Cleanup removed ${filePath}`)

}catch(e){

logger.error(`Cleanup failed ${filePath}`)

}

}

}

}catch(e){

logger.error("Cleanup folder error "+folder)

}

}

function startCleanup(){

setInterval(()=>{

cleanupFolder(config.TEMP_DIR)

cleanupFolder(config.LOG_DIR)

}, CLEAN_INTERVAL)

logger.info("Cleanup scheduler started")

}

module.exports = {

startCleanup

}