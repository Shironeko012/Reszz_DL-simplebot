const config = require("../config")

module.exports = {

name: "help",

async execute({ sock, msg }){

const text = `
DOWNLOADER BOT by Reszz

Commands:

${config.PREFIX}dl <link>
Download video

${config.PREFIX}mp3 <link>
Download audio

Supported platforms:
YouTube
TikTok
Instagram
Facebook
Pinterest
Bilibili
Threads
Twitter/X
`

await sock.sendMessage(
msg.key.remoteJid,
{ text }
)

}

}