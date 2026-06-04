import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  userName: z.string().min(3, "Username must be at least 3 characters"),
  userPassword: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'STUDENT', 'FACULTY', 'USER'] as const),
});

export type UserFormValues = z.infer<typeof userSchema>;
