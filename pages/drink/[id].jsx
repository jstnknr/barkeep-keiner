import Head from 'next/head'
import { useRouter } from "next/router"
import Link from 'next/link'
import { useEffect } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import { useDrinkContext } from "../../context/drink"
import Header from '../../components/header'
import db from '../../db'
import styles from '../../styles/Drink.module.css'

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, params }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
      const drink = await db.drink.getByCocktailId(req.session.user.id, params.id)
      if (drink) props.drink = drink
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

export default function Drink(props) {
  const router = useRouter()
  const drinkId = router.query.id
  const { isLoggedIn } = props
  const [{drinkSearchResults}] = useDrinkContext()

  let isFavoriteDrink = false
  let drink
  if (props.drink) {
    drink = props.drink
    isFavoriteDrink = true
  } else
    drink = drinkSearchResults.find(drink => drink.cocktailId === drinkId)

  useEffect(() => {
    if (!props.drink && !drink)
      router.push('/')
  }, [props.drink, drinkSearchResults, drink, router])

  async function addToFavorites() {
    const res = await fetch('/api/drink', {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(drink)
    })
    if (res.status === 200) {
      router.replace(router.asPath)
    }
  }
  
  async function removeFromFavorites() {
    const res = await fetch('/api/drink', {
      method: 'DELETE',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({id: drink.id})
    })
    if (res.status === 200) {
      router.replace(router.asPath)
    }
  }

  return (
    <>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Viewing a drink with Barkeep " />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>
      
      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      
      {
        drink &&
        <main>
          <DrinkInfo isFavorite={isFavoriteDrink} {...drink}/>
          <div className={styles.controls}>
            {
              !isLoggedIn
              ? <>
                  <p>Want to add this drink to your favorites?</p>
                  <Link href="/login" className="button">Login</Link>
                </>
              : isFavoriteDrink
              ? <button onClick={removeFromFavorites}>
                  Remove from Favorites
                </button>
              : <button onClick={addToFavorites}>
                  Save to Favorites
                </button>
            }

            <a href="#" onClick={() => router.back()}>
              ←Return
            </a>
          </div>
        </main>
      }
    </>
  )
}

function DrinkInfo({
  cocktailName,
  instructions,
  thumbnail,
  glassType,
  isFavorite,
  ingredient1,
  ingredient2,
  ingredient3,
  ingredient4,
  ingredient5,
  ingredient6,
  ingredient7,
  ingredient8,
  ingredient9,
  ingredient10,
  ingredient11,
  ingredient12,
  ingredient13,
  ingredient14,
  ingredient15,
  measure1,
  measure2,
  measure3,
  measure4,
  measure5,
  measure6,
  measure7,
  measure8,
  measure9,
  measure10,
  measure11,
  measure12,
  measure13,
  measure14,
  measure15
}) {
  let ingredients = ""
  if ( ingredient1 && measure1) {
    ingredients += measure1 + " " + ingredient1
    if ( ingredient2 && measure2) {
      ingredients += ", " + measure2 + " " + ingredient2
      if ( ingredient3 && measure3) {
        ingredients += ", " + measure3 + " " + ingredient3
        if ( ingredient4 && measure4) {
          ingredients += ", " + measure4 + " " + ingredient4
          if ( ingredient5 && measure5) {
            ingredients += ", " + measure5 + " " + ingredient5
            if ( ingredient6 && measure6) {
              ingredients += ", " + measure6 + " " + ingredient6
              if ( ingredient7 && measure7) {
                ingredients += ", " + measure7 + " " + ingredient7
                if ( ingredient8 && measure8) {
                  ingredients += ", " + measure8 + " " + ingredient8
                  if ( ingredient9 && measure9) {
                    ingredients += ", " + measure9 + " " + ingredient9
                    if ( ingredient10 && measure10) {
                      ingredients += ", " + measure10 + " " + ingredient10
                      if ( ingredient11 && measure11) {
                        ingredients += ", " + measure11 + " " + ingredient11
                        if ( ingredient12 && measure12) {
                          ingredients += ", " + measure12 + " " + ingredient12
                          if ( ingredient13 && measure13) {
                            ingredients += ", " + measure13 + " " + ingredient13
                            if ( ingredient14 && measure14) {
                              ingredients += ", " + measure14 + " " + ingredient14
                              if ( ingredient15 && measure15) {
                                ingredients += ", " + measure15 + " " + ingredient15
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return (
    <>
      <div className={styles.titleGroup}>
        <div>
          <h1>{cocktailName}{isFavorite && <sup>★</sup>}</h1>
        </div>
        <img src={thumbnail+"/preview"} alt={cocktailName} />
      </div>
      <div className={styles.drinkInformation}>
        <p>Ingredients:<br/>{ingredients}</p>
        <p>Instructions:<br/>{instructions}</p>
        <p>Glass:<br/>{glassType}</p>
      </div>
    </>
  )
}
