import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Zap, Lock, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { StratoLogo } from './StratoLogo';

interface WhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ isOpen, onClose }) => {
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

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-3xl rounded-3xl p-[2px] bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#38BDF8] shadow-[0_0_60px_rgba(236,72,153,0.5)] z-10 max-h-[85vh] flex flex-col"
      >
        <div className="rounded-[22px] bg-[#12042a] p-6 sm:p-8 text-white flex flex-col h-full overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <StratoLogo size={40} />
              <div>
                <h3 className="font-black text-xl tracking-wide text-white font-sans">
                  STRATO PROTOCOL WHITEPAPER
                </h3>
                <span className="text-xs text-pink-400 font-mono">Version 2.0 • Decentralized Automated Liquidity</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-purple-900/40 hover:bg-pink-600 text-purple-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-pink-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              1. Executive Summary & Philosophy
            </h4>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              Strato Protocol is built upon the premise that traditional DeFi tokens suffer from severe impermanent loss and sudden liquidity draining. Strato solves this via a mathematically-backed automatic liquidity acquisition mechanism and static reflection rewards designed to reward long-term community holders while perpetually deepening the liquidity floor.
            </p>
          </div>

          {/* Section 2: Tokenomics Mechanism (10% Tax Breakdown) */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-pink-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              2. Transaction Tax Architecture (10% Total)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#1d0743] border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">5% Auto-Liquidity Pool</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    5%
                  </span>
                </div>
                <p className="text-xs text-purple-300/70 leading-relaxed">
                  Automatically splits the tax into BNB and STRATO, pairing them and locking them permanently into PancakeSwap V2 Liquidity Pool.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1d0743] border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">5% Static RFI Reflection</span>
                  <span className="text-xs font-mono font-bold text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded">
                    5%
                  </span>
                </div>
                <p className="text-xs text-purple-300/70 leading-relaxed">
                  Distributed immediately to all existing token holders without staking fees, gas costs, or custodial lockups.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Security & Audits */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-pink-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              3. Security Guarantee & Anti-Whale Protection
            </h4>
            <div className="p-4 rounded-2xl bg-[#170536] border border-purple-500/20 space-y-2.5 text-xs text-purple-200/80">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>LP Tokens Burnt & Ownership Renounced</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Max Transaction Cap (0.5% of Total Supply)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audited by CertiK & Solidity Finance</span>
              </div>
            </div>
          </div>

          {/* Download PDF Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Close Whitepaper
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
