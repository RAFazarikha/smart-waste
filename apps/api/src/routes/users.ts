import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { authenticate, requireRole, validate } from '../middlewares/auth';

export const usersRouter = Router();
usersRouter.use(authenticate, requireRole('admin'));

usersRouter.get('/', async (_req, res) => {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { reports: true } } } });
  res.json({ data: rows.map(({ passwordHash, _count, ...u }) => ({ ...u, report_count: _count.reports })) });
});

usersRouter.patch('/:id/role', validate(z.object({ role: z.enum(['admin', 'user']) })), async (req, res) => {
  if (req.params.id === req.user!.id) return res.status(400).json({ error: 'Tidak bisa mengubah role sendiri' });
  try {
    const { passwordHash, ...u } = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
    res.json({ data: u });
  } catch { res.status(404).json({ error: 'User tidak ditemukan' }); }
});

usersRouter.delete('/:id', async (req, res) => {
  if (req.params.id === req.user!.id) return res.status(400).json({ error: 'Tidak bisa menghapus akun sendiri' });
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e: any) {
    // P2003: user masih menjadi pengubah status di audit log (FK tanpa cascade)
    res.status(e.code === 'P2003' ? 409 : 404).json({ error: e.code === 'P2003' ? 'User punya riwayat perubahan status' : 'User tidak ditemukan' });
  }
});
