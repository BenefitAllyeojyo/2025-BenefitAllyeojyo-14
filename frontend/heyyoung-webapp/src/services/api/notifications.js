const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 노티피케이션 목록 조회
export const getNotifications = async (page = 0, size = 3) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&size=${size}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.isSuccess) {
      throw new Error(`API error: ${data.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('노티피케이션 조회 실패:', error);
    throw error;
  }
};
