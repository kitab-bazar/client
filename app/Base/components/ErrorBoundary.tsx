import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    className?: string;
}
interface ErrorBoundaryState {
    hasError: boolean;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static getDerivedStateFromError(error: unknown) {
        // eslint-disable-next-line no-console
        console.error(error);
        return { hasError: true };
    }

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    // componentDidCatch(error, errorInfo) { }

    render() {
        const { hasError } = this.state;
        const {
            children,
            className,
        } = this.props;

        if (hasError) {
            // FIXME: style this
            return (
                <div className={className}>
                    Some error occurred
                </div>
            );
        }
        return children;
    }
}
export default ErrorBoundary;
