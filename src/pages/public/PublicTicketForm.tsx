import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { TicketPriority } from '../../types';
import { 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Paperclip, 
  Trash2, 
  UploadCloud,
  User,
  MapPin,
  RotateCcw,
  Check,
  Copy,
  ChevronDown,
  File,
  Image as ImageIcon
} from 'lucide-react';

// =================================================================================================
// DATASET CASCADING DROPDOWN (DEPARTMENT -> TOPIK KENDALA - CLEAN & CONCISE)
// =================================================================================================
export interface DepartmentConfig {
  id: string;
  name: string;
  code: string;
  uptUnit: string;
  topics: {
    id: string;
    label: string;
  }[];
}

export const CASCADING_DEPARTMENTS: DepartmentConfig[] = [
  {
    id: 'pengendalian_operasi',
    name: 'Pengendalian Operasi',
    code: 'OPS',
    uptUnit: 'UPT Workshop & Hardware',
    topics: [
      { id: 'first_mile', label: 'First Mile' },
      { id: 'mid_mile', label: 'Mid Mile' },
      { id: 'last_mile', label: 'Last Mile' },
      { id: 'armada_logistik', label: 'Armada & Transportasi' },
    ]
  },
  {
    id: 'cgs',
    name: 'Corporate General Services (CGS)',
    code: 'CGS',
    uptUnit: 'UPT Sarana & Prasarana',
    topics: [
      { id: 'sarana_gedung', label: 'Sarana & Gedung Kantor' },
      { id: 'listrik_genset_ac', label: 'Listrik, Genset, & AC' },
      { id: 'atk_perlengkapan', label: 'ATK & Perlengkapan Operasional' },
      { id: 'kebersihan_sanitasi', label: 'Kebersihan & Sanitasi' },
    ]
  },
  {
    id: 'postal_security',
    name: 'Postal Security',
    code: 'SEC',
    uptUnit: 'UPT Pelayanan & Sistem Informasi',
    topics: [
      { id: 'investigasi_paket', label: 'Investigasi Paket' },
      { id: 'cctv_akses_gedung', label: 'CCTV & Akses Gedung' },
      { id: 'pelanggaran_sop', label: 'Pelanggaran SOP & Integritas' },
      { id: 'insiden_keamanan', label: 'Laporan Insiden Keamanan' },
    ]
  },
  {
    id: 'quality_control',
    name: 'Quality Control',
    code: 'QC',
    uptUnit: 'UPT Pelayanan & Sistem Informasi',
    topics: [
      { id: 'audit_sla', label: 'Audit Kepatuhan SLA' },
      { id: 'volumetrik_berat', label: 'Volumetrik & Berat Paket' },
      { id: 'cacat_layanan', label: 'Cacat Layanan & Komplain' },
    ]
  },
  {
    id: 'it_sistem_informasi',
    name: 'IT & Sistem Informasi',
    code: 'IT',
    uptUnit: 'UPT TI & Jaringan',
    topics: [
      { id: 'jaringan_vpn_internet', label: 'Jaringan & Internet' },
      { id: 'error_aplikasi_poso', label: 'Aplikasi POSO & Core System' },
      { id: 'kendala_hardware', label: 'Hardware & Komputer' },
      { id: 'reset_password_akses', label: 'Akun & Akses SSO' },
    ]
  }
];

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
}

