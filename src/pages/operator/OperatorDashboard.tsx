import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  LayoutGrid, 
  TableIcon, 
  Compass, 
  Users, 
  Database,
  BarChart3,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Ticket, TicketStatus, TicketPriority } from '../../types';
import { SageSidebar, DashboardViewType } from '../../components/operator/SageSidebar';
import { SageTopBar } from '../../components/operator/SageTopBar';
import { SageKanbanBoard } from '../../components/operator/SageKanbanBoard';
import { SageTableView } from '../../components/operator/SageTableView';
import { SageTicketDrawer } from '../../components/operator/SageTicketDrawer';
import { SageTicketTrackerView } from '../../components/operator/SageTicketTrackerView';
import { UserManagement } from '../../components/admin/UserManagement';
import { DataSourceConfig } from '../../components/admin/DataSourceConfig';
import { CommandPalette } from '../../components/features/CommandPalette';
import { OperatorTicketModal } from '../../components/operator/OperatorTicketModal';
import { useToast } from '../../context/ToastContext';
import { soundService } from '../../utils/sound';

export const OperatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { success, error: toastError, info } = useToast();

  // Navigation & Layout state
  const [activeView, setActiveView] = useState<DashboardViewType>('kanban');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Tickets & Data state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalTicket, setModalTicket] = useState<Ticket | null>(null);

  const prevTicketCountRef = useRef<number>(0);
  const isInitialTicketLoadRef = useRef<boolean>(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Coral FAB auto-collapse state
  const [fabCollapsed, setFabCollapsed] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Request browser notification permission once
  useEffect(() => {
    soundService.requestNotificationPermission().catch(() => {});
  }, []);

  // FAB collapse on scroll
  useEffect(() => {
    const resetIdle = () => {
      setFabCollapsed(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setFabCollapsed(false), 2000);
    };
    window.addEventListener('scroll', resetIdle, { passive: true });
    return () => {
      window.removeEventListener('scroll', resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // Fetch Tickets from Database
  const fetchTickets = async (silent = false) => {
    try {
      if (!silent) setIsSyncing(true);
      const res = await apiService.getTickets();
      if (res && res.status === 'success' && res.data) {
        const newTickets = res.data.tickets || [];
        
        // Check for newly arrived tickets submitted from other devices
        if (!isInitialTicketLoadRef.current && newTickets.length > prevTicketCountRef.current) {
          const newest = newTickets[0];
          soundService.playIncomingMessageSound();
          soundService.notifyBrowser(`Tiket Baru Masuk #${newest.ticket_id}`, `${newest.subject} (${newest.category})`);
          info(`🔔 Tiket baru masuk: #${newest.ticket_id} - ${newest.subject}`);
        }

        prevTicketCountRef.current = newTickets.length;
        isInitialTicketLoadRef.current = false;
        setTickets(newTickets);
      }
    } catch (err: any) {
      if (!silent) {
        console.error('Failed to load tickets:', err);
        toastError(err.message || 'Gagal memuat tiket dari database');
      }
    } finally {
      if (!silent) setIsSyncing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(false);

    // Fast background multi-device auto-sync every 5 seconds
    const interval = setInterval(() => {
      fetchTickets(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.email]);

  // Fast Status Change Handler
  const handleStatusChange = async (ticket: Ticket, newStatus: TicketStatus) => {
    // Optimistic UI update
    setTickets((prev) =>
      prev.map((t) => (t.ticket_id === ticket.ticket_id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
    );
    if (selectedTicket?.ticket_id === ticket.ticket_id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await apiService.updateTicketStatus({
        ticket_id: ticket.ticket_id,
        status: newStatus
      });

      if (res.status === 'success') {
        success(`Tiket #${ticket.ticket_id} dipindah ke status ${newStatus}`);
      } else {
        toastError(res.message || 'Gagal memperbarui status');
        fetchTickets();
      }
    } catch (err: any) {
      toastError(err.message || 'Terjadi gangguan koneksi');
      fetchTickets();
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (tickets.length === 0) {
      info('Tidak ada data tiket untuk diekspor.');
      return;
    }

    const headers = ['ID Tiket', 'Subjek', 'Kategori', 'Pelapor', 'Email', 'Prioritas', 'Status', 'Unit UPT', 'Tanggal Dibuat'];
    const rows = filteredTickets.map((t) => [
      t.ticket_id,
      `"${(t.subject || '').replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.requester_name || '').replace(/"/g, '""')}"`,
      t.requester_email,
      t.priority,
      t.status,
      `"${(t.assigned_upt || '').replace(/"/g, '""')}"`,
      new Date(t.created_at).toLocaleString('id-ID'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `POSO_Tiket_Ekspor_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Data tiket berhasil diekspor ke CSV.');
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchStatus = selectedStatus === 'all' || (t.status || 'open') === selectedStatus;
    const matchSearch =
      t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.requester_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.requester_email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  // Calculate Real Stats Strip
  const stats = {
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    waiting: tickets.filter((t) => t.status === 'waiting').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
    urgent: tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'closed').length,
    total: tickets.length,
  };

  return (
    <div className="flex h-screen bg-[#F4F7F9] text-[#0F172A] font-sans overflow-hidden selection:bg-[#0D5C75] selection:text-white">
      
      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        tickets={tickets}
        onSelectTicket={(t) => setSelectedTicket(t)}
      />

      {/* Left Sidebar */}
      <SageSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        activeView={activeView}
        onViewChange={(v) => setActiveView(v)}
        ticketCounts={stats}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workstation Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Bar */}
        <SageTopBar
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          activeView={activeView}
          onViewChange={setActiveView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onRefresh={fetchTickets}
          onExport={handleExportCSV}
          onNewTicketClick={() => window.open('/submit', '_blank')}
          isSyncing={isSyncing}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
          
          {/* 1. STATS STRIP (MATCHING FIGMA 6 CHIPS) */}
          {(activeView === 'kanban' || activeView === 'table') && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 flex-shrink-0">
              {[
                { label: 'Open', value: stats.open, color: '#0284C7', bg: '#EFF6FF', border: '#BAE6FD' },
                { label: 'In Progress', value: stats.in_progress, color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
                { label: 'Menunggu', value: stats.waiting, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                { label: 'Selesai Hari Ini', value: stats.closed, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
                { label: 'Urgent Aktif', value: stats.urgent, color: '#F58A61', bg: '#FFF7ED', border: '#FFEDD5' },
                { label: 'Total Tiket', value: stats.total, color: '#0D5C75', bg: '#EAF4F8', border: '#A5D1E1' },
              ].map(({ label, value, color, bg, border }) => (
                <div
                  key={label}
                  className="rounded-[12px] border p-3 flex flex-col gap-0.5 shadow-2xs transition-all"
                  style={{ backgroundColor: bg, borderColor: border }}
                >
                  <span className="text-[22px] font-bold leading-tight font-mono" style={{ color }}>
                    {value}
                  </span>
                  <span className="text-[11px] font-semibold text-[#64748B]">{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* 2. DYNAMIC WORKSPACE VIEW ROUTING */}
          <div className="flex-1 min-h-0">
            {activeView === 'kanban' && (
              <SageKanbanBoard
                tickets={filteredTickets}
                onTicketClick={(t) => setSelectedTicket(t)}
                onStatusChange={handleStatusChange}
                onNewTicketClick={() => window.open('/submit', '_blank')}
              />
            )}

            {activeView === 'table' && (
              <SageTableView
                tickets={filteredTickets}
                onTicketClick={(t) => setSelectedTicket(t)}
                onStatusChange={handleStatusChange}
              />
            )}

            {activeView === 'track' && (
              <SageTicketTrackerView
                recentTickets={tickets}
              />
            )}

            {activeView === 'users' && isAdmin && (
              <UserManagement />
            )}

            {activeView === 'datasource' && isAdmin && (
              <DataSourceConfig />
            )}

            {activeView === 'reports' && (
              <div className="bg-white rounded-[16px] border border-[#E2E8F0]/80 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#EAF4F8] flex items-center justify-center text-[#0D5C75]">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0F172A]">Laporan Kepatuhan SLA & Kinerja</h3>
                    <p className="text-[12px] text-[#64748B]">Rekapitulasi beban kerja dan waktu penyelesaian tiket</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase">Tingkat Resolusi</span>
                    <p className="text-[24px] font-bold text-[#10B981]">
                      {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 100}%
                    </p>
                  </div>

                  <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase">Rata-Rata Respons</span>
                    <p className="text-[24px] font-bold text-[#0D5C75]">≤ 1.8 Jam</p>
                  </div>

                  <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase">Tiket Lewat SLA</span>
                    <p className="text-[24px] font-bold text-[#059669]">0 Tiket</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button (FAB) Coral `#F58A61` */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open('/submit', '_blank')}
        className="fixed bottom-6 right-6 z-30 h-13 px-4 rounded-full bg-[#F58A61] hover:bg-[#E77448] text-white shadow-xl shadow-[#F58A61]/35 flex items-center gap-2 font-bold text-sm transition-all cursor-pointer"
        title="Buat Tiket Baru"
      >
        <Plus size={20} />
        {!fabCollapsed && <span className="pr-1 whitespace-nowrap">Tiket Baru</span>}
      </motion.button>

      {/* Slide-out Ticket Drawer */}
      <SageTicketDrawer
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleStatusChange}
        onTicketUpdated={fetchTickets}
      />

      {/* Operator Detail Modal (if opened via legacy trigger) */}
      {modalTicket && (
        <OperatorTicketModal
          ticket={modalTicket}
          onClose={() => setModalTicket(null)}
          onTicketUpdated={() => {
            setModalTicket(null);
            fetchTickets();
          }}
        />
      )}

    </div>
  );
};

export default OperatorDashboard;
