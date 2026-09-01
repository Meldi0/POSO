# PANDUAN LENGKAP SETTING & DEPLOYMENT BACKEND "POSO"
## Google Apps Script + Google Sheets REST API Serverless

Panduan ini berisi langkah-langkah praktis untuk memasang, mengonfigurasi, dan mendeploy backend aplikasi **POSO** menggunakan **Google Apps Script** dan **Google Sheets** sebagai database.

---

## DAFTAR ISI
1. [Prasyarat](#1-prasyarat)
2. [Langkah 1: Membuat Google Spreadsheet Database](#2-langkah-1-membuat-google-spreadsheet-database)
3. [Langkah 2: Membuka Google Apps Script Editor](#3-langkah-2-membuka-google-apps-script-editor)
4. [Langkah 3: Memasukkan Kode Backend (Code.gs & appsscript.json)](#4-langkah-3-memasukkan-kode-backend-codegs--appsscriptjson)
5. [Langkah 4: Menjalankan Inisialisasi Database Otomatis](#5-langkah-4-menjalankan-inisialisasi-database-otomatis)
6. [Langkah 5: Deploy Backend sebagai Web App](#6-langkah-5-deploy-backend-sebagai-web-app)
7. [Langkah 6: Menghubungkan Backend ke Frontend POSO](#7-langkah-6-menghubungkan-backend-ke-frontend-poso)
8. [Langkah 7: Memasang Trigger Email-to-Ticket (Opsional)](#8-langkah-7-memasang-trigger-email-to-ticket-opsional)
9. [Daftar Akun Default (Seed Users)](#9-daftar-akun-default-seed-users)
10. [Troubleshooting & Kendala Umum](#10-troubleshooting--kendala-umum)

---

## 1. PRASYARAT
- Akun Google (Gmail biasa atau akun Google Workspace institusi).
- Peramban web modern (Google Chrome, Edge, Firefox, dll).
- Waktu instalasi: ± **5–10 menit**.

---

## 2. LANGKAH 1: MEMBUAT GOOGLE SPREADSHEET DATABASE

1. Buka browser dan akses tautan cepat: **[https://sheets.new](https://sheets.new)**.
2. Beri nama file Spreadsheet di sudut kiri atas: **`POSO Master Database`**.
3. Perhatikan URL di address bar browser Anda. Salin **Spreadsheet ID**:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                          ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
                                                       (Spreadsheet ID)
   ```
   *Simpan ID ini untuk keperluan verifikasi atau Data Source Switcher.*

---

## 3. LANGKAH 2: MEMBUKA GOOGLE APPS SCRIPT EDITOR

1. Pada menu navigasi atas Google Spreadsheet, klik:
   **Ekstensi (Extensions)** ➔ **Apps Script**.
2. Sebuah tab baru akan terbuka berisi editor kode Apps Script.
3. Di sudut kiri atas editor, klik teks *"Untitled project"* dan ubah namanya menjadi: **`POSO Backend API`**.

---

## 4. LANGKAH 3: MEMASUKKAN KODE BACKEND (Code.gs & appsscript.json)

### A. Salin File `Code.gs`
1. Di panel editor file `Code.gs`, hapus seluruh kode bawaan yang ada.
2. Buka berkas lokal [backend/Code.gs](file:///c:/Users/Asus/Documents/POSIND/POSO/backend/Code.gs), salin seluruh kodenya, lalu tempel (*paste*) ke editor Apps Script.
3. Klik tombol **Simpan (Ikon Disket)** atau tekan `Ctrl + S`.

### B. Atur File Manifes `appsscript.json`
1. Di bilah menu paling kiri Apps Script, klik ikon gerigi **Project Settings (Setelan Proyek)**.
2. Beri centang pada kotak: **"Tampilkan file manifes 'appsscript.json' di editor"** (*Show 'appsscript.json' manifest file in editor*).
3. Kembali ke menu **Editor (Ikon `<>` di bilah kiri)**. File `appsscript.json` kini akan muncul di daftar file.
4. Buka file `appsscript.json` di editor Apps Script, ganti seluruh isinya dengan isi dari file lokal [backend/appsscript.json](file:///c:/Users/Asus/Documents/POSIND/POSO/backend/appsscript.json):
   ```json
   {
     "timeZone": "Asia/Jakarta",
     "dependencies": {
       "enabledAdvancedServices": [
         {
           "userSymbol": "Drive",
           "serviceId": "drive",
           "version": "v2"
         },
         {
           "userSymbol": "Sheets",
           "serviceId": "sheets",
           "version": "v4"
         }
       ]
     },
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8",
     "webapp": {
       "executeAs": "USER_DEPLOYING",
       "access": "ANYONE_ANONYMOUS"
     },
     "oauthScopes": [
       "https://www.googleapis.com/auth/spreadsheets",
       "https://www.googleapis.com/auth/drive",
       "https://www.googleapis.com/auth/gmail.modify",
       "https://www.googleapis.com/auth/script.scriptapp",
       "https://www.googleapis.com/auth/script.storage"
     ]
   }
   ```
5. Klik tombol **Simpan (Ikon Disket)** atau `Ctrl + S`.

---

## 5. LANGKAH 4: MENJALANKAN INISIALISASI DATABASE OTOMATIS

Langkah ini akan secara otomatis membuat 5 lembar kerja (sheets), struktur kolom header, serta akun Super Admin bawaan:

1. Di toolbar bagian atas Apps Script, temukan menu dropdown pilihan fungsi (di samping tombol *Debug* dan *Jalankan*).
2. Pilih fungsi: **`setupInitialDatabase`**.
   ```
   [ Debug ]  [ setupInitialDatabase ▼ ]  [ ▶ Jalankan / Run ]
   ```
3. Klik tombol **Jalankan (Run)**.
4. **Memberikan Izin Akses Akun Google (Otorisasi):**
   - Jendela popup *"Authorization Required"* akan muncul ➔ Klik **Tinjau Izin (Review Permissions)**.
   - Pilih akun Google yang sedang Anda gunakan.
   - Jika muncul layar peringatan *"Google hasn't verified this app"*, klik tautan **Advanced (Lanjutan)** di bagian bawah ➔ Klik **Go to POSO Backend API (unsafe)**.
   - Gulir ke bawah lalu klik tombol **Izinkan (Allow)**.
5. Tunggu 3–5 detik sampai muncul pesan pada Execution Log:
   `"Inisialisasi POSO Database Berhasil! Default Admin: admin@poso.local / Admin123!"`
6. **Periksa Google Spreadsheet Anda:**
   Anda akan melihat lembar sheet berikut telah terbuat otomatis dengan rapi:
   - **`Tickets`**: Data seluruh tiket keluhan/permintaan.
   - **`Users`**: Data akun pengguna & hash password SHA-256.
   - **`Ticket_Threads`**: Percakapan balasan publik & catatan internal privat.
   - **`Audit_Log`**: Jejak rekaman seluruh aktivitas sensitif sistem.
   - **`System_Config`**: Konfigurasi sistem dinamis via `PropertiesService`.

---

## 6. LANGKAH 5: DEPLOY BACKEND SEBAGAI WEB APP

Agar frontend React dapat berkomunikasi dengan backend Apps Script:

1. Di sudut kanan atas editor Apps Script, klik tombol biru **Terapkan (Deploy)** ➔ Pilih **Penerapan baru (New deployment)**.
2. Di jendela yang muncul, klik ikon gerigi di sebelah kiri teks *Pilih jenis (Select type)* ➔ Pilih **Aplikasi web (Web app)**.
3. Masukkan konfigurasi berikut:
   - **Deskripsi (Description):** `POSO Production API v1`
   - **Jalankan sebagai (Execute as):** `Saya (email Anda)`
   - **Yang memiliki akses (Who has access):** `Siapa saja (Anyone)`  
     *(PENTING: Wajib memilih 'Siapa saja' agar request REST API dari frontend tidak terblokir otentikasi login Google pihak ketiga)*.
4. Klik tombol **Terapkan (Deploy)**.
5. Salin teks **URL Aplikasi Web** yang ditampilkan:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```

---

## 7. LANGKAH 6: MENGHUBUNGKAN BACKEND KE FRONTEND POSO

Ada 2 cara menghubungkan URL tersebut ke aplikasi frontend POSO:

### Cara 1: Langsung dari Menu Pengaturan UI (Paling Direkomendasikan)
1. Buka aplikasi web POSO di browser Anda (misalnya `http://localhost:3000`).
2. Masuk ke aplikasi, lalu klik menu **Pengaturan** di sidebar kiri.
3. Pada kolom **URL Google Apps Script Web App**, tempelkan URL `/exec` yang sudah disalin di Langkah 5.
4. Klik tombol **Simpan**, lalu klik tombol **Tes Ping** (indikator akan menampilkan pesan sukses hijau).
5. Klik tombol **Aktifkan Mode Live GAS**.

### Cara 2: Melalui File Konfigurasi `.env`
1. Buka folder proyek lokal `POSO`.
2. Buat atau edit file bernama `.env` di root direktori:
   ```env
   VITE_GAS_API_URL=https://script.google.com/macros/s/AKfycbxxxxxxxx/exec
   ```
3. Restart development server dengan `npm run dev`.

---

## 8. LANGKAH 7: MEMASANG TRIGGER EMAIL-TO-TICKET (OPSIONAL)

Untuk mengaktifkan fitur penerimaan tiket otomatis dari inbox Gmail institusi:

1. Di bilah menu sebelah kiri Apps Script, klik ikon jam (**Pemicu / Triggers**).
2. Klik tombol biru **+ Tambahkan Pemicu (+ Add Trigger)** di pojok kanan bawah.
3. Konfigurasikan setelan pemicu:
   - **Pilih fungsi yang akan dijalankan:** `emailToTicketTrigger`
   - **Pilih deployment yang akan dijalankan:** `Head`
   - **Pilih sumber acara (Event source):** `Berdasarkan waktu (Time-driven)`
   - **Pilih jenis pemicu berbasis waktu:** `Pengatur waktu menit (Minutes timer)`
   - **Pilih interval menit:** `Setiap 5 menit` atau `Setiap 10 menit`
4. Klik **Simpan (Save)**.

*Hasil:* Setiap kali ada email baru masuk ke inbox akun Google ini, sistem akan otomatis menjadikannya tiket baru di POSO dan menandai email tersebut dengan label `POSO_PROCESSED`.

---

## 9. DAFTAR AKUN DEFAULT (SEED USERS)

Setelah menjalankan `setupInitialDatabase()`, akun-akun default berikut siap langsung digunakan untuk login:

| Peran (Role) | Alamat Email | Password Bawaan | Deskripsi Akses |
|---|---|---|---|
| **Super Admin** | `admin@poso.local` | `Admin123!` | Akses penuh seluruh sistem, ubah role siapa pun, ganti data source |
| **Operator** | `operator@poso.local` | `Operator123!` | Helpdesk Lead, triase antrean, routing tiket ke UPT, catatan internal |
| **Pengguna UPT** | `upt.ti@poso.local` | `Upt123!` | Petugas teknis unit UPT TI & Jaringan |

> **Tips Keamanan:** Setelah sistem siap dipakai di produksi, Anda dapat mengganti password atau menonaktifkan akun demo ini melalui panel **Pengguna & Role** milik Super Admin.

---

## 10. TROUBLESHOOTING & KENDALA UMUM

### Q1: Muncul error `CORS error` atau `NetworkError when attempting to fetch resource`
- **Penyebab:** Pada setelan Deployment Web App, opsi *Who has access* belum diatur ke *Anyone*.
- **Solusi:** Buka editor Apps Script > Klik **Deploy** > **Manage deployments** > Edit deployment aktif > Ubah *Who has access* menjadi **Anyone (Siapa saja)** > Klik **Deploy**.

### Q2: Perubahan pada `Code.gs` tidak langsung terlihat di API Web App
- **Penyebab:** Google Apps Script memerlukan versi deployment baru setiap kali ada perubahan kode.
- **Solusi:** Klik **Deploy** > **Manage deployments** > Klik ikon pensil (Edit) pada deployment aktif > Pada dropdown *Version*, pilih **New version** > Klik **Deploy**.

### Q3: Bagaimana cara Admin berpindah ke Google Spreadsheet lain di kemudian hari?
- Tidak perlu mengubah kode backend! Buka aplikasi web POSO > Masuk sebagai Admin > Menu **Sumber Data (Drive)** > Masukkan ID Spreadsheet baru > Klik **Tes Koneksi** > Klik **Jadikan Sumber Data Aktif**.
