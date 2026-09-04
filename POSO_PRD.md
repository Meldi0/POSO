# Product Requirements Document (PRD)
## Aplikasi: PRISMA POS — Pos Resolution & Integrated Service Management Application (v3.0)
### Sistem Helpdesk & Manajemen Tiket Terpadu PT Pos Indonesia (Persero)

**Versi:** 3.0 (Cloud Native — Aiven for MySQL, Vercel Serverless, & Dedicated Archive Architecture)  
**Status:** Live & Production Ready  
**Tipe Dokumen:** Product Requirements & Technical Specification Document  

---

## 1. Ringkasan Produk

**PRISMA POS** (*Pos Resolution & Integrated Service Management Application* — sebelumnya dikenal dengan kode internal **POSO**) adalah sistem helpdesk dan manajemen tiket terpadu multi-channel yang dirancang khusus untuk memenuhi standar operasional layanan **PT Pos Indonesia (Persero)**.

Aplikasi ini dibangun menggunakan arsitektur modern **React 18 + TypeScript + Vite** pada sisi frontend dengan antarmuka **Ocean Cyan Glassmorphism**, didukung backend REST API **Node.js / Express 5.x** siap deploy serverless di platform **Vercel**, basis data cloud **Aiven for MySQL** (dengan enkripsi TLS 1.3 / SSL Mode: REQUIRED), serta subsistem notifikasi real-time terintegrasi (**WebSocket + Universal LocalStorage Event + BroadcastChannel + Web Audio API**).

Sistem ini melayani 4 peran pengguna (*Pengguna Umum/Pelapor, Operator Helpdesk, Teknisi UPT, dan Super Administrator*), mendukung pengunggahan foto bukti kerusakan dengan kompresi cerdas di sisi peramban (*client-side canvas compression*), pemisahan percakapan publik dan catatan internal staf (🔒), *Live Real-time Ticket Preview*, *Interactive Kanban Board* untuk tiket aktif, modul mandiri *Arsip Tiket Selesai*, *Aiven MySQL Cluster Monitor*, serta antarmuka yang **100% responsif di perangkat mobile, tablet, dan desktop**.

---

## 2. Arsitektur & Spesifikasi Teknologi (Tech Stack)

| Lapisan (*Layer*) | Teknologi yang Digunakan | Keterangan & Peran Teknis |
|---|---|---|
| **Frontend Framework** | React 18.3 + TypeScript 5.7 + Vite 6.1 | Single Page Application (SPA) dengan perutean dinamis `react-router-dom` v7 |
| **Styling & Design System** | Tailwind CSS v3.4 + Custom Tokens | Desain Ocean Cyan Glassmorphism, Apple-inspired spring physics, subtle pulse glow |
| **Animasi & Interaksi** | Framer Motion v11 | Transisi antar layout, modal dialog, slide-over drawer, badge bounce, & toast alerts |
| **Iconography** | Lucide React Icons v0.475 | Ikonografi vektor SVG seragam, konsisten, dan ringan |
| **Audio Synthesizer** | Web Audio API (Native 0ms Latency) | Penghasil nada ganda harmonik C6/G6 tanpa dependensi berkas suara eksternal |
| **Notifikasi Browser** | Web Push / Notification API | Peringatan peramban desktop saat jendela/tab sedang berada di latar belakang |
| **Backend REST API** | Node.js + Express 5.x (`server/`) | Arsitektur RESTful modular: JWT auth, RBAC middleware, connection pool, transaction safety |
| **Serverless Deployment** | Vercel Serverless Functions (`api/index.js`) | Handler serverless otomatis via `vercel.json` dengan full security headers |
| **Basis Data Master** | Aiven for MySQL 8.0 (`defaultdb`) | Cloud Managed Relational Database: `users`, `tickets`, `threads`, `audit_logs`, `system_config` |
| **Keamanan Jaringan** | TLS 1.3 / SSL Mode: REQUIRED | Enkripsi end-to-end koneksi database cloud Aiven dengan CA certificate validation |
| **Real-time Engine** | WebSocket + BroadcastChannel + Storage Events | Sinkronisasi multi-tab dan multi-perangkat instan (<50ms) dengan fallback terpadu |

