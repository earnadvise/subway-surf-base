import { useGameStore } from '../../store/useGameStore';
import { useUserStore } from '../../store/useUserStore';
import { Trophy, RefreshCw, LogOut, ArrowUpCircle } from 'lucide-react';

interface GameUIProps {
  onExit: () => void;
}

export default function GameUI({ onExit }: GameUIProps) {
  const { score, highScore, isGameOver, resetGame, startGame } = useGameStore();
  const { addXp } = useUserStore();

  const handleRestart = () => {
    if (isGameOver) {
      // Award XP on game over based on score (mock logic)
      addXp(Math.floor(score / 100));
    }
    resetGame();
    startGame();
  };

  const handleExit = () => {
    if (isGameOver) {
      addXp(Math.floor(score / 100));
    }
    onExit();
  };

  return (
    <div className="w-full h-full relative p-4 lg:p-8 flex flex-col pointer-events-none">
      
      {/* Top HUD */}
      <div className="flex justify-between items-start w-full">
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center shadow-[0_0_10px_rgba(0,82,255,0.3)]">
          <div className="mr-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Score</p>
            <p className="text-2xl font-black font-mono text-white text-glow">{Math.floor(score)}</p>
          </div>
          <div className="h-10 w-px bg-white/10 mx-2"></div>
          <div className="ml-2">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center">
              <Trophy className="w-3 h-3 mr-1 text-yellow-400" /> Best
            </p>
            <p className="text-lg font-bold font-mono text-gray-300">{Math.floor(highScore)}</p>
          </div>
        </div>
        
        {/* Mobile controls hint */}
        <div className="hidden md:flex glass-panel px-4 py-2 rounded-xl text-xs text-gray-400 items-center">
          <span className="flex gap-1 mr-3">
            <kbd className="bg-white/10 px-2 py-1 rounded text-white">←</kbd>
            <kbd className="bg-white/10 px-2 py-1 rounded text-white">→</kbd>
            Move
          </span>
          <span className="flex gap-1 mr-3">
            <kbd className="bg-white/10 px-2 py-1 rounded text-white">↑</kbd> Jump
          </span>
          <span className="flex gap-1">
            <kbd className="bg-white/10 px-2 py-1 rounded text-white">↓</kbd> Slide
          </span>
        </div>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm z-50">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center flex flex-col items-center animate-[popIn_0.3s_ease-out]">
            <h2 className="text-5xl font-black uppercase text-red-500 text-glow mb-2">System Failure</h2>
            <p className="text-gray-400 mb-8 font-mono">Run Terminated</p>

            <div className="w-full bg-base-dark/50 rounded-xl p-6 mb-8 border border-white/10">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Final Score</p>
              <p className="text-6xl font-black font-mono text-white text-glow mb-4">{Math.floor(score)}</p>
              
              {score > highScore && highScore > 0 && (
                <div className="inline-flex items-center text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm font-bold border border-yellow-400/20">
                  <ArrowUpCircle className="w-4 h-4 mr-1" /> New High Score!
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-white/10 text-sm text-base-neon flex justify-between">
                <span>XP Earned:</span>
                <span className="font-bold">+{Math.floor(score / 100)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handleRestart}
                className="w-full py-4 bg-base-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,82,255,0.4)] flex items-center justify-center hover:scale-[1.02]"
              >
                <RefreshCw className="w-5 h-5 mr-2" /> REBOOT RUN
              </button>
              <button 
                onClick={handleExit}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-colors flex items-center justify-center"
              >
                <LogOut className="w-5 h-5 mr-2" /> EXIT TO MENU
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Swipe Area Indicator (Invisible) */}
      {!isGameOver && (
        <div className="absolute inset-0 z-0 pointer-events-auto touch-none" id="swipe-layer"></div>
      )}
    </div>
  );
}
