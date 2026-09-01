import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface PolytroxTopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PolytroxTopBar: React.FC<PolytroxTopBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onRefresh,
  isLoading
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      setCurrentDateTime(`${timeStr} ${dateStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2">
      {/* Brand Name */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-black tracking-widest text-[#2D2622] uppercase">
          POSO
        </h1>
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E75A38]/10 text-[#E75A38] border border-[#E75A38]/20">
          Support Org
        </span>
      </div>

      {/* Center Search Input with Terracotta Button */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 max-w-md bg-white rounded-2xl p-1.5 pl-4 shadow-card-soft border border-[#F0E8E1] transition-all focus-within:border-[#E75A38] focus-within:shadow-md">
        <input
          type="text"
          placeholder="Cari ID tiket, subjek keluhan, email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent text-xs text-[#2D2622] placeholder-[#A89F99] focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-[#E75A38] hover:bg-[#D84623] text-white shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Right Date & Time Widget */}
      <div className="flex items-center gap-3">
        <div className="text-xs font-semibold text-[#8C847E] bg-white px-4 py-2 rounded-2xl border border-[#F0E8E1] shadow-card-soft whitespace-nowrap">
          {currentDateTime || '09:30 AM Monday, 31 Aug 2026'}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title="Segarkan Data"
          className="p-2 rounded-xl bg-white hover:bg-[#FDF9F6] text-[#8C847E] hover:text-[#E75A38] border border-[#F0E8E1] shadow-card-soft transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#E75A38]' : ''}`} />
        </button>
      </div>
    </div>
  );
};
