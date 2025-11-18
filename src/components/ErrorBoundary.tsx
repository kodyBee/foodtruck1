'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="mb-8">
                <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-400 mb-6">
                  We&apos;re sorry for the inconvenience. Please try refreshing the page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
