var current = new Date() //'Mar 11 2015' current.getTime() = 1426060964567
var lastMonth = new Date(current.getTime() - 28 * 86400000) // + 1 day in ms
let date = lastMonth.toLocaleDateString().split('/')
date[0] = ('0' + date[0]).slice(-2)
date.unshift(date.pop())
date = date.join('-')
console.log(date)
