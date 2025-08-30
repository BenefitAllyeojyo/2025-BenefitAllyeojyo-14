import styles from './PayResultModule.module.css';

export default function PayResultModule({ 
  label = "결제액", 
  Amount = 10000,
  fontSize = "16px" // 12px 또는 16px
}) {
  //숫자에 천 단위 구분 쉼표 추가하는 함수
  const formatAmount = (amount) => {
    if (typeof amount === 'string') {
      const numericValue = amount.replace(/[^\d]/g, '');
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (typeof amount === 'number') {
      return amount.toLocaleString();
    }
    return amount;
  };

  const formattedAmount = formatAmount(Amount);

  return (
    <div className={styles.PayResultModule}>
      <div className={styles.payResultTitle} style={{ fontSize }}>{label}</div>
      <div className={styles.payResultAmount} style={{ fontSize }}>{`${formattedAmount}원`}</div>
    </div>
  );
}
