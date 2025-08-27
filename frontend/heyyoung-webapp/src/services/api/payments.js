const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * QR 데이터를 가져오는 API
 * @param {string} sessionId - 결제 세션 ID
 * @param {string} paymentToken - 결제 토큰
 * @returns {Promise<Object>} QR 토큰 정보
 */
export const fetchQRData = async (sessionId, paymentToken) => {
  try {
    // 실제 API 호출 (타임아웃 설정)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
    
    const response = await fetch(`${API_BASE_URL}/payments/qr-data?sessionId=${sessionId}&token=${paymentToken}`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 500) {
        console.warn('API 서버 오류 (500): 서버 측 문제로 일시적으로 QR 데이터를 가져올 수 없습니다.');
        throw new Error('서버 오류');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.isSuccess && data.result && data.result.qrToken) {
      console.log('QR 데이터 가져오기 성공:', data.result.qrToken);
      return data.result;
    } else {
      console.warn('API 응답 오류:', data.message || '알 수 없는 오류');
      throw new Error(data.message || 'QR 데이터를 가져올 수 없습니다.');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('API 호출 타임아웃 (10초)');
      throw new Error('요청 시간이 초과되었습니다.');
    } else {
      console.error('QR 데이터 가져오기 실패:', error);
      throw error;
    }
  }
};
