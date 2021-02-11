import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {FlexCol} from '../components'
import './SimilarArticles.css'

const SimilarArticles = props => {
  const {label} = props
  const [articles, setArticles] = useState([])

  const fetchSimilarArticles = async () => {
    let {data} = await axios.get('/api/processing/similar-articles', {
      params: {
        label: label
      }
    })
    setArticles(data)
    console.log(data)
  }

  useEffect(
    () => {
      if (label.length > 0) fetchSimilarArticles()
    },
    [label]
  )

  return articles.length < 0 ? (
    <></>
  ) : articles.length === 1 ? (
    <FlexCol style={{padding: '2rem', alignItems: 'flex-start'}}>
      <h2>Other {label[1]} articles users found! 👇</h2>
      {articles.map(article => (
        <div key={article.title} className="related-article">
          <p>{article.title}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.url}
          </a>
        </div>
      ))}
    </FlexCol>
  ) : (
    <FlexCol style={{padding: '2rem', alignItems: 'flex-start'}}>
      <h2>Other {label[1]} articles users found! 👇</h2>
      {articles.slice(0, -1).map(article => (
        <div key={article.title} className="related-article">
          <p>{article.title}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.url}
          </a>
        </div>
      ))}
    </FlexCol>
  )
}

export default SimilarArticles
