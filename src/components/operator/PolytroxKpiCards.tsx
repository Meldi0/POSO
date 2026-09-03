import React from 'react';
import { ArrowUpRight, Globe, MoreHorizontal, Sparkles } from 'lucide-react';

interface PolytroxKpiCardsProps {
  totalTickets: number;
  closedTickets: number;
  openTickets: number;
  urgentTickets: number;
}

export const PolytroxKpiCards: React.FC<PolytroxKpiCardsProps> = ({
  totalTickets,
  closedTickets,
  openTickets,
  urgentTickets
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Metric 3-in-1 Card */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-[#F0E8E1] shadow-card-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between divide-y sm:divide-y-0 sm:divide-x divide-[#F5EFE9]">
        {/* Metric 1 */}
        <div className="flex-1 py-2 sm:py-0 sm:px-4 first:pl-0 space-y-1">
          <span className="text-xs font-semibold text-[#8C847E]">Total Tiket Masuk</span>
          <div className="text-2xl sm:text-3xl font-black text-[#2D2622]">
            {totalTickets}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>+8.51% aktif</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex-1 py-2 sm:py-0 sm:px-4 space-y-1">
          <span className="text-xs font-semibold text-[#8C847E]">Tiket Selesai (Closed)</span>
          <div className="text-2xl sm:text-3xl font-black text-[#2D2622]">
            {closedTickets}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#E75A38]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E75A38]" />
            <span>{openTickets} terbuka</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex-1 py-2 sm:py-0 sm:px-4 last:pr-0 space-y-1">
          <span className="text-xs font-semibold text-[#8C847E]">Rata-rata Respon SLA</span>
          <div className="text-2xl sm:text-3xl font-black text-[#2D2622]">
            3,1 jam
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{urgentTickets} urgent</span>
          </div>
        </div>
      </div>

      {/* Terracotta Action Card */}
      <div className="bg-gradient-to-br from-[#E75A38] to-[#D84623] text-white rounded-3xl p-5 shadow-terracotta flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span className="text-xs font-black tracking-wider uppercase">PRISMA POS Help Center</span>
          </div>
          <button type="button" className="text-white/80 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 py-2">
          <h4 className="text-sm font-extrabold text-white">
            Pusat Penanganan Cepat
          </h4>
          <p className="text-[11px] text-white/85 leading-relaxed">
            Distribusi triase tiket ke unit teknis UPT secara instan.
          </p>
        </div>
      </div>
    </div>
  );
};
