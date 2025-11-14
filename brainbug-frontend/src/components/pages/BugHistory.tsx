import React, { useState, useEffect } from 'react';
import { AlertTriangle, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
// Import your API functions
import { getBugHistory, getBugTypes } from '../../services/api'; 
// 👆 NOTE: You will need to create getBugTypes() in your api.ts file

// --- 1. Define your data interfaces ---
// This interface must match the data from your API
interface Bug {
  id: string; // Use string for DB IDs
  type: string;
  file: string;
  line: number;
  date: string; // Keep as string (e.g., "2024-12-11")
  snippet: string;
  language: string;
}

interface Filters {
  date: string; // 'all', '2024-12-11', ...
  type: string; // 'all', 'Null Pointer Exception', ...
}

export function BugHistory() {
  // --- 2. Set up your state hooks ---
  
  // State for the selected filters
  const [filters, setFilters] = useState<Filters>({
    date: 'all',
    type: 'all',
  });

  // State for the list of available filter options (e.g., all bug types)
  const [bugTypes, setBugTypes] = useState<string[]>([]);
  // TODO: You can also add state for available dates if needed

  // State for the bug list returned from the API
  const [bugs, setBugs] = useState<Bug[]>([]); // Default to an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- 3. Data Fetching Hooks ---

  // Effect 1: Fetch the list of bugs based on the current filters
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pass the current filter state to the API
        const fetchedBugs = await getBugHistory(filters); 
        setBugs(fetchedBugs); // Store the returned array

      } catch (err: any) {
        setError('Failed to fetch bug history.');
        setBugs([]); // Clear bugs on error
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBugs();
  }, [filters]); // ⭐️ This re-runs whenever the 'filters' state changes

  // Effect 2: Fetch the available filter options (e.g., all bug types)
  // This runs only ONCE when the component mounts
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // You'll need to create this function in api.ts
        // It should just return an array of strings: ['Null Pointer', 'Type Mismatch', ...]
        const types = await getBugTypes(); 
        setBugTypes(types);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
        // We can still function, the dropdown will just be empty
      }
    };
    
    fetchFilterOptions();
  }, []); // Empty array [] means this runs only once

  // --- 4. Filter Change Handlers ---
  // These functions update the 'filters' state, which triggers the effect above
  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: 'all',
      type: 'all',
    });
  };

  // --- 5. Render Function for the list ---
  // This helper function neatly handles loading, error, and empty states
  const renderBugList = () => {
    if (loading) {
      return (
        <Card className="bg-[#161b22] border-gray-800">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 animate-pulse">Loading bug history...</p>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="bg-[#161b22] border-gray-800">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-gray-400">{error}</p>
          </CardContent>
        </Card>
      );
    }

    if (bugs.length === 0) {
      // This is the "No bugs found" state
      return (
        <Card className="bg-[#161b22] border-gray-800">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No bugs found matching your filters</p>
          </CardContent>
        </Card>
      );
    }

    // This is the "Success" state
    return (
      <div className="space-y-4">
        {bugs.map((bug) => (
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
        ))}
      </div>
    );
  };

  // --- 6. Main JSX Return ---
  return (
    <div className="space-y-6">
      {/* Page Header (Static) */}
      <div>
        <h2 className="text-3xl mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Bug History</span>
        </h2>
        <p className="text-gray-400">Deep dive into all your coding mistakes</p>
      </div>

      {/* Filters (Dynamic) */}
      <Card className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Select value={filters.date} onValueChange={(value: any) => handleFilterChange('date', value)}>
                <SelectTrigger className="w-[180px] bg-[#0d1117] border-gray-700">
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-gray-700">
                  <SelectItem value="all">All Dates</SelectItem>
                  {/* You can hard-code dates or fetch them like bug types */}
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
              <Select value={filters.type} onValueChange={(value : any) => handleFilterChange('type', value)}>
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

            {(filters.date !== 'all' || filters.type !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="bg-[#0d1117] border-gray-700 hover:bg-gray-800"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bug Cards List (Dynamic) */}
      {renderBugList()}
    </div>
  );
}