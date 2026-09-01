import React from 'react';
import { 
  Search, 
  Menu, 
  RefreshCw, 
  Download, 
  LayoutGrid, 
  TableIcon, 
  Filter, 
  Compass, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { DashboardViewType } from './SageSidebar';

interface SageTopBarProps {
  onMobileMenuToggle?: () => void;
  onOpenCommandPalette?: () => void;
  activeView: DashboardViewType;
  onViewChange: (view: DashboardViewType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (st: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onNewTicketClick?: () => void;
  isSyncing?: boolean;
}

export const SageTopBar: React.FC<SageTopBarProps> = ({
  onMobileMenuToggle,
  onOpenCommandPalette,
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
  onExport,
  onNewTicketClick,
  isSyncing = false
}) => {
  return (
    <header className="h-16 px-4 lg:px-6 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-3 sticky top-0 z-20 flex-shrink-0">
      
      {/* Left: Mobile Toggle & Command Palette Trigger */}
      <div className="flex items-center gap-2.5 flex-1 max-w-lg">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-[8px] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
            title="Buka Menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Command Palette Trigger Button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center gap-2.5 h-9.5 px-3 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] text-left hover:border-[#199FB1]/60 hover:bg-[#EAF4F8]/40 transition-all group cursor-pointer"
        >
          <Search size={15} className="text-[#94A3B8] group-hover:text-[#199FB1] flex-shrink-0 transition-colors" />
          <span className="flex-1 text-[13px] text-[#94A3B8] truncate">
            Cari tiket, ID, atau aksi cepat...
          </span>
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded-[4px] bg-white border border-[#CBD5E1] text-[10px] font-bold text-[#64748B] shadow-2xs font-mono">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded-[4px] bg-white border border-[#CBD5E1] text-[10px] font-bold text-[#64748B] shadow-2xs font-mono">K</kbd>
          </div>
        </button>
      </div>

      {/* Right: View Switcher (Kanban vs Table) & Actions */}
      <div className="flex items-center gap-2">
        {/* Segmented View Switcher */}
        <div className="hidden sm:flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-1 gap-1">
          <button
            type="button"
            onClick={() => onViewChange('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-bold transition-all cursor-pointer ${
              activeView === 'kanban'
                ? 'bg-[#0D5C75] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LayoutGrid size={13} />
            <span>Kanban</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-bold transition-all cursor-pointer ${
              activeView === 'table'
                ? 'bg-[#0D5C75] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <TableIcon size={13} />
            <span>Tabel</span>
          </button>
        </div>

        {/* Sync Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isSyncing}
          className="flex items-center gap-1.5 h-9.5 px-3 rounded-[10px] border border-[#E2E8F0] text-[12px] font-semibold text-[#64748B] bg-white hover:bg-[#F1F5F9] transition-colors cursor-pointer disabled:opacity-50"
          title="Sinkronkan database Google Sheets"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin text-[#0D5C75]' : ''} />
          <span className="hidden md:inline">Sinkronkan</span>
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="hidden sm:flex items-center gap-1.5 h-9.5 px-3 rounded-[10px] border border-[#E2E8F0] text-[12px] font-semibold text-[#64748B] bg-white hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          title="Ekspor CSV"
        >
          <Download size={14} />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* New Ticket Quick Button */}
        {onNewTicketClick && (
          <button
            type="button"
            onClick={onNewTicketClick}
            className="flex items-center gap-1.5 h-9.5 px-3.5 rounded-[10px] bg-[#0D5C75] hover:bg-[#083342] text-white text-[12px] font-bold transition-all shadow-sm shadow-[#0D5C75]/20 cursor-pointer"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Buat Tiket</span>
          </button>
        )}
      </div>

    </header>
  );
};

export default SageTopBar;
