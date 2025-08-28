import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Alert } from 'react-native';

export default function App() {
  const [mode, setMode] = useState('form'); // 'form' | 'camera'
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [lastPayload, setLastPayload] = useState('');
  const isHandlingScanRef = useRef(false);

  const resetScanState = () => {
    setScanned(false);
    setLastPayload('');
    isHandlingScanRef.current = false;
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

    const handleBarcodeScanned = ({ data }) => {
      if (scanned || isHandlingScanRef.current) return;
      isHandlingScanRef.current = true;
      setScanned(true);
      setLastPayload(String(data ?? ''));
      Alert.alert('스캔 완료', '스캔이 완료되었어요.', [
        { text: '확인', onPress: () => { isHandlingScanRef.current = false; } }
      ], { cancelable: true });
    };

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
          <Text style={styles.camTitle}>스캔하기</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.controls}>
          {lastPayload ? (
            <View style={styles.resultPill}>
              <Text style={styles.resultText} numberOfLines={1}>{lastPayload}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => setFacing(prev => (prev === 'back' ? 'front' : 'back'))}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryText}>전/후면 전환</Text>
          </TouchableOpacity>
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
            <Text style={styles.brandEmoji}>🟣</Text>
            <Text style={styles.brandTitle}>Heyyoung</Text>
            <Text style={styles.brandSubtitle}>오늘도 혜택 한가득 ✨</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>🏪</Text>
              <Text style={styles.cardTitle}>업점 정보</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>업점명</Text>
              <TextInput
                style={styles.input}
                placeholder="업점명을 입력하세요"
                defaultValue="헤이영 카페 홍대점"
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.field, styles.fieldHalf]}>
                <Text style={styles.label}>업종</Text>
                <TextInput
                  style={styles.input}
                  placeholder="업종"
                  defaultValue="카페"
                />
              </View>
              <View style={[styles.field, styles.fieldHalf]}>
                <Text style={styles.label}>연락처</Text>
                <TextInput
                  style={styles.input}
                  placeholder="010-1234-5678"
                  defaultValue="02-123-4567"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>주소</Text>
              <TextInput
                style={styles.input}
                placeholder="주소"
                defaultValue="서울 마포구 와우산로 123"
              />
            </View>

            <View style={styles.helper}>
              <Text style={styles.helperText}>나중에 실제 데이터로 자동 채워질 거예요.</Text>
            </View>

            <TouchableOpacity
              style={styles.btnPrimaryLarge}
              onPress={async () => {
                if (!permission?.granted) {
                  await requestPermission();
                }
                resetScanState();
                setMode('camera');
              }}
            >
              <Text style={styles.btnPrimaryLargeText}>스캔하기</Text>
              <Text style={styles.btnPrimaryLargeSub}>QR/바코드 스캔으로 진행</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerNote}>
            <Text style={styles.footerText}>테스트용 더미 데이터가 적용되어 있어요.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY = '#542BA8';
const ACCENT = '#7635FD';

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
    alignItems: 'center',
    marginBottom: 16
  },
  brandEmoji: {
    fontSize: 18,
    marginBottom: 4
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6E6B7A'
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
    marginBottom: 12
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
    marginBottom: 12
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0
  },
  fieldHalf: {
    flex: 1
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: '#5C5C66'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E4F5',
    backgroundColor: '#FBFAFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    color: '#2A2A2A'
  },
  helper: {
    marginTop: 4,
    marginBottom: 8
  },
  helperText: {
    fontSize: 12,
    color: '#8A8799'
  },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: PRIMARY
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600'
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
  btnPrimaryLarge: {
    marginTop: 8,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14
  },
  btnPrimaryLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  btnPrimaryLargeSub: {
    color: '#EDE8FF',
    fontSize: 12,
    marginTop: 2
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 14
  },
  footerText: {
    fontSize: 12,
    color: '#8A8799'
  },
  controls: {
    position: 'absolute',
    bottom: 28,
    width: '100%',
    alignItems: 'center'
  },
  camHeader: {
    position: 'absolute',
    top: 16,
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
  }
});