import React, { useState, useEffect } from 'react';
import { Loader, ErrorState } from '../components/UIStates';
import { weatherService } from '../services/weather';
import { Calendar as CalendarIcon, Clock, Cloud, ThermometerSun } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface HistoricalProps {
    locationQuery: string;
}

const Historical: React.FC<HistoricalProps> = ({ locationQuery }) => {
    const [data, setData] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // Default to yesterday
    const [selectedDate, setSelectedDate] = useState<string>(
        format(subDays(new Date(), 1), 'yyyy-MM-dd')
    );

    const fetchHistorical = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await weatherService.getHistoricalWeather(locationQuery, selectedDate);
            setData(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistorical();
    }, [locationQuery, selectedDate]);

    if (loading) return <Loader message={`Loading historical data for ${selectedDate}...`} />;
    if (error) return <ErrorState message={error} onRetry={fetchHistorical} />;
    if (!data || !(data.historical as Record<string, unknown>)[selectedDate]) return null;

    const dayData = (data.historical as Record<string, Record<string, unknown>>)[selectedDate];

    return (
        <div className="flex flex-col gap-lg h-full fade-in">
            <div className="glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-lg" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <div>
                    <h2 className="text-2xl text-gradient">Historical Records</h2>
                    <p className="text-on-secondary text-sm">Location: {(data.location as Record<string, unknown>).name as string}</p>
                </div>

                <div className="flex items-center gap-sm">
                    <CalendarIcon size={18} className="text-text-secondary" />
                    <input
                        type="date"
                        value={selectedDate}
                        max={format(subDays(new Date(), 1), 'yyyy-MM-dd')}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="glass-input"
                        style={{ padding: 'var(--space-sm) var(--space-md)', width: 'auto' }}
                    />
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-lg)'
            }}>
                <div className="glass-panel flex flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-xl)' }}>
                    <ThermometerSun size={32} className="text-[#f87171]" />
                    <span className="text-sm text-on-secondary">Max Temperature</span>
                    <span className="text-3xl font-light">{dayData.maxtemp as number}°</span>
                </div>

                <div className="glass-panel flex flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-xl)' }}>
                    <ThermometerSun size={32} className="text-[#60a5fa]" />
                    <span className="text-sm text-on-secondary">Min Temperature</span>
                    <span className="text-3xl font-light">{dayData.mintemp as number}°</span>
                </div>

                <div className="glass-panel flex flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-xl)' }}>
                    <Cloud size={32} className="text-text-secondary" />
                    <span className="text-sm text-on-secondary">Total Snow</span>
                    <span className="text-3xl font-light">{dayData.totalsnow as number} cm</span>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: 'var(--space-xl)', flex: 1 }}>
                <h3 className="text-lg font-medium" style={{ marginBottom: 'var(--space-lg)' }}>Hourly Breakdown</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 'var(--space-md)'
                }}>
                    {(dayData.hourly as Array<Record<string, unknown>>).map((hour: Record<string, unknown>) => (
                        <div key={hour.time as string} className="flex flex-col items-center gap-sm" style={{
                            padding: 'var(--space-md)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-glass-border)'
                        }}>
                            <div className="flex items-center gap-xs text-text-secondary text-sm">
                                <Clock size={14} />
                                <span>{(hour.time as string).padStart(4, '0')}</span>
                            </div>
                            <span className="text-2xl font-light">{hour.temperature as number}°</span>
                            <span className="text-xs text-on-secondary text-center">{hour.weather_descriptions as string}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Historical;
