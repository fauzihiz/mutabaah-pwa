<div align="center">

# 🌙 Mutabaah Tracker

**Aplikasi catatan ibadah harian berbasis PWA — modern, offline-first, dan penuh motivasi.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green)](../LICENSE)

</div>

---

## 📖 Tentang Aplikasi

**Mutabaah Tracker** adalah Progressive Web App (PWA) yang membantu Muslim melacak ibadah harian secara konsisten dan terstruktur. Terinspirasi dari konsep *mutabaah* (pemantauan diri) dalam tradisi Islam, aplikasi ini memungkinkan pengguna untuk:

- Mencatat ibadah harian secara cepat dan mudah
- Melihat progres per bulan dalam tampilan grid yang intuitif
- Mendapatkan pencapaian (*badge*) sebagai bentuk penghargaan atas konsistensi ibadah
- Menggunakan aplikasi bahkan tanpa koneksi internet (*offline-first*)

---

## ✨ Fitur Utama

### 🔐 Autentikasi Tanpa Password
Login aman menggunakan **Supabase Email OTP** — cukup masukkan email, klik tautan yang dikirimkan, langsung masuk. Tidak perlu mengingat password.

### 📅 Grid Ibadah Bulanan
Tampilan tabel interaktif yang menampilkan seluruh aktivitas ibadah dalam satu bulan. Geser ke kanan untuk melihat dan mengisi tanggal sebelumnya.

- Pengisian bisa dilakukan untuk hari ini dan hari-hari sebelumnya
- Tanggal yang akan datang dikunci otomatis
- Navigasi antar bulan tersedia di header

### 🏆 Sistem Badge & Pencapaian
Badge diberikan berdasarkan konsistensi ibadah spesifik — bukan sekadar login. Contoh pencapaian:

| Badge | Syarat |
|---|---|
| **Lail al-Awwal** | 3 malam beruntun Tahajud |
| **Muqarrabun** | 7 malam beruntun Tahajud |
| **Sahib al-Fajr** | 7 hari Subuh tepat waktu |
| **Ahlul Quran** | 30 hari beruntun Tilawah |
| **Al-Karim** | 7 hari berturut Sedekah |
| **Al-Mujtahid** | 30 hari mutabaah beruntun |

Badge baru bisa ditambahkan kapan saja melalui database Supabase — tanpa perlu update kode.

### 🌙 Dark Mode
Toggle tampilan gelap/terang dari header. Preferensi disimpan secara lokal.