---

## 3. Sistem Desain & Antarmuka Responsif (UI/UX)

### 3.1 Identitas Visual & Token Warna
- **Brand Identity**: PRISMA POS Logo resmi (`/prisma-pos-logo.png`) & Favicon tab bar terintegrasi.
- **Canvas Background**: Light Ice Canvas (`#F4F7F9`).
- **Primary Ocean**: `#0D5C75` (Darker: `#083342`, Deep Slate: `#0F172A`).
- **Accent Cyan**: `#199FB1` (Hover: `#148797`, Tint: `#EAF4F8`).
- **Accent Coral**: `#F58A61` (Hover: `#E77448`, Warm Tint: `#FFF7ED`).
- **Surface Glassmorphism**: `.apple-glass` dan `.apple-glass-card` dengan backdrop-blur 20px dan border semi-transparan (`rgba(255,255,255,0.7)`).
- **Tipografi**: Plus Jakarta Sans (Google Fonts) dengan bobot 300 hingga 800.

### 3.2 Fitur Ergonomi & Responsivitas Antarmuka
- **Responsive Mobile Navigation**: Menu samping tersembunyi dengan tombol hamburger pada ponsel pintar, slide-over drawer dengan backdrop blur.
- **Desktop Mini-Rail Sidebar**: Sidebar workstation dapat diciutkan (*collapse*) menjadi mode rail ikon ramping untuk memaksimalkan ruang kerja.
- **Active Triase Kanban Switcher**: Tombol pill pemilih kolom status instan pada layar smartphone.
- **Adaptive Table View**: Tampilan tabel beralih ke format kartu responsif (*stacked card list*) pada layar kecil.
- **Global Keyboard Shortcuts**: Pintasan `Ctrl+K` / `Cmd+K` untuk Command Palette & pencarian cepat, serta `Esc` untuk menutup modal/drawer.

---

## 4. Struktur Modul & Fitur Utama

### 4.1 Portal Publik & Pengguna Mandiri
1. **Beranda Institusional (`/`)**:
   - Hero banner interaktif dengan 2 tombol aksi utama: **[Ajukan Tiket Baru]** dan **[Lacak Status Tiket]**.
   - Katalog 6 bidang layanan operasional PT Pos Indonesia (Kurir, Logistik, CGS, Finansial, QC, TI) dengan filter chip interaktif.
   - Metrik statistik performa real-time dan modal panduan kebijakan SLA (*Service Level Agreement*).
2. **Formulir Pengajuan Tiket (`/submit`)**:
   - Tata letak 2-kolom: Formulir input di kiri + **Live Real-Time Ticket Preview Card** di kanan.
   - Zona unggah berkas *Drag & Drop* dengan kompresi gambar otomatis sisi klien (*Client-side Canvas Image Compression*).
   - Penentuan otomatis UPT Unit target berdasarkan pemilihan bidang & topik layanan.
   - Kotak rekomendasi cerdas (*smart tips*) berbasis kategori yang dipilih.
   - Modal sukses pengajuan tiket dengan tombol 1-klik salin nomor ID tiket (`#TICK-YYYYMMDD-XXXX`).
3. **Pelacak Status Tiket Mandiri (`/track`)**:
   - **Stepper Timeline 4 Tahap Visual** (*Laporan Masuk, Triase Helpdesk, Pengerjaan UPT, Selesai*) dengan node status beranimasi.
   - **Galeri Foto & Lampiran Terpadu**: Pratinjau thumbnail langsung (mendukung foto base64 lokal dan tautan Google Drive CDN) dengan Lightbox perbesar layar penuh.
   - **Notifikasi Real-time Pelanggan**:
     - Nada denting ganda harmonik (*Web Audio API*) saat petugas merespons.
     - Notifikasi browser desktop (*Push Notification API*).
     - Banner respons interaktif di bagian atas layar.
   - Kolom percakapan dua arah dengan pemisahan identitas (*Tanggapan Pelapor* vs *Petugas UPT*).
