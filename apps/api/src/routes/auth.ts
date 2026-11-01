import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { LoginSchema, RegisterSchema } from '@smartwaste/shared';
import { prisma } from '../db';
import { authenticate, signToken, validate } from '../middlewares/auth';

export const authRouter = Router();
const pub = (u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone });

authRouter.post('/register', validate(RegisterSchema), async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ error: 'Email sudah terdaftar' });
  // role selalu 'user'; admin hanya lewat seed / PATCH role oleh admin
  const u = await prisma.user.create({ data: { name, email, phone, passwordHash: await bcrypt.hash(password, 10) } });
  res.status(201).json({ user: pub(u), token: signToken({ id: u.id, role: u.role }) });
});

authRouter.post('/login', validate(LoginSchema), async (req, res) => {
  const u = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (!u || !(await bcrypt.compare(req.body.password, u.passwordHash)))
    return res.status(401).json({ error: 'Email atau password salah' });
  res.json({ user: pub(u), token: signToken({ id: u.id, role: u.role }) });
});

authRouter.get('/me', authenticate, async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.user!.id } });
  u ? res.json({ user: pub(u) }) : res.status(404).json({ error: 'User tidak ditemukan' });
});
