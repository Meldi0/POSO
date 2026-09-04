# Business Requirements Document (BRD)
## Aplikasi: PRISMA POS — Pos Resolution & Integrated Service Management Application (v3.0)
### Sistem Helpdesk & Manajemen Tiket Terpadu PT Pos Indonesia (Persero)

**Versi:** 3.0 (Enterprise Cloud Native Release — Aiven for MySQL & Dedicated Archive Engine)  
**Status:** Implemented & Production Ready  
**Tipe Dokumen:** Business Requirements Document (BRD)  

---

## 1. Latar Belakang (Background)

Sebagai salah satu Badan Usaha Milik Negara (BUMN) logistik dan kurir terbesar di Indonesia, **PT Pos Indonesia (Persero)** mengelola jaringan operasional yang sangat luas, mencakup Kantor Pos Utama (KCU), Kantor Cabang (KC), Kantor Cabang Pembantu (KCP), Sentral Pengolahan Pos (SPP), hingga agen pos di seluruh pelosok nusantara.

Sebelum adanya sistem terpadu, penanganan keluhan operasional, kendala sistem informasi, kerusakan sarana gedung/armada, serta deviasi kualitas layanan sering kali tersebar di berbagai saluran tidak resmi (grup WhatsApp, email terpisah, atau panggilan telepon). Kondisi ini menimbulkan berbagai masalah bisnis:
- **Ketidakpastian Status & Hilangnya Jejak Laporan**: Banyak keluhan tidak tercatat secara terpusat dan rawan tercecer.
- **Keterbatasan Solusi Spreadsheet Legacy**: Sistem berbasis spreadsheet dan skrip lawas rentan mengalami *timeout*, batas kuota (*API rate limit*), dan ketiadaan integritas referensial data.
- **Lambatnya Respons ke Pelapor**: Tidak tersedianya saluran notifikasi instan dua arah menyebabkan pelapor tidak mengetahui perkembangan penanganan.
- **Beban Bandwidth Pengunggahan Foto**: Pelapor di daerah sering gagal mengunggah foto bukti fisik kerusakan akibat ukuran berkas resolusi kamera yang terlampau besar.
- **Campur Aduk Tiket Selesai dan Tiket Aktif**: Penumpukan tiket yang telah selesai pada papan kerja operator memperlambat proses triase harian.

Untuk menjawab kebutuhan tersebut, dikembangkan **PRISMA POS** (*Pos Resolution & Integrated Service Management Application* — kode rilis **POSO v3.0**) sebagai sistem helpdesk korporat terpadu berkinerja tinggi yang menghubungkan pelapor, operator helpdesk, dan Unit Pelaksana Teknis (UPT) dalam satu ekosistem berbasis cloud yang aman, andal, dan **100% responsif di perangkat ponsel, tablet, maupun komputer desktop**.

---

## 2. Tujuan Proyek (Business Objectives)

1. **Satu Pintu Layanan Terpadu (*Single Point of Contact / SPOC*)**:
   Menyediakan portal helpdesk digital resmi yang dapat diakses oleh publik, pegawai, dan mitra dari perangkat mana pun tanpa kendala tampilan.
2. **Triase & Distribusi Cepat Multi-UPT**:
   Memungkinkan operator helpdesk memverifikasi, menentukan prioritas SLA, dan mendelegasikan tiket ke 6 unit teknis spesifik PT Pos Indonesia secara seketika.
3. **Pemisahan Alur Kerja Tiket Aktif & Arsip Otomatis**:
   Menyediakan papan triase Kanban 3-kolom yang hanya berfokus pada pekerjaan aktif (`Open`, `In Progress`, `Menunggu`), serta memindahkan tiket selesai secara otomatis ke modul **Arsip Tiket** berformat tabel densitas tinggi dengan pencarian cepat nomor ID tiket.
4. **Kemandirian Penyimpanan Bukti & Kompresi Foto Cerdas**:
   Mengompresi bukti foto langsung di peramban pelapor (mereduksi ukuran berkas hingga 85%) dan menyimpannya langsung ke basis data relasional tanpa ketergantungan pada Google Drive API pihak ketiga.
