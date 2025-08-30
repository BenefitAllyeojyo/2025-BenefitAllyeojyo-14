import styles from './payReqTextModule.module.css';

export default function PayTitleModule({
  subTitle = '결제 요청',
  ShopName = '레드버튼 보드게임',
  money = 1000000,
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

  const formattedAmount = formatAmount(money);

  return (
    <div className={styles.payReqTextModule}>
      <div className={styles.subTitle}>{subTitle}</div>
      <div className={styles.contentsContainer}>
        <span className={styles.shopName}>{ShopName}</span> 에서
        <br />
        <span className={styles.money}>{formattedAmount}</span> 원을 결제합니다.
      </div>
    </div>
  );
}
