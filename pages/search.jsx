import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import sessionOptions from "../config/session";
import { useDrinkContext } from "../context/drink";
import DrinkList from "../components/drinkList";
import Header from '../components/header'
import * as actions from '../context/drink/actions'
import { useState, useRef } from 'react'
import styles from '../styles/Search.module.css'

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

function prepRawData(rawData) {
  let data = rawData?.drinks?.map((
    {idDrink, strDrink, strInstructions, strDrinkThumb, strGlass,
    strIngredient1, strIngredient2, strIngredient3, strIngredient4,
    strIngredient5, strIngredient6, strIngredient7, strIngredient8,
    strIngredient9, strIngredient10, strIngredient11, strIngredient12,
    strIngredient13, strIngredient14, strIngredient15, 
    strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5,
    strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10,
    strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15
    }) => ({
    cocktailId: idDrink,
    cocktailName: strDrink,
    instructions: strInstructions,
    thumbnail: strDrinkThumb,
    glassType: strGlass,
    ingredient1: strIngredient1,
    ingredient2: strIngredient2,
    ingredient3: strIngredient3,
    ingredient4: strIngredient4,
    ingredient5: strIngredient5,
    ingredient6: strIngredient6,
    ingredient7: strIngredient7,
    ingredient8: strIngredient8,
    ingredient9: strIngredient9,
    ingredient10: strIngredient10,
    ingredient11: strIngredient11,
    ingredient12: strIngredient12,
    ingredient13: strIngredient13,
    ingredient14: strIngredient14,
    ingredient15: strIngredient15,
    measure1: strMeasure1,
    measure2: strMeasure2,
    measure3: strMeasure3,
    measure4: strMeasure4,
    measure5: strMeasure5,
    measure6: strMeasure6,
    measure7: strMeasure7,
    measure8: strMeasure8,
    measure9: strMeasure9,
    measure10: strMeasure10,
    measure11: strMeasure11,
    measure12: strMeasure12,
    measure13: strMeasure13,
    measure14: strMeasure14,
    measure15: strMeasure15,
    ingredients: strIngredient1
    })
  )
  return(data)
}

export default function Search(props) {
  const [{drinkSearchResults}, dispatch] = useDrinkContext()
  const [query, setQuery] = useState("")
  const [fetching, setFetching] = useState(false)
  const [previousQuery, setPreviousQuery] = useState()
  const inputRef = useRef()
  const inputDivRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault()
    if (fetching || !query.trim() || query === previousQuery) return
    setPreviousQuery(query)
    setFetching(true)
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
    )
    if (res.status !== 200) return
    const rawData = await res.json()
    const data = prepRawData(rawData)
    dispatch({
      action: actions.SEARCH_DRINKS,
      payload: data
    })
    setFetching(false)
  }

  return (
    <>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Barkeep Search Page" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      
      <main>
        <h1 className={styles.title}>Bevy Search</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.instruct} htmlFor="drink-search">Search by a drinks name and/or liquor:</label>
          <div ref={inputDivRef}>
            <input
              ref={inputRef}
              type="text"
              name="drink-search"
              id="drink-search"
              value={query}
              autoFocus={true}
              onChange={e => setQuery(e.target.value)}/>
            <button type="submit">Search</button>
          </div>
        </form>
        {
          fetching
          ? <Searching />
          : drinkSearchResults?.length
          ? <DrinkList drinks={drinkSearchResults}/>
          : <NoResults
          {...{inputRef, inputDivRef, previousQuery}}
          clearSearch={() => setQuery("")}/>
        }
      </main>
    </>
  )
}

function Searching() {
  return <span className={styles.searching}>Gimme a second, I'm searching here!</span>
}

function NoResults({ inputDivRef, inputRef, previousQuery, clearSearch }) {
  function handleLetsSearchClick() {
    inputRef.current.focus()
    if (previousQuery) clearSearch()
  }
  return (
    <div className={styles.noResults}>
      <p><strong>{previousQuery ? `No Drinks Found for "${previousQuery}"` : "No results yet."}</strong></p>
      <button onClick={handleLetsSearchClick}>
        {
          previousQuery
          ? `Search again?`
          : `Search for a drink!`
        }
      </button>
    </div>
  )
}