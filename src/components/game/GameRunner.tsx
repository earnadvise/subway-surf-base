import { useEffect } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import { useGameStore } from '../../store/useGameStore';

interface GameRunnerProps {
  onExit: () => void;
}

export default function GameRunner({ onExit }: GameRunnerProps) {
  const { startGame, resetGame } = useGameStore();

  useEffect(() => {
    // Start game on mount
    startGame();
    
    return () => {
      resetGame();
    };
  }, [startGame, resetGame]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* 3D Game Canvas */}
      <div className="absolute inset-0 z-0">
        <GameCanvas />
      </div>
      
      {/* 2D UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <GameUI onExit={onExit} />
      </div>
    </div>
  );
}
