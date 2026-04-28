import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sticker } from '../types';

export default function StickerCard({ sticker }: { sticker: Sticker }) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{sticker.emoji}</Text>
      <Text style={styles.name} numberOfLines={1}>{sticker.name}</Text>
      <View style={styles.coinsRow}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.coins}>{sticker.coins}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#1e0040',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#5a0fa0',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  name: {
    color: '#e0c8ff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinIcon: {
    fontSize: 14,
  },
  coins: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: '700',
  },
});
