import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 text-red-900 p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong 😢</h1>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="font-mono text-sm mb-2">{this.state.error?.toString()}</p>
            <pre className="whitespace-pre-wrap text-xs text-red-600">
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
