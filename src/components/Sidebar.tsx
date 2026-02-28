import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, History, Waves } from 'lucide-react';

export const Sidebar: React.FC = () => {
    return (
        <div className="sidebar glass-panel">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
                }}>
                    <CloudIcon />
                </div>
                <h1 className="text-xl text-gradient">Atmos</h1>
            </div>

            <nav className="nav-links" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <NavItem to="/forecast" icon={<CalendarDays size={20} />} label="Forecast" />
                <NavItem to="/historical" icon={<History size={20} />} label="Historical" />
                <NavItem to="/marine" icon={<Waves size={20} />} label="Marine" />
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--color-glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                    Powered by Weatherstack
                </div>
            </div>
        </div>
    );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
        flex items-center gap-md
        ${isActive ? 'active-nav-item' : 'inactive-nav-item'}
      `}
            style={({ isActive }) => ({
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-glass-border-hover)' : 'transparent',
                transition: 'all var(--transition-normal)',
                fontWeight: isActive ? 500 : 400
            })}
        >
            {({ isActive }) => (
                <>
                    <span style={{ color: isActive ? 'var(--color-text-accent)' : 'inherit' }}>
                        {icon}
                    </span>
                    {label}
                </>
            )}
        </NavLink>
    );
};

const CloudIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
);
