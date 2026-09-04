# Panduan Deployment & Arsitektur Cloud (PRISMA POS v3.0)
### Full-Stack Serverless Deployment: Vercel + Aiven for MySQL

Dokumen ini berisi panduan teknis internal untuk konfigurasi lingkungan produksi, deployment serverless ke platform **Vercel**, serta penyambungan ke kluster cloud database **Aiven for MySQL**.

---

## 1. Arsitektur Deployment

PRISMA POS dirancang dengan arsitektur **Serverless Full-Stack**:
- **Frontend SPA**: React 18 + Vite dikompilasi menjadi aset statis (`dist/`) dan di-host melalui Vercel Global Edge Network.
- **Backend API**: Node.js + Express 5.x berjalan sebagai **Vercel Serverless Function** via [`api/index.js`](file:///c:/Users/Asus/Documents/POSIND/POSO/api/index.js) yang mengekspor instance aplikasi Express.
- **Routing Rewrite**: Seluruh permintaan HTTP ke `/api/*` secara otomatis diarahkan ke `api/index.js` oleh [`vercel.json`](file:///c:/Users/Asus/Documents/POSIND/POSO/vercel.json), sementara rute lainnya diarahkan ke `index.html` (SPA fallback).
- **Database Master**: Basis data relasional terkelola **Aiven for MySQL** (MySQL 8.0) dengan koneksi terenkripsi (TLS 1.3 / SSL Mode: REQUIRED).

---

## 2. Prasyarat Deployment

Sebelum memulai proses deployment, pastikan Anda telah menyiapkan:
1. Akun **Vercel** ([vercel.com](https://vercel.com)).
2. Akun **Aiven** ([aiven.io](https://aiven.io)) dengan layanan MySQL yang aktif.
3. Kredensial koneksi kluster database Aiven: Hostname, Port, Username, Password, Database Name (`defaultdb`), dan SSL Certificate.
4. Repositori Git proyek (GitHub / GitLab / Bitbucket).

---

## 3. Konfigurasi Variabel Lingkungan Produksi (Vercel)

Pada dashboard proyek di **Vercel** (*Settings > Environment Variables*), tambahkan variabel-variabel berikut untuk environment **Production** dan **Preview**:

| Variabel | Tipe / Format | Keterangan |
|---|---|---|
| `DB_HOST` | String (Domain Hostname) | Host kluster database Aiven MySQL Anda |
| `DB_PORT` | Integer (cth: `21970`) | Port layanan Aiven MySQL |
| `DB_USER` | String (cth: `avnadmin`) | Pengguna master database |
| `DB_PASSWORD` | Secret String | Kata sandi user database cloud |
| `DB_NAME` | String | Nama database target (default: `defaultdb`) |
| `DB_SSL` | Boolean (`true`) | Wajib `true` (Aiven mewajibkan enkripsi SSL) |
| `PORT` | Integer (`5001`) | Port internal Express |
| `JWT_SECRET` | Secret String | String acak panjang yang aman untuk enkripsi token JWT |

> [!IMPORTANT]
> Pastikan variabel `DB_SSL` diset ke `true`. Kluster Aiven for MySQL menolak seluruh koneksi tanpa enkripsi SSL/TLS.

---

## 4. Langkah-Langkah Deployment ke Vercel

### Metode A: Melalui Vercel Dashboard (Rekomendasi)
1. **Push Kode ke Git**: Pastikan seluruh kode terbaru telah di-commit dan di-push ke repositori Git Anda.
2. **Import Project**:
   - Buka [Vercel Dashboard](https://vercel.com) > klik tombol **Add New... > Project**.
   - Hubungkan akun Git dan pilih repositori PRISMA POS.
3. **Konfigurasi Project**:
   - **Framework Preset**: Pilih **Vite**.
   - **Build Command**: `npm run build` (atau `tsc && vite build`).
   - **Output Directory**: `dist`.
   - **Install Command**: `npm install`.
4. **Masukkan Environment Variables**: Masukkan seluruh variabel lingkungan sesuai daftar pada Bagian 3.
5. **Deploy**: Klik tombol **Deploy**. Vercel akan otomatis membangun frontend dan mendaftarkan serverless API handler.

---

### Metode B: Menggunakan Vercel CLI
Jika ingin melakukan deployment langsung dari terminal:
```bash
# 1. Login ke Vercel CLI
npx vercel login

# 2. Hubungkan proyek lokal ke Vercel
npx vercel link

# 3. Tarik atau atur environment variables
npx vercel env pull .env.production

# 4. Lakukan build dan deploy produksi
npx vercel --prod
```

---

## 5. Inisialisasi & Migrasi Database di Cloud

Sebelum aplikasi digunakan pertama kali di lingkungan produksi, struktur tabel dan data master perlu diinisialisasi pada database Aiven:

```bash
# 1. Pastikan file .env lokal terhubung ke database Aiven
npm run test:db

# 2. Jalankan skrip migrasi skema dan seed data akun awal
npm run migrate
```

Skrip migrasi akan membuat:
- Tabel `users` beserta akun master default.
- Tabel `tickets` dengan indexing status dan kategori.
- Tabel `threads` dengan relasi cascade.
- Tabel `audit_logs` dan `system_config`.

---

## 6. Verifikasi & Pengujian Pasca-Deployment

Setelah deployment selesai:
1. **Health Check Endpoint**:
   Buka URL produksi Vercel pada endpoint API:
   `https://[domain-aplikasi-anda].vercel.app/api/analytics/status`
   Respon harus mengembalikan status `success` beserta metrik koneksi database.
2. **Uji Login Staf**:
   Akses halaman `/login` dan uji login dengan akun administrator.
3. **Uji Pengajuan Tiket**:
   Akses halaman `/submit`, unggah foto bukti, dan pastikan tiket berhasil tersimpan dengan nomor tiket terbit resmi.
4. **Uji Pemantau Kluster**:
   Buka menu **Basis Data Aiven** pada workstation admin untuk memeriksa latensi koneksi (ping) dan jumlah baris tabel secara *real-time*.
