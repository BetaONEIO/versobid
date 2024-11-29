export interface AuthFormData {
  email: string;
  password: string;
  name: string;
  username: string;
  roles: {
    buyer: boolean;
    seller: boolean;
  };
  acceptedTerms: boolean;
}

export interface AuthFormProps {
  isLogin: boolean;
  loading: boolean;
  formData: AuthFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}