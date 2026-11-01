import 'dotenv/config';
import { PrismaClient, Category, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
// Titik sekitar Surabaya/Sidoarjo/Gresik
const SPOTS: [string, number, number][] = [
  ['Jl. Ahmad Yani, Surabaya', -7.3125, 112.7345], ['Jl. Raya Darmo, Surabaya', -7.2893, 112.7390],
  ['Jl. Rungkut Industri, Surabaya', -7.3340, 112.7680], ['Jl. Diponegoro, Sidoarjo', -7.4478, 112.7183],
  ['Jl. Pahlawan, Sidoarjo', -7.4458, 112.7172], ['Jl. Veteran, Gresik', -7.1560, 112.6550],
  ['Jl. Usman Sadar, Gresik', -7.1610, 112.6560], ['Jl. Mayjen Sungkono, Surabaya', -7.2915, 112.7180],
];
const TITLES: Record<Category, string[]> = {
  organic: ['Tumpukan sisa sayur pasar', 'Sampah daun menumpuk', 'Sisa makanan di pinggir jalan'],
  plastic: ['Botol plastik di selokan', 'Kantong kresek menumpuk', 'Gelas plastik berserakan'],
  paper: ['Kardus bekas menumpuk', 'Kertas bekas di trotoar', 'Tumpukan karton toko'],
};
// 8 pending, 7 in_progress, 12 completed, 3 rejected = 30
const STATUSES: Status[] = [...Array(8).fill('pending'), ...Array(7).fill('in_progress'),
  ...Array(12).fill('completed'), ...Array(3).fill('rejected')];
const CATS: Category[] = ['organic', 'plastic', 'paper'];
const IMG: Record<Category, string> = {
  organic: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
  plastic: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
  paper: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800',
};

async function main() {
  const hash = (p: string) => bcrypt.hashSync(p, 10);
  const mk = (email: string, name: string, role: 'admin' | 'user', pw: string) =>
    prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash: hash(pw) } });
  const admin = await mk('admin@smartwaste.id', 'Admin Smart Waste', 'admin', 'Admin123!');
  const users = [await mk('user@smartwaste.id', 'Siti Warga', 'user', 'User123!'),
                 await mk('budi@smartwaste.id', 'Budi Santoso', 'user', 'User123!')];

  if ((await prisma.report.count()) > 0) return console.log('Seed dilewati: laporan sudah ada');

  for (let i = 0; i < STATUSES.length; i++) {
    const cat = CATS[i % 3], [address, lat, lng] = SPOTS[i % SPOTS.length];
    const status = STATUSES[i];
    const created = new Date(Date.now() - (i % 14) * 864e5 - i * 36e5);
    const r = await prisma.report.create({ data: {
      userId: users[i % 2].id, title: TITLES[cat][i % 3], category: cat, status, address,
      description: `Laporan ${TITLES[cat][i % 3].toLowerCase()} di ${address}, mohon segera ditangani.`,
      aiConfidence: +(0.82 + (i % 17) * 0.01).toFixed(4), imageUrl: IMG[cat],
      latitude: lat + (i % 5) * 0.0007, longitude: lng + (i % 4) * 0.0007, createdAt: created,
      adminNote: status === 'pending' ? null : status === 'rejected' ? 'Foto tidak menunjukkan sampah' : 'Ditangani petugas',
    } });
    if (status !== 'pending') {
      const path: Status[] = status === 'rejected' ? ['rejected'] : status === 'in_progress' ? ['in_progress'] : ['in_progress', 'completed'];
      let from: Status = 'pending';
      for (const to of path) {
        await prisma.reportStatusLog.create({ data: { reportId: r.id, changedByUserId: admin.id, fromStatus: from, toStatus: to, note: r.adminNote } });
        from = to;
      }
    }
  }
  console.log('Seed selesai: 3 user, 30 laporan');
}
main().finally(() => prisma.$disconnect());
