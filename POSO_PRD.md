# Product Requirements Document (PRD)
## Aplikasi: POSO — Sistem Helpdesk & Manajemen Tiket Terpadu

**Versi:** 2.0 (Production Implemented)  
**Status:** Live & Implemented  
**Tipe Dokumen:** Product Requirements & Technical Specification Document  

---

## 1. Ringkasan Produk

**POSO Helpdesk** adalah aplikasi manajemen tiket dan layanan bantuan multi-channel terpadu yang terinspirasi oleh *osTicket*, dikemas dalam desain antarmuka modern bernuansa **Sage Green & Soft Cream Canvas**, didukung backend serverless **Google Apps Script REST API** dan penyimpanan berkas **Google Drive & Google Sheets**.

Sistem ini melayani 4 peran pengguna (*Pengguna Umum, Operator Helpdesk, Teknisi UPT, dan Super Administrator*), mendukung pengunggahan foto bukti kerusakan, pemisahan percakapan publik dan catatan internal, serta papan triase interaktif (*Kanban Board*) dengan kontrol aksi cepat.

---

## 2. Arsitektur & Spesifikasi Teknologi (Tech Stack)

| Lapisan (*Layer*) | Teknologi yang Digunakan | Keterangan |
|---|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite | SPA dengan perutean berbasis `react-router-dom` v6 |
| **Styling & Design System** | Tailwind CSS + CSS Custom Tokens | Tema *MealSpot-inspired Sage Green*, Soft Cream Canvas, Dot Pattern |
| **Iconography** | Lucide React Icons | 100% Ikon vektor profesional, bebas karakter emoji generik |
| **Penyimpanan Gambar** | Google Drive API (`DriveApp`) | File disimpan di Google Drive Folder (`1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR`) |
| **Backend REST API** | Google Apps Script (`doGet` & `doPost`) | Penanganan request RESTful, JSON Payload, Selective LockService |
| **Basis Data Master** | Google Sheets (`POSO Master Database`) | ID: `1IBoq8tUdVC1ki2omEqvgek6LEHhE6aVOSEfDuiO0byE` |
| **Autentikasi** | Token Sesi & Hash Password | Penyimpanan sesi aman di `localStorage` & verifikasi backend |

---

## 3. Sistem Desain & Antarmuka Pengguna (UI/UX Design System)

### 3.1 Token Warna & Nuansa Visual
- **Canvas Background**: Soft Cream Mint (`#EBF2EE`) dengan aksen tekstur titik halus (`.bg-dot-pattern`).
- **Floating App Shell**: Latar putih gading (`#F0F5F2`), sudut membulat lebar (`rounded-[32px] sm:rounded-[36px]`), bayangan halus (`shadow-app-shell`).
- **Aksen Utama (Sage Green)**:
  - Default: `#7EAA92`
  - Hover: `#6B9780`
  - Dark: `#55806A`
  - Soft Light: `#E2ECE7`
- **Aksen Sekunder (Coral Orange)**: `#F58A61` digunakan untuk tombol aksi mengambang (*Floating Action Button / FAB*) dan penanda status darurat (*Urgent*).
- **Tipografi**: Bersih dan modern dengan hierarki bobot teks tegas (`font-extrabold` dan `font-black`).
- **Bebas Karakter Emoji**: Seluruh elemen visual, indikator peran, tombol, dan kategori menggunakan ikon SVG resmi **Lucide React**.

### 3.2 Fitur Ergonomi & Tata Letak
- **Edge-to-Edge Full Width**: Tata letak mengisi penuh layar secara proporsional tanpa margin kosong abnormal di sisi kiri-kanan.
- **Sticky Sage Sidebar**: Bilah samping kiri terkunci di posisinya (`sticky top-5 self-start`) saat halaman utama digulir ke bawah.
- **Responsive Drawer**: Panel inspeksi detail tiket meluncur dari sisi kanan dengan pratinjau gambar, form triase UPT, dan formulir balasan.

---

## 4. Struktur Modul & Fitur Utama

### 4.1 Portal Publik (Untuk Tamu & Pengguna Umum)
1. **Beranda Institusional (`/`)**:
   - Navbar melayang berbentuk kapsul (*pill*) dengan status sesi masuk.
   - Banner hero dengan 2 kartu aksi utama: **[Ajukan Tiket Baru]** dan **[Lacak Status Tiket]**.
   - Katalog 6 kategori permasalahan teknis (*Jaringan, Sarana Fisik, Akun & SSO, Hardware, SIM/Aplikasi, Konsultasi*).
   - Alur SOP penanganan pengaduan (4 tahapan jelas).
   - Informasi jam operasional dan kontak bantuan resmi.
2. **Formulir Pengajuan Tiket (`/submit`)**:
   - Pemilihan kategori permasalahan dan tingkat urgensi kendala.
   - Pengunggahan foto/gambar pendukung dengan konversi otomatis ke Google Drive.
   - Pembuatan nomor tiket unik otomatis (`#TICK-YYYYMMDD-XXXX`).
3. **Pelacak Status Tiket Mandiri (`/track`)**:
   - Pencarian berdasarkan nomor ID tiket dan email pelapor.
   - Badge status visual (*Open, In Progress, Waiting, Closed*) dan penugasan UPT.
   - **Komponen Galeri Lampiran (`AttachmentGallery`)**: Menampilkan thumbnail foto asli dan fitur **Lightbox Zoom** saat diklik.
   - Formulir tanggapan tambahan langsung dari pelapor.
