import axios from 'axios';

// ⚠️ Get this URL from Team 1!
// This is just a placeholder and WILL NOT WORK until they give you the real one.
const API_URL = 'http://localhost:8000/api'; 

const apiClient = axios.create({
  baseURL: API_URL,
});

// --- Data Type Definitions (Optional, but good practice) ---
// (You can get the exact types from Team 1)

export interface DashboardStats {
  totalBugs: number;
  mostCommonMistake: string;
  improvementScore: number;
}

export interface AiAnalysis {
  patternRecognition: string;
  predictiveInsights: string;
  remediationSuggestions: string;
  impactAssessment: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
}

export interface BugItem {
  id: string;
  title: string;
  status: string;
  // ...other bug properties
}

export interface DashboardData {
  stats: DashboardStats;
  aiAnalysis: AiAnalysis;
  bugsOverTime: TimeSeriesDataPoint[];
  recentBugs: BugItem[];
}

// --- API Functions ---

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Re-throw the error so the component can catch it
    throw new Error('Failed to fetch dashboard data.');
  }
};

export const getAnalyticsData = async () => {
  // ... (Follow the same pattern as above)
  const response = await apiClient.get('/analytics');
  return response.data;
};
export const getBugTypes = async (): Promise<string[]> => {
    try {
      // We assume the backend has an endpoint '/bug-types'
      // that returns an array of strings: ["Null Pointer", "Type Mismatch", ...]
      const response = await apiClient.get('/bug-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching bug types:', error);
      return []; // Return an empty array on error
    }
  };
export const getBugHistory = async (filters: object) => {
  // ... (Follow the same pattern as above)
  const response = await apiClient.get('/bug-history', { params: filters });
  return response.data;
};