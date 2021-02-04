const router = require('express').Router()
const {User} = require('../db/models')
const {spawn} = require('child_process')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const projectId = 'fakenews-303120'
    const location = 'us-central1'
    const modelId = 'TCN3651409946123173888'
    const content = 'text to predict'

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
    res.send('Analysis Complete!')
  } catch (err) {
    next(err)
  }
})

router.get('/python', (req, res, next) => {
  try {
    let dataToSend
    // spawn new child process to call the python script
    const python = spawn('python', ['./server/api/script1.py'])
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
