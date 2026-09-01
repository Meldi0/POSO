import React from 'react';
import { Ticket } from '../../types';
import { 
  Clock, 
  User, 
  ShieldCheck, 
  Flame, 
  Edit3, 
  CheckCircle2,
  PlayCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { parseMessageAttachments } from '../common/AttachmentGallery';

interface SageTicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
  onQuickTriage: (ticket: Ticket) => void;
  onMoveStatus?: (ticketId: string, newStatus: string) => void;
}

export const SageTicketCard: React.FC<SageTicketCardProps> = ({
  ticket,
  isSelected,
  onSelect,
  onQuickTriage,
  onMoveStatus
}) => {
  const p = String(ticket.priority || 'Medium');
  const isUrgent = p.toLowerCase() === 'urgent';
  const isHigh = p.toLowerCase() === 'high';

  const timeFormatted = ticket.created_at 
    ? new Date(ticket.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '-';

  const { cleanText, attachments } = parseMessageAttachments(ticket.description || '');
  const hasImages = attachments.some(a => a.dataUrl || (a.name && /\.(png|jpe?g|gif|webp)$/i.test(a.name)));

  const isOverSla = ticket.sla_due_at && new Date(ticket.sla_due_at).getTime() < Date.now() && ticket.status !== 'closed';

  const getPriorityBadge = () => {
    return (
      <div className="flex items-center gap-1">
        {isOverSla && (
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-600 text-white shadow-xs animate-pulse" title="Over SLA">
            Over SLA
          </span>
        )}
        {isUrgent ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 fill-rose-500" />
            <span>Urgent</span>
          </span>
        ) : isHigh ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs">
            High
          </span>
        ) : (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-600">
            {p}
          </span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={() => onSelect(ticket)}
      className={`rounded-2xl p-4 border transition-all cursor-pointer text-left space-y-3 ${
        isSelected
          ? 'bg-white border-[#0D5C75] ring-4 ring-[#0D5C75]/10 shadow-[0_8px_24px_rgba(13,92,117,0.12)]'
          : 'apple-glass-card hover:border-[#199FB1]/50'
      }`}
    >
      {/* 1. Header: Ticket ID & Priority */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-extrabold text-[#0D5C75] bg-[#EAF4F8] px-2 py-0.5 rounded-lg border border-[#A5D1E1]/40">
          #{ticket.ticket_id}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[110px]">
            {ticket.category}
          </span>
          {getPriorityBadge()}
        </div>
      </div>

      {/* 2. Subject */}
      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#0D5C75] transition-colors">
        {ticket.subject}
      </h4>

      {/* 3. Requester & Assigned UPT */}
      <div className="text-[11px] text-slate-500 space-y-1.5">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{ticket.requester_email}</span>
        </div>

        {ticket.assigned_upt && (
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0D5C75] bg-[#EAF4F8]/80 border border-[#A5D1E1]/30 px-2 py-0.5 rounded-lg">
            <ShieldCheck className="w-3 h-3 text-[#199FB1] shrink-0" />
            <span className="truncate">{ticket.assigned_upt}</span>
          </div>
        )}
      </div>

      {/* 4. Footer Fast Actions */}
      <div className="pt-2.5 border-t border-slate-100/90 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" /> {timeFormatted}
        </span>

        <div className="flex items-center gap-1.5">
          {ticket.status === 'open' && onMoveStatus && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(ticket.ticket_id, 'in_progress');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#EAF4F8] hover:bg-[#0D5C75] text-[#0D5C75] hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>Proses</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </motion.button>
          )}

          {ticket.status === 'in_progress' && onMoveStatus && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(ticket.ticket_id, 'closed');
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[10px] font-bold transition-all border border-emerald-200/80 flex items-center gap-1 shadow-2xs"
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Selesai</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickTriage(ticket);
            }}
            title="Inspeksi Tiket"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
