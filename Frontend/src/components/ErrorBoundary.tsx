import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // You could log the error to an error reporting service here
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-lg mb-2">We're sorry for the inconvenience. Please try again later.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 p-2 bg-red-200 rounded text-sm w-full max-w-md text-left">
              <summary>Error Details</summary>
              <pre className="whitespace-pre-wrap break-all">{this.state.error.message}</pre>
              <pre className="whitespace-pre-wrap break-all text-xs mt-2">{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
