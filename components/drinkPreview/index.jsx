import styles from './style.module.css'

const DrinkPreview = ({ cocktailName, thumbnail }) => (
  <div className={styles.preview}>
    <img src={`${thumbnail}/preview`} alt={cocktailName} />
    <div>
      <p><strong>{cocktailName}</strong></p>
    </div>
  </div>
)

export default DrinkPreview
