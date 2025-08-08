import Head from 'next/head';
import { withIronSessionSsr } from 'iron-session/next';
import sessionOptions from '../config/session';
import styles from '../styles/Home.module.css';
import Header from '../components/header';

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user || null;
    return {
      props: {
        isLoggedIn: !!user,
        user,
      },
    };
  },
  sessionOptions
);

export default function Home({ isLoggedIn, user }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>BarKeep</title>
        <meta name="description" content="Barkeep" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={isLoggedIn} username={user?.username} />

      <div className={styles.index}>
        <main className={styles.main}>
          <img src="/barkeepLogo.png" alt="Barkeep Logo" />
          <h1 className={styles.title}>Welcome to Barkeep</h1>
          <p>
            Login or sign up to discover new and classic beverages, and build
            your personal collection.
          </p>
        </main>

        <section className={styles.description}>
          <h2 className={styles.subtitle}>What is BarKeep?</h2>
          <p>
            Quickly find and reference drink recipes with BarKeep. A tool for bartenders, whether
            you're unsure of a drink recipe or want helping a guest decide, simply
            search by base liquor or drinkto explore a curated list of cocktails.
          </p>
          <p>
            With this app there is no need to scroll through unnecessary drink info. Save
            favorites and access them when you have time behind the bar.
          </p>
          <p>
            Each recipe includes an image of the drink, ingredients, recipe, and suggested glassware in a clean, easy to read card.
          </p>
        </section>
      </div>

      <footer className={styles.footer}>
        <p>© Barkeep 2025</p>
      </footer>
    </div>
  );
}
