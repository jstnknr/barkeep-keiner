import styles from './style.module.css'

export default function DrinkPreview({
  cocktailName,
  thumbnail
}) {
  return (
    <div className={styles.preview}>
      <img src={thumbnail+"/preview"} alt={cocktailName} />
      <div>
        <p><strong>{cocktailName}</strong></p>
      </div>
    </div>
  )
}