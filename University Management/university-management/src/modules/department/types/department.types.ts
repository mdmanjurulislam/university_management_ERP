import type { User } from '../../administration/types/user.types';

export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  shortName: string;
  description: string;
  isActive: boolean;
  createdBy?: User;
  createdAt?: string;
  updatedBy?: User;
  updatedAt?: string;
}

export interface CreateDepartmentRequest {
  departmentCode: string;
  departmentName: string;
  description: string;
}

export interface UpdateDepartmentRequest {
  id: number;
  departmentCode: string;
  departmentName: string;
  shortName: string;
  description: string;
}
