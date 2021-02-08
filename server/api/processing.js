const router = require('express').Router()
const {spawn} = require('child_process')
const {ScraperAPI} = require('proxycrawl')
const api = new ScraperAPI({token: 'Zitr2UjB94g3VuNVuNOgZw'})
const axios = require('axios')
const {domain} = require('process')
const {Article} = require('../db/models')

module.exports = router

// Google ML route
router.get('/predict', async (req, res, next) => {
  try {
    const projectId = 'fakenews-303120'
    const location = 'us-central1'
    const modelId = 'TCN5494508093624549376'
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
      console.log('Pipe data from python script ...')
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

// web scraping - Cheerio
router.get('/scrape', (req, res) => {
  let url = req.query.url
  api.get(url).then(response => {
    // console.log("SCRAPER HERE -->", response.json)
    if (response.statusCode === 200) {
      let data = {
        content: response.json.body.content,
        title: response.json.body.title
      }
      // console.log(response.json.body.content)
      res.send(data)
    }
  })
})

// News API
// Python script to preprocess aka remove filler words/characters from text body
router.get('/related-articles', async (req, res, next) => {
  const keywords = req.query.keywords.join(' ')
  let url =
    'http://newsapi.org/v2/everything?' +
    `q=${keywords}&` +
    'from=2021-01-08&' +
    'sortBy=relevance&' +
    'pageSize=100&' +
    'apiKey=c34cbe9c82224dd9b6aebcc8266348d2'

  try {
    const response = await axios.get(url)
    let {articles} = response.data

    let ans = []
    let domains = []
    articles.forEach(article => {
      if (!domains.includes(article.source.name)) {
        ans.push(article)
        domains.push(article.source.name)
      }
    })
    res.json(ans)
  } catch (error) {
    next(error)
  }
})

// // Web Search (contextual) API
// // Python script to preprocess aka remove filler words/characters from text body
// router.get('/related-articles-news', async (req, res, next) => {
//   const keywords = req.query.keywords.join(' ')
//   const options = {
//     method: 'GET',
//     url:
//       'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI',
//     params: {
//       q: keywords,
//       pageNumber: '1',
//       pageSize: '50',
//       autoCorrect: 'true',
//       fromPublishedDate: 'null',
//       toPublishedDate: 'null'
//     },
//     headers: {
//       'x-rapidapi-key': '9d408c82f7msh3dc0cdcca9d8571p1a2f26jsn95d0bdac7160',
//       'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
//     }
//   }

//   try {
//     const response = await axios(options)
//     const articles = response.data.value

//     res.json(articles.slice(0, 10))
//   } catch(err) {
//     next(err)
//   }
// })

// Posting new articles to database
router.post('/scrape', async (req, res, next) => {
  try {
    const createdArticle = await Article.create(req.body)
    if (createdArticle) {
      res.send(createdArticle)
    }
  } catch (error) {
    next(error)
  }
})
