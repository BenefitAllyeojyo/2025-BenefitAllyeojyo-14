import styles from './ToolTipModule.module.css';
import RegularButton from '../../atoms/Button/RegularButton';

export default function ToolTipModule({ name, content, address, lat, lng, phone, businessHours, startDate, endDate, status, partnershipId, images, partnerships, storeId }) {
  // 파트너십 정보에서 할인율 찾기
  const partnership = partnerships?.find(p => p.partnershipId === partnershipId);
  const discountInfo = partnership ? `${partnership.discountRate}% 할인` : '할인 정보 없음';

  const handleDetailClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('ToolTipModule handleDetailClick 호출됨');
    console.log('ToolTipModule storeId:', storeId);
    console.log('ToolTipModule props:', { name, storeId, partnershipId });
    console.log('이벤트 객체:', e);
    
    if (storeId) {
      console.log('storeId가 있음, 세션스토리지에 저장하고 페이지 이동');
      try {
        // 세션스토리지에 storeId 저장
        sessionStorage.setItem('selectedStoreId', storeId);
        console.log('세션스토리지 저장 완료');
        
        // Router 컨텍스트 밖에서 작동하도록 window.location.href 사용
        window.location.href = `/store-detail`;
      } catch (error) {
        console.error('상세보기 페이지 이동 실패:', error);
      }
    } else {
      console.log('storeId가 없습니다');
    }
  };

  return (
    <div className={`${styles.ToolTipModuleContainer}`}>
      {/* 툴팁 내용과 SVG 화살표를 함께 배치 */}
      <div className={`${styles.ToolContainer}`}>
        <div className={`${styles.ToolTipModuleTitle}`}>{name}</div>
        <div className={`${styles.ToolTipModuleContent}`}>
          {content}
        </div>
        
        {/* 주소와 좌표 정보 */}
        {(address || (lat && lng)) && (
          <div className={styles.locationInfo}>
            {address && (
              <div className={styles.address}>
                📍 {address}
              </div>
            )}
            {businessHours && (
              <div className={styles.businessHours}>
                🕒 영업시간: {businessHours.mon || '정보 없음'}
              </div>
            )}
            {startDate && endDate && (
              <div className={styles.period}>
                📅 {startDate} ~ {endDate}
              </div>
            )}
          </div>
        )}
        <div className={styles.buttonContainer}>
          <RegularButton 
            label="상세보기" 
            white={true}
            onClick={handleDetailClick} 
          />
        </div>

        {/* SVG 화살표를 툴팁 왼쪽 아래 모서리에 배치 */}
        <div className={`${styles.TipContainer}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M0 6L12 18L24 6H0Z" fill="#342961" />
          </svg>
        </div>
      </div>
    </div>
  );
}
