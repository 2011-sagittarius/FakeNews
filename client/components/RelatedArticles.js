import Axios from 'axios'
import React, {useEffect, useState} from 'react'
import axios from 'axios'

const RelatedArticles = props => {
  const {keywords} = props
  const [articles, setArticles] = useState([])

  useEffect(
    () => {
      const fetchArticles = async () => {
        let {data} = await axios.get('/api/processing/related-articles', {
          params: {keywords: keywords}
        })
        setArticles(data)
      }

      if (keywords.length > 0) fetchArticles()

      // call related news articles api
    },
    [keywords]
  )
  if (keywords.length > 0) {
    console.log('keywords > ', keywords)
    console.log('articles > ', articles)
  }
  return <div />
}

export default RelatedArticles
