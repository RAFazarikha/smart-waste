import { Router } from 'express';
import { prisma } from '../db';
import { authenticate } from '../middlewares/auth';

export const statsRouter = Router();

statsRouter.get('/', authenticate, async (req, res) => {
  const where = req.user!.role === 'admin' ? {} : { userId: req.user!.id };
  const since = new Date(Date.now() - 13 * 864e5); since.setHours(0, 0, 0, 0);
  const [byStatus, byCat, recent] = await Promise.all([
    prisma.report.groupBy({ by: ['status'], where, _count: true }),
    prisma.report.groupBy({ by: ['category'], where, _count: true }),
    prisma.report.findMany({ where: { ...where, createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);
  const s = Object.fromEntries(byStatus.map(x => [x.status, x._count]));
  const trend: Record<string, number> = {};
  for (let i = 0; i < 14; i++) trend[new Date(since.getTime() + i * 864e5).toLocaleDateString('sv')] = 0;
  recent.forEach(r => { const k = r.createdAt.toLocaleDateString('sv'); if (k in trend) trend[k]++; });
  res.json({
    total_reports: byStatus.reduce((a, x) => a + x._count, 0),
    pending_count: s.pending ?? 0, in_progress_count: s.in_progress ?? 0,
    completed_count: s.completed ?? 0, rejected_count: s.rejected ?? 0,
    category_counts: { organic: 0, plastic: 0, paper: 0, ...Object.fromEntries(byCat.map(x => [x.category, x._count])) },
    daily_trends: Object.entries(trend).map(([date, count]) => ({ date, count })),
  });
});
