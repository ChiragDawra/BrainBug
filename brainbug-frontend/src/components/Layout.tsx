import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Brain, Home, History, BarChart3, LayoutDashboard, Sun, Moon, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] dark:bg-[#0d1117] light:bg-gray-50 text-gray-100 dark:text-gray-100 light:text-gray-900 transition-colors">
      {/* Header */}
      <header className="border-b border-gray-800 dark:border-gray-800 light:border-gray-200 bg-[#161b22] dark:bg-[#161b22] light:bg-white transition-colors">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-cyan-400" />
              <div>
                <h1 className="text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Bug Brain</h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Your AI Coding Companion</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <nav className="flex gap-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-gray-100 dark:hover:text-gray-100 light:hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100'
                    }`
                  }
                >
                  <Home className="h-4 w-4" />
                  Home
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-gray-100 dark:hover:text-gray-100 light:hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100'
                    }`
                  }
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/bug-history"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-gray-100 dark:hover:text-gray-100 light:hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100'
                    }`
                  }
                >
                  <History className="h-4 w-4" />
                  Bug History
                </NavLink>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-gray-100 dark:hover:text-gray-100 light:hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100'
                    }`
                  }
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </NavLink>
              </nav>
              <div className="flex gap-3 items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleTheme}
                  className="border-gray-700 dark:border-gray-700 light:border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-gray-100">
                      <User className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">{user?.name}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="border-gray-700 dark:border-gray-700 light:border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/signin')}
                      className="border-gray-700 dark:border-gray-700 light:border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => navigate('/signup')}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}