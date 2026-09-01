import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      if (res.role === 'operator' || res.role === 'upt' || res.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate(fromPath || '/my-tickets', { replace: true });
      }
    } else {
      setErrorMsg(res.message || 'Email atau kata sandi salah.');
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans text-slate-800 selection:bg-[#0D5C75] selection:text-white">
      <div className="w-full max-w-sm space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-lg bg-[#0D5C75] text-white flex items-center justify-center mx-auto mb-2 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Masuk ke POSO</h1>
            <p className="text-xs text-slate-500">Gunakan akun helpdesk atau akun pelapor Anda</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Fill */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">1-Klik Demo:</span>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@poso.local', 'Admin123!')}
                className="py-1 px-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 font-bold text-slate-700 text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('operator@poso.local', 'Operator123!')}
                className="py-1 px-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 font-bold text-[#0D5C75] text-center"
              >
                Operator
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('dewi@gmail.com', 'User123!')}
                className="py-1 px-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 font-bold text-slate-700 text-center"
              >
                Pelapor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="nama@poso.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D5C75]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? 'Memproses...' : 'Masuk'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-[#0D5C75] hover:underline">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
