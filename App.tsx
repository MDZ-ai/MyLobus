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
        toggleTheme 
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
    <div className={`min-h-screen w-full flex items-center justify-center bg-[#E5E7EB] ${isDarkMode ? 'dark' : ''}`}>
      {/* 
        Responsive Container Strategy
      */}
      <div className="
        w-full h-[100dvh] 
        sm:h-[850px] sm:w-[400px] sm:max-w-[400px] 
        sm:rounded-[32px] sm:border-[8px] sm:border-gray-800 sm:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)]
        bg-lobus-bg dark:bg-slate-900
        relative overflow-hidden
        flex flex-col
        transition-colors duration-300
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