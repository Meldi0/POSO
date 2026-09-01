import React, { useState, useEffect } from 'react';
import { Ticket, ThreadMessage } from '../../types';
import { apiService } from '../../services/api';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Clock, 
  User, 
  MessageSquare, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { parseMessageAttachments, AttachmentGallery } from '../common/AttachmentGallery';

interface SageTicketDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: string, assignedUpt?: string) => Promise<void>;
  isUpdating: boolean;
}

export const SageTicketDrawer: React.FC<SageTicketDrawerProps> = ({
  ticket,
  onClose,
  onUpdateStatus,
  isUpdating
}) => {
  if (!ticket) return null;

  const [currentTicket, setCurrentTicket] = useState<Ticket>(ticket);
  const [status, setStatus] = useState(ticket.status);
  const [assignedUpt, setAssignedUpt] = useState(ticket.assigned_upt || '');
  const [threads, setThreads] = useState<ThreadMessage[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setCurrentTicket(ticket);
    setStatus(ticket.status);
    setAssignedUpt(ticket.assigned_upt || '');
    loadDetailsAndThreads(ticket.ticket_id);
  }, [ticket.ticket_id]);

  const loadDetailsAndThreads = async (id: string) => {
    setIsLoadingThreads(true);
    try {
      const res = await apiService.getTicketDetail(id);
      if (res.status === 'success' && res.data) {
        if (res.data.ticket) {
          setCurrentTicket(res.data.ticket);
          setStatus(res.data.ticket.status);
          if (res.data.ticket.assigned_upt) {
            setAssignedUpt(res.data.ticket.assigned_upt);
          }
        }
        setThreads(res.data.threads || []);
      }
    } catch (e) {
      console.warn('Gagal memuat detail thread:', e);
    } finally {
      setIsLoadingThreads(false);
    }
  };

  const handleSaveTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateStatus(currentTicket.ticket_id, status, assignedUpt);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    try {
      const res = await apiService.addThreadMessage({
        ticket_id: currentTicket.ticket_id,
        message: replyText.trim(),
        visibility: isInternalNote ? 'internal' : 'public'
      });

      if (res.status === 'success') {
        setReplyText('');
        await loadDetailsAndThreads(currentTicket.ticket_id);
      }
    } finally {
      setIsSending(false);
    }
  };

  const uptList = [
    'UPT TI & Jaringan',
    'UPT Sarana & Pemeliharaan',
    'UPT Sistem Informasi Akademik',
    'UPT Hardware & Workshop',
    'Helpdesk Pusat & Layanan Terpadu'
  ];

  const rawDescription = currentTicket.description || ticket.description || (threads.length > 0 ? threads[0].message : '');
  const mainDescParsed = parseMessageAttachments(rawDescription);
  const finalDescriptionText = mainDescParsed.cleanText || rawDescription || '(Tidak ada deskripsi tambahan)';

  const requesterDisplay = currentTicket.requester_email || ticket.requester_email || (threads.length > 0 ? (threads[0].sender_name || threads[0].sender_id) : 'Pelapor Umum');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0D5C75] bg-[#EAF4F8] px-2 py-0.5 rounded">
                #{currentTicket.ticket_id}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {currentTicket.category}
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 truncate max-w-sm mt-1">
              {currentTicket.subject}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
          {/* Metadata Bar */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Pelapor</span>
              <span className="font-semibold text-slate-800 truncate block mt-0.5">{requesterDisplay}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Prioritas & SLA</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-[#0D5C75]">{currentTicket.priority}</span>
                {currentTicket.sla_due_at && new Date(currentTicket.sla_due_at).getTime() < Date.now() && currentTicket.status !== 'closed' && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-rose-600 text-white animate-pulse">
                    Over SLA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1">Rincian Keluhan:</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {finalDescriptionText}
            </div>

            {mainDescParsed.attachments.length > 0 && (
              <div className="mt-2">
                <AttachmentGallery attachments={mainDescParsed.attachments} />
              </div>
            )}
          </div>

          {/* Triage Settings Form */}
          <form onSubmit={handleSaveTriage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0D5C75]" />
              <span>Pengaturan Status & Delegasi UPT</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="open">Open (Baru)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting">Waiting</option>
                  <option value="closed">Closed (Selesai)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Unit UPT</label>
                <select
                  value={assignedUpt}
                  onChange={(e) => setAssignedUpt(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="">-- Pilih UPT --</option>
                  {uptList.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Status'}
            </button>
          </form>

          {/* Threads */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700 block">Riwayat Pesan ({threads.length}):</span>
            
            {isLoadingThreads ? (
              <p className="text-xs text-slate-400 italic">Memuat pesan...</p>
            ) : threads.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada tanggapan.</p>
            ) : (
              <div className="space-y-2">
                {threads.map(th => {
                  const isInternal = th.visibility === 'internal';
                  const parsed = parseMessageAttachments(th.message);

                  return (
                    <div
                      key={th.thread_id}
                      className={`p-3 rounded-lg border text-xs leading-relaxed space-y-1.5 ${
                        isInternal
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={isInternal ? 'text-amber-800' : 'text-[#0D5C75]'}>
                          {isInternal ? '🔒 Catatan Internal' : th.sender_role.toUpperCase()}
                        </span>
                        <span className="text-slate-400 font-normal">
                          {new Date(th.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {parsed.cleanText && <p>{parsed.cleanText}</p>}
                      {parsed.attachments.length > 0 && <AttachmentGallery attachments={parsed.attachments} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Reply Footer */}
        <form onSubmit={handleSendReply} className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Tulis Tanggapan:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-amber-800">
              <input
                type="checkbox"
                checked={isInternalNote}
                onChange={(e) => setIsInternalNote(e.target.checked)}
                className="rounded text-[#0D5C75]"
              />
              <span>Catatan Staf</span>
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={isInternalNote ? 'Tulis catatan staf...' : 'Ketik pesan balasan...'}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0D5C75]"
            />
            <button
              type="submit"
              disabled={isSending || !replyText.trim()}
              className="px-3.5 py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
