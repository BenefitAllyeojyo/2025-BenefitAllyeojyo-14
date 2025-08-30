import styles from './TextModule1.module.css'

export default function TextModule1({
    subTitle="캠퍼스 혜택, 전부 모았다!",
    Title="교내 제휴사업을\n내 손 안에!",
  }) {

                
    return (
      <div className={styles.TextModule1}>
        <div className={styles.subTitle}>{subTitle}</div>
        <div className={styles.Title}>{`${Title}`}</div>
      </div>
    )
  }
  