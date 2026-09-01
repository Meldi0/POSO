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
  Filter,
  X,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MyTicketsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchMyTickets = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getTickets();
      if (res.status === 'success' && res.data) {
        setTickets(res.data.tickets || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const filtered = tickets.filter(t => {
    if (!t) return false;
    const matchSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">Open</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">In Progress</span>;
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">Waiting</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">{st}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 font-sans pb-16 selection:bg-[#0D5C75] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 py-3.5 px-4 mb-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0D5C75] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/submit"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tiket</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 space-y-5">
        {/* Page Title & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Daftar Tiket Pengaduan Saya</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Riwayat laporan yang diajukan oleh <span className="font-bold text-[#0D5C75]">{user?.email}</span>
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari ID tiket, subjek, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] shadow-xs transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { label: 'Semua Status', value: 'all' },
            { label: 'Open (Baru)', value: 'open' },
            { label: 'In Progress (Dikerjakan)', value: 'in_progress' },
            { label: 'Waiting (Menunggu)', value: 'waiting' },
            { label: 'Closed (Selesai)', value: 'closed' }
          ].map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                statusFilter === f.value
                  ? 'bg-[#0D5C75] text-white shadow-sm shadow-[#0D5C75]/25'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Ticket List / Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm">
            <p className="text-xs text-slate-500 font-bold">Memuat riwayat tiket Anda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-600">Tidak ada data tiket yang cocok dengan filter pencarian.</p>
            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D5C75] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Laporan Baru</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map(ticket => (
                <motion.div
                  key={ticket.ticket_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/track?id=${ticket.ticket_id}`)}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-[#199FB1] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3.5 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-black text-[#0D5C75] bg-[#EAF4F8] px-2.5 py-0.5 rounded-lg border border-[#A5D1E1]/40">
                        #{ticket.ticket_id}
                      </span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 hover:text-[#0D5C75] transition-colors">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ticket.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-600">{ticket.category}</span>
                    <span className="flex items-center gap-1 font-bold text-[#0D5C75]">
                      <span>Lacak Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