4. **Portal Tiket Saya (`/my-tickets`)**:
   - Filter tab status (*Semua, Open, In Progress, Waiting, Closed*), pencarian cepat, dan kartu tiket interaktif.
   - **Lonceng Notifikasi (*Notification Bell*)**: Dropdown daftar balasan baru dengan counter badge merah.
   - **Floating Chat Badge**: Widget mengambang di pojok kanan bawah dengan popup preview balasan terbaru dan tombol navigasi langsung ke `/track?id=...`.
5. **Autentikasi Pengguna (`/login` & `/register`)**:
   - Form pendaftaran mandiri khusus pengguna umum (pelapor).
   - Tombol 1-klik demo akun untuk kemudahan pengujian (*Super Admin, Operator, Teknisi UPT TI, Teknisi UPT Sarpras, Pelapor*).
   - Isolasi sesi per-tab (*sessionStorage*) untuk memungkinkan login multi-akun di peramban yang sama tanpa konflik.

### 4.2 Workstation Operator & Staf UPT (`/dashboard`)
1. **Sage Sidebar & Navigasi Terpusat**:
   - **Semua Tiket (`tickets`)**: Menampilkan seluruh tiket aktif dengan badge jumlah tiket berjalan.
   - **Arsip Tiket (`archive`)**: Menu khusus untuk tiket yang telah tuntas ditangani (*closed*).
   - **Lacak Tiket (`track`)**: Pencari dan pelacak tiket instan dalam workstation.
   - **Basis Data Aiven (`datasource`)** *(Khusus Admin)*: Pemantau kesehatan kluster Aiven MySQL.
   - **Manajemen Pengguna (`users`)** *(Khusus Admin)*: Manajemen staf, teknisi UPT, dan peran RBAC.
2. **Top Bar Header**:
   - Kolom pencarian instan, filter kategori, switcher layout (Kanban vs Tabel), tombol refresh sinkronisasi, dan **Notification Bell**.
3. **Papan Triase Kanban 3-Kolom Aktif (`SageKanbanBoard`)**:
   - Kolom triase difokuskan khusus pada tiket aktif: `Open`, `In Progress`, dan `Menunggu`.
   - Tiket yang diubah statusnya menjadi `closed` (*Selesai*) secara otomatis dikeluarkan dari papan Kanban dan masuk ke menu **Arsip Tiket**.
   - Drag & drop kartu antar kolom status dengan animasi *physics-based*.
4. **Modul Mandiri Arsip Tiket Selesai (`SageTableView` Mode Arsip)**:
   - Tampilan tabel densitas tinggi khusus tiket selesai (`status = 'closed'` atau `is_archived = 1`).
   - Pencarian mandiri berbasis nomor ID tiket (`archiveSearchQuery`) dengan feedback jumlah temuan instan.
   - Pengarsipan otomatis tanpa perlu menekan tombol manual.
5. **Laci Detail Tiket Bertab (`SageTicketDrawer`)**:
   - **Tab Diskusi**: Percakapan publik dengan pelapor dan catatan internal staf (🔒) dengan galeri foto terintegrasi.
   - **Tab Triase & UPT**: Pengaturan prioritas SLA, status tiket, dan pendelegasian unit UPT.
   - **Tab Info & SLA**: Detail pelapor, riwayat waktu pembuatan, dan tenggat waktu SLA.
6. **Floating Chat Badge & Coral FAB**:
   - Bubble interaktif untuk membuka percakapan aktif dan tombol aksi mengambang pembuatan tiket cepat.

### 4.3 Modul Administrasi & Integrasi Cloud
1. **Manajemen Pengguna & Hak Akses (`UserManagement`)**:
   - Pendaftaran staf operator, teknisi UPT, dan admin baru.
   - Penugasan unit kerja teknis spesifik untuk akun UPT.
   - Dukungan kolom `password_plain` dengan toggle intip kata sandi untuk kemudahan audit dan verifikasi akun demo.
