import { useNavigate } from 'react-router-dom'
import BackgroundImage from '../Components/atoms/BackgroundImage'
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage'
import benefitMainImage from '../assets/images/pages/benefit-main.PNG'
import carousel1Image from '../assets/images/carousel/carousel1.png'
import carousel2Image from '../assets/images/carousel/carousel2.png'
import carousel3Image from '../assets/images/carousel/carousel3.png'
import { Carousel } from '@/Components/molecules/Carousel'

export default function BenefitMainPage() {
  // 카루셀 데이터
  const carouselSlides = [
    {
      image: carousel1Image,
    },
    {
      image: carousel2Image,
    },
    {
      image: carousel3Image,
    }
  ]

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <BackgroundImage 
        src={benefitMainImage}
        alt="혜택 메인 배경"
      >
      </BackgroundImage>


      {/* 카루셀 컴포넌트 추가 */}
      <div style={{ 
        position: 'absolute', 
        top: '37%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        width: '90%',
        zIndex: 10
      }}>
        <Carousel slides={carouselSlides} />
      </div>  

      {/* 하단 탭 이미지 - 이제 기본적으로 fixed */}
      <BackgroundBottomTabImage 
        currentTab="benefit"
      />
    </div>
  )
}