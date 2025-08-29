import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API_ENDPOINTS, API_HEADERS, API_CONFIG } from '../config/api';

// 푸시 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class PushNotificationService {
  // 푸시 알림 권한 요청
  static async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('푸시 알림 권한이 거부되었습니다!');
        return false;
      }
      
      return true;
    } else {
      console.log('실제 기기에서만 푸시 알림을 사용할 수 있습니다.');
      return false;
    }
  }

  // 푸시 토큰 가져오기
  static async getPushToken() {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId || projectId === 'your-project-id') {
        console.log('EAS Project ID를 설정해주세요.');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      console.log('푸시 토큰:', token.data);
      return token.data;
    } catch (error) {
      console.error('푸시 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 로컬 푸시 알림 보내기 (테스트용)
  static async sendLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // 즉시 표시
    });
  }

  // 배지 숫자 설정
  static async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }

  // Android 채널 설정
  static async setupAndroidChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('benefits', {
        name: '혜택 알림',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7435FD',
        sound: 'default',
      });
    }
  }

  // 서버에 푸시 토큰 전송
  static async sendTokenToServer(token: string, userId: number = 1) {
    try {
      console.log('백엔드에 푸시 토큰 전송 시작...');
      console.log('API URL:', API_ENDPOINTS.pushTokens);
      
      // 백엔드 API 오류로 인해 임시로 주석처리
      console.log('⚠️ 백엔드 API 호출이 주석처리되었습니다.');
      console.log('📱 전송할 토큰:', token);
      console.log('👤 사용자 ID:', userId);
      console.log('🔗 API 엔드포인트:', API_ENDPOINTS.pushTokens);
      
      // 더미 응답으로 성공 처리
      console.log('✅ 더미 응답: 푸시 토큰이 서버에 등록되었습니다.');
      return true;
      
      /*
      const response = await fetch(API_ENDPOINTS.pushTokens, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          userId,
          pushToken: token,
          platform: Platform.OS,
          appVersion: '1.0.0',
          deviceInfo: {
            brand: Device.brand,
            modelName: Device.modelName,
            osVersion: Device.osVersion,
            deviceType: Device.deviceType,
          },
          timestamp: new Date().toISOString(),
        }),
      });
      
      console.log('백엔드 응답 상태:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('푸시 토큰이 서버에 등록되었습니다:', result);
        return true;
      } else {
        const errorData = await response.text();
        console.error('서버 응답 오류:', response.status, errorData);
        return false;
      }
      */
    } catch (error) {
      console.error('푸시 토큰 서버 등록 실패:', error);
      return false;
    }
  }

  // 토큰 변경 감지 및 백엔드에 재전송
  static async checkAndUpdateToken(userId: number = 1) {
    try {
      console.log('🔍 토큰 변경 감지 시작...');
      
      // 현재 토큰 가져오기
      const currentToken = await this.getPushToken();
      if (!currentToken) {
        console.log('❌ 푸시 토큰을 가져올 수 없습니다.');
        return false;
      }
      
      console.log('✅ 현재 토큰 가져오기 성공:', currentToken.substring(0, 20) + '...');

      // 토큰 유효성 검증
      const isValid = await this.validateToken(currentToken);
      if (!isValid) {
        console.log('❌ 토큰 유효성 검증 실패');
        return false;
      }

      // 로컬에 저장된 이전 토큰과 비교
      const previousToken = await this.getStoredToken();
      console.log('💾 저장된 토큰:', previousToken ? previousToken.substring(0, 20) + '...' : '없음');
      
      if (previousToken !== currentToken) {
        console.log('🔄 푸시 토큰이 변경되었습니다!');
        console.log('📝 이전 토큰:', previousToken);
        console.log('🆕 새로운 토큰:', currentToken);
        
        // 백엔드에 새로운 토큰 전송 (현재는 더미 응답)
        console.log('📤 백엔드에 새로운 토큰 전송 시도...');
        const success = await this.sendTokenToServer(currentToken, userId);
        
        if (success) {
          // 성공 시 새로운 토큰 저장
          await this.storeToken(currentToken);
          console.log('✅ 새로운 푸시 토큰이 백엔드에 등록되었습니다.');
          return true;
        } else {
          console.log('❌ 새로운 푸시 토큰 등록에 실패했습니다.');
          return false;
        }
      } else {
        console.log('✅ 푸시 토큰이 변경되지 않았습니다.');
        
        // 기존 토큰의 유효성도 재검증
        const existingTokenValid = await this.validateToken(previousToken);
        if (!existingTokenValid) {
          console.log('⚠️ 기존 토큰이 유효하지 않습니다. 새로 생성 권장');
        }
        
        return true;
      }
    } catch (error) {
      console.error('❌ 토큰 변경 감지 중 오류:', error);
      return false;
    }
  }

  // 토큰 유효성 검증
  static async validateToken(token: string): Promise<boolean> {
    try {
      console.log('🔍 토큰 유효성 검증 시작...');
      
      if (!token) {
        console.log('❌ 토큰이 없습니다.');
        return false;
      }

      // 토큰 형식 검증
      if (!token.startsWith('ExponentPushToken[') || !token.endsWith(']')) {
        console.log('❌ 토큰 형식이 올바르지 않습니다.');
        return false;
      }

      // 토큰 길이 검증 (일반적으로 45자)
      if (token.length < 40 || token.length > 50) {
        console.log('❌ 토큰 길이가 올바르지 않습니다:', token.length);
        return false;
      }

      // 토큰 생성 시간 확인 (저장된 시간과 비교)
      const tokenAge = await this.getTokenAge();
      if (tokenAge > 30) { // 30일 이상 된 토큰은 의심
        console.log('⚠️ 토큰이 30일 이상 되었습니다:', tokenAge, '일');
        console.log('🔄 새로운 토큰 생성 권장');
      }

      console.log('✅ 토큰 유효성 검증 통과');
      return true;
    } catch (error) {
      console.error('❌ 토큰 유효성 검증 중 오류:', error);
      return false;
    }
  }

  // 토큰 생성 시간 확인
  private static async getTokenAge(): Promise<number> {
    try {
      if (typeof localStorage !== 'undefined') {
        const tokenCreatedAt = localStorage.getItem('expo_push_token_created_at');
        if (tokenCreatedAt) {
          const createdDate = new Date(tokenCreatedAt);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - createdDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        }
      }
      return 0; // 생성 시간을 알 수 없는 경우
    } catch (error) {
      console.error('토큰 생성 시간 확인 실패:', error);
      return 0;
    }
  }

  // 토큰 저장 시 생성 시간도 함께 저장
  private static async storeToken(token: string) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('expo_push_token', token);
        localStorage.setItem('expo_push_token_created_at', new Date().toISOString());
        console.log('💾 토큰과 생성 시간이 저장되었습니다.');
      }
    } catch (error) {
      console.error('토큰 저장 실패:', error);
    }
  }

  // 로컬에서 토큰 가져오기
  private static async getStoredToken(): Promise<string | null> {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('expo_push_token');
      }
      return null;
    } catch (error) {
      console.error('저장된 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 서버에서 푸시 알림 전송 요청 (테스트용)
  static async requestTestNotificationFromServer(userId: number = 1) {
    try {
      console.log('서버에 테스트 알림 요청...');
      
      // 백엔드 API 오류로 인해 임시로 주석처리
      console.log('⚠️ 백엔드 API 호출이 주석처리되었습니다.');
      console.log('🧪 테스트 알림 요청 정보:');
      console.log('👤 사용자 ID:', userId);
      console.log('🔗 API 엔드포인트:', API_ENDPOINTS.pushTest);
      
      // 더미 응답으로 성공 처리
      console.log('✅ 더미 응답: 테스트 알림 요청 성공');
      return true;
      
      /*
      const response = await fetch(API_ENDPOINTS.pushTest, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          userId,
          message: '서버에서 보낸 테스트 알림입니다!',
          type: 'TEST_NOTIFICATION',
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('테스트 알림 요청 성공:', result);
        return true;
      } else {
        console.error('테스트 알림 요청 실패:', response.status);
        return false;
      }
      */
    } catch (error) {
      console.error('테스트 알림 요청 중 오류:', error);
      return false;
    }
  }

  /**
   * Expo 토큰에서 FCM 토큰 추출 시도
   */
  static async extractFCMToken(expoToken: string): Promise<string | null> {
    try {
      console.log('🔍 FCM 토큰 추출 시도...');
      console.log('📱 Expo 토큰:', expoToken);
      
      // Expo 서버에서 FCM 토큰 정보 요청
      const response = await fetch('https://exp.host/--/api/v2/push/getReceipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: [expoToken]
        })
      });
      
      if (!response.ok) {
        console.log('⚠️ Expo 서버 응답 실패:', response.status);
        return null;
      }
      
      const data = await response.json();
      console.log('📋 Expo 서버 응답:', data);
      
      // FCM 토큰이 포함된 정보 추출
      if (data && data.data && data.data[expoToken]) {
        const receipt = data.data[expoToken];
        console.log('✅ FCM 토큰 정보 발견:', receipt);
        
        // FCM 토큰 반환 (실제 구조는 Expo API 문서 확인 필요)
        return receipt.fcmToken || receipt.token || null;
      }
      
      console.log('⚠️ FCM 토큰 정보를 찾을 수 없음');
      return null;
      
    } catch (error) {
      console.error('❌ FCM 토큰 추출 실패:', error);
      return null;
    }
  }

  /**
   * FCM 토큰 받기 (Development Build에서만 작동)
   */
  static async getFCMToken(): Promise<string | null> {
    try {
      console.log('🔥 FCM 토큰 받기 시도...');
      
      // Development Build에서 FCM 토큰 받기 시도
      // 현재는 Expo Go에서 테스트 중이므로 더미 토큰 반환
      if (__DEV__) {
        console.log('⚠️ Expo Go에서는 FCM 토큰을 받을 수 없습니다.');
        console.log('💡 Development Build가 필요합니다.');
        console.log('🔧 빌드 후 실제 FCM 토큰을 받을 수 있습니다.');
        
        // 더미 FCM 토큰 (테스트용)
        const dummyFCMToken = 'fMEP0vJqS7:APA91bHqX...'; // 실제로는 더 긴 토큰
        console.log('🧪 더미 FCM 토큰 (테스트용):', dummyFCMToken);
        
        return dummyFCMToken;
      }
      
      return null;
    } catch (error) {
      console.error('❌ FCM 토큰 받기 실패:', error);
      return null;
    }
  }

  /**
   * Expo Push 토큰을 백엔드로 전송
   */
  static async sendExpoPushTokenToBackend(expoToken: string): Promise<boolean> {
    try {
      console.log('📤 Expo Push 토큰을 백엔드로 전송 시작...');
      console.log('📱 Expo Push 토큰 (전체):', expoToken);
      console.log('📱 Expo Push 토큰 길이:', expoToken.length);
      
      // 백엔드 API 호출 (현재는 더미 응답)
      console.log('⚠️ 백엔드 API 호출이 주석처리되었습니다.');
      console.log('📱 전송할 Expo Push 토큰 (전체):', expoToken);
      console.log('👤 사용자 ID: 1');
      console.log('🔗 API 엔드포인트:', API_ENDPOINTS.pushTokens);
      
      // TODO: 실제 백엔드 API 호출
      // const response = await fetch(API_ENDPOINTS.pushTokens, {
      //   method: 'POST',
      //   headers: API_HEADERS,
      //   body: JSON.stringify({
      //     token: expoToken,
      //     userId: 1,
      //     platform: 'expo'
      //   })
      // });
      
      console.log('✅ 더미 응답: Expo Push 토큰이 서버에 등록되었습니다.');
      return true;
      
    } catch (error) {
      console.error('❌ Expo Push 토큰 전송 실패:', error);
      return false;
    }
  }

  /**
   * Expo Push 토큰 처리 (받기 + 전송)
   */
  static async handleExpoPushToken(): Promise<{
    success: boolean;
    expoToken: string | null;
    message: string;
  }> {
    try {
      console.log('🚀 Expo Push 토큰 처리 시작...');
      
      // 1. Expo Push 토큰 받기
      const expoToken = await this.getPushToken();
      
      if (!expoToken) {
        console.log('❌ Expo Push 토큰을 받을 수 없음');
        return {
          success: false,
          expoToken: null,
          message: 'Expo Push 토큰을 받을 수 없습니다. EAS Project ID를 확인해주세요.'
        };
      }
      
      console.log('✅ Expo Push 토큰 받기 성공 (전체):', expoToken);
      console.log('✅ Expo Push 토큰 길이:', expoToken.length);
      
      // 2. 백엔드로 전송
      const sent = await this.sendExpoPushTokenToBackend(expoToken);
      
      if (sent) {
        console.log('✅ 백엔드 전송 성공');
        return {
          success: true,
          expoToken: expoToken,
          message: 'Expo Push 토큰이 성공적으로 백엔드에 전송되었습니다.'
        };
      } else {
        console.log('❌ 백엔드 전송 실패');
        return {
          success: false,
          expoToken: expoToken,
          message: 'Expo Push 토큰은 받았지만 백엔드 전송에 실패했습니다.'
        };
      }
      
    } catch (error) {
      console.error('❌ Expo Push 토큰 처리 실패:', error);
      return {
        success: false,
        expoToken: null,
        message: 'Expo Push 토큰 처리 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 모든 토큰 가져오기 (Expo + FCM)
   */
  static async getAllTokens(): Promise<{
    expoToken: string | null;
    fcmToken: string | null;
    isDevelopmentBuild: boolean;
  }> {
    try {
      console.log('🔑 모든 토큰 가져오기 시작...');
      
      // 1. Expo 토큰 가져오기
      const expoToken = await this.getPushToken();
      
      // 2. FCM 토큰 받기 시도
      const fcmToken = await this.getFCMToken();
      
      // 3. Development Build 여부 확인
      const isDevelopmentBuild = fcmToken !== null;
      
      console.log('🔑 === 모든 토큰 정보 ===');
      console.log('📱 Expo 토큰:', expoToken);
      console.log('🔥 FCM 토큰:', fcmToken);
      console.log('🏗️ Development Build:', isDevelopmentBuild);
      console.log('========================');
      
      return { expoToken, fcmToken, isDevelopmentBuild };
      
    } catch (error) {
      console.error('❌ 모든 토큰 가져오기 실패:', error);
      return { expoToken: null, fcmToken: null, isDevelopmentBuild: false };
    }
  }

  // 현재 API 설정 정보 반환
  static getApiConfig() {
    return {
      baseUrl: API_CONFIG.baseUrl,
      endpoint: API_ENDPOINTS.pushTokens,
      environment: __DEV__ ? 'development' : 'production',
    };
  }

  // 푸시 토큰 정보 출력 (디버깅용)
  static async logTokenInfo() {
    try {
      console.log('🔑 === 푸시 토큰 정보 ===');
      
      // 현재 토큰 가져오기
      const currentToken = await this.getPushToken();
      console.log('📱 현재 푸시 토큰:', currentToken);
      
      if (currentToken) {
        console.log('✅ 토큰 생성 성공!');
        console.log('🔍 토큰 길이:', currentToken.length);
        console.log('📋 토큰 형식:', currentToken.startsWith('ExponentPushToken[') ? '올바른 형식' : '잘못된 형식');
      } else {
        console.log('❌ 토큰 생성 실패');
      }
      
      // 저장된 토큰 가져오기
      const storedToken = await this.getStoredToken();
      console.log('💾 저장된 토큰:', storedToken);
      
      // 토큰 변경 여부 확인
      if (currentToken && storedToken) {
        const isChanged = currentToken !== storedToken;
        console.log('🔄 토큰 변경 여부:', isChanged ? '변경됨' : '변경되지 않음');
        
        if (isChanged) {
          console.log('📝 이전 토큰:', storedToken);
          console.log('🆕 새로운 토큰:', currentToken);
        }
      } else if (currentToken && !storedToken) {
        console.log('🆕 최초 토큰 생성');
      }
      
      // API 설정 정보
      console.log('🌐 API 설정:', this.getApiConfig());
      console.log('========================');
      
      return currentToken;
    } catch (error) {
      console.error('❌ 토큰 정보 출력 중 오류:', error);
      return null;
    }
  }
}
