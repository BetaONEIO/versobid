export const validateEnv = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_PAYPAL_CLIENT_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  // Validate Supabase URL format
  try {
    new URL(import.meta.env.VITE_SUPABASE_URL);
  } catch (error) {
    console.error('Invalid VITE_SUPABASE_URL format');
    return false;
  }

  return true;
};

export const getEnvVar = (key: string, required = true): string => {
  const value = import.meta.env[key];
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};