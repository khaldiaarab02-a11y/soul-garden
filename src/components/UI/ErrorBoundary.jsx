import { Component } from 'react';
import ErrorState from './ErrorState';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, detail: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, detail: error?.message || null };
  }

  componentDidCatch(error, info) {
    // Never shown to the user — console only, for developers.
    console.error('Soul Garden crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <ErrorState
            detail={import.meta.env.DEV ? this.state.detail : null}
            onRetry={() => {
              this.setState({ hasError: false, detail: null });
              window.location.reload();
            }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
