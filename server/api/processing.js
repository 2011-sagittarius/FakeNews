const router = require('express').Router()
const {spawn} = require('child_process')
const {ScraperAPI} = require('proxycrawl')
const api = new ScraperAPI({token: 'Ua7U7QOgMR1goTyJ-tGEGQ'})
const axios = require('axios')
const {Article} = require('../db/models')
const metascraper = require('metascraper')([require('metascraper-publisher')()])
const got = require('got')
const {Op} = require('sequelize')

module.exports = router

const lastMonth = () => {
  var current = new Date() //'Mar 11 2015' current.getTime() = 1426060964567
  var prevMonth = new Date(current.getTime() - 28 * 86400000) // + 1 day in ms
  let date = prevMonth.toLocaleDateString().split('/')
  date[0] = ('0' + date[0]).slice(-2)
  date.unshift(date.pop())
  date = date.join('-')
  return date
}

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
      // console.log(`Predicted class name: ${annotationPayload.displayName}`)
      // console.log(
      //   `Predicted class score: ${annotationPayload.classification.score}`
      // )
      // console.log(response.payload)
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
      // console.log('Pipe data from python script ...')
      dataToSend = data.toString()
    })
    // in close event we are sure that stream from child process is closed
    python.on('close', code => {
      // console.log(`child process close all stdio with code ${code}`)
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
    if (response.statusCode === 200) {
      let data = {
        content: response.json.body.content,
        title: response.json.body.title
      }
      res.send(data)
    }
  })
})

// // News API
// // Python script to preprocess aka remove filler words/characters from text body
// router.get('/related-articles', async (req, res, next) => {
//   const keywords = req.query.keywords.join(' ')
//   let url =
//     'http://newsapi.org/v2/everything?' +
//     `q=${keywords}&` +
//     `from=${lastMonth()}&` +
//     'sortBy=relevance&' +
//     'pageSize=100&' +
//     'apiKey=c34cbe9c82224dd9b6aebcc8266348d2'

//   try {
//     const response = await axios.get(url)
//     let {articles} = response.data

//     let ans = []
//     let domains = []
//     articles.forEach(article => {
//       if (!domains.includes(article.source.name)) {
//         ans.push(article)
//         domains.push(article.source.name)
//       }
//     })
//     res.json(ans)
//   } catch (error) {
//     console.log('NEWS API FAILED')
//     next(error)
//   }
// })

//Get similar articles from DB
router.get('/similar-articles', async (req, res, next) => {
  try {
    let className = req.query.label[1]
    // console.log("HERE LABEL", req.query)
    const similarArticles = await Article.findAll({
      where: {
        [className]: {
          [Op.between]: [70, 100]
        }
      },
      order: [['createdAt', 'ASC']]
    })
    res.json(similarArticles)
  } catch (error) {
    next(error)
  }
})

// Web Search (contextual) API
// Python script to preprocess aka remove filler words/characters from text body
router.get('/related-articles', async (req, res, next) => {
  const keywords = req.query.keywords.join(' ')
  const options = {
    method: 'GET',
    url:
      'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI',
    params: {
      q: keywords,
      pageNumber: '1',
      pageSize: '50',
      autoCorrect: 'true',
      fromPublishedDate: 'null',
      toPublishedDate: 'null'
    },
    headers: {
      'x-rapidapi-key': '9d408c82f7msh3dc0cdcca9d8571p1a2f26jsn95d0bdac7160',
      'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
    }
  }

  try {
    const response = await axios(options)
    const articles = response.data.value

    res.json(articles.slice(0, 10))
  } catch (err) {
    next(err)
  }
})

// Posting new articles to database
router.post('/scrape', async (req, res, next) => {
  try {
    const createdArticle = await Article.create(req.body)
    if (createdArticle) {
      res.send(createdArticle)
    }
  } catch (err) {
    next(err)
  }
})

// Web scrape publisher from article
router.get('/scrape/meta', async (req, res, next) => {
  try {
    let {targetUrl} = req.query
    const {body: html, url} = await got(targetUrl)
    const metadata = await metascraper({html, url})
    res.json(metadata)
  } catch (err) {
    next(err)
  }
})
