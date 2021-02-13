import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchReliableArticles} from '../store/article'
import {Fade, FlexCol, FlexColLeft, FlexRow} from '../components'
import {Fame, Shame} from '../SVG'

import './HallPage.css'

export class HallPage extends React.Component {
  componentDidMount() {
    this.props.loadReliableArticles()
  }

  render() {
    const {hallData} = this.props
    const fameData = hallData.filter(
      publisher => publisher.scores.reliable > 70
    )
    const shameData = hallData
      .filter(publisher => publisher.scores.reliable < 30)
      .reverse()

    console.log('fameData > ', fameData)
    console.log('shameData > ', shameData)
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
            <FlexColLeft style={{marginLeft: '1rem'}}>
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
            <FlexColLeft style={{marginLeft: '1rem'}}>
              {shameData !== undefined &&
                shameData.map(el => (
                  <div key={el.scores.reliable}>{el.publisher}</div>
                ))}
            </FlexColLeft>
          </FlexRow>
        </FlexColLeft>
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
    loadReliableArticles: () => dispatch(fetchReliableArticles())
  }
}

export default connect(mapState, mapDispatch)(HallPage)
