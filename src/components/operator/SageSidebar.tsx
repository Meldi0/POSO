import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Archive, 
  ShieldAlert, 
  LogOut, 
  ExternalLink,
  HardDrive,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export type DashboardViewType = 'tickets' | 'archive' | 'users' | 'datasource' | 'track';

export interface SageSidebarProps {
  activeView: DashboardViewType;
  onViewChange: (view: DashboardViewType) => void;
  openTicketsCount: number;
  closedTicketsCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SageSidebar: React.FC<SageSidebarProps> = ({
  activeView,
  onViewChange,
  openTicketsCount,
  closedTicketsCount,
  isMobileOpen = false,
  onCloseMobile = () => {},
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      id: 'tickets' as const,
      label: 'Triase Tiket Aktif',
      shortLabel: 'Aktif',
      icon: Inbox,
      count: openTicketsCount,
      activeBg: 'bg-[#0D5C75]',
      activeText: 'text-white'
    },
    {
      id: 'archive' as const,
      label: 'Arsip Tiket Selesai',
      shortLabel: 'Arsip',
      icon: Archive,
      count: closedTicketsCount,
      activeBg: 'bg-[#199FB1]',
      activeText: 'text-white'
    },
    {
      id: 'track' as const,
      label: 'Lacak Status Tiket',
      shortLabel: 'Lacak',
      icon: Compass,
      activeBg: 'bg-[#0D5C75]',
      activeText: 'text-white'
    },
    ...(isAdmin ? [
      {
        id: 'users' as const,
        label: 'Kelola Staf & UPT',
        shortLabel: 'Staf',
        icon: ShieldAlert,
        activeBg: 'bg-[#0D5C75]',
        activeText: 'text-white'
      },
      {
        id: 'datasource' as const,
        label: 'Sumber Data Drive',
        shortLabel: 'Drive',
        icon: HardDrive,
        activeBg: 'bg-[#0D5C75]',
        activeText: 'text-white'
      }
    ] : [])
  ];

  const handleSelectTab = (id: DashboardViewType) => {
    onViewChange(id);
    onCloseMobile();
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full p-4 sm:p-5">
      <div className="space-y-4">
        {/* Brand Header with POSO Emblem & Close button for mobile */}
        <div className="pt-1 px-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleSelectTab('tickets')}
            className="flex items-center gap-3 text-left cursor-pointer"
          >
            <motion.div 
              whileHover={{ rotate: 8, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#083342] via-[#0D5C75] to-[#199FB1] p-0.5 shadow-lg shadow-[#0D5C75]/25 flex items-center justify-center cursor-pointer shrink-0"
            >
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#0D5C75] to-[#083342] flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                  <defs>
                    <linearGradient id="posoWingSide" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                    <linearGradient id="posoCoreSide" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F58A61" />
                      <stop offset="100%" stopColor="#E77448" />
                    </linearGradient>
                  </defs>
                  <path d="M16 2.5L27 8.5V17C27 23.8 22.2 28.3 16 30C9.8 28.3 5 23.8 5 17V8.5L16 2.5Z" fill="url(#posoWingSide)" fillOpacity="0.25" stroke="url(#posoWingSide)" strokeWidth="1.2" />
                  <path d="M10 12.5L16 9.5L22 12.5L16 18.5L10 12.5Z" fill="#FFFFFF" />
                  <path d="M12 18L16 15.5L20 18L16 23L12 18Z" fill="#FFFFFF" fillOpacity="0.75" />
                  <circle cx="16" cy="15.5" r="2.2" fill="url(#posoCoreSide)" />
                </svg>
              </div>
            </motion.div>
            {(!isCollapsed || isMobile) && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg text-[#0D5C75] tracking-tight block leading-none">POSO</span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#F58A61]/15 text-[#E77448] border border-[#F58A61]/30">v2.0</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block truncate">Helpdesk Workstation</span>
              </div>
            )}
          </button>

          {isMobile ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          ) : null}
        </div>

        {/* User Card */}
        {(!isCollapsed || isMobile) && (
          <div className="p-3 apple-glass-card rounded-2xl flex items-center justify-between border border-slate-200/90 shadow-xs">
            <div className="min-w-0 pr-2">
              <h3 className="font-extrabold text-xs text-slate-900 truncate">
                {user?.name || 'Operator Helpdesk'}
              </h3>
              <p className="text-[10px] text-[#0D5C75] font-bold capitalize truncate mt-0.5">
                {user?.role === 'admin' ? 'Super Admin' : user?.role === 'upt' ? `UPT ${user.upt_unit}` : 'Staff Operator'}
              </p>
            </div>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        )}

        {/* Quick Stats Cards */}
        {(!isCollapsed || isMobile) && (
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => handleSelectTab('tickets')}
              className={`p-2.5 rounded-xl transition-all text-left border ${
                activeView === 'tickets' 
                  ? 'bg-gradient-to-br from-[#0D5C75] to-[#148797] text-white border-transparent shadow-md shadow-[#0D5C75]/20' 
                  : 'bg-white/70 hover:bg-white text-[#0D5C75] border-slate-200/80 shadow-xs'
              }`}
            >
              <span className="text-[10px] block font-semibold opacity-85">Tiket Aktif</span>
              <span className="font-black text-base">{openTicketsCount}</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => handleSelectTab('archive')}
              className={`p-2.5 rounded-xl transition-all text-left border ${
                activeView === 'archive' 
                  ? 'bg-gradient-to-br from-[#199FB1] to-[#0D5C75] text-white border-transparent shadow-md shadow-[#199FB1]/20' 
                  : 'bg-white/70 hover:bg-white text-slate-700 border-slate-200/80 shadow-xs'
              }`}
            >
              <span className="text-[10px] block font-semibold opacity-85">Arsip Selesai</span>
              <span className="font-black text-base">{closedTicketsCount}</span>
            </motion.button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: isCollapsed && !isMobile ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                title={item.label}
                className={`relative w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? `${item.activeBg} ${item.activeText} shadow-md shadow-[#0D5C75]/15`
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {(!isCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </div>
                {(!isCollapsed || isMobile) && item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Quick Nav Shortcut to Submit Ticket */}
        {(!isCollapsed || isMobile) && (
          <div className="pt-2 border-t border-slate-200/60">
            <Link
              to="/submit"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#0D5C75]" />
              <span>Formulir Tiket Baru</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-200/60 space-y-1.5">
        <Link
          to="/"
          className={`w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center p-2' : 'gap-2 px-3 py-2'} rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors`}
          title="Beranda Utama POSO"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {(!isCollapsed || isMobile) && <span>Beranda Utama</span>}
        </Link>

        <button
          type="button"
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center p-2' : 'gap-2 px-3 py-2'} rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/80 transition-colors`}
          title="Keluar Sesi"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {(!isCollapsed || isMobile) && <span>Keluar Sesi</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sticky Sidebar */}
      <aside className={`hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto z-20 bg-white/85 backdrop-blur-2xl border-r border-slate-200/80 shadow-[4px_0_30px_rgba(0,0,0,0.03)] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}>
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Slide-Over Drawer with Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white z-50 md:hidden shadow-2xl overflow-y-auto"
            >
              {renderSidebarContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
