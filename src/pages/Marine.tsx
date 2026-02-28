import React, { useState, useEffect } from 'react';
import { Loader, ErrorState } from '../components/UIStates';
import { weatherService } from '../services/weather';
import { Compass, Thermometer, Waves, Wind } from 'lucide-react';

interface MarineProps {
    locationQuery: string; // Since Marine is based on lat/lon, we use the query to fetch lat/lon first
}

const Marine: React.FC<MarineProps> = ({ locationQuery }) => {
    const [data, setData] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMarine = async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Find location lat/lon
            const locations = await weatherService.searchLocation(locationQuery);
            if (!locations || locations.length === 0) {
                throw new Error(`Could not resolve coordinates for ${locationQuery}`);
            }
            const targetLoc = locations[0];

            // Step 2: Fetch Marine data
            const res = await weatherService.getMarineWeather(targetLoc.lat, targetLoc.lon);

            // Merge nice name into response for UI
            (res.location as Record<string, unknown>).name = targetLoc.name;
            setData(res as Record<string, unknown>);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarine();
    }, [locationQuery]);

    if (loading) return <Loader message={`Surveying marine conditions for ${locationQuery}...`} />;
    if (error) return <ErrorState message={error} onRetry={fetchMarine} />;
    if (!data) return null;

    return (
        <div className="flex flex-col gap-lg h-full fade-in">
            <div className="glass-panel" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <h2 className="text-2xl text-gradient">Marine Weather</h2>
                <div className="flex items-center gap-md text-sm text-on-secondary" style={{ marginTop: 'var(--space-xs)' }}>
                    <span>Location: {(data.location as Record<string, unknown>).name as string}</span>
                    <span>•</span>
                    <span>Lat: {(data.location as Record<string, unknown>).lat as string}, Lon: {(data.location as Record<string, unknown>).lon as string}</span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-lg)'
            }}>
                <div className="glass-panel flex items-center gap-md" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ padding: 'var(--space-md)', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-pill)' }}>
                        <Thermometer size={28} className="text-text-accent" />
                    </div>
                    <div>
                        <p className="text-sm text-on-secondary">Water Temp</p>
                        <p className="text-2xl font-medium">{Number((data.marine as Record<string, unknown>).water_temp).toFixed(1)}°</p>
                    </div>
                </div>

                <div className="glass-panel flex items-center gap-md" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ padding: 'var(--space-md)', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-pill)' }}>
                        <Waves size={28} className="text-text-accent" />
                    </div>
                    <div>
                        <p className="text-sm text-on-secondary">Sig. Wave Height</p>
                        <p className="text-2xl font-medium">{(data.marine as Record<string, unknown>).sig_height_m as string} m</p>
                    </div>
                </div>

                <div className="glass-panel flex items-center gap-md" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ padding: 'var(--space-md)', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-pill)' }}>
                        <Wind size={28} className="text-text-accent" />
                    </div>
                    <div>
                        <p className="text-sm text-on-secondary">Swell Height</p>
                        <p className="text-2xl font-medium">{(data.marine as Record<string, unknown>).swell_height as string} m</p>
                    </div>
                </div>

                <div className="glass-panel flex items-center gap-md" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ padding: 'var(--space-md)', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-pill)' }}>
                        <Compass size={28} className="text-text-accent" />
                    </div>
                    <div>
                        <p className="text-sm text-on-secondary">Swell Direction</p>
                        <p className="text-2xl font-medium">{(data.marine as Record<string, unknown>).swell_dir_16_point as string}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: 'var(--space-xl)', flex: 1 }}>
                <h3 className="text-lg font-medium" style={{ marginBottom: 'var(--space-lg)' }}>Tidal Predictions</h3>
                <div className="flex flex-col gap-md">
                    {((data.marine as Record<string, unknown>).tides as Array<Record<string, unknown>>).map((tide: Record<string, unknown>, i: number) => (
                        <div key={i} className="flex justify-between items-center" style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: `4px solid ${tide.tide_type === 'HIGH' ? '#38bdf8' : '#94a3b8'}`
                        }}>
                            <div>
                                <p className="font-medium text-gradient">{tide.tide_type as string} TIDE</p>
                                <p className="text-sm text-on-secondary">{tide.tideTime as string}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-light">{tide.tideHeight_mt as string} m</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Marine;
