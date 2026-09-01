# Product Requirements Document (PRD)
## Aplikasi: POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.0)

**Versi:** 2.0 (Responsive & Interactive Architecture)  
**Status:** Live & Implemented  
**Tipe Dokumen:** Product Requirements & Technical Specification Document  

---

## 1. Ringkasan Produk

**POSO Helpdesk** adalah sistem helpdesk dan manajemen tiket terpadu modern multi-channel berbasis **React 18 + TypeScript + Vite** dengan antarmuka **Ocean Cyan Glassmorphism**, didukung backend serverless **Google Apps Script REST API**, penyimpanan berkas **Google Drive**, serta basis data **Google Sheets**.

Sistem ini melayani 4 peran pengguna (*Pengguna Umum/Pelapor, Operator Helpdesk, Teknisi UPT, dan Super Administrator*), mendukung pengunggahan foto bukti kerusakan, pemisahan percakapan publik dan catatan internal, *Live Ticket Preview*, *Interactive Kanban Board*, notifikasi *Toast*, serta desain **100% responsif di perangkat mobile, tablet, dan desktop**.

---

## 2. Arsitektur & Spesifikasi Teknologi (Tech Stack)

| Lapisan (*Layer*) | Teknologi yang Digunakan | Keterangan |
|---|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite | SPA dengan perutean berbasis `react-router-dom` v7 |
| **Styling & Design System** | Tailwind CSS + CSS Custom Tokens | Desain Glassmorphism modern, Apple-inspired spring physics, pulse glow |
| **Micro-Interactions** | Framer Motion v11 | Animasi transisi layout, popup modal, slide drawer, toast alerts |
| **Iconography** | Lucide React Icons | 100% Ikon vektor profesional |
| **Penyimpanan Berkas** | Google Drive API (`DriveApp`) | File lampiran disimpan di Google Drive Folder resmi |
| **Backend REST API** | Google Apps Script (`doGet` & `doPost`) | Penanganan request RESTful, JSON Payload, Selective LockService |
| **Basis Data Master** | Google Sheets (`POSO Master Database`) | Penyimpanan terstruktur: `Tickets`, `Users`, `Ticket_Threads` |
| **Notifikasi Global** | Custom Floating Toast Context | Notifikasi mengapung responsif dengan progress timer dan auto-dismiss |

---

## 3. Sistem Desain & Antarmuka Responsif (UI/UX)

### 3.1 Token Warna & Nuansa Visual
- **Canvas Background**: Light Ice Canvas (`#F4F7F9`).
- **Primary Ocean**: `#0D5C75` (Darker: `#083342`).
- **Accent Cyan**: `#199FB1` (Hover: `#148797`, Tint: `#EAF4F8`).
- **Accent Coral**: `#F58A61` (Hover: `#E77448`).
- **Glassmorphism**: `.apple-glass` dan `.apple-glass-card` dengan backdrop-blur 20px dan border semi-transparan.

### 3.2 Fitur Ergonomi & Responsivitas Mobile
- **Responsive Mobile Navigation**: Menu samping tersembunyi dengan tombol hamburger di ponsel, slide-over drawer dengan backdrop blur.
- **Desktop Mini-Rail**: Sidebar desktop dapat diperkecil menjadi mode rail ikon ramping.
- **Mobile Kanban Switcher**: Tombol pill pemilih kolom status instan pada layar ponsel.
- **Adaptive Table View**: Tampilan tabel beralih ke format kartu responsif pada smartphone.
- **Keyboard Shortcuts**: Pintasan keyboard `Ctrl+K` untuk fokus pencarian dan `Esc` untuk menutup drawer.

---

## 4. Struktur Modul & Fitur Utama

### 4.1 Portal Publik (Untuk Tamu & Pengguna Umum)
1. **Beranda Institusional (`/`)**:
   - Banner hero interaktif dengan 2 kartu aksi utama: **[Ajukan Tiket Baru]** dan **[Lacak Status Tiket]**.
   - Katalog 6 bidang layanan dengan filter chip interaktif.
   - Metrik performa real-time & panduan kebijakan SLA modal.
2. **Formulir Pengajuan Tiket (`/submit`)**:
   - Formulir 2-kolom: Input pengaduan di kiri + **Live Real-Time Ticket Preview Card** di kanan.
   - Zona unggah berkas *Drag & Drop* dengan pratinjau thumbnail instan.
   - Kotak tips cerdas berbasis kategori yang dipilih.
   - Modal sukses pengajuan dengan tombol 1-klik salin nomor ID tiket.
3. **Pelacak Status Tiket Mandiri (`/track`)**:
   - **Stepper Timeline 4 Tahap Visual** (*Laporan Masuk, Triase Helpdesk, Pengerjaan UPT, Selesai*) dengan node beranimasi status terkini.
   - Galeri foto lampiran dengan zoom Lightbox.
   - Formulir kirim tanggapan balasan langsung dari pelapor.
