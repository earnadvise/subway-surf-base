import { create } from 'zustand';

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
  multiplier: number;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  addScore: (points: number) => void;
  increaseSpeed: (amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  isGameOver: false,
  score: 0,
  highScore: 0, // In a real app, load from local storage or backend
  speed: 10,
  multiplier: 1,

  startGame: () => set({ isPlaying: true, isGameOver: false, score: 0, speed: 10, multiplier: 1 }),
  
  endGame: () => set((state) => ({ 
    isPlaying: false, 
    isGameOver: true,
    highScore: Math.max(state.score, state.highScore)
  })),
  
  resetGame: () => set({ isPlaying: false, isGameOver: false, score: 0, speed: 10 }),
  
  addScore: (points) => set((state) => ({ score: state.score + (points * state.multiplier) })),
  
  increaseSpeed: (amount) => set((state) => ({ speed: Math.min(state.speed + amount, 30) })), // Cap speed at 30
}));
