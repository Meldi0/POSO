# Business Requirements Document (BRD)
## Aplikasi: POSO — Sistem Helpdesk & Manajemen Tiket Terpadu

**Versi:** 2.0 (Updated & Aligned with Production Implementation)  
**Status:** Implemented & Production Ready  
**Tipe Dokumen:** Business Requirements Document (BRD)  

---

## 1. Latar Belakang (Background)

Penanganan keluhan dan permohonan layanan teknis pada instansi sering kali tersebar di berbagai saluran tidak resmi (chat pribadi, pesan instan, email terpisah, atau panggilan telepon). Kondisi ini menyebabkan:
- Tiket dan riwayat keluhan tercecer serta tidak terdokumentasi dengan baik.
- Kurangnya transparansi status dan tidak ada kejelasan unit pelaksana teknis (UPT) yang bertanggung jawab.
- Hambatan dalam evaluasi target kecepatan layanan (*Service Level Agreement / SLA*).
- Pemborosan biaya lisensi perangkat lunak helpdesk proprietary pihak ketiga.

**POSO** dikembangkan sebagai sistem helpdesk dan manajemen tiket terpusat terintegrasi (*osTicket-inspired*) dengan biaya operasional minimal menggunakan ekosistem **Google Workspace (Google Apps Script, Google Drive, & Google Sheets)** sebagai backend basis data terstruktur, dipadukan dengan antarmuka web modern bernuansa *Sage Green & Soft Cream*.

---

## 2. Tujuan Proyek (Objectives)

1. **Satu Pintu Layanan (*Single Point of Entry*)**: Menyediakan portal publik terpadu untuk pengajuan dan pemantauan status tiket oleh pengguna umum dan sivitas instansi.
2. **Triase & Distribusi Cepat Multi-UPT**: Memungkinkan operator helpdesk mendistribusikan laporan ke Unit Pelaksana Teknis terkait (*UPT TI & Jaringan, UPT Sarana & Prasarana, UPT Sistem Informasi, dll.*) secara instan.
3. **Penyimpanan Berkas Foto Terintegrasi**: Mengunggah berkas lampiran foto secara langsung ke Google Drive instansi dan menyajikan tautan serta pratinjau gambar (*lightbox*) secara rapi tanpa mengotori sel basis data.
4. **Efisiensi Anggaran Infrastruktur**: Memanfaatkan Google Apps Script REST API tanpa memerlukan biaya server atau database berbayar bulanan.
5. **Kendali Penuh Tanpa Koding**: Menyediakan panel admin untuk manajemen staf teknis, pengaturan peran, serta pergantian sumber folder Google Drive secara langsung dari antarmuka web.

---

## 3. Manfaat Bisnis (Business Value)

| Area | Manfaat Nyata yang Dihasilkan |
|---|---|
| **Operasional** | Seluruh keluhan tercatat dengan nomor ID unik (`#TICK-YYYYMMDD-XXXX`), status transparan (*Open, In Progress, Waiting, Closed*), dan prioritas SLA terukur. |
| **Kolaborasi Staf** | Operator dan staf teknis UPT dapat menambahkan *Catatan Internal (Internal Notes)* yang hanya terlihat oleh staf, terpisah dari balasan publik ke pelapor. |
| **Penyimpanan Aset** | Foto bukti kerusakan disimpan rapi di folder Google Drive instansi dan langsung dapat dilihat dengan pratinjau thumbnail/lightbox. |
| **Penghematan Biaya** | Biaya infrastruktur 100% serverless memanfaatkan Google Workspace yang sudah ada. |
| **Kemudahan Manajemen** | Super Administrator dapat mengelola akun staf, menetapkan unit penugasan UPT, dan memantau status sumber data Google Drive dari UI. |

---

## 4. Ruang Lingkup Sistem (Scope of System)

### 4.1 Modul yang Telah Selesai Diimplementasikan (In-Scope)
- **Portal Publik**:
  - Beranda resmi institusional dengan katalog layanan dan alur SOP penanganan.
  - Formulir pembuatan tiket baru dengan dukungan pengunggahan gambar/foto pendukung.
  - Pelacak tiket mandiri (*Public Ticket Tracker*) dengan thumbnail gambar asli, modal perbesaran foto (*lightbox*), dan kolom tanggapan pelanggan.
  - Halaman daftar tiket keluhan milik pengguna terdaftar (*My Tickets*).
  - Registrasi mandiri khusus peran Pengguna Umum (*Pelapor*).
