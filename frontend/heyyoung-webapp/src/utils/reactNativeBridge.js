// React Native 앱과의 연동을 위한 브리지
class ReactNativeBridge {
  constructor() {
    this.isInReactNative = this.detectReactNative();
    this.listeners = new Map();
    this.init();
  }

  // React Native 환경 감지
  detectReactNative() {
    return typeof window !== 'undefined' && 
           window.ReactNativeWebView !== undefined;
  }

  // 초기화
  init() {
    if (this.isInReactNative) {
      this.setupMessageListener();
      console.log('React Native 환경에서 실행 중');
    } else {
      console.log('웹 브라우저에서 실행 중');
    }
  }

  // 메시지 리스너 설정
  setupMessageListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.log('메시지 파싱 오류:', error);
        }
      });
    }
  }

  // 메시지 처리
  handleMessage(data) {
    const { type, payload } = data;
    
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => callback(payload));
    }
  }

  // 네이티브 앱으로 메시지 전송
  postMessage(type, payload = {}) {
    if (this.isInReactNative && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type,
        payload,
        timestamp: Date.now()
      }));
    }
  }

  // 네이티브 앱으로 네비게이션 요청
  navigate(route) {
    this.postMessage('NAVIGATE', { route });
  }

  // 홈으로 이동
  goHome() {
    this.postMessage('NAVIGATE', { route: 'home' });
  }

  // 공유 기능
  share(content) {
    this.postMessage('SHARE', { content });
  }

  // 네이티브 기능 호출
  callNativeFunction(functionName, params = {}) {
    this.postMessage('CALL_FUNCTION', { 
      functionName, 
      params 
    });
  }

  // 이벤트 리스너 등록
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }

  // 이벤트 리스너 제거
  removeEventListener(type, callback) {
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // 현재 환경 확인
  getEnvironment() {
    return {
      isReactNative: this.isInReactNative,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    };
  }

  // 네이티브 앱 정보 가져오기
  getAppInfo() {
    return new Promise((resolve) => {
      if (this.isInReactNative) {
        this.addEventListener('APP_INFO', resolve);
        this.postMessage('GET_APP_INFO');
        
        // 타임아웃 설정
        setTimeout(() => {
          resolve({ error: 'timeout' });
        }, 5000);
      } else {
        resolve({ error: 'not_react_native' });
      }
    });
  }
}

// 싱글톤 인스턴스 생성
const reactNativeBridge = new ReactNativeBridge();

// 전역 객체에 등록 (기존 코드와의 호환성)
if (typeof window !== 'undefined') {
  window.ReactNative = {
    navigate: (route) => reactNativeBridge.navigate(route),
    goHome: () => reactNativeBridge.goHome(),
    share: (content) => reactNativeBridge.share(content),
    callFunction: (name, params) => reactNativeBridge.callNativeFunction(name, params),
    addEventListener: (type, callback) => reactNativeBridge.addEventListener(type, callback),
    removeEventListener: (type, callback) => reactNativeBridge.removeEventListener(type, callback),
    getEnvironment: () => reactNativeBridge.getEnvironment(),
    getAppInfo: () => reactNativeBridge.getAppInfo()
  };
}

export default reactNativeBridge;
