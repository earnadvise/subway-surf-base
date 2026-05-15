import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserStore } from '../../store/useUserStore';
import { Shield, Medal, Gift, Users, Trophy, ChevronRight, Lock,Zap } from 'lucide-react';

interface DashboardProps {
  onPlay: () => void;
}

export default function Dashboard({ onPlay }: DashboardProps) {
  const { isConnected, address } = useAccount();
  const { 
    builderCode, 
    setBuilderCode, 
    validateBuilderCode, 
    hasValidBuilderCode,
    xp,
    rank,
    referrals,
    dailyStreak 
  } = useUserStore();

  const [inputCode, setInputCode] = useState(builderCode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setInputCode(builderCode);
  }, [builderCode]);

  const handleVerify = () => {
    setBuilderCode(inputCode);
    const isValid = useUserStore.getState().validateBuilderCode();
    
    if (isValid) {
      setSuccess(true);
      setError('');
    } else {
      setError('Invalid Builder Code. Try the default: bc_z10us01u');
      setSuccess(false);
    }
  };

  const getRankColor = (r: string) => {
    switch(r) {
      case 'Bronze': return 'text-orange-400';
      case 'Silver': return 'text-gray-300';
      case 'Gold': return 'text-yellow-400';
      case 'Diamond': return 'text-blue-400';
      case 'Legendary': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full pt-20 px-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-base-blue/5 z-0"></div>
          <Lock className="w-16 h-16 text-gray-500 mb-6 z-10" />
          <h2 className="text-3xl font-bold mb-4 z-10 text-white">Wallet Required</h2>
          <p className="text-gray-400 mb-8 z-10">Please connect your wallet to access the Builder Dashboard and play the game.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full pt-24 pb-12 px-4 md:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-black uppercase text-glow mb-2">Builder Hub</h1>
            <p className="text-gray-400 flex items-center font-mono text-sm">
              <Shield className="w-4 h-4 mr-2 text-base-neon" />
              {address?.slice(0,6)}...{address?.slice(-4)}
            </p>
          </div>
          
          {!hasValidBuilderCode ? (
            <div className="glass-panel p-4 rounded-xl flex items-center w-full md:w-auto max-w-md border-base-blue/30">
              <input 
                type="text" 
                placeholder="Enter Builder Code..." 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="bg-transparent border-none outline-none text-white flex-1 min-w-[200px]"
              />
              <button 
                onClick={handleVerify}
                className="px-4 py-2 bg-base-blue hover:bg-blue-600 rounded-lg text-sm font-bold transition-colors ml-2"
              >
                Verify
              </button>
            </div>
          ) : (
            <button 
              onClick={onPlay}
              className="px-8 py-3 bg-base-neon text-base-dark font-bold rounded-xl hover:bg-white transition-colors flex items-center"
            >
              Play Now <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>

        {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm">{error}</div>}
        {success && <div className="text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20 text-sm">Builder Code Verified Successfully!</div>}

        {/* Dashboard Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-500 ${!hasValidBuilderCode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Stats Card */}
          <div className="glass-panel p-6 rounded-2xl md:col-span-2 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-base-blue/10 rounded-full blur-3xl group-hover:bg-base-blue/20 transition-all"></div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Medal className="w-5 h-5 mr-2 text-base-blue" />
              Progression Status
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full border-4 border-base-dark bg-gradient-to-br from-base-dark to-gray-800 shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 rounded-full border border-base-neon/50"></div>
                  <div className="text-center">
                    <span className="block text-3xl font-black text-white">{xp}</span>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider">XP</span>
                  </div>
                </div>
                <h4 className={`text-xl font-bold uppercase ${getRankColor(rank)} text-glow`}>{rank}</h4>
                <p className="text-xs text-gray-400 mt-1">Builder Rank</p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                <div className="bg-base-dark/50 p-4 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-sm mb-1">Daily Streak</p>
                  <p className="text-2xl font-bold text-white flex items-center">
                    {dailyStreak} <span className="text-orange-500 ml-2 text-sm flex items-center"><Zap className="w-4 h-4 mr-1"/></span>
                  </p>
                </div>
                <div className="bg-base-dark/50 p-4 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-sm mb-1">Referrals</p>
                  <p className="text-2xl font-bold text-white flex items-center">
                    {referrals} <Users className="w-4 h-4 ml-2 text-gray-500" />
                  </p>
                </div>
                <div className="col-span-2 bg-base-dark/50 p-4 rounded-xl border border-white/5 mt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Next Rank: <span className="text-white">{rank === 'Bronze' ? 'Silver' : rank === 'Silver' ? 'Gold' : rank === 'Gold' ? 'Diamond' : rank === 'Diamond' ? 'Legendary' : 'Max'}</span></span>
                    <span className="text-base-neon">{xp} / {rank === 'Bronze' ? 500 : rank === 'Silver' ? 2000 : rank === 'Gold' ? 5000 : 10000} XP</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-base-neon h-2 rounded-full shadow-[0_0_10px_#00F0FF]" style={{ width: `${Math.min(100, (xp / (rank === 'Bronze' ? 500 : rank === 'Silver' ? 2000 : rank === 'Gold' ? 5000 : 10000)) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-base-purple" />
              Rewards
            </h3>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-gradient-to-r from-base-purple/20 to-transparent p-4 rounded-xl border border-base-purple/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Daily Login</h4>
                  <p className="text-xs text-gray-400">+50 XP</p>
                </div>
                <button className="px-3 py-1 bg-base-purple/50 hover:bg-base-purple text-xs font-bold rounded transition-colors text-white">
                  Claim
                </button>
              </div>
              
              <div className="bg-base-dark/50 p-4 rounded-xl border border-white/5 flex items-center justify-between opacity-50">
                <div>
                  <h4 className="font-bold text-sm text-white">First Game</h4>
                  <p className="text-xs text-gray-400">+100 XP</p>
                </div>
                <button className="px-3 py-1 bg-gray-700 text-xs font-bold rounded cursor-not-allowed">
                  Done
                </button>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-800">
                <button className="w-full py-3 bg-gradient-to-r from-base-blue to-base-purple rounded-xl font-bold text-sm hover:shadow-[0_0_15px_rgba(181,51,255,0.4)] transition-shadow flex items-center justify-center">
                  Mint Builder Badge NFT <span className="ml-2 text-xs bg-black/30 px-2 py-0.5 rounded">Mock</span>
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="glass-panel p-6 rounded-2xl md:col-span-3">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Top Builders
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm border-b border-gray-800">
                    <th className="pb-3 font-medium px-4">Rank</th>
                    <th className="pb-3 font-medium px-4">Builder</th>
                    <th className="pb-3 font-medium px-4">Score</th>
                    <th className="pb-3 font-medium px-4 text-right">Tier</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { r: 1, name: '0x1A4...9F21', s: 45200, tier: 'Legendary' },
                    { r: 2, name: '0x8B2...4E11', s: 38900, tier: 'Diamond' },
                    { r: 3, name: '0x3C9...7D0A', s: 31500, tier: 'Diamond' },
                    { r: 4, name: 'You (Mock)', s: 0, tier: rank },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-gray-800/50 hover:bg-white/5 transition-colors ${row.r === 4 ? 'bg-base-blue/10 border-base-blue/20' : ''}`}>
                      <td className="py-4 px-4 font-mono font-bold text-gray-400">
                        {row.r === 1 ? <span className="text-yellow-400">#1</span> : 
                         row.r === 2 ? <span className="text-gray-300">#2</span> : 
                         row.r === 3 ? <span className="text-orange-400">#3</span> : 
                         `#${row.r}`}
                      </td>
                      <td className="py-4 px-4 font-mono">{row.name}</td>
                      <td className="py-4 px-4 font-bold">{row.s.toLocaleString()}</td>
                      <td className={`py-4 px-4 text-right font-bold ${getRankColor(row.tier)}`}>{row.tier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
