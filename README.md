# POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.0)

Aplikasi Helpdesk dan Manajemen Tiket Terpadu Modern berbasis **React 18 + TypeScript + Vite** dengan desain visual **Ocean Cyan & Glassmorphism**, didukung backend serverless **Google Apps Script REST API**, penyimpanan berkas **Google Drive**, serta basis data **Google Sheets**.

Aplikasi ini dirancang **100% responsif** (ponsel, tablet, desktop) dan kaya akan interaktivitas seperti animasi mikro (*Framer Motion*), sistem notifikasi melayang (*Toast Notifications*), *Live Ticket Preview*, dan *Interactive Kanban Board*.

---

## 1. STRUKTUR ARSITEKTUR PROYEK

```
POSO/
├── backend/
│   ├── Code.gs             # Backend Apps Script: REST API, LockService, Drive File Upload, Sanitizer
│   └── appsscript.json     # Manifest Apps Script (OAuth Scopes & Service Declarations)
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
│   │   │   └── Modal.tsx               # Komponen modal dialog responsif
│   │   └── operator/
│   │       ├── SageSidebar.tsx         # Sidebar responsif (Desktop Mini-Rail + Mobile Slide Drawer)
│   │       ├── SageTopBar.tsx          # Top bar kontrol (Pencarian Ctrl+K, Filter Kategori, Toggle Mode)
│   │       ├── SageTicketCard.tsx      # Kartu tiket interaktif, SLA badge, & aksi 1-klik status
│   │       ├── SageKanbanBoard.tsx     # Papan Kanban responsif dengan tab switcher kolom mobile
│   │       ├── SageTableView.tsx       # Tampilan tabel adaptif & card list mobile view
│   │       └── SageTicketDrawer.tsx    # Drawer detail tiket bertab (Diskusi, Triase, SLA Info)
│   ├── context/
│   │   ├── AuthContext.tsx             # Manajemen sesi token, hak akses RBAC, & login demo
│   │   └── ToastContext.tsx            # Sistem notifikasi toast floating global dengan animasi
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx               # Halaman login dengan 1-klik pengisian akun demo
│   │   │   └── Register.tsx            # Registrasi mandiri akun pengguna pelapor
│   │   ├── operator/
│   │   │   └── OperatorDashboard.tsx   # Workstation triase operator, FAB button & keyboard controls
│   │   └── public/
│   │       ├── LandingPage.tsx         # Beranda publik, filter bidang layanan, metrik performa & SLA
│   │       ├── PublicTicketForm.tsx    # Formulir tiket baru + Live Ticket Preview + Drag & Drop upload
│   │       ├── PublicTicketTracker.tsx # Pelacak tiket mandiri dengan Stepper Timeline 4 tahap
│   │       └── MyTicketsPage.tsx       # Daftar tiket pengaduan milik pelapor terdaftar
│   ├── services/
│   │   └── api.ts                      # Klien API terintegrasi Google Apps Script Web App & Mock Storage
│   ├── types/
│   │   └── index.ts                    # Definisi tipe data TypeScript (Ticket, Thread, User, ApiResponse)
│   ├── App.tsx                         # Konfigurasi router & provider global
│   ├── index.css                       # Desain sistem Glassmorphism, smooth scrollbar & pulse glowing
│   └── main.tsx                        # Entry point React
├── .env.example                        # Contoh konfigurasi URL endpoint backend
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

Pada halaman **Login (`/login`)**, tersedia tombol **1-Klik Demo** untuk langsung mengisi kredensial berikut:

| Peran (*Role*) | Alamat Email | Kata Sandi | Hak Akses Utama |
|---|---|---|---|
| **Super Admin** | `admin@poso.local` | `Admin123!` | Manajemen staf, penugasan UPT, konfigurasi data drive & audit log |
| **Operator Helpdesk** | `operator@poso.local` | `Operator123!` | Triase tiket Kanban, routing teknisi UPT, catatan internal & balasan |
| **Teknisi UPT TI** | `upt.ti@poso.local` | `Upt123!` | Penanganan tiket bidang TI & Jaringan |
| **Teknisi UPT Sarpras** | `upt.sarpras@poso.local` | `Upt123!` | Penanganan tiket sarana & prasarana gedung |
| **Pengguna Umum** | `dewi@gmail.com` | `User123!` | Pembuatan laporan baru & riwayat tiket pribadi |

---

## 4. FITUR UTAMA & KEUNGGULAN SISTEM

1. **Antarmuka Sepenuhnya Responsif (Mobile-First)**:
   - **Mobile Drawer Menu**: Navigasi sidebar tersembunyi rapi di ponsel dan dapat dibuka melalui tombol hamburger.
   - **Desktop Mini-Rail**: Sidebar desktop dapat diperkecil menjadi mode ringkas (*compact icon mode*) untuk memaksimalkan area kerja.
   - **Kanban Column Switcher**: Pengguna ponsel dapat beralih antar kolom status secara instan tanpa kesulitan menggeser layar secara horizontal.
   - **Tabel Adaptif**: Berubah menjadi *card list* yang rapi di layar ponsel dan tabel data interaktif dengan fitur pengurutan (*sorting*) di layar besar.

2. **Live Ticket Preview & Smart Category Hints**:
   - Pada formulir pengaduan publik ([PublicTicketForm.tsx](file:///c:/ticket-dashboard/src/pages/public/PublicTicketForm.tsx)), pengguna dapat melihat pratinjau kartu tiket secara real-time (*live preview*) saat mengetik.
   - Dilengkapi panduan cepat penanganan (*smart tips*) sesuai kategori keluhan yang dipilih.

3. **Stepper Timeline Visual Pelacak Tiket**:
   - Pada pelacak tiket ([PublicTicketTracker.tsx](file:///c:/ticket-dashboard/src/pages/public/PublicTicketTracker.tsx)), kemajuan pengerjaan tiket divisualisasikan dalam 4 tahapan (*Laporan Masuk, Triase Helpdesk, Pengerjaan UPT, Selesai*) dengan node status yang beranimasi.

4. **Sistem Notifikasi Toast Global**:
   - Menampilkan umpan balik visual instan saat memperbarui status, menyalin ID tiket ke papan klip, mengirim pesan balasan, atau login akun.

5. **Drawer Detail Tiket Bertab (Multi-Tab)**:
   - **Tab Diskusi**: Percakapan publik dengan pelapor dan catatan internal khusus staf (🔒).
   - **Tab Triase & UPT**: Ubah status tiket (*Open, In Progress, Waiting, Closed*) dan delegasikan ke unit UPT terkait.
   - **Tab Info & SLA**: Detail pelapor, tanggal pembuatan, target batas waktu SLA, dan panduan SOP.

---

## 5. INTEGRASI GOOGLE WORKSPACE & APPS SCRIPT

### Konfigurasi Database:
* **Folder Google Drive (Upload Lampiran)**:
  `YOUR_GOOGLE_DRIVE_FOLDER_ID`
* **Google Spreadsheet Master Database**:
  `YOUR_GOOGLE_SPREADSHEET_ID`
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
7. Salin URL Web App (`/exec`) dan tempelkan ke file `.env` aplikasi Anda.
