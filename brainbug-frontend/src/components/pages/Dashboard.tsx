import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../services/api'; // Your API function

// --- Import your real UI components ---
// import { StatCard } from '../ui/StatCard';
// import { AiAnalysisCard } from '../ui/AiAnalysisCard';
// import { BugsVsTimeChart } from '../ui/BugsVsTimeChart';
// import { RecentBugList } from '../ui/RecentBugList';
// import { LoadingSpinner } from '../ui/LoadingSpinner';

// --- Your Data Interface ---
interface DashboardData {
  stats: {
    totalBugs: number;
    mostCommonMistake: string;
    improvementScore: number;
  };
  aiAnalysis: {
    patternRecognition: string;
    predictiveInsights: string;
    remediationSuggestions: string;
    impactAssessment: string;
  };
  bugsOverTime: { date: string; count: number }[]; // Array for the chart
  recentBugs: { id: string; title: string; status: string }[]; // Array for the list
}

export function Dashboard() {
  // --- State Management ---
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dashboardData = await getDashboardData();
        setData(dashboardData);

      } catch (err: any) {
        // Handle the error
        setError(err.message || 'An unknown error occurred.');
        console.error(err);
      } finally {
        // Always stop loading
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array [] means this runs only once on mount

  // --- Render Logic: 1. Loading State ---
  if (loading) {
    return <LoadingSpinner />;
  }

  // --- Render Logic: 2. Error State ---
  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold">Error Fetching Data</h2>
        <p>{error}</p>
        <p className="mt-2 text-sm">Please check the console or contact Team 1 (Backend).</p>
      </div>
    );
  }

  // --- Render Logic: 3. No Data State ---
  if (!data) {
    return <div className="p-6 text-center text-gray-500">No data available.</div>;
  }

  // --- Render Logic: 4. Success State ---
  // (This is what you see when everything works)
  return (
    <div className="dashboard-container p-6 space-y-6 bg-gray-100 min-h-screen">
      
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Bugs" value={data.stats.totalBugs} />
        <StatCard title="Most Common Mistake" value={data.stats.mostCommonMistake} />
        <StatCard title="Improvement Score" value={data.stats.improvementScore + '%'} />
      </div>

      {/* 2. AI Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AiAnalysisCard title="Pattern Recognition" text={data.aiAnalysis.patternRecognition} />
        <AiAnalysisCard title="Predictive Insights" text={data.aiAnalysis.predictiveInsights} />
        <AiAnalysisCard title="Remediation Suggestions" text={data.aiAnalysis.remediationSuggestions} />
        <AiAnalysisCard title="Impact Assessment" text={data.aiAnalysis.impactAssessment} />
      </div>
      
      {/* 3. Bugs vs. Time Chart */}
      <BugsVsTimeChart chartData={data.bugsOverTime} />

      {/* 4. Recent Bug History */}
      <RecentBugList bugs={data.recentBugs} />
      
    </div>
  );
}

// -------------------------------------------------------------------
// --- ⚙️ PLACEHOLDER UI COMPONENTS ⚙️ ---
// (Delete these as you replace them with your real components)
// -------------------------------------------------------------------

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const StatCard = ({ title, value }: { title: string, value: string | number }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
    <p className="mt-1 text-3xl font-semibold">{value}</p>
  </div>
);

const AiAnalysisCard = ({ title, text }: { title: string, text: string }) => (
  <div className="p-6 bg-white rounded-lg shadow-md h-full">
    <h4 className="text-lg font-semibold">{title}</h4>
    <p className="text-sm text-gray-600 mt-2">{text}</p>
  </div>
);

const BugsVsTimeChart = ({ chartData }: { chartData: { date: string; count: number }[] }) => (
  <div className="p-6 bg-white rounded-lg shadow-md h-80">
    <h4 className="text-lg font-semibold mb-4">Bugs vs. Time</h4>
    <div className="text-xs text-gray-400">
      (Your Recharts component will go here)
      <pre className="mt-2 bg-gray-50 p-2 rounded">{JSON.stringify(chartData, null, 2)}</pre>
    </div>
  </div>
);

const RecentBugList = ({ bugs }: { bugs: { id: string; title: string; status: string }[] }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h4 className="text-lg font-semibold mb-4">Recent Bug History</h4>
    <ul className="space-y-3">
      {bugs.map(bug => (
        <li key={bug.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="font-medium">{bug.title}</span>
          <span className="text-sm text-gray-500">{bug.status}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Dashboard;