4. **Halaman Tiket Saya (`/my-tickets`)**:
   - Daftar seluruh tiket yang pernah diajukan oleh akun pelapor yang sedang login.
5. **Autentikasi (`/login` & `/register`)**:
   - Form pendaftaran mandiri khusus pengguna umum.
   - Tombol 1-klik demo akun (*Super Admin, Operator, Pelapor*).

### 4.2 Workstation Operator & Staf UPT (`/dashboard`)
1. **Sage Sidebar (Bilah Kiri)**:
   - Panel atas hijau sage: Avatar inisial dengan status online, nama staf & peran, capaian target SLA (*94.8%*), dan 2 kotak metrik ringkas (*Tiket Aktif* & *Tiket Selesai*).
   - Panel bawah putih: Menu navigasi bergaya pil (*Papan Triase Kanban, Daftar Tabel Tiket, Kelola Staf & UPT, Sumber Data Google Drive, Buka Portal Publik*).
2. **Top Bar Header**:
   - Dropdown filter kategori instan.
   - Pengalih tampilan (*Kanban View* vs *Table View*).
   - Tombol cepat `+ Tiket Baru` dan tombol sinkronisasi data dari Google Sheets.
   - Kolom pencarian rounded-full putih bersih.
3. **Papan Triase Multi-Kolom (Interactive Kanban Board)**:
   - 4 Kolom Status: `Tiket Masuk (Open)`, `Sedang Dikerjakan UPT (In Progress)`, `Menunggu Respon (Waiting)`, dan `Selesai (Closed)`.
   - **Tombol Aksi Cepat pada Kartu**:
     - Tombol `[ Proses ]` untuk langsung mengubah tiket *Open* ke *In Progress*.
     - Tombol `[ Selesai ]` untuk langsung menyelesaikan tiket ke kolom *Closed*.
   - **Menu Titik Tiga (`...`) pada Header Kolom**:
     - *Urut: Prioritas Tertinggi (Urgent First)*
     - *Urut: Waktu Masuk Terbaru*
     - *Salin Ringkasan Tiket (Clipboard Copy)*
     - *Tandai Semua Selesai (Bulk Action)*
   - Kartu tiket terapung (*Floating Cards*) dilengkapi pill SLA, indikator thumbnail gambar terlampir, dan email pelapor.
4. **Laci Inspeksi Geser (`SageTicketDrawer`)**:
   - Pengubahan status tiket dan penugasan unit UPT dengan tombol simpan ke Google Sheets.
   - Pratinjau gambar dan dokumen lampiran beresolusi penuh.
   - Riwayat percakapan balasan publik dan penambahan **Catatan Internal Staf**.
5. **Tombol Coral FAB (`+`)**:
   - Tombol mengambang di sudut kanan bawah untuk pembuatan tiket cepat dari halaman mana pun.

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
| `ticket_id` | String | ID Unik Tiket (contoh: `TICK-20260831-9421`) |
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
| `message` | Text | Isi pesan / balasan / catatan internal (bersih tanpa dump base64) |
| `visibility` | String | `public` (terlihat pelapor) \| `internal` (khusus staf) |
| `created_at` | ISO Date String | Waktu pengiriman pesan |

---

## 6. Kontrak API Google Apps Script

| HTTP Method | Action Parameter | Deskripsi & Payload | Hak Akses |
|---|---|---|---|
| `POST` | `action=register` | Registrasi akun pelapor publik baru | Publik |
| `POST` | `action=login` | Autentikasi email & password, mengembalikan token sesi | Publik |
| `POST` | `action=createTicket` | Membuat tiket baru & otomatis upload attachment ke Google Drive | Publik & Staf |
| `GET` | `action=getTickets` | Mengambil daftar tiket dengan filter kategori, status, dan kata kunci | Staf & Terautentikasi |
| `GET` | `action=getTicketDetail` | Mengambil detail tiket beserta riwayat thread balasan | Pelapor & Staf |
| `POST` | `action=updateTicketStatus` | Memperbarui status (*open/in_progress/waiting/closed*) & unit UPT | Operator, UPT, Admin |
| `POST` | `action=addThreadMessage` | Menambahkan pesan balasan publik atau catatan internal staf | Pelapor & Staf |
| `POST` | `action=createUser` | Menambahkan akun staf operator atau teknisi UPT baru | Super Admin |
| `GET` | `action=getUsers` | Mengambil daftar pengguna dan staf terdaftar | Super Admin |
| `GET` | `action=cleanThreads` | Pembersih otomatis data base64 kotor pada Sheet `Ticket_Threads` | Super Admin |

---

## 7. Penanganan Kinerja & Ketahanan Data

1. **Selective LockService**: Mencegah tabrakan tulis (*race conditions*) hanya pada request POST yang mengubah basis data (`lock.tryLock(8000)`), sementara request GET membaca data secara paralel tanpa hambatan antrean.
2. **Drive Blob Streaming**: Mengunggah berkas gambar langsung ke folder Google Drive dan hanya mencatat URL publik ke Spreadsheet.
3. **Data Sanitization**: Mencegah sel spreadsheet kehabisan kuota karakter (50.000 karakter per sel) dengan menyaring string base64 menjadi tautan resmi.
