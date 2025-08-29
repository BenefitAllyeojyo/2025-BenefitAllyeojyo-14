import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

const PRIMARY = '#542BA8';
const ACCENT = '#7635FD';
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function DashboardPage({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todayBenefitUsers: 0,
    todayBenefitRevenue: 0,
    todayDiscountRate: 0,
    todayTransactionCount: 0,
    recentTransactions: []
  });

  const fetchDashboardData = async () => {
    try {
      // 실제 API 호출 (현재는 더미 데이터)
      // const response = await fetch(`${API_BASE_URL}/dashboard/today`);
      // const data = await response.json();
      
      // 더미 데이터 (실제로는 API에서 받아올 데이터)
      const mockData = {
        todayBenefitUsers: 5,
        todayBenefitRevenue: 1250000,
        todayDiscountRate: 15.5,
        todayTransactionCount: 127,
        recentTransactions: [
          {
            id: 1,
            time: '14:30',
            amount: 15000,
            discountAmount: 1500,
            description: '아메리카노 2잔',
            customerType: '헤이영 혜택'
          },
          {
            id: 2,
            time: '14:15',
            amount: 8500,
            discountAmount: 850,
            description: '카페라떼 1잔',
            customerType: '헤이영 혜택'
          },
          {
            id: 3,
            time: '14:00',
            amount: 12000,
            discountAmount: 1200,
            description: '카푸치노 2잔',
            customerType: '헤이영 혜택'
          },
          {
            id: 4,
            time: '13:45',
            amount: 18000,
            discountAmount: 1800,
            description: '아메리카노 3잔',
            customerType: '헤이영 혜택'
          },
          {
            id: 5,
            time: '13:30',
            amount: 9500,
            discountAmount: 950,
            description: '카페모카 1잔',
            customerType: '헤이영 혜택'
          }
        ]
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  const formatPercentage = (rate) => {
    return `${rate}%`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>대시보드</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeEmoji}>📊</Text>
          <Text style={styles.welcomeTitle}>헤이영 제휴 대시보드</Text>
          <Text style={styles.welcomeSubtitle}>오늘의 제휴 혜택 통계를 확인하세요</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValue}>{dashboardData.todayBenefitUsers}명</Text>
            <Text style={styles.statLabel}>오늘 헤이영 제휴 혜택 받은 사람수</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statValue}>{formatCurrency(dashboardData.todayBenefitRevenue)}</Text>
            <Text style={styles.statLabel}>제휴 혜택 관련 이번달 매출</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statValue}>10.0%</Text>
            <Text style={styles.statLabel}>제휴 혜택 할인 비율</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📈</Text>
            <Text style={styles.statValue}>{dashboardData.todayTransactionCount}건</Text>
            <Text style={styles.statLabel}>이번달 제휴 거래 건수</Text>
          </View>
        </View>


        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 오늘 요약</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>제휴 매출:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(63000)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>제휴 할인 총액:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(6300)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>제휴 거래 건수:</Text>
            <Text style={styles.summaryValue}>5건</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>📋 최근 제휴 거래내역</Text>
          </View>
          
                     {dashboardData.recentTransactions.map((transaction, index) => (
             <View key={transaction.id} style={styles.transactionItem}>
               <View style={styles.transactionLeft}>
                 <Text style={styles.transactionTime}>{transaction.time}</Text>
                 <Text style={styles.transactionDesc}>{transaction.description}</Text>
               </View>
               <View style={styles.transactionRight}>
                 <Text style={styles.transactionAmount}>{formatCurrency(transaction.amount)}</Text>
                 <Text style={styles.discountAmount}>-{formatCurrency(transaction.discountAmount)}</Text>
               </View>
             </View>
           ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 이 데이터는 예시 데이터 입니다.
          </Text>
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
  content: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
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
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  welcomeEmoji: {
    fontSize: 32,
    marginBottom: 8
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 4
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6E6B7A',
    textAlign: 'center'
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#6E6B7A',
    textAlign: 'center',
    lineHeight: 16
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2A2A'
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0F0F0'
  },
  viewAllText: {
    fontSize: 12,
    color: '#6E6B7A',
    fontWeight: '600'
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  transactionLeft: {
    flex: 1
  },
  transactionTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 4
  },
  transactionDesc: {
    fontSize: 13,
    color: '#6E6B7A',
    marginBottom: 6
  },
  customerTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  benefitBadge: {
    backgroundColor: '#E8F5E8'
  },
  normalBadge: {
    backgroundColor: '#F0F0F0'
  },
  customerTypeText: {
    fontSize: 10,
    fontWeight: '600'
  },
  transactionRight: {
    alignItems: 'flex-end'
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 2
  },
  discountAmount: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600'
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6E6B7A'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2A2A'
  },
  noteCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0EA5E9'
  },
  noteText: {
    fontSize: 13,
    color: '#0EA5E9',
    textAlign: 'center',
    lineHeight: 18
  }
});
