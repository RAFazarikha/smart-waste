'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Users, LogOut, Menu, X, Trash2 } from 'lucide-react';
import { getCachedUser, getToken, setCachedUser, setToken } from '@/lib/api';

const NAV = {
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/reports', label: 'Laporan', icon: FileText },
    { href: '/admin/users', label: 'Pengguna', icon: Users },
  ],
  user: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/reports', label: 'Laporan Saya', icon: FileText },
  ],
} as const;

// Guard sisi klien: keamanan sesungguhnya ada di API (JWT + requireRole); ini hanya UX redirect.
export default function Shell({ role, children }: { role: 'admin' | 'user'; children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const u = getCachedUser();
    if (!getToken() || !u) return router.replace('/login');
    if (u.role !== role) return router.replace(u.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    setUser(u);
  }, [role, router]);

  useEffect(() => setOpen(false), [path]);

  const logout = () => { setToken(null); setCachedUser(null); router.replace('/login'); };
  if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Memuat...</div>;

  const links = NAV[role].map(({ href, label, icon: Icon }) => {
    const active = path === href || (href.endsWith('/reports') && path.startsWith(href));
    return (
      <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
        <Icon className="w-4 h-4" aria-hidden /> {label}
      </Link>
    );
  });

  return (
    <div className="min-h-screen md:flex">
      <header className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 h-14 sticky top-0 z-30">
        <span className="font-bold flex items-center gap-2"><Trash2 className="w-5 h-5 text-emerald-400" aria-hidden /> Smart Waste</span>
        <button onClick={() => setOpen(!open)} aria-label={open ? 'Tutup menu' : 'Buka menu'} className="p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>
      <aside className={`${open ? 'block' : 'hidden'} md:flex md:flex-col fixed md:sticky top-14 md:top-0 inset-x-0 md:inset-x-auto z-20 md:w-60 md:h-screen bg-slate-900 p-4 gap-1`}>
        <div className="hidden md:flex items-center gap-2 text-white font-bold text-lg mb-6 px-2">
          <Trash2 className="w-6 h-6 text-emerald-400" aria-hidden /> Smart Waste
        </div>
        <nav className="space-y-1 flex-1">{links}</nav>
        <div className="border-t border-slate-700 pt-3 mt-3">
          <p className="text-sm text-white font-medium truncate">{user.name}</p>
          <p className="text-xs text-slate-400 mb-2 capitalize">{user.role}</p>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <LogOut className="w-4 h-4" aria-hidden /> Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 min-w-0">{children}</main>
    </div>
  );
}
