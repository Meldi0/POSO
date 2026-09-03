import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  Cloud, 
  Copy, 
  Check, 
  Terminal, 
  Server,
  Lock,
  Globe
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const DataSourceConfig: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [testing, setTesting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dbData, setDbData] = useState<{
    database_engine: string;
    host: string;
    port: number;
    database_name: string;
    ssl_mode: string;
    ssl_active: boolean;
    latency_ms: number;
    mysql_version: string;
    table_counts: Record<string, number>;
    connection_pool: { connection_limit: number; status: string };
  } | null>(null);

  const fetchStatus = async () => {
    setTesting(true);
    try {
      const res = await apiService.getDbStatus();
      if (res.status === 'success' && res.data) {
        setDbData(res.data);
      } else {
        toastError(res.message || 'Gagal mengambil status database Aiven MySQL.');
      }
    } catch (err: any) {
      toastError(err.message || 'Terjadi gangguan jaringan.');
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await apiService.ping();
      if (res.success) {
        success(`Koneksi Aiven MySQL Berhasil! Latensi: ${res.latency}ms`);
        await fetchStatus();
      } else {
        toastError(res.message || 'Gagal terhubung ke database Aiven MySQL');
      }
    } catch (err: any) {
      toastError('Gagal melakukan uji koneksi.');
    } finally {
      setTesting(false);
    }
  };

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    success(`Berhasil menyalin: ${keyId}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const vercelEnvVars = [
    { key: 'DB_HOST', val: 'mysql-1810b125-nugrahaeldi123-5f2b.f.aivencloud.com' },
    { key: 'DB_PORT', val: '21970' },
    { key: 'DB_USER', val: 'avnadmin' },
    { key: 'DB_PASSWORD', val: 'YOUR_AIVEN_PASSWORD' },
    { key: 'DB_NAME', val: 'defaultdb' },
    { key: 'DB_SSL', val: 'true' },
    { key: 'JWT_SECRET', val: 'poso_secret_jwt_key_2026_super_secure' }
  ];

  return (
    <div className="space-y-6 text-[#0F172A] max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F172A] tracking-tight">Database & Infrastruktur Aiven MySQL</h2>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Manajemen klaster basis data relasional cloud Aiven for MySQL (SSL Mode REQUIRED) sebagai Single Source of Truth
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Aiven MySQL Online (Production)</span>
        </div>
      </div>

      {/* Main Connection Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0D5C75]/10 border border-[#0D5C75]/20 flex items-center justify-center text-[#0D5C75] flex-shrink-0">
              <Database size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Aiven for MySQL Cluster</h3>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-black tracking-wider uppercase">
                  SSL REQUIRED
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Terhubung
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5 select-all">
                {dbData?.host || 'mysql-1810b125-nugrahaeldi123-5f2b.f.aivencloud.com'}:{dbData?.port || 21970}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
            <span>{testing ? 'Menguji Latensi...' : 'Uji Koneksi & Ping Latensi'}</span>
          </button>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Item 1: Database Name */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Database Aktif</span>
            <div className="text-sm font-black text-slate-900 font-mono">
              {dbData?.database_name || 'defaultdb'}
            </div>
            <div className="text-[10px] text-slate-400">MySQL 8.0 Cloud Service</div>
          </div>

          {/* Item 2: Latency */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Latensi Respon</span>
            <div className="text-sm font-black text-emerald-600 flex items-center gap-1.5 font-mono">
              <Zap size={14} className="text-amber-500" />
              <span>{dbData?.latency_ms ?? 0} ms</span>
            </div>
            <div className="text-[10px] text-slate-400">Direct TCP Connection</div>
          </div>

          {/* Item 3: Security & Encryption */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Enkripsi Jaringan</span>
            <div className="text-sm font-black text-[#0D5C75] flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-500" />
              <span>TLS 1.3 / SSL</span>
            </div>
            <div className="text-[10px] text-slate-400">Mode: REQUIRED (Active)</div>
          </div>

          {/* Item 4: Connection Pool */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Connection Pool</span>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-500" />
              <span>10 Koneksi (Pooling)</span>
            </div>
            <div className="text-[10px] text-slate-400">mysql2/promise Driver</div>
          </div>
        </div>
      </div>

      {/* Table Statistics Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#0D5C75]" />
            <h3 className="text-sm font-bold text-slate-900">Statistik Data Tabel Relasional (Aiven MySQL)</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Single Source of Truth</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Pengguna (users)</span>
            <span className="text-2xl font-black text-slate-900">{dbData?.table_counts?.users ?? 0}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Akun RBAC</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Tiket (tickets)</span>
            <span className="text-2xl font-black text-[#0D5C75]">{dbData?.table_counts?.tickets ?? 0}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Laporan Masuk</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Percakapan (threads)</span>
            <span className="text-2xl font-black text-slate-900">{dbData?.table_counts?.threads ?? 0}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Balasan & Catatan</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Audit (audit_logs)</span>
            <span className="text-2xl font-black text-slate-900">{dbData?.table_counts?.audit_logs ?? 0}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Log Aktivitas</span>
          </div>
        </div>
      </div>

      {/* Vercel Environment Variables Instruction Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#083342] to-[#0D5C75] text-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cloud size={20} className="text-[#38BDF8]" />
            <h4 className="text-sm font-bold text-white tracking-wide">
              Panduan Deployment & Sinkronisasi Vercel (Aiven for MySQL)
            </h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-[#38BDF8] border border-sky-400/30 text-[10px] font-bold">
            Cloud Production
          </span>
        </div>

        <p className="text-xs text-white/80 leading-relaxed">
          Untuk menghubungkan sistem POSO di Vercel (<span className="font-mono text-[#38BDF8]">poso-jet.vercel.app</span>) dengan cluster cloud Aiven MySQL:
        </p>

        <ol className="text-xs text-white/90 space-y-2 list-decimal list-inside pl-1">
          <li>Buka Dashboard proyek Anda di <strong>Vercel (vercel.com)</strong>.</li>
          <li>Masuk ke menu <strong>Settings</strong> ➔ <strong>Environment Variables</strong>.</li>
          <li>
            Pastikan variabel berikut telah ditambahkan di Vercel:
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5 not-prose">
              {vercelEnvVars.map(v => (
                <div 
                  key={v.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/10 hover:border-[#38BDF8]/40 transition-all font-mono text-[11px]"
                >
                  <div className="overflow-hidden mr-2">
                    <span className="text-[#38BDF8] font-bold block">{v.key}</span>
                    <span className="text-slate-300 text-[10px] truncate block">
                      {v.key === 'DB_PASSWORD' ? '••••••••••••••••' : v.val}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(v.val, v.key)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all flex-shrink-0 cursor-pointer"
                    title={`Salin nilai ${v.key}`}
                  >
                    {copiedKey === v.key ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              ))}
            </div>
          </li>
          <li>
            Jalankan <span className="font-mono text-[#38BDF8] bg-black/30 px-1.5 py-0.5 rounded">git push origin main</span> dari terminal lokal Anda, atau klik <strong>Redeploy</strong> di Vercel.
          </li>
        </ol>
      </div>

      {/* Terminal CLI Helper Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800">
          <Terminal size={17} className="text-[#0D5C75]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Perintah Terminal Backend & Migrasi</h4>
        </div>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between">
            <span>npm run test:db</span>
            <span className="text-slate-400 text-[11px] font-sans">Uji koneksi SELECT 1+2 & database Aiven</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between">
            <span>npm run migrate</span>
            <span className="text-slate-400 text-[11px] font-sans">Eksekusi skema tabel DDL & seed data</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between">
            <span>npm run dev</span>
            <span className="text-slate-400 text-[11px] font-sans">Jalankan Express Backend (5001) & Vite (3000)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceConfig;
