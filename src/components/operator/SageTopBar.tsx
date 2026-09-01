import React from 'react';
import { 
  Search, 
  Plus, 
  Columns3, 
  Table2, 
  Filter, 
  RefreshCw,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SageTopBarProps {
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
  onOpenCreateTicket
}) => {
  const categories = [
    'Semua Kategori',
    'Jaringan & Internet',
    'Sarana & Prasarana',
    'Layanan Akun & Portal',
    'Hardware & Komputer',
    'Sistem Informasi & Aplikasi',
    'Layanan Umum & Konsultasi'
  ];

  const dateFilterOptions = [
    { label: 'Semua Waktu', value: 'all' },
    { label: 'Hari Ini', value: 'today' },
    { label: '7 Hari', value: '7days' },
    { label: 'Bulan Ini', value: 'month' }
  ];

  return (
    <div className="apple-glass p-3 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
      {/* Left Filter & View Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none pl-8 pr-7 py-2 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] cursor-pointer transition-all shadow-xs"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-[#0D5C75] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Daily Date Filter */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="appearance-none pl-8 pr-7 py-2 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] cursor-pointer transition-all shadow-xs"
          >
            {dateFilterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Calendar className="w-3.5 h-3.5 text-[#0D5C75] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Apple Segmented Control Toggle (Kanban vs Table) */}
        <div className="relative flex items-center bg-slate-200/50 p-1 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`relative z-10 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'kanban' ? 'text-[#0D5C75]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Papan</span>
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
            <span className="hidden sm:inline">Tabel</span>
            {viewMode === 'table' && (
              <motion.div
                layoutId="activeViewTab"
                className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Refresh Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title="Segarkan Data"
          className="p-2 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 text-slate-600 transition-all shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0D5C75]' : ''}`} />
        </motion.button>
      </div>

      {/* Right Search & Action */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 md:w-72">
          <input
            type="text"
            placeholder="Cari ID, subjek, pelapor... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onOpenCreateTicket}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,92,117,0.25)] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tiket Baru</span>
        </motion.button>
      </div>
    </div>
  );
};
