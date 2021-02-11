import axios from 'axios'
import React, {useEffect, useState} from 'react'

const SimilarArticles = props => {
  const {label} = props
  const [articles, setArticles] = useState([])

  const fetchSimilarArticles = async () => {
    let {data} = await axios.get('/api/processing/similar-articles', {
      params: {label: label}
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

  return label.length < 1 ? (
    <></>
  ) : (
    <div>
      <h2>Here are some other {label[1]} results 👇</h2>
      {articles.map(article => (
        <div key={article.title} className="related-article">
          <p>{article.title}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.url}
          </a>
        </div>
      ))}
    </div>
  )
}

export default SimilarArticles
