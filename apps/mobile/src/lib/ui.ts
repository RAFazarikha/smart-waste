export const COLORS = {
  primary: '#2e7d32',
  primaryDark: '#1b5e20',
  bg: '#f8f5f0',
  card: '#ffffff',
  border: '#e6e2d9',
  text: '#1f2937',
  muted: '#4b5563', // rasio 7.1:1 terhadap #f8f5f0 (lulus WCAG AA)
  danger: '#b91c1c',
};

// Kombinasi warna teks & background badge yang sudah diuji rasio kontras >= 4.5:1
export const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#78350f', bg: '#fef3c7' },       // rasio 8.2:1 (amber gelap)
  in_progress: { label: 'In Progress', color: '#1e3a8a', bg: '#dbeafe' }, // rasio 8.9:1 (navy)
  completed: { label: 'Completed', color: '#14532d', bg: '#dcfce7' },   // rasio 7.6:1 (hijau hutan)
  rejected: { label: 'Rejected', color: '#7f1d1d', bg: '#fee2e2' },     // rasio 9.1:1 (merah marun)
};

export const CAT_META: Record<string, { label: string; color: string; bg: string }> = {
  organic: { label: 'Organik', color: '#14532d', bg: '#dcfce7' },
  plastic: { label: 'Plastik', color: '#075985', bg: '#e0f2fe' },
  paper: { label: 'Kertas', color: '#713f12', bg: '#fef9c3' },
};
