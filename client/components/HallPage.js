import React from 'react'
import {connect} from 'react-redux'
import {
  fetchReliableArticles,
  fetchFrequentArticles,
  fetchRecentArticles
} from '../store/article'
import './HallPage.css'

export class HallPage extends React.Component {
  componentDidMount() {
    this.props.loadReliableArticles()
    this.props.loadFrequentArticles()
    this.props.loadRecentArticles()
  }

  render() {
    const {hallData} = this.props
    const fameData = hallData.hallArticles.hallOfFameObj
    const shameData = hallData.hallArticles.hallOfShameObj
    const freqData = hallData.freqArticles.slice(0, 3)
    const recData = hallData.recArticles.slice(0, 3)
    console.log(hallData)

    return (
      <div>
        <div className="hall-of-fame">
          <h2>Hall of Fame</h2>
          <ul>
            {fameData !== undefined &&
              Object.keys(fameData).map((publisher, index) => (
                <li key={index}>
                  <mark className="blue">
                    {fameData[publisher]}%&nbsp;&nbsp;&nbsp;
                  </mark>
                  {publisher}
                </li>
              ))}
          </ul>
        </div>

        <div className="hall-of-shame">
          <h2>Hall of Shame</h2>
          <ul>
            {shameData !== undefined &&
              Object.keys(shameData).map((publisher, index) => (
                <li key={index}>
                  <mark className="red">
                    {shameData[publisher]}%&nbsp;&nbsp;&nbsp;
                  </mark>
                  {publisher}
                </li>
              ))}
          </ul>
        </div>

        <div className="frequent-articles">
          <h2>Other users frequently check</h2>
          <ul>
            {freqData.map(publisher => <li key={publisher}>{publisher}</li>)}
          </ul>
        </div>

        <div className="recent-articles">
          <h2>Other users recently checked</h2>
          <ul>
            {recData.map(publisher => <li key={publisher}>{publisher}</li>)}
          </ul>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    hallData: state.articles
  }
}

const mapDispatch = dispatch => {
  return {
    loadReliableArticles: () => {
      dispatch(fetchReliableArticles())
    },
    loadFrequentArticles: () => {
      dispatch(fetchFrequentArticles())
    },
    loadRecentArticles: () => {
      dispatch(fetchRecentArticles())
    }
  }
}

export default connect(mapState, mapDispatch)(HallPage)
