import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
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
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Building2,
  MapPin,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Layers,
  Sparkles,
  Paperclip,
  Info
} from 'lucide-react';
import { parseTicketDetails, parseThreadMessage } from '../../utils/ticketFormatter';
import { AttachmentGallery } from '../../components/common/AttachmentGallery';
import { useToast } from '../../context/ToastContext';

export const PublicTicketTracker: React.FC = () => {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramId = searchParams.get('id') || '';
  const paramEmail = searchParams.get('email') || '';
  const { success, error, info } = useToast();

  const backDestination = isStaff ? '/dashboard' : user ? '/my-tickets' : '/';
  const backLabel = isStaff 
    ? 'Kembali ke Dashboard' 
    : user 
    ? 'Kembali ke Tiket Saya' 
    : 'Kembali ke Beranda';

  const [ticketId, setTicketId] = useState(paramId);
  const [email, setEmail] = useState(paramEmail);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [threads, setThreads] = useState<ThreadMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const fetchTicket = async (id: string, mail?: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await apiService.trackTicket(id, mail);
      if (res.status === 'success' && res.data) {
        setTicket(res.data.ticket);
        setThreads(res.data.threads || []);
      } else {
        setTicket(null);
        setErrorMsg(res.message || 'Tiket tidak ditemukan. Pastikan nomor ID tiket Anda sesuai.');
      }
    } catch (err: any) {
      setTicket(null);
      setErrorMsg(err.message || 'Terjadi gangguan saat memuat data tiket.');
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
    if (ticketId.trim()) {
      navigate(`/track?id=${encodeURIComponent(ticketId.trim())}${email.trim() ? `&email=${encodeURIComponent(email.trim())}` : ''}`, { replace: true });
      fetchTicket(ticketId, email);
    }
  };

  const handleCopyTicketId = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.ticket_id);
    setCopiedId(true);
    info(`ID Tiket #${ticket.ticket_id} disalin.`);
    setTimeout(() => setCopiedId(false), 2000);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Laporan Masuk (Baru)
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Sedang Diproses UPT
          </span>
        );
      case 'waiting':
        return (
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Menunggu Tanggapan
          </span>
        );
      case 'closed':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Tuntas / Selesai
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{status}</span>;
    }
  };

  const getStepStatus = (stepIdx: number, currentStatus: string) => {
    if (currentStatus === 'closed') return 'done';
    if (stepIdx === 0) return 'done';
    if (stepIdx === 1 && (currentStatus === 'in_progress' || currentStatus === 'waiting')) return 'done';
    if (stepIdx === 2 && currentStatus === 'in_progress') return 'active';
    if (stepIdx === 2 && currentStatus === 'waiting') return 'active';
    return 'pending';
  };

  // Clean parsed ticket description & metadata
  const parsedTicket = ticket 
    ? parseTicketDetails(ticket.description, ticket.category) 
    : { cleanDescription: '', location: '', departmentAndTopic: '', attachments: [] };

  // Filter out redundant initial submission from threads
  const followUpThreads = threads.filter((th, index) => {
    if (index === 0 && (th.message.includes(parsedTicket.cleanDescription) || th.sender_role === 'pengguna_umum')) {
      return false;
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] text-[#0F172A] font-sans selection:bg-[#0D5C75] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Fixed Top Bar */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] sticky top-0 z-40 py-3.5 px-4 sm:px-8 mb-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={backDestination} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0D5C75] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
          <span className="text-xs font-black text-[#0D5C75] bg-[#EAF4F8] px-3 py-1 rounded-full border border-[#A5D1E1]/40">
            Pelacak Status Pengaduan
          </span>
        </div>
      </header>

      {/* 2. Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-20 w-full space-y-6 flex-1">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Pelacakan Status Tiket</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Pantau perkembangan tindak lanjut penanganan kendala dinas Anda secara transparan
          </p>
        </div>

        {/* Search Bar Card */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor ID Tiket <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: TICK-20260901-4521"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm font-mono font-bold text-[#0D5C75] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Pelapor (Opsional)
              </label>
              <input
                type="email"
                placeholder="nama@posindonesia.co.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Mencari Data Tiket...' : 'Lacak Status Tiket'}</span>
          </motion.button>
        </motion.form>

        {/* Error Notification */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-2xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Tracking Results */}
        {ticket && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 1. Header Card & Roadmap */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs sm:text-sm font-bold text-[#0D5C75]">
                    <span>#{ticket.ticket_id}</span>
                    <button
                      type="button"
                      onClick={handleCopyTicketId}
                      title="Salin ID Tiket"
                      className="p-1 rounded-md text-slate-400 hover:text-[#0D5C75] transition-colors cursor-pointer"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {getStatusBadge(ticket.status)}
                </div>

                <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Diajukan: {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subjek Kendala:</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {ticket.subject}
                </h2>
              </div>

              {/* Roadmap Stepper 4 Tahap */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Tahapan Penanganan Tiket:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { step: 1, title: 'Laporan Masuk', desc: 'Tercatat di sistem POSO' },
                    { step: 2, title: 'Triase Operator', desc: 'Verifikasi & disposisi UPT' },
                    { step: 3, title: 'Pengerjaan UPT', desc: ticket.assigned_upt || 'Unit teknis terkait' },
                    { step: 4, title: 'Tuntas & Selesai', desc: 'Kendala terselesaikan' }
                  ].map((s, idx) => {
                    const st = getStepStatus(idx, ticket.status);
                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          st === 'done'
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : st === 'active'
                            ? 'bg-[#EAF4F8] border-[#199FB1] text-[#0D5C75] shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            st === 'done'
                              ? 'bg-emerald-600 text-white'
                              : st === 'active'
                              ? 'bg-[#0D5C75] text-white animate-pulse'
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {st === 'done' ? <Check className="w-3 h-3" /> : s.step}
                          </div>
                          <span className="font-bold text-xs">{s.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight pl-7">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <Layers className="w-3.5 h-3.5 text-[#0D5C75]" />
                    <span>Department & Topik</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate" title={parsedTicket.departmentAndTopic}>
                    {parsedTicket.departmentAndTopic || ticket.category}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-[#0D5C75]" />
                    <span>Lokasi Penempatan</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate" title={parsedTicket.location}>
                    {parsedTicket.location || 'Seluruh Kantor'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-[#0D5C75]" />
                    <span>Disposisi UPT</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate" title={ticket.assigned_upt || 'Menunggu Disposisi'}>
                    {ticket.assigned_upt || 'Menunggu Disposisi'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#0D5C75]" />
                    <span>Tingkat Prioritas</span>
                  </div>
                  <p className="text-xs font-bold text-[#0D5C75]">
                    {ticket.priority} (SLA 24 Jam)
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Complaint Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0D5C75]" />
                <span>Deskripsi Keluhan Pelapor</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                {parsedTicket.cleanDescription || ticket.description}
              </div>

              {parsedTicket.attachments.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">Berkas Lampiran Pendukung:</span>
                  <AttachmentGallery attachments={parsedTicket.attachments} />
                </div>
              )}
            </div>

            {/* 3. Conversation Thread Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0D5C75]" />
                  <span>Riwayat Tanggapan & Perkembangan</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {followUpThreads.length} Tanggapan
                </span>
              </div>

              {followUpThreads.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-1">
                  <Info className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">Belum ada balasan tambahan dari teknisi</p>
                  <p className="text-[11px] text-slate-500">Tiket Anda sudah masuk ke antrean dan sedang dalam penanganan unit kerja terkait.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {followUpThreads.map((th) => {
                    const isPelapor = th.sender_role === 'pengguna_umum';
                    const parsedTh = parseThreadMessage(th.message);

                    return (
                      <motion.div
                        key={th.thread_id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 ${
                          isPelapor
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-[#EAF4F8]/70 border-[#A5D1E1]/70'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isPelapor ? 'bg-slate-200 text-slate-700' : 'bg-[#0D5C75] text-white'
                            }`}>
                              {isPelapor ? <User className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`font-bold ${isPelapor ? 'text-slate-800' : 'text-[#0D5C75]'}`}>
                              {isPelapor ? 'Tanggapan Pelapor' : (th.sender_name || 'Tim Petugas / Teknisi UPT')}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(th.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {new Date(th.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed pl-8 whitespace-pre-wrap">
                          {parsedTh.cleanText}
                        </p>

                        {parsedTh.attachments.length > 0 && (
                          <div className="pl-8 pt-1">
                            <AttachmentGallery attachments={parsedTh.attachments} />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Reply Input Form */}
              <form onSubmit={handleSendCustomerReply} className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Ketik tanggapan atau informasi tambahan untuk teknisi..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={isSendingReply || !replyMessage.trim()}
                  className="px-5 py-2.5 bg-[#0D5C75] hover:bg-[#083342] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-[#0D5C75]/20 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingReply ? 'Mengirim...' : 'Kirim Balasan'}</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
