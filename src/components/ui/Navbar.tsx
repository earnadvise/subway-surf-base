import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NavbarProps {
  currentView: 'landing' | 'game' | 'dashboard';
  setCurrentView: (view: 'landing' | 'game' | 'dashboard') => void;
}

export default function Navbar({ currentView, setCurrentView }: NavbarProps) {
  return (
    <nav className="w-full absolute top-0 z-50 p-4 lg:px-8 flex justify-between items-center bg-gradient-to-b from-base-dark/90 to-transparent pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto cursor-pointer" onClick={() => setCurrentView('landing')}>
        <div className="w-10 h-10 rounded-full bg-base-blue shadow-[0_0_15px_rgba(0,82,255,0.8)] flex items-center justify-center border-2 border-base-neon">
          <span className="font-bold text-white text-xl">B</span>
        </div>
        <h1 className="text-2xl font-black tracking-widest text-glow hidden sm:block uppercase">Base Runner</h1>
      </div>
      
      <div className="flex items-center gap-4 pointer-events-auto">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${currentView === 'dashboard' ? 'bg-base-blue/20 text-base-neon border border-base-neon' : 'hover:text-base-neon text-white/80'}`}
        >
          Builder Hub
        </button>
        <ConnectButton 
          chainStatus="icon" 
          showBalance={false}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }} 
        />
      </div>
    </nav>
  );
}
