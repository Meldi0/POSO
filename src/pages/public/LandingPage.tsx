import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Send, 
  Search, 
  Globe, 
  Laptop, 
  Building2, 
  Printer, 
  MailCheck, 
  ShieldCheck, 
  ArrowRight,
  Menu,
  X,
  LogIn,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  Shield,
  Activity,
  FileQuestion
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { SlaGuideModal } from '../../components/poso-landing/SlaGuideModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [slaModalOpen, setSlaModalOpen] = useState(false);
  const [trackTicketId, setTrackTicketId] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('Semua');

  const SERVICE_CATEGORIES = [
    { 
      title: 'Jaringan & Internet', 
      tag: 'Jaringan',
      icon: Globe, 
      desc: 'Kendala koneksi Wi-Fi kampus, kabel LAN, konfigurasi VPN, dan akses jaringan server.' 
    },
    { 
      title: 'Sistem Informasi & Aplikasi', 
      tag: 'Aplikasi',
      icon: Laptop, 
      desc: 'Kendala akun portal akademik, SIAKAD, presensi digital pegawai, dan aplikasi dinas.' 
    },
    { 
      title: 'Sarana & Prasarana', 
      tag: 'Sarpras',
      icon: Building2, 
      desc: 'Pendingin AC ruangan, proyektor kelas, instalasi kelistrikan, dan fasilitas gedung.' 
    },
    { 
      title: 'Hardware & Komputer', 
      tag: 'Hardware',
      icon: Printer, 
      desc: 'Perbaikan PC lab, penggantian toner printer kantor, scanner, dan perangkat penunjang.' 
    },
    { 
      title: 'Layanan Akun & Portal', 
      tag: 'Akun',
      icon: MailCheck, 
      desc: 'Reset kata sandi terkunci, aktivasi email institusi, dan verifikasi single sign-on (SSO).' 
    },
    { 
      title: 'Layanan Umum & Konsultasi', 
      tag: 'Umum',
      icon: ShieldCheck, 
      desc: 'Konsultasi teknis, permohonan peminjaman perangkat lab, dan layanan bantuan terpadu.' 
    }
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackTicketId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackTicketId.trim())}`);
    }
  };

  const filteredCategories = selectedServiceCategory === 'Semua'
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter(c => c.tag === selectedServiceCategory || c.title.includes(selectedServiceCategory));

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 font-sans flex flex-col justify-between selection:bg-[#0D5C75] selection:text-white">
      {/* 1. Glassmorphism Responsive Navbar */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 8, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#083342] via-[#0D5C75] to-[#199FB1] flex items-center justify-center text-white shadow-md shadow-[#0D5C75]/20"
            >
              <Zap className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-[#0D5C75] tracking-tight block leading-none">POSO</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#F58A61]/15 text-[#E77448] border border-[#F58A61]/30">v2.0</span>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Helpdesk Terpadu</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#layanan" className="hover:text-[#0D5C75] transition-colors">Katalog Layanan</a>
            <a href="#sop" className="hover:text-[#0D5C75] transition-colors">Alur SOP</a>
            <button 
              type="button" 
              onClick={() => setSlaModalOpen(true)}
              className="hover:text-[#0D5C75] transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-[#199FB1]" />
              <span>Kebijakan SLA</span>
            </button>
            <Link to="/track" className="hover:text-[#0D5C75] transition-colors">Lacak Tiket</Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={isStaff ? "/dashboard" : "/my-tickets"}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#0D5C75]/20"
              >
                <span>{isStaff ? 'Dashboard Staf' : 'Tiket Saya'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0D5C75] border border-slate-200/90 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Staf</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown with Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2.5 overflow-hidden"
            >
              <a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700 hover:text-[#0D5C75]">Katalog Layanan</a>
              <a href="#sop" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700 hover:text-[#0D5C75]">Alur SOP</a>
              <button 
                type="button" 
                onClick={() => { setMobileMenuOpen(false); setSlaModalOpen(true); }}
                className="w-full text-left py-2 text-xs font-bold text-slate-700 hover:text-[#0D5C75]"
              >
                Kebijakan SLA
              </button>
              <Link to="/track" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700 hover:text-[#0D5C75]">Lacak Tiket</Link>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to={isAuthenticated ? (isStaff ? "/dashboard" : "/my-tickets") : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-gradient-to-r from-[#0D5C75] to-[#199FB1] text-white text-center rounded-xl text-xs font-bold block shadow-md"
                >
                  {isAuthenticated ? (isStaff ? 'Buka Dashboard Staf' : 'Lihat Tiket Saya') : 'Masuk Staf Helpdesk'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section with Interactive Cards */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-10 sm:pt-16 pb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF4F8] text-[#0D5C75] text-xs font-bold mb-4 border border-[#A5D1E1]/40"
          >
            <Clock className="w-3.5 h-3.5 text-[#199FB1]" /> 
            <span>Layanan Pengaduan & Bantuan Terpadu Kampus</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Pusat Bantuan & Layanan <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0D5C75] via-[#199FB1] to-[#0D5C75] bg-clip-text text-transparent">Pengaduan Tiket Terpadu</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Laporkan kendala fasilitas, jaringan internet, atau sistem informasi kampus dengan cepat dan pantau proses pengerjaan teknisi secara transparan.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-slate-600"
          >
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>98.4% Penanganan Tepat Waktu</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-[#199FB1]" />
              <span>Respon Cepat &lt; 2 Jam</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0D5C75]" />
              <span>Multi-Unit UPT Terintegrasi</span>
            </div>
          </motion.div>

          {/* 2 Main Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 text-left max-w-4xl mx-auto">
            {/* Card 1: Submit New Ticket */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:border-[#199FB1] transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0D5C75]/10 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4F8] text-[#0D5C75] flex items-center justify-center mb-4 shadow-sm shadow-[#0D5C75]/10">
                  <Send className="w-6 h-6" />
                </div>
                <h2 className="font-extrabold text-xl text-slate-900">Ajukan Tiket Baru</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Sampaikan keluhan gangguan fasilitas, permintaan instalasi, atau permohonan bantuan teknis baru.
                </p>
              </div>

              <Link
                to="/submit"
                className="mt-6 w-full py-3 bg-gradient-to-r from-[#0D5C75] to-[#199FB1] hover:from-[#083342] hover:to-[#0D5C75] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0D5C75]/20 text-center"
              >
                <span>Mulai Buat Tiket</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Card 2: Track Ticket */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:border-[#199FB1] transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#199FB1]/10 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-slate-700" />
                </div>
                <h2 className="font-extrabold text-xl text-slate-900">Lacak Status Tiket</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Cek tahapan pengerjaan teknisi dan estimasi penyelesaian menggunakan ID Tiket Anda.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="ID Tiket (#TICK-...)"
                  value={trackTicketId}
                  onChange={(e) => setTrackTicketId(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C75]/20 focus:border-[#0D5C75] transition-all"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
                >
                  Lacak
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* 3. Service Catalog Section with Interactive Category Filter */}
        <section id="layanan" className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200/80">
          <div className="text-center mb-6">
            <h2 className="font-black text-2xl text-slate-900">Katalog Bidang Layanan</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Pilih kategori keluhan untuk langsung mengisi formulir dengan panduan terkait</p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto no-scrollbar py-1">
            {['Semua', 'Jaringan', 'Aplikasi', 'Sarpras', 'Hardware', 'Akun', 'Umum'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedServiceCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedServiceCategory === cat
                    ? 'bg-[#0D5C75] text-white shadow-sm shadow-[#0D5C75]/25'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div 
                  key={i}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#199FB1] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EAF4F8] text-[#0D5C75] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{cat.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                  <Link
                    to={`/submit?category=${encodeURIComponent(cat.title)}`}
                    className="mt-4 text-xs font-bold text-[#0D5C75] hover:text-[#199FB1] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Pilih Bidang Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 4. SOP Roadmap Timeline */}
        <section id="sop" className="bg-white border-y border-slate-200/80 py-14">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-black text-2xl text-slate-900">Alur Standar Pelayanan (SOP)</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">4 tahapan penanganan terstandar dan transparan dari pelaporan hingga tuntas</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { no: '01', title: 'Buat Laporan', desc: 'Pelapor mengisi formulir keluhan & melampirkan foto/bukti kendala.' },
                { no: '02', title: 'Triase Operator', desc: 'Operator helpdesk memverifikasi SLA dan mendelegasikan ke UPT terkait.' },
                { no: '03', title: 'Pengerjaan UPT', desc: 'Teknisi unit pelaksana melakukan tindakan perbaikan dan pembaruan berkala.' },
                { no: '04', title: 'Selesai & Evaluasi', desc: 'Laporan tuntas diselesaikan dan pelapor dapat memberi konfirmasi.' },
              ].map((s, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 relative group hover:bg-[#EAF4F8]/40 transition-colors">
                  <span className="font-mono text-xs font-black text-[#0D5C75] bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block mb-3 shadow-2xs">
                    Langkah {s.no}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 5. Modern Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D5C75]">POSO Helpdesk System</span>
            <span>•</span>
            <span>Sistem Layanan Pelaporan Kampus</span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <button type="button" onClick={() => setSlaModalOpen(true)} className="hover:text-[#0D5C75] transition-colors">
              Kebijakan SLA
            </button>
            <Link to="/track" className="hover:text-[#0D5C75] transition-colors">
              Lacak Tiket
            </Link>
            <Link to="/dashboard" className="hover:text-[#0D5C75] transition-colors">
              Portal Staf
            </Link>
          </div>
        </div>
      </footer>

      {/* SLA Guide Modal */}
      <SlaGuideModal 
        isOpen={slaModalOpen} 
        onClose={() => setSlaModalOpen(false)} 
      />
    </div>
  );
};
