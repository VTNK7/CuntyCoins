import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useStickersStore } from '../store/useStickersStore';

export default function ScannerScreen({ onClose }: { onClose: () => void }) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const addSticker = useStickersStore((s) => s.addSticker);

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const result = addSticker(data);
    Alert.alert(
      result.success ? '🎉 Nouveau sticker !' : '😅 Déjà collecté',
      result.message,
      [
        { text: 'Scanner encore', onPress: () => setScanned(false) },
        { text: 'Fermer', style: 'cancel', onPress: onClose },
      ]
    );
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal animationType="slide" statusBarTranslucent>
        <View style={styles.permContainer}>
          <Text style={styles.permEmoji}>📷</Text>
          <Text style={styles.permTitle}>Accès caméra requis</Text>
          <Text style={styles.permText}>
            L'accès à la caméra est nécessaire pour scanner les stickers.
          </Text>
          <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
            <Text style={styles.permButtonText}>Autoriser</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal animationType="slide" statusBarTranslucent>
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleScan}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        <View style={styles.overlay}>
          <View style={styles.topFade} />
          <View style={styles.middle}>
            <View style={styles.sideFade} />
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>
            <View style={styles.sideFade} />
          </View>
          <View style={styles.bottomFade}>
            <Text style={styles.hint}>Pointe vers un QR code de sticker</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕  Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const FRAME = 240;
const CORNER = 28;
const BORDER = 4;
const COLOR = '#c026d3';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1 },
  topFade: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  middle: { flexDirection: 'row', height: FRAME },
  sideFade: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  scanFrame: {
    width: FRAME,
    height: FRAME,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: COLOR,
  },
  tl: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER, borderTopLeftRadius: 6 },
  tr: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER, borderTopRightRadius: 6 },
  bl: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER, borderBottomLeftRadius: 6 },
  br: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER, borderBottomRightRadius: 6 },
  bottomFade: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingTop: 24,
    gap: 20,
  },
  hint: {
    color: '#e0c8ff',
    fontSize: 15,
    fontWeight: '500',
  },
  closeBtn: {
    backgroundColor: '#c026d3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
  },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  permContainer: {
    flex: 1,
    backgroundColor: '#0d001a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  permEmoji: { fontSize: 56 },
  permTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  permText: { color: '#c0a0e0', fontSize: 15, textAlign: 'center' },
  permButton: {
    backgroundColor: '#c026d3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginTop: 8,
  },
  permButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelText: { color: '#8060a0', fontSize: 15, marginTop: 4 },
});
