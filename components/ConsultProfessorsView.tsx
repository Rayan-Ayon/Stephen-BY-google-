

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SearchIcon, CheckCircleIcon, StarIcon, LocationTrackerIcon, 
    ChevronDownIcon, TrophyIcon, GlobeIcon
} from './icons';

// Types
type TabType = 'Individual' | 'Job';

interface ProfessorCardProps {
    type: TabType;
    data: any;
}

// Mock Data
const professors = [
    {
        id: 1,
        name: "Mark Hamburg",
        department: "Department of Computer Science",
        university: "University of Tokyo",
        rate: "$15/hr",
        success: "98% Job Success",
        description: "I have decades of experience in my college and meet with uncountable enthusiast of machine learning.",
        image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=2070&auto=format&fit=crop",
        badge: "Top Rated"
    },
    {
        id: 2,
        name: "Sarah Chen",
        department: "Department of Physics",
        university: "MIT",
        rate: "$45/hr",
        success: "100% Job Success",
        description: "Specializing in quantum mechanics and astrophysics research assistance. Published in Nature.",
        image: "https://images.unsplash.com/photo-1573497019418-b400bb3c338c?q=80&w=2069&auto=format&fit=crop",
        badge: "Top Rated Plus"
    },
    {
        id: 3,
        name: "Dr. James Wilson",
        department: "Department of History",
        university: "Oxford University",
        rate: "$30/hr",
        success: "92% Job Success",
        description: "Expert in medieval European history. I help students structure their thesis and research papers.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop",
        badge: null
    },
    {
        id: 4,
        name: "Emily R. Thorne",
        department: "Department of Neuroscience",
        university: "Stanford University",
        rate: "$60/hr",
        success: "95% Job Success",
        description: "PhD candidate offering guidance on experimental design and data analysis for neuroscience projects.",
        image: "https://images.unsplash.com/photo-1573166368361-3f52316a3bfb?q=80&w=2069&auto=format&fit=crop",
        badge: "Rising Talent"
    },
    {
        id: 5,
        name: "Hiroshi Tanaka",
        department: "Department of Robotics",
        university: "Kyoto University",
        rate: "$25/hr",
        success: "88% Job Success",
        description: "Robotics engineer with a focus on automation. I can help with control systems and mechatronics.",
        image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=2070&auto=format&fit=crop",
        badge: null
    },
    {
        id: 6,
        name: "Elena Rodriguez",
        department: "Department of Literature",
        university: "University of Barcelona",
        rate: "$20/hr",
        success: "99% Job Success",
        description: "Passionate about comparative literature. I provide editing and critique for academic essays.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
        badge: "Top Rated"
    },
    {
        id: 7,
        name: "Ahmed Hassan",
        department: "Department of Mathematics",
        university: "Cairo University",
        rate: "$18/hr",
        success: "90% Job Success",
        description: "Solving complex calculus and linear algebra problems is my forte. Let's tackle your math hurdles.",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=2000&auto=format&fit=crop",
        badge: null
    },
    {
        id: 8,
        name: "Linda Kim",
        department: "Department of Chemistry",
        university: "Seoul National University",
        rate: "$35/hr",
        success: "94% Job Success",
        description: "Analytical chemistry expert. I can assist with lab reports, spectroscopy analysis, and more.",
        image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop",
        badge: "Rising Talent"
    },
    {
        id: 9,
        name: "Robert Fox",
        department: "Department of Economics",
        university: "LSE",
        rate: "$50/hr",
        success: "97% Job Success",
        description: "Macroeconomics and econometrics tutor. Helping you understand global markets and models.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2000&auto=format&fit=crop",
        badge: "Top Rated Plus"
    }
];

