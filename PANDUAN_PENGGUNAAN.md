# PANDUAN LENGKAP PENGGUNAAN APLIKASI "POSO"
## Sistem Helpdesk & Manajemen Tiket Multi-Channel Berbasis Google Workspace

---

## DAFTAR ISI
1. [Pengantar & Konsep Aplikasi](#1-pengantar--konsep-aplikasi)
2. [Akses Awal & Mode Pengoperasian (Live vs Simulasi)](#2-akses-awal--mode-pengoperasian-live-vs-simulasi)
3. [Panduan untuk Pengguna Umum (Pelapor / Public User)](#3-panduan-untuk-pengguna-umum-pelapor--public-user)
   - 3.1 Registrasi Mandiri Akun Baru
   - 3.2 Masuk (Login)
   - 3.3 Mengajukan Tiket Keluhan / Permintaan Baru
   - 3.4 Memantau Status & Mengirim Balasan
4. [Panduan untuk Operator Helpdesk (Garda Terdepan)](#4-panduan-untuk-operator-helpdesk-garda-terdepan)
   - 4.1 Menavigasi Dashboard Triase
   - 4.2 Mengklasifikasi & Merouting Tiket ke UPT
   - 4.3 Mengubah Status & Tingkat Prioritas (SLA)
   - 4.4 Berkomunikasi: Balasan Publik vs Catatan Internal 🔒
5. [Panduan untuk Pengguna UPT (Unit Pelaksana Teknis)](#5-panduan-untuk-pengguna-upt-unit-pelaksana-teknis)
   - 5.1 Membuka Workstation Unit UPT
   - 5.2 Menjalankan & Memperbarui Progres Tiket
   - 5.3 Berkoordinasi via Catatan Internal Privat
   - 5.4 Menyelesaikan Tiket
6. [Panduan untuk Administrator (Super Access)](#6-panduan-untuk-administrator-super-access)
   - 6.1 Manajemen Pengguna & Peran (Role Switcher Instan)
   - 6.2 Menambah Akun Staff / Operator / UPT Baru
   - 6.3 Pengaturan Matriks Hak Akses Fitur (RBAC)
   - 6.4 Mengganti Sumber Data (Data Source Switcher Google Drive)
   - 6.5 Membaca Log Audit / Jejak Keamanan
   - 6.6 Memantau Laporan & Ekspor Data Analitik
7. [Fitur Multi-Channel: Email-to-Ticket](#7-fitur-multi-channel-email-to-ticket)
8. [Tanya Jawab & Tips Penggunaan (FAQ)](#8-tanya-jawab--tips-penggunaan-faq)

---

## 1. PENGANTAR & KONSEP APLIKASI

**POSO** adalah aplikasi helpdesk dan manajemen tiket modern bergaya *Dark Glassmorphism / Spatial Dashboard*. POSO dirancang untuk menampung seluruh keluhan, laporan kerusakan, dan permohonan layanan secara terpusat, dengan penyimpanan berbasis Google Sheets / Google Drive yang hemat biaya namun mampu menangani volume data tinggi.

### 4 Peran (Role) dalam POSO:
1. **Pengguna Umum (Public User):** Pegawai/publik yang membuat laporan dan memantau tiket miliknya.
2. **Operator Helpdesk:** Tim penanganan awal yang menyaring, memvalidasi, dan meneruskan tiket ke UPT terkait.
3. **Pengguna UPT (Unit Pelaksana Teknis):** Tim teknisi spesialis (misal: UPT TI, UPT Sarpras) yang mengeksekusi perbaikan.
4. **Administrator:** Pengelola sistem dengan akses penuh atas akun pengguna, matriks perizinan, dan database Google Drive.

---

## 2. AKSES AWAL & MODE PENGOPERASIAN (LIVE VS SIMULASI)

Aplikasi POSO memiliki 2 mode pengoperasian yang fleksibel:

### A. Mode Simulasi / Mock Engine (Cocok untuk Demo & Pelatihan)
- Aktif secara default saat aplikasi dibuka tanpa koneksi server.
- Data tersimpan aman di peramban (browser) Anda.
- Tersedia **Dev Role Switcher** di bagian atas (Top Bar) untuk berpindah persona (Admin ⇄ Operator ⇄ UPT ⇄ Pengguna Umum) secara instan dengan 1 klik.

### B. Mode Live (Terhubung ke Google Apps Script)
1. Buka menu **Pengaturan** di sidebar kiri.
2. Masukkan URL Web App Google Apps Script Anda (contoh: `https://script.google.com/macros/s/AKfycb.../exec`).
3. Klik tombol **Simpan**, lalu klik tombol **Aktifkan Mode Live GAS**.
4. Seluruh aktivitas pembuatan tiket, balasan, dan manajemen pengguna akan langsung tersimpan di Google Spreadsheet Anda.

---

## 3. PANDUAN UNTUK PENGGUNA UMUM (PELAPOR / PUBLIC USER)

### 3.1 Registrasi Mandiri Akun Baru
1. Buka halaman utama aplikasi POSO. Jika belum masuk, Anda akan diarahkan ke halaman login.
2. Klik tab **Daftar Akun Baru**.
3. Masukkan:
   - **Nama Lengkap** Anda.
   - **Alamat Email** aktif.
   - **Password** (minimal 6 karakter).
4. Klik tombol **Daftar sebagai Pengguna**.
5. *Catatan Keamanan:* Form pendaftaran mandiri ini secara otomatis hanya menghasilkan akun dengan peran **Pengguna Umum** demi menjaga keamanan sistem internal.

### 3.2 Masuk (Login)
1. Pada tab **Masuk (Login)**, masukkan email dan password yang telah didaftarkan.
2. Klik tombol **Masuk ke POSO**.

### 3.3 Mengajukan Tiket Keluhan / Permintaan Baru
1. Klik tombol **+ Buat Tiket** di sudut kanan atas Top Bar.
2. Isi formulir pembuatan tiket:
   - **Subjek / Judul Masalah:** Tuliskan ringkasan kendala (contoh: *Koneksi Internet Putus di Ruang Rapat Lt. 2*).
   - **Kategori Permasalahan:** Pilih kategori yang sesuai (*Jaringan, Sarana Prasarana, Layanan Akun, Hardware, dll.*).
   - **Tingkat Prioritas:** Pilih estimasi urgensi masalah (*Low, Medium, High, Urgent*).
   - **Deskripsi Rinci:** Jelaskan lokasi spesifik, kronologi kendala, nomor ruangan, atau pesan error.
   - **Lampiran (Opsional):** Klik *+ Tambah Lampiran* untuk menyertakan screenshot atau dokumen pendukung.
3. Klik tombol **Kirim Tiket**.
4. Sistem akan otomatis menerbitkan nomor tiket unik (contoh: `TICK-20260831-4821`) dan menentukan target batas waktu penanganan (SLA).

### 3.4 Memantau Status & Mengirim Balasan
1. Buka menu **Daftar Tiket** di sidebar kiri.
2. Anda hanya akan melihat tiket-tiket yang pernah Anda ajukan sendiri.
3. Klik pada salah satu kartu tiket untuk membuka jendela **Detail Tiket**.
4. Pada panel percakapan sebelah kanan, ketik tanggapan Anda di kotak pesan, lalu klik **Kirim** untuk membalas tim Helpdesk.

---

## 4. PANDUAN UNTUK OPERATOR HELPDESK (GARDA TERDEPAN)

### 4.1 Menavigasi Dashboard Triase
1. Masuk menggunakan akun Operator (atau gunakan *Dev Role Switcher* > *Operator*).
2. Di halaman **Dashboard**, perhatikan statistik KPI:
   - **Tiket Aktif:** Jumlah tiket yang berstatus *Open* dan *In Progress*.
   - **Menunggu Respon:** Tiket yang sedang menunggu tanggapan pelapor (*Waiting*).
   - **SLA Warning:** Tiket yang sisa waktu penyelesaiannya kurang dari 4 jam.
3. Gunakan filter triase cepat:
   - Tab **Prioritas Tinggi**: Memfilter tiket *High* dan *Urgent*.
   - Tab **Belum Di-assign**: Menampilkan tiket masuk baru yang belum diteruskan ke UPT.
   - Tab **Mendekati SLA**: Menampilkan tiket rawan terlewat.

### 4.2 Mengklasifikasi & Merouting Tiket ke UPT
1. Klik tiket yang ingin ditriase.
2. Pada jendela detail, lihat panel **Panel Triase & Status** di sebelah kiri:
   - Pada dropdown **Tugaskan ke Unit UPT**, pilih unit teknis yang berwenang (misal: *UPT TI & Jaringan* atau *UPT Sarana & Prasarana*).
   - Pada dropdown **Ubah Prioritas**, sesuaikan tingkat urgensi jika diperlukan.
3. Klik tombol **Terapkan Triase**.
4. Sistem akan otomatis mencatat riwayat perubahan ke log audit dan menyematkan catatan sistem di thread percakapan.

### 4.3 Mengubah Status & Tingkat Prioritas (SLA)
- **Open (Terbuka):** Tiket baru masuk dan belum mulai dikerjakan.
- **In Progress (Sedang Dikerjakan):** Tiket sudah diterima oleh teknisi UPT dan perbaikan sedang berlangsung.
- **Waiting (Menunggu Respon):** Tim teknis membutuhkan informasi tambahan dari pelapor.
- **Closed (Selesai):** Kendala telah tuntas diperbaiki dan dikonfirmasi.

### 4.4 Berkomunikasi: Balasan Publik vs Catatan Internal 🔒
Saat berada di dalam jendela detail tiket, Operator memiliki 2 mode pengiriman pesan:
1. **Mode Balas Pelapor (Publik):**
   - Klik tombol **Balas Pelapor (Publik)** di atas kotak input.
   - Pesan yang dikirim dapat dibaca langsung oleh pembuat tiket.
2. **Mode Catatan Internal (Privat UPT & Operator) 🔒:**
   - Klik tombol **Catatan Internal (Privat)** (berlatar warna amber/kuning).
   - Pesan yang dikirim **hanya dapat dilihat oleh Operator dan petugas UPT**. Pengguna Umum tidak akan pernah bisa membaca catatan internal ini (misal: diskusi teknis kerusakan kabel, biaya sparepart, atau pembagian teknisi).

---

## 5. PANDUAN UNTUK PENGGUNA UPT (UNIT PELAKSANA TEKNIS)

### 5.1 Membuka Workstation Unit UPT
1. Masuk menggunakan akun UPT (misal: *Ahmad Fauzi - UPT TI & Jaringan*).
2. Klik menu **Panel UPT** di sidebar kiri.
3. Halaman ini difilter secara khusus hanya menampilkan tiket-tiket yang **ditugaskan ke unit Anda**.

### 5.2 Menjalankan & Memperbarui Progres Tiket
1. Pilih tiket berstatus *Open* dari antrean unit.
2. Klik tiket untuk membuka detail.
3. Pada panel kiri, ubah status dari **Open** menjadi **Sedang Dikerjakan (In Progress)**.
4. Klik **Terapkan Triase** agar Operator dan pelapor mengetahui bahwa tiket sedang ditindaklanjuti.

### 5.3 Berkoordinasi via Catatan Internal Privat
1. Gunakan mode **Catatan Internal** di kotak percakapan untuk berdiskusi dengan Helpdesk Operator mengenai kendala lapangan atau sparepart yang dibutuhkan.
2. Jika ada informasi yang perlu disampaikan langsung ke pengguna umum (misal: jadwal kunjungan teknisi ke ruangan), ubah mode ke **Balas Pelapor (Publik)**.

### 5.4 Menyelesaikan Tiket
1. Setelah perbaikan fisik/sistem selesai diuji, buka kembali detail tiket.
2. Ubah status menjadi **Selesai (Closed)**.
3. Kirimkan balasan publik ringkas yang menjelaskan solusi perbaikan yang telah dilakukan.
4. Klik **Terapkan Triase**.

---

## 6. PANDUAN UNTUK ADMINISTRATOR (SUPER ACCESS)

### 6.1 Manajemen Pengguna & Peran (Role Switcher Instan)
1. Buka menu **Pengguna & Role** di sidebar kiri.
2. Tabel menampilkan seluruh akun yang terdaftar dalam sistem beserta status aktif dan role-nya.
3. **Mengubah Role Akun:**
   - Pada kolom *Ubah Role (Instan)*, pilih role baru dari dropdown (*Pengguna Umum*, *Pengguna UPT*, *Operator*, atau *Admin*). Perubahan langsung berlaku seketika tanpa perlu deploy ulang.
4. **Menetapkan Unit UPT:**
   - Jika pengguna memiliki role *UPT*, pilih unit kerja pada kolom *Unit UPT*.
5. **Menonaktifkan / Mengaktifkan Akun:**
   - Klik ikon tombol daya (Power) di kolom paling kanan. Akun yang dinonaktifkan tidak akan dapat login ke sistem.
6. **Reset Password:**
   - Klik ikon kunci di samping akun pengguna > masukkan password baru > klik **Simpan Password Baru**.

### 6.2 Menambah Akun Staff / Operator / UPT Baru
1. Di halaman *Manajemen Pengguna*, klik tombol **+ Tambah Akun Staff / UPT**.
2. Masukkan nama lengkap, email resmi, pilihan role (*Operator / UPT / Admin*), dan password awal.
3. Klik **Buat Akun Sekarang**.

### 6.3 Pengaturan Matriks Hak Akses Fitur (RBAC)
1. Buka menu **Matriks Fitur (RBAC)** di sidebar kiri.
2. Matriks ini menampilkan toggle interaktif (ON / OFF) untuk 12 fitur sistem terhadap 4 peran.
3. Sesuaikan izin yang diinginkan (misal: apakah UPT boleh merouting tiket, apakah Operator boleh melihat audit log).
4. Klik tombol **Simpan Perubahan Matriks** di kanan atas. Pengaturan ini langsung disimpan ke konfigurasi backend `PropertiesService`.

### 6.4 Mengganti Sumber Data (Data Source Switcher Google Drive)
Fitur unggulan untuk beralih database Google Sheet atau folder Google Drive tanpa mengubah kode program:
1. Buka menu **Sumber Data (Drive)** di sidebar kiri.
2. Di bagian form *Alihkan ke Google Drive / Spreadsheet Baru*:
   - Masukkan **Google Spreadsheet ID Baru** (teks acak panjang di URL spreadsheet).
   - Masukkan **Folder ID** (opsional).
   - Tuliskan alasan perpindahan database (untuk riwayat audit).
3. Klik tombol **Tes Koneksi** untuk memverifikasi apakah spreadsheet tersebut dapat diakses dan memiliki struktur kolom yang sesuai.
4. Jika hasil tes berwarna hijau (*Koneksi Berhasil*), klik tombol **Jadikan Sumber Data Aktif**.
5. **Opsi Rollback:** Jika ingin kembali ke database lama, lihat tabel *Riwayat Sumber Data* di bagian bawah, lalu klik tombol **Rollback ke Ini**.

### 6.5 Membaca Log Audit / Jejak Keamanan
1. Buka menu **Log Aktivitas / Audit** di sidebar kiri.
2. Halaman ini mencatat kronologis seluruh tindakan sensitif:
   - Siapa yang mengubah role pengguna dan kapan.
   - Siapa yang mengganti sumber data Google Drive.
   - Perubahan status tiket dan update konfigurasi sistem.
3. Gunakan kolom pencarian untuk melacak aktivitas user atau tiket tertentu.

### 6.6 Memantau Laporan & Ekspor Data Analitik
1. Buka menu **Laporan & Analitik** di sidebar kiri.
2. Tinjau grafik distribusi volume tiket per kategori, kepatuhan SLA, waktu rata-rata penyelesaian masalah, serta rasio tiket Web vs Email.
3. Klik tombol **Ekspor Laporan (CSV)** di kanan atas untuk mengunduh rekapitulasi data tiket dalam format CSV/Excel.

---

## 7. FITUR MULTI-CHANNEL: EMAIL-TO-TICKET

Sistem POSO terintegrasi langsung dengan Gmail Google Workspace:
1. Pelanggan/pengguna dapat mengirimkan email kendala ke alamat email helpdesk institusi Anda.
2. Trigger terjadwal di Google Apps Script (`emailToTicketTrigger`) akan secara otomatis memindai inbox setiap 5–10 menit.
3. Email baru akan dikonversi menjadi tiket POSO:
   - **Subjek Email** menjadi **Judul Tiket**.
   - **Isi Email** menjadi **Deskripsi Masalah**.
   - **Pengirim Email** menjadi **Email Pelapor**.
   - **Saluran (Channel)** otomatis bernilai `email`.
4. Email yang telah diproses otomatis diberi label `POSO_PROCESSED` di Gmail agar tidak terjadi pencatatan ganda.

---

## 8. TANYA JAWAB & TIPS PENGGUNAAN (FAQ)

**Q1: Apa yang harus dilakukan jika saya lupa password akun Admin?**  
> Jalankan fungsi `setupInitialDatabase()` di editor Google Apps Script. Fungsi ini akan memastikan akun Super Admin awal `admin@poso.local` dengan password `Admin123!` selalu tersedia.

**Q2: Mengapa Pengguna Umum tidak bisa melihat Catatan Internal?**  
> Sesuai standar keamanan ISO/osTicket, catatan internal dilindungi di level backend Google Apps Script. Endpoint API secara otomatis menyaring dan menghapus entri bertanda `internal` sebelum data dikirim ke peramban pengguna umum.

**Q3: Bagaimana cara mengganti logo atau nama institusi?**  
> Anda dapat menyesuaikan teks nama dan warna di file `src/components/layout/Sidebar.tsx` dan `index.html`.

**Q4: Apakah data tiket akan melambat jika mencapai ratusan ribu baris?**  
> Tidak. POSO menggunakan strategi *append-only write* (menulis langsung di baris akhir tanpa memuat file) dan *bottom-to-top chunking* (hanya membaca rentang baris terbaru), sehingga penggunaan memori dan waktu eksekusi Google Apps Script tetap sangat ringan dan stabil.
