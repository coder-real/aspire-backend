import { z } from 'zod';

export const createStudentSchema = z.object({
  fullName: z.string().min(2).max(255),
  regNumber: z.string().min(1).max(100),
  class: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export const uploadResultsSchema = z.object({
  studentId: z.string().uuid(),
  term: z.string().min(1),
  session: z.string().min(1),
  results: z.array(z.object({
    subject: z.string().min(1).max(255),
    ca: z.number().min(0).max(40),
    exam: z.number().min(0).max(60),
  })).min(1).max(20),
});
