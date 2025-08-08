import Link from "next/link"
import DrinkPreview from "../drinkPreview"
import styles from './style.module.css'

export default function DrinkList({drinks}) {
  return (
    <div className={styles.list}>
      {drinks.map(drink => <Link key={drink.cocktailId} href={`/drink/${drink.cocktailId}`} style={{textDecoration: 'none'}}>
        <DrinkPreview {...drink} />
      </Link>)}
    </div>
  )
}