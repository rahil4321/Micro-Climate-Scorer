// src/components/SearchSection.tsx
'use client';

import { useState } from 'react';

interface SearchSectionProps {
  onLocationSelect: (locationData: {
    address: string;
    lat: number;
    lon: number;
  }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function SearchSection({
  onLocationSelect,
  isLoading,
  setIsLoading,
}: SearchSectionProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch geocoding coordinates using OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location details.');
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error('Location not found. Please try a different address.');
      }

      const location = data[0];
      onLocationSelect({
        address: location.display_name,
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon),
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during geocoding.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 text-center">
        Analyze Micro-Climate Risks
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 text-center mb-6 text-sm">
        Enter an address to evaluate air quality, walkability, and natural disaster indicators.
      </p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Enter address (e.g., Manhattan, NY or MG Road, Bengaluru)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-medium rounded-xl shadow-md transition duration-200 flex items-center justify-center min-w-[120px]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Analyze'
          )}
        </button>
      </form>

      {/* Error Feedback Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-lg text-center animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}