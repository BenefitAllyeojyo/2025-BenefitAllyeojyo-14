import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const PRIMARY = '#542BA8';
const ACCENT = '#7635FD';

export default function IndexPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brandEmoji}>🟣</Text>
          <Text style={styles.brandTitle}>Heyyoung</Text>
          <Text style={styles.brandSubtitle}>매니저 전용 앱</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('BranchSelect')}
          >
            <Text style={styles.btnPrimaryText}>사장님 결제하기</Text>
            <Text style={styles.btnPrimarySub}>QR 스캔으로 결제 진행</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.btnSecondaryText}>사장님 대시보드</Text>
            <Text style={styles.btnSecondarySub}>매출 및 통계 확인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnTertiary}
            onPress={() => navigation.navigate('SchoolDashboard')}
          >
            <Text style={styles.btnTertiaryText}>학교 대시보드</Text>
            <Text style={styles.btnTertiarySub}>제휴 업점 확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4FF'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 60
  },
  brandEmoji: {
    fontSize: 24,
    marginBottom: 8
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#6E6B7A'
  },
  buttonContainer: {
    gap: 16
  },
  btnPrimary: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  btnPrimarySub: {
    color: '#EDE8FF',
    fontSize: 14,
    marginTop: 4
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ACCENT,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  btnSecondaryText: {
    color: ACCENT,
    fontSize: 18,
    fontWeight: '700'
  },
  btnSecondarySub: {
    color: '#6E6B7A',
    fontSize: 14,
    marginTop: 4
  },
  btnTertiary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  btnTertiaryText: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700'
  },
  btnTertiarySub: {
    color: '#6E6B7A',
    fontSize: 14,
    marginTop: 4
  }
});
