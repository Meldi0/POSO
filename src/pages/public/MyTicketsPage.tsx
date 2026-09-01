import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Ticket } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft, 
  LogOut, 
  Inbox, 
  Clock, 
  ChevronRight, 
  FileText,
  Calendar,
  AlertCircle,
  Headphones,
  Compass
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { SlaCountdown } from '../../components/features/SlaCountdown';
import { parseTicketDetails } from '../../utils/ticketFormatter';

export const MyTicketsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'waiting' | 'closed'>('all');

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await apiService.getTickets();
        if (res && res.status === 'success' && res.data) {
          const allTickets = res.data.tickets || [];
          const userTickets = allTickets.filter(t => 
            (t.requester_email || '').toLowerCase() === user.email.toLowerCase()
          );
          setTickets(userTickets);
        }
      } catch (err) {
        console.error('Error fetching user tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTickets();
  }, [user]);

  const filteredTickets = tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSearch = 
      t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans pb-20 selection:bg-[#0D5C75] selection:text-white flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-[#E2E8F0]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-[10px] bg-[#0D5C75] flex items-center justify-center text-white">
              <Headphones size={18} />
            </Link>
            <div>
              <h1 className="text-[16px] font-bold text-[#0F172A] leading-tight">Tiket Saya</h1>
              <p className="text-[11px] text-[#64748B]">{user?.name || user?.email || 'Pelapor'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/submit"
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-[#0D5C75] text-white text-[13px] font-semibold hover:bg-[#083342] transition-colors shadow-sm"
            >
              <Plus size={15} /> Buat Tiket
            </Link>

            <Link
              to="/track"
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-[10px] border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
            >
              <Compass size={14} /> Lacak Tiket
            </Link>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="p-2 rounded-[10px] text-[#64748B] hover:text-[#DC2626] hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full space-y-6">
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Cari ID tiket, subjek, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-[10px] border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#199FB1]/30 transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-white border border-[#E2E8F0] rounded-[10px] p-1 gap-1 overflow-x-auto no-scrollbar">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'open', label: 'Open' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'waiting', label: 'Menunggu' },
              { key: 'closed', label: 'Selesai' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key as any)}
                className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === f.key
                    ? 'bg-[#0D5C75] text-white shadow-sm'
                    : 'text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-[16px] border border-[#E2E8F0] skeleton" />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#E2E8F0]/80 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF4F8] flex items-center justify-center mx-auto text-[#0D5C75]">
              <Inbox size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-[#0F172A]">Belum ada tiket pengaduan</h3>
            <p className="text-[13px] text-[#64748B] max-w-sm mx-auto">
              Anda belum memiliki tiket yang terdaftar dengan email {user?.email || 'ini'}.
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-[10px] bg-[#0D5C75] text-white text-[13px] font-semibold hover:bg-[#083342] transition-colors"
            >
              <Plus size={15} /> Ajukan Tiket Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((t) => {
              const parsed = parseTicketDetails(t.description, t.category);
              return (
                <div
                  key={t.ticket_id}
                  className="bg-white rounded-[16px] border border-[#E2E8F0]/80 p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-[#A5D1E1] transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[12px] font-bold text-[#0D5C75]">#{t.ticket_id}</span>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={t.status} />
                        <PriorityBadge priority={t.priority} />
                      </div>
                    </div>

                    <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2">
                      {t.subject}
                    </h3>

                    <p className="text-[12px] text-[#64748B] line-clamp-2">
                      {parsed.cleanDescription || t.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <SlaCountdown slaTarget={t.sla_due_at || t.created_at} isClosed={t.status === 'closed'} compact />
                    
                    <Link
                      to={`/track?id=${t.ticket_id}`}
                      className="text-[12px] font-bold text-[#199FB1] hover:text-[#0D5C75] flex items-center gap-1"
                    >
                      Detail & Tindak Lanjut →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-[#94A3B8]">
        POSO Helpdesk System © 2026
      </footer>
    </div>
  );
};

export default MyTicketsPage;
