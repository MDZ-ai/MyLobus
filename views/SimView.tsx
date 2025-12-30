import React, { useState } from 'react';
import { AppViewProps } from '../types';
import { ArrowLeft, Smartphone, Signal, Wifi, RefreshCw, Zap, Globe, Phone, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/sound';

const SimView: React.FC<AppViewProps> = ({ user, setView, updateBalance }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { sim } = user;
  const dataPercentage = Math.min(100, (sim.dataUsedGB / sim.dataTotalGB) * 100);
  const isLowData = dataPercentage > 85;

  const handleAction = (action: string, cost: number = 0) => {
    if (loading) return;
    if (cost > 0 && user.balance < cost) {
        playSound('error');
        alert('Saldo insuficiente');
        return;
    }

    setLoading(true);
    playSound('pay');

    setTimeout(() => {
        if (cost > 0) updateBalance(-cost, action);
        setLoading(false);
        setSuccessMsg(action + ' completado');
        playSound('success');
        setTimeout(() => setSuccessMsg(''), 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-lobus-bg dark:bg-slate-900 animate-enter transition-colors duration-300 overflow-hidden">
      
      {/* Header - Fixed Height */}
      <div className="pt-28 px-6 pb-6 bg-white dark:bg-slate-800 rounded-b-[32px] shadow-sm flex-shrink-0 z-20">
         <button onClick={() => setView('DASHBOARD')} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-lobus-primaryDark dark:hover:text-white transition-colors font-bold text-sm">
             <ArrowLeft size={18} /> Volver
         </button>
         <div className="flex justify-between items-center">
             <div>
                <h2 className="text-lobus-neutral dark:text-gray-400 font-medium text-sm">Gestión de Línea</h2>
                <h1 className="text-3xl font-black text-lobus-primaryDark dark:text-white tracking-tight">Mi SIM</h1>
             </div>
             <div className="w-12 h-12 bg-lobus-bg dark:bg-slate-700 rounded-2xl flex items-center justify-center text-lobus-primaryDark dark:text-white border border-gray-200 dark:border-slate-600">
                 <Smartphone size={24} />
             </div>
         </div>
      </div>

      {/* Main Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-40 space-y-6">
        
        {/* Main Data Circle */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center relative overflow-hidden">
             <div className="absolute top-4 right-4 flex items-center gap-1 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                 <Signal size={14} className="text-green-500" />
                 <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300">5G</span>
             </div>
             <div className="absolute top-4 left-4 flex items-center gap-1">
                 <span className="font-bold text-lobus-primaryDark dark:text-white">{sim.provider}</span>
             </div>

             <div className="relative w-48 h-48 flex items-center justify-center mb-6 mt-4 shrink-0">
                 {/* Background Circle */}
                 <svg className="w-full h-full transform -rotate-90">
                     <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100 dark:text-slate-700" />
                     <circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" 
                        strokeWidth="16" 
                        fill="transparent" 
                        strokeDasharray={552} 
                        strokeDashoffset={552 - (552 * dataPercentage) / 100}
                        strokeLinecap="round"
                        className={`${isLowData ? 'text-red-500' : 'text-lobus-primary'} transition-all duration-1000 ease-out`} 
                     />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                     <span className="text-xs font-bold text-gray-400 uppercase">Restantes</span>
                     <span className="text-4xl font-black text-lobus-primaryDark dark:text-white tracking-tighter">
                         {(sim.dataTotalGB - sim.dataUsedGB).toFixed(1)} <span className="text-lg">GB</span>
                     </span>
                     <span className="text-xs font-bold text-gray-400">de {sim.dataTotalGB} GB</span>
                 </div>
             </div>

             <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-700 pt-6">
                 <div className="text-center">
                     <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                         <Phone size={14} /> <span className="text-[10px] font-bold uppercase">Minutos</span>
                     </div>
                     <span className="text-lg font-black text-lobus-primaryDark dark:text-white">{sim.minutesUsed} min</span>
                 </div>
                 <div className="text-center border-l border-gray-100 dark:border-slate-700">
                     <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                         <MessageSquare size={14} /> <span className="text-[10px] font-bold uppercase">SMS</span>
                     </div>
                     <span className="text-lg font-black text-lobus-primaryDark dark:text-white">{sim.smsUsed}</span>
                 </div>
             </div>
        </div>

        {/* Info Card */}
        <div className="bg-lobus-primary dark:bg-yellow-600 rounded-[24px] p-6 text-lobus-primaryDark dark:text-white shadow-lg relative overflow-hidden">
             <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex justify-between items-end">
                 <div>
                     <p className="text-xs font-bold opacity-70 uppercase mb-1">Tu Número</p>
                     <p className="text-2xl font-mono font-black tracking-wider">{sim.phoneNumber}</p>
                 </div>
                 <div className="text-right">
                      <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Plan</p>
                      <p className="font-bold">{sim.planName}</p>
                 </div>
             </div>
             <div className="mt-4 pt-4 border-t border-black/10 flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-2">
                     <span className="text-xs font-bold">Renueva: {sim.nextRenewal}</span>
                 </div>
                 <div className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded-lg">
                     <Globe size={12} />
                     <span className="text-[10px] font-bold uppercase">{sim.roaming ? 'Roaming ON' : 'Roaming OFF'}</span>
                 </div>
             </div>
        </div>

        {/* Actions Grid */}
        <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-4">
             <button onClick={() => handleAction('Recarga 5GB', 5)} disabled={loading} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2 hover:border-lobus-primary transition-colors active:scale-95 disabled:opacity-50">
                 <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                     <Wifi size={20} />
                 </div>
                 <span className="font-bold text-sm text-lobus-primaryDark dark:text-white">Más Datos (5€)</span>
             </button>
             
             <button onClick={() => handleAction('Cambio de Plan')} disabled={loading} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2 hover:border-lobus-primary transition-colors active:scale-95 disabled:opacity-50">
                 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                     <RefreshCw size={20} />
                 </div>
                 <span className="font-bold text-sm text-lobus-primaryDark dark:text-white">Cambiar Plan</span>
             </button>

             <button onClick={() => handleAction('Recarga Saldo', 10)} disabled={loading} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2 hover:border-lobus-primary transition-colors active:scale-95 disabled:opacity-50">
                 <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                     <Zap size={20} />
                 </div>
                 <span className="font-bold text-sm text-lobus-primaryDark dark:text-white">Saldo (10€)</span>
             </button>

             <button onClick={() => handleAction(sim.roaming ? 'Desactivar Roaming' : 'Activar Roaming')} disabled={loading} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2 hover:border-lobus-primary transition-colors active:scale-95 disabled:opacity-50">
                 <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                     <Globe size={20} />
                 </div>
                 <span className="font-bold text-sm text-lobus-primaryDark dark:text-white">{sim.roaming ? 'Off Roaming' : 'On Roaming'}</span>
             </button>
        </div>

      </div>

      {/* Success Toast */}
      {successMsg && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-lobus-primaryDark text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-slide-up z-50 whitespace-nowrap">
              <CheckCircle2 size={18} className="text-lobus-primary" />
              <span className="font-bold text-sm">{successMsg}</span>
          </div>
      )}
      
      {loading && (
          <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center">
                  <Loader2 size={40} className="animate-spin text-lobus-primary mb-2" />
                  <span className="font-bold text-lobus-primaryDark dark:text-white">Procesando...</span>
              </div>
          </div>
      )}

    </div>
  );
};

export default SimView;