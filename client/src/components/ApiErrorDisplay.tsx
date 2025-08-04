import React from 'react';
import { Alert, Button, Typography } from 'antd';
import { ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ApiErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  context?: string;
  showDetails?: boolean;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  error,
  onRetry,
  context = 'API operation',
  showDetails = false
}) => {
  const getErrorMessage = (error: Error): string => {
    if (error?.message?.includes('Network error') || error?.message?.includes('ECONNREFUSED')) {
      return 'Unable to connect to the server. Please check your internet connection and ensure the server is running.';
    }

    if (error.message.includes('timeout')) {
      return 'The request took too long to complete. Please try again.';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorAny = error as any;
    if (errorAny?.status) {
      switch (errorAny?.status) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Authentication required. Please log in and try again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 422:
          return 'Validation error. Please check your input.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return error.message || `An error occurred during ${context}`;
      }
    }

    return error.message || `An unexpected error occurred during ${context}`;
  };

  const getErrorType = (): 'error' | 'warning' => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorAny = error as any;
    if (error?.message?.includes('Network') || error?.message?.includes('ECONNREFUSED') || errorAny?.status >= 500) {
      return 'error';
    }
    return 'warning';
  };

  return (
    <div className="space-y-4">
      <Alert
        message={`${context.charAt(0).toUpperCase() + context.slice(1)} Failed`}
        description={getErrorMessage(error)}
        type={getErrorType()}
        icon={<ExclamationCircleOutlined />}
        showIcon
        action={
          onRetry && (
            <Button size="small" type="primary" ghost icon={<ReloadOutlined />} onClick={onRetry}>
              Retry
            </Button>
          )
        }
      />

      {showDetails && import.meta.env.VITE_ENVIRONMENT === 'development' && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            Show technical details (Development only)
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded border">
            <div className="space-y-2 text-sm">
              <div>
                <Text strong>Error Type:</Text>
                <Text code className="ml-2">{error.name || 'Error'}</Text>
              </div>
              <div>
                <Text strong>Message:</Text>
                <Text code className="ml-2">{error.message}</Text>
              </div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(error as any)?.status && (
                <div>
                  <Text strong>HTTP Status:</Text>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Text code className="ml-2">{(error as any)?.status}</Text>
                </div>
              )}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(error as any)?.data && (
                <div>
                  <Text strong>Server Response:</Text>
                  <pre className="mt-1 p-2 bg-white border rounded text-xs overflow-auto">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {JSON.stringify((error as any)?.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </details>
      )}
    </div>
  );
}; 