/**
 * Error Display Components
 * 
 * User-friendly error messages and recovery options for the brand creation wizard.
 */

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Wrench, 
  Wifi, 
  XCircle, 
  CheckCircle,
  Info,
  Lightbulb
} from 'lucide-react';
import { ErrorHandlingState } from '@/hooks/useErrorHandling';

interface ErrorDisplayProps {
  errorState: ErrorHandlingState;
  onRetry?: () => void;
  onReset?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errorState,
  onRetry,
  onReset,
  onDismiss,
  className = ''
}) => {
  if (!errorState.hasError) {
    return null;
  }

  const getErrorIcon = () => {
    switch (errorState.errorType) {
      case 'validation':
        return <XCircle className="h-4 w-4" />;
      case 'step':
        return <AlertTriangle className="h-4 w-4" />;
      case 'network':
        return <Wifi className="h-4 w-4" />;
      case 'repair':
        return <Wrench className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getErrorColor = () => {
    switch (errorState.errorType) {
      case 'validation':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'step':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'network':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'repair':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-red-200 bg-red-50 text-red-800';
    }
  };

  const getErrorTitle = () => {
    switch (errorState.errorType) {
      case 'validation':
        return 'Validation Error';
      case 'step':
        return 'Step Mismatch';
      case 'network':
        return 'Network Error';
      case 'repair':
        return 'Auto-Repair Failed';
      default:
        return 'Error';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Error Alert */}
      <Alert className={getErrorColor()}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getErrorIcon()}
            <div className="flex-1">
              <AlertDescription className="font-medium">
                {getErrorTitle()}
              </AlertDescription>
              <AlertDescription className="mt-1 text-sm opacity-90">
                {errorState.errorMessage}
              </AlertDescription>
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-current hover:bg-current/10"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Alert>

      {/* Suggestions */}
      {errorState.suggestions.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm text-orange-800">
              <Lightbulb className="h-4 w-4" />
              <span>Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1 text-sm text-orange-700">
              {errorState.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-orange-600">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recovery Actions */}
      <div className="flex flex-wrap gap-2">
        {errorState.canRetry && onRetry && (
          <Button
            onClick={onRetry}
            disabled={errorState.isRetrying}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {errorState.isRetrying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>
              {errorState.isRetrying ? 'Retrying...' : 'Try Again'}
            </span>
            {errorState.retryCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {errorState.retryCount}/{errorState.maxRetries}
              </Badge>
            )}
          </Button>
        )}

        {onReset && (
          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* Error Details (Development) */}
      {process.env.NODE_ENV === 'development' && errorState.lastError && (
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700">Error Details (Dev)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(errorState.lastError, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ErrorToastProps {
  errorState: ErrorHandlingState;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  errorState,
  onRetry,
  onDismiss
}) => {
  if (!errorState.hasError) {
    return null;
  }

  const getToastColor = () => {
    switch (errorState.errorType) {
      case 'validation':
        return 'bg-red-500';
      case 'step':
        return 'bg-orange-500';
      case 'network':
        return 'bg-blue-500';
      case 'repair':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${getToastColor()}`}>
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-5 w-5" />
        <div className="flex-1">
          <p className="font-medium text-sm">{errorState.errorMessage}</p>
          {errorState.suggestions.length > 0 && (
            <p className="text-xs opacity-90 mt-1">
              {errorState.suggestions[0]}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {errorState.canRetry && onRetry && (
            <Button
              onClick={onRetry}
              disabled={errorState.isRetrying}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              {errorState.isRetrying ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={onDismiss}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ErrorBannerProps {
  errorState: ErrorHandlingState;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  errorState,
  onRetry,
  onDismiss,
  className = ''
}) => {
  if (!errorState.hasError) {
    return null;
  }

  const getBannerColor = () => {
    switch (errorState.errorType) {
      case 'validation':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'step':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'network':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'repair':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-red-100 border-red-300 text-red-800';
    }
  };

  return (
    <div className={`border-l-4 p-4 ${getBannerColor()} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">{errorState.errorMessage}</p>
            {errorState.suggestions.length > 0 && (
              <p className="text-sm opacity-90 mt-1">
                {errorState.suggestions[0]}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {errorState.canRetry && onRetry && (
            <Button
              onClick={onRetry}
              disabled={errorState.isRetrying}
              variant="outline"
              size="sm"
              className="border-current text-current hover:bg-current hover:text-white"
            >
              {errorState.isRetrying ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">
                {errorState.isRetrying ? 'Retrying...' : 'Retry'}
              </span>
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={onDismiss}
              variant="ghost"
              size="sm"
              className="text-current hover:bg-current/10"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ErrorStatsProps {
  errorState: ErrorHandlingState;
  className?: string;
}

export const ErrorStats: React.FC<ErrorStatsProps> = ({
  errorState,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Error Handling Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current Error</p>
            <p className="font-medium">
              {errorState.errorType || 'None'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Retry Count</p>
            <p className="font-medium">
              {errorState.retryCount}/{errorState.maxRetries}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Repair Attempts</p>
            <p className="font-medium">
              {errorState.repairAttempts}/{errorState.maxRepairAttempts}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Can Retry</p>
            <p className="font-medium">
              {errorState.canRetry ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
