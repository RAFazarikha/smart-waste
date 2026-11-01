'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { fmtDate } from '@/lib/ui';
import { CategoryBadge, StatusBadge } from './Badge';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function ReportModal({ id, admin, onClose, onChanged }: { id: string; admin: boolean; onClose: () => void; onChanged: () => void }) {
  const [r, setR] = useState<any>(null);
  const [status, setStatus] = useState('in_progress');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = () => apiFetch(`/reports/${id}`).then((x) => setR(x.data)).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [id]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const update = async () => {
    setBusy(true); setErr('');
    try {
      await apiFetch(`/reports/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note: note || undefined }) });
      setNote(''); await load(); onChanged();
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Detail laporan" onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-3xl my-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-slate-800">Detail Laporan</h2>
          <button onClick={onClose} aria-label="Tutup" className="p-1"><X className="w-5 h-5" /></button>
        </div>
        {!r ? <p className="p-6 text-slate-500">{err || 'Memuat...'}</p> : (
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.imageUrl} alt={r.title} className="w-full h-56 object-cover rounded-lg bg-slate-100" />
              <MapView lat={r.latitude} lng={r.longitude} />
              <p className="text-xs text-slate-500">{r.address || '-'} ({r.latitude.toFixed(5)}, {r.longitude.toFixed(5)})</p>
            </div>
            <div className="space-y-3 text-sm">
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <div className="flex gap-2 flex-wrap"><CategoryBadge category={r.category} /><StatusBadge status={r.status} />
                {r.aiConfidence != null && <span className="text-xs text-slate-500 self-center">AI {(r.aiConfidence * 100).toFixed(1)}%</span>}</div>
              <p className="text-slate-700">{r.description}</p>
              <p className="text-xs text-slate-500">Pelapor: {r.user?.name} · {fmtDate(r.createdAt)}</p>
              {r.adminNote && <p className="text-xs bg-slate-50 border rounded p-2">Catatan admin: {r.adminNote}</p>}

              <div>
                <h4 className="font-semibold mb-1">Riwayat Status</h4>
                {r.logs?.length ? (
                  <ol className="border-l-2 border-emerald-200 pl-3 space-y-2">
                    {r.logs.map((l: any) => (
                      <li key={l.id} className="text-xs">
                        <span className="font-medium">{l.fromStatus} → {l.toStatus}</span> oleh {l.changedBy?.name} · {fmtDate(l.createdAt)}
                        {l.note && <span className="block text-slate-500">{l.note}</span>}
                      </li>
                    ))}
                  </ol>
                ) : <p className="text-xs text-slate-400">Belum ada perubahan status.</p>}
              </div>

              {admin && (
                <div className="border-t pt-3 space-y-2">
                  <label htmlFor="st" className="block text-xs font-semibold">Ubah status</label>
                  <select id="st" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-lg px-2 py-2 text-sm">
                    <option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="rejected">Rejected</option>
                  </select>
                  <textarea aria-label="Catatan" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan (opsional)" rows={2} className="w-full border rounded-lg px-2 py-2 text-sm" />
                  {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
                  <button onClick={update} disabled={busy} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium">
                    {busy ? 'Menyimpan...' : 'Simpan Status'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
