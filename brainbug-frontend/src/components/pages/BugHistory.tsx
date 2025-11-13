// 1. IMPORT useState AND useEffect
import { useState, useEffect } from 'react';
import { AlertTriangle, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

// 2. DEFINE THE SHAPE OF THE DATA THE *COMPONENT* NEEDS
interface Bug {
  id: string; // MongoDB _id is a string
  type: string;
  file: string;
  line: number;
  date: string;
  snippet: string;
  language: string;
}

// 3. DEFINE THE SHAPE OF THE *API RESPONSE* (matches your BugHistory.js model)
interface BugHistoryDocument {
  _id: string;
  userId: string;
  fileName: string;
  originalCode: string;
  mlPredictions: any; // We can make this more specific later
  geminiOutput: any;  // We can make this more specific later
  createdAt: string;  // MongoDB sends dates as strings
}

// 4. DELETE THE OLD STATIC 'allBugs' ARRAY
// const allBugs = [ ... ];

export function BugHistory() {
  // 5. SET UP STATE TO HOLD THE *TRANSFORMED* BUGS
  const [allBugs, setAllBugs] = useState<Bug[]>([]);
  const [filterDate, setFilterDate] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // 6. FETCH AND TRANSFORM DATA ON COMPONENT LOAD
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        // Fetch from your Express API
        const response = await fetch('http://127.0.0.1:8000/api/bugs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data: BugHistoryDocument[] = await response.json();

        // === IMPORTANT: DATA TRANSFORMATION ===
        // We map the data from your DB schema to what the component expects
        const transformedBugs: Bug[] = data.map(doc => ({
          id: doc._id,
          file: doc.fileName,
          date: doc.createdAt,
          
          // --- We must make assumptions here. ---
          // --- Adjust this based on your geminiOutput/mlPredictions object structure ---
          type: doc.geminiOutput?.type || doc.mlPredictions?.type || 'Bug Type Unknown',
          line: doc.geminiOutput?.line || doc.mlPredictions?.line || 0,
          snippet: doc.geminiOutput?.snippet || doc.originalCode, // Fallback to original code
          language: doc.geminiOutput?.language || 'JavaScript' // Default language
        }));

        setAllBugs(transformedBugs); // 7. Set the *transformed* data in state
      } catch (error) {
        console.error("Failed to fetch bugs:", error);
      }
    };

    fetchBugs();
  }, []); // The empty array [] means this runs only once

  
  // --- FROM HERE DOWN, THE COMPONENT IS UNCHANGED ---
  // It now uses the 'allBugs' from our state, which is filled by the API.

  const filteredBugs = allBugs.filter((bug) => {
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

      {/* Filters */}
      <Card className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* ... all your filter JSX ... */}
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
                  {/* You can later make these dates dynamic from the data */}
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
              <p className="text-gray-400">No bugs found.</p>
              <p className="text-sm text-gray-600 mt-2">Make sure your backend is running and the database is connected.</p>
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