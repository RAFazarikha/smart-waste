'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setCachedUser, setToken } from '@/lib/api';
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';

type Mode = 'login' | 'register';
const FIELDS = [
  { k: 'name', label: 'Nama Lengkap', type: 'text', only: 'register', ph: 'Budi Santoso' },
  { k: 'email', label: 'Email', type: 'email', ph: 'nama@email.com' },
  { k: 'phone', label: 'No. Handphone (opsional)', type: 'tel', only: 'register', ph: '08123456789', optional: true },
  { k: 'password', label: 'Password', type: 'password', ph: 'Minimal 6 karakter' },
] as const;

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isLogin = mode === 'login';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { ...form, phone: form.phone || undefined };
      const res = await apiFetch(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) });
      setToken(res.token);
      setCachedUser(res.user);
      router.push(res.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-2">
            <Trash2 className="w-7 h-7" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{isLogin ? 'Smart Waste System' : 'Daftar Akun Baru'}</h1>
          <p className="text-sm text-slate-500 text-center">
            {isLogin ? 'Masuk ke portal pelaporan sampah cerdas' : 'Bergabung untuk melaporkan sampah di sekitarmu'}
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {FIELDS.filter((f) => !('only' in f) || f.only === mode).map((f) => (
            <div key={f.k}>
              <label htmlFor={f.k} className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
              <input
                id={f.k}
                type={f.type}
                required={!('optional' in f)}
                minLength={f.k === 'password' && !isLogin ? 6 : undefined}
                placeholder={f.ph}
                value={form[f.k] ?? ''}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            {isLogin ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <Link href={isLogin ? '/register' : '/login'} className="text-emerald-600 font-semibold hover:underline">
            {isLogin ? 'Daftar Warga' : 'Masuk'}
          </Link>
        </p>

        {isLogin && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
            <p className="font-semibold text-slate-500 mb-1">Akun Demo:</p>
            <p>Admin: admin@smartwaste.id / Admin123!</p>
            <p>User: user@smartwaste.id / User123!</p>
          </div>
        )}
      </div>
    </div>
  );
}
