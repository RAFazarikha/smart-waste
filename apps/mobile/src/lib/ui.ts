export const COLORS = {
  primary: '#059669',
  primaryDark: '#047857',
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  muted: '#64748b',
  danger: '#ef4444',
};

export const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#d97706', bg: '#fef3c7' },
  in_progress: { label: 'In Progress', color: '#2563eb', bg: '#dbeafe' },
  completed: { label: 'Completed', color: '#059669', bg: '#d1fae5' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' },
};

export const CAT_META: Record<string, { label: string; color: string }> = {
  organic: { label: 'Organik', color: '#16a34a' },
  plastic: { label: 'Plastik', color: '#0284c7' },
  paper: { label: 'Kertas', color: '#ca8a04' },
};
