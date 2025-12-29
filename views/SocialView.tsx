import React, { useState } from 'react';
import { LEADERS } from '../constants';
import GlassCard from '../components/GlassCard';
import { Send, Trophy, Gift } from 'lucide-react';
import { Leader } from '../types';
import { playSound } from '../utils/sound';

interface SocialViewProps {
  currentUser: Leader;
  updateBalance: (amount: number, description: string) => void;
}

const SocialView: React.FC<SocialViewProps> = ({ currentUser, updateBalance }) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'RANK'>('CHAT');
  const [messages, setMessages] = useState([
    { id: '1', user: 'Bibubib', text: 'Reunión del Consejo a las 14:00. Asistencia obligatoria.', time: '09:00', type: 'system' },
    { id: '2', user: 'Oso Pepe', text: 'Producción industrial subió un 400%.', time: '09:15', type: 'user' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    playSound('click');
    setMessages([...messages, { 
        id: Date.now().toString(), 
        user: currentUser.name, 
        text: inputText, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        type: 'user' 
    }]);
    
    // Easter egg: sending messages costs nothing but feels premium
    if (inputText.includes('/gift')) {
        updateBalance(-10, "Regalo en Chat");
    }
    
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-lobus-bg">
      <div className="p-6 pb-2 pt-10">
        <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-extrabold text-lobus-text tracking-tight">Lobus Connect</h1>
            <div className="flex bg-white border border-lobus-border rounded-full p-1 shadow-sm">
                <button 
                    onClick={() => setActiveTab('CHAT')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'CHAT' ? 'bg-lobus-primary text-white shadow-md' : 'text-lobus-sub'}`}
                >
                    Chat
                </button>
                <button 
                    onClick={() => setActiveTab('RANK')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'RANK' ? 'bg-lobus-primary text-white shadow-md' : 'text-lobus-sub'}`}
                >
                    Rango
                </button>
            </div>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-36">
        {activeTab === 'CHAT' ? (
            <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.user === currentUser.name ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.user === currentUser.name ? 'bg-lobus-primary text-white rounded-tr-sm shadow-lobus-primary/20' : 'bg-white text-lobus-text border border-lobus-border rounded-tl-sm'}`}>
                            {msg.user !== currentUser.name && <p className="text-[10px] text-lobus-sub mb-1 font-bold uppercase">{msg.user}</p>}
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-lobus-sub/70 mt-1 font-medium">{msg.time}</span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-3">
                {[...LEADERS].sort((a, b) => b.balance - a.balance).map((leader, index) => (
                    <GlassCard key={leader.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-lobus-sub'}`}>
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="text-lobus-text font-bold text-sm">{leader.name}</h4>
                                <p className="text-lobus-sub text-[10px] uppercase font-bold tracking-wide">{leader.rank}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             {index === 0 && <Trophy size={16} className="text-yellow-500" />}
                            <span className="text-lobus-primary font-bold text-sm">
                                ${(leader.balance / 1000000).toFixed(1)}M
                            </span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        )}
      </div>

      {activeTab === 'CHAT' && (
        <div className="absolute bottom-24 left-0 right-0 px-6 z-10">
            <div className="p-2 flex items-center gap-2 rounded-full bg-white border border-lobus-border shadow-glass">
                <button className="w-10 h-10 rounded-full hover:bg-yellow-50 flex items-center justify-center text-yellow-500 transition-colors">
                    <Gift size={20} />
                </button>
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent border-none outline-none text-lobus-text text-sm placeholder-gray-400 px-2"
                />
                <button 
                    onClick={handleSend}
                    className="w-10 h-10 rounded-full bg-lobus-primary flex items-center justify-center text-white shadow-lg shadow-lobus-primary/30 hover:bg-blue-600 transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default SocialView;