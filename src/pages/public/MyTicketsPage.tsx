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
  Compass,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseTicketDetails } from '../../utils/ticketFormatter';

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
    <div className="min-h-screen bg-[#F4F7FB] text-[#0F172A] font-sans pb-16 selection:bg-[#0D5C75] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] py-3.5 px-4 sm:px-8 mb-6 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0D5C75] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/track"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] text-[#0D5C75] text-xs font-bold transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#0D5C75]" />
              <span>Lacak Tiket</span>
            </Link>

            <Link
              to="/submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-all shadow-sm shadow-[#0D5C75]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tiket</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Header Title & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Daftar Tiket Keluhan Saya</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Riwayat dan status seluruh laporan yang diajukan oleh <strong className="text-[#0D5C75]">{user?.email}</strong>
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari ID tiket, subjek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-slate-900 placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8F0]">
            <p className="text-xs text-slate-500 font-bold">Memuat riwayat tiket Anda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8F0] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Belum Ada Tiket yang Cocok</h3>
              <p className="text-xs text-slate-500">Tidak ada data laporan yang sesuai dengan pencarian Anda.</p>
            </div>
            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D5C75] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tiket Baru</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map(ticket => {
                const parsed = parseTicketDetails(ticket.description, ticket.category);
                return (
                  <motion.div
                    key={ticket.ticket_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/track?id=${ticket.ticket_id}`)}
                    className="bg-white rounded-3xl p-5 border border-[#E2E8F0] hover:border-[#199FB1] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3.5 shadow-xs"
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
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {parsed.cleanDescription || ticket.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-600 truncate max-w-[200px]">
                        {parsed.departmentAndTopic || ticket.category}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-[#0D5C75] hover:underline">
                        <span>Lacak Status</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
