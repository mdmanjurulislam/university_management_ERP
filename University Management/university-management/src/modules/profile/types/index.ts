export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'USER';
  isActive: boolean;

  // Personal details
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;

  // Student specific
  studentId?: string;
  department?: string;
  semester?: string;
  admissionDate?: string;
  guardianName?: string;
  guardianPhone?: string;

  // Faculty specific
  facultyCode?: string;
  employeeId?: string;
  designation?: string;
  joiningDate?: string;
  employmentType?: string;
  qualification?: string;
  specialization?: string;
  officeRoom?: string;
}

export interface ProfileUpdateRequest {
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  address?: string;

  // Faculty specific
  qualification?: string;
  specialization?: string;
  officeRoom?: string;

  // Student specific
  guardianName?: string;
  guardianPhone?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
