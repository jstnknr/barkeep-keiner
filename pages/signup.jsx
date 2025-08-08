// pages/signup.jsx
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
      isLoggedIn: Boolean(req.session.user),
    },
  }),
  sessionOptions
)

const fieldDefs = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
]

const Signup = ({ isLoggedIn }) => {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value } }) =>
    setForm((f) => ({ ...f, [name]: value.trim() }))

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    const { username, password, confirmPassword } = form

    for (const [cond, msg] of [
      [username, 'You must include a username!'],
      [password, 'You must include a password!'],
      [password === confirmPassword, 'Your passwords must match!'],
    ]) {
      if (!cond) return setError(msg)
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) return router.push('/search')

      const { error: msg } = await res.json()
      setError(msg.startsWith('E11000') ? 'Username already exists' : msg)
    } catch {
      setError('Unexpected error—please try again')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>BarKeep</title>
        <meta name="description" content="Barkeep Signup Page" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header isLoggedIn={isLoggedIn} />

      <main className={styles.authenticate}>
        <h1>Create your account here:</h1>

        <form
          onSubmit={handleCreateAccount}
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

          <button type="submit">Submit</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <Link href="/login">
          <p>Already signed up?</p>
        </Link>
      </main>

      <footer className={styles.footer}>
        <p>BarKeep 2025</p>
      </footer>
    </div>
  )
}

export default Signup
