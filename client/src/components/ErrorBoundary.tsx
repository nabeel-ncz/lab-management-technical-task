import React from 'react';
import { Result, Button } from 'antd';
import { BugOutlined } from '@ant-design/icons';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <Result
              status="error"
              icon={<BugOutlined />}
              title="Oops! Something went wrong"
              subTitle={
                <div className="space-y-2">
                  <div>We encountered an unexpected error. This has been logged and we'll look into it.</div>
                  {import.meta.env.VITE_ENVIRONMENT === 'development' && this.state.error && (
                    <details className="mt-4 p-3 bg-gray-100 rounded text-sm text-left">
                      <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600">
                        {this.state.error.name}: {this.state.error.message}
                        {this.state.error.stack && `\n\n${this.state.error.stack}`}
                      </pre>
                    </details>
                  )}
                </div>
              }
              extra={[
                <Button type="primary" onClick={this.resetError} key="retry">
                  Try Again
                </Button>,
                <Button key="refresh" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>,
              ]}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const useErrorHandler = () => {
  return (error: Error, errorInfo?: { componentStack: string }) => {
    console.error('Error caught by error handler:', error, errorInfo);
  };
}; 