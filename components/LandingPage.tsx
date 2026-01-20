
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Theme, AuthType } from '../App';
import { SunIcon, MoonIcon, BrainIcon, UploadIcon, FlashcardIcon, TrophyIcon, EdgramIcon, DebatePodiumIcon, QuestionMarkIcon, ArrowUpRightIcon } from './icons';
import EnterpriseView from './EnterpriseView';

interface LandingPageProps {
  onStartLearning: (view?: string) => void;
  onAuth: (type: AuthType) => void;
  toggleTheme: () => void;
  theme: Theme;
}

const universities = [
    { name: 'Yale', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/1200px-Yale_University_Shield_1.svg.png', url: 'https://www.yale.edu' },
    { name: 'Tsinghua', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Tsinghua_University_Logo.svg/1200px-Tsinghua_University_Logo.svg.png', url: 'https://www.tsinghua.edu.cn/en/' },
    { name: 'Stanford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png', url: 'https://www.stanford.edu' },
    { name: 'Peking', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Peking_University_seal.svg/1200px-Peking_University_seal.svg.png', url: 'https://english.pku.edu.cn/' },
    { name: 'MIT', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png', url: 'https://www.mit.edu' },
    { name: 'Michigan', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Michigan_Wolverines_logo.svg/1200px-Michigan_Wolverines_logo.svg.png', url: 'https://umich.edu' },
    { name: 'Cambridge', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/University_of_Cambridge_logo.svg/1200px-University_of_Cambridge_logo.svg.png', url: 'https://www.cam.ac.uk' },
    { name: 'Harvard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_University_shield.svg/1200px-Harvard_University_shield.svg.png', url: 'https://www.harvard.edu' },
    { name: 'Oxford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/University_of_Oxford_Logo.svg/1200px-University_of_Oxford_Logo.svg.png', url: 'https://www.ox.ac.uk' },
    { name: 'Berkeley', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/1200px-Seal_of_University_of_California%2C_Berkeley.svg.png', url: 'https://www.berkeley.edu' },
    { name: 'Princeton', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Princeton_seal.svg/1200px-Princeton_seal.svg.png', url: 'https://www.princeton.edu' },
    { name: 'Columbia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Columbia_University_shield.svg/1200px-Columbia_University_shield.svg.png', url: 'https://www.columbia.edu' },
];

const FeatureCard = ({ icon, title, description, theme }: { icon: React.ReactElement<any>, title: string, description: string, theme: Theme }) => (
    <div 
        className={`shrink-0 w-[350px] p-8 text-center border-r transition-all duration-300 group ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200'}`}
    >
        <div className={`inline-flex items-center justify-center w-14 h-14 mb-6 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100 shadow-sm'}`}>
            {React.cloneElement(icon, { className: `w-7 h-7 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}` })}
        </div>
        <div className="relative overflow-hidden">
            <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {title}
            </h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {description}
            </p>
        </div>
    </div>
);

const RevealSection = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const Marquee = ({ children, direction = 'left', speed = 20 }: { children?: React.ReactNode, direction?: 'left' | 'right', speed?: number }) => {
    return (
        <div className="relative flex overflow-hidden w-full mask-gradient">
            <motion.div
                className="flex flex-nowrap min-w-full"
                animate={{ x: direction === 'left' ? "-50%" : "0%" }}
                initial={{ x: direction === 'left' ? "0%" : "-50%" }}
                transition={{ repeat: Infinity, ease: "linear", duration: speed }}
            >
                {children}
                {children}
            </motion.div>
            <style>{`
                .mask-gradient {
                    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                }
            `}</style>
        </div>
    );
};

const DustText = ({ text, theme }: { text: string, theme: Theme }) => {
    const letters = Array.from(text);
    
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            filter: "blur(10px)",
            scale: 1.5,
            x: (Math.random() - 0.5) * 50,
            y: (Math.random() - 0.5) * 50,
        },
    };

    return (
        <motion.div
            style={{ display: "inline-block", overflow: "hidden" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {letters.map((letter, index) => (
                <motion.span 
                    key={index} 
                    variants={child} 
                    style={{ display: "inline-block" }}
                    className={`${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning, onAuth, toggleTheme, theme }) => {
    const [currentView, setCurrentView] = useState<'home' | 'enterprise'>('home');
    const [enterpriseType, setEnterpriseType] = useState<'business' | 'team' | 'universities' | 'government'>('business');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation Structure
    const navLinks = [
        { name: 'About', key: 'edgram' },
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

    const dropdownClasses = `rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl overflow-hidden py-3 ${theme === 'dark' ? 'bg-black/60 border-white/10 text-white' : 'bg-white/70 border-gray-200 text-black'}`;
    const dropdownItemClasses = "px-5 py-3 text-left hover:bg-neutral-100 dark:hover:bg-white/10 transition-all duration-200 group-hover/list:opacity-40 hover:!opacity-100";

    const renderHomeView = () => (
        <>
            <style>{`
                @keyframes text-shine-unified {
                    0% { background-position: -150vw 0; }
                    100% { background-position: 50vw 0; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes stroke-anim {
                    0% { stroke-dashoffset: 100%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { stroke-dashoffset: 0%; opacity: 1; }
                }
                .stroke-text {
                    fill: transparent;
                    stroke: currentColor;
                    stroke-width: 1px;
                    stroke-dasharray: 100%;
                    stroke-dashoffset: 100%;
                    animation: stroke-anim 3s ease-out forwards;
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
                        className={`font-semibold px-8 py-3.5 rounded-full border transition-all text-base ${theme === 'dark' ? 'border-neutral-700 bg-black text-white hover:bg-neutral-800' : 'border-neutral-300 bg-white text-black hover:bg-neutral-100'}`}
                    >
                        See Features
                    </button>
                    <button
                        onClick={() => onStartLearning()}
                        className={`group relative font-semibold px-8 py-3.5 rounded-full text-base overflow-hidden border ${theme === 'dark' ? 'text-white border-white/20' : 'text-black border-black/20'}`}
                    >
                        <div className={`absolute inset-0 w-full h-full bg-gradient-to-r ${theme === 'dark' ? 'from-transparent via-white/20 to-transparent' : 'from-transparent via-black/10 to-transparent'} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`} />
                        <span className="relative z-10">Start Learning</span>
                        <div className={`absolute inset-0 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark' ? 'shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'shadow-[0_0_15px_rgba(0,0,0,0.1)]'}`} />
                    </button>
                </motion.div>
            </motion.section>

            {/* University Logos Marquee */}
            <div className="py-24 mt-20 relative z-10">
                <div className="text-center mb-12 opacity-60 text-sm font-semibold tracking-widest uppercase dark:text-gray-400 text-gray-600">Trusted by top students all over the world</div>
                <Marquee direction="right" speed={25}>
                    <div className="flex items-center gap-12 mx-12">
                        {universities.map((uni, idx) => (
                            <a 
                                key={idx} 
                                href={uni.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:scale-105 transition-transform duration-300 w-24 h-24"
                            >
                                <img 
                                    src={uni.logo} 
                                    alt={uni.name} 
                                    className="w-full h-full object-contain filter"
                                    loading="eager"
                                />
                            </a>
                        ))}
                    </div>
                </Marquee>
            </div>

            {/* Features Section */}
            <RevealSection className={`py-32 ${theme === 'dark' ? 'bg-black/50' : 'bg-white'}`}>
                <div className="container mx-auto">
                    <div className="text-center mb-20 px-6">
                        <h2 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>Unlock Your Learning Potential</h2>
                        <p className={`${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'} mt-6 text-xl max-w-2xl mx-auto font-light`}>
                            From lectures to articles, Stephen provides a suite of powerful tools to help you master any subject.
                        </p>
                    </div>
                    
                    <Marquee direction="left" speed={10}>
                        <div className="flex items-stretch">
                            <FeatureCard 
                                theme={theme}
                                icon={<UploadIcon />}
                                title="Flexible Content"
                                description="Upload files, paste links from YouTube or articles, or record lectures directly."
                            />
                            <FeatureCard 
                                theme={theme}
                                icon={<BrainIcon />}
                                title="AI-Powered Tutor"
                                description="Engage in dynamic conversations with an AI that understands your material."
                            />
                            <FeatureCard 
                                theme={theme}
                                icon={<FlashcardIcon />}
                                title="Smart Study Tools"
                                description="Automatically generate flashcards, quizzes, podcasts, and summaries."
                            />
                            <FeatureCard 
                                theme={theme}
                                icon={<TrophyIcon />}
                                title="Competitions"
                                description="Test your skills and knowledge against peers in exciting competitions."
                            />
                            <FeatureCard 
                                theme={theme}
                                icon={<EdgramIcon />}
                                title="Edgram Social"
                                description="Share your learning journey, discover what others are studying, and connect."
                            />
                            <FeatureCard 
                                theme={theme}
                                icon={<DebatePodiumIcon />}
                                title="Debate Arena"
                                description="Sharpen your critical thinking by debating complex topics with AI."
                            />
                        </div>
                    </Marquee>
                </div>
            </RevealSection>
            
            {/* CTA Section */}
            <RevealSection className="py-40 text-center px-6 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-20 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-black to-black' : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-200 via-white to-white'}`} />
                <div className="relative z-10 flex flex-col items-center">
                    <svg viewBox="0 0 400 120" className="h-24 md:h-32 w-auto mb-6">
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className={`text-6xl md:text-8xl font-bold stroke-text ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Stephen
                        </text>
                    </svg>
                    
                    <div className={`text-2xl md:text-3xl font-light mb-12`}>
                        <DustText text="Ready to Transform your Learning?" theme={theme} />
                    </div>
                    
                    <button
                        onClick={() => onStartLearning()}
                        className={`group relative px-10 py-4 rounded-full flex items-center space-x-2 transition-all duration-300 border ${
                            theme === 'dark' 
                            ? 'bg-black text-white border-white/20 hover:border-white/40' 
                            : 'bg-white text-black border-black/10 hover:border-black/30'
                        }`}
                    >
                        <span className="text-lg font-medium relative z-10">Sign up and get started</span>
                        <ArrowUpRightIcon className="w-5 h-5 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                        
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 w-[50px] h-full bg-gradient-to-r from-transparent via-gray-400/40 to-transparent -skew-x-12 -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
                        </div>
                    </button>
                </div>
            </RevealSection>
        </>
    );

    return (
        <div style={{ zoom: 0.9, width: '100%', height: '100%' }}>
            <div className={`w-full min-h-screen flex flex-col ${theme === 'dark' ? 'text-neutral-200 bg-[#111]' : 'text-neutral-800 bg-white'}`}>
                {/* Fixed Navbar with Glassmorphism */}
                <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${isScrolled ? 'bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/5' : 'bg-transparent'}`}>
                    <div className="container mx-auto flex items-center justify-between">
                        {/* Left: Logo */}
                        <div className="flex items-center">
                            <button onClick={() => setCurrentView('home')} className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} flex items-center tracking-tight`} style={{ fontFamily: "'Lora', serif" }}>
                                Stephen
                                {getLogoSuffix() && (
                                    <span className={`ml-2 text-xl font-normal ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-sans`}>
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
                                                if (link.key === 'edgram') onStartLearning('edgram');
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
                                                    <div className="flex flex-col w-64 group/list">
                                                        {featuresData.map(item => (
                                                            <button key={item.key} onClick={() => handleDropdownClick(item.key)} className={dropdownItemClasses}>
                                                                <div className="text-sm font-bold mb-0.5">{item.name}</div>
                                                                <div className="text-xs opacity-60">{item.desc}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* LEARN DROPDOWN */}
                                            {link.key === 'learn' && (
                                                <div className={`${dropdownClasses} grid grid-cols-3 gap-8 p-6 w-[700px]`}>
                                                    <div>
                                                        <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">Stephen for</h4>
                                                        <div className="flex flex-col space-y-3 group/list">
                                                            {learnData.for.map(item => (
                                                                <button key={item.key} onClick={() => onStartLearning()} className="text-sm font-medium text-left transition-opacity duration-200 group-hover/list:opacity-40 hover:!opacity-100">
                                                                    {item.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={`pl-8 border-l ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                                                        <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">Inspiration</h4>
                                                        <div className="flex flex-col space-y-3 group/list">
                                                            {learnData.inspiration.map(item => (
                                                                <button key={item.key} onClick={() => onStartLearning()} className="text-sm font-medium text-left transition-opacity duration-200 group-hover/list:opacity-40 hover:!opacity-100">
                                                                    {item.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={`pl-8 border-l ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                                                        <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">Ways to Use</h4>
                                                        <div className="flex flex-col space-y-3 group/list">
                                                            {learnData.waysToUse.map(item => (
                                                                <button key={item.key} onClick={() => onStartLearning()} className="text-sm font-medium text-left transition-opacity duration-200 group-hover/list:opacity-40 hover:!opacity-100">
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
                                                        <div className="flex flex-col space-y-3 group/list">
                                                            {businessData.main.map(item => (
                                                                <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="text-sm font-medium text-left transition-opacity duration-200 group-hover/list:opacity-40 hover:!opacity-100">
                                                                    {item.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={`pl-8 border-l ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                                                        <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-4">AI solutions for</h4>
                                                        <div className="flex flex-col space-y-3 group/list">
                                                            {businessData.solutions.map(item => (
                                                                <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="text-sm font-medium text-left transition-opacity duration-200 group-hover/list:opacity-40 hover:!opacity-100">
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
                                                    <div className="flex flex-col group/list">
                                                        {pricingData.map(item => (
                                                            <button key={item.key} onClick={() => handleDropdownClick(item.key)} className="px-5 py-2.5 text-left text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/10 transition-all duration-200 group-hover/list:opacity-40 hover:!opacity-100">
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* ENTERPRISE DROPDOWN */}
                                            {link.key === 'enterprise' && (
                                                <div className={`${dropdownClasses} w-56`}>
                                                    <div className="flex flex-col group/list">
                                                        {enterpriseDropdownItems.map((item) => (
                                                            <button
                                                                key={item.name}
                                                                onClick={() => handleDropdownClick(item.key)} 
                                                                className={`px-5 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-white/10 group-hover/list:opacity-40 hover:!opacity-100`}
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
                                                    { label: 'Settings', action: () => {} },
                                                ].map((item, idx) => (
                                                    <button key={idx} onClick={() => { item.action(); setIsHelpOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between group">
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
                                                    <button key={idx} className="w-full text-left px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between group">
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

                {/* Updated Footer */}
                <footer className={`py-16 ${theme === 'dark' ? 'bg-[#0d0d0d] border-t border-white/5' : 'bg-gray-50 border-t border-gray-200'}`}>
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                            <div className="mb-8 md:mb-0">
                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center mr-3">
                                        <div className="w-4 h-4 bg-white dark:bg-black rounded-sm" />
                                    </div>
                                    <span className="text-xl font-bold font-serif">Stephen</span>
                                </div>
                                <p className="text-sm text-gray-500">© Copyright 2026 Stephen Inc.</p>
                                <div className="mt-6">
                                    <button className="flex items-center px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                        <span className="mr-2">🏛️</span> AI in Education Partner
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-16 text-sm">
                                <div className="space-y-4">
                                    <a href="#" className="block hover:text-blue-500 transition-colors">Discord Community</a>
                                    <a href="#" className="block hover:text-blue-500 transition-colors">Blogs</a>
                                    <a href="#" className="block hover:text-blue-500 transition-colors">Invite & Earn</a>
                                    <a href="#" className="block hover:text-blue-500 transition-colors">Careers</a>
                                </div>
                                <div className="space-y-4">
                                    <a href="#" className="block hover:text-blue-500 transition-colors">Terms & Conditions</a>
                                    <a href="#" className="block hover:text-blue-500 transition-colors">Privacy Policy</a>
                                    <a href="#" className="block hover:text-blue-500 transition-colors">Contact Us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
