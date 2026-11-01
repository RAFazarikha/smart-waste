'use client';
import { useEffect, useState } from 'react';
import { apiFetch, getCachedUser } from '@/lib/api';
import { fmtDate } from '@/lib/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UsersTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const me = getCachedUser();
  const load = () => apiFetch('/users').then((r) => setRows(r.data)).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const act = async (fn: () => Promise<any>) => { setErr(''); try { await fn(); await load(); } catch (e: any) { setErr(e.message); } };
  const role = (u: any) => act(() => apiFetch(`/users/${u.id}/role`, { method: 'PATCH', body: JSON.stringify({ role: u.role === 'admin' ? 'user' : 'admin' }) }));
  const del = (u: any) => confirm(`Hapus ${u.name}? Laporannya ikut terhapus.`) && act(() => apiFetch(`/users/${u.id}`, { method: 'DELETE' }));

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
                    <Button variant="outline" size="sm" onClick={() => role(u)}>Jadikan {u.role === 'admin' ? 'user' : 'admin'}</Button>
                    <Button variant="ghost" size="sm" onClick={() => del(u)} className="text-destructive hover:bg-destructive/10">Hapus</Button>
                  </>)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
