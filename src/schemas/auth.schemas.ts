import { z } from 'zod';

export const studentLoginSchema = z.object({
  schoolCode: z.string().min(1).max(50),
  regNumber: z.string().min(1).max(100),
  password: z.string().min(6),
});

export const adminLoginSchema = z.object({
  schoolCode: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});
