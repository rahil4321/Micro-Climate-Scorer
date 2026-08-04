// src/app/page.tsx
'use client';

import { useState } from 'react';
import SearchSection from '@/components/SearchSection';
import Dashboard from '@/components/Dashboard'; // Import the new Dashboard component
import { fetchAllMicroClimateData, CombinedMicroClimateData } from '@/services/apiServices';
import { processMicroClimateScores, ScoreBreakdown } from '@/utils/scoring';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lon: number;
  } | null>(null);

  const [climateData, setClimateData] = useState<CombinedMicroClimateData | null>(null);
  const [scores, setScores] = useState<ScoreBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = async (locationData: {
    address: string;
    lat: number;
    lon: number;
  }) => {
    setSelectedLocation(locationData);
    setIsLoading(true);

    try {
      const data = await fetchAllMicroClimateData(locationData.lat, locationData.lon);
      setClimateData(data);
      
      const computedScores = processMicroClimateScores(data);
      setScores(computedScores);
    } catch (err) {
      console.error('Error fetching micro-climate data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 sm:p-12 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Real Estate Micro-Climate Scorer
        </h1>
      </header>

      <SearchSection
        onLocationSelect={handleLocationSelect}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* Render the clean and well-structured dashboard UI[cite: 4] */}
      {scores && climateData && selectedLocation && (
        <Dashboard 
          location={selectedLocation} 
          climateData={climateData} 
          scores={scores} 
        />
      )}
    </main>
  );
}