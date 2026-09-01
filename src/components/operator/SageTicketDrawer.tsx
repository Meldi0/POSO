import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Building2, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  FileText, 
  Copy, 
  Check, 
  Headphones, 
  Layers,
  Info
} from 'lucide-react';
import { parseTicketDetails, parseThreadMessage } from '../../utils/ticketFormatter';
import { AttachmentGallery } from '../common/AttachmentGallery';

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
  const [copiedId, setCopiedId] = useState(false);

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
        setCurrentTicket(res.data.ticket);
        setStatus(res.data.ticket.status);
        setAssignedUpt(res.data.ticket.assigned_upt || '');
        setThreads(res.data.threads || []);
      }
    } finally {
      setIsLoadingThreads(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentTicket.ticket_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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
    'UPT Pengendalian Operasi & Transportasi',
    'UPT Sarana & Prasarana (CGS)',
    'UPT Postal Security & Keamanan',
    'UPT Quality Control & Audit SLA',
    'UPT TI & Sistem Informasi',
    'Helpdesk Pusat & Layanan Terpadu'
  ];

  // Parse clean ticket description & metadata
  const parsedDetails = parseTicketDetails(currentTicket.description, currentTicket.category);
  const requesterDisplay = currentTicket.requester_email || ticket.requester_email || 'Pelapor Umum';

  // Filter out redundant initial submission
  const followUpThreads = threads.filter((th, index) => {
    if (index === 0 && (th.message.includes(parsedDetails.cleanDescription) || th.sender_role === 'pengguna_umum')) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-[#E2E8F0] flex flex-col justify-between overflow-hidden font-sans text-[#0F172A]"
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] font-mono text-xs font-bold text-[#002B49] hover:border-[#002B49] transition-all shadow-2xs"
              >
                <span>#{currentTicket.ticket_id}</span>
                {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>

              <span className="text-xs font-bold text-slate-700 px-2.5 py-1 rounded-lg bg-slate-200/70">
                {currentTicket.priority}
              </span>
            </div>

            <h2 className="text-base font-bold text-[#0F172A] truncate max-w-md pt-1">
              {currentTicket.subject}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">
          
          {/* Metadata Grid Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-[10px] text-[#64748B] font-bold block uppercase tracking-wider">Pelapor</span>
              <span className="font-bold text-[#0F172A] truncate block text-xs">{requesterDisplay}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-[10px] text-[#64748B] font-bold block uppercase tracking-wider">Lokasi Kantor</span>
              <span className="font-bold text-[#0F172A] truncate block text-xs">{parsedDetails.location}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-[10px] text-[#64748B] font-bold block uppercase tracking-wider">Department & Topik</span>
              <span className="font-bold text-[#0F172A] truncate block text-xs">{parsedDetails.departmentAndTopic}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-[10px] text-[#64748B] font-bold block uppercase tracking-wider">Target Waktu SLA</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#002B49] text-xs">24 Jam</span>
                {currentTicket.sla_due_at && new Date(currentTicket.sla_due_at).getTime() < Date.now() && currentTicket.status !== 'closed' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-600 text-white animate-pulse">
                    Over SLA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description Section (Pure clean text) */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">Deskripsi Keluhan Awal:</span>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#0F172A] leading-relaxed whitespace-pre-wrap font-normal">
              {parsedDetails.cleanDescription || '(Tidak ada deskripsi tambahan)'}
            </div>

            {parsedDetails.attachments.length > 0 && (
              <div className="mt-2">
                <AttachmentGallery attachments={parsedDetails.attachments} />
              </div>
            )}
          </div>

          {/* Triage & Delegation Settings */}
          <form onSubmit={handleSaveTriage} className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#002B49]" />
                <span>Pengaturan Status & Delegasi UPT</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status Penanganan</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                >
                  <option value="open">Open (Baru)</option>
                  <option value="in_progress">In Progress (Diproses)</option>
                  <option value="waiting">Waiting (Menunggu Respon)</option>
                  <option value="closed">Closed (Selesai)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Disposisi Unit UPT</label>
                <select
                  value={assignedUpt}
                  onChange={(e) => setAssignedUpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                >
                  <option value="">-- Pilih Unit UPT --</option>
                  {uptList.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-xs font-bold transition-all shadow-sm shadow-[#002B49]/20 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {isUpdating ? 'Menyimpan Perubahan...' : 'Simpan Status & Delegasi'}
            </button>
          </form>

          {/* Conversation History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#002B49]" />
                <span>Riwayat Tanggapan ({followUpThreads.length})</span>
              </span>
            </div>

            {isLoadingThreads ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                Memuat riwayat percakapan...
              </div>
            ) : followUpThreads.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
                Belum ada tanggapan lanjutan pada tiket ini.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {followUpThreads.map((th) => {
                  const isInternal = th.visibility === 'internal';
                  const isPelapor = th.sender_role === 'pengguna_umum';
                  const parsedTh = parseThreadMessage(th.message);

                  return (
                    <div
                      key={th.thread_id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isInternal
                          ? 'bg-amber-50/90 border-amber-200/90'
                          : isPelapor
                          ? 'bg-[#F8FAFC] border-[#E2E8F0]'
                          : 'bg-sky-50/60 border-sky-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isInternal ? 'text-amber-900' : isPelapor ? 'text-slate-800' : 'text-[#002B49]'}`}>
                            {isInternal ? 'Catatan Internal Staf' : isPelapor ? 'Tanggapan Pelapor' : 'Tim Petugas / Teknisi'}
                          </span>
                          {isInternal && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Internal
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400">
                          {new Date(th.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {new Date(th.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>

                      <p className="text-xs text-[#0F172A] leading-relaxed font-normal whitespace-pre-wrap">
                        {parsedTh.cleanText}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Drawer Reply Footer Bar */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={isInternalNote}
                onChange={(e) => setIsInternalNote(e.target.checked)}
                className="rounded border-[#CBD5E1] text-[#002B49] focus:ring-[#002B49]"
              />
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                Catatan Internal (Hanya dilihat staf)
              </span>
            </label>
          </div>

          <form onSubmit={handleSendReply} className="flex gap-2">
            <input
              type="text"
              required
              placeholder={isInternalNote ? "Tulis catatan internal staf..." : "Kirim balasan kepada pelapor..."}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            />
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Mengirim...' : 'Kirim'}</span>
            </button>
          </form>
        </div>

      </motion.div>
    </div>
  );
};
