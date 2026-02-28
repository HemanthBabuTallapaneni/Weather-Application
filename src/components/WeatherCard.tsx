import { MapPin, Navigation, Wind, Droplets, Cloud } from 'lucide-react';
import type { WeatherCurrent, WeatherLocation } from '../services/weather';

interface WeatherCardProps {
    current: WeatherCurrent;
    location: WeatherLocation;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ current, location }) => {
    return (
        <div className="glass-panel w-full" style={{ padding: 'var(--space-xl)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-xl)' }}>
                <div>
                    <div className="flex items-center gap-sm text-text-secondary" style={{ marginBottom: 'var(--space-xs)' }}>
                        <MapPin size={16} />
                        <span className="text-sm font-medium">{location.name}, {location.country}</span>
                    </div>
                    <h2 className="text-3xl text-gradient">Current Weather</h2>
                    <p className="text-on-secondary text-sm">
                        Observed at {current.observation_time}
                    </p>
                </div>

                {current.weather_icons && current.weather_icons.length > 0 && (
                    <div className="weather-icon-container" style={{
                        width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
                        boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
                    }}>
                        <img
                            src={current.weather_icons[0]}
                            alt={current.weather_descriptions?.[0] || 'Weather icon'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-lg" style={{ marginBottom: 'var(--space-2xl)' }}>
                <h1 style={{ fontSize: '5rem', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.05em' }}>
                    {current.temperature}°
                </h1>
                <div className="flex flex-col gap-xs">
                    <span className="text-xl font-medium">{current.weather_descriptions?.[0]}</span>
                    <span className="text-sm text-on-secondary">Feels like {current.feelslike}°</span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 'var(--space-md)'
            }}>
                <div className="glass-panel flex flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-md)' }}>
                    <Wind size={24} className="text-text-accent" />
                    <span className="text-sm text-on-secondary">Wind</span>
                    <span className="font-medium">{current.wind_speed} km/h {current.wind_dir}</span>
                </div>

                <div className="glass-panel flex flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-md)' }}>
                    <Droplets size={24} className="text-text-accent" />
                    <span className="text-sm text-on-secondary">Humidity</span>
                    <span className="font-medium">{current.humidity}%</span>
                </div>

                <div className="glass-panel flex flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-md)' }}>
                    <Navigation size={24} className="text-text-accent" />
                    <span className="text-sm text-on-secondary">Pressure</span>
                    <span className="font-medium">{current.pressure} mb</span>
                </div>

                <div className="glass-panel flex flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-md)' }}>
                    <Cloud size={24} className="text-text-accent" />
                    <span className="text-sm text-on-secondary">Cloud Cover</span>
                    <span className="font-medium">{current.cloudcover}%</span>
                </div>
            </div>
        </div>
    );
};
