import React from 'react'
import {connect} from 'react-redux'
import {fetchReliableArticles} from '../store/article'
import {FlexCol, FlexColLeft, FlexRow} from '../components'
import {Fame, Shame} from '../SVG'

import './HallPage.css'

export class HallPage extends React.Component {
  componentDidMount() {
    this.props.loadReliableArticles()
  }

  render() {
    const {hallData} = this.props
    const fameData = hallData.hallOfFameObj
    const shameData = hallData.hallOfShameObj

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
            <FlexCol id="rating-blue">
              {fameData !== undefined &&
                Object.keys(fameData).map((publisher, index) => (
                  <div key={index}>{fameData[publisher]}%</div>
                ))}
            </FlexCol>
            <FlexColLeft style={{marginLeft: '1rem'}}>
              {fameData !== undefined &&
                Object.keys(fameData).map((publisher, index) => (
                  <div key={index}>{publisher}</div>
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
                Object.keys(shameData).map((publisher, index) => (
                  <div key={index}>{shameData[publisher]}%</div>
                ))}
            </FlexCol>
            <FlexColLeft style={{marginLeft: '1rem'}}>
              {shameData !== undefined &&
                Object.keys(shameData).map((publisher, index) => (
                  <div key={index}>{publisher}</div>
                ))}
            </FlexColLeft>
          </FlexRow>
        </FlexColLeft>
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
