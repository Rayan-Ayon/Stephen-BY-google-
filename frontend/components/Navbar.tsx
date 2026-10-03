import React, { useState } from 'react';
import { Theme, AuthType } from '../App';
import { ChevronDown, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const IeltsDynastyEmblem: React.FC<{ className?: string; theme?: Theme }> = ({
  className = "w-8 h-8",
  theme = 'dark',
}) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img
      src={theme === 'light' ? "/ielts-dynasty-logo-dark.png" : "/ielts-dynasty-logo-white.png"}
      alt="IELTS Dynasty Emblem"
      className="w-full h-full object-contain select-none"
      draggable={false}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src.indexOf('logo-emblem.png') === -1) {
          target.src = '/logo-emblem.png';
        }
      }}
    />
  </div>
);

export interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  userEmail?: string;
  onStartLearning?: (view?: string) => void;
  onAuth?: (type: AuthType) => void;
  onNavigateInstitutionLogin?: () => void;
  onNavigate?: (path: string) => void;
  isScrolled?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  userEmail,
  onStartLearning,
  onAuth,
  onNavigateInstitutionLogin,
  onNavigate,
  isScrolled = false,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isHomeActive = currentPath === '/';
  const isFeaturesActive = currentPath.startsWith('/features');
  const isLearnActive = currentPath.startsWith('/learn');
  const isBusinessActive = currentPath.startsWith('/business');
  const isPricingActive = currentPath.startsWith('/pricing');
  const isEnterpriseActive = currentPath.startsWith('/enterprise') || currentPath.startsWith('/institution');

  const navigateTo = (path: string) => {
    setActiveDropdown(null);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleInstitutionClick = (type?: string) => {
    setActiveDropdown(null);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stephen_auth_return_route', window.location.pathname);
    }
    const targetUrl = type ? `/institution/login?type=${type}` : '/institution/login';
    if (onNavigateInstitutionLogin && !type) {
      onNavigateInstitutionLogin();
    } else {
      navigateTo(targetUrl);
    }
  };

  // ── 1. Features Dropdown Data ──
  const featuresList = [
    {
      title: 'Mohona AI Speaking Partner',
      subtitle: 'Full-duplex conversational voice feedback',
      path: '/features/speaking-partner',
    },
    {
      title: 'AI Writing Evaluator',
      subtitle: 'Instant Band 9 criteria scoring & rewrites',
      path: '/features/writing-evaluator',
    },
    {
      title: 'Reading & Listening Engine',
      subtitle: 'Cambridge 7–21 authentic mock tests',
      path: '/features/exam-engine',
    },
    {
      title: 'Student Dispute Pipeline',
      subtitle: '1-on-1 teacher re-evaluation & audio audits',
      path: '/features/dispute-engine',
    },
  ];

  // ── 2. Learn Dropdown Data (3 Columns) ──
  const learnData = {
    col1: {
      category: 'SKILL MODULES',
      items: [
        { title: 'Writing Task 1 & 2 Blueprint', path: '/learn/writing' },
        { title: 'Speaking Band 8+ Vocabulary', path: '/learn/speaking' },
        { title: 'Reading TFNG & Trap Mastery', path: '/learn/reading' },
        { title: 'Listening Audio Strategies', path: '/learn/listening' },
      ],
    },
    col2: {
      category: 'ACADEMIC RESOURCES',
      items: [
        { title: 'Band 9 Model Essay Vault', path: '/learn/model-essays' },
        { title: 'Cambridge Solution Key Guides', path: '/learn/cambridge-guides' },
      ],
    },
    col3: {
      category: 'AI STUDY TOOLS',
      items: [
        { title: 'Interactive YouTube AI Player', path: '/content-library' },
        { title: 'Lexicon & Grammar Booster', path: '/learn/grammar' },
      ],
    },
  };

  // ── 3. Business Dropdown Data ──
  const businessData = {
    main: {
      category: 'BUSINESS',
      items: [
        { title: 'Overview', path: '/business/overview' },
        { title: 'Contact Sales', path: '/business/contact' },
      ],
    },
    solutions: {
      category: 'AI SOLUTIONS FOR',
      items: [
        { title: 'Online IELTS Tutors', path: '/business/tutors' },
        { title: 'Coaching Institutes & Academies', path: '/business/institutes' },
      ],
    },
  };

  // ── 4. Enterprise Dropdown Data (Exactly 2 Sections) ──
  const enterpriseSections = [
    {
      title: 'For Online Teachers',
      subtitle: 'Independent coach command center & grading OS',
      path: '/institution/login?type=teacher',
      type: 'teacher',
    },
    {
      title: 'For Coaching Centers',
      subtitle: 'Farmgate 20-student batch management & node stats',
      path: '/institution/login?type=coaching_center',
      type: 'coaching_center',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-20 px-6 transition-all duration-300 flex items-center ${
        isScrolled
          ? 'bg-[#0D0F12]/90 dark:bg-[#0D0F12]/90 light:bg-white/95 backdrop-blur-xl border-b border-[#222732] dark:border-[#222732] light:border-slate-200 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Scaled Brand Identity */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="flex items-center gap-3.5 group py-1.5 focus:outline-none transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
          >
            {/* Scaled Emblem Mark */}
            <div className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shrink-0">
              <IeltsDynastyEmblem className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(225,29,72,0.3)]" theme={theme} />
            </div>

            {/* Scaled Brand Typography */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white dark:text-white light:text-slate-900 group-hover:text-slate-100 transition-colors">
                IELTS <span className="text-rose-500 font-extrabold">Dynasty</span>
              </span>
              <span className="text-[11px] font-bold tracking-widest text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded-md uppercase shadow-sm">
                PRO
              </span>
            </div>
          </a>
        </div>

        {/* Center: Navigation Menu with Active Route Highlighting & Glassmorphism Dropdowns */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {/* HOME NAVIGATION LINK */}
          <button
            onClick={() => navigateTo('/')}
            className={`text-sm px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              isHomeActive
                ? 'text-white font-bold border-b-2 border-rose-500 pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Home
          </button>

          {/* FEATURES DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('features')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => navigateTo('/features')}
              className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                isFeaturesActive
                  ? 'text-white font-bold border-b-2 border-rose-500 pb-1'
                  : activeDropdown === 'features'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Features
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180 text-rose-400' : 'text-slate-500'}`} />
            </button>

            {activeDropdown === 'features' && (
              <div className="absolute top-full left-0 mt-2 rounded-2xl bg-[#15181E]/75 backdrop-blur-xl border border-[#222732]/80 shadow-2xl shadow-black/50 p-4 transition-all duration-200 z-[100] w-72">
                <div className="flex flex-col space-y-2 group/menu">
                  {featuresList.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => navigateTo(item.path)}
                      className="w-full text-left bg-transparent hover:bg-transparent p-2 rounded-lg transition-all duration-200 group-hover/menu:opacity-40 hover:!opacity-100 cursor-pointer"
                    >
                      <div className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 hover:text-slate-300 transition-colors mt-0.5">
                        {item.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LEARN DROPDOWN (3 Columns) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('learn')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => navigateTo('/learn')}
              className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                isLearnActive
                  ? 'text-white font-bold border-b-2 border-rose-500 pb-1'
                  : activeDropdown === 'learn'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Learn
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'learn' ? 'rotate-180 text-rose-400' : 'text-slate-500'}`} />
            </button>

            {activeDropdown === 'learn' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl bg-[#15181E]/75 backdrop-blur-xl border border-[#222732]/80 shadow-2xl shadow-black/50 p-6 transition-all duration-200 z-[100] w-[720px] grid grid-cols-3 gap-6">
                {/* Column 1 */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {learnData.col1.category}
                  </h4>
                  <div className="flex flex-col space-y-2 group/menu">
                    {learnData.col1.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => navigateTo(item.path)}
                        className="w-full text-left bg-transparent hover:bg-transparent py-1.5 transition-all duration-200 group-hover/menu:opacity-40 hover:!opacity-100 cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                          {item.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="pl-6 border-l border-[#222732]">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {learnData.col2.category}
                  </h4>
                  <div className="flex flex-col space-y-2 group/menu">
                    {learnData.col2.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => navigateTo(item.path)}
                        className="w-full text-left bg-transparent hover:bg-transparent py-1.5 transition-all duration-200 group-hover/menu:opacity-40 hover:!opacity-100 cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                          {item.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 3 */}
                <div className="pl-6 border-l border-[#222732]">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {learnData.col3.category}
                  </h4>
                  <div className="flex flex-col space-y-2 group/menu">
                    {learnData.col3.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => navigateTo(item.path)}
                        className="w-full text-left bg-transparent hover:bg-transparent py-1.5 transition-all duration-200 group-hover/menu:opacity-40 hover:!opacity-100 cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                          {item.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BUSINESS DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('business')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => navigateTo('/business')}
              className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                isBusinessActive
                  ? 'text-white font-bold border-b-2 border-rose-500 pb-1'
                  : activeDropdown === 'business'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Business
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'business' ? 'rotate-180 text-rose-400' : 'text-slate-500'}`} />
            </button>

            {activeDropdown === 'business' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl bg-[#15181E]/75 backdrop-blur-xl border border-[#222732]/80 shadow-2xl shadow-black/50 p-6 transition-all duration-200 z-[100] w-[500px] grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {businessData.main.category}
                  </h4>
                  <div className="flex flex-col space-y-2 group/menu">
                    {businessData.main.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => navigateTo(item.path)}
                        className="w-full text-left bg-transparent hover:bg-transparent py-1.5 transition-all duration-200 group-hover/menu:opacity-40 hover:!opacity-100 cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                          {item.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pl-6 border-l border-[#222732]">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {businessData.solutions.category}
                  </h4>
                  <div className="flex flex-col space-y-2 group/menu">
                    {businessData.solutions.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => navigateTo(item.path)}
                        className="w-full text-left bg-transparent hover:bg-transparent py-1.5 transition-all duration-200 group-hover/menu:opacity-40 hover:!opacity-100 cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                          {item.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PRICING LINK (STANDALONE /pricing) */}
          <button
            onClick={() => navigateTo('/pricing')}
            className={`text-sm px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              isPricingActive
                ? 'text-white font-bold border-b-2 border-rose-500 pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pricing
          </button>

          {/* ENTERPRISE DROPDOWN (EXACTLY 2 SECTIONS) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('enterprise')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleInstitutionClick()}
              className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                isEnterpriseActive
                  ? 'text-white font-bold border-b-2 border-rose-500 pb-1'
                  : activeDropdown === 'enterprise'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Enterprise
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'enterprise' ? 'rotate-180 text-rose-400' : 'text-slate-500'}`} />
            </button>

            {activeDropdown === 'enterprise' && (
              <div className="absolute top-full right-0 mt-2 rounded-2xl bg-[#15181E]/75 backdrop-blur-xl border border-[#222732]/80 shadow-2xl shadow-black/50 p-4 transition-all duration-200 z-[100] w-80">
                <div className="flex flex-col space-y-2 group/menu">
                  {enterpriseSections.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => handleInstitutionClick(item.type)}
                      className="w-full text-left bg-transparent hover:bg-transparent p-2.5 rounded-lg transition-all duration-200 group-hover/menu:opacity-40 hover:!opacity-100 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                          {item.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-rose-400 opacity-60" />
                      </div>
                      <div className="text-xs text-slate-400 hover:text-slate-300 transition-colors mt-0.5">
                        {item.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {/* Dedicated Institution B2B Login Button */}
          <button
            onClick={() => handleInstitutionClick()}
            className="hidden sm:inline-flex bg-[#15181E] border border-[#222732] hover:border-rose-500/50 text-slate-200 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Institution Login
          </button>

          {userEmail ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 border border-rose-500/30 flex items-center justify-center text-xs text-white font-bold select-none shadow-md">
              {userEmail[0].toUpperCase()}
            </div>
          ) : (
            <>
              <button
                onClick={() => onAuth?.('login')}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-[#15181E] border border-transparent hover:border-[#222732] transition-all cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => onAuth?.('signup')}
                className="px-4 py-2 text-sm font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
