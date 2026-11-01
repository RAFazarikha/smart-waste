'use client';
import { useEffect, useState } from 'react';
import { apiFetch, getCachedUser } from '@/lib/api';
import { fmtDate } from '@/lib/ui';

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
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Manajemen Pengguna</h1>
      {err && <p role="alert" className="text-red-600 text-sm mb-2">{err}</p>}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr><th className="p-3">Nama</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Laporan</th><th className="p-3">Bergabung</th><th className="p-3"><span className="sr-only">Aksi</span></th></tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.name}</td><td className="p-3">{u.email}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}>{u.role}</span></td>
                <td className="p-3">{u.report_count}</td><td className="p-3 whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                <td className="p-3 whitespace-nowrap text-right">
                  {u.id !== me?.id && (<>
                    <button onClick={() => role(u)} className="text-xs text-emerald-700 hover:underline mr-3">Jadikan {u.role === 'admin' ? 'user' : 'admin'}</button>
                    <button onClick={() => del(u)} className="text-xs text-red-600 hover:underline">Hapus</button>
                  </>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
