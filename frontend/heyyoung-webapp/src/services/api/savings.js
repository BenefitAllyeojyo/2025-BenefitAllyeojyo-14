// 저장 금액 관련 API 함수들

// 사용자 총 절약 금액 조회
export const fetchUserTotalSavings = async () => {
  try {
    // 실제 API 호출: /payments/savings
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    const response = await fetch(`${API_BASE_URL}/payments/savings`, {
      method: 'GET',
      headers: {
        accept: '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Savings API Response:', data);
    
    return data;
  } catch (error) {
    console.error('저장 금액 조회 실패:', error);
    throw error;
  }
};

// 월별 절약 금액 조회
export const fetchMonthlySavings = async (year, month) => {
  try {
    // 실제 API 호출 시에는 아래 주석을 해제하고 실제 엔드포인트 사용
    // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/savings/monthly?year=${year}&month=${month}`);
    // return await response.json();
    
    // Mock 데이터 반환
    return {
      "isSuccess": true,
      "code": "2000",
      "message": "Ok",
      "result": {
        "userId": 1,
        "year": year,
        "month": month,
        "totalSavedAmount": 50000.00,
        "dailySavings": [
          { date: "2024-01-01", amount: 1500.00 },
          { date: "2024-01-02", amount: 2000.00 },
          { date: "2024-01-03", amount: 1500.00 }
        ]
      }
    };
  } catch (error) {
    console.error('월별 저장 금액 조회 실패:', error);
    throw error;
  }
};
