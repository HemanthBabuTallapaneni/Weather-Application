import { useState, useEffect } from 'react';
import { WeatherCard } from '../components/WeatherCard';
import { Loader, ErrorState } from '../components/UIStates';
import { weatherService } from '../services/weather';
import type { CurrentWeatherResponse } from '../services/weather';
import { Sun, Sunset, Sunrise } from 'lucide-react';

interface DashboardProps {
    locationQuery: string;
}

const Dashboard: React.FC<DashboardProps> = ({ locationQuery }) => {
    const [data, setData] = useState<CurrentWeatherResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await weatherService.getCurrentWeather(locationQuery);
            setData(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [locationQuery]);

    if (loading) return <Loader message={`Fetching weather for ${locationQuery}...`} />;
    if (error) return <ErrorState message={error} onRetry={fetchWeather} />;
    if (!data) return null;

    return (
        <div className="flex flex-col gap-lg h-full fade-in">
            <WeatherCard current={data.current} location={data.location} />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-lg)'
            }}>
                <div className="glass-panel" style={{ padding: 'var(--space-xl)' }}>
                    <h3 className="text-lg font-medium" style={{ marginBottom: 'var(--space-lg)' }}>Air Quality & Details</h3>
                    <div className="flex flex-col gap-md text-sm">
                        <div className="flex justify-between border-b pb-sm border-[var(--color-glass-border)]" style={{ paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-glass-border)' }}>
                            <span className="text-text-secondary">UV Index</span>
                            <span className="font-medium">{data.current.uv_index}</span>
                        </div>
                        <div className="flex justify-between" style={{ paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-glass-border)' }}>
                            <span className="text-text-secondary">Visibility</span>
                            <span className="font-medium">{data.current.visibility} km</span>
                        </div>
                        <div className="flex justify-between" style={{ paddingBottom: 'var(--space-sm)' }}>
                            <span className="text-text-secondary">Precipitation</span>
                            <span className="font-medium">{data.current.precip} mm</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <h3 className="text-lg font-medium">Solar Cycle</h3>
                    <div className="flex justify-between items-center" style={{ flex: 1 }}>
                        <div className="flex flex-col items-center gap-sm">
                            <Sunrise size={32} className="text-text-accent" />
                            <span className="text-sm font-medium">Local Time</span>
                            <span className="text-xs text-text-secondary">{data.location.localtime.split(' ')[1]}</span>
                        </div>

                        <div className="flex flex-col items-center gap-sm">
                            <Sun size={32} className="text-[#fbbf24]" />
                            <span className="text-sm font-medium">Day/Night</span>
                            <span className="text-xs text-text-secondary">{data.current.is_day === 'yes' ? 'Day' : 'Night'}</span>
                        </div>

                        <div className="flex flex-col items-center gap-sm">
                            <Sunset size={32} className="text-[#f87171]" />
                            <span className="text-sm font-medium">Timezone</span>
                            <span className="text-xs text-text-secondary">{data.location.timezone_id.split('/')[1] || data.location.timezone_id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
