import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

const PRIMARY = '#542BA8';
const ACCENT = '#7635FD';
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function SchoolDashboardPage({ navigation }) {
  const [partnerships, setPartnerships] = useState([]);
  const [filteredPartnerships, setFilteredPartnerships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPartnerships();
  }, []);

  useEffect(() => {
    filterPartnerships();
  }, [partnerships, searchQuery]);

  const generateMockData = () => {
    const mockPartnerships = [
      { id: 1, name: '스타벅스 강남점', discountRate: 15, status: 'active', address: '서울 강남구 테헤란로 123', phone: '02-1234-5678', partnershipStart: '2024-01-15', partnershipEnd: '2025-01-15' },
      { id: 2, name: '맥도날드 홍대점', discountRate: 10, status: 'active', address: '서울 마포구 홍대로 456', phone: '02-2345-6789', partnershipStart: '2024-02-01', partnershipEnd: '2025-02-01' },
      { id: 3, name: '버거킹 신촌점', discountRate: 12, status: 'active', address: '서울 서대문구 신촌로 789', phone: '02-3456-7890', partnershipStart: '2024-03-10', partnershipEnd: '2025-03-10' },
      { id: 4, name: '올리브영 명동점', discountRate: 8, status: 'active', address: '서울 중구 명동길 321', phone: '02-4567-8901', partnershipStart: '2024-01-20', partnershipEnd: '2025-01-20' },
      { id: 5, name: '이마트 잠실점', discountRate: 5, status: 'active', address: '서울 송파구 올림픽로 654', phone: '02-5678-9012', partnershipStart: '2024-04-05', partnershipEnd: '2025-04-05' },
      { id: 6, name: '롯데마트 강남점', discountRate: 7, status: 'active', address: '서울 강남구 삼성로 987', phone: '02-6789-0123', partnershipStart: '2024-02-15', partnershipEnd: '2025-02-15' },
      { id: 7, name: '홈플러스 잠실점', discountRate: 6, status: 'active', address: '서울 송파구 잠실로 147', phone: '02-7890-1234', partnershipStart: '2024-03-20', partnershipEnd: '2025-03-20' },
      { id: 8, name: 'CU 편의점 강남점', discountRate: 3, status: 'active', address: '서울 강남구 역삼로 258', phone: '02-8901-2345', partnershipStart: '2024-01-10', partnershipEnd: '2025-01-10' },
      { id: 9, name: 'GS25 편의점 홍대점', discountRate: 4, status: 'active', address: '서울 마포구 와우산로 369', phone: '02-9012-3456', partnershipStart: '2024-02-25', partnershipEnd: '2025-02-25' },
      { id: 10, name: '세븐일레븐 신촌점', discountRate: 3, status: 'active', address: '서울 서대문구 연세로 741', phone: '02-0123-4567', partnershipStart: '2024-03-15', partnershipEnd: '2025-03-15' },
      { id: 11, name: '파리바게뜨 강남점', discountRate: 9, status: 'active', address: '서울 강남구 봉은사로 852', phone: '02-1234-5678', partnershipStart: '2024-04-01', partnershipEnd: '2025-04-01' },
      { id: 12, name: '뚜레쥬르 홍대점', discountRate: 8, status: 'active', address: '서울 마포구 동교로 963', phone: '02-2345-6789', partnershipStart: '2024-01-30', partnershipEnd: '2025-01-30' },
      { id: 13, name: '던킨도너츠 신촌점', discountRate: 11, status: 'active', address: '서울 서대문구 신촌로 159', phone: '02-3456-7890', partnershipStart: '2024-02-10', partnershipEnd: '2025-02-10' },
      { id: 14, name: '베스킨라빈스 강남점', discountRate: 13, status: 'active', address: '서울 강남구 테헤란로 753', phone: '02-4567-8901', phone: '02-4567-8901', partnershipStart: '2024-03-25', partnershipEnd: '2025-03-25' },
      { id: 15, name: '할리스 커피 홍대점', discountRate: 14, status: 'active', address: '서울 마포구 홍대로 951', phone: '02-5678-9012', partnershipStart: '2024-04-10', partnershipEnd: '2025-04-10' },
      { id: 16, name: '투썸플레이스 신촌점', discountRate: 12, status: 'active', address: '서울 서대문구 연세로 357', phone: '02-6789-0123', partnershipStart: '2024-01-05', partnershipEnd: '2025-01-05' },
      { id: 17, name: '이디야 커피 강남점', discountRate: 10, status: 'active', address: '서울 강남구 삼성로 159', phone: '02-7890-1234', partnershipStart: '2024-02-20', partnershipEnd: '2025-02-20' },
      { id: 18, name: '스무디킹 홍대점', discountRate: 16, status: 'active', address: '서울 마포구 와우산로 753', phone: '02-8901-2345', partnershipStart: '2024-03-30', partnershipEnd: '2025-03-30' },
      { id: 19, name: '공차 신촌점', discountRate: 11, status: 'active', address: '서울 서대문구 신촌로 951', phone: '02-9012-3456', partnershipStart: '2024-04-15', partnershipEnd: '2025-04-15' },
      { id: 20, name: '메가MGC커피 강남점', discountRate: 9, status: 'active', address: '서울 강남구 봉은사로 357', phone: '02-0123-4567', partnershipStart: '2024-01-25', partnershipEnd: '2025-01-25' },
      { id: 21, name: '네이처리퍼블릭 홍대점', discountRate: 7, status: 'pending', address: '서울 마포구 동교로 159', phone: '02-1234-5678', partnershipStart: '2024-05-01', partnershipEnd: '2025-05-01' },
      { id: 22, name: '아리따움 신촌점', discountRate: 6, status: 'pending', address: '서울 서대문구 연세로 753', phone: '02-2345-6789', partnershipStart: '2024-05-10', partnershipEnd: '2025-05-10' },
      { id: 23, name: '올리브영 강남점', discountRate: 8, status: 'pending', address: '서울 강남구 테헤란로 951', phone: '02-3456-7890', partnershipStart: '2024-05-15', partnershipEnd: '2025-05-15' },
      { id: 24, name: '롯데리아 홍대점', discountRate: 10, status: 'inactive', address: '서울 마포구 홍대로 357', phone: '02-4567-8901', partnershipStart: '2023-01-01', partnershipEnd: '2024-01-01' },
      { id: 25, name: 'KFC 신촌점', discountRate: 12, status: 'inactive', address: '서울 서대문구 신촌로 159', phone: '02-5678-9012', partnershipStart: '2023-02-01', partnershipEnd: '2024-02-01' }
    ];
    return mockPartnerships;
  };

  const fetchPartnerships = async () => {
    try {
      setIsLoading(true);
      // 실제 API 대신 가라 데이터 사용
      const mockData = generateMockData();
      setPartnerships(mockData);
    } catch (error) {
      Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPartnerships = () => {
    if (!searchQuery.trim()) {
      setFilteredPartnerships(partnerships);
    } else {
      const filtered = partnerships.filter(partnership =>
        partnership.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partnership.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partnership.id.toString().includes(searchQuery)
      );
      setFilteredPartnerships(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPartnerships();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return amount ? `₩${amount.toLocaleString()}` : '₩0';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#10B981';
      case 'inactive':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6E6B7A';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '활성';
      case 'inactive':
        return '비활성';
      case 'pending':
        return '대기중';
      default:
        return '알 수 없음';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>학교 대시보드</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 제휴 업점 현황</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{partnerships.length}</Text>
              <Text style={styles.statLabel}>전체 업점</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {partnerships.filter(p => p.status?.toLowerCase() === 'active').length}
              </Text>
              <Text style={styles.statLabel}>활성 업점</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {partnerships.filter(p => p.status?.toLowerCase() === 'pending').length}
              </Text>
              <Text style={styles.statLabel}>대기 업점</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="업점명, 주소, 지점 ID로 검색..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏪 제휴 업점 목록</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>업점 정보를 불러오는 중...</Text>
            </View>
          ) : filteredPartnerships.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 제휴 업점이 없습니다.'}
              </Text>
            </View>
          ) : (
            filteredPartnerships.map((partnership, index) => (
              <TouchableOpacity
                key={partnership.id || index}
                style={styles.partnershipCard}
                onPress={() => {
                  // 업점 상세 정보로 이동 (필요시 구현)
                  Alert.alert(
                    partnership.name || '업점 정보',
                    `지점 ID: ${partnership.id}\n할인율: ${partnership.discountRate}%\n상태: ${getStatusText(partnership.status)}\n제휴 기간: ${formatDate(partnership.partnershipStart)} ~ ${formatDate(partnership.partnershipEnd)}`
                  );
                }}
              >
                <View style={styles.partnershipHeader}>
                  <View style={styles.partnershipInfo}>
                    <Text style={styles.partnershipName}>
                      {partnership.name || `업점 ${partnership.id}`}
                    </Text>
                    <Text style={styles.partnershipId}>
                      지점 ID: {partnership.id}
                    </Text>
                  </View>
                  <View style={styles.headerRight}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(partnership.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {getStatusText(partnership.status)}
                      </Text>
                    </View>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{partnership.discountRate || 0}%</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.partnershipDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📍 주소:</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>
                      {partnership.address}
                    </Text>
                  </View>
                  
                  {partnership.phone && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>📞 연락처:</Text>
                      <Text style={styles.detailValue}>{partnership.phone}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📅 제휴 기간:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(partnership.partnershipStart)} ~ {formatDate(partnership.partnershipEnd)}
                    </Text>
                  </View>
                  
                  {partnership.status === 'active' && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>⏰ 남은 기간:</Text>
                      <Text style={[
                        styles.detailValue,
                        { color: getDaysRemaining(partnership.partnershipEnd) < 30 ? '#EF4444' : '#10B981' }
                      ]}>
                        {getDaysRemaining(partnership.partnershipEnd)}일
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4FF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4F5'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F4FF'
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2A2A'
  },
  content: {
    flex: 1,
    padding: 20
  },
  searchContainer: {
    marginBottom: 20
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E7E4F5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 16
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY
  },
  statLabel: {
    fontSize: 12,
    color: '#6E6B7A',
    marginTop: 4
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 16
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  loadingText: {
    fontSize: 16,
    color: '#6E6B7A'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyText: {
    fontSize: 16,
    color: '#6E6B7A'
  },
  partnershipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  partnershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8
  },
  partnershipInfo: {
    flex: 1
  },
  partnershipName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 4
  },
  partnershipId: {
    fontSize: 12,
    color: '#6E6B7A'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706'
  },
  partnershipDetails: {
    gap: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  detailLabel: {
    fontSize: 12,
    color: '#6E6B7A',
    width: 80,
    marginRight: 8
  },
  detailValue: {
    fontSize: 12,
    color: '#2A2A2A',
    flex: 1
  }
});
