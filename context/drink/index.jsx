import {useContext, createContext, useReducer} from 'react'
import initialState from './state'
import reducer from './reducer'

export const drinkContext = createContext()

export const useDrinkContext = () => {
  const context = useContext(drinkContext)
  if (context === undefined)
    throw new Error('useDrinkContext must be used within DrinkProvider')
  return context
}

export const DrinkProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <drinkContext.Provider {...props} value={[state, dispatch]} />
}