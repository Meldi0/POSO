# Business Requirements Document (BRD)
## Aplikasi: POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.0)

**Versi:** 2.0 (Responsive & Interactive Architecture)  
**Status:** Implemented & Production Ready  
**Tipe Dokumen:** Business Requirements Document (BRD)  

---

## 1. Latar Belakang (Background)

Penanganan keluhan dan permohonan layanan teknis pada instansi sering kali tersebar di berbagai saluran tidak resmi (chat pribadi, pesan instan, email terpisah, atau panggilan telepon). Kondisi ini menyebabkan:
- Tiket dan riwayat keluhan tercecer serta tidak terdokumentasi dengan baik.
- Kurangnya transparansi status dan tidak ada kejelasan unit pelaksana teknis (UPT) yang bertanggung jawab.
- Hambatan dalam evaluasi target kecepatan layanan (*Service Level Agreement / SLA*).
- Pemborosan biaya lisensi perangkat lunak helpdesk proprietary pihak ketiga.

**POSO** dikembangkan sebagai sistem helpdesk dan manajemen tiket terpusat terintegrasi (*osTicket-inspired*) dengan biaya operasional minimal menggunakan ekosistem **Google Workspace (Google Apps Script, Google Drive, & Google Sheets)** sebagai backend basis data terstruktur, dipadukan dengan antarmuka web modern yang **100% responsif di perangkat mobile, tablet, dan desktop**.

---

## 2. Tujuan Proyek (Objectives)

1. **Satu Pintu Layanan (*Single Point of Entry*)**: Menyediakan portal publik terpadu yang dapat diakses dengan mudah dari peramban ponsel, tablet, maupun desktop.
2. **Triase & Distribusi Cepat Multi-UPT**: Memungkinkan operator helpdesk mendistribusikan laporan ke Unit Pelaksana Teknis terkait (*UPT TI & Jaringan, UPT Sarana & Prasarana, UPT Sistem Informasi, dll.*) secara instan.
3. **Penyimpanan Berkas Foto Terintegrasi**: Mengunggah berkas lampiran foto secara langsung ke Google Drive instansi dan menyajikan tautan serta pratinjau gambar (*lightbox*) secara rapi.
4. **Efisiensi Anggaran Infrastruktur**: Memanfaatkan Google Apps Script REST API tanpa memerlukan biaya server atau database berbayar bulanan.
5. **Kemudahan Aksesibilitas & Responsivitas Mobile**: Memastikan staf teknisi di lapangan dan pelapor di lapangan dapat membuat, memeriksa, dan memperbarui status tiket secara instan dari smartphone.

---

## 3. Manfaat Bisnis (Business Value)

| Area | Manfaat Nyata yang Dihasilkan |
|---|---|
| **Operasional** | Seluruh keluhan tercatat dengan nomor ID unik (`#TICK-YYYYMMDD-XXXX`), status transparan (*Open, In Progress, Waiting, Closed*), dan prioritas SLA terukur. |
| **Aksesibilitas Mobile** | Staf teknisi UPT dapat memperbarui status tiket langsung saat berada di lokasi perbaikan melalui tampilan mobile drawer dan aksi 1-klik. |
| **Kolaborasi Staf** | Operator dan staf teknis UPT dapat menambahkan *Catatan Internal (Internal Notes)* yang hanya terlihat oleh staf, terpisah dari balasan publik ke pelapor. |
| **Penyimpanan Aset** | Foto bukti kerusakan disimpan rapi di folder Google Drive instansi dan langsung dapat dilihat dengan pratinjau thumbnail/lightbox. |
| **Penghematan Biaya** | Biaya infrastruktur 100% serverless memanfaatkan Google Workspace yang sudah ada. |
| **Kemudahan Manajemen** | Super Administrator dapat mengelola akun staf, menetapkan unit penugasan UPT, dan memantau status sumber data Google Drive dari UI. |

---

## 4. Ruang Lingkup Sistem (Scope of System)

### 4.1 Modul yang Telah Selesai Diimplementasikan (In-Scope)
- **Portal Publik**:
  - Beranda resmi institusional dengan filter kategori layanan interaktif dan alur SOP penanganan.
  - Formulir pembuatan tiket baru dengan **Live Ticket Preview Card** dan zona unggah berkas *Drag & Drop*.
  - Pelacak tiket mandiri (*Public Ticket Tracker*) dengan **Stepper Timeline 4 Tahap Visual** dan kolom tanggapan pelanggan.
  - Halaman daftar tiket keluhan milik pengguna terdaftar (*My Tickets*) dengan filter tab status.
  - Registrasi mandiri khusus peran Pengguna Umum (*Pelapor*).
- **Workstation Operator & UPT (Dashboard Triase)**:
  - Bilah samping (*Sage Sidebar*) responsif: *Desktop Mini-Rail* + *Mobile Slide Drawer*.
  - Papan Triase Multi-Kolom (*Interactive Kanban Board*) dengan tombol pill switcher kolom mobile dan aksi cepat 1-klik (*Proses*, *Selesai*).
  - Tampilan alternatif daftar tabel adaptif (*Adaptive Table View*) dengan mode *mobile card list* dan fitur pengurutan kolom.
  - Laci inspeksi detail bertab (*Ticket Drawer*) untuk *Diskusi & Balasan*, *Triase & Delegasi UPT*, serta *Info & SLA*.
  - Pintasan keyboard cepat (`Ctrl+K` untuk pencarian dan `Esc` untuk menutup drawer).
  - Tombol aksi mengambang (*FAB*) untuk pembuatan tiket cepat.
- **Panel Admin**:
  - Manajemen Pengguna & Staf Teknis UPT (*User Management*).
  - Pengaturan & Pemantauan Sumber Data Google Drive / Spreadsheet (*DataSource Configuration*).
- **Backend & Database Serverless**:
  - REST API Google Apps Script dengan penanganan konkurensi cerdas (*Selective LockService*).
  - Penyimpanan file otomatis ke Google Drive target.
  - Pembersihan otomatis string base64 pada Google Sheets (`Ticket_Threads`).

---

## 5. Matriks Peran & Hak Akses (Role-Based Access Control)

| Peran (*Role*) | Deskripsi | Registrasi / Pembuatan Akun | Hak Akses Utama |
|---|---|---|---|
| **Pengguna Umum (Pelapor)** | Sivitas / publik yang mengajukan keluhan dan memantau tiket miliknya | **Registrasi Mandiri** pada portal publik | Membuat tiket, melacak tiket via nomor ID, membalas pesan pada tiket miliknya. |
| **Operator Helpdesk** | Garda depan penyaringan dan triase tiket | Dibuat oleh **Admin** | Melihat seluruh tiket, menentukan prioritas SLA, mendelegasikan tiket ke UPT, menambah catatan internal. |
| **Teknisi UPT** | Petugas teknis unit pelaksana | Dibuat oleh **Admin** | Memproses tiket sesuai bidang unit teknisnya, memperbarui status pengerjaan, berdiskusi internal dengan operator. |
| **Super Admin** | Pengelola penuh sistem | Dibuat saat inisialisasi awal | Akses tak terbatas: kelola staf & UPT, konfigurasi Google Drive, dan log audit sistem. |
