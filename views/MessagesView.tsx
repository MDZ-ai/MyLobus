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
      <div className="pt-28 px-6 pb-6 bg-white dark:bg-slate-800 rounded-b-[32px] shadow-sm z-20 flex-shrink-0 transition-colors">
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
             <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-t-[40px] sm:rounded-[40px] p-8 pb-12 shadow-2xl animate-slide-up h-[85vh] flex flex-col">
                 <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full mx-auto mb-6 flex-shrink-0" />
                 
                 <div className="flex justify-between items-start mb-6 flex-shrink-0">
                     <div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedMessage.date}</span>
                         <h2 className="text-xl font-black text-lobus-primaryDark dark:text-white mt-1 leading-tight">{selectedMessage.subject}</h2>
                     </div>
                     <button onClick={closeMessage} className="bg-gray-100 dark:bg-slate-700 dark:text-white p-2 rounded-full"><X size={20}/></button>
                 </div>

                 <div className="flex items-center gap-3 mb-6 p-4 bg-lobus-bg dark:bg-slate-700 rounded-[20px] flex-shrink-0">
                     <div className="w-10 h-10 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center text-lobus-primaryDark dark:text-white font-bold border border-gray-200 dark:border-slate-500">
                         {selectedMessage.sender[0]}
                     </div>
                     <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">De</p>
                         <p className="font-bold text-sm text-lobus-primaryDark dark:text-white">{selectedMessage.sender}</p>
                     </div>
                 </div>

                 <div className="flex-1 overflow-y-auto prose dark:prose-invert">
                     <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                         {selectedMessage.preview}
                         <br/><br/>
                         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                         <br/><br/>
                         Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                     </p>
                 </div>

                 <div className="pt-6 mt-4 border-t border-gray-100 dark:border-slate-700 flex gap-4 flex-shrink-0">
                     <button className="flex-1 py-4 rounded-[24px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                         <Trash2 size={18} /> Eliminar
                     </button>
                     <button onClick={closeMessage} className="flex-1 py-4 rounded-[24px] font-bold text-lobus-primaryDark bg-lobus-primary hover:bg-yellow-400 flex items-center justify-center gap-2 transition-colors shadow-lg">
                         <Check size={18} /> Aceptar
                     </button>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default MessagesView;