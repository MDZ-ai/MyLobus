import React, { useState, useEffect } from 'react';
import { Wifi, CheckCircle2, User, ArrowRight, Loader2, AlertCircle, QrCode, Banknote, Camera, Users, ArrowDownLeft, Globe, Receipt, X } from 'lucide-react';
import { playSound } from '../utils/sound';
import { AppViewProps } from '../types';
import { LEADERS } from '../constants';

type PayMode = 'HOME' | 'NFC' | 'TRANSFER' | 'QR' | 'CASH' | 'SPLIT' | 'REQUEST' | 'GLOBAL';

const PayView: React.FC<AppViewProps> = ({ user, updateBalance, setView }) => {
  const [mode, setMode] = useState<PayMode>('HOME');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState<any>(null);
  
  // Form States
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [error, setError] = useState('');

  // Scanning simulation
  useEffect(() => {
    if (mode === 'QR' || mode === 'CASH') {
        const scanTime = mode === 'CASH' ? 4000 : 3500; 
        const timer = setTimeout(() => {
            if (!showConfirm && !success) {
                playSound('scan');
                if (mode === 'QR') {
                    setConfirmData({ to: "Comercio: Bar Lobus", amount: 12.50, type: 'QR' });
                } else {
                    const denominations = [10, 20, 50, 100];
                    const detected = denominations[Math.floor(Math.random() * denominations.length)];
                    setConfirmData({ to: "Digitalización de Efectivo", amount: detected, type: 'CASH' });
                }
                setShowConfirm(true);
            }
        }, scanTime);
        return () => clearTimeout(timer);
    }
  }, [mode, showConfirm, success]);

  const resetState = () => {
      setMode('HOME');
      setPaying(false);
      setSuccess(false);
      setShowConfirm(false);
      setConfirmData(null);
      setRecipient('');
      setAmount('');
      setConcept('');
      setError('');
      playSound('click');
  };

  const initiateNFC = () => {
    if (paying || success) return;
    playSound('click');
    setConfirmData({ to: "Terminal TPV #882", amount: 25.00, type: 'NFC' });
    setShowConfirm(true);
  };

  const validateAndProceed = () => {
    setError('');
    
    // Validation logic based on mode
    if (['TRANSFER', 'SPLIT', 'REQUEST'].includes(mode) && !recipient) {
      setError('Selecciona un contacto válido');
      playSound('error');
      return;
    }
    
    if (mode === 'GLOBAL' && recipient.length < 5) {
        setError('IBAN/Cuenta inválida');
        playSound('error');
        return;
    }
    
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Importe debe ser mayor a 0');
      playSound('error');
      return;
    }

    if ((mode === 'TRANSFER' || mode === 'GLOBAL') && val > user.balance) {
      setError(`Saldo insuficiente (Max: €${user.balance})`);
      playSound('error');
      return;
    }

    playSound('click');
    
    let typeLabel = 'TRANSFER';
    if (mode === 'SPLIT') typeLabel = 'SPLIT';
    if (mode === 'REQUEST') typeLabel = 'REQUEST';
    if (mode === 'GLOBAL') typeLabel = 'GLOBAL';

    setConfirmData({ to: recipient || 'Destinatario Internacional', amount: val, type: typeLabel, note: concept });
    setShowConfirm(true);
  };

  const finalize = () => {
    setPaying(true);
    playSound('pay'); 
    
    setTimeout(() => {
        let desc = "Pago";
        let finalAmount = -confirmData.amount; 
        let subtitle = "Completado";

        if (confirmData.type === 'NFC') desc = "Pago NFC";
        else if (confirmData.type === 'QR') desc = "Pago QR";
        else if (confirmData.type === 'CASH') {
            desc = "Depósito Efectivo";
            finalAmount = confirmData.amount; 
            subtitle = "Ingreso Cajero";
        }
        else if (confirmData.type === 'SPLIT') { desc = `División de Cuenta`; subtitle = `Con ${confirmData.to}`; finalAmount = 0; } 
        else if (confirmData.type === 'REQUEST') { desc = `Solicitud Enviada`; subtitle = `A ${confirmData.to}`; finalAmount = 0; }
        else desc = `Envío a ${confirmData.to}`;

        // Only update balance if it's an actual transaction
        if (confirmData.type !== 'SPLIT' && confirmData.type !== 'REQUEST') {
            updateBalance(finalAmount, desc, subtitle);
        }

        setPaying(false);
        setSuccess(true);
        playSound('success');
        
        // Auto close after success
        setTimeout(() => {
            if (confirmData.type !== 'NFC') { 
                resetState();
            }
        }, 2500);
    }, 2000);
  };

  const ActionButton = ({ icon: Icon, label, onClick, color = "bg-white dark:bg-slate-800" }: any) => (
      <button 
        onClick={onClick}
        className={`${color} flex flex-col items-center justify-center gap-3 p-4 rounded-[28px] shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-lobus-primary transition-all active:scale-95 h-32`}
      >
          <div className="w-12 h-12 rounded-2xl bg-lobus-bg dark:bg-slate-700 flex items-center justify-center text-lobus-primaryDark dark:text-white">
              <Icon size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold text-lobus-primaryDark dark:text-white text-center leading-tight">{label}</span>
      </button>
  );

  const AmountInput = () => (
      <div className="space-y-4">
        <div className={`bg-white dark:bg-slate-800 p-6 rounded-[32px] border ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700'} shadow-sm flex flex-col items-center justify-center gap-2 transition-colors`}>
            <label className={`text-xs font-bold uppercase tracking-widest ${error ? 'text-red-500' : 'text-gray-400'}`}>Importe a {mode === 'REQUEST' ? 'Solicitar' : 'Enviar'}</label>
            <div className="flex items-center gap-1">
                <span className="text-3xl font-black text-lobus-primaryDark dark:text-white">€</span>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={e => { setAmount(e.target.value); setError(''); }}
                    placeholder="0"
                    autoFocus
                    className="w-40 text-center bg-transparent text-5xl font-black text-lobus-primaryDark dark:text-white outline-none placeholder:text-gray-200 dark:placeholder:text-gray-600"
                />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-[24px] border border-gray-200 dark:border-slate-700 flex items-center gap-3">
             <Receipt size={20} className="text-gray-400" />
             <input 
                type="text" 
                value={concept}
                onChange={e => setConcept(e.target.value)}
                placeholder="Concepto (Opcional)"
                className="w-full bg-transparent text-sm font-bold text-lobus-primaryDark dark:text-white outline-none placeholder:text-gray-400"
            />
        </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-lobus-bg dark:bg-slate-900 animate-enter overflow-hidden relative transition-colors duration-300">
      
      {/* HEADER */}
      <div className="pt-28 px-6 pb-2 flex-shrink-0 z-20 bg-lobus-bg dark:bg-slate-900">
         {mode !== 'HOME' && (
             <button onClick={resetState} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-lobus-primaryDark dark:hover:text-white transition-colors font-bold text-sm">
                 <ArrowRight className="rotate-180" size={18} /> Volver
             </button>
         )}
         <h1 className="text-3xl font-black text-lobus-primaryDark dark:text-white tracking-tight">
             {mode === 'HOME' ? 'Hub de Pagos' : 
              mode === 'NFC' ? 'Pago sin Contacto' :
              mode === 'QR' ? 'Escáner QR' :
              mode === 'CASH' ? 'Depósito Digital' :
              mode === 'SPLIT' ? 'Dividir Gastos' :
              mode === 'REQUEST' ? 'Solicitar Dinero' :
              mode === 'GLOBAL' ? 'Envío Global' :
              'Transferencia'}
         </h1>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-6 pb-40 pt-4">
          
        {/* --- HOME MODE: ACTION GRID --- */}
        {mode === 'HOME' && (
            <div className="animate-enter space-y-6">
                
                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <ActionButton icon={User} label="Enviar a Contacto" onClick={() => { setMode('TRANSFER'); playSound('click'); }} color="bg-lobus-primary dark:bg-yellow-600" />
                    <ActionButton icon={Wifi} label="Pagar con NFC" onClick={() => { setMode('NFC'); playSound('click'); }} />
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-3 gap-3">
                    <ActionButton icon={QrCode} label="Leer QR" onClick={() => { setMode('QR'); playSound('click'); }} />
                    <ActionButton icon={Users} label="Dividir" onClick={() => { setMode('SPLIT'); playSound('click'); }} />
                    <ActionButton icon={ArrowDownLeft} label="Solicitar" onClick={() => { setMode('REQUEST'); playSound('click'); }} />
                    <ActionButton icon={Banknote} label="Efectivo" onClick={() => { setMode('CASH'); playSound('click'); }} />
                    <ActionButton icon={Globe} label="Global" onClick={() => { setMode('GLOBAL'); playSound('click'); }} />
                    <ActionButton icon={Receipt} label="Facturas" onClick={() => { setView('SERVICE_PAYMENT'); playSound('click'); }} />
                </div>

                {/* Recent Contacts Preview */}
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recientes</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {LEADERS.slice(0,5).map(l => (
                            <button key={l.id} className="flex flex-col items-center min-w-[60px] group" onClick={() => { setRecipient(l.handle); setMode('TRANSFER'); playSound('click'); }}>
                                <div className={`w-14 h-14 rounded-full ${l.avatarColor} text-white flex items-center justify-center font-bold text-lg mb-2 shadow-sm group-hover:scale-105 transition-transform`}>{l.name[0]}</div>
                                <span className="text-[10px] font-bold text-lobus-primaryDark dark:text-gray-300 truncate w-full text-center">{l.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* --- FORM MODES (Transfer, Split, Request, Global) --- */}
        {['TRANSFER', 'SPLIT', 'REQUEST', 'GLOBAL'].includes(mode) && (
            <div className="animate-slide-up space-y-6">
                {/* Contact Selector */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Destinatario</label>
                    {mode === 'GLOBAL' ? (
                         <div className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-gray-200 dark:border-slate-700 flex items-center gap-3">
                             <Globe size={24} className="text-lobus-primary" />
                             <input 
                                placeholder="IBAN / SWIFT / BIC"
                                value={recipient}
                                onChange={(e) => { setRecipient(e.target.value); setError(''); }}
                                className="w-full bg-transparent font-bold text-lobus-primaryDark dark:text-white outline-none"
                             />
                         </div>
                    ) : (
                        <div className="relative">
                            <select 
                                value={recipient} 
                                onChange={e => { setRecipient(e.target.value); setError(''); }}
                                className={`w-full bg-white dark:bg-slate-800 border ${!recipient && error ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'} text-lobus-primaryDark dark:text-white rounded-[24px] py-4 pl-4 pr-10 outline-none appearance-none font-bold text-lg shadow-sm transition-all focus:border-lobus-primary`}
                            >
                                <option value="">Seleccionar Contacto...</option>
                                {LEADERS.filter(l => l.handle !== user.handle).map(l => (
                                    <option key={l.id} value={l.handle}>{l.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ArrowRight className="rotate-90" size={20} />
                            </div>
                        </div>
                    )}
                </div>

                <AmountInput />

                {error && (
                    <div className="flex items-center gap-3 text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/30 p-4 rounded-[20px] animate-slide-up border border-red-100 dark:border-red-900 justify-center">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <button 
                    onClick={validateAndProceed}
                    className="w-full bg-lobus-primary text-lobus-primaryDark font-bold text-xl py-5 rounded-[32px] shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-yellow-400 mt-4"
                >
                    Continuar <ArrowRight size={24} strokeWidth={3} />
                </button>
            </div>
        )}

        {/* --- SCANNER MODES --- */}
        {(mode === 'QR' || mode === 'CASH') && (
             <div className="flex flex-col items-center justify-center h-[500px] relative animate-enter rounded-[40px] overflow-hidden bg-black border-4 border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="relative z-20 flex flex-col items-center justify-between h-full py-12 w-full">
                    <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white font-bold text-sm flex items-center gap-2">
                        {mode === 'QR' ? <QrCode size={16}/> : <Banknote size={16}/>}
                        {mode === 'QR' ? 'Apunta al código QR' : 'Encuadra el billete'}
                    </div>

                    <div className="w-64 h-64 border-2 border-white/30 rounded-[32px] relative">
                         <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-lobus-primary rounded-tl-[10px] -mt-1 -ml-1"></div>
                         <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-lobus-primary rounded-tr-[10px] -mt-1 -mr-1"></div>
                         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-lobus-primary rounded-bl-[10px] -mb-1 -ml-1"></div>
                         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-lobus-primary rounded-br-[10px] -mb-1 -mr-1"></div>
                         <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-lobus-primary/50 shadow-[0_0_15px_rgba(255,211,0,0.8)] animate-slide-up"></div>
                    </div>

                    <div className="text-white/70 text-xs font-medium">Buscando señal...</div>
                </div>
             </div>
        )}

        {/* --- NFC MODE --- */}
        {mode === 'NFC' && (
             <div className="flex flex-col items-center justify-center min-h-[500px] relative animate-enter overflow-hidden rounded-[40px]">
                <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                     <div className={`absolute w-[400px] h-[400px] bg-lobus-primary/10 dark:bg-yellow-500/10 rounded-full animate-ping ${paying ? 'opacity-40 duration-700' : 'opacity-20 duration-[3000ms]'}`} />
                     <div className={`absolute w-[300px] h-[300px] border border-lobus-primary/30 dark:border-yellow-500/30 rounded-full animate-ripple ${paying ? 'duration-1000' : 'duration-[2000ms]'}`} />
                     {paying && <div className="absolute w-[200px] h-[200px] bg-lobus-primary/20 rounded-full animate-ping duration-500" />}
                </div>

                <button 
                    onClick={initiateNFC}
                    className={`w-56 h-56 rounded-[48px] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center relative z-10 transition-all duration-500
                        ${paying ? 'scale-90 shadow-inner ring-4 ring-lobus-primary' : 'hover:scale-105 hover:shadow-float'}
                        ${success ? 'ring-4 ring-green-500' : ''}
                    `}
                >
                    {success 
                        ? <CheckCircle2 size={80} className="text-green-500 animate-pop"/> 
                        : paying 
                            ? <Loader2 size={80} className="text-lobus-primary animate-spin"/> 
                            : <Wifi size={80} className="text-lobus-primaryDark dark:text-white drop-shadow-sm"/>
                    }
                </button>
                
                <div className="mt-12 text-center z-10">
                     <h2 className="text-2xl font-black text-lobus-primaryDark dark:text-white mb-2 transition-all">
                        {success ? '¡Pago Exitoso!' : paying ? 'Conectando...' : 'Listo para Pagar'}
                     </h2>
                     <p className="text-lobus-neutral dark:text-gray-400 font-medium animate-pulse">
                        {success ? 'Transacción aprobada' : paying ? 'No retire el dispositivo' : 'Acerque su móvil al terminal'}
                     </p>
                </div>
             </div>
        )}

      </div>

      {/* CONFIRMATION SHEET */}
      {showConfirm && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-lobus-primaryDark/40 backdrop-blur-md animate-enter">
              <div onClick={() => !paying && setShowConfirm(false)} className="absolute inset-0" />
              <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-t-[40px] p-8 pb-12 shadow-2xl animate-slide-up border-t border-gray-200 dark:border-slate-700">
                  <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full mx-auto mb-8" />
                  
                  {success ? (
                      <div className="text-center py-8">
                          <div className="w-24 h-24 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 animate-pop">
                              <CheckCircle2 size={60} />
                          </div>
                          <h2 className="text-3xl font-black text-lobus-primaryDark dark:text-white mb-2">¡Éxito!</h2>
                          <p className="text-gray-500 font-medium">Operación registrada correctamente.</p>
                      </div>
                  ) : (
                      <>
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-2">Confirmar</h3>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-3xl font-black text-lobus-primaryDark dark:text-white">€</span>
                                <span className="text-6xl font-black text-lobus-primaryDark dark:text-white tracking-tighter">{confirmData.amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-lobus-bg dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6 rounded-[32px] mb-8 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Tipo</span>
                                <span className="text-sm font-bold text-lobus-primaryDark dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-100 dark:border-slate-700">{confirmData.type}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">{confirmData.type === 'CASH' ? 'Origen' : 'Destinatario'}</span>
                                <span className="text-sm font-bold text-lobus-primaryDark dark:text-white truncate max-w-[180px] text-right">{confirmData.to}</span>
                            </div>
                            {confirmData.note && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Nota</span>
                                    <span className="text-sm font-medium text-gray-500 truncate max-w-[180px]">{confirmData.note}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setShowConfirm(false)} className="py-5 rounded-[32px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 transition-colors">Cancelar</button>
                            <button onClick={finalize} className="py-5 rounded-[32px] font-bold text-lobus-primaryDark bg-lobus-primary hover:bg-yellow-400 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                {paying ? <Loader2 className="animate-spin" /> : 'Confirmar'}
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

export default PayView;