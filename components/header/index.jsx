import Link from 'next/link'
import useLogout from '../../hooks/useLogout'
import styles from './style.module.css'

const Header = ({ isLoggedIn, username }) => {
  const logout = useLogout()

  return (
    <header className={styles.header}>
      <Link href="/">
        <img src="/barkeepLogo.png" alt="Logo" className={styles.logo} />
      </Link>
      <div className={styles.links}>
        {isLoggedIn ? (
          <>
            <span>Hello there, {username}!</span>
            <Link href="/favorites" className={styles.headerlinks}>Favorites</Link>
            <Link href="/search" className={styles.headerlinks}>Search</Link>
            <a href="#"  className={styles.headerlinks} onClick={logout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link href="/search" className={styles.headerlinks}>Search</Link>
            <Link href="/login" className={styles.headerlinks}>Login</Link>
            <Link href="/signup" className={styles.headerlinks}>Sign Up</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
