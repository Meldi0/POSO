import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Ticket, ThreadMessage } from '../../types';
import { 
  Search, 
  ArrowLeft, 
  Clock, 
  Send, 
  User, 
  Headphones, 
  Calendar, 
  Tag, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseMessageAttachments, AttachmentGallery } from '../../components/common/AttachmentGallery';
import { useToast } from '../../context/ToastContext';

export const PublicTicketTracker: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paramId = searchParams.get('id') || '';
  const paramEmail = searchParams.get('email') || '';
  const { success, error, info } = useToast();

  const [ticketId, setTicketId] = useState(paramId);
  const [email, setEmail] = useState(paramEmail);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [threads, setThreads] = useState<ThreadMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchTicket = async (id: string, mail?: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await apiService.trackTicket(id, mail);
      if (res.status === 'success' && res.data) {
        setTicket(res.data.ticket);
        setThreads(res.data.threads);
      } else {
        setTicket(null);
        setErrorMsg(res.message || 'Tiket tidak ditemukan. Periksa kembali nomor ID tiket Anda.');
      }
    } catch (err: any) {
      setTicket(null);
      setErrorMsg(err.message || 'Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) {
      fetchTicket(paramId, paramEmail);
    }
  }, [paramId, paramEmail]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTicket(ticketId, email);
  };

  const handleSendCustomerReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !replyMessage.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await apiService.addThreadMessage({
        ticket_id: ticket.ticket_id,
        message: replyMessage.trim(),
        visibility: 'public'
      });

      if (res.status === 'success') {
        setReplyMessage('');
        success('Tanggapan Anda berhasil dikirimkan ke tim helpdesk.');
        await fetchTicket(ticket.ticket_id, email);
      }
    } finally {
      setIsSendingReply(false);
    }
  };

  const copyTicketId = () => {
    if (ticket) {
      navigator.clipboard.writeText(ticket.ticket_id);
      info(`ID Tiket #${ticket.ticket_id} disalin ke clipboard.`);
    }
  };

  const getStatusStepIndex = (st?: string): number => {
    switch (st) {
      case 'open': return 1;
      case 'in_progress': return 2;
      case 'waiting': return 2;
      case 'closed': return 3;
      default: return 0;
    }
  };

  const steps = [
    { title: 'Laporan Masuk', desc: 'Tercatat di sistem' },
    { title: 'Triase & Disposisi', desc: 'Diverifikasi helpdesk' },
    { title: 'Pengerjaan UPT', desc: 'Teknisi menangani' },
    { title: 'Selesai', desc: 'Kendala tuntas' }
  ];

  const currentStep = getStatusStepIndex(ticket?.status);
  const mainDescParsed = ticket ? parseMessageAttachments(ticket.description) : { cleanText: '', attachments: [] };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 font-sans pb-16 selection:bg-[#0D5C75] selection:text-white">
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 py-3.5 px-4 mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0D5C75] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <span className="text-xs font-black text-[#0D5C75] bg-[#EAF4F8] px-3 py-1 rounded-full border border-[#A5D1E1]/40">
            Pelacak Status Pengaduan
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Lacak Status Tiket Anda</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Ketik nomor ID Tiket Anda untuk melihat tahapan pengerjaan teknisi dan riwayat balasan secara real-time.
          </p>
        </div>

        {/* Search Bar Card */}
        <form onSubmit={handleSearchSubmit} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor ID Tiket *</label>
              <input
                type="text"
                required
                placeholder="Contoh: TICK-20260901-1001"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Pelapor (Opsional)</label>
              <input
                type="email"
                placeholder="nama@domain.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0D5C75]/20 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Mencari Data Tiket...' : 'Lacak Status Tiket'}</span>
          </motion.button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Ticket Details & Timeline View */}
        {ticket && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6"
          >
            {/* 1. Header Banner */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-50 to-[#EAF4F8]/40 border-b border-slate-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={copyTicketId}
                  title="Salin ID"
                  className="font-mono text-xs font-extrabold text-[#0D5C75] bg-white hover:bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <span>#{ticket.ticket_id}</span>
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    ticket.status === 'closed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ticket.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {ticket.subject}
              </h2>

              <div className="flex flex-wrap gap-3 sm:gap-5 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-[#199FB1]" /> {ticket.category}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                <span className="font-bold text-[#0D5C75]">Prioritas: {ticket.priority}</span>
                {ticket.assigned_upt && (
                  <span className="inline-flex items-center gap-1 font-bold text-[#0D5C75] bg-[#EAF4F8] px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#199FB1]" />
                    <span>Unit: {ticket.assigned_upt}</span>
                  </span>
                )}
              </div>
            </div>

            {/* 2. Interactive Multi-Step Timeline */}
            <div className="px-5 sm:px-6">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0D5C75]" />
                <span>Tahapan Penanganan Tiket</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {steps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#EAF4F8]/70 border-[#199FB1] ring-2 ring-[#0D5C75]/10 shadow-xs'
                          : isDone
                          ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                          : 'bg-slate-50/60 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#0D5C75] text-white animate-pulse'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-black text-[#0D5C75] uppercase px-1.5 py-0.2 rounded bg-white border border-[#A5D1E1]">
                            Saat Ini
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Description & Attachments */}
            <div className="px-5 sm:px-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Rincian Deskripsi Pengaduan:</span>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {mainDescParsed.cleanText || ticket.description}
                </p>
                {mainDescParsed.attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <AttachmentGallery attachments={mainDescParsed.attachments} />
                  </div>
                )}
              </div>

              {/* 4. Discussion Threads */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#0D5C75]" />
                  <span>Riwayat Balasan & Tindak Lanjut ({threads.filter(t => t.visibility !== 'internal').length})</span>
                </span>

                {threads.filter(t => t.visibility !== 'internal').length === 0 ? (
                  <div className="p-5 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-slate-200/60">
                    Belum ada balasan tambahan dari teknisi. Tim helpdesk sedang memproses tiket Anda.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {threads
                      .filter(t => t.visibility !== 'internal')
                      .map(th => {
                        const isSelf = th.sender_role === 'pengguna_umum';
                        const parsed = parseMessageAttachments(th.message);

                        return (
                          <div
                            key={th.thread_id}
                            className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                              isSelf
                                ? 'bg-slate-50 border-slate-200'
                                : 'bg-[#EAF4F8]/70 border-[#A5D1E1]/70'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className={isSelf ? 'text-slate-700' : 'text-[#0D5C75]'}>
                                {isSelf ? 'Tanggapan Anda' : (th.sender_name || 'Tim Helpdesk POSO')}
                              </span>
                              <span className="text-slate-400 font-normal text-[10px]">
                                {new Date(th.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {parsed.cleanText && <p className="whitespace-pre-wrap">{parsed.cleanText}</p>}
                            {parsed.attachments.length > 0 && <AttachmentGallery attachments={parsed.attachments} />}
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendCustomerReply} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ketik tanggapan atau informasi tambahan untuk teknisi..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                  />
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="submit"
                    disabled={isSendingReply || !replyMessage.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-all shadow-md shadow-[#0D5C75]/20 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </motion.button>
                </form>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
              Sistem Pelacakan Pengaduan Terpadu POSO v2.0
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
