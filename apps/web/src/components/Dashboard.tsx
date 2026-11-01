'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { apiFetch } from '@/lib/api';
import { CATEGORY } from '@/lib/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Stats = {
  total_reports: number; pending_count: number; in_progress_count: number; completed_count: number; rejected_count: number;
  category_counts: Record<string, number>; daily_trends: { date: string; count: number }[];
};

export default function Dashboard({ title }: { title: string }) {
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { apiFetch<Stats>('/stats').then(setS).catch((e) => setErr(e.message)); }, []);

  if (err) return <p role="alert" className="text-destructive">{err}</p>;
  if (!s) return <p className="text-muted-foreground">Memuat statistik...</p>;

  const kpis = [
    { label: 'Total Laporan', v: s.total_reports, cls: 'text-foreground' },
    { label: 'Pending', v: s.pending_count, cls: 'text-amber-600' },
    { label: 'In Progress', v: s.in_progress_count, cls: 'text-blue-600' },
    { label: 'Selesai', v: s.completed_count, cls: 'text-emerald-600' },
  ];
  const pie = Object.entries(s.category_counts).map(([k, v]) => ({ name: CATEGORY[k]?.label ?? k, value: v, color: CATEGORY[k]?.color ?? 'var(--muted-foreground)' }));
  const trend = s.daily_trends.map((d) => ({ ...d, label: d.date.slice(5) }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="py-4">
            <CardHeader className="py-0 px-4">
              <CardDescription className="text-xs">{k.label}</CardDescription>
              <CardTitle className={`text-3xl font-bold mt-1 ${k.cls}`}>{k.v}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Komposisi Sampah</CardTitle>
            <CardDescription className="text-xs">Distribusi kategori laporan masyarakat</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {pie.map((p) => <Cell key={p.name} fill={p.color} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tren Laporan 14 Hari</CardTitle>
            <CardDescription className="text-xs">Aktivitas pelaporan harian</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="label" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} />
                <Tooltip /><Bar dataKey="count" name="Laporan" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
