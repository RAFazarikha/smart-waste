import { CATEGORY, STATUS } from '@/lib/ui';

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: 'bg-slate-100 text-slate-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
}
export function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY[category] ?? { label: category, cls: 'bg-slate-100 text-slate-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.cls}`}>{c.label}</span>;
}
