# POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.5)

Aplikasi Helpdesk dan Manajemen Tiket Terpadu Modern berbasis **React 18 + TypeScript + Vite** dengan desain visual **Ocean Cyan & Glassmorphism**, didukung backend **Node.js / Express REST API** dan basis data relasional cloud **Aiven for MySQL** (SSL Mode: REQUIRED), serta sistem komunikasi & notifikasi real-time instan (**WebSocket + Universal LocalStorage Event + BroadcastChannel + Web Audio API**).

Aplikasi ini dirancang **100% responsif** (ponsel, tablet, desktop) dengan fitur unggulan: **Single Source of Truth Aiven MySQL**, **Sistem Notifikasi Real-time Pelanggan & Staf**, *Live Ticket Preview*, *Interactive Kanban Board*, dan *Multi-Tab Isolated Session Architecture*.

---

## 1. STRUKTUR ARSITEKTUR PROYEK

```
POSO/
├── server/                 # Official Backend Node.js / Express API
│   ├── config/db.js        # Aiven MySQL Connection Pool (SSL REQUIRED)
│   ├── controllers/        # Auth, Ticket, User, Analytics Controllers
│   ├── middleware/         # JWT Authentication & RBAC Middleware
│   ├── database/migrate.js # Skrip otomatisasi schema & seed Aiven MySQL
│   └── server.js           # Express API Server Entry Point (Port 5000)
├── src/                    # Frontend React 18 + TypeScript + Tailwind CSS
│   ├── components/
│   │   ├── admin/
│   │   │   ├── DataSourceConfig.tsx    # Pemantauan status cluster Aiven MySQL
│   │   │   └── UserManagement.tsx      # Manajemen pengguna & role RBAC
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx           # Pelindung rute login & otorisasi RBAC
│   │   ├── common/
│   │   │   ├── AttachmentGallery.tsx   # Galeri thumbnail gambar asli, Google CDN preview & Lightbox modal
│   │   │   ├── Badge.tsx               # Komponen badge status/prioritas
│   │   │   ├── ErrorBoundary.tsx       # Penangkap error React DOM runtime yang aman
│   │   │   └── Modal.tsx               # Komponen modal dialog responsif
│   │   ├── notifications/
│   │   │   ├── FloatingChatBadge.tsx   # Widget chat mengambang ala WhatsApp/Telegram dengan popup preview
│   │   │   └── NotificationBellDropdown.tsx # Dropdown lonceng notifikasi interaktif di header
│   │   └── operator/
│   │       ├── SageSidebar.tsx         # Sidebar responsif (Desktop Mini-Rail + Mobile Slide Drawer)
│   │       ├── SageTopBar.tsx          # Top bar kontrol (Pencarian Ctrl+K, Lonceng Notif, Filter Kategori)
│   │       ├── SageTicketCard.tsx      # Kartu tiket interaktif, SLA badge, & aksi 1-klik status
│   │       ├── SageKanbanBoard.tsx     # Papan Kanban responsif dengan tab switcher kolom mobile
│   │       ├── SageTableView.tsx       # Tampilan tabel adaptif & card list mobile view
│   │       └── SageTicketDrawer.tsx    # Drawer detail tiket bertab (Diskusi, Triase, SLA Info)
│   ├── context/
│   │   ├── AuthContext.tsx             # Manajemen sesi token, isolasi per-tab (sessionStorage), & RBAC
│   │   └── ToastContext.tsx            # Sistem notifikasi toast floating global dengan animasi
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx               # Halaman login dengan 1-klik pengisian akun demo
│   │   │   └── Register.tsx            # Registrasi mandiri akun pengguna pelapor
│   │   ├── operator/
│   │   │   └── OperatorDashboard.tsx   # Workstation triase operator, background polling & keyboard controls
│   │   └── public/
│   │       ├── LandingPage.tsx         # Beranda publik, filter bidang layanan, metrik performa & SLA
│   │       ├── PublicTicketForm.tsx    # Formulir tiket baru + Live Ticket Preview + Drag & Drop upload
│   │       ├── PublicTicketTracker.tsx # Pelacak tiket mandiri dengan Stepper Timeline 4 tahap, chat & audio notif
│   │       └── MyTicketsPage.tsx       # Portal daftar tiket pelapor + Lonceng Notifikasi & Floating Chat
│   ├── services/
│   │   ├── api.ts                      # Klien API terintegrasi Google Apps Script Web App & Mock Storage
│   │   └── realtime.ts                 # Layanan WebSocket, BroadcastChannel & LocalStorage realtime sync
│   ├── types/
│   │   └── index.ts                    # Definisi tipe data TypeScript (Ticket, Thread, User, ApiResponse)
│   ├── utils/
│   │   ├── sound.ts                    # Layanan audio synthesizer (Web Audio API) & Web Browser Notifications
│   │   └── ticketFormatter.ts          # Parser deskripsi, ekstraksi lampiran/Google Drive, & pembersih teks
│   ├── App.tsx                         # Konfigurasi router & provider global
│   ├── index.css                       # Desain sistem Glassmorphism, smooth scrollbar & pulse glowing
│   ├── main.tsx                        # Entry point React
│   └── routes.tsx                      # Definisi rute publik dan terproteksi RBAC
├── .env.example                        # Contoh konfigurasi URL endpoint backend
├── AKUN_DEMO_LOGIN.txt                 # Daftar kredensial akun demo default
├── PANDUAN_PENGGUNAAN.md               # Panduan operasional lengkap tiap peran pengguna
├── POSO_BRD.md                         # Business Requirements Document (BRD)
├── POSO_PRD.md                         # Product Requirements Document (PRD)
├── package.json
└── vite.config.ts
```

