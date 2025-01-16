import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { validateEnv } from './utils/env';

if (!validateEnv()) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: red;">
        <h1>Environment Configuration Error</h1>
        <p>Missing or invalid environment variables. Please check the console for details.</p>
      </div>
    `;
  }
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}