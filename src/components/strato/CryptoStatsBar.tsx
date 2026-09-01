import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Copy, Check } from 'lucide-react';

export const CryptoStatsBar: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [price, setPrice] = useState('$0.00006574');
  const [isPriceUp, setIsPriceUp] = useState(true);

  // Contract address for Strato Protocol
  const tokenContract = '0x7e29a391c498bb892c2b3d1624b5d259c417937a';

  const copyAddress = () => {
    navigator.clipboard.writeText(tokenContract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Subtle live crypto price fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const base = 0.00006574;
      const delta = (Math.random() - 0.48) * 0.0000003;
      const newPrice = Math.max(0.00006, base + delta);
      setIsPriceUp(delta >= 0);
      setPrice(`$${newPrice.toFixed(8)}`);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      id: 'price',
      value: price,
      label: 'CURRENT PRICE',
      highlight: true,
      subtext: '+14.8% (24h)',
    },
    {
      id: 'supply',
      value: '586,743,211,911',
      label: 'SUPPLY',
      highlight: false,
      subtext: 'Deflationary',
    },
    {
      id: 'marketcap',
      value: '$3,857,249,375',
      label: 'MARKET CAP',
      highlight: false,
      subtext: 'Diluted Valuation',
    },
    {
      id: 'liquidity',
      value: '$313,143,725',
      label: 'LIQUIDITY',
      highlight: false,
      subtext: '100% Locked 5 Yrs',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Outer Card with Neon Multi-gradient Border */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl p-[1.8px] bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#A855F7] shadow-[0_0_40px_rgba(236,72,153,0.3)] group"
      >
        {/* Glow backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#A855F7] rounded-3xl blur-md opacity-40 group-hover:opacity-65 transition-opacity pointer-events-none" />

        {/* Card Body */}
        <div className="relative rounded-[22px] bg-[#12052b]/95 backdrop-blur-xl px-6 sm:px-10 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((stat, index) => (
              <div 
                key={stat.id} 
                className={`flex flex-col items-center justify-center text-center ${index > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight font-sans">
                    {stat.value}
                  </span>
                  {stat.highlight && (
                    <TrendingUp className={`w-4 h-4 ${isPriceUp ? 'text-emerald-400' : 'text-rose-400'} transition-colors animate-pulse`} />
                  )}
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-purple-200/60">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Contract Copy Ribbon */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-300/70 font-mono text-[11px] sm:text-xs">
              <span className="text-pink-400 font-bold">BEP-20 Contract:</span>
              <span className="truncate max-w-[200px] sm:max-w-[320px] bg-black/40 px-2.5 py-1 rounded-lg border border-purple-500/20 text-white/90">
                {tokenContract}
              </span>
              <button
                type="button"
                onClick={copyAddress}
                className="p-1.5 rounded-lg bg-purple-900/60 hover:bg-pink-600/80 border border-purple-400/30 text-white transition-all flex items-center gap-1 text-[11px] font-sans"
                title="Copy Contract Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-purple-300/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Oracle Feed
              </span>
              <span>•</span>
              <span className="text-amber-300/90 font-mono">10% Slippage Recommended</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
