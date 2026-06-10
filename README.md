# 🕋 Umroh Pro: Asisten Digital Ibadah Modern

Aplikasi web pendamping ibadah Umroh yang komprehensif, dirancang dengan antarmuka **Sistem Hub** yang intuitif, dukungan **Mode Offline (PWA)**, dan berbagai alat bantu praktis untuk jamaah di Tanah Suci.

## ✨ Fitur Unggulan (Premium Edition)

### 🟢 Hub Ibadah
- **Tuntunan Manasik**: Panduan langkah demi langkah sesuai sunnah.
- **Bank Doa Lengkap**: Koleksi doa perjalanan, tawaf, sa'i, dan ziarah dengan teks Arab yang bisa diperbesar (Ramah Lansia).
- **Tasbih Digital**: Penghitung putaran Tawaf & Sa'i terintegrasi dengan fitur getar.
- **Tracker Progress**: Checklist interaktif untuk melacak tahapan Umroh Anda.

### 🔵 Hub Persiapan
- **Estimator Biaya**: Kalkulasi anggaran perjalanan secara mendetail.
- **Checklist Dokumen & Barang**: Memastikan Paspor, Visa, dan perlengkapan tidak tertinggal.
- **Itinerary Digital**: Rencana perjalanan harian (Paket 9 & 12 Hari).

### 🟠 Hub Jelajah (Navigasi GPS)
- **Denah Pintu Utama**: Panduan pintu Masjidil Haram & Masjid Nabawi (Berbasis kode warna 2026).
- **Destinasi Ziarah**: Informasi lokasi populer seperti Gua Hira, Masjid Quba, dan Jabal Rahmah.
- **Tips Nusuk**: Panduan langkah demi langkah booking Raudhah.

### 🔴 Fitur Darurat & Alat Bantu
- **Tombol SOS**: Kirim lokasi GPS real-time ke WhatsApp keluarga dalam satu klik.
- **Konverter Riyal (SAR - IDR)**: Kalkulator kurs instan untuk belanja.
- **Kontak Darurat (KSA)**: Daftar telepon penting Ambulans, Polisi, dan KUHAI.

---

## 🚀 Panduan Deployment (Publikasi ke Umum)

Aplikasi ini siap dipublikasikan secara gratis menggunakan **Vercel**.

### 1. Persiapan GitHub
1. Buat repository baru di GitHub.
2. Hubungkan folder proyek lokal Anda dan lakukan `git push`.

### 2. Publikasi ke Vercel
1. Masuk ke [vercel.com](https://vercel.com).
2. Pilih **"Add New Project"** dan impor repository GitHub Anda.
3. Di bagian **Environment Variables**, masukkan data dari file `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Klik **"Deploy"**. Selesai!

### 3. Konfigurasi Supabase
Jangan lupa untuk menambahkan domain hasil deployment (misal: `https://umroh-pro.vercel.app`) ke dalam **Authentication > URL Configuration** di Dashboard Supabase agar fitur login berfungsi.

---

## 📱 Aktivasi Mode Offline (PWA)

Agar jamaah tetap bisa menggunakan aplikasi tanpa internet di Tanah Suci:
1. Buka URL aplikasi di browser HP (Chrome/Safari).
2. Pilih menu **"Add to Home Screen"** atau **"Tambahkan ke Layar Utama"**.
3. Aplikasi akan terinstall dan bisa dibuka kapan saja, bahkan saat sinyal hilang.

---
© 2026 Umroh Planner Ecosystem • Dirancang untuk Kemudahan Ibadah.
