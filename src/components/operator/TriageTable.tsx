import React from 'react';
import { Ticket } from '../../types';
import { 
  Eye, 
  Flame, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Globe 
} from 'lucide-react';

interface TriageTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const TriageTable: React.FC<TriageTableProps> = ({ tickets, onSelectTicket }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full badge-cyan">Terbuka (Open)</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full badge-lavender">Dikerjakan</span>;
      case 'waiting':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full badge-amber">Menunggu Respon</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full badge-mint">Selesai (Closed)</span>;
      default:
        return <span className="text-xs text-slate-300">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <span className="badge-rose text-[10px] font-bold px-2 py-0.5 rounded">Urgent</span>;
      case 'High':
        return <span className="badge-amber text-[10px] font-bold px-2 py-0.5 rounded">Tinggi</span>;
      case 'Medium':
        return <span className="badge-lavender text-[10px] font-medium px-2 py-0.5 rounded">Sedang</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded">Rendah</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-glass-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">ID Tiket</th>
              <th className="py-3 px-4">Subjek Masalah</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Prioritas</th>
              <th className="py-3 px-4">Penugasan UPT</th>
              <th className="py-3 px-4">Pelapor</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {tickets.map((t) => (
              <tr
                key={t.ticket_id}
                onClick={() => onSelectTicket(t)}
                className="hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-poso-lavender-light whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {t.channel === 'email' ? (
                      <span title="Masuk via Email"><Mail className="w-3 h-3 text-cyan-400" /></span>
                    ) : (
                      <span title="Masuk via Web Portal"><Globe className="w-3 h-3 text-poso-lavender" /></span>
                    )}
                    <span>{t.ticket_id}</span>
                  </div>
                </td>

                <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                  {t.subject}
                </td>

                <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                  {t.category}
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  {getStatusBadge(t.status)}
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  {getPriorityBadge(t.priority)}
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  {t.assigned_upt ? (
                    <span className="text-amber-300 font-medium">{t.assigned_upt}</span>
                  ) : (
                    <span className="text-slate-500 italic">Belum di-assign</span>
                  )}
                </td>

                <td className="py-3 px-4 text-slate-400 max-w-[140px] truncate">
                  {t.requester_email}
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTicket(t);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-poso-lavender/20 text-slate-300 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
