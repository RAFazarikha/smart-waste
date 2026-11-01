const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sw_token');
}

export function setToken(t: string | null) {
  if (typeof window === 'undefined') return;
  if (t) localStorage.setItem('sw_token', t);
  else localStorage.removeItem('sw_token');
}

export function getCachedUser(): any | null {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('sw_user');
  return u ? JSON.parse(u) : null;
}

export function setCachedUser(u: any | null) {
  if (typeof window === 'undefined') return;
  if (u) localStorage.setItem('sw_user', JSON.stringify(u));
  else localStorage.removeItem('sw_user');
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 204) return {} as T;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      setToken(null);
      setCachedUser(null);
      window.location.href = '/login';
    }
    throw new Error(json.error || 'Terjadi kesalahan sistem');
  }
  return json;
}
