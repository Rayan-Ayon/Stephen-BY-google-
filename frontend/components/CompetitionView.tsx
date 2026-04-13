import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SearchIcon, AdjustIcon, DotsHorizontalIcon, 
    ChevronDownIcon, StarIcon, TrophyIcon, 
    GlobeIcon, ClockIcon, CheckCircleIcon, UsersIcon,
    ListBulletIcon, FlagIcon, FlaskIcon, XIcon, TagIcon,
    ChevronLeftIcon, ChevronRightIcon
} from './icons';

interface CompData {
    id: number;
    title: string;
    description: string;
    category: string;
    teams: string;
    prize: string;
    status: string;
    image: string;
    logo: string;
    isFeatured?: boolean;
    timeLeft?: string;
    type?: string; // e.g., "Code Competition"
}

// Extended Mock Data
const allCompetitionsData: CompData[] = [
    { id: 5, title: 'AI Mathematical Olympiad - Progress Prize 1', description: 'Solve international-level math competitions using AI models.', category: 'Featured', type: 'Code Competition', teams: '1076 Teams', prize: '$2,207,152', status: '3 months to go', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
    { id: 9, title: 'Santa 2025 - Christmas Tree Packing Challenge', description: 'How many Christmas trees can fit in a box? Help solve a classic optimization problem with a festive twist.', category: 'Featured', type: 'Optimization', teams: '2753 Teams', prize: '$50,000', status: '23 days to go', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2069&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
    { id: 6, title: 'Vesuvius Challenge - Ink Detection', description: 'Build a model to virtually unwrap and read ancient scrolls.', category: 'Research', type: 'Code Competition', teams: '585 Teams', prize: '$200,000', status: 'A month to go', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
    { id: 7, title: 'Google Tunix Hack - Train a model to show its work', description: 'Teach a LLM to reason using Tunix, Google\'s new JAX-native library for LLM post-training.', category: 'Featured', type: 'Hackathon', teams: '135 Teams', prize: '$100,000', status: '5 days to go', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
    { id: 10, title: 'Predicting Loan Payback', description: 'Playground Series - Season 5, Episode 11', category: 'Playground', type: 'Tabular', teams: '3724 Teams', prize: 'Swag', status: 'A month ago', image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
    { id: 8, title: 'CSIRO - Image2Biomass Prediction', description: 'Predict biomass using the provided satellite imagery.', category: 'Research', type: 'Code Competition', teams: '3169 Teams', prize: '$75,000', status: '21 days to go', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
    { id: 11, title: 'Recod.ai/LUC - Scientific Image Forgery Detection', description: 'Develop methods that can accurately detect and segment copy-move forgeries within biomedical research images.', category: 'Research', type: 'Code Competition', teams: '1451 Teams', prize: '$55,000', status: '8 days to go', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
    { id: 1, title: 'Titanic - Machine Learning from Disaster', description: 'Start here! Predict survival on the Titanic and get familiar with ML basics.', category: 'Getting Started', type: 'Getting Started', teams: '15390 Teams', prize: 'Knowledge', status: 'Ongoing', image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=2071&auto=format&fit=crop', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111466.png' },
];

const banners = [
    { id: 1, title: 'Nuclear Elimination', image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=2070&auto=format&fit=crop', bgColor: 'bg-teal-950', theme: 'International Day' },
    { id: 2, title: 'Freeze Weapons', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23eaec3?q=80&w=2069&auto=format&fit=crop', bgColor: 'bg-white', theme: 'Freeze' },
    { id: 3, title: 'Science is the Future', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop', bgColor: 'bg-purple-900', theme: 'Let\'s Learn' },
];

const FilterDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-20 right-6 w-[360px] md:w-[450px] dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-2xl shadow-2xl z-[60] overflow-hidden flex flex-col"
        >
            <div className="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                <div className="mb-6">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Tags</label>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Search for tags" className="w-full pl-9 pr-4 py-2.5 rounded-full border dark:border-gray-700 border-gray-300 dark:bg-[#111] bg-white text-sm dark:text-white focus:outline-none transition-colors" />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Status</label>
                    <div className="flex flex-wrap gap-2">
                        {['Active', 'Entered', 'Completed'].map(s => <button key={s} className="px-4 py-1.5 rounded-full border dark:border-gray-700 border-gray-300 text-sm dark:text-gray-300 text-gray-700 hover:border-black dark:hover:border-white transition-colors">{s}</button>)}
                    </div>
                </div>
            </div>
            <div className="p-4 border-t dark:border-gray-800 border-neutral-200 flex justify-end space-x-3 bg-white dark:bg-[#1a1a1a]">
                <button onClick={onClose} className="px-4 py-2 font-bold text-sm dark:text-white text-black">Clear</button>
                <button onClick={onClose} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm rounded-full">Done</button>
            </div>
        </motion.div>
    );
}

// Button Controlled Carousel for Pills
const NavCarousel: React.FC<{ 
    items: string[], 
    activeFilter: string, 
    setActiveFilter: (f: string) => void 
}> = ({ items, activeFilter, setActiveFilter }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [items]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group flex items-center w-full">
            {showLeftArrow && (
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 z-10 p-1.5 bg-white dark:bg-[#1a1a1a] rounded-full shadow-md border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-all -ml-2"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                </button>
            )}
            
            <div 
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex items-center space-x-2 overflow-hidden scroll-smooth w-full px-1 py-1"
            >
                {items.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                            activeFilter === filter 
                            ? 'dark:bg-white bg-black dark:text-black text-white dark:border-white border-black' 
                            : 'dark:bg-[#1a1a1a] bg-neutral-50 dark:text-gray-400 text-neutral-600 dark:border-gray-800 border-neutral-200 hover:dark:border-gray-600'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {showRightArrow && (
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 z-10 p-1.5 bg-white dark:bg-[#1a1a1a] rounded-full shadow-md border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-all -mr-2"
                >
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// Expanded Nav with All Competitions on Right of Featured
const ExpandedNav: React.FC<{ onSelect: (filter: string) => void }> = ({ onSelect }) => {
    const items = [
        { label: 'Featured', desc: 'Premier challenges with prizes', icon: <StarIcon className="w-6 h-6"/> },
        { label: 'All Competitions', desc: 'Everything, past & present', icon: <ListBulletIcon className="w-6 h-6"/> }, // Right of Featured
        { label: 'Getting Started', desc: 'Approachable ML fundamentals', icon: <FlagIcon className="w-6 h-6"/> },
        { label: 'Research', desc: 'Scientific and scholarly challenges', icon: <FlaskIcon className="w-6 h-6"/> },
        { label: 'Community', desc: 'Created by fellow Kagglers', icon: <UsersIcon className="w-6 h-6"/> },
    ];

    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full group">
            {showLeftArrow && (
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-[#1a1a1a] rounded-full shadow-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all -ml-2"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
            )}
            
            <div 
                ref={scrollRef}
                onScroll={checkScroll}
                className="w-full overflow-hidden flex space-x-4 pb-4 pt-1 scroll-smooth"
            >
                {items.map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => onSelect(item.label)}
                        className="flex-shrink-0 flex flex-col justify-between w-64 h-32 p-5 rounded-2xl border dark:border-gray-800 border-neutral-200 dark:bg-[#1a1a1a] bg-white hover:border-black dark:hover:border-white transition-all text-left group shadow-sm hover:shadow-md"
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="font-bold text-base dark:text-white text-black leading-tight pr-2">{item.label}</span>
                            <div className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                                {item.icon}
                            </div>
                        </div>
                        <span className="text-xs dark:text-gray-400 text-gray-500 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors line-clamp-2">
                            {item.desc}
                        </span>
                    </button>
                ))}
            </div>

            {showRightArrow && (
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-[#1a1a1a] rounded-full shadow-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all -mr-2"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

const BannerCarousel = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-6 pt-10 pb-4">
            <div className="relative h-[240px] md:h-[320px] w-full rounded-[32px] overflow-hidden shadow-xl border dark:border-white/5 border-neutral-200">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={banners[index].id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`absolute inset-0 ${banners[index].bgColor}`}
                    >
                        <img src={banners[index].image} alt={banners[index].title} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex flex-col justify-center px-12 md:px-20">
                            <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/80 font-bold text-xs uppercase tracking-widest mb-3">{banners[index].theme}</motion.span>
                            <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-white text-3xl md:text-5xl font-bold max-w-lg leading-tight mb-8" style={{ fontFamily: "'Lora', serif" }}>{banners[index].title}</motion.h2>
                            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                                <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors text-sm">Learn More</button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />)}
                </div>
            </div>
        </div>
    );
};

const AllCompetitionsList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-6 pb-20">
            {/* Header Area with Chip and Close Button */}
            <div className="flex flex-col space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={onClose}
                        className="flex items-center space-x-2 px-4 py-1.5 rounded-full dark:bg-[#333] bg-neutral-200 dark:text-white text-black text-sm font-bold hover:opacity-80 transition-opacity"
                    >
                        <span>All competitions</span>
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold dark:text-white text-black">Results</h2>
                    <div className="flex items-center space-x-3">
                        <button className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white flex items-center">
                            Recently Launched <ChevronDownIcon className="w-3 h-3 ml-1" />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                            <ListBulletIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="space-y-4">
                {allCompetitionsData.map((comp, idx) => (
                    <div key={`${comp.id}-${idx}`} className="flex items-start p-4 dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 mr-4 border dark:border-gray-700 border-gray-200">
                            <img src={comp.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-base dark:text-white text-black truncate group-hover:text-blue-500 transition-colors">{comp.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{comp.description}</p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="font-bold text-sm dark:text-white text-black">{comp.prize}</p>
                                    <button className="text-gray-400 hover:text-black dark:hover:text-white mt-1 ml-auto block">
                                        <DotsHorizontalIcon className="w-5 h-5 ml-auto" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center mt-3 text-[11px] text-gray-500 font-medium space-x-3">
                                {comp.category && (
                                    <span className={`px-2 py-0.5 rounded ${comp.category.includes('Featured') ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                                        {comp.category}
                                    </span>
                                )}
                                {comp.type && (
                                    <span className="dark:text-gray-400 text-gray-600">• {comp.type}</span>
                                )}
                                <span className="dark:text-gray-400 text-gray-600">• {comp.teams}</span>
                                <span className={comp.status.includes('go') ? 'text-orange-500' : ''}>• {comp.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CompetitionCard: React.FC<{ data: CompData }> = ({ data }) => (
    <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition-all group cursor-pointer flex flex-col h-full shadow-sm hover:shadow-md">
        <div className="h-32 overflow-hidden relative border-b dark:border-gray-800 border-neutral-100">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-white p-1.5 shadow-sm border border-gray-100">
                <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-[15px] dark:text-white text-black mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors leading-snug">{data.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow leading-relaxed">{data.description}</p>
            
            <div className="flex items-center justify-between text-[11px] font-medium pt-3 mt-auto border-t dark:border-gray-800 border-gray-100">
                <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-bold dark:text-white text-black">{data.prize}</span>
                    <span className="mx-1.5 text-gray-300 dark:text-gray-600">|</span>
                    <span>{data.teams}</span>
                </div>
                <span className={`${data.status.includes('go') ? 'text-orange-500' : 'text-gray-400'}`}>
                    {data.status}
                </span>
            </div>
        </div>
    </div>
);

const CompetitionView: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('Featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showCompactNav, setShowCompactNav] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const pillFilters = [
        'Featured', 'All competitions', 'Getting Started', 'Research', 'Community', 'Playground', 'Simulations', 'Hackathons'
    ];

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const threshold = 400; 
            setShowCompactNav(scrollContainerRef.current.scrollTop > threshold);
        }
    };

    // Close handler for the "All Competitions" page view
    const closeAllCompetitions = () => {
        setActiveFilter('Featured');
    };

    // When "All Competitions" is active, we are in a different "page mode"
    const isAllCompetitionsView = activeFilter === 'All competitions';

    return (
        <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 flex flex-col h-full overflow-y-auto dark:bg-black bg-white custom-scrollbar relative"
        >
            
            {/* Sticky Header with Search */}
            <div className="sticky top-0 z-40 dark:bg-black/95 bg-white/95 backdrop-blur-md border-b dark:border-gray-800 border-neutral-200 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex gap-4">
                        <div className="relative group flex-grow">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-500">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search competitions" 
                                className="w-full h-[48px] pl-14 pr-32 dark:bg-[#1a1a1a] bg-neutral-100 dark:border-transparent border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white transition-all"
                            />
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2 px-4 py-1.5 border rounded-full text-xs font-bold transition-colors ${isFilterOpen ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'dark:bg-black bg-white border-neutral-200 dark:border-gray-800 dark:text-gray-300 text-neutral-700 hover:dark:bg-gray-900'}`}
                            >
                                <AdjustIcon className="w-4 h-4" />
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Compact Nav (Pills) - Shown when scrolled down AND NOT in All Competitions view (as that view has its own header) */}
                    <AnimatePresence>
                        {showCompactNav && !isAllCompetitionsView && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <NavCarousel 
                                    items={pillFilters} 
                                    activeFilter={activeFilter} 
                                    setActiveFilter={setActiveFilter} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Filter Dropdown */}
                <AnimatePresence>
                    {isFilterOpen && <FilterDropdown onClose={() => setIsFilterOpen(false)} />}
                </AnimatePresence>
            </div>

            {/* Scrollable Content */}
            <div className="max-w-7xl mx-auto w-full">
                
                {/* Condition: If "All Competitions" is active, show the List View "Page", else show Home View */}
                {isAllCompetitionsView ? (
                    <div className="pt-6">
                        <AllCompetitionsList onClose={closeAllCompetitions} />
                    </div>
                ) : (
                    <div className="px-6 pb-20">
                        {/* Banner */}
                        <BannerCarousel />

                        {/* Expanded Nav (Big Buttons) */}
                        <div className="mb-12 mt-4">
                            <ExpandedNav onSelect={setActiveFilter} />
                        </div>

                        <div className="space-y-16">
                            {/* Getting Started */}
                            <section>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-3">
                                            <FlagIcon className="w-6 h-6 dark:text-white text-black" />
                                            <h2 className="text-xl font-bold dark:text-white text-black">Getting Started</h2>
                                        </div>
                                        <button className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">See all</button>
                                    </div>
                                    <p className="text-sm dark:text-gray-400 text-neutral-500">Competitions with approachable ML fundamentals.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {allCompetitionsData.filter(c => c.category === 'Getting Started').map(comp => <CompetitionCard key={comp.id} data={comp} />)}
                                </div>
                            </section>

                            {/* Featured */}
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-3">
                                        <StarIcon className="w-6 h-6 dark:text-white text-black" />
                                        <h2 className="text-xl font-bold dark:text-white text-black">Featured Competitions</h2>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center space-x-2 text-sm font-bold dark:text-gray-400 text-neutral-600 hover:text-white">
                                            <span>Hotness</span>
                                            <ChevronDownIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {allCompetitionsData.filter(c => c.category === 'Featured').map(comp => <CompetitionCard key={comp.id} data={comp} />)}
                                </div>
                            </section>

                            {/* Spotlight */}
                            <section>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-3">
                                            <UsersIcon className="w-6 h-6 dark:text-white text-black" />
                                            <h2 className="text-xl font-bold dark:text-white text-black">Community Spotlight</h2>
                                        </div>
                                        <button className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">See all</button>
                                    </div>
                                    <p className="text-sm dark:text-gray-400 text-neutral-500">Selected research and community competitions to explore.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {allCompetitionsData.slice(0, 3).map(comp => <CompetitionCard key={`spot-${comp.id}`} data={{...comp, prize: '$9,000', status: '13 hours to go'}} />)}
                                </div>
                            </section>

                            {/* Recently Ended */}
                            <section>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-3">
                                            <ClockIcon className="w-6 h-6 dark:text-white text-black" />
                                            <h2 className="text-xl font-bold dark:text-white text-black">Recently Ended</h2>
                                        </div>
                                        <button className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">See all</button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 dark:bg-[#1a1a1a] bg-neutral-50 rounded-xl hover:dark:bg-[#222] transition-colors cursor-pointer group border dark:border-gray-800 border-neutral-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden border dark:border-white/5">
                                                    <img src={`https://picsum.photos/seed/${i + 70}/100/100`} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold dark:text-white text-black text-sm group-hover:text-blue-500 transition-colors">NFL Big Data Bowl 202{i}</h4>
                                                    <p className="text-xs text-gray-500">{14 + i} days ago • {50000 * i}$ • {278 * i} Teams</p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                                <DotsHorizontalIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Bottom CTA */}
                        <div className="pt-24 pb-12 flex flex-col items-center text-center">
                            <h2 className="text-4xl font-bold dark:text-white text-black mb-10 tracking-tight" style={{ fontFamily: "'Lora', serif" }}>
                                Didn't find what you were looking for?
                            </h2>
                            <button className="px-10 py-4 dark:bg-white bg-black dark:text-black text-white font-bold rounded-full hover:opacity-90 transition-all text-sm shadow-2xl">
                                Explore all competitions
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CompetitionView;