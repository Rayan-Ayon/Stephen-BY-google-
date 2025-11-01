import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0d0d0d';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#fbfcfd';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleStartLearning = () => {
    setShowDashboard(true);
  };

  return (
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'dark text-gray-300' : 'text-gray-800'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {showDashboard ? (
        <Dashboard toggleTheme={toggleTheme} theme={theme} />
      ) : (
        <LandingPage onStartLearning={handleStartLearning} toggleTheme={toggleTheme} theme={theme} />
      )}
    </div>
  );
};

export default App;
