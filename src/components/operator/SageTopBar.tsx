import React, { useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Columns3, 
  Table2, 
  Filter, 
  RefreshCw,
  Calendar,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface SageTopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  dateFilter: string;
  onDateFilterChange: (df: string) => void;
  viewMode: 'kanban' | 'table';
  onViewModeChange: (vm: 'kanban' | 'table') => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenCreateTicket: () => void;
  onToggleMobileMenu?: () => void;
  onTrackClick?: () => void;
}

export const SageTopBar: React.FC<SageTopBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  dateFilter,
  onDateFilterChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isLoading,
  onOpenCreateTicket,
  onToggleMobileMenu,
  onTrackClick
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Semua Kategori',
    'Pengendalian Operasi',
    'Corporate General Services (CGS)',
    'Postal Security',
    'Quality Control',
    'IT & Sistem Informasi',
    'Jaringan & Internet',
    'Sarana & Prasarana',
    'Layanan Akun & Portal',
    'Hardware & Komputer'
  ];

  const dateFilterOptions = [
    { label: 'Semua Waktu', value: 'all' },
    { label: 'Hari Ini', value: 'today' },
    { label: '7 Hari Terakhir', value: '7days' },
    { label: 'Bulan Ini', value: 'month' }
  ];

  // Shortcut Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="apple-glass p-3 rounded-2xl flex flex-col gap-3 shadow-xs">
      {/* Top Row: Mobile Hamburger, Search Bar & Main Action Buttons */}
      <div className="flex items-center justify-between gap-2.5">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs shrink-0"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5 text-[#0D5C75]" />
        </button>

        {/* Global Search Input */}
        <div className="relative flex-1">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Cari ID, subjek, pelapor... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/75 hover:bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 1-Click Lacak Status Tiket Nav Button */}
        {onTrackClick && (
          <button
            type="button"
            onClick={onTrackClick}
            title="Buka Pelacak Tiket Terpadu"
            className="hidden sm:flex px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-[#0D5C75] text-xs font-bold transition-all items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#0D5C75]" />
            <span>Lacak Tiket</span>
          </button>
        )}

        {/* View Mode Toggle for Desktop */}
        <div className="hidden sm:flex items-center bg-slate-200/50 p-1 rounded-xl border border-slate-200/60 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`relative z-10 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'kanban' ? 'text-[#0D5C75]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Papan</span>
            {viewMode === 'kanban' && (
              <motion.div
                layoutId="activeViewTab"
                className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`relative z-10 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'table' ? 'text-[#0D5C75]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Tabel</span>
            {viewMode === 'table' && (
              <motion.div
                layoutId="activeViewTab"
                className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Create Ticket Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onOpenCreateTicket}
          className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,92,117,0.25)] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Tiket Baru</span>
        </motion.button>
      </div>

      {/* Bottom Row: Filters (Category, Date Range, Mobile Segmented Control, Refresh) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Category Dropdown Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-8 pr-7 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] cursor-pointer transition-all shadow-xs"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-[#0D5C75] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-8 pr-7 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] cursor-pointer transition-all shadow-xs"
            >
              {dateFilterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-[#0D5C75] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Segarkan Data"
            className="p-2 rounded-xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-600 transition-all shadow-xs disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0D5C75]' : ''}`} />
          </motion.button>
        </div>

        {/* View Mode Toggle for Mobile */}
        <div className="sm:hidden flex items-center bg-slate-200/50 p-0.5 rounded-xl border border-slate-200/60 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'kanban' ? 'bg-white text-[#0D5C75] shadow-xs' : 'text-slate-500'
            }`}
            title="Tampilan Papan"
          >
            <Columns3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'table' ? 'bg-white text-[#0D5C75] shadow-xs' : 'text-slate-500'
            }`}
            title="Tampilan Tabel"
          >
            <Table2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
