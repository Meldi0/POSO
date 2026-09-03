import React, { useState, useEffect } from 'react';
import { Ticket, ThreadMessage, TicketStatus, TicketPriority } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { parseTicketDetails, parseThreadMessage } from '../../utils/ticketFormatter';
import { AttachmentGallery } from '../common/AttachmentGallery';
import { 
  X, 
  Send, 
  Lock, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Mail, 
  Building2, 
  User, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface OperatorTicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onTicketUpdated: () => void;
}

export const OperatorTicketModal: React.FC<OperatorTicketModalProps> = ({
  ticket,
  onClose,
  onTicketUpdated
}) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ThreadMessage[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);

  // Triage state
  const [status, setStatus] = useState<TicketStatus>(ticket?.status || 'open');
  const [priority, setPriority] = useState<TicketPriority>(ticket?.priority || 'Medium');
  const [assignedUpt, setAssignedUpt] = useState<string>(ticket?.assigned_upt || '');
  const [isSavingTriage, setIsSavingTriage] = useState(false);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'internal'>('public');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const uptUnits = [
    'UPT Pengendalian Operasi & Transportasi',
    'UPT Sarana & Prasarana (CGS)',
    'UPT Postal Security & Keamanan',
    'UPT Quality Control & Audit SLA',
    'UPT TI & Sistem Informasi',
    'Helpdesk Pusat & Layanan Terpadu'
  ];

  const loadDetail = async (id: string) => {
    setIsLoadingThreads(true);
    try {
      const res = await apiService.getTicketDetail(id);
      if (res.status === 'success' && res.data) {
        setThreads(res.data.threads);
      }
    } finally {
      setIsLoadingThreads(false);
    }
  };

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setAssignedUpt(ticket.assigned_upt || '');
      loadDetail(ticket.ticket_id);
    }
  }, [ticket?.ticket_id]);

  if (!ticket) return null;

  const handleApplyTriage = async () => {
    setIsSavingTriage(true);
    try {
      await apiService.updateTicketStatus({
        ticket_id: ticket.ticket_id,
        status,
        priority,
        assigned_upt: assignedUpt
      });
      await loadDetail(ticket.ticket_id);
      onTicketUpdated();
    } finally {
      setIsSavingTriage(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await apiService.addThreadMessage({
        ticket_id: ticket.ticket_id,
        message: replyText.trim(),
        visibility
      });

      if (res.status === 'success') {
        setReplyText('');
        await loadDetail(ticket.ticket_id);
        onTicketUpdated();
      }
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl glass-panel-elevated rounded-spatial-lg border border-white/15 p-6 shadow-2xl flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-poso-lavender-light bg-poso-lavender/10 border border-poso-lavender/20 px-2.5 py-0.5 rounded-md">
                {ticket.ticket_id}
              </span>
              <span className="text-xs text-slate-400 capitalize">• Saluran: {ticket.channel}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">{ticket.subject}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4 overflow-y-auto pr-1 flex-1">
          {/* Left Column: Metadata & Triase Controls */}
          <div className="lg:col-span-1 space-y-4 text-xs">
            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Detail Pelapor & Tiket
              </span>

              <div>
                <span className="text-slate-400 block">Pelapor:</span>
                <span className="font-semibold text-white truncate block">{ticket.requester_email}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Kategori:</span>
                <span className="text-slate-200 font-medium">{ticket.category}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Waktu Dibuat:</span>
                <span className="text-slate-300">
                  {new Date(ticket.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            {/* Triase Controls */}
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/20 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Panel Triase & Distribusi</span>
              </span>

              {/* Status */}
              <div>
                <label className="text-slate-400 block mb-1">Status Tiket:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TicketStatus)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-white bg-slate-900 text-xs"
                >
                  <option value="open">Terbuka (Open)</option>
                  <option value="in_progress">Sedang Dikerjakan (In Progress)</option>
                  <option value="waiting">Menunggu Respon Pelapor (Waiting)</option>
                  <option value="closed">Selesai (Closed)</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-slate-400 block mb-1">Prioritas (SLA):</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-white bg-slate-900 text-xs"
                >
                  <option value="Low">Low (48 Jam SLA)</option>
                  <option value="Medium">Medium (24 Jam SLA)</option>
                  <option value="High">High (8 Jam SLA)</option>
                  <option value="Urgent">Urgent (4 Jam SLA)</option>
                </select>
              </div>

              {/* UPT Assignment */}
              <div>
                <label className="text-slate-400 block mb-1">Tugaskan ke Unit UPT:</label>
                <select
                  value={assignedUpt}
                  onChange={(e) => setAssignedUpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-amber-300 bg-slate-900 text-xs"
                >
                  <option value="">-- Belum Ditugaskan --</option>
                  {uptUnits.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleApplyTriage}
                disabled={isSavingTriage}
                className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSavingTriage ? 'Menyimpan...' : 'Terapkan Triase'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Chat-Thread View */}
          <div className="lg:col-span-2 flex flex-col h-[520px] glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-3 bg-white/5 border-b border-white/8 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Percakapan & Catatan Internal</span>
              <span className="text-[10px] text-amber-400 flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                <Lock className="w-3 h-3" />
                <span>Privat Aktif</span>
              </span>
            </div>

            {/* Thread messages scroll */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {isLoadingThreads ? (
                <div className="text-center text-slate-400 py-12 text-xs">Memuat percakapan...</div>
              ) : threads.length === 0 ? (
                <div className="text-center text-slate-500 py-12 text-xs">Belum ada pesan.</div>
              ) : (
                threads.map((t) => {
                  const isInternal = t.visibility === 'internal';
                  const isSystem = t.message.startsWith('[Sistem]');

                  if (isSystem) {
                    return (
                      <div key={t.thread_id} className="text-center my-1.5">
                        <span className="inline-block text-[10px] text-slate-400 bg-white/5 border border-white/8 px-2.5 py-0.5 rounded-full">
                          {t.message}
                        </span>
                      </div>
                    );
                  }

                  if (isInternal) {
                    const parsedInternal = parseThreadMessage(t.message);
                    return (
                      <div
                        key={t.thread_id}
                        className="p-3.5 rounded-xl internal-note-card border-l-4 border-amber-500 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Catatan Internal (Operator & UPT)</span>
                            <span className="text-slate-300 font-normal ml-1">— {t.sender_name}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(t.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-amber-100/90 whitespace-pre-wrap leading-relaxed">
                          {parsedInternal.cleanText}
                        </p>
                        {parsedInternal.attachments.length > 0 && (
                          <div className="pt-2">
                            <AttachmentGallery attachments={parsedInternal.attachments} isDarkTheme={true} />
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Public reply
                  const parsedPublic = parseThreadMessage(t.message);
                  return (
                    <div
                      key={t.thread_id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-white">{t.sender_name} ({t.sender_role})</span>
                        <span>{new Date(t.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{parsedPublic.cleanText}</p>
                      {parsedPublic.attachments.length > 0 && (
                        <div className="pt-2">
                          <AttachmentGallery attachments={parsedPublic.attachments} isDarkTheme={true} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Bar */}
            <div className="p-3 bg-white/5 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    visibility === 'public'
                      ? 'bg-poso-lavender/25 text-poso-lavender-light border border-poso-lavender/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Balas Pelapor (Publik)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('internal')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    visibility === 'internal'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>Catatan Internal (Privat)</span>
                </button>
              </div>

              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    visibility === 'internal'
                      ? 'Tulis catatan teknis rahasia untuk tim UPT & Operator...'
                      : 'Tulis balasan untuk pelapor tiket...'
                  }
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={isSendingReply || !replyText.trim()}
                  className={`px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 transition-all disabled:opacity-40 ${
                    visibility === 'internal'
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-gradient-to-r from-poso-lavender to-poso-cyan shadow-glow-lavender'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
