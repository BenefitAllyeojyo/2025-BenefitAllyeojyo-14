const GPT_API_URL = import.meta.env.VITE_GPT_API_URL || 'http://localhost:5050';

/**
 * GPT API 호출 함수
 * @param {string} message - 사용자 입력 메시지
 * @param {Array} availableStores - 사용 가능한 스토어 목록
 * @returns {Promise<Object>} GPT 응답 데이터
 */
export const callGptApi = async (message, availableStores = []) => {
  try {
    // 스토어 데이터를 GPT가 이해할 수 있는 형태로 변환
    const storeData = availableStores.map(store => ({
      id: store.id,
      name: store.name,
      hours: store.businessHours || {}
    }));
    
    const requestData = {
      message: message,
      context: {
        stores: storeData
      }
    };
    
    const response = await fetch(`${GPT_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`GPT API 호출 실패: ${response.status}`);
    }

                    const data = await response.json();

                // 백엔드에서 score 필드로 오는 경우 처리
                if (data.score !== undefined) {
                  return {
                    success: true,
                    message: data.score.toString(),
                  };
                }

                return {
                  success: true,
                  message: data.message || data.response || 'GPT 응답을 받았습니다.',
                };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'GPT 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
    };
  }
};
