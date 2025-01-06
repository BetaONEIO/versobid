export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  template_name: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  created_at: string;
}

export interface CreateEmailLogParams {
  recipient: string;
  subject: string;
  template_name: string;
}