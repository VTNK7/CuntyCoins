import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ScanButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.icon}>📷</Text>
      <Text style={styles.label}>Scanner un sticker</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#c026d3',
    marginHorizontal: 20,
    marginBottom: 28,
    marginTop: 12,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#c026d3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
