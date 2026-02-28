import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search for a city, region, or location..." }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form className="glass-input-group" onSubmit={handleSubmit} style={{ maxWidth: '600px', width: '100%' }}>
            <Search size={20} className="glass-input-icon" />
            <input
                type="text"
                className="glass-input"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="glass-button"
                style={{ position: 'absolute', right: 'var(--space-sm)', padding: 'var(--space-xs) var(--space-md)' }}
            >
                Search
            </button>
        </form>
    );
};
