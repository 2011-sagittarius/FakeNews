import React, {Component} from 'react'
import axios from 'axios'
import Chart from './chart'
import {framework} from 'passport'

class Scraper extends Component {
  constructor() {
    super()
    this.state = {
      url: '',
      html: '',
      processed: '',
      prediction: '',
      chartData: {}
    }
  }

  componentDidMount() {
    this.setChartData()
  }

  setUrl(event) {
    this.setState({
      ...this.state,
      url: event.target.value
    })
  }

  sendUrl() {
    axios
      .get('/api/processing/scrape', {
        params: {url: this.state.url}
      })
      .then(response => {
        this.setState({
          ...this.state,
          html: response.data
        })
      })
  }

  preProcess() {
    axios
      .get('/api/processing/preprocess', {
        params: {text: this.state.html}
      })
      .then(response => {
        this.setState({
          ...this.state,
          processed: response.data
        })
      })
  }

  getPrediction() {
    axios
      .get('/api/processing/predict', {
        params: {text: this.state.processed}
      })
      .then(res => {
        let data = {}
        res.data.forEach(datum => {
          data[datum.displayName] =
            Math.round(datum.classification.score * 1000) / 10
        })
        let {fake, political, reliable, satire, unknown} = data
        this.setChartData([fake, political, reliable, satire, unknown])
      })
  }

  setChartData(datum = [20, 20, 20, 20, 20]) {
    // Ajax calls here
    // axios
    //   .get('/api/xyz')
    //   .then
    console.log('datum > ', datum)
    this.setState({
      chartData: {
        labels: ['Fake', 'Political', 'Reliable', 'Satire', 'Unknown'],
        datasets: [
          {
            label: 'Fake News',
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
        ]
      }
    })
  }

  render() {
    const search = (
      <div className="container">
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
            onChange={this.setUrl.bind(this)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={this.sendUrl.bind(this)}
            >
              Scrape
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon3"
              onClick={this.preProcess.bind(this)}
            >
              PreProcess
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon4"
              onClick={this.getPrediction.bind(this)}
            >
              Predict
            </button>
          </div>
        </div>

        <div>
          <textarea
            className="result"
            rows="10"
            cols="150"
            value={this.state.html}
          />
        </div>
        <div>
          <textarea
            className="result"
            rows="10"
            cols="150"
            value={this.state.processed}
          />
        </div>
        <Chart chartData={this.state.chartData} />
      </div>
    )

    return <div>{search}</div>
  }
}

export default Scraper
