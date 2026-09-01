import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Ticket } from '../../types';
import { SageSidebar, DashboardViewType } from '../../components/operator/SageSidebar';
import { SageTopBar } from '../../components/operator/SageTopBar';
import { SageKanbanBoard } from '../../components/operator/SageKanbanBoard';
import { SageTableView } from '../../components/operator/SageTableView';
import { SageTicketDrawer } from '../../components/operator/SageTicketDrawer';
import { SageTicketTrackerView } from '../../components/operator/SageTicketTrackerView';
import { UserManagement } from '../../components/admin/UserManagement';
import { DataSourceConfig } from '../../components/admin/DataSourceConfig';
import { Plus, Archive, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OperatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active view tab from sidebar (includes in-dashboard 'track' tab)
  const [activeView, setActiveView] = useState<DashboardViewType>('tickets');
  // View mode switcher (Kanban vs Table) on topbar
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | '7days' | 'month'
  
  // Selected ticket for drawer
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTickets = async () => {
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
    fetchTickets();
  }, []);

  // Filter tickets by search, category, and date (100% Null-Safe)
  const filteredTickets = tickets.filter(t => {
    if (!t) return false;
    const subj = String(t.subject || '').toLowerCase();
    const id = String(t.ticket_id || '').toLowerCase();
    const email = String(t.requester_email || '').toLowerCase();
    const desc = String(t.description || '').toLowerCase();
    const q = String(searchQuery || '').toLowerCase().trim();

    const matchSearch = !q || subj.includes(q) || id.includes(q) || email.includes(q) || desc.includes(q);
    
    const matchCategory = 
      selectedCategory === 'Semua Kategori' || String(t.category || '') === selectedCategory;

    // Date filtering logic
    let matchDate = true;
    if (dateFilter !== 'all' && t.created_at) {
      const ticketTime = new Date(t.created_at).getTime();
      const now = new Date();

      if (dateFilter === 'today') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        matchDate = ticketTime >= startOfToday;
      } else if (dateFilter === '7days') {
        const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        matchDate = ticketTime >= sevenDaysAgo;
      } else if (dateFilter === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        matchDate = ticketTime >= startOfMonth;
      }
    }

    return matchSearch && matchCategory && matchDate;
  });

  const openTicketsCount = tickets.filter(t => t.status !== 'closed').length;
  const closedTicketsCount = tickets.filter(t => t.status === 'closed').length;

  // Active triage tickets (Open, In Progress, Waiting)
  const activeTriageTickets = filteredTickets.filter(t => t.status !== 'closed');
  // Closed archived tickets
  const archiveTickets = filteredTickets.filter(t => t.status === 'closed');

  const handleUpdateTicketStatus = async (ticketId: string, status: string, assignedUpt?: string) => {
    setIsUpdatingStatus(true);
    // Optimistic instant UI update
    setTickets(prev => prev.map(t => {
      if (t.ticket_id === ticketId) {
        return { ...t, status: status as any, assigned_upt: assignedUpt || t.assigned_upt };
      }
      return t;
    }));

    if (selectedTicket && selectedTicket.ticket_id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: status as any, assigned_upt: assignedUpt || prev.assigned_upt } : null);
    }

    try {
      await apiService.updateTicketStatus({
        ticket_id: ticketId,
        status: status as any,
        assigned_upt: assignedUpt
      });
    } finally {
      setIsUpdatingStatus(false);
      fetchTickets();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans">
      {/* 1. Permanent Sticky Sidebar */}
      <SageSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        openTicketsCount={openTicketsCount}
        closedTicketsCount={closedTicketsCount}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Pinned Sticky Top Controls Header */}
        {(activeView === 'tickets' || activeView === 'archive') && (
          <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-4 pb-3 bg-[#F8FAFC]/95 backdrop-blur-xl border-b border-slate-200/60 shrink-0">
            <SageTopBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onRefresh={fetchTickets}
              isLoading={isLoading}
              onOpenCreateTicket={() => navigate('/submit')}
              onTrackClick={() => setActiveView('track')}
            />
          </header>
        )}

        {/* Scrollable Board & Workspace Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
          {/* View 1: Active Triage (Kanban Mode) */}
          {activeView === 'tickets' && viewMode === 'kanban' && (
            <div className="flex-1">
              <SageKanbanBoard
                tickets={activeTriageTickets}
                selectedTicketId={selectedTicket?.ticket_id || null}
                onSelectTicket={(t) => setSelectedTicket(t)}
                onQuickTriage={(t) => setSelectedTicket(t)}
                onMoveStatus={(id, st) => handleUpdateTicketStatus(id, st)}
              />
            </div>
          )}

          {/* View 1: Active Triage (Table Mode) */}
          {activeView === 'tickets' && viewMode === 'table' && (
            <div className="flex-1">
              <SageTableView
                tickets={activeTriageTickets}
                selectedTicketId={selectedTicket?.ticket_id || null}
                onSelectTicket={(t) => setSelectedTicket(t)}
                onQuickTriage={(t) => setSelectedTicket(t)}
              />
            </div>
          )}

          {/* View 2: Dedicated Archive Page (Closed Tickets) */}
          {activeView === 'archive' && (
            <div className="space-y-4 flex-1">
              <div className="p-4 bg-emerald-50/90 backdrop-blur-sm rounded-2xl border border-emerald-200/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm shadow-emerald-700/20">
                    <Archive className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-emerald-950">Arsip Tiket Selesai (Closed)</h2>
                    <p className="text-xs text-emerald-700 font-medium">Daftar seluruh tiket yang telah terselesaikan dan diverifikasi.</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 bg-white/90 text-emerald-800 rounded-xl border border-emerald-200 shadow-2xs">
                  Total: {archiveTickets.length} Tiket Selesai
                </span>
              </div>

              {viewMode === 'kanban' ? (
                <SageTableView
                  tickets={archiveTickets}
                  selectedTicketId={selectedTicket?.ticket_id || null}
                  onSelectTicket={(t) => setSelectedTicket(t)}
                  onQuickTriage={(t) => setSelectedTicket(t)}
                />
              ) : (
                <SageTableView
                  tickets={archiveTickets}
                  selectedTicketId={selectedTicket?.ticket_id || null}
                  onSelectTicket={(t) => setSelectedTicket(t)}
                  onQuickTriage={(t) => setSelectedTicket(t)}
                />
              )}
            </div>
          )}

          {/* View 3: In-Dashboard Lacak Status Tiket (Without Leaving Dashboard) */}
          {activeView === 'track' && (
            <div className="flex-1">
              <SageTicketTrackerView recentTickets={tickets} />
            </div>
          )}

          {/* View 4: Kelola Staf & UPT (Admin Only) */}
          {activeView === 'users' && (
            <div className="flex-1">
              <UserManagement />
            </div>
          )}

          {/* View 5: Sumber Data Google Drive (Admin Only) */}
          {activeView === 'datasource' && (
            <div className="flex-1">
              <DataSourceConfig />
            </div>
          )}
        </div>
      </main>

      {/* 3. Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => navigate('/submit')}
        title="Buat Tiket Baru"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#002B49] hover:bg-[#001D33] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-30 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* 4. Ticket Detail Drawer */}
      {selectedTicket && (
        <SageTicketDrawer
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateStatus={handleUpdateTicketStatus}
          isUpdating={isUpdatingStatus}
        />
      )}
    </div>
  );
};
