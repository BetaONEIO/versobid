export interface DiagnosticResult {
  success: boolean;
  message: string;
  error?: Error;
}

export interface EmailSystemConfig {
  brevoApiKey: string;
  testEmail: string;
}