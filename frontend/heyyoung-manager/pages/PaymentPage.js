import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';

const PRIMARY = '#542BA8';
const ACCENT = '#7635FD';
  const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;



  export default function PaymentPage({ navigation, route }) {
  const [mode, setMode] = useState('form'); // 'form' | 'camera'
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const isHandlingScanRef = useRef(false);

  // 결제 정보 상태
  const [finalAmount, setFinalAmount] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [transactionSummary, setTransactionSummary] = useState('');
  const [partnershipBranchId, setPartnershipBranchId] = useState(route.params?.branchId || '');
  const [discountRate, setDiscountRate] = useState(0);
  const [isLoadingPartnership, setIsLoadingPartnership] = useState(false);

  // 지점 ID가 전달받았을 때 자동으로 지점 정보 가져오기
  useEffect(() => {
    if (partnershipBranchId) {
      fetchPartnershipInfo(partnershipBranchId);
    }
  }, []);

  const resetScanState = () => {
    setScanned(false);
    setQrToken('');
    isHandlingScanRef.current = false;
  };

  // 지점 정보 가져오기
  const fetchPartnershipInfo = async (branchId) => {
    if (!branchId) return;
    
    setIsLoadingPartnership(true);
    try {
      const response = await fetch(`${API_BASE_URL}/partnerships/${branchId}`);
      const data = await response.json();
      
      if (data.isSuccess && data.result) {
        setDiscountRate(data.result.discountRate);
        // 원래 금액이 있으면 최종 금액 재계산
        if (originalAmount) {
          const discountAmount = Math.floor((parseFloat(originalAmount.replace(/[^0-9]/g, '')) * data.result.discountRate) / 100);
          const finalAmountNumeric = parseFloat(originalAmount.replace(/[^0-9]/g, '')) - discountAmount;
          const formattedFinalAmount = Math.floor(finalAmountNumeric).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          setFinalAmount(formattedFinalAmount);
        }
      } else {
        Alert.alert('오류', '지점 정보를 가져올 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoadingPartnership(false);
    }
  };

  // 원래 금액 변경 시 최종 금액 자동 계산
  const handleOriginalAmountChange = (value) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // 3자리마다 컴마 추가
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    setOriginalAmount(formattedValue);
    
    if (numericValue && discountRate > 0) {
      const discountAmount = Math.floor((parseFloat(numericValue) * discountRate) / 100);
      const finalAmountNumeric = parseFloat(numericValue) - discountAmount;
      const formattedFinalAmount = Math.floor(finalAmountNumeric).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFinalAmount(formattedFinalAmount);
    } else if (numericValue) {
      const formattedFinalAmount = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFinalAmount(formattedFinalAmount);
    } else {
      setFinalAmount('');
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanned || isHandlingScanRef.current) return;
    setScanned(true);
    const qrData = String(data ?? '');
    setQrToken(qrData);
    
    // QR 스캔 성공하자마자 바로 결제 실행 (토큰 직접 전달)
    console.log('🔍 QR 스캔 성공, 바로 결제 실행');
    executePaymentWithToken(qrData);
  };

  const executePaymentWithToken = async (token) => {
    // 중복 실행 방지
    if (isHandlingScanRef.current) {
      console.log('🔍 이미 결제 처리 중입니다.');
      return;
    }
    isHandlingScanRef.current = true;

    // 입력값 검증
    if (!finalAmount || !originalAmount || !transactionSummary || !partnershipBranchId) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      isHandlingScanRef.current = false;
      return;
    }

    if (!token) {
      Alert.alert('QR 스캔 필요', 'QR 코드를 먼저 스캔해주세요.');
      isHandlingScanRef.current = false;
      return;
    }

    const paymentData = {
      qrToken: token,
      finalAmount: parseFloat(finalAmount.replace(/[^0-9]/g, '')),
      originalAmount: parseFloat(originalAmount.replace(/[^0-9]/g, '')),
      transactionSummary: transactionSummary,
      partnershipBranchId: parseInt(partnershipBranchId)
    };

    console.log('🔍 결제 실행 시작');
    console.log('🔍 API_BASE_URL:', API_BASE_URL);
    console.log('🔍 결제 데이터:', paymentData);

    try {
      console.log('🔍 API 요청 시작:', `${API_BASE_URL}/payments/execute`);
      const response = await fetch(`${API_BASE_URL}/payments/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      console.log('🔍 API 응답 상태:', response.status);
      console.log('🔍 API 응답 OK:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('🔍 API 응답 데이터:', result);
        Alert.alert('결제 완료', '결제가 성공적으로 처리되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('Index') }
        ]);
      } else {
        const errorData = await response.json();
        console.log('🔍 API 오류 응답:', errorData);
        throw new Error('결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.log('🔍 API 요청 실패:', error);
      Alert.alert('결제 실패', error.message || '네트워크 오류가 발생했습니다.');
    } finally {
      isHandlingScanRef.current = false;
    }
  };

  const executePayment = async () => {
    await executePaymentWithToken(qrToken);
  };

  if (mode === 'camera') {
    if (!permission) {
      return <View style={styles.container} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.center}>
          <Text style={{ marginBottom: 12 }}>카메라 권한이 필요합니다.</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>권한 허용</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={() => { resetScanState(); setMode('form'); }}>
            <Text style={styles.btnGhostText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_e', 'upc_a', 'code128', 'pdf417']
          }}
        />
        <View style={styles.camHeader}>
          <TouchableOpacity style={styles.camBack} onPress={() => { resetScanState(); setMode('form'); }}>
            <Text style={styles.camBackText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.camTitle}>QR 스캔</Text>
          <View style={{ width: 40 }} />
        </View>
                 <View style={styles.controls}>
           {qrToken ? (
             <View style={styles.resultPill}>
               <Text style={styles.resultText} numberOfLines={1}>{qrToken}</Text>
             </View>
           ) : null}
         </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.formScroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>결제하기</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>💳</Text>
              <Text style={styles.cardTitle}>결제 정보 입력</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>지점 ID</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="지점 ID"
                value={partnershipBranchId}
                editable={false}
                keyboardType="numeric"
              />
              {isLoadingPartnership && (
                <Text style={styles.loadingText}>지점 정보를 가져오는 중...</Text>
              )}
              {discountRate > 0 && (
                <Text style={styles.discountText}>할인율: {discountRate}%</Text>
              )}
            </View>

                         <View style={styles.field}>
               <Text style={styles.label}>원래 금액</Text>
                               <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={originalAmount}
                  onChangeText={handleOriginalAmountChange}
                  keyboardType="numeric"
                />

              </View>

                         <View style={styles.field}>
               <Text style={styles.label}>최종 결제 금액</Text>
                               <TextInput
                  style={[styles.input, styles.finalAmountInput]}
                  placeholder="자동 계산됩니다"
                  value={finalAmount}
                  editable={false}
                  keyboardType="numeric"
                />

                {discountRate > 0 && originalAmount && (
                  <Text style={styles.calculationText}>
                    할인 금액: ₩{Math.floor((parseFloat(originalAmount.replace(/[^0-9]/g, '') || 0) * discountRate) / 100).toLocaleString()}
                  </Text>
                )}
             </View>

            <View style={styles.field}>
              <Text style={styles.label}>거래 요약</Text>
              <TextInput
                style={styles.input}
                placeholder="거래 내용을 입력하세요"
                value={transactionSummary}
                onChangeText={setTransactionSummary}
                multiline
              />
            </View>



            <TouchableOpacity
              style={[styles.btnPrimary, qrToken ? styles.btnSuccess : null]}
              onPress={async () => {
                if (!permission?.granted) {
                  await requestPermission();
                }
                resetScanState();
                setMode('camera');
              }}
            >
              <Text style={styles.btnPrimaryText}>
                {qrToken ? 'QR 재스캔' : 'QR 스캔하기'}
              </Text>
              {qrToken && <Text style={styles.btnPrimarySub}>스캔 완료</Text>}
            </TouchableOpacity>

            {qrToken && (
              <View style={styles.qrResult}>
                <Text style={styles.qrResultText}>QR 토큰: {qrToken}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btnExecute, (!finalAmount || !originalAmount || !transactionSummary || !partnershipBranchId || !qrToken) ? styles.btnDisabled : null]}
              onPress={executePayment}
              disabled={!finalAmount || !originalAmount || !transactionSummary || !partnershipBranchId || !qrToken}
            >
              <Text style={styles.btnExecuteText}>결제 실행</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4FF'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formScroll: {
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  cardEmoji: {
    fontSize: 18,
    marginRight: 6
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A'
  },
  field: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#5C5C66',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E4F5',
    backgroundColor: '#FBFAFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#2A2A2A'
  },
  btnPrimary: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12
  },
  btnSuccess: {
    backgroundColor: '#10B981'
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  btnPrimarySub: {
    color: '#EDE8FF',
    fontSize: 12,
    marginTop: 2
  },
  btnGhost: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D4F3',
    backgroundColor: '#FFFFFF'
  },
  btnGhostText: {
    color: PRIMARY,
    fontWeight: '600'
  },
  qrResult: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  qrResultText: {
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: '600'
  },
  btnExecute: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center'
  },
  btnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  btnExecuteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  controls: {
    position: 'absolute',
    bottom: 28,
    width: '100%',
    alignItems: 'center'
  },
     camHeader: {
     position: 'absolute',
     top: 60,
     left: 12,
     right: 12,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between'
   },
  camBack: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)'
  },
  camBackText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  camTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  resultPill: {
    maxWidth: '90%',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)'
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 12
  },
  loadingText: {
    fontSize: 12,
    color: '#6E6B7A',
    marginTop: 4,
    fontStyle: 'italic'
  },
  discountText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '600'
  },
  finalAmountInput: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0EA5E9'
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    color: '#6E6B7A'
  },
  calculationText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '600'
  },

});
