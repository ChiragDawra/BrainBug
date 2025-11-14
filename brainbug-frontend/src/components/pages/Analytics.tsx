// src/components/pages/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { getAnalyticsData } from '../../services/api';

// --- Import your chart components ---
// import { PieChart } from '../ui/PieChart';
// import { BarChart } from '../ui/BarChart';
// import { HorizontalBarChart } from '../ui/HorizontalBarChart';
// import { LoadingSpinner } from '../ui/LoadingSpinner';

// Define data types
interface AnalyticsData {
  bugTypeDistribution: { name: string; value: number }[];
  bugsByProject: { name: string; value: number }[];
  bugsByLanguage: { name: string; value: number }[];
}

export function Analytics() {
  // --- State Management ---
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const analyticsData = await getAnalyticsData();
        setData(analyticsData);
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Runs once on mount

  if (loading) {
    // return <LoadingSpinner />;
    return <div className="p-6">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-6">No data available.</div>;
  }

  // --- Render the UI with your data ---
  return (
    <div className="analytics-container p-6 grid grid-cols-2 gap-6">
      <div className="chart-container col-span-1">
        <h2 className="text-xl font-semibold mb-2">Bug Type Distribution</h2>
        {/* <PieChart chartData={data.bugTypeDistribution} /> */}
      </div>

      <div className="chart-container col-span-1">
        <h2 className="text-xl font-semibold mb-2">Bugs by Project</h2>
        {/* <BarChart chartData={data.bugsByProject} /> */}
      </div>

      <div className="chart-container col-span-2">
        <h2 className="text-xl font-semibold mb-2">Bugs by Language</h2>
        {/* <HorizontalBarChart chartData={data.bugsByLanguage} /> */}
      </div>
    </div>
  );
}