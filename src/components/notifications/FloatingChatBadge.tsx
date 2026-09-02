import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ArrowRight, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { realtimeService, ChatNotification } from '../../services/realtime';

interface FloatingChatBadgeProps {
  onOpenTicket: (ticketId: string) => void;
}

export const FloatingChatBadge: React.FC<FloatingChatBadgeProps> = ({ onOpenTicket }) => {
  const [activePopup, setActivePopup] = useState<ChatNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsub = realtimeService.onNotificationsChange((notifs) => {
      const unread = notifs.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    });
    return () => unsub();
  }, []);

  // Listen to new chat events to show the popup preview
  useEffect(() => {
    const handler = (e: any) => {
      const notif: ChatNotification = e.detail;
      if (notif) {
        setActivePopup(notif);
        // Auto dismiss preview popup after 8 seconds
        setTimeout(() => {
          setActivePopup(current => (current?.id === notif.id ? null : current));
        }, 8000);
      }
    };

    window.addEventListener('poso_realtime_chat', handler);
    return () => window.removeEventListener('poso_realtime_chat', handler);
  }, []);

  const handleOpenActiveChat = () => {
    if (activePopup) {
      realtimeService.markAsRead(activePopup.id);
      onOpenTicket(activePopup.ticket_id);
      setActivePopup(null);
    } else {
      const all = realtimeService.getNotifications();
      if (all.length > 0) {
        const latest = all[0];
        realtimeService.markAsRead(latest.id);
        onOpenTicket(latest.ticket_id);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none select-none">
      
      {/* 1. Floating Chat Preview Card Popup */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={handleOpenActiveChat}
            className="pointer-events-auto w-80 sm:w-92 bg-white rounded-[20px] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.22)] border border-[#0D5C75]/20 cursor-pointer hover:border-[#0D5C75] transition-all group overflow-hidden relative"
          >
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#083342] via-[#0D5C75] to-[#199FB1]" />

            <div className="flex items-start justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0D5C75] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#0F172A] leading-tight">
                    {activePopup.sender_name}
                  </h4>
                  <span className="text-[10px] font-mono font-semibold text-[#0D5C75]">
                    #{activePopup.ticket_id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopup(null);
                }}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                title="Tutup"
              >
                <X size={15} />
              </button>
            </div>

            {/* Message Snippet */}
            <p className="text-[12px] text-[#334155] font-medium leading-relaxed my-2 line-clamp-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#F1F5F9]">
              "{activePopup.message}"
            </p>

            {/* Action Row */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#94A3B8] font-semibold">Baru saja</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#0D5C75] group-hover:text-[#199FB1] transition-colors">
                <span>Balas Pesan</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Circular Chat Icon Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleOpenActiveChat}
        className="pointer-events-auto relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#083342] via-[#0D5C75] to-[#199FB1] text-white flex items-center justify-center shadow-[0_12px_32px_rgba(13,92,117,0.38)] hover:shadow-[0_16px_40px_rgba(13,92,117,0.5)] transition-all cursor-pointer group border-2 border-white/40"
        title="Buka Pesan & Chat Tiket"
      >
        <MessageSquare size={24} className="group-hover:rotate-6 transition-transform" />

        {/* Pulse glow wave when unread */}
        {unreadCount > 0 && (
          <span className="absolute inset-0 rounded-full bg-[#199FB1] animate-ping opacity-35" />
        )}

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-6 min-w-6 px-1.5 items-center justify-center rounded-full bg-[#EF4444] text-[11px] font-extrabold text-white shadow-md ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};
