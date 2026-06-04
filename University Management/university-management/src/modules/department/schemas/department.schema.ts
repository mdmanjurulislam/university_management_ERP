import { z } from 'zod';

export const departmentSchema = z.object({
  departmentCode: z
    .string()
    .min(1, 'Department code is required')
    .max(10, 'Department code must not exceed 10 characters'),
  departmentName: z
    .string()
    .min(1, 'Department name is required')
    .max(100, 'Department name must not exceed 100 characters'),
  shortName: z
    .string()
    .min(2, 'Department short name is required')
    .max(5, 'Department short name must not exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must not exceed 255 characters'),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
