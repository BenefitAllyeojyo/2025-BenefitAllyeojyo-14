import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy, useState } from 'react'
import AppShell from './Components/layout/AppShell'
import PageTransition from './Components/layout/PageTransition'
import './App.css'

// React Native 브리지 초기화
import './utils/reactNativeBridge'

// Lazy Loading으로 페이지 컴포넌트 로드
const MainHomePage = lazy(() => import('./Page/MainHomePage'))
const NotificationPage = lazy(() => import('./Page/NotificationPage'))
const BenefitMainPage = lazy(() => import('./Page/BenefitMainPage'))
const EntireMenuPage = lazy(() => import('./Page/EntireMenuPage'))
const Payment = lazy(() => import('./Page/Payment'))
const MapView = lazy(() => import('./Page/MapView'))
const StoreDetailPage = lazy(() => import('./Page/StoreDetailPage'))
const NotFound = lazy(() => import('./Page/NotFound'))
const PartnershipMainPage = lazy(() => import('./Page/PartnershipMainPage'))
const PartnershipListPage = lazy(() => import('./Page/PartnershipListPage'))
const PaymentPage = lazy(() => import('./Page/PaymentPage'))
const PaymentResultPage = lazy(() => import('./Page/PaymentResultPage'))

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#7435FD'
  }}>
    <div>로딩 중...</div>
  </div>
)

// SPA 최적화를 위한 스크롤 관리
function ScrollToTop({ setBackgroundColor }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo(0, 0);
    
    // 페이지별 배경색 설정
    const getBackgroundColor = (pathname) => {
      const colorMap = {
        '/': '#F2F2F2', // 메인 홈 - 회색
        '/notifications': '#F2F2F2', // 알림 - 바이올렛
        '/benefit-main': 'var(--grad-benefit)', // 혜택 메인 - 그라데이션
        '/entire-menu': '#f5f6fa', // 전체 메뉴 - 기본색
        '/pay': '#542BA8', // 결제 - 보라색
        '/benefit-map': '#7635FD', // 지도 - 바이올렛
        '/store-detail': '#f5f6fa', // 매장 상세 - 기본색
        '/partnership': '#EFF0FC', // 파트너십 - 연한 보라색
        '/partnership-list': '#7635FD', // 파트너십 리스트 - 바이올렛
        '/payment': '#542BA8', // 결제 페이지 - 보라색
        '/payment-result': '#7635FD', // 결제 결과 - 바이올렛
      }
      return colorMap[pathname] || 'var(--color-bg)'
    }
    
    // 배경색 업데이트
    const newBackgroundColor = getBackgroundColor(pathname);
    setBackgroundColor(newBackgroundColor);
    console.log('페이지 변경:', pathname, '배경색:', newBackgroundColor);
    
    // SPA 페이지 변경 이벤트 발생
    if (window.ReactNative && window.ReactNative.navigate) {
      // 현재 라우트를 네이티브 앱에 알림
      const routeMap = {
        '/': 'home',
        '/notifications': 'notifications',
        '/benefit-main': 'benefitMain',
        '/entire-menu': 'entireMenu',
        '/pay': 'pay',
        '/benefit-map': 'benefitMap',
        '/store-detail': 'storeDetail',
        '/partnership': 'partnership',
        '/partnership-list': 'partnershipList',
        '/payment': 'payment',
        '/payment-result': 'paymentResult'
      };
      
      const currentRoute = routeMap[pathname] || 'home';
      console.log('현재 라우트:', currentRoute);
    }
  }, [pathname, setBackgroundColor]);

  return null;
}

function App() {
  const [backgroundColor, setBackgroundColor] = useState('var(--color-bg)')

  // 페이지별 배경색 설정
  const getBackgroundColor = (pathname) => {
    const colorMap = {
      '/': '#F2F2F2', // 메인 홈 - 보라색
      '/notifications': '#F2F2F2', // 알림 - 바이올렛
      '/benefit-main': 'var(--grad-benefit)', // 혜택 메인 - 그라데이션
      '/entire-menu': '#f5f6fa', // 전체 메뉴 - 기본색
      '/pay': '#542BA8', // 결제 - 보라색
      '/benefit-map': '#7635FD', // 지도 - 바이올렛
      '/store-detail': '#f5f6fa', // 매장 상세 - 기본색
      '/partnership': '#EFF0FC', // 파트너십 - 보라색
      '/partnership-list': '#7635FD', // 파트너십 리스트 - 바이올렛
      '/payment': '#542BA8', // 결제 페이지 - 보라색
      '/payment-result': '#7635FD', // 결제 결과 - 바이올렛
    }
    return colorMap[pathname] || 'var(--color-bg)'
  }

  return (
    <Router>
      <ScrollToTop setBackgroundColor={setBackgroundColor} />
      <AppShell backgroundColor={backgroundColor}>
        <PageTransition>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<MainHomePage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/notifications" element={<NotificationPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/benefit-main" element={<BenefitMainPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/entire-menu" element={<EntireMenuPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/pay" element={<Payment setBackgroundColor={setBackgroundColor} />} />
              <Route path="/benefit-map" element={<MapView setBackgroundColor={setBackgroundColor} />} />
              <Route path="/store-detail" element={<StoreDetailPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/partnership" element={<PartnershipMainPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/partnership-list" element={<PartnershipListPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/payment" element={<PaymentPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="/payment-result" element={<PaymentResultPage setBackgroundColor={setBackgroundColor} />} />
              <Route path="*" element={<NotFound setBackgroundColor={setBackgroundColor} />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AppShell>
    </Router>
  )
}

export default App
