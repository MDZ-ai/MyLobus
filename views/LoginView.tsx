import React, { useState } from 'react';
import { LEADERS } from '../constants';
import { Leader } from '../types';
import { playSound } from '../utils/sound';
import { ArrowRight, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
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
          <p className="text-lobus-primaryDark font-bold mt-3 text-sm uppercase tracking-widest opacity-80 border border-lobus-primaryDark px-3 py-1 rounded-full">Union Lobus</p>
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
          <p className="text-[10px] text-gray-300 font-bold">Unión Lobus • Sistema Operativo Soberano</p>
      </div>
    </div>
  );
};

export default LoginView;