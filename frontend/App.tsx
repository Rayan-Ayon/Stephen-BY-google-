
import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AuthOverlay from './components/AuthOverlay';

export type Theme = 'light' | 'dark';
export type AuthType = 'login' | 'signup' | null;

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Dashboard error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0b0b0b] text-white p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-gray-400 mb-6 text-center">We encountered an error while loading the dashboard. Please check your console for details.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white text-black font-bold rounded-full"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [showDashboard, setShowDashboard] = useState(false);
  const [initialView, setInitialView] = useState('add_content');
  const [authType, setAuthType] = useState<AuthType>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0b0b0b';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleStartLearning = (view: string = 'add_content') => {
    setInitialView(view);
    setShowDashboard(true);
  };

  const handleAuthSuccess = () => {
    setAuthType(null);
    handleStartLearning();
  };

  return (
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'dark text-neutral-200' : 'text-neutral-800'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {showDashboard ? (
        <ErrorBoundary>
          <Dashboard 
            toggleTheme={toggleTheme} 
            theme={theme} 
            initialView={initialView} 
            onExit={() => setShowDashboard(false)}
          />
        </ErrorBoundary>
      ) : (
        <LandingPage 
          onStartLearning={handleStartLearning} 
          onAuth={(type) => setAuthType(type)}
          toggleTheme={toggleTheme} 
          theme={theme} 
        />
      )}

      {authType && (
        <AuthOverlay 
          type={authType} 
          setType={setAuthType} 
          onClose={() => setAuthType(null)} 
          onSuccess={handleAuthSuccess}
        />
      )}

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: { 
            background: '#1a1a1a', 
            color: '#fff', 
            border: '1px solid #333' 
          }
        }}
      />
    </div>
  );
};

export default App;
