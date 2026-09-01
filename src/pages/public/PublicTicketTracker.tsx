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
  AlertCircle
} from 'lucide-react';
import { parseMessageAttachments, AttachmentGallery } from '../../components/common/AttachmentGallery';

export const PublicTicketTracker: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paramId = searchParams.get('id') || '';
  const paramEmail = searchParams.get('email') || '';

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
        await fetchTicket(ticket.ticket_id, email);
      }
    } finally {
      setIsSendingReply(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Open</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Waiting</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Closed (Selesai)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const mainDescParsed = ticket ? parseMessageAttachments(ticket.description) : { cleanText: '', attachments: [] };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-12 selection:bg-[#0D5C75] selection:text-white">
      {/* Simple Header */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <span className="text-xs font-bold text-[#0D5C75]">Pelacak Status Tiket</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Lacak Status Pengaduan</h1>
          <p className="text-xs text-slate-500">Masukkan ID Tiket yang telah Anda dapatkan untuk melihat progres pengerjaan</p>
        </div>

        {/* Search Card */}
        <form onSubmit={handleSearchSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor ID Tiket *</label>
              <input
                type="text"
                required
                placeholder="Contoh: TICK-20260901-1234"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:border-[#0D5C75]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Pelapor (Opsional)</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Mencari...' : 'Cari Data Tiket'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Ticket Details */}
        {ticket && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[#0D5C75] bg-[#EAF4F8] px-2 py-0.5 rounded">
                  #{ticket.ticket_id}
                </span>
                {getStatusBadge(ticket.status)}
              </div>
              <h2 className="text-base font-bold text-slate-900">{ticket.subject}</h2>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {ticket.category}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                <span className="font-semibold text-[#0D5C75]">Prioritas: {ticket.priority}</span>
                {ticket.sla_due_at && new Date(ticket.sla_due_at).getTime() < Date.now() && ticket.status !== 'closed' && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                    Over SLA
                  </span>
                )}
                {ticket.assigned_upt && <span className="font-semibold text-slate-700">Unit: {ticket.assigned_upt}</span>}
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Rincian Permasalahan:</span>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {mainDescParsed.cleanText || ticket.description}
                </div>
                {mainDescParsed.attachments.length > 0 && (
                  <div className="mt-2">
                    <AttachmentGallery attachments={mainDescParsed.attachments} />
                  </div>
                )}
              </div>

              {/* Thread History */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#0D5C75]" />
                  <span>Tindak Lanjut & Balasan</span>
                </span>

                {threads.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada balasan tambahan.</p>
                ) : (
                  <div className="space-y-2">
                    {threads.map(th => {
                      const isSelf = th.sender_role === 'pengguna_umum';
                      const parsed = parseMessageAttachments(th.message);

                      return (
                        <div
                          key={th.thread_id}
                          className={`p-3 rounded-lg border text-xs leading-relaxed space-y-1 ${
                            isSelf
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-[#EAF4F8]/50 border-[#A5D1E1]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className={isSelf ? 'text-slate-700' : 'text-[#0D5C75]'}>
                              {isSelf ? 'Tanggapan Anda' : 'Tim Helpdesk / UPT'}
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

              {/* Reply Form */}
              <form onSubmit={handleSendCustomerReply} className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ketik pesan tanggapan balasan..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
                />
                <button
                  type="submit"
                  disabled={isSendingReply || !replyMessage.trim()}
                  className="px-4 py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
