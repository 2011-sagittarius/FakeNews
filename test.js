let obj = {fake: 0, real: 0.9, satire: 0.3}

let ans = Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b))

console.log(ans)
