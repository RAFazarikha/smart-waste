# Panduan & Naskah Video Demo (Maksimal 10 Menit)
**Posisi**: Fullstack Developer (Coding Test Bilcode Technology)  
**Kandidat**: <ISI>

---

## Pembagian Durasi & Rencana Tampilan Layar

| Menit | Segmen | Fokus Layar / Aksi | Poin Kunci yang Wajib Diucapkan |
|---|---|---|---|
| **00:00 - 01:30** | Pendahuluan & Arsitektur | VS Code / Diagram Arsitektur | Salam pembuka, perkenalan diri, gambaran 3 pilar: Web (Next.js), Mobile (Expo), ML (MobileNetV2 PyTorch + FastAPI), monorepo pnpm hoisted. |
| **01:30 - 03:30** | Machine Learning Showcase | Terminal / Postman / Grafik Evaluasi | Tunjukkan dataset (Garbage Classification Mostafa Mohamed), transfer learning MobileNetV2 (3 kelas: Organic, Plastic, Paper), hasil akurasi test 95.56%, confusion matrix, uji live endpoint `/predict` via FastAPI. |
| **03:30 - 06:15** | Mobile App (Pelapor Warga) | Emulator Android / Mirror HP Fisik | Register/Login user warga, tekan FAB "+ Laporkan Sampah", ambil foto sampah, tekan AI Detect (kategori otomatis terdeteksi & confidence score muncul), tunjukkan user tetap bisa ubah manual, tekan "Gunakan Lokasi Saat Ini" (GPS + reverse geocode), submit laporan, lihat di Riwayat (status awal: Pending). |
| **06:15 - 08:30** | Website Portal (Admin) | Browser Web (Next.js) | Login sebagai `admin@smartwaste.id`, Dashboard KPI & Charts (Recharts donut komposisi & bar tren 14 hari), tabel laporan (search real-time, filter status & kategori, pagination), buka detail laporan yang baru dibuat dari HP (foto, pin peta MapLibre, metadata AI), ubah status `Pending` -> `In Progress` -> `Completed` + catatan admin, sekilas halaman Manajemen Pengguna. |
| **08:30 - 09:30** | Sinkronisasi Real-time di HP | HP / Emulator Android | Tarik layar (pull-to-refresh) di tab Riwayat Mobile -> tunjukkan status laporan sudah berubah menjadi `Completed` beserta catatan admin yang tadi diketik di web. |
| **09:30 - 10:00** | Penutup | GitHub Repo & Master README | Tunjukkan sekilas kebersihan struktur kode monorepo, dokumen Swagger `/api-docs`, OpenAPI spec, dan ucapan terima kasih kepada tim rekrutmen Bilcode. |

---

## Tips Perekaman
1. Gunakan OBS Studio atau software screen recorder resolusi minimal 1080p.
2. Siapkan 2 jendela berdampingan saat menit 08:30 (kiri browser web admin, kanan emulator Android) agar efek perubahan status terlihat jelas dan instan.
3. Upload video ke YouTube sebagai **Unlisted** (atau Google Drive dengan izin "Anyone with link can view").
