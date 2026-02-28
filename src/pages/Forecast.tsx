import React, { useState, useEffect } from 'react';
import { Loader, ErrorState } from '../components/UIStates';
import { weatherService } from '../services/weather';
import { Droplets, Sun, Thermometer } from 'lucide-react';

interface ForecastProps {
    locationQuery: string;
}

const Forecast: React.FC<ForecastProps> = ({ locationQuery }) => {
    const [data, setData] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchForecast = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await weatherService.getForecast(locationQuery);
            setData(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForecast();
    }, [locationQuery]);

    if (loading) return <Loader message={`Generating 7-day forecast for ${locationQuery}...`} />;
    if (error) return <ErrorState message={error} onRetry={fetchForecast} />;
    if (!data) return null;

    return (
        <div className="flex flex-col gap-lg h-full fade-in">
            <div className="glass-panel" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <h2 className="text-2xl text-gradient">7-Day Forecast</h2>
                <p className="text-on-secondary text-sm">Location: {(data.location as Record<string, unknown>).name as string}</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--space-md)'
            }}>
                {(data.forecast as Array<Record<string, unknown>>).map((day: Record<string, unknown>, index: number) => {
                    const dateObj = new Date(day.date as string);
                    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);
                    const isToday = index === 0;

                    return (
                        <div key={day.date as string} className="glass-panel" style={{
                            padding: 'var(--space-lg)',
                            border: isToday ? '1px solid var(--color-text-accent)' : undefined,
                            background: isToday ? 'rgba(56, 189, 248, 0.05)' : undefined
                        }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                                <div>
                                    <h3 className="text-lg font-medium" style={{ color: isToday ? 'var(--color-text-accent)' : 'inherit' }}>
                                        {isToday ? 'Tomorrow' : dayName}
                                    </h3>
                                    <p className="text-sm text-on-secondary">{String(day.date)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-medium">{String(day.maxtemp)}°</p>
                                    <p className="text-sm text-on-secondary">{String(day.mintemp)}°</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-lg)' }}>
                                <span className="text-sm font-medium">{day.weather_descriptions as string}</span>
                            </div>

                            <div className="flex justify-between text-sm text-on-secondary border-t pt-sm border-[var(--color-glass-border)]" style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-glass-border)' }}>
                                <div className="flex items-center gap-xs">
                                    <Sun size={14} className="text-[#fbbf24]" />
                                    <span>UV: {day.uv_index as number}</span>
                                </div>
                                <div className="flex items-center gap-xs">
                                    <Droplets size={14} className="text-text-accent" />
                                    <span>{day.humidity as number}%</span>
                                </div>
                                <div className="flex items-center gap-xs">
                                    <Thermometer size={14} className="text-[#f87171]" />
                                    <span>Avg: {day.avgtemp as number}°</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
