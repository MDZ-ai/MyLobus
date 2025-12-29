import React, { useState, useEffect } from 'react';
import { AppViewProps } from '../types';
import { 
  Plus, Wallet, Bell, Search, CreditCard, PiggyBank, Shield, LayoutGrid, Bus, Zap, Loader2, X, AlertCircle, Moon, Sun, FileText, Download, Share, Menu, TrendingUp, Smartphone
} from 'lucide-react';
import { playSound } from '../utils/sound';
import { BRAND_LOGO } from '../constants';

const DashboardView: React.FC<AppViewProps> = ({ user, updateBalance, setView, isDarkMode, toggleTheme }) => {
  const [activeModal, setActiveModal] = useState<'NONE' | 'ADD' | 'WITHDRAW' | 'SAVINGS' | 'INSURANCE' | 'INSTALL_HELP'>('NONE');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // PWA Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
    }
    
    // Check for iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
      playSound('click');
      if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choice: any) => {
              if (choice.outcome === 'accepted') {
                  setDeferredPrompt(null);
                  setIsInstalled(true);
              }
          });
      } else {
          // If no prompt available (iOS or blocked), show manual instructions
          setActiveModal('INSTALL_HELP');
      }
  };

  const closeModal = () => {
    if (processing) return;
    setActiveModal('NONE');
    setAmount('');
    setProcessing(false);
    setError('');
    playSound('click');
  };

  const handleTransaction = () => {
      const val = parseFloat(amount);
      if (isNaN(val) || val <= 0) {
          setError('Monto no válido');
          return;
      }
      
      setProcessing(true);
      playSound('pay');

      setTimeout(() => {
          if (activeModal === 'ADD') {
            updateBalance(val, "Recarga Cuenta", "Banco Lobus");
          } else {
             if (user.balance < val) {
                 setProcessing(false);
                 setError('Saldo insuficiente');
                 return;
             }
             updateBalance(-val, "Retiro Cajero", "Sin Tarjeta");
          }
          setProcessing(false);
          closeModal();
      }, 1500);
  };

  return (
    <div className="h-full overflow-y-auto bg-lobus-bg dark:bg-slate-900 animate-enter font-sans transition-colors duration-300">
      <div className="pb-40"> 
      
      {/* HEADER SECTION (Poste Yellow Style) */}
      <div className="bg-lobus-primary dark:bg-yellow-500 rounded-b-[32px] px-6 pt-12 pb-16 relative shadow-sm">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                 {/* MINI LOGO EN CABECERA */}
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                     <img src={BRAND_LOGO} alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <div>
                    <p className="text-lobus-primaryDark font-semibold text-sm">Es un placer verte,</p>
                    <h1 className="text-lobus-primaryDark font-extrabold text-3xl tracking-tight">{user.name.split(' ')[0]}</h1>
                </div>
            </div>
            <div className="flex gap-3">
                 {!isInstalled && (
                     <button 
                        onClick={handleInstallClick}
                        className="w-10 h-10 rounded-full bg-lobus-primaryDark text-white flex items-center justify-center animate-pop hover:scale-105 transition-transform shadow-lg"
                     >
                        <Download size={18} strokeWidth={3} />
                    </button>
                 )}
                 <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-lobus-primaryDark hover:bg-white/50 transition-colors"
                 >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                 <button 
                    onClick={() => { playSound('click'); setView('DISCOVER'); }}
                    className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-lobus-primaryDark hover:bg-white/50 transition-colors"
                 >
                    <Search size={20} />
                </button>
                <button 
                    onClick={() => { playSound('click'); setView('MESSAGES'); }}
                    className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-lobus-primaryDark hover:bg-white/50 transition-colors relative"
                >
                    <Bell size={20} />
                    {user.messages.some(m => !m.read) && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-lobus-primary"></span>}
                </button>
            </div>
        </div>
      </div>

      {/* QUICK OPERATIONS */}
      <div className="px-4 -mt-10 relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-[24px] p-5 shadow-card border border-gray-100 dark:border-slate-700 transition-colors">
              <h3 className="text-lobus-primaryDark dark:text-white font-bold text-base mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-4 gap-2">
                  {[
                      { icon: Zap, label: 'Invertir', action: () => setView('FINANCE') },
                      { icon: Bus, label: 'Transporte', action: () => setView('TRANSPORT') },
                      { icon: Shield, label: 'Seguros', action: () => setActiveModal('INSURANCE') },
                      { icon: LayoutGrid, label: 'Servicios', action: () => setView('SERVICES') },
                  ].map((op, i) => (
                      <button 
                        key={i} 
                        onClick={() => { playSound('click'); op.action(); }}
                        className="flex flex-col items-center gap-2 group"
                      >
                          <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-[18px] flex items-center justify-center text-lobus-primaryDark dark:text-white border border-gray-100 dark:border-slate-600 group-hover:bg-blue-50 dark:group-hover:bg-slate-600 transition-colors">
                              <op.icon size={24} strokeWidth={1.5} />
                          </div>
                          <span className="text-[10px] font-bold text-lobus-neutral dark:text-gray-400 text-center leading-tight">{op.label}</span>
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* --- FINANZAS --- */}
      <div className="px-4 mt-6 space-y-6">
          <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg px-2">Finanzas</h3>
          
          {/* Cuenta Principal */}
          <div className="bg-[#FFF8C6] dark:bg-slate-800 rounded-[24px] overflow-hidden border border-lobus-primary/20 dark:border-slate-600 shadow-sm transition-colors">
             <div className="bg-lobus-primary dark:bg-yellow-600 px-5 py-3 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                     <Wallet size={20} className="text-lobus-primaryDark dark:text-white"/>
                     <span className="font-bold text-lobus-primaryDark dark:text-white">Cuenta Banco Lobus</span>
                 </div>
                 <span className="text-[10px] font-black text-lobus-primaryDark bg-white/30 px-2 py-0.5 rounded-full">SMART</span>
             </div>
             <div className="p-5">
                 <div className="flex justify-between items-start mb-2">
                     <div>
                         <p className="text-xs font-bold text-lobus-neutral dark:text-gray-400 uppercase mb-1">Saldo Disponible</p>
                         <h2 className="text-3xl font-extrabold text-lobus-primaryDark dark:text-white tracking-tight">
                            {user.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }).replace('€', '')}€
                         </h2>
                     </div>
                     <button onClick={() => setActiveModal('ADD')} className="bg-lobus-primaryDark dark:bg-slate-700 text-white p-2 rounded-full shadow-lg active:scale-95 transition-transform">
                         <Plus size={20} />
                     </button>
                 </div>
                 <p className="text-xs text-lobus-primaryDark/70 dark:text-gray-400 font-medium">IBAN: ES60 X076 0112 3456 7890</p>
                 <div className="mt-4 pt-4 border-t border-lobus-primary/20 dark:border-slate-700 flex gap-4">
                     <button className="text-xs font-bold text-lobus-primaryDark dark:text-gray-300 flex items-center gap-1"><FileText size={14}/> Movimientos</button>
                 </div>
             </div>
          </div>

          {/* Tarjetas y Ahorros */}
          <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setView('WALLET')} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-gray-200 dark:border-slate-700 shadow-sm hover:border-lobus-primaryDark transition-colors group cursor-pointer">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-slate-700 text-lobus-primaryDark dark:text-blue-300 rounded-full flex items-center justify-center mb-3 group-hover:bg-lobus-primaryDark group-hover:text-white transition-colors">
                      <CreditCard size={20} />
                  </div>
                  <h4 className="font-bold text-lobus-primaryDark dark:text-white text-sm">Mis Tarjetas</h4>
                  <p className="text-xs text-gray-400">Ver en Billetera</p>
              </div>
              <div onClick={() => setActiveModal('SAVINGS')} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-gray-200 dark:border-slate-700 shadow-sm hover:border-lobus-primary transition-colors group cursor-pointer">
                   <div className="w-10 h-10 bg-yellow-50 dark:bg-slate-700 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-lobus-primary group-hover:text-lobus-primaryDark transition-colors">
                      <PiggyBank size={20} />
                  </div>
                  <h4 className="font-bold text-lobus-primaryDark dark:text-white text-sm">Ahorros</h4>
                  <p className="text-xs text-gray-400">+12% este mes</p>
              </div>
          </div>

          {/* Servicios y Seguros (Clickable) */}
          <div onClick={() => setActiveModal('INSURANCE')} className="bg-white dark:bg-slate-800 rounded-[24px] border border-gray-200 dark:border-slate-700 shadow-sm p-5 cursor-pointer active:scale-98 transition-transform group">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg group-hover:bg-green-50 group-hover:text-green-600 transition-colors"><Shield size={18} className="text-lobus-primaryDark dark:text-gray-300"/></div>
                  <h3 className="font-bold text-lobus-primaryDark dark:text-white">Seguros Activos</h3>
              </div>
               {user.policies && user.policies.length > 0 ? (
                      user.policies.map(policy => (
                        <div key={policy.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl mb-2 last:mb-0">
                            <div>
                                <h3 className="font-bold text-lobus-primaryDark dark:text-white text-sm">{policy.name}</h3>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Vence: {policy.expiry}</p>
                            </div>
                            <span className="text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-md">ACTIVO</span>
                        </div>
                      ))
                  ) : (
                      <p className="text-sm text-gray-400">Sin seguros contratados.</p>
                  )}
          </div>
      </div>
      
      {/* Footer Banner */}
      <div className="px-4 mt-6 mb-8">
          <div className="bg-lobus-primary dark:bg-yellow-600 p-6 rounded-[24px] relative overflow-hidden transition-colors">
               <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/20 rounded-full translate-x-10 translate-y-10"></div>
               <h3 className="font-extrabold text-lobus-primaryDark dark:text-white text-xl relative z-10 w-2/3">Todo lo que necesitas, en una sola app.</h3>
               <button 
                  onClick={() => { playSound('click'); setView('DISCOVER'); }}
                  className="mt-4 bg-lobus-primaryDark dark:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-bold relative z-10 shadow-lg active:scale-95 transition-transform"
                >
                  Descubrir
                </button>
          </div>
      </div>

      </div>

      {/* --- MODALES --- */}
      {activeModal !== 'NONE' && (
         <div className="fixed inset-0 z-[60] flex items-end justify-center bg-lobus-primaryDark/60 backdrop-blur-sm animate-enter">
             <div onClick={closeModal} className="absolute inset-0" />
             <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-t-[32px] p-6 pb-12 shadow-2xl animate-slide-up transition-colors">
                 <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full mx-auto mb-6" />

                 {activeModal === 'SAVINGS' ? (
                     <>
                        <div className="flex justify-between items-center mb-6 px-2">
                             <h2 className="text-xl font-extrabold text-lobus-primaryDark dark:text-white">Ahorros Lobus</h2>
                             <button onClick={closeModal} className="bg-gray-100 dark:bg-slate-700 dark:text-white p-2 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="bg-yellow-50 dark:bg-slate-700/50 rounded-[24px] p-6 border border-yellow-200 dark:border-yellow-600/30 mb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-yellow-400 rounded-lg text-white"><PiggyBank size={24}/></div>
                                <div>
                                    <h3 className="font-bold text-lobus-primaryDark dark:text-white">Libreta Smart</h3>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold">Interés 3.5% Anual</p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-lobus-primaryDark dark:text-white">24.500,00€</h2>
                        </div>
                        <button className="w-full bg-lobus-primaryDark dark:bg-slate-900 text-white py-4 rounded-full font-bold text-lg mb-3 border border-transparent hover:border-lobus-primary transition-all">Nuevo Depósito</button>
                     </>
                 ) : activeModal === 'INSURANCE' ? (
                    <>
                        <div className="flex justify-between items-center mb-6 px-2">
                             <h2 className="text-xl font-extrabold text-lobus-primaryDark dark:text-white">Pólizas Activas</h2>
                             <button onClick={closeModal} className="bg-gray-100 dark:bg-slate-700 dark:text-white p-2 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            {user.policies.map(p => (
                                <div key={p.id} className="border border-gray-200 dark:border-slate-600 rounded-[24px] p-5 shadow-sm bg-white dark:bg-slate-700/30">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">ACTIVA</div>
                                        <Shield size={20} className="text-lobus-primaryDark dark:text-gray-300"/>
                                    </div>
                                    <h3 className="text-lg font-bold text-lobus-primaryDark dark:text-white">{p.name}</h3>
                                    <p className="text-xs font-bold text-gray-400 mb-4">Póliza #{p.number}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-600">
                                        <span className="text-xs font-bold text-lobus-neutral dark:text-gray-400">Vencimiento</span>
                                        <span className="text-sm font-bold text-lobus-primaryDark dark:text-white">{p.expiry}</span>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-4 rounded-[24px] bg-lobus-bg dark:bg-slate-700 text-lobus-primaryDark dark:text-white font-bold flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-slate-500">
                                <Plus size={20}/> Contratar Nuevo Seguro
                            </button>
                        </div>
                    </>
                 ) : activeModal === 'INSTALL_HELP' ? (
                     <>
                        <div className="flex justify-between items-center mb-4 px-2">
                             <h2 className="text-xl font-extrabold text-lobus-primaryDark dark:text-white">Instalar MyLobus</h2>
                             <button onClick={closeModal} className="bg-gray-100 dark:bg-slate-700 dark:text-white p-2 rounded-full"><X size={20}/></button>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-slate-700/50 p-6 rounded-[24px] mb-6 text-center">
                            <div className="w-16 h-16 bg-white dark:bg-slate-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
                                <img src={BRAND_LOGO} alt="App Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <h3 className="font-bold text-lobus-primaryDark dark:text-white mb-2">Instalar Aplicación Web</h3>
                            <p className="text-sm text-lobus-neutral dark:text-gray-300">
                                Añade MyLobus a tu pantalla de inicio para una experiencia a pantalla completa y acceso offline.
                            </p>
                        </div>

                        {isIOS ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-600 rounded-2xl">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                                        <Share size={20} className="text-blue-500" />
                                    </div>
                                    <p className="text-sm font-medium dark:text-gray-300">1. Pulsa el botón <strong>Compartir</strong> en la barra inferior de Safari.</p>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-600 rounded-2xl">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                                        <Plus size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium dark:text-gray-300">2. Desliza hacia abajo y selecciona <strong>"Añadir a la pantalla de inicio"</strong>.</p>
                                </div>
                            </div>
                        ) : (
                             <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-600 rounded-2xl">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                                        <Menu size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium dark:text-gray-300">1. Abre el menú del navegador (tres puntos).</p>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-600 rounded-2xl">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                                        <Smartphone size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium dark:text-gray-300">2. Selecciona <strong>"Instalar aplicación"</strong> o "Añadir a pantalla de inicio".</p>
                                </div>
                            </div>
                        )}
                        <button onClick={closeModal} className="w-full mt-6 bg-lobus-primaryDark dark:bg-white text-white dark:text-lobus-primaryDark py-4 rounded-full font-bold">Entendido</button>
                     </>
                 ) : (
                     <>
                        <h2 className="text-xl font-extrabold text-lobus-primaryDark dark:text-white mb-6 text-center">
                            {activeModal === 'ADD' ? 'Recargar Cuenta' : 'Retiro sin Tarjeta'}
                        </h2>

                        <div className="space-y-4">
                             {/* Unified Huge Input */}
                            <div className="bg-white dark:bg-slate-700 p-6 rounded-[32px] border border-gray-200 dark:border-slate-600 shadow-sm flex flex-col items-center justify-center gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monto</label>
                                <div className="flex items-center gap-1">
                                    <span className="text-3xl font-black text-lobus-primaryDark dark:text-white">€</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={e => { setAmount(e.target.value); setError(''); }}
                                        placeholder="0"
                                        autoFocus
                                        className="w-40 text-center bg-transparent text-5xl font-black text-lobus-primaryDark dark:text-white outline-none placeholder:text-gray-200"
                                    />
                                </div>
                            </div>
                            
                            {error && <div className="text-red-500 text-sm font-bold flex items-center gap-2 justify-center bg-red-50 dark:bg-red-900/30 p-3 rounded-2xl"><AlertCircle size={16}/> {error}</div>}

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <button onClick={closeModal} className="py-5 rounded-[32px] font-bold text-lobus-neutral bg-gray-100 dark:bg-slate-600 dark:text-white hover:bg-gray-200 transition-colors">Cancelar</button>
                                <button 
                                    onClick={handleTransaction}
                                    disabled={processing}
                                    className="py-5 rounded-[32px] font-bold text-lobus-primaryDark bg-lobus-primary hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? <Loader2 className="animate-spin" /> : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                     </>
                 )}
             </div>
         </div>
      )}
    </div>
  );
};

export default DashboardView;