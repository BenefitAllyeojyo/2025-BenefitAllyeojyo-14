import styles from './LocationPin.module.css';

export default function LocationPin({ name, isSchool }) {
  return (
    <div className={styles.locationPin}>
      <div className={styles.pinIcon}>
        {isSchool ? '🏫' : '📍'}
      </div>
      <div className={styles.pinLabel}>
        {name}
      </div>
    </div>
  );
}
