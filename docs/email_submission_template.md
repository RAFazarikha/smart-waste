# Template Email Pengumpulan Hasil Coding Test

**Kepada**: hiring@bilcode.id  
**Subjek**: Hasil Technical Coding Test - Fullstack Developer - <ISI: nama lengkap>

---

Yth. Tim Rekrutmen Bilcode Technology,

Terima kasih atas kesempatan yang diberikan kepada saya untuk mengikuti Technical Coding Test posisi **Fullstack Developer**.

Berikut saya lampirkan seluruh berkas dan tautan hasil pengerjaan studi kasus **Smart Waste Management System** sesuai dengan ketentuan yang dipersyaratkan:

1. **GitHub Repository**:  
   [https://github.com/RAFazarikha/smart-waste](https://github.com/RAFazarikha/smart-waste)  
   *(Source code lengkap: Web Next.js, Mobile React Native Expo, Backend Express TS + Prisma, dan Machine Learning PyTorch FastAPI)*

2. **Link Demo Website**:  
   <ISI: URL Vercel setelah deploy>  
   - Akun Admin: `admin@smartwaste.id` / `Admin123!`  
   - Akun User: `user@smartwaste.id` / `User123!`

3. **Link Unduh APK Android**:  
   <ISI: link APK dari EAS / GitHub Release setelah build>

4. **Dokumentasi API & Swagger**:  
   - Swagger UI Interaktif: `<ISI: http://IP-VPS:4000/api-docs setelah deploy>`  
   - OpenAPI 3.0 JSON Spec: [openapi.json](https://github.com/RAFazarikha/smart-waste/blob/main/docs/openapi.json)

5. **Database Schema & ERD**:  
   - Diagram ERD & Dokumentasi: [docs/erd.md](https://github.com/RAFazarikha/smart-waste/blob/main/docs/erd.md)  
   - Prisma Schema: [apps/api/prisma/schema.prisma](https://github.com/RAFazarikha/smart-waste/blob/main/apps/api/prisma/schema.prisma)

6. **Source Code & Model Machine Learning**:  
   - Folder ML: [ml/](https://github.com/RAFazarikha/smart-waste/blob/main/ml/)  
   - Script Training: `ml/src/train.py`  
   - Notebook Google Colab: `ml/notebooks/smart_waste_training.ipynb`  
   - FastAPI Inference Server: `ml/api/main.py`  
   - Bobot Model: `ml/models/model.pth` (MobileNetV2)

7. **Dataset & Sumber**:  
   - Kaggle Dataset: *Garbage Classification (12 classes)* oleh Mostafa Mohamed  
   - 3 Kategori Terpilih: Organic (biological), Plastic (plastic), Paper (paper + cardboard)  
   - Total data: 1.200 gambar (400 gambar/kelas, split 70% train / 15% val / 15% test, seed 42).

8. **Hasil Evaluasi Model**:  
   - Hasil lengkap tersimpan di folder `ml/results/` (Confusion Matrix Heatmap, Classification Report JSON, dan Training Curves).  
   - Akurasi Test Set: **<ISI: angka dari output train.py, syarat minimal 80%>**

9. **Video Walkthrough Demo (Maksimal 10 Menit)**:  
   <ISI: link video setelah direkam>

Seluruh arsitektur, panduan instalasi lokal, dan detail teknis telah saya rangkum pada file **README.md** di repositori.

Besar harapan saya untuk dapat melanjutkan ke tahap *Technical Interview* guna memaparkan arsitektur dan keputusan rekayasa sistem ini secara mendalam.

Hormat saya,  
**<ISI: nama lengkap>**  
GitHub: github.com/RAFazarikha
