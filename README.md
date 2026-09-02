# POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.0)

Aplikasi Helpdesk dan Manajemen Tiket Terpadu Modern berbasis **React 18 + TypeScript + Vite** dengan desain visual **Ocean Cyan & Glassmorphism**, didukung backend serverless **Google Apps Script REST API**, penyimpanan berkas **Google Drive**, basis data **Google Sheets**, serta sistem komunikasi real-time instan (**WebSocket + Universal LocalStorage Event + BroadcastChannel**).

Aplikasi ini dirancang **100% responsif** (ponsel, tablet, desktop) dan kaya akan interaktivitas seperti animasi mikro (*Framer Motion*), sistem notifikasi audio visual (*Toast & Chime Alerts*), *Live Ticket Preview*, *Interactive Kanban Board*, dan *Multi-Tab Isolated Session Architecture*.

---

## 1. STRUKTUR ARSITEKTUR PROYEK

```
POSO/
├── backend/
│   ├── Code.gs             # Backend Apps Script: REST API, LockService, Drive File Upload, Sanitizer & Threading
│   ├── appsscript.json     # Manifest Apps Script (OAuth Scopes & Service Declarations)
│   └── PANDUAN_SETUP_BACKEND.md # Panduan setup & deployment Google Apps Script
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── DataSourceConfig.tsx    # Pemantauan status Google Drive & Spreadsheet
│   │   │   └── UserManagement.tsx      # Manajemen akun staf operator & penugasan UPT
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx           # Pelindung rute login & otorisasi RBAC
│   │   ├── common/
│   │   │   ├── AttachmentGallery.tsx   # Galeri thumbnail gambar asli & Lightbox zoom modal
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
│   │       ├── PublicTicketTracker.tsx # Pelacak tiket mandiri dengan Stepper Timeline 4 tahap & live chat
│   │       └── MyTicketsPage.tsx       # Portal daftar tiket pengaduan milik pelapor terdaftar
│   ├── services/
│   │   ├── api.ts                      # Klien API terintegrasi Google Apps Script Web App & Mock Storage
│   │   └── realtime.ts                 # Layanan WebSocket, BroadcastChannel & LocalStorage realtime sync
│   ├── types/
│   │   └── index.ts                    # Definisi tipe data TypeScript (Ticket, Thread, User, ApiResponse)
│   ├── utils/
│   │   ├── sound.ts                    # Layanan audio chimes & Web Browser Notifications
│   │   └── ticketFormatter.ts          # Parser deskripsi, lampiran, dan format tanggal aman
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

### Langkah 2: Konfigurasi Backend (Opsional)
Jika ingin menghubungkan ke backend Google Apps Script Anda:
```bash
cp .env.example .env
```
Isi file `.env` dengan URL Web App hasil deploy:
```env
VITE_GAS_API_URL=https://script.google.com/macros/s/YOUR_GAS_DEPLOYMENT_ID/exec
```
*(Jika `.env` tidak diisi, aplikasi akan otomatis menggunakan **Mock Storage Browser** yang lengkap dengan data bawaan)*.

### Langkah 3: Menjalankan Development Server
```bash
npm run dev
```
Buka peramban Anda di alamat: **`http://localhost:5173`**

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
| **5. Pengguna Umum (Pelapor)** | `dewi@gmail.com` | `User123!` | Pengajuan tiket pengaduan, pelacakan progres 4-tahap, chat dua arah dengan petugas, dan riwayat tiket pribadi. |

---

## 4. FITUR UTAMA & KEUNGGULAN SISTEM

1. **Komunikasi Realtime Dua Arah & Separasi Identitas Ketat**:
   - **Obrolan Instan (<50ms)**: Balasan dari Admin/Petugas maupun Pelapor langsung terkirim tanpa delay.
   - **Separasi Identitas**: Pesan dari Pelapor tampil sebagai *Tanggapan Pelapor* (ikon User abu-abu) dan pesan dari Admin/Teknisi tampil sebagai *Petugas* (ikon Headphone biru). Identitas pelapor terkunci dan tidak dapat tertimpa menjadi staf.
   - **Notifikasi Multi-Lapisan**: Dilengkapi lonceng notifikasi di navbar, audio chime pengingat, dan widget chat mengambang ala WhatsApp/Telegram di pojok kanan bawah.