5. **Transparansi Layanan dengan Notifikasi Real-time Multi-Lapisan**:
   Memberikan pembaruan status instan (<50ms) kepada pelapor melalui denting audio Web Audio API, notifikasi browser desktop, lonceng notifikasi, dan floating chat widget.
6. **Keamanan & Skalabilitas Enterprise**:
   Mengoperasikan sistem di atas basis data cloud **Aiven for MySQL** (SSL Mode: REQUIRED) dan serverless deployment di **Vercel** dengan enkripsi penuh dan audit trail komprehensif.

---

## 3. Manfaat Bisnis (Business Value)

| Aspek | Kondisi Sebelum Sistem | Manfaat Nyata PRISMA POS (v3.0) |
|---|---|---|
| **Pencatatan Keluhan** | Tersebar di chat personal dan catatan fisik | 100% keluhan memiliki ID unik resmi (`#TICK-YYYYMMDD-XXXX`) dengan riwayat lengkap. |
| **Kecepatan Triase Operator** | Papan kerja penuh bercampur tiket lama | Papan Kanban bersih berfokus pada tiket aktif, dilengkapi pintasan `Ctrl+K` untuk pencarian super cepat. |
| **Arsip & Audit Kepatuhan** | Sulit mencari riwayat tiket masa lalu | Modul **Arsip Tiket Selesai** mandiri dengan pencarian instan nomor ID tiket dan counter total tiket tersimpan. |
| **Keandalan Basis Data** | Berisiko corrupt pada Google Sheets | Basis data cloud **Aiven for MySQL** dengan ACID transaction, connection pool otomatis, dan pemantau kluster terintegrasi. |
| **Pengunggahan Bukti Foto** | Sering gagal upload di sinyal lemah | Auto-kompresi gambar di peramban hingga ~200KB sebelum dikirim, menjamin 99% keberhasilan pengunggahan bukti. |
| **Mobilitas Teknisi UPT** | Harus membuka laptop untuk cek tiket | Teknisi di lapangan dapat memeriksa tiket, foto kerusakan, dan mengubah progres langsung dari smartphone. |
| **Keamanan Kredensial & Audit** | Password tersebar tidak teratur | Autentikasi berbasis JWT, penyimpanan password aman (BCrypt), dan audit log jejak rekam perubahan data. |

---

## 4. Ruang Lingkup Sistem (Scope of System)

### 4.1 Fitur yang Telah Terimplementasi Penuh (In-Scope)

1. **Portal Publik & Layanan Pelanggan**:
   - Beranda institusional interaktif dengan filter 6 bidang operasional pos dan modal panduan kebijakan SLA.
   - Formulir pembuatan tiket baru dengan **Live Ticket Preview Card**, kalkulasi penugasan UPT otomatis, dan zona unggah foto *Drag & Drop* berfitur auto-kompresi.
   - Pelacak tiket mandiri (*Public Ticket Tracker*) dengan **Stepper Timeline 4 Tahap Visual**, galeri foto Lightbox, audio chime, notifikasi desktop browser, dan forum percakapan dua arah.
   - Portal *Tiket Saya* untuk pengguna terdaftar dengan filter tab status, lonceng notifikasi interaktif, dan *Floating Chat Badge* ala WhatsApp/Telegram.
   - Registrasi mandiri akun pengguna pelapor.

2. **Workstation Operator & Teknisi UPT (`/dashboard`)**:
   - Bilah samping navigasi responsif (*Sage Sidebar*): mode *Desktop Mini-Rail* dan *Mobile Slide Drawer*.
   - Menu **Semua Tiket**: Papan Triase Kanban 3-kolom aktif (`Open`, `In Progress`, `Menunggu`) dan mode Tampilan Tabel Adaptif.
   - Menu **Arsip Tiket**: Tampilan tabel khusus tiket berstatus selesai (*closed*) dengan kolom pencarian cepat ID tiket dan counter statistik real-time.
   - Laci inspeksi detail bertab (*SageTicketDrawer*) untuk diskusi publik, catatan internal staf (🔒), triase prioritas/SLA, dan pendelegasian UPT.
   - Galeri berkas dan foto bukti kerusakan dengan pratinjau Lightbox layar penuh.

