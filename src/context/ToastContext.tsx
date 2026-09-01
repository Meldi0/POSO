import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string, duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { id, message, type, title, duration };

    setToasts(prev => [...prev.slice(-4), newToast]); // keep max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => showToast(message, 'success', title), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast(message, 'error', title), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast(message, 'info', title), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast(message, 'warning', title), [showToast]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[#199FB1] shrink-0" />;
    }
  };

  const getToastBorder = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200/80 bg-white/95 text-emerald-950 shadow-emerald-500/10';
      case 'error':
        return 'border-rose-200/80 bg-white/95 text-rose-950 shadow-rose-500/10';
      case 'warning':
        return 'border-amber-200/80 bg-white/95 text-amber-950 shadow-amber-500/10';
      case 'info':
      default:
        return 'border-[#A5D1E1]/80 bg-white/95 text-slate-900 shadow-[#0D5C75]/10';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-4 right-4 sm:right-6 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] sm:w-96 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-xl shadow-xl flex items-start justify-between gap-3 ${getToastBorder(toast.type)}`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                {getToastIcon(toast.type)}
                <div className="min-w-0">
                  {toast.title && (
                    <h4 className="text-xs font-bold leading-tight mb-0.5">{toast.title}</h4>
                  )}
                  <p className="text-xs font-medium leading-relaxed opacity-90 break-words">
                    {toast.message}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
