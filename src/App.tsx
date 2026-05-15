import { useState } from 'react';
import { useAccount } from 'wagmi';
import Navbar from './components/ui/Navbar';
import Landing from './components/ui/Landing';
import Dashboard from './components/ui/Dashboard';
import GameRunner from './components/game/GameRunner';
import { useUserStore } from './store/useUserStore';

function App() {
  const { isConnected } = useAccount();
  const [currentView, setCurrentView] = useState<'landing' | 'game' | 'dashboard'>('landing');
  const { hasValidBuilderCode } = useUserStore();

  const handlePlayClick = () => {
    if (isConnected && hasValidBuilderCode) {
      setCurrentView('game');
    } else {
      // Direct them to dashboard to enter builder code if connected
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-base-dark flex flex-col overflow-hidden relative font-sans text-white">
      {currentView !== 'game' && <Navbar currentView={currentView} setCurrentView={setCurrentView} />}
      
      <main className="flex-grow flex flex-col relative w-full h-full">
        {currentView === 'landing' && <Landing onPlay={handlePlayClick} />}
        {currentView === 'dashboard' && <Dashboard onPlay={() => setCurrentView('game')} />}
        {currentView === 'game' && <GameRunner onExit={() => setCurrentView('landing')} />}
      </main>
    </div>
  );
}

export default App;
