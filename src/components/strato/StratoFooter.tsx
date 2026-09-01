import React from 'react';
import { StratoLogo } from './StratoLogo';
import { Twitter, Send, Disc as Discord, Facebook, Share2, FileText, Shield, ExternalLink } from 'lucide-react';

interface StratoFooterProps {
  onOpenWhitepaper?: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const StratoFooter: React.FC<StratoFooterProps> = ({
  onOpenWhitepaper,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <footer className="relative w-full border-t border-transparent pt-12 pb-16 bg-[#0c021f]">
      {/* Top Rainbow Neon Gradient Divider Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] shadow-[0_0_15px_rgba(236,72,153,0.5)]" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start justify-between">
          {/* Left Column: Logo & Protocol Statement */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-3">
              <StratoLogo size={46} />
              <span className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-sans">
                Strato Protocol
              </span>
            </div>

            <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed max-w-2xl font-normal">
              Strato Protocol is a Secure, Fully Decentralized, Community-Oriented DeFi Platform Powered By Advanced Algorithms Generating Automated Liquidity. Our Dedication To Fairness And Transparency Is Guaranteed To Keep Strato Protocol A Democratic, Inclusive And Profitable Ecosystem.
            </p>

            <div className="pt-2 text-[11px] text-purple-400/60 font-mono tracking-wider">
              COPYRIGHT © 2021/2026 STRATO PROTOCOL LLC. ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Right Column: Social Media Icons & Legal Policy Links */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between space-y-8">
            {/* Social Icons in Small Circles */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#1e0741] hover:bg-[#F43F5E] border border-purple-500/30 hover:border-pink-400 text-pink-300 hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-4 h-4" />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-10 h-10 rounded-full bg-[#1e0741] hover:bg-[#38BDF8] border border-purple-500/30 hover:border-sky-400 text-purple-300 hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Send className="w-4 h-4 -translate-x-0.5" />
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-[#1e0741] hover:bg-[#8B5CF6] border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-4 h-4" />
              </a>

              {/* Discord / Forum */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-10 h-10 rounded-full bg-[#1e0741] hover:bg-[#6366F1] border border-purple-500/30 hover:border-indigo-400 text-purple-300 hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Discord className="w-4 h-4" />
              </a>

              {/* Reddit / Medium */}
              <a
                href="https://reddit.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Medium"
                className="w-10 h-10 rounded-full bg-[#1e0741] hover:bg-[#EC4899] border border-purple-500/30 hover:border-pink-400 text-purple-300 hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>

            {/* Bottom Right Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-purple-300/80 uppercase tracking-wider">
              <button
                type="button"
                onClick={onOpenTerms}
                className="hover:text-pink-300 transition-colors"
              >
                TERMS OF SERVICE
              </button>
              <span className="text-purple-600">•</span>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="hover:text-pink-300 transition-colors"
              >
                PRIVACY POLICY
              </button>
              <span className="text-purple-600">•</span>
              <button
                type="button"
                onClick={onOpenWhitepaper}
                className="hover:text-pink-300 transition-colors"
              >
                WHITEPAPER
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
