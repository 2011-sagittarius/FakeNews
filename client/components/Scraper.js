import React, {Component} from 'react'
import axios from 'axios'
import {
  Chart,
  RelatedArticles,
  Loading,
  Input,
  Landing,
  Fade,
  Response,
  FlexCol
} from '../components'
import {connect} from 'react-redux'
import {createArticle} from '../store/article'
import './Scraper.css'
import Card from './LandingParallax'

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
      url: 'Enter URL',
      loaded: 'no'
    }

    this.setUrl = this.setUrl.bind(this)
    this.sendUrl = this.sendUrl.bind(this)
    this.preProcess = this.preProcess.bind(this)
    this.getPrediction = this.getPrediction.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.checkUrl = this.checkUrl.bind(this)
    this.scrapePublisher = this.scrapePublisher.bind(this)
    this.clearUrl = this.clearUrl.bind(this)
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
    this.setState({publisher: '', loaded: 'loading'})
    try {
      const {data} = await axios.get('/api/processing/scrape/meta', {
        params: {targetUrl: this.state.url}
      })
      this.setState({publisher: data.publisher}, () => this.sendUrl())
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

      this.setState(
        {
          html: data.content,
          title: data.title
        },
        () => this.preProcess()
      )
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

    this.setState(
      {
        processed: data.text,
        keywords: data.keywords
      },
      () => this.getPrediction()
    )
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
    } else console.log('INVALID URL')
  }

  clearUrl() {
    this.setState({url: ''})
  }

  render() {
    const search = (
      <>
        {this.state.loaded !== 'yes' && (
          <FlexCol className="illustration">
            <Fade show={this.state.loaded === 'no'}>
              <FlexCol style={{margin: '6rem 0rem'}}>
                {/* <Landing /> */}
                <Card />
              </FlexCol>
              <Input
                url={this.state.url}
                setUrl={this.setUrl}
                clearUrl={this.clearUrl}
                handleClick={this.handleClick}
              />
            </Fade>
            <Fade show={this.state.loaded === 'loading'}>
              <FlexCol style={{margin: '6rem 0rem'}}>
                <Loading />
              </FlexCol>
              <h3>Hold tight. We're triple checking our sources.</h3>
            </Fade>
          </FlexCol>
        )}
        <Fade show={this.state.loaded === 'yes'}>
          <FlexCol>
            <FlexCol>
              <Chart chartData={this.state.chartData} />

              {this.state.label.length && <Response label={this.state.label} />}
              {/* <textarea
                className="result"
                rows="25"
                cols="60"
                defaultValue={this.state.html}
              /> */}
            </FlexCol>
            <RelatedArticles keywords={this.state.keywords} />
            <button
              type="button"
              className="back-button"
              onClick={() => window.location.reload(false)}
            >
              Start Over
            </button>
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
