# 🛠️ Tukang On-Demand — Mobile Service Booking App

[![React Native](https://img.shields.io/badge/React_Native-0.88.1-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-58-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo Router](https://img.shields.io/badge/Expo_Router-v58-purple)](https://docs.expo.dev/router/introduction/)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-success)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Proyek Praktikum Pemrograman Mobile — Teknik Informatika, **Universitas Muhammadiyah Malang**.  
> Aplikasi mobile berbasis **React Native** & **Expo** untuk pencarian, pemesanan, dan manajemen jasa perbaikan rumah (*on-demand home services*) dengan arsitektur asynchronous dan modern state management.

---

## 📌 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
  - [Fitur Modul 2 (UI, State & Theme)](#1-fitur-modul-2-ui-state--theming)
  - [Fitur Modul 3 (Asynchronous & Networking)](#2-fitur-modul-3-asynchronous--networking)
- [Struktur Direktori Proyek](#-struktur-direktori-proyek)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Dokumentasi Latihan Asynchronous (`exercise.ts`)](#-dokumentasi-latihan-asynchronous-exercisets)
- [Kontributor](#-kontributor)

---

## 📖 Tentang Proyek

**Tukang On-Demand** adalah aplikasi penyedia jasa kebersihan, kelistrikan, servis AC, perbaikan pipa, dan pertukangan bangunan. Aplikasi ini dibangun dengan standar arsitektur bersih (*clean architecture*), memisahkan antara logika antarmuka (*presentation layer*), manajemen tema (*contexts*), serta layanan data jaringan (*service layer*).

Aplikasi ini mencakup penguasaan materi dari:
1. **Modul 2**: *Komponen Interaktif, State Management, Styling Dinamis, dan Navigasi.*
2. **Modul 3**: *Pemrograman Asynchronous, Objek Promise, Penanganan Error API, dan Reusable State UI.*
3. **Modul 4**: *Database Cloud & Autentikasi Supabase, Hardware Vault Keystore, Route Guard, dan Row Level Security (RLS).*

---

## ✨ Fitur Utama

### 1. Fitur Modul 2 (UI, State & Theming)
* **Katalog Tukang Lengkap**: Menampilkan daftar tukang berdasarkan spesialisasi, rating kepuasan, tarif per jam, dan lokasi.
* **Filter & Pencarian Instan**: 
  * Pencarian berbasis nama dan spesialisasi secara *real-time*.
  * Filter kategori dinamis (Semua, Kelistrikan, AC, Bangunan, Pipa, Cat, dll).
* **Mode Terang / Gelap (*Dark Mode*)**:
  * Menggunakan React Context API (`ThemeContext`) untuk manajemen tema global.
  * Tampilan responsif yang menyesuaikan palet warna secara otomatis.
* **Detail & Pemesanan (*Booking Flow*)**:
  * Layar rincian profil tukang (`app/worker/[id].tsx`).
  * Formulir pemesanan tanggal, alamat pengerjaan, dan estimasi biaya (`app/booking.tsx`).

### 2. Fitur Modul 3 (Asynchronous & Networking)
* **Pemrograman Asynchronous Modern**:
  * Pengambilan data menggunakan pola `async / await` dan Promise Chaining (`.then()`, `.catch()`, `.finally()`).
  * Simulasi latensi jaringan riil menggunakan helper `delay()`.
* **Pemisahan Lapisan Layanan (*Service Layer Architecture*)**:
  * `services/api.ts`: Klien API dasar untuk simulasi request HTTP (GET, POST, error handling).
  * `services/workerService.ts`: Mengisolasi logika bisnis pertukangan dan pemrosesan data sebelum dikonsumsi oleh layar UI.
* **Komponen Status UI Reaktif**:
  * `<Loading />`: Indikator loading yang bersih dan ramah pengguna selama proses pengambilan data berlangsung.
  * `<ErrorMessage />`: Penanganan kesalahan jaringan atau kegagalan API dengan opsi retry/muat ulang.

### 3. Fitur Modul 4 (Database Cloud & Autentikasi Supabase)
* **Autentikasi & Brankas Kunci Perangkat Keras (*Hardware Vault*)**:
  * Layar Masuk (`app/(auth)/login.tsx`) dan Pendaftaran (`app/(auth)/register.tsx`) dengan metadata pengguna (Nama Lengkap, Nomor HP, Role).
  * Penyimpanan sesi terenkripsi via `ExpoSecureStoreAdapter` (`expo-secure-store` pada Android/iOS dan `localStorage` pada Web).
* **Manajemen Sesi Global & Route Guard**:
  * `contexts/AuthContext.tsx` dengan rehidrasi sesi otomatis (`getSession()`) dan pendengar real-time (`onAuthStateChange()`).
  * Gatekeeper navigasi pada `app/_layout.tsx`: Pengguna belum login otomatis diarahkan ke Login, sedangkan pengguna login dipersilakan mengakses katalog.
* **Database Cloud PostgreSQL & Row Level Security (RLS)**:
  * Tabel `bookings` di Supabase untuk mencatat seluruh pemesanan jasa tukang secara terpusat di cloud.
  * Kebijakan RLS (`auth.uid() = user_id`) menjamin isolasi data mutlak: Pelanggan hanya dapat melihat dan mengelola pesanannya sendiri (*enterprise multitenancy*).
* **Layar Riwayat Pesanan (`app/my-bookings.tsx`)**:
  * Operasi CRUD lengkap: Mengambil daftar pesanan (`SELECT`), membatalkan status pesanan (`UPDATE`), dan menghapus riwayat (`DELETE`).
  * Dilengkapi **Optimistic UI** (respons instan) dan **Pull-to-Refresh** (`RefreshControl`).

---

## 📂 Struktur Direktori Proyek

```text
PemMob-Project/
├── app/                        # Direktori rute berbasis berkas (Expo Router)
│   ├── _layout.tsx             # Root layout & ThemeProvider wrapper
│   ├── index.tsx               # Layar beranda utama (Daftar Tukang & Filter)
│   ├── booking.tsx             # Layar formulir pemesanan jasa
│   ├── settings.tsx            # Pengaturan tema dan profil aplikasi
│   └── worker/
│       └── [id].tsx            # Layar detail profil tukang (Dynamic Route)
├── components/                 # Komponen UI modular yang dapat digunakan kembali
│   ├── ErrorMessage.tsx        # Komponen penanganan error state
│   └── Loading.tsx             # Komponen indikator loading
├── constants/                  # Konstanta statis & data awal
│   └── workers.ts              # Data dummy spesialisasi & daftar tukang
├── contexts/                   # State global aplikasi
│   └── ThemeContext.tsx        # Konteks Dark/Light mode theme
├── services/                   # Lapisan logika data & pemanggilan API
│   ├── api.ts                  # Mock HTTP client & request handlers
│   └── workerService.ts        # Business logic fetching & data mapper
├── types/                      # Definisi tipe TypeScript
│   └── api.ts                  # Interface respons API & model data
├── utils/                      # Helper & utilitas umum
│   └── delay.ts                # Fungsi delay berbasis Promise
├── assets/                     # Aset gambar, font, dan ikon
├── exercise.ts                 # Script latihan resmi Asynchronous Modul 3
├── app.json                    # Konfigurasi aplikasi Expo
├── package.json                # Dependensi proyek
└── tsconfig.json               # Konfigurasi TypeScript
```

---

## 🚀 Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| **Framework Mobile** | React Native `0.88.1` |
| **Platform Runtime** | Expo SDK `58.0.0` |
| **Language** | TypeScript `6.0.3` |
| **Routing** | Expo Router `v58` (File-based Navigation) |
| **Icon Library** | `@expo/vector-icons` (Ionicons) |
| **State Management** | React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`) & Context API |
| **Styling** | React Native StyleSheet dengan dynamic color tokens |

---

## 💻 Panduan Instalasi & Menjalankan

### Prasyarat
* [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
* Ponsel Android/iOS dengan aplikasi **Expo Go** terpasang, ATAU emulator Android Studio.

### Langkah Instalasi

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/AsanAnta/PemMob-Project.git
   cd PemMob-Project
   ```

2. **Pasang Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembang**:
   ```bash
   npx expo start -c
   ```

4. **Buka Aplikasi**:
   * **Di Ponsel Nyata**: Pindai QR Code yang muncul di terminal menggunakan kamera (iOS) atau aplikasi Expo Go (Android).
   * **Di Web Browser**: Tekan tombol `w` di terminal.
   * **Di Android Emulator**: Tekan tombol `a` di terminal.

---

## 🧪 Dokumentasi Latihan Asynchronous (`exercise.ts`)

File [exercise.ts](file:///c:/Users/LENOVO/Documents/Semester%205%20Pemrogaman%20Mobile/Praktikum/Project_mobile/PemMob-Project-main%20-modul3/PemMob-Project-main/exercise.ts) mendemonstrasikan konsep dasar dan lanjutan pemrograman asynchronous JavaScript/TypeScript:

1. **Perbedaan Synchronous vs Asynchronous**:
   - Membandingkan eksekusi baris per baris yang memblokir alur (*blocking*) dengan eksekusi berbasis Event Loop (*non-blocking*).
2. **Pembuatan Objek Promise**:
   - Pola `new Promise((resolve, reject) => ...)` untuk menangani operasi yang membutuhkan waktu tunggu.
3. **Simulasi Penanganan Kesalahan**:
   - Validasi data ID tukang: Mengembalikan data pahlawan/tukang jika ID valid (`resolve`), atau melempar `Error` deskriptif jika tidak ditemukan (`reject`).
4. **Agregasi Data Paralel**:
   - Menggabungkan data profil tukang dengan statistik kepuasan kerja secara asinkron.

Untuk menjalankan file latihan ini secara terpisah melalui terminal Node.js:
```bash
npx ts-node exercise.ts
# atau
node exercise.ts
```

---

## 👤 Kontributor

* **Nama**: Asan Anta
* **Institusi**: Teknik Informatika — Universitas Muhammadiyah Malang (UMM)
* **GitHub**: [@AsanAnta](https://github.com/AsanAnta)

---

⭐ *Jika proyek ini bermanfaat, jangan lupa berikan bintang (star) di repositori ini!*
