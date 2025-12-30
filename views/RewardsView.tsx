import React, { useState } from 'react';
import { AppViewProps } from '../types';
import { ArrowLeft, Gift, Trophy, Star, Gamepad2, Coins, CalendarDays, Loader2, CheckCircle2, Ticket, Disc } from 'lucide-react';
import { playSound } from '../utils/sound';

const RewardsView: React.FC<AppViewProps> = ({ user, setView, updateBalance }) => {
  const [activeTab, setActiveTab] = useState<'DAILY' | 'GAMES'>('GAMES');
  const [loading, setLoading] = useState(false);
  
  // Scratch State
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [scratchPrize, setScratchPrize] = useState(0);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Daily Reward State (Mocked)
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const handleClaimDaily = () => {
      if (dailyClaimed || loading) return;
      setLoading(true);
      playSound('click');
      setTimeout(() => {
          updateBalance(50, "Recompensa Diaria", "Bonus por ingreso");
          setDailyClaimed(true);
          setLoading(false);
          playSound('success');
      }, 1500);
  };

  const playScratch = () => {
      if (loading || scratchRevealed) return;
      setLoading(true);
      playSound('pay');
      
      updateBalance(-5, "Ticket Rasca y Gana", "Costo de participación");

      setTimeout(() => {
          const prize = Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 10 : 0;
          setScratchPrize(prize);
          setScratchRevealed(true);
          setLoading(false);
          
          if (prize > 0) {
              playSound('success');
              updateBalance(prize, "Premio Rasca y Gana", "¡Ganaste!");
          } else {
              playSound('error');
          }
      }, 1500);
  };

  const resetScratch = () => {
      setScratchRevealed(false);
      setScratchPrize(0);
      playSound('click');
  };

  const spinWheel = () => {
      if (isSpinning || loading) return;
      if (user.balance < 10) {
          alert("Necesitas 10€ para girar la ruleta.");
          return;
      }

      setIsSpinning(true);
      setLoading(true);
      updateBalance(-10, "Giro Ruleta", "Costo de participación");
      playSound('pay');

      const spins = 5;
      const randomDegrees = Math.floor(Math.random() * 360);
      const totalRotation = rotation + (360 * spins) + randomDegrees;
      
      setRotation(totalRotation);

      setTimeout(() => {
          setIsSpinning(false);
          setLoading(false);
          // Simple logic: random prize based on spin (mocked for simplicity)
          const prize = Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0;
          
          if (prize > 0) {
              playSound('success');
              alert(`¡Felicidades! Ganaste ${prize}€`);
              updateBalance(prize, "Premio Ruleta", "¡Ganaste!");
          } else {
              playSound('error');
          }
      }, 4000); // 4s spin duration
  };

  return (
    <div className="flex flex-col h-full bg-lobus-bg dark:bg-slate-900 animate-enter transition-colors duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="pt-28 px-6 pb-6 bg-white dark:bg-slate-800 rounded-b-[32px] shadow-sm flex-shrink-0 z-20">
            <button onClick={() => setView('DASHBOARD')} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-lobus-primaryDark dark:hover:text-white transition-colors font-bold text-sm">
                <ArrowLeft size={18} /> Volver
            </button>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lobus-neutral dark:text-gray-400 font-medium text-sm">Zona de Ocio</h2>
                    <h1 className="text-3xl font-black text-lobus-primaryDark dark:text-white tracking-tight">Juega y Gana</h1>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30">
                    <Gamepad2 size={24} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-slate-700 p-1.5 rounded-full mt-6">
                <button 
                    onClick={() => { setActiveTab('GAMES'); playSound('click'); }}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'GAMES' ? 'bg-white dark:bg-slate-600 text-lobus-primaryDark dark:text-white shadow-sm' : 'text-gray-400'}`}
                >
                    Juegos
                </button>
                <button 
                    onClick={() => { setActiveTab('DAILY'); playSound('click'); }}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'DAILY' ? 'bg-white dark:bg-slate-600 text-lobus-primaryDark dark:text-white shadow-sm' : 'text-gray-400'}`}
                >
                    Misiones
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-40 space-y-6">
            
            {activeTab === 'GAMES' ? (
                <>
                    {/* Scratch Card Game */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] p-1 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                        <div className="bg-white dark:bg-slate-800 rounded-[28px] p-6 h-full relative z-10 flex flex-col items-center text-center">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4 text-purple-600 dark:text-purple-300">
                                <Ticket size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-lobus-primaryDark dark:text-white mb-2">Rasca y Gana</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">Costo del ticket: 5€. ¡Premios hasta 50€!</p>

                            {!scratchRevealed ? (
                                <button 
                                    onClick={playScratch} 
                                    disabled={loading}
                                    className="w-full h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-300 dark:border-slate-600 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors active:scale-95"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin text-lobus-primary" size={32} />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                                            <span className="font-black text-lg uppercase tracking-widest">Rascar Aquí</span>
                                        </div>
                                    )}
                                </button>
                            ) : (
                                <div className="w-full h-32 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl flex flex-col items-center justify-center border-2 border-yellow-200 dark:border-yellow-600/30 animate-pop">
                                    {scratchPrize > 0 ? (
                                        <>
                                            <Trophy size={32} className="text-yellow-500 mb-2" />
                                            <span className="font-black text-3xl text-lobus-primaryDark dark:text-white">+{scratchPrize}€</span>
                                            <span className="text-xs font-bold text-green-500 uppercase">¡Premio!</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-4xl mb-2">😢</span>
                                            <span className="font-bold text-lobus-primaryDark dark:text-white">Sin premio</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {scratchRevealed && (
                                <button onClick={resetScratch} className="mt-4 text-sm font-bold text-lobus-primaryDark dark:text-white underline">Jugar de nuevo</button>
                            )}
                        </div>
                    </div>

                    {/* Wheel of Fortune */}
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center overflow-hidden relative">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center text-pink-600 dark:text-pink-400">
                                <Disc size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-lobus-primaryDark dark:text-white">Ruleta Fortuna</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Costo: 10€ / Giro</p>
                            </div>
                        </div>

                        <div className="relative w-48 h-48 mb-6">
                             {/* Pointer */}
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 z-20 w-4 h-6 bg-lobus-primaryDark dark:bg-white clip-triangle" style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}}></div>
                             
                             {/* Wheel */}
                             <div 
                                className="w-full h-full rounded-full border-4 border-lobus-primary bg-lobus-bg dark:bg-slate-700 relative overflow-hidden shadow-inner transition-transform duration-[4000ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
                                style={{ transform: `rotate(${rotation}deg)` }}
                             >
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 rounded-full"></div>
                                 {/* Segments (Simplified visual representation) */}
                                 <div className="absolute w-full h-full" style={{background: 'conic-gradient(#FFD300 0deg 90deg, #00A3E0 90deg 180deg, #EF4444 180deg 270deg, #10B981 270deg 360deg)'}}></div>
                                 <div className="absolute inset-2 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                                      <div className="w-4 h-4 rounded-full bg-lobus-primaryDark dark:bg-white"></div>
                                 </div>
                             </div>
                        </div>

                        <button 
                            onClick={spinWheel} 
                            disabled={isSpinning || loading}
                            className="w-full py-3 bg-lobus-primaryDark dark:bg-white text-white dark:text-lobus-primaryDark rounded-xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSpinning ? 'Girando...' : 'Girar Ahora'}
                        </button>
                    </div>

                    {/* Lotto Game Placeholder */}
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden opacity-70">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 text-xl font-bold border border-green-100 dark:border-green-800/30">
                                777
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-lobus-primaryDark dark:text-white">Lotería Lobus</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Próximamente</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Daily Check-in */}
                    <div className="bg-lobus-primary dark:bg-yellow-600 rounded-[32px] p-6 text-lobus-primaryDark dark:text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/20 rounded-full translate-x-10 translate-y-10"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-lobus-primaryDark dark:text-white">
                                <CalendarDays size={32} />
                            </div>
                            <h2 className="text-2xl font-black mb-2">Bonus Diario</h2>
                            <p className="font-medium text-sm mb-6 opacity-90">Entra cada día para ganar recompensas gratuitas.</p>
                            
                            <button 
                                onClick={handleClaimDaily}
                                disabled={dailyClaimed || loading}
                                className={`w-full py-4 rounded-full font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${dailyClaimed ? 'bg-green-500 text-white cursor-default' : 'bg-white text-lobus-primaryDark hover:bg-gray-50'}
                                `}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : dailyClaimed ? <><CheckCircle2 size={20}/> Reclamado</> : 'Reclamar 50€'}
                            </button>
                        </div>
                    </div>

                    {/* Quest List */}
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-extrabold text-lg text-lobus-primaryDark dark:text-white mb-4 flex items-center gap-2">
                            <Star size={20} className="text-yellow-500 fill-yellow-500" /> Misiones
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Haz una transferencia', reward: 20, done: true },
                                { title: 'Invita a un amigo', reward: 100, done: false },
                                { title: 'Usa Lobus IA', reward: 10, done: false }
                            ].map((quest, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-lobus-bg dark:bg-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${quest.done ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-slate-600 text-white'}`}>
                                            {quest.done && <CheckCircle2 size={12} />}
                                        </div>
                                        <span className={`text-sm font-bold ${quest.done ? 'text-gray-400 line-through' : 'text-lobus-primaryDark dark:text-white'}`}>{quest.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-black text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                                        <Coins size={10} /> +{quest.reward}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};

export default RewardsView;