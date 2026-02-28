import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import Dashboard from './pages/Dashboard.tsx';
import Forecast from './pages/Forecast.tsx';
import Historical from './pages/Historical.tsx';
import Marine from './pages/Marine.tsx';
import Welcome from './pages/Welcome.tsx';
import './index.css';

export interface AppState {
  currentLocation: string;
}

const App: React.FC = () => {
  // Global state across pages
  const [currentLocation, setCurrentLocation] = useState<string>('');

  const handleSearch = (query: string) => {
    setCurrentLocation(query);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <header className="glass-panel" style={{
            padding: 'var(--space-md) var(--space-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-lg)',
            zIndex: 10
          }}>
            <h2 className="text-lg font-medium">Weather Center</h2>
            <SearchBar onSearch={handleSearch} />
          </header>

          <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!currentLocation ? (
              <Welcome onLocationSelect={handleSearch} />
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard locationQuery={currentLocation} />} />
                <Route path="/forecast" element={<Forecast locationQuery={currentLocation} />} />
                <Route path="/historical" element={<Historical locationQuery={currentLocation} />} />
                <Route path="/marine" element={<Marine locationQuery={currentLocation} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