---

## 2. PANDUAN MENJALANKAN SECARA LOKAL

### Langkah 1: Instalasi Dependensi
```bash
npm install
```

### Langkah 2: Konfigurasi Database Aiven MySQL
Salin template konfigurasi:
```bash
cp .env.example .env
```
Isi file `.env` dengan kredensial database cloud Aiven for MySQL Anda:
```env
DB_HOST=mysql-1810b125-nugrahaeldi123-5f2b.f.aivencloud.com
DB_PORT=21970
DB_USER=avnadmin
DB_PASSWORD=YOUR_AIVEN_PASSWORD
DB_NAME=defaultdb
DB_SSL=true
PORT=5000
JWT_SECRET=poso_secret_jwt_key_2026_super_secure
```

### Langkah 3: Migrasi & Inisialisasi Database
Jalankan pengujian koneksi dan migrasi otomatis:
```bash
# Uji koneksi ke Aiven MySQL
npm run test:db

# Jalankan migrasi tabel & seed data awal
npm run migrate
```

### Langkah 4: Menjalankan Aplikasi (Backend + Frontend)
Jalankan backend API dan frontend Vite secara bersamaan:
```bash
npm run dev
```
Buka peramban Anda di alamat: **`http://localhost:3000`** (Frontend) dan **`http://localhost:5000/api`** (Backend API).

### Langkah 4: Membangun untuk Produksi
```bash
npm run build
```

---

## 3. AKUN DEMO UNTUK PENGUJIAN

Pada halaman **Login (`/login`)**, Anda dapat menggunakan kredensial berikut atau klik tombol demo:

| Peran (*Role*) | Alamat Email | Kata Sandi | Hak Akses Utama |
|---|---|---|---|
| **1. Administrator Sistem** | `admin@poso.local` | `Admin123!` | Akses penuh ke seluruh menu, manajemen pengguna & role, integrasi data Google Sheets, dan pengaturan sistem. |
| **2. Operator Helpdesk** | `operator@poso.local` | `Operator123!` | Triase tiket Kanban, delegasi tiket ke unit UPT, chat langsung dengan pelapor, monitoring SLA dan status tiket. |
| **3. Staf UPT TI & Jaringan** | `upt.ti@poso.local` | `Poso123!` | Penanganan teknis tiket bidang TI & Sistem Informasi, update progres, dan catatan penyelesaian. |
| **4. Staf UPT Sarana & Prasarana** | `upt.sarpras@poso.local` | `Poso123!` | Penanganan teknis tiket sarana, fasilitas gedung, dan kelistrikan. |
| **5. Pengguna Umum (Pelapor)** | `dewi@gmail.com` | `User123!` | Pengajuan tiket pengaduan, pelacakan progres 4-tahap, chat dua arah dengan petugas, notifikasi suara/browser, dan riwayat tiket pribadi. |

---

## 4. FITUR UTAMA & KEUNGGULAN SISTEM

