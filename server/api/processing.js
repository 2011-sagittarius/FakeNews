const router = require('express').Router()
const {spawn} = require('child_process')
const request = require('request')
const extractor = require('unfluff')

module.exports = router

// Google ML route
router.get('/predict', async (req, res, next) => {
  try {
    const projectId = 'fakenews-303120'
    const location = 'us-central1'
    const modelId = 'TCN3651409946123173888'
    const content = req.query.text

    // Imports the Google Cloud AutoML library
    const {PredictionServiceClient} = require('@google-cloud/automl').v1

    // Instantiates a client
    const client = new PredictionServiceClient({
      keyFilename: 'google-creds.json',
      projectId: 'fakenews-303120'
    })
    // Construct request
    const request = {
      name: client.modelPath(projectId, location, modelId),
      payload: {
        textSnippet: {
          content: content,
          mimeType: 'text/plain' // Types: 'test/plain', 'text/html'
        }
      }
    }

    const [response] = await client.predict(request)

    for (const annotationPayload of response.payload) {
      console.log(`Predicted class name: ${annotationPayload.displayName}`)
      console.log(
        `Predicted class score: ${annotationPayload.classification.score}`
      )
      console.log(response.payload)
    }
    res.json(response.payload)
  } catch (err) {
    next(err)
  }
})

// Python script to preprocess aka remove filler words/characters from text body
router.get('/preprocess', (req, res, next) => {
  try {
    let dataToSend
    // console.log('req.query > ', req.query.text)
    // spawn new child process to call the python script
    const python = spawn('python3', ['./python/PreProcess.py', req.query.text])

    // collect data from script
    python.stdout.on('data', function(data) {
      console.log('Pipe data from python script ...')
      dataToSend = data.toString()
    })
    // in close event we are sure that stream from child process is closed
    python.on('close', code => {
      console.log(`child process close all stdio with code ${code}`)
      // send data to browser
      res.send(dataToSend)
      console.log(dataToSend)
    })
  } catch (err) {
    next(err)
  }
})

// web scraping - Cheerio
router.get('/scrape', function(req, res) {
  let url = req.query.url

  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      // const $ = cheerio.load(html)
      let data = extractor(html, 'en')
      data = data.text.replace(/\r?\n|\r/g, ' ')
      // let output = []

      // NPR Format
      // $('.storytext p').each(function(i, el) {
      // APN Format
      // $('.Article p').each(function(i, el) {
      //   const item = $(el)
      //     // .find('.Component-root-0-2-171 Component-p-0-2-162')
      //     .text()

      //   // console.log(item);

      //   // Write Row to CSV
      //   writeStream.write(`${item}`)
      //   output.push(item)
      // })
      // console.log('Scraping completed...')
      // res.send(output.join('\n\n'))
      // console.log('DATA HERE', data)
      // console.log('HTML HERE', html)
      res.send(data)
    }
  })
})
