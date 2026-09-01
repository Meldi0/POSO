import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Archive, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  ExternalLink,
  Plus,
  Compass,
  CheckCircle2,
  HardDrive,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export type DashboardViewType = 'tickets' | 'archive' | 'users' | 'datasource' | 'track';

interface SageSidebarProps {
  activeView: DashboardViewType;
  onViewChange: (view: DashboardViewType) => void;
  openTicketsCount: number;
  closedTicketsCount: number;
}

export const SageSidebar: React.FC<SageSidebarProps> = ({
  activeView,
  onViewChange,
  openTicketsCount,
  closedTicketsCount
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      id: 'tickets' as const,
      label: 'Triase Tiket Aktif',
      icon: Inbox,
      count: openTicketsCount,
      activeBg: 'bg-[#002B49]',
      activeText: 'text-white'
    },
    {
      id: 'archive' as const,
      label: 'Arsip Tiket Selesai',
      icon: Archive,
      count: closedTicketsCount,
      activeBg: 'bg-[#002B49]',
      activeText: 'text-white'
    },
    {
      id: 'track' as const,
      label: 'Lacak Status Tiket',
      icon: Compass,
      activeBg: 'bg-[#002B49]',
      activeText: 'text-white'
    },
    ...(isAdmin ? [
      {
        id: 'users' as const,
        label: 'Manajemen Pengguna',
        icon: ShieldAlert,
        activeBg: 'bg-[#002B49]',
        activeText: 'text-white'
      },
      {
        id: 'datasource' as const,
        label: 'Sumber Data Drive',
        icon: HardDrive,
        activeBg: 'bg-[#002B49]',
        activeText: 'text-white'
      }
    ] : [])
  ];

  return (
    <aside className="w-full md:w-72 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-20 shadow-xs">
      <div className="p-4 sm:p-5 space-y-4">
        {/* Brand Header */}
        <div className="pt-2 px-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onViewChange('tickets')}
            className="flex items-center gap-3 text-left cursor-pointer"
          >
            <motion.div 
              whileHover={{ rotate: 6, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#0D5C75] p-0.5 shadow-md shadow-[#002B49]/20 flex items-center justify-center shrink-0"
            >
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#002B49] to-[#0D5C75] flex items-center justify-center relative overflow-hidden border border-white/20">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <path d="M16 3L26 8V16C26 22 21.5 26.5 16 28C10.5 26.5 6 22 6 16V8L16 3Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M10 13L16 9.5L22 13L16 19L10 13Z" fill="#FFFFFF" />
                  <path d="M12 18.5L16 16L20 18.5L16 23L12 18.5Z" fill="#FFFFFF" fillOpacity="0.75" />
                  <circle cx="16" cy="16" r="2" fill="#F97316" />
                </svg>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-[#002B49] tracking-tight block leading-none">POSO</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#002B49]/10 text-[#002B49] border border-[#002B49]/25">v2.0</span>
              </div>
              <span className="text-[11px] font-bold text-[#64748B] mt-0.5 block">
                {user?.role === 'admin' ? 'Super Admin' : user?.role === 'upt' ? 'UPT Teknisi' : 'Staff Operator'}
              </span>
            </div>
          </button>
        </div>

        {/* Counter Widget */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onViewChange('tickets')}
            className={`p-2.5 rounded-xl transition-all text-left border ${
              activeView === 'tickets' 
                ? 'bg-[#002B49] text-white border-transparent shadow-md shadow-[#002B49]/20' 
                : 'bg-[#F8FAFC] hover:bg-slate-100 text-[#002B49] border-[#E2E8F0] shadow-2xs'
            }`}
          >
            <span className="text-[10px] block font-semibold opacity-85">Tiket Aktif</span>
            <span className="font-black text-base">{openTicketsCount}</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onViewChange('archive')}
            className={`p-2.5 rounded-xl transition-all text-left border ${
              activeView === 'archive' 
                ? 'bg-[#002B49] text-white border-transparent shadow-md shadow-[#002B49]/20' 
                : 'bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 border-[#E2E8F0] shadow-2xs'
            }`}
          >
            <span className="text-[10px] block font-semibold opacity-85">Arsip Selesai</span>
            <span className="font-black text-base">{closedTicketsCount}</span>
          </motion.button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-3.5 block mb-1">
            Menu Operasional
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? `${item.activeBg} ${item.activeText} shadow-sm shadow-[#002B49]/20`
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Quick Nav Shortcut */}
        <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-3.5 block mb-1">
            Aksi Formulir
          </span>

          <Link
            to="/submit"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#64748B]" />
            <span>Formulir Tiket Baru</span>
          </Link>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-1 bg-[#F8FAFC]">
        <Link
          to="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-white hover:text-slate-900 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Beranda Utama POSO</span>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};
