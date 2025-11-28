import React, { useState, useEffect } from 'react';
import { Bug, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardData, DashboardData as ApiDashboardData } from '../../services/api'; // 1. Import your API function

// --- 2. Define your data interface ---
interface DashboardData {
  stats: {
    totalBugs: number;
    mostCommonMistake: string;
    improvementScore: number;
    improvementTrend: string; // e.g., "+12% from last month"
  };
  aiAnalysis: {
    patternRecognition: string;
    rootCauseAnalysis: string;
    improvementInsights: string;
    personalizedRecommendation: string;
  };
  bugsOverTime: { date: string; bugs: number }[]; // Renamed 'count' to 'bugs' to match your chart
  recentBugs: {
    id: string; // Use string for IDs from a database
    type: string;
    file: string;
    line: number;
    date: string;
  }[];
}

// --- 3. Define the DEFAULT empty state ---
// This is what the user sees while loading or if there's an error.
const DEFAULT_DASHBOARD_DATA: DashboardData = {
  stats: {
    totalBugs: 0,
    mostCommonMistake: "N/A",
    improvementScore: 0,
    improvementTrend: "Loading...",
  },
  aiAnalysis: {
    patternRecognition: "Analyzing your error patterns...",
    rootCauseAnalysis: "Looking for root causes in your recent code...",
    improvementInsights: "Generating improvement insights based on your progress...",
    personalizedRecommendation: "Creating personalized recommendations for your coding style...",
  },
  bugsOverTime: [], // An empty array will show an empty chart
  recentBugs: [],   // An empty array will show the "No bugs" message
};


export function Dashboard() {
  // --- 4. Set up your state hooks ---
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Initialize state with the default empty data
  const [data, setData] = useState<DashboardData>(DEFAULT_DASHBOARD_DATA);

  // --- 5. Set up your data fetching effect ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Keep track of loading
        setError(null);
        
        // Fetch the real data
        const liveData = await getDashboardData();
        
        // The API's 'bugsOverTime' might have 'count'. We need 'bugs' for the chart.
        const formattedLiveData : any = {
          ...liveData,
          bugsOverTime: liveData.bugsOverTime.map(item => ({
            date: item.date,
            bugs: item.count || 0 // Map 'count' to 'bugs'
          }))
        };
        
        setData(formattedLiveData); // Set the live data

      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error(err);
        // On error, we just stay on the DEFAULT_DASHBOARD_DATA
        // No ugly error message, but we log it.
        // We could optionally set a small error message here.
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchData();
  }, []); // Empty array [] means this runs only once on mount

  // --- 6. Your JSX now uses the 'data' state ---
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Welcome back</span>
          <span className="text-white">, Developer!</span>
        </h2>
        <p className="text-gray-400">Here's your coding progress overview</p>
      </div>

      {/* Stats Widgets - Now using data from state */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400">Total Bugs Coached</CardTitle>
            <Bug className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {data.stats.totalBugs}
            </div>
            <p className="text-xs text-gray-500 mt-1">Since you started</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400">Most Common Mistake</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl text-white">{data.stats.mostCommonMistake}</div>
            <p className="text-xs text-gray-500 mt-1">32% of all bugs</p> {/* This can also be dynamic */}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400">Improvement Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {data.stats.improvementScore}%
            </div>
            <p className="text-xs text-green-400 mt-1">{data.stats.improvementTrend}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400">AI Analysis</CardTitle>
            <Sparkles className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-white">Bug History Analysis</div>
            <p className="text-xs text-gray-500 mt-1">View detailed insights</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Bug History Analysis Card - Now using data from state */}
      <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">AI Bug History Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800">
            <h4 className="text-sm mb-2 text-purple-400">識 Pattern Recognition</h4>
            <p className="text-sm text-gray-300">
              {data.aiAnalysis.patternRecognition}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800">
            <h4 className="text-sm mb-2 text-cyan-400">庁 Root Cause Analysis</h4>
            <p className="text-sm text-gray-300">
              {data.aiAnalysis.rootCauseAnalysis}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800">
            <h4 className="text-sm mb-2 text-green-400">笨ｨ Improvement Insights</h4>
            <p className="text-sm text-gray-300">
              {data.aiAnalysis.improvementInsights}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800">
            <h4 className="text-sm mb-2 text-pink-400">雌 Personalized Recommendation</h4>
            <p className="text-sm text-gray-300">
              {data.aiAnalysis.personalizedRecommendation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Line Chart - Now using data from state */}
      <Card className="bg-[#161b22] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Bugs vs. Time (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {/* The chart will be empty if data.bugsOverTime is [] */}
            <LineChart data={data.bugsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                allowDecimals={false} // Ensure whole numbers for bug counts
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bugs" // This must match the key in your data
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Bug History - Now using data from state */}
      <Card className="bg-[#161b22] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Bug History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 7. Handle the empty/loading state for the list */}
          {data.recentBugs.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              {loading ? "Loading recent bugs..." : "No recent bugs found."}
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentBugs.map((bug) => (
                <div
                  key={bug.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0d1117] border border-gray-800 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-100">{bug.type}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {bug.file}:<span className="text-cyan-400">{bug.line}</span>
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{bug.date}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}