import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Register: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter.');
      return;
    }

    setErrorMsg('');
    const res = await register(name.trim(), email.trim().toLowerCase(), password);
    if (res.success) {
      setSuccessMsg('Pendaftaran akun berhasil! Mengalihkan ke tiket Anda...');
      setTimeout(() => {
        navigate('/my-tickets', { replace: true });
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 sm:p-6 font-sans text-[#0F172A] selection:bg-[#002B49] selection:text-white overflow-hidden">
      
      {/* 0. AMBIENT FLUID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFD] via-[#F0F5FA] to-[#E9F0F8]" />
        
        {/* Top-Left Pos Teal Fluid Orb */}
        <motion.div 
          animate={{
            x: [-20, 30, -20],
            y: [-15, 25, -15],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-20 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#002B49]/15 via-[#0D5C75]/15 to-transparent blur-[90px]"
        />

        {/* Bottom-Right Warm Pos Orange Glow */}
        <motion.div 
          animate={{
            x: [25, -25, 25],
            y: [20, -20, 20],
            scale: [1.1, 0.95, 1.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#F97316]/18 via-[#FB923C]/12 to-transparent blur-[90px]"
        />

        {/* Minimal dot texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#002B49_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* 1. MAIN REGISTER CONTAINER */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#002B49] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Register Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xl shadow-slate-900/5 space-y-6"
        >
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <Link to="/" className="inline-block">
              <motion.div 
                whileHover={{ rotate: 6, scale: 1.08 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#0D5C75] p-0.5 shadow-lg shadow-[#002B49]/20 mx-auto flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#002B49] to-[#0D5C75] flex items-center justify-center relative overflow-hidden border border-white/20">
                  <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                    <path d="M16 3L26 8V16C26 22 21.5 26.5 16 28C10.5 26.5 6 22 6 16V8L16 3Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.2" />
                    <path d="M10 13L16 9.5L22 13L16 19L10 13Z" fill="#FFFFFF" />
                    <path d="M12 18.5L16 16L20 18.5L16 23L12 18.5Z" fill="#FFFFFF" fillOpacity="0.75" />
                    <circle cx="16" cy="16" r="2.2" fill="#F97316" />
                  </svg>
                </div>
              </motion.div>
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Daftar Akun Baru</h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-1">Registrasi mandiri pelapor & pengguna sistem POSO</p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email Resmi *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="nama@posindonesia.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi (Password) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#002B49]/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftar Akun Sekarang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs sm:text-sm text-[#64748B] border-t border-[#E2E8F0]">
            Sudah memiliki akun terdaftar?{' '}
            <Link to="/login" className="font-bold text-[#002B49] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </motion.div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#64748B]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tersimpan Terenkripsi di Database Master POSO</span>
        </div>

      </div>
    </div>
  );
};
