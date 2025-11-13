import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, CheckCircle2, Target, TrendingUp, BookOpen } from 'lucide-react';

const bugTypeData = [
  { name: 'Null Checks', value: 32, color: '#3b82f6' },
  { name: 'Logic Errors', value: 24, color: '#10b981' },
  { name: 'Type Errors', value: 18, color: '#f59e0b' },
  { name: 'Off-by-One', value: 15, color: '#ef4444' },
  { name: 'Memory Leaks', value: 11, color: '#8b5cf6' },
];

const bugsByProject = [
  { project: 'E-commerce', bugs: 45 },
  { project: 'Dashboard', bugs: 32 },
  { project: 'API Service', bugs: 28 },
  { project: 'Mobile App', bugs: 22 },
];

const bugsByLanguage = [
  { language: 'TypeScript', bugs: 68 },
  { language: 'JavaScript', bugs: 35 },
  { language: 'Python', bugs: 24 },
];

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

export function Analytics() {
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
        {/* Pie Chart - Bug Type Distribution */}
        <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/30">
          <CardHeader>
            <CardTitle>Bug Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bugTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bugTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          </CardContent>
        </Card>

        {/* Bar Chart - Bugs by Project */}
        <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/30">
          <CardHeader>
            <CardTitle>Bugs by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bugsByProject}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="project" 
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
                <Bar dataKey="bugs" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Bugs by Language */}
      <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/30">
        <CardHeader>
          <CardTitle>Bugs by Language</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bugsByLanguage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                type="category"
                dataKey="language" 
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
              <Bar dataKey="bugs" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap */}
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

      {/* AI-Powered Roadmap Section */}
      <Card className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/30 dark:bg-gradient-to-br dark:from-cyan-500/5 dark:to-purple-500/5 light:bg-gradient-to-br light:from-cyan-500/10 light:to-purple-500/10 light:bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white dark:text-white light:text-gray-900">AI-Powered Growth Roadmap</CardTitle>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mt-2">
            Your personalized path to becoming a better developer, based on your bug patterns and coding style
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Focus */}
          <div className="relative pl-8 pb-8 border-l-2 border-cyan-500">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#161b22] dark:border-[#161b22] light:border-white"></div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Current Focus
              </span>
            </div>
            <h3 className="text-lg mb-2 text-white dark:text-white light:text-gray-900">Master Null Safety Patterns</h3>
            <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mb-3">
              Since 32% of your bugs are null pointer exceptions, let's eliminate them with modern patterns.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Learn TypeScript's <code className="px-1.5 py-0.5 rounded bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-100 text-cyan-400">strictNullChecks</code> configuration
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Practice optional chaining <code className="px-1.5 py-0.5 rounded bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-100 text-cyan-400">?.</code> and nullish coalescing <code className="px-1.5 py-0.5 rounded bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-100 text-cyan-400">??</code>
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Target className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Implement custom type guards for complex objects
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Target className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Refactor 5 past bugs using new null-safety patterns
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-50 border border-gray-800 dark:border-gray-800 light:border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">Progress</span>
                <span className="text-xs text-cyan-400">65%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          {/* Next Step */}
          <div className="relative pl-8 pb-8 border-l-2 border-purple-500">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#161b22] dark:border-[#161b22] light:border-white"></div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Next: Week 2
              </span>
            </div>
            <h3 className="text-lg mb-2 text-white dark:text-white light:text-gray-900">Async/Await Error Handling</h3>
            <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mb-3">
              Your async code has a 24% error rate. Let's build robust error handling patterns.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Study try-catch patterns for async operations
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Implement Promise error boundaries in React
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Learn about Result types and Either monads
                </span>
              </div>
            </div>
          </div>

          {/* Future Goals */}
          <div className="relative pl-8 pb-8 border-l-2 border-pink-500">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-500 border-4 border-[#161b22] dark:border-[#161b22] light:border-white"></div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block px-2 py-1 rounded text-xs bg-pink-500/20 text-pink-400 border border-pink-500/30">
                Month 2
              </span>
            </div>
            <h3 className="text-lg mb-2 text-white dark:text-white light:text-gray-900">Advanced Type System Mastery</h3>
            <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mb-3">
              Leverage TypeScript's advanced features to catch bugs at compile time.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Master discriminated unions and branded types
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Implement compile-time validation patterns
                </span>
              </div>
            </div>
          </div>

          {/* Long-term Vision */}
          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-[#161b22] dark:border-[#161b22] light:border-white"></div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                Your Goal
              </span>
            </div>
            <h3 className="text-lg mb-2 text-white dark:text-white light:text-gray-900">Zero Runtime Errors</h3>
            <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
              With these skills, you'll catch 95% of bugs before they reach production. Your code will be robust, 
              maintainable, and a model for your team.
            </p>
          </div>

          {/* AI Recommendation */}
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm text-cyan-400 mb-1">AI Insight</h4>
                <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Based on your learning style, you respond well to hands-on refactoring exercises. 
                  I'll present real examples from your bug history each week for you to fix using new patterns you've learned.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}