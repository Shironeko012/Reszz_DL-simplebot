const fs = require("fs")
const path = require("path")
const logger = require("../utils/logger")
const config = require("../config")

const commands = new Map()

// prevent duplicate command
const runningCommands = new Set()

function loadCommands(){

const dir = path.join(__dirname,"../commands")

const files = fs.readdirSync(dir)

for(const file of files){

if(!file.endsWith(".js")) continue

try{

const cmd = require(`../commands/${file}`)

if(!cmd.name || !cmd.execute){

logger.warn(`Invalid command: ${file}`)
continue

}

commands.set(cmd.name,cmd)

logger.info(`Loaded command: ${cmd.name}`)

}catch(e){

logger.error("Command load error: "+file)

}

}

}

loadCommands()

module.exports = async function(sock,msg,text){

try{

const id = msg.key.id

if(runningCommands.has(id)) return

runningCommands.add(id)

setTimeout(()=>{
runningCommands.delete(id)
},10000)


const args = text
.slice(config.PREFIX.length)
.trim()
.split(/\s+/)

const commandName = args.shift().toLowerCase()

const cmd = commands.get(commandName)

if(!cmd) return

await cmd.execute({
sock,
msg,
args
})

}catch(e){

logger.error("commandHandler error: "+e)

}

}
