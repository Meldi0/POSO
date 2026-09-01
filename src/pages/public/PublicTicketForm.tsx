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
  UploadCloud 
} from 'lucide-react';

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialCategory = searchParams.get('category') || 'Jaringan & Internet';

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [description, setDescription] = useState('');
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterEmail, setRequesterEmail] = useState(user?.email || '');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        alert(`Berkas "${file.name}" melebihi batas 10MB.`);
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
      } else {
        setErrorMsg(res.message || 'Gagal mengirimkan tiket.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi gangguan koneksi sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdTicketId) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Tiket Berhasil Diajukan</h2>
            <p className="text-xs text-slate-500 mt-1">Laporan Anda telah tercatat dalam antrean triase helpdesk.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ID Tiket Anda</span>
            <div className="text-xl font-mono font-extrabold text-[#0D5C75] mt-0.5">
              {createdTicketId}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              to={`/track?id=${createdTicketId}`}
              className="w-full py-2.5 bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold rounded-lg block transition-colors"
            >
              Pantau Status Tiket
            </Link>
            <button
              onClick={() => {
                setCreatedTicketId(null);
                setSubject('');
                setDescription('');
                setAttachments([]);
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg block transition-colors"
            >
              Buat Tiket Baru Lainnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-12 selection:bg-[#0D5C75] selection:text-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
      />

      <header className="bg-white border-b border-slate-200 py-3.5 px-4 mb-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <span className="text-xs font-bold text-[#0D5C75]">Formulir Laporan Keluhan</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Formulir Tiket Baru</h1>
          <p className="text-xs text-slate-500">Lengkapi informasi di bawah ini untuk ditindaklanjuti oleh unit teknis terkait</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Nama Anda"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email *</label>
              <input
                type="email"
                required
                placeholder="nama@domain.com"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Layanan *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prioritas / Urgensi *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
              >
                <option value="Low">Low (Biasa)</option>
                <option value="Medium">Medium (Standar)</option>
                <option value="High">High (Penting)</option>
                <option value="Urgent">Urgent (Darurat / Gangguan Total)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subjek / Judul Kendala *</label>
            <input
              type="text"
              required
              placeholder="Contoh: WiFi Ruang Rapat Lt. 2 Mati"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Permasalahan *</label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan kendala secara singkat dan jelas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
            />
          </div>

          {/* Attachment upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">Lampiran Foto Bukti</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[#0D5C75] hover:underline flex items-center gap-1"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Unggah Berkas</span>
              </button>
            </div>

            {attachments.length > 0 ? (
              <div className="space-y-1.5">
                {attachments.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="truncate font-medium text-slate-700">{file.name} ({file.size})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-slate-400 bg-slate-50/50"
              >
                <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-600 font-medium">Klik untuk melampirkan foto / dokumen (Maks 10MB)</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Tiket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
