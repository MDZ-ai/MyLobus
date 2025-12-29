import React, { useState } from 'react';
import { LOBUS_UNION_SERVICES } from '../constants';
import { Landmark, Bus, Smartphone, Zap, MapPin, Building2 } from 'lucide-react';
import { playSound } from '../utils/sound';
import { AppViewProps } from '../types';

const ServicesView: React.FC<AppViewProps> = () => {
  const [selectedCountryId, setSelectedCountryId] = useState(LOBUS_UNION_SERVICES[0].id);

  const selectedCountry = LOBUS_UNION_SERVICES.find(c => c.id === selectedCountryId) || LOBUS_UNION_SERVICES[0];

  const getIcon = (type: string) => {
    switch (type) {
        case 'BANK': return <Landmark size={20} />;
        case 'TRANSPORT': return <Bus size={20} />;
        case 'PHONE': return <Smartphone size={20} />;
        case 'UTILITY': return <Zap size={20} />;
        case 'PUBLIC': return <Building2 size={20} />;
        default: return <MapPin size={20} />;
    }
  };

  const handleCountrySelect = (id: string) => {
    playSound('click');
    setSelectedCountryId(id);
  };

  return (
    <div className="h-full flex flex-col bg-lobus-bg dark:bg-slate-900 animate-enter overflow-hidden relative transition-colors duration-300">
      
      {/* Header */}
      <div className="pt-14 px-6 pb-2 flex-shrink-0 z-20">
         <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-lobus-border dark:border-slate-700 flex items-center justify-center shadow-sm text-2xl">
                 🌍
             </div>
             <div>
                <h2 className="text-lobus-neutral dark:text-gray-400 font-medium text-sm">Directorio Oficial</h2>
                <h1 className="text-2xl font-black text-lobus-obsidian dark:text-white tracking-tight">Unión Lobus</h1>
             </div>
         </div>

         {/* Country Selector (Pills) */}
         <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
             {LOBUS_UNION_SERVICES.map(country => (
                 <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country.id)}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all font-bold text-sm border
                        ${selectedCountryId === country.id 
                            ? 'bg-lobus-obsidian text-lobus-cyan border-lobus-obsidian shadow-lg dark:bg-white dark:text-lobus-obsidian' 
                            : 'bg-white dark:bg-slate-800 text-lobus-neutral dark:text-gray-400 border-lobus-border dark:border-slate-700 hover:border-lobus-cyan'
                        }
                    `}
                 >
                     <span>{country.emoji}</span>
                     <span>{country.name}</span>
                 </button>
             ))}
         </div>
      </div>

      {/* Main Content */}
      <div key={selectedCountryId} className="flex-1 overflow-y-auto pb-40 px-6 animate-enter">
        
        {/* Country Header Card */}
        <div className={`p-6 rounded-[32px] mb-6 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border border-lobus-border/50 dark:border-slate-700`}>
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-black text-lobus-obsidian dark:text-white mb-1">{selectedCountry.emoji} {selectedCountry.name}</h2>
                    <p className="text-gray-500 font-medium text-sm">{selectedCountry.description}</p>
                </div>
            </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4">
            {selectedCountry.services.map((category, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 border border-lobus-border dark:border-slate-700 rounded-[32px] p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-lobus-obsidian dark:text-white">
                        <div className={`p-2.5 rounded-xl ${category.type === 'PUBLIC' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-cyan-50 text-lobus-cyan dark:bg-cyan-900/30 dark:text-cyan-300'}`}>
                            {getIcon(category.type)}
                        </div>
                        <h3 className="font-bold text-lg">{category.title}</h3>
                    </div>
                    
                    <div className="grid gap-2">
                        {category.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-lobus-bg dark:hover:bg-slate-700 transition-colors cursor-default group">
                                <div className="w-2 h-2 rounded-full bg-lobus-border dark:bg-slate-600 group-hover:bg-lobus-cyan transition-colors"></div>
                                <span className="text-lobus-neutral dark:text-gray-400 font-medium group-hover:text-lobus-obsidian dark:group-hover:text-white">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center">
            <p className="text-xs text-lobus-neutral/50 font-bold uppercase tracking-widest">
                Datos verificados por la Unión Lobus
            </p>
        </div>

      </div>
    </div>
  );
};

export default ServicesView;