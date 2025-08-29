import { useNavigate } from 'react-router-dom';
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage';
import ShopInfoTextModule from '../Components/molecules/TextGrp/ShopInfoTextModule';
import PartnershipCarouselBanner from '../Components/molecules/PartnershipCarouselBanner';
import { BackButton } from '../Components/atoms/Button';
import logo from '../assets/images/logo.png';

export default function PartnershipListPage() {
  const navigate = useNavigate();

  // 제휴 정보 데이터 - 새로운 데이터 구조로 업데이트 (위도/경도 포함)
  const partnerships = [
    {
      id: 1,
      shopName: "스타벅스 관악서울대입구R점",
      shopAddress: "서울 관악구 관악로 158",
      tag: "카페",
      terms: "10% off for university students",
      hostName: "총학생회",
      latitude: 126.95280377997965,
      longitude: 37.47927529407993
    },
    {
      id: 2,
      shopName: "스타벅스 서울대입구역점",
      shopAddress: "서울 관악구 남부순환로 1812",
      tag: "카페",
      terms: "10% off for university students",
      hostName: "총학생회",
      latitude: 126.95135823610674,
      longitude: 37.48116232181828
    },
    {
      id: 3,
      shopName: "스타벅스 서울대입구역8번출구점",
      shopAddress: "서울 관악구 남부순환로 1831",
      tag: "카페",
      terms: "10% off for university students",
      hostName: "총학생회",
      latitude: 126.95365619637556,
      longitude: 37.4811767606375
    },
    {
      id: 4,
      shopName: "올리브영 관악 타운",
      shopAddress: "서울 관악구 관악로 173",
      tag: "뷰티",
      terms: "10% off for university students",
      hostName: "컴퓨터공학과 학생회",
      latitude: 126.95227152324334,
      longitude: 37.480662634299556
    },
    {
      id: 5,
      shopName: "올리브영 서울대입구역점",
      shopAddress: "서울 관악구 남부순환로 1840 올리브영",
      tag: "뷰티",
      terms: "10% off for university students",
      hostName: "컴퓨터공학과 학생회",
      latitude: 126.95430397934122,
      longitude: 37.48034357962654
    }
  ];

  return (
    <div style={{ position: 'relative', padding:'60px 20px 0 20px', height: '700px', overflow: 'auto', background: '#EFF0FC' }}>
      {/* 대학교 로고 - 왼쪽 상단 */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 10
        }}
      >
        <img 
          src={logo} 
          alt="대학교 로고" 
          style={{
            width: 'auto',
            height: '45px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* 뒤로가기 버튼 영역 */}
      <div
        style={{
          position: 'absolute',
          top: '17px',
          right: '20px',
          zIndex: 10
        }}
      >
        <BackButton />
      </div>

      {/* ShopInfoTextModule 컴포넌트 */}
      <div>
        <ShopInfoTextModule 
          subTitle="지금 쓰기 좋은"
        />
      </div>

      {/* PartnershipCarouselBanner 컴포넌트 */}
      <PartnershipCarouselBanner 
        width="350px"
        height="480px"
        background="linear-gradient(180deg, #DDD7FF 0%, #F9E8DA 100%)"
        borderRadius="16px"
        partnerships={partnerships}
      >
      </PartnershipCarouselBanner>
      
      {/* 하단 탭 이미지 */}
      {/* <BackgroundBottomTabImage 
        currentTab="benefit"
        position="absolute"
      /> */}
    </div>
  );
}