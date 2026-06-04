import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  userPassword: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
