import { z } from 'zod';

export const facultySchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Gender is required' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  employeeId: z.string().min(2, 'Employee ID is required'),
  designation: z.enum(['LECTURER', 'SENIOR_LECTURER', 'ASSISTANT_PROFESSOR', 'ASSOCIATE_PROFESSOR', 'PROFESSOR'], { message: 'Designation is required' }),
  joiningDate: z.string().min(1, 'Joining date is required'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'VISITING', 'CONTRACTUAL'], { message: 'Employment type is required' }),
  highestQualification: z.string().min(2, 'Qualification is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  officeRoom: z.string().min(1, 'Office room is required'),
  departmentId: z.coerce.number().min(1, 'Department is required'),
  isActive: z.boolean().default(true).optional(),
});

export type FacultyFormData = z.infer<typeof facultySchema>;
