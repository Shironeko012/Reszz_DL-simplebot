
const { enqueueDownload } = require('../workers/ytWorker')
module.exports = {
 name:"playlist",
 async execute(ctx,url){
  if(!url) return ctx.reply("Send playlist link.")
  ctx.reply("Processing playlist...")
  enqueueDownload(url,"playlist",ctx)
 }
}
