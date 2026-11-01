import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { CreateReportSchema, UpdateReportStatusSchema } from '@smartwaste/shared';
import { prisma, num } from '../db';
import { authenticate, requireRole, validate } from '../middlewares/auth';

export const reportsRouter = Router();
reportsRouter.use(authenticate);

const include = { user: { select: { id: true, name: true, email: true } } };

reportsRouter.get('/', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const { status, category, q, sort } = req.query as Record<string, string | undefined>;
  const where: Prisma.ReportWhereInput = {
    ...(req.user!.role !== 'admin' && { userId: req.user!.id }), // RBAC: user hanya lihat miliknya
    ...(status && { status: status as any }),
    ...(category && { category: category as any }),
    ...(q && { OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
    ] }),
  };
  const [total, rows] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.findMany({ where, include, skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: sort === 'oldest' ? 'asc' : 'desc' } }),
  ]);
  res.json({ data: rows.map(num), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

reportsRouter.post('/', validate(CreateReportSchema), async (req, res) => {
  const { ai_confidence, image_url, ...b } = req.body;
  const r = await prisma.report.create({
    data: { ...b, imageUrl: image_url, aiConfidence: ai_confidence, userId: req.user!.id }, include });
  res.status(201).json({ data: num(r) });
});

// Ambil laporan + cek kepemilikan; dipakai GET/PATCH/DELETE agar aturan akses satu tempat
async function owned(req: any, res: any) {
  const r = await prisma.report.findUnique({ where: { id: req.params.id } });
  if (!r) { res.status(404).json({ error: 'Laporan tidak ditemukan' }); return null; }
  if (req.user.role !== 'admin' && r.userId !== req.user.id) { res.status(403).json({ error: 'Akses ditolak' }); return null; }
  return r;
}

reportsRouter.get('/:id', async (req, res) => {
  if (!(await owned(req, res))) return;
  const r = await prisma.report.findUnique({ where: { id: req.params.id }, include: {
    ...include, logs: { orderBy: { createdAt: 'asc' }, include: { changedBy: { select: { name: true } } } } } });
  res.json({ data: num(r!) });
});

const editReport = async (req: any, res: any) => {
  const r = await owned(req, res); if (!r) return;
  if (req.user.role !== 'admin' && r.status !== 'pending')
    return res.status(403).json({ error: 'Hanya laporan pending yang bisa diedit' });
  const { ai_confidence, image_url, ...b } = req.body;
  const u = await prisma.report.update({ where: { id: r.id }, include, data: {
    ...b, ...(image_url && { imageUrl: image_url }), ...(ai_confidence != null && { aiConfidence: ai_confidence }) } });
  res.json({ data: num(u) });
};
const partial = validate(CreateReportSchema.partial());
reportsRouter.patch('/:id', partial, editReport);
reportsRouter.put('/:id', partial, editReport);

reportsRouter.delete('/:id', async (req, res) => {
  const r = await owned(req, res); if (!r) return;
  await prisma.report.delete({ where: { id: r.id } });
  res.status(204).end();
});

reportsRouter.patch('/:id/status', requireRole('admin'), validate(UpdateReportStatusSchema), async (req, res) => {
  const r = await prisma.report.findUnique({ where: { id: req.params.id } });
  if (!r) return res.status(404).json({ error: 'Laporan tidak ditemukan' });
  const { status, note } = req.body;
  // update + log atomik: audit trail tidak boleh terpisah dari perubahan status
  const [u] = await prisma.$transaction([
    prisma.report.update({ where: { id: r.id }, include, data: { status, adminNote: note ?? r.adminNote } }),
    prisma.reportStatusLog.create({ data: {
      reportId: r.id, changedByUserId: req.user!.id, fromStatus: r.status, toStatus: status, note } }),
  ]);
  res.json({ data: num(u) });
});
