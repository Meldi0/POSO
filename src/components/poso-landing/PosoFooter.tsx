import React from 'react';
import { PosoBrandLogo } from './PosoBrandLogo';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, FileText, ArrowUpRight } from 'lucide-react';

interface PosoFooterProps {
  onOpenSlaGuide?: () => void;
  onOpenSopGuide?: () => void;
}

export const PosoFooter: React.FC<PosoFooterProps> = ({
  onOpenSlaGuide,
  onOpenSopGuide,
}) => {
  return (
    <footer className="relative w-full border-t border-transparent pt-12 pb-16 bg-[#0c021f]">
      {/* Top Rainbow Neon Gradient Divider Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] shadow-[0_0_15px_rgba(236,72,153,0.5)]" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start justify-between">
          {/* Left Column: POSO Identity & Mission */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <PosoBrandLogo size={46} showText={true} />
            </div>

            <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed max-w-2xl font-normal">
              POSO (Pusat Layanan Terpadu & Helpdesk) adalah sistem manajemen tiket terpadu berbasis Google Workspace yang menghubungkan seluruh sivitas dan pelanggan dengan Unit Pelaksana Teknis (UPT TI, Sarpras, & Sistem) secara transparan, terukur, dan berstandar SLA tinggi.
            </p>

            <div className="pt-2 text-[11px] text-purple-400/60 font-mono tracking-wider">
              POSO HELPDESK SYSTEM © 2026 • PT POS INDONESIA (PERSERO) • ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Right Column: Operational Info & Policy Links */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-between space-y-6">
            {/* Operational Info */}
            <div className="p-4 rounded-2xl bg-[#170536] border border-purple-500/20 text-xs text-purple-200/80 space-y-2 text-left w-full sm:w-auto">
              <div className="font-extrabold text-white uppercase text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Jam Layanan Operasional Triase</span>
              </div>
              <div className="text-[11px] text-purple-300/70 space-y-0.5 font-mono">
                <div>Senin – Jumat: 08.00 – 16.00 WIB</div>
                <div>Laporan darurat di luar jam kerja tetap diproses oleh teknisi on-call.</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-purple-300/80 uppercase tracking-wider">
              <Link to="/submit" className="hover:text-pink-300 transition-colors">
                BUAT TIKET
              </Link>
              <span className="text-purple-600">•</span>
              <Link to="/track" className="hover:text-pink-300 transition-colors">
                LACAK TIKET
              </Link>
              <span className="text-purple-600">•</span>
              <button
                type="button"
                onClick={onOpenSlaGuide}
                className="hover:text-pink-300 transition-colors"
              >
                KEBIJAKAN SLA
              </button>
              <span className="text-purple-600">•</span>
              <Link to="/login" className="hover:text-pink-300 transition-colors text-pink-400 flex items-center gap-1">
                <span>PORTAL STAF</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
