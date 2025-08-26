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

  const webViewRef = useRef<WebView>(null);

  // Android 뒤로가기 버튼 처리
  useEffect(() => {
    const backAction = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
    
    // 특정 URL에서 네이티브 기능 활성화
    if (navState.url.includes('store-detail')) {
      console.log('가게 상세 페이지 진입');
    }
  };

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
    } catch (error) {
      console.log('WebView 메시지 파싱 오류:', error);
    }
  };

  const injectJavaScript = `
    // 웹뷰에서 네이티브 기능 호출할 수 있는 함수 추가
    window.ReactNative = {
      share: function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SHARE'
        }));
      },
      navigate: function(screen) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'NAVIGATE',
          screen: screen
        }));
      }
    };
    
    // 웹뷰 로드 완료 알림
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'LOADED',
      url: window.location.href
    }));
    
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
      
      {/* WebView - 화면 전체를 꽉 채움 */}
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
});

