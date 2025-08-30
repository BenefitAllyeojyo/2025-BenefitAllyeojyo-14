import styles from './CategoryTextModule.module.css'

export default function CategoryTextModule({
    Title="교내 제휴 보기",fromDate="2025-01-01",toDate="2025-01-01"
  }) {

                
    return (
      <div className={styles.CategoryTextModule}>
        <div className={styles.title}>{`${Title}`}</div>
        <div className={styles.date}>{`${fromDate} - ${toDate}`}</div>
      </div>
    )
  }
  