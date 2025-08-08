import { useState, useRef } from 'react'
import Head from 'next/head'
import { withIronSessionSsr } from 'iron-session/next'
import sessionOptions from '../config/session'
import { useDrinkContext } from '../context/drink'
import * as actions from '../context/drink/actions'
import DrinkResults from '../components/drinkResults'
import Header from '../components/header'
import styles from '../styles/Search.module.css'

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const { user } = req.session
    return { props: { isLoggedIn: !!user, user: user || null } }
  },
  sessionOptions
)

function prepRawData(rawData) {
  return rawData?.drinks?.map((drink) => {
    const ingredients = []
    const measures = []
    for (let i = 1; i <= 15; i++) {
      if (drink[`strIngredient${i}`]) {
        ingredients.push(drink[`strIngredient${i}`])
        measures.push(drink[`strMeasure${i}`] || '')
      }
    }
    return {
      cocktailId: drink.idDrink,
      cocktailName: drink.strDrink,
      instructions: drink.strInstructions,
      thumbnail: drink.strDrinkThumb,
      glassType: drink.strGlass,
      ingredients,
      measures,
    }
  })
}

export default function Search({ isLoggedIn, user }) {
  const [{ drinkSearchResults }, dispatch] = useDrinkContext()
  const [query, setQuery] = useState('')
  const [fetching, setFetching] = useState(false)
  const [previousQuery, setPreviousQuery] = useState('')
  const inputRef = useRef()
  const inputDivRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (fetching || !query.trim() || query === previousQuery) return

    setPreviousQuery(query)
    setFetching(true)
    try {
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
      )
      if (!res.ok) return
      const rawData = await res.json()
      const data = prepRawData(rawData)
      dispatch({ action: actions.SEARCH_DRINKS, payload: data })
    } finally {
      setFetching(false)
    }
  }

  return (
    <>
      <Head>
        <title>BarKeep</title>
        <meta name="description" content="Barkeep Search Page" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={isLoggedIn} username={user?.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>Make your search below.</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.instruct} htmlFor="drink-search">
            Type the drink's name and hit search to see if we know it:
          </label>
          <div ref={inputDivRef}>
            <input
              ref={inputRef}
              id="drink-search"
              type="text"
              value={query}
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">CLICK ME TO SEARCH</button>
          </div>
        </form>

        {fetching ? (
          <span className={styles.searching}>
            Gimme a second, I'm searching here!
          </span>
        ) : drinkSearchResults?.length ? (
          <DrinkResults drinks={drinkSearchResults} />
        ) : (
          <div className={styles.noResults}>
            <p>
              <strong>
                {previousQuery
                  ? `Sorry, we can't think of anything for "${previousQuery}"`
                  : 'We have got nothing until you search.'}
              </strong>
            </p>
          </div>
        )}
      </main>
    </>
  )
}
