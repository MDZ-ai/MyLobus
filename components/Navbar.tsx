import React from 'react';
import { ViewState } from '../types';
import { Home, Wallet, ArrowLeftRight, LayoutGrid, Zap } from 'lucide-react';
import { playSound } from '../utils/sound';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isDarkMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: Home, label: 'Inicio' },
    { id: 'WALLET', icon: Wallet, label: 'Billetera' },
    { id: 'PAY', icon: ArrowLeftRight, label: 'Pagar' },
    { id: 'FINANCE', icon: Zap, label: 'Invertir' },
    { id: 'SERVICES', icon: LayoutGrid, label: 'Servicios' },
  ];

  const handleNavClick = (view: ViewState) => {
    playSound('click');
    setView(view);
  };

  return (
    <nav className="absolute bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-[32px] shadow-2xl border border-white/20 dark:border-white/10 p-2 flex justify-between items-center pointer-events-auto max-w-sm mx-auto transition-colors">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as ViewState)}
              className="flex-1 flex flex-col items-center justify-center gap-1 min-w-[60px]"
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-[20px] transition-all duration-300
                ${isActive ? 'bg-lobus-primary dark:bg-yellow-500 text-lobus-primaryDark scale-110 shadow-lg' : 'bg-transparent text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'}
              `}>
                 <item.icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                 />
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;