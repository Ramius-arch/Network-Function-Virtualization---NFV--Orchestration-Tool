import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx'; // Import ErrorBoundary

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {' '}
      {/* Wrap with ErrorBoundary */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
