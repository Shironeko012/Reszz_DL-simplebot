const fs = require("fs")
const path = require("path")

const config = require("../config")

const LOG_DIR = config.LOG_DIR || "./logs"

if(!fs.existsSync(LOG_DIR)){
fs.mkdirSync(LOG_DIR,{recursive:true})
}

function getTimestamp(){

const now = new Date()

const y = now.getFullYear()
const m = String(now.getMonth()+1).padStart(2,"0")
const d = String(now.getDate()).padStart(2,"0")

const h = String(now.getHours()).padStart(2,"0")
const min = String(now.getMinutes()).padStart(2,"0")
const s = String(now.getSeconds()).padStart(2,"0")

return `${y}-${m}-${d} ${h}:${min}:${s}`

}

function getLogFile(){

const now = new Date()

const y = now.getFullYear()
const m = String(now.getMonth()+1).padStart(2,"0")
const d = String(now.getDate()).padStart(2,"0")

return path.join(LOG_DIR,`${y}-${m}-${d}.log`)

}

function write(level,message){

const time = getTimestamp()

const line = `[${time}] [${level}] ${message}`

console.log(line)

try{

fs.appendFileSync(getLogFile(),line+"\n")

}catch{}

}

function info(msg){

write("INFO",msg)

}

function warn(msg){

write("WARN",msg)

}

function error(msg){

write("ERROR",msg)

}

module.exports = {

info,
warn,
error

}