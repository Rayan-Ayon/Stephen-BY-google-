
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AuthOverlay from './components/AuthOverlay';

export type Theme = 'light' | 'dark';
export type AuthType = 'login' | 'signup' | null;

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
        <Dashboard 
          toggleTheme={toggleTheme} 
          theme={theme} 
          initialView={initialView} 
          onExit={() => setShowDashboard(false)}
        />
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
    </div>
  );
};

export default App;
