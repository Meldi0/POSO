import React, { useState } from 'react';
import { Ticket } from '../../types';
import { SageTicketCard } from './SageTicketCard';
import { motion, AnimatePresence } from 'framer-motion';

export interface SageKanbanBoardProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: Ticket) => void;
  onQuickTriage: (ticket: Ticket) => void;
  onMoveStatus?: (ticketId: string, newStatus: string) => void;
  includeClosedColumn?: boolean;
}

export const SageKanbanBoard: React.FC<SageKanbanBoardProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onQuickTriage,
  onMoveStatus,
  includeClosedColumn = false
}) => {
  const allColumns: Array<{
    id: string;
    title: string;
    shortTitle: string;
    status: 'open' | 'in_progress' | 'waiting' | 'closed';
    dotColor: string;
    activeTabBg: string;
    accentGlow: string;
  }> = [
    {
      id: 'col_open',
      title: 'Tiket Masuk (Open)',
      shortTitle: 'Open',
      status: 'open',
      dotColor: 'bg-blue-500',
      activeTabBg: 'bg-blue-600 text-white',
      accentGlow: 'from-blue-500/10 to-transparent'
    },
    {
      id: 'col_in_progress',
      title: 'Sedang Dikerjakan UPT',
      shortTitle: 'Dikerjakan',
      status: 'in_progress',
      dotColor: 'bg-amber-500',
      activeTabBg: 'bg-amber-600 text-white',
      accentGlow: 'from-amber-500/10 to-transparent'
    },
    {
      id: 'col_waiting',
      title: 'Menunggu Respon',
      shortTitle: 'Waiting',
      status: 'waiting',
      dotColor: 'bg-purple-500',
      activeTabBg: 'bg-purple-600 text-white',
      accentGlow: 'from-purple-500/10 to-transparent'
    },
    ...(includeClosedColumn ? [{
      id: 'col_closed',
      title: 'Selesai (Closed)',
      shortTitle: 'Selesai',
      status: 'closed' as const,
      dotColor: 'bg-emerald-500',
      activeTabBg: 'bg-emerald-600 text-white',
      accentGlow: 'from-emerald-500/10 to-transparent'
    }] : [])
  ];

  // Mobile active column selector tab
  const [mobileActiveColumn, setMobileActiveColumn] = useState<string>('col_open');

  return (
    <div className="space-y-4">
      {/* Mobile Column Switcher Pills */}
      <div className="md:hidden flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl overflow-x-auto no-scrollbar">
        {allColumns.map(col => {
          const count = tickets.filter(t => t.status === col.status).length;
          const isActive = mobileActiveColumn === col.id;

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setMobileActiveColumn(col.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? `${col.activeTabBg} shadow-sm`
                  : 'text-slate-600 hover:text-slate-900 bg-transparent'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : col.dotColor}`} />
              <span>{col.shortTitle}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/25 text-white' : 'bg-slate-300/80 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Columns Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${includeClosedColumn ? 'xl:grid-cols-4' : 'lg:grid-cols-3'} gap-4 items-start`}>
        {allColumns.map(col => {
          const colTickets = tickets.filter(t => t.status === col.status);
          const isHiddenOnMobile = mobileActiveColumn !== col.id;

          return (
            <div
              key={col.id}
              className={`bg-[#F4F7F9]/80 backdrop-blur-md rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 flex flex-col gap-3.5 min-h-[420px] shadow-xs ${
                isHiddenOnMobile ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor} shadow-xs`} />
                  <h3 className="font-extrabold text-xs text-slate-800 tracking-tight">
                    {col.title}
                  </h3>
                </div>

                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200/80 shadow-xs">
                  {colTickets.length}
                </span>
              </div>

              {/* Column Tickets List */}
              <div className="space-y-3 flex-1">
                <AnimatePresence mode="popLayout">
                  {colTickets.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-2 border-dashed border-slate-200/90 rounded-2xl p-8 text-center text-slate-400 bg-white/40"
                    >
                      <p className="text-xs font-semibold">Tidak ada tiket di kolom ini</p>
                    </motion.div>
                  ) : (
                    colTickets.map(ticket => (
                      <SageTicketCard
                        key={ticket.ticket_id}
                        ticket={ticket}
                        isSelected={selectedTicketId === ticket.ticket_id}
                        onSelect={onSelectTicket}
                        onQuickTriage={onQuickTriage}
                        onMoveStatus={onMoveStatus}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
