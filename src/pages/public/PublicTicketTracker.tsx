import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Ticket, ThreadMessage } from '../../types';
import { 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  Download, 
  Send, 
  Paperclip, 
  X, 
  ZoomIn, 
  Copy, 
  Check, 
  Info,
  Clock,
  User,
  Headphones
} from 'lucide-react';
import { StepperTimeline, Stage } from '../../components/features/StepperTimeline';
import { SlaCountdown } from '../../components/features/SlaCountdown';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { parseTicketDetails, parseThreadMessage } from '../../utils/ticketFormatter';
import { AttachmentGallery } from '../../components/common/AttachmentGallery';
import { useToast } from '../../context/ToastContext';
import { soundService } from '../../utils/sound';
import { realtimeService } from '../../services/realtime';

function LightboxModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white p-1 cursor-pointer">
          <X size={22} />
        </button>
        <img src={url} alt="Lampiran" className="rounded-[12px] w-full object-contain max-h-[80vh]" />
      </div>
    </div>
  );
}

export const PublicTicketTracker: React.FC = () => {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error, info } = useToast();

  const paramId = searchParams.get('id') || '';
  const paramEmail = searchParams.get('email') || '';

  const backDestination = isStaff ? '/dashboard' : user ? '/my-tickets' : '/';
  const backLabel = isStaff 
    ? 'Dashboard Operator' 
    : user 
    ? 'Tiket Saya' 
    : 'Beranda';

  const [ticketId, setTicketId] = useState(paramId);
  const [email, setEmail] = useState(paramEmail);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [threads, setThreads] = useState<ThreadMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const prevThreadCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  const formatThreadTime = (isoString?: string) => {
    if (!isoString) return 'Baru saja';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Baru saja';
      return `${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • ${d.toLocaleDateString('id-ID')}`;
    } catch {
      return 'Baru saja';
    }
  };

  const fetchTicket = async (id: string, mail?: string, showLoading = false) => {
    if (!id.trim()) return;
    if (showLoading) setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await apiService.trackTicket(id, mail);
      if (res.status === 'success' && res.data) {
        setTicket(res.data.ticket);
        const newThreads = Array.isArray(res.data.threads) ? res.data.threads : [];

        // Check if there are new incoming messages from operator/helpdesk
        if (!isInitialLoadRef.current && newThreads.length > prevThreadCountRef.current) {
          const latestMsg = newThreads[newThreads.length - 1];
          if (latestMsg) {
            const isFromSelf = 
              latestMsg.sender_role === 'pengguna_umum' || 
              (user?.name && (latestMsg.sender_name || '').toLowerCase().includes(user.name.toLowerCase()));
            
            if (!isFromSelf) {
              soundService.playIncomingMessageSound();
              soundService.notifyBrowser(`Balasan Baru di Tiket #${id}`, `${latestMsg.sender_name || 'Petugas'}: ${(latestMsg.message || '').slice(0, 60)}`);
              info(`💬 Tanggapan baru dari ${latestMsg.sender_name || 'Petugas'}`);
            }
          }
        }

        prevThreadCountRef.current = newThreads.length;
        isInitialLoadRef.current = false;
        setThreads(newThreads);
      } else {
        if (showLoading) {
          setTicket(null);
          setErrorMsg(res.message || 'Tiket tidak ditemukan. Pastikan nomor ID tiket Anda sesuai.');
        }
      }
    } catch (err: any) {
      if (showLoading) {
        setTicket(null);
        setErrorMsg(err.message || 'Terjadi gangguan saat memuat data tiket.');
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) {
      isInitialLoadRef.current = true;
      prevThreadCountRef.current = 0;
      fetchTicket(paramId, paramEmail, true);
    }
  }, [paramId, paramEmail]);

  // Ultra-fast Sub-50ms WebSocket Realtime Listener for tracking page
  useEffect(() => {
    if (!ticket?.ticket_id) return;

    const unsub = realtimeService.onNewMessage((newMsg) => {
      if (newMsg && newMsg.ticket_id === ticket.ticket_id) {
        setThreads((prev) => {
          if (prev.some(t => t.thread_id === newMsg.thread_id || (t.message === newMsg.message && t.sender_id === newMsg.sender_id))) {
            return prev;
          }
          return [...prev, newMsg];
        });
      }
    });

    const interval = setInterval(() => {
      fetchTicket(ticket.ticket_id, email, false);
    }, 3500);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [ticket?.ticket_id, email]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketId.trim()) {
      navigate(`/track?id=${encodeURIComponent(ticketId.trim())}${email.trim() ? `&email=${encodeURIComponent(email.trim())}` : ''}`, { replace: true });
      isInitialLoadRef.current = true;
      prevThreadCountRef.current = 0;
      fetchTicket(ticketId, email, true);
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

    const outgoingMsg = replyMessage.trim();
    setReplyMessage('');

    // Instant Optimistic UI update (0ms delay)
    const tempThread: ThreadMessage = {
      thread_id: `TH-TEMP-${Date.now()}`,
      ticket_id: ticket.ticket_id,
      sender_id: user?.user_id || 'USR-PUBLIC',
      sender_name: user?.name || ticket.requester_name || 'Pelapor',
      sender_role: 'pengguna_umum',
      message: outgoingMsg,
      visibility: 'public',
      created_at: new Date().toISOString()
    };

    setThreads((prev) => [...prev, tempThread]);
    prevThreadCountRef.current = (prevThreadCountRef.current || 0) + 1;
    soundService.playSentMessageSound();

    // Broadcast instantly to all other tabs and devices via WebSocket
    realtimeService.broadcastChatMessage(tempThread);

    setIsSendingReply(true);
    try {
      const res = await apiService.addThreadMessage({
        ticket_id: ticket.ticket_id,
        message: outgoingMsg,
        visibility: 'public'
      });

      if (res.status === 'success') {
        success('Tanggapan Anda berhasil dikirimkan.');
        await fetchTicket(ticket.ticket_id, email, false);
      }
    } catch (err) {
      console.warn('Reply error:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Convert ticket status to 1-4 stage
  const getStageFromStatus = (st?: string): Stage => {
    switch (st) {
      case 'open': return 1;
      case 'in_progress': return 2;
      case 'waiting': return 3;
      case 'closed': return 4;
      default: return 1;
    }
  };

  const parsedTicket = ticket 
    ? parseTicketDetails(ticket.description || '', ticket.category) 
    : { cleanDescription: '', location: '', departmentAndTopic: '', attachments: [] };

  const currentStage = getStageFromStatus(ticket?.status);

  const stageTimestamps: Partial<Record<Stage, string>> = ticket ? {
    1: ticket.created_at,
    2: currentStage >= 2 ? ticket.created_at : undefined,
    3: currentStage >= 3 ? ticket.updated_at : undefined,
    4: ticket.status === 'closed' ? ticket.updated_at : undefined,
  } : {};

  // Genuine follow up messages (Safely filter out initial description duplicate and internal notes)
  const followUpThreads = threads.filter((th, index) => {
    if (!th || typeof th.message !== 'string') return false;
    if (th.visibility === 'internal') return false;
    if (index === 0 && parsedTicket.cleanDescription && th.message.trim() === parsedTicket.cleanDescription.trim()) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans selection:bg-[#0D5C75] selection:text-white flex flex-col justify-between">
      {lightboxUrl && <LightboxModal url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/80 border-b border-[#E2E8F0]/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to={backDestination} className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0D5C75] transition-colors text-[13px] font-medium">
            <ArrowLeft size={15} /> {backLabel}
          </Link>
          <ChevronRight size={14} className="text-[#CBD5E1]" />
          <span className="text-[13px] font-semibold text-[#0D5C75]">Lacak Tiket</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Search Bar Card */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0]/80 shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-6">
          <h1 className="text-[22px] font-bold text-[#0F172A] mb-1">Lacak Status Tiket</h1>
          <p className="text-[14px] text-[#64748B] mb-4">Masukkan nomor ID tiket yang Anda terima saat pengajuan kendala</p>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                required
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Contoh: TICK-20260901-4521"
                className="w-full h-11 pl-9 pr-4 rounded-[10px] border border-[#E2E8F0] text-[14px] font-mono font-bold text-[#0D5C75] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#199FB1]/30 focus:border-[#199FB1] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-11 px-6 rounded-[10px] bg-[#0D5C75] text-white text-[14px] font-semibold hover:bg-[#083342] transition-colors flex-shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Mencari...' : 'Cari Tiket'}
            </button>
          </form>

          <p className="text-[12px] text-[#94A3B8] mt-3">
            Atau pantau seluruh tiket yang pernah Anda ajukan:{' '}
            <Link to="/my-tickets" className="text-[#199FB1] hover:text-[#0D5C75] font-semibold">Tiket Saya →</Link>
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5"
          >
            <Info size={18} className="text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Search Results */}
        {ticket && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Ticket Header & Stepper Card */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0]/80 shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 font-mono text-[12px] text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      <span>#{ticket.ticket_id}</span>
                      <button
                        onClick={handleCopyTicketId}
                        className="p-0.5 text-slate-400 hover:text-[#0D5C75] cursor-pointer"
                        title="Salin ID"
                      >
                        {copiedId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <h2 className="text-[18px] font-bold text-[#0F172A] leading-snug">{ticket.subject}</h2>
                  <p className="text-[13px] text-[#64748B] mt-1">
                    {parsedTicket.departmentAndTopic || ticket.category} · {parsedTicket.location || 'Seluruh Lokasi'}
                  </p>
                </div>

                <SlaCountdown
                  slaTarget={ticket.sla_due_at || ticket.created_at}
                  isClosed={ticket.status === 'closed'}
                />
              </div>

              {/* Stepper Timeline 4-Tahap */}
              <div className="py-5 border-t border-b border-[#F1F5F9] my-4">
                <StepperTimeline
                  currentStage={currentStage}
                  timestamps={stageTimestamps}
                  overSla={false}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wide">Deskripsi Masalah</h3>
                <div className="p-3.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] sm:text-[14px] text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                  {parsedTicket.cleanDescription || ticket.description}
                </div>
              </div>

              {/* Attachments */}
              {parsedTicket.attachments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wide mb-2">Lampiran Bukti</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsedTicket.attachments.map((att, idx) => (
                      <div key={idx} className="relative group">
                        {att.dataUrl ? (
                          <img
                            src={att.dataUrl}
                            alt={att.name}
                            className="w-20 h-20 rounded-[10px] object-cover border border-[#E2E8F0] cursor-pointer"
                            onClick={() => setLightboxUrl(att.dataUrl || null)}
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-[10px] border border-[#E2E8F0] bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 p-2 text-center">
                            {att.name}
                          </div>
                        )}
                        {att.dataUrl && (
                          <div className="absolute inset-0 bg-black/40 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={() => setLightboxUrl(att.dataUrl || null)} className="text-white cursor-pointer" title="Perbesar">
                              <ZoomIn size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conversation Thread Card */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0]/80 shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <h3 className="text-[14px] font-bold text-[#0F172A]">Riwayat Tanggapan & Perkembangan</h3>
                <span className="text-[12px] font-semibold text-[#64748B]">{followUpThreads.length} tanggapan</span>
              </div>

              {followUpThreads.length === 0 ? (
                <div className="p-6 rounded-[12px] bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center space-y-1">
                  <Info size={22} className="text-[#94A3B8] mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">Belum ada balasan tambahan dari teknisi</p>
                  <p className="text-[11px] text-[#64748B]">Tiket Anda sudah berada di antrean UPT terkait dan akan segera ditindaklanjuti.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {followUpThreads.map((th) => {
                    const isPelapor = th.sender_role === 'pengguna_umum';
                    const parsedTh = parseThreadMessage(th.message);

                    return (
                      <div
                        key={th.thread_id}
                        className={`p-3.5 rounded-[12px] border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                          isPelapor ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-[#EAF4F8]/70 border-[#A5D1E1]/70'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                              isPelapor ? 'bg-slate-200 text-slate-700' : 'bg-[#0D5C75] text-white'
                            }`}>
                              {isPelapor ? <User size={13} /> : <Headphones size={13} />}
                            </div>
                            <span className={isPelapor ? 'text-slate-800' : 'text-[#0D5C75]'}>
                              {isPelapor ? 'Tanggapan Pelapor' : (th.sender_name || 'Tim Petugas / Teknisi UPT')}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#94A3B8] font-normal">
                            {formatThreadTime(th.created_at)}
                          </span>
                        </div>

                        <p className="text-[13px] text-[#0F172A] pl-8 whitespace-pre-wrap font-normal">
                          {parsedTh.cleanText}
                        </p>

                        {parsedTh.attachments.length > 0 && (
                          <div className="pl-8 pt-1">
                            <AttachmentGallery attachments={parsedTh.attachments} />
                          </div>
                        )}
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
                  className="flex-1 h-10 px-3.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#199FB1]/30 focus:border-[#199FB1] transition-all"
                />
                <button
                  type="submit"
                  disabled={isSendingReply || !replyMessage.trim()}
                  className="h-10 px-5 rounded-[10px] bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer flex-shrink-0"
                >
                  <Send size={14} />
                  <span>{isSendingReply ? 'Mengirim...' : 'Kirim'}</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-[#94A3B8]">
        Sistem Pelacakan Pengaduan Terpadu POSO v2.0
      </footer>
    </div>
  );
};

export default PublicTicketTracker;
