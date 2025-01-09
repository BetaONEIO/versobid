// Base email template interface with proper generic type handling
export interface EmailTemplate<T = any> {
  name: string;
  subject: string;
  getParams: (data?: T) => Record<string, any>;
}

export interface EmailOptions {
  to: string;
  subject: string;
  templateName: string;
  params: Record<string, any>;
}