# Paket Pembuatan Video Demo Walkthrough via Claude

Gunakan instruksi ini di Claude (Artifacts / Remotion / Script Generator) untuk membuat bahan presentasi atau video demo teknis otomatis.

---

## 1. Prompt untuk Claude (Copy-Paste)

```text
Saya adalah Rachmad Aziz Fazarikha, kandidat Fullstack Developer untuk Technical Coding Test di Bilcode Technology.
Saya telah membangun sistem "Smart Waste Management System" (Monorepo fullstack: Web Next.js, Mobile React Native Expo, Backend Express TypeScript + Prisma, dan ML PyTorch MobileNetV2 + FastAPI).

Tolong buatkan [pilih: slide presentasi HTML interaktif / kode animasi Remotion React / naskah dubbing per adegan] berdurasi maksimal 8-10 menit.
Fokus pada engineering decision, kualitas arsitektur monorepo, AI inference flow, dan integrasi end-to-end.

Spesifikasi Data & Link:
- Kandidat: Rachmad Aziz Fazarikha
- Posisi: Fullstack Developer
- GitHub: https://github.com/RAFazarikha/smart-waste
- Web Demo: https://smart-waste-six-chi.vercel.app/ (Akun admin: admin@smartwaste.id / Admin123!)
- API Production & Health: https://smart-waste.rachmadazizfazarikha.my.id/health
- Swagger Docs: https://smart-waste.rachmadazizfazarikha.my.id/api-docs
- APK Android: https://expo.dev/artifacts/eas/fB_Mz0w7iHQfE1PwgMjnd6_EbdYwipB7L4sWRgkXsA4.apk
- Akurasi ML: MobileNetV2, 95.56% test accuracy (Overall 172/180). Precision: Organic 98.3%, Paper 98.2%, Plastic 90.9%. Recall: Organic 96.7%, Paper 90.0%, Plastic 100%.
```

---

## 2. Rencana Adegan & Daftar Tangkapan Layar (Screenshots List)

Siapkan file-file gambar/layar berikut untuk dimasukkan ke Claude atau video editor:

| No | Nama Screenshot / Layar | URL / Sumber File di Repo | Yang Ditonjolkan |
|---|---|---|---|
| 1 | **Hero & Arsitektur Monorepo** | Web root (`/`) & folder tree VS Code | Visual modern landing page, struktur `apps/`, `packages/shared`, `ml/`. |
| 2 | **Grafik Pelatihan & Matrix ML** | `ml/results/confusion_matrix.png` & `training_curves.png` | Bukti validasi training PyTorch, akurasi 95.56%, confusion matrix. |
| 3 | **Dokumentasi API Swagger** | `https://smart-waste.rachmadazizfazarikha.my.id/api-docs` | 16 operasi endpoint (12 paths), skema JWT Bearer, OpenAPI 3.0. |
| 4 | **Aplikasi Mobile (Form Laporan)** | Buka APK di Android / Expo | Tombol "AI Detect" dengan confidence score, GPS reverse geocode, kamera. |
| 5 | **Aplikasi Mobile (Riwayat)** | Tab Riwayat di Mobile | Badge status `Pending`, `In Progress`, `Completed`, pull-to-refresh. |
| 6 | **Dashboard Web Admin** | `https://smart-waste-six-chi.vercel.app/admin/dashboard` | KPI card, Recharts donut komposisi sampah, tren laporan 14 hari. |
| 7 | **Detail Laporan & Peta Web** | Halaman `/admin/reports/[id]` | Preview foto sampah, pin MapLibre GL, log audit status, form update status. |
| 8 | **Sinkronisasi Web-ke-Mobile** | Split screen Web Admin + Mobile Screen | Update status di web langsung ter-update di riwayat aplikasi mobile. |

---

## 3. Naskah Voice-Over / Presenter (Scene-by-Scene Script)

### Scene 1: Pendahuluan & Arsitektur (00:00 - 01:15)
- **Tampilan**: Landing page web + diagram arsitektur monorepo.
- **Audio/Narasi**:
  > "Halo tim rekrutmen Bilcode Technology, saya Rachmad Aziz Fazarikha. Hari ini saya mempresentasikan hasil technical test saya: Smart Waste Management System. Sistem ini saya rancang dengan arsitektur monorepo menggunakan pnpm workspace: backend REST API Express TypeScript dengan Prisma ORM, web portal Next.js 16, mobile app React Native Expo, dan microservice machine learning berbasis FastAPI."

### Scene 2: Microservice ML & Evaluasi (01:15 - 03:00)
- **Tampilan**: Confusion matrix heatmap, grafik loss/akurasi, dan Swagger endpoint `/api/ai/classify`.
- **Audio/Narasi**:
  > "Untuk modul AI, saya menggunakan transfer learning MobileNetV2 dari dataset Garbage Classification Kaggle yang dipetakan ke 3 kelas: Organic, Paper, dan Plastic. Dengan total 1.200 sampel berimbang, model mencapai akurasi testing 95.56%. Inference dilayani via FastAPI mandiri dan di-proxy secara aman melalui backend utama."

### Scene 3: Alur Mobile Pelapor Sampah (03:00 - 05:30)
- **Tampilan**: Rekaman layar mobile app (Login -> Buat Laporan -> AI Detect -> Ambil Lokasi -> Submit).
- **Audio/Narasi**:
  > "Pada sisi warga, aplikasi mobile menyediakan alur pelaporan cepat. Pengguna mengambil foto sampah, menekan AI Detect untuk klasifikasi otomatis beserta skor confidence, mengunci koordinat GPS dan alamat presisi, lalu mengirim laporan. Laporan masuk dengan status awal Pending."

### Scene 4: Web Admin & Real-time Workflow (05:30 - 08:00)
- **Tampilan**: Dashboard Admin, tabel laporan, detail laporan dengan MapLibre peta satelit, ubah status ke Completed.
- **Audio/Narasi**:
  > "Di sisi operasional, admin mengakses dashboard analytics untuk memantau komposisi dan tren sampah harian. Admin dapat memfilter laporan, membuka detail untuk melihat titik lokasi pada peta interaktif, dan mengubah status menjadi In Progress hingga Completed dengan catatan tindak lanjut yang tercatat rapi di tabel audit log."

### Scene 5: Verifikasi Sinkronisasi & Penutup (08:00 - 09:00)
- **Tampilan**: Layar riwayat mobile ditarik refresh (status berubah Completed) -> halaman GitHub repo.
- **Audio/Narasi**:
  > "Ketika warga melakukan refresh di aplikasi mobile, status langsung tersinkronisasi menjadi Completed lengkap dengan catatan dari admin. Seluruh sistem telah dideploy di VPS dan Vercel, serta terdokumentasi lengkap di Swagger dan README. Terima kasih atas perhatiannya."
