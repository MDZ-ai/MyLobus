import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { generateAIResponse } from '../services/geminiService';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { Leader } from '../types';
import { playSound } from '../utils/sound';

interface AIViewProps {
  user: Leader;
}

const AIView: React.FC<AIViewProps> = ({ user }) => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `Saludos, ${user.name}. Soy Lobus IA. ¿Cómo puedo asistir tus esfuerzos soberanos hoy?` }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    playSound('click');
    const userText = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const aiText = await generateAIResponse(userText, `Nombre de Usuario: ${user.name}, Rango: ${user.rank}, Balance: ${user.balance}`);
    
    setHistory(prev => [...prev, { role: 'ai', text: aiText }]);
    setLoading(false);
    playSound('success');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="h-full flex flex-col px-6 pt-28 pb-32 bg-lobus-bg">
      <header className="mb-6 mt-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lobus-primary to-lobus-secondary flex items-center justify-center shadow-lg shadow-lobus-primary/20">
            <Sparkles className="text-white" size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-lobus-text">Lobus IA</h1>
            <p className="text-xs text-lobus-sub font-medium">Enlace Neuronal v100.2</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 pb-10">
        {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-lobus-primary text-white rounded-tr-sm shadow-lobus-primary/25' 
                    : 'bg-white text-lobus-text rounded-tl-sm border border-lobus-border shadow-sm'
                }`}>
                    {msg.text}
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                 <div className="bg-white border border-lobus-border p-4 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-sm">
                    <Loader2 size={18} className="animate-spin text-lobus-primary" />
                    <span className="text-xs text-lobus-sub font-medium">Procesando...</span>
                 </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-2 flex items-center gap-2 rounded-full bg-white border border-lobus-border shadow-glass mb-2">
        <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Consultar a la base de datos..."
            className="flex-1 bg-transparent border-none outline-none text-lobus-text text-sm placeholder-gray-400 px-4 py-2"
        />
        <button 
            onClick={handleAsk}
            disabled={loading}
            className="w-10 h-10 rounded-full bg-lobus-primary flex items-center justify-center text-white hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-lg shadow-lobus-primary/20"
        >
            <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIView;