import React from 'react';

export const EnvVarsTest: React.FC = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Environment Variables Status</h2>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="font-mono text-sm">{key}:</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                   : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {value ? 'Present' : 'Missing'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};