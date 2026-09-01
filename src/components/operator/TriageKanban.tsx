import React from 'react';
import { Ticket, TicketStatus } from '../../types';
import { 
  Clock, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Mail, 
  Globe 
} from 'lucide-react';

interface TriageKanbanProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const TriageKanban: React.FC<TriageKanbanProps> = ({ tickets, onSelectTicket }) => {
  const columns: { status: TicketStatus; label: string; countColor: string; borderColor: string }[] = [
    { status: 'open', label: 'Tiket Terbuka (Open)', countColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30', borderColor: 'border-cyan-500/20' },
    { status: 'in_progress', label: 'Sedang Dikerjakan (In Progress)', countColor: 'text-purple-300 bg-purple-950/60 border-purple-500/30', borderColor: 'border-purple-500/20' },
    { status: 'waiting', label: 'Menunggu Respon (Waiting)', countColor: 'text-amber-300 bg-amber-950/60 border-amber-500/30', borderColor: 'border-amber-500/20' },
    { status: 'closed', label: 'Selesai (Closed)', countColor: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30', borderColor: 'border-emerald-500/20' }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40"><Flame className="w-2.5 h-2.5 text-rose-400" /> Urgent</span>;
      case 'High':
        return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40"><AlertTriangle className="w-2.5 h-2.5 text-amber-400" /> High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950/60 text-purple-300 border border-purple-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">Low</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTickets = tickets.filter(t => t.status === col.status);

        return (
          <div
            key={col.status}
            className="glass-panel rounded-2xl border border-white/10 p-3.5 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="text-xs font-bold text-slate-200 tracking-wide">
                {col.label}
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${col.countColor}`}>
                {colTickets.length}
              </span>
            </div>

            {/* Ticket Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {colTickets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs italic">
                  Kosong
                </div>
              ) : (
                colTickets.map((t) => (
                  <div
                    key={t.ticket_id}
                    onClick={() => onSelectTicket(t)}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-poso-lavender/40 cursor-pointer transition-all duration-200 shadow-glass-sm space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[11px] font-bold text-poso-lavender-light">
                        {t.ticket_id}
                      </span>
                      {getPriorityBadge(t.priority)}
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-poso-lavender-light transition-colors line-clamp-2">
                      {t.subject}
                    </h4>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="truncate max-w-[120px]">{t.category}</span>
                      {t.assigned_upt ? (
                        <span className="text-amber-300 font-semibold text-[10px] truncate max-w-[100px]">
                          {t.assigned_upt.split(' ')[1] || t.assigned_upt}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[10px]">Unassigned</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
