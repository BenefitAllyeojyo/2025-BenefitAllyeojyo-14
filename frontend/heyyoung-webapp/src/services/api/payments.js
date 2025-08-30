const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.brainpix.net';

/**
 * QR 데이터를 가져오는 API
 * @returns {Promise<Object>} QR 토큰 정보
 */
export const fetchQRData = async () => {
  try {
    // 실제 API 호출 (타임아웃 설정)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
    
    console.log('API 호출 URL:', `${API_BASE_URL}/payments/qr-data`);
    
    const response = await fetch(`${API_BASE_URL}/payments/qr-data`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('API 응답 상태:', response.status, response.statusText);
    console.log('API 응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      if (response.status === 500) {
        console.warn('API 서버 오류 (500): 서버 측 문제로 일시적으로 QR 데이터를 가져올 수 없습니다.');
        throw new Error('서버 오류');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // 응답 텍스트를 먼저 확인
    const responseText = await response.text();
    console.log('API 응답 텍스트:', responseText);
    
    // JSON 파싱 시도
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('파싱된 JSON 데이터:', data);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      console.error('응답이 JSON이 아닙니다. HTML 페이지가 반환되었을 수 있습니다.');
      throw new Error('서버에서 잘못된 응답을 받았습니다.');
    }
    
    // 실제 API 응답 구조에 맞춰서 성공 여부 판단
    // code가 "2000"이거나 isSuccess가 true일 때 성공으로 처리
    if ((data.code === "2000" || data.isSuccess) && data.result && data.result.qrToken) {
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

/**
 * 결제 상태를 확인하는 API
 * @param {string} qrToken - QR 토큰
 * @returns {Promise<Object>} 결제 상태 정보
 */
export const checkPaymentStatus = async (qrToken) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃
    
    console.log('결제 상태 확인 API 호출:', `${API_BASE_URL}/payments/status`);
    
    const response = await fetch(`${API_BASE_URL}/payments/status`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('결제 상태 확인 API 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('결제 상태 확인 API 응답 텍스트:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('파싱된 결제 상태 데이터:', data);
    } catch (parseError) {
      console.error('결제 상태 JSON 파싱 실패:', parseError);
      throw new Error('서버에서 잘못된 응답을 받았습니다.');
    }
    
    // API 응답 구조에 맞춰서 성공 여부 판단
    if (data.code === "2000" || data.isSuccess) {
      console.log('결제 상태 확인 성공:', data.result);
      return data.result;
    } else {
      console.warn('결제 상태 확인 API 응답 오류:', data.message || '알 수 없는 오류');
      throw new Error(data.message || '결제 상태를 확인할 수 없습니다.');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('결제 상태 확인 API 호출 타임아웃 (5초)');
      throw new Error('요청 시간이 초과되었습니다.');
    } else {
      console.error('결제 상태 확인 실패:', error);
      throw error;
    }
  }
};
