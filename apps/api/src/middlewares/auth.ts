import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodSchema } from 'zod';

export type AuthUser = { id: string; role: 'admin' | 'user' };
declare global { namespace Express { interface Request { user?: AuthUser } } }

const secret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET belum diset');
  return process.env.JWT_SECRET;
};
export const signToken = (u: AuthUser) => jwt.sign(u, secret(), { expiresIn: '7d' });

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token wajib' });
  try {
    const p = jwt.verify(h.slice(7), secret()) as AuthUser;
    req.user = { id: p.id, role: p.role };
    next();
  } catch { res.status(401).json({ error: 'Token tidak valid' }); }
}

export const requireRole = (role: 'admin') => (req: Request, res: Response, next: NextFunction) =>
  req.user?.role === role ? next() : res.status(403).json({ error: 'Akses ditolak' });

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return res.status(400).json({ error: 'Validasi gagal', details: r.error.flatten().fieldErrors });
  req.body = r.data;
  next();
};
