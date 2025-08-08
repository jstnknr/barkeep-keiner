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
      user: req.session.user || null,
      isLoggedIn: Boolean(req.session.user),
    },
  }),
  sessionOptions
)

export default function Signup({ isLoggedIn }) {
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

    if (!username) return setError('You must include a username!')
    if (!password) return setError('You must include a password!')
    if (password !== confirmPassword)
      return setError('Your passwords must match!')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        return router.push('/search')
      } else {
        const { error: msg } = await res.json()
        setError(msg.startsWith('E11000') ? 'Username already exists' : msg)
      }
    } catch (err) {
      console.error(err)
      setError('Unexpected error—please try again')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Barkeep</title>
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
          {['username', 'password', 'confirmPassword'].map((field) => (
            <label key={field} htmlFor={field}>
              {field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                id={field}
                name={field}
                type={field.includes('password') ? 'password' : 'text'}
                value={form[field]}
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
        <p>© Barkeep 2025</p>
      </footer>
    </div>
  )
}