4. **Halaman Tiket Saya (`/my-tickets`)**:
   - Filter tab status (*Semua, Open, In Progress, Waiting, Closed*), pencarian cepat, dan kartu tiket dengan animasi mikro.
5. **Autentikasi (`/login` & `/register`)**:
   - Form pendaftaran mandiri khusus pengguna umum.
   - Tombol 1-klik demo akun (*Super Admin, Operator, Pelapor*).

### 4.2 Workstation Operator & Staf UPT (`/dashboard`)
1. **Sage Sidebar Responsif**:
   - Desktop rail mode + Mobile slide drawer.
   - Indikator status sesi online, kartu user profil, dan penghitung tiket aktif/selesai.
2. **Top Bar Header**:
   - Kolom pencarian instan (`Ctrl+K`), filter kategori, filter rentang tanggal, dan toggle papan Kanban vs Tabel.
   - Tombol refresh data dengan feedback animasi.
3. **Papan Triase Kanban**:
   - Kolom status: `Tiket Masuk (Open)`, `Sedang Dikerjakan UPT (In Progress)`, `Menunggu Respon (Waiting)`, dan `Selesai (Closed)`.
   - Tombol aksi 1-klik langsung pada kartu: `[ Proses ]` dan `[ Selesai ]`.
4. **Laci Detail Tiket Bertab (`SageTicketDrawer`)**:
   - **Tab Diskusi**: Percakapan publik dengan pelapor dan catatan internal staf (🔒).
   - **Tab Triase & UPT**: Pengaturan status tiket dan penugasan teknisi UPT.
   - **Tab Info & SLA**: Detail pelapor, tanggal, dan target waktu SLA.
5. **Floating Action Button (FAB)**:
   - Tombol mengambang di kanan bawah untuk pembuatan tiket cepat dari mana saja.

### 4.3 Modul Administrasi
1. **Manajemen Pengguna & Staf (`UserManagement`)**:
   - Pendaftaran staf operator, teknisi UPT, atau super admin baru.
   - Penugasan unit kerja teknis spesifik untuk akun UPT.
2. **Konfigurasi Sumber Data (`DataSourceConfig`)**:
   - Pemantauan ID Google Spreadsheet aktif dan Folder Google Drive penyimpanan berkas.

---

## 5. Skema Basis Data Google Sheets

### Sheet 1: `Tickets`
| Kolom | Tipe | Deskripsi |
|---|---|---|
| `ticket_id` | String | ID Unik Tiket (contoh: `TICK-20260901-1001`) |
| `created_at` | ISO Date String | Waktu pembuatan tiket |
| `updated_at` | ISO Date String | Waktu pembaruan terakhir |
| `subject` | String | Judul keluhan atau laporan |
| `category` | String | Kategori permasalahan teknis |
| `description` | Text | Penjelasan rinci kendala |
| `status` | String | `open` \| `in_progress` \| `waiting` \| `closed` |
| `priority` | String | `low` \| `medium` \| `high` \| `urgent` |
| `channel` | String | Saluran masuk (`web` \| `email`) |
| `requester_email`| String | Alamat email pelapor |
| `assigned_upt` | String | Unit teknis penanggung jawab |
| `assigned_operator` | String | Email staf helpdesk pengelola |
| `sla_due_at` | ISO Date String | Batas waktu penyelesaian SLA |

### Sheet 2: `Users`
| Kolom | Tipe | Deskripsi |
|---|---|---|
| `user_id` | String | ID Pengguna (contoh: `USR-ADMIN01`) |
| `name` | String | Nama lengkap pengguna |
| `email` | String | Email untuk login |
| `password_hash` | String | Hash kata sandi |
| `role` | String | `admin` \| `operator` \| `upt` \| `pengguna_umum` |
| `upt_unit` | String | Nama unit UPT jika role adalah `upt` |
| `is_active` | Boolean | Status aktif akun (`TRUE` / `FALSE`) |
| `created_by` | String | Pembuat akun |
| `created_at` | ISO Date String | Waktu pendaftaran |

### Sheet 3: `Ticket_Threads`
| Kolom | Tipe | Deskripsi |
|---|---|---|
| `thread_id` | String | ID Pesan (contoh: `TH-a1b2c3d4`) |
| `ticket_id` | String | ID Tiket terkait |
| `sender_id` | String | ID Pengirim pesan |
| `sender_role` | String | Peran pengirim saat membalas |
| `message` | Text | Isi pesan / balasan / catatan internal |
| `visibility` | String | `public` (terlihat pelapor) \| `internal` (khusus staf) |
| `created_at` | ISO Date String | Waktu pengiriman pesan |
