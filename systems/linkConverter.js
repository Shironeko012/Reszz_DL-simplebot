const { URL } = require("url")

/*
Remove tracking parameters
*/
function cleanParams(u){

const allowed = ["v"]

const params = []

u.searchParams.forEach((value,key)=>{

if(allowed.includes(key)){
params.push([key,value])
}

})

u.search = ""

for(const [k,v] of params){
u.searchParams.append(k,v)
}

return u

}


/*
YOUTUBE
support:
youtu.be
shorts
watch
*/
function normalizeYouTube(u){

if(u.hostname === "youtu.be"){

const id = u.pathname.replace("/","")
return `https://www.youtube.com/watch?v=${id}`

}

if(u.hostname.includes("youtube.com")){

// watch?v=
const id = u.searchParams.get("v")
if(id) return `https://www.youtube.com/watch?v=${id}`


// shorts
if(u.pathname.includes("/shorts/")){

const id = u.pathname.split("/shorts/")[1].split("/")[0]
return `https://www.youtube.com/watch?v=${id}`

}

}

return u.toString()

}


/*
TIKTOK
support:
vt.tiktok
vm.tiktok
video
*/
function normalizeTikTok(u){

if(
u.hostname === "vm.tiktok.com" ||
u.hostname === "vt.tiktok.com"
){

return u.toString()

}

if(u.hostname.includes("tiktok.com")){

const parts = u.pathname.split("/")

const index = parts.indexOf("video")

if(index !== -1){

const id = parts[index+1]

return `https://www.tiktok.com/@user/video/${id}`

}

}

return u.toString()

}


/*
TWITTER / X
*/
function normalizeTwitter(u){

if(u.hostname === "x.com"){
u.hostname = "twitter.com"
}

if(u.hostname.includes("twitter.com")){

const parts = u.pathname.split("/")

const statusIndex = parts.indexOf("status")

if(statusIndex !== -1){

const id = parts[statusIndex+1]

return `https://twitter.com/i/status/${id}`

}

}

return u.toString()

}


/*
INSTAGRAM
support:
reel
p
tv
*/
function normalizeInstagram(u){

if(!u.hostname.includes("instagram.com")) return u.toString()

const parts = u.pathname.split("/")

if(parts.includes("reel")){
return `https://www.instagram.com/reel/${parts[2]}/`
}

if(parts.includes("p")){
return `https://www.instagram.com/p/${parts[2]}/`
}

if(parts.includes("tv")){
return `https://www.instagram.com/tv/${parts[2]}/`
}

return u.toString()

}


/*
FACEBOOK
*/
function normalizeFacebook(u){

if(u.hostname === "fb.watch"){
return u.toString()
}

if(u.hostname.includes("facebook.com")){
return u.toString()
}

return u.toString()

}


/*
PINTEREST
*/
function normalizePinterest(u){

if(
u.hostname.includes("pin.it") ||
u.hostname.includes("pinterest.com")
){
return u.toString()
}

return u.toString()

}


/*
BILIBILI
*/
function normalizeBilibili(u){

if(
u.hostname.includes("bilibili.com") ||
u.hostname === "b23.tv"
){
return u.toString()
}

return u.toString()

}



/*
MAIN CONVERTER
*/
async function convert(link){

try{

const u = new URL(link)

cleanParams(u)


if(u.hostname.includes("youtube") || u.hostname === "youtu.be"){
return normalizeYouTube(u)
}

if(
u.hostname.includes("tiktok") ||
u.hostname === "vm.tiktok.com" ||
u.hostname === "vt.tiktok.com"
){
return normalizeTikTok(u)
}

if(
u.hostname.includes("twitter") ||
u.hostname === "x.com"
){
return normalizeTwitter(u)
}

if(u.hostname.includes("instagram")){
return normalizeInstagram(u)
}

if(
u.hostname.includes("facebook") ||
u.hostname === "fb.watch"
){
return normalizeFacebook(u)
}

if(
u.hostname.includes("pinterest") ||
u.hostname.includes("pin.it")
){
return normalizePinterest(u)
}

if(
u.hostname.includes("bilibili") ||
u.hostname === "b23.tv"
){
return normalizeBilibili(u)
}

return u.toString()

}catch{

return link

}

}


module.exports = {
convert
  }
