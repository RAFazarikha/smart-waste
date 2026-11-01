import 'express-async-errors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { Prisma } from '@prisma/client';
import { authRouter } from './routes/auth';
import { reportsRouter } from './routes/reports';
import { statsRouter } from './routes/stats';
import { usersRouter } from './routes/users';
import { mediaRouter } from './routes/media';
import swaggerUi from 'swagger-ui-express';
import { openapi } from './docs';

export const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
app.use(express.json());
app.get('/health', (_q, r) => { r.json({ status: 'ok' }); });
app.get('/openapi.json', (_q, r) => { r.json(openapi); });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/users', usersRouter);
app.use('/api', mediaRouter);

// 404 untuk rute yang tidak dikenal (setelah semua router)
app.use((_q, res) => { res.status(404).json({ error: 'Endpoint tidak ditemukan' }); });

// Penanganan error terpusat: pesan yang bisa ditampilkan UI, detail internal hanya di log
app.use((e: any, _q: Request, res: Response, _n: NextFunction) => {
  if (res.headersSent) return;
  if (e instanceof multer.MulterError)
    return void res.status(400).json({ error: e.code === 'LIMIT_FILE_SIZE' ? 'Ukuran file maksimal 5 MB' : 'Upload file gagal' });
  if (e?.type === 'entity.parse.failed') return void res.status(400).json({ error: 'Format JSON tidak valid' });
  if (e?.type === 'entity.too.large') return void res.status(413).json({ error: 'Data terlalu besar' });
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') return void res.status(409).json({ error: 'Data sudah ada' });
    if (e.code === 'P2025') return void res.status(404).json({ error: 'Data tidak ditemukan' });
    if (e.code === 'P2003') return void res.status(409).json({ error: 'Data masih terkait dengan data lain' });
  }
  if (e instanceof Prisma.PrismaClientInitializationError) {
    console.error(e);
    return void res.status(503).json({ error: 'Database tidak dapat dihubungi. Coba lagi nanti.' });
  }
  console.error(e);
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

if (require.main === module) app.listen(Number(process.env.PORT) || 4000, () => console.log('API :4000'));
