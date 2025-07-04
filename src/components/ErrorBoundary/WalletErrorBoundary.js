import React from 'react';

/**
 * Error Boundary for Wallet Operations
 * Prevents wallet connection errors from crashing the entire application
 */
class WalletErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('Wallet Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    // Reset the error boundary state
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="wallet-error-boundary">
          <div className="wallet-error-content">
            <div className="wallet-error-icon">⚠️</div>
            <h3>Wallet Connection Error</h3>
            <p>
              Something went wrong while connecting to your wallet. 
              This might be due to a wallet extension issue or network problem.
            </p>
            
            <div className="wallet-error-actions">
              <button 
                className="btn btn-primary"
                onClick={this.handleRetry}
              >
                Try Again
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="wallet-error-details">
                <summary>Error Details (Development)</summary>
                <pre className="wallet-error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          
          <style jsx>{`
            .wallet-error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 300px;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
              margin: 20px 0;
            }
            
            .wallet-error-content {
              text-align: center;
              max-width: 500px;
            }
            
            .wallet-error-icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            
            .wallet-error-content h3 {
              color: #dc3545;
              margin-bottom: 12px;
            }
            
            .wallet-error-content p {
              color: #6c757d;
              margin-bottom: 24px;
              line-height: 1.5;
            }
            
            .wallet-error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-bottom: 20px;
            }
            
            .wallet-error-actions button {
              padding: 8px 16px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: 500;
            }
            
            .btn-primary {
              background-color: #007bff;
              color: white;
            }
            
            .btn-primary:hover {
              background-color: #0056b3;
            }
            
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
            
            .btn-secondary:hover {
              background-color: #545b62;
            }
            
            .wallet-error-details {
              text-align: left;
              margin-top: 20px;
              padding: 12px;
              background: #f1f3f4;
              border-radius: 4px;
            }
            
            .wallet-error-stack {
              font-size: 12px;
              color: #495057;
              white-space: pre-wrap;
              max-height: 200px;
              overflow-y: auto;
            }
          `}</style>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default WalletErrorBoundary;

