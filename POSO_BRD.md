# Business Requirements Document (BRD)
## Aplikasi: POSO — Sistem Helpdesk & Manajemen Tiket Terpadu (v2.1)

**Versi:** 2.1 (Universal Attachment Viewer & Real-Time Customer Notification System)  
**Status:** Implemented & Production Ready  
**Tipe Dokumen:** Business Requirements Document (BRD)  

---

## 1. Latar Belakang (Background)

Penanganan keluhan dan permohonan layanan teknis pada instansi sering kali tersebar di berbagai saluran tidak resmi (chat pribadi, pesan instan, email terpisah, atau panggilan telepon). Kondisi ini menyebabkan:
- Tiket dan riwayat keluhan tercecer serta tidak terdokumentasi dengan baik.
- Kurangnya transparansi status dan tidak ada kejelasan unit pelaksana teknis (UPT) yang bertanggung jawab.
- Lambatnya respons balik kepada pelanggan akibat ketiadaan notifikasi real-time terintegrasi.
- Kesulitan melihat dan memvalidasi berkas bukti foto/kerusakan yang diunggah pelapor.
- Hambatan dalam evaluasi target kecepatan layanan (*Service Level Agreement / SLA*).
- Pemborosan biaya lisensi perangkat lunak helpdesk proprietary pihak ketiga.

**POSO** dikembangkan sebagai sistem helpdesk dan manajemen tiket terpusat terintegrasi (*osTicket-inspired*) dengan biaya operasional minimal menggunakan ekosistem **Google Workspace (Google Apps Script, Google Drive, & Google Sheets)** sebagai backend basis data terstruktur, dipadukan dengan antarmuka web modern yang **100% responsif di perangkat mobile, tablet, dan desktop**, dilengkapi **galeri pratinjau foto/lampiran langsung** dan **sistem notifikasi interaktif dua arah (audio, desktop push, toast, dan floating widget)**.

---

## 2. Tujuan Proyek (Objectives)

1. **Satu Pintu Layanan (*Single Point of Entry*)**: Menyediakan portal publik terpadu yang dapat diakses dengan mudah dari peramban ponsel, tablet, maupun desktop.
2. **Triase & Distribusi Cepat Multi-UPT**: Memungkinkan operator helpdesk mendistribusikan laporan ke Unit Pelaksana Teknis terkait (*UPT TI & Jaringan, UPT Sarana & Prasarana, UPT Sistem Informasi, dll.*) secara instan.
3. **Penyimpanan Berkas Foto & Pratinjau Terpadu**: Mengunggah berkas lampiran foto secara langsung ke Google Drive instansi, mengekstrak tautan secara otomatis, dan menyajikan pratinjau gambar (*thumbnail & lightbox*) langsung di layar tanpa teks mentah yang berantakan.
4. **Sistem Notifikasi Real-time Pelanggan & Staf**: Menghadirkan notifikasi instan (<50ms) dengan suara denting Web Audio API, notifikasi desktop browser, lonceng notifikasi, dan floating chat badge saat ada balasan atau pembaruan status pengerjaan tiket.
5. **Efisiensi Anggaran Infrastruktur & Isolasi Akun**: Memanfaatkan Google Apps Script REST API tanpa biaya server bulanan, serta mendukung isolasi folder penyimpanan Google Drive resmi agar tidak bercampur dengan akun pribadi.
6. **Aksesibilitas & Responsivitas Mobile**: Memastikan staf teknisi di lapangan dan pelapor dapat membuat, memeriksa, dan memperbarui status tiket secara instan dari smartphone.

---

## 3. Manfaat Bisnis (Business Value)

| Area | Manfaat Nyata yang Dihasilkan |
|---|---|
| **Operasional** | Seluruh keluhan tercatat dengan nomor ID unik (`#TICK-YYYYMMDD-XXXX`), status transparan (*Open, In Progress, Waiting, Closed*), dan prioritas SLA terukur. |
| **Kepuasan Pelanggan** | Pelanggan (*Customer*) mendapatkan notifikasi instan saat teknisi merespons tiketnya melalui audio chime, browser notification, dan floating chat bubble. |
| **Pratinjau Bukti Foto** | Foto bukti kerusakan dari pelapor langsung muncul sebagai thumbnail gambar dan dapat diperbesar dengan Lightbox modal 1-klik di semua tampilan admin maupun pelapor. |
| **Aksesibilitas Mobile** | Staf teknisi UPT dapat memperbarui status tiket langsung saat berada di lokasi perbaikan melalui tampilan mobile drawer dan aksi 1-klik. |
| **Kolaborasi Staf** | Operator dan staf teknis UPT dapat menambahkan *Catatan Internal (Internal Notes)* yang hanya terlihat oleh staf, terpisah dari balasan publik ke pelapor. |
| **Penyimpanan Aset Terpusat** | Foto bukti kerusakan disimpan rapi di folder Google Drive instansi resmi dan dapat dikonfigurasi target foldernya secara dinamis. |
| **Penghematan Biaya** | Biaya infrastruktur 100% serverless memanfaatkan Google Workspace yang sudah ada tanpa biaya lisensi bulanan. |
| **Kemudahan Manajemen** | Super Administrator dapat mengelola akun staf, menetapkan unit penugasan UPT, dan memantau status sumber data Google Drive dari UI. |

