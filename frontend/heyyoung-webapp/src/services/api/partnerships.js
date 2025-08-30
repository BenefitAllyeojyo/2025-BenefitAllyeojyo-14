const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PARTNERSHIPS_ENDPOINT = '/partnerships/university';

/**
 * 대학 파트너십 정보를 가져오는 API
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Object>} 파트너십 정보
 */
export const fetchPartnerships = async (memberId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}${PARTNERSHIPS_ENDPOINT}?memberId=${memberId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.isSuccess) {
      throw new Error(`API error: ${data.message}`);
    }
    
    return data.result;
  } catch (error) {
    throw error;
  }
};
