import { z } from 'zod';

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const WasteCategory = {
  ORGANIC: 'organic',
  PLASTIC: 'plastic',
  PAPER: 'paper',
} as const;
export type WasteCategory = (typeof WasteCategory)[keyof typeof WasteCategory];

export const ReportStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  phone: z.string().optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const CreateReportSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(150),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter'),
  category: z.enum(['organic', 'plastic', 'paper']),
  ai_confidence: z.number().min(0).max(1).optional(),
  image_url: z.string().url('URL gambar tidak valid'),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});
export type CreateReportInput = z.infer<typeof CreateReportSchema>;

export const UpdateReportStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'rejected']),
  note: z.string().optional(),
});
export type UpdateReportStatusInput = z.infer<typeof UpdateReportStatusSchema>;
