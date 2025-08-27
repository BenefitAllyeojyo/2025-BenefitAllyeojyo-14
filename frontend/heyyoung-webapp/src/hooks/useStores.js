import { useState, useEffect, useRef } from 'react';
import { fetchStores } from '../services/api';

/**
 * 스토어와 파트너십 정보를 가져오는 커스텀 훅
 * @param {number} memberId - 회원 ID (기본값: 1)
 * @returns {Object} 스토어, 파트너십, 로딩 상태, 에러 상태
 */
export const useStores = (memberId = 1) => {
  const [stores, setStores] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 이전 요청이 있다면 취소
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // 새로운 AbortController 생성
        abortControllerRef.current = new AbortController();
        
        setIsLoading(true);
        setError(null);
        
        // 파트너십 정보 가져오기 (partnershipBranchDto 포함)
        const partnershipsData = await fetchStores();
        
        setStores(partnershipsData);
        // 파트너십 데이터에서 기본 정보 추출
        const basicPartnerships = partnershipsData.map(partnership => ({
          id: partnership.id,
          companyName: partnership.companyName,
          discountRate: partnership.discountRate,
          discountAmount: partnership.discountAmount,
          terms: partnership.terms,
          status: partnership.status
        }));
        setPartnerships(basicPartnerships);
        
        console.log('useStores 훅에서 로드된 파트너십:', partnershipsData.length, '개');
        console.log('useStores 훅에서 로드된 기본 파트너십 정보:', basicPartnerships.length, '개');
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('useStores 훅 요청이 취소됨');
          return;
        }
        
        console.error('useStores 훅에서 데이터 로드 실패:', error);
        setError(error);
        
        // 에러 발생 시 빈 배열 사용
        setStores([]);
        setPartnerships([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // cleanup 함수
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [memberId]);

  return {
    stores,
    partnerships,
    isLoading,
    error,
    refetch: () => {
      loadData();
    }
  };
};