1. **Galeri Foto & Pratinjau Lampiran Google Drive Terpadu**:
   - **Ekstraksi Tautan Otomatis**: Tautan Google Drive (`/file/d/{id}` atau `id={id}`) otomatis diekstrak File ID-nya dan dikonversi menjadi thumbnail Google CDN (`https://lh3.googleusercontent.com/d/{id}`).
   - **Tampilan Bersih**: Kode mentah `[Lampiran Berkas]` otomatis dihilangkan dari isi chat dan digantikan galeri foto interaktif.
   - **Lightbox Modal Perbesar**: Pengguna dapat memperbesar gambar ke ukuran penuh, menyalin tautan, atau membuka langsung di Google Drive / tab baru.

2. **Sistem Notifikasi Real-time Pelanggan & Staf**:
   - **Audio Chime (Web Audio API)**: Suara denting ganda harmonik C6/G6 (0ms latency tanpa file audio eksternal) berbunyi instan saat ada balasan teknisi atau perubahan status.
   - **Web Browser Push Notification**: Notifikasi desktop tetap muncul meskipun tab sedang berada di latar belakang.
   - **Live Response Banner**: Banner respons interaktif di bagian atas halaman saat teknisi membalas.
   - **Notification Bell Dropdown**: Lonceng notifikasi dengan badge angka belum dibaca pada dashboard staf dan portal pelanggan (`/my-tickets`).
   - **Floating Chat Badge**: Widget mengambang di kanan bawah yang memunculkan bubble preview tanggapan terbaru dengan tombol langsung ke pelacakan tiket.

3. **Komunikasi Dua Arah & Separasi Identitas Ketat**:
   - **Obrolan Instan (<50ms)**: Balasan terkirim secara instan melalui WebSocket, BroadcastChannel, dan storage events.
   - **Pemisahan Identitas Visual**: Pesan dari Pelapor berlabel *Tanggapan Pelapor* (ikon User abu-abu) dan pesan dari Admin/Teknisi berlabel *Petugas UPT* (ikon Headphone biru).

4. **Isolasi Sesi Multi-Tab (`sessionStorage` Architecture)**:
   - Sesi login diisolasi secara independen per-tab. Anda dapat membuka Tab Admin dan Tab Pelapor dalam satu peramban yang sama tanpa tertukar saat di-refresh.

5. **Antarmuka Sepenuhnya Responsif (Mobile-First)**:
   - **Mobile Drawer Menu**: Navigasi sidebar tersembunyi rapi di ponsel dengan tombol hamburger.
   - **Desktop Mini-Rail**: Sidebar desktop dapat diperkecil menjadi mode rail ikon ramping.
   - **Kanban Column Switcher**: Pengguna ponsel dapat berpindah antar kolom status tiket dengan tombol pill interaktif.
   - **Tabel Adaptif**: Berubah menjadi format kartu responsif pada smartphone.

---

## 5. INTEGRASI GOOGLE WORKSPACE & APPS SCRIPT

### Panduan Menyimpan File ke Folder Google Drive Tertentu:
1. Buka [Google Drive](https://drive.google.com) dan buat folder (misal: `POSO_Lampiran_Tiket`).
2. Salin **Folder ID** dari URL folder (contoh: `https://drive.google.com/drive/folders/1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR` -> ID-nya adalah `1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR`).
3. Buka file [`backend/Code.gs`](file:///c:/Users/Asus/Documents/POSIND/POSO/backend/Code.gs) baris 23 dan masukkan Folder ID Anda:
   ```javascript
   const TARGET_CLIENT_FOLDER_ID = '1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR';
   ```

### Panduan Deploy Google Apps Script (Agar Masuk ke Akun Khusus):
1. Buka [https://script.google.com](https://script.google.com) pada akun Google yang ingin dijadikan tempat penyimpanan.
2. Buat **New Project** dan tempel seluruh isi file [`backend/Code.gs`](file:///c:/Users/Asus/Documents/POSIND/POSO/backend/Code.gs).
3. Buka **Project Settings** (Ikon Gerigi) > centang **"Show 'appsscript.json' manifest file in editor"**.
4. Buka tab `appsscript.json` dan pastikan isinya sesuai dengan `backend/appsscript.json`.
5. Klik **Deploy > New deployment > Web app**:
   - **Execute as**: `Me (email-akun-anda@gmail.com)` *(Memastikan file masuk ke akun ini)*
   - **Who has access**: `Anyone` *(Agar frontend web dapat mengirim tiket & foto)*
6. Salin URL Web App (`/exec`) dan tempelkan ke menu **Pengaturan Data Source** di web atau di file `.env`.
