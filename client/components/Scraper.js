import React, {Component} from 'react'
import axios from 'axios'
import _ from 'lodash'
import {
  Chart,
  RelatedArticles,
  SimilarArticles,
  Loading,
  Input,
  Landing,
  Fade,
  Response,
  FlexCol
} from '../components'
import Parallax from './LandingParallax'
import {connect} from 'react-redux'
import {createArticle} from '../store/article'
import './Scraper.css'

class Scraper extends Component {
  constructor() {
    super()
    this.state = {
      chartData: {},
      html: '',
      label: [],
      loaded: 'no',
      keywords: [],
      processed: '',
      publisher: '',
      relatedArticles: [],
      scores: [],
      title: '',
      url: 'Enter URL',
      window: window.innerWidth,
      hide: true
    }

    this.setUrl = this.setUrl.bind(this)
    this.sendUrl = this.sendUrl.bind(this)
    this.preProcess = this.preProcess.bind(this)
    this.getPrediction = this.getPrediction.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.checkUrl = this.checkUrl.bind(this)
    this.scrapePublisher = this.scrapePublisher.bind(this)
    this.clearUrl = this.clearUrl.bind(this)
    this.fetchArticles = this.fetchArticles.bind(this)
    this.toggleHide = this.toggleHide.bind(this)
  }

  componentDidMount() {
    this.setChartData()
    window.addEventListener(
      'resize',
      _.debounce(() => {
        this.setState({window: window.innerWidth})
      }, 200)
    )
  }

  setUrl(event) {
    this.setState({
      url: event.target.value
    })
  }

  // Check if URL is valid
  checkUrl() {
    return /^(ftp|http|https):\/\/[^ "]+$/.test(this.state.url)
  }

  // Call scrape-publisher route on URL
  async scrapePublisher() {
    this.setState({publisher: '', loaded: 'loading'})
    try {
      const {data} = await axios.get('/api/processing/scrape/meta', {
        params: {targetUrl: this.state.url}
      })
      this.setState({publisher: data.publisher}, () => this.sendUrl())
    } catch (error) {
      console.log('~~~META ERROR~~~')
      console.log(error)
    }
  }

  // Call scrape API on URL
  async sendUrl() {
    this.setState({
      html: '--- SCRAPING ---',
      processed: '',
      keywords: [],
      scores: [],
      title: '',
      label: '',
      loaded: 'loading'
    })
    this.setChartData()

    try {
      const {data} = await axios.get('/api/python/scrape', {
        params: {url: this.state.url}
      })
      this.setState(
        {
          html: data.text,
          title: data.title
        },
        () => this.preProcess()
      )
    } catch (error) {
      console.log('~~~SCRAPE~~~')
      console.log(error)
    }
  }

  // Cleans up text for Google NLP API
  async preProcess() {
    this.setState({processed: '--- PROCESSING ---'})
    let shortenedText = this.state.html
      .split(' ')
      .slice(0, 1000)
      .join(' ')

    try {
      const {data} = await axios.get('/api/python/preprocess', {
        params: {text: shortenedText}
      })

      this.setState(
        {
          processed: data.text,
          keywords: data.keywords
        },
        () => this.getPrediction()
      )
    } catch (error) {
      console.log('~~~PREPROCESS ERROR~~~')
      console.log(error)
    }
  }

  // Call Google NLP Api
  async getPrediction() {
    try {
      const response = await axios.get('/api/processing/predict', {
        params: {text: this.state.processed}
      })

      // Organize API response and set to state
      let scores = {}
      response.data.forEach(datum => {
        scores[datum.displayName] = datum.classification.score * 100
      })
      let {fake, political, reliable, satire, unknown} = scores
      this.setChartData([fake, political, reliable, satire, unknown])

      // Refactor API response and save to state
      let obj = {}
      response.data.forEach(score => {
        obj[score.displayName] = score.classification.score
      })
      let max = response.data.reduce((prev, current) => {
        return prev.classification.score > current.classification.score
          ? prev
          : current
      })
      this.setState(
        {
          label: [
            Math.round(max.classification.score * 1000) / 10,
            max.displayName
          ],
          scores: obj
        },
        () => this.fetchArticles()
      )
    } catch (error) {
      console.log('~~~PREDICTION ERROR~~~')
      console.log(error)
    }

    // Save article to DB
    this.props.createArticle({
      publisher: this.state.publisher,
      url: this.state.url,
      text: this.state.html,
      title: this.state.title,
      fake: this.state.scores.fake * 100,
      political: this.state.scores.political * 100,
      reliable: this.state.scores.reliable * 100,
      satire: this.state.scores.satire * 100,
      unknown: this.state.scores.unknown * 100
    })
  }

  async fetchArticles() {
    try {
      let {data} = await axios.get('/api/processing/related-articles', {
        params: {keywords: this.state.keywords.slice(0, 3)}
      })
      this.setState({relatedArticles: data, loaded: 'yes'})
    } catch (error) {
      console.log('~~~FETCH ARTICLES ERROR~~~')
      console.log(error)
    }
  }

  setChartData(datum = [0, 0, 0, 0, 0]) {
    this.setState({
      chartData: {
        labels: ['Fake', 'Political', 'Reliable', 'Satire', 'Unknown'],
        datasets: [
          {
            data: datum,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ]
          }
        ]
      }
    })
  }

  async handleClick() {
    if (this.checkUrl()) {
      await this.scrapePublisher()
    } else console.log('INVALID URL')
  }

  clearUrl() {
    this.setState({url: ''})
  }

  toggleHide() {
    this.setState({hide: !this.state.hide})
  }

  render() {
    const search = (
      <>
        {this.state.loaded !== 'yes' && (
          <FlexCol>
            <Fade show={this.state.loaded === 'no'}>
              <FlexCol className="illustration">
                {this.state.window < 1200 ? <Landing /> : <Parallax />}
              </FlexCol>
              <Input
                url={this.state.url}
                setUrl={this.setUrl}
                clearUrl={this.clearUrl}
                handleClick={this.scrapePublisher}
              />
            </Fade>
            <Fade show={this.state.loaded === 'loading'}>
              <FlexCol className="illustration">
                <Loading />
              </FlexCol>
              <div className="search">
                <h3>Hold tight. We're triple checking our sources.</h3>
              </div>
            </Fade>
          </FlexCol>
        )}
        <Fade show={this.state.loaded === 'yes'} time={5}>
          <FlexCol id="analytics">
            <FlexCol id="title">
              <h3>
                {this.state.publisher}: {this.state.title}
              </h3>
              <div id="read-more" onClick={this.toggleHide}>
                Read More{this.state.hide ? '▼' : '▲'}
              </div>
              {!this.state.hide && (
                <div id="article-text">{this.state.html}</div>
              )}
            </FlexCol>
            <FlexCol id="graph">
              <Chart chartData={this.state.chartData} />
              {this.state.label.length && <Response label={this.state.label} />}
            </FlexCol>
            <FlexCol id="articles">
              <RelatedArticles
                keywords={this.state.keywords}
                url={this.state.url}
                articles={this.state.relatedArticles}
              />
              <SimilarArticles label={this.state.label} url={this.state.url} />
            </FlexCol>
            <FlexCol>
              <button
                type="button"
                className="back-button"
                onClick={() => window.location.reload(false)}
              >
                Start Over
              </button>
            </FlexCol>
          </FlexCol>
        </Fade>
      </>
    )

    return <>{search}</>
  }
}

const mapDispatch = dispatch => {
  return {
    createArticle: newArticle => dispatch(createArticle(newArticle))
  }
}

export default connect(null, mapDispatch)(Scraper)
