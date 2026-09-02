import React, { useState, useEffect } from 'react';
import { 
  Database, 
  HardDrive, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Activity, 
  Globe, 
  Key, 
  AlertTriangle, 
  Save, 
  Info,
  Server,
  Cloud,
  Layers,
  Zap,
  Check
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const DataSourceConfig: React.FC = () => {
  const SPREADSHEET_ID = '1IBoq8tUdVC1ki2omEqvgek6LEHhE6aVOSEfDuiO0byE';
  const FOLDER_ID = '1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR';

  const { success, error: toastError, info } = useToast();
  const [gasUrl, setGasUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    latency: number;
    message: string;
    timestamp?: string;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setGasUrl(apiService.getGasUrl());
  }, []);

  const handleSaveGasUrl = (e: React.FormEvent) => {
    e.preventDefault();
    apiService.setGasUrl(gasUrl.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    success('URL Google Apps Script berhasil disimpan di peramban ini.');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setPingResult(null);

    // If unsaved, temporarily set it
    if (gasUrl.trim() !== apiService.getGasUrl()) {
      apiService.setGasUrl(gasUrl.trim());
    }

    try {
      const res = await apiService.ping();
      setPingResult(res);
      if (res.success) {
        success(`Koneksi Backend Berhasil! Latensi: ${res.latency}ms`);
      } else {
        toastError(res.message || 'Gagal terhubung ke Google Apps Script');
      }
    } catch (err: any) {
      setPingResult({
        success: false,
        latency: 0,
        message: err.message || 'Terjadi kesalahan jaringan'
      });
      toastError('Gagal melakukan uji koneksi.');
    } finally {
      setTesting(false);
    }
  };

  const isConfigured = apiService.isGasConfigured();

  return (
    <div className="space-y-6 text-[#0F172A] max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F172A] tracking-tight">Integrasi Data & Google Workspace</h2>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Konfigurasi koneksi backend REST API Google Apps Script & sinkronisasi multi-device
          </p>
        </div>

        {/* Live Status Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
          isConfigured 
            ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
            : 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'}`} />
          <span>{isConfigured ? 'Mode Cloud Live (Multi-Device Sync)' : 'Mode Offline (Lokal Browser)'}</span>
        </div>
      </div>

      {/* Backend API URL Configuration Card */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAF4F8] flex items-center justify-center text-[#0D5C75] flex-shrink-0">
              <Server size={22} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0F172A]">Google Apps Script Web App Endpoint</h3>
              <p className="text-[13px] text-[#64748B]">
                Endpoint REST API yang menghubungkan frontend ini dengan Google Sheets database
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveGasUrl} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              URL Web App Exec (/exec)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                  <Globe size={16} />
                </div>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  value={gasUrl}
                  onChange={(e) => setGasUrl(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0D5C75] focus:bg-white text-xs sm:text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="h-11 px-4 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  {isSaved ? <Check size={16} /> : <Save size={16} />}
                  <span>{isSaved ? 'Tersimpan!' : 'Simpan URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing || !gasUrl.trim()}
                  className="h-11 px-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  <RefreshCw size={15} className={testing ? 'animate-spin text-[#0D5C75]' : 'text-[#64748B]'} />
                  <span>{testing ? 'Menguji...' : 'Uji Koneksi (Ping)'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Ping Test Result Box */}
        {pingResult && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            pingResult.success 
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' 
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
          }`}>
            {pingResult.success ? (
              <CheckCircle2 size={18} className="text-[#10B981] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs">
              <div className="font-bold flex items-center gap-2">
                <span>{pingResult.success ? 'Koneksi Berhasil Aktif' : 'Uji Koneksi Gagal'}</span>
                {pingResult.latency > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/70 font-mono text-[11px]">
                    Latency: {pingResult.latency}ms
                  </span>
                )}
              </div>
              <p className="opacity-90">{pingResult.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Database & Storage Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Spreadsheet Card */}
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4F8] flex items-center justify-center text-[#0D5C75]">
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A]">Google Sheets Database</h3>
                <p className="text-[12px] text-[#64748B]">Tabel master, tiket & thread pesan</p>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              isConfigured ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-[#FFFBEB] border-[#FDE68A]'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'}`} />
              <span className={`text-[11px] font-semibold ${isConfigured ? 'text-[#059669]' : 'text-[#D97706]'}`}>
                {isConfigured ? 'Terhubung' : 'Standby'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Spreadsheet ID:</span>
              <span className="font-mono text-xs font-bold text-[#0D5C75]">{SPREADSHEET_ID.slice(0, 16)}...</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Status Sinkronisasi:</span>
              <span className="text-[#059669] font-semibold">Real-time Bi-directional</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex justify-end">
            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-bold text-[#199FB1] hover:text-[#0D5C75] flex items-center gap-1"
            >
              <span>Buka Google Sheets</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Drive Storage Card */}
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4F8] flex items-center justify-center text-[#0D5C75]">
                <HardDrive size={20} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A]">Google Drive Storage</h3>
                <p className="text-[12px] text-[#64748B]">Penyimpanan lampiran berkas & foto</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0]">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#059669]">Aktif</span>
            </div>
          </div>

          <div className="space-y-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Folder ID:</span>
              <span className="font-mono text-xs font-bold text-[#0D5C75]">{FOLDER_ID.slice(0, 16)}...</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Akses Berkas:</span>
              <span className="text-[#0F172A] font-semibold">Tautan Publik Terenkripsi</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex justify-end">
            <a
              href={`https://drive.google.com/drive/folders/${FOLDER_ID}`}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-bold text-[#199FB1] hover:text-[#0D5C75] flex items-center gap-1"
            >
              <span>Buka Folder Drive</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Vercel Multi-Device Deployment Instruction Card */}
      <div className="p-5 rounded-[20px] bg-gradient-to-br from-[#083342] to-[#0D5C75] text-white shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <Cloud size={20} className="text-[#38BDF8]" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            Panduan Sinkronisasi Multi-Device di Vercel
          </h4>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          Agar semua pengguna di berbagai laptop, komputer, dan HP otomatis melihat data tiket dan akun yang sama secara real-time saat membuka web di Vercel:
        </p>
        <ol className="text-xs text-white/90 space-y-1.5 list-decimal list-inside pl-1">
          <li>Buka Dashboard proyek Anda di <strong>Vercel (vercel.com)</strong>.</li>
          <li>Masuk ke menu <strong>Settings</strong> ➔ <strong>Environment Variables</strong>.</li>
          <li>
            Tambahkan variabel baru:
            <div className="my-1.5 p-2 rounded-lg bg-black/30 font-mono text-[11px] text-[#38BDF8]">
              Key: VITE_GAS_API_URL<br />
              Value: (Tempelkan URL Web App /exec Google Apps Script Anda)
            </div>
          </li>
          <li>Klik <strong>Save</strong> lalu lakukan <strong>Redeploy</strong> proyek Anda.</li>
        </ol>
      </div>
    </div>
  );
};

export default DataSourceConfig;