2. **Pemantau Kluster Aiven MySQL & Panduan Vercel (`DataSourceConfig`)**:
   - Indikator status koneksi Aiven MySQL real-time, latensi jaringan (*ping test*), dan status SSL Mode: REQUIRED.
   - Informasi spesifikasi kluster: versi MySQL, jumlah baris pada seluruh tabel (`users`, `tickets`, `threads`, `audit_logs`, `system_config`), dan kapasitas connection pool.
   - Panduan konfigurasi *Environment Variables* untuk deployment Vercel dengan tombol 1-klik salin nilai konfigurasi.

---

## 5. Pipeline Pengolahan Lampiran & Bukti Foto

Untuk menjaga performa tinggi dan menghilangkan ketergantungan pada kuota API pihak ketiga (Google Drive API), PRISMA POS mengimplementasikan arsitektur kompresi gambar mandiri:

```
[Pelapor Mengunggah Foto Bukti Kerusakan]
                 │
                 ▼
[Client-side HTML5 Canvas Auto-Compression]
  ├─ Resolusi Maksimal : 1600px (Aspect Ratio Preserved)
  ├─ Format Output     : image/jpeg
  ├─ Kualitas Kompresi : 0.82 (Penurunan ukuran berkas 70-85%)
  └─ Format Encoding   : Data URL Base64
                 │
                 ▼
[Node.js / Express Backend REST API]
  ├─ Sanitasi & Validasi Payload
  └─ Penyimpanan Transaksional ke Aiven MySQL
                 │
                 ▼
[Aiven for MySQL Cloud Database]
  ├─ Kolom `tickets.description` & `threads.message` (LONGTEXT)
  └─ Kolom `tickets.attachments` (JSON Array)
                 │
                 ▼
[Frontend: AttachmentGallery.tsx & ticketFormatter.ts]
  ├─ Render Thumbnail Instan dari Base64 Data URL
  ├─ Auto-detect External Tautan (cth: Google Drive CDN: https://lh3.googleusercontent.com/d/{id})
  └─ Lightbox Modal Full-Screen dengan fungsi zoom & salin tautan
```

---

## 6. Spesifikasi Skema Basis Data Relasional Aiven MySQL (`defaultdb`)

### 6.1 Tabel `users` (Data Pengguna & Autentikasi RBAC)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `user_id` | `VARCHAR(50)` | **Primary Key** |
| `name` | `VARCHAR(150)` | Nama lengkap pengguna / staf |
| `email` | `VARCHAR(150)` | **Unique Key**, alamat email login |
| `password_hash` | `VARCHAR(255)` | Hash kata sandi aman (BCrypt salt rounds = 10) |
| `password_plain` | `VARCHAR(255)` | Kata sandi teks murni (untuk kemudahan inspeksi akun demo) |
| `role` | `ENUM('admin', 'operator', 'upt', 'pengguna_umum')` | Peran hak akses RBAC |
| `upt_unit` | `VARCHAR(100)` | Unit kerja teknis (khusus peran `upt`) |
| `is_active` | `TINYINT(1)` | Status aktif akun (1: aktif, 0: dinonaktifkan) |
| `nip` | `VARCHAR(50)` | Nomor Induk Pegawai PT Pos Indonesia |
| `department` | `VARCHAR(150)` | Divisi / Departemen kerja |
| `role_title` | `VARCHAR(150)` | Judul jabatan staf |
| `avatar_url` | `TEXT` | Tautan foto profil atau avatar |
| `jabatan_fungsional` | `VARCHAR(150)` | Jabatan fungsional pegawai |
| `kantor_penempatan` | `VARCHAR(150)` | Kantor penempatan kerja (KCU / KC / Unit) |
| `phone_number` | `VARCHAR(30)` | Nomor telepon aktif / WhatsApp |
| `created_by` | `VARCHAR(150)` | Akun pembuat data |
| `created_at` | `DATETIME` | Waktu pembuatan data |
| `updated_at` | `DATETIME` | Waktu pembaruan data terakhir |

