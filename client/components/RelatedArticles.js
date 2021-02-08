import axios from 'axios'
import React, {useEffect, useState} from 'react'

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

  if (keywords.length > 0) {
    console.log('keywords > ', keywords)
    console.log('articles > ', articles)
  }
  return articles.length < 1 ? (
    <></>
  ) : (
    <div>
      <h2>Want some more info? 👇</h2>
      {articles.map(article => (
        <div key={article.id}>
          <p>{article.title}</p>
          <a href="#">{article.url}</a>
        </div>
      ))}
    </div>
  )
}

export default RelatedArticles
