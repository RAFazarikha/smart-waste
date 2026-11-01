'use client';
import { useEffect, useState } from 'react';
import { apiFetch, getCachedUser } from '@/lib/api';
import { fmtDate } from '@/lib/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function UsersTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const [toDelete, setToDelete] = useState<any>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const me = getCachedUser();
  const load = () => apiFetch('/users').then((r) => setRows(r.data)).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const changeRole = async (u: any) => {
    setBusyId(u.id); setErr('');
    try { await apiFetch(`/users/${u.id}/role`, { method: 'PATCH', body: JSON.stringify({ role: u.role === 'admin' ? 'user' : 'admin' }) }); await load(); }
    catch (e: any) { setErr(e.message); }
    finally { setBusyId(null); }
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusyId(toDelete.id); setErr('');
    try { await apiFetch(`/users/${toDelete.id}`, { method: 'DELETE' }); setToDelete(null); await load(); }
    catch (e: any) { setErr(e.message); }
    finally { setBusyId(null); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
      {err && <p role="alert" className="text-destructive text-sm">{err}</p>}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Laporan</TableHead><TableHead>Bergabung</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell><Badge variant={u.role === 'admin' ? 'purple' : 'secondary'}>{u.role}</Badge></TableCell>
                <TableCell>{u.report_count}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{fmtDate(u.createdAt)}</TableCell>
                <TableCell className="whitespace-nowrap text-right space-x-2">
                  {u.id !== me?.id && (<>
                    <Button variant="outline" size="sm" disabled={busyId === u.id} onClick={() => changeRole(u)}>
                      {busyId === u.id ? 'Memproses...' : `Jadikan ${u.role === 'admin' ? 'user' : 'admin'}`}
                    </Button>
                    <Button variant="ghost" size="sm" disabled={busyId === u.id} onClick={() => setToDelete(u)} className="text-destructive hover:bg-destructive/10">
                      Hapus
                    </Button>
                  </>)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <ConfirmDialog open={!!toDelete} title="Hapus Pengguna" description={`Yakin ingin menghapus ${toDelete?.name}? Semua laporan miliknya akan ikut terhapus.`} loading={busyId === toDelete?.id} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}
