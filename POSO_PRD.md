# Product Requirements Document (PRD)
## Aplikasi: POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.1)

**Versi:** 2.1 (Universal Attachment Viewer & Real-Time Customer Notification Subsystem)  
**Status:** Live & Implemented  
**Tipe Dokumen:** Product Requirements & Technical Specification Document  

---

## 1. Ringkasan Produk

**POSO Helpdesk** adalah sistem helpdesk dan manajemen tiket terpadu modern multi-channel berbasis **React 18 + TypeScript + Vite** dengan antarmuka **Ocean Cyan Glassmorphism**, didukung backend **Node.js / Express REST API**, basis data relasional cloud **Aiven for MySQL** (SSL Mode: REQUIRED), serta subsistem komunikasi & notifikasi real-time instan (**WebSocket + Universal LocalStorage Event + BroadcastChannel + Web Audio API**).

Sistem ini melayani 4 peran pengguna (*Pengguna Umum/Pelapor, Operator Helpdesk, Teknisi UPT, dan Super Administrator*), mendukung pengunggahan foto bukti kerusakan dengan pratinjau thumbnail dan Lightbox modal langsung, pemisahan percakapan publik dan catatan internal, *Live Ticket Preview*, *Interactive Kanban Board*, sistem notifikasi multi-lapisan untuk staf dan pelanggan, serta desain **100% responsif di perangkat mobile, tablet, dan desktop**.

---

## 2. Arsitektur & Spesifikasi Teknologi (Tech Stack)

| Lapisan (*Layer*) | Teknologi yang Digunakan | Keterangan |
|---|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite | SPA dengan perutean berbasis `react-router-dom` v7 |
| **Styling & Design System** | Tailwind CSS + CSS Custom Tokens | Desain Glassmorphism modern, Apple-inspired spring physics, pulse glow |
| **Micro-Interactions** | Framer Motion v11 | Animasi transisi layout, popup modal, slide drawer, toast alerts, badge bounce |
| **Iconography** | Lucide React Icons | 100% Ikon vektor profesional |
| **Audio Synthesizer** | Web Audio API (Native 0ms Latency) | Penghasil nada ganda harmonik C6/G6 tanpa dependensi file audio eksternal |
| **Notifikasi Browser** | Web Push Notification API | Peringatan desktop/smartphone saat tab peramban sedang tidak aktif |
| **Backend REST API** | Node.js + Express API (`server/`) | RESTful API, JWT Auth, Connection Pooling, Transaction Control, RBAC Guard |
| **Basis Data Master** | Aiven for MySQL (`defaultdb`) | RDBMS Cloud: `users`, `tickets`, `threads`, `audit_logs`, `system_config` |
| **Keamanan Jaringan** | TLS 1.3 / SSL Mode: REQUIRED | Enkripsi end-to-end koneksi database cloud |
| **Real-time Sync Engine** | WebSocket + BroadcastChannel + Storage Events | Sinkronisasi pesan dan status lintas tab dan lintas perangkat (<50ms) |

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

### 4.1 Portal Publik & Pelanggan
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
   - **Stepper Timeline 4 Tahap Visual** (*Laporan Masuk, Triase Helpdesk, Pengerjaan UPT, Selesai*) dengan node status beranimasi.
   - **Galeri Foto & Lampiran Universal**: Pratinjau thumbnail langsung (termasuk foto Google Drive) dengan Lightbox perbesar layar penuh.
   - **Notifikasi Real-time Pelanggan**:
     - Nada denting ganda (*Web Audio API*) saat teknisi merespons.
     - Notifikasi browser desktop (*Push Notification*).
     - Banner respons live di bagian atas layar.
     - Notifikasi pembaruan status pengerjaan tiket oleh UPT.
   - Kolom percakapan dua arah dengan pemisahan identitas (*Tanggapan Pelapor* vs *Petugas UPT*).
4. **Halaman Tiket Saya (`/my-tickets`)**:
   - Filter tab status (*Semua, Open, In Progress, Waiting, Closed*), pencarian cepat, dan kartu tiket dengan indikator jumlah foto lampiran.
   - **Lonceng Notifikasi (*Notification Bell*)**: Dropdown daftar balasan baru dengan counter badge merah.
   - **Floating Chat Badge**: Widget mengambang di pojok kanan bawah dengan popup preview balasan terbaru dan tombol navigasi langsung ke `/track?id=...`.
