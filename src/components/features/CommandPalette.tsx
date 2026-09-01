import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Users,
  Plus,
  Compass,
  ArrowRight,
  Database,
  Tag,
  Clock,
  Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badge';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  tickets?: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
}

const quickActions = [
  { id: 'new-ticket', label: 'Buat Tiket Baru', icon: Plus, description: 'Buka formulir pengajuan tiket', category: 'Aksi', to: '/submit' },
  { id: 'kanban', label: 'Triase Tiket (Dashboard)', icon: LayoutDashboard, description: 'Lihat papan triase & antrean kanban', category: 'Navigasi', to: '/dashboard' },
  { id: 'track', label: 'Lacak Status Tiket', icon: Compass, description: 'Cari progres tiket via ID', category: 'Navigasi', to: '/track' },
  { id: 'my-tickets', label: 'Daftar Tiket Saya', icon: Inbox, description: 'Lihat seluruh tiket akun pelapor', category: 'Navigasi', to: '/my-tickets' },
  { id: 'users', label: 'Manajemen Staf & UPT', icon: Users, description: 'Kelola peran admin, operator, teknisi', category: 'Navigasi', to: '/dashboard' },
];

export function CommandPalette({ open, onClose, tickets = [], onSelectTicket }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const matchedTickets = query.length >= 2
    ? tickets.filter((t) =>
        t.ticket_id.toLowerCase().includes(query.toLowerCase()) ||
        t.subject.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        (t.requester_email || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchedActions = query.length === 0
    ? quickActions
    : quickActions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
      );

  const allResults = [
    ...matchedTickets.map((t) => ({ type: 'ticket' as const, item: t })),
    ...matchedActions.map((a) => ({ type: 'action' as const, item: a })),
  ];

  const handleSelect = useCallback((result: typeof allResults[0]) => {
    if (!result) return;
    if (result.type === 'ticket') {
      if (onSelectTicket) {
        onSelectTicket(result.item);
      } else {
        navigate(`/track?id=${result.item.ticket_id}`);
      }
    } else {
      navigate((result.item as typeof quickActions[0]).to);
    }
    onClose();
  }, [navigate, onClose, onSelectTicket]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, allResults.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && allResults[activeIdx]) {
        e.preventDefault();
        handleSelect(allResults[activeIdx]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, allResults, activeIdx, handleSelect, onClose]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] z-50 overflow-hidden"
          >
            {/* Search Input Box */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E2E8F0]">
              <Search size={18} className="text-[#0D5C75] flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nomor ID tiket, subjek, menu navigasi..."
                className="w-full text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none bg-transparent"
              />
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {allResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#94A3B8]">
                  Tidak ada hasil yang cocok dengan "{query}"
                </div>
              ) : (
                allResults.map((res, idx) => {
                  const isSelected = idx === activeIdx;
                  if (res.type === 'ticket') {
                    const t = res.item;
                    return (
                      <div
                        key={t.ticket_id}
                        onClick={() => handleSelect(res)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected ? 'bg-[#EAF4F8] text-[#0D5C75]' : 'hover:bg-[#F8FAFC] text-[#0F172A]'
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#0D5C75]">#{t.ticket_id}</span>
                            <StatusBadge status={t.status} />
                            <PriorityBadge priority={t.priority} />
                          </div>
                          <p className="text-xs font-bold truncate">{t.subject}</p>
                          <p className="text-[11px] text-[#64748B] truncate mt-0.5">{t.category}</p>
                        </div>
                        <ArrowRight size={14} className={`flex-shrink-0 ${isSelected ? 'text-[#0D5C75]' : 'text-[#CBD5E1]'}`} />
                      </div>
                    );
                  }

                  const act = res.item;
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      onClick={() => handleSelect(res)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-[#EAF4F8] text-[#0D5C75]' : 'hover:bg-[#F8FAFC] text-[#0F172A]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-[#0D5C75] text-white' : 'bg-[#F1F5F9] text-[#0D5C75]'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold">{act.label}</p>
                          <p className="text-[11px] text-[#64748B] truncate">{act.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#94A3B8] px-2 py-0.5 rounded bg-[#F1F5F9]">
                        {act.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>Gunakan tombol panah ↑ ↓ untuk memilih, Enter untuk membuka</span>
              <span>POSO v2.0</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
