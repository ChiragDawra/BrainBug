// src/components/pages/BugHistory.tsx
import React, { useState, useEffect } from 'react';
import { getBugHistory } from '../../services/api';

// --- Import your UI components ---
// import { BugHistoryItem } from '../ui/BugHistoryItem';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { DatePicker } from '../ui/DatePicker'; // Your filter inputs
// import { Select } from '../ui/Select';       // Your filter inputs
// import { NoBugsFound } from '../ui/NoBugsFound'; // The "empty state" component

// Define types
interface Bug {
  id: string;
  title: string;
  type: string;
  date: string;
  project: string;
}

interface Filters {
  date: string;
  bugType: string;
  project: string;
  // ...any other filters
}

export function BugHistory() {
  // --- State for filters ---
  const [filters, setFilters] = useState<Filters>({
    date: '',
    bugType: 'all',
    project: 'all',
  });

  // --- State for API results ---
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bugs, setBugs] = useState<Bug[]>([]); // Default to an empty array

  // --- Data Fetching Hook ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Pass the current filter state to the API
        const bugData = await getBugHistory(filters); 
        setBugs(bugData); // Store the returned array

      } catch (err) {
        setError('Failed to fetch bug history.');
        setBugs([]); // Clear bugs on error
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]); // ⭐️ This is the magic! Re-runs when 'filters' changes.

  // --- Filter Change Handlers ---
  // This updates the 'filters' state, which triggers the useEffect
  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // --- Helper function to render the list ---
  const renderBugList = () => {
    if (loading) {
      // return <LoadingSpinner />;
      return <div className="p-6">Loading bug history...</div>;
    }

    if (error) {
      return <div className="p-6 text-red-500">{error}</div>;
    }

    // ⭐ CRUCIAL: Check for an empty array
    if (bugs.length === 0) {
      // This is where you show your "No bugs found" message
      // return <NoBugsFound />;
      return <div className="p-6 text-center">No bugs found.</div>;
    }

    // Map over the bugs and render them
    return (
      <div className="space-y-4">
        {/* {bugs.map((bug) => (
          <BugHistoryItem key={bug.id} bug={bug} />
        ))} */}
      </div>
    );
  };

  return (
    <div className="bug-history-container p-6">
      <h1 className="text-2xl font-bold mb-4">Bug History</h1>

      {/* 1. Filter Components */}
      <div className="filters-bar flex gap-4 mb-6">
        {/* <DatePicker 
          onSelect={(date) => handleFilterChange('date', date.toString())} 
        />
        <Select 
          onValueChange={(value) => handleFilterChange('bugType', value)}
        >
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="UI">UI</SelectItem>
          <SelectItem value="Logic">Logic</SelectItem>
        </Select> */}
        {/* ...other filters */}
      </div>

      {/* 2. Bug List (with loading/empty state) */}
      {renderBugList()}
    </div>
  );
}