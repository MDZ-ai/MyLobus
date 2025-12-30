import React, { useState } from 'react';
import { AppViewProps } from '../types';
import { LOBUS_UNION_SERVICES } from '../constants';
import { ArrowLeft, Zap, Droplets, Flame, Wifi, ChevronRight, CheckCircle2, Loader2, CalendarCheck, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/sound';

const ServicePaymentView: React.FC<AppViewProps> = ({ user, updateBalance, setView }) => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Auto Pay State
  const [showAutoPay, setShowAutoPay] = useState(false);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);

  // Find user's country or default to Lobito
  const userCountry = LOBUS_UNION_SERVICES.find(c => c.name.includes(user.country)) || LOBUS_UNION_SERVICES[0];
  
  const utilityServices = userCountry.services.find(s => s.type === 'UTILITY')?.items || [];
  const telecomServices = userCountry.services.find(s => s.type === 'PHONE')?.items || [];
  
  const allServices = [
      ...utilityServices.map(name => ({ name, type: 'utility', icon: name.includes('Agua') ? Droplets : name.includes('Gas') ? Flame : Zap })),
      ...telecomServices.map(name => ({ name, type: 'phone', icon: Wifi }))
  ];

  const handleServiceClick = (service: any) => {
    playSound('click');
    const mockAmount = Math.floor(Math.random() * (150 - 20 + 1) + 20);
    setSelectedService({ ...service, amount: mockAmount, invoice: `INV-${Math.floor(Math.random() * 100000)}` });
  };

  const confirmPayment = () => {
    if (!selectedService) return;

    if (user.balance < selectedService.amount) {
        playSound('error');
        alert("Fondos insuficientes para realizar este pago.");
        return;
    }

    setPaying(true);
    playSound('pay');

    setTimeout(() => {
        updateBalance(-selectedService.amount, `Pago Servicio: ${selectedService.name}`, `Factura ${selectedService.invoice}`);
        setPaying(false);
        setSuccess(true);
        playSound('success');
        
        setTimeout(() => {
            setSuccess(false);
            setSelectedService(null);
        }, 2000);
    }, 1500);
  };

  const toggleAutoPay = () => {
      playSound('click');
      setAutoPayEnabled(!autoPayEnabled);
      setTimeout(() => {
          setShowAutoPay(false);
          playSound('success');
      }, 800);
  };

  const closeSheet = () => {
      if (paying) return;
      setSelectedService(null);
      setShowAutoPay(false);
      playSound('click');
  };

  return (
    <div className="h-full flex flex-col bg-lobus-bg animate-enter overflow-hidden relative">
      
      {/* Header */}
      <div className="pt-28 px-6 pb-6 flex-shrink-0 z-20">
         <button onClick={() => setView('DASHBOARD')} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-lobus-primaryDark transition-colors font-bold text-sm">
             <ArrowLeft size={18} /> Volver
         </button>
         <h1 className="text-3xl font-black text-lobus-primaryDark tracking-tight mb-2">Pago de Servicios</h1>
         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${userCountry.color} text-lobus-primaryDark border border-lobus-border`}>
             <span>{userCountry.emoji}</span> {userCountry.name}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-40 space-y-3">
          <p className="text-sm text-lobus-neutral font-bold uppercase tracking-wider mb-2 ml-2">Servicios Disponibles</p>
          
          {allServices.map((service, idx) => (
              <button 
                key={idx}
                onClick={() => handleServiceClick(service)}
                className="w-full bg-white border border-lobus-border rounded-[32px] p-5 flex items-center justify-between hover:border-lobus-primary hover:shadow-lg hover:shadow-lobus-primary/5 transition-all group active:scale-98"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[24px] bg-lobus-bg flex items-center justify-center text-lobus-primary group-hover:bg-lobus-primary group-hover:text-white transition-colors border border-lobus-border">
                          <service.icon size={24} />
                      </div>
                      <div className="text-left">
                          <h3 className="font-bold text-lobus-primaryDark text-lg">{service.name}</h3>
                          <p className="text-xs text-lobus-neutral font-bold">Facturación Mensual</p>
                      </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-lobus-bg flex items-center justify-center text-lobus-border group-hover:text-lobus-primary transition-colors">
                      <ChevronRight size={24} />
                  </div>
              </button>
          ))}
          
          <button 
            onClick={() => { playSound('click'); setShowAutoPay(true); }}
            className="w-full mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[32px] border border-blue-100 text-center hover:shadow-md transition-shadow active:scale-98"
          >
              <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                      <RefreshCw size={24} className={autoPayEnabled ? "text-green-500" : ""} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-lg">Pagos Automáticos</h4>
                    <p className="text-xs text-blue-700 font-medium mt-1">
                        {autoPayEnabled ? "Activado para todos los servicios" : "Configura el débito automático para evitar cortes"}
                    </p>
                  </div>
              </div>
          </button>
      </div>

      {/* Payment Bottom Sheet (Unified Style) */}
      {(selectedService || showAutoPay) && (
         <div className="fixed inset-0 z-[60] flex items-end justify-center bg-lobus-primaryDark/40 backdrop-blur-md animate-enter">
             <div onClick={closeSheet} className="absolute inset-0" />
             <div className="relative w-full max-w-md bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl animate-slide-up border-t border-lobus-border">
                 
                 <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />

                 {/* AUTO PAY CONTENT */}
                 {showAutoPay ? (
                      <div className="text-center">
                          <div className="w-20 h-20 mx-auto bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-sm">
                              <CalendarCheck size={40} />
                          </div>
                          <h2 className="text-2xl font-black text-lobus-primaryDark mb-2">Automatización</h2>
                          <p className="text-lobus-neutral mb-8 font-medium">¿Deseas activar el pago automático para tus servicios básicos?</p>
                          
                          <button 
                            onClick={toggleAutoPay}
                            className={`w-full py-5 rounded-[32px] font-bold text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                ${autoPayEnabled ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-lobus-primary text-lobus-primaryDark hover:bg-yellow-400'}
                            `}
                          >
                              {autoPayEnabled ? 'Desactivar Auto-Pago' : 'Activar Auto-Pago'}
                          </button>
                      </div>
                 ) : success ? (
                     // SUCCESS CONTENT - Unified Style
                     <div className="flex flex-col items-center py-8 text-center animate-enter">
                         <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 animate-pop">
                             <CheckCircle2 size={60} strokeWidth={3} />
                         </div>
                         <h2 className="text-3xl font-black text-lobus-primaryDark mb-2">¡Pago Realizado!</h2>
                         <p className="text-lobus-neutral font-medium">Tu servicio ha sido renovado correctamente.</p>
                     </div>
                 ) : (
                     // SERVICE PAYMENT CONFIRMATION (Matching PayView Layout)
                     <>
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-2">Confirmar</h3>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-3xl font-black text-lobus-primaryDark">€</span>
                                <span className="text-6xl font-black text-lobus-primaryDark tracking-tighter">{selectedService.amount}</span>
                            </div>
                        </div>

                        <div className="bg-lobus-bg border border-gray-200 p-6 rounded-[32px] mb-8 space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Servicio</span>
                                <span className="text-sm font-bold text-lobus-primaryDark bg-white px-3 py-1 rounded-full border border-gray-100">{selectedService.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Factura</span>
                                <span className="text-sm font-bold text-lobus-primaryDark">#{selectedService.invoice}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <button onClick={closeSheet} className="py-5 rounded-[32px] font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">Cancelar</button>
                             <button 
                                onClick={confirmPayment}
                                disabled={paying}
                                className="py-5 rounded-[32px] font-bold text-lobus-primaryDark bg-lobus-primary hover:bg-yellow-400 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {paying ? <Loader2 className="animate-spin" /> : 'Pagar Ahora'}
                            </button>
                        </div>
                     </>
                 )}
             </div>
         </div>
      )}

    </div>
  );
};

export default ServicePaymentView;