const jobs = [
    {
        id: 1,
        name: "Research Assistant for AI Model",
        department: "CS Research Lab",
        university: "University of Tokyo",
        rate: "1 project / 7 days",
        success: "Budget: $500",
        description: "Looking for a student to help clean a large dataset for a transformer model. Python skills required.",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
        badge: "Urgent"
    },
    {
        id: 2,
        name: "Thesis Proofreading",
        department: "Department of English",
        university: "Cambridge",
        rate: "1 project / 3 days",
        success: "Budget: $200",
        description: "Need a native speaker to proofread my 50-page master's thesis on Victorian literature.",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop",
        badge: "Featured"
    },
    {
        id: 3,
        name: "Statistical Analysis Help",
        department: "Department of Psychology",
        university: "UCLA",
        rate: "1 project / 2 days",
        success: "Budget: $150",
        description: "Need help running SPSS analysis for my psychology experiment results.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        badge: null
    },
    {
        id: 4,
        name: "Chemical Simulation Setup",
        department: "Chemical Engineering",
        university: "CalTech",
        rate: "1 project / 14 days",
        success: "Budget: $800",
        description: "Looking for someone experienced with ANSYS Fluent to set up a flow simulation.",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
        badge: null
    },
    {
        id: 5,
        name: "Historical Archives Review",
        department: "History Dept",
        university: "Yale",
        rate: "1 project / 5 days",
        success: "Budget: $300",
        description: "Need assistance summarizing scanned archival documents from the 1920s.",
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=2074&auto=format&fit=crop",
        badge: null
    },
    {
        id: 6,
        name: "App Development Mentor",
        department: "Computer Science",
        university: "NUS",
        rate: "1 project / 30 days",
        success: "Budget: $1000",
        description: "Seeking a mentor to guide a group of students building a React Native mobile app.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
        badge: "High Budget"
    },
    {
        id: 7,
        name: "Bioinformatics Scripting",
        department: "Biology",
        university: "Johns Hopkins",
        rate: "1 project / 4 days",
        success: "Budget: $400",
        description: "Write a Python script to parse FASTA files and extract specific gene sequences.",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop",
        badge: null
    },
    {
        id: 8,
        name: "CAD Model Design",
        department: "Mechanical Eng",
        university: "TU Munich",
        rate: "1 project / 7 days",
        success: "Budget: $250",
        description: "Design a 3D printable enclosure for a Raspberry Pi project using Fusion 360.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
        badge: null
    },
    {
        id: 9,
        name: "Economic Forecast Model",
        department: "Economics",
        university: "Chicago Booth",
        rate: "1 project / 10 days",
        success: "Budget: $600",
        description: "Help refine an ARIMA model for forecasting quarterly GDP growth.",
        image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop",
        badge: null
    },
];

// Card Component
const Card: React.FC<ProfessorCardProps> = ({ type, data }) => {
    return (
        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
                <img src={data.image} alt={data.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {data.badge && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-xs font-semibold text-white border border-white/20">
                        {data.badge}
                    </div>
                )}
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black transition-colors cursor-pointer text-gray-500 hover:text-red-500">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold dark:text-white text-black text-lg line-clamp-1">{data.name}</h3>
                        <p className="text-sm dark:text-gray-400 text-neutral-500 line-clamp-1">{data.department}</p>
                        <p className="text-xs dark:text-gray-500 text-neutral-400 mt-0.5">{data.university}</p>
                    </div>
                     <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border dark:border-gray-700 border-neutral-200">
                        <img src={data.image} className="w-full h-full object-cover"/>
                     </div>
                </div>

                <div className="mt-3 mb-4 space-y-1">
                    <div className="flex items-center text-sm font-semibold dark:text-gray-200 text-neutral-800">
                        <span className="mr-2 text-green-500">$</span>
                        {data.rate}
                    </div>
                    <div className="flex items-center text-sm">
                        <TrophyIcon className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="dark:text-gray-300 text-neutral-700 font-medium">{data.success}</span>
                    </div>
                </div>

                <p className="text-sm dark:text-gray-400 text-neutral-600 line-clamp-3 mb-4 flex-grow">
                    {data.description}
                </p>

                <div className="pt-4 border-t dark:border-gray-800 border-neutral-200">
                     <button className="w-full py-2 rounded-lg bg-neutral-100 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium text-sm hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors">
                         {type === 'Individual' ? 'Contact' : 'Apply Now'}
                     </button>
                </div>
            </div>
        </div>
    );
};

