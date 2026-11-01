export const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800' },
  in_progress: { label: 'In Progress', cls: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
};
export const CATEGORY: Record<string, { label: string; cls: string; color: string }> = {
  organic: { label: 'Organik', cls: 'bg-green-100 text-green-800', color: 'var(--chart-1)' },
  plastic: { label: 'Plastik', cls: 'bg-sky-100 text-sky-800', color: 'var(--chart-3)' },
  paper: { label: 'Kertas', cls: 'bg-yellow-100 text-yellow-800', color: 'var(--chart-5)' },
};
export const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
