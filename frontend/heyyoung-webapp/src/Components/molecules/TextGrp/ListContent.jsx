import styles from './ListContent.module.css';
import MiniTagBtn from '@/Components/atoms/Button/MiniTagBtn';

export default function ListContent({ title, distance, tag }) {
  return (
    <div className={styles.ListContent}>
        <div className={styles.ListContentContainer}>
        <div className={styles.ListContentTitle}>{title}</div>
        <MiniTagBtn label={tag} disabled = {false}/>

        </div>

      <div className={styles.ListDistanceContent}>{distance}m</div>
    </div>
  );
}