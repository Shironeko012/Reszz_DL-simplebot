const { URL } = require("url")

function cleanParams(u){

const keep = []

u.searchParams.forEach((v,k)=>{

if(k.startsWith("v")) keep.push([k,v])

})

u.search = ""

for(const [k,v] of keep){

u.searchParams.append(k,v)

}

return u

}

function normalizeYouTube(u){

if(u.hostname === "youtu.be"){

const id = u.pathname.replace("/","")

return `https://www.youtube.com/watch?v=${id}`

}

if(u.hostname.includes("youtube.com")){

const id = u.searchParams.get("v")

if(id) return `https://www.youtube.com/watch?v=${id}`

}

return u.toString()

}

function normalizeTikTok(u){

if(u.hostname === "vm.tiktok.com" || u.hostname === "vt.tiktok.com"){

return u.toString()

}

if(u.hostname.includes("tiktok.com")){

const parts = u.pathname.split("/")

const videoIndex = parts.indexOf("video")

if(videoIndex !== -1){

const id = parts[videoIndex+1]

return `https://www.tiktok.com/@user/video/${id}`

}

}

return u.toString()

}

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

function normalizeInstagram(u){

if(u.hostname.includes("instagram.com")){

const parts = u.pathname.split("/")

if(parts.includes("reel")){

return `https://www.instagram.com/reel/${parts[2]}/`

}

if(parts.includes("p")){

return `https://www.instagram.com/p/${parts[2]}/`

}

}

return u.toString()

}

function normalizeFacebook(u){

if(u.hostname.includes("facebook.com")){

return u.toString()

}

if(u.hostname === "fb.watch"){

return u.toString()

}

return u.toString()

}

function normalizePinterest(u){

if(u.hostname.includes("pin.it")){

return u.toString()

}

if(u.hostname.includes("pinterest.com")){

return u.toString()

}

return u.toString()

}

function normalizeBilibili(u){

if(u.hostname.includes("bilibili.com")){

return u.toString()

}

if(u.hostname === "b23.tv"){

return u.toString()

}

return u.toString()

}

async function convert(link){

try{

const u = new URL(link)

cleanParams(u)

if(u.hostname.includes("youtube") || u.hostname === "youtu.be"){

return normalizeYouTube(u)

}

if(u.hostname.includes("tiktok")){

return normalizeTikTok(u)

}

if(u.hostname.includes("twitter") || u.hostname === "x.com"){

return normalizeTwitter(u)

}

if(u.hostname.includes("instagram")){

return normalizeInstagram(u)

}

if(u.hostname.includes("facebook") || u.hostname === "fb.watch"){

return normalizeFacebook(u)

}

if(u.hostname.includes("pinterest") || u.hostname.includes("pin.it")){

return normalizePinterest(u)

}

if(u.hostname.includes("bilibili") || u.hostname === "b23.tv"){

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