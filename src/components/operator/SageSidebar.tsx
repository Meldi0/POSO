import React from 'react';
import { 
  Inbox, 
  Archive, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  ExternalLink,
  Zap,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SageSidebarProps {
  activeView: 'tickets' | 'archive' | 'users' | 'datasource';
  onViewChange: (view: 'tickets' | 'archive' | 'users' | 'datasource') => void;
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
      activeBg: 'bg-[#0D5C75]',
      activeText: 'text-white'
    },
    {
      id: 'archive' as const,
      label: 'Arsip Tiket Selesai',
      icon: Archive,
      count: closedTicketsCount,
      activeBg: 'bg-[#199FB1]',
      activeText: 'text-white'
    },
    ...(isAdmin ? [
      {
        id: 'users' as const,
        label: 'Kelola Staf & UPT',
        icon: ShieldAlert,
        activeBg: 'bg-[#0D5C75]',
        activeText: 'text-white'
      },
      {
        id: 'datasource' as const,
        label: 'Sumber Data Drive',
        icon: HardDrive,
        activeBg: 'bg-[#0D5C75]',
        activeText: 'text-white'
      }
    ] : [])
  ];

  return (
    <aside className="w-full md:w-72 bg-white/85 backdrop-blur-2xl border-r border-slate-200/80 flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-20 shadow-[4px_0_30px_rgba(0,0,0,0.03)]">
      <div className="p-4 sm:p-5 space-y-4">
        {/* Brand Header with Executive Custom Emblem */}
        <div className="pt-2 px-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 8, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#083342] via-[#0D5C75] to-[#199FB1] p-0.5 shadow-lg shadow-[#0D5C75]/25 flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#0D5C75] to-[#083342] flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <defs>
                    <linearGradient id="posoWing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                    <linearGradient id="posoCore" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F58A61" />
                      <stop offset="100%" stopColor="#E77448" />
                    </linearGradient>
                  </defs>
                  {/* Outer Modern Hexagon Shield */}
                  <path d="M16 2.5L27 8.5V17C27 23.8 22.2 28.3 16 30C9.8 28.3 5 23.8 5 17V8.5L16 2.5Z" fill="url(#posoWing)" fillOpacity="0.25" stroke="url(#posoWing)" strokeWidth="1.2" />
                  {/* Dynamic Speed Wings */}
                  <path d="M10 12.5L16 9.5L22 12.5L16 18.5L10 12.5Z" fill="#FFFFFF" />
                  <path d="M12 18L16 15.5L20 18L16 23L12 18Z" fill="#FFFFFF" fillOpacity="0.75" />
                  {/* Energy Core Dot */}
                  <circle cx="16" cy="15.5" r="2.2" fill="url(#posoCore)" />
                </svg>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-[#0D5C75] tracking-tight block leading-none">POSO</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#F58A61]/15 text-[#E77448] border border-[#F58A61]/30">v2.0</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Helpdesk Workstation</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3.5 apple-glass-card rounded-2xl flex items-center justify-between border border-slate-200/90 shadow-xs">
          <div className="min-w-0 pr-2">
            <h3 className="font-extrabold text-xs text-slate-900 truncate">
              {user?.name || 'Operator Helpdesk'}
            </h3>
            <p className="text-[10px] text-[#0D5C75] font-bold capitalize truncate mt-0.5">
              {user?.role === 'admin' ? 'Super Admin' : user?.role === 'upt' ? `UPT ${user.upt_unit}` : 'Staff Operator'}
            </p>
          </div>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onViewChange('tickets')}
            className={`p-2.5 rounded-xl transition-all text-left border ${
              activeView === 'tickets' 
                ? 'bg-gradient-to-br from-[#0D5C75] to-[#148797] text-white border-transparent shadow-md shadow-[#0D5C75]/20' 
                : 'bg-white/60 hover:bg-white text-[#0D5C75] border-slate-200/80 shadow-xs'
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
                ? 'bg-gradient-to-br from-[#199FB1] to-[#0D5C75] text-white border-transparent shadow-md shadow-[#199FB1]/20' 
                : 'bg-white/60 hover:bg-white text-slate-700 border-slate-200/80 shadow-xs'
            }`}
          >
            <span className="text-[10px] block font-semibold opacity-85">Arsip Selesai</span>
            <span className="font-black text-base">{closedTicketsCount}</span>
          </motion.button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? `${item.activeBg} ${item.activeText} shadow-md shadow-[#0D5C75]/15`
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
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
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-100/80 space-y-1 bg-white/40">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>Portal Publik Pelapor</span>
        </a>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/80 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};