5. **Autentikasi (`/login` & `/register`)**:
   - Form pendaftaran mandiri khusus pengguna umum.
   - Tombol 1-klik demo akun (*Super Admin, Operator, Pelapor*).

### 4.2 Workstation Operator & Staf UPT (`/dashboard`)
1. **Sage Sidebar Responsif**:
   - Desktop rail mode + Mobile slide drawer.
   - Indikator status sesi online, kartu user profil, dan penghitung tiket aktif/selesai.
2. **Top Bar Header**:
   - Kolom pencarian instan (`Ctrl+K`), filter kategori, filter rentang tanggal, toggle papan Kanban vs Tabel, dan **Notification Bell**.
   - Tombol refresh data dengan feedback animasi.
3. **Papan Triase Kanban**:
   - Kolom status: `Tiket Masuk (Open)`, `Sedang Dikerjakan UPT (In Progress)`, `Menunggu Respon (Waiting)`, dan `Selesai (Closed)`.
   - Tombol aksi 1-klik langsung pada kartu: `[ Proses ]` dan `[ Selesai ]`.
4. **Laci Detail Tiket Bertab (`SageTicketDrawer`)**:
   - **Tab Diskusi**: Percakapan publik dengan pelapor dan catatan internal staf (🔒) dengan galeri foto terintegrasi.
   - **Tab Triase & UPT**: Pengaturan status tiket dan penugasan teknisi UPT.
   - **Tab Info & SLA**: Detail pelapor, tanggal, dan target waktu SLA.
5. **Floating Chat Badge & FAB**:
   - Bubble interaktif untuk membuka percakapan aktif dan tombol pembuatan tiket cepat.

### 4.3 Modul Administrasi
1. **Manajemen Pengguna & Staf (`UserManagement`)**:
   - Pendaftaran staf operator, teknisi UPT, atau super admin baru.
   - Penugasan unit kerja teknis spesifik untuk akun UPT.
2. **Konfigurasi Sumber Data (`DataSourceConfig`)**:
   - Pemantauan ID Google Spreadsheet aktif dan Folder Google Drive penyimpanan berkas.
   - Uji latensi koneksi (*Ping test*) ke backend Google Apps Script.

---

## 5. Pipeline Pengolahan Lampiran & Gambar (Image Pipeline)

```
[Pelapor Mengunggah Foto] 
         │
         ▼
[Google Apps Script: uploadToDrive] ──> Simpan ke Folder Google Drive Instansi
         │
         ▼
[Google Sheets: Ticket_Threads] ─────> Format URL Berkas Terenkripsi
         │
         ▼
[Frontend: ticketFormatter.ts] ──────> Ekstrak Google Drive File ID
         │                             └─> Direct Thumbnail CDN: https://lh3.googleusercontent.com/d/{id}
         ▼
[AttachmentGallery.tsx] ─────────────> 1. Thumbnail Box dengan auto-fallback
                                       2. Lightbox Modal Full-Screen Zoom
                                       3. Tombol [Buka di Google Drive / Tab Baru]
```

---

## 6. Skema Basis Data Relasional Aiven MySQL (`defaultdb`)

### 6.1 Tabel `users`
`user_id` (PK) | `name` | `email` (UK) | `password_hash` | `role` (ENUM) | `upt_unit` | `is_active` | `nip` | `department` | `role_title` | `avatar_url` | `jabatan_fungsional` | `kantor_penempatan` | `phone_number` | `created_at` | `updated_at`

### 6.2 Tabel `tickets`
`ticket_id` (PK) | `subject` | `category` | `department` | `topic` | `location` | `description` | `priority` (ENUM) | `status` (ENUM) | `channel` | `requester_name` | `requester_email` | `requester_phone` | `assigned_upt` | `assigned_operator` | `sla_due_at` | `closed_at` | `attachments` (JSON) | `created_at` | `updated_at`

### 6.3 Tabel `threads`
`thread_id` (PK) | `ticket_id` (FK) | `sender_id` | `sender_name` | `sender_role` | `message` | `visibility` (ENUM: public, internal) | `created_at`

### 6.4 Tabel `audit_logs`
`log_id` (PK) | `ticket_id` | `actor_id` | `actor_name` | `actor_role` | `action` | `details` | `created_at`

### 6.5 Tabel `system_config`
`config_key` (PK) | `config_value` (JSON) | `description` | `updated_at`