// Filter Sidebar Component
const FilterSidebar = () => {
    return (
        <aside className="w-64 border-r dark:border-gray-800/50 border-neutral-200 p-6 pt-20 hidden md:block overflow-y-auto shrink-0 dark:bg-[#131313] bg-neutral-50">
            <h2 className="font-bold dark:text-white text-black text-lg mb-6">Filters</h2>

            {/* Category */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold dark:text-gray-300 text-neutral-700 mb-3">Category</h3>
                <div className="space-y-2">
                    {['Computer Science', 'Physics', 'History', 'Mathematics', 'Engineering'].map(cat => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                            <span className="text-sm dark:text-gray-400 text-neutral-600 group-hover:text-orange-500 transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Talent Badge */}
             <div className="mb-6">
                <h3 className="text-sm font-semibold dark:text-gray-300 text-neutral-700 mb-3">Talent Badge</h3>
                <div className="space-y-2">
                    {['Top Rated', 'Top Rated Plus', 'Rising Talent'].map(badge => (
                        <label key={badge} className="flex items-center space-x-2 cursor-pointer group">
                             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                             <div className="flex items-center">
                                {badge.includes('Top') && <StarIcon className="w-3 h-3 text-pink-500 mr-1.5" />}
                                {badge.includes('Rising') && <TrophyIcon className="w-3 h-3 text-green-500 mr-1.5" />}
                                <span className="text-sm dark:text-gray-400 text-neutral-600 group-hover:text-orange-500 transition-colors">{badge}</span>
                             </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Hourly Rate */}
             <div className="mb-6">
                <h3 className="text-sm font-semibold dark:text-gray-300 text-neutral-700 mb-3">Hourly Rate</h3>
                <div className="space-y-2">
                    {['$10 - $30', '$30 - $60', '$60+'].map(rate => (
                        <label key={rate} className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                            <span className="text-sm dark:text-gray-400 text-neutral-600 group-hover:text-orange-500 transition-colors">{rate}</span>
                        </label>
                    ))}
                </div>
            </div>

             {/* Location */}
             <div className="mb-6">
                <h3 className="text-sm font-semibold dark:text-gray-300 text-neutral-700 mb-3">Location</h3>
                <div className="relative mb-2">
                     <input type="text" placeholder="Select location" className="w-full text-sm p-2 rounded border dark:border-gray-700 border-neutral-300 dark:bg-gray-800 bg-white dark:text-white" />
                </div>
                 <div className="space-y-2">
                    {['United States', 'United Kingdom', 'Japan', 'Canada'].map(loc => (
                        <label key={loc} className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                            <span className="text-sm dark:text-gray-400 text-neutral-600 group-hover:text-orange-500 transition-colors">{loc}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}

const ConsultProfessorsView = () => {
    const [activeTab, setActiveTab] = useState<TabType>('Individual');
    const [searchQuery, setSearchQuery] = useState('');

    const currentData = activeTab === 'Individual' ? professors : jobs;

    return (
        <div className="flex h-full overflow-hidden">
            {/* Inner Sidebar for Filters */}
            <FilterSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden dark:bg-black bg-white">
                {/* Header */}
                <header className="p-6 md:p-8 pt-20 pb-4 shrink-0 border-b dark:border-gray-800 border-neutral-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                         <div className="relative w-full md:w-96">
                            <input 
                                type="text" 
                                placeholder={activeTab === 'Individual' ? "Search for professors, experts..." : "Search for jobs, projects..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border dark:border-gray-700 border-neutral-300 dark:bg-[#1a1a1a] bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white text-black transition-all"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center px-4 py-2 rounded-lg border dark:border-gray-700 border-neutral-300 text-sm font-medium dark:text-white text-black hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="mr-2">Sort by: Relevance</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                         <div>
                            <h1 className="text-2xl font-bold dark:text-white text-black mb-1" style={{ fontFamily: "'Lora', serif" }}>
                                17,000+ results
                            </h1>
                            <p className="text-sm text-gray-500">
                                {activeTab === 'Individual' 
                                ? "Find top professors and academic experts for your queries." 
                                : "Find projects and research opportunities."}
                            </p>
                         </div>
                         
                         {/* Tabs */}
                         <div className="flex p-1 dark:bg-[#1a1a1a] bg-neutral-100 rounded-lg border dark:border-gray-800 border-neutral-200">
                             <button 
                                onClick={() => setActiveTab('Individual')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'Individual' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                             >
                                 Talent
                             </button>
                             <button 
                                onClick={() => setActiveTab('Job')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'Job' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                             >
                                 Jobs
                             </button>
                         </div>
                    </div>
                </header>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {currentData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    layout
                                >
                                    <Card type={activeTab} data={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultProfessorsView;
