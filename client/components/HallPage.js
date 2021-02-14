import React from 'react'
import {connect} from 'react-redux'
import {
  fetchReliableArticles,
  fetchFrequentArticles,
  fetchRecentArticles
} from '../store/article'
import {Link} from 'react-router-dom'
import {Fade, FlexCol, FlexColLeft, FlexRow} from '../components'
import {Fame, Shame, Share} from '../SVG'

import './HallPage.css'

export class HallPage extends React.Component {
  componentDidMount() {
    this.props.loadReliableArticles()
    this.props.loadFrequentArticles()
    this.props.loadRecentArticles()
  }

  render() {
    const {hallData} = this.props
    const fameData = hallData.hallArticles.filter(
      publisher => publisher.scores.reliable > 70
    )
    const shameData = hallData.hallArticles
      .filter(publisher => publisher.scores.reliable < 30)
      .reverse()
    const freqData = hallData.freqArticles.slice(0, 3)
    const recData = hallData.recArticles.slice(0, 3)

    return (
      <FlexCol id="hall-of-fame">
        <div className="hall-description">
          We combed through previous articles and ranked publishers by
          reliability.
        </div>
        <div className="hall-illustration">
          <Fame />
        </div>
        <FlexColLeft id="fame">
          <h2>Hall of Fame</h2>
          <FlexRow>
            <FlexCol id="rating-green">
              {fameData !== undefined &&
                fameData.map(el => (
                  <div key={el.scores.reliable}>
                    {el.scores.reliable.toFixed(1)}%
                  </div>
                ))}
            </FlexCol>
            <FlexColLeft style={{marginLeft: '.75rem'}}>
              {fameData !== undefined &&
                fameData.map(el => (
                  <div key={el.scores.reliable}>{el.publisher}</div>
                ))}
            </FlexColLeft>
          </FlexRow>
        </FlexColLeft>
        <div className="hall-illustration">
          <Shame />
        </div>
        <FlexColLeft id="shame">
          <h2>Hall of Shame</h2>
          <FlexRow>
            <FlexCol id="rating-red">
              {shameData !== undefined &&
                shameData.map(el => (
                  <div key={el.scores.reliable}>
                    {el.scores.reliable.toFixed(1)}%
                  </div>
                ))}
            </FlexCol>
            <FlexColLeft style={{marginLeft: '.75rem'}}>
              {shameData !== undefined &&
                shameData.map(el => (
                  <div key={el.scores.reliable}>{el.publisher}</div>
                ))}
            </FlexColLeft>
          </FlexRow>
        </FlexColLeft>
        <FlexCol id="recent-container">
          <div className="share-illustration">
            <Share />
          </div>
          <FlexColLeft id="frequent">
            <h2>Other users frequently check</h2>
            <FlexRow>
              <ul>
                {freqData.map(publisher => (
                  <li key={publisher}>{publisher}</li>
                ))}
              </ul>
            </FlexRow>
          </FlexColLeft>
          <FlexColLeft id="recent">
            <h2>Other users recently checked</h2>
            <FlexRow>
              <ul>
                {recData.map(publisher => <li key={publisher}>{publisher}</li>)}
              </ul>
            </FlexRow>
          </FlexColLeft>
        </FlexCol>
        <Link to="/">
          <button type="button" className="hof-back-button">
            Back
          </button>
        </Link>
      </FlexCol>
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
