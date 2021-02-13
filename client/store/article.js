import axios from 'axios'
const ADD_ARTICLE = 'ADD_ARTICLE'
const HALL_ARTICLES = 'HALL_ARTICLES'
const FREQUENT_ARTICLES = 'FREQUENT_ARTICLES'
const RECENT_ARTICLES = 'RECENT_ARTICLES'

export const addArticle = article => ({
  type: ADD_ARTICLE,
  article
})

export const hallArticles = articles => ({
  type: HALL_ARTICLES,
  articles
})

export const frequentArticles = freqArticles => ({
  type: FREQUENT_ARTICLES,
  freqArticles
})

export const recentArticles = recArticles => ({
  type: RECENT_ARTICLES,
  recArticles
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

export const fetchFrequentArticles = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/processing/frequent-articles')

      const keys = Object.keys(data)

      const values = Object.values(data)

      let arr = []
      values.forEach(element => arr.push(element.length))

      const obj = {}
      keys.forEach(function(eachItem, i) {
        obj[eachItem] = arr[i]
      })

      const publishersSorted = Object.keys(obj).sort(function(a, b) {
        return obj[b] - obj[a]
      })

      dispatch(frequentArticles(publishersSorted))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchRecentArticles = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/processing/recent-articles')
      console.log(data)

      let arr = []

      for (const key in data) {
        if (key) {
          arr.push(data[key].publisher)
        }
      }
      console.log(arr)

      const removeDuplicates = [...new Set(arr)]
      console.log(removeDuplicates)

      dispatch(recentArticles(removeDuplicates))
    } catch (error) {
      console.log(error)
    }
  }
}

const initialState = {
  hallArticles: [],
  freqArticles: [],
  recArticles: []
}

// Take a look at app/redux/index.js to see where this reducer is
// added to the Redux store with combineReducers
export default function articlesReducer(state = initialState, action) {
  switch (action.type) {
    case HALL_ARTICLES: {
      return {...state, hallArticles: action.articles}
    }
    case ADD_ARTICLE: {
      return [...state, action.article]
    }
    case FREQUENT_ARTICLES: {
      return {...state, freqArticles: action.freqArticles}
    }
    case RECENT_ARTICLES: {
      return {...state, recArticles: action.recArticles}
    }
    default:
      return state
  }
}
