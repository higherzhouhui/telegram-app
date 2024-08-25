import {
  Component,
  type ComponentType,
  type GetDerivedStateFromError,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

export interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode | ComponentType<{ error: unknown }>;
  H5PcRoot: ReactNode;
}

interface ErrorBoundaryState {
  error?: unknown;
  usePc?: boolean,
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {};
  // eslint-disable-next-line max-len
  static getDerivedStateFromError: GetDerivedStateFromError<ErrorBoundaryProps, ErrorBoundaryState> = (error) => ({ error });

  componentDidCatch(error: Error) {
    this.setState({ error });
    if (error.message == 'Unable to determine current environment and possible way to send event. You are probably trying to use Mini Apps method outside the Telegram application environment.') {
      this.setState({ usePc: true })
      console.log('userPc')
    }
  }

  render() {
    const {
      state: {
        error,
        usePc
      },
      props: {
        fallback: Fallback,
        children,
        H5PcRoot
      },
    } = this;
    return usePc ? H5PcRoot : 'error' in this.state
      ? typeof Fallback === 'function'
        ? <Fallback error={error} />
        : Fallback
      : children;
  }
}
