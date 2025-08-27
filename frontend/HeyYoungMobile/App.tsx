import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  BackHandler,
  Linking,
  Image,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://meek-babka-83628e.netlify.app/');
  const [progress, setProgress] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);
  const [currentRoute, setCurrentRoute] = useState('home');

  const webViewRef = useRef<WebView>(null);

  // SPA 라우트 정의
  const routes = {
    home: 'https://meek-babka-83628e.netlify.app/benefit-map',
    notifications: 'https://meek-babka-83628e.netlify.app/notifications',
    benefitMain: 'https://meek-babka-83628e.netlify.app/benefit-main',
    entireMenu: 'https://meek-babka-83628e.netlify.app/entire-menu',
    pay: 'https://meek-babka-83628e.netlify.app/pay',
    buttonExamples: 'https://meek-babka-83628e.netlify.app/button-examples',
    benefitMap: 'https://meek-babka-83628e.netlify.app/benefit-map',
    storeDetail: 'https://meek-babka-83628e.netlify.app/store-detail',
  };

  // Android 뒤로가기 버튼 처리 (SPA 라우팅과 연동)
  useEffect(() => {
    const backAction = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      } else if (currentRoute !== 'home') {
        // SPA 라우팅에서 홈으로 돌아가기
        navigateToRoute('home');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack, currentRoute]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
    
    // SPA 라우트 감지 및 상태 업데이트
    const detectedRoute = detectRouteFromUrl(navState.url);
    if (detectedRoute) {
      setCurrentRoute(detectedRoute);
    }
    
    // 특정 URL에서 네이티브 기능 활성화
    if (navState.url.includes('store-detail')) {
      console.log('가게 상세 페이지 진입');
    }
  };

  // URL에서 라우트 감지
  const detectRouteFromUrl = (url: string): string | null => {
    if (url.includes('/notifications')) return 'notifications';
    if (url.includes('/benefit-main')) return 'benefitMain';
    if (url.includes('/entire-menu')) return 'entireMenu';
    if (url.includes('/pay')) return 'pay';
    if (url.includes('/button-examples')) return 'buttonExamples';
    if (url.includes('/benefit-map')) return 'benefitMap';
    if (url.includes('/store-detail')) return 'storeDetail';
    if (url.endsWith('/') || url.endsWith('.netlify.app')) return 'home';
    return null;
  };

  // SPA 라우트로 네비게이션
  const navigateToRoute = (routeKey: string) => {
    const url = routes[routeKey as keyof typeof routes];
    if (url) {
      setCurrentRoute(routeKey);
      setCurrentUrl(url);
      setWebViewKey(prev => prev + 1); // WebView 재로드로 SPA 라우팅 활성화
    }
  };

  // 하단 탭 클릭 핸들러
  const handleTabClick = (tab: string) => {
    console.log(`${tab} 탭 클릭됨`);
    
    // 현재 탭과 같은 탭을 클릭하면 아무것도 하지 않음
    if (tab === currentRoute) {
      return;
    }
    
    switch(tab) {
      case 'home': // 학사 탭
        navigateToRoute('home');
        break;
      case 'benefit': // 혜택 탭
        navigateToRoute('benefitMain');
        break;
      case 'menu': // 메뉴 탭
        navigateToRoute('entireMenu');
        break;
    }
  };

  // 현재 탭에 따른 하단바 이미지 선택 (이미지가 없으므로 임시로 제거)
  // const getTabImage = () => {
  //   switch(currentRoute) {
  //     case 'home':
  //       return require('./assets/images/pages/bottom-tab1.png');
  //     case 'benefitMain':
  //       return require('./assets/images/pages/bottom-tab2.PNG');
  //     case 'entireMenu':
  //       return require('./assets/images/pages/bottom-tab3.PNG');
  //     default:
  //       return require('./assets/images/pages/bottom-tab1.png');
  //   }
  // };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    setIsOffline(true);
  };

  const handleWebViewHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('HTTP Error:', nativeEvent.statusCode);
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView에서 받은 메시지:', data);
      
      // 웹에서 SPA 라우팅 요청 시 처리
      if (data.type === 'NAVIGATE' && data.route) {
        navigateToRoute(data.route);
      }
    } catch (error) {
      console.log('WebView 메시지 파싱 오류:', error);
    }
  };

  // SPA 최적화를 위한 JavaScript 주입
  const injectJavaScript = `
    // 웹뷰에서 네이티브 기능 호출할 수 있는 함수 추가
    window.ReactNative = {
      share: function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SHARE'
        }));
      },
      navigate: function(route) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'NAVIGATE',
          route: route
        }));
      },
      goHome: function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'NAVIGATE',
          route: 'home'
        }));
      }
    };
    
    // 웹뷰 로드 완료 알림
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'LOADED',
      url: window.location.href
    }));
    
    // SPA 라우팅 최적화
    if (window.history && window.history.pushState) {
      // 브라우저 히스토리 API 최적화
      const originalPushState = window.history.pushState;
      window.history.pushState = function(state, title, url) {
        originalPushState.call(this, state, title, url);
        // SPA 라우팅 변경 시 네이티브에 알림
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'ROUTE_CHANGED',
          url: url
        }));
      };
    }
    
    // 확대/축소만 방지하는 CSS 추가
    const style = document.createElement('style');
    style.textContent = \`
      html, body {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      
      /* 확대 방지 */
      * {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -khtml-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* iOS에서 확대 방지 */
      input, textarea, select, button {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
        font-size: 16px !important;
      }
      
      /* 스크롤바 숨김 */
      ::-webkit-scrollbar {
        display: none !important;
      }
      
      /* SPA 전환 애니메이션 최적화 */
      .page-transition {
        transition: opacity 0.3s ease-in-out;
      }
      
      /* 터치 반응성 향상 */
      * {
        -webkit-touch-action: manipulation;
        touch-action: manipulation;
      }
    \`;
    document.head.appendChild(style);
    
    // 핀치 줌 제스처만 차단 (확대/축소 방지)
    function preventZoom(e) {
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    
    // 제스처 이벤트로 확대 방지
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { passive: false });
    
    document.addEventListener('gesturechange', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { passive: false });
    
    document.addEventListener('gestureend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { passive: false });
    
    // 멀티터치만 차단 (핀치 줌 방지)
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    
    // 더블탭으로 확대 방지
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      lastTouchEnd = now;
    }, { passive: false });
    
    // viewport 메타 태그 수정 (확대만 방지)
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover');
    } else {
      const newViewport = document.createElement('meta');
      newViewport.name = 'viewport';
      newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(newViewport);
    }
    
    true;
  `;

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* SPA 페이지 전환 로딩 인디케이터 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7435FD" />
          <Text style={styles.loadingText}>페이지 로딩 중...</Text>
        </View>
      )}

      {/* WebView - SPA 라우팅 활성화 */}
      <WebView
        key={webViewKey}
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        allowsLinkPreview={false}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => {
          setIsLoading(false);
          setIsOffline(false);
        }}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        onError={handleWebViewError}
        onHttpError={handleWebViewHttpError}
        onMessage={handleWebViewMessage}
        injectedJavaScript={injectJavaScript}
        userAgent="HeyYoungMobile/1.0"
        cacheEnabled={true}
        incognito={false}
        pullToRefreshEnabled={false}
        scrollEnabled={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        allowsBackForwardNavigationGestures={false}
        dataDetectorTypes="none"
        hideKeyboardAccessoryView={true}
        keyboardDisplayRequiresUserAction={false}
        mixedContentMode="never"
        overScrollMode="never"
        nestedScrollEnabled={true}
      />

      {/* React Native 하단 네비게이션 바 */}
      <View style={styles.bottomNavigationBar}>
        {/* 하단바 배경 이미지 */}
        {/* <Image 
          source={getTabImage()}
          style={styles.bottomTabImage}
          resizeMode="stretch"
        /> */}
        
        {/* 3개 섹션으로 나눈 탭 버튼들 */}
        <View style={styles.tabButtonsContainer}>
          {/* 학사 섹션 (왼쪽 1/3) */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabClick('home')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name="school" 
                size={24} 
                color={currentRoute === 'home' ? "#7435FD" : "#666"} 
              />
              <Text style={[
                styles.tabText, 
                currentRoute === 'home' && styles.tabTextActive
              ]}>
                학사
              </Text>
            </View>
          </TouchableOpacity>

          {/* 혜택 섹션 (가운데 1/3) */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabClick('benefit')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name="gift" 
                size={24} 
                color={currentRoute === 'benefitMain' ? "#7435FD" : "#666"} 
              />
              <Text style={[
                styles.tabText, 
                currentRoute === 'benefitMain' && styles.tabTextActive
              ]}>
                혜택
              </Text>
            </View>
          </TouchableOpacity>

          {/* 전체메뉴 섹션 (오른쪽 1/3) */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabClick('menu')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name="menu" 
                size={24} 
                color={currentRoute === 'entireMenu' ? "#7435FD" : "#666"} 
              />
              <Text style={[
                styles.tabText, 
                currentRoute === 'entireMenu' && styles.tabTextActive
              ]}>
                메뉴
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 현재 라우트 표시 (디버깅용) */}
      {/* <View style={styles.routeIndicator}>
        <Text style={styles.routeText}>현재: {currentRoute}</Text>
      </View> */}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  routeIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : (StatusBar.currentHeight || 0) + 10,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
    zIndex: 10,
  },
  routeText: {
    fontSize: 14,
    color: '#333',
  },
  bottomNavigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomTabImage: {
    // 이미지가 없으므로 제거
    display: 'none',
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    height: 60,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    marginTop: 4,
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#7435FD',
    fontWeight: 'bold',
  },
});
