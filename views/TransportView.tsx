import React, { useState } from 'react';
import { ROUTES } from '../constants';
import { Train, Bus, MapPin, QrCode, X, Check, Loader2, ArrowUpRight } from 'lucide-react';
import { TransportRoute, AppViewProps } from '../types';
import { playSound } from '../utils/sound';

const TransportView: React.FC<AppViewProps> = ({ user, updateBalance }) => {
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);
  const [buying, setBuying] = useState(false);
  const [ticket, setTicket] = useState<TransportRoute | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'TRAIN' | 'BUS'>('ALL');

  const handleSelectRoute = (route: TransportRoute) => {
    playSound('click');
    setSelectedRoute(route);
  }

  const confirmPurchase = () => {
    if (!selectedRoute) return;
    if (user.balance < selectedRoute.price) {
        playSound('error');
        alert("Fondos insuficientes");
        return;
    }
    
    setBuying(true);
    playSound('pay');
    
    setTimeout(() => {
        updateBalance(-selectedRoute.price, `Boleto: ${selectedRoute.name}`, `${selectedRoute.origin} -> ${selectedRoute.destination}`);
        setTicket(selectedRoute);
        setSelectedRoute(null);
        setBuying(false);
        playSound('success');
    }, 1500);
  };

  const filteredRoutes = ROUTES.filter(r => {
      if (filter === 'ALL') return true;
      if (filter === 'BUS') return r.type === 'Bus';
      return r.type !== 'Bus';
  });

  return (
    <div className="h-full overflow-y-auto bg-lobus-bg dark:bg-slate-900 animate-enter transition-colors duration-300">
      <div className="pb-40">
        
        {/* Header - EXACT MATCH to Dashboard */}
        <div className="pt-14 px-6 pb-6 bg-lobus-bg dark:bg-slate-900 sticky top-0 z-20">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lobus-neutral dark:text-gray-400 font-medium text-sm">Transporte</h2>
                    <h1 className="text-lobus-primaryDark dark:text-white font-extrabold text-2xl tracking-tight">Hub de Movilidad</h1>
                </div>
            </div>

            {/* Gradient Card - "Active Ticket" or "Status" */}
            <div className="bg-gradient-to-bl from-lobus-primary to-lobus-primaryDark dark:from-yellow-600 dark:to-slate-800 rounded-[36px] p-8 text-white shadow-2xl shadow-lobus-primary/30 relative overflow-hidden group">
                 {/* Abstract Shapes */}
                <div className="absolute -right-10 -top-20 w-64 h-64 bg-lobus-secondary/20 rounded-full blur-3xl" />
                
                {ticket ? (
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-lobus-accent font-bold uppercase tracking-widest text-[10px] mb-1">Boleto Activo</p>
                                <h2 className="text-2xl font-black">{ticket.name}</h2>
                            </div>
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <QrCode size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                            <span>{ticket.origin}</span>
                            <div className="h-px flex-1 bg-white/30" />
                            <span>{ticket.destination}</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 text-center py-2">
                        <p className="text-lobus-accent font-bold uppercase tracking-widest text-[10px] mb-2">Estado del Sistema</p>
                        <h2 className="text-3xl font-black mb-2">Todo Operativo</h2>
                        <p className="text-white/80 text-sm">Selecciona una ruta para comenzar tu viaje.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-slate-800 rounded-t-[48px] border-t border-lobus-border dark:border-slate-700 p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-lobus-primaryDark dark:text-white flex items-center gap-2">
                    Rutas
                </h3>
                <div className="flex bg-gray-100 dark:bg-slate-700 rounded-full p-1">
                    <button onClick={() => setFilter('ALL')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-white dark:bg-slate-600 shadow-sm text-lobus-primaryDark dark:text-white' : 'text-gray-400'}`}>Todos</button>
                    <button onClick={() => setFilter('TRAIN')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filter === 'TRAIN' ? 'bg-white dark:bg-slate-600 shadow-sm text-lobus-primaryDark dark:text-white' : 'text-gray-400'}`}>Tren</button>
                    <button onClick={() => setFilter('BUS')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filter === 'BUS' ? 'bg-white dark:bg-slate-600 shadow-sm text-lobus-primaryDark dark:text-white' : 'text-gray-400'}`}>Bus</button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredRoutes.map((route) => {
                    const isBus = route.type === 'Bus';
                    return (
                        <div 
                            key={route.id} 
                            onClick={() => handleSelectRoute(route)}
                            className="relative overflow-hidden p-4 rounded-[32px] border border-lobus-border dark:border-slate-700 hover:border-lobus-primary transition-all cursor-pointer group active:scale-98 bg-white dark:bg-slate-700/50 shadow-sm"
                        >
                            {/* Vehicle Visual Stripe */}
                            <div className={`absolute top-0 bottom-0 left-0 w-2 ${isBus ? 'bg-orange-400' : 'bg-blue-600'}`}></div>

                            <div className="flex items-center justify-between pl-4">
                                <div className="flex items-center gap-4">
                                    {/* Visual Vehicle Card */}
                                    <div className={`w-16 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${isBus ? 'bg-orange-500' : 'bg-blue-600'}`}>
                                        {isBus ? <Bus size={24}/> : <Train size={24}/>}
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${route.status === 'Retrasado' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                {route.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{route.type}</span>
                                        </div>
                                        <h3 className="text-lobus-primaryDark dark:text-white font-bold text-lg leading-tight">{route.name}</h3>
                                        <p className="text-lobus-neutral dark:text-gray-400 text-xs font-bold mt-0.5">{route.origin} → {route.destination}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-lobus-primaryDark dark:text-white">${route.price}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {(selectedRoute || ticket) && (selectedRoute === ticket || selectedRoute) && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6 bg-lobus-primaryDark/30 backdrop-blur-md animate-enter">
            <div className="relative w-full max-w-sm">
                <div className="p-0 overflow-hidden bg-white dark:bg-slate-800 shadow-2xl rounded-t-[40px] sm:rounded-[40px]">
                    <div className="p-6 border-b border-lobus-border dark:border-slate-700 flex justify-between items-start bg-lobus-bg dark:bg-slate-900">
                        <div>
                             <h2 className="text-lobus-primaryDark dark:text-white font-black text-xl">{selectedRoute?.name || ticket?.name}</h2>
                             <p className="text-lobus-neutral dark:text-gray-400 text-sm mt-1 font-bold">Clase Ejecutiva</p>
                        </div>
                        <button 
                            onClick={() => { setSelectedRoute(null); if(selectedRoute === ticket) setTicket(null); }} 
                            className="bg-white dark:bg-slate-700 border border-lobus-border dark:border-slate-600 p-2 rounded-full text-lobus-primaryDark dark:text-white hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-800 pb-12">
                        {ticket && selectedRoute?.id === ticket.id ? (
                            <div className="text-center space-y-6">
                                <div className="bg-lobus-bg dark:bg-slate-700 p-6 rounded-[32px] border-2 border-lobus-border dark:border-slate-600">
                                    <QrCode size={160} className="text-lobus-primaryDark dark:text-white" />
                                </div>
                                <p className="text-lobus-success font-bold flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/30 py-3 px-6 rounded-full"><Check size={18} strokeWidth={3} /> Válido para viajar</p>
                            </div>
                        ) : (
                            <div className="w-full space-y-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-lobus-neutral dark:text-gray-400 font-bold">Precio del boleto</span>
                                    <span className="text-lobus-primaryDark dark:text-white font-black text-xl">${selectedRoute?.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-lobus-neutral dark:text-gray-400 font-bold">Saldo restante</span>
                                    <span className="text-lobus-primary font-bold">${(user.balance - (selectedRoute?.price || 0)).toLocaleString()}</span>
                                </div>
                                <div className="h-px w-full bg-lobus-border dark:bg-slate-700" />
                                <button 
                                    onClick={confirmPurchase}
                                    disabled={buying}
                                    className="w-full bg-lobus-primary hover:bg-lobus-primaryDark text-white font-bold py-6 rounded-[32px] shadow-lg shadow-lobus-primary/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    {buying ? <Loader2 className="animate-spin" /> : 'Confirmar y Pagar'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TransportView;