import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import sessionOptions from '../../config/session'
import { useDrinkContext } from '../../context/drink'
import Header from '../../components/header'
import db from '../../db'
import styles from '../../styles/Drink.module.css'

export const getServerSideProps = withIronSessionSsr(
  async ({ req, params }) => {
    const user = req.session.user ?? null
    const drink = user
      ? await db.drink.getByCocktailId(user.id, params.id)
      : null

    return {
      props: {
        isLoggedIn: Boolean(user),
        user,
        drink,
      },
    }
  },
  sessionOptions
)

export default function Drink({ isLoggedIn, user, drink: favDrink }) {
  const router = useRouter()
  const { drinkSearchResults } = useDrinkContext()[0]
  const drink =
    favDrink ||
    drinkSearchResults.find((d) => d.cocktailId === router.query.id)

  useEffect(() => {
    if (!drink) router.replace('/')
  }, [drink, router])

  const toggleFavorite = async () => {
    const method = favDrink ? 'DELETE' : 'POST'
    const body = favDrink ? { id: favDrink.id } : drink
    const res = await fetch('/api/drink', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) router.replace(router.asPath)
  }

  return (
    <>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Viewing a drink with Barkeep" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={isLoggedIn} username={user?.username} />

      {drink && (
        <main>
          <DrinkInfo {...drink} isFavorite={Boolean(favDrink)} />

          <div className={styles.controls}>
            {!isLoggedIn ? (
              <>
                <p>Want to add this drink to your favorites?</p>
                <Link href="/login" className="button">
                  Login
                </Link>
              </>
            ) : (
              <button onClick={toggleFavorite}>
                {favDrink ? 'Remove from Favorites' : 'Save to Favorites'}
              </button>
            )}
            <button onClick={() => router.back()} className="link-button">
              ← Return
            </button>
          </div>
        </main>
      )}
    </>
  )
}

function DrinkInfo({
  cocktailName,
  thumbnail,
  glassType,
  instructions,
  isFavorite,
  ...rest
}) {
  const ingredientList = []
  for (let i = 1; i <= 20; i++) {
    const ing = rest[`ingredient${i}`] || rest[`strIngredient${i}`]
    const measure = rest[`measure${i}`] || rest[`strMeasure${i}`]
    if (ing && measure) {
      ingredientList.push(`${measure.trim()} ${ing.trim()}`)
    }
  }

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
          <strong>Ingredients:</strong>
          <br />
          {ingredientList.join(', ')}
        </p>
        <p>
          <strong>Instructions:</strong>
          <br />
          {instructions}
        </p>
        <p>
          <strong>Glass:</strong>
          <br />
          {glassType}
        </p>
      </div>
    </>
  )
}
