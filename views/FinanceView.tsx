import React, { useState, useEffect } from 'react';
import { MOCK_STOCK_DATA_1D, MOCK_STOCK_DATA_1M, COMPANIES } from '../constants';
import GlassCard from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, X, Loader2, ArrowUpRight, TrendingUp, TrendingDown, RefreshCcw, AlertCircle, PieChart, ShoppingBag, Coffee, Car } from 'lucide-react';
import { AppViewProps } from '../types';
import { playSound } from '../utils/sound';

const FinanceView: React.FC<AppViewProps> = ({ user, updateBalance }) => {
  const [timeRange, setTimeRange] = useState('1D');
  const [chartData, setChartData] = useState(MOCK_STOCK_DATA_1D);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [trading, setTrading] = useState<'BUY' | 'SELL' | null>(null);
  const [shares, setShares] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Real-time Stock State
  const [liveStocks, setLiveStocks] = useState(COMPANIES.map(c => ({
      ...c, 
      price: c.price, // Ensure number format
      changeValue: parseFloat(c.change.replace('%','').replace('+','').replace('-','')) * (c.change.includes('-') ? -1 : 1)
  })));
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
      const interval = setInterval(() => {
          updateMarket();
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
  }, []);

  const updateMarket = () => {
      setLiveStocks(prev => prev.map(stock => {
          const volatility = 0.02;
          const change = 1 + (Math.random() * volatility * 2 - volatility);
          const newPrice = Math.round(stock.price * change * 100) / 100;
          const percentChange = ((newPrice - stock.price) / stock.price) * 100;
          
          return {
              ...stock,
              price: newPrice,
              change: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%`,
              changeValue: percentChange
          };
      }));
      setLastUpdated(new Date());
  };

  const manualUpdate = () => {
      playSound('click');
      updateMarket();
  };

  const handleTimeChange = (range: string) => {
    playSound('click');
    setTimeRange(range);
    if (range === '1D') setChartData(MOCK_STOCK_DATA_1D);
    else setChartData(MOCK_STOCK_DATA_1M);
  };

  const handleTrade = () => {
    if (!selectedStock || !trading) return;
    setError('');
    
    // Validate Shares
    if (shares <= 0 || !Number.isInteger(shares)) {
        setError("La cantidad debe ser un número entero positivo");
        playSound('error');
        return;
    }

    const currentPrice = liveStocks.find(s => s.symbol === selectedStock.symbol)?.price || selectedStock.price;
    const totalCost = currentPrice * shares;

    if (trading === 'BUY') {
        if (user.balance < totalCost) {
            setError("Fondos insuficientes");
            playSound('error');
            return;
        }
        setProcessing(true);
        playSound('click');
        
        setTimeout(() => {
            updateBalance(-totalCost, `Inversión: ${selectedStock.name}`, `${shares} acciones @ $${currentPrice.toLocaleString()}`);
            setProcessing(false);
            setTrading(null);
            setSelectedStock(null);
            setShares(1); // Reset
            playSound('success');
        }, 1500);
    } else {
        setProcessing(true);
        playSound('click');

        setTimeout(() => {
            updateBalance(totalCost, `Venta: ${selectedStock.name}`, `${shares} acciones @ $${currentPrice.toLocaleString()}`);
            setProcessing(false);
            setTrading(null);
            setSelectedStock(null);
            setShares(1); // Reset
            playSound('success');
        }, 1500);
    }
  };

  // Mock Spending Data
  const spendingCategories = [
      { name: 'Compras', amount: 450, color: 'bg-pink-500', icon: ShoppingBag, percent: 45 },
      { name: 'Ocio', amount: 120, color: 'bg-purple-500', icon: Coffee, percent: 12 },
      { name: 'Transporte', amount: 80, color: 'bg-orange-500', icon: Car, percent: 8 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-lobus-bg dark:bg-slate-900 px-6 pt-28 pb-32 transition-colors duration-300">
      
      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-black text-lobus-obsidian dark:text-white">Bolsa Lobus</h1>
            <div className="flex items-center gap-2 text-[10px] text-lobus-neutral dark:text-gray-400 font-bold mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                MERCADO EN VIVO • {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={manualUpdate} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-lobus-border dark:border-slate-700 flex items-center justify-center text-lobus-neutral dark:text-gray-400 hover:text-lobus-cyan hover:border-lobus-cyan transition-all">
              <RefreshCcw size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-lobus-border dark:border-slate-700 flex items-center justify-center text-lobus-violet shadow-sm hover:shadow-md transition-all">
              <Search size={20} />
            </button>
        </div>
      </header>

      {/* Persistent Live Ticker Widget */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
          {liveStocks.map((stock) => {
              const isUp = stock.change.includes('+') || !stock.change.includes('-');
              return (
                  <div key={stock.symbol} className="min-w-[140px] bg-white dark:bg-slate-800 rounded-[20px] p-3 border border-lobus-border dark:border-slate-700 shadow-sm flex flex-col items-start hover:border-lobus-violet transition-colors animate-enter">
                      <div className="flex justify-between items-center w-full mb-2">
                          <span className="font-black text-xs text-lobus-obsidian dark:text-white bg-lobus-bg dark:bg-slate-700 px-2 py-0.5 rounded-md">{stock.symbol}</span>
                          {isUp 
                            ? <TrendingUp size={14} className="text-lobus-success" /> 
                            : <TrendingDown size={14} className="text-lobus-error" />
                          }
                      </div>
                      <span className="text-lg font-black text-lobus-obsidian dark:text-white tracking-tight">${stock.price.toFixed(1)}</span>
                      <span className={`text-[10px] font-bold ${isUp ? 'text-lobus-success' : 'text-lobus-error'}`}>
                          {stock.change}
                      </span>
                  </div>
              );
          })}
      </div>

      {/* Main Chart */}
      <div className="mb-8">
        <h3 className="text-lobus-neutral dark:text-gray-400 text-xs uppercase mb-1 font-bold tracking-wide">Valor de Portafolio</h3>
        <h2 className="text-4xl font-black text-lobus-obsidian dark:text-white mb-4 tracking-tight">$18,490.50 <span className="text-lg font-bold text-lobus-success ml-2 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-lg">+2.4%</span></h2>
        
        <div className="h-64 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #C7D2FE', borderRadius: '16px', color: '#312E81', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#818CF8', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between px-1 mt-4 bg-white dark:bg-slate-800 border border-lobus-border dark:border-slate-700 p-1.5 rounded-2xl shadow-sm">
           {['1D', '1S', '1M', '1A', 'Todo'].map((p) => (
             <button 
                key={p} 
                onClick={() => handleTimeChange(p)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${timeRange === p ? 'bg-lobus-obsidian dark:bg-yellow-600 text-lobus-cyan dark:text-white shadow-md' : 'text-lobus-neutral dark:text-gray-400 hover:text-lobus-obsidian dark:hover:text-white'}`}
             >
                {p}
             </button>
           ))}
        </div>
      </div>

      {/* Analytics Section (NEW) */}
      <div className="mb-8">
          <h3 className="text-lobus-obsidian dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-lobus-secondary" /> Análisis de Gastos
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-lobus-border dark:border-slate-700 shadow-sm">
              <div className="space-y-4">
                  {spendingCategories.map((cat, i) => (
                      <div key={i}>
                          <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${cat.color} text-white`}>
                                      <cat.icon size={12} />
                                  </div>
                                  <span className="text-sm font-bold text-lobus-obsidian dark:text-white">{cat.name}</span>
                              </div>
                              <span className="text-sm font-bold text-lobus-neutral dark:text-gray-400">{cat.amount}€</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                              <div className={`h-2 rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <h3 className="text-lobus-obsidian dark:text-white font-bold text-lg mb-4">Acciones Principales</h3>
      
      <div className="space-y-3">
        {liveStocks.map((company) => {
            const isPositive = company.change.includes('+') || !company.change.includes('-');
            return (
                <div 
                    key={company.symbol} 
                    onClick={() => { setSelectedStock(company); setShares(1); setError(''); }}
                    className="p-5 flex items-center justify-between hover:border-lobus-violet transition-colors cursor-pointer bg-white dark:bg-slate-800 border border-lobus-border dark:border-slate-700 rounded-[32px] shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-lobus-bg dark:bg-slate-700 text-lobus-obsidian dark:text-white font-black text-xs border border-lobus-border dark:border-slate-600`}>
                            {company.symbol.substring(0,2)}
                        </div>
                        <div>
                            <h4 className="text-lobus-obsidian dark:text-white font-bold">{company.name}</h4>
                            <p className="text-lobus-neutral dark:text-gray-400 text-xs font-medium">{company.symbol}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lobus-obsidian dark:text-white font-bold">${company.price.toFixed(2)}</div>
                        <div className={`text-xs font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-lobus-success' : 'text-lobus-error'}`}>
                            {isPositive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                            {company.change}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Trade Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6 bg-lobus-obsidian/30 backdrop-blur-md animate-enter">
             <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-lobus-border dark:border-slate-600 p-8 pb-12 animate-slide-up shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-lobus-obsidian dark:text-white">{selectedStock.name}</h2>
                        <p className="text-lobus-neutral dark:text-gray-400 font-medium">{selectedStock.symbol} • ${selectedStock.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => { setSelectedStock(null); setTrading(null); setError(''); }} disabled={processing} className="bg-lobus-bg dark:bg-slate-700 p-3 rounded-full hover:bg-gray-200 text-lobus-obsidian dark:text-white">
                        <X size={20} />
                    </button>
                </div>

                {!trading ? (
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setTrading('SELL')}
                            className="bg-lobus-bg dark:bg-slate-700 text-lobus-obsidian dark:text-white font-bold py-6 rounded-[28px] hover:bg-gray-200 transition-colors"
                        >
                            Vender
                        </button>
                        <button 
                            onClick={() => setTrading('BUY')}
                            className="bg-lobus-cyan dark:bg-yellow-600 text-lobus-obsidian dark:text-white font-bold py-6 rounded-[28px] hover:brightness-110 transition-colors shadow-neon"
                        >
                            Comprar
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                         <div className="flex flex-col items-center">
                            <span className="text-lobus-neutral dark:text-gray-400 text-xs font-bold uppercase mb-2 tracking-wider">{trading === 'BUY' ? 'Comprar' : 'Vender'} Acciones</span>
                            <div className="flex items-center gap-6">
                                <button disabled={processing} onClick={() => setShares(Math.max(1, shares - 1))} className="w-14 h-14 rounded-full bg-lobus-bg dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-lobus-obsidian dark:text-white hover:bg-gray-200 transition-colors">-</button>
                                <span className="text-5xl font-black text-lobus-obsidian dark:text-white w-24 text-center">{shares}</span>
                                <button disabled={processing} onClick={() => setShares(shares + 1)} className="w-14 h-14 rounded-full bg-lobus-bg dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-lobus-obsidian dark:text-white hover:bg-gray-200 transition-colors">+</button>
                            </div>
                            <p className="text-lobus-violet font-bold mt-4 text-xl">Total: ${(selectedStock.price * shares).toLocaleString()}</p>
                         </div>
                         
                         {error && <div className="text-red-500 font-bold text-sm text-center flex items-center justify-center gap-2"><AlertCircle size={16}/>{error}</div>}

                         <button 
                            onClick={handleTrade}
                            disabled={processing}
                            className={`w-full font-bold py-6 rounded-[32px] shadow-lg flex items-center justify-center gap-2 ${trading === 'BUY' ? 'bg-lobus-cyan dark:bg-yellow-600 text-lobus-obsidian dark:text-white hover:brightness-110' : 'bg-lobus-error text-white hover:bg-red-600'} transition-all active:scale-95 disabled:opacity-70 disabled:scale-100`}
                        >
                             {processing ? <Loader2 className="animate-spin" /> : `Confirmar ${trading === 'BUY' ? 'Compra' : 'Venta'}`}
                        </button>
                    </div>
                )}
             </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;