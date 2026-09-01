# POSO — Sistem Helpdesk & Manajemen Tiket Terpadu

Aplikasi helpdesk dan manajemen tiket terpadu modern bergaya *osTicket* dengan desain visual **Sage Green & Soft Cream Canvas**, didukung backend serverless **Google Apps Script REST API**, penyimpanan berkas **Google Drive**, serta basis data **Google Sheets**.

---

## 1. STRUKTUR ARSITEKTUR PROYEK

```
POSO/
├── backend/
│   ├── Code.gs             # Backend Apps Script: REST API, LockService, Drive File Upload, Sanitizer
│   └── appsscript.json     # Manifest Apps Script (OAuth Scopes & Service Declarations)
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── DataSourceConfig.tsx    # Pemantauan status Google Drive & Spreadsheet
│   │   │   └── UserManagement.tsx      # Manajemen akun staf operator & penugasan UPT
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx           # Pelindung rute login & indikator loading sage
│   │   ├── common/
│   │   │   └── AttachmentGallery.tsx   # Galeri thumbnail gambar asli & Lightbox zoom modal
│   │   └── operator/
│   │       ├── SageSidebar.tsx         # Sidebar sticky 2-tone (Profil Sage + Menu Putih)
│   │       ├── SageTopBar.tsx          # Top bar hijau sage dengan pencarian & filter
│   │       ├── SageTicketCard.tsx      # Kartu tiket terapung, pill SLA & aksi 1-klik status
│   │       ├── SageKanbanBoard.tsx     # Papan Kanban 4 kolom & menu titik tiga (...)
│   │       ├── SageTableView.tsx       # Tampilan tabel daftar tiket dengan badge prioritas
│   │       └── SageTicketDrawer.tsx    # Laci inspeksi detail, form triase UPT, & thread balasan
│   ├── context/
│   │   ├── AuthContext.tsx             # Manajemen sesi token, hak akses RBAC, & login demo
│   │   └── TicketContext.tsx           # Store data tiket, sinkronisasi & filtering
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx               # Halaman masuk dengan tombol 1-klik demo akun
│   │   │   └── Register.tsx            # Registrasi mandiri khusus pengguna umum
│   │   ├── operator/
│   │   │   └── OperatorDashboard.tsx   # Workstation triase operator, FAB button & drawer
│   │   └── public/
│   │       ├── LandingPage.tsx         # Beranda resmi institusional, katalog & alur SOP
│   │       ├── PublicTicketForm.tsx    # Formulir pengajuan tiket baru & upload foto
│   │       ├── PublicTicketTracker.tsx # Pelacak tiket mandiri, lightbox foto, & kirim balasan
│   │       └── MyTicketsPage.tsx       # Daftar tiket pengaduan milik pelapor terdaftar
│   ├── services/
│   │   └── api.ts                      # Klien API terintegrasi Google Apps Script Web App
│   ├── types/
│   │   └── index.ts                    # Definisi tipe data TypeScript (Ticket, Thread, User, dll)
│   ├── App.tsx                         # Konfigurasi router aplikasi
│   ├── index.css                       # Desain sistem Sage Green, custom scrollbar, dot pattern
│   └── main.tsx                        # Entry point React
├── .env.example                        # Contoh konfigurasi URL endpoint backend
├── POSO_BRD.md                         # Business Requirements Document (BRD)
├── POSO_PRD.md                         # Product Requirements Document (PRD)
├── package.json
└── vite.config.ts
```

---

## 2. INTEGRASI GOOGLE WORKSPACE & APPS SCRIPT

### Informasi Konfigurasi:
* **Folder Google Drive (Penyimpanan Foto)**:
  `YOUR_GOOGLE_DRIVE_FOLDER_ID`
* **Google Spreadsheet Master Database**:
  `YOUR_GOOGLE_SPREADSHEET_ID`
* **Deployment Apps Script URL** (`.env`):
  ```env
  VITE_GAS_API_URL=https://script.google.com/macros/s/YOUR_GAS_DEPLOYMENT_ID/exec
  ```

