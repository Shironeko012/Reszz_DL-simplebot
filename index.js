const crypto = require("crypto")
if (!global.crypto) global.crypto = crypto.webcrypto

const express = require("express")
const fs = require("fs-extra")
const path = require("path")

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const qrcodeTerminal = require("qrcode-terminal")
const QRCode = require("qrcode")
const pino = require("pino")

const config = require("./config")
const eventHandler = require("./handlers/eventHandler")
const logger = require("./utils/logger")

const app = express()

const isRailway = !!process.env.RAILWAY_ENVIRONMENT
const isTermux = process.platform === "android"

/*
=====================
WEB STATUS SERVER
=====================
*/

app.get("/", (req,res)=>{
res.send("WA DOWNLOADER BOT ONLINE")
})

app.get("/qr",(req,res)=>{

const qrPath = path.join(__dirname,"qr.png")

if(!fs.existsSync(qrPath)){
return res.send("QR not generated yet")
}

res.sendFile(qrPath)

})

const PORT = process.env.PORT || 3000

if(isRailway || !isTermux){

app.listen(PORT,()=>{
console.log("Web server running on port",PORT)
})

}

/*
=====================
START BOT
=====================
*/

async function startBot(){

try{

logger.info("Starting WhatsApp Bot")

const { state, saveCreds } =
await useMultiFileAuthState(config.SESSION_DIR)

const { version } =
await fetchLatestBaileysVersion()

const sock = makeWASocket({

version,
auth: state,

logger: pino({ level:"silent" }),

browser:["Downloader","Bot","Node"],

markOnlineOnConnect:true

})

/*
SAVE SESSION
*/

sock.ev.on("creds.update", saveCreds)

/*
CONNECTION STATUS
*/

sock.ev.on("connection.update", async(update)=>{

const { connection, lastDisconnect, qr } = update

if(qr){

console.log("QR RECEIVED")

qrcodeTerminal.generate(qr,{small:false})

try{
await QRCode.toFile("./qr.png",qr)
}catch{}

if(process.env.RAILWAY_STATIC_URL){

console.log(
process.env.RAILWAY_STATIC_URL + "/qr"
)

}

}

if(connection === "open"){

logger.info("Bot connected")

}

if(connection === "close"){

const reason =
lastDisconnect?.error?.output?.statusCode

logger.error("Connection closed")

if(reason !== DisconnectReason.loggedOut){

setTimeout(startBot,5000)

}

}

})

/*
MESSAGE HANDLER
*/

sock.ev.on("messages.upsert", async({messages})=>{

try{

const msg = messages?.[0]

if(!msg) return
if(!msg.message) return

if(msg.key?.remoteJid === "status@broadcast")
return

await eventHandler(sock,msg)

}catch(e){

logger.error("Message handler error")

}

})

}catch(err){

logger.error("Bot crashed")

setTimeout(startBot,5000)

}

}

/*
=====================
AUTO CLEANUP TEMP
=====================
*/

function startCleanup(){

const interval = config.CLEANUP_INTERVAL || 7200000

setInterval(()=>{

try{

if(!fs.existsSync(config.TEMP_DIR)) return

const files = fs.readdirSync(config.TEMP_DIR)

if(files.length === 0) return

for(const file of files){

try{
fs.unlinkSync(path.join(config.TEMP_DIR,file))
}catch{}

}

logger.info("Temp cleaned")

}catch(err){

logger.error("Cleanup error")

}

}, interval)

}


/*
=====================
INIT SYSTEM
=====================
*/

async function init(){

await fs.ensureDir(config.TEMP_DIR)
await fs.ensureDir(config.LOG_DIR)
await fs.ensureDir(config.SESSION_DIR)

startCleanup()
startBot()

}

init()
