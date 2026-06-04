import type { Department } from '../../department/types/department.types';

export interface Faculty {
  id: number;
  facultyCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  employeeId: string;
  designation: string;
  joiningDate: string;
  employmentType: string;
  highestQualification: string;
  specialization: string;
  officeRoom: string;
  department: Department;
  isActive: boolean;
}

export interface FacultyListItem {
  id: number;
  facultyCode: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  designation: string;
  employmentType: string;
  departmentName: string;
  isActive: boolean;
}

export interface EnrollFacultyDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  employeeId: string;
  designation: string;
  joiningDate: string;
  employmentType: string;
  highestQualification: string;
  specialization: string;
  officeRoom: string;
  departmentId: number;
}

export interface UpdateFacultyDto extends Partial<EnrollFacultyDto> {
  isActive?: boolean;
}

export interface FacultyApiResponse<T> {
  message: string;
  code: number;
  response: T;
}

export interface PaginatedFacultyResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
