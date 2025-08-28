import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 푸시 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
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
      trigger: { seconds: 1 },
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
      // 실제 API 엔드포인트로 변경 필요
      const response = await fetch('https://your-api-endpoint.com/push-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          pushToken: token,
          platform: Platform.OS,
          appVersion: '1.0.0'
        }),
      });
      
      if (response.ok) {
        console.log('푸시 토큰이 서버에 등록되었습니다.');
        return true;
      } else {
        console.error('서버 응답 오류:', response.status);
        return false;
      }
    } catch (error) {
      console.error('푸시 토큰 서버 등록 실패:', error);
      return false;
    }
  }
}
