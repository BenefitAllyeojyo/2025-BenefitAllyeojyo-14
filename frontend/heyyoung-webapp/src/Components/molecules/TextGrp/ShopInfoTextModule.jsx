import { MiniTagBtn } from '@/Components/atoms/Button'
import styles from './ShopInfoTextModule.module.css'


export default function ShopInfoTextModule({
    subTitle="캠퍼스 혜택, 전부 모았다!",
    Title="교내 제휴사업을\n내 손 안에!",
  }) {

                
    return (
      <div className={styles.ShopInfoTextModule}>
        {/* <MiniTagBtn label={label}></MiniTagBtn> */}
        <div className={styles.subTitle}>{subTitle}</div>
        <div className={styles.Title}>{Title.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            {index < Title.split('\n').length - 1 && <br />}
          </span>
        ))}</div>
      </div>
    )
  }
    