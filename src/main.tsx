import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global Console Error & CSP Security Policy Violation Listeners
if (typeof window !== 'undefined') {
  window.addEventListener('securitypolicyviolation', (e) => {
    console.error('🛑 [CSP Violation]:', {
      violatedDirective: e.violatedDirective,
      effectiveDirective: e.effectiveDirective,
      blockedURI: e.blockedURI,
      sourceFile: e.sourceFile,
      lineNumber: e.lineNumber,
      columnNumber: e.columnNumber,
      sample: e.sample,
      originalPolicy: e.originalPolicy,
    });
  });

  window.addEventListener('error', (e) => {
    console.error('🚨 [Runtime Error]:', e.message, `at ${e.filename}:${e.lineno}:${e.colno}`, e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('⚠️ [Unhandled Promise Rejection]:', e.reason);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

