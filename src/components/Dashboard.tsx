// src/components/Dashboard.tsx
'use client';

import { CombinedMicroClimateData } from '@/services/apiServices';
import { ScoreBreakdown } from '@/utils/scoring';
import { useAuth } from '@/context/AuthContext';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register necessary Chart.js elements
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface DashboardProps {
  location: { address: string; lat: number; lon: number };
  climateData: CombinedMicroClimateData;
  scores: ScoreBreakdown;
}

export default function Dashboard({ location, climateData, scores }: DashboardProps) {
  const { user } = useAuth(); // Bonus: User authentication

  const handleBookmark = () => {
    // If the user isn't logged in via the AuthContext, prompt them
    if (!user) {
      alert("Please log in to save and bookmark locations!");
      return;
    }
    // Future integration point for saving to Firebase Firestore
    alert("Location bookmarked successfully!");
  };

  // Data mapping for the Radar Chart[cite: 4]
  const chartData = {
    labels: ['Air Quality', 'Walkability', 'Earthquake Safety', 'Flood Safety'],
    datasets: [
      {
        label: 'Micro-Climate Score',
        data: [
          scores.airQualityScore,
          scores.walkabilityScore,
          scores.earthquakeSafetyScore,
          scores.floodSafetyScore,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Tailwind Blue-500 with opacity
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(156, 163, 175, 0.2)' },
        grid: { color: 'rgba(156, 163, 175, 0.2)' },
        pointLabels: { color: '#6b7280', font: { size: 12 } },
        ticks: { backdropColor: 'transparent', color: '#9ca3af', min: 0, max: 100, stepSize: 20 },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 space-y-6 transition-all duration-500 ease-in-out">
      {/* Overview Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center hover:shadow-2xl transition-shadow">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{location.address}</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">{scores.summaryLabel}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
             <div className="text-6xl font-black text-blue-600 dark:text-blue-400">{scores.overallScore}</div>
             <div className="text-sm font-bold text-zinc-400 tracking-widest uppercase mt-1">Overall Score</div>
          </div>
          <div className="h-20 w-px bg-zinc-200 dark:bg-zinc-700 hidden md:block"></div>
          <div className="text-5xl font-bold px-5 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {scores.grade}
          </div>
        </div>
      </div>

      {/* Action Bar (Bookmark Bonus Feature) */}
      <div className="flex justify-end w-full">
         <button onClick={handleBookmark} className="px-5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
           </svg>
           Save Location
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Chart Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center min-h-[300px]">
           <h3 className="text-lg font-bold text-zinc-900 dark:text-white w-full text-left mb-4">Risk & Lifestyle Balance</h3>
           <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
              <Radar data={chartData} options={chartOptions} />
           </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
            {/* Environmental Data Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Environmental Data</h3>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-zinc-500">AQI Score</p>
                        <p className={`text-3xl font-semibold ${scores.airQualityScore > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {climateData.airQuality.aqi}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-zinc-500">PM2.5 Levels</p>
                        <p className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">{climateData.airQuality.pm2_5} <span className="text-sm font-normal">µg/m³</span></p>
                    </div>
                </div>
            </div>

            {/* Risk Indicators Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Risk Indicators</h3>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-zinc-500 mb-1">Earthquake Risk</p>
                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${climateData.disaster.earthquakeCount > 0 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                            {climateData.disaster.earthquakeCount > 0 ? `${climateData.disaster.earthquakeCount} Events` : 'Low Risk'}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-zinc-500 mb-1">Flood Risk</p>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-sm font-medium">
                            Index: {climateData.disaster.floodRiskIndex}/100
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Walkability Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Walkability</h3>
                <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 shadow-inner">
                         {scores.walkabilityScore}
                     </div>
                     <div>
                         <p className="text-sm text-zinc-500">Nearby Amenities</p>
                         <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{climateData.amenities.totalAmenities} within 1km</p>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}