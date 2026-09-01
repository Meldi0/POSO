import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldAlert, FileText } from 'lucide-react';
import { StratoLogo } from './StratoLogo';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-2xl rounded-3xl p-[2px] bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#38BDF8] shadow-[0_0_60px_rgba(236,72,153,0.5)] z-10 max-h-[85vh] flex flex-col"
      >
        <div className="rounded-[22px] bg-[#12042a] p-6 sm:p-8 text-white flex flex-col h-full overflow-y-auto space-y-6">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <StratoLogo size={36} />
              <div>
                <h3 className="font-black text-lg tracking-wide text-white uppercase font-sans">
                  {isTerms ? 'Terms of Service' : 'Privacy Policy'}
                </h3>
                <span className="text-xs text-pink-400 font-mono">Strato Protocol Decentralized Network</span>
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

          <div className="text-xs sm:text-sm text-purple-200/80 leading-relaxed space-y-4">
            {isTerms ? (
              <>
                <p>
                  <strong>1. Protocol Decentralization:</strong> Strato Protocol is an open-source decentralized smart contract deployed on the Binance Smart Chain. Interacting with the protocol is completely voluntary and governed strictly by autonomous code.
                </p>
                <p>
                  <strong>2. Risk Disclosure:</strong> DeFi cryptocurrency investments carry inherent market risks. Token values fluctuate organically based on liquidity pools and market volume. Users are solely responsible for verifying contract addresses and managing their own non-custodial crypto wallets.
                </p>
                <p>
                  <strong>3. No Financial Advice:</strong> Content on this website is for informational and educational purposes only and does not constitute financial, investment, or legal advice.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>1. Zero Personal Data Collection:</strong> Strato Protocol does not collect, sell, or store your personal identifiers, names, phone numbers, or private keys.
                </p>
                <p>
                  <strong>2. On-Chain Transparency:</strong> All transactions executed via decentralized exchanges are recorded on the public Binance Smart Chain ledger and are publicly viewable via blockchain explorers like BscScan.
                </p>
                <p>
                  <strong>3. Web3 Wallet Connections:</strong> Connecting your Web3 wallet (e.g. MetaMask, Trust Wallet) communicates directly with your browser extension without storing credentials on any central server.
                </p>
              </>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Understood
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
