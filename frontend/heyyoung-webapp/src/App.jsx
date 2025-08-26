import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import AppShell from './Components/layout/AppShell'
import MainHomePage from './Page/MainHomePage'
import NotificationPage from './Page/NotificationPage'
import BenefitMainPage from './Page/BenefitMainPage'
import EntireMenuPage from './Page/EntireMenuPage'
import Payment from './Page/Payment'
import NotFound from './Page/NotFound'
// TODO: 새로운 제휴 페이지들 import 예정
import PartnershipMainPage from './Page/PartnershipMainPage'
// import PartnershipMapPage from './Page/PartnershipMapPage'
import PartnershipListPage from './Page/PartnershipListPage'
// import PartnershipDetailPage from './Page/PartnershipDetailPage'
import PaymentPage from './Page/PaymentPage'
import PaymentResultPage from './Page/PaymentResultPage'
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
const ButtonExamplePage = lazy(() => import('./Page/ButtonExamplePage'))
const MapView = lazy(() => import('./Page/MapView'))
const StoreDetailPage = lazy(() => import('./Page/StoreDetailPage'))
const NotFound = lazy(() => import('./Page/NotFound'))

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
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo(0, 0);
    
    // SPA 페이지 변경 이벤트 발생
    if (window.ReactNative && window.ReactNative.navigate) {
      // 현재 라우트를 네이티브 앱에 알림
      const routeMap = {
        '/': 'home',
        '/notifications': 'notifications',
        '/benefit-main': 'benefitMain',
        '/entire-menu': 'entireMenu',
        '/pay': 'pay',
        '/button-examples': 'buttonExamples',
        '/benefit-map': 'benefitMap',
        '/store-detail': 'storeDetail'
      };
      
      const currentRoute = routeMap[pathname] || 'home';
      console.log('현재 라우트:', currentRoute);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell>
        <PageTransition>
        <Suspense fallback={<LoadingSpinner />}>

        <Routes>
          <Route path="/" element={<MainHomePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/benefit-main" element={<BenefitMainPage />} />
          <Route path="/entire-menu" element={<EntireMenuPage />} />
          <Route path="/pay" element={<Payment />} />
          {/* TODO: 새로운 제휴 페이지 라우트 예정 */}
          <Route path="/partnership" element={<PartnershipMainPage />} />
          {/* <Route path="/partnership/map" element={<PartnershipMapPage />} /> */}
          <Route path="/partnership/list" element={<PartnershipListPage />} />
          {/* <Route path="/partnership/detail/:id" element={<PartnershipDetailPage />} /> */}
          <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/benefit-map" element={<MapView />} />
            <Route path="/store-detail" element={<StoreDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </PageTransition>
      </AppShell>
    </Router>
  )
}

export default App
