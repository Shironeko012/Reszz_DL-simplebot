const config = require("../config")

const userMap = new Map()

const ACTIVE_USERS = new Set()

const WINDOW = 1000 * 10
const MAX_REQ = 5
const USER_LIMIT = 30

function cleanup(){

const now = Date.now()

for(const [id,data] of userMap){

if(now - data.last > WINDOW){

userMap.delete(id)

}

}

}

setInterval(cleanup, WINDOW)

function rateLimiter(sender){

const now = Date.now()

if(!ACTIVE_USERS.has(sender)){

if(ACTIVE_USERS.size >= USER_LIMIT){

return false

}

ACTIVE_USERS.add(sender)

}

if(!userMap.has(sender)){

userMap.set(sender,{
count:1,
last:now
})

return true

}

const data = userMap.get(sender)

if(now - data.last > WINDOW){

data.count = 1
data.last = now

return true

}

data.count++

if(data.count > MAX_REQ){

return false

}

data.last = now

return true

}

module.exports = rateLimiter