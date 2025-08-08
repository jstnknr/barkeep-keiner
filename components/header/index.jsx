import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.header}>
      <p>
      <Link href="/">
        <img src="/barkeepLogo.png" alt="Logo" className={styles.logo} />
      </Link>
      <Link href="/" className={styles.siteName} ></Link>
      </p>
      <div className={styles.links}>
        {props.isLoggedIn ? (
          <>
            Welcome, {props.username}!
            <Link href="/favorites">Favorites</Link>
            <Link href="/search">Search</Link>
            <a href="#" onClick={logout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link href="/search">Search</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

