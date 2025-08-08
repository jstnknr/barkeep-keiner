import { createContext, useContext, useReducer } from 'react'
import initialState from './state'
import reducer from './reducer'

const DrinkContext = createContext()

export const useDrinkContext = () => {
  const context = useContext(DrinkContext)
  if (!context) {
    throw new Error('useDrinkContext must be used within DrinkProvider')
  }
  return context
}

export const DrinkProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <DrinkContext.Provider value={[state, dispatch]}>
      {children}
    </DrinkContext.Provider>
  )
}
