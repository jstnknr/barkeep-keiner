import Head from 'next/head'
import Link from 'next/link'
import { withIronSessionSsr } from 'iron-session/next'
import sessionOptions from '../config/session'
import Header from '../components/header'
import DrinkResults from '../components/drinkResults'
import db from '../db'
import styles from '../styles/Favorites.module.css'

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user
    if (!user) {
      return { redirect: { destination: '/login', permanent: false } }
    }

    const favoriteDrinks = await db.drink.getAll(user.id)
    if (!favoriteDrinks) {
      req.session.destroy()
      return { redirect: { destination: '/login', permanent: false } }
    }

    return { props: { user, favoriteDrinks } }
  },
  sessionOptions
)

export default function Favorites({ user, favoriteDrinks }) {
  return (
    <>
      <Head>
        <title>BarKeep</title>
        <meta name="description" content="Saved drinks" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={!!user} username={user?.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>Favorite Cocktails</h1>
        {favoriteDrinks.length ? (
          <DrinkResults drinks={favoriteDrinks} />
        ) : (
          <div className={styles.noDrinks}>
            <p><strong>You haven't collected any drinks yet.</strong></p>
            <p>
              Click here to <Link href="/search">go back</Link> and add some?
            </p>
          </div>
        )}
      </main>
    </>
  )
}
