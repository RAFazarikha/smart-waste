import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { authenticate } from '../middlewares/auth';

export const mediaRouter = Router();
mediaRouter.use(authenticate);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_r, f, cb) => cb(null, ['image/jpeg', 'image/png'].includes(f.mimetype)),
});
const env = (k: string) => { const v = process.env[k]; if (!v) throw new Error(`${k} belum diset`); return v; };

// Upload ke Supabase Storage via REST (tanpa SDK tambahan); bucket 'reports' harus public
mediaRouter.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File JPEG/PNG wajib (maks 5MB)' });
  const base = env('SUPABASE_URL'), bucket = process.env.SUPABASE_BUCKET || 'reports';
  const path = `${randomUUID()}.${req.file.mimetype === 'image/png' ? 'png' : 'jpg'}`;
  const r = await fetch(`${base}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('SUPABASE_SERVICE_KEY')}`, 'Content-Type': req.file.mimetype },
    body: new Uint8Array(req.file.buffer),
  });
  if (!r.ok) return res.status(502).json({ error: 'Upload storage gagal' });
  res.status(201).json({ url: `${base}/storage/v1/object/public/${bucket}/${path}` });
});

// Proxy ke FastAPI agar service ML tidak terekspos ke client
mediaRouter.post('/ai/classify', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File JPEG/PNG wajib (maks 5MB)' });
  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }), 'image');
  try {
    const r = await fetch(`${process.env.ML_API_URL || 'http://localhost:8000'}/predict`, { method: 'POST', body: form, signal: AbortSignal.timeout(15000) });
    res.status(r.status).json(await r.json());
  } catch { res.status(502).json({ error: 'Layanan AI tidak tersedia' }); }
});
