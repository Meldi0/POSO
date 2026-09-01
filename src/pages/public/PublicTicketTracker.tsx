import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

export const PublicTicketTracker: React.FC = () => {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramId = searchParams.get('id') || '';
  const paramEmail = searchParams.get('email') || '';

  // Dynamic Navigation Target Based on Role
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

  // Filter out redundant initial submission from threads so we only show genuine follow-up messages
  const followUpThreads = threads.filter((th, index) => {
    // If first message matches ticket description, we skip it because it's already shown in "Deskripsi Keluhan"
    if (index === 0 && (th.message.includes(parsedTicket.cleanDescription) || th.sender_role === 'pengguna_umum')) {
      return false;
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#002B49] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* 0. SOFT CLEAN BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFD] via-[#F8FAFC] to-[#F1F5F9]" />
        
        <motion.div 
          animate={{
            x: [-20, 30, -20],
            y: [-15, 25, -15],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-20 w-[800px] h-[800px] rounded-full bg-[#002B49]/10 blur-[110px]"
        />

        <motion.div 
          animate={{
            x: [30, -30, 30],
            y: [20, -20, 20],
            scale: [1.05, 0.95, 1.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-24 w-[750px] h-[750px] rounded-full bg-[#F97316]/10 blur-[110px]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(#002B49_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.05]" />
      </div>

      {/* 1. FIXED TOP BAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-[#E2E8F0] shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <Link to={backDestination} className="flex items-center gap-3.5 group">
            <motion.div 
              whileHover={{ rotate: 6, scale: 1.08 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#0D5C75] p-0.5 shadow-md shadow-[#002B49]/20 flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#002B49] to-[#0D5C75] flex items-center justify-center border border-white/20">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <path d="M16 3L26 8V16C26 22 21.5 26.5 16 28C10.5 26.5 6 22 6 16V8L16 3Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M10 13L16 9.5L22 13L16 19L10 13Z" fill="#FFFFFF" />
                  <path d="M12 18.5L16 16L20 18.5L16 23L12 18.5Z" fill="#FFFFFF" fillOpacity="0.75" />
                  <circle cx="16" cy="16" r="2" fill="#F97316" />
                </svg>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-[#002B49] tracking-tight block leading-none">POSO</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#002B49]/10 text-[#002B49] border border-[#002B49]/25">v2.0</span>
              </div>
              <span className="text-[11px] font-bold text-[#64748B] mt-1 block">Pelacak Status Pengaduan</span>
            </div>
          </Link>

          <Link
            to={backDestination}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN TRACKING CONTAINER */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Pelacakan Status Tiket</h1>
          <p className="text-sm text-[#64748B] max-w-md mx-auto">
            Pantau perkembangan tindak lanjut penanganan kendala dinas Anda secara transparan
          </p>
        </div>

        {/* SEARCH BAR CARD */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor ID Tiket <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: TICK-20260901-4521"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm font-mono text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Pelapor (Opsional)
              </label>
              <input
                type="email"
                placeholder="nama@posindonesia.co.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-sm font-bold transition-all shadow-md shadow-[#002B49]/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Mencari Data Tiket...' : 'Lacak Status Tiket'}</span>
          </button>
        </motion.form>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-2xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* =================================================================================================
            HASIL PELACAKAN TIKET (JELAS, TERSTRUKTUR & MUDAH DIMENGERTI)
        ================================================================================================= */}
        {ticket && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 1. KARTU HEADER & STATUS ROADMAP */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
              
              {/* Baris Atas: ID Tiket, Status Badge, & Tanggal */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-sm font-bold text-[#002B49]">
                    <span>#{ticket.ticket_id}</span>
                    <button
                      type="button"
                      onClick={handleCopyTicketId}
                      title="Salin ID Tiket"
                      className="p-1 rounded-md text-slate-400 hover:text-[#002B49] transition-colors"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {getStatusBadge(ticket.status)}
                </div>

                <div className="text-xs text-[#64748B] font-medium flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Diajukan: {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Subjek Laporan */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Subjek Kendala:</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                  {ticket.subject}
                </h2>
              </div>

              {/* ROADMAP STEPPER 4 TAHAP */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
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
                        className={`p-3.5 rounded-xl border transition-all ${
                          st === 'done'
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : st === 'active'
                            ? 'bg-sky-50/70 border-sky-300 text-[#002B49] shadow-xs'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            st === 'done'
                              ? 'bg-emerald-600 text-white'
                              : st === 'active'
                              ? 'bg-[#002B49] text-white animate-pulse'
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

              {/* METADATA CARDS (GRID 4 KOLOM BERSIH & RAPI) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                
                {/* 1. Kategori / Topik */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B]">
                    <Layers className="w-3.5 h-3.5 text-[#002B49]" />
                    <span>Department & Topik</span>
                  </div>
                  <p className="text-xs font-bold text-[#0F172A] truncate" title={parsedTicket.departmentAndTopic}>
                    {parsedTicket.departmentAndTopic}
                  </p>
                </div>

                {/* 2. Lokasi Kantor */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B]">
                    <MapPin className="w-3.5 h-3.5 text-[#002B49]" />
                    <span>Lokasi Penempatan</span>
                  </div>
                  <p className="text-xs font-bold text-[#0F172A] truncate" title={parsedTicket.location}>
                    {parsedTicket.location}
                  </p>
                </div>

                {/* 3. Unit Penugasan (UPT) */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B]">
                    <Building2 className="w-3.5 h-3.5 text-[#002B49]" />
                    <span>Disposisi UPT</span>
                  </div>
                  <p className="text-xs font-bold text-[#0F172A] truncate" title={ticket.assigned_upt || 'Menunggu Disposisi'}>
                    {ticket.assigned_upt || 'Menunggu Disposisi'}
                  </p>
                </div>

                {/* 4. Prioritas & SLA */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B]">
                    <Clock className="w-3.5 h-3.5 text-[#002B49]" />
                    <span>Tingkat Prioritas</span>
                  </div>
                  <p className="text-xs font-bold text-[#0F172A]">
                    {ticket.priority} (SLA 24 Jam)
                  </p>
                </div>

              </div>
            </div>

            {/* 2. KARTU RINCIAN KELUHAN DARI PELAPOR (BERSIH TANPA TAG KURUNG) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#002B49]" />
                <span>Deskripsi Keluhan Pelapor</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap font-normal">
                {parsedTicket.cleanDescription}
              </div>

              {/* Galeri Lampiran jika ada */}
              {parsedTicket.attachments.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">Berkas Lampiran Pendukung:</span>
                  <AttachmentGallery attachments={parsedTicket.attachments} />
                </div>
              )}
            </div>

            {/* 3. KARTU RIWAYAT TANGGAPAN & TINDAK LANJUT (CONVERSATION THREAD) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#002B49]" />
                  <span>Riwayat Tanggapan & Perkembangan</span>
                </h3>
                <span className="text-xs font-semibold text-[#64748B]">
                  {followUpThreads.length} Tanggapan
                </span>
              </div>

              {/* Thread Messages List */}
              {followUpThreads.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center space-y-1">
                  <Info className="w-6 h-6 text-[#94A3B8] mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">Belum ada balasan tambahan dari teknisi</p>
                  <p className="text-[11px] text-[#64748B]">Tiket Anda sudah masuk ke antrean dan sedang dalam penanganan unit kerja terkait.</p>
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
                        className={`p-4 rounded-xl border text-sm leading-relaxed space-y-2 ${
                          isPelapor
                            ? 'bg-[#F8FAFC] border-[#E2E8F0]'
                            : 'bg-sky-50/60 border-sky-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isPelapor ? 'bg-slate-200 text-slate-700' : 'bg-[#002B49] text-white'
                            }`}>
                              {isPelapor ? <User className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`font-bold ${isPelapor ? 'text-slate-800' : 'text-[#002B49]'}`}>
                              {isPelapor ? 'Tanggapan Pelapor' : 'Tim Petugas / Teknisi UPT'}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#94A3B8]">
                            {new Date(th.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {new Date(th.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#0F172A] font-normal leading-relaxed pl-8">
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

              {/* Form Balasan Cepat Pelapor */}
              <form onSubmit={handleSendCustomerReply} className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Ketik tanggapan atau informasi tambahan untuk teknisi..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] transition-all"
                />
                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="px-5 py-2.5 bg-[#002B49] hover:bg-[#001D33] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-[#002B49]/20 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingReply ? 'Mengirim...' : 'Kirim Balasan'}</span>
                </button>
              </form>

            </div>

          </motion.div>
        )}

      </main>
    </div>
  );
};
