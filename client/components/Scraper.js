import React, {Component, useEffect} from 'react'
import axios from 'axios'
import {Chart, RelatedArticles} from '../components'
// import {framework} from 'passport'
import {connect} from 'react-redux'
import {createArticle} from '../store/article'

class Scraper extends Component {
  constructor() {
    super()
    this.state = {
      url: '',
      html: '',
      processed: '',
      prediction: [],
      label: [],
      chartData: {},
      keywords: [],
      title: '',
      scores: []
    }
    this.setUrl = this.setUrl.bind(this)
    this.sendUrl = this.sendUrl.bind(this)
    this.preProcess = this.preProcess.bind(this)
    this.getPrediction = this.getPrediction.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.setChartData()
  }

  setUrl(event) {
    this.setState({
      url: event.target.value
    })
  }

  async sendUrl() {
    this.setState({
      html: '--- SCRAPING ---',
      processed: '',
      keywords: []
    })
    this.setChartData()

    await axios
      .get('/api/processing/scrape', {
        params: {url: this.state.url}
      })
      .then(response => {
        this.setState({
          html: response.data.content,
          title: response.data.title
        })
      })
    this.setChartData()
  }

  clear() {
    this.setState({html: '', processed: ''})
    this.setChartData()
  }

  async preProcess() {
    let myText = this.state.html
      .split(' ')
      .slice(0, 1000)
      .join(' ')

    this.setState({processed: '--- PROCESSING ---'})
    await axios
      .get('/api/processing/preprocess', {
        params: {text: myText}
      })
      .then(response => {
        this.setState({
          processed: response.data.text,
          keywords: response.data.keywords
        })
      })
  }

  async getPrediction() {
    await axios
      .get('/api/processing/predict', {
        params: {text: this.state.processed}
      })
      .then(res => {
        let data = {}
        res.data.forEach(datum => {
          data[datum.displayName] = datum.classification.score * 100
        })
        let {fake, political, reliable, satire, unknown} = data
        this.setChartData([fake, political, reliable, satire, unknown])

        let order = res.data.sort(
          (a, b) => b.classification.score - a.classification.score
        )
        this.setState({
          ...this.state,
          label: [
            Math.round(order[0].classification.score * 1000) / 10,
            order[0].displayName
          ],
          score: res.data
        })
      })

    this.props.createArticle({
      url: this.state.url,
      text: this.state.html,
      title: this.state.title,
      reliable: this.state.score[0].classification.score * 100,
      political: this.state.score[1].classification.score * 100,
      unknown: this.state.score[2].classification.score * 100,
      fake: this.state.score[3].classification.score * 100,
      satire: this.state.score[4].classification.score * 100
    })
  }

  setChartData(datum = [0, 0, 0, 0, 0]) {
    // Ajax calls here
    // axios
    //   .get('/api/xyz')
    //   .then
    this.setState({
      chartData: {
        labels: ['Fake', 'Political', 'Reliable', 'Satire', 'Unknown'],
        datasets: [
          {
            // label: 'Fake News',
            data: datum,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              // 'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
              // 'rgba(255, 99, 132, 0.6)',
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
    await this.sendUrl()
    await this.preProcess()
    // .then(() => this.getPrediction())
    await this.getPrediction()
    // Promise.all([this.sendUrl(), this.preProcess(), this.getPrediction()])
  }

  render() {
    let adjective =
      this.state.label[0] > 75
        ? 'most likely'
        : this.state.label[0] > 50 ? 'probably' : 'somewhat'

    const search = (
      <div className="container">
        <div className="chart-container">
          <Chart chartData={this.state.chartData} />
          {this.state.label.length > 0 ? (
            <div className="response">
              This article is <span>{adjective}</span> {this.state.label[1]}
            </div>
          ) : (
            <></>
          )}
          <RelatedArticles keywords={this.state.keywords} />
        </div>
        <div className="input">
          <div className="input-group input-group-lg">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-lg">
                URL
              </span>
            </div>

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
                Scrape
              </button>
            </div>
          </div>

          <div>
            <textarea
              className="result"
              rows="15"
              cols="70"
              defaultValue={this.state.html}
            />
          </div>
          <div>
            <textarea
              className="result"
              rows="15"
              cols="70"
              defaultValue={this.state.processed}
            />
          </div>
        </div>
      </div>
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
