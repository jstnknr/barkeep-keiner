import * as actions from './actions'

export default function reducer(state, {action, payload}) {
  switch(action) {
    case actions.SEARCH_DRINKS:
      return {...state, drinkSearchResults: payload}
    default:
      return state
  }
}