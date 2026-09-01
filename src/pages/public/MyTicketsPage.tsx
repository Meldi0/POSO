import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Ticket } from '../../types';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Clock, 
  LogOut,
  ChevronRight,
  Inbox,
  Compass,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { parseTicketDetails } from '../../utils/ticketFormatter';

export const MyTicketsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMyTickets = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getTickets();
      if (res.status === 'success' && res.data) {
        setTickets(res.data.tickets);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const filtered = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Baru</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Diproses</span>;
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Menunggu</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Selesai</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">{st}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-16 selection:bg-[#002B49] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E2E8F0] py-3.5 px-4 sm:px-8 mb-6 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda POSO</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/track"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] text-[#002B49] text-xs font-bold transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#002B49]" />
              <span>Lacak Tiket</span>
            </Link>

            <Link
              to="/submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-xs font-bold transition-all shadow-sm shadow-[#002B49]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tiket Baru</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-[#64748B] hover:text-rose-600 text-xs font-semibold transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Daftar Tiket Keluhan Saya</h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Riwayat dan status seluruh laporan yang diajukan oleh <strong className="text-slate-900">{user?.email}</strong>
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari ID tiket, subjek kendala..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            />
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] font-medium">Memuat riwayat tiket...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#64748B] flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#0F172A]">Belum Ada Tiket yang Diajukan</h3>
              <p className="text-xs text-[#64748B]">Anda belum memiliki riwayat pelaporan kendala dinas.</p>
            </div>
            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#002B49] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tiket Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(ticket => {
              const parsed = parseTicketDetails(ticket.description, ticket.category);
              return (
                <div
                  key={ticket.ticket_id}
                  onClick={() => navigate(`/track?id=${ticket.ticket_id}`)}
                  className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#002B49] px-2 py-0.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        #{ticket.ticket_id}
                      </span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <h3 className="font-bold text-sm text-[#0F172A] line-clamp-1">{ticket.subject}</h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{parsed.cleanDescription}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                    <span className="font-medium truncate max-w-[200px]">{parsed.departmentAndTopic}</span>
                    <span className="flex items-center gap-1 font-bold text-[#002B49] hover:underline">
                      <span>Lacak Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
