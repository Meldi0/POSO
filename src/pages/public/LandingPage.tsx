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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SlaGuideModal } from '../../components/poso-landing/SlaGuideModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [slaModalOpen, setSlaModalOpen] = useState(false);
  const [trackTicketId, setTrackTicketId] = useState('');

  const SERVICE_CATEGORIES = [
    { 
      title: 'Jaringan & Internet', 
      icon: <Globe className="w-5 h-5 text-[#0D5C75]" />, 
      desc: 'Kendala koneksi Wi-Fi kampus, kabel LAN, VPN, dan jaringan server.' 
    },
    { 
      title: 'Sistem Informasi', 
      icon: <Laptop className="w-5 h-5 text-[#0D5C75]" />, 
      desc: 'Kendala akun portal akademik, SIAKAD, presensi online, dan aplikasi dinas.' 
    },
    { 
      title: 'Sarana & Prasarana', 
      icon: <Building2 className="w-5 h-5 text-[#0D5C75]" />, 
      desc: 'AC ruangan, proyektor kelas, instalasi listrik, dan fasilitas gedung.' 
    },
    { 
      title: 'Perangkat Keras', 
      icon: <Printer className="w-5 h-5 text-[#0D5C75]" />, 
      desc: 'Perbaikan PC lab, printer kantor, scanner, dan perangkat penunjang.' 
    },
    { 
      title: 'Email & Akun SSO', 
      icon: <MailCheck className="w-5 h-5 text-[#0D5C75]" />, 
      desc: 'Reset kata sandi, aktivasi akun institusi, dan verifikasi login.' 
    },
    { 
      title: 'Keamanan Siber', 
      icon: <ShieldCheck className="w-5 h-5 text-[#0D5C75]" />, 
      desc: 'Laporan ancaman phishing, malware komputer, dan keamanan data.' 
    }
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackTicketId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackTicketId.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col justify-between selection:bg-[#0D5C75] selection:text-white">
      {/* 1. Simple Clean Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Left */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D5C75] flex items-center justify-center text-white font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base text-[#0D5C75] tracking-tight">POSO</span>
              <span className="text-xs text-slate-500 font-medium ml-1.5 hidden sm:inline">| Helpdesk Terpadu</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#layanan" className="hover:text-[#0D5C75] transition-colors">Katalog Layanan</a>
            <a href="#sop" className="hover:text-[#0D5C75] transition-colors">Alur SOP</a>
            <button 
              type="button" 
              onClick={() => setSlaModalOpen(true)}
              className="hover:text-[#0D5C75] transition-colors"
            >
              Kebijakan SLA
            </button>
            <Link to="/track" className="hover:text-[#0D5C75] transition-colors">Lacak Tiket</Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={isStaff ? "/dashboard" : "/my-tickets"}
                className="px-4 py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>{isStaff ? 'Dashboard Staf' : 'Tiket Saya'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
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
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
            <a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700">Katalog Layanan</a>
            <a href="#sop" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700">Alur SOP</a>
            <Link to="/track" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700">Lacak Tiket</Link>
            <div className="pt-2 border-t border-slate-100">
              <Link
                to={isAuthenticated ? (isStaff ? "/dashboard" : "/my-tickets") : "/login"}
                className="w-full py-2 bg-[#0D5C75] text-white text-center rounded-lg text-xs font-bold block"
              >
                {isAuthenticated ? 'Buka Dashboard' : 'Masuk Staf'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Hero Section (Simple & Clean) */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 pt-12 sm:pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4F8] text-[#0D5C75] text-xs font-bold mb-4">
            <Clock className="w-3.5 h-3.5" /> Layanan Bantuan & Manajemen Pengaduan Kampus
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Pusat Bantuan & Layanan <br className="hidden sm:inline" />
            <span className="text-[#0D5C75]">Pengaduan Tiket Terpadu</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Laporkan kendala fasilitas, jaringan internet, atau sistem informasi kampus dengan mudah dan pantau proses penyelesaiannya secara transparan.
          </p>

          {/* 2 Simple Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
            {/* Card 1: Submit */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#0D5C75] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#EAF4F8] text-[#0D5C75] flex items-center justify-center mb-3">
                  <Send className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-lg text-slate-900">Ajukan Tiket Baru</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sampaikan laporan gangguan fasilitas atau permohonan layanan teknis baru.
                </p>
              </div>

              <Link
                to="/submit"
                className="mt-5 w-full py-2.5 bg-[#0D5C75] hover:bg-[#083342] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span>Buat Tiket Baru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Track */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#0D5C75] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-lg text-slate-900">Lacak Status Tiket</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cek progres dan catatan pengerjaan teknisi menggunakan ID Tiket Anda.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="mt-5 flex gap-2">
                <input
                  type="text"
                  placeholder="ID Tiket (#TICK-...)"
                  value={trackTicketId}
                  onChange={(e) => setTrackTicketId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:border-[#0D5C75]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 3. Service Catalog Grid (Simple) */}
        <section id="layanan" className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200">
          <div className="text-center mb-8">
            <h2 className="font-extrabold text-2xl text-slate-900">Katalog Layanan & Penanganan</h2>
            <p className="text-xs text-slate-500 mt-1">Pilihan bidang kendala yang siap ditangani oleh Unit Pelaksana Teknis (UPT)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <div 
                key={i}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#EAF4F8] flex items-center justify-center mb-3">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{cat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                </div>
                <Link
                  to={`/submit?category=${encodeURIComponent(cat.title)}`}
                  className="mt-3 text-xs font-bold text-[#0D5C75] hover:underline inline-flex items-center gap-1"
                >
                  <span>Pilih Kategori</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 4-Step SOP Roadmap (Simple Timeline) */}
        <section id="sop" className="bg-white border-y border-slate-200 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="font-extrabold text-2xl text-slate-900">Alur Standar Penanganan Tiket</h2>
              <p className="text-xs text-slate-500 mt-1">Proses penanganan 4 langkah yang transparan dan terukur</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { no: '1', title: 'Buat Laporan', desc: 'Pelapor mengisi formulir keluhan & bukti kendala.' },
                { no: '2', title: 'Triase Operator', desc: 'Operator helpdesk memverifikasi SLA dan meneruskan ke UPT.' },
                { no: '3', title: 'Pengerjaan UPT', desc: 'Teknisi unit teknis melakukan tindakan perbaikan.' },
                { no: '4', title: 'Selesai', desc: 'Laporan tuntas dan status diperbarui di sistem.' },
              ].map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-7 h-7 rounded-full bg-[#0D5C75] text-white font-bold text-xs flex items-center justify-center mb-2">
                    {s.no}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 5. Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D5C75]">POSO Helpdesk</span>
            <span>•</span>
            <span>Sistem Tiket & Pengaduan Terpadu</span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <button onClick={() => setSlaModalOpen(true)} className="hover:text-slate-800 transition-colors">
              Kebijakan SLA
            </button>
            <Link to="/track" className="hover:text-slate-800 transition-colors">
              Lacak Tiket
            </Link>
            <Link to="/dashboard" className="hover:text-slate-800 transition-colors">
              Portal Operator
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
