import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface SlaCountdownProps {
  slaTarget?: string;
  isClosed?: boolean;
  compact?: boolean;
}

function getTimeRemaining(target?: string) {
  if (!target) {
    return { diff: 86400000, h: 24, m: 0, breached: false, valid: false };
  }
  const targetTime = new Date(target).getTime();
  if (isNaN(targetTime)) {
    return { diff: 86400000, h: 24, m: 0, breached: false, valid: false };
  }
  const diff = targetTime - Date.now();
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  return { diff, h, m, breached: diff < 0, valid: true };
}

export function SlaCountdown({ slaTarget, isClosed = false, compact = false }: SlaCountdownProps) {
  const [time, setTime] = useState(() => getTimeRemaining(slaTarget));

  useEffect(() => {
    setTime(getTimeRemaining(slaTarget));
    const interval = setInterval(() => {
      setTime(getTimeRemaining(slaTarget));
    }, 60000);
    return () => clearInterval(interval);
  }, [slaTarget]);

  if (isClosed) {
    if (compact) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
          <Clock size={10} />
          Selesai Tepat Waktu
        </span>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669]">
        <Clock size={14} />
        <span className="text-[13px] font-semibold font-mono">Selesai Tepat Waktu</span>
      </div>
    );
  }

  const isBreached = time.breached;
  const isAtRisk = !isBreached && time.h < 4;

  const colorConfig = isBreached
    ? { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA' }
    : isAtRisk
    ? { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }
    : { text: '#059669', bg: '#ECFDF5', border: '#A7F3D0' };

  const label = !time.valid
    ? 'Target 24 Jam'
    : isBreached
    ? `Terlambat ${time.h > 0 ? `${time.h}j ` : ''}${time.m}m`
    : `${time.h > 0 ? `${time.h}j ` : ''}${time.m}m tersisa`;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${isBreached ? 'sla-pulse' : ''}`}
        style={{ backgroundColor: colorConfig.bg, color: colorConfig.text, border: `1px solid ${colorConfig.border}` }}
      >
        <Clock size={10} />
        {label}
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] border ${isBreached ? 'sla-pulse' : ''}`}
      style={{ backgroundColor: colorConfig.bg, borderColor: colorConfig.border }}
    >
      <Clock size={14} style={{ color: colorConfig.text }} />
      <span className="text-[13px] font-semibold font-mono" style={{ color: colorConfig.text }}>
        {label}
      </span>
    </div>
  );
}

export default SlaCountdown;
