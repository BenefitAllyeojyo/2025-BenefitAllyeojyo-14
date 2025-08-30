import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css';
import backSvg from '../../../Icons/svg/back.svg';

export default function BackButton({ className, onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      className={`${styles.backButton} ${className || ''}`}
      onClick={handleClick}
      aria-label="이전 페이지로 이동"
    >
      <img 
        src={backSvg} 
        alt="뒤로가기 아이콘"
        className={styles.backIcon}
      />
    </button>
  );
}
