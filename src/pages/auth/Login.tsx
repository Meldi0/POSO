import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Headphones,
  Sparkles
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = (location.state as any)?.from?.pathname || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDemoRole, setSelectedDemoRole] = useState<'admin' | 'operator' | 'pelapor' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }

    setErrorMsg('');
    const res = await login(email.trim(), password);
    if (res.success) {
      if (res.role === 'operator' || res.role === 'upt' || res.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate(fromPath || '/my-tickets', { replace: true });
      }
    } else {
      setErrorMsg(res.message || 'Email atau kata sandi salah.');
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string, role: 'admin' | 'operator' | 'pelapor') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSelectedDemoRole(role);
    setErrorMsg('');
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-800 selection:bg-[#0D5C75] selection:text-white overflow-hidden">
      
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
          className="absolute -top-24 -left-20 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#0D5C75]/25 via-[#0284C7]/20 to-transparent blur-[90px]"
        />

        {/* Bottom-Right Warm Pos Orange Glow */}
        <motion.div 
          animate={{
            x: [25, -25, 25],
            y: [20, -20, 20],
            scale: [1.1, 0.95, 1.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#F97316]/22 via-[#FB923C]/16 to-transparent blur-[90px]"
        />

        {/* Minimal dot texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#002B49_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* 1. MAIN LOGIN CONTAINER */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0D5C75] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/90 shadow-2xl shadow-slate-900/10 space-y-6"
        >
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <Link to="/" className="inline-block">
              <motion.div 
                whileHover={{ rotate: 6, scale: 1.08 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#0D5C75] p-0.5 shadow-lg shadow-[#0D5C75]/25 mx-auto flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#002B49] to-[#0D5C75] flex items-center justify-center relative overflow-hidden border border-white/20">
                  <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                    <defs>
                      <linearGradient id="loginTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0EA5E9" />
                      </linearGradient>
                    </defs>
                    <path d="M16 3L26 8V16C26 22 21.5 26.5 16 28C10.5 26.5 6 22 6 16V8L16 3Z" fill="url(#loginTealGrad)" fillOpacity="0.2" stroke="url(#loginTealGrad)" strokeWidth="1.2" />
                    <path d="M10 13L16 9.5L22 13L16 19L10 13Z" fill="#FFFFFF" />
                    <path d="M12 18.5L16 16L20 18.5L16 23L12 18.5Z" fill="#FFFFFF" fillOpacity="0.75" />
                    <circle cx="16" cy="16" r="2.2" fill="#F97316" />
                  </svg>
                </div>
              </motion.div>
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Masuk ke POSO</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Portal Helpdesk & Layanan Terpadu Pegawai</p>
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

          {/* 1-Click Quick Demo Switcher */}
          <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#0D5C75]" />
                Pilihan Akun Uji Coba:
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@poso.local', 'Admin123!', 'admin')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  selectedDemoRole === 'admin' 
                    ? 'bg-[#002B49] text-white border-[#002B49] shadow-xs' 
                    : 'bg-white hover:bg-slate-100/90 text-slate-700 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('operator@poso.local', 'Operator123!', 'operator')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  selectedDemoRole === 'operator' 
                    ? 'bg-[#0D5C75] text-white border-[#0D5C75] shadow-xs' 
                    : 'bg-white hover:bg-slate-100/90 text-[#0D5C75] border-slate-200'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Operator</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('dewi@gmail.com', 'User123!', 'pelapor')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  selectedDemoRole === 'pelapor' 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs' 
                    : 'bg-white hover:bg-slate-100/90 text-slate-700 border-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Pelapor</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="nama@poso.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D5C75] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D5C75] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#002B49] to-[#0D5C75] hover:from-[#001c30] hover:to-[#083342] text-white text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/25 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Akun'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="pt-2 text-center text-xs font-medium text-slate-500 border-t border-slate-100">
            Belum memiliki akun terdaftar?{' '}
            <Link to="/register" className="font-bold text-[#0D5C75] hover:underline">
              Daftar akun baru
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
