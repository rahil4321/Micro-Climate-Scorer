// src/utils/scoring.ts

import { CombinedMicroClimateData } from '@/services/apiServices';

export interface ScoreBreakdown {
  airQualityScore: number;    // 0-100 (100 = Pristine Air)
  walkabilityScore: number;   // 0-100 (100 = Highly Walkable)
  earthquakeSafetyScore: number; // 0-100 (100 = Minimal Seismic Risk)
  floodSafetyScore: number;   // 0-100 (100 = Minimal Flood Risk)
  overallScore: number;       // 0-100 Aggregate
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  summaryLabel: string;
}

/**
 * 1. Calculate Normalized Air Quality Score (0 - 100)
 * US AQI: 0-50 Good, 51-100 Moderate, 101-150 Unhealthy for Sensitive, 151+ Unhealthy
 */
export function calculateAirQualityScore(aqi: number): number {
  if (aqi <= 50) return Math.round(100 - (aqi / 50) * 15); // 85 - 100
  if (aqi <= 100) return Math.round(85 - ((aqi - 50) / 50) * 25); // 60 - 85
  if (aqi <= 150) return Math.round(60 - ((aqi - 100) / 50) * 25); // 35 - 60
  if (aqi <= 200) return Math.round(35 - ((aqi - 150) / 50) * 20); // 15 - 35
  return Math.max(0, Math.round(15 - ((aqi - 200) / 100) * 15)); // 0 - 15
}

/**
 * 2. Calculate Walkability Score (0 - 100)
 * Based on amenity density within 1km radius
 */
export function calculateWalkabilityScore(totalAmenities: number): number {
  // Benchmark: 35+ nearby amenities within 1km is considered elite walkability
  const maxBenchmark = 35;
  const score = (totalAmenities / maxBenchmark) * 100;
  return Math.min(100, Math.round(score));
}

/**
 * 3. Calculate Earthquake Safety Score (0 - 100)
 * Evaluates seismic frequency and max magnitude within 250km
 */
export function calculateEarthquakeSafetyScore(count: number, maxMag: number): number {
  if (count === 0 || maxMag < 3.0) return 100;
  
  // Deduct points for magnitude and event count
  const magPenalty = Math.pow(maxMag, 2) * 2.5; 
  const countPenalty = Math.min(count * 2, 20);
  
  const rawScore = 100 - (magPenalty + countPenalty);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * 4. Calculate Flood Safety Score (0 - 100)
 * Evaluates hydrological discharge and surface water indicators
 */
export function calculateFloodSafetyScore(floodRiskIndex: number): number {
  // floodRiskIndex ranges roughly 0 to 100
  const safetyScore = 100 - floodRiskIndex;
  return Math.max(0, Math.min(100, Math.round(safetyScore)));
}

/**
 * 5. Aggregate Master Scoring Engine
 * Weights: Air Quality (30%), Walkability (30%), Earthquake Safety (20%), Flood Safety (20%)
 */
export function processMicroClimateScores(data: CombinedMicroClimateData): ScoreBreakdown {
  const airQualityScore = calculateAirQualityScore(data.airQuality.aqi);
  const walkabilityScore = calculateWalkabilityScore(data.amenities.totalAmenities);
  const earthquakeSafetyScore = calculateEarthquakeSafetyScore(
    data.disaster.earthquakeCount,
    data.disaster.maxMagnitude
  );
  const floodSafetyScore = calculateFloodSafetyScore(data.disaster.floodRiskIndex);

  // Weighted sum calculation
  const overallScore = Math.round(
    airQualityScore * 0.30 +
    walkabilityScore * 0.30 +
    earthquakeSafetyScore * 0.20 +
    floodSafetyScore * 0.20
  );

  // Determine Letter Grade
  let grade: ScoreBreakdown['grade'] = 'C';
  let summaryLabel = 'Average Micro-Climate';

  if (overallScore >= 90) {
    grade = 'A+';
    summaryLabel = 'Exceptional Location';
  } else if (overallScore >= 80) {
    grade = 'A';
    summaryLabel = 'Highly Desirable';
  } else if (overallScore >= 70) {
    grade = 'B';
    summaryLabel = 'Good Balance';
  } else if (overallScore >= 55) {
    grade = 'C';
    summaryLabel = 'Moderate Environmental Risks';
  } else if (overallScore >= 40) {
    grade = 'D';
    summaryLabel = 'Elevated Risk Factors';
  } else {
    grade = 'F';
    summaryLabel = 'High Environmental Hazard';
  }

  return {
    airQualityScore,
    walkabilityScore,
    earthquakeSafetyScore,
    floodSafetyScore,
    overallScore,
    grade,
    summaryLabel,
  };
}