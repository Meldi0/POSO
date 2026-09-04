# PRISMA POS — Pos Resolution & Integrated Service Management Application

Aplikasi Helpdesk dan Manajemen Tiket Terpadu modern berbasis web untuk lingkungan kerja **PT Pos Indonesia (Persero)**. Dirancang dengan antarmuka elegan **Ocean Cyan Glassmorphism** yang sepenuhnya responsif di semua ukuran perangkat (desktop, tablet, dan smartphone).

---

## Fitur Utama

- **Portal Pelanggan & Publik**:
  - Pengajuan tiket mandiri dengan formulir interaktif dan kartu pratinjau langsung (*Live Ticket Preview*).
  - Pelacakan progres tiket mandiri berbasis alur 4-tahap visual (*Stepper Timeline*).
  - Unggah foto bukti kerusakan dengan kompresi otomatis di sisi peramban (*client-side canvas compression*).
  - Saluran komunikasi dua arah antara pelapor dan petugas penanganan.
- **Workstation Operator & UPT**:
  - Papan Triase Kanban interaktif yang berfokus pada tiket aktif (*Open, In Progress, Menunggu*).
  - Modul **Arsip Tiket** terpisah untuk pencarian cepat riwayat tiket yang telah selesai ditangani.
  - Laci inspeksi tiket bertab (*Multi-Tab Drawer*) untuk diskusi publik, catatan internal staf (🔒), triase SLA, dan pendelegasian unit teknis.
  - Tampilan tabel adaptif dengan mode kartu responsif untuk perangkat mobile.
- **Sistem Notifikasi Real-Time**:
  - Notifikasi suara sintetis instan (*Web Audio API*) tanpa latensi saat ada respons baru.
  - Integrasi notifikasi peramban (*Browser Push Notification*).
  - Widget mengambang (*Floating Chat Badge*) untuk memantau pesan masuk dari mana saja.
- **Panel Pengelolaan Staf & Akses**:
  - Manajemen akun staf dan peran pengguna berbasis Role-Based Access Control (RBAC).
  - Penugasan tiket ke Unit Pelaksana Teknis (UPT) terkait.

---

## Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express REST API
- **Basis Data**: MySQL Relasional
- **Komunikasi Real-time**: Web Audio API, WebSocket & BroadcastChannel Event Engine

---

## Panduan Memulai Cepat (Quick Start)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Lingkungan
Salin berkas template lingkungan:
```bash
cp .env.example .env
```

### 3. Inisialisasi Basis Data
```bash
npm run test:db
npm run migrate
```

### 4. Menjalankan Aplikasi
```bash
npm run dev
```
Akses aplikasi melalui peramban: `http://localhost:3000`

---

## Dokumentasi Terkait

Untuk dokumentasi lebih mendalam, silakan merujuk pada berkas-berkas berikut:

| Dokumen | Deskripsi |
|---|---|
| [PANDUAN_PENGGUNAAN.md](file:///c:/Users/Asus/Documents/POSIND/POSO/PANDUAN_PENGGUNAAN.md) | Panduan operasional lengkap untuk setiap peran pengguna (Pelapor, Operator, UPT, Admin) |
| [DEPLOYMENT.md](file:///c:/Users/Asus/Documents/POSIND/POSO/DEPLOYMENT.md) | Panduan deployment cloud serverless (Vercel) dan konfigurasi kluster basis data |
| [POSO_PRD.md](file:///c:/Users/Asus/Documents/POSIND/POSO/POSO_PRD.md) | Product Requirements Document & spesifikasi teknis sistem |
| [POSO_BRD.md](file:///c:/Users/Asus/Documents/POSIND/POSO/POSO_BRD.md) | Business Requirements Document & analisis nilai bisnis sistem |
| [AKUN_DEMO_LOGIN.txt](file:///c:/Users/Asus/Documents/POSIND/POSO/AKUN_DEMO_LOGIN.txt) | Daftar kredensial akun demo default untuk pengujian lokal |

---

## Lisensi & Hak Cipta

Hak Cipta © 2026 PT Pos Indonesia (Persero). Seluruh hak dilindungi undang-undang.
