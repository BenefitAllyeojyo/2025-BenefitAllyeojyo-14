import styles from './PayItemModule.module.css'

export default function PayItemModule({
    Amount=10000,
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
      <div className={styles.PayItemModule}>
        <div className={styles.payItemTitle}>이용 금액</div>
        <div className={styles.payItemAmount}>{`${formattedAmount}원`}</div>
      </div>
    )
  }