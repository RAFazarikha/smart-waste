import 'express-async-errors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
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

// Express 4 tidak menangkap rejection async; bungkus di sini supaya 500 rapi, bukan proses mati
app.use((e: any, _q: Request, res: Response, _n: NextFunction) => {
  console.error(e);
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

if (require.main === module) app.listen(Number(process.env.PORT) || 4000, () => console.log('API :4000'));
