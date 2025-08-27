import styles from './ShopTextModule.module.css';
import MiniTagBtn from '@/Components/atoms/Button/MiniTagBtn';

export default function ShopTextModule({ shopAddress, shopName, tag = "보드게임 카페" ,disabled=true}) {
  return (
    <div className={styles.ShopTextModule}>
      {disabled? <MiniTagBtn label={tag} disabled={false} /> : <></>}

      <div className={styles.shopName}>{`${shopName}`}</div>
      <div className={styles.shopAddress}>{`${shopAddress}`}</div>
    </div>
  );
}
