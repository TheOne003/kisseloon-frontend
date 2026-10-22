import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import {
  Linking,
  Platform,
  StyleSheet
} from 'react-native';
import { Pressable, Text, View } from '../theme/themed';

const BARCODE_TYPES = [
  'qr',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code128',
  'code39',
  'code93',
  'itf14',
  'pdf417',
  'aztec',
  'datamatrix',
];

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setResult({ type, data });
  };

  const resetScanner = () => {
    setScanned(false);
    setResult(null);
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Loading camera…</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.message}>
          Enable the camera to scan QR codes and barcodes on iOS.
        </Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow camera</Text>
        </Pressable>
        {!permission.canAskAgain && (
          <Pressable
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.buttonText}>Open Settings</Text>
          </Pressable>
        )}
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <Text style={styles.header}>Scan code</Text>
        <View style={styles.frame} />
        <Text style={styles.hint}>
          Point your {Platform.OS === 'ios' ? 'iPhone' : 'device'} at a QR code
          or barcode
        </Text>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{result.type}</Text>
          <Text style={styles.resultData} selectable>
            {result.data}
          </Text>
          <Pressable style={styles.button} onPress={resetScanner}>
            <Text style={styles.buttonText}>Scan again</Text>
          </Pressable>
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f14',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0b0f14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    paddingBottom: 48,
  },
  header: {
    position: 'absolute',
    top: 72,
    color: '#f5f7fa',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  frame: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  hint: {
    position: 'absolute',
    bottom: 120,
    color: 'rgba(245,247,250,0.85)',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: '#f5f7fa',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: 'rgba(245,247,250,0.75)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2f6fed',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 180,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#243041',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: 'rgba(15, 20, 28, 0.94)',
    borderRadius: 16,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  resultLabel: {
    color: '#8fb0ff',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  resultData: {
    color: '#f5f7fa',
    fontSize: 16,
    lineHeight: 22,
  },
});
