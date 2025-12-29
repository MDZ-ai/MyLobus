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
    <nav className="fixed bottom-6 left-4 right-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-float border border-gray-100 dark:border-slate-700 p-2 flex justify-between items-center relative transition-colors">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as ViewState)}
              className="flex-1 flex flex-col items-center justify-center gap-1 min-w-[60px]"
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-[18px] transition-all duration-300
                ${isActive ? 'bg-lobus-primary dark:bg-yellow-500 text-lobus-primaryDark' : 'bg-transparent text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'}
                ${isActive ? 'shadow-md transform -translate-y-2' : ''}
              `}>
                 <item.icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2}
                 />
              </div>
              <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-lobus-primaryDark dark:text-white opacity-100 translate-y-[-4px]' : 'text-gray-400 dark:text-gray-500 opacity-0 h-0 overflow-hidden'}`}>
                  {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;