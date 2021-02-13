import axios from 'axios'
const ADD_ARTICLE = 'ADD_ARTICLE'
const HALL_ARTICLES = 'HALL_ARTICLES'

export const addArticle = article => ({
  type: ADD_ARTICLE,
  article
})

export const hallArticles = articles => ({
  type: HALL_ARTICLES,
  articles
})

export const createArticle = newArticle => {
  return async dispatch => {
    try {
      const createdArticle = (await axios.post(
        '/api/processing/scrape',
        newArticle
      )).data
      dispatch(addArticle(createdArticle))
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchReliableArticles = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/processing/hall-of-articles')
      let arr = []

      // iterate through each publisher
      for (const publisher in data) {
        if (publisher) {
          let avg = {fake: 0, reliable: 0, unknown: 0, satire: 0, political: 0}

          // iterate through each publisher's articles
          data[publisher].forEach(article => {
            Object.keys(article).forEach(label => {
              if (label !== 'publisher') avg[label] += article[label]
            })
          })
          // calculate each publisher's average score for the 5 labels
          Object.keys(avg).forEach(label => {
            avg[label] = avg[label] / data[publisher].length
          })

          // store publisher and scores in arr
          arr.push({publisher: publisher, scores: avg})
        }
      }
      // sort arr by reliability
      const articles = arr.sort(
        (a, b) => (a.scores.reliable < b.scores.reliable ? 1 : -1)
      )

      dispatch(hallArticles(articles))
    } catch (error) {
      console.log(error)
    }
  }
}

const initialState = []

// Take a look at app/redux/index.js to see where this reducer is
// added to the Redux store with combineReducers
export default function articlesReducer(state = initialState, action) {
  switch (action.type) {
    case HALL_ARTICLES: {
      return action.articles
    }
    case ADD_ARTICLE: {
      return [...state, action.article]
    }
    default:
      return state
  }
}
