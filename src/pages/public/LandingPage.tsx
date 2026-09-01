import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
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
  Layers,
  Clock,
  CheckCircle2,
  ChevronRight,
  Shield,
  Zap,
  Activity,
  Headphones,
  FileCheck,
  Server,
  Database,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Eye,
  TrendingUp,
  Cpu,
  Inbox,
  Check,
  ExternalLink,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Ticket } from '../../types';
import { SlaGuideModal } from '../../components/poso-landing/SlaGuideModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [slaModalOpen, setSlaModalOpen] = useState(false);
  const [trackTicketId, setTrackTicketId] = useState('');
  
  // Real Database State
  const [liveTickets, setLiveTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<'tickets' | 'upt' | 'system'>('tickets');

  // Fetch real tickets from database
  const fetchLiveTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await apiService.getTickets();
      if (res && res.status === 'success' && res.data) {
        setLiveTickets(res.data.tickets || []);
      }
    } catch (err) {
      console.warn('Failed to fetch live tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchLiveTickets();
  }, []);

  // Compute real honest analytics from live database
  const totalCount = liveTickets.length;
  const openCount = liveTickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting').length;
  const closedCount = liveTickets.filter(t => t.status === 'closed').length;
  const urgentCount = liveTickets.filter(t => t.priority === 'Urgent' && (t.status === 'open' || t.status === 'in_progress')).length;

  // Real UPT list & active counts
  const UPT_UNITS = [
    { name: 'UPT TI & Sistem Informasi', icon: Globe, desc: 'Wi-Fi, LAN, Server, Router Jaringan, VPN' },
    { name: 'UPT Sarana & Prasarana (CGS)', icon: Building2, desc: 'Gedung, Listrik, Genset, AC, Proyektor' },
    { name: 'UPT Pengendalian Operasi', icon: Zap, desc: 'First Mile, Mid Mile, Last Mile, Armada Transportasi' },
    { name: 'UPT Quality Control & Security', icon: ShieldCheck, desc: 'Audit Standar Mutu SLA, Investigasi & Keamanan' },
  ];

  // Unified, harmonized service categories using consistent Pos Teal palette
  const SERVICE_CATEGORIES = [
    { 
      title: 'Pengendalian Operasi', 
      icon: Zap, 
      badge: 'Logistik & Distribusi',
      desc: 'Kendala pengiriman first mile, sortir hub mid mile, antaran last mile kurir, dan operasional armada transportasi.' 
    },
    { 
      title: 'Corporate General Services (CGS)', 
      icon: Building2, 
      badge: 'Fasilitas & Gedung',
      desc: 'Pemeliharaan fisik gedung, kelistrikan & panel PLN, genset darurat, pendingin ruangan (AC), dan sarana kantor.' 
    },
    { 
      title: 'Postal Security', 
      icon: ShieldCheck, 
      badge: 'Keamanan & Aset',
      desc: 'Pemeriksaan rekaman CCTV, akses fisik pintu/pos jaga, investigasi insiden keamanan barang kiriman, dan tata tertib dinas.' 
    },
    { 
      title: 'Quality Control', 
      icon: CheckCircle2, 
      badge: 'Audit & Kepatuhan',
      desc: 'Audit kepatuhan standar SLA operasional, rekonsiliasi manifes pos dinas, dan penjaminan kualitas layanan pelanggan.' 
    },
    { 
      title: 'IT & Sistem Informasi', 
      icon: Globe, 
      badge: 'Jaringan & Portal',
      desc: 'Troubleshooting jaringan LAN/Wi-Fi kampus, konfigurasi router, perbaikan PC workstation, dan akun portal dinas.' 
    }
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackTicketId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackTicketId.trim())}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-blue-500" />Baru</span>;
      case 'in_progress':
        return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />Diproses</span>;
      case 'waiting':
        return <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-purple-500" />Menunggu</span>;
      case 'closed':
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-emerald-500" />Selesai</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap">{status}</span>;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] text-[#0F172A] font-sans selection:bg-[#002B49] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* 0. ORGANIC FLUID MESH BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFD] via-[#F0F5FA] to-[#E9F0F8]" />
        <motion.div 
          animate={{
            x: [-30, 40, -30],
            y: [-25, 35, -25],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-20 w-[950px] h-[950px] rounded-full bg-gradient-to-br from-[#002B49]/15 via-[#0D5C75]/15 to-[#38BDF8]/10 blur-[90px]"
        />
        <motion.div 
          animate={{
            x: [35, -35, 35],
            y: [30, -30, 30],
            scale: [1.1, 0.92, 1.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] -right-24 w-[850px] h-[850px] rounded-full bg-gradient-to-bl from-[#F97316]/15 via-[#FB923C]/12 to-[#FEF08A]/15 blur-[95px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#002B49_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* 1. FIXED TOP BAR (FLUID RESPONSIVE EDGE-TO-EDGE, NO WRAPPING) */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-[#E2E8F0] shadow-xs">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Left */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <motion.div 
              whileHover={{ rotate: 6, scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#0D5C75] p-0.5 shadow-md shadow-[#002B49]/20 flex items-center justify-center cursor-pointer shrink-0"
            >
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#002B49] to-[#0D5C75] flex items-center justify-center relative overflow-hidden border border-white/20">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <path d="M16 3L26 8V16C26 22 21.5 26.5 16 28C10.5 26.5 6 22 6 16V8L16 3Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M10 13L16 9.5L22 13L16 19L10 13Z" fill="#FFFFFF" />
                  <path d="M12 18.5L16 16L20 18.5L16 23L12 18.5Z" fill="#FFFFFF" fillOpacity="0.75" />
                  <circle cx="16" cy="16" r="2" fill="#F97316" />
                </svg>
              </div>
            </motion.div>
            <div className="whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-[#002B49] tracking-tight block leading-none">POSO</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#002B49]/10 text-[#002B49] border border-[#002B49]/25">v2.0</span>
              </div>
              <span className="text-xs font-semibold text-[#64748B] mt-0.5 hidden sm:block">
                PT Pos Indonesia (Persero) • Helpdesk Terpadu
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items (Strictly 1 Line whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm xl:text-base font-bold text-slate-700 whitespace-nowrap">
            <a href="#layanan" className="hover:text-[#002B49] transition-colors">Katalog Layanan</a>
            <a href="#sop" className="hover:text-[#002B49] transition-colors">Alur Standar (SOP)</a>
            <a href="#tentang" className="hover:text-[#002B49] transition-colors">Tentang Sistem</a>
            <button 
              type="button" 
              onClick={() => setSlaModalOpen(true)}
              className="hover:text-[#002B49] transition-colors font-bold cursor-pointer"
            >
              Kebijakan SLA
            </button>
            <Link to="/track" className="hover:text-[#002B49] transition-colors flex items-center gap-1.5 text-[#002B49]">
              <Compass className="w-4 h-4 text-[#002B49]" />
              <span>Lacak Tiket</span>
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 whitespace-nowrap">
            {isAuthenticated ? (
              <Link
                to={isStaff ? "/dashboard" : "/my-tickets"}
                className="px-5 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001D33] text-white text-sm font-bold transition-all shadow-md shadow-[#002B49]/20 flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>{isStaff ? 'Buka Dashboard' : 'Tiket Saya'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#002B49] text-sm font-bold transition-all flex items-center gap-2 shadow-2xs active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#002B49]" />
                <span>Portal Staf</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-lg"
          >
            <a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-slate-800">Katalog Layanan</a>
            <a href="#sop" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-slate-800">Alur Standar (SOP)</a>
            <a href="#tentang" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-slate-800">Tentang Sistem</a>
            <button type="button" onClick={() => { setMobileMenuOpen(false); setSlaModalOpen(true); }} className="block py-2 text-base font-bold text-left text-slate-800">Kebijakan SLA</button>
            <Link to="/track" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-[#002B49]">Lacak Tiket</Link>
            <div className="pt-3 border-t border-slate-100">
              <Link
                to={isAuthenticated ? (isStaff ? "/dashboard" : "/my-tickets") : "/login"}
                className="w-full py-3 bg-[#002B49] text-white text-center rounded-xl text-sm font-bold block shadow-md"
              >
                {isAuthenticated ? (isStaff ? 'Buka Dashboard Staf' : 'Lihat Tiket Saya') : 'Masuk Portal Staf'}
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <main className="relative z-10 flex-1 pt-24 sm:pt-28 space-y-16 sm:space-y-24">
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-2xs text-xs sm:text-sm font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[#002B49]">Layanan Helpdesk 24/7</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-600">PT Pos Indonesia (Persero)</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
                Pusat Bantuan & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002B49] to-[#0D5C75]">
                  Layanan Pengaduan Dinas
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-[#64748B] max-w-2xl leading-relaxed font-normal">
                Sistem terpadu untuk penanganan kendala operasional, fasilitas gedung, kelistrikan & AC, jaringan internet, serta portal dinas. Pantau progres pengerjaan teknisi secara transparan, terukur, dan berstandar SLA.
              </p>

              {/* 2 Primary Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Card 1: Submit Ticket */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm hover:border-[#002B49]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#0D5C75] text-white flex items-center justify-center mb-4 shadow-md shadow-[#002B49]/20">
                      <Send className="w-6 h-6" />
                    </div>
                    <h2 className="font-bold text-lg sm:text-xl text-[#0F172A]">Ajukan Tiket Baru</h2>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed font-normal">
                      Sampaikan laporan kerusakan fasilitas fisik, operasional armada, atau keluhan sistem dinas.
                    </p>
                  </div>

                  <Link
                    to="/submit"
                    className="mt-6 w-full py-3 bg-[#002B49] hover:bg-[#001D33] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-[#002B49]/20 active:scale-95 text-center"
                  >
                    <span>Buat Tiket Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                {/* Card 2: Track Ticket */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm hover:border-[#002B49]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-13 h-13 rounded-2xl bg-sky-50 text-[#002B49] flex items-center justify-center mb-4 border border-sky-200">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h2 className="font-bold text-lg sm:text-xl text-[#0F172A]">Lacak Status Tiket</h2>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed font-normal">
                      Pantau progres penanganan teknisi UPT, riwayat pesan, dan foto bukti resmi via ID Tiket Anda.
                    </p>
                  </div>

                  <form onSubmit={handleTrackSubmit} className="mt-6 flex gap-2">
                    <input
                      type="text"
                      placeholder="ID Tiket (TICK-...)"
                      value={trackTicketId}
                      onChange={(e) => setTrackTicketId(e.target.value)}
                      className="flex-1 min-w-0 px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:bg-white focus:ring-2 focus:ring-[#002B49] transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#002B49] hover:bg-[#001D33] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer"
                    >
                      Cari
                    </button>
                  </form>
                </motion.div>
              </div>

              {/* Quick Category Launcher Pills */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-2.5">
                  Akses Cepat Kategori Penanganan:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigate(`/submit?category=${encodeURIComponent(cat.title)}`)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 hover:text-[#002B49] hover:border-[#002B49]/40 text-xs sm:text-sm font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <cat.icon className="w-4 h-4 text-[#002B49]" />
                      <span>{cat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Workstation Widget */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 flex flex-col justify-center w-full"
            >
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 space-y-5 relative">
                {/* Header Widget */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#002B49] text-white flex items-center justify-center font-bold shadow-sm">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-[#0F172A]">Workstation Live Feed</h3>
                      <p className="text-xs text-[#64748B] font-medium">Terhubung ke Database POSO</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={fetchLiveTickets}
                    title="Segarkan Data Tiket"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin text-[#002B49]' : ''}`} />
                  </button>
                </div>

                {/* Interactive Segmented Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('tickets')}
                    className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${activeRightTab === 'tickets' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Tiket Aktif ({openCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('upt')}
                    className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${activeRightTab === 'upt' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Unit UPT (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('system')}
                    className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${activeRightTab === 'system' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Status Sistem
                  </button>
                </div>

                {/* Tab Content 1: REAL LIVE TICKETS */}
                {activeRightTab === 'tickets' && (
                  <div className="space-y-3">
                    {loadingTickets ? (
                      <div className="py-12 text-center text-slate-400 text-sm font-semibold flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#002B49]" />
                        <span>Memuat data tiket terkini...</span>
                      </div>
                    ) : liveTickets.length === 0 ? (
                      <div className="py-10 text-center text-slate-500 text-sm font-semibold">
                        Belum ada tiket dalam database.
                      </div>
                    ) : (
                      liveTickets.slice(0, 3).map((t) => (
                        <motion.div
                          key={t.ticket_id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => navigate(`/track?id=${encodeURIComponent(t.ticket_id)}`)}
                          className="p-4 bg-[#F8FAFC] hover:bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all cursor-pointer space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#002B49] group-hover:underline">
                              #{t.ticket_id}
                            </span>
                            {getStatusBadge(t.status)}
                          </div>
                          <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1 group-hover:text-[#002B49] transition-colors">
                            {t.subject}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold pt-1 border-t border-slate-200">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {t.assigned_upt || 'Menunggu Disposisi'}
                            </span>
                            <span className="text-[#002B49] font-bold flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              Lacak
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 border-t border-slate-100">
                      <span>Total: <strong className="text-slate-900">{totalCount} Tiket</strong></span>
                      <span>Selesai: <strong className="text-emerald-700">{closedCount}</strong></span>
                      <span>Urgent: <strong className="text-rose-700">{urgentCount}</strong></span>
                    </div>
                  </div>
                )}

                {/* Tab Content 2: REAL UPT WORKLOAD */}
                {activeRightTab === 'upt' && (
                  <div className="space-y-3">
                    {UPT_UNITS.map((u, idx) => {
                      const count = liveTickets.filter(t => (t.assigned_upt || '').toLowerCase().includes(u.name.toLowerCase()) && (t.status === 'open' || t.status === 'in_progress')).length;
                      return (
                        <div key={idx} className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] text-[#002B49] flex items-center justify-center shrink-0 shadow-2xs">
                              <u.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-[#0F172A]">{u.name}</h4>
                              <p className="text-[11px] text-[#64748B] font-medium truncate max-w-[200px]">{u.desc}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${count > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                            {count} Aktif
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tab Content 3: SERVER STATUS */}
                {activeRightTab === 'system' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          Database Master POSO
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Online</span>
                      </div>
                      <p className="text-xs text-emerald-800 font-medium">Sinkronisasi otomatis dua arah dengan sheet Tickets, Users, dan Threads.</p>
                    </div>

                    <div className="p-4 bg-sky-50/90 border border-sky-200 rounded-2xl space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-[#002B49] flex items-center gap-2">
                          <Database className="w-4 h-4 text-[#002B49]" />
                          Google Drive Storage Folder
                        </span>
                        <span className="text-xs font-bold text-[#002B49] bg-sky-100 px-2 py-0.5 rounded-md">Terhubung</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">Tempat penyimpanan berkas lampiran foto bukti laporan secara aman.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. SERVICE CATALOG SECTION */}
        <section id="layanan" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight">
              Katalog Layanan & Penanganan UPT
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto font-normal">
              Pilihan bidang kendala yang siap ditangani oleh Unit Pelaksana Teknis secara cepat, terkoordinasi, dan profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => navigate(`/submit?category=${encodeURIComponent(cat.title)}`)}
                className="bg-white rounded-3xl p-7 border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#002B49] border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8FAFC] text-slate-700 border border-[#E2E8F0]">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-[#0F172A] group-hover:text-[#002B49] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed font-normal">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs sm:text-sm font-bold text-[#002B49]">
                  <span>Ajukan Laporan Ini</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. 4-STEP SOP ROADMAP */}
        <section id="sop" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-10 shadow-xs">
            <div className="text-center mb-10 space-y-2">
              <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight">
                Alur Standar Penanganan Tiket (SOP)
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto font-normal">
                Proses penanganan 4 langkah yang transparan, terukur, dan berstandar SLA mutu tinggi
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
              {[
                { no: '01', title: 'Buat Laporan', desc: 'Pelapor mengisi formulir keluhan & unggah foto bukti ke Google Drive.', target: 'Instan' },
                { no: '02', title: 'Triase Operator', desc: 'Operator memverifikasi prioritas SLA dan meneruskan tiket ke unit UPT.', target: '< 15 Menit' },
                { no: '03', title: 'Pengerjaan UPT', desc: 'Teknisi unit teknis mengeksekusi perbaikan dan memberi update real-time.', target: 'Sesuai SLA' },
                { no: '04', title: 'Selesai & Arsip', desc: 'Laporan selesai diverifikasi, tersimpan aman, dan dapat ditutup tuntas.', target: 'Tuntas' },
              ].map((s, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-4 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-xl bg-[#002B49] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {s.no}
                      </span>
                      <span className="text-xs font-bold text-[#002B49] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                        {s.target}
                      </span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-[#0F172A]">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed font-normal">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ABOUT SYSTEM SECTION */}
        <section id="tentang" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#002B49] flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#0F172A]">Layanan Satu Pintu Terpadu</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                Seluruh keluhan fasilitas gedung, jaringan internet, armada transportasi, hingga akun portal pegawai tercatat dalam satu sistem resmi tanpa tercecer di pesan pribadi.
              </p>
            </div>

            <div className="p-7 sm:p-8 bg-gradient-to-br from-[#002B49] to-[#0D5C75] text-white rounded-3xl shadow-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center font-bold">
                <Zap className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-white">Triase Multi-UPT & SLA Otomatis</h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-normal">
                Sistem triase cerdas yang mendelegasikan tiket ke teknisi unit terkait secara instan dengan target penyelesaian darurat 4 jam hingga 24 jam.
              </p>
            </div>

            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#002B49] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-[#002B49]" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#0F172A]">Pelacakan Transparan</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                Pengguna dapat memantau progres perbaikan melalui ID Tiket kapan saja, melihat riwayat percakapan staf, dan mengakses foto bukti resmi secara transparan.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="relative z-10 bg-white border-t border-[#E2E8F0] py-8 mt-12">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#64748B]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#002B49]">POSO Helpdesk</span>
            <span>•</span>
            <span className="font-medium">PT Pos Indonesia (Persero)</span>
            <span>•</span>
            <span className="font-medium">v2.0</span>
          </div>

          <div className="flex items-center gap-6 font-bold whitespace-nowrap">
            <a href="#layanan" className="hover:text-[#0F172A] transition-colors">Katalog Layanan</a>
            <button type="button" onClick={() => setSlaModalOpen(true)} className="hover:text-[#0F172A] transition-colors cursor-pointer">Kebijakan SLA</button>
            <Link to="/track" className="hover:text-[#0F172A] transition-colors">Lacak Tiket</Link>
            <Link to="/dashboard" className="text-[#002B49] hover:underline transition-colors">Portal Operator</Link>
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
