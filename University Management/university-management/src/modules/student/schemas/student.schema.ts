import { z } from 'zod';

export const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.string().min(1, 'Gender is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address is required'),
  guardianName: z.string().min(2, 'Guardian name is required'),
  guardianPhone: z.string().min(10, 'Guardian phone must be at least 10 digits'),
  batchYear: z.coerce.number().int().min(2000, 'Invalid year').max(2100, 'Invalid year'),
  departmentId: z.coerce.number().min(1, 'Department is required'),
  semesterId: z.coerce.number().min(1, 'Semester is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  isActive: z.boolean().default(true).optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
