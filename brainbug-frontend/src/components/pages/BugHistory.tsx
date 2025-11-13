// 1. IMPORT useState AND useEffect
import { useState, useEffect } from 'react';
import { AlertTriangle, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

// 2. DEFINE A TYPESCRIPT INTERFACE FOR YOUR BUG DATA
// This should match the data structure from your Express backend
interface Bug {
  id: number;
  type: string;
  file: string;
  line: number;
  date: string; // We'll receive a string (like an ISO date) from the API
  snippet: string;
  language: string;
}

// 3. THE ORIGINAL 'allBugs' ARRAY IS NOW DELETED
// We will get this data from our API

export function BugHistory() {
  // 4. SET UP STATE TO HOLD THE DATA FROM THE API
  const [allBugs, setAllBugs] = useState<Bug[]>([]); // Starts as an empty array
  const [filterDate, setFilterDate] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // 5. ADD THE useEffect HOOK TO FETCH DATA WHEN THE COMPONENT LOADS
  useEffect(() => {
    // We define an async function inside the effect
    const fetchBugs = async () => {
      try {
        // This is the URL to the Express API endpoint we created
        const response = await fetch('http://127.0.0.1:8000/api/bugs');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data: Bug[] = await response.json();
        setAllBugs(data); // Put the fetched bugs into our state
      } catch (error) {
        console.error("Failed to fetch bugs:", error);
        // You could set an error state here to show a message to the user
      }
    };

    fetchBugs(); // Call the function
  }, []); // The empty array [] means this effect runs only ONCE, when the component mounts

  
  // 6. THE REST OF THE COMPONENT WORKS AS-IS!
  // This logic now uses the 'allBugs' from our state,
  // which is filled by the API call.

  const filteredBugs = allBugs.filter((bug) => {
    // Small update to make date filtering work with ISO date strings
    const dateMatch = filterDate === 'all' || new Date(bug.date).toISOString().startsWith(filterDate);
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

      {/* Filters (This JSX is identical to the original) */}
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
                  {/* Note: This part could be improved to dynamically show dates from 'allBugs' */}
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

      {/* Bug Cards List (This JSX is identical to the original) */}
      <div className="space-y-4">
        {filteredBugs.length === 0 ? (
          <Card className="bg-[#161b22] border-gray-800">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No bugs found matching your filters</p>
              <p className="text-sm text-gray-600 mt-2">Is your backend server running?</p>
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