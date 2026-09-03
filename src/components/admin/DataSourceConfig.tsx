import React, { useState, useEffect } from 'react';
import { 
  Database, 
  HardDrive, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  Server, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  Table,
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const DataSourceConfig: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [testing, setTesting] = useState(false);
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

  return (
    <div className="space-y-6 text-[#0F172A] max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F172A] tracking-tight">Database & Infrastruktur Aiven MySQL</h2>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Pemantauan koneksi relasional cloud Aiven for MySQL (SSL Mode REQUIRED) sebagai Single Source of Truth
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Aiven MySQL Online (Production)</span>
        </div>
      </div>

      {/* Main Connection Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0D5C75]/10 border border-[#0D5C75]/20 flex items-center justify-center text-[#0D5C75]">
              <Database size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Aiven for MySQL Cluster</h3>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-black tracking-wider uppercase">
                  SSL REQUIRED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {dbData?.host || 'mysql-1810b125-nugrahaeldi123-5f2b.f.aivencloud.com'}:{dbData?.port || 21970}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
            <span>{testing ? 'Menguji...' : 'Uji Koneksi & Latensi'}</span>
          </button>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Item 1: Database Name */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Database Aktif</span>
            <div className="text-sm font-black text-slate-900 font-mono">
              {dbData?.database_name || 'defaultdb'}
            </div>
            <div className="text-[10px] text-slate-400">MySQL 8.0 Engine</div>
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
            <div className="text-[10px] text-slate-400">Mode: REQUIRED</div>
          </div>

          {/* Item 4: Connection Pool */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Connection Pool</span>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-500" />
              <span>10 Koneksi (Pooling)</span>
            </div>
            <div className="text-[10px] text-slate-400">mysql2/promise driver</div>
          </div>
        </div>
      </div>

      {/* Table Statistics Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#0D5C75]" />
          <h3 className="text-sm font-bold text-slate-900">Statistik Data Tabel Relasional</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Pengguna (users)</span>
            <span className="text-2xl font-black text-slate-900">{dbData?.table_counts?.users ?? 0}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Tiket (tickets)</span>
            <span className="text-2xl font-black text-[#0D5C75]">{dbData?.table_counts?.tickets ?? 0}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Diskusi (threads)</span>
            <span className="text-2xl font-black text-slate-900">{dbData?.table_counts?.threads ?? 0}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tabel Audit (audit_logs)</span>
            <span className="text-2xl font-black text-slate-900">{dbData?.table_counts?.audit_logs ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceConfig;
