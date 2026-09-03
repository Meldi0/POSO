import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  KeyRound, 
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  UserCheck,
  Building2,
  MapPin,
  Phone,
  Camera,
  UploadCloud,
  Check,
  Search,
  ChevronDown,
  Sparkles,
  Lock,
  BadgeCheck,
  Briefcase,
  X
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { apiService } from '../../services/api';

// =================================================================================================
// KONSTANTA & MASTER DATA POS INDONESIA
// =================================================================================================
const DEPARTMENT_OPTIONS = [
  'Pengendalian Operasi',
  'CGS (Corporate General Services / Fasilitas & Umum)',
  'Postal Security (Keamanan Pos & Aset)',
  'Quality Control (QC & SLA)',
  'IT & Jaringan',
  'Keuangan & Akuntansi',
  'SDM & Human Capital'
];

const ROLE_HIERARCHY_OPTIONS = [
  { value: 'pengguna_umum', label: 'User (Staf Umum)', badge: 'Staf Umum' },
  { value: 'pengguna_umum', label: 'User Pusat', badge: 'User Pusat' },
  { value: 'operator', label: 'Operator Helpdesk', badge: 'Operator' },
  { value: 'operator', label: 'Admin Operator', badge: 'Admin Operator' },
  { value: 'admin', label: 'Admin User', badge: 'Admin User' },
  { value: 'upt', label: 'IT Support & Developer', badge: 'IT Support' },
  { value: 'operator', label: 'Admin KC (Kantor Cabang)', badge: 'Admin KC' },
  { value: 'operator', label: 'Admin KCU (Kantor Cabang Utama)', badge: 'Admin KCU' },
  { value: 'admin', label: 'Admin Regional', badge: 'Admin Regional' },
  { value: 'admin', label: 'Admin Pusat / Super Admin', badge: 'Super Admin' },
  { value: 'pengguna_umum', label: 'Magang / Internship', badge: 'Internship' }
];

