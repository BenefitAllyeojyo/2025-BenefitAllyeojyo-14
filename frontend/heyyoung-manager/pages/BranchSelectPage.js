import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const PRIMARY = '#542BA8';
const ACCENT = '#7635FD';

export default function BranchSelectPage({ navigation }) {
  const [branchId, setBranchId] = useState('');

  const handleProceedToPayment = () => {
    if (!branchId.trim()) {
      Alert.alert('입력 오류', '지점 ID를 입력해주세요.');
      return;
    }

    // 결제 페이지로 이동하면서 지점 ID 전달
    navigation.navigate('Payment', { branchId: branchId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>지점 선택</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>🏪</Text>
            <Text style={styles.cardTitle}>지점 ID 입력</Text>
          </View>

          <Text style={styles.description}>
            결제할 지점의 ID를 입력해주세요.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>지점 ID</Text>
            <TextInput
              style={styles.input}
              placeholder="지점 ID를 입력하세요"
              value={branchId}
              onChangeText={setBranchId}
              keyboardType="numeric"
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.btnProceed, !branchId.trim() ? styles.btnDisabled : null]}
            onPress={handleProceedToPayment}
            disabled={!branchId.trim()}
          >
            <Text style={styles.btnProceedText}>결제하러 가기</Text>
            <Text style={styles.btnProceedSub}>지점 정보 확인 후 결제 진행</Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 안내사항</Text>
            <Text style={styles.infoText}>
              • 지점 ID는 매장에서 제공하는 고유 번호입니다{'\n'}
              • 입력 후 해당 지점의 할인율이 자동으로 적용됩니다{'\n'}
              • 잘못된 ID를 입력하면 결제 페이지에서 오류가 발생할 수 있습니다
            </Text>
          </View>
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
    padding: 20
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  cardEmoji: {
    fontSize: 20,
    marginRight: 8
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2A2A'
  },
  description: {
    fontSize: 14,
    color: '#6E6B7A',
    marginBottom: 24,
    lineHeight: 20
  },
  field: {
    marginBottom: 24
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#5C5C66',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E4F5',
    backgroundColor: '#FBFAFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#2A2A2A'
  },
  btnProceed: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6
  },
  btnDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0
  },
  btnProceedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  btnProceedSub: {
    color: '#EDE8FF',
    fontSize: 12,
    marginTop: 4
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    borderRadius: 12,
    padding: 16
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0EA5E9',
    marginBottom: 8
  },
  infoText: {
    fontSize: 12,
    color: '#0EA5E9',
    lineHeight: 18
  }
});
