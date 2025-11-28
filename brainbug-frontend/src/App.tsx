import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './components/pages/Home';
import { Dashboard } from './components/pages/Dashboard';
import { BugHistory } from './components/pages/BugHistory';
import { Analytics } from './components/pages/Analytics';
import { SignIn } from './components/pages/SignIn';
import { SignUp } from './components/pages/SignUp';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bug-history" element={<BugHistory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}