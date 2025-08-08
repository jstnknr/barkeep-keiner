import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Header from '../components/header';


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

export default function Signup(props) {
  const router = useRouter();
  const [
    { username, password, "confirm-password": confirmPassword },
    setForm,
  ] = useState({
    username: "",
    password: "",
    "confirm-password": "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      username,
      password,
      "confirm-password": confirmPassword,
      ...{ [e.target.name]: e.target.value.trim() },
    });
  }

  async function handleCreateAccount(e) {
    e.preventDefault();
    if (!username) 
      return setError("You must include a username!");
    if (!password.trim())
      return setError("You must include a password!");
    if (!confirmPassword.trim())
      return setError("Please confirm your password!");
    if (password !== confirmPassword) 
      return setError("Your passwords must match!");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) 
        return router.push("/search");
      const { error: message } = await res.json();
      const errorFirstPart = message.slice(0,6)
      if (errorFirstPart === "E11000") {
        return setError("Username already exists")
      } else {
        return setError(message);
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Barkeep" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main className={styles.main}>
        <h1>
          Create your account here:
        </h1>

        <form
          className={[styles.card, styles.form].join(" ")}
          onSubmit={handleCreateAccount}
        >
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={username}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />
          <label htmlFor="confirm-password">Confirm Password: </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            onChange={handleChange}
            value={confirmPassword}
          />
          <button>Submit</button>
          {error && <p>{error}</p>}
        </form>
        <Link href="/login">
          <p>Already signed up?</p>
        </Link>
      </main>
      
      <footer className={styles.footer}>
        <p>Barkeep</p>
      </footer>
    </div>
  );
}
