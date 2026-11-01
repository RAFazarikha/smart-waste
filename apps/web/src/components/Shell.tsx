'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Users, LogOut, Menu, X, Trash2 } from 'lucide-react';
import { getCachedUser, getToken, setCachedUser, setToken } from '@/lib/api';
import { Button } from '@/components/ui/button';

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
  if (!user) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;

  const links = NAV[role].map(({ href, label, icon: Icon }) => {
    const active = path === href || (href.endsWith('/reports') && path.startsWith(href));
    return (
      <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
        <Icon className="size-4 shrink-0" aria-hidden /> {label}
      </Link>
    );
  });

  return (
    <div className="min-h-screen md:flex bg-muted/30">
      <header className="md:hidden flex items-center justify-between border-b bg-card px-4 h-14 sticky top-0 z-30">
        <span className="font-bold flex items-center gap-2"><Trash2 className="size-5 text-primary" aria-hidden /> Smart Waste</span>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label={open ? 'Tutup menu' : 'Buka menu'}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </header>
      <aside className={`${open ? 'block' : 'hidden'} md:flex md:flex-col fixed md:sticky top-14 md:top-0 inset-x-0 md:inset-x-auto z-20 md:w-64 md:h-screen border-r bg-card p-4 gap-2`}>
        <div className="hidden md:flex items-center gap-2.5 font-bold text-lg mb-6 px-2 text-foreground">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Trash2 className="size-5" aria-hidden />
          </div>
          Smart Waste
        </div>
        <nav className="space-y-1 flex-1">{links}</nav>
        <div className="border-t pt-3 mt-3">
          <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground mb-3 capitalize">{user.role}</p>
          <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
            <LogOut className="size-4" aria-hidden /> Keluar
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 min-w-0 max-w-7xl">{children}</main>
    </div>
  );
}
