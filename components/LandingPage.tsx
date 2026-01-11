
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
        { name: 'About', key: 'edgram' }, // Replacing Collab with About for now to match prompt "About Features..." flow
        { name: 'Features', key: 'features', hasDropdown: true },
        { name: 'Learn', key: 'learn', hasDropdown: false }, // Placeholder link
        { name: 'Business', key: 'business', hasDropdown: true },
        { name: 'Pricing', key: 'pricing', hasDropdown: true },
        { name: 'Enterprise', key: 'enterprise', hasDropdown: true }, // Keeping existing enterprise logic
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
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
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

    const renderHomeView = () => (
        <>
            {/* Hero Section */}
            <motion.section 
                className="relative text-center py-48 md:py-64 px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-medium mb-6" 
                    style={{ fontFamily: "'Lora', serif", color: theme === 'dark' ? '#f5f5f5' : '#171717' }}
                >
                    Your gateway to<br/>world-class<br/>learning.
                </motion.h1>
                <motion.p variants={itemVariants} className={`max-w-xl mx-auto text-lg mb-10 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Personalized, scientific, real-world learning — at your pace.
                </motion.p>
                <motion.div variants={itemVariants} className="flex justify-center items-center space-x-4">
                        <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`font-semibold px-6 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'border-neutral-700 text-white hover:bg-neutral-800' : 'border-neutral-300 text-black hover:bg-neutral-100'}`}
                    >
                        See Features
                    </button>
                    <button
                        onClick={() => onStartLearning()}
                        className="bg-[#FF5A1A] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Start Learning
                    </button>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className={`py-24 px-4 ${theme === 'dark' ? 'bg-black/50' : 'bg-white'}`}>
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>Unlock Your Learning Potential</h2>
                        <p className={`${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'} mt-4 max-w-xl mx-auto`}>
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
            <section className="py-24 text-center px-4">
                    <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-6`} style={{ fontFamily: "'Lora', serif" }}>Ready to Transform How You Learn?</h2>
                    <button
                    onClick={() => onStartLearning()}
                    className="bg-[#FF5A1A] text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Get Started for Free
                </button>
            </section>
        </>
    );

    return (
        <div className={`w-full min-h-screen flex flex-col ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
            <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <button onClick={() => setCurrentView('home')} className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} flex items-center tracking-tight`} style={{ fontFamily: "'Lora', serif" }}>
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
                                    className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                                        isSelected 
                                        ? 'text-black dark:text-white font-bold' 
                                        : (theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black')
                                    }`}
                                >
                                    {link.name}
                                </button>

                                {link.hasDropdown && activeDropdown === link.key && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-max">
                                        {/* FEATURES DROPDOWN */}
                                        {link.key === 'features' && (
                                            <div className={`rounded-xl border shadow-xl overflow-hidden py-2 ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}>
                                                <div className="flex flex-col w-56">
                                                    {featuresData.map(item => (
                                                        <button key={item.key} onClick={() => handleDropdownClick(item.key)} className={`px-4 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group`}>
                                                            <div className="text-sm font-medium dark:text-white text-black">{item.name}</div>
                                                            <div className="text-xs text-gray-500">{item.desc}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* BUSINESS DROPDOWN */}
                                        {link.key === 'business' && (
                                            <div className={`rounded-xl border shadow-xl overflow-hidden p-6 grid grid-cols-2 gap-8 w-[500px] ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}>
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Business</h4>
                                                    <div className="flex flex-col space-y-3">
                                                        {businessData.main.map(item => (
                                                            <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="text-sm font-medium text-left dark:text-white text-black hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={`pl-8 border-l ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">AI solutions for</h4>
                                                    <div className="flex flex-col space-y-3">
                                                        {businessData.solutions.map(item => (
                                                            <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="text-sm font-medium text-left dark:text-white text-black hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PRICING DROPDOWN */}
                                        {link.key === 'pricing' && (
                                            <div className={`rounded-xl border shadow-xl overflow-hidden py-2 w-48 ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}>
                                                <div className="flex flex-col">
                                                    {pricingData.map(item => (
                                                        <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="px-5 py-2.5 text-left text-sm font-medium dark:text-white text-black hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                                                            {item.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* ENTERPRISE DROPDOWN (Existing) */}
                                        {link.key === 'enterprise' && (
                                            <div className={`rounded-xl border shadow-xl overflow-hidden py-2 w-56 ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-neutral-200'}`}>
                                                <div className="flex flex-col">
                                                    {enterpriseDropdownItems.map((item) => (
                                                        <button
                                                            key={item.name}
                                                            onClick={() => handleDropdownClick(item.key)} 
                                                            className={`px-5 py-2.5 text-left text-sm transition-colors duration-200 ${
                                                                theme === 'dark' 
                                                                ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                                                                : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                                            }`}
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
                        <button onClick={() => onAuth('login')} className={`px-4 py-2 text-sm font-semibold rounded-full ${theme === 'dark' ? 'text-white hover:bg-neutral-800' : 'text-black hover:bg-neutral-100'} transition-colors`}>
                            Log in
                        </button>
                        <button onClick={() => onAuth('signup')} className={`px-4 py-2 text-sm font-semibold rounded-full bg-white text-black hover:opacity-90 transition-opacity border ${theme === 'dark' ? 'border-transparent' : 'border-gray-300'}`}>
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
                                        className={`absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl border overflow-hidden py-2 z-50 ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}
                                    >
                                        <div className="flex flex-col">
                                            {[
                                                { label: 'See plans and pricing', action: () => onStartLearning('pricing') },
                                                { label: 'Settings', action: () => {} }, // Placeholder
                                            ].map((item, idx) => (
                                                <button key={idx} onClick={() => { item.action(); setIsHelpOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm font-medium dark:text-gray-200 text-gray-700 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                                                    {item.label}
                                                    <ArrowUpRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                            
                                            <div className={`my-2 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`} />
                                            
                                            {[
                                                { label: 'Help center' },
                                                { label: 'Release notes' },
                                                { label: 'Terms & policies' },
                                            ].map((item, idx) => (
                                                <button key={idx} className="w-full text-left px-5 py-2.5 text-sm font-medium dark:text-gray-200 text-gray-700 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
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

            <main className="flex-grow pt-20">
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
