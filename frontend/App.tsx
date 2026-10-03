import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { supabase } from './supabaseClient';
import { AuthProvider, useAuth } from './authContext';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AuthOverlay from './components/AuthOverlay';
import SuperAdminView from './components/SuperAdminView';
import OrgSpaceView from './components/OrgSpaceView';
import ActivationView from './components/ActivationView';
import { InstitutionLoginView } from './components/auth/InstitutionLoginView';
import { PublicPricingView } from './components/PublicPricingView';
import { FeaturesShowcaseView } from './components/navigation/FeaturesShowcaseView';
import { LearnHubView } from './components/navigation/LearnHubView';
import { BusinessPortalView } from './components/navigation/BusinessPortalView';
import { WorkspaceProvider } from './workspaceContext';
import { initMockDb } from './utils/mockDb';

export type Theme = 'light' | 'dark';
export type AuthType = 'login' | 'signup' | null;

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
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
        <div className="flex flex-col items-center justify-center h-screen bg-canvas text-white p-8">
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

const AppContent: React.FC = () => {
  const { userId, userEmail, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stephen_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [initialView, setInitialView] = useState('add_content');
  const [authType, setAuthType] = useState<AuthType>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [spaceCode, setSpaceCode] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isOrgManager, setIsOrgManager] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    initMockDb();
    const path = window.location.pathname;
    if (path === '/super-admin') {
      setIsSuperAdmin(true);
    }
    if (path === '/ielts/reading' || path.startsWith('/ielts') || path.startsWith('/reading')) {
      setShowDashboard(true);
      setInitialView('reading_hub');
    }
    if (path === '/support') {
      setShowDashboard(true);
      setInitialView('support');
    }
    if (path === '/portal/community' || path === '/community' || path.startsWith('/portal/community')) {
      setShowDashboard(true);
      setInitialView('community');
    }
    const orgSession = localStorage.getItem('stephen_active_tenant_session');
    if (path === '/coaching/evaluations' || path.startsWith('/coaching')) {
      setIsOrgManager(true);
    } else if (path === '/org-space' || path.startsWith('/org')) {
      setIsOrgManager(true);
    } else if (orgSession && path === '/') {
      window.history.pushState({}, '', '/org-space');
      setIsOrgManager(true);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.body.style.backgroundColor = '#0A0B0D';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [theme]);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        setShowDashboard(true);
      }
      setSessionChecked(true);
    }
  }, [authLoading, isAuthenticated]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const next = prevTheme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('stephen_theme', next);
      }
      return next;
    });
  };

  const handleStartLearning = (view: string = 'add_content') => {
    if (currentPath !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    setInitialView(view);
    setShowDashboard(true);
  };

  const handleAuthSuccess = (email: string, code: string) => {
    setSpaceCode(code);
    setAuthType(null);
    handleStartLearning();
  };

  const handleLogout = async () => {
    await signOut();
    setSpaceCode('');
    setShowDashboard(false);
  };

  const isActivation = currentPath === '/activate';

  if (isActivation) {
    return (
      <ActivationView
        onComplete={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
          window.location.reload();
        }}
      />
    );
  }

  const isInstitutionLogin = currentPath.startsWith('/institution/login');

  if (isInstitutionLogin) {
    return (
      <InstitutionLoginView
        onSuccess={() => {
          window.history.pushState({}, '', '/org-space');
          setCurrentPath('/org-space');
          setIsOrgManager(true);
        }}
        onSwitchToStudent={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
          setAuthType('login');
        }}
        onExit={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
      />
    );
  }

  const isPricing = currentPath === '/pricing' || currentPath.startsWith('/pricing');
  if (isPricing) {
    return (
      <div className={`transition-colors duration-300 ${theme === 'dark' ? 'dark text-neutral-200' : 'text-neutral-800'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        <PublicPricingView
          theme={theme}
          toggleTheme={toggleTheme}
          userEmail={userEmail}
          onAuth={(type) => setAuthType(type)}
          onStartLearning={handleStartLearning}
          onNavigate={(path) => {
            window.history.pushState({}, '', path);
            setCurrentPath(path);
          }}
        />
        {authType && (
          <AuthOverlay
            type={authType}
            setType={setAuthType}
            onClose={() => setAuthType(null)}
            onSuccess={(email) => handleAuthSuccess(email, '')}
          />
        )}
      </div>
    );
  }

  const isFeatures = currentPath === '/features' || currentPath.startsWith('/features');
  if (isFeatures) {
    return (
      <div className={`transition-colors duration-300 ${theme === 'dark' ? 'dark text-neutral-200' : 'text-neutral-800'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        <FeaturesShowcaseView
          theme={theme}
          toggleTheme={toggleTheme}
          userEmail={userEmail}
          onAuth={(type) => setAuthType(type)}
          onStartLearning={handleStartLearning}
          onNavigate={(path) => {
            window.history.pushState({}, '', path);
            setCurrentPath(path);
          }}
          subPath={currentPath}
        />
        {authType && (
          <AuthOverlay
            type={authType}
            setType={setAuthType}
            onClose={() => setAuthType(null)}
            onSuccess={(email) => handleAuthSuccess(email, '')}
          />
        )}
      </div>
    );
  }

  const isLearn = currentPath === '/learn' || currentPath.startsWith('/learn');
  if (isLearn) {
    return (
      <div className={`transition-colors duration-300 ${theme === 'dark' ? 'dark text-neutral-200' : 'text-neutral-800'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        <LearnHubView
          theme={theme}
          toggleTheme={toggleTheme}
          userEmail={userEmail}
          onAuth={(type) => setAuthType(type)}
          onStartLearning={handleStartLearning}
          onNavigate={(path) => {
            window.history.pushState({}, '', path);
            setCurrentPath(path);
          }}
          subPath={currentPath}
        />
        {authType && (
          <AuthOverlay
            type={authType}
            setType={setAuthType}
            onClose={() => setAuthType(null)}
            onSuccess={(email) => handleAuthSuccess(email, '')}
          />
        )}
      </div>
    );
  }

  const isBusiness = currentPath === '/business' || currentPath.startsWith('/business');
  if (isBusiness) {
    return (
      <div className={`transition-colors duration-300 ${theme === 'dark' ? 'dark text-neutral-200' : 'text-neutral-800'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        <BusinessPortalView
          theme={theme}
          toggleTheme={toggleTheme}
          userEmail={userEmail}
          onAuth={(type) => setAuthType(type)}
          onStartLearning={handleStartLearning}
          onNavigate={(path) => {
            window.history.pushState({}, '', path);
            setCurrentPath(path);
          }}
          subPath={currentPath}
        />
        {authType && (
          <AuthOverlay
            type={authType}
            setType={setAuthType}
            onClose={() => setAuthType(null)}
            onSuccess={(email) => handleAuthSuccess(email, '')}
          />
        )}
      </div>
    );
  }

  const handleOrgAccess = () => {
    window.history.pushState({}, '', '/org-space');
    setIsOrgManager(true);
  };

  if (isOrgManager) {
    const isCoachingEval = window.location.pathname === '/coaching/evaluations' || window.location.pathname.startsWith('/coaching');
    return (
      <OrgSpaceView
        initialSubView={isCoachingEval ? 'evaluation_studio' : undefined}
        onExit={() => {
          localStorage.removeItem('stephen_active_tenant_session');
          window.history.pushState({}, '', '/');
          setIsOrgManager(false);
        }}
      />
    );
  }

  if (isSuperAdmin) {
    return (
      <SuperAdminView />
    );
  }

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F]">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'dark text-neutral-200' : 'text-neutral-800'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {showDashboard ? (
        <ErrorBoundary>
          <WorkspaceProvider>
            <Dashboard
              toggleTheme={toggleTheme}
              theme={theme}
              initialView={initialView}
              onExit={() => setShowDashboard(false)}
              userEmail={userEmail}
              userId={userId}
              spaceCode={spaceCode}
              onLogout={handleLogout}
            />
          </WorkspaceProvider>
        </ErrorBoundary>
      ) : (
        <LandingPage
          onStartLearning={handleStartLearning}
          onAuth={(type) => setAuthType(type)}
          toggleTheme={toggleTheme}
          theme={theme}
          userEmail={userEmail}
          onOrgAccess={handleOrgAccess}
          onNavigateInstitutionLogin={() => {
            window.history.pushState({}, '', '/institution/login');
            setCurrentPath('/institution/login');
          }}
          onNavigate={(path) => {
            window.history.pushState({}, '', path);
            setCurrentPath(path);
          }}
        />
      )}

      {authType && (
        <AuthOverlay
          type={authType}
          setType={setAuthType}
          onClose={() => setAuthType(null)}
          onSuccess={(email) => handleAuthSuccess(email, '')}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#14161A',
            color: '#fff',
            border: '1px solid #22262F'
          }
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
