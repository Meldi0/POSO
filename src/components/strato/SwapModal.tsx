import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDown, Settings2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StratoLogo } from './StratoLogo';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose }) => {
  const [payAmount, setPayAmount] = useState('0.5');
  const [payToken, setPayToken] = useState('BNB');
  const [slippage, setSlippage] = useState('11');
  const [isSwapping, setIsSwapping] = useState(false);
  const [success, setSuccess] = useState(false);

  // Price conversion formula: 1 BNB (~$580) / $0.00006574 = ~8,822,634 STRATO
  const ratePerBnb = 8822634;
  const numPay = parseFloat(payAmount) || 0;
  const receiveAmount = (numPay * (payToken === 'BNB' ? ratePerBnb : 15211)).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md rounded-3xl p-[2px] bg-gradient-to-b from-[#EC4899] via-[#8B5CF6] to-[#38BDF8] shadow-[0_0_60px_rgba(236,72,153,0.5)] z-10"
      >
        <div className="rounded-[22px] bg-[#14052e] p-6 text-white space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <StratoLogo size={32} />
              <div>
                <h3 className="font-extrabold text-base tracking-wide text-white font-sans">
                  QuickSwap dApp
                </h3>
                <span className="text-[10px] text-pink-400 font-mono">PancakeSwap V2 Router</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-purple-900/40 hover:bg-pink-600/80 text-purple-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-white">Swap Successful!</h4>
              <p className="text-xs text-purple-200/70 max-w-xs mx-auto">
                You successfully purchased <strong>{receiveAmount} $STRATO</strong> tokens via automated liquidity pool.
              </p>
            </div>
          ) : (
            <>
              {/* Pay Input Box */}
              <div className="p-4 rounded-2xl bg-[#1d0a42] border border-purple-500/20 space-y-2">
                <div className="flex justify-between text-xs text-purple-300/70 font-semibold">
                  <span>You Pay</span>
                  <span>Balance: 2.45 {payToken}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full bg-transparent text-2xl font-black text-white outline-none font-mono"
                    placeholder="0.0"
                  />
                  <select
                    value={payToken}
                    onChange={(e) => setPayToken(e.target.value)}
                    className="bg-[#2a0e5c] border border-purple-400/30 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
                  >
                    <option value="BNB">BNB (BSC)</option>
                    <option value="USDT">USDT (BEP-20)</option>
                    <option value="BUSD">BUSD</option>
                  </select>
                </div>
              </div>

              {/* Swap Divider Arrow */}
              <div className="flex justify-center -my-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 border border-white/30 flex items-center justify-center shadow-lg">
                  <ArrowDown className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Receive Output Box */}
              <div className="p-4 rounded-2xl bg-[#1d0a42] border border-purple-500/20 space-y-2">
                <div className="flex justify-between text-xs text-purple-300/70 font-semibold">
                  <span>You Receive (Estimated)</span>
                  <span className="text-pink-400 font-mono">+5% RFI Reflection</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl font-black text-white font-mono truncate">
                    {receiveAmount}
                  </span>
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl px-3 py-1.5 text-xs font-black text-white">
                    <StratoLogo size={18} />
                    <span>$STRATO</span>
                  </div>
                </div>
              </div>

              {/* Slippage & Gas Details */}
              <div className="p-3 rounded-xl bg-[#100326] border border-purple-500/15 text-[11px] space-y-1.5 text-purple-300/70">
                <div className="flex justify-between items-center">
                  <span>Slippage Tolerance:</span>
                  <div className="flex items-center gap-1">
                    {['11', '12', '15'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlippage(s)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          slippage === s
                            ? 'bg-pink-600 text-white'
                            : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'
                        }`}
                      >
                        {s}%
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-mono text-purple-200">{payToken} &gt; PancakeSwap V2 &gt; STRATO</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidity Fee:</span>
                  <span className="text-emerald-400 font-semibold">5% Automatic LP Lock</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSwap}
                disabled={isSwapping}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F43F5E] via-[#EC4899] to-[#8B5CF6] hover:from-[#E11D48] hover:to-[#7C3AED] text-white font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {isSwapping ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Routing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Swap Token Now</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
