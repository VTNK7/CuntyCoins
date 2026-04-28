import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useStickersStore } from '../store/useStickersStore';
import StickerCard from '../components/StickerCard';
import ScanButton from '../components/ScanButton';
import ScannerScreen from './ScannerScreen';
import { Sticker } from '../types';

export default function HomeScreen() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const stickers = useStickersStore((s) => s.stickers);
  const totalCoins = useStickersStore((s) => s.totalCoins);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d001a" />

      <View style={styles.header}>
        <Text style={styles.title}>CuntyCoins</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🪙</Text>
          <Text style={styles.badgeText}>{totalCoins}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {stickers.length} sticker{stickers.length !== 1 ? 's' : ''} collecté{stickers.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {stickers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Aucun sticker trouvé</Text>
          <Text style={styles.emptyHint}>Scanne un QR code pour commencer à collecter !</Text>
        </View>
      ) : (
        <FlatList<Sticker>
          data={stickers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StickerCard sticker={item} />}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ScanButton onPress={() => setScannerOpen(true)} />

      {scannerOpen && <ScannerScreen onClose={() => setScannerOpen(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d001a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e0040',
    borderWidth: 1,
    borderColor: '#5a0fa0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeIcon: { fontSize: 18 },
  badgeText: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: '800',
  },
  statsRow: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  statsText: {
    color: '#8060a0',
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: {
    color: '#e0c8ff',
    fontSize: 20,
    fontWeight: '700',
  },
  emptyHint: {
    color: '#6040a0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
