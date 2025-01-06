import { AuthUser } from './types/user';

export interface AuthService {
  signup: (formData: AuthFormData) => Promise<AuthUser>;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  requestPasswordReset: (email: string) => Promise<void>;
}

export interface AuthFormData {
  email: string;
  password: string;
  username?: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}