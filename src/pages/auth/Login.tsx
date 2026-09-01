import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft,
  Shield,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error, info } = useToast();

  const fromPath = (location.state as any)?.from?.pathname || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleQuickFill = (demoEmail: string, demoPass: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
    info(`Akun demo ${roleName} dipilih.`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex items-center justify-center p-4 font-sans text-slate-800 selection:bg-[#0D5C75] selection:text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-md space-y-4"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0D5C75] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-5">
          <div className="text-center space-y-1">
            <motion.div 
              whileHover={{ rotate: 8, scale: 1.08 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#083342] via-[#0D5C75] to-[#199FB1] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#0D5C75]/25 cursor-pointer"
            >
              <Zap className="w-6 h-6" />
            </motion.div>
            <h1 className="text-2xl font-black text-slate-900">Masuk ke POSO</h1>
            <p className="text-xs text-slate-500">Gunakan akun staf helpdesk atau akun pelapor Anda</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">
              ⚡ 1-Klik Isi Kredensial Demo:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => handleQuickFill('admin@poso.local', 'Admin123!', 'Super Admin')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 font-extrabold text-slate-800 text-center shadow-2xs transition-colors"
              >
                Admin
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => handleQuickFill('operator@poso.local', 'Operator123!', 'Operator Helpdesk')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 font-extrabold text-[#0D5C75] text-center shadow-2xs transition-colors"
              >
                Operator
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => handleQuickFill('dewi@gmail.com', 'User123!', 'Pelapor')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 font-extrabold text-slate-800 text-center shadow-2xs transition-colors"
              >
                Pelapor
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0D5C75]/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Memvalidasi...' : 'Masuk ke Sistem'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Belum memiliki akun?{' '}
            <Link to="/register" className="font-extrabold text-[#0D5C75] hover:underline">
              Daftar akun di sini
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
