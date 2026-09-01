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
  Inbox
} from 'lucide-react';

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
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Open</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case 'waiting':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Waiting</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Closed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">{st}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-12 selection:bg-[#0D5C75] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 mb-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/submit"
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tiket</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Daftar Tiket Keluhan Saya</h1>
            <p className="text-xs text-slate-500 mt-0.5">Riwayat laporan yang diajukan oleh <span className="font-semibold text-slate-800">{user?.email}</span></p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari ID tiket, subjek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-2 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0D5C75]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Memuat riwayat tiket...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500">Tidak ada data tiket ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(ticket => (
              <div
                key={ticket.ticket_id}
                onClick={() => navigate(`/track?id=${ticket.ticket_id}`)}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#0D5C75]">
                      #{ticket.ticket_id}
                    </span>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{ticket.subject}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ticket.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{ticket.category}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#0D5C75]">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
