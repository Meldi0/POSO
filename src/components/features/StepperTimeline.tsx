import React from 'react';
import { Check, FileText, GitBranch, Wrench, CheckCircle } from 'lucide-react';

export type Stage = 1 | 2 | 3 | 4;

const stages = [
  { id: 1 as Stage, label: 'Laporan Masuk', icon: FileText },
  { id: 2 as Stage, label: 'Triase & Disposisi', icon: GitBranch },
  { id: 3 as Stage, label: 'Pengerjaan UPT', icon: Wrench },
  { id: 4 as Stage, label: 'Selesai', icon: CheckCircle },
];

interface StepperTimelineProps {
  currentStage: Stage;
  timestamps?: Partial<Record<Stage, string>>;
  overSla?: boolean;
}

function formatTime(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function StepperTimeline({ currentStage, timestamps, overSla }: StepperTimelineProps) {
  return (
    <div className="relative py-2">
      {/* Connector lines (desktop) */}
      <div className="hidden sm:block absolute top-7 left-8 right-8 h-0.5 bg-[#E2E8F0] -z-0" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
        {stages.map((stage) => {
          const stageNum = stage.id;
          const isCompleted = stageNum < currentStage || (currentStage === 4 && stageNum === 4);
          const isCurrent = stageNum === currentStage && currentStage !== 4;
          const isUpcoming = stageNum > currentStage;
          const Icon = stage.icon;

          const iconBg = isCompleted
            ? '#0D5C75'
            : isCurrent
            ? '#199FB1'
            : '#E2E8F0';

          const iconColor = isCompleted || isCurrent ? '#FFFFFF' : '#94A3B8';

          return (
            <div key={stage.id} className="flex flex-col items-center gap-2 text-center">
              <div className="relative z-10">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent ? 'ring-pulse shadow-md shadow-[#199FB1]/25' : ''
                  }`}
                  style={{
                    backgroundColor: overSla && isCurrent ? '#EF4444' : iconBg,
                  }}
                >
                  {isCompleted ? (
                    <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                  ) : (
                    <Icon size={20} color={iconColor} strokeWidth={1.75} />
                  )}
                </div>
              </div>

              <div>
                <p
                  className="text-[13px] font-bold leading-tight"
                  style={{ color: isUpcoming ? '#94A3B8' : isCompleted ? '#0D5C75' : '#0F172A' }}
                >
                  {stage.label}
                </p>
                {timestamps?.[stageNum] && (
                  <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                    {formatTime(timestamps[stageNum])}
                  </p>
                )}
                {isCurrent && !timestamps?.[stageNum] && (
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: overSla ? '#DC2626' : '#199FB1' }}>
                    {overSla ? 'Over SLA' : 'Sedang berjalan'}
                  </p>
                )}
                {isUpcoming && (
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5">Menunggu</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepperTimeline;
