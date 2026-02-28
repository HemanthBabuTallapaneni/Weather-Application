import React, { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { MapPin, Navigation } from 'lucide-react';

interface WelcomeProps {
    onLocationSelect: (location: string) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onLocationSelect }) => {
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Weatherstack allows coordinate lookup: lat,lon
                onLocationSelect(`${latitude},${longitude}`);
                setIsLocating(false);
            },
            () => {
                setError("Unable to retrieve your location. Please type it below.");
                setIsLocating(false);
            },
            { timeout: 10000 }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full fade-in" style={{ padding: 'var(--space-2xl)' }}>
            <div className="glass-panel flex flex-col items-center text-center max-w-lg w-full" style={{ padding: 'var(--space-2xl)', gap: 'var(--space-xl)' }}>

                <div style={{
                    padding: 'var(--space-lg)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    borderRadius: '50%',
                    marginBottom: 'var(--space-sm)'
                }}>
                    <MapPin size={48} className="text-text-accent" />
                </div>

                <div>
                    <h1 className="text-4xl font-light text-gradient mb-sm">Welcome to Atmos</h1>
                    <p className="text-on-secondary">Search for a city or use your current location to view the weather forecast.</p>
                </div>

                <div className="w-full flex flex-col gap-md mt-md">
                    <button
                        onClick={handleGeolocation}
                        disabled={isLocating}
                        className="glass-button flex items-center justify-center gap-sm w-full"
                        style={{ padding: 'var(--space-md)' }}
                    >
                        {isLocating ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-text-accent"></div>
                        ) : (
                            <>
                                <Navigation size={18} />
                                Use Current Location
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-md text-text-secondary w-full" style={{ margin: 'var(--space-sm) 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-glass-border)' }}></div>
                        <span className="text-xs uppercase tracking-wider">or</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-glass-border)' }}></div>
                    </div>

                    <div className="w-full">
                        <SearchBar onSearch={onLocationSelect} />
                    </div>

                    {error && (
                        <p className="text-sm text-[#f87171] mt-sm text-center">{error}</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Welcome;
