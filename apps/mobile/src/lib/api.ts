import * as SecureStore from 'expo-secure-store';

// Emulator Android: 10.0.2.2 = localhost host. APK rilis: set EXPO_PUBLIC_API_URL ke URL API publik (VPS).
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api';

const TOKEN_KEY = 'sw_mobile_jwt';
const USER_KEY = 'sw_mobile_user';

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(t: string | null) {
  if (t) await SecureStore.setItemAsync(TOKEN_KEY, t);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getCachedUser(): Promise<any | null> {
  try {
    const u = await SecureStore.getItemAsync(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export async function setCachedUser(u: any | null) {
  if (u) await SecureStore.setItemAsync(USER_KEY, JSON.stringify(u));
  else await SecureStore.deleteItemAsync(USER_KEY);
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const isForm = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isForm && options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 204) return {} as T;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || 'Terjadi kesalahan');
  }
  return json;
}

// Upload file dari file URI lokal ke API upload
export async function uploadImage(fileUri: string): Promise<string> {
  const token = await getToken();
  const form = new FormData();
  const filename = fileUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  // @ts-ignore: React Native FormData file interface
  form.append('file', { uri: fileUri, name: filename, type });

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload gambar gagal');
  return json.url;
}

// Klasifikasi gambar via AI endpoint API (proxy ke ML)
export async function classifyImage(fileUri: string): Promise<any> {
  const token = await getToken();
  const form = new FormData();
  const filename = fileUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  // @ts-ignore
  form.append('file', { uri: fileUri, name: filename, type });

  const res = await fetch(`${API_BASE}/ai/classify`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Klasifikasi gagal');
  return json;
}
