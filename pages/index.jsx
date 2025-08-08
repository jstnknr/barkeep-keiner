import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Home(props) {
  const router = useRouter();
  const logout = useLogout();
  return (
    <div className={styles.container}>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Barkeep" />
        <link rel="icon" href="/barkeepLogo.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <div className={styles.index}>
      <main className={styles.main}>
      <img src="/barkeepLogo.png" alt="Logo"/>
        <h1 className={styles.title}>
          Welcome to BARKEEP
        </h1>
        <p>Login or Sign Up to discover beverages new and old and craft a collection of bebidas.</p>
      </main>

      <div className={styles.description}>
        <h2 className={styles.subtitle}>What is BARKEEP?</h2>
        <p>
         Quickly find and reference cocktail recipes with Barkeep. This is a tool built for bartenders and cocktail enthusiasts alike. Whether you're unsure of a drink name or helping a guest decide, simply search by base liquor to explore a curated list of cocktails using that spirit.
        </p>
        <p>
          No need to jump between websites or dig through wordy articles. With Barkeep, you can easily save go-to drinks and access them instantly from your personal collection behind the bar.
        </p>
        <p>
          Barkeep delivers each recipe with vibrant images, precise ingredient breakdowns, clear mixing steps, and suggested glassware, all within a clean, bartender-friendly interface.
          </p>
      </div>
      </div>
      <footer className={styles.footer}>
        <p>Barkeep</p>
      </footer>
    </div>
  );
}
