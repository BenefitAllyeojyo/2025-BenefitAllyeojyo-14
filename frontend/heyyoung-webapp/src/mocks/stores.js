// 스토어 mock 데이터
export const stores = [
  // {
  //   id: 1,
  //   name: "스타벅스 관악서울대입구R점",
  //   address: "서울 관악구 관악로 158",
  //   latitude: 37.47927529407993,
  //   longitude: 126.95280377997965,
  //   phone: "02-1234-5678",
  //   businessHoursJson: "{\"fri\": \"07:00-22:00\", \"mon\": \"07:00-22:00\", \"sat\": \"07:00-22:00\", \"sun\": \"07:00-22:00\", \"thu\": \"07:00-22:00\", \"tue\": \"07:00-22:00\", \"wed\": \"07:00-22:00\"}",
  //   startDate: "2025-08-01",
  //   endDate: "2025-09-30",
  //   status: "ACTIVE",
  //   partnershipId: 1,
  //   images: [
  //     "https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png",
  //     "https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png"
  //   ]
  // },
  // {
  //   id: 2,
  //   name: "스타벅스 서울대입구역점",
  //   address: "서울 관악구 남부순환로 1812",
  //   latitude: 37.48116232181828,
  //   longitude: 126.95135823610674,
  //   phone: "02-1234-5678",
  //   businessHoursJson: "{\"fri\": \"07:00-22:00\", \"mon\": \"07:00-22:00\", \"sat\": \"07:00-22:00\", \"sun\": \"07:00-22:00\", \"thu\": \"07:00-22:00\", \"tue\": \"07:00-22:00\", \"wed\": \"07:00-22:00\"}",
  //   startDate: "2025-08-01",
  //   endDate: "2025-09-30",
  //   status: "ACTIVE",
  //   partnershipId: 1,
  //   images: [
  //     "https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png",
  //     "https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png"
  //   ]
  // },
  // {
  //   id: 3,
  //   name: "스타벅스 서울대입구역8번출구점",
  //   address: "서울 관악구 남부순환로 1831",
  //   latitude: 37.4811767606375,
  //   longitude: 126.95365619637556,
  //   phone: "02-1234-5678",
  //   businessHoursJson: "{\"fri\": \"07:00-22:00\", \"mon\": \"07:00-22:00\", \"sat\": \"07:00-22:00\", \"sun\": \"07:00-22:00\", \"thu\": \"07:00-22:00\", \"tue\": \"07:00-22:00\", \"wed\": \"07:00-22:00\"}",
  //   startDate: "2025-08-01",
  //   endDate: "2025-09-30",
  //   status: "ACTIVE",
  //   partnershipId: 1,
  //   images: [
  //     "https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png",
  //     "https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png"
  //   ]
  // }
];

// 서울대입구역 중심 좌표 (스토어들의 중앙점)
export const seoulNationalUniversityCenter = {
  lat: 37.48116232181828,
  lng: 126.95280377997965
};

// 지도 설정
export const mapConfig = {
  center: seoulNationalUniversityCenter,
  level: 4,
  schoolName: '서울대학교',
  width: 800,
  height: 1200
};

// 스토어 데이터를 MapView에서 사용할 수 있는 형식으로 변환
export const convertStoresToMarkers = (stores) => {
  return stores.map(store => ({
    id: store.id,
    name: store.name,
    content: `📍 ${store.name}\n📞 ${store.phone}\n🕒 영업시간: 07:00-22:00\n🎯 제휴 혜택: 커피 할인`,
    address: store.address,
    lat: store.latitude,
    lng: store.longitude,
    isSchool: false,
    // 추가 정보
    phone: store.phone,
    businessHours: store.businessHoursJson,
    startDate: store.startDate,
    endDate: store.endDate,
    status: store.status,
    partnershipId: store.partnershipId,
    images: store.images
  }));
};
