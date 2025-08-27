const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 카테고리 목록을 가져오는 API
 * @returns {Promise<Array>} 카테고리 정보 배열
 */
export const fetchCategories = async () => {
  try {
    // 실제 API 호출 (타임아웃 설정)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
    
    const response = await fetch(`${API_BASE_URL}/partnerships/categories`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.isSuccess && data.result) {
      // 새로운 API 구조에서 카테고리 정보 추출
      const uniqueCategories = data.result;
      
      console.log('API에서 카테고리 데이터 가져오기 성공:', uniqueCategories);
      
      // API 응답을 UI에 맞는 형태로 변환
      const categoryMapping = {
        'CAFE': {
          code: 'cafe',
          displayName: '카페',
          icon: '☕',
          color: '#7C3AED',
          textColor: '#FFFFFF'
        },
        'BEAUTY': {
          code: 'beauty',
          displayName: '뷰티',
          icon: '💄',
          color: '#EC4899',
          textColor: '#FFFFFF'
        },
        'CONVENIENCE STORE': {
          code: 'convenience',
          displayName: '편의점',
          icon: '🏪',
          color: '#10B981',
          textColor: '#FFFFFF'
        },
        'FOOD': {
          code: 'food',
          displayName: '음식점',
          icon: '🍽️',
          color: '#F59E0B',
          textColor: '#FFFFFF'
        },
        'CULTURE': {
          code: 'culture',
          displayName: '문화',
          icon: '🎭',
          color: '#8B5CF6',
          textColor: '#FFFFFF'
        }
      };
      
      return uniqueCategories.map((categoryName, index) => {
        const mapping = categoryMapping[categoryName];
        
        if (mapping) {
          // 정의된 카테고리는 한글로 변환
          return {
            id: index + 1,
            code: mapping.code,
            name: mapping.displayName,
            displayName: mapping.displayName,
            icon: mapping.icon,
            color: mapping.color,
            textColor: mapping.textColor,
            isActive: true
          };
        } else {
          // 정의되지 않은 카테고리는 영어 그대로 표시
          return {
            id: index + 1,
            code: categoryName.toLowerCase().replace(/\s+/g, '_'),
            name: categoryName,
            displayName: categoryName,  // 영어 그대로
            icon: '🏷️',
            color: '#6B7280',
            textColor: '#FFFFFF',
            isActive: true
          };
        }
      });
    }
    
    // API 실패 시 빈 배열 반환
    return [];
  } catch (error) {
    console.error('카테고리 정보 가져오기 실패:', error);
    
    // 에러 시 기본 카테고리 반환
    return [
      {
        id: 1,
        code: 'cafe',
        name: '카페',
        displayName: '카페',
        icon: '☕',
        color: '#7C3AED',
        textColor: '#FFFFFF',
        isActive: true
      },
      {
        id: 2,
        code: 'beauty',
        name: '뷰티',
        displayName: '뷰티',
        icon: '💄',
        color: '#EC4899',
        textColor: '#FFFFFF',
        isActive: true
      },
      {
        id: 3,
        code: 'convenience',
        name: '편의점',
        displayName: '편의점',
        icon: '🏪',
        color: '#10B981',
        textColor: '#FFFFFF',
        isActive: true
      }
    ];
  }
};

/**
 * 카테고리별 스토어 목록을 가져오는 API
 * @param {string} categoryCode - 카테고리 코드
 * @returns {Promise<Array>} 스토어 정보 배열
 */
export const fetchStoresByCategory = async (categoryCode) => {
  try {
    // 실제 API 호출하여 카테고리별 스토어 필터링 (타임아웃 설정)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
    
    const response = await fetch(`${API_BASE_URL}/partnerships/university`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.isSuccess && data.result) {
      // 카테고리 코드에 맞는 파트너십들만 필터링
      const categoryMapping = {
        'cafe': 'CAFE',
        'beauty': 'BEAUTY',
        'convenience': 'CONVENIENCE STORE'
      };
      
      const targetCategory = categoryMapping[categoryCode];
      if (!targetCategory) return [];
      
      const filteredPartnerships = data.result.filter(
        partnership => partnership.categoryName === targetCategory
      );
      
      console.log(`카테고리 ${categoryCode} 파트너십 데이터 가져오기 성공:`, filteredPartnerships.length, '개');
      return filteredPartnerships;
    }
    
    return [];
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`카테고리 ${categoryCode} 스토어 API 호출 타임아웃 - 빈 배열 반환`);
    } else {
      console.error('카테고리별 스토어 정보 가져오기 실패:', error);
    }
    
    // API 실패 시 빈 배열 반환 (UI가 깨지지 않도록)
    return [];
  }
};