export const PublicTicketForm: React.FC = () => {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Navigation Target Based on Role
  const backDestination = isStaff ? '/dashboard' : user ? '/my-tickets' : '/';
  const backLabel = isStaff 
    ? 'Kembali ke Dashboard' 
    : user 
    ? 'Kembali ke Tiket Saya' 
    : 'Kembali ke Beranda';

  // Form Fields
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterEmail, setRequesterEmail] = useState(user?.email || '');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(CASCADING_DEPARTMENTS[0].id);
  const [selectedTopic, setSelectedTopic] = useState<string>(CASCADING_DEPARTMENTS[0].topics[0].label);
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [workLocation, setWorkLocation] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Process & Response State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Sync authenticated user info
  useEffect(() => {
    if (user) {
      setRequesterName(user.name);
      setRequesterEmail(user.email);
    }
  }, [user]);

  // Current active department
  const currentDepartment = CASCADING_DEPARTMENTS.find(d => d.id === selectedDepartmentId) || CASCADING_DEPARTMENTS[0];

  // When user selects a new department, reset topic to the first topic of the new department
  const handleDepartmentChange = (newDeptId: string) => {
    setSelectedDepartmentId(newDeptId);
    const dept = CASCADING_DEPARTMENTS.find(d => d.id === newDeptId);
    if (dept && dept.topics.length > 0) {
      setSelectedTopic(dept.topics[0].label);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 10 * 1024 * 1024) {
        alert(`Berkas "${file.name}" melebihi batas ukuran 10MB.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAttachments(prev => [
          ...prev,
          {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            dataUrl: dataUrl
          }
        ]);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleResetForm = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan formulir?')) {
      setSubject('');
      setDescription('');
      setWorkLocation('');
      setAttachments([]);
      setSelectedDepartmentId(CASCADING_DEPARTMENTS[0].id);
      setSelectedTopic(CASCADING_DEPARTMENTS[0].topics[0].label);
      setPriority('Medium');
      setErrorMsg('');
    }
  };

  const handleCopyTicketId = () => {
    if (createdTicketId) {
      navigator.clipboard.writeText(createdTicketId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName.trim() || !requesterEmail.trim() || !selectedTopic || !subject.trim() || !description.trim() || !workLocation.trim()) {
      setErrorMsg('Harap lengkapi semua kolom bertanda bintang (*) yang wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiService.createTicket({
        subject: subject.trim(),
        category: `${currentDepartment.name}: ${selectedTopic}`,
        department: currentDepartment.name,
        topic: selectedTopic,
        location: workLocation.trim(),
        description: description.trim(),
        priority,
        requester_email: requesterEmail.trim().toLowerCase(),
        requester_name: requesterName.trim() || 'Pelapor',
        assigned_upt: currentDepartment.uptUnit,
        attachments: attachments.map(a => ({
          name: a.name,
          size: a.size,
          type: a.type,
          dataUrl: a.dataUrl
        }))
      });

      if (res.status === 'success' && res.data) {
        setCreatedTicketId(res.data.ticket_id);
      } else {
        setErrorMsg(res.message || 'Gagal mengirimkan laporan tiket.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi gangguan koneksi sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SUBMIT STATE
  if (createdTicketId) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-800 selection:bg-[#002B49] selection:text-white overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFD] via-[#F8FAFC] to-[#F1F5F9]" />
          <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full bg-[#002B49]/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#002B49_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.05]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-8 sm:p-10 border border-[#E2E8F0] shadow-sm text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#0F172A]">Tiket Berhasil Diajukan</h2>
            <p className="text-sm text-[#64748B]">Laporan kendala Anda telah tercatat dan masuk ke antrean triase unit terkait.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="text-xs uppercase font-bold text-[#94A3B8] tracking-wider block">Nomor ID Tiket:</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-extrabold text-[#002B49]">
                #{createdTicketId}
              </span>
              <button
                type="button"
                onClick={handleCopyTicketId}
                title="Salin ID Tiket"
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-[#64748B] font-medium">Unit: <strong className="text-slate-800">{currentDepartment.uptUnit}</strong></p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to={`/track?id=${createdTicketId}`}
              className="w-full py-3.5 bg-[#002B49] hover:bg-[#001D33] text-white text-sm font-bold rounded-xl block transition-all shadow-md shadow-[#002B49]/20 active:scale-95 text-center"
            >
              Pantau Status Tiket Sekarang
            </Link>

            <Link
              to={backDestination}
              className="w-full py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] text-sm font-semibold rounded-xl block transition-all active:scale-95 text-center"
            >
              {backLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-20 selection:bg-[#002B49] selection:text-white overflow-x-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        className="hidden"
      />

      {/* 0. SOFT CLEAN BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFD] via-[#F8FAFC] to-[#F1F5F9]" />
        
        {/* Subtle Ambient Mesh Orbs */}
        <motion.div 
          animate={{
            x: [-20, 30, -20],
            y: [-15, 25, -15],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-20 w-[800px] h-[800px] rounded-full bg-[#002B49]/10 blur-[110px]"
        />

        <motion.div 
          animate={{
            x: [30, -30, 30],
            y: [20, -20, 20],
            scale: [1.05, 0.95, 1.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-24 w-[750px] h-[750px] rounded-full bg-[#F97316]/10 blur-[110px]"
        />

        {/* Soft light dots pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#002B49_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.05]" />
      </div>

      {/* 1. FIXED TOP BAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-[#E2E8F0] shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <Link to={backDestination} className="flex items-center gap-3.5 group">
            <motion.div 
              whileHover={{ rotate: 6, scale: 1.08 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#0D5C75] p-0.5 shadow-md shadow-[#002B49]/20 flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#002B49] to-[#0D5C75] flex items-center justify-center border border-white/20">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <path d="M16 3L26 8V16C26 22 21.5 26.5 16 28C10.5 26.5 6 22 6 16V8L16 3Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M10 13L16 9.5L22 13L16 19L10 13Z" fill="#FFFFFF" />
                  <path d="M12 18.5L16 16L20 18.5L16 23L12 18.5Z" fill="#FFFFFF" fillOpacity="0.75" />
                  <circle cx="16" cy="16" r="2" fill="#F97316" />
                </svg>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-[#002B49] tracking-tight block leading-none">POSO</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#002B49]/10 text-[#002B49] border border-[#002B49]/25">v2.0</span>
              </div>
              <span className="text-[11px] font-bold text-[#64748B] mt-1 block">PT Graha Pos Indonesia</span>
            </div>
          </Link>

          <Link
            to={backDestination}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        </div>
      </header>

      {/* 2. FORM BODY (CLEAN FORM) */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-28 space-y-6">
        
        {/* Page Title & Subtitle */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Formulir Tiket Baru</h1>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Lengkapi rincian kendala di bawah ini untuk ditindaklanjuti oleh unit teknis terkait.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-2xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Main Card Container */}
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-sm space-y-5"
        >
          
          {/* BARIS 1: NAMA & EMAIL PELAPOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Nama Lengkap Pelapor <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Nama pelapor"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Alamat Email Resmi <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="nama@posindonesia.co.id"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
              />
            </div>
          </div>

          {/* BARIS 2: CASCADING DROPDOWN (DEPARTMENT -> TOPIK KENDALA) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Pilih Department / Unit Kerja <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedDepartmentId}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] appearance-none transition-all cursor-pointer"
                >
                  {CASCADING_DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Topik Kendala <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] appearance-none transition-all cursor-pointer"
                >
                  {currentDepartment.topics.map(t => (
                    <option key={t.id} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* BARIS 3: PRIORITAS & LOKASI KERJA (PURE PLAIN TEXT INPUT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Tingkat Urgensi <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] appearance-none transition-all cursor-pointer"
                >
                  <option value="Low">Rendah (Low)</option>
                  <option value="Medium">Sedang (Medium)</option>
                  <option value="High">Tinggi (High)</option>
                  <option value="Urgent">Darurat (Urgent)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Lokasi Kerja / Unit Kantor <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ketik lokasi kantor / cabang..."
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
                />
              </div>
            </div>
          </div>

          {/* BARIS 4: SUBJEK KENDALA */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
              Subjek Kendala <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kendala Gagal Dispatching Paket Mid Mile"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
            />
          </div>

          {/* BARIS 5: DESKRIPSI PERMASALAHAN */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
              Deskripsi Permasalahan <span className="text-rose-500 font-bold">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan kronologi kendala, kode error, resi terkait, atau detail ruangan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all font-normal leading-relaxed"
            />
          </div>

          {/* BARIS 6: LAMPIRAN BERKAS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700">
                Lampiran Bukti <span className="text-xs text-[#94A3B8] font-normal">(Opsional)</span>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[#002B49] hover:underline flex items-center gap-1"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Pilih Berkas Manual</span>
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragOver 
                  ? 'border-[#002B49] bg-sky-50/50' 
                  : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#94A3B8] hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-7 h-7 text-[#002B49] mx-auto mb-1.5" />
              <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">Tarik berkas ke sini, atau <span className="text-[#002B49] underline">pilih dari komputer</span></p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 font-normal">JPG, PNG, PDF (Maks. 10MB)</p>
            </div>

            {/* Uploaded Files Preview List */}
            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {attachments.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-[#002B49] flex items-center justify-center shrink-0">
                        {file.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> : <File className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-[10px] text-[#64748B]">{file.size}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAttachment(file.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Berkas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Formulir</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-[#002B49] hover:bg-[#001D33] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-[#002B49]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan Tiket'}</span>
            </button>
          </div>

        </motion.form>
      </main>
    </div>
  );
};
