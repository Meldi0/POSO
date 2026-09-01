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
  Sparkles,
  Zap
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error, info } = useToast();

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
      success(`Selamat datang kembali, ${res.role}!`);
      if (res.role === 'operator' || res.role === 'upt' || res.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate(fromPath || '/my-tickets', { replace: true });
      }
    } else {
      setErrorMsg(res.message || 'Email atau kata sandi salah.');
      error('Autentikasi gagal. Periksa kembali email dan kata sandi Anda.');
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string, role: 'admin' | 'operator' | 'pelapor') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSelectedDemoRole(role);
    setErrorMsg('');
    info(`Akun demo ${role.toUpperCase()} dipilih.`);
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-800 selection:bg-[#0D5C75] selection:text-white overflow-hidden">
      
      {/* Ambient Fluid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFD] via-[#F0F5FA] to-[#E9F0F8]" />
        
        <motion.div 
          animate={{
            x: [-20, 30, -20],
            y: [-15, 25, -15],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-20 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#0D5C75]/20 via-[#0284C7]/15 to-transparent blur-[90px]"
        />

        <motion.div 
          animate={{
            x: [25, -25, 25],
            y: [20, -20, 20],
            scale: [1.1, 0.95, 1.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#F58A61]/20 via-[#FB923C]/12 to-transparent blur-[90px]"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md space-y-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0D5C75] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl shadow-slate-900/10 space-y-5"
        >
          <div className="text-center space-y-2">
            <motion.div 
              whileHover={{ rotate: 8, scale: 1.08 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#083342] via-[#0D5C75] to-[#199FB1] text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#0D5C75]/25 cursor-pointer"
            >
              <Zap className="w-7 h-7" />
            </motion.div>
            <h1 className="text-2xl font-black text-slate-900">Masuk ke POSO</h1>
            <p className="text-xs text-slate-500 font-medium">Portal Helpdesk & Layanan Terpadu Pegawai</p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Quick 1-Click Demo Credentials */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#0D5C75]" />
              Pilihan Akun Uji Coba:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@poso.local', 'Admin123!', 'admin')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                  selectedDemoRole === 'admin' 
                    ? 'bg-[#083342] text-white border-[#083342] shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('operator@poso.local', 'Operator123!', 'operator')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                  selectedDemoRole === 'operator' 
                    ? 'bg-[#0D5C75] text-white border-[#0D5C75] shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-[#0D5C75] border-slate-200'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Operator</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('dewi@gmail.com', 'User123!', 'pelapor')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                  selectedDemoRole === 'pelapor' 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Pelapor</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="nama@poso.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Memvalidasi...' : 'Masuk ke Sistem'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Belum memiliki akun terdaftar?{' '}
            <Link to="/register" className="font-extrabold text-[#0D5C75] hover:underline">
              Daftar akun di sini
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
