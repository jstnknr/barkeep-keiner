import Link from 'next/link'
import DrinkCard from '../drinkCard'
import styles from './style.module.css'

const DrinkResults = ({ drinks }) => (
  <div className={styles.list}>
    {drinks.map((drink) => (
      <Link
        key={drink.cocktailId}
        href={`/drink/${drink.cocktailId}`}
        style={{ textDecoration: 'none' }}
      >
        <DrinkCard {...drink} />
      </Link>
    ))}
  </div>
)

export default DrinkResults
