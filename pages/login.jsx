import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import sessionOptions from '../config/session'
import Header from '../components/header'
import styles from '../styles/Home.module.css'

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => ({
    props: {
      user: req.session.user || null,
      isLoggedIn: Boolean(req.session.user),
    },
  }),
  sessionOptions
)

export default function Login({ isLoggedIn, user }) {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }))

  const handleLogin = async (e) => {
    e.preventDefault()
    const { username, password } = form

    if (!username.trim() || !password.trim()) {
      return setError('Must include username and password')
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.back()
    } else {
      const { error: message } = await res.json()
      setError(message)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Barkeep</title>
        <meta name="description" content="Barkeep Login Page" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header isLoggedIn={isLoggedIn} username={user?.username} />

      <main className={styles.authenticate}>
        <h1>Login Here:</h1>

        <form
          onSubmit={handleLogin}
          className={`${styles.card} ${styles.form}`}
        >
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">Login</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <Link href="/signup">
          <p className={styles.signup}>Need to sign up?</p>
        </Link>
      </main>

      <footer className={styles.footer}>
        <p>© Barkeep 2025</p>
      </footer>
    </div>
  )
}
