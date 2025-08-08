// pages/drink/[id].jsx
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useCallback } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import sessionOptions from '../../config/session'
import { useDrinkContext } from '../../context/drink'
import Header from '../../components/header'
import db from '../../db'
import styles from '../../styles/Drink.module.css'

export const getServerSideProps = withIronSessionSsr(
  async ({ req, params }) => {
    const user = req.session.user || null
    const drink = user
      ? await db.drink.getByCocktailId(user.id, params.id)
      : null

    return {
      props: {
        isLoggedIn: !!user,
        user,
        drink, 
      },
    }
  },
  sessionOptions
)

export default function Drink({ isLoggedIn, user, drink: favDrink }) {
  const router = useRouter()
  const [{ drinkSearchResults }] = useDrinkContext()
  const drinkId = router.query.id

  
  const drink = favDrink || drinkSearchResults.find(d => d.cocktailId === drinkId)

  
  useEffect(() => {
    if (!favDrink && !drink) {
      router.replace('/')
    }
  }, [favDrink, drink, router])


  const toggleFavorite = useCallback(
    async (method) => {
      const res = await fetch('/api/drink', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method === 'POST' ? drink : { id: favDrink.id }),
      })
      if (res.ok) router.replace(router.asPath)
    },
    [drink, favDrink, router]
  )

  return (
    <>
      <Head>
        <title>BarKeep</title>
        <meta name="description" content="Viewing a drink with Barkeep" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={isLoggedIn} username={user?.username} />

      {drink && (
        <main>
          <DrinkInfo {...drink} isFavorite={!!favDrink} />

          <div className={styles.controls}>
            {!isLoggedIn ? (
              <>
                <p>Save this one for later?</p>
                <Link href="/login" className="button">
                  Login
                </Link>
              </>
            ) : (
              <button onClick={() => toggleFavorite(favDrink ? 'DELETE' : 'POST')}>
                {favDrink ? 'Get it out of here!' : 'Add this drink to my collection!'}
              </button>
            )}

            <button onClick={() => router.back()} className="link-button">
              Back to search
            </button>
          </div>
        </main>
      )}
    </>
  )
}

function DrinkInfo({
  cocktailName,
  instructions,
  thumbnail,
  glassType,
  isFavorite,
  ingredients,
  measures,
  ...rest
}) {
  const ingredientList = Array.isArray(ingredients) && ingredients.length
    ? ingredients.map((ing, idx) => {
        const measure = measures?.[idx] || ''
        return `${measure} ${ing}`.trim()
      })
    : (() => {
        const list = []
        for (let i = 1; i <= 15; i++) {
          const ing = rest[`strIngredient${i}`] || rest[`ingredient${i}`]
          const measure = rest[`strMeasure${i}`] || rest[`measure${i}`]
          if (ing && measure) {
            list.push(`${measure} ${ing}`.trim())
          }
        }
        return list
      })()

  return (
    <>
      <div className={styles.titleGroup}>
        <h1>
          {cocktailName} {isFavorite && <sup>★</sup>}
        </h1>
        <img src={`${thumbnail}/preview`} alt={cocktailName} />
      </div>

      <div className={styles.drinkInformation}>
        <p>
          <strong>Ingredients:</strong><br />
          {ingredientList.join(', ')}
        </p>
        <p>
          <strong>Instructions:</strong><br />
          {instructions}
        </p>
        <p>
          <strong>Glass:</strong><br />
          {glassType}
        </p>
      </div>
    </>
  )
}
