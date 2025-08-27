import styles from './HostInfoModule.module.css';
import RINO_Face from '@/assets/images/character/RINO_Face.png';

export default function HostInfoModule({
  title = '학교 제휴사업 주최자',
  Host = '싸피대학교 총학생회',
}) {
  return (
    <div className={styles.HostInfoModule}>
      <div className={styles.title}>{`${title}`}</div>
      <div className={styles.HostContent}>
        <img className={styles.icon} src={RINO_Face} alt="rino_face" />
        <div className={styles.Host}>{`${Host}`}</div>
      </div>
    </div>
  );
}
