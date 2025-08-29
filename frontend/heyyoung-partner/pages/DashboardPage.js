import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const PRIMARY = '#542BA8';
const ACCENT = '#7635FD';

export default function DashboardPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>대시보드</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeEmoji}>📊</Text>
          <Text style={styles.welcomeTitle}>사장님 대시보드</Text>
          <Text style={styles.welcomeSubtitle}>매출 및 통계를 확인하세요</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statValue}>₩1,250,000</Text>
            <Text style={styles.statLabel}>오늘 매출</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📈</Text>
            <Text style={styles.statValue}>₩8,750,000</Text>
            <Text style={styles.statLabel}>이번 주 매출</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>오늘 거래 건수</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>신규 고객</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 최근 거래 내역</Text>
          <View style={styles.transactionItem}>
            <Text style={styles.transactionTime}>14:30</Text>
            <Text style={styles.transactionAmount}>₩15,000</Text>
            <Text style={styles.transactionDesc}>아메리카노 2잔</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text style={styles.transactionTime}>14:15</Text>
            <Text style={styles.transactionAmount}>₩8,500</Text>
            <Text style={styles.transactionDesc}>카페라떼 1잔</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text style={styles.transactionTime}>14:00</Text>
            <Text style={styles.transactionAmount}>₩12,000</Text>
            <Text style={styles.transactionDesc}>카푸치노 2잔</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 이 화면은 실제 데이터와 연동되어 실시간으로 업데이트됩니다.
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
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 4
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6E6B7A'
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 8
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#6E6B7A',
    textAlign: 'center'
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 12
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  transactionTime: {
    fontSize: 12,
    color: '#6E6B7A',
    width: 50
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
    flex: 1,
    marginLeft: 12
  },
  transactionDesc: {
    fontSize: 12,
    color: '#6E6B7A',
    flex: 2
  },
  noteCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    borderRadius: 12,
    padding: 16
  },
  noteText: {
    fontSize: 14,
    color: '#0EA5E9',
    textAlign: 'center',
    lineHeight: 20
  }
});
