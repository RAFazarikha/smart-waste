'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setCachedUser, setToken } from '@/lib/api';
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      const body = isLogin ? { email: form.email, password: form.password } : { ...form, phone: form.phone || undefined };
      const res = await apiFetch(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) });
      setToken(res.token); setCachedUser(res.user);
      router.push(res.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center items-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
            <Trash2 className="size-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl">{isLogin ? 'Smart Waste System' : 'Daftar Akun Baru'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Masuk ke portal pelaporan sampah cerdas' : 'Bergabung untuk melaporkan sampah di sekitarmu'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div role="alert" className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" aria-hidden />{error}
            </div>
          )}
          <form onSubmit={submit} className="space-y-3">
            {FIELDS.filter((f) => !('only' in f) || f.only === mode).map((f) => (
              <div key={f.k} className="space-y-1.5">
                <Label htmlFor={f.k}>{f.label}</Label>
                <Input
                  id={f.k} type={f.type} required={!('optional' in f)}
                  minLength={f.k === 'password' && !isLogin ? 6 : undefined} placeholder={f.ph}
                  value={form[f.k] ?? ''} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                />
              </div>
            ))}
            <Button disabled={loading} className="w-full mt-2">
              {loading && <Loader2 className="animate-spin" aria-hidden />}
              {isLogin ? 'Masuk' : 'Daftar Sekarang'}
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <Link href={isLogin ? '/register' : '/login'} className="text-primary font-semibold hover:underline">
              {isLogin ? 'Daftar Warga' : 'Masuk'}
            </Link>
          </p>
          {isLogin && (
            <div className="mt-6 pt-4 border-t text-xs text-muted-foreground space-y-0.5">
              <p className="font-semibold text-foreground mb-1">Akun Demo:</p>
              <p>Admin: admin@smartwaste.id / Admin123!</p>
              <p>User: user@smartwaste.id / User123!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
