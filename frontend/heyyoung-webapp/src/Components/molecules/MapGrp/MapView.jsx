import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './MapView.module.css';
import ToolTipModule from '../../molecules/TextGrp/ToolTipModule';
import LocationPin from '../../atoms/LocationPin';
import { MapActionButton } from '../../atoms/Button';
import CharacterButtonGroup from './CharacterButtonGroup';
import CategoryButtons from './CategoryButtons';
import SlidingPanel from './SlidingPanel';
import GptInput from '../../atoms/Input/GptInput';
import { ListItemBox } from '../ListItemBox/index';
import { mapConfig as defaultMapConfig } from '../../../mocks/stores';
import { useStores } from '../../../hooks/useStores';
import { fetchCategories, fetchStoresByCategory } from '../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MapView = ({ schoolName = '서울대학교', schoolColor }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlaysRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showGptInput, setShowGptInput] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null); // 선택된 가게 정보

  // 커스텀 훅으로 스토어와 파트너십 데이터 가져오기
  const { stores: apiStores, partnerships, isLoading, error } = useStores(1);

  // 가게 선택 시 처리하는 함수
  const handleStoreSelect = useCallback((store) => {
    console.log('가게 선택됨:', store);
    setSelectedStore(store);
    
    // 선택된 가게만 마커로 표시하고 지도를 해당 위치로 이동
    if (store && mapInstanceRef.current) {
      console.log('지도 이동 시작:', store.name, store.lat, store.lng);
      
      // 기존 마커들 제거
      clearAllOverlays(mapInstanceRef.current);
      
      // 선택된 가게만 마커로 표시
      addTooltipOverlay(mapInstanceRef.current, store);
      
      // 마커가 추가된 후 지도를 선택된 가게 위치로 이동하고 중앙에 배치
      setTimeout(() => {
        try {
          const storeLatLng = new kakao.maps.LatLng(store.lat, store.lng);
          console.log('지도 이동 시도:', storeLatLng);
          
          // 마커가 지도 중앙 상단에 오도록 오프셋 조정
          const offsetLat = store.lat - 0.0015; // 위도에 약간의 오프셋 추가 (상단으로)
          const centerLatLng = new kakao.maps.LatLng(offsetLat, store.lng);
          
          // panTo 대신 setCenter 사용 (더 확실함)
          mapInstanceRef.current.setCenter(centerLatLng);
          mapInstanceRef.current.setLevel(3); // 적절한 줌 레벨로 설정
          
          console.log('지도 이동 완료:', store.name, '오프셋 적용:', centerLatLng);
        } catch (error) {
          console.error('지도 이동 실패:', error);
        }
      }, 200); // 마커 추가 후 충분한 지연을 두고 이동
    }
  }, []);

  // 학교 위치 (멀캠)
  // const schoolLocation = {
  //   lat: 37.501328668708,
  //   lng: 127.03953821497
  // };

  // 학교 위치 (설대)
  const schoolLocation = {
    lat: 37.48116232181828,
    lng: 126.95135823610674,
  };

  // 디버깅을 위한 로그
  console.log('MapView - useStores 훅 상태:', {
    apiStoresLength: apiStores?.length,
    apiStores: apiStores,
    partnershipsLength: partnerships?.length,
    isLoading,
    error,
  });

  // 카테고리 데이터 로딩
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        // "전체"를 기본 선택
        if (categoriesData.length > 0 && !selectedCategory) {
          setSelectedCategory('ALL');
          // 전체 카테고리 스토어 로드
          setTimeout(() => {
            handleCategoryChange('ALL');
          }, 100);
        }
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      }
    };

    loadCategories();
  }, [selectedCategory]);

  // 지도 로드 후 현재 위치 가져오기
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current) {
      getCurrentLocation();
    }
  }, [mapLoaded]);

  // 카테고리별 스토어 데이터를 가져오는 함수
  const fetchStoresByCategory = async (categoryCode) => {
    try {
      let apiUrl;
      if (categoryCode === 'ALL') {
        apiUrl = `${API_BASE_URL}/partnerships/university`;
        console.log(`📡 API 호출: ${apiUrl} (전체 카테고리)`);
      } else {
        apiUrl = `${API_BASE_URL}/partnerships/university?category=${categoryCode.toUpperCase()}`;
        console.log(`📡 API 호출: ${apiUrl}`);
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API 응답: ${data.result?.length || 0}개 스토어`);

      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ API 호출 실패:', error.message);
      throw error;
    }
  };

  // 카테고리 변경 시 스토어 데이터 업데이트
  const handleCategoryChange = async (categoryCode) => {
    setSelectedCategory(categoryCode);
    
    try {
      let apiUrl;
      if (categoryCode === 'ALL') {
        // 전체 선택 시 빈 카테고리로 API 호출
        apiUrl = `${API_BASE_URL}/partnerships/university?category=`;
        console.log(`📡 전체 카테고리 API 호출: ${apiUrl}`);
      } else {
        // 특정 카테고리 선택 시 해당 카테고리로 API 호출
        apiUrl = `${API_BASE_URL}/partnerships/university?category=${categoryCode.toUpperCase()}`;
        console.log(`📡 카테고리별 API 호출: ${apiUrl}`);
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API 응답: ${data.result?.length || 0}개 스토어`);
      
      if (data.isSuccess && data.result) {
        // API 데이터를 마커 형식으로 변환
        const convertedStores = convertApiStoresToMarkers(data.result);
        
        // 기존 마커들 제거
        if (mapInstanceRef.current) {
          clearAllOverlays(mapInstanceRef.current);
        }
        
        // 새로운 마커들 추가
        if (convertedStores.length > 0 && mapInstanceRef.current) {
          convertedStores.forEach((store) => {
            addTooltipOverlay(mapInstanceRef.current, store);
          });
          console.log(`${convertedStores.length}개의 마커 재배치 완료`);
        }
        
        // 선택된 가게 초기화 (카테고리 변경 시)
        setSelectedStore(null);
      } else {
        console.log('API 응답에 데이터가 없습니다.');
        // 데이터가 없으면 모든 마커 제거
        if (mapInstanceRef.current) {
          clearAllOverlays(mapInstanceRef.current);
        }
      }
    } catch (error) {
      console.error('❌ 카테고리별 API 호출 실패:', error.message);
    }
  };

  // 챗봇 버튼 클릭 핸들러
  const handleChatbotClick = () => {
    setShowGptInput(!showGptInput);
  };

  // 챗봇 입력 처리 핸들러
  const handleGptInputSubmit = (inputValue) => {
    console.log('챗봇 입력값:', inputValue);
    
    // 숫자인지 확인
    const markerId = parseInt(inputValue);
    if (isNaN(markerId)) {
      console.log('숫자가 아닌 입력값:', inputValue);
      alert('숫자를 입력해주세요.');
      return;
    }

    // 해당 ID의 마커 찾기 (마커만 찾기)
    const targetMarker = overlaysRef.current.find(item => {
      // 마커 객체이고 markerData가 있는 경우
      if (item.markerData && item.markerData.id === markerId) {
        return true;
      }
      return false;
    });

    if (targetMarker) {
      console.log('마커 찾음:', targetMarker);
      console.log('마커 데이터:', targetMarker.markerData);
      
      // 챗봇 전용 마커 선택 처리 (줌 레벨 4로 고정)
      handleChatbotMarkerSelect(targetMarker);
    } else {
      console.log(`ID ${markerId}에 해당하는 마커를 찾을 수 없습니다.`);
      console.log('현재 마커들:', overlaysRef.current.filter(item => item.markerData).map(item => ({
        id: item.markerData.id,
        name: item.markerData.name
      })));
      alert(`ID ${markerId}에 해당하는 마커를 찾을 수 없습니다.`);
    }
  };

  // 마커 클릭 처리 함수 (기존 클릭 이벤트 로직을 재사용)
  const handleMarkerClick = (marker) => {
    if (!marker || !mapInstanceRef.current) return;

    try {
      console.log('마커 클릭 처리 시작:', marker.markerData?.name);
      
      // 마커의 위치 정보 가져오기
      const markerPosition = marker.getPosition();
      if (!markerPosition) {
        console.error('마커 위치 정보를 가져올 수 없습니다.');
        return;
      }

      // 기존 마커들을 기본 상태로 복원
      overlaysRef.current.forEach((item) => {
        if (item.setImage && item !== marker) {
          if (item.defaultIcon) {
            item.setImage(item.defaultIcon);
          }
          item.setZIndex(1);

          // 카테고리 라벨도 보라색으로 복원
          if (item.categoryLabel && item.categoryLabel.getContent) {
            const labelContent = item.categoryLabel.getContent();
            if (labelContent) {
              labelContent.style.background = '#7C3AED';
            }
          }
        }
      });

      // 선택된 마커를 핑크색으로 변경
      marker.setZIndex(1000);
      if (marker.selectedIcon) {
        marker.setImage(marker.selectedIcon);
      }

      // 선택된 마커의 카테고리 라벨도 핑크색으로 변경
      if (marker.categoryLabel && marker.categoryLabel.getContent) {
        const labelContent = marker.categoryLabel.getContent();
        if (labelContent) {
          labelContent.style.background = '#EC4899';
        }
      }

      // 해당 마커의 툴팁 찾기 및 표시
      // 마커와 같은 위치의 툴팁 오버레이 찾기
      const tooltipOverlay = overlaysRef.current.find(item => {
        if (item.getContent && item.getContent().className && 
            item.getContent().className.includes(styles.tooltipOverlay)) {
          // 위치가 같은지 확인
          const overlayPosition = item.getPosition();
          if (overlayPosition && 
              Math.abs(overlayPosition.getLat() - markerPosition.getLat()) < 0.0001 &&
              Math.abs(overlayPosition.getLng() - markerPosition.getLng()) < 0.0001) {
            return true;
          }
        }
        return false;
      });

      if (tooltipOverlay) {
        const tooltipDiv = tooltipOverlay.getContent();
        if (tooltipDiv) {
          console.log('툴팁 찾음, 표시 중...');
          
          // 다른 툴팁들 숨기기
          hideOtherTooltips(tooltipDiv);
          
          // 툴팁 표시
          tooltipDiv.style.display = 'block';

          // 지도 이동
          setTimeout(() => {
            centerMapForTooltip(mapInstanceRef.current, markerPosition);
            
            setTimeout(() => {
              if (mapInstanceRef.current && mapInstanceRef.current.setDraggable) {
                mapInstanceRef.current.setDraggable(true);
              }
            }, 500);
          }, 100);

          // 마진 재계산
          setTimeout(() => {
            if (tooltipDiv.style.display !== 'none') {
              updateTooltipSizes(mapInstanceRef.current);
            }
          }, 800);
        }
      } else {
        console.log('해당 마커의 툴팁을 찾을 수 없습니다.');
      }

    } catch (error) {
      console.error('마커 클릭 처리 중 오류:', error);
    }
  };

  // 챗봇으로 마커 선택 시 전용 처리 함수 (줌 레벨 4로 고정)
  const handleChatbotMarkerSelect = (marker) => {
    if (!marker || !mapInstanceRef.current) return;

    try {
      console.log('챗봇 마커 선택 처리 시작:', marker.markerData?.name);
      
      // 마커의 위치 정보 가져오기
      const markerPosition = marker.getPosition();
      if (!markerPosition) {
        console.error('마커 위치 정보를 가져올 수 없습니다.');
        return;
      }

      // 1단계: 줌 레벨을 4로 설정
      console.log('1단계: 줌 레벨 4로 설정');
      mapInstanceRef.current.setLevel(4);
      
      // 2단계: 줌 레벨 변경 완료 후 마커 위치로 이동
      setTimeout(() => {
        console.log('2단계: 마커 위치로 이동');
        mapInstanceRef.current.panTo(markerPosition);
        
        // 3단계: 이동 완료 후 마커 클릭 처리
        setTimeout(() => {
          console.log('3단계: 마커 클릭 처리');
          
          // 기존 마커들을 기본 상태로 복원
          overlaysRef.current.forEach((item) => {
            if (item.setImage && item !== marker) {
              if (item.defaultIcon) {
                item.setImage(item.defaultIcon);
              }
              item.setZIndex(1);

              // 카테고리 라벨도 보라색으로 복원
              if (item.categoryLabel && item.categoryLabel.getContent) {
                const labelContent = item.categoryLabel.getContent();
                if (labelContent) {
                  labelContent.style.background = '#7C3AED';
                }
              }
            }
          });

          // 선택된 마커를 핑크색으로 변경
          marker.setZIndex(1000);
          if (marker.selectedIcon) {
            marker.setImage(marker.selectedIcon);
          }

          // 선택된 마커의 카테고리 라벨도 핑크색으로 변경
          if (marker.categoryLabel && marker.categoryLabel.getContent) {
            const labelContent = marker.categoryLabel.getContent();
            if (labelContent) {
              labelContent.style.background = '#EC4899';
            }
          }

          // 해당 마커의 툴팁 찾기 및 표시
          const tooltipOverlay = overlaysRef.current.find(item => {
            if (item.getContent && item.getContent().className && 
                item.getContent().className.includes(styles.tooltipOverlay)) {
              const overlayPosition = item.getPosition();
              if (overlayPosition && 
                  Math.abs(overlayPosition.getLat() - markerPosition.getLat()) < 0.0001 &&
                  Math.abs(overlayPosition.getLng() - markerPosition.getLng()) < 0.0001) {
                return true;
              }
            }
            return false;
          });

          if (tooltipOverlay) {
            const tooltipDiv = tooltipOverlay.getContent();
            if (tooltipDiv) {
              console.log('챗봇 툴팁 찾음, 표시 중...');
              
              // 다른 툴팁들 숨기기
              hideOtherTooltips(tooltipDiv);
              
              // 툴팁 표시
              tooltipDiv.style.display = 'block';

              // 드래그 기능 복원
              setTimeout(() => {
                if (mapInstanceRef.current && mapInstanceRef.current.setDraggable) {
                  mapInstanceRef.current.setDraggable(true);
                }
              }, 500);

              // 마진 재계산
              setTimeout(() => {
                if (tooltipDiv.style.display !== 'none') {
                  updateTooltipSizes(mapInstanceRef.current);
                }
              }, 800);
            }
          } else {
            console.log('해당 마커의 툴팁을 찾을 수 없습니다.');
          }
          
        }, 500); // 이동 완료 후 500ms 지연
        
      }, 500); // 줌 레벨 변경 후 500ms 지연

    } catch (error) {
      console.error('챗봇 마커 선택 처리 중 오류:', error);
    }
  };

  // 위치 버튼들 클릭 핸들러
  const handleLocationClick = () => {
    moveToCurrentLocation();
  };

  const handleSchoolClick = () => {
    moveToSchool();
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);
          console.log('현재 위치 가져오기 완료:', location);

          // 현재 위치 마커 생성
          if (mapInstanceRef.current) {
            createCurrentLocationMarker(location);
          }
        },
        (error) => {
          console.error('위치 가져오기 실패:', error);
          // 서울대학교 위치를 기본값으로 설정
          const defaultLocation = { lat: 37.4592, lng: 126.9517 };
          setCurrentLocation(defaultLocation);
          if (mapInstanceRef.current) {
            createCurrentLocationMarker(defaultLocation);
          }
        },
        options
      );
    }
  };

  const convertApiStoresToMarkers = (partnershipsData) => {
    console.log('convertApiStoresToMarkers 시작:', {
      inputData: partnershipsData,
      inputLength: partnershipsData?.length,
    });

    const markers = [];

    if (!partnershipsData || partnershipsData.length === 0) {
      console.log('partnershipsData가 비어있음');
      return markers;
    }

    partnershipsData.forEach((partnership, index) => {
      console.log(`partnership ${index}:`, {
        id: partnership.id,
        companyName: partnership.companyName,
        categoryName: partnership.categoryName,
        partnershipBranchDtoLength: partnership.partnershipBranchDto?.length,
      });

      // partnershipBranchDto가 있고 길이가 0보다 큰 경우에만 마커 생성
      if (partnership.partnershipBranchDto && partnership.partnershipBranchDto.length > 0) {
        partnership.partnershipBranchDto.forEach((branch, branchIndex) => {
          console.log(`branch ${branchIndex}:`, {
            id: branch.id,
            name: branch.name,
            latitude: branch.latitude,
            longitude: branch.longitude,
          });

          // API 응답에서 latitude는 경도(126.xxx), longitude는 위도(37.xxx)
          // 카카오맵은 (위도, 경도) 순서이므로 순서를 바꿔야 함
          const lat = branch.longitude; // 위도
          const lng = branch.latitude; // 경도

          const marker = {
            id: branch.id,
            position: {
              lat: lat,
              lng: lng,
            },
            name: branch.name,
            content: `${partnership.companyName} ${partnership.discountRate}% 할인`,
            address: branch.address,
            lat: lat,
            lng: lng,
            phone: branch.phone,
            businessHours: branch.businessHoursJson ? JSON.parse(branch.businessHoursJson) : null,
            startDate: branch.startDate,
            endDate: branch.endDate,
            status: branch.status,
            partnershipId: partnership.id,
            companyName: partnership.companyName,
            discountRate: partnership.discountRate,
            discountAmount: partnership.discountAmount,
            terms: partnership.terms,
            category: partnership.categoryName.toLowerCase(),
            images: branch.images || [],
          };

          markers.push(marker);
          console.log(`마커 ${markers.length} 생성:`, marker);
        });
      } else {
        console.log(`partnership ${index}의 partnershipBranchDto가 비어있음`);
      }
    });

    console.log('최종 변환된 마커 데이터:', {
      totalMarkers: markers.length,
      markers: markers,
    });
    return markers;
  };

  // 현재 위치 마커 생성
  const createCurrentLocationMarker = (location) => {
    if (!mapInstanceRef.current) return;

    // 기존 마커가 있다면 제거
    if (currentLocationMarker) {
      if (currentLocationMarker.marker) {
        currentLocationMarker.marker.setMap(null);
      }
      if (currentLocationMarker.circle) {
        currentLocationMarker.circle.setMap(null);
      }
      if (currentLocationMarker.animationInterval) {
        clearInterval(currentLocationMarker.animationInterval);
      }
    }

    // ListItemBox 컴포넌트를 통해 마커 생성
    setCurrentLocationMarker({ location });
    console.log('현재 위치 마커 생성 완료:', location);
  };

  // stores 데이터를 마커 형식으로 변환 (useMemo로 최적화)
  const testMarkers = useMemo(() => {
    const markers = convertApiStoresToMarkers(apiStores);
    console.log('마커 데이터 생성:', {
      apiStoresLength: apiStores.length,
      markersLength: markers.length,
      firstMarker: markers[0],
      apiStores: apiStores,
    });
    return markers;
  }, [apiStores]);

  // API 데이터가 로드될 때마다 마커 업데이트
  useEffect(() => {
    console.log('마커 업데이트 useEffect 실행:', {
      mapLoaded,
      hasMapInstance: !!mapInstanceRef.current,
      testMarkersLength: testMarkers.length,
      testMarkers: testMarkers,
    });

    if (mapLoaded && mapInstanceRef.current && testMarkers.length > 0) {
      console.log('API 데이터 업데이트로 마커 재생성:', testMarkers.length, '개');
      addTooltipOverlays(mapInstanceRef.current);
    } else if (mapLoaded && mapInstanceRef.current && testMarkers.length === 0) {
      console.log('API 데이터가 비어있음 - 마커 생성 불가');
    } else if (!mapLoaded) {
      console.log('지도가 아직 로드되지 않음');
    } else if (!mapInstanceRef.current) {
      console.log('지도 인스턴스가 없음');
    }
  }, [testMarkers, mapLoaded]);

  useEffect(() => {
    let timer;
    const tryInit = () => {
      if (typeof kakao !== 'undefined' && kakao.maps) {
        initializeMap();
      } else {
        timer = setInterval(() => {
          if (typeof kakao !== 'undefined' && kakao.maps) {
            clearInterval(timer);
            initializeMap();
          }
        }, 100);
      }
    };

    tryInit();

    // 언마운트 시 클린업
    return () => {
      if (timer) clearInterval(timer);
      // 오버레이들 해제
      overlaysRef.current.forEach((ov) => ov.setMap(null));
      overlaysRef.current = [];
      // 현재 위치 마커 정리
      if (currentLocationMarker) {
        // ListItemBox 컴포넌트가 자동으로 정리하므로 별도 작업 불필요
        setCurrentLocationMarker(null);
      }

      // 지도 참조 해제
      mapInstanceRef.current = null;
      window.currentMap = null;
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      const mapContainer = mapRef.current;

      // 서울대입구역 중심 좌표 사용
      const centerLat = defaultMapConfig.center.lat;
      const centerLng = defaultMapConfig.center.lng;

      const mapOption = {
        center: new kakao.maps.LatLng(centerLat, centerLng),
        level: defaultMapConfig.level, // 서울대입구역에 맞는 줌 레벨
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        keyboardShortcuts: true,
      };

      const map = new kakao.maps.Map(mapContainer, mapOption);
      mapInstanceRef.current = map;
      window.currentMap = map;

      setMapLoaded(true);

      // 타일 로드 1회성 콜백 (중복 등록 방지)
      // 초기 로드 시 마커 추가는 useEffect에서 처리
      console.log('지도 초기화 완료');
      addMapEventListeners(map);

      // tilesloaded 이벤트는 마커 추가와 무관하게 처리
      kakao.maps.event.addListener(map, 'tilesloaded', () => {
        console.log('tilesloaded 이벤트 발생');
      });

      // 초기 로드 시 즉시 반응형 크기 적용 (숨겨진 툴팁도 포함)
      setTimeout(() => {
        console.log('초기 로드 후 마커 상태 확인...');
        console.log('총 오버레이 수:', overlaysRef.current.length);

        // 마커가 제대로 표시되었는지 확인
        overlaysRef.current.forEach((item, index) => {
          if (item.getMap) {
            console.log(`오버레이 ${index}: 지도에 표시됨:`, item.getMap() !== null);
          }
        });

        updateTooltipSizes(map, true); // true = 초기 로드
      }, 500);
    } catch (error) {
      console.error('지도 초기화 실패:', error);
    }
  };

  const addMapEventListeners = (map) => {
    // 줌 변경 시 즉시 반응형 크기 조정
    kakao.maps.event.addListener(map, 'zoom_changed', () => {
      updateTooltipSizes(map);
    });

    // 지도 중심 변경 시 즉시 반응형 크기 조정
    kakao.maps.event.addListener(map, 'center_changed', () => {
      updateTooltipSizes(map);
    });

    // 드래그 중에도 실시간으로 반응형 크기 조정 (성능 최적화)
    let dragTimeout;
    kakao.maps.event.addListener(map, 'drag', () => {
      clearTimeout(dragTimeout);
      dragTimeout = setTimeout(() => {
        updateTooltipSizes(map);
      }, 50); // 드래그 중에는 50ms 딜레이로 제한
    });

    // 드래그 종료 시 즉시 업데이트
    kakao.maps.event.addListener(map, 'dragend', () => {
      clearTimeout(dragTimeout);
      updateTooltipSizes(map);
    });

    // 지도 클릭 시 모든 툴팁만 숨김 (마커는 유지)
    kakao.maps.event.addListener(map, 'click', () => {
      const currentLevel = map.getLevel();
      console.log(`현재 지도 레벨: ${currentLevel}`);

      // 지도 클릭 시 모든 툴팁만 숨김 (마커는 유지)
      hideAllTooltips();

      // 모든 마커를 원래 상태로 복원 (색상만 변경)
      overlaysRef.current.forEach((item) => {
        if (item.setImage && item.defaultIcon) {
          item.setImage(item.defaultIcon);
          item.setZIndex(1);
        }
      });
    });
  };

  // === 지도 레벨에 따른 반응형 크기 조정 ===
  const updateTooltipSizes = (map, isInitialLoad = false) => {
    const currentLevel = map.getLevel();
    console.log('지도 레벨 변경:', currentLevel, isInitialLoad ? '(초기 로드)' : '');

    // 레벨에 따른 크기 조정
    let scaleFactor, fontSize;

    if (currentLevel <= 3) {
      scaleFactor = 1.2; // 확대
      fontSize = '16px'; // 큰 글자
    } else if (currentLevel <= 6) {
      scaleFactor = 1.0; // 기본 크기
      fontSize = '14px'; // 기본 글자
    } else if (currentLevel <= 9) {
      scaleFactor = 0.8; // 축소
      fontSize = '12px'; // 작은 글자
    } else if (currentLevel <= 12) {
      scaleFactor = 0.6; // 더 축소
      fontSize = '10px'; // 더 작은 글자
    } else {
      scaleFactor = 0.4; // 최소 크기
      fontSize = '8px'; // 최소 글자
    }

    // 표시된 툴팁에만 크기와 마진 적용 (애니메이션 효과 없음)
    const tooltips = document.querySelectorAll(`.${styles.tooltipOverlay}`);
    console.log(`툴팁 개수: ${tooltips.length}, 초기 로드: ${isInitialLoad}`);

    tooltips.forEach((tooltip, index) => {
      // 초기 로드가 아니면 숨겨진 툴팁은 건드리지 않음
      if (!isInitialLoad && tooltip.style.display === 'none') {
        console.log(`툴팁 ${index}: 숨겨짐 - 건드리지 않음`);
        return;
      }

      console.log(`툴팁 ${index}: 처리 중, display: ${tooltip.style.display}`);

      tooltip.style.transform = `scale(${scaleFactor})`;
      tooltip.style.transformOrigin = 'top left'; // 왼쪽 위 기준으로 크기 조정

      // 툴팁 높이만큼 위로 이동 + 왼쪽으로도 살짝 이동 (핀과 겹치지 않도록)
      const tooltipHeight = tooltip.offsetHeight || 100; // 기본값 설정
      const scaledHeight = tooltipHeight * scaleFactor;
      const dynamicMarginTop = `-${scaledHeight + 45}px`; // 15px 여유 공간 추가
      const dynamicMarginLeft = `-30px`; // 왼쪽으로 20px 이동

      tooltip.style.marginTop = dynamicMarginTop;
      tooltip.style.marginLeft = dynamicMarginLeft;

      // 내부 텍스트 크기도 조정 (애니메이션 효과 없음)
      const titleEls = tooltip.querySelectorAll('.ToolTipModuleTitle');
      const contentEls = tooltip.querySelectorAll('.ToolTipModuleContent');

      titleEls.forEach((el) => {
        el.style.fontSize = fontSize;
      });

      contentEls.forEach((el) => {
        el.style.fontSize = `calc(${fontSize} - 2px)`;
      });

      // 초기 로드 시 마진 적용 후 툴팁을 다시 숨김
      if (isInitialLoad) {
        tooltip.style.display = 'none';
      }

      console.log(
        `툴팁 ${index}: 마진 적용 완료 - marginTop: ${tooltip.style.marginTop}, transform: ${tooltip.style.transform}`
      );
    });

    console.log(`레벨 ${currentLevel}: 크기 ${scaleFactor.toFixed(1)}x, 글자 ${fontSize}`);
  };

  // === 마커와 오버레이 관리 ===
  const clearAllOverlays = (map) => {
    overlaysRef.current.forEach((item) => {
      if (item.setMap) {
        item.setMap(null); // 마커나 오버레이 제거
      }
    });
    overlaysRef.current = [];
  };

  // 모든 툴팁을 숨기는 함수
  const hideAllTooltips = () => {
    const tooltips = document.querySelectorAll(`.${styles.tooltipOverlay}`);
    tooltips.forEach((tooltip) => {
      tooltip.style.display = 'none';
    });
  };

  // 특정 툴팁을 제외한 다른 모든 툴팁을 숨기는 함수
  const hideOtherTooltips = (currentTooltip) => {
    const tooltips = document.querySelectorAll(`.${styles.tooltipOverlay}`);
    tooltips.forEach((tooltip) => {
      if (tooltip !== currentTooltip) {
        tooltip.style.display = 'none';
      }
    });
  };

  // 학교로 지도 이동하는 함수
  const moveToSchool = () => {
    if (!mapInstanceRef.current) return;

    console.log('현재 지도 상태:', {
      center: mapInstanceRef.current.getCenter(),
      level: mapInstanceRef.current.getLevel(),
      schoolLocation: schoolLocation,
    });

    // 학교 위치로 지도 이동
    const schoolLocationLatLng = new kakao.maps.LatLng(schoolLocation.lat, schoolLocation.lng);

    try {
      // 부드러운 애니메이션으로 학교 위치로 이동
      console.log('panTo 호출 시도...');
      mapInstanceRef.current.panTo(schoolLocationLatLng);
      console.log('panTo 호출 성공');

      // 줌 레벨 설정을 약간 지연시켜 panTo 완료 후 실행
      setTimeout(() => {
        mapInstanceRef.current.setLevel(4);
        console.log('줌 레벨 4로 설정 완료');
      }, 300);
    } catch (error) {
      console.error('panTo 실패, setCenter로 폴백:', error);
      // panTo 실패 시 setCenter로 폴백
      mapInstanceRef.current.setCenter(schoolLocationLatLng);
      mapInstanceRef.current.setLevel(4);
    }

    console.log('학교 위치로 이동 완료:', schoolLocation.lat, schoolLocation.lng);
  };

  // 현재 위치로 지도 이동하는 함수
  const moveToCurrentLocation = () => {
    if (!mapInstanceRef.current) return;

    setLocationLoading(true);
    setLocationError(null);

    // 이미 현재 위치가 있다면 그 위치로 이동
    if (currentLocation) {
      const currentLocationLatLng = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);

      console.log('현재 위치로 이동 시작...');
      console.log('현재 지도 상태:', {
        center: mapInstanceRef.current.getCenter(),
        level: mapInstanceRef.current.getLevel(),
        targetLocation: currentLocation,
      });

      try {
        // 부드러운 애니메이션으로 현재 위치로 이동
        console.log('현재 위치로 panTo 호출 시도...');
        mapInstanceRef.current.panTo(currentLocationLatLng);
        console.log('현재 위치로 panTo 호출 성공');

        // 줌 레벨 설정을 약간 지연시켜 panTo 완료 후 실행
        setTimeout(() => {
          mapInstanceRef.current.setLevel(3);
          console.log('줌 레벨 3으로 설정 완료');
        }, 300);
      } catch (error) {
        console.error('panTo 실패, setCenter로 폴백:', error);
        // panTo 실패 시 setCenter로 폴백
        mapInstanceRef.current.setCenter(currentLocationLatLng);
        mapInstanceRef.current.setLevel(3);
      }

      console.log('저장된 현재 위치로 이동 완료:', currentLocation);
      setLocationLoading(false);
      return;
    }

    // 현재 위치가 없다면 새로 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);

          // 현재 위치 마커 생성
          createCurrentLocationMarker(location);

          // 지도를 현재 위치로 부드럽게 이동
          const currentLocationLatLng = new kakao.maps.LatLng(latitude, longitude);

          console.log('새 위치로 이동 시작...');
          console.log('현재 지도 상태:', {
            center: mapInstanceRef.current.getCenter(),
            level: mapInstanceRef.current.getLevel(),
            targetLocation: { lat: latitude, lng: longitude },
          });

          try {
            console.log('새 위치로 panTo 호출 시도...');
            mapInstanceRef.current.panTo(currentLocationLatLng);
            console.log('새 위치로 panTo 호출 성공');

            // 줌 레벨 설정을 약간 지연시켜 panTo 완료 후 실행
            setTimeout(() => {
              mapInstanceRef.current.setLevel(3);
              console.log('줌 레벨 3으로 설정 완료');
            }, 300);
          } catch (error) {
            console.error('panTo 실패, setCenter로 폴백:', error);
            // panTo 실패 시 setCenter로 폴백
            mapInstanceRef.current.setCenter(currentLocationLatLng);
            mapInstanceRef.current.setLevel(3);
          }

          console.log('현재 위치로 부드럽게 이동 완료:', latitude, longitude);
          setLocationLoading(false);
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          setLocationError('위치 정보를 가져올 수 없습니다.');
          setLocationLoading(false);

          // 에러 메시지 표시
          setTimeout(() => {
            setLocationError(null);
          }, 3000);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setLocationError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      setLocationLoading(false);

      setTimeout(() => {
        setLocationError(null);
      }, 3000);
    }
  };

  // 마커를 툴팁 너비를 고려해서 오른쪽에 위치시키는 함수 (줌 레벨에 따라 조정)
  const centerMapForTooltip = (map, markerPosition) => {
    console.log('마커를 툴팁 너비를 고려해서 오른쪽에 위치시키는 중...');

    const currentLevel = map.getLevel();

    // 줌 레벨에 따라 기본 이동 거리 조정 (레벨이 클수록 아주 미세하게 오른쪽으로 이동)
    let baseOffsetX = 0.0005; // 기본값
    if (currentLevel == 1) {
      baseOffsetX = -0.0002; // 레벨 1 - 살짝 왼쪽으로 이동
    } else if (currentLevel <= 2) {
      baseOffsetX = 0.0001; // 레벨 1 - 아주아주 미세하게 오른쪽으로 이동
    } else if (currentLevel <= 3) {
      baseOffsetX = 0.001; // 매우 확대된 상태 - 아주 미세하게 오른쪽으로 이동
    } else if (currentLevel <= 5) {
      baseOffsetX = 0.002; // 확대된 상태 - 미세하게 오른쪽으로 이동
    } else if (currentLevel <= 7) {
      baseOffsetX = 0.005; // 보통 상태 - 중간 이동
    } else if (currentLevel <= 9) {
      baseOffsetX = 0.003; // 축소된 상태 - 작게 이동
    } else {
      baseOffsetX = 0.0001; // 매우 축소된 상태 - 아주 작게 이동
    }

    // 줌 레벨에 따라 위아래 이동 거리 조정 (마커를 살짝 아래로 이동)
    let baseOffsetY = -0.0001; // 기본값 - 살짝 아래로

    // 툴팁 너비를 고려한 추가 오프셋 (줌 레벨에 따라 조정)
    // 줌 레벨이 높을수록(더 확대) 툴팁이 상대적으로 크게 보이므로 더 많이 이동
    let tooltipOffsetX = 0.0002; // 기본 툴팁 오프셋
    if (currentLevel <= 3) {
      tooltipOffsetX = 0.0005; // 매우 확대된 상태 - 툴팁을 위해 더 많이 이동
    } else if (currentLevel <= 5) {
      tooltipOffsetX = 0.0004; // 확대된 상태 - 툴팁을 위해 많이 이동
    } else if (currentLevel <= 7) {
      tooltipOffsetX = 0.0003; // 보통 상태 - 툴팁을 위해 중간 이동
    } else if (currentLevel <= 9) {
      tooltipOffsetX = 0.0002; // 축소된 상태 - 툴팁을 위해 작게 이동
    } else {
      tooltipOffsetX = 0.0001; // 매우 축소된 상태 - 툴팁을 위해 아주 작게 이동
    }

    // 총 오프셋 = 기본 오프셋 + 툴팁 오프셋
    const totalOffsetX = baseOffsetX + tooltipOffsetX;

    // 마커를 툴팁 너비와 높이를 고려해서 이동
    const newCenter = new kakao.maps.LatLng(
      markerPosition.getLat() - baseOffsetY, // 위도는 아래로 (위도는 감소하면 아래로 이동)
      markerPosition.getLng() + totalOffsetX // 경도는 오른쪽으로
    );

    console.log(`=== 줌 레벨 정보 ===`);
    console.log(`현재 줌 레벨: ${currentLevel}`);
    console.log(
      `줌 레벨 범위: ${currentLevel <= 3 ? '1-3 (매우 확대)' : currentLevel <= 5 ? '4-5 (확대)' : currentLevel <= 7 ? '6-7 (보통)' : currentLevel <= 9 ? '8-9 (축소)' : '10+ (매우 축소)'}`
    );
    console.log(`X축 기본 이동: ${baseOffsetX}`);
    console.log(`Y축 기본 이동: ${baseOffsetY} (아래로)`);
    console.log(`X축 툴팁 오프셋: ${tooltipOffsetX}`);
    console.log(`X축 총 이동: ${totalOffsetX}`);
    console.log(
      `최종 위치: 위도 ${markerPosition.getLat() - baseOffsetY}, 경도 ${markerPosition.getLng() + totalOffsetX}`
    );
    console.log(`====================`);
    map.panTo(newCenter);
    console.log('마커 툴팁 고려 이동 완료');
  };

  const refreshOverlays = (map) => {
    addTooltipOverlays(map);
  };

  const addTooltipOverlays = useCallback(
    (map) => {
      console.log('addTooltipOverlays 시작...', {
        testMarkers,
        testMarkersLength: testMarkers?.length,
        map: !!map,
        overlaysRefLength: overlaysRef.current.length,
      });

      if (!testMarkers || testMarkers.length === 0) {
        console.log('testMarkers가 비어있음 - 마커 생성 불가');
        return;
      }
      if (!map) {
        console.log('map이 null임 - 마커 생성 불가');
        return;
      }

      console.log('기존 오버레이 제거 중...');
      clearAllOverlays(map);

      console.log(`${testMarkers.length}개의 마커 추가 시작`);
      testMarkers.forEach((markerData, index) => {
        console.log(`마커 ${index + 1} 추가 중:`, markerData);
        addTooltipOverlay(map, markerData);
      });

      console.log('addTooltipOverlays 완료, 총 오버레이 수:', overlaysRef.current.length);
    },
    [testMarkers]
  );

  // 기본 마커는 크기 조정이 자동으로 됨 (카카오맵에서 관리)

  // === 핀만 표시하고 클릭 시 툴팁 표시 ===
  const addTooltipOverlay = (map, markerData) => {
    console.log('addTooltipOverlay 시작:', {
      name: markerData.name,
      lat: markerData.lat,
      lng: markerData.lng,
      category: markerData.category,
      fullData: markerData,
    });

    if (!markerData.lat || !markerData.lng) {
      console.error('마커 좌표가 없습니다:', markerData);
      return;
    }

    const markerPosition = new kakao.maps.LatLng(markerData.lat, markerData.lng);

    // 1. 커스텀 SVG 마커 이미지로 생성 (모든 마커는 보라색)
    const defaultIcon = new kakao.maps.MarkerImage(
      'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 18 25" fill="none">
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="#7C3AED"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <circle cx="9" cy="9.5" r="3" fill="white"/>
        </svg>
      `),
      new kakao.maps.Size(32, 40),
      { offset: new kakao.maps.Point(16, 40) }
    );

    // 선택된 마커용 핑크색 아이콘
    const selectedIcon = new kakao.maps.MarkerImage(
      'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 18 25" fill="none">
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="#EC4899"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <circle cx="9" cy="9.5" r="3" fill="white"/>
        </svg>
      `),
      new kakao.maps.Size(32, 40),
      { offset: new kakao.maps.Point(16, 40) }
    );

    const clickedIcon = new kakao.maps.MarkerImage(
      'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 18 25" fill="white">
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="#FF616D"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <circle cx="9" cy="9.5" r="3" fill="white"/>
        </svg>
      `),
      new kakao.maps.Size(32, 40),
      { offset: new kakao.maps.Point(16, 40) }
    );

    const marker = new kakao.maps.Marker({
      position: markerPosition,
      map: map,
      image: defaultIcon,
      zIndex: 1000, // 상점 마커는 높은 zIndex로 앞에 표시
    });

    // 마커 위에 카테고리 라벨 추가
    const labelDiv = document.createElement('div');
    labelDiv.className = styles.categoryLabel;
    labelDiv.style.cssText = `
      position: absolute;
      background: #7C3AED;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: bold;
      white-space: nowrap;
      z-index: 1000;
      transform: translate(-50%, -100%);
      margin-top: -45px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    // 카테고리명을 한글로 변환
    const categoryDisplayNames = {
      cafe: '카페',
      beauty: '뷰티',
      convenience: '편의점',
      restaurant: '음식점',
      shopping: '쇼핑',
    };

    labelDiv.textContent = categoryDisplayNames[markerData.category] || markerData.category;

    // 라벨을 마커와 함께 지도에 추가
    const labelOverlay = new kakao.maps.CustomOverlay({
      map: map,
      position: markerPosition,
      content: labelDiv,
      yAnchor: 1,
      zIndex: 1000,
    });

    // 마커에 아이콘과 라벨 참조 저장 (색상 변경용)
    marker.defaultIcon = defaultIcon;
    marker.selectedIcon = selectedIcon;
    marker.categoryLabel = labelOverlay;
    marker.markerData = markerData; // 마커 데이터 저장 (ID 검색용)

    // 2. ToolTipModule을 content로 사용 (초기에는 숨김)
    const tooltipDiv = document.createElement('div');
    tooltipDiv.className = styles.tooltipOverlay;
    tooltipDiv.style.display = 'none'; // 초기에는 숨김
    tooltipDiv.style.zIndex = '9999'; // 마커보다 위에 표시

    const tooltipRoot = createRoot(tooltipDiv);
    tooltipRoot.render(
      <ToolTipModule
        name={markerData.name}
        content={markerData.content || `${markerData.companyName} ${markerData.discountRate}% 할인`}
        address={markerData.address}
        lat={markerData.lat}
        lng={markerData.lng}
        phone={markerData.phone}
        businessHours={markerData.businessHours}
        startDate={markerData.startDate}
        endDate={markerData.endDate}
        status={markerData.status}
        partnershipId={markerData.partnershipId}
        images={markerData.images}
        partnerships={partnerships}
        companyName={markerData.companyName}
        discountRate={markerData.discountRate}
        discountAmount={markerData.discountAmount}
        terms={markerData.terms}
        category={markerData.category.toUpperCase()}
        storeId={markerData.id || markerData.partnershipBranchDto?.id}
      />
    );

    // 3. 커스텀 오버레이 생성 (초기에는 숨김)
    const customOverlay = new kakao.maps.CustomOverlay({
      map: map,
      position: markerPosition,
      content: tooltipDiv,
      yAnchor: 1,
      zIndex: 9999, // 마커보다 위에 표시
    });

    // 마커 클릭 이벤트 (툴팁 표시/숨김 토글 + 마커 색상 변경)
    marker.addListener('click', () => {
      const currentMap = window.currentMap || map;
      if (!currentMap) return;

      try {
        // 툴팁 표시/숨김 토글
        if (tooltipDiv.style.display === 'none') {
          hideOtherTooltips(tooltipDiv);
          overlaysRef.current.forEach((item) => {
            if (item.setImage && item !== marker) {
              // 저장된 기본 아이콘으로 복원
              if (item.defaultIcon) {
                item.setImage(item.defaultIcon);
              }
              item.setZIndex(1);

              // 카테고리 라벨도 보라색으로 복원
              if (item.categoryLabel && item.categoryLabel.getContent) {
                const labelContent = item.categoryLabel.getContent();
                if (labelContent) {
                  labelContent.style.background = '#7C3AED';
                }
              }
            }
          });

          // 클릭된 마커를 핑크색으로 변경
          marker.setZIndex(1000); // 클릭된 마커를 위로 올림
          marker.setImage(marker.selectedIcon);

          // 클릭된 마커의 카테고리 라벨도 핑크색으로 변경
          if (marker.categoryLabel && marker.categoryLabel.getContent) {
            const labelContent = marker.categoryLabel.getContent();
            if (labelContent) {
              labelContent.style.background = '#EC4899';
            }
          }

          // 툴팁을 먼저 표시 (지도 이동 전에)
          tooltipDiv.style.display = 'block';

          // 지도 이동을 툴팁 표시 후에 실행
          setTimeout(() => {
            centerMapForTooltip(currentMap, markerPosition);

            // 지도 이동 완료 후 드래그 기능 복원
            setTimeout(() => {
              if (currentMap && currentMap.setDraggable) {
                currentMap.setDraggable(true);
              }
            }, 500);
          }, 100); // 툴팁 표시 후 100ms 뒤 지도 이동

          // 마진 재계산을 더 늦게 실행
          setTimeout(() => {
            if (tooltipDiv.style.display !== 'none') {
              updateTooltipSizes(map);
            } else {
              console.log('툴팁이 이미 숨겨짐 - 마진 재계산 생략');
            }
          }, 800); // 지도 이동 완료 후 마진 재계산
        } else {
          // 툴팁이 숨겨질 때 원래 보라색으로 복원
          marker.setZIndex(1);
          marker.setImage(marker.defaultIcon);

          // 카테고리 라벨도 보라색으로 복원
          if (marker.categoryLabel && marker.categoryLabel.getContent) {
            const labelContent = marker.categoryLabel.getContent();
            if (labelContent) {
              labelContent.style.background = '#7C3AED';
            }
          }
          tooltipDiv.style.display = 'none';
        }
      } catch (error) {
        console.error('마커 클릭 처리 중 오류:', error);
      }
    });

    // 마커, 오버레이, 라벨을 배열에 추가
    overlaysRef.current.push(marker);
    overlaysRef.current.push(customOverlay);
    overlaysRef.current.push(labelOverlay);

    // 마커 ID 정보 콘솔 출력 (디버깅용)
    console.log(`마커 생성 완료 - ID: ${markerData.id}, 이름: ${markerData.name}, 카테고리: ${markerData.category}`);
  };

  return (
    <div className={styles.mapContainer}>
      {/* 카테고리 버튼들 */}
      {mapLoaded && (
        <CategoryButtons
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}

      <div ref={mapRef} id="map" className={styles.map} />

      {/* CharacterBtn과 위성 버튼들 */}
      {mapLoaded && (
        <CharacterButtonGroup
          showGptInput={showGptInput}
          onChatbotClick={handleChatbotClick}
          onSchoolClick={handleSchoolClick}
          onLocationClick={handleLocationClick}
          locationLoading={locationLoading}
          locationError={locationError}
          currentLocation={currentLocation}
        />
      )}

      {/* GPT 입력창 */}
      {showGptInput && (
        <div className={styles.gptInputContainer}>
          <GptInput 
            placeholder="주변에 제휴 가능한 카페 있으면 알려줘!"
            onInputSubmit={handleGptInputSubmit}
          />
        </div>
      )}

      {/* 슬라이딩 패널 */}
      <SlidingPanel 
        currentLocation={currentLocation} 
        onStoreSelect={handleStoreSelect}
      />

      {/* 현재 위치 마커 (ListItemBox 컴포넌트) */}
      {mapLoaded && currentLocation && currentLocationMarker && (
        <ListItemBox
          position={currentLocationMarker.location}
          mapInstance={mapInstanceRef.current}
          onMarkerClick={(location) => {
            console.log('ListItemBox에서 마커 클릭됨:', location);
            const currentLocationLatLng = new kakao.maps.LatLng(location.lat, location.lng);

            // 부드러운 이동 애니메이션으로 현재 위치로 이동
            mapInstanceRef.current.panTo(currentLocationLatLng);

            // 이동 완료 후 줌 레벨 조정
            setTimeout(() => {
              mapInstanceRef.current.setLevel(4); // 지도 레벨을 4로 설정
            }, 300);
          }}
          zIndex={100} // 낮은 zIndex로 뒤에 표시
        />
      )}

      {/* 학교 마커 (ListItemBox 컴포넌트) */}
      {mapLoaded && mapInstanceRef.current && (
        <ListItemBox
          position={schoolLocation}
          mapInstance={mapInstanceRef.current}
          // onMarkerClick={(location) => {
          //   console.log('학교 마커에서 클릭됨:', location);
          //   const schoolLocationLatLng = new kakao.maps.LatLng(location.lat, location.lng);

          //   // 부드러운 이동 애니메이션으로 학교 위치로 이동
          //   mapInstanceRef.current.panTo(schoolLocationLatLng);

          //   // 이동 완료 후 줌 레벨 조정
          //   setTimeout(() => {
          //     mapInstanceRef.current.setLevel(4); // 지도 레벨을 4로 설정
          //   }, 300);
          // }}
          imagePath={import.meta.env.BASE_URL + "assets/images/map/school.png"}
          imageSize={60}
          circleRadius={20}
          strokeColor="#ed3241"
          fillColor="#FFFFFF"
          zIndex={50} // 더 낮은 zIndex로 뒤에 표시
        />
      )}
    </div>
  );
};
export default MapView;