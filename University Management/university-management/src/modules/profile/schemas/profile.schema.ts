import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Gender is required' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address must not exceed 500 characters').optional().or(z.literal('')),
  
  // Faculty specific
  qualification: z.string().max(100, 'Qualification must not exceed 100 characters').optional().or(z.literal('')),
  specialization: z.string().max(200, 'Specialization must not exceed 200 characters').optional().or(z.literal('')),
  officeRoom: z.string().max(50, 'Office room must not exceed 50 characters').optional().or(z.literal('')),

  // Student specific
  guardianName: z.string().max(100, 'Guardian name must not exceed 100 characters').optional().or(z.literal('')),
  guardianPhone: z.string().optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
