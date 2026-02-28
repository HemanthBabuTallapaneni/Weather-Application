import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader: React.FC<{ message?: string }> = ({ message = 'Loading weather data...' }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] gap-md">
            <Loader2 className="animate-spin text-text-accent" size={48} />
            <p className="text-on-secondary text-sm">{message}</p>
        </div>
    );
};

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] gap-lg">
            <div className="glass-panel" style={{ padding: 'var(--space-2xl)', textAlign: 'center', maxWidth: '500px' }}>
                <h3 className="text-xl text-gradient mb-md" style={{ marginBottom: 'var(--space-md)' }}>Oops, something went wrong</h3>
                <p className="text-on-secondary" style={{ marginBottom: 'var(--space-xl)' }}>{message}</p>

                {onRetry && (
                    <button className="glass-button w-full" onClick={onRetry}>
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};
