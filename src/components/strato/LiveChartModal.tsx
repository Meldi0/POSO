import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, BarChart3, Activity, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { StratoLogo } from './StratoLogo';

interface LiveChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChartModal: React.FC<LiveChartModalProps> = ({ isOpen, onClose }) => {
  const [timeframe, setTimeframe] = useState('24H');

  const recentTransactions = [
    { type: 'BUY', price: '$0.00006582', amount: '12,500,000 STRATO', bnb: '1.42 BNB', time: '12s ago' },
    { type: 'BUY', price: '$0.00006579', amount: '8,200,000 STRATO', bnb: '0.93 BNB', time: '34s ago' },
    { type: 'SELL', price: '$0.00006571', amount: '3,100,000 STRATO', bnb: '0.35 BNB', time: '1m ago' },
    { type: 'BUY', price: '$0.00006574', amount: '25,000,000 STRATO', bnb: '2.84 BNB', time: '2m ago' },
    { type: 'BUY', price: '$0.00006568', amount: '45,000,000 STRATO', bnb: '5.10 BNB', time: '3m ago' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-4xl rounded-3xl p-[2px] bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] shadow-[0_0_60px_rgba(236,72,153,0.45)] z-10 max-h-[90vh] flex flex-col"
      >
        <div className="rounded-[22px] bg-[#12042a] p-6 text-white flex flex-col h-full overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <StratoLogo size={36} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg tracking-wide text-white">
                    STRATO / WBNB
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    +14.8% (24h)
                  </span>
                </div>
                <span className="text-xs text-purple-300/60 font-mono">DEXScreener / PancakeSwap Pool</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Timeframe Selector */}
              <div className="hidden sm:flex items-center bg-[#1d0743] rounded-xl p-1 border border-purple-500/30 text-xs font-bold">
                {['1H', '24H', '7D', '30D', 'ALL'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      timeframe === tf ? 'bg-pink-600 text-white shadow' : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-purple-900/40 hover:bg-pink-600 text-purple-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Chart Visual Display */}
          <div className="rounded-2xl bg-[#1a073d] border border-purple-500/20 p-5 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-black text-white font-mono">$0.00006574</div>
                <div className="text-xs text-purple-300/70 mt-0.5">High: $0.00006820 • Low: $0.00005710</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-purple-300/70 uppercase">24H Volume</div>
                <div className="text-lg font-extrabold text-pink-400 font-mono">$18,492,100</div>
              </div>
            </div>

            {/* Custom SVG Candlestick / Growth Chart Visual */}
            <div className="relative w-full h-56 rounded-xl bg-[#110328] border border-purple-500/20 p-4 flex items-end justify-between overflow-hidden">
              {/* Ambient Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

              {/* Glowing SVG Area Curve */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 130 Q50 120 100 110 T200 95 T300 70 T400 45 T500 20 L500 150 L0 150 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M0 130 Q50 120 100 110 T200 95 T300 70 T400 45 T500 20"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="3.5"
                  className="drop-shadow-[0_0_12px_#EC4899]"
                />
                {/* Glowing Pulse Dot at end of curve */}
                <circle cx="500" cy="20" r="5" fill="#FFFFFF" className="animate-ping" />
                <circle cx="500" cy="20" r="4" fill="#F43F5E" />
              </svg>

              {/* Volume Bars at Bottom */}
              <div className="relative z-10 w-full flex items-end justify-between gap-1 opacity-70">
                {[30, 45, 25, 60, 80, 50, 65, 90, 75, 110, 85, 120, 95, 140, 130, 160].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h * 0.35}px` }}
                    className={`flex-1 rounded-t ${
                      i % 3 === 0 ? 'bg-emerald-400/80 shadow-[0_0_6px_#34D399]' : 'bg-pink-500/80 shadow-[0_0_6px_#EC4899]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Live Order Book / Trades Stream */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-400 animate-pulse" />
                Live Swaps & DEX Liquidity Trades
              </h4>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Realtime Stream
              </span>
            </div>

            <div className="rounded-xl bg-[#180638] border border-purple-500/20 divide-y divide-purple-500/10 overflow-hidden text-xs font-mono">
              {recentTransactions.map((tx, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-purple-900/20 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded font-black text-[10px] ${
                        tx.type === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                      }`}
                    >
                      {tx.type}
                    </span>
                    <span className="text-white font-bold">{tx.price}</span>
                  </div>

                  <span className="text-purple-200/80 hidden sm:inline">{tx.amount}</span>
                  <span className="text-pink-300 font-semibold">{tx.bnb}</span>
                  <span className="text-purple-400/60 text-[11px]">{tx.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
