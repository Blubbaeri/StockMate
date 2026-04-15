# StockMate 📦

Aplikasi inventaris modern bergaya Clean Light (Apple-inspired), dibangun dengan **React Native + Expo**.

---

## 🚀 Quick Start

### 1. Buat project Expo baru

Buka terminal di folder tujuanmu (contoh: `C:\Files from laptop\MyProject`):

```bash
npx create-expo-app@latest -y stockmate
cd stockmate
```

### 2. Install dependensi tambahan

```bash
npx expo install expo-linear-gradient expo-blur react-native-safe-area-context react-native-screens @expo/vector-icons
```

### 3. Salin semua file dari project ini

Salin file-file berikut ke dalam folder `stockmate/` yang baru dibuat:

```
stockmate/
├── app/
│   ├── _layout.jsx          ← Expo Router layout
│   └── index.jsx            ← Entry point
├── components/
│   ├── Header.jsx           ← Judul + search bar
│   ├── CategoryFilter.jsx   ← Chip filter kategori
│   ├── SummaryCards.jsx     ← Kartu ringkasan stok
│   ├── InventoryItem.jsx    ← Card item barang
│   ├── BottomTab.jsx        ← Tab navigasi bawah
│   └── EmptyState.jsx       ← Tampilan kosong
├── constants/
│   └── theme.js             ← Design system (warna, tipografi, spacing)
├── data/
│   └── inventory.js         ← Data dummy + helper functions
├── screens/
│   └── InventoryScreen.jsx  ← Layar utama inventaris
└── app.json                 ← Konfigurasi Expo
```

### 4. Jalankan aplikasi

```bash
npx expo start
```

Pilih salah satu:
- Tekan `w` → buka di **browser** (web preview)
- Scan QR Code → buka di **Expo Go** di HP kamu
- Tekan `a` → buka di **Android Emulator**
- Tekan `i` → buka di **iOS Simulator** (Mac only)

---

## 📱 Fitur MVP

| Fitur | Status |
|---|---|
| Daftar barang dengan kartu premium | ✅ |
| Pencarian real-time (nama & SKU) | ✅ |
| Filter kategori (chip horizontal) | ✅ |
| Label status stok (tersedia/hampir habis/habis) | ✅ |
| Kartu ringkasan statistik stok | ✅ |
| Animasi fade-in tiap item | ✅ |
| Spring animation saat tekan kartu | ✅ |
| Pull-to-refresh | ✅ |
| Bottom navigation bar | ✅ |
| Safe area support (notch/island) | ✅ |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Tema | Clean Light (Apple-inspired) |
| Background utama | `#F2F2F7` (iOS System Gray 6) |
| Surface (card) | `#FFFFFF` |
| Aksen | `#007AFF` (Apple Blue) |
| Font weight | 400 / 600 / 700 |
| Radius kartu | 16px |

---

## 📁 Struktur Folder (Lengkap)

```
stockmate/
├── app/                    # Expo Router pages
├── components/             # Reusable UI components
├── constants/              # Theme, colors, typography
├── data/                   # Mock data + helpers
├── screens/                # Screen-level components
├── assets/                 # Icons, splash, images
├── app.json                # Expo config
├── babel.config.js         # Babel config
└── package.json            # Dependencies
```

---

## 🔮 Roadmap (Fase Berikutnya)

- [ ] Detail screen per barang
- [ ] Tambah / Edit / Hapus barang (CRUD)
- [ ] Barcode scanner (expo-barcode-scanner)
- [ ] Export laporan ke PDF/Excel
- [ ] Notifikasi stok hampir habis
- [ ] Login / autentikasi user
- [ ] Sinkronisasi data ke cloud (Supabase / Firebase)
"# StockMate" 
