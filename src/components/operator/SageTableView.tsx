import React from 'react';
import { Ticket } from '../../types';
import { 
  Clock, 
  Flame, 
  ShieldCheck, 
  Edit3
} from 'lucide-react';

interface SageTableViewProps {
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
  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">Open</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">In Progress</span>;
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">Waiting</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">{st}</span>;
    }
  };

  const getPriorityBadge = (ticket: Ticket) => {
    const isOverSla = ticket.sla_due_at && new Date(ticket.sla_due_at).getTime() < Date.now() && ticket.status !== 'closed';
    const p = String(ticket.priority || 'Medium');

    return (
      <div className="inline-flex items-center gap-1">
        {isOverSla && (
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
            Over SLA
          </span>
        )}
        {p.toLowerCase() === 'urgent' ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Urgent</span>
          </span>
        ) : p.toLowerCase() === 'high' ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700">
            <tr>
              <th className="py-3 px-4">ID Tiket</th>
              <th className="py-3 px-4">Subjek & Deskripsi</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Prioritas</th>
              <th className="py-3 px-4">Pelapor / UPT</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                  Tidak ada tiket yang cocok dengan filter pencarian.
                </td>
              </tr>
            ) : (
              tickets.map(ticket => {
                const isSelected = selectedTicketId === ticket.ticket_id;

                return (
                  <tr
                    key={ticket.ticket_id}
                    onClick={() => onSelectTicket(ticket)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-100 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#0D5C75]">
                      #{ticket.ticket_id}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{ticket.subject}</div>
                      <div className="text-[11px] text-slate-500 truncate">{ticket.description}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {ticket.category}
                    </td>
                    <td className="py-3 px-4">
                      {getPriorityBadge(ticket)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="truncate text-slate-700">{ticket.requester_email}</div>
                      {ticket.assigned_upt && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-[#0D5C75] font-semibold bg-[#EAF4F8] px-1.5 py-0.2 rounded mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-[#0D5C75]" />
                          <span>{ticket.assigned_upt}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickTriage(ticket);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
  );
};