---

## 4. Ruang Lingkup Sistem (Scope of System)

### 4.1 Modul yang Telah Selesai Diimplementasikan (In-Scope)
- **Portal Publik & Pelanggan**:
  - Beranda resmi institusional dengan filter kategori layanan interaktif dan alur SOP penanganan.
  - Formulir pembuatan tiket baru dengan **Live Ticket Preview Card** dan zona unggah berkas *Drag & Drop*.
  - Pelacak tiket mandiri (*Public Ticket Tracker*) dengan **Stepper Timeline 4 Tahap Visual**, galeri foto interaktif, audio chime, notifikasi desktop browser, banner respons real-time, dan kolom tanggapan pelanggan.
  - Halaman daftar tiket keluhan milik pengguna terdaftar (*My Tickets*) dengan filter tab status, **Lonceng Notifikasi (*Notification Bell*)**, dan **Floating Chat Badge** untuk memantau tanggapan teknisi.
  - Registrasi mandiri khusus peran Pengguna Umum (*Pelapor*).
- **Workstation Operator & UPT (Dashboard Triase)**:
  - Bilah samping (*Sage Sidebar*) responsif: *Desktop Mini-Rail* + *Mobile Slide Drawer*.
  - Papan Triase Multi-Kolom (*Interactive Kanban Board*) dengan tombol pill switcher kolom mobile dan aksi cepat 1-klik (*Proses*, *Selesai*).
  - Tampilan alternatif daftar tabel adaptif (*Adaptive Table View*) dengan mode *mobile card list* dan fitur pengurutan kolom.
  - Laci inspeksi detail bertab (*Ticket Drawer*) untuk *Diskusi & Balasan*, *Triase & Delegasi UPT*, serta *Info & SLA*.
  - Galeri berkas dan foto bukti kerusakan dengan pratinjau Lightbox dan tautan Google Drive langsung.
  - Pintasan keyboard cepat (`Ctrl+K` untuk pencarian dan `Esc` untuk menutup drawer).
  - Tombol aksi mengambang (*FAB*) untuk pembuatan tiket cepat.
- **Panel Admin**:
  - Manajemen Pengguna & Staf Teknis UPT (*User Management*).
  - Pengaturan & Pemantauan Sumber Data Google Drive / Spreadsheet (*DataSource Configuration*).
- **Backend & Database Serverless**:
  - REST API Google Apps Script dengan penanganan konkurensi cerdas (*Selective LockService*).
  - Penyimpanan file otomatis ke Google Drive target (`TARGET_CLIENT_FOLDER_ID`).
  - Pembersihan otomatis string base64 pada Google Sheets (`Ticket_Threads`).

---

## 5. Matriks Peran & Hak Akses (Role-Based Access Control)

| Peran (*Role*) | Deskripsi | Registrasi / Pembuatan Akun | Hak Akses Utama |
|---|---|---|---|
| **Pengguna Umum (Pelapor)** | Sivitas / publik yang mengajukan keluhan dan memantau tiket miliknya | **Registrasi Mandiri** pada portal publik | Membuat tiket, melacak tiket via nomor ID, melihat foto lampiran, menerima notifikasi suara/browser, dan membalas pesan pada tiket miliknya. |
| **Operator Helpdesk** | Garda depan penyaringan dan triase tiket | Dibuat oleh **Admin** | Melihat seluruh tiket, menentukan prioritas SLA, mendelegasikan tiket ke UPT, melihat foto bukti, menambah catatan internal, membalas publik. |
| **Teknisi UPT** | Petugas teknis unit pelaksana | Dibuat oleh **Admin** | Memproses tiket sesuai bidang unit teknisnya, memeriksa foto bukti kerusakan, memperbarui status pengerjaan, berdiskusi internal dengan operator. |
| **Super Admin** | Pengelola penuh sistem | Dibuat saat inisialisasi awal | Akses tak terbatas: kelola staf & UPT, konfigurasi Google Drive/Spreadsheet, dan log audit sistem. |
