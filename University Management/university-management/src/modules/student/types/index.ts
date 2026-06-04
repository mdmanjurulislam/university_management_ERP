import type { Department } from '../../department/types/department.types';
import type { Semester } from '../../semester/types';
import type { User } from '../../administration/types/user.types';

export interface Student {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  batchYear: number;
  isActive: boolean;
  departmentId: number;
  semesterId: number;
  admissionDate: string;
  department: Department;
  semester: Semester;
  createdBy?: User;
  createdAt?: string;
  updatedBy?: User;
  updatedAt?: string;
}

export interface EnrollStudentDto {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  batchYear: number;
  departmentId: number;
  semesterId: number;
  admissionDate: string;
}

export interface UpdateStudentDto extends Partial<EnrollStudentDto> {
  isActive?: boolean;
}

export interface StudentApiResponse<T> {
  message: string;
  code: number;
  response: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface StudentListItem {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  batchYear: number;
  departmentName: string;
  semesterName: string;
  isActive: boolean;
}
