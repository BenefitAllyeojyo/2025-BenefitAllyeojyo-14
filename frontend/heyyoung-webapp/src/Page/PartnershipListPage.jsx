import { useNavigate } from 'react-router-dom';
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage';
import ShopInfoTextModule from '../Components/molecules/TextGrp/ShopInfoTextModule';
import PartnershipCarouselBanner from '../Components/molecules/PartnershipCarouselBanner';

export default function PartnershipListPage() {
  const navigate = useNavigate();

  // 제휴 정보 데이터
  const partnerships = [
    {
      id: 1,
      shopName: "레드버튼 강북점",
      shopAddress: "서울특별시 강북구 한천로 139길 42",
      tag: "보드게임카페"
    },
    {
      id: 2,
      shopName: "스타벅스 강남점",
      shopAddress: "서울특별시 강남구 테헤란로 123",
      tag: "카페"
    },
    {
      id: 3,
      shopName: "올리브영 홍대점",
      shopAddress: "서울특별시 마포구 홍대로 456",
      tag: "뷰티"
    },
    {
      id: 4,
      shopName: "이마트 잠실점",
      shopAddress: "서울특별시 송파구 올림픽로 240",
      tag: "마트"
    }
  ];

  return (
    <div style={{ position: 'relative', padding:'60px 20px 0 20px', height: '700px', overflow: 'auto', background: '#EFF0FC' }}>
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