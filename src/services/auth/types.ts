import { User } from '../../types/user';

export interface AuthService {
  login: (identifier: string, password: string) => Promise<User>;
  signup: (formData: AuthFormData) => Promise<User>;
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
  user?: User;
}