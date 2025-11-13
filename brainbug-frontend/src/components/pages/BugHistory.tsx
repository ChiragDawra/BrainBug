import { useState } from 'react';
import { AlertTriangle, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

const allBugs = [
  {
    id: 1,
    type: 'Null Pointer Exception',
    file: 'src/components/UserProfile.tsx',
    line: 42,
    date: '2024-12-11',
    snippet: 'const user = users.find(u => u.id === userId);\nreturn user.name; // user might be undefined',
    language: 'TypeScript',
  },
  {
    id: 2,
    type: 'Off-by-One Error',
    file: 'src/utils/arrayHelpers.ts',
    line: 128,
    date: '2024-12-11',
    snippet: 'for (let i = 0; i <= arr.length; i++) {\n  // Should be i < arr.length\n  process(arr[i]);\n}',
    language: 'TypeScript',
  },
  {
    id: 3,
    type: 'Type Mismatch',
    file: 'src/api/endpoints.ts',
    line: 67,
    date: '2024-12-10',
    snippet: 'const count: number = "123"; // Type string not assignable to number',
    language: 'TypeScript',
  },
  {
    id: 4,
    type: 'Undefined Variable',
    file: 'src/hooks/useAuth.ts',
    line: 89,
    date: '2024-12-10',
    snippet: 'console.log(userName); // userName is not defined',
    language: 'TypeScript',
  },
  {
    id: 5,
    type: 'Logic Error',
    file: 'src/pages/Dashboard.tsx',
    line: 156,
    date: '2024-12-09',
    snippet: 'if (status = "active") { // Should be === not =\n  activate();\n}',
    language: 'TypeScript',
  },
  {
    id: 6,
    type: 'Null Pointer Exception',
    file: 'src/services/dataService.ts',
    line: 234,
    date: '2024-12-09',
    snippet: 'const result = response.data.items[0].value;',
    language: 'TypeScript',
  },
  {
    id: 7,
    type: 'Race Condition',
    file: 'src/components/AsyncLoader.tsx',
    line: 78,
    date: '2024-12-08',
    snippet: 'setData(await fetchData());\nsetLoading(false); // May execute before data is set',
    language: 'TypeScript',
  },
  {
    id: 8,
    type: 'Memory Leak',
    file: 'src/hooks/useWebSocket.ts',
    line: 45,
    date: '2024-12-07',
    snippet: 'useEffect(() => {\n  const ws = new WebSocket(url);\n  // Missing cleanup/return\n}, []);',
    language: 'TypeScript',
  },
];

export function BugHistory() {
  const [filterDate, setFilterDate] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredBugs = allBugs.filter((bug) => {
    const dateMatch = filterDate === 'all' || bug.date.startsWith(filterDate);
    const typeMatch = filterType === 'all' || bug.type === filterType;
    return dateMatch && typeMatch;
  });

  const bugTypes = Array.from(new Set(allBugs.map((bug) => bug.type)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Bug History</span>
        </h2>
        <p className="text-gray-400">Deep dive into all your coding mistakes</p>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-[180px] bg-[#0d1117] border-gray-700">
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-gray-700">
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2024-12-11">Dec 11, 2024</SelectItem>
                  <SelectItem value="2024-12-10">Dec 10, 2024</SelectItem>
                  <SelectItem value="2024-12-09">Dec 09, 2024</SelectItem>
                  <SelectItem value="2024-12-08">Dec 08, 2024</SelectItem>
                  <SelectItem value="2024-12-07">Dec 07, 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-400" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px] bg-[#0d1117] border-gray-700">
                  <SelectValue placeholder="Filter by Bug Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-gray-700">
                  <SelectItem value="all">All Bug Types</SelectItem>
                  {bugTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(filterDate !== 'all' || filterType !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterDate('all');
                  setFilterType('all');
                }}
                className="bg-[#0d1117] border-gray-700 hover:bg-gray-800"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bug Cards List */}
      <div className="space-y-4">
        {filteredBugs.length === 0 ? (
          <Card className="bg-[#161b22] border-gray-800">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No bugs found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredBugs.map((bug) => (
            <Card key={bug.id} className="bg-[#161b22] border-gray-800 hover:border-cyan-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                    <div>
                      <CardTitle className="text-lg">{bug.type}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {bug.file}:<span className="text-blue-400">{bug.line}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(bug.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0d1117] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Code Snippet</span>
                    <span className="text-xs text-blue-400">{bug.language}</span>
                  </div>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{bug.snippet}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}