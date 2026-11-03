'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Camera, MapPin, Recycle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCachedUser, getToken } from '@/lib/api';

const FEATURES = [
  { icon: Camera, title: 'Foto & Lapor', desc: 'Warga cukup memotret tumpukan sampah dari aplikasi mobile, lengkap dengan lokasi GPS otomatis.' },
  { icon: Sparkles, title: 'Klasifikasi AI', desc: 'Model MobileNetV2 mengenali jenis sampah (organik, kertas, plastik) dengan akurasi uji 95,56%.' },
  { icon: MapPin, title: 'Peta Sebaran', desc: 'Admin melihat titik laporan di peta dan memfilter berdasarkan jenis serta status.' },
  { icon: BarChart3, title: 'Dashboard Statistik', desc: 'Pantau jumlah laporan, tren, dan progres penanganan dalam satu layar.' },
];

const STATS = [['95,56%', 'akurasi uji model'], ['3', 'jenis sampah dikenali'], ['GPS', 'lokasi otomatis']];

const STEPS = ['Warga memotret sampah', 'AI menebak jenis sampah', 'Admin memproses laporan', 'Lingkungan jadi lebih bersih'];

export default function Home() {
  // ponytail: dashboard link decided client-side from cached login; no server session check
  const [dest, setDest] = useState<string | null>(null);
  useEffect(() => {
    const user = getCachedUser();
    if (getToken() && user) setDest(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
  }, []);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <Recycle className="size-6" aria-hidden /> Smart Waste
        </Link>
        <nav className="flex items-center gap-2">
          {dest ? (
            <Button asChild><Link href={dest}>Buka Dashboard</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/login">Masuk</Link></Button>
              <Button asChild><Link href="/register">Daftar</Link></Button>
            </>
          )}
        </nav>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-accent/70 via-secondary to-background">
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 size-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-accent blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-14">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-3 py-1 text-xs font-semibold text-primary">
              <Recycle className="size-3.5" aria-hidden /> Pelaporan sampah berbasis AI
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Laporkan sampah, <span className="text-primary">bersihkan lingkungan</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-foreground/80 sm:text-lg lg:mx-0">
              Foto sampah di sekitarmu. AI mengenali jenisnya, petugas menindaklanjuti.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
              <Button asChild size="lg"><Link href={dest ?? '/register'}>{dest ? 'Buka Dashboard' : 'Mulai Melapor'} <ArrowRight /></Link></Button>
              {!dest && <Button asChild size="lg" variant="outline"><Link href="/login">Saya sudah punya akun</Link></Button>}
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-primary/20 pt-6 text-center lg:text-left">
              {STATS.map(([v, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-extrabold text-primary sm:text-3xl">{v}</dt>
                  <dd className="text-xs text-foreground/70 sm:text-sm">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ponytail: illustrative mockup, static markup, not live data */}
          <div className="relative mx-auto w-full max-w-xs" aria-hidden>
            <div className="rotate-2 rounded-[2rem] border-8 border-foreground/90 bg-card p-3 shadow-2xl">
              <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-chart-4 text-primary-foreground">
                <Camera className="size-14 opacity-90" />
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Hasil AI</p>
                  <p className="font-bold">Plastik</p>
                </div>
                <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">94%</span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border p-3 text-xs">
                <MapPin className="size-4 shrink-0 text-primary" /> Lokasi terdeteksi otomatis
              </div>
              <div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-muted-foreground">
                <span className="text-primary">● Dilaporkan</span><span>○ Diproses</span><span>○ Selesai</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-6 -rotate-3 rounded-xl border bg-card px-4 py-3 text-sm font-semibold shadow-lg">
              <span className="text-primary">✓</span> Laporan terkirim
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Fitur utama</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Cara kerja</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-4 rounded-xl border bg-card p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
                <span className="text-sm font-medium">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Smart Waste Management System
      </footer>
    </div>
  );
}
