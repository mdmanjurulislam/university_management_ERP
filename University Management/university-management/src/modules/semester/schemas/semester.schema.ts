import { z } from 'zod';

export const semesterSchema = z.object({
  semesterCode: z.string().min(1, 'Semester code is required'),
  semesterName: z.string().min(1, 'Semester name is required'),
  year: z.coerce.number().int().min(2000, 'Year must be a valid number').max(2100, 'Year must be a valid number'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationStartDate: z.string().min(1, 'Registration start date is required'),
  registrationEndDate: z.string().min(1, 'Registration end date is required'),
  resultPublishDate: z.string().min(1, 'Result publish date is required'),
  isCurrentSemester: z.boolean().default(false),
  isActive: z.boolean().default(true),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine(data => new Date(data.registrationStartDate) < new Date(data.registrationEndDate), {
  message: 'Registration end date must be after start date',
  path: ['registrationEndDate'],
});

export type SemesterFormData = z.infer<typeof semesterSchema>;
