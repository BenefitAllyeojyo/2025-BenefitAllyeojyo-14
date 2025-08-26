import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
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
        '/benefit-map': 'benefitMap',
        '/store-detail': 'storeDetail',
        '/partnership': 'partnership',
        '/partnership/list': 'partnershipList',
        '/payment': 'payment',
        '/payment-result': 'paymentResult'
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
              <Route path="/benefit-map" element={<MapView />} />
              <Route path="/store-detail" element={<StoreDetailPage />} />
              <Route path="/partnership" element={<PartnershipMainPage />} />
              <Route path="/partnership/list" element={<PartnershipListPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment-result" element={<PaymentResultPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AppShell>
    </Router>
  )
}

export default App
