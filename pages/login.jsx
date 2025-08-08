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

const fieldDefs = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'password', label: 'Password', type: 'password' },
]

const Login = ({ isLoggedIn, user }) => {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value } }) =>
    setForm((f) => ({ ...f, [name]: value }))

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
    if (res.ok) return router.back()
    const { error: msg } = await res.json()
    setError(msg)
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
          {fieldDefs.map(({ name, label, type }) => (
            <label key={name} htmlFor={name}>
              {label}:
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
              />
            </label>
          ))}

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

export default Login
