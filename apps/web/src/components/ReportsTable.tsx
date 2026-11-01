'use client';
import { useCallback, useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { fmtDate } from '@/lib/ui';
import { CategoryBadge, StatusBadge } from './Badge';
import ReportModal from './ReportModal';

export default function ReportsTable({ admin }: { admin: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState('');

  // debounce pencarian 300ms agar tidak menembak API tiap ketukan
  const [dq, setDq] = useState('');
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 300); return () => clearTimeout(t); }, [q]);

  const load = useCallback(() => {
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (dq) p.set('q', dq); if (status) p.set('status', status); if (category) p.set('category', category);
    apiFetch(`/reports?${p}`).then((r) => { setRows(r.data); setMeta(r.meta); setErr(''); }).catch((e) => setErr(e.message));
  }, [page, dq, status, category]);
  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Hapus laporan ini?')) return;
    try { await apiFetch(`/reports/${id}`, { method: 'DELETE' }); load(); } catch (e: any) { setErr(e.message); }
  };
  const sel = 'border border-slate-300 rounded-lg px-2 py-2 text-sm bg-white';

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">{admin ? 'Manajemen Laporan' : 'Laporan Saya'}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" aria-hidden />
          <input aria-label="Cari laporan" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul, deskripsi, pelapor..." className={`${sel} w-full pl-9`} />
        </div>
        <select aria-label="Filter status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={sel}>
          <option value="">Semua status</option><option value="pending">Pending</option><option value="in_progress">In Progress</option>
          <option value="completed">Completed</option><option value="rejected">Rejected</option>
        </select>
        <select aria-label="Filter kategori" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={sel}>
          <option value="">Semua kategori</option><option value="organic">Organik</option><option value="plastic">Plastik</option><option value="paper">Kertas</option>
        </select>
      </div>
      {err && <p role="alert" className="text-red-600 text-sm mb-2">{err}</p>}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr><th className="p-3">Foto</th><th className="p-3">Judul</th><th className="p-3">Kategori</th><th className="p-3">Lokasi</th>
              {admin && <th className="p-3">Pelapor</th>}<th className="p-3">Tanggal</th><th className="p-3">Status</th><th className="p-3"><span className="sr-only">Aksi</span></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-slate-50">
                <td className="p-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={r.imageUrl} alt="" className="w-12 h-12 rounded object-cover bg-slate-100" /></td>
                <td className="p-3 font-medium max-w-48"><button onClick={() => setOpen(r.id)} className="text-left hover:text-emerald-700 hover:underline">{r.title}</button></td>
                <td className="p-3"><CategoryBadge category={r.category} /></td>
                <td className="p-3 text-slate-500 max-w-40 truncate">{r.address || `${r.latitude.toFixed(3)}, ${r.longitude.toFixed(3)}`}</td>
                {admin && <td className="p-3">{r.user?.name}</td>}
                <td className="p-3 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3"><button onClick={() => remove(r.id)} aria-label={`Hapus ${r.title}`} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={8} className="p-8 text-center text-slate-400">Tidak ada laporan.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm text-slate-600">
        <span>{meta.total} laporan</span>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40">Sebelumnya</button>
          <span>{meta.page} / {meta.totalPages || 1}</span>
          <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40">Berikutnya</button>
        </div>
      </div>
      {open && <ReportModal id={open} admin={admin} onClose={() => setOpen(null)} onChanged={load} />}
    </div>
  );
}
