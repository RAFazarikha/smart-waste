# Smart Waste Management System

Sistem pelaporan dan pengelolaan sampah: aplikasi mobile untuk warga (foto, GPS, deteksi jenis sampah dengan AI), portal web untuk admin, REST API, dan model klasifikasi gambar.

Dibuat untuk Technical Coding Test Bilcode Technology (Fullstack Developer).

## Arsitektur

```
apps/mobile (Expo RN) ──┐
                        ├──> apps/api (Express + Prisma) ──> Supabase (Postgres + Storage)
apps/web (Next.js) ─────┘            │
                                     └──> ml/api (FastAPI + MobileNetV2) /predict
packages/shared : tipe TS + skema Zod (dipakai api, web, mobile)
```

| Folder | Isi |
|---|---|
| `apps/api` | Express, TypeScript, Prisma, JWT, Swagger (`/api-docs`) |
| `apps/web` | Next.js 14, Tailwind, Recharts, Leaflet |
| `apps/mobile` | React Native (Expo SDK 51), kamera, GPS, SecureStore |
| `packages/shared` | Enum dan skema validasi Zod bersama |
| `ml/` | Training PyTorch (MobileNetV2), FastAPI inference, notebook Colab |
| `docs/` | `openapi.json`, `erd.md`, naskah video, template email |

## Prasyarat

- Node 20+ dan pnpm 11
- Python 3.10+ (untuk ML)
- Project Supabase (Postgres + bucket Storage publik bernama `reports`)
- Docker (untuk deploy API + ML)

## Menjalankan Lokal

```bash
pnpm install
cp .env.example .env          # isi DATABASE_URL, DIRECT_URL, JWT_SECRET, SUPABASE_*
pnpm db:generate
pnpm db:migrate               # buat tabel di Supabase
pnpm db:seed                  # 3 akun + 30 laporan contoh
pnpm --filter @smartwaste/shared build

pnpm dev:api                  # http://localhost:4000  (docs: /api-docs)
pnpm dev:web                  # http://localhost:3000
pnpm dev:mobile               # Expo (emulator Android / Expo Go)
```

Variabel environment:

| App | Variabel |
|---|---|
| root `.env` (API) | `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `ML_API_URL`, `PORT`, `CORS_ORIGIN` (opsional) |
| `apps/web` | `NEXT_PUBLIC_API_URL` (contoh: `http://localhost:4000/api`) |
| `apps/mobile` | `EXPO_PUBLIC_API_URL` (emulator Android: `http://10.0.2.2:4000/api`) |

Akun seed:

| Role | Email | Password |
|---|---|---|
| Admin | admin@smartwaste.id | Admin123! |
| User | user@smartwaste.id | User123! |
| User | budi@smartwaste.id | User123! |

Ganti password ini sebelum dipakai di luar demo.

## Machine Learning

Dataset: [Garbage Classification (Kaggle, mostafaabla)](https://www.kaggle.com/datasets/mostafaabla/garbage-classification). Kelas dipetakan ke 3 kategori: `biological` jadi Organic, `plastic` jadi Plastic, `paper` + `cardboard` jadi Paper. Diambil 400 gambar per kelas (1.200 total), split 70/15/15 dengan seed 42.

Model: MobileNetV2 pretrained ImageNet, head `Dropout(0.3) → Linear(128) → ReLU → Dropout(0.2) → Linear(3)`, AdamW lr 1e-4, batch 32, maks 20 epoch dengan early stopping (patience 4 pada val loss).

Training (disarankan di Colab GPU): buka `ml/notebooks/smart_waste_training.ipynb`, jalankan semua sel, unduh `smart_waste_ml_artifacts.zip`. Taruh `model.pth` di `ml/models/` dan file hasil evaluasi di `ml/results/`.

Atau lokal: `python ml/src/prepare_dataset.py <folder_dataset_mentah>` lalu `python ml/src/train.py` dari folder `ml/`.

Hasil evaluasi (akurasi test, confusion matrix, classification report): lihat `ml/results/`. Bagian ini diisi setelah training dijalankan.

Inference API:

```bash
cd ml && pip install -r requirements.txt
uvicorn api.main:app --port 8000        # jalankan dari folder ml/
curl http://localhost:8000/health
curl -F "file=@sampah.jpg" http://localhost:8000/predict
```

Urutan kelas mengikuti abjad (organic, paper, plastic), jadi `class_id` plastic adalah 2. Response `/predict` menyertakan `category` (nilai enum API).

## API

Dokumentasi interaktif: `/api-docs`. Spesifikasi: `docs/openapi.json`. Ringkasan:

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Laporan: `GET/POST /api/reports`, `GET/PATCH/PUT/DELETE /api/reports/:id`, `PATCH /api/reports/:id/status` (admin, menulis audit log)
- `GET /api/stats`, `GET /api/users`, `PATCH /api/users/:id/role`, `DELETE /api/users/:id` (admin)
- `POST /api/upload` (Supabase Storage), `POST /api/ai/classify` (proxy ke FastAPI)

Aturan akses: role `user` hanya melihat dan mengelola laporannya sendiri, `admin` melihat semua. Register selalu membuat role `user`.

## Database

Tiga tabel: `users`, `reports`, `report_status_logs`. ERD dan indeks di `docs/erd.md`, definisi di `apps/api/prisma/schema.prisma`.

## Deploy

- **API + ML**: `docker compose up -d --build` di VPS (butuh `.env` di root dan `ml/models/model.pth`). Postgres dan Storage tetap di Supabase.
- **Web**: Vercel, Root Directory `apps/web`, set `NEXT_PUBLIC_API_URL` ke URL API publik. Karena web di HTTPS, API juga harus HTTPS (reverse proxy) agar tidak diblokir mixed content.
- **APK**: dari `apps/mobile`, `eas login` lalu `EXPO_PUBLIC_API_URL=<url api> eas build -p android --profile preview`.

## Status Pengerjaan

Sudah diverifikasi: typecheck API, web, dan mobile; `next build` (9 rute); bundle Android via `expo export`; smoke test HTTP API (health, docs, guard auth, validasi, guard role).

Belum diverifikasi end-to-end (menunggu kredensial Supabase dan hasil training): migrasi dan seed ke database nyata, login dan alur laporan lewat UI, deteksi AI dari mobile, angka akurasi model, build APK, deploy.

## Catatan Keamanan

JWT disimpan di localStorage (web) dan SecureStore (mobile). Guard role di web hanya untuk UX, otorisasi sebenarnya ada di API. Upload dibatasi JPEG/PNG maksimal 5 MB.
