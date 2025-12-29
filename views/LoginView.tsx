import React, { useState, useEffect } from 'react';
import { LEADERS } from '../constants';
import { Leader } from '../types';
import { playSound } from '../utils/sound';
import { ArrowRight, Lock, User, AlertCircle, Download, Share, Plus, Smartphone, Menu, X, Loader2 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

interface LoginViewProps {
  onLogin: (leader: Leader) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'CREDENTIALS' | 'SECURITY_SCAN'>('CREDENTIALS');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState<'handle' | 'password' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // PWA Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
    }
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
             if (choice.outcome === 'accepted') setIsInstalled(true);
             setDeferredPrompt(null);
          });
      } else {
          setShowInstallHelp(true);
      }
  };

  const validate = () => {
    setFieldError(null);
    const cleanHandle = handle.trim();
    
    if (!cleanHandle) {
      setError('Introduce tu ID Ciudadano');
      setFieldError('handle');
      playSound('error');
      return false;
    }
    
    if (cleanHandle.length < 3) {
      setError('El ID es demasiado corto');
      setFieldError('handle');
      playSound('error');
      return false;
    }

    if (!password.trim()) {
      setError('La contraseña es obligatoria');
      setFieldError('password');
      playSound('error');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;
    
    setIsLoading(true);
    playSound('click');

    setTimeout(() => {
        const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
        
        const user = LEADERS.find(l => 
          l.handle.toLowerCase() === normalizedHandle.toLowerCase() && 
          l.password === password
        );

        if (user) {
          setStep('SECURITY_SCAN');
          playSound('scan');
          setTimeout(() => {
            playSound('success');
            onLogin(user);
          }, 2000);
        } else {
          playSound('error');
          setError('Credenciales no válidas');
          setFieldError('handle'); 
          setIsLoading(false);
        }
    }, 800);
  };

  if (step === 'SECURITY_SCAN') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-lobus-primaryDark p-6 text-center animate-enter text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-lobus-primary animate-slide-up" style={{animationDuration: '2s', animationIterationCount: 'infinite'}}></div>
        
        <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-white/20 rounded-full animate-ripple"></div>
            <div className="absolute inset-0 border-[6px] border-lobus-primary/50 rounded-full animate-ripple" style={{animationDelay: '0.6s'}}></div>
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center relative z-10 border-4 border-lobus-primary shadow-lg animate-pulse-slow">
                 <BrandLogo className="w-16 h-16" />
            </div>
        </div>
        <h2 className="text-3xl font-extrabold text-white mt-8 mb-2 animate-slide-up">Lobus ID</h2>
        <p className="text-blue-100 font-medium animate-slide-up" style={{animationDelay: '0.1s'}}>Verificando Identidad Digital...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white animate-enter relative overflow-hidden">
      
      {/* Top Banner Style */}
      <div className="bg-lobus-primary h-[40%] rounded-b-[48px] relative flex flex-col items-center justify-center shadow-lg pb-8">
          <div className="bg-white p-5 rounded-[24px] shadow-2xl mb-5 animate-pop">
               <BrandLogo className="w-24 h-24" />
          </div>
          <h1 className="text-5xl font-black text-lobus-primaryDark tracking-tight text-center leading-none">
            My<span className="text-white drop-shadow-md">Lobus</span>
          </h1>
          <p className="text-lobus-primaryDark font-bold mt-3 text-sm uppercase tracking-widest opacity-80 border border-lobus-primaryDark px-3 py-1 rounded-full">Sovereign OS v100</p>
      </div>

      <div className="flex-1 flex flex-col justify-start max-w-sm mx-auto w-full z-10 p-8 -mt-12">
        <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-lobus-primaryDark text-center mb-6">Acceso Ciudadano</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-3">IDENTIFICADOR</label>
                <div className={`relative group transition-all duration-300 ${fieldError === 'handle' ? 'shake' : ''}`}>
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${fieldError === 'handle' ? 'text-red-500' : 'text-lobus-primaryDark group-focus-within:text-lobus-primary'}`}>
                    <User size={20} />
                </div>
                <input 
                    type="text" 
                    value={handle}
                    onChange={(e) => { setHandle(e.target.value); setError(''); setFieldError(null); }}
                    placeholder="ej. @ciudadano"
                    className={`w-full bg-lobus-bg border-b-2 rounded-t-xl py-4 pl-12 pr-4 text-base font-bold text-lobus-primaryDark outline-none transition-all placeholder:text-gray-400
                        ${fieldError === 'handle' ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-lobus-primary focus:bg-blue-50'}
                    `}
                />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-3">CONTRASEÑA</label>
                <div className={`relative group transition-all duration-300 ${fieldError === 'password' ? 'shake' : ''}`}>
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${fieldError === 'password' ? 'text-red-500' : 'text-lobus-primaryDark group-focus-within:text-lobus-primary'}`}>
                    <Lock size={20} />
                </div>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); setFieldError(null); }}
                    placeholder="••••••••"
                    className={`w-full bg-lobus-bg border-b-2 rounded-t-xl py-4 pl-12 pr-4 text-base font-bold text-lobus-primaryDark outline-none transition-all placeholder:text-gray-400
                        ${fieldError === 'password' ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-lobus-primary focus:bg-blue-50'}
                    `}
                />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-lobus-error text-xs font-bold bg-red-50 border border-red-100 p-3 rounded-xl animate-slide-up">
                <AlertCircle size={16} />
                {error}
                </div>
            )}

            <div className="pt-2">
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-lobus-primaryDark text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-lobus-primaryDark/20 flex items-center justify-center gap-3 transition-all active:scale-[0.97] hover:bg-blue-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin text-lobus-primary" /> : <>Entrar <ArrowRight size={20} strokeWidth={3} className="text-lobus-primary" /></>}
                </button>
            </div>
            </form>
            
            <div className="mt-6 text-center">
                <button className="text-xs font-bold text-lobus-primaryDark hover:text-lobus-primary transition-colors">¿Olvidaste tus credenciales?</button>
            </div>
        </div>
      </div>
      
      <div className="p-4 pb-8 text-center flex flex-col items-center gap-3">
          {!isInstalled && (
              <button 
                onClick={handleInstallClick} 
                className="flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full text-xs font-bold text-lobus-primaryDark hover:bg-gray-200 hover:scale-105 transition-all shadow-sm"
              >
                  <Download size={16} /> Instalar Aplicación
              </button>
          )}
          <p className="text-[10px] text-gray-300 font-bold">Unión Lobus • Sistema Operativo Soberano</p>
      </div>

      {/* Install Help Modal */}
      {showInstallHelp && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-lobus-primaryDark/60 backdrop-blur-md animate-enter">
            <div onClick={() => setShowInstallHelp(false)} className="absolute inset-0" />
            <div className="relative w-full max-w-md bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl animate-slide-up">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="flex justify-between items-center mb-4 px-2">
                     <h2 className="text-xl font-extrabold text-lobus-primaryDark">Instalar MyLobus</h2>
                     <button onClick={() => setShowInstallHelp(false)} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
                </div>
                <div className="bg-blue-50 p-6 rounded-[24px] mb-6 text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-blue-100">
                        <BrandLogo className="w-12 h-12" />
                    </div>
                    <h3 className="font-bold text-lobus-primaryDark mb-2">Instalar Aplicación Web</h3>
                    <p className="text-sm text-lobus-neutral">
                        Añade MyLobus a tu pantalla de inicio para una experiencia a pantalla completa y acceso offline.
                    </p>
                </div>
                
                {isIOS ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                <Share size={20} className="text-blue-500" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">1. Pulsa <strong>Compartir</strong> en la barra inferior de Safari.</p>
                        </div>
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                <Plus size={20} className="text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">2. Selecciona <strong>"Añadir a la pantalla de inicio"</strong>.</p>
                        </div>
                    </div>
                ) : (
                        <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                <Menu size={20} className="text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">1. Abre el menú del navegador (tres puntos).</p>
                        </div>
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                <Smartphone size={20} className="text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">2. Selecciona <strong>"Instalar aplicación"</strong>.</p>
                        </div>
                    </div>
                )}
                <button onClick={() => setShowInstallHelp(false)} className="w-full mt-6 bg-lobus-primaryDark text-white py-4 rounded-full font-bold">Entendido</button>
            </div>
        </div>
      )}

    </div>
  );
};

export default LoginView;