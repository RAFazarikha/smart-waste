import { Badge } from '@/components/ui/badge';

const STATUS_V: Record<string, { label: string; v: 'amber' | 'blue' | 'green' | 'red' }> = {
  pending: { label: 'Pending', v: 'amber' },
  in_progress: { label: 'In Progress', v: 'blue' },
  completed: { label: 'Completed', v: 'green' },
  rejected: { label: 'Rejected', v: 'red' },
};
const CAT_V: Record<string, { label: string; v: 'green' | 'sky' | 'yellow' }> = {
  organic: { label: 'Organik', v: 'green' },
  plastic: { label: 'Plastik', v: 'sky' },
  paper: { label: 'Kertas', v: 'yellow' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_V[status] ?? { label: status, v: 'amber' as const };
  return <Badge variant={s.v}>{s.label}</Badge>;
}
export function CategoryBadge({ category }: { category: string }) {
  const c = CAT_V[category] ?? { label: category, v: 'green' as const };
  return <Badge variant={c.v}>{c.label}</Badge>;
}
