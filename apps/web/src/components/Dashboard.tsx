'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { apiFetch } from '@/lib/api';
import { CATEGORY } from '@/lib/ui';

type Stats = {
  total_reports: number; pending_count: number; in_progress_count: number; completed_count: number; rejected_count: number;
  category_counts: Record<string, number>; daily_trends: { date: string; count: number }[];
};

export default function Dashboard({ title }: { title: string }) {
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { apiFetch<Stats>('/stats').then(setS).catch((e) => setErr(e.message)); }, []);

  if (err) return <p role="alert" className="text-red-600">{err}</p>;
  if (!s) return <p className="text-slate-500">Memuat statistik...</p>;

  const kpis = [
    { label: 'Total Laporan', v: s.total_reports, cls: 'text-slate-800' },
    { label: 'Pending', v: s.pending_count, cls: 'text-amber-600' },
    { label: 'In Progress', v: s.in_progress_count, cls: 'text-blue-600' },
    { label: 'Selesai', v: s.completed_count, cls: 'text-emerald-600' },
  ];
  const pie = Object.entries(s.category_counts).map(([k, v]) => ({ name: CATEGORY[k]?.label ?? k, value: v, color: CATEGORY[k]?.color ?? '#94a3b8' }));
  const trend = s.daily_trends.map((d) => ({ ...d, label: d.date.slice(5) }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className={`text-3xl font-bold mt-1 ${k.cls}`}>{k.v}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <section className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="font-semibold text-slate-700 mb-2">Komposisi Sampah</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {pie.map((p) => <Cell key={p.name} fill={p.color} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="bg-white rounded-xl border border-slate-200 p-4 lg:col-span-2">
          <h2 className="font-semibold text-slate-700 mb-2">Tren Laporan 14 Hari</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} />
                <Tooltip /><Bar dataKey="count" name="Laporan" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
