import * as SecureStore from 'expo-secure-store';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api';

const TOKEN_KEY = 'sw_mobile_jwt';
const USER_KEY = 'sw_mobile_user';

export async function getToken(): Promise<string | null> {
  try { return await SecureStore.getItemAsync(TOKEN_KEY); } catch { return null; }
}

export async function setToken(t: string | null) {
  try {
    if (t) await SecureStore.setItemAsync(TOKEN_KEY, t);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch { /* SecureStore fallback */ }
}

export async function getCachedUser(): Promise<any | null> {
  try {
    const u = await SecureStore.getItemAsync(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch { return null; }
}

export async function setCachedUser(u: any | null) {
  try {
    if (u) await SecureStore.setItemAsync(USER_KEY, JSON.stringify(u));
    else await SecureStore.deleteItemAsync(USER_KEY);
  } catch { /* SecureStore fallback */ }
}

async function handleFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (msg.includes('canceled') || msg.includes('Aborted')) {
      throw new Error('Koneksi terputus ke server API. Periksa IP laptop dan pastikan API port 4000 aktif.');
    }
    if (err.name === 'TypeError' || msg.includes('Network request failed') || msg.includes('fetch failed')) {
      throw new Error('Gagal terhubung ke API. Pastikan HP dan laptop di satu WiFi.');
    }
    throw err;
  }
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const isForm = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isForm && options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await handleFetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 204) return {} as T;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      await setToken(null);
      await setCachedUser(null);
    }
    throw new Error(json.error || `Permintaan gagal (status ${res.status})`);
  }
  return json;
}

export async function uploadImage(fileUri: string): Promise<string> {
  const token = await getToken();
  const form = new FormData();
  const filename = fileUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  // @ts-ignore
  form.append('file', { uri: fileUri, name: filename, type });

  const res = await handleFetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Upload foto gagal. Cek koneksi.');
  return json.url;
}

export async function classifyImage(fileUri: string): Promise<any> {
  const token = await getToken();
  const form = new FormData();
  const filename = fileUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  // @ts-ignore
  form.append('file', { uri: fileUri, name: filename, type });

  const res = await handleFetch(`${API_BASE}/ai/classify`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Klasifikasi AI gagal.');
  return json;
}