### Panduan Memperbarui / Deploy Apps Script:
1. Buka spreadsheet database Anda di Google Sheets.
2. Buka menu **Ekstensi > Apps Script**.
3. Salin seluruh isi dari `backend/Code.gs` ke file `Code.gs` di editor Apps Script.
4. Buka menu **Project Settings (Ikon Gerigi)** > centang **"Show 'appsscript.json' manifest file in editor"**.
5. Buka tab `appsscript.json` di editor dan pastikan isinya sesuai dengan `backend/appsscript.json`.
6. Klik tombol **Deploy** di kanan atas > **Manage deployments**.
7. Klik ikon pensil (Edit) > ubah Version menjadi **New version** > klik **Deploy**.

---

## 3. MENJALANKAN APLIKASI DI KOMPUTER LOKAL

### Langkah 1: Kloning & Instal Dependensi
```bash
cd POSO
npm install
```

### Langkah 2: Menyiapkan File `.env`
Salin template `.env.example` menjadi `.env` di root direktori:
```env
VITE_GAS_API_URL=https://script.google.com/macros/s/YOUR_GAS_DEPLOYMENT_ID/exec
```

### Langkah 3: Menjalankan Server Pengembangan
```bash
npm run dev
```
Aplikasi akan aktif di alamat: `http://localhost:3000`

### Langkah 4: Build Produksi
```bash
npm run build
```
Hasil build produksi yang optimal akan berada di folder `dist/`.

---

## 4. STRUKTUR PERAN (*ROLE-BASED ACCESS CONTROL*)

Sistem POSO mendukung manajemen hak akses berbasis peran (*RBAC*):

| Peran (*Role*) | Deskripsi & Hak Akses |
|---|---|
| **Super Admin** | Akses penuh: manajemen staf operator & teknisi UPT, konfigurasi sumber data, dan audit sistem. |
| **Operator Helpdesk** | Papan triase Kanban, routing ke unit teknisi UPT, pembaruan status, balasan publik & catatan internal. |
| **Teknisi UPT** | Eksekusi tiket teknis sesuai unit penugasan (*TI, Sarpras, Sistem Informasi*). |
| **Pelapor (Pengguna)** | Pembuatan tiket keluhan baru, pemantauan riwayat tiket saya, dan pelacakan tiket via ID. |

---

## 5. FITUR UTAMA SISTEM

1. **Galeri Thumbnail Foto Asli & Lightbox Modal**:
   * Seluruh foto lampiran yang diunggah pengguna otomatis disimpan ke folder Google Drive resmi.
   * Tampil sebagai kartu pratinjau thumbnail asli di pelacak tiket dan drawer staf, lengkap dengan fitur zoom foto layar penuh saat diklik.
2. **Papan Triase Kanban Interaktif & Tombol 1-Klik**:
   * Kolom status: *Open (Baru)*, *In Progress (Sedang Dikerjakan)*, *Waiting (Menunggu Respon)*, *Closed (Selesai)*.
   * Tombol cepat `[ Proses ]` dan `[ Selesai ]` pada setiap kartu untuk memindahkan tiket secara instan.
   * Menu titik tiga (`...`) untuk pengurutan prioritas darurat, waktu masuk, penyalinan ringkasan, dan penyelesaian massal.
3. **Sidebar Sticky Ergonomis**:
   * Bilah samping kiri tetap diam di tempatnya (*stay in place*) saat daftar tiket digulir ke bawah.
4. **Desain Rata Penuh (*Edge-to-Edge Full Width*) & Bebas Emoji**:
   * Menggunakan tata letak responsif yang mengisi penuh layar.
   * 100% menggunakan ikon vektor modern (*Lucide Icons*) tanpa karakter emoji generik.
5. **Penyimpanan Spreadsheet Bersih**:
   * Sel basis data pada Google Sheets bersih dari string base64 yang panjang, hanya mencatat tautan Google Drive resmi yang rapi.
