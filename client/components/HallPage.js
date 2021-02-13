import React from 'react'
import {connect} from 'react-redux'
import {fetchReliableArticles} from '../store/article'
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
