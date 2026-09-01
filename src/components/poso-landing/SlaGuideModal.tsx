import React from 'react';
import { X, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface SlaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlaGuideModal: React.FC<SlaGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D5C75] text-white flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Standar Layanan & Kebijakan SLA
              </h3>
              <p className="text-xs text-slate-500">Service Level Agreement (SLA) POSO Helpdesk</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* Section 1: SLA Matrix */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0D5C75]" />
              <span>1. Target Kecepatan Penanganan (SLA)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Urgent */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800">Tingkat URGENT</span>
                  <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    4 Jam
                  </span>
                </div>
                <p className="text-rose-900/80 leading-relaxed text-[11px]">
                  Gangguan server utama, listrik gedung padam total, kebocoran data, atau putusnya jaringan seluruh kantor.
                </p>
              </div>

              {/* High */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800">Tingkat HIGH</span>
                  <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    8 Jam
                  </span>
                </div>
                <p className="text-amber-900/80 leading-relaxed text-[11px]">
                  Kerusakan PC workstation staf, AC ruang rapat pimpinan, atau kendala modul aplikasi transaksi penting.
                </p>
              </div>

              {/* Medium / Low */}
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800">MEDIUM / NORMAL</span>
                  <span className="text-[11px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    24 Jam
                  </span>
                </div>
                <p className="text-sky-900/80 leading-relaxed text-[11px]">
                  Permohonan reset kata sandi, instalasi software pendukung, penggantian toner printer, atau pengaduan umum.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: UPT Integration */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0D5C75]" />
              <span>2. Unit Pelaksana Teknis (UPT) yang Terintegrasi</span>
            </h4>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>UPT Jaringan & Internet:</strong> Router, kabel LAN, access point Wi-Fi kampus, dan gateway kantor.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>UPT Sarana & Prasarana:</strong> Kelistrikan gedung, pendingin ruangan (AC), proyektor, dan perbaikan fisik.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>UPT Sistem Informasi & Akun:</strong> Reset akun SSO, integrasi Google Workspace, dan bug aplikasi.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
