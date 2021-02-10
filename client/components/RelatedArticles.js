import axios from 'axios'
import React, {useEffect, useState} from 'react'

const RelatedArticles = props => {
  const {keywords} = props
  const [articles, setArticles] = useState([])

  const fetchArticles = async () => {
    let {data} = await axios.get('/api/processing/related-articles', {
      params: {keywords: keywords.slice(0, 5)}
    })
    setArticles(data)
  }

  useEffect(
    () => {
      if (keywords.length > 0) fetchArticles()
    },
    [keywords]
  )

  return keywords.length < 1 ? (
    <></>
  ) : (
    <div>
      <h2>Want some more info? 👇</h2>
      {articles.slice(0, 5).map(article => (
        <div key={article.title}>
          <p>{article.title}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.url}
          </a>
        </div>
      ))}
    </div>
  )
}

export default RelatedArticles
