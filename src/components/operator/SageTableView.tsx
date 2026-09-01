import React, { useState } from 'react';
import { Ticket } from '../../types';
import { 
  Clock, 
  Flame, 
  ShieldCheck, 
  Edit3,
  ArrowUpDown,
  User,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface SageTableViewProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: Ticket) => void;
  onQuickTriage: (ticket: Ticket) => void;
}

export const SageTableView: React.FC<SageTableViewProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onQuickTriage
}) => {
  const [sortField, setSortField] = useState<'id' | 'created_at' | 'priority' | 'status'>('created_at');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: 'id' | 'created_at' | 'priority' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    let comp = 0;
    if (sortField === 'id') {
      comp = (a.ticket_id || '').localeCompare(b.ticket_id || '');
    } else if (sortField === 'created_at') {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      comp = timeA - timeB;
    } else if (sortField === 'priority') {
      const order: Record<string, number> = { Urgent: 3, High: 2, Medium: 1, Low: 0 };
      const valA = order[a.priority] ?? 1;
      const valB = order[b.priority] ?? 1;
      comp = valA - valB;
    } else if (sortField === 'status') {
      comp = (a.status || '').localeCompare(b.status || '');
    }
    return sortAsc ? comp : -comp;
  });

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">Open</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">In Progress</span>;
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">Waiting</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">{st}</span>;
    }
  };

  const getPriorityBadge = (ticket: Ticket) => {
    const isOverSla = ticket.sla_due_at && new Date(ticket.sla_due_at).getTime() < Date.now() && ticket.status !== 'closed';
    const p = String(ticket.priority || 'Medium');

    return (
      <div className="inline-flex items-center gap-1">
        {isOverSla && (
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
            Over SLA
          </span>
        )}
        {p.toLowerCase() === 'urgent' ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Urgent</span>
          </span>
        ) : p.toLowerCase() === 'high' ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>High</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-600 font-medium">{p}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 1. Mobile Cards View (< md) */}
      <div className="md:hidden space-y-2.5">
        {sortedTickets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
            Tidak ada tiket yang cocok dengan filter pencarian.
          </div>
        ) : (
          sortedTickets.map(ticket => {
            const isSelected = selectedTicketId === ticket.ticket_id;

            return (
              <motion.div
                key={ticket.ticket_id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTicket(ticket)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-white border-[#0D5C75] ring-2 ring-[#0D5C75]/20 shadow-md'
                    : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#0D5C75] bg-[#EAF4F8] px-2 py-0.5 rounded">
                    #{ticket.ticket_id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getPriorityBadge(ticket)}
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{ticket.subject}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ticket.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[180px]">{ticket.category}</span>
                  <span className="text-[#0D5C75] font-bold flex items-center gap-0.5">
                    <span>Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Table View (>= md) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 select-none">
              <tr>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#0D5C75]" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>ID Tiket</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Subjek & Deskripsi</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#0D5C75]" onClick={() => handleSort('priority')}>
                  <div className="flex items-center gap-1">
                    <span>Prioritas</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Pelapor / UPT</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#0D5C75]" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    Tidak ada tiket yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                sortedTickets.map(ticket => {
                  const isSelected = selectedTicketId === ticket.ticket_id;

                  return (
                    <tr
                      key={ticket.ticket_id}
                      onClick={() => onSelectTicket(ticket)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#EAF4F8]/80 font-semibold'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0D5C75]">
                        #{ticket.ticket_id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{ticket.subject}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{ticket.description}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {ticket.category}
                      </td>
                      <td className="py-3.5 px-4">
                        {getPriorityBadge(ticket)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="truncate text-slate-700">{ticket.requester_email}</div>
                        {ticket.assigned_upt && (
                          <div className="inline-flex items-center gap-1 text-[10px] text-[#0D5C75] font-semibold bg-[#EAF4F8] px-1.5 py-0.5 rounded mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-[#0D5C75]" />
                            <span>{ticket.assigned_upt}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickTriage(ticket);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                          title="Edit Triase"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
