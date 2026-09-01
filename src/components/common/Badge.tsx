import React from 'react';
import { TicketStatus, TicketPriority, UserRole } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Flame, 
  Shield, 
  UserCheck, 
  Wrench, 
  User 
} from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  switch (status) {
    case 'open':
      return (
        <span className={`inline-flex items-center rounded-full badge-cyan ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-poso-cyan animate-pulse" />
          <span>Terbuka (Open)</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center rounded-full badge-lavender ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>Dikerjakan</span>
        </span>
      );
    case 'waiting':
      return (
        <span className={`inline-flex items-center rounded-full badge-amber ${sizeClasses[size]}`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Menunggu Respon</span>
        </span>
      );
    case 'closed':
      return (
        <span className={`inline-flex items-center rounded-full badge-mint ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Selesai (Closed)</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-800 text-slate-300 ${sizeClasses[size]}`}>
          {status}
        </span>
      );
  }
};

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold'
  };

  switch (priority) {
    case 'Urgent':
      return (
        <span className={`inline-flex items-center gap-1 rounded-md badge-rose ${sizeClasses[size]}`}>
          <Flame className="w-3 h-3 text-rose-400" />
          <span>Urgent</span>
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 rounded-md badge-amber ${sizeClasses[size]}`}>
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Tinggi</span>
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 rounded-md badge-lavender ${sizeClasses[size]}`}>
          <span>Sedang</span>
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center gap-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 ${sizeClasses[size]}`}>
          <span>Rendah</span>
        </span>
      );
  }
};

interface RoleBadgeProps {
  role: UserRole | string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  switch (role) {
    case 'admin':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold badge-rose">
          <Shield className="w-3 h-3" />
          <span>Admin</span>
        </span>
      );
    case 'operator':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold badge-lavender">
          <UserCheck className="w-3 h-3" />
          <span>Operator Helpdesk</span>
        </span>
      );
    case 'upt':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold badge-amber">
          <Wrench className="w-3 h-3" />
          <span>UPT Internal</span>
        </span>
      );
    case 'pengguna_umum':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium badge-cyan">
          <User className="w-3 h-3" />
          <span>Pengguna Umum</span>
        </span>
      );
  }
};

interface SlaTimerBadgeProps {
  slaDueAt: string;
  isClosed?: boolean;
}

export const SlaTimerBadge: React.FC<SlaTimerBadgeProps> = ({ slaDueAt, isClosed }) => {
  if (isClosed) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-poso-mint-light/80 bg-poso-mint/10 border border-poso-mint/20 px-2 py-0.5 rounded-md">
        <CheckCircle2 className="w-3 h-3 text-poso-mint" />
        <span>SLA Terpenuhi</span>
      </span>
    );
  }

  const now = Date.now();
  const due = new Date(slaDueAt).getTime();
  const diffHours = (due - now) / (1000 * 60 * 60);

  if (diffHours <= 0) {
    const overdueHours = Math.abs(Math.floor(diffHours));
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 bg-rose-950/50 border border-rose-500/40 px-2 py-0.5 rounded-md animate-pulse">
        <XCircle className="w-3 h-3 text-rose-400" />
        <span>SLA Terlewat ({overdueHours} jam)</span>
      </span>
    );
  }

  if (diffHours < 4) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/50 border border-amber-500/40 px-2 py-0.5 rounded-md">
        <Clock className="w-3 h-3 text-amber-400" />
        <span>Sisa {Math.round(diffHours * 10) / 10} jam</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md">
      <Clock className="w-3 h-3 text-slate-400" />
      <span>SLA: {new Date(slaDueAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
    </span>
  );
};
