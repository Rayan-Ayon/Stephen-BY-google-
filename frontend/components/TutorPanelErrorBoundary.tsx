import React, { Component, ReactNode } from 'react';
import { HistoryItem } from './Dashboard';

interface Props {
    children: ReactNode;
    course?: HistoryItem;
    onSeekTo?: (seconds: number) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class TutorPanelErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('=== TUTORPANEL CRASH DETAILS ===');
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        console.error('Component Stack:', errorInfo.componentStack);
        console.error('=================================');
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            const errorMsg = this.state.error?.message || 'Unknown error';
            const errorStack = this.state.error?.stack || '';
            
            return (
                <div className="flex flex-col items-center justify-center h-full p-6 dark:bg-black bg-white">
                    <div className="text-center mb-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-orange-500 font-bold text-lg mb-2">AI Features Temporarily Unavailable</p>
                        <p className="text-gray-500 text-sm mb-2">Video playback still works - you can continue watching</p>
                    </div>
                    
                    {/* Error details for debugging */}
                    <div className="w-full max-w-md mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-left overflow-hidden">
                        <p className="text-xs font-mono text-red-400 break-words mb-2">{errorMsg}</p>
                        <p className="text-[10px] font-mono text-gray-500 break-words max-h-20 overflow-y-auto">
                            {errorStack.slice(0, 300)}...
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={this.handleReset}
                            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                        >
                            Reset AI Panel
                        </button>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 dark:bg-neutral-800 bg-neutral-200 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold hover:opacity-80 transition-opacity"
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default TutorPanelErrorBoundary;