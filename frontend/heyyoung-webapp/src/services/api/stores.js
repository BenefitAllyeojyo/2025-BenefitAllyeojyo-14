const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 스토어 정보를 가져오는 API
 * @returns {Promise<Array>} 스토어 정보 배열
 */
export const fetchStores = async () => {
  try {
    // 실제 API 호출 (타임아웃 설정)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
    
    const response = await fetch(`${API_BASE_URL}/partnerships/university`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 500) {
        console.warn('API 서버 오류 (500): 서버 측 문제로 일시적으로 데이터를 가져올 수 없습니다.');
        // 500 에러 시에도 빈 배열 반환하여 앱이 중단되지 않도록 함
        return [];
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.isSuccess && data.result) {
      // API 응답 구조 그대로 반환 (partnershipBranchDto 포함)
      return data.result;
    } else {
      return [];
    }
  } catch (error) {
    // API 실패 시 빈 배열 반환하여 앱이 중단되지 않도록 함
    return [];
  }
};
