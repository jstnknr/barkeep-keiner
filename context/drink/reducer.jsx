import * as actions from './actions'

export default (state, { action, payload }) =>
  action === actions.SEARCH_DRINKS
    ? { ...state, drinkSearchResults: payload }
    : state
