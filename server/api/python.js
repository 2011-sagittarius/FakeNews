const router = require('express').Router()
const {spawn} = require('child_process')

module.exports = router

// Python script to scrape the user's news article
router.get('/scrape', async (req, res, next) => {
  try {
    let dataToSend
    // spawn new child process to call the python script
    const python = await spawn('python3', ['./python/Scrape.py', req.query.url])

    // collect data from script
    python.stdout.on('data', function(data) {
      // console.log('Pipe data from python script ...')
      dataToSend = data.toString()
    })
    // in close event we are sure that stream from child process is closed
    python.on('close', code => {
      console.log(`child process close all stdio with code ${code}`)
      // send data to browser
      const ans = JSON.parse(dataToSend)
      res.send(ans)
    })
  } catch (err) {
    next(err)
  }
})

// Python script to preprocess aka remove filler words/characters from text body
router.get('/preprocess', async (req, res, next) => {
  try {
    let dataToSend
    // spawn new child process to call the python script
    const python = await spawn('python3', [
      './python/KeywordExtraction.py',
      req.query.text
    ])

    // collect data from script
    python.stdout.on('data', function(data) {
      // console.log('Pipe data from python script ...')
      dataToSend = data.toString()
    })
    // in close event we are sure that stream from child process is closed
    python.on('close', code => {
      console.log(`child process close all stdio with code ${code}`)
      // send data to browser
      res.send(dataToSend)
    })
  } catch (err) {
    next(err)
  }
})
