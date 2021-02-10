import React, {Component} from 'react'
import axios from 'axios'
import {Chart, RelatedArticles, Loading, Landing} from '../components'
// import {framework} from 'passport'
import {connect} from 'react-redux'
import {createArticle} from '../store/article'
import {FlexRow, FlexCol} from './Components'
import './Scraper.css'

class Scraper extends Component {
  constructor() {
    super()
    this.state = {
      chartData: {},
      html: '',
      label: [],
      keywords: [],
      processed: '',
      publisher: '',
      scores: [],
      title: '',
      url: '',
      loaded: 'no'
    }

    this.setUrl = this.setUrl.bind(this)
    this.sendUrl = this.sendUrl.bind(this)
    this.preProcess = this.preProcess.bind(this)
    this.getPrediction = this.getPrediction.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.checkUrl = this.checkUrl.bind(this)
    this.scrapePublisher = this.scrapePublisher.bind(this)
  }

  componentDidMount() {
    this.setChartData()
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
    this.setState({publisher: ''})
    try {
      const {data} = await axios.get('/api/processing/scrape/meta', {
        params: {targetUrl: this.state.url}
      })
      this.setState({publisher: data.publisher})
    } catch (error) {
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
      const {data} = await axios.get('/api/processing/scrape', {
        params: {url: this.state.url}
      })

      this.setState({
        html: data.content,
        title: data.title
      })
    } catch (error) {
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

    const {data} = await axios.get('/api/processing/preprocess', {
      params: {text: shortenedText}
    })

    this.setState({
      processed: data.text,
      keywords: data.keywords
    })
  }

  // Call Google NLP Api
  async getPrediction() {
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
    this.setState({
      label: [
        Math.round(max.classification.score * 1000) / 10,
        max.displayName
      ],
      scores: obj,
      loaded: 'yes'
    })

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
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    })
  }

  async handleClick() {
    if (this.checkUrl()) {
      await this.scrapePublisher()
      await this.sendUrl()
      await this.preProcess().then(() => {
        if (this.state.processed.length > 1) this.getPrediction()
        else console.log('NO PROCESSED TEXT')
      })
    } else console.log('INVALID URL')
  }

  render() {
    let adjective =
      this.state.label[0] > 75
        ? 'most likely'
        : this.state.label[0] > 50 ? 'probably' : 'somewhat'

    const search = (
      <FlexCol>
        <FlexRow>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-lg"
            value={this.state.url}
            onChange={this.setUrl}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={this.handleClick}
            >
              Check
            </button>
          </div>
        </FlexRow>
        <FlexCol>
          {this.state.loaded === 'no' ? (
            <>
              <FlexCol style={{maxHeight: '50vh', margin: '9rem 0rem'}}>
                <Landing />
              </FlexCol>
            </>
          ) : this.state.loaded === 'loading' ? (
            <FlexCol style={{maxHeight: '60vh', margin: '4rem 0rem'}}>
              <Loading />
              <h3>Hold tight. We're triple checking our sources.</h3>
            </FlexCol>
          ) : (
            <FlexCol>
              <FlexRow style={{margin: '8rem 0rem'}}>
                <div>
                  <Chart chartData={this.state.chartData} />

                  {this.state.label.length > 0 ? (
                    <div className="response">
                      This article is <span>{adjective}</span>{' '}
                      {this.state.label[1]}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <textarea
                  className="result"
                  rows="25"
                  cols="60"
                  defaultValue={this.state.html}
                />
              </FlexRow>
              {/* <div className="input">
                <div className="input-group input-group-lg">
                  <span className="input-group-text" id="inputGroup-sizing-lg">
                URL
              </span>
                </div>

                <div>
                  <textarea
                    className="result"
                    rows="15"
                    cols="70"
                    defaultValue={this.state.processed}
                  />
                </div>
              </div> */}
              <RelatedArticles keywords={this.state.keywords} />
            </FlexCol>
          )}
        </FlexCol>
      </FlexCol>
    )

    return <div>{search}</div>
  }
}

const mapDispatch = dispatch => {
  return {
    createArticle: newArticle => dispatch(createArticle(newArticle))
  }
}

export default connect(null, mapDispatch)(Scraper)