const REGIONAL_PRESETS: { [code: string]: string } = {
  'Regional 1': 'Regional I Sumatera Bagian Utara & Aceh',
  'Regional 2': 'Regional II Sumatera Bagian Barat & Selatan',
  'Regional 3': 'Regional III DKI Jakarta & Banten',
  'Regional 4': 'Regional IV Jawa Barat',
  'Regional 5': 'Regional V Jawa Tengah & DIY',
  'Regional 6': 'Regional VI Jawa Timur, Bali, & Nusa Tenggara'
};

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // File Input Ref for Avatar
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Group 1: Informasi Kredensial & Akun
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Poso123!');
  const [showPassword, setShowPassword] = useState(false);

  // Group 2: Otorisasi & Peran Dinas
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0]);
  const [nip, setNip] = useState('');
  const [selectedRoleTitle, setSelectedRoleTitle] = useState(ROLE_HIERARCHY_OPTIONS[2].label); // Operator Helpdesk

  // Group 3: Foto Profil
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Group 4: Detail Wilayah Kerja & Penempatan Dinas
  const [jabatanFungsional, setJabatanFungsional] = useState('');
  const [kantorPenempatan, setKantorPenempatan] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [nopenKc, setNopenKc] = useState('');
  const [namaKc, setNamaKc] = useState('');
  const [nopenKcu, setNopenKcu] = useState('');
  const [namaKcu, setNamaKcu] = useState('');

  const [regionalCode, setRegionalCode] = useState('Regional 4');
  const [regionalName, setRegionalName] = useState(REGIONAL_PRESETS['Regional 4']);

  // Submit & Reset State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Map to toggle password visibility per user in table
  const [visiblePasswords, setVisiblePasswords] = useState<{ [userId: string]: boolean }>({});

  // Reset Password Modal State
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Detail View Drawer
  const [selectedDetailUser, setSelectedDetailUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getUsers();
      if (res.status === 'success' && res.data) {
        setUsers(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update regional name when code changes
  const handleRegionalCodeChange = (code: string) => {
    setRegionalCode(code);
    if (REGIONAL_PRESETS[code]) {
      setRegionalName(REGIONAL_PRESETS[code]);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto profil maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPassword('Poso123!');
    setShowPassword(false);
    setDepartment(DEPARTMENT_OPTIONS[0]);
    setNip('');
    setSelectedRoleTitle(ROLE_HIERARCHY_OPTIONS[2].label);
    setAvatarPreview('');
    setJabatanFungsional('');
    setKantorPenempatan('');
    setPhoneNumber('');
    setNopenKc('');
    setNamaKc('');
    setNopenKcu('');
    setNamaKcu('');
    setRegionalCode('Regional 4');
    setRegionalName(REGIONAL_PRESETS['Regional 4']);
    setShowAdd(false);
    setStatusMsg(null);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setStatusMsg({ type: 'error', text: 'Nama lengkap, alamat email resmi, dan kata sandi wajib diisi.' });
      return;
    }

    // Determine system role mapping
    const matchedRoleObj = ROLE_HIERARCHY_OPTIONS.find(r => r.label === selectedRoleTitle);
    const systemRole: UserRole = (matchedRoleObj?.value as UserRole) || 'operator';

    // Map UPT unit if technical role
    let assignedUpt = undefined;
    if (department.includes('IT') || selectedRoleTitle.includes('IT')) {
      assignedUpt = 'UPT TI & Jaringan';
    } else if (department.includes('CGS') || department.includes('Fasilitas')) {
      assignedUpt = 'UPT Sarana & Prasarana';
    } else if (department.includes('Operasi')) {
      assignedUpt = 'UPT Hardware & Workshop';
    } else {
      assignedUpt = 'Helpdesk Pusat & Layanan Terpadu';
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await apiService.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role: systemRole,
        upt_unit: systemRole === 'upt' ? assignedUpt : undefined,
        nip: nip.trim() || `POS-${Date.now().toString().slice(-4)}`,
        department,
        role_title: selectedRoleTitle,
        avatar_url: avatarPreview || undefined,
        jabatan_fungsional: jabatanFungsional.trim(),
        kantor_penempatan: kantorPenempatan.trim(),
        phone_number: phoneNumber.trim(),
        nopen_kc: nopenKc.trim(),
        nama_kc: namaKc.trim(),
        nopen_kcu: nopenKcu.trim(),
        nama_kcu: namaKcu.trim(),
        regional_code: regionalCode,
        regional_name: regionalName.trim()
      });

      if (res.status === 'success') {
        setStatusMsg({ 
          type: 'success', 
          text: `Akun petugas "${name}" (${selectedRoleTitle}) berhasil didaftarkan ke Database Master PRISMA POS!` 
        });
        handleResetForm();
        await fetchUsers();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Gagal menambahkan akun petugas.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Terjadi kesalahan sistem saat menyimpan.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeRole = async (targetUserId: string, newRole: UserRole, newUpt?: string) => {
    try {
      const res = await apiService.updateUserRole({
        target_user_id: targetUserId,
        new_role: newRole,
        new_upt_unit: newRole === 'upt' ? (newUpt || 'UPT TI & Jaringan') : undefined
      });

      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: 'Peran otorisasi pengguna berhasil diperbarui.' });
        await fetchUsers();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Gagal mengubah peran.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Terjadi gangguan koneksi.' });
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.email === 'admin@poso.local' || (user.role === 'admin' && user.user_id === 'USR-ADMIN01')) {
      alert('Akun Super Administrator Utama dilindungi dan tidak dapat dihapus.');
      return;
    }

    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus akun "${user.name}" (${user.email}) dari database?`);
    if (!confirmDelete) return;

    // Optimistic remove
    setUsers(prev => prev.filter(u => u.user_id !== user.user_id));

    try {
      const res = await apiService.deleteUser(user.user_id);
      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message || 'Akun berhasil dihapus dari sistem.' });
        await fetchUsers();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Gagal menghapus akun.' });
        await fetchUsers();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal menghapus akun.' });
      await fetchUsers();
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleCopyPassword = (pass: string) => {
    navigator.clipboard.writeText(pass);
    alert('Kata sandi disalin ke clipboard: ' + pass);
  };

  const handleOpenResetModal = (targetUser: User) => {
    setResetUser(targetUser);
    setResetPasswordVal(targetUser.email.toLowerCase() === 'pop@gmail.com' ? 'pop@gmail.com' : 'Poso123!');
  };

  const handleSaveResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser || !resetPasswordVal.trim()) return;

    setIsResetting(true);
    try {
      const res = await apiService.updateUserRole({
        target_user_id: resetUser.user_id,
        new_role: resetUser.role,
        new_upt_unit: resetUser.upt_unit,
        reset_password: resetPasswordVal.trim()
      });

      if (res.status === 'success') {
        setStatusMsg({ 
          type: 'success', 
          text: `Kata sandi untuk ${resetUser.name} (${resetUser.email}) berhasil diubah menjadi: "${resetPasswordVal.trim()}"` 
        });
        setResetUser(null);
        await fetchUsers();
      } else {
        alert(res.message || 'Gagal mengubah kata sandi.');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.');
    } finally {
      setIsResetting(false);
    }
  };

  // Filtered list
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.nip && u.nip.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      (u.role_title && u.role_title.toLowerCase().includes(q)) ||
      (u.kantor_penempatan && u.kantor_penempatan.toLowerCase().includes(q));

    const matchesDept = departmentFilter === 'ALL' || u.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 text-[#0F172A] font-sans selection:bg-[#002B49] selection:text-white">
      
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Manajemen Pengguna & Staf Teknis</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">Kelola data kepegawaian dinas, otorisasi peran, penempatan wilayah, dan kredensial akses PRISMA POS</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-colors shadow-2xs"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#002B49]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAdd(!showAdd);
              setStatusMsg(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-xs font-bold transition-all shadow-sm shadow-[#002B49]/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{showAdd ? 'Tutup Formulir' : 'Tambah Pengguna & Staf Baru'}</span>
          </button>
        </div>
      </div>

      {/* STATUS NOTIFICATION */}
      {statusMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 shadow-2xs ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold">{statusMsg.text}</span>
        </motion.div>
      )}

      {/* =================================================================================================
          FORMULIR PEMBUATAN AKUN PETUGAS & STAF BARU (EXPANDABLE CARD)
      ================================================================================================= */}
      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleAddUser} 
            className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6 overflow-hidden"
          >
            
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#002B49]" />
                  <span>Formulir Pembuatan Akun Petugas & Staf Baru</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Lengkapi data kredensial, peran otorisasi, dan struktur penempatan dinas Pos Indonesia</p>
              </div>

              {/* Sub-badge kanan */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Tersimpan langsung ke Database Master PRISMA POS</span>
              </div>
            </div>

            {/* GROUP 1: INFORMASI KREDENSIAL & AKUN (3 KOLOM) */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002B49] block">
                1. Informasi Kredensial & Akun
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, S.T."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
                  />
                </div>

                {/* Alamat Email Resmi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Alamat Email Resmi <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="budi.santoso@posindonesia.co.id"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
                  />
                </div>

                {/* Kata Sandi dengan Toggle & Generate */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Kata Sandi (Password) <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] text-[#002B49] font-bold hover:underline"
                    >
                      Acak Sandi / Generate
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan kata sandi akun"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm font-mono text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 2: OTORISASI & PERAN DINAS (3 KOLOM) */}
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002B49] block">
                2. Otorisasi & Peran Dinas
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Department / Unit Kerja */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department / Unit Kerja <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] appearance-none transition-all cursor-pointer"
                    >
                      {DEPARTMENT_OPTIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* ID Petugas / NIP */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ID Petugas / NIP <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: POS-2026-9812"
                    value={nip}
                    onChange={e => setNip(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all"
                  />
                </div>

                {/* Peran (Role) Akses Sistem */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Peran (Role) Akses Sistem <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRoleTitle}
                      onChange={e => setSelectedRoleTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] appearance-none transition-all cursor-pointer"
                    >
                      {ROLE_HIERARCHY_OPTIONS.map(r => (
                        <option key={r.label} value={r.label}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 3: UPLOAD FOTO PROFIL PETUGAS */}
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002B49] block">
                3. Foto Profil Petugas
              </span>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                {/* Avatar Preview Box */}
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs overflow-hidden flex items-center justify-center shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview Foto" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-[#94A3B8]" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#002B49]" />
                      <span>Pilih Berkas / Upload Foto</span>
                    </button>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => setAvatarPreview('')}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B]">Format yang didukung: JPG, PNG, WEBP (Maksimal 2MB)</p>
                </div>
              </div>
            </div>

            {/* GROUP 4: DETAIL WILAYAH KERJA & PENEMPATAN DINAS (SUB-CARD / GRID) */}
            <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002B49] block">
                4. Detail Wilayah Kerja & Penempatan Dinas
              </span>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                {/* Baris A (3 Kolom): Jabatan Fungsional, Nama Kantor, Nomor HP */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jabatan Fungsional
                    </label>
                    <input
                      type="text"
                      placeholder="Supervisor Last Mile / Manajer Operasi"
                      value={jabatanFungsional}
                      onChange={e => setJabatanFungsional(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Kantor Penempatan
                    </label>
                    <input
                      type="text"
                      placeholder="Kantor Cabang Utama Bandung"
                      value={kantorPenempatan}
                      onChange={e => setKantorPenempatan(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Handphone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="081234567890"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>
                </div>

                {/* Baris B (Tingkat KC & KCU - 4 Kolom): Nopen KC, Nama KC, Nopen KCU, Nama KCU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-200/70">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nopen KC (No. Pendirian)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 40100"
                      value={nopenKc}
                      onChange={e => setNopenKc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama KC (Kantor Cabang)
                    </label>
                    <input
                      type="text"
                      placeholder="KC Bandung Barat"
                      value={namaKc}
                      onChange={e => setNamaKc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nopen KCU (No. Pendirian)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 40000"
                      value={nopenKcu}
                      onChange={e => setNopenKcu(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama KCU (Cabang Utama)
                    </label>
                    <input
                      type="text"
                      placeholder="KCU Bandung"
                      value={namaKcu}
                      onChange={e => setNamaKcu(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>
                </div>

                {/* Baris C (Tingkat Regional - 2 Kolom): Kode Regional & Nama Regional */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/70">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kode Regional
                    </label>
                    <div className="relative">
                      <select
                        value={regionalCode}
                        onChange={e => handleRegionalCodeChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49] appearance-none"
                      >
                        {Object.keys(REGIONAL_PRESETS).map(code => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama Wilayah Regional
                    </label>
                    <input
                      type="text"
                      placeholder="Regional II Jawa Barat"
                      value={regionalName}
                      onChange={e => setRegionalName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (FOOTER BAR) */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-[#002B49]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan Data...' : 'Simpan Data Pengguna'}</span>
              </button>
            </div>

          </motion.form>
        )}
      </AnimatePresence>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, NIP, department, atau kantor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
          >
            <option value="ALL">Semua Department</option>
            {DEPARTMENT_OPTIONS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-[#64748B] px-2.5 py-1.5 rounded-lg bg-slate-100">
            Total: {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* USERS DATA TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-700 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Petugas / Staf</th>
              <th className="py-3.5 px-4">Kontak & NIP</th>
              <th className="py-3.5 px-4">Department & Jabatan</th>
              <th className="py-3.5 px-4">Peran Akses</th>
              <th className="py-3.5 px-4">Kata Sandi</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#002B49]" />
                  Memuat data akun master database...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  Tidak ada data pengguna yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const isSuperAdmin = u.email === 'admin@poso.local' || (u.role === 'admin' && u.user_id === 'USR-ADMIN01');
                const isPassVisible = visiblePasswords[u.user_id] || false;
                const displayPass = u.password_plain;

                return (
                  <tr key={u.user_id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-xs text-[#002B49] overflow-hidden">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-snug">{u.name}</div>
                          <div className="text-[10px] font-mono text-[#64748B]">ID: {u.user_id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact & NIP */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-medium text-slate-700">{u.email}</div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                        {u.nip && <span>NIP: <strong className="font-mono text-slate-800">{u.nip}</strong></span>}
                        {u.phone_number && <span>• {u.phone_number}</span>}
                      </div>
                    </td>

                    {/* Department & Jabatan */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-[#002B49]">{u.department || 'Pengendalian Operasi'}</div>
                      <div className="text-[11px] text-[#64748B]">{u.jabatan_fungsional || u.kantor_penempatan || 'Kantor Pusat'}</div>
                    </td>

                    {/* Role Badge / Selector */}
                    <td className="py-3.5 px-4">
                      {isSuperAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                          <ShieldAlert className="w-3 h-3" />
                          SUPER ADMIN
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.user_id, e.target.value as UserRole, u.upt_unit)}
                          className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] text-xs font-bold text-slate-800 focus:outline-none focus:border-[#002B49] cursor-pointer"
                        >
                          <option value="operator">OPERATOR</option>
                          <option value="upt">UPT TEKNISI</option>
                          <option value="admin">ADMIN</option>
                          <option value="pengguna_umum">PELAPOR</option>
                        </select>
                      )}
                    </td>

                    {/* Password View & Copy */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {displayPass ? (
                          <div className="inline-flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">
                            <span className="font-mono text-[11px] font-semibold text-slate-800 select-all">
                              {isPassVisible ? displayPass : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.user_id)}
                              className="text-slate-400 hover:text-slate-800 p-0.5"
                              title={isPassVisible ? "Sembunyikan Sandi" : "Lihat Kata Sandi"}
                            >
                              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(displayPass)}
                              className="text-slate-400 hover:text-[#002B49] p-0.5"
                              title="Salin Kata Sandi"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 text-[10px] text-slate-500 font-medium" title="Kata sandi tersimpan aman dalam format hash terenkripsi bcrypt / SHA-256 di database Aiven MySQL">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Terenkripsi</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenResetModal(u)}
                          className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-200 text-[10px] font-bold transition-colors"
                          title="Setel Ulang Kata Sandi"
                        >
                          Ganti
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      {isSuperAdmin ? (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          Dilindungi
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Akun Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* RESET PASSWORD MODAL */}
      {resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#002B49]" />
                <span>Ganti Kata Sandi Pengguna</span>
              </h3>
              <button
                type="button"
                onClick={() => setResetUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#64748B] space-y-1">
              <p>Mengubah kata sandi untuk akun:</p>
              <p className="font-bold text-slate-900">{resetUser.name} ({resetUser.email})</p>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi Baru *</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan kata sandi baru"
                  value={resetPasswordVal}
                  onChange={e => setResetPasswordVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setResetUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isResetting ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
