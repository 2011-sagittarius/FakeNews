import axios from 'axios'

const ADD_ARTICLE = 'ADD_ARTICLE'

export const addArticle = article => ({
  type: ADD_ARTICLE,
  article
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

const initialState = []

// Take a look at app/redux/index.js to see where this reducer is
// added to the Redux store with combineReducers
export default function articlesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ARTICLE: {
      return [...state, action.article]
    }
    // case DELETE_ROBOT: {
    //     return state.filter((robot) => robot.id !== action.robotId);
    // }
    default:
      return state
  }
}
