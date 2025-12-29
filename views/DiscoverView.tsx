import React, { useState, useEffect } from 'react';
import { AppViewProps } from '../types';
import { ArrowLeft, Search, Zap, Globe, Shield, CreditCard, Sparkles, LayoutGrid, Heart, TrendingUp, Bus, Download } from 'lucide-react';
import { playSound } from '../utils/sound';
import BrandLogo from '../components/BrandLogo';

const DiscoverView: React.FC<AppViewProps> = ({ setView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    playSound('click');
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const features = [
      { id: 'AI', icon: Sparkles, title: 'Lobus IA', desc: 'Asistente Soberano', view: 'AI' as const, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' },
      { id: 'PAY', icon: CreditCard, title: 'Pagos', desc: 'NFC, QR y Transferencias', view: 'PAY' as const, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
      { id: 'INVEST', icon: TrendingUp, title: 'Bolsa', desc: 'Inversión en Tiempo Real', view: 'FINANCE' as const, color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
      { id: 'SERVICES', icon: LayoutGrid, title: 'Servicios', desc: 'Directorio Unión', view: 'SERVICES' as const, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
      { id: 'TRANSPORT', icon: Bus, title: 'Movilidad', desc: 'Trenes y Autobuses', view: 'TRANSPORT' as const, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
      { id: 'SOCIAL', icon: Globe, title: 'Social', desc: 'Comunidad Lobus', view: 'SOCIAL' as const, color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  ];

  const handleNav = (view: any) => {
      playSound('click');
      setView(view);
  };

  return (
    <div className="h-full overflow-y-auto bg-lobus-bg dark:bg-slate-900 animate-enter flex flex-col transition-colors duration-300">
       {/* Header */}
      <div className="pt-14 px-6 pb-6 bg-lobus-bg dark:bg-slate-900 flex-shrink-0 z-20">
         <button onClick={() => setView('DASHBOARD')} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-lobus-primaryDark dark:hover:text-white transition-colors font-bold text-sm">
             <ArrowLeft size={18} /> Volver
         </button>
         <h1 className="text-3xl font-black text-lobus-primaryDark dark:text-white tracking-tight mb-2">Descubrir</h1>
         <p className="text-lobus-neutral dark:text-gray-400 font-medium">Todo el poder de la Unión Lobus</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-[24px] p-4 flex items-center gap-3 shadow-sm border border-gray-200 dark:border-slate-700 group focus-within:border-lobus-primary transition-colors">
              <Search size={24} className="text-gray-400 group-focus-within:text-lobus-primary" />
              <input 
                type="text" 
                placeholder="¿Qué estás buscando hoy?" 
                className="w-full bg-transparent outline-none font-bold text-lobus-primaryDark dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 px-6 pb-40 overflow-y-auto">
          
          {/* Featured Banner or Install Prompt */}
          {showInstall ? (
            <div onClick={handleInstallClick} className="bg-lobus-primaryDark dark:bg-yellow-600 rounded-[32px] p-6 text-white mb-8 relative overflow-hidden cursor-pointer active:scale-98 transition-transform shadow-lg group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="bg-white/20 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 backdrop-blur-sm">
                            <Download size={12} className="text-yellow-400 dark:text-white" /> Instalar App
                        </div>
                        <h2 className="text-2xl font-black mb-1">MyLobus OS</h2>
                        <p className="opacity-80 text-sm font-medium w-3/4">Instala la aplicación en tu dispositivo para una experiencia completa.</p>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center text-lobus-primaryDark shadow-lg group-hover:scale-110 transition-transform">
                        <BrandLogo className="w-10 h-10" />
                    </div>
                </div>
            </div>
          ) : (
            <div onClick={() => handleNav('FINANCE')} className="bg-lobus-primaryDark dark:bg-yellow-600 rounded-[32px] p-6 text-white mb-8 relative overflow-hidden cursor-pointer active:scale-98 transition-transform shadow-lg">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                <div className="relative z-10">
                    <div className="bg-white/20 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 backdrop-blur-sm">
                        <Zap size={12} className="text-yellow-400 dark:text-white" /> Destacado
                    </div>
                    <h2 className="text-2xl font-black mb-2">Lobus Prime</h2>
                    <p className="opacity-80 text-sm font-medium mb-4 w-2/3">Maximiza tus rendimientos con la nueva cuenta de inversión de alto nivel.</p>
                    <button className="bg-white text-lobus-primaryDark px-5 py-2 rounded-full font-bold text-xs">Saber más</button>
                </div>
            </div>
          )}

          <h3 className="text-lobus-primaryDark dark:text-white font-extrabold text-lg mb-4">Categorías</h3>
          <div className="grid grid-cols-2 gap-4">
              {features.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase())).map((feature) => (
                  <button 
                    key={feature.id}
                    onClick={() => handleNav(feature.view)}
                    className="bg-white dark:bg-slate-800 p-5 rounded-[28px] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left group"
                  >
                      <div className={`w-12 h-12 rounded-[20px] ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <feature.icon size={24} />
                      </div>
                      <h4 className="font-bold text-lobus-primaryDark dark:text-white text-base">{feature.title}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">{feature.desc}</p>
                  </button>
              ))}
          </div>

          {/* Help Section */}
           <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[24px] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-500 flex items-center justify-center">
                  <Heart size={24} />
              </div>
              <div>
                  <h4 className="font-bold text-lobus-primaryDark dark:text-white">Ayuda Ciudadana</h4>
                  <p className="text-xs text-gray-400">¿Necesitas soporte técnico?</p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default DiscoverView;