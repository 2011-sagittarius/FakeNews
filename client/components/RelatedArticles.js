import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {FlexCol} from '../components'
import './RelatedArticles.css'

const RelatedArticles = props => {
  const {keywords} = props
  const [articles, setArticles] = useState([])

  const fetchArticles = async () => {
    let {data} = await axios.get('/api/processing/related-articles', {
      params: {keywords: keywords.slice(0, 4)}
    })
    setArticles(data)
  }

  useEffect(
    () => {
      if (keywords.length > 0) fetchArticles()
    },
    [keywords]
  )

  return (
    keywords.length > 1 && (
      <FlexCol style={{padding: '2rem', alignItems: 'flex-start'}}>
        <h4>Want some more info? 👇</h4>
        {articles.slice(0, 5).map(article => (
          <div key={article.title} className="related-article">
            <p>{article.title}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.url}
            </a>
          </div>
        ))}
      </FlexCol>
    )
  )
}

export default RelatedArticles
