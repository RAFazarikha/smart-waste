import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, getCachedUser, getToken, setCachedUser, setToken } from './lib/api';

type User = { id: string; name: string; email: string; role: string };
type Ctx = { user: User | null; ready: boolean; auth: (mode: 'login' | 'register', body: object) => Promise<void>; logout: () => Promise<void> };
const AuthCtx = createContext<Ctx>(null as any);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Pulihkan sesi, lalu validasi token ke /auth/me; token kedaluwarsa -> kembali ke login
  useEffect(() => {
    (async () => {
      if (await getToken()) {
        try { const r = await apiFetch('/auth/me'); setUser(r.user); }
        catch { await setToken(null); await setCachedUser(null); }
      }
      setReady(true);
    })();
  }, []);

  const auth: Ctx['auth'] = async (mode, body) => {
    const r = await apiFetch(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) });
    await setToken(r.token); await setCachedUser(r.user); setUser(r.user);
  };
  const logout = async () => { await setToken(null); await setCachedUser(null); setUser(null); };
  return <AuthCtx.Provider value={{ user, ready, auth, logout }}>{children}</AuthCtx.Provider>;
}
