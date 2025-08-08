import Head from 'next/head'
import Link from 'next/link'
import { withIronSessionSsr } from 'iron-session/next'
import sessionOptions from '../config/session'
import Header from '../components/header'
import DrinkList from '../components/drinkList'
import db from '../db'
import styles from '../styles/Favorites.module.css'

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user
    if (!user) {
      return {
        redirect: { destination: '/login', permanent: false }
      }
    }

    const favoriteDrinks = await db.drink.getAll(user.id)
    if (favoriteDrinks == null) {
      req.session.destroy()
      return {
        redirect: { destination: '/login', permanent: false }
      }
    }

    return {
      props: { user, favoriteDrinks }
    }
  },
  sessionOptions
)

export default function Favorites({ user, favoriteDrinks }) {
  return (
    <>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Saved drinks" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={!!user} username={user?.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>Favorite Drinks</h1>
        {favoriteDrinks.length > 0 ? (
          <DrinkList drinks={favoriteDrinks} />
        ) : (
          <div className={styles.noDrinks}>
            <p><strong>No favorite drinks saved.</strong></p>
            <p>
              Want to <Link href="/search">go to search</Link> and add some?
            </p>
          </div>
        )}
      </main>
    </>
  )
}
