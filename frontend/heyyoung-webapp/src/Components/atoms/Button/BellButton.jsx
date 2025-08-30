import { useNavigate } from 'react-router-dom';
import styles from './BellButton.module.css';
import bellSvg from '../../../Icons/svg/bell.svg';

export default function BellButton({ className, onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate('/notifications');
    }
  };

  return (
    <button 
      className={`${styles.bellButton} ${className || ''}`}
      onClick={handleClick}
      aria-label="알림 페이지로 이동"
    >
      <img 
        src={bellSvg} 
        alt="알림 아이콘"
        className={styles.bellIcon}
      />
    </button>
  );
}
