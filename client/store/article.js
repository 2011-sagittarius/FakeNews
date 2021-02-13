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

      for (const key in data) {
        if (key) {
          let sum = data[key].reduce(function(prev, curr) {
            return {
              reliable: prev.reliable + curr.reliable
            }
          })
          let average = sum.reliable / data[key].length
          arr.push(average)
        }
      }

      const keys = Object.keys(data)

      const arrPercent = arr.map(item => Number(item.toFixed(2)))

      const obj = {}
      keys.forEach(function(eachItem, i) {
        obj[eachItem] = arrPercent[i]
      })

      const fameArray = Object.entries(obj)
      const fameFilter = fameArray.filter(([item, value]) => value >= 70)
      const hallOfFameObj = fameFilter.reduce(function(res, curr) {
        let [key, value] = curr
        res[key] = value
        return res
      }, {})

      const shameArray = Object.entries(obj)
      const shameFilter = shameArray.filter(([item, value]) => value < 70)
      const hallOfShameObj = shameFilter.reduce(function(res, curr) {
        let [key, value] = curr
        res[key] = value
        return res
      }, {})

      dispatch(hallArticles({hallOfFameObj, hallOfShameObj}))
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