- **Workstation Operator & UPT (Dashboard Triase)**:
  - Bilah samping (*Sage Sidebar*) *sticky* yang tetap terkunci di tempat saat halaman digulir.
  - Papan Triase Multi-Kolom (*Interactive Kanban Board*) 4 status (*Open, In Progress, Waiting, Closed*).
  - Tombol aksi 1-klik pada kartu tiket untuk langsung memproses (*Proses*) atau menyelesaikan (*Selesai*).
  - Menu titik tiga (`...`) pada setiap kolom untuk pengurutan prioritas/waktu, penyalinan ringkasan, dan penyelesaian massal.
  - Tampilan alternatif daftar tabel (*Table View*) dengan filter pencarian dan kategori instan.
  - Laci inspeksi geser (*Ticket Drawer*) untuk pembaruan status, delegasi unit UPT, dan percakapan balasan.
  - Tombol aksi mengambang (*Coral Floating Action Button - FAB*) untuk pembuatan tiket cepat.
- **Panel Admin**:
  - Manajemen Pengguna & Staf Teknis UPT (*User Management*).
  - Pengaturan & Pemantauan Sumber Data Google Drive / Spreadsheet (*DataSource Configuration*).
- **Backend & Database Serverless**:
  - REST API Google Apps Script dengan penanganan konkurensi cerdas (*Selective LockService*).
  - Penyimpanan file otomatis ke Google Drive target (`1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR`).
  - Pembersihan otomatis string base64 pada Google Sheets (`Ticket_Threads`).

---

## 5. Matriks Peran & Hak Akses (Role-Based Access Control)

| Peran (*Role*) | Deskripsi | Registrasi / Pembuatan Akun | Hak Akses Utama |
|---|---|---|---|
| **Pengguna Umum (Pelapor)** | Sivitas / publik yang mengajukan keluhan dan memantau tiket miliknya | **Registrasi Mandiri** pada portal publik | Membuat tiket, melacak tiket via nomor ID, membalas pesan pada tiket miliknya. |
| **Operator Helpdesk** | Garda depan penyaringan dan triase tiket | Dibuat oleh **Admin** | Melihat seluruh tiket, menentukan prioritas SLA, mendelegasikan tiket ke UPT, menambah catatan internal. |
| **Teknisi UPT** | Petugas teknis unit pelaksana | Dibuat oleh **Admin** | Memproses tiket sesuai bidang unit teknisnya, memperbarui status pengerjaan, berdiskusi internal dengan operator. |
| **Super Admin** | Pengelola penuh sistem | Dibuat saat inisialisasi awal | Akses tak terbatas: kelola staf & UPT, konfigurasi Google Drive, dan log audit sistem. |

---

## 6. Kebutuhan Bisnis Terverifikasi (Verified Business Rules)

- **BR-01 (Keamanan Registrasi)**: Form registrasi publik secara ketat hanya dapat mendaftarkan akun dengan peran `pengguna_umum`. Akun operator, teknisi UPT, dan admin hanya bisa dibuat melalui modul admin.
- **BR-02 (Integritas Penyimpanan Data)**: Seluruh berkas foto atau dokumen pendukung tidak boleh disimpan sebagai teks mentah berukuran besar di dalam sel spreadsheet, melainkan diunggah ke Google Drive dan dirujuk via URL resmi.
- **BR-03 (Pemisahan Percakapan Internal vs Publik)**: Pesan dengan visibilitas `internal` (Catatan Staf) dilarang keras tampil pada antarmuka pelacak tiket publik pengguna umum.
- **BR-04 (Responsivitas Layanan / SLA)**: Tiket kategori *Urgent* diberi batas penanganan 4 Jam, *High* 8 Jam, dan *Medium/Low* 24 Jam dengan penanda visual khusus pada kartu triase.
- **BR-05 (Desain Visual & Ergonomi)**: Antarmuka menggunakan tema *Sage Green & Soft Cream* dengan ikon vektor profesional (bebas emoji generik) serta tata letak *edge-to-edge full width*.

---

## 7. Kriteria Keberhasilan & Status Implementasi

- [x] Portal publik ramah pengguna dan bebas dari kesan generik AI.
- [x] Foto lampiran terkonversi menjadi file Google Drive dan tampil sebagai thumbnail pratinjau asli di UI.
- [x] Papan Kanban triase interaktif dengan filter kategori, pencarian cepat, tombol titik tiga, dan pemindahan status 1-klik.
- [x] Backend Google Apps Script stabil dengan nol timeout saat pembacaan data bersamaan.
- [x] Spreadsheet master tetap bersih dan terformat rapi sesuai standar data enterprise.
