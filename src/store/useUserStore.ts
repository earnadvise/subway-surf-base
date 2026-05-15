import { create } from 'zustand';

// Target encoding verification string
const TARGET_HEX = "0x62635f7a313075733031750b0080218021802180218021802180218021";

interface UserState {
  builderCode: string;
  hasValidBuilderCode: boolean;
  xp: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Legendary';
  referrals: number;
  dailyStreak: number;
  setBuilderCode: (code: string) => void;
  validateBuilderCode: () => boolean;
  addXp: (amount: number) => void;
}

const calculateRank = (xp: number): UserState['rank'] => {
  if (xp > 10000) return 'Legendary';
  if (xp > 5000) return 'Diamond';
  if (xp > 2000) return 'Gold';
  if (xp > 500) return 'Silver';
  return 'Bronze';
};

export const useUserStore = create<UserState>((set, get) => ({
  builderCode: '',
  hasValidBuilderCode: false,
  xp: 120, // Mock starting XP
  rank: 'Bronze',
  referrals: 0,
  dailyStreak: 1,

  setBuilderCode: (code) => set({ builderCode: code }),

  validateBuilderCode: () => {
    const { builderCode } = get();
    // Default valid code is bc_z10us01u
    // In a real app we'd verify the hex encoding properly, here we simulate the check.
    const isValid = builderCode === 'bc_z10us01u';
    set({ hasValidBuilderCode: isValid });
    return isValid;
  },

  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    return {
      xp: newXp,
      rank: calculateRank(newXp)
    };
  })
}));
