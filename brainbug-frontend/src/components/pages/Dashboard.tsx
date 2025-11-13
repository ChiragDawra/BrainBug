import { Bug, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles } from 'lucide-react';

const bugTrendData = [
  { date: 'Nov 1', bugs: 12 },
  { date: 'Nov 5', bugs: 8 },
  { date: 'Nov 9', bugs: 15 },
  { date: 'Nov 13', bugs: 7 },
  { date: 'Nov 17', bugs: 10 },
  { date: 'Nov 21', bugs: 5 },
  { date: 'Nov 25', bugs: 6 },
  { date: 'Nov 29', bugs: 4 },
  { date: 'Dec 3', bugs: 3 },
  { date: 'Dec 7', bugs: 2 },
];

const recentBugs = [
  {
    id: 1,
    type: 'Null Pointer Exception',
    file: 'src/components/UserProfile.tsx',
    line: 42,
    date: '2 hours ago',
  },
  {
    id: 2,
    type: 'Off-by-One Error',
    file: 'src/utils/arrayHelpers.ts',
    line: 128,
    date: '5 hours ago',
  },
  {
    id: 3,
    type: 'Type Mismatch',
    file: 'src/api/endpoints.ts',
    line: 67,
    date: '1 day ago',
  },
  {
    id: 4,
    type: 'Undefined Variable',
    file: 'src/hooks/useAuth.ts',
    line: 89,
    date: '1 day ago',
  },
  {
    id: 5,
    type: 'Logic Error',
    file: 'src/pages/Dashboard.tsx',
    line: 156,
    date: '2 days ago',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Welcome back</span>
          <span className="text-white dark:text-white light:text-gray-900">, Developer!</span>
        </h2>
        <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Here's your coding progress overview</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-blue-500/10 light:bg-gradient-to-br light:from-cyan-500/20 light:to-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Total Bugs Coached</CardTitle>
            <Bug className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">127</div>
            <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 mt-1">Since you started</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 dark:bg-gradient-to-br dark:from-yellow-500/10 dark:to-orange-500/10 light:bg-gradient-to-br light:from-yellow-500/20 light:to-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Most Common Mistake</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl text-white dark:text-white light:text-gray-900">Null Pointer</div>
            <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 mt-1">32% of all bugs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 dark:bg-gradient-to-br dark:from-green-500/10 dark:to-emerald-500/10 light:bg-gradient-to-br light:from-green-500/20 light:to-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Improvement Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">78%</div>
            <p className="text-xs text-green-400 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-pink-500/10 light:bg-gradient-to-br light:from-purple-500/20 light:to-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">AI Analysis</CardTitle>
            <Sparkles className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-white dark:text-white light:text-gray-900">Bug History Analysis</div>
            <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 mt-1">View detailed insights</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Bug History Analysis Card */}
      <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/30 dark:bg-gradient-to-br dark:from-purple-500/5 dark:to-pink-500/5 light:bg-gradient-to-br light:from-purple-500/10 light:to-pink-500/10 light:bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white dark:text-white light:text-gray-900">AI Bug History Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-50 border border-gray-800 dark:border-gray-800 light:border-gray-200">
            <h4 className="text-sm mb-2 text-purple-400">🎯 Pattern Recognition</h4>
            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
              Your most frequent error pattern is <span className="text-yellow-400">Null Pointer Exceptions</span>, 
              occurring primarily in component lifecycle methods. This suggests a tendency to access properties 
              before validating object existence.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-50 border border-gray-800 dark:border-gray-800 light:border-gray-200">
            <h4 className="text-sm mb-2 text-cyan-400">💡 Root Cause Analysis</h4>
            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
              Analysis of your last 50 bugs reveals that <span className="text-cyan-400">68% of null pointer errors</span> occur 
              when handling async data. You're often accessing response data before checking if the fetch completed successfully.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-50 border border-gray-800 dark:border-gray-800 light:border-gray-200">
            <h4 className="text-sm mb-2 text-green-400">✨ Improvement Insights</h4>
            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
              Great progress! Your bug frequency has decreased by <span className="text-green-400">45% over the last month</span>. 
              You've successfully adopted optional chaining and null checks in 82% of your recent code.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-50 border border-gray-800 dark:border-gray-800 light:border-gray-200">
            <h4 className="text-sm mb-2 text-pink-400">🎓 Personalized Recommendation</h4>
            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
              Based on your coding style, I recommend focusing on TypeScript strict null checks and implementing 
              custom type guards. This aligns with your preference for type-safe code and will eliminate 
              most remaining null pointer issues.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="bg-[#161b22] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Bugs vs. Time (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bugTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
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
              <Line 
                type="monotone" 
                dataKey="bugs" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Bug History */}
      <Card className="bg-[#161b22] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Bug History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBugs.map((bug) => (
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
        </CardContent>
      </Card>
    </div>
  );
}