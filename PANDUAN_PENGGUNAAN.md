# PANDUAN LENGKAP PENGGUNAAN APLIKASI "POSO" (v2.0)
## Sistem Helpdesk & Manajemen Pengaduan Terpadu Berbasis Google Workspace

---

## DAFTAR ISI
1. [Pengantar & Konsep Aplikasi](#1-pengantar--konsep-aplikasi)
2. [Akses Awal & Mode Pengoperasian](#2-akses-awal--mode-pengoperasian)
3. [Panduan untuk Pengguna Umum (Pelapor / Public User)](#3-panduan-untuk-pengguna-umum-pelapor--public-user)
   - 3.1 Beranda Publik & Katalog Layanan
   - 3.2 Mengajukan Tiket Baru & Pratinjau Real-Time (*Live Preview*)
   - 3.3 Melacak Progres Tiket dengan Stepper Timeline Visual
   - 3.4 Mengelola Riwayat Tiket Pribadi (Portal Pengguna Terdaftar)
4. [Panduan untuk Operator Helpdesk (Garda Terdepan)](#4-panduan-untuk-operator-helpdesk-garda-terdepan)
   - 4.1 Navigasi Workstation & Drawer Responsif
   - 4.2 Triase Tiket via Papan Kanban & Tampilan Tabel Adaptif
   - 4.3 Menggunakan Laci Detail Tiket Bertab (*Multi-Tab Drawer*)
   - 4.4 Berkomunikasi: Balasan Publik vs Catatan Internal Privat (🔒)
   - 4.5 Pintasan Keyboard Cepat (*Keyboard Shortcuts*)
5. [Panduan untuk Tim UPT (Unit Pelaksana Teknis)](#5-panduan-untuk-tim-upt-unit-pelaksana-teknis)
   - 5.1 Melihat Tiket yang Didelegasikan
   - 5.2 Memperbarui Progres Pengerjaan & Menutup Tiket Selesai
6. [Panduan untuk Administrator (Super Admin)](#6-panduan-untuk-administrator-super-admin)
   - 6.1 Manajemen Staf, Operator, dan Delegasi UPT
   - 6.2 Konfigurasi Sumber Data Google Drive & Spreadsheet
7. [Tanya Jawab & Tips Praktis (FAQ)](#7-tanya-jawab--tips-praktis-faq)

---

## 1. PENGANTAR & KONSEP APLIKASI

**POSO Helpdesk** adalah sistem layanan terpadu yang dirancang untuk mengelola seluruh siklus hidup laporan keluhan, permohonan fasilitas, gangguan jaringan, dan dukungan sistem informasi kampus/institusi. 

Aplikasi ini menggunakan teknologi modern berbasis web yang **100% responsif di perangkat ponsel, tablet, maupun komputer desktop**, sehingga pelapor maupun staf teknis dapat mengoperasikan sistem dari mana saja dengan mudah.

### 4 Peran Pengguna (*Role*):
1. **Pengguna Umum (Pelapor):** Mengajukan keluhan, melihat status penyelesaian, dan membalas pesan teknisi.
2. **Operator Helpdesk:** Melakukan verifikasi awal (triase), menilai batas waktu SLA, dan mendelegasikan tiket ke unit UPT terkait.
3. **Teknisi UPT (Unit Pelaksana Teknis):** Mengeksekusi penanganan teknis sesuai bidang (*TI & Jaringan, Sarana Prasarana, Sistem Informasi, dll.*).
4. **Super Administrator:** Mengelola akun staf, otorisasi peran pengguna, dan memantau konektivitas basis data master.

---

## 2. AKSES AWAL & MODE PENGOPERASIAN

Aplikasi POSO dapat beroperasi dalam dua mode:

### A. Mode Pengujian Lokal / Offline Mock
- Aktif secara otomatis saat aplikasi dijalankan secara lokal tanpa konfigurasi backend.
- Seluruh data tersimpan secara mandiri di penyimpanan lokal peramban (*LocalStorage*).
- Sangat praktis untuk demo, simulasi alur kerja, dan pengujian fitur.

### B. Mode Produksi Terhubung (Google Apps Script Live)
- Frontend terhubung langsung dengan endpoint Web App Google Apps Script (`.env` -> `VITE_GAS_API_URL`).
- Berkas foto/dokumen otomatis terunggah ke folder Google Drive resmi, dan rekaman data tercatat rapi di Google Sheets Master Database.

---

## 3. PANDUAN UNTUK PENGGUNA UMUM (PELAPOR / PUBLIC USER)

### 3.1 Beranda Publik & Katalog Layanan
1. Buka halaman utama aplikasi POSO (`/`).
2. Terdapat ringkasan metrik performa layanan dan filter kategori bidang bantuan:
   - **Jaringan & Internet**: Masalah Wi-Fi, kabel LAN, VPN.
   - **Sistem Informasi & Aplikasi**: Kendala portal akademik, presensi online, akun dinas.
   - **Sarana & Prasarana**: AC ruangan, proyektor, kelistrikan gedung.
   - **Hardware & Komputer**: Perbaikan PC lab, toner printer, scanner.
   - **Layanan Akun & Portal**: Reset kata sandi terkunci, aktivasi SSO.
   - **Layanan Umum & Konsultasi**: Konsultasi teknis dan peminjaman perangkat.
3. Klik tombol **[Pilih Bidang Ini]** pada salah satu kategori untuk langsung membuka formulir laporan dengan panduan terkait.

### 3.2 Mengajukan Tiket Baru & Pratinjau Real-Time (*Live Preview*)
1. Buka menu **[Ajukan Tiket Baru]** (`/submit`).
2. Isi kolom formulir:
   - **Nama Lengkap & Email Aktif**: Untuk identitas pelapor dan notifikasi penanganan.
   - **Kategori Layanan**: Pilih bidang kendala yang sesuai.
   - **Tingkat Urgensi / Prioritas**: Pilih *Low, Medium, High*, atau *Urgent*.
   - **Subjek & Deskripsi Kendala**: Jelaskan lokasi ruangan, gedung, dan rincian masalah.
   - **Lampiran Foto / Dokumen**: Seret (*drag & drop*) berkas foto bukti kendala atau klik kotak unggah. Thumbnail foto akan langsung tampil.
3. **Pratinjau Real-Time (Live Preview Card)**: Di sisi kanan layar (atau di bawah form pada ponsel), Anda dapat melihat tampilan kartu tiket Anda secara langsung saat Anda mengetik.
4. Klik **[Kirim Laporan Tiket]**.
5. Setelah terkirim, modal konfirmasi akan menampilkan **Nomor ID Tiket** Anda (contoh: `#TICK-20260901-1001`). Klik tombol **[Salin ID]** untuk menyimpannya.

### 3.3 Melacak Progres Tiket dengan Stepper Timeline Visual
1. Buka menu **[Lacak Tiket]** (`/track`).
2. Masukkan nomor ID Tiket Anda, lalu klik **[Lacak Status Tiket]**.
3. Sistem akan menampilkan detail laporan lengkap dengan **Stepper Timeline 4 Tahap**:
   - 🟢 **Langkah 1: Laporan Masuk** (Tercatat di sistem)
   - 🟡 **Langkah 2: Triase & Disposisi** (Diverifikasi oleh operator helpdesk)
   - 🟣 **Langkah 3: Pengerjaan UPT** (Teknisi sedang melakukan perbaikan)
   - 🔵 **Langkah 4: Selesai** (Kendala tuntas diselesaikan)
4. Anda dapat membaca riwayat balasan teknisi dan mengirimkan pesan tanggapan langsung melalui kotak input pesan di bagian bawah.

### 3.4 Mengelola Riwayat Tiket Pribadi (Portal Pengguna Terdaftar)
1. Jika Anda memiliki akun, masuk melalui halaman **[Masuk]** (`/login`).
2. Buka menu **[Tiket Saya]** (`/my-tickets`) untuk melihat seluruh daftar pengaduan yang pernah Anda ajukan.
3. Gunakan filter tab status (*Semua, Open, In Progress, Waiting, Closed*) atau kolom pencarian untuk menemukan tiket lama dengan cepat.

---

## 4. PANDUAN UNTUK OPERATOR HELPDESK (GARDA TERDEPAN)

### 4.1 Navigasi Workstation & Drawer Responsif
- **Di Layar Komputer / Laptop**: Sidebar di sisi kiri bersifat permanen dan dilengkapi tombol *collapse / expand* (ikon panah) untuk memperkecil bilah menu menjadi mode ikon ramping saat Anda membutuhkan ruang kerja yang lebih luas.
- **Di Layar Ponsel / Smartphone**: Menu navigasi tersembunyi rapi dan dapat dibuka kapan saja melalui tombol **Hamburger (☰)** di bagian atas.

### 4.2 Triase Tiket via Papan Kanban & Tampilan Tabel Adaptif
1. Masuk ke halaman **Dashboard Workstation** (`/dashboard`).
2. Anda dapat beralih antara dua mode tampilan utama:
   - **Mode Papan (Kanban Board)**: Membagi tiket ke dalam 3 kolom aktif (*Tiket Masuk/Open*, *Sedang Dikerjakan UPT/In Progress*, dan *Menunggu Respon/Waiting*).
     - *Di Ponsel*: Gunakan tombol pill di bagian atas (*Open, Dikerjakan, Waiting*) untuk berpindah kolom seketika.
     - *Aksi Cepat 1-Klik*: Klik tombol **[Proses]** atau **[Selesai]** langsung pada kartu tiket untuk memindahkan status secara instan.
   - **Mode Tabel (Table View)**: Menampilkan data dalam bentuk baris tabel di layar desktop dan kartu ringkas di layar ponsel. Anda dapat mengurutkan data berdasarkan ID, Prioritas, Tanggal Masuk, atau Status dengan mengklik judul kolom.

### 4.3 Menggunakan Laci Detail Tiket Bertab (*Multi-Tab Drawer*)
Klik pada salah satu kartu tiket untuk membuka panel detail di sisi kanan layar. Panel ini memiliki 3 tab terorganisir:
1. 💬 **Tab Diskusi**: Menampilkan kronologi pesan lengkap dengan galeri lampiran foto yang dapat di-zoom.
2. ⚙️ **Tab Triase & UPT**: Tempat operator mengubah status tiket dan memilih unit teknisi UPT penanggung jawab (*UPT TI, UPT Sarpras, dll.*).
3. 📋 **Tab Info & SLA**: Memuat email pelapor, tanggal pembuatan, target batas waktu SLA, dan panduan standar pelayanan institusi.

### 4.4 Berkomunikasi: Balasan Publik vs Catatan Internal Privat (🔒)
Pada tab **Diskusi**:
- **Balasan Publik**: Centang kotak tidak diaktifkan. Pesan yang Anda kirim akan dapat dibaca langsung oleh pelapor di halaman pelacak tiket miliknya.
- **Catatan Internal (🔒)**: Centang pilihan **"🔒 Catatan Internal (Hanya Staf)"**. Kotak input akan berubah menjadi warna kuning amber. Pesan ini **hanya dapat dibaca oleh sesama staf operator dan teknisi UPT** (rahasia/koordinasi teknis internal).

### 4.5 Pintasan Keyboard Cepat (*Keyboard Shortcuts*)
- **`Ctrl + K`** (atau `Cmd + K` di Mac): Langsung memfokuskan kursor ke kotak pencarian tiket.
- **`Escape (Esc)`**: Menutup drawer detail tiket atau menu drawer samping yang sedang aktif.

---

## 5. PANDUAN UNTUK TIM UPT (UNIT PELAKSANA TEKNIS)

1. Masuk menggunakan akun teknisi UPT (misal: `upt.ti@poso.local` atau `upt.sarpras@poso.local`).
2. Pada papan triase, perhatikan tiket-tiket yang memiliki badge nama unit Anda.
3. Buka detail tiket, baca laporan kerusakan, dan lakukan pengecekan fisik/sistem.
4. Tuliskan pembaruan penanganan di kolom balasan atau buat catatan internal teknis jika memerlukan koordinasi dengan logistik suku cadang.
5. Setelah perbaikan selesai, ubah status tiket menjadi **Closed (Selesai)** melalui formulir triase atau klik tombol **[Selesai]** pada kartu tiket.

---

## 6. PANDUAN UNTUK ADMINISTRATOR (SUPER ADMIN)

### 6.1 Manajemen Staf, Operator, dan Delegasi UPT
1. Buka menu **[Kelola Staf & UPT]** di sidebar kiri dashboard.
2. Anda dapat:
   - Menambahkan akun staf baru dengan menentukan perannya (*Operator, UPT TI, UPT Sarpras, Admin*).
   - Mengaktifkan atau menonaktifkan akun staf dengan tombol saklar (*toggle switch*).
   - Mereset kata sandi akun staf jika diperlukan.

### 6.2 Konfigurasi Sumber Data Google Drive & Spreadsheet
1. Buka menu **[Sumber Data Drive]** di sidebar kiri.
2. Pantau status integrasi backend Google Apps Script, kuota kapasitas Google Drive, dan latensi sinkronisasi basis data master Google Sheets.

---

## 7. TANYA JAWAB & TIPS PRAKTIS (FAQ)

**Q: Mengapa tiket saya berkedip merah dengan tanda "Over SLA"?**  
A: Tanda *Over SLA* menandakan bahwa tiket tersebut telah melewati target waktu penanganan standar dan membutuhkan perhatian prioritas dari operator helpdesk.

**Q: Bagaimana cara menyalin tautan pelacakan tiket untuk dibagikan ke pelapor?**  
A: Buka detail tiket di drawer staf, lalu klik ikon **External Link (↗)** di sudut kanan atas header drawer. Tautan pelacakan publik akan otomatis disalin ke clipboard Anda.

**Q: Apakah aplikasi dapat digunakan dengan lancar di layar handphone yang kecil?**  
A: Ya, seluruh tata letak POSO v2.0 telah dioptimalkan secara mobile-first dengan drawer menu geser, tab switcher kolom, dan tombol aksi yang nyaman disentuh di smartphone.
