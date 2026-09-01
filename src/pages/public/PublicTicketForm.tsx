import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { TicketPriority } from '../../types';
import { 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Paperclip, 
  FileText, 
  Trash2, 
  UploadCloud,
  Copy,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Clock,
  Eye,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
}

export const PublicTicketForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error, info } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialCategory = searchParams.get('category') || 'Jaringan & Internet';

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [description, setDescription] = useState('');
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterEmail, setRequesterEmail] = useState(user?.email || '');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setRequesterName(user.name);
      setRequesterEmail(user.email);
    }
  }, [user]);

  const categories = [
    'Jaringan & Internet',
    'Sarana & Prasarana',
    'Layanan Akun & Portal',
    'Hardware & Komputer',
    'Sistem Informasi & Aplikasi',
    'Layanan Umum & Konsultasi'
  ];

  const categoryTips: Record<string, string> = {
    'Jaringan & Internet': 'Sertakan nama SSID Wi-Fi, lokasi lantai/gedung, atau nomor port LAN yang bermasalah.',
    'Sarana & Prasarana': 'Sebutkan nomor ruangan dan jenis perangkat (AC, lampu, proyektor) agar tim logistik tepat membawa suku cadang.',
    'Layanan Akun & Portal': 'Gunakan email resmi institusi untuk verifikasi kepemilikan akun yang lebih cepat.',
    'Hardware & Komputer': 'Sertakan merk/tipe komputer atau printer dan foto pesan error di layar jika ada.',
    'Sistem Informasi & Aplikasi': 'Tuliskan nama fitur yang error (contoh: menu KRS, upload berkas, presensi).',
    'Layanan Umum & Konsultasi': 'Deskripsikan kebutuhan konsultasi atau permohonan layanan secara rinci.'
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || !requesterEmail.trim()) {
      setErrorMsg('Semua kolom bertanda bintang (*) wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiService.createTicket({
        subject: subject.trim(),
        category,
        description: description.trim(),
        priority,
        requester_email: requesterEmail.trim().toLowerCase(),
        requester_name: requesterName.trim() || 'Pelapor',
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
        setErrorMsg(res.message || 'Gagal mengirimkan tiket.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi gangguan koneksi sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (createdTicketId) {
      navigator.clipboard.writeText(createdTicketId);
      info(`ID Tiket #${createdTicketId} disalin ke clipboard.`);
    }
  };

  // SUCCESS VIEW
  if (createdTicketId) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] flex items-center justify-center p-4 selection:bg-[#0D5C75] selection:text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl text-center space-y-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Laporan Berhasil Diajukan</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Laporan Anda telah berhasil masuk ke dalam antrean triase POSO Helpdesk.</p>
          </div>

          {/* Ticket ID Box with Copy Button */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F7F9] border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">ID Nomor Tiket</span>
              <div className="text-lg sm:text-xl font-mono font-extrabold text-[#0D5C75] mt-0.5">
                #{createdTicketId}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={copyTicketId}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-[#0D5C75]" />
              <span>Salin ID</span>
            </motion.button>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              to={`/track?id=${createdTicketId}`}
              className="w-full py-3 bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0D5C75]/20"
            >
              <span>Pantau Status Tiket Ini</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedTicketId(null);
                setSubject('');
                setDescription('');
                setAttachments([]);
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Buat Tiket Baru Lainnya
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 font-sans pb-16 selection:bg-[#0D5C75] selection:text-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
      />

      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 py-3.5 px-4 mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0D5C75] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <span className="text-xs font-black text-[#0D5C75] bg-[#EAF4F8] px-3 py-1 rounded-full border border-[#A5D1E1]/40">
            Formulir Pengaduan Online
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Buat Tiket Pengaduan Baru</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Lengkapi formulir di bawah ini agar operator dan tim teknisi UPT dapat segera menindaklanjuti kendala Anda.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout: Form on Left + Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form Column (2 Cols on lg) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            {/* Requester Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama pelapor"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Institusi / Pribadi *</label>
                <input
                  type="email"
                  required
                  placeholder="nama@domain.ac.id"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
              </div>
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bidang / Kategori Layanan *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Urgensi / Prioritas *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                >
                  <option value="Low">Low (Biasa / Tidak Menghambat Aktivitas)</option>
                  <option value="Medium">Medium (Standar Penanganan SOP)</option>
                  <option value="High">High (Penting / Menghambat Aktivitas Tim)</option>
                  <option value="Urgent">Urgent (Darurat / Gangguan Fasilitas Total)</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subjek / Judul Permasalahan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Lampu Proyektor Kelas 302 Mati Saat Kuliah"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Rincian Deskripsi Kendala *</label>
                <span className="text-[10px] text-slate-400 font-semibold">{description.length} karakter</span>
              </div>
              <textarea
                required
                rows={4}
                placeholder="Jelaskan kronologi, lokasi spesifik gedung/ruangan, dan dampak kendala..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all resize-y leading-relaxed"
              />
            </div>

            {/* Interactive Drag & Drop Attachment Zone */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Lampiran Bukti Foto / Dokumen</label>
                <span className="text-[10px] text-slate-400 font-medium">Maks 10MB per berkas</span>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
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
                <p className="text-[10px] text-slate-400 mt-0.5">Mendukung file PNG, JPG, JPEG, PDF, DOCX</p>
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
                          <FileText className="w-6 h-6 text-slate-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="truncate block font-bold text-slate-800 text-[11px]">{file.name}</span>
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveAttachment(file.id); }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                Batal
              </Link>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/25 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirimkan Tiket...' : 'Kirim Laporan Tiket'}</span>
              </motion.button>
            </div>
          </form>

          {/* Right Column: Live Interactive Ticket Card Preview + Category Tips */}
          <div className="space-y-4">
            {/* Live Preview Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5">
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
                  <span>{category}</span>
                  <span>{attachments.length} Lampiran</span>
                </div>
              </div>
            </div>

            {/* Smart Category Tip Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Tips Cepat: {category}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {categoryTips[category] || 'Pastikan memberikan deskripsi yang jelas dan nomor kontak yang dapat dihubungi.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
