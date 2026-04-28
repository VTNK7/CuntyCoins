import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sticker } from '../types';

const EMOJIS = ['🌟', '🎯', '🔥', '💎', '🌈', '🚀', '🎪', '🦄', '🍭', '🎸', '👑', '🧨'];
const NAMES = ['Nova', 'Pixel', 'Blaze', 'Crystal', 'Rainbow', 'Rocket', 'Circus', 'Unicorn', 'Candy', 'Rock', 'Crown', 'Boom'];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

function stickerFromQR(qrData: string): Omit<Sticker, 'scannedAt'> {
  const hash = hashString(qrData);
  const idx = hash % EMOJIS.length;
  return {
    id: qrData,
    qrData,
    emoji: EMOJIS[idx],
    name: `${NAMES[idx]} #${hash % 1000}`,
    coins: (hash % 90) + 10,
  };
}

interface StickersStore {
  stickers: Sticker[];
  totalCoins: number;
  addSticker: (qrData: string) => { success: boolean; message: string; sticker?: Sticker };
}

export const useStickersStore = create<StickersStore>()(
  persist(
    (set, get) => ({
      stickers: [],
      totalCoins: 0,
      addSticker: (qrData) => {
        if (get().stickers.find((s) => s.id === qrData)) {
          return { success: false, message: 'Sticker déjà collecté !' };
        }
        const sticker: Sticker = { ...stickerFromQR(qrData), scannedAt: Date.now() };
        set((state) => ({
          stickers: [sticker, ...state.stickers],
          totalCoins: state.totalCoins + sticker.coins,
        }));
        return { success: true, message: `+${sticker.coins} CuntyCoins !`, sticker };
      },
    }),
    {
      name: 'cuntycoin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
