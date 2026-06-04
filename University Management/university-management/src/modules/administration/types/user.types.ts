export type UserRole = 'ADMIN' | 'STUDENT' | 'FACULTY' | 'USER';

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string | null;
  createdBy: {
    userId: number;
    firstName: string;
    lastName: string;
    userName: string;
    role: UserRole;
  } | null;
  updatedAt: string | null;
  updatedBy: {
    userId: number;
    firstName: string;
    lastName: string;
    userName: string;
    role: UserRole;
  } | null;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  userName: string;
  userPassword?: string;
  role: UserRole;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  userId: number;
}

export const USER_TYPES = true;
