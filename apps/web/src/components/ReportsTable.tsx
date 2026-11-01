'use client';
import { useCallback, useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { fmtDate } from '@/lib/ui';
import { CategoryBadge, StatusBadge } from './Badge';
import ReportModal from './ReportModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ReportsTable({ admin }: { admin: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [toDelete, setToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [dq, setDq] = useState('');
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 300); return () => clearTimeout(t); }, [q]);

  const load = useCallback(() => {
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (dq) p.set('q', dq); if (status) p.set('status', status); if (category) p.set('category', category);
    apiFetch(`/reports?${p}`).then((r) => { setRows(r.data); setMeta(r.meta); setErr(''); }).catch((e) => setErr(e.message));
  }, [page, dq, status, category]);
  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true); setErr('');
    try { await apiFetch(`/reports/${toDelete.id}`, { method: 'DELETE' }); setToDelete(null); load(); }
    catch (e: any) { setErr(e.message); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{admin ? 'Manajemen Laporan' : 'Laporan Saya'}</h1>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" aria-hidden />
          <Input aria-label="Cari laporan" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul, deskripsi, pelapor..." className="pl-9" />
        </div>
        <Select aria-label="Filter status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Semua status</option><option value="pending">Pending</option><option value="in_progress">In Progress</option>
          <option value="completed">Completed</option><option value="rejected">Rejected</option>
        </Select>
        <Select aria-label="Filter kategori" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">Semua kategori</option><option value="organic">Organik</option><option value="plastic">Plastik</option><option value="paper">Kertas</option>
        </Select>
      </div>
      {err && <p role="alert" className="text-destructive text-sm">{err}</p>}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead><TableHead>Judul</TableHead><TableHead>Kategori</TableHead><TableHead>Lokasi</TableHead>
              {admin && <TableHead>Pelapor</TableHead>}<TableHead>Tanggal</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell><ImageWithFallback src={r.imageUrl} alt={r.title} className="size-11 rounded-lg object-cover" /></TableCell>
                <TableCell className="font-medium max-w-48"><button onClick={() => setOpen(r.id)} className="text-left hover:text-primary hover:underline">{r.title}</button></TableCell>
                <TableCell><CategoryBadge category={r.category} /></TableCell>
                <TableCell className="text-muted-foreground max-w-40 truncate">{r.address || `${r.latitude.toFixed(3)}, ${r.longitude.toFixed(3)}`}</TableCell>
                {admin && <TableCell>{r.user?.name}</TableCell>}
                <TableCell className="whitespace-nowrap text-muted-foreground">{fmtDate(r.createdAt)}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => setToDelete({ id: r.id, title: r.title })} aria-label={`Hapus ${r.title}`} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></Button></TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow><TableCell colSpan={8} className="p-8 text-center text-muted-foreground">Tidak ada laporan.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{meta.total} laporan</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
          <span className="text-xs">{meta.page} / {meta.totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Berikutnya</Button>
        </div>
      </div>
      {open && <ReportModal id={open} admin={admin} onClose={() => setOpen(null)} onChanged={load} />}
      <ConfirmDialog open={!!toDelete} title="Hapus Laporan" description={`Yakin ingin menghapus laporan "${toDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`} loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}
