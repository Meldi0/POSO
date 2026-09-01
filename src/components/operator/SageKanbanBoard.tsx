import React from 'react';
import { Ticket } from '../../types';
import { SageTicketCard } from './SageTicketCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SageKanbanBoardProps {
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
    status: 'open' | 'in_progress' | 'waiting' | 'closed';
    dotColor: string;
    accentGlow: string;
  }> = [
    {
      id: 'col_open',
      title: 'Tiket Masuk (Open)',
      status: 'open',
      dotColor: 'bg-blue-500',
      accentGlow: 'from-blue-500/10 to-transparent'
    },
    {
      id: 'col_in_progress',
      title: 'Sedang Dikerjakan UPT',
      status: 'in_progress',
      dotColor: 'bg-amber-500',
      accentGlow: 'from-amber-500/10 to-transparent'
    },
    {
      id: 'col_waiting',
      title: 'Menunggu Respon',
      status: 'waiting',
      dotColor: 'bg-purple-500',
      accentGlow: 'from-purple-500/10 to-transparent'
    },
    ...(includeClosedColumn ? [{
      id: 'col_closed',
      title: 'Selesai (Closed)',
      status: 'closed' as const,
      dotColor: 'bg-emerald-500',
      accentGlow: 'from-emerald-500/10 to-transparent'
    }] : [])
  ];

  const gridColsClass = includeClosedColumn 
    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start'
    : 'grid grid-cols-1 md:grid-cols-3 gap-5 items-start';

  return (
    <div className={gridColsClass}>
      {allColumns.map(col => {
        const colTickets = tickets.filter(t => t.status === col.status);

        return (
          <div
            key={col.id}
            className="bg-[#F4F7F9]/80 backdrop-blur-md rounded-3xl p-4 border border-slate-200/80 flex flex-col gap-3.5 min-h-[500px] shadow-xs"
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

            {/* Column Tickets List with Framer Motion */}
            <div className="space-y-3 flex-1">
              <AnimatePresence mode="popLayout">
                {colTickets.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-2 border-dashed border-slate-200/90 rounded-2xl p-8 text-center text-slate-400 bg-white/40"
                  >
                    <p className="text-xs font-semibold">Tidak ada tiket di sini</p>
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
  );
};
