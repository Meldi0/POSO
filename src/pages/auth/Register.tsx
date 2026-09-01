import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  ArrowLeft, 
  Headphones, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(name.trim(), email.trim().toLowerCase(), password);
      if (res.success) {
        success('Pendaftaran akun berhasil! Silakan masuk.');
        navigate('/login');
      } else {
        const msg = res.message || 'Pendaftaran gagal.';
        setErrorMsg(msg);
        toastError(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi gangguan pendaftaran.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans flex flex-col justify-between selection:bg-[#0D5C75] selection:text-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link to="/login" className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0D5C75] transition-colors">
          <ArrowLeft size={15} />
          <span>Kembali ke Login</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-[#0D5C75] flex items-center justify-center text-white">
            <Headphones size={15} />
          </div>
          <span className="font-bold text-[14px] text-[#0D5C75]">POSO Helpdesk</span>
        </div>
      </header>

      {/* Main Form */}
      <div className="max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] border border-[#E2E8F0]/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-7 sm:p-8 space-y-6"
        >
          <div className="text-center space-y-1">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#0F172A]">Daftar Akun Baru</h1>
            <p className="text-[13px] text-[#64748B]">
              Buat akun dinas untuk mempermudah pelacakan laporan kendala
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                Nama Lengkap <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama pelapor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#199FB1]/30 focus:border-[#199FB1] transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                Alamat Email <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="nama@posindonesia.co.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#199FB1]/30 focus:border-[#199FB1] transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                Kata Sandi <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-3.5 pr-10 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#199FB1]/30 focus:border-[#199FB1] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                Konfirmasi Kata Sandi <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Ketik ulang kata sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#199FB1]/30 focus:border-[#199FB1] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-[10px] bg-[#0D5C75] hover:bg-[#083342] text-white text-[14px] font-semibold transition-all shadow-md shadow-[#0D5C75]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <UserPlus size={16} />
              <span>{loading ? 'Mendaftarkan...' : 'Daftar Akun'}</span>
            </button>
          </form>

          <div className="text-center text-[12px] text-[#64748B]">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-[#199FB1] hover:text-[#0D5C75] font-semibold">
              Masuk Sekarang
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#94A3B8]">
        POSO Helpdesk System © 2026
      </footer>
    </div>
  );
};

export default Register;
