import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// Prisma Decimal -> number agar JSON ramah client
export const num = <T extends Record<string, any>>(r: T) => ({
  ...r,
  ...(r.latitude != null && { latitude: Number(r.latitude) }),
  ...(r.longitude != null && { longitude: Number(r.longitude) }),
  ...(r.aiConfidence != null && { aiConfidence: Number(r.aiConfidence) }),
});
