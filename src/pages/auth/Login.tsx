import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Lock, 
  Mail,
  ArrowLeft, 
  Headphones, 
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Login: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // General States
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: toastError } = useToast();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'register') {
      setAuthMode('register');
    } else if (modeParam === 'login') {
      setAuthMode('login');
    }
  }, [searchParams]);

  const handleSwitchMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setErrorMsg('');
    setSearchParams({ mode });
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        success('Selamat datang kembali!');
        const isStaffRole = res.role === 'admin' || res.role === 'operator' || res.role === 'upt';
        if (isStaffRole) {
          const dest = (from && from !== '/' && from !== '/login' && from !== '/my-tickets') ? from : '/dashboard';
          navigate(dest, { replace: true });
        } else {
          navigate('/my-tickets', { replace: true });
        }
      } else {
        const msg = res.message || 'Kombinasi email atau password salah.';
        setErrorMsg(msg);
        toastError(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat masuk ke sistem.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(regName.trim(), regEmail.trim().toLowerCase(), regPassword);
      if (res.success) {
        success('Pendaftaran akun berhasil! Anda langsung dialihkan.');
        navigate('/my-tickets', { replace: true });
      } else {
        const msg = res.message || 'Pendaftaran akun gagal.';
        setErrorMsg(msg);
        toastError(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi gangguan pendaftaran akun.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden selection:bg-[#0D5C75] selection:text-white">
      
      {/* Main Container Split Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_24px_64px_rgba(15,23,42,0.12)] border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]"
      >
        
        {/* =========================================================================
            LEFT COLUMN: 3D ORGANIC CURVES & WELCOME HERO (OCEAN & CYAN PALETTE)
        ========================================================================= */}
        <div className="lg:col-span-6 relative bg-gradient-to-br from-[#083342] via-[#0D5C75] to-[#199FB1] p-8 sm:p-12 text-white flex flex-col justify-between overflow-hidden">
          
          {/* Background Ambient Glow & Spheres */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Large Curved Blob */}
            <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#199FB1]/50 to-[#0D5C75]/20 blur-2xl" />

            {/* Main Central 3D Sphere */}
            <motion.div 
              animate={{
                y: [-6, 6, -6],
                rotate: [0, 4, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-20 -left-12 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-[#38BDF8] via-[#199FB1] to-[#083342]"
              style={{
                boxShadow: 'inset -20px -20px 50px rgba(8,51,66,0.8), inset 16px 16px 40px rgba(255,255,255,0.45), 0 30px 80px rgba(0,0,0,0.35)'
              }}
            />

            {/* Second Smaller Overlapping 3D Sphere */}
            <motion.div 
              animate={{
                y: [8, -8, 8],
                x: [-4, 4, -4]
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 -right-12 w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#199FB1] via-[#0D5C75] to-[#083342]"
              style={{
                boxShadow: 'inset -14px -14px 35px rgba(0,0,0,0.6), inset 12px 12px 30px rgba(255,255,255,0.35), 0 20px 50px rgba(0,0,0,0.3)'
              }}
            />
          </div>

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-sm">
                <Headphones size={18} color="white" />
              </div>
              <div>
                <span className="text-[15px] font-black tracking-tight text-white block leading-none">POSO</span>
                <span className="text-[10px] font-bold text-[#A5D1E1] tracking-wider uppercase">Helpdesk Terpadu</span>
              </div>
            </div>

            <Link 
              to="/" 
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Beranda</span>
            </Link>
          </div>

          {/* Welcome Text Content */}
          <div className="relative z-10 my-auto py-10 sm:py-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {authMode === 'login' ? 'WELCOME' : 'JOIN POSO'}
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#BAE6FC] uppercase tracking-wider">
              POS INDONESIA HELPDESK SYSTEM
            </p>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm pt-1">
              {authMode === 'login' 
                ? 'Sistem Manajemen Pengaduan & Layanan Terpadu POS Indonesia. Laporkan kendala, pantau progres penanganan, dan tingkatkan efisiensi operasional dengan standar SLA terukur.'
                : 'Daftarkan akun pelapor Anda untuk kemudahan pelacakan riwayat kendala, konsultasi interaktif dua arah bersama operator, dan pembaruan instan.'}
            </p>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-[#BAE6FC]/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Koneksi Sistem Terenkripsi & Terverifikasi SSO</span>
          </div>

        </div>


        {/* =========================================================================
            RIGHT COLUMN: SIGN IN / SIGN UP FORM (CLEAN WHITE CARD)
        ========================================================================= */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white space-y-5">
          
          {/* Top Segmented Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] rounded-xl">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#0D5C75] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Sign In (Masuk)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-[#0D5C75] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Sign Up (Daftar)
            </button>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              {authMode === 'login'
                ? 'Silakan masukkan email dan kata sandi akun Anda'
                : 'Lengkapi formulir singkat untuk membuat akun baru'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Forms with AnimatePresence */}
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              /* ================= MODE: LOGIN ================= */
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleLoginSubmit} 
                className="space-y-4"
              >
                {/* Email Field */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <User size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Email Dinas / User Name"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0]/60 focus:bg-white border border-transparent focus:border-[#0D5C75] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-16 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0]/60 focus:bg-white border border-transparent focus:border-[#0D5C75] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#0D5C75] hover:text-[#199FB1] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#64748B] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0D5C75] focus:ring-[#0D5C75] border-[#CBD5E1]"
                    />
                    <span>Remember me</span>
                  </label>

                  <span 
                    onClick={() => alert('Silakan hubungi Administrator atau IT Support Helpdesk untuk mereset kata sandi akun dinas Anda.')}
                    className="text-xs font-semibold text-[#0D5C75] hover:text-[#199FB1] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </span>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/25 flex items-center justify-center cursor-pointer active:scale-[0.99] mt-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                </button>

                {/* Footer Switch */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#64748B]">
                    Belum memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('register')}
                      className="font-bold text-[#0D5C75] hover:text-[#199FB1] hover:underline cursor-pointer"
                    >
                      Daftar Akun Baru
                    </button>
                  </p>
                </div>
              </motion.form>
            ) : (
              /* ================= MODE: REGISTER ================= */
              <motion.form 
                key="register-form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleRegisterSubmit} 
                className="space-y-3.5"
              >
                {/* Full Name */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0]/60 focus:bg-white border border-transparent focus:border-[#0D5C75] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Email Aktif (contoh@gmail.com)"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0]/60 focus:bg-white border border-transparent focus:border-[#0D5C75] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Kata Sandi (Min. 6 Karakter)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-16 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0]/60 focus:bg-white border border-transparent focus:border-[#0D5C75] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#0D5C75] hover:text-[#199FB1] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {showRegPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Konfirmasi Kata Sandi"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0]/60 focus:bg-white border border-transparent focus:border-[#0D5C75] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Primary Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#0D5C75] hover:bg-[#083342] text-white text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/25 flex items-center justify-center cursor-pointer active:scale-[0.99] mt-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                </button>

                {/* Footer Switch */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#64748B]">
                    Sudah memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="font-bold text-[#0D5C75] hover:text-[#199FB1] hover:underline cursor-pointer"
                    >
                      Masuk di Sini
                    </button>
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

      </motion.div>
    </div>
  );
};

export default Login;
