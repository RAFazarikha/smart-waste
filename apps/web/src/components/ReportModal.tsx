'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/api';
import { fmtDate } from '@/lib/ui';
import { CategoryBadge, StatusBadge } from './Badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function ReportModal({ id, admin, onClose, onChanged }: { id: string; admin: boolean; onClose: () => void; onChanged: () => void }) {
  const [r, setR] = useState<any>(null);
  const [status, setStatus] = useState('in_progress');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = () => apiFetch(`/reports/${id}`).then((x) => setR(x.data)).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [id]);

  const update = async () => {
    setBusy(true); setErr('');
    try {
      await apiFetch(`/reports/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note: note || undefined }) });
      setNote(''); await load(); onChanged();
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <Dialog open={true} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Laporan</DialogTitle>
          <DialogDescription>Informasi lengkap sampah dan lokasi titik pelaporan</DialogDescription>
        </DialogHeader>
        {!r ? <p className="p-6 text-muted-foreground">{err || 'Memuat...'}</p> : (
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.imageUrl} alt={r.title} className="w-full h-56 object-cover rounded-xl bg-muted" />
              <MapView lat={r.latitude} lng={r.longitude} />
              <p className="text-xs text-muted-foreground">{r.address || '-'} ({r.latitude.toFixed(5)}, {r.longitude.toFixed(5)})</p>
            </div>
            <div className="space-y-3 text-sm">
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <div className="flex gap-2 flex-wrap items-center">
                <CategoryBadge category={r.category} />
                <StatusBadge status={r.status} />
                {r.aiConfidence != null && (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    AI {(r.aiConfidence * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-foreground/90">{r.description}</p>
              <p className="text-xs text-muted-foreground">Pelapor: {r.user?.name} · {fmtDate(r.createdAt)}</p>
              {r.adminNote && <p className="text-xs bg-muted/60 border rounded-lg p-2.5">Catatan admin: {r.adminNote}</p>}

              <div>
                <h4 className="font-semibold text-xs mb-1.5 uppercase text-muted-foreground tracking-wider">Riwayat Status</h4>
                {r.logs?.length ? (
                  <ol className="border-l-2 border-primary/30 pl-3 space-y-2">
                    {r.logs.map((l: any) => (
                      <li key={l.id} className="text-xs">
                        <span className="font-medium">{l.fromStatus} to {l.toStatus}</span> oleh {l.changedBy?.name} · {fmtDate(l.createdAt)}
                        {l.note && <span className="block text-muted-foreground mt-0.5">{l.note}</span>}
                      </li>
                    ))}
                  </ol>
                ) : <p className="text-xs text-muted-foreground">Belum ada perubahan status.</p>}
              </div>

              {admin && (
                <div className="border-t pt-3 space-y-2">
                  <Label htmlFor="st" className="text-xs">Ubah Status</Label>
                  <Select id="st" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full">
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan tindak lanjut (opsional)" rows={2} />
                  {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
                  <Button onClick={update} disabled={busy} className="w-full">
                    {busy ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
