# Real Estate Micro-Climate Scorer

## Project Overview
The Real Estate Micro-Climate Scorer is a responsive web application that evaluates any given location based on environmental factors, walkability, and natural disaster risks. It provides users with critical location insights that are typically absent from standard real estate listings, generating an aggregated "Overall Location Score."

## Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Data Visualization:** Chart.js, React-Chartjs-2
* **Authentication:** Firebase Auth
* **Deployment:** Vercel

## Application Flow
1. **Input:** User enters an address into the search component.
2. **Geocoding:** The input is converted into latitude and longitude coordinates via the OpenStreetMap Nominatim API.
3. **APIs:** The app concurrently fetches environmental data, nearby amenities, and disaster indicators.
4. **Processing:** The raw data is passed through a custom scoring algorithm to normalize the metrics on a 0-100 scale.
5. **Output:** The data is rendered on a clean, responsive UI dashboard featuring interactive radar charts and dynamic risk labels.

## Features Implemented
* Real-time geocoding and location search.
* Concurrent API fetching for performance optimization.
* **Bonus:** Loading states and error handling during data retrieval.
* **Bonus:** Interactive radar chart visualization for risk vs. lifestyle balance.
* **Bonus:** Firebase User Authentication configuration to support location bookmarking.
* Fully responsive, clean dashboard UI.

## Scoring Logic
The overall score is a weighted aggregation of four key metrics (each scaled 0-100):
* **Air Quality (30%):** Inverse mapping of the US AQI index (100 = pristine, 0 = hazardous).
* **Walkability (30%):** Calculated based on the density of nearby amenities (restaurants, transit, shops) within a 1km radius (35+ amenities = 100).
* **Earthquake Safety (20%):** Penalizes the score based on the frequency and maximum magnitude of seismic events within a 250km radius over the past 30 days.
* **Flood Safety (20%):** Inverse mapping of river discharge/hydrology indices.

## API Details
* **Geocoding:** [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)
* **Air Quality:** [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (AQI & PM2.5)
* **Walkability:** [Overpass API (OSM)](https://overpass-api.de/) (Radius node querying)
* **Disaster Data:** 
  * [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/)
  * [Open-Meteo Flood API](https://open-meteo.com/en/docs/flood-api)

## Setup Instructions
1. Clone this repository: `git clone <your-repo-link>`
2. Navigate to the project directory: `cd micro-climate-scorer`
3. Install dependencies: `npm install`
4. Create a `.env.local` file in the root directory and add your Firebase configuration keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id