3. **Panel Administrasi Sistem**:
   - **Manajemen Pengguna & Staf (`UserManagement`)**: Pembuatan akun staf, penetapan peran RBAC, penugasan unit kerja UPT, dan dukungan `password_plain` dengan toggle intip kata sandi untuk audit akun demo.
   - **Pemantau Kluster Aiven MySQL (`DataSourceConfig`)**: Uji latensi koneksi real-time, status SSL REQUIRED, pemantau kapasitas connection pool, statistik jumlah baris tabel database, dan panduan deployment Vercel.

4. **Infrastruktur Backend & Serverless Deployment**:
   - RESTful API modular berbasis Node.js / Express 5.x.
   - Handler serverless siap pakai di Vercel (`api/index.js` + `vercel.json`).
   - Koneksi database terenkripsi TLS 1.3 / SSL Mode: REQUIRED ke Aiven for MySQL (`defaultdb`).
   - Skrip migrasi dan seeding otomatis (`server/database/migrate.js`).

### 4.2 Ruang Lingkup Pengembangan Masa Depan (Out-of-Scope)
- Pengiriman notifikasi SMS broadcast berbayar via provider telco pihak ketiga.
- Integrasi bot kecerdasan buatan (*AI chatbot*) untuk auto-reply tiket berbasis LLM.

---

## 5. Matriks Peran & Hak Akses (Role-Based Access Control)

| Peran (*Role*) | Deskripsi Pengguna | Mekanisme Pembuatan Akun | Hak Akses Utama dalam Sistem |
|---|---|---|---|
| **Pengguna Umum (Pelapor)** | Pelanggan eksternal atau pegawai non-staf | **Registrasi Mandiri** di portal publik atau pelacakan via ID tiket | Membuat tiket, melacak progres 4-tahap, melihat foto lampiran, menerima notifikasi audio/browser, dan membalas pesan pada tiket miliknya. |
| **Operator Helpdesk** | Staf garda depan layanan pelanggan & triase | Didaftarkan oleh **Administrator** | Memeriksa seluruh tiket masuk, menentukan prioritas SLA, mendelegasikan tiket ke unit UPT, membalas publik, menulis catatan internal, dan menutup tiket. |
| **Teknisi UPT** | Staf teknis pelaksana perbaikan | Didaftarkan oleh **Administrator** | Menangani tiket yang didelegasikan ke unitnya, memperbarui progres pengerjaan teknis, berdiskusi internal dengan operator, dan menyelesaikan tiket. |
| **Super Administrator** | Penanggung jawab teknis & tata kelola sistem | Dibuat saat inisialisasi basis data master | Akses tanpa batas: kelola akun & unit staf, memantau kesehatan kluster Aiven MySQL, konfigurasi sistem, dan audit log lengkap. |

---

## 6. Unit Pelaksana Teknis (UPT) yang Didukung

PRISMA POS telah memetakan alur triase secara spesifik ke 6 Unit Pelaksana Teknis PT Pos Indonesia:

1. **UPT Operasional & Logistik**: Penanganan kendala manifesto, keterlambatan kiriman pos kilat/kargo, tracking pos, dan transit SPP.
2. **UPT Jaringan & Layanan Kurir**: Kendala armada kurir antaran, pos keliling, aplikasi kurir, dan layanan loket kiriman.
3. **UPT Sarana, Prasarana & Keamanan Fisik (CGS)**: Kerusakan gedung kantor, instalasi listrik, pendingin ruangan (AC), armada operasional, dan keamanan kantor.
4. **UPT Bisnis Keuangan & Finansial**: Layanan Pospay, Giro Pos, Remittance, transaksi perbankan, dan selisih kas loket.
5. **UPT Quality Control & Audit SLA**: Pemeriksaan kepatuhan standar SLA pengantaran, audit volumetrik/timbangan, dan investigasi komplain berulang.
6. **UPT TI & Sistem Informasi**: Masalah jaringan LAN/VPN/Wi-Fi, gangguan aplikasi core pos / PRISMA POS, hardware/komputer/printer barcode, serta reset kata sandi email dinas.
