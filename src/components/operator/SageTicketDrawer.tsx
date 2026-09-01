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
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseMessageAttachments, AttachmentGallery } from '../common/AttachmentGallery';
import { useToast } from '../../context/ToastContext';

export interface SageTicketDrawerProps {
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

  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState<'chat' | 'triage' | 'info'>('chat');
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
    success(`Status tiket #${currentTicket.ticket_id} berhasil diperbarui!`);
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
        success(isInternalNote ? 'Catatan internal tersimpan.' : 'Balasan terkirim ke pelapor.');
        await loadDetailsAndThreads(currentTicket.ticket_id);
      }
    } finally {
      setIsSending(false);
    }
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(currentTicket.ticket_id);
    info(`Nomor ID tiket #${currentTicket.ticket_id} disalin ke clipboard.`);
  };

  const copyTrackingUrl = () => {
    const url = `${window.location.origin}/track?id=${currentTicket.ticket_id}`;
    navigator.clipboard.writeText(url);
    info('Tautan pelacakan publik tiket berhasil disalin!');
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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: "spring", stiffness: 350, damping: 32 }}
        className="relative w-full sm:max-w-xl md:max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200/90 flex flex-col justify-between overflow-hidden z-10"
      >
        {/* 1. Header */}
        <div className="p-4 sm:p-5 bg-slate-50/90 border-b border-slate-200/90 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <button
                type="button"
                onClick={copyTicketId}
                title="Klik untuk salin ID"
                className="font-mono text-xs font-black text-[#0D5C75] bg-[#EAF4F8] hover:bg-[#A5D1E1]/50 px-2.5 py-0.5 rounded-lg border border-[#A5D1E1]/50 flex items-center gap-1 transition-colors"
              >
                <span>#{currentTicket.ticket_id}</span>
                <Copy className="w-3 h-3 text-[#0D5C75]" />
              </button>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {currentTicket.category}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                currentTicket.status === 'closed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {currentTicket.status}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
              {currentTicket.subject}
            </h2>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={copyTrackingUrl}
              title="Salin Tautan Lacak"
              className="p-2 rounded-xl text-slate-400 hover:text-[#0D5C75] hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Interactive Navigation Tabs */}
        <div className="px-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-[#0D5C75] text-[#0D5C75]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Diskusi ({threads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('triage')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'triage'
                ? 'border-[#0D5C75] text-[#0D5C75]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Triase & UPT</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-[#0D5C75] text-[#0D5C75]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Info & SLA</span>
          </button>
        </div>

        {/* 3. Drawer Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
          {/* TAB 1: DISKUSI / THREADS */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {/* Original Complaint Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Laporan Utama ({requesterDisplay})</span>
                  </span>
                  <span>{currentTicket.created_at ? new Date(currentTicket.created_at).toLocaleString('id-ID') : '-'}</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {finalDescriptionText}
                </p>
                {mainDescParsed.attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <AttachmentGallery attachments={mainDescParsed.attachments} />
                  </div>
                )}
              </div>

              {/* Thread History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0D5C75]" />
                  <span>Riwayat Tanggapan:</span>
                </h4>

                {isLoadingThreads ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium">Memuat pesan...</div>
                ) : threads.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-slate-200/60">
                    Belum ada tanggapan untuk tiket ini. Kirim balasan pertama di bawah.
                  </div>
                ) : (
                  threads.map(th => {
                    const isInternal = th.visibility === 'internal';
                    const parsed = parseMessageAttachments(th.message);

                    return (
                      <motion.div
                        key={th.thread_id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                          isInternal
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                            : 'bg-white border-slate-200 shadow-xs text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <div className="flex items-center gap-1.5">
                            {isInternal ? (
                              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                                <Lock className="w-3 h-3" />
                                <span>Catatan Internal Staf</span>
                              </span>
                            ) : (
                              <span className="text-[#0D5C75] bg-[#EAF4F8] px-2 py-0.5 rounded-md">
                                {th.sender_name || th.sender_role.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 font-normal text-[10px]">
                            {new Date(th.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {parsed.cleanText && <p className="whitespace-pre-wrap">{parsed.cleanText}</p>}
                        {parsed.attachments.length > 0 && <AttachmentGallery attachments={parsed.attachments} />}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TRIAGE & UPT SETTINGS */}
          {activeTab === 'triage' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveTriage} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0D5C75]" />
                  <span>Perbarui Status & Delegasi Tim</span>
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status Pengerjaan Tiket</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0D5C75]/20 focus:outline-none"
                    >
                      <option value="open">Open (Menunggu Tindakan)</option>
                      <option value="in_progress">In Progress (Sedang Dikerjakan UPT)</option>
                      <option value="waiting">Waiting (Menunggu Konfirmasi/Info)</option>
                      <option value="closed">Closed (Telah Selesai & Ditutup)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Delegasikan ke Unit Pelaksana Teknis (UPT)</label>
                    <select
                      value={assignedUpt}
                      onChange={(e) => setAssignedUpt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0D5C75]/20 focus:outline-none"
                    >
                      <option value="">-- Belum Ditugaskan / Helpdesk Pusat --</option>
                      {uptList.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-2.5 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-all shadow-md shadow-[#0D5C75]/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUpdating ? 'Menyimpan Perubahan...' : 'Simpan Status & Delegasi'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: INFO & SLA DETAILS */}
          {activeTab === 'info' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Pelapor</span>
                  <p className="font-bold text-slate-800">{requesterDisplay}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tingkat Prioritas</span>
                  <p className="font-bold text-[#0D5C75]">{currentTicket.priority || 'Medium'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Waktu Dibuat</span>
                  <p className="font-semibold text-slate-700">
                    {currentTicket.created_at ? new Date(currentTicket.created_at).toLocaleString('id-ID') : '-'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Target SLA Selesai</span>
                  <p className="font-semibold text-slate-700">
                    {currentTicket.sla_due_at ? new Date(currentTicket.sla_due_at).toLocaleString('id-ID') : 'Sesuai Standar SOP'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                <h5 className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0D5C75]" />
                  <span>SOP Layanan POSO</span>
                </h5>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Pastikan memberikan pembaruan status atau balasan kepada pelapor dalam kurun waktu 1x24 jam kerja sesuai panduan layanan institusi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Reply Footer Form (Always visible when in 'chat' tab) */}
        {activeTab === 'chat' && (
          <form onSubmit={handleSendReply} className="p-3.5 sm:p-4 bg-slate-50/95 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded text-[#0D5C75] focus:ring-[#0D5C75] w-3.5 h-3.5"
                />
                <span className={isInternalNote ? 'text-amber-800 font-bold' : ''}>
                  {isInternalNote ? '🔒 Catatan Internal (Hanya Staf)' : 'Balasan Publik (Dapat Dilihat Pelapor)'}
                </span>
              </label>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? "Tulis catatan internal untuk tim teknis..." : "Ketik pesan balasan untuk pelapor..."}
                rows={2}
                className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] resize-none"
              />

              <motion.button
                whileTap={{ scale: 0.94 }}
                type="submit"
                disabled={isSending || !replyText.trim()}
                className={`p-3 rounded-xl text-white font-bold transition-all shadow-md shrink-0 disabled:opacity-50 ${
                  isInternalNote
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-[#0D5C75] hover:bg-[#083342] shadow-[#0D5C75]/20'
                }`}
                title="Kirim Balasan"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
