import React, { useState } from 'react';
import { ViewState, Leader, Transaction } from './types';
import Navbar from './components/Navbar';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import TransportView from './views/TransportView';
import FinanceView from './views/FinanceView';
import PayView from './views/PayView';
import SocialView from './views/SocialView';
import ServicesView from './views/ServicesView';
import ServicePaymentView from './views/ServicePaymentView';
import WalletView from './views/WalletView';
import MessagesView from './views/MessagesView';
import DiscoverView from './views/DiscoverView';
import AIView from './views/AIView';
import { playSound } from './utils/sound';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [user, setUser] = useState<Leader | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    playSound('click');
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (leader: Leader) => {
    setUser(leader);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    playSound('logout');
    setUser(null);
    setCurrentView('LOGIN');
  };

  const updateBalance = (amount: number, description: string, subtitle: string = 'Transacción') => {
    if (!user) return;
    if (amount > 0) playSound('success');
    else playSound('pay');

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: description,
      subtitle: subtitle,
      amount: amount,
      date: 'Ahora',
      type: amount > 0 ? 'income' : 'expense'
    };

    setUser(prev => prev ? ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTransaction, ...prev.transactions]
    }) : null);
  };

  const renderView = () => {
    if (currentView === 'LOGIN' || !user) {
      return <LoginView onLogin={handleLogin} />;
    }

    const props = { 
        user, 
        updateBalance, 
        setView: setCurrentView,
        isDarkMode,
        toggleTheme,
        onLogout: handleLogout
    };

    switch (currentView) {
      case 'DASHBOARD': return <DashboardView {...props} />;
      case 'WALLET': return <WalletView {...props} />;
      case 'TRANSPORT': return <TransportView {...props} />;
      case 'FINANCE': return <FinanceView {...props} />;
      case 'PAY': return <PayView {...props} />;
      case 'SOCIAL': return <SocialView currentUser={user} updateBalance={updateBalance} />;
      case 'SERVICES': return <ServicesView {...props} />;
      case 'SERVICE_PAYMENT': return <ServicePaymentView {...props} />;
      case 'MESSAGES': return <MessagesView {...props} />;
      case 'DISCOVER': return <DiscoverView {...props} />;
      case 'AI': return <AIView user={user} />;
      default: return <DashboardView {...props} />;
    }
  };

  return (
    <div className={`
      min-h-screen w-full flex items-center justify-center 
      bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-900 dark:to-black
      ${isDarkMode ? 'dark' : ''}
      sm:p-8
    `}>
      {/* 
        Responsive Container Strategy - Enhanced Resolution
        Mobile: Full Screen
        Desktop: High-Res Floating App Container (Max Width 480px for cleaner mobile-app feel on desktop)
      */}
      <div className="
        w-full h-[100dvh] 
        sm:h-[90vh] sm:w-[480px] sm:max-w-[480px] 
        sm:rounded-[40px] 
        bg-lobus-bg dark:bg-slate-900
        relative overflow-hidden
        flex flex-col
        transition-all duration-300
        shadow-2xl
        border-0 sm:border border-white/20 dark:border-white/10
      ">
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderView()}
        </main>

        {/* Navigation (Overlay on bottom) */}
        {user && currentView !== 'LOGIN' && (
          <Navbar currentView={currentView} setView={setCurrentView} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};

export default App;