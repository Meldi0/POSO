# Product Requirements Document (PRD)
## Aplikasi: POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.1)

**Versi:** 2.1 (Universal Attachment Viewer & Real-Time Customer Notification Subsystem)  
**Status:** Live & Implemented  
**Tipe Dokumen:** Product Requirements & Technical Specification Document  

---

## 1. Ringkasan Produk

**POSO Helpdesk** adalah sistem helpdesk dan manajemen tiket terpadu modern multi-channel berbasis **React 18 + TypeScript + Vite** dengan antarmuka **Ocean Cyan Glassmorphism**, didukung backend serverless **Google Apps Script REST API**, penyimpanan berkas **Google Drive**, basis data **Google Sheets**, serta subsistem komunikasi & notifikasi real-time instan (**WebSocket + Universal LocalStorage Event + BroadcastChannel + Web Audio API**).

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
| **Penyimpanan Berkas** | Google Drive API (`DriveApp`) + Google CDN | File lampiran disimpan di Google Drive resmi; thumbnail via `lh3.googleusercontent.com/d/{id}` |
| **Backend REST API** | Google Apps Script (`doGet` & `doPost`) | Penanganan request RESTful, JSON Payload, Selective LockService, Sanitizer |
| **Basis Data Master** | Google Sheets (`POSO Master Database`) | Penyimpanan terstruktur: `Tickets`, `Users`, `Ticket_Threads`, `Audit_Log` |
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

## 6. Skema Basis Data Google Sheets

### 6.1 Sheet `Tickets`
`ticket_id` | `created_at` | `updated_at` | `subject` | `category` | `description` | `status` | `priority` | `channel` | `requester_name` | `requester_email` | `assigned_upt` | `assigned_operator` | `sla_due_at`

### 6.2 Sheet `Ticket_Threads`
`thread_id` | `ticket_id` | `sender_id` | `sender_role` | `message` | `visibility` | `created_at`

### 6.3 Sheet `Users`
`user_id` | `name` | `email` | `password_hash` | `salt` | `role` | `assigned_upt` | `created_at`

### 6.4 Sheet `Audit_Log`
`log_id` | `timestamp` | `user_id` | `action` | `target_id` | `details`
