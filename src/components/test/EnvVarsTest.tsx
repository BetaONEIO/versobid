import React from 'react';

interface EnvVar {
  key: string;
  value: string | undefined;
  required: boolean;
  description: string;
}

export const EnvVarsTest: React.FC = () => {
  const envVars: EnvVar[] = [
    {
      key: 'VITE_SUPABASE_URL',
      value: import.meta.env.VITE_SUPABASE_URL,
      required: true,
      description: 'Required for database and authentication'
    },
    {
      key: 'VITE_SUPABASE_ANON_KEY',
      value: import.meta.env.VITE_SUPABASE_ANON_KEY,
      required: true,
      description: 'Required for database and authentication'
    },
    {
      key: 'VITE_PAYPAL_CLIENT_ID',
      value: import.meta.env.VITE_PAYPAL_CLIENT_ID,
      required: true,
      description: 'Required for payment processing'
    },
    {
      key: 'VITE_SERPAPI_KEY',
      value: import.meta.env.VITE_SERPAPI_KEY,
      required: false,
      description: 'Optional - Used for product search suggestions'
    }
  ];

  const getStatusColor = (envVar: EnvVar) => {
    if (!envVar.value) {
      return envVar.required
        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const getStatusText = (envVar: EnvVar) => {
    if (!envVar.value) {
      return envVar.required ? 'Missing' : 'Not Set';
    }
    return 'Present';
  };

  const missingRequired = envVars.filter(env => env.required && !env.value);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Environment Variables Status</h2>
        {missingRequired.length > 0 && (
          <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-200">
            {missingRequired.length} Required Missing
          </span>
        )}
      </div>

      <div className="space-y-4">
        {envVars.map((envVar) => (
          <div key={envVar.key} className="flex items-start justify-between space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{envVar.key}</span>
                {envVar.required ? (
                  <span className="px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded dark:bg-red-900 dark:text-red-200">
                    Required
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">
                    Optional
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {envVar.description}
              </p>
            </div>
            <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(envVar)}`}>
              {getStatusText(envVar)}
            </span>
          </div>
        ))}
      </div>

      {missingRequired.length > 0 && (
        <div className="mt-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Missing Required Variables</h3>
          <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
            {missingRequired.map(env => (
              <li key={env.key}>{env.key} - {env.description}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Environment Setup:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Create a <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">.env</code> file in the project root</li>
          <li>Copy variables from <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">.env.example</code></li>
          <li>Fill in the required values from your service providers</li>
          <li>Restart the development server to apply changes</li>
        </ol>
      </div>
    </div>
  );
};