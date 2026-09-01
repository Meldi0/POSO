import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../../types';
import { SageTicketCard } from './SageTicketCard';
import { Inbox, Plus } from 'lucide-react';

interface SageKanbanBoardProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onStatusChange: (ticket: Ticket, newStatus: TicketStatus) => void;
  onNewTicketClick?: () => void;
}

const columns: { id: TicketStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: 'open', label: 'Open', color: '#0284C7', bg: '#EFF6FF', border: '#BAE6FD' },
  { id: 'in_progress', label: 'In Progress', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'waiting', label: 'Menunggu', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  { id: 'closed', label: 'Selesai', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
];

export const SageKanbanBoard: React.FC<SageKanbanBoardProps> = ({
  tickets,
  onTicketClick,
  onStatusChange,
  onNewTicketClick
}) => {
  const [draggingTicket, setDraggingTicket] = useState<Ticket | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TicketStatus | null>(null);

  const handleDragStart = (ticket: Ticket) => {
    setDraggingTicket(ticket);
  };

  const handleDragOver = (e: React.DragEvent, colId: TicketStatus) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (colId: TicketStatus) => {
    if (draggingTicket && draggingTicket.status !== colId) {
      onStatusChange(draggingTicket, colId);
    }
    setDraggingTicket(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full min-h-0 items-start overflow-x-auto pb-4 custom-scrollbar">
      {columns.map((col) => {
        const colTickets = tickets.filter((t) => (t.status || 'open') === col.id);
        const isDragTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(col.id)}
            className={`
              flex flex-col bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0] p-3 transition-all min-w-[280px]
              ${isDragTarget ? 'ring-2 ring-[#0D5C75] bg-[#EAF4F8]/40 shadow-md' : ''}
            `}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <h3 className="text-[13px] font-bold text-[#0F172A]">{col.label}</h3>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: col.bg, color: col.color, border: `1px solid ${col.border}` }}
                >
                  {colTickets.length}
                </span>
              </div>

              {col.id === 'open' && onNewTicketClick && (
                <button
                  type="button"
                  onClick={onNewTicketClick}
                  className="p-1 rounded-md text-[#64748B] hover:text-[#0D5C75] hover:bg-white transition-colors"
                  title="Tambah Tiket Cepat"
                >
                  <Plus size={15} />
                </button>
              )}
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 space-y-3 min-h-[300px] overflow-y-auto pr-0.5 custom-scrollbar">
              {colTickets.length === 0 ? (
                <div className="h-36 rounded-[12px] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center text-center p-4">
                  <Inbox size={20} className="text-[#94A3B8] mb-1" />
                  <p className="text-[12px] font-semibold text-[#94A3B8]">Tidak ada tiket</p>
                </div>
              ) : (
                colTickets.map((ticket) => (
                  <div
                    key={ticket.ticket_id}
                    draggable
                    onDragStart={() => handleDragStart(ticket)}
                  >
                    <SageTicketCard
                      ticket={ticket}
                      onClick={onTicketClick}
                      onStatusChange={onStatusChange}
                      isDragging={draggingTicket?.ticket_id === ticket.ticket_id}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SageKanbanBoard;
