
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Theme, AuthType } from '../App';
import { SunIcon, MoonIcon, BrainIcon, UploadIcon, FlashcardIcon, TrophyIcon, EdgramIcon, DebatePodiumIcon, ChevronDownIcon, QuestionMarkIcon, ArrowUpRightIcon } from './icons';
import EnterpriseView from './EnterpriseView';

interface LandingPageProps {
  onStartLearning: (view?: string) => void;
  onAuth: (type: AuthType) => void;
  toggleTheme: () => void;
  theme: Theme;
}

const FeatureCard = ({ icon, title, description, theme }: { icon: React.ReactElement<any>, title: string, description: string, theme: Theme }) => (
    <motion.div 
        className={`rounded-xl p-6 text-center border ${theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800/60' : 'bg-neutral-100/50 border-neutral-200/80'}`}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.2 }}
    >
        <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-200'}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}` })}
        </div>
        <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>{title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{description}</p>
    </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning, onAuth, toggleTheme, theme }) => {
    const [currentView, setCurrentView] = useState<'home' | 'enterprise'>('home');
    const [enterpriseType, setEnterpriseType] = useState<'business' | 'team' | 'universities' | 'government'>('business');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Navigation Structure
    const navLinks = [
        { name: 'About', key: 'edgram' }, // Replacing Collab with About for now
        { name: 'Features', key: 'features', hasDropdown: true },
        { name: 'Learn', key: 'learn', hasDropdown: true }, 
        { name: 'Business', key: 'business', hasDropdown: true },
        { name: 'Pricing', key: 'pricing', hasDropdown: true },
        { name: 'Enterprise', key: 'enterprise', hasDropdown: true },
        { name: 'Download', key: 'download', hasDropdown: false },
    ];

    // Dropdown Data
    const featuresData = [
        { name: 'AI features', key: 'discover', desc: 'Explore AI tools' },
        { name: 'Professor support', key: 'consult_professors', desc: 'Get expert help' },
        { name: 'Research', key: 'research_lab', desc: 'Academic labs' },
        { name: 'Learning network', key: 'edgram', desc: 'Connect with peers' },
        { name: 'Structurize learning', key: 'add_courses', desc: 'Guided paths' },
    ];

    const learnData = {
        for: [
            { name: 'Students', key: 'students' },
            { name: 'University Educators', key: 'educators' },
            { name: 'Teachers', key: 'teachers' },
            { name: 'Scientists', key: 'scientists' },
            { name: 'Parents', key: 'parents' },
            { name: 'Veterans', key: 'veterans' },
        ],
        inspiration: [
            { name: 'Student Writing Guide', key: 'writing_guide' },
            { name: 'Recipes and Cooking', key: 'recipes' },
        ],
        waysToUse: [
            { name: 'Canva in Stephen', key: 'canva' },
            { name: 'Spotify in Stephen', key: 'spotify' },
            { name: 'Chat with PDFs', key: 'pdf' },
            { name: 'Chat with Presentations', key: 'ppt' },
            { name: 'Chat with Spreadsheets', key: 'xls' },
            { name: 'For College Students', key: 'college' },
        ]
    };

    const businessData = {
        main: [
            { name: 'Overview', key: 'business_overview' },
            { name: 'Contact Sales', key: 'contact_sales' },
            { name: 'Merchants', key: 'merchants' },
        ],
        solutions: [
            { name: 'Data Science & Analytics', key: 'ds_analytics' },
            { name: 'Engineering', key: 'engineering' },
            { name: 'Finance', key: 'finance' },
            { name: 'Product Management', key: 'pm' },
            { name: 'Sales & Marketing', key: 'marketing' },
        ]
    };

    const pricingData = [
        { name: 'Overview', key: 'pricing_overview' },
        { name: 'Free', key: 'pricing_free' },
        { name: 'Go', key: 'pricing_go' },
        { name: 'Plus', key: 'pricing_plus' },
        { name: 'Pro', key: 'pricing_pro' },
    ];

    const enterpriseDropdownItems = [
        { name: 'Business', key: 'business' },
        { name: 'Team', key: 'team' },
        { name: 'Universities', key: 'universities' },
        { name: 'Government', key: 'government' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 60, opacity: 0, rotateX: -10 },
        visible: {
            y: 0,
            opacity: 1,
            rotateX: 0,
            transition: { 
                type: 'spring', 
                stiffness: 70,
                damping: 20,
                duration: 0.8
            },
        },
    };

    const handleDropdownClick = (itemKey: string) => {
        if (['business', 'team', 'universities', 'government'].includes(itemKey)) {
            setEnterpriseType(itemKey as any);
            setCurrentView('enterprise');
            setActiveDropdown(null);
        } else if (['discover', 'consult_professors', 'research_lab', 'edgram', 'add_courses'].includes(itemKey)) {
            onStartLearning(itemKey);
        } else if (itemKey.startsWith('pricing_')) {
             onStartLearning('pricing');
        }
        setActiveDropdown(null);
    };

    const getLogoSuffix = () => {
        if (currentView !== 'enterprise') return null;
        switch (enterpriseType) {
            case 'business': return 'for Business';
            case 'team': return 'for Teams';
            case 'universities': return 'for Campus';
            case 'government': return 'for Government';
            default: return null;
        }
    };

    // Shared styles for the liquid glass effect dropdowns
    const dropdownClasses = `rounded-xl border shadow-2xl backdrop-blur-xl overflow-hidden py-2 ${theme === 'dark' ? 'bg-black/80 border-white/10 text-white' : 'bg-white/80 border-gray-200 text-black'}`;

    const renderHomeView = () => (
        <>
            <style>{`
                @keyframes text-shine-unified {
                    0% { background-position: -150vw 0; }
                    100% { background-position: 50vw 0; }
                }
            `}</style>
            {/* Hero Section */}
            <motion.section 
                className="relative text-center min-h-[90vh] flex flex-col justify-center items-center px-4 overflow-hidden pt-32"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col items-center justify-center max-w-[95vw]">
                    <motion.div variants={itemVariants}>
                        <h1 
                            className={`font-display leading-[0.9] text-center bg-clip-text text-transparent`}
                            style={{ 
                                fontSize: 'clamp(4rem, 14vw, 12rem)',
                                backgroundImage: theme === 'dark' 
                                    ? 'linear-gradient(to right, #525252 0%, #525252 40%, #ffffff 50%, #525252 60%, #525252 100%)' 
                                    : 'linear-gradient(to right, #9ca3af 0%, #9ca3af 40%, #000000 50%, #9ca3af 60%, #9ca3af 100%)',
                                backgroundSize: '200vw auto',
                                backgroundAttachment: 'fixed',
                                animation: 'text-shine-unified 5s linear infinite'
                            }}
                        >
                            Your gateway to
                        </h1>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mb-10">
                        <h1 
                            className="font-display leading-[0.9] text-center" 
                            style={{ 
                                fontSize: 'clamp(4rem, 14vw, 12rem)',
                            }}
                        >
                            <span 
                                className={`bg-clip-text text-transparent`}
                                style={{ 
                                    backgroundImage: theme === 'dark' 
                                        ? 'linear-gradient(to right, #525252 0%, #525252 40%, #ffffff 50%, #525252 60%, #525252 100%)' 
                                        : 'linear-gradient(to right, #9ca3af 0%, #9ca3af 40%, #000000 50%, #9ca3af 60%, #9ca3af 100%)',
                                    backgroundSize: '200vw auto',
                                    backgroundAttachment: 'fixed',
                                    animation: 'text-shine-unified 5s linear infinite'
                                }}
                            >
                                world-class{' '}
                            </span>
                            <span 
                                className={`inline-block bg-clip-text text-transparent`}
                                style={{ 
                                    backgroundImage: theme === 'dark'
                                        ? 'linear-gradient(to right, #FF5A1A 0%, #FF5A1A 40%, #ffffff 50%, #FF5A1A 60%, #FF5A1A 100%)'
                                        : 'linear-gradient(to right, #FF5A1A 0%, #FF5A1A 40%, #000000 50%, #FF5A1A 60%, #FF5A1A 100%)',
                                    backgroundSize: '200vw auto',
                                    backgroundAttachment: 'fixed',
                                    animation: 'text-shine-unified 5s linear infinite'
                                }}
                            >
                                {"learning.".split("").map((char, i) => (
                                    <span
                                        key={i}
                                        className={`transition-colors duration-300 cursor-default ${
                                            theme === 'dark'
                                            ? 'hover:text-white'
                                            : 'hover:text-black'
                                        }`}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                        </h1>
                    </motion.div>
                </div>

                <motion.p 
                    variants={itemVariants} 
                    className={`max-w-xl mx-auto text-lg md:text-xl mb-12 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} font-light`}
                >
                    Personalized, scientific, real-world learning — at your pace.
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`font-semibold px-8 py-3.5 rounded-full border transition-all text-base ${theme === 'dark' ? 'border-neutral-700 text-white hover:bg-neutral-800' : 'border-neutral-300 text-black hover:bg-neutral-100'}`}
                    >
                        See Features
                    </button>
                    <button
                        onClick={() => onStartLearning()}
                        className="bg-[#FF5A1A] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#ff7a45] transition-all shadow-lg hover:shadow-orange-500/20 text-base"
                    >
                        Start Learning
                    </button>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className={`py-32 px-6 ${theme === 'dark' ? 'bg-black/50' : 'bg-white'}`}>
                <div className="container mx-auto">
                    <div className="text-center mb-20">
                        <h2 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>Unlock Your Learning Potential</h2>
                        <p className={`${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'} mt-6 text-xl max-w-2xl mx-auto font-light`}>
                            From lectures to articles, Stephen provides a suite of powerful tools to help you master any subject.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard 
                            theme={theme}
                            icon={<UploadIcon />}
                            title="Flexible Content"
                            description="Upload files, paste links from YouTube or articles, or record lectures directly. Your content, your course."
                        />
                            <FeatureCard 
                            theme={theme}
                            icon={<BrainIcon />}
                            title="AI-Powered Tutor"
                            description="Engage in dynamic conversations with an AI that understands your material and helps you learn faster."
                        />
                            <FeatureCard 
                            theme={theme}
                            icon={<FlashcardIcon />}
                            title="Smart Study Tools"
                            description="Automatically generate flashcards, quizzes, podcasts, and summaries tailored to your learning style."
                        />
                            <FeatureCard 
                            theme={theme}
                            icon={<TrophyIcon />}
                            title="Competitions"
                            description="Test your skills and knowledge against peers in exciting academic and practical competitions."
                        />
                            <FeatureCard 
                            theme={theme}
                            icon={<EdgramIcon />}
                            title="Edgram Social Learning"
                            description="Share your learning journey, discover what others are studying, and connect with a community of learners."
                        />
                            <FeatureCard 
                            theme={theme}
                            icon={<DebatePodiumIcon />}
                            title="Debate Arena"
                            description="Sharpen your critical thinking by debating complex topics with a sophisticated AI opponent."
                        />
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-32 text-center px-6">
                    <h2 className={`text-4xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-10`} style={{ fontFamily: "'Lora', serif" }}>Ready to Transform How You Learn?</h2>
                    <button
                    onClick={() => onStartLearning()}
                    className="bg-[#FF5A1A] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#ff7a45] transition-all shadow-xl hover:shadow-orange-500/30 text-lg"
                >
                    Get Started for Free
                </button>
            </section>
        </>
    );

    return (
        <div className={`w-full min-h-screen flex flex-col ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
            <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <button onClick={() => setCurrentView('home')} className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} flex items-center tracking-tight`} style={{ fontFamily: "'Lora', serif" }}>
                            Stephen
                            {getLogoSuffix() && (
                                <span className={`ml-2 text-xl font-normal ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {getLogoSuffix()}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Center: Navigation */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {navLinks.map(link => {
                            const isSelected = link.key === 'enterprise' && currentView === 'enterprise';
                            return (
                            <div 
                                key={link.name} 
                                className="relative group"
                                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.key)}
                                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
                            >
                                <button 
                                    onClick={() => {
                                        if (link.key === 'pricing') {
                                            onStartLearning('pricing');
                                        } else if (!link.hasDropdown) {
                                            if (link.key === 'edgram') onStartLearning('edgram'); // 'About' maps to 'edgram' for now based on prompt logic assumption
                                            else onStartLearning(link.key);
                                        }
                                    }} 
                                    className={`flex items-center text-sm font-medium px-4 py-2 rounded-full transition-all ${
                                        isSelected 
                                        ? 'bg-white/10 text-white font-bold backdrop-blur-sm' 
                                        : (theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black')
                                    }`}
                                >
                                    {link.name}
                                </button>

                                {link.hasDropdown && activeDropdown === link.key && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 w-max">
                                        {/* FEATURES DROPDOWN */}
                                        {link.key === 'features' && (
                                            <div className={dropdownClasses}>
                                                <div className="flex flex-col w-64">
                                                    {featuresData.map(item => (
                                                        <button key={item.key} onClick={() => handleDropdownClick(item.key)} className={`px-5 py-3 text-left hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group`}>
                                                            <div className="text-sm font-bold mb-0.5">{item.name}</div>
                                                            <div className="text-xs opacity-60">{item.desc}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* LEARN DROPDOWN (NEW) */}
                                        {link.key === 'learn' && (
                                            <div className={`${dropdownClasses} grid grid-cols-3 gap-8 p-6 w-[700px]`}>
                                                <div>
                                                    <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">Stephen for</h4>
                                                    <div className="flex flex-col space-y-3">
                                                        {learnData.for.map(item => (
                                                            <button key={item.key} onClick={() => onStartLearning()} className="text-sm font-medium text-left hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={`pl-8 border-l ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                                                    <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">Inspiration</h4>
                                                    <div className="flex flex-col space-y-3">
                                                        {learnData.inspiration.map(item => (
                                                            <button key={item.key} onClick={() => onStartLearning()} className="text-sm font-medium text-left hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={`pl-8 border-l ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                                                    <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">Ways to Use</h4>
                                                    <div className="flex flex-col space-y-3">
                                                        {learnData.waysToUse.map(item => (
                                                            <button key={item.key} onClick={() => onStartLearning()} className="text-sm font-medium text-left hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* BUSINESS DROPDOWN */}
                                        {link.key === 'business' && (
                                            <div className={`${dropdownClasses} p-6 grid grid-cols-2 gap-8 w-[500px]`}>
                                                <div>
                                                    <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">Business</h4>
                                                    <div className="flex flex-col space-y-3">
                                                        {businessData.main.map(item => (
                                                            <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="text-sm font-medium text-left hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={`pl-8 border-l ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                                                    <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">AI solutions for</h4>
                                                    <div className="flex flex-col space-y-3">
                                                        {businessData.solutions.map(item => (
                                                            <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="text-sm font-medium text-left hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PRICING DROPDOWN */}
                                        {link.key === 'pricing' && (
                                            <div className={`${dropdownClasses} w-48`}>
                                                <div className="flex flex-col">
                                                    {pricingData.map(item => (
                                                        <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="px-5 py-2.5 text-left text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                                                            {item.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* ENTERPRISE DROPDOWN */}
                                        {link.key === 'enterprise' && (
                                            <div className={`${dropdownClasses} w-56`}>
                                                <div className="flex flex-col">
                                                    {enterpriseDropdownItems.map((item) => (
                                                        <button
                                                            key={item.name}
                                                            onClick={() => handleDropdownClick(item.key)} 
                                                            className={`px-5 py-2.5 text-left text-sm font-medium transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-white/5`}
                                                        >
                                                            {item.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )})}
                    </div>

                    {/* Right: Auth & Theme & Help */}
                    <div className="flex items-center space-x-3">
                        <button onClick={toggleTheme} className={`p-2 rounded-full ${theme === 'dark' ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-500 hover:bg-neutral-200'} transition-colors`}>
                            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => onAuth('login')} className={`px-5 py-2.5 text-sm font-bold rounded-full ${theme === 'dark' ? 'text-white hover:bg-neutral-800' : 'text-black hover:bg-neutral-100'} transition-colors`}>
                            Log in
                        </button>
                        <button onClick={() => onAuth('signup')} className={`px-5 py-2.5 text-sm font-bold rounded-full bg-white text-black hover:opacity-90 transition-opacity border ${theme === 'dark' ? 'border-transparent' : 'border-gray-300'}`}>
                            Sign up for free
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsHelpOpen(!isHelpOpen)}
                                className={`p-2 rounded-full border transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-neutral-800 text-gray-300' : 'border-gray-300 hover:bg-neutral-100 text-gray-600'}`}
                            >
                                <QuestionMarkIcon className="w-5 h-5" />
                            </button>
                            
                            <AnimatePresence>
                                {isHelpOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute right-0 top-full mt-2 w-64 ${dropdownClasses} z-50`}
                                    >
                                        <div className="flex flex-col">
                                            {[
                                                { label: 'See plans and pricing', action: () => onStartLearning('pricing') },
                                                { label: 'Settings', action: () => {} }, // Placeholder
                                            ].map((item, idx) => (
                                                <button key={idx} onClick={() => { item.action(); setIsHelpOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                                                    {item.label}
                                                    <ArrowUpRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                            
                                            <div className={`my-2 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`} />
                                            
                                            {[
                                                { label: 'Help center' },
                                                { label: 'Release notes' },
                                                { label: 'Terms & policies' },
                                            ].map((item, idx) => (
                                                <button key={idx} className="w-full text-left px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                                                    {item.label}
                                                    <ArrowUpRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-0">
                {currentView === 'home' ? renderHomeView() : <EnterpriseView theme={theme} onStartLearning={onStartLearning} type={enterpriseType} />}
            </main>

            <footer className={`border-t ${theme === 'dark' ? 'border-neutral-800/50' : 'border-neutral-200/80'} py-8 mt-auto`}>
                <div className={`container mx-auto text-center text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    &copy; {new Date().getFullYear()} Stephen AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