### 📲 Installable PWA
Bisa diinstall langsung di layar utama ponsel (Android/iOS) — tampil seperti aplikasi native, dengan ikon dan splash screen.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + CSS Variables |
| **Local DB** | [Dexie.js](https://dexie.org/) (IndexedDB) |
| **Backend/Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| **PWA** | [Serwist](https://serwist.pages.dev/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Memulai

### Prasyarat

- Node.js 18+
- Akun [Supabase](https://supabase.com) (gratis)

### Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/fauzihiz/mutabaah-pwa.git
cd mutabaah-pwa/mutabaah-pwa

# 2. Install dependensi
npm install

# 3. Buat file environment
cp .env.local.example .env.local
# Edit .env.local dan isi dengan kredensial Supabase kamu
```

### Konfigurasi `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Setup Database Supabase

Jalankan script SQL berikut di **Supabase SQL Editor**:

```
supabase_setup.sql  (tersedia di branch utama)
```

Script ini akan membuat tabel `mutabaah_logs`, `achievements`, dan `user_achievements` lengkap dengan RLS policies dan data badge awal.

### Menjalankan Lokal

```bash
npm run dev
# Buka http://localhost:3000
```

---

## 📦 Deployment

Aplikasi ini siap di-deploy ke **Vercel** (direkomendasikan):

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

Atau hubungkan repository ke [vercel.com](https://vercel.com) dan isi environment variable di dashboard Vercel.

---

## 📁 Struktur Proyek

```
mutabaah-pwa/
├── app/
│   ├── login/          # Halaman login (Email OTP)
│   ├── page.tsx        # Dashboard utama
│   └── layout.tsx      # Root layout + providers
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx   # Header + dark mode toggle
│   │   ├── AchievementCarousel.tsx # Badge carousel
│   │   ├── MonthPicker.tsx       # Navigasi bulan
│   │   ├── MutabaahGrid.tsx      # Grid ibadah bulanan
│   │   └── DashboardFooter.tsx
│   └── providers/
│       ├── AuthProvider.tsx      # Supabase auth context
│       └── ThemeProvider.tsx     # Dark/light mode context
├── hooks/
│   ├── useMutabaah.ts            # Hook data ibadah (IndexedDB)
│   └── useMonthlyAchievements.ts # Hook badge per bulan (reactive)
├── lib/
│   ├── db.ts                     # Dexie schema (IndexedDB)
│   ├── supabase.ts               # Supabase client
│   ├── achievements.ts           # Logic validasi badge
│   └── constants/
│       └── activities.ts         # Daftar & kategori aktivitas
└── public/
    ├── manifest.json
    └── favicon.png
```

---

## 🗺️ Roadmap

Fitur-fitur berikut sedang dalam pertimbangan untuk pengembangan selanjutnya:

### 📊 Phase 1 — Statistik & Analitik
- [ ] **Dashboard Statistik Bulanan** — grafik bar/pie untuk visualisasi tingkat penyelesaian per aktivitas
- [ ] **Ringkasan Mingguan** — kartu ringkasan 7 hari terakhir di halaman utama
- [ ] **Heatmap Keaktifan** — tampilan kalender-style seperti GitHub contributions
- [ ] **Persentase Completion Harian** — indikator progres hari ini secara real-time

### 🔔 Phase 2 — Personalisasi & Notifikasi
- [ ] **Push Notification Pengingat** — notifikasi terjadwal (misal: pengingat Subuh pukul 04.00)
- [ ] **Kustomisasi Aktivitas** — kemampuan menambah/menyembunyikan aktivitas tertentu
- [ ] **Target Harian Personal** — set target minimum aktivitas per hari
- [ ] **Profil Pengguna** — nama, foto, dan biodata singkat

### 🤝 Phase 3 — Komunitas & Sosial
- [ ] **Papan Peringkat (Leaderboard)** — kompetisi streak dengan teman/grup
- [ ] **Grup Mutabaah** — buat atau bergabung ke grup untuk saling memantau kemajuan
- [ ] **Pantau Bersama** — lihat progres anggota grup (dengan izin)
- [ ] **Berbagi Pencapaian** — share badge ke media sosial

### ☁️ Phase 4 — Cloud & Sinkronisasi
- [ ] **Full Cloud Sync** — sinkronisasi data dari IndexedDB ke Supabase secara otomatis
- [ ] **Multi-Device** — akses data yang sama dari HP dan laptop
- [ ] **Backup & Restore** — export/import data ibadah dalam format CSV/JSON
- [ ] **Riwayat Lengkap** — tampilan histori ibadah tanpa batas waktu

### 🧠 Phase 5 — AI & Fitur Cerdas
- [ ] **Insight Cerdas** — analisis pola ibadah dan saran peningkatan
- [ ] **Rekomendasi Badge Berikutnya** — "Kamu 2 hari lagi dari badge *Muqarrabun*!"
- [ ] **Laporan Bulanan Otomatis** — ringkasan PDF/email di akhir bulan

---

## 🤝 Kontribusi

Pull request sangat disambut! Untuk perubahan besar, buka *issue* terlebih dahulu untuk mendiskusikan perubahan yang diinginkan.

---

## 👤 Dibuat Oleh

**Fauzi Hizbullah**  
[fauzihiz.github.io](https://fauzihiz.github.io) · [GitHub @fauzihiz](https://github.com/fauzihiz)

---

## 📄 Lisensi

Proyek ini menggunakan lisensi **MIT** — lihat file [LICENSE](../LICENSE) untuk detail.

---

<div align="center">
  <sub>Semoga menjadi amal jariyah. بارك الله فيكم</sub>
</div>