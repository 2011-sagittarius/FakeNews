import React from 'react'
import {connect} from 'react-redux'
import {fetchReliableArticles} from '../store/article'

export class HallPage extends React.Component {
  componentDidMount() {
    this.props.loadReliableArticles()
  }

  render() {
    const {hallData} = this.props
    const fameData = hallData.hallOfFameObj
    const shameData = hallData.hallOfShameObj
    console.log('HALL DATA', fameData)
    console.log('SHAME DATA', shameData)
    console.log(fameData !== undefined)
    return (
      <div>
        <h2>Hall of Fame</h2>
        <ul>
          {fameData !== undefined &&
            Object.keys(fameData).map((publisher, index) => (
              <li key={index}>
                {publisher}: {fameData[publisher]}
              </li>
            ))}
        </ul>

        <h2>Hall of Shame</h2>
        <ul>
          {shameData !== undefined &&
            Object.keys(shameData).map((publisher, index) => (
              <li key={index}>
                {publisher}: {shameData[publisher]}
              </li>
            ))}
        </ul>
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
    loadReliableArticles: () => dispatch(fetchReliableArticles())
  }
}

export default connect(mapState, mapDispatch)(HallPage)
