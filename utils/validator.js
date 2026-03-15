const { URL } = require("url")

const supportedDomains = [

"youtube.com",
"youtu.be",

"tiktok.com",
"vm.tiktok.com",
"vt.tiktok.com",

"instagram.com",

"facebook.com",
"fb.watch",

"pinterest.com",
"pin.it",

"bilibili.com",
"b23.tv",

"twitter.com",
"x.com",

"threads.net"

]

function isValidURL(text){

try{

const url = new URL(text)

return supportedDomains.some(domain =>
url.hostname === domain || url.hostname.endsWith("." + domain)
)

}catch{

return false

}

}

function extractURL(text){

const match = text.match(/https?:\/\/[^\s]+/)

if(!match) return null

return match[0]

}

function isVideoURL(link){

try{

const url = new URL(link)

const host = url.hostname

const path = url.pathname

// YouTube
if(host.includes("youtube") || host==="youtu.be"){

return path.includes("watch") || path.length>1

}

// TikTok
if(host.includes("tiktok")){

return path.includes("/video/") || host.includes("vm.")

}

// Instagram
if(host.includes("instagram")){

return path.includes("/reel/") || path.includes("/p/")

}

// Facebook
if(host.includes("facebook") || host==="fb.watch"){

return true

}

// Pinterest
if(host.includes("pinterest") || host.includes("pin.it")){

return true

}

// Bilibili
if(host.includes("bilibili") || host==="b23.tv"){

return true

}

// Twitter/X
if(host.includes("twitter") || host==="x.com"){

return path.includes("/status/")

}

// Threads
if(host.includes("threads.net")){

return true

}

return false

}catch{

return false

}

}

module.exports = {

isValidURL,
extractURL,
isVideoURL

}