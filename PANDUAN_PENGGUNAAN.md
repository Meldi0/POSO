# PANDUAN LENGKAP PENGGUNAAN APLIKASI "POSO" (v2.0)
## Sistem Helpdesk & Manajemen Pengaduan Terpadu Berbasis Google Workspace

---

## DAFTAR ISI
1. [Pengantar & Konsep Aplikasi](#1-pengantar--konsep-aplikasi)
2. [Akses Awal & Mode Pengoperasian](#2-akses-awal--mode-pengoperasian)
3. [Daftar Akun Pengujian Default](#3-daftar-akun-pengujian-default)
4. [Panduan untuk Pengguna Umum (Pelapor / Public User)](#4-panduan-untuk-pengguna-umum-pelapor--public-user)
   - 4.1 Beranda Publik & Katalog Layanan
   - 4.2 Mengajukan Tiket Baru & Pratinjau Real-Time (*Live Preview*)
   - 4.3 Melacak Progres Tiket dengan Stepper Timeline Visual & Chat Interaktif
   - 4.4 Mengelola Riwayat Tiket Pribadi (Portal Pengguna Terdaftar)
5. [Panduan untuk Operator Helpdesk (Garda Terdepan)](#5-panduan-untuk-operator-helpdesk-garda-terdepan)
   - 5.1 Navigasi Workstation & Drawer Responsif
   - 5.2 Triase Tiket via Papan Kanban & Tampilan Tabel Adaptif
   - 5.3 Menggunakan Laci Detail Tiket Bertab (*Multi-Tab Drawer*)
   - 5.4 Berkomunikasi: Balasan Publik vs Catatan Internal Privat (🔒)
   - 5.5 Pusat Notifikasi Realtime & Floating Chat Widget (Ala WhatsApp/Telegram)
   - 5.6 Pintasan Keyboard Cepat (*Keyboard Shortcuts*)
6. [Panduan untuk Tim UPT (Unit Pelaksana Teknis)](#6-panduan-untuk-tim-upt-unit-pelaksana-teknis)
   - 6.1 Melihat Tiket yang Didelegasikan
   - 6.2 Memperbarui Progres Pengerjaan & Menutup Tiket Selesai
7. [Panduan untuk Administrator (Super Admin)](#7-panduan-untuk-administrator-super-admin)
   - 7.1 Manajemen Staf, Operator, dan Delegasi UPT
   - 7.2 Konfigurasi Sumber Data Google Drive & Spreadsheet
8. [Tanya Jawab & Tips Praktis (FAQ)](#8-tanya-jawab--tips-praktis-faq)

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
- Seluruh data tersimpan secara mandiri di penyimpanan peramban (*sessionStorage & localStorage*).
- Sangat praktis untuk demo, simulasi alur kerja, dan pengujian fitur.

### B. Mode Produksi Terhubung (Aiven for MySQL Live)
- Frontend terhubung langsung dengan backend Node.js / Express API dan cluster cloud database **Aiven for MySQL** (SSL Mode: REQUIRED).
- Seluruh data tiket, percakapan, pengguna, hak akses RBAC, serta audit log tercatat secara real-time di tabel relasional database `defaultdb`.

---

## 3. DAFTAR AKUN PENGUJIAN DEFAULT

Berikut adalah kredensial akun bawaan untuk pengujian:

1. **Administrator Sistem**
   - Email: `admin@poso.local`
   - Password: `Admin123!`
   - Hak Akses: Akses penuh dashboard, manajemen pengguna, dan integrasi Google Sheets.

2. **Operator Helpdesk**
   - Email: `operator@poso.local`
   - Password: `Operator123!`
   - Hak Akses: Triase tiket, routing UPT, obrolan dua arah, dan SLA monitoring.

3. **Staf UPT TI & Jaringan**
   - Email: `upt.ti@poso.local`
   - Password: `Poso123!`
   - Hak Akses: Menangani tiket kategori TI, Jaringan, dan Sistem Informasi.

4. **Staf UPT Sarana & Prasarana**
   - Email: `upt.sarpras@poso.local`
   - Password: `Poso123!`
   - Hak Akses: Menangani tiket sarana, fasilitas gedung, dan kelistrikan.

5. **Akun Pelapor (Pengguna Umum)**
   - Email: `dewi@gmail.com`
   - Password: `User123!`
   - Hak Akses: Pengajuan laporan tiket, riwayat pengaduan mandiri, dan obrolan pelapor.

---

## 4. PANDUAN UNTUK PENGGUNA UMUM (PELAPOR / PUBLIC USER)

### 4.1 Beranda Publik & Katalog Layanan
1. Buka halaman utama aplikasi POSO (`/`).
2. Terdapat ringkasan metrik performa layanan dan filter kategori bidang bantuan:
   - **Jaringan & Internet**: Masalah Wi-Fi, kabel LAN, VPN.
   - **Sistem Informasi & Aplikasi**: Kendala portal akademik, presensi online, akun dinas.
   - **Sarana & Prasarana**: AC ruangan, proyektor, kelistrikan gedung.
   - **Hardware & Komputer**: Perbaikan PC lab, toner printer, scanner.
   - **Layanan Akun & Portal**: Reset kata sandi terkunci, aktivasi SSO.
   - **Layanan Umum & Konsultasi**: Konsultasi teknis dan peminjaman perangkat.
3. Klik tombol **[Pilih Bidang Ini]** pada salah satu kategori untuk langsung membuka formulir laporan dengan panduan terkait.

### 4.2 Mengajukan Tiket Baru & Pratinjau Real-Time (*Live Preview*)
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

### 4.3 Melacak Progres Tiket dengan Stepper Timeline Visual & Chat Interaktif
1. Buka menu **[Lacak Tiket]** (`/track`).
2. Masukkan nomor ID Tiket Anda, lalu klik **[Lacak Status Tiket]**.
3. Sistem akan menampilkan detail laporan lengkap dengan **Stepper Timeline 4 Tahap**:
   - 🟢 **Langkah 1: Laporan Masuk** (Tercatat di sistem)
   - 🟡 **Langkah 2: Triase & Disposisi** (Diverifikasi oleh operator helpdesk)
   - 🟣 **Langkah 3: Pengerjaan UPT** (Teknisi sedang melakukan perbaikan)
   - 🔵 **Langkah 4: Selesai** (Kendala tuntas diselesaikan)
4. **Obrolan Interaktif**: Pelapor dapat mengetik balasan langsung di kotak chat bawah. Pesan tampil dengan identitas **`Tanggapan Pelapor (Nama)`** dan ikon User abu-abu.

### 4.4 Mengelola Riwayat Tiket Pribadi (Portal Pengguna Terdaftar)
1. Jika Anda memiliki akun, masuk melalui halaman **[Masuk]** (`/login`).
2. Buka menu **[Tiket Saya]** (`/my-tickets`) untuk melihat seluruh daftar pengaduan yang pernah Anda ajukan.
3. Gunakan filter tab status (*Semua, Open, In Progress, Waiting, Closed*) atau kolom pencarian untuk menemukan tiket lama dengan cepat.

---

## 5. PANDUAN UNTUK OPERATOR HELPDESK (GARDA TERDEPAN)

### 5.1 Navigasi Workstation & Drawer Responsif
- **Di Layar Komputer / Laptop**: Sidebar di sisi kiri bersifat permanen dan dilengkapi tombol *collapse / expand* (ikon panah) untuk memperkecil bilah menu menjadi mode ikon ramping saat Anda membutuhkan ruang kerja yang lebih luas.
- **Di Layar Ponsel / Smartphone**: Menu navigasi tersembunyi rapi dan dapat dibuka kapan saja melalui tombol **Hamburger (☰)** di bagian atas.

### 5.2 Triase Tiket via Papan Kanban & Tampilan Tabel Adaptif
1. Masuk ke halaman **Dashboard Workstation** (`/dashboard`).
2. Anda dapat beralih antara dua mode tampilan utama:
   - **Mode Papan (Kanban Board)**: Membagi tiket ke dalam 3 kolom aktif (*Tiket Masuk/Open*, *Sedang Dikerjakan UPT/In Progress*, dan *Menunggu Respon/Waiting*).
     - *Di Ponsel*: Gunakan tombol pill di bagian atas (*Open, Dikerjakan, Waiting*) untuk berpindah kolom seketika.
     - *Aksi Cepat 1-Klik*: Klik tombol **[Proses]** atau **[Selesai]** langsung pada kartu tiket untuk memindahkan status secara instan.
   - **Mode Tabel (Table View)**: Menampilkan data dalam bentuk baris tabel di layar desktop dan kartu ringkas di layar ponsel. Anda dapat mengurutkan data berdasarkan ID, Prioritas, Tanggal Masuk, atau Status dengan mengklik judul kolom.

### 5.3 Menggunakan Laci Detail Tiket Bertab (*Multi-Tab Drawer*)
Klik pada salah satu kartu tiket untuk membuka panel detail di sisi kanan layar. Panel ini memiliki 3 tab terorganisir:
1. 💬 **Tab Diskusi**: Menampilkan kronologi pesan lengkap dengan galeri lampiran foto yang dapat di-zoom.
2. ⚙️ **Tab Triase & UPT**: Tempat operator mengubah status tiket dan memilih unit teknisi UPT penanggung jawab (*UPT TI, UPT Sarpras, dll.*).
3. 📋 **Tab Info & SLA**: Memuat email pelapor, tanggal pembuatan, target batas waktu SLA, dan panduan standar pelayanan institusi.

### 5.4 Berkomunikasi: Balasan Publik vs Catatan Internal Privat (🔒)
Pada tab **Diskusi**:
- **Balasan Publik**: Centang kotak tidak diaktifkan. Pesan yang Anda kirim akan dapat dibaca langsung oleh pelapor di halaman pelacak tiket miliknya.
- **Catatan Internal (🔒)**: Centang pilihan **"🔒 Catatan Internal (Hanya Staf)"**. Kotak input akan berubah menjadi warna kuning amber. Pesan ini **hanya dapat dibaca oleh sesama staf operator dan teknisi UPT** (rahasia/koordinasi teknis internal).

### 5.5 Pusat Notifikasi Realtime & Floating Chat Widget (Ala WhatsApp/Telegram)
- **Lonceng Notifikasi di Navbar**: Menampilkan jumlah pesan baru belum dibaca beserta nama pengirim dan ID tiket.
- **Floating Chat Widget (Kanan Bawah)**: Muncul otomatis saat ada pesan baru dari Pelapor, dilengkapi preview isi chat dan lencana angka merah. Mengklik widget ini akan langsung membuka drawer obrolan tiket yang bersangkutan.
- **Nada Dering Chime**: Membunyikan nada dering saat ada tiket baru masuk atau tanggapan baru dari pelapor.

### 5.6 Pintasan Keyboard Cepat (*Keyboard Shortcuts*)
- **`Ctrl + K`** (atau `Cmd + K` di Mac): Langsung memfokuskan kursor ke kotak pencarian tiket.
- **`Escape (Esc)`**: Menutup drawer detail tiket atau menu drawer samping yang sedang aktif.

---

## 6. PANDUAN UNTUK TIM UPT (UNIT PELAKSANA TEKNIS)

1. Masuk menggunakan akun teknisi UPT (misal: `upt.ti@poso.local` atau `upt.sarpras@poso.local`).
2. Pada papan triase, perhatikan tiket-tiket yang memiliki badge nama unit Anda.
3. Buka detail tiket, baca laporan kerusakan, dan lakukan pengecekan fisik/sistem.
4. Tuliskan pembaruan penanganan di kolom balasan atau buat catatan internal teknis jika memerlukan koordinasi dengan logistik suku cadang.
5. Setelah perbaikan selesai, ubah status tiket menjadi **Closed (Selesai)** melalui formulir triase atau klik tombol **[Selesai]** pada kartu tiket.

---

## 7. PANDUAN UNTUK ADMINISTRATOR (SUPER ADMIN)

### 7.1 Manajemen Staf, Operator, dan Delegasi UPT
1. Buka menu **[Kelola Staf & UPT]** di sidebar kiri dashboard.
2. Anda dapat:
   - Menambahkan akun staf baru dengan menentukan perannya (*Operator, UPT TI, UPT Sarpras, Admin*).
   - Mengaktifkan atau menonaktifkan akun staf dengan tombol saklar (*toggle switch*).
   - Mereset kata sandi akun staf jika diperlukan.

### 7.2 Konfigurasi Sumber Data Google Drive & Spreadsheet
1. Buka menu **[Sumber Data Drive]** di sidebar kiri.
2. Pantau status integrasi backend Google Apps Script, kuota kapasitas Google Drive, dan latensi sinkronisasi basis data master Google Sheets.

---

## 8. TANYA JAWAB & TIPS PRAKTIS (FAQ)

**Q: Mengapa tiket saya berkedip merah dengan tanda "Over SLA"?**  
A: Tanda *Over SLA* menandakan bahwa tiket tersebut telah melewati target waktu penanganan standar dan membutuhkan perhatian prioritas dari operator helpdesk.

**Q: Bagaimana cara menyalin tautan pelacakan tiket untuk dibagikan ke pelapor?**  
A: Buka detail tiket di drawer staf, lalu klik ikon **External Link (↗)** di sudut kanan atas header drawer. Tautan pelacakan publik akan otomatis disalin ke clipboard Anda.

**Q: Apakah membuka tab Admin dan tab Pelapor di browser yang sama akan saling bertukar?**  
A: Tidak. POSO v2.0 menggunakan arsitektur *sessionStorage per-tab*, sehingga sesi Tab Admin dan Tab Pelapor tetap terisolasi mandiri meskipun Anda me-refresh halaman dengan `Ctrl + R` atau `Ctrl + F5`.