### 6.2 Tabel `tickets` (Master Data Tiket Pengaduan)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `ticket_id` | `VARCHAR(50)` | **Primary Key** (`TICK-YYYYMMDD-XXXX`) |
| `subject` | `VARCHAR(255)` | Judul ringkasan laporan |
| `category` | `VARCHAR(100)` | Kategori layanan PT Pos Indonesia |
| `department` | `VARCHAR(150)` | Departemen terkait |
| `topic` | `VARCHAR(150)` | Topik spesifik laporan |
| `location` | `VARCHAR(150)` | Lokasi kejadian / aset terdampak |
| `description` | `LONGTEXT` | Deskripsi lengkap laporan (termasuk lampiran base64) |
| `priority` | `ENUM('Low', 'Medium', 'High', 'Urgent')` | Tingkat urgensi laporan |
| `status` | `ENUM('open', 'in_progress', 'waiting', 'closed')` | Status proses penanganan |
| `channel` | `ENUM('web', 'email')` | Saluran asal tiket |
| `requester_name` | `VARCHAR(150)` | Nama lengkap pelapor |
| `requester_email` | `VARCHAR(150)` | Email pelapor |
| `requester_phone` | `VARCHAR(30)` | Nomor telepon pelapor |
| `assigned_upt` | `VARCHAR(100)` | Unit Pelaksana Teknis penerima penugasan |
| `assigned_operator` | `VARCHAR(150)` | Nama operator penanggung jawab triase |
| `sla_due_at` | `DATETIME` | Batas waktu penyelesaian SLA |
| `closed_at` | `DATETIME` | Waktu penutupan tiket |
| `is_archived` | `TINYINT(1)` | Indikator arsip (otomatis bernilai 1 saat closed) |
| `attachments` | `JSON` | Daftar metadata lampiran berkas |
| `created_at` | `DATETIME` | Waktu tiket dibuat |
| `updated_at` | `DATETIME` | Waktu status tiket diperbarui |

### 6.3 Tabel `threads` (Riwayat Diskusi & Catatan Internal)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `thread_id` | `VARCHAR(50)` | **Primary Key** (`THRD-YYYYMMDD-XXXX`) |
| `ticket_id` | `VARCHAR(50)` | **Foreign Key** mereferensi `tickets(ticket_id)` ON DELETE CASCADE |
| `sender_id` | `VARCHAR(50)` | ID pengirim pesan |
| `sender_name` | `VARCHAR(150)` | Nama pengirim pesan |
| `sender_role` | `VARCHAR(50)` | Peran pengirim (`admin`, `operator`, `upt`, `pengguna_umum`) |
| `message` | `LONGTEXT` | Isi pesan balasan / catatan internal |
| `visibility` | `ENUM('public', 'internal')` | Visibilitas (`public`: terlihat pelapor, `internal`: khusus staf) |
| `created_at` | `DATETIME` | Waktu pesan dikirimkan |

### 6.4 Tabel `audit_logs` (Rekam Jejak & Log Aktivitas)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `log_id` | `VARCHAR(50)` | **Primary Key** |
| `ticket_id` | `VARCHAR(50)` | ID tiket yang mengalami perubahan |
| `actor_id` | `VARCHAR(50)` | ID pengguna yang melakukan aksi |
| `actor_name` | `VARCHAR(150)` | Nama pengguna yang melakukan aksi |
| `actor_role` | `VARCHAR(50)` | Peran pengguna yang melakukan aksi |
| `action` | `VARCHAR(100)` | Jenis aktivitas (*status_change*, *assign_upt*, *reply*, dll.) |
| `details` | `TEXT` | Keterangan detail perubahan nilai |
| `created_at` | `DATETIME` | Waktu pencatatan log |

### 6.5 Tabel `system_config` (Pengaturan Konfigurasi Sistem)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `config_key` | `VARCHAR(100)` | **Primary Key** (cth: `sla_rules`, `system_maintenance`) |
| `config_value` | `JSON` | Nilai konfigurasi dalam format JSON terstruktur |
| `description` | `VARCHAR(255)` | Penjelasan fungsi konfigurasi |
| `updated_at` | `DATETIME` | Waktu pembaruan konfigurasi terakhir |
