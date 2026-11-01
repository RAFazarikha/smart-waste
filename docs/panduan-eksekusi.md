# Panduan Eksekusi Teknis: Smart Waste System

Dokumen ini berisi langkah konkret yang harus **kamu (Rakha)** lakukan untuk menyelesaikan proyek ini sebelum deadline **Jumat, 6 November 2026**.

Seluruh fondasi kode di repo (`apps/api`, `apps/web`, `apps/mobile`, `packages/shared`, `ml/`) sudah selesai dibangun dan lolos compile/typecheck. Bagian di bawah ini adalah hal-hal yang membutuhkan kredensial akun, GPU, atau aksi manualmu.

---

## Tahap 1: Setup Supabase Database & Storage (Estimasi: 15 menit)

1. Buka [database.new](https://database.new) dan buat project baru di **Supabase** (misal: `smart-waste-db`).
2. Masuk ke menu **Storage** di sidebar Supabase:
   - Buat bucket baru bernama `reports`.
   - Centang opsi **Public bucket** (agar gambar laporan bisa diakses via URL publik).
3. Masuk ke menu **Project Settings > Database**:
   - Salin **Connection string (URI)** mode _Transaction pooler_ (port 6543) -> masukkan ke `DATABASE_URL`.
   - Salin **Connection string (URI)** mode _Direct connection_ (port 5432) -> masukkan ke `DIRECT_URL`.
4. Masuk ke **Project Settings > API**:
   - Salin **Project URL** -> masukkan ke `SUPABASE_URL`.
   - Salin **service_role (secret)** key -> masukkan ke `SUPABASE_SERVICE_KEY`.
5. Di mesin lokal, buat file `.env` di root `~/Projects/smart-waste`:
   ```bash
   cd ~/Projects/smart-waste
   cp .env.example .env
   # Buka .env dan isi nilai-nilai yang didapat di atas
   # Buat string acak untuk JWT_SECRET, contoh: openssl rand -hex 32
   ```
6. Jalankan migrasi dan seed database:
   ```bash
   pnpm db:migrate    # membuat tabel users, reports, report_status_logs
   pnpm db:seed       # mengisi 3 akun + 30 laporan dummy realistis
   ```

---

## Tahap 2: Training ML di Google Colab (Estimasi: 20 menit)

1. Buka [Google Colab](https://colab.research.google.com).
2. Upload file notebook: `~/Projects/smart-waste/ml/notebooks/smart_waste_training.ipynb`.
3. Ganti runtime ke GPU: **Runtime > Change runtime type > T4 GPU**.
4. Di sel pertama: upload file `kaggle.json` akunmu (atau isi username dan API key).
5. Jalankan semua sel (**Runtime > Run all**):
   - Script akan otomatis mendownload dataset `mostafaabla/garbage-classification`.
   - Mengambil 400 gambar/kelas untuk 3 kategori (Organic, Plastic, Paper).
   - Melakukan training MobileNetV2 selama 15–20 epoch dengan early stopping.
   - Menghitung akurasi test, membuat confusion matrix, classification report, dan grafik training.
   - Mengompres seluruh artefak ke file `/content/smart_waste_ml_artifacts.zip`.
6. Unduh file `smart_waste_ml_artifacts.zip` dari Colab ke komputermu.
7. Ekstrak hasilnya ke dalam folder repo:
   - File `model.pth` dipindahkan ke `~/Projects/smart-waste/ml/models/model.pth`.
   - File-file evaluasi (`confusion_matrix.png`, `classification_report.json`, `training_curves.png`) dipindahkan ke `~/Projects/smart-waste/ml/results/`.
8. Catat angka akurasi test akhir yang dicetak di output sel (misal: 88.5%). Angka ini akan dipakai saat wawancara dan diisi ke template email pengumpulan.
9. Commit bobot model ke git:
   ```bash
   cd ~/Projects/smart-waste
   git add -f ml/models/model.pth ml/results/
   git commit -m "feat(ml): bobot model MobileNetV2 dan hasil evaluasi testing"
   ```

---

## Tahap 3: Uji Coba Lokal End-to-End (Estimasi: 15 menit)

1. Jalankan inference server ML:
   ```fish
   cd ~/Projects/smart-waste/ml
   source venv/bin/activate.fish
   pip install -r requirements.txt
   uvicorn api.main:app --port 8000
   ```
2. Di terminal baru, jalankan Backend API Express:
   ```bash
   cd ~/Projects/smart-waste
   pnpm dev:api
   # Buka http://localhost:4000/api-docs di browser untuk verifikasi Swagger
   ```
3. Di terminal baru, jalankan Portal Web Next.js:
   ```bash
   cd ~/Projects/smart-waste
   pnpm dev:web
   # Buka http://localhost:3000
   # Login sebagai Admin: admin@smartwaste.id / Admin123!
   # Cek Dashboard statistik, filter laporan, dan modal detail
   ```
4. Di terminal baru, jalankan Mobile Expo:
   ```bash
   cd ~/Projects/smart-waste
   pnpm dev:mobile
   # Tekan 'a' untuk buka di Android Emulator (atau scan QR via Expo Go di HP)
   # Coba alur: Buat Laporan -> Foto -> AI Detect -> Lokasi -> Kirim
   ```

---

## Tahap 4: Deploy ke VPS Nala & Vercel (Estimasi: 30 menit)

### A. Backend & ML di VPS Nala (Docker Compose)

1. Push repo lokal ke GitHub pribadimu:
   ```bash
   git remote add origin git@github.com:RAFazarikha/smart-waste.git
   git push -u origin main
   ```
2. Di VPS Nala, clone repo dan siapkan `.env`:
   ```bash
   git clone git@github.com:RAFazarikha/smart-waste.git
   cd smart-waste
   cp .env.example .env && nano .env # isi kredensial Supabase
   docker compose up -d --build
   ```
3. Pasang reverse proxy (Nginx / Caddy) di VPS agar API dan docs bisa diakses publik dengan HTTPS:
   - Misal domain: `https://api-waste.rachmadazizfazarikha.my.id`
   - Test akses: `curl https://<domain-kamu>/health` -> `{"status":"ok"}`

### B. Portal Web di Vercel

1. Masuk ke dashboard [Vercel](https://vercel.com) > **Add New Project**.
2. Pilih repo `smart-waste`.
3. Set **Root Directory** ke `apps/web`.
4. Tambahkan Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://<domain-api-vps>/api`
5. Klik **Deploy**. (Domain otomatis didapat: misal `smart-waste-web.vercel.app`).

### C. Build APK Android via EAS

1. Dari folder mobile:
   ```bash
   cd ~/Projects/smart-waste/apps/mobile
   # Pastikan sudah install eas-cli: npm i -g eas-cli
   eas login
   EXPO_PUBLIC_API_URL="https://<domain-api-vps>/api" eas build -p android --profile preview
   ```
2. Tunggu proses build cloud selesai (~10-15 menit). Unduh file `.apk` yang dihasilkan, install di HP Android fisik untuk pengujian langsung.

---

## Tahap 5: Rekam Video Demo & Pengumpulan (Estimasi: 45 menit)

1. Buka naskah video di `docs/video_script.md`.
2. Rekam layar komputer menggunakan OBS Studio (resolusi 1080p, durasi maksimal 10 menit):
   - Siapkan browser web (Next.js Admin) dan emulator/mirroring HP berdampingan.
   - Ikuti alur menit demi menit yang ada di naskah.
3. Upload video ke YouTube dengan visibilitas **Unlisted** (atau Google Drive dengan izin akses publik).
4. Buka template email di `docs/email_submission_template.md`:
   - Ganti placeholder yang bertanda `<ISI: ...>` dengan link Vercel, link APK, link video, dan hasil akurasi model.
5. Kirim balasan email ke `hiring@bilcode.id`.
