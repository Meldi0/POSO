import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Copy,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Eye,
  User,
  MapPin,
  RotateCcw,
  Check,
  ChevronDown,
  File,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// =================================================================================================
// DATASET CASCADING DROPDOWN (DEPARTMENT -> TOPIK KENDALA)
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
    uptUnit: 'UPT Pengendalian Operasi & Transportasi',
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
    uptUnit: 'UPT Sarana & Prasarana (CGS)',
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
    uptUnit: 'UPT Postal Security & Keamanan',
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
    uptUnit: 'UPT Quality Control & Audit SLA',
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
    uptUnit: 'UPT TI & Sistem Informasi',
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
  const { success, error, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Initial category check from query params
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      const match = CASCADING_DEPARTMENTS.find(d => 
        d.name.toLowerCase().includes(catParam.toLowerCase()) || 
        catParam.toLowerCase().includes(d.name.toLowerCase())
      );
      if (match) {
        setSelectedDepartmentId(match.id);
        if (match.topics.length > 0) {
          setSelectedTopic(match.topics[0].label);
        }
      }
    }
  }, [searchParams]);

  // Current active department
  const currentDepartment = CASCADING_DEPARTMENTS.find(d => d.id === selectedDepartmentId) || CASCADING_DEPARTMENTS[0];

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
        error(`Berkas "${file.name}" melebihi batas ukuran 10MB.`);
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
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      info(`ID Tiket #${createdTicketId} disalin.`);
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
        success(`Tiket #${res.data.ticket_id} berhasil diajukan!`);
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
      <div className="relative min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-800 selection:bg-[#0D5C75] selection:text-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Tiket Berhasil Diajukan</h2>
            <p className="text-xs sm:text-sm text-slate-500">Laporan kendala Anda telah tercatat dan masuk ke antrean triase unit terkait.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">Nomor ID Tiket:</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-extrabold text-[#0D5C75]">
                #{createdTicketId}
              </span>
              <button
                type="button"
                onClick={handleCopyTicketId}
                title="Salin ID Tiket"
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">Disposisi Unit: <strong className="text-slate-800">{currentDepartment.uptUnit}</strong></p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to={`/track?id=${createdTicketId}`}
              className="w-full py-3.5 bg-[#0D5C75] hover:bg-[#083342] text-white text-xs sm:text-sm font-bold rounded-xl block transition-all shadow-md shadow-[#0D5C75]/20 text-center"
            >
              Pantau Status Tiket Sekarang
            </Link>

            <Link
              to={backDestination}
              className="w-full py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-200 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl block transition-all text-center"
            >
              {backLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] text-[#0F172A] font-sans pb-20 selection:bg-[#0D5C75] selection:text-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        className="hidden"
      />

      {/* Top Navbar */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] sticky top-0 z-40 py-3.5 px-4 sm:px-8 mb-6 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={backDestination} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0D5C75] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
          <span className="text-xs font-black text-[#0D5C75] bg-[#EAF4F8] px-3 py-1 rounded-full border border-[#A5D1E1]/40">
            Formulir Pengaduan Online
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Buat Tiket Pengaduan Baru</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Lengkapi formulir di bawah ini agar operator dan tim teknisi UPT dapat segera menindaklanjuti kendala Anda.
          </p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* 2-Column Responsive Layout: Form on Left + Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form Column (2 Cols on lg) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            {/* Requester Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap Pelapor <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Nama pelapor"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alamat Email Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@posindonesia.co.id"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
              </div>
            </div>

            {/* Department & Topic Cascading */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Department / Bidang <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedDepartmentId}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] appearance-none transition-all cursor-pointer"
                  >
                    {CASCADING_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Topik Kendala <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] appearance-none transition-all cursor-pointer"
                  >
                    {currentDepartment.topics.map(t => (
                      <option key={t.id} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Priority & Work Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tingkat Urgensi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] appearance-none transition-all cursor-pointer"
                  >
                    <option value="Low">Low (Rendah / Tidak Menghambat)</option>
                    <option value="Medium">Medium (Sedang / Standar SOP)</option>
                    <option value="High">High (Tinggi / Menghambat Aktivitas)</option>
                    <option value="Urgent">Urgent (Darurat / Gangguan Total)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lokasi Kerja / Ruangan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gedung Pos Lt. 2, Ruang Sortir"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subjek / Judul Permasalahan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kendala Gagal Dispatching Paket Mid Mile"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Rincian Deskripsi Kendala <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">{description.length} karakter</span>
              </div>
              <textarea
                required
                rows={4}
                placeholder="Jelaskan kronologi, lokasi spesifik gedung/ruangan, kode error, atau detail resi jika ada..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all resize-y leading-relaxed"
              />
            </div>

            {/* Drag & Drop Attachments */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Lampiran Bukti Foto / Dokumen</label>
                <span className="text-[10px] text-slate-400 font-medium">Maks 10MB per berkas</span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#0D5C75] bg-[#EAF4F8]/60 scale-[1.01]'
                    : 'border-slate-300 hover:border-[#199FB1] bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <UploadCloud className={`w-8 h-8 mx-auto mb-1.5 transition-transform ${isDragOver ? 'scale-110 text-[#0D5C75]' : 'text-slate-400'}`} />
                <p className="text-xs text-slate-700 font-bold">
                  {isDragOver ? 'Lepaskan berkas untuk mengunggah' : 'Klik atau seret foto/dokumen ke sini'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Mendukung file PNG, JPG, JPEG, PDF</p>
              </div>

              {/* Uploaded Files Preview List */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {attachments.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F7F9] border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {file.dataUrl ? (
                          <img src={file.dataUrl} alt={file.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <File className="w-6 h-6 text-slate-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="truncate block font-bold text-slate-800 text-[11px]">{file.name}</span>
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveAttachment(file.id); }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Hapus Berkas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Formulir</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirimkan Tiket...' : 'Kirim Laporan Tiket'}</span>
              </motion.button>
            </div>
          </form>

          {/* Right Column: Live Interactive Ticket Card Preview */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-black text-[#0D5C75]">
                <Eye className="w-4 h-4" />
                <span>Pratinjau Tiket Real-Time</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-[#EAF4F8]/50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="font-mono text-[#0D5C75] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    #TICK-PREVIEW
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {priority}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                  {subject.trim() || '(Judul kendala akan muncul di sini...)'}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {description.trim() || '(Rincian deskripsi permasalahan Anda...)'}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span className="truncate max-w-[150px]">{currentDepartment.name}: {selectedTopic}</span>
                  <span>{attachments.length} Lampiran</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D5C75]">
                <Sparkles className="w-4 h-4 text-[#199FB1]" />
                <span>Unit Disposisi Otomatis:</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">{currentDepartment.uptUnit}</p>
                <p className="text-[11px] text-slate-500">Laporan akan diteruskan ke teknisi spesialis unit terkait sesuai SLA resmi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
