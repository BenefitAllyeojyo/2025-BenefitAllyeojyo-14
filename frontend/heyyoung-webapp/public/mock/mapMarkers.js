// 성신여자대학교 핀만 표시 (실제 주소 기반)
export const mapMarkers = [
  {
    id: 1,
    lat: 37.5928,
    lng: 127.0164,
    name: '성신여자대학교',
    content: '🏫 성신여자대학교\n서울특별시 성북구 보문로 34다길 2\n학생증 할인 혜택',
    address: '서울특별시 성북구 보문로 34다길 2',
    isSchool: true
  }
];

// 지도 중심 좌표 (성신여자대학교 정확한 위치)
export const mapCenter = {
  lat: 37.5928,
  lng: 127.0164
};

// 지도 기본 설정
export const mapConfig = {
  level: 3,  // 학교 핀을 잘 보이도록 적당한 줌 레벨
  width: 300,
  height: 500
};
