import React, { useState } from 'react';
import { AppViewProps, Message } from '../types';
import { ArrowLeft, Mail, FileBadge, Trash2, Check, X, Search } from 'lucide-react';
import { playSound } from '../utils/sound';

const MessagesView: React.FC<AppViewProps> = ({ user, setView }) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'LEGAL' | 'UNREAD'>('ALL');

  // Filter logic
  const filteredMessages = user.messages.filter(m => {
      if (filter === 'LEGAL') return m.isLegal;
      if (filter === 'UNREAD') return !m.read;
      return true;
  });

  const openMessage = (msg: Message) => {
      playSound('click');
      setSelectedMessage(msg);
      // Logic to mark as read could go here in a real backend
      msg.read = true; 
  };

  const closeMessage = () => {
      playSound('click');
      setSelectedMessage(null);
  };

  return (
    <div className="h-full overflow-y-auto bg-lobus-bg dark:bg-slate-900 animate-enter flex flex-col relative transition-colors duration-300">
      
      {/* Header */}
      <div className="pt-14 px-6 pb-6 bg-white dark:bg-slate-800 rounded-b-[32px] shadow-sm z-20 flex-shrink-0 transition-colors">
         <button onClick={() => setView('DASHBOARD')} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-lobus-primaryDark dark:hover:text-white transition-colors font-bold text-sm">
             <ArrowLeft size={18} /> Volver
         </button>
         <div className="flex justify-between items-end">
             <h1 className="text-3xl font-black text-lobus-primaryDark dark:text-white tracking-tight">Buzón Lobus</h1>
             <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-lobus-primaryDark dark:text-white">
                 <Mail size={20} />
             </div>
         </div>
         
         {/* Filter Tabs */}
         <div className="flex mt-6 bg-gray-100 dark:bg-slate-700 p-1 rounded-full">
             <button 
                onClick={() => setFilter('ALL')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-white dark:bg-slate-600 text-lobus-primaryDark dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-400'}`}
             >
                 Todos
             </button>
             <button 
                onClick={() => setFilter('UNREAD')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${filter === 'UNREAD' ? 'bg-white dark:bg-slate-600 text-lobus-primaryDark dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-400'}`}
             >
                 No Leídos
             </button>
             <button 
                onClick={() => setFilter('LEGAL')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${filter === 'LEGAL' ? 'bg-white dark:bg-slate-600 text-lobus-primaryDark dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-400'}`}
             >
                 Legal
             </button>
         </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
          {filteredMessages.length > 0 ? (
              filteredMessages.map(msg => (
                <button 
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-gray-100 dark:border-slate-700 shadow-sm active:scale-98 transition-transform group relative overflow-hidden
                        ${!msg.read ? 'border-l-4 border-l-lobus-primary' : ''}
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                             {msg.isLegal && <FileBadge size={16} className="text-lobus-primaryDark dark:text-blue-300" />}
                             <span className={`text-xs font-bold ${msg.isLegal ? 'text-lobus-primaryDark dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>{msg.sender}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{msg.date}</span>
                    </div>
                    <h3 className={`text-sm font-bold text-lobus-primaryDark dark:text-white mb-1 ${!msg.read ? 'font-black' : ''}`}>{msg.subject}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{msg.preview}</p>
                    
                    {!msg.read && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-lobus-primary shadow-neon"></div>
                    )}
                </button>
              ))
          ) : (
              <div className="flex flex-col items-center justify-center pt-20 opacity-50">
                  <Mail size={48} className="text-gray-300 mb-4" />
                  <p className="text-sm font-bold text-gray-400">No hay mensajes</p>
              </div>
          )}
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-lobus-primaryDark/30 backdrop-blur-md animate-enter">
             <div onClick={closeMessage} className="absolute inset-0" />
             <div className="relative w-full max-w-sm h-[80%] sm:h-[600px] bg-white dark:bg-slate-800 rounded-t-[40px] sm:rounded-[40px] shadow-2xl animate-slide-up flex flex-col overflow-hidden transition-colors">
                 
                 {/* Modal Header */}
                 <div className="bg-lobus-bg dark:bg-slate-900 p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-start rounded-t-[40px]">
                     <div>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                             {selectedMessage.date} • {selectedMessage.sender}
                         </span>
                         <h2 className="text-xl font-black text-lobus-primaryDark dark:text-white leading-tight">{selectedMessage.subject}</h2>
                     </div>
                     <button onClick={closeMessage} className="bg-white dark:bg-slate-700 p-2 rounded-full border border-gray-200 dark:border-slate-600">
                         <X size={20} className="text-gray-500 dark:text-white" />
                     </button>
                 </div>

                 {/* Modal Body */}
                 <div className="p-8 overflow-y-auto flex-1 bg-white dark:bg-slate-800">
                     {selectedMessage.isLegal && (
                         <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900 rounded-xl p-3 flex items-center gap-3 mb-6">
                             <FileBadge size={20} className="text-lobus-primaryDark dark:text-blue-300" />
                             <span className="text-xs font-bold text-lobus-primaryDark dark:text-blue-300">Notificación Oficial Certificada</span>
                         </div>
                     )}
                     
                     <p className="text-lobus-primaryDark dark:text-gray-300 text-base leading-relaxed font-medium">
                         {selectedMessage.preview}
                         <br/><br/>
                         Estimado ciudadano, esta es una notificación generada automáticamente por el sistema central de la Unión Lobus. Por favor, realice las gestiones necesarias antes de la fecha límite para evitar recargos administrativos.
                         <br/><br/>
                         Atentamente,<br/>
                         {selectedMessage.sender}
                     </p>
                 </div>

                 {/* Modal Footer */}
                 <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex gap-3">
                     <button className="flex-1 py-4 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                         <Trash2 size={18} /> Eliminar
                     </button>
                     <button onClick={closeMessage} className="flex-1 py-4 rounded-xl font-bold text-white bg-lobus-primaryDark hover:bg-lobus-primary hover:text-lobus-primaryDark transition-colors shadow-lg flex items-center justify-center gap-2">
                         <Check size={18} /> Entendido
                     </button>
                 </div>

             </div>
          </div>
      )}
    </div>
  );
};

export default MessagesView;