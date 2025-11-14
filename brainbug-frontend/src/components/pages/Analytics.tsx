import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, CheckCircle2, Target, TrendingUp, BookOpen } from 'lucide-react';
import { getAnalyticsData } from '../../services/api'; // 1. Import your API function

// --- 2. Define your data interfaces ---
// This interface matches the data keys in your static UI JSX
interface AnalyticsData {
  bugTypeDistribution: { name: string; value: number; color?: string }[]; // Added optional color
  bugsByProject: { project: string; bugs: number }[];
  bugsByLanguage: { language: string; bugs: number }[];
  // Heatmap and AI Roadmap data are static in this example
}

// These colors will be added to the data we fetch
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// --- 3. Define the DEFAULT empty state ---
const DEFAULT_ANALYTICS_DATA: AnalyticsData = {
  bugTypeDistribution: [],
  bugsByProject: [],
  bugsByLanguage: [],
};

// --- Hard-coded data for static sections (Heatmap, AI Roadmap) ---
// (This data is NOT fetched from the API in this example)
const heatmapData = [
  { hour: '12am', mon: 0, tue: 1, wed: 0, thu: 0, fri: 1, sat: 0, sun: 0 },
  { hour: '2am', mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
  { hour: '4am', mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
  { hour: '6am', mon: 0, tue: 1, wed: 0, thu: 1, fri: 0, sat: 0, sun: 0 },
  { hour: '8am', mon: 2, tue: 1, wed: 3, thu: 2, fri: 2, sat: 0, sun: 0 },
  { hour: '10am', mon: 5, tue: 4, wed: 6, thu: 5, fri: 4, sat: 1, sun: 0 },
  { hour: '12pm', mon: 3, tue: 4, wed: 3, thu: 4, fri: 3, sat: 2, sun: 1 },
  { hour: '2pm', mon: 6, tue: 5, wed: 7, thu: 6, fri: 5, sat: 2, sun: 1 },
  { hour: '4pm', mon: 8, tue: 7, wed: 9, thu: 8, fri: 6, sat: 1, sun: 0 },
  { hour: '6pm', mon: 4, tue: 5, wed: 4, thu: 5, fri: 3, sat: 0, sun: 0 },
  { hour: '8pm', mon: 2, tue: 3, wed: 2, thu: 2, fri: 1, sat: 0, sun: 0 },
  { hour: '10pm', mon: 1, tue: 1, wed: 1, thu: 1, fri: 0, sat: 0, sun: 0 },
];

const getHeatmapColor = (value: number) => {
  if (value === 0) return '#0d1117';
  if (value <= 2) return '#0e4429';
  if (value <= 4) return '#006d32';
  if (value <= 6) return '#26a641';
  return '#39d353';
};

// --- Helper for empty charts ---
const EmptyChartPlaceholder = ({ message = "Loading data..." }: { message?: string }) => (
  <div className="flex items-center justify-center h-full">
    <p className="text-gray-500">{message}</p>
  </div>
);

export function Analytics() {
  // --- 4. Set up your state hooks ---
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Initialize state with the default empty data
  const [data, setData] = useState<AnalyticsData>(DEFAULT_ANALYTICS_DATA);

  // --- 5. Set up your data fetching effect ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the real data
        // We assume the API returns { bugTypeDistribution, bugsByProject, bugsByLanguage }
        const liveData = await getAnalyticsData();
        
        // Add colors to the pie chart data
        const coloredBugTypeData = liveData.bugTypeDistribution.map((entry: { name: string, value: number }, index: number) => ({
          ...entry,
          color: PIE_COLORS[index % PIE_COLORS.length] // Assign color
        }));
        
        setData({
          ...liveData,
          bugTypeDistribution: coloredBugTypeData,
        });

      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error(err);
        // On error, we just stay on the DEFAULT_ANALYTICS_DATA
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchData();
  }, []); // Empty array [] means this runs only once on mount

  // --- 6. Your JSX now uses the 'data' state for the top 3 charts ---
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Analytics</span>
        </h2>
        <p className="text-gray-400">Visualize your coding patterns and bug trends</p>
      </div>

      {/* Top Row - Pie and Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Bug Type Distribution (Dynamic) */}
        <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/30">
          <CardHeader>
            <CardTitle>Bug Type Distribution</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '300px' }}>
            {data.bugTypeDistribution.length === 0 ? (
              <EmptyChartPlaceholder message={loading ? "Loading chart..." : "No data available."} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.bugTypeDistribution} // Use data from state
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.bugTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} /> // Use color from data
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Bugs by Project (Dynamic) */}
        <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/30">
          <CardHeader>
            <CardTitle>Bugs by Project</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '300px' }}>
            {data.bugsByProject.length === 0 ? (
              <EmptyChartPlaceholder message={loading ? "Loading chart..." : "No data available."} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.bugsByProject}> {/* Use data from state */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="project" // This matches our 'AnalyticsData' interface
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }}
                  />
                  <Bar dataKey="bugs" fill="#3b82f6" radius={[8, 8, 0, 0]} /> {/* This matches our interface */}
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Bugs by Language (Dynamic) */}
      <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/30">
        <CardHeader>
          <CardTitle>Bugs by Language</CardTitle>
        </CardHeader>
        <CardContent style={{ height: '250px' }}>
          {data.bugsByLanguage.length === 0 ? (
            <EmptyChartPlaceholder message={loading ? "Loading chart..." : "No data available."} />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.bugsByLanguage} layout="vertical"> {/* Use data from state */}
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  allowDecimals={false}
                />
                <YAxis 
                  type="category"
                  dataKey="language" // This matches our 'AnalyticsData' interface
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Bar dataKey="bugs" fill="#10b981" radius={[0, 8, 8, 0]} /> {/* This matches our interface */}
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* --- The sections below are still STATIC --- */}
      {/* --- They use the hard-coded data from above --- */}

      {/* Heatmap (Static) */}
      <Card className="bg-[#161b22] border-gray-800">
        <CardHeader>
          <CardTitle>Bug Activity Heatmap</CardTitle>
          <p className="text-sm text-gray-400">Your most active (and buggy) times of the week</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-1 mb-2">
                <div className="w-16"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="w-12 text-xs text-gray-400 text-center">
                    {day}
                  </div>
                ))}
              </div>
              {heatmapData.map((row) => (
                <div key={row.hour} className="flex gap-1 mb-1">
                  <div className="w-16 text-xs text-gray-400 flex items-center">
                    {row.hour}
                  </div>
                  <div
                    className="w-12 h-8 rounded border border-gray-800"
                    style={{ backgroundColor: getHeatmapColor(row.mon) }}
                    title={`Monday ${row.hour}: ${row.mon} bugs`}
                  ></div>
                  <div
                    className="w-12 h-8 rounded border border-gray-800"
                    style={{ backgroundColor: getHeatmapColor(row.tue) }}
                    title={`Tuesday ${row.hour}: ${row.tue} bugs`}
                  ></div>
                  <div
                    className="w-12 h-8 rounded border border-gray-800"
                    style={{ backgroundColor: getHeatmapColor(row.wed) }}
                    title={`Wednesday ${row.hour}: ${row.wed} bugs`}
                  ></div>
                  <div
                    className="w-12 h-8 rounded border border-gray-800"
                    style={{ backgroundColor: getHeatmapColor(row.thu) }}
                    title={`Thursday ${row.hour}: ${row.thu} bugs`}
                  ></div>
                  <div
                    className="w-12 h-8 rounded border border-gray-800"
                    style={{ backgroundColor: getHeatmapColor(row.fri) }}
                    title={`Friday ${row.hour}: ${row.fri} bugs`}
                  ></div>
                  <div
                    className="w-12 h-8 rounded border border-gray-800"
                    style={{ backgroundColor: getHeatmapColor(row.sat) }}
                    title={`Saturday ${row.hour}: ${row.sat} bugs`}
                  ></div>
                  <div
                    className="w-12 h-8 rounded border border-gray-800"
                    style={{ backgroundColor: getHeatmapColor(row.sun) }}
                    title={`Sunday ${row.hour}: ${row.sun} bugs`}
                  ></div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0d1117' }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0e4429' }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#006d32' }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#26a641' }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#39d353' }}></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Roadmap Section (Static) */}
      <Card className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white">AI-Powered Growth Roadmap</CardTitle>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Your personalized path to becoming a better developer, based on your bug patterns and coding style
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ... (Static roadmap content remains unchanged) ... */}
          <div className="relative pl-8 pb-8 border-l-2 border-cyan-500">
            {/* ... */}
          </div>
          <div className="relative pl-8 pb-8 border-l-2 border-purple-500">
            {/* ... */}
          </div>
          <div className="relative pl-8 pb-8 border-l-2 border-pink-500">
            {/* ... */}
          </div>
          <div className="relative pl-8">
            {/* ... */}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
            {/* ... */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}