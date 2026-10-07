import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Theme, AuthType } from '../App';
import { SunIcon, MoonIcon, ArrowUpRightIcon } from './icons';
import EnterpriseView from './EnterpriseView';
import { Navbar, IeltsDynastyEmblem } from './Navbar';
import Footer from './Footer';
import {
  Mic,
  PenTool,
  Headphones,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Zap,
  BarChart3,
  ShieldCheck,
  Building2,
  Volume2,
  Check,
  RotateCcw,
  Sliders,
  FileText,
  Clock,
  Layers,
  Award,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: (view?: string) => void;
  onAuth: (type: AuthType) => void;
  toggleTheme: () => void;
  theme: Theme;
  userEmail: string;
  onOrgAccess: () => void;
  onNavigateInstitutionLogin?: () => void;
  onNavigate?: (path: string) => void;
}

const RevealSection = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ 
    onStartLearning, 
    onAuth, 
    toggleTheme, 
    theme, 
    userEmail, 
    onOrgAccess,
    onNavigateInstitutionLogin,
    onNavigate,
}) => {
    const [currentView, setCurrentView] = useState<'home' | 'enterprise'>('home');
    const [enterpriseType, setEnterpriseType] = useState<'business' | 'team' | 'universities' | 'government'>('business');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [disputeApproved, setDisputeApproved] = useState(false);

    const navigateTo = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            window.history.pushState({}, '', path);
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    const handleInstitutionLogin = () => {
        if (onNavigateInstitutionLogin) {
            onNavigateInstitutionLogin();
        } else {
            window.history.pushState({}, '', '/institution/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

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
                staggerChildren: 0.12,
                delayChildren: 0.1
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
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
        <div className="relative w-full overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-rose-950/15 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute top-2/3 right-10 w-[600px] h-[500px] bg-neutral-900/40 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Phase 2: Refined Hero Section */}
            <motion.section 
                className="relative text-center min-h-[82vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-32 pb-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 1. Header Badge: Obsidian monospace status pill */}
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-mono text-xs sm:text-sm tracking-wider uppercase border shadow-inner backdrop-blur-xl bg-black/80 border-neutral-800 text-neutral-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                        <span>🟢 PRODUCTION READY // CAMBRIDGE 7–21 MULTIMODAL EVALUATION</span>
                    </div>
                </motion.div>

                {/* 2. Hero Title */}
                <motion.h1 
                    variants={itemVariants}
                    className="font-display font-black tracking-tight leading-[1.06] text-center max-w-5xl mx-auto mb-6 text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                >
                    <span className={theme === 'dark' 
                        ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400' 
                        : 'text-neutral-900'
                    }>
                        Autonomous AI Infrastructure for High-Stakes IELTS Assessment.
                    </span>
                </motion.h1>

                {/* 3. Hero Subtitle */}
                <motion.p 
                    variants={itemVariants} 
                    className={`max-w-3xl mx-auto text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-12 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}
                >
                    Eliminate human grading bottlenecks with full-duplex conversational voice examiners, paper essay vision OCR, and institutional cohort telemetry. Built for candidate mastery and enterprise scale.
                </motion.p>
                
                {/* 4. Primary CTAs */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none">
                    <button
                        onClick={() => {
                            if (userEmail) onStartLearning('reading_hub');
                            else onAuth('signup');
                        }}
                        className="w-full sm:w-auto font-bold px-8 py-4 rounded-xl text-base text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.45)] hover:shadow-[0_0_45px_rgba(244,63,94,0.65)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer border border-rose-400/40 group"
                    >
                        <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                        <span>Launch Cambridge Mock Exam</span>
                    </button>
                    <button
                        onClick={() => {
                            const el = document.getElementById('enterprise-telemetry');
                            if (el) {
                                el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                navigateTo('/business');
                            }
                        }}
                        className="w-full sm:w-auto font-semibold px-8 py-4 rounded-xl text-base border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer shadow-lg hover:border-neutral-500 group"
                    >
                        <span>Institutional Telemetry Demo</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </motion.section>

            {/* Phase 3: Product Bento Grid (Migrated from Features View) */}
            <RevealSection className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold tracking-wide uppercase mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Core Multimodal Architecture
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                        Autonomous Examination Suite
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                        Enterprise-grade machine intelligence calibrated strictly to official Cambridge, British Council, and IDP assessment rubrics.
                    </p>
                </div>

                {/* 4-Cell Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card 1 (Full Width / Featured): Mohona Conversational Speaking Examiner */}
                    <div className="lg:col-span-2 rounded-3xl bg-[#12151B]/95 border border-[#222732] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-rose-500/40 transition-all duration-300">
                        {/* Radial Accent Glow */}
                        <div className="absolute -right-24 -top-24 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                            {/* Left Description Column */}
                            <div className="lg:col-span-6 space-y-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
                                        Full-Duplex Voice Engine
                                    </span>
                                    <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[11px]">
                                        Sub-second turn-taking
                                    </span>
                                    <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[11px]">
                                        16kHz Little-Endian Int16
                                    </span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                                    Mohona: Conversational Speaking Examiner
                                </h3>

                                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                                    Practice all 3 IELTS speaking parts with an adaptive AI examiner. Mohona listens, responds naturally with human acoustic modulation, and evaluates fluency, lexical resource, and grammatical accuracy.
                                </p>

                                <div className="grid grid-cols-2 gap-3 text-xs text-neutral-300 pt-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Zero audio collision disarming</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>WebSocket streaming architecture</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Sub-420ms acoustic turnaround</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Band 9 criterion scorecard</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => onStartLearning('speaking_partner')}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                                    >
                                        <span>Launch Speaking Simulator</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Right Live Waveform & Prompt Demo */}
                            <div className="lg:col-span-6 rounded-2xl bg-[#0D0F12] border border-[#222732] p-6 shadow-inner flex flex-col items-center text-center space-y-5">
                                <div className="flex items-center justify-between w-full border-b border-[#222732] pb-3 text-xs">
                                    <span className="flex items-center gap-2 font-mono text-emerald-400 font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        16kHz PCM Little-Endian Stream
                                    </span>
                                    <span className="font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 text-[11px]">
                                        Latency: 380ms
                                    </span>
                                </div>

                                {/* Examiner Avatar with Halo Rings */}
                                <div className="relative flex items-center justify-center my-2">
                                    <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping" />
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-600 to-rose-900 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-rose-950/60 ring-4 ring-rose-500/30 relative z-10">
                                        M
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="text-white font-bold text-base">Mohona • Certified IELTS Examiner Mode</div>
                                    <div className="text-xs text-rose-400 font-medium">Part 2 Cue Card Discussion Active</div>
                                </div>

                                {/* Live Animated PCM Waveform Visualization */}
                                <div className="flex items-center justify-center gap-1.5 h-14 w-full max-w-sm px-4 py-2 bg-[#15181E] rounded-xl border border-[#222732]">
                                    {[35, 65, 45, 90, 75, 40, 85, 95, 60, 40, 80, 50, 70, 35, 88, 55, 78, 62, 92, 48, 68, 82].map((height, i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 rounded-full animate-pulse"
                                            style={{
                                                height: `${height}%`,
                                                animationDelay: `${i * 0.06}s`,
                                                animationDuration: '1.2s'
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Examiner Prompt Demo Card */}
                                <div className="p-4 rounded-xl bg-[#15181E] border border-[#222732] text-xs text-left w-full space-y-1.5 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-rose-400 flex items-center gap-1">
                                            <Mic className="w-3.5 h-3.5" />
                                            Examiner Prompt Demo:
                                        </span>
                                        <span className="text-[10px] font-mono text-neutral-400">TURN 04 // ACTIVE</span>
                                    </div>
                                    <p className="italic text-neutral-300 leading-relaxed font-serif">
                                        "Let's move on to Part 2. I'm going to give you a topic, and I'd like you to speak for one to two minutes on it. Before you begin, you have one minute to prepare notes..."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Vision OCR & Band 9 Writing Rubric */}
                    <div className="col-span-1 rounded-3xl bg-[#12151B]/95 border border-[#222732] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold uppercase mb-3">
                                Multi-Agent Vision OCR
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                Vision OCR & Band 9 Writing Rubric
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                Upload a photo of handwritten exam sheets. The engine transcribes cursive handwriting and outputs official IELTS 4-criterion diagnostic scores.
                            </p>
                        </div>

                        {/* Split-View Mockup: Handwritten Paper -> Interactive Criterion Scorecard */}
                        <div className="space-y-3">
                            {/* Top Split: Uploaded handwritten paper script snippet */}
                            <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#222732] relative overflow-hidden">
                                <div className="flex items-center justify-between text-[11px] mb-2 font-mono text-neutral-400 border-b border-[#222732] pb-1.5">
                                    <span className="flex items-center gap-1.5 text-sky-400">
                                        <FileText className="w-3.5 h-3.5" />
                                        Handwritten Paper Script OCR
                                    </span>
                                    <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                        Conf: 99.4%
                                    </span>
                                </div>
                                <div className="text-xs font-serif italic text-neutral-300 bg-[#161a22] p-2.5 rounded border border-dashed border-neutral-700 leading-relaxed">
                                    "In recent years, the exponential growth of technological automation has sparked contentious debate regarding workforce obsolescence..."
                                </div>
                            </div>

                            {/* Bottom Split: Criterion Scorecard */}
                            <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3 shadow-inner">
                                <div className="flex items-center justify-between border-b border-[#222732] pb-2.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Predicted Rubric Score</span>
                                    <span className="text-2xl font-black text-rose-400">Band 7.5</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                    <div className="p-2 rounded-lg bg-[#15181E] border border-[#222732]">
                                        <div className="text-[10px] text-neutral-400 font-semibold">TR</div>
                                        <div className="text-base font-black text-white mt-0.5">8.0</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-[#15181E] border border-[#222732]">
                                        <div className="text-[10px] text-neutral-400 font-semibold">CC</div>
                                        <div className="text-base font-black text-white mt-0.5">7.5</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-[#15181E] border border-[#222732]">
                                        <div className="text-[10px] text-neutral-400 font-semibold">LR</div>
                                        <div className="text-base font-black text-white mt-0.5">7.0</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-[#15181E] border border-[#222732]">
                                        <div className="text-[10px] text-neutral-400 font-semibold">GRA</div>
                                        <div className="text-base font-black text-white mt-0.5">7.5</div>
                                    </div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 leading-snug">
                                    <span className="font-bold">Band 9 Rewrite Tip:</span> Upgrade informal transitions ("On the other hand") to academic discourse markers ("Conversely, empirical observations indicate...").
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onStartLearning('writing_hub')}
                            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#15181E] hover:bg-[#1a1f28] border border-[#222732] hover:border-rose-500/50 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                            <span>Evaluate Handwritten Essay</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Card 3: Cambridge 7–21 Reading & Listening Engine */}
                    <div className="col-span-1 rounded-3xl bg-[#12151B]/95 border border-[#222732] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold uppercase mb-3">
                                Authentic Simulation
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                Cambridge 7–21 Reading & Listening Engine
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                Complete Cambridge computer-delivered test environment with synchronized audio playback and split-screen passage annotations.
                            </p>
                        </div>

                        {/* Active Test Card Preview */}
                        <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3 shadow-inner text-xs">
                            <div className="flex items-center justify-between text-neutral-400 border-b border-[#222732] pb-2 font-mono">
                                <span className="flex items-center gap-1.5 text-white font-semibold">
                                    <Headphones className="w-3.5 h-3.5 text-rose-400" />
                                    Section 4 • Master Audio
                                </span>
                                <span className="text-rose-400 font-bold">⏱ 28:45 / 30:00</span>
                            </div>

                            {/* Audio Stream Bar Mockup */}
                            <div className="p-2.5 rounded-lg bg-[#15181E] border border-[#222732] space-y-1.5">
                                <div className="flex justify-between text-[11px] text-neutral-400">
                                    <span>Cambridge 18 Academic Lecture Stream</span>
                                    <span className="text-emerald-400 font-mono">128kbps Synced</span>
                                </div>
                                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full" />
                                </div>
                            </div>

                            {/* Split-Screen Passage Preview */}
                            <div className="p-3 rounded-lg bg-[#15181E] border border-[#222732] space-y-2">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-bold text-white">Passage 3: Environmental Feedback Loops</span>
                                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">Q27–32 Active</span>
                                </div>
                                <p className="text-[11px] text-neutral-300 leading-relaxed">
                                    <span className="bg-amber-400/20 text-amber-200 px-1 rounded">"Polar albedo reduction triggers positive feedback..."</span> — Candidates test with official Cambridge highlight & notepad tools.
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px]">
                                <span>Cambridge 18 Academic • 40 Questions Calibrated</span>
                                <span className="font-bold font-mono">Full Test Active</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onStartLearning('reading_hub')}
                            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#15181E] hover:bg-[#1a1f28] border border-[#222732] hover:border-rose-500/50 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                            <span>Launch Cambridge Mock Engine</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Card 4: Student Dispute & Teacher Arbitration Pipeline */}
                    <div className="lg:col-span-2 rounded-3xl bg-[#12151B]/95 border border-[#222732] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl hover:border-rose-500/40 transition-all duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left Text */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold uppercase">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    Institutional Governance
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                                    Student Dispute & Teacher Arbitration Pipeline
                                </h3>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    Zero black-box AI grading. Candidates can appeal any automated criterion with full teacher arbitration, audio audit replays, and administrative override logs.
                                </p>
                                <ul className="space-y-2.5 text-xs text-neutral-300 pt-1">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Instant 1-click teacher score override controls</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Timestamped audio waveform replay audits for Speaking</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Immutable institutional audit logs for student trust</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Right Live Dispute Ticket Preview (#GSP-408) */}
                            <div className="lg:col-span-7 rounded-2xl bg-[#0D0F12] border border-[#222732] p-6 shadow-inner space-y-4 text-xs">
                                <div className="flex items-center justify-between border-b border-[#222732] pb-3">
                                    <div>
                                        <span className="font-mono font-bold text-white text-sm">Dispute Ticket #GSP-408</span>
                                        <div className="text-[11px] text-neutral-400">Candidate: Ayesha Khan • Academic Writing Task 2</div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full font-semibold font-mono text-[11px] border ${
                                        disputeApproved 
                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    }`}>
                                        {disputeApproved ? '🟢 Override Finalized' : '🟡 Teacher Review Pending'}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-[#15181E] border border-[#222732] space-y-1.5">
                                    <div className="text-neutral-400 text-[11px] font-semibold">Candidate Appeal Statement:</div>
                                    <p className="italic text-neutral-200 leading-relaxed font-serif">
                                        "My Task 2 response included three balanced paragraphs addressing both views with specific demographic data. The AI under-penalized Lexical Resource for domain-specific terminology."
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732] flex items-center justify-between">
                                        <span className="text-neutral-400">AI Initial Score:</span>
                                        <span className="text-base font-bold text-neutral-300 font-mono">Band 6.5</span>
                                    </div>
                                    <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                                        disputeApproved 
                                            ? 'bg-emerald-950/30 border-emerald-500/40' 
                                            : 'bg-rose-950/20 border-rose-500/30'
                                    }`}>
                                        <span className="text-neutral-300 font-semibold">Instructor Override:</span>
                                        <span className="text-base font-extrabold text-emerald-400 font-mono">Band 7.5</span>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732] text-[11px] text-neutral-300 flex items-center justify-between flex-wrap gap-2">
                                    <span className="text-neutral-400">
                                        Verified by Senior Examiner (ID: EX-891). Vocabulary calibrated.
                                    </span>
                                    <button
                                        onClick={() => setDisputeApproved(!disputeApproved)}
                                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                            disputeApproved 
                                                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' 
                                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/30'
                                        }`}
                                    >
                                        {disputeApproved ? 'Score Finalized (Undo)' : '✅ Confirm Band 7.5 Override'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RevealSection>

            {/* Phase 4: Enterprise Proof & Metric Strip (Migrated from Business View) */}
            <RevealSection className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Metric 1 */}
                    <div className="p-7 rounded-2xl bg-[#12151B]/90 border border-[#222732] shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-rose-500/40 transition-all">
                        <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-baseline gap-1">
                            <span>&lt; 15</span>
                            <span className="text-rose-500 text-2xl font-bold">Sec</span>
                        </div>
                        <div className="text-sm font-bold text-rose-400 mb-1.5 uppercase tracking-wide">
                            Diagnostic Grading Turnaround
                        </div>
                        <div className="text-xs text-neutral-400 leading-relaxed">
                            From candidate submission to comprehensive 4-criteria rubric and Band 9 rewrites.
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-7 rounded-2xl bg-[#12151B]/90 border border-[#222732] shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-rose-500/40 transition-all">
                        <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-baseline gap-1">
                            <span>75%</span>
                        </div>
                        <div className="text-sm font-bold text-rose-400 mb-1.5 uppercase tracking-wide">
                            Instructor Grading Overhead Saved
                        </div>
                        <div className="text-xs text-neutral-400 leading-relaxed">
                            Automating repetitive diagnostic scoring to liberate teaching faculty for 1-on-1 strategy.
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-7 rounded-2xl bg-[#12151B]/90 border border-[#222732] shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-rose-500/40 transition-all">
                        <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-baseline gap-1">
                            <span>99.4%</span>
                        </div>
                        <div className="text-sm font-bold text-rose-400 mb-1.5 uppercase tracking-wide">
                            Cambridge Scoring Rubric Consistency
                        </div>
                        <div className="text-xs text-neutral-400 leading-relaxed">
                            Calibrated against official Cambridge, British Council, and IDP standard assessment scales.
                        </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="p-7 rounded-2xl bg-[#12151B]/90 border border-[#222732] shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-rose-500/40 transition-all">
                        <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-baseline gap-1">
                            <span>1,000+</span>
                        </div>
                        <div className="text-sm font-bold text-rose-400 mb-1.5 uppercase tracking-wide">
                            Concurrent Batch Session Scalability
                        </div>
                        <div className="text-xs text-neutral-400 leading-relaxed">
                            Simultaneous high-throughput mock exam streaming nodes across distributed academies.
                        </div>
                    </div>
                </div>
            </RevealSection>

            {/* Phase 5: Multi-Campus Academy Command Operations Section */}
            <RevealSection className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div id="enterprise-telemetry" className="scroll-mt-32">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs tracking-wider uppercase mb-4 shadow-inner">
                            <Building2 className="w-3.5 h-3.5 text-rose-500" />
                            INSTITUTIONAL B2B INFRASTRUCTURE
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                            Multi-Campus Academy Command Operations
                        </h2>
                        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
                            Empower branch directors, head trainers, and educational networks with real-time cohort visibility, AI-assisted coaching dossiers, and bespoke white-label deployments.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Pillar 1: Multi-Branch Telemetry */}
                        <div className="p-8 rounded-3xl bg-[#12151B]/90 border border-[#222732] shadow-xl hover:border-rose-500/40 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-inner">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Multi-Branch Telemetry</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                                    Real-time cohort score progression and drop-off prevention alerts across all global branches.
                                </p>
                                <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Cross-campus performance analytics (London, Dubai, Dhaka, Toronto)</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Automated dropout risk flagging for candidates plateauing below target band</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Exportable institutional audit transcripts and accreditation-ready PDFs</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                                <span>Cohort Delta (6 Wk):</span>
                                <span className="font-bold">+1.2 Band Avg</span>
                            </div>
                        </div>

                        {/* Pillar 2: Teacher Co-Pilot */}
                        <div className="p-8 rounded-3xl bg-[#12151B]/90 border border-[#222732] shadow-xl hover:border-rose-500/40 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-inner">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Teacher Co-Pilot</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                                    Instant Band 9 sentence rewrites and acoustic fluency analytics for 1-on-1 consultations.
                                </p>
                                <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Pre-session diagnostic dossiers ready in seconds before student calls</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Acoustic pause distribution, hesitation metrics & speech rate (WPM)</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>1-click instructor voice annotations and targeted homework assignment</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-[11px] font-mono text-rose-400 flex items-center justify-between">
                                <span>Prep Time / Student:</span>
                                <span className="font-bold">45m → 3m</span>
                            </div>
                        </div>

                        {/* Pillar 3: White-Label Deployment */}
                        <div className="p-8 rounded-3xl bg-[#12151B]/90 border border-[#222732] shadow-xl hover:border-rose-500/40 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-inner">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">White-Label Deployment</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                                    Custom subdomain hosting for partner coaching centers with enterprise compliance.
                                </p>
                                <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Custom domain (ielts.youracademy.edu) with bespoke theme matching</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>SAML / SSO integration and FERPA & GDPR compliant student data isolation</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Dedicated multi-node API cluster with guaranteed 99.9% uptime SLA</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-[11px] font-mono text-sky-400 flex items-center justify-between">
                                <span>Uptime SLA:</span>
                                <span className="font-bold">99.95% Guaranteed</span>
                            </div>
                        </div>
                    </div>

                    {/* Institutional Access Callout Banner */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#15181E] via-[#1A1F28] to-[#15181E] border border-[#222732] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-wider mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                PARTNER NETWORK INTEGRATION
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                                Ready to deploy institutional AI for your academy?
                            </h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Connect your teaching faculty with the central command portal or request an enterprise pilot with simulated cohort benchmark tests.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
                            <button
                                onClick={handleInstitutionLogin}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0D0F12] border border-rose-500/50 hover:border-rose-400 text-white font-bold text-sm transition-all shadow-lg shadow-rose-950/20 cursor-pointer text-center"
                            >
                                Institution Command Portal
                            </button>
                            <button
                                onClick={() => navigateTo('/business/contact')}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-lg shadow-rose-600/30 cursor-pointer text-center flex items-center justify-center gap-2"
                            >
                                <span>Book Telemetry Demo</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </RevealSection>
        </div>
    );

    return (
        <div style={{ zoom: 0.9, width: '100%', height: '100%' }}>
            <div className={`w-full min-h-screen flex flex-col ${theme === 'dark' ? 'text-neutral-200 bg-[#0D0F12]' : 'text-neutral-800 bg-slate-50'}`}>
                {/* Fixed Navbar with Glassmorphism */}
                <Navbar
                    theme={theme}
                    toggleTheme={toggleTheme}
                    userEmail={userEmail}
                    onStartLearning={onStartLearning}
                    onAuth={onAuth}
                    onNavigateInstitutionLogin={onNavigateInstitutionLogin}
                    onNavigate={onNavigate ? onNavigate : (path) => {
                        if (path === '/') {
                            setCurrentView('home');
                        } else {
                            window.history.pushState({}, '', path);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }
                    }}
                    isScrolled={isScrolled}
                />

                <main className="flex-grow pt-0">
                    {currentView === 'home' ? renderHomeView() : <EnterpriseView theme={theme} onStartLearning={onStartLearning} type={enterpriseType} />}
                </main>

                {/* Rebranded Footer with IELTS Dynasty Legal Disclaimer */}
                <Footer theme={theme} />
            </div>
        </div>
    );
};

export default LandingPage;
