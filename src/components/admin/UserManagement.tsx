import React, { useState, useEffect } from 'react';
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
  UserCheck
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { apiService } from '../../services/api';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Poso123!');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('operator');
  const [uptUnit, setUptUnit] = useState('UPT TI & Jaringan');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Map to toggle password visibility per user in table
  const [visiblePasswords, setVisiblePasswords] = useState<{ [userId: string]: boolean }>({});

  // Reset Password Modal State
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const uptList = [
    'UPT TI & Jaringan',
    'UPT Sarana & Prasarana',
    'UPT Sistem Informasi & Akun',
    'UPT Hardware & Workshop',
    'Helpdesk Pusat & Layanan Terpadu'
  ];

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

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setStatusMsg({ type: 'error', text: 'Nama dan email wajib diisi.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await apiService.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
        upt_unit: role === 'upt' ? uptUnit : undefined
      });

      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: `Akun ${name} (${role}) berhasil ditambahkan ke database!` });
        setName('');
        setEmail('');
        setPassword('Poso123!');
        setShowAdd(false);
        await fetchUsers();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Gagal menambahkan akun.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' });
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
        setStatusMsg({ type: 'success', text: 'Peran pengguna berhasil diperbarui.' });
        await fetchUsers();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Gagal mengubah peran.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Terjadi kesalahan koneksi.' });
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.email === 'admin@poso.local' || (user.role === 'admin' && user.user_id === 'USR-ADMIN01')) {
      alert('Akun Super Administrator Utama dilindungi dan tidak dapat dihapus.');
      return;
    }

    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus akun "${user.name}" (${user.email}) dari database?`);
    if (!confirmDelete) return;

    try {
      const res = await apiService.deleteUser(user.user_id);
      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message || 'Akun berhasil dihapus.' });
        await fetchUsers();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Gagal menghapus akun.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal menghapus akun.' });
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

  return (
    <div className="space-y-5 text-slate-800 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manajemen Pengguna & Staf Teknis</h2>
          <p className="text-xs text-slate-500">Kelola akun, peran akses, kata sandi, dan unit teknis dalam database</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0D5C75]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAdd(!showAdd);
              setStatusMsg(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAdd ? 'Tutup Formulir' : 'Tambah Staf Baru'}</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMsg && (
        <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold">{statusMsg.text}</span>
        </div>
      )}

      {/* Add User Form */}
      {showAdd && (
        <form onSubmit={handleAddUser} className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#0D5C75]" />
              <span>Formulir Pembuatan Akun Staf Baru</span>
            </h3>
            <span className="text-[11px] text-slate-500">Tersimpan langsung ke Database Master</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0D5C75]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alamat Email *</label>
              <input
                type="email"
                required
                placeholder="nama@poso.local"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0D5C75]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-700">Kata Sandi (Password) *</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[10px] text-[#0D5C75] font-bold hover:underline"
                >
                  Acak Sandi
                </button>
              </div>
              <div className="relative">
                <input
                  type={showFormPassword ? "text" : "password"}
                  required
                  placeholder="Password akun"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#0D5C75]"
                />
                <button
                  type="button"
                  onClick={() => setShowFormPassword(!showFormPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Peran (Role) Akses</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0D5C75]"
              >
                <option value="operator">Staff Operator Helpdesk</option>
                <option value="upt">Teknisi Unit UPT</option>
                <option value="admin">Administrator Sistem</option>
                <option value="pengguna_umum">Pengguna Umum (Pelapor)</option>
              </select>
            </div>

            {role === 'upt' && (
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Unit Penugasan UPT</label>
                <select
                  value={uptUnit}
                  onChange={e => setUptUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0D5C75]"
                >
                  {uptList.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Menyimpan ke DB...' : 'Simpan Akun ke Database'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="py-3 px-4">Nama Staf</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Kata Sandi</th>
              <th className="py-3 px-4">Peran (Role)</th>
              <th className="py-3 px-4">Unit Penugasan</th>
              <th className="py-3 px-4 text-center">Aksi / Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Memuat data akun dari database...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada data pengguna.
                </td>
              </tr>
            ) : (
              users.map(u => {
                const isSuperAdmin = u.email === 'admin@poso.local' || (u.role === 'admin' && u.user_id === 'USR-ADMIN01');
                const isPassVisible = visiblePasswords[u.user_id] || false;
                const displayPass = u.password_plain || (u.email.toLowerCase() === 'pop@gmail.com' ? 'pop@gmail.com' : u.role === 'admin' ? 'Admin123!' : u.role === 'operator' ? 'Operator123!' : 'Poso123!');

                return (
                  <tr key={u.user_id} className="hover:bg-slate-50 transition-colors">
                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <span className="font-mono text-[10px] text-slate-400">{u.user_id}</span>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {u.email}
                    </td>

                    {/* Password with View, Copy & Ganti Sandi */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
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
                            className="text-slate-400 hover:text-[#0D5C75] p-0.5"
                            title="Salin Kata Sandi"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenResetModal(u)}
                          className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-200/80 text-[10px] font-bold transition-colors flex items-center gap-1"
                          title="Ganti / Reset Kata Sandi Baru untuk User Ini"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span className="hidden sm:inline">Ganti</span>
                        </button>
                      </div>
                    </td>

                    {/* Role Dropdown Selector */}
                    <td className="py-3 px-4">
                      {isSuperAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                          <ShieldAlert className="w-3 h-3" />
                          SUPER ADMIN
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.user_id, e.target.value as UserRole, u.upt_unit)}
                          className="px-2 py-1 rounded-md bg-slate-50 hover:bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0D5C75] cursor-pointer"
                        >
                          <option value="operator">OPERATOR</option>
                          <option value="upt">UPT TEKNISI</option>
                          <option value="admin">ADMIN</option>
                          <option value="pengguna_umum">PELAPOR</option>
                        </select>
                      )}
                    </td>

                    {/* UPT Unit */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {u.role === 'upt' ? (
                        <select
                          value={u.upt_unit || 'UPT TI & Jaringan'}
                          onChange={(e) => handleChangeRole(u.user_id, 'upt', e.target.value)}
                          className="px-2 py-1 rounded-md bg-slate-50 hover:bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0D5C75]"
                        >
                          {uptList.map(item => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>

                    {/* Actions: Delete with Super Admin protection */}
                    <td className="py-3 px-4 text-center">
                      {isSuperAdmin ? (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded" title="Akun super admin utama tidak dapat dihapus">
                          Dilindungi
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Akun dari Database"
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

      {/* Modal: Ganti Kata Sandi */}
      {resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Ubah Kata Sandi Akun</h3>
                <p className="text-xs text-slate-500">{resetUser.name} ({resetUser.email})</p>
              </div>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Masukkan Kata Sandi Baru *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    placeholder="Ketik password baru untuk akun ini"
                    className="w-full pl-3 pr-20 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D5C75]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
                      let gen = '';
                      for (let i = 0; i < 10; i++) gen += chars.charAt(Math.floor(Math.random() * chars.length));
                      setResetPasswordVal(gen);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-[10px] font-bold text-slate-700"
                  >
                    Acak
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Kata sandi baru akan langsung disimpan ke database Google Sheets dan dapat digunakan untuk login seketika.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetUser(null)}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isResetting || !resetPasswordVal.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-[#0D5C75]/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isResetting ? 'Menyimpan...' : 'Simpan Kata Sandi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
