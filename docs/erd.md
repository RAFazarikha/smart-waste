# Entity Relationship Diagram (ERD) - Smart Waste System

```mermaid
erDiagram
    users ||--o{ reports : "membuat (1:N)"
    users ||--o{ report_status_logs : "mengubah_status (1:N)"
    reports ||--o{ report_status_logs : "riwayat_audit (1:N)"

    users {
        uuid id PK "default uuid()"
        varchar(100) name "Nama lengkap"
        varchar(150) email UK "Email unik login"
        varchar(255) password_hash "Bcrypt hash"
        enum role "admin | user (default user)"
        varchar(25) phone "Nomor telepon (opsional)"
        timestamptz created_at "Waktu pendaftaran"
        timestamptz updated_at "Waktu update"
    }

    reports {
        uuid id PK "default uuid()"
        uuid user_id FK "Relasi ke users.id (CASCADE)"
        varchar(150) title "Judul laporan sampah"
        text description "Deskripsi detail kondisi"
        enum category "organic | plastic | paper"
        numeric(5,4) ai_confidence "Skor akurasi AI (0.0000 - 1.0000)"
        text image_url "URL gambar publik di Supabase Storage"
        numeric(10,7) latitude "Koordinat lintang GPS"
        numeric(10,7) longitude "Koordinat bujur GPS"
        text address "Nama jalan / reverse geocoding"
        enum status "pending | in_progress | completed | rejected"
        text admin_note "Catatan tindak lanjut dari admin"
        timestamptz created_at "Waktu laporan dibuat"
        timestamptz updated_at "Waktu laporan diupdate"
    }

    report_status_logs {
        uuid id PK "default uuid()"
        uuid report_id FK "Relasi ke reports.id (CASCADE)"
        uuid changed_by_user_id FK "Relasi ke users.id (Admin pengubah)"
        enum from_status "Status sebelum diubah"
        enum to_status "Status setelah diubah"
        text note "Alasan / catatan perubahan status"
        timestamptz created_at "Waktu perubahan status"
    }
```

### Indeks Optimasi Database
- `CREATE INDEX idx_reports_user_id ON reports(user_id);` (Akselerasi filter laporan milik pengguna)
- `CREATE INDEX idx_reports_status ON reports(status);` (Akselerasi filter status pending/in_progress/selesai)
- `CREATE INDEX idx_reports_category ON reports(category);` (Akselerasi agregasi komposisi sampah)
- `CREATE INDEX idx_reports_created_at ON reports(created_at DESC);` (Akselerasi sorting laporan terbaru)
