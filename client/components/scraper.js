import React, {Component} from 'react'
import axios from 'axios'

class Scraper extends Component {
  constructor() {
    super()
    this.state = {
      url: '',
      html: ''
    }
  }

  render() {
    console.log(this.state.html)
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
          </div>
        </div>

        <div>
          <textarea
            className="result"
            rows="50"
            cols="150"
            value={this.state.html}
          />
        </div>
      </div>
    )

    return <div>{search}</div>
  }

  setUrl(event) {
    this.setState({
      ...this.state,
      url: event.target.value
    })
  }

  sendUrl() {
    axios
      .get('http://localhost:8080/scrape', {
        params: {url: this.state.url}
      })
      .then(response => {
        this.setState({
          ...this.state,
          html: response.data
        })
      })
  }
}

export default Scraper
