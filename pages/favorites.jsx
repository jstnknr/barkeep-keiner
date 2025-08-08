import Head from "next/head";
import Link from 'next/link';
import styles from "../styles/Favorites.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import DrinkList from "../components/drinkList";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const drinks = await db.drink.getAll(user.id)
    if (drinks === null) {
      req.session.destroy()
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }
    return {
      props: {
        user: req.session.user,
        isLoggedIn: true,
        favoriteDrinks: drinks,
      }
    };
  },
  sessionOptions
);

export default function Favorites(props) {
  return (
    <>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Your favorite drinks" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      <main>
        <h1 className={styles.title}>Favorite Drinks</h1>
        {props.favoriteDrinks.length > 0 ? <DrinkList drinks={props.favoriteDrinks} /> : <NoDrinkText />}
      </main>
    </>
  );
}

function NoDrinkText() {
  return (
    <div className={styles.noDrinks}>
      <p><strong>No favorite drinks saved.</strong></p>
      <p>Want to <Link href="/search">go to search</Link> and add some?</p>
    </div>
  )
}
