import React, { useState } from 'react';
import { AppViewProps, Document, InsurancePolicy } from '../types';
import { CreditCard, Plus, Shield, QrCode, User, Heart, Car, ShieldCheck, Home, HeartPulse, Bitcoin, Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { playSound } from '../utils/sound';

const WalletView: React.FC<AppViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'FIAT' | 'CRYPTO'>('FIAT');

  const handleAddDocument = () => {
    playSound('click');
    alert("Función para escanear nuevo documento próximamente.");
  };

  const getDocumentIcon = (type: Document['type']) => {
      switch(type) {
          case 'ID': return <User size={32} className="text-white" />;
          case 'HEALTH': return <Heart size={32} className="text-white" />;
          case 'DRIVING': return <Car size={32} className="text-white" />;
          default: return <Shield size={32} className="text-white" />;
      }
  };

  const getPolicyIcon = (type: InsurancePolicy['type']) => {
      switch(type) {
          case 'VIDA': return <HeartPulse size={24} />;
          case 'AUTO': return <Car size={24} />;
          case 'HOGAR': return <Home size={24} />;
          default: return <ShieldCheck size={24} />;
      }
  };

  return (
    <div className="h-full overflow-y-auto bg-lobus-bg dark:bg-slate-900 animate-enter pb-32 transition-colors duration-300">
        {/* Header */}
        <div className="pt-28 px-6 pb-6 bg-white dark:bg-slate-800 rounded-b-[32px] shadow-sm transition-colors sticky top-0 z-20">
            <h1 className="text-3xl font-black text-lobus-primaryDark dark:text-white tracking-tight">Mi Billetera</h1>
            <p className="text-lobus-neutral dark:text-gray-400 font-medium mb-4">Activos Digitales</p>
            
            <div className="flex bg-gray-100 dark:bg-slate-700 p-1.5 rounded-full">
                <button 
                    onClick={() => { setActiveTab('FIAT'); playSound('click'); }}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'FIAT' ? 'bg-white dark:bg-slate-600 text-lobus-primaryDark dark:text-white shadow-sm' : 'text-gray-400'}`}
                >
                    Tarjetas & Docs
                </button>
                <button 
                    onClick={() => { setActiveTab('CRYPTO'); playSound('click'); }}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'CRYPTO' ? 'bg-white dark:bg-slate-600 text-lobus-primaryDark dark:text-white shadow-sm' : 'text-gray-400'}`}
                >
                    Cripto
                </button>
            </div>
        </div>

        <div className="px-6 mt-6 space-y-8">
            
            {activeTab === 'FIAT' ? (
                <>
                    {/* DOCUMENTOS */}
                    <div>
                        <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-lobus-secondary" /> 
                            Documentos Digitales
                        </h3>
                        <div className="flex flex-col gap-5">
                            {user.documents && user.documents.map(doc => (
                                <div key={doc.id} className={`w-full aspect-[1.58] rounded-[32px] p-6 text-white shadow-xl shadow-lobus-primaryDark/10 relative overflow-hidden flex flex-col justify-between ${doc.color} transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl ring-1 ring-white/20 group cursor-default`}>
                                    <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                                    <div className="absolute left-[-20px] bottom-[-20px] w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                                    
                                    <div className="flex justify-between items-start z-10">
                                        <span className="text-[10px] font-black opacity-90 uppercase tracking-widest border border-white/30 bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">{doc.type}</span>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Emblem_of_the_European_Union.svg/1024px-Emblem_of_the_European_Union.svg.png" className="w-8 h-auto opacity-80 filter grayscale brightness-200 drop-shadow-md" alt="EU" />
                                    </div>
                                    
                                    <div className="z-10 flex gap-5 items-center mt-2">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20 shadow-inner">
                                            {getDocumentIcon(doc.type)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl leading-none mb-1.5 drop-shadow-sm">{doc.name}</h4>
                                            <p className="text-sm font-mono opacity-90 tracking-widest text-shadow-sm">{doc.number}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-end z-10 mt-1">
                                        <div>
                                            <p className="text-[9px] opacity-70 uppercase font-bold mb-0.5">Válido hasta</p>
                                            <p className="text-sm font-bold">{doc.expiry}</p>
                                        </div>
                                        <div className="bg-white/90 p-1.5 rounded-xl shadow-lg">
                                            <QrCode size={22} className="text-black" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                onClick={handleAddDocument}
                                className="w-full py-5 rounded-[32px] border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center gap-3 text-gray-400 dark:text-gray-500 hover:border-lobus-primary hover:text-lobus-primary dark:hover:text-lobus-primary dark:hover:border-lobus-primary transition-all bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 active:scale-[0.98] group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 group-hover:bg-lobus-primary group-hover:text-white flex items-center justify-center transition-colors">
                                    <Plus size={18} strokeWidth={3} />
                                </div>
                                <span className="font-bold text-sm">Añadir Nuevo Documento</span>
                            </button>
                        </div>
                    </div>

                    {/* SEGUROS ACTIVOS */}
                    <div>
                        <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-lobus-secondary" />
                            Seguros Activos
                        </h3>
                        <div className="space-y-3">
                            {user.policies && user.policies.length > 0 ? (
                                user.policies.map(policy => (
                                    <div key={policy.id} className="bg-white dark:bg-slate-800 rounded-[24px] p-5 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-700 text-lobus-primaryDark dark:text-blue-300 flex items-center justify-center">
                                                    {getPolicyIcon(policy.type)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lobus-primaryDark dark:text-white text-sm">{policy.name}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold tracking-wider">#{policy.number}</p>
                                                </div>
                                            </div>
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Activo</span>
                                        </div>
                                        <div className="h-px bg-gray-100 dark:bg-slate-700 w-full" />
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs font-bold text-gray-400">Próxima renovación</span>
                                            <span className="text-sm font-bold text-lobus-primaryDark dark:text-white">{policy.expiry}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No hay pólizas activas.</p>
                            )}
                        </div>
                    </div>

                    {/* TARJETAS DE PAGO */}
                    <div>
                        <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-lobus-secondary" />
                            Tarjetas de Pago
                        </h3>
                        
                        <div className="bg-[#FFD300] dark:bg-yellow-500 rounded-[24px] p-6 text-lobus-primaryDark shadow-md relative overflow-hidden mb-4">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <CreditCard size={100} />
                            </div>
                            <div className="flex justify-between items-start mb-8">
                                <span className="font-black text-lg">Postepay Evolution</span>
                                <span className="font-bold">DEBIT</span>
                            </div>
                            <div className="font-mono text-xl font-bold mb-4">5333 4444 8888 1111</div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-70">Titular</p>
                                    <p className="font-bold">{user.name.toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-70">Expira</p>
                                    <p className="font-bold">12/28</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-lobus-primaryDark dark:bg-slate-700 rounded-[24px] p-6 text-white shadow-md relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <span className="font-black text-lg">Lobus Digital</span>
                                <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-xs">VIRTUAL</span>
                            </div>
                            <div className="font-mono text-xl font-bold mb-4 relative z-10">**** **** **** 9090</div>
                            <div className="flex justify-between items-end relative z-10">
                                <p className="font-bold">{user.name.toUpperCase()}</p>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8" alt="Mastercard" />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="animate-enter">
                    <div className="bg-lobus-primaryDark dark:bg-slate-800 rounded-[32px] p-8 text-white mb-6 relative overflow-hidden shadow-2xl">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold opacity-70 uppercase mb-1">Balance Total Cripto</p>
                            <h2 className="text-4xl font-black mb-4 tracking-tight">$43,512.40</h2>
                            <div className="flex gap-4">
                                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-colors">
                                    <Plus size={14}/> Comprar
                                </button>
                                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-colors">
                                    <WalletIcon size={14}/> Recibir
                                </button>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                        <Bitcoin size={20} className="text-orange-500" />
                        Mis Activos
                    </h3>

                    <div className="space-y-4">
                        {user.crypto && user.crypto.length > 0 ? (
                             user.crypto.map(asset => (
                                <div key={asset.symbol} className="bg-white dark:bg-slate-800 p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full ${asset.color} flex items-center justify-center text-white font-bold shadow-md`}>
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lobus-primaryDark dark:text-white">{asset.name}</h4>
                                            <p className="text-xs font-medium text-gray-500">{asset.amount} {asset.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lobus-primaryDark dark:text-white">${(asset.valueUSD * asset.amount).toLocaleString()}</p>
                                        <p className={`text-xs font-bold flex items-center justify-end gap-1 ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {asset.change24h >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                                            {Math.abs(asset.change24h)}%
                                        </p>
                                    </div>
                                </div>
                             ))
                        ) : (
                            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-[32px] border border-dashed border-gray-300 dark:border-slate-700">
                                <p className="text-gray-400 font-bold">No tienes criptoactivos aún.</p>
                                <button className="mt-4 text-lobus-primaryDark dark:text-white font-bold underline">Empezar a invertir</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default WalletView;