import { useAccount } from 'wagmi';
import { Play, Trophy, Cpu, Zap } from 'lucide-react';

interface LandingProps {
  onPlay: () => void;
}

export default function Landing({ onPlay }: LandingProps) {
  const { isConnected } = useAccount();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full pt-20 pb-10 px-4 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[800px] h-[800px] bg-base-blue rounded-full blur-[150px]"></div>
        <div className="absolute w-[600px] h-[600px] bg-base-purple rounded-full blur-[150px] translate-x-1/2 -translate-y-1/4"></div>
      </div>

      <div className="z-10 flex flex-col items-center max-w-4xl w-full text-center space-y-8 mt-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-base-neon/30 bg-base-neon/10 text-base-neon text-sm font-medium mb-4 backdrop-blur-sm">
          <Zap className="w-4 h-4 mr-2" />
          Season 1: Neon Genesis
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">Base</span>
          <span className="block text-base-neon text-glow mt-2">Runner</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Escape the cyber-grid. Dodge hover trains, collect energy shards, and climb the Builder leaderboard in this high-speed Web3 endless runner.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={onPlay}
            className="group relative px-8 py-4 bg-base-blue hover:bg-blue-600 text-white font-bold text-xl rounded-xl transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(0,82,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-base-neon/0 via-base-neon/30 to-base-neon/0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <Play className="w-6 h-6 mr-2 fill-current" />
            {isConnected ? 'START GAME' : 'CONNECT & PLAY'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 text-left">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:border-base-neon/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-base-blue/20 flex items-center justify-center text-base-neon mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Cyberpunk World</h3>
            <p className="text-sm text-gray-400">Immerse yourself in a fully 3D neon city inspired by the Base ecosystem.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:border-base-neon/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-base-purple/20 flex items-center justify-center text-base-purple mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Builder Rewards</h3>
            <p className="text-sm text-gray-400">Use your Builder Code to earn XP, level up your rank, and claim daily rewards.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:border-base-neon/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-base-neon/20 flex items-center justify-center text-base-neon mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Global Leaderboard</h3>
            <p className="text-sm text-gray-400">Compete with other builders worldwide for the ultimate high score.</p>
          </div>
        </div>
      </div>
      
      <footer className="w-full mt-auto pt-10 text-center text-sm text-gray-500 pb-4 z-10">
        <p>Built for the Base ecosystem. Powered by React Three Fiber & Wagmi.</p>
      </footer>
    </div>
  );
}
