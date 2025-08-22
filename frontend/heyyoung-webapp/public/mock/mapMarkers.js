// 성신여대 근처 가게들의 mock 데이터
export const mapMarkers = [
  {
    id: 1,
    lat: 37.5925,
    lng: 127.0163,
    name: '성신여자대학교',
    content: '🏫',
    isSchool: true
  },
  {
    id: 2,
    lat: 37.5928,
    lng: 127.0168,
    name: '스타벅스 성신여대점',
    content: '☕ 학생증 제시 시 음료 10% 할인\n🍰 케이크 구매 시 음료 무료 업그레이드\n📱 모바일 주문 시 포인트 2배 적립',
    isSchool: false
  },
  {
    id: 3,
    lat: 37.5922,
    lng: 127.0158,
    name: '맥도날드 성신여대점',
    content: '🍔 학생증 제시 시 세트메뉴 15% 할인\n🍟 사이드 메뉴 무료 업그레이드\n🎫 생일자 할인 쿠폰 제공',
    isSchool: false
  },
  {
    id: 4,
    lat: 37.5930,
    lng: 127.0170,
    name: '올리브영 성신여대점',
    content: '💄 학생증 제시 시 전체 상품 20% 할인\n🧴 화장품 샘플 무료 증정\n🎁 3만원 이상 구매 시 선물세트 증정',
    isSchool: false
  },
  {
    id: 5,
    lat: 37.5920,
    lng: 127.0160,
    name: 'GS25 성신여대점',
    content: '🏪 학생증 제시 시 즉석식품 30% 할인\n🥤 음료 2+1 이벤트\n📱 모바일 결제 시 포인트 3배 적립',
    isSchool: false
  },
  {
    id: 6,
    lat: 37.5932,
    lng: 127.0172,
    name: '교보문고 성신여대점',
    content: '📚 학생증 제시 시 교재 25% 할인\n📖 일반 도서 15% 할인\n🎓 졸업생 할인 혜택 추가 제공',
    isSchool: false
  }
];

// 지도 중심 좌표 (성신여대)
export const mapCenter = {
  lat: 37.5925,
  lng: 127.0163
};

// 지도 기본 설정
export const mapConfig = {
  level: 3,
  width: 600,
  height: 500
};
