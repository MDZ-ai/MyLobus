import React from 'react';
import { AppViewProps, Document, InsurancePolicy } from '../types';
import { CreditCard, Plus, Shield, QrCode, User, Heart, Car, ShieldCheck, Home, HeartPulse } from 'lucide-react';

const WalletView: React.FC<AppViewProps> = ({ user }) => {
  
  const getDocumentIcon = (type: Document['type']) => {
      switch(type) {
          case 'ID': return <User size={40} className="text-white opacity-90" />;
          case 'HEALTH': return <Heart size={40} className="text-white opacity-90" />;
          case 'DRIVING': return <Car size={40} className="text-white opacity-90" />;
          default: return <Shield size={40} className="text-white opacity-90" />;
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
        <div className="pt-14 px-6 pb-6 bg-white dark:bg-slate-800 rounded-b-[32px] shadow-sm transition-colors">
            <h1 className="text-3xl font-black text-lobus-primaryDark dark:text-white tracking-tight">Mi Billetera</h1>
            <p className="text-lobus-neutral dark:text-gray-400 font-medium">Documentos y Pagos</p>
        </div>

        <div className="px-6 mt-6 space-y-8">
            
            {/* DOCUMENTOS */}
            <div>
                <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-lobus-secondary" /> 
                    Documentos Digitales
                </h3>
                <div className="flex flex-col gap-4">
                    {user.documents && user.documents.map(doc => (
                        <div key={doc.id} className={`w-full aspect-[1.58] rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between ${doc.color} transform transition-transform hover:scale-[1.02]`}>
                            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                            
                            {/* Header Card */}
                            <div className="flex justify-between items-start z-10">
                                <span className="text-xs font-bold opacity-90 uppercase tracking-widest border border-white/30 px-2 py-0.5 rounded-md">{doc.type}</span>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Emblem_of_the_European_Union.svg/1024px-Emblem_of_the_European_Union.svg.png" className="w-8 h-auto opacity-80 filter grayscale brightness-200" alt="EU" />
                            </div>
                            
                            {/* Content Card */}
                            <div className="z-10 flex gap-4 items-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10">
                                    {getDocumentIcon(doc.type)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl leading-tight mb-1">{doc.name}</h4>
                                    <p className="text-sm font-mono opacity-90 tracking-wide">{doc.number}</p>
                                </div>
                            </div>
                            
                            {/* Footer Card */}
                            <div className="flex justify-between items-end z-10">
                                <p className="text-[10px] opacity-80 font-bold">Caduca: {doc.expiry}</p>
                                <QrCode size={24} className="opacity-90" />
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-4 rounded-[24px] border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:border-lobus-primaryDark hover:text-lobus-primaryDark dark:hover:text-white transition-colors bg-white/50 dark:bg-slate-800/50">
                        <Plus size={20} />
                        <span className="font-bold">Añadir Documento</span>
                    </button>
                </div>
            </div>

            {/* SEGUROS ACTIVOS (New Section) */}
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
                
                {/* Yellow Poste Card */}
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

                 {/* Blue Digital Card */}
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

        </div>
    </div>
  );
};

export default WalletView;