2. **Isolasi Sesi Multi-Tab (`sessionStorage` Architecture)**:
   - Sesi login diisolasi secara independen per-tab. Anda dapat membuka Tab Admin dan Tab Pelapor dalam satu peramban yang sama, dan keduanya **tidak akan tertukar saat di-refresh (Ctrl+R / Ctrl+F5)**.

3. **Antarmuka Sepenuhnya Responsif (Mobile-First)**:
   - **Mobile Drawer Menu**: Navigasi sidebar tersembunyi rapi di ponsel dan dapat dibuka melalui tombol hamburger.
   - **Desktop Mini-Rail**: Sidebar desktop dapat diperkecil menjadi mode ringkas (*compact icon mode*) untuk memaksimalkan area kerja.
   - **Kanban Column Switcher**: Pengguna ponsel dapat beralih antar kolom status secara instan tanpa kesulitan menggeser layar secara horizontal.
   - **Tabel Adaptif**: Berubah menjadi *card list* yang rapi di layar ponsel dan tabel data interaktif dengan fitur pengurutan (*sorting*) di layar besar.

4. **Live Ticket Preview & Smart Category Hints**:
   - Pada formulir pengaduan publik ([PublicTicketForm.tsx](file:///c:/ticket-dashboard/src/pages/public/PublicTicketForm.tsx)), pengguna dapat melihat pratinjau kartu tiket secara real-time (*live preview*) saat mengetik.
   - Dilengkapi panduan cepat penanganan (*smart tips*) sesuai kategori keluhan yang dipilih.

5. **Stepper Timeline Visual Pelacak Tiket**:
   - Pada pelacak tiket ([PublicTicketTracker.tsx](file:///c:/ticket-dashboard/src/pages/public/PublicTicketTracker.tsx)), kemajuan pengerjaan tiket divisualisasikan dalam 4 tahapan (*Laporan Masuk, Triase Helpdesk, Pengerjaan UPT, Selesai*) dengan node status yang beranimasi.

6. **Drawer Detail Tiket Bertab (Multi-Tab)**:
   - **Tab Diskusi**: Percakapan publik dengan pelapor dan catatan internal khusus staf (🔒).
   - **Tab Triase & UPT**: Ubah status tiket (*Open, In Progress, Waiting, Closed*) dan delegasikan ke unit UPT terkait.
   - **Tab Info & SLA**: Detail pelapor, tanggal pembuatan, target batas waktu SLA, dan panduan SOP.

---

## 5. INTEGRASI GOOGLE WORKSPACE & APPS SCRIPT

### Konfigurasi Database:
* **Folder Google Drive (Upload Lampiran)**: Folder Google Drive publik/organisasi untuk menampung file lampiran bukti pengaduan.
* **Google Spreadsheet Master Database**: Spreadsheet yang memuat sheet `Tickets`, `Threads`, `Users`, `Settings`, `AuditLogs`.
* **Deployment Web App URL** (`.env`):
  ```env
  VITE_GAS_API_URL=https://script.google.com/macros/s/YOUR_GAS_DEPLOYMENT_ID/exec
  ```

### Panduan Deploy Google Apps Script:
1. Buka Google Sheets database Anda.
2. Pilih menu **Ekstensi > Apps Script**.
3. Salin isi file `backend/Code.gs` ke editor Apps Script.
4. Buka **Project Settings (Ikon Gerigi)** > centang **"Show 'appsscript.json' manifest file in editor"**.
5. Buka tab `appsscript.json` dan pastikan isinya sesuai dengan `backend/appsscript.json`.
6. Klik **Deploy > Manage deployments > Edit > New version > Deploy**.
7. Pastikan hak akses disetel ke **"Anyone" (Siapa saja)**.
8. Salin URL Web App (`/exec`) dan tempelkan ke file `.env` aplikasi Anda.
