import React from 'react';
import { Ticket, TicketStatus } from '../../types';
import { 
  Flame, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Globe, 
  User, 
  ChevronRight,
  ShieldCheck,
  Inbox
} from 'lucide-react';

interface OsTicketTableViewProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  activeQueue: string;
  onChangeQueue: (queue: string) => void;
  counts: {
    open: number;
    in_progress: number;
    waiting: number;
    urgent: number;
    closed: number;
    total: number;
  };
}

export const OsTicketTableView: React.FC<OsTicketTableViewProps> = ({
  tickets,
  onSelectTicket,
  activeQueue,
  onChangeQueue,
  counts
}) => {
  const queues = [
    { id: 'open', label: 'Tiket Terbuka (Open)', count: counts.open, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' },
    { id: 'urgent', label: 'Prioritas Urgent', count: counts.urgent, color: 'text-rose-400 border-rose-500/40 bg-rose-950/40' },
    { id: 'in_progress', label: 'Dalam Pengerjaan (UPT)', count: counts.in_progress, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40' },
    { id: 'waiting', label: 'Menunggu Respon', count: counts.waiting, color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' },
    { id: 'closed', label: 'Selesai (Closed)', count: counts.closed, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' },
    { id: 'all', label: 'Semua Tiket', count: counts.total, color: 'text-slate-400 border-slate-700 bg-slate-800' }
  ];

  const getStatusBadge = (st: TicketStatus) => {
    switch (st) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase">Open</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 uppercase">In Progress</span>;
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 uppercase">Waiting</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase">Closed</span>;
    }
  };

  const getPriorityBadge = (pr: string) => {
    switch (pr) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1"><Flame className="w-3 h-3 text-rose-400" /> Urgent</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" /> High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950/80 text-purple-300 border border-purple-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">Low</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* osTicket Queue Tabs (Sub-Navigation Bar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {queues.map((q) => {
          const isActive = activeQueue === q.id;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onChangeQueue(q.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-850 border-indigo-500 text-white shadow-sm'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{q.label}</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold border ${q.color}`}>
                {q.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main osTicket Table Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No. Tiket</th>
                <th className="py-3.5 px-4">Tanggal Masuk</th>
                <th className="py-3.5 px-4">Subjek / Masalah</th>
                <th className="py-3.5 px-4">Pelapor (From)</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Prioritas</th>
                <th className="py-3.5 px-4">Unit UPT</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-500">
                    <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                    <p className="font-semibold text-slate-400">Tidak ada tiket di antrean ini.</p>
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr
                    key={t.ticket_id}
                    onClick={() => onSelectTicket(t.ticket_id)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  >
                    {/* Ticket ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {t.channel === 'email' ? (
                          <span title="Masuk via Email"><Mail className="w-3.5 h-3.5 text-cyan-400" /></span>
                        ) : (
                          <span title="Masuk via Web Portal"><Globe className="w-3.5 h-3.5 text-indigo-400" /></span>
                        )}
                        <span>{t.ticket_id}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(t.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 font-bold text-white group-hover:text-indigo-300 transition-colors max-w-xs truncate">
                      {t.subject}
                    </td>

                    {/* Requester */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] max-w-[150px] truncate">
                      {t.requester_email}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {t.category}
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(t.priority)}
                    </td>

                    {/* Assigned UPT */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {t.assigned_upt ? (
                        <span className="font-semibold text-amber-300">{t.assigned_upt}</span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(t.status)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(t.ticket_id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs transition-colors"
                      >
                        <span>Buka</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
