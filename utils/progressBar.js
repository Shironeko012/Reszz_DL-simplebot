function format(percent, size){

if(!percent) percent = 0

const p = percent.toFixed(1)

if(size){

return `${p}% (${size})`

}

return `${p}%`

}

module.exports = format