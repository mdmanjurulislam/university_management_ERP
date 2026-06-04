export interface User {
  userName: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  code: number;
  response: {
    accessToken: string;
    refreshToken: string;
    userName: string;
    role: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AUTH_TYPES = true; // Ensure runtime presence

export const DUMMY_EXPORT = 'dummy';
