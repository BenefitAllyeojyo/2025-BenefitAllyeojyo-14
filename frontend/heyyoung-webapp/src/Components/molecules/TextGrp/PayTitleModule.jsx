import styles from './payTitleModule.module.css'

export default function PayTitleModule({
    subTitle="결제 요청",
    Title="레드버튼 보드게임",
  }) {

                
    return (
      <div className={styles.payTitleModule}>
        <div className={styles.subTitle}>{subTitle}</div>
        <div className={styles.Title}>{`${Title}`}</div>
      </div>
    )
  }
  