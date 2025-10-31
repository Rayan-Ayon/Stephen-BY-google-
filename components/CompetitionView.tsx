import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, ChevronDownIcon } from './icons';

const dummyCarouselImages = [
    "https://images.unsplash.com/photo-1614741118884-62ac143add13?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1526666923127-b2970f64b422?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1581093450021-4a7360e9a1d6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1532187643623-dbf2f5a73b15?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554474026-c3a1e5a59378?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1635070049013-d379a1215c54?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const dummyCompetitions = Array(9).fill({
    title: 'AI Proteomics Competition Series A: PSM rescoring',
    description: 'Exploring the dark matter of AI-assisted proteomics using state-of-the-art models.',
    organizers: ['Amazon', 'Meta', 'Google'],
    endTime: '2025-02-28',
    prize: '¥1,000,000',
    status: 'Ongoing',
    competitors: 333,
    imageUrl: 'https://images.unsplash.com/photo-1678483789005-5a742b474270?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
});

const CompetitionCard = ({ competition }: { competition: typeof dummyCompetitions[0] }) => (
    <motion.div 
      className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden flex flex-col group hover:border-green-500/50 transition-all duration-300"
      whileHover={{ y: -5 }}
    >
        <div className="h-40 overflow-hidden">
            <img src={competition.imageUrl} alt={competition.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-5 flex-grow flex flex-col">
            <h3 className="font-bold text-white text-lg mb-2" style={{ fontFamily: "'Lora', serif" }}>{competition.title}</h3>
            <p className="text-gray-400 text-sm mb-3 flex-grow">{competition.description}</p>
            <div className="text-xs text-gray-500 mb-3">
                Organizers: {competition.organizers.join(', ')}
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-xs py-1 px-2.5 bg-blue-500/10 text-blue-300 rounded-full">{competition.status}</span>
                <span className="text-gray-400 font-medium">{competition.competitors} Competitors</span>
            </div>
            <div className="border-t border-gray-800 my-4"></div>
            <div className="flex justify-between items-end">
                 <div>
                    <p className="text-xs text-gray-500">End Time</p>
                    <p className="text-sm font-medium text-gray-300">{competition.endTime}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Prize</p>
                    <p className="text-lg font-bold text-green-400">{competition.prize}</p>
                </div>
            </div>
        </div>
    </motion.div>
);

const CompetitionView = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev === dummyCarouselImages.length - 1 ? 0 : prev + 1));
        }, 2500); // Auto-slide every 2.5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto stephen-bg p-6 lg:p-8">
            {/* Carousel */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
                <AnimatePresence>
                    <motion.div
                        key={currentSlide}
                        className="absolute w-full h-full"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                    >
                        <img src={dummyCarouselImages[currentSlide]} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
                         <div className="absolute top-1/2 left-12 -translate-y-1/2 text-white max-w-lg">
                            <h2 className="text-4xl font-bold" style={{fontFamily: "'Lora', serif"}}>AI4S Talent Certification</h2>
                            <p className="mt-2 text-gray-300 text-sm">Jointly launched by AI for Science Institute, Beijing and Beijing DP Technology Co., Ltd. aims to provide a rigorous and scientific assessment of abilities.</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {dummyCarouselImages.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}></button>
                    ))}
                </div>
            </div>

            {/* Tabs and Filters */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center border-b border-gray-800">
                    {['All Competitions', 'Ongoing Competitions', 'Completed Competitions'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'text-white border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input type="text" placeholder="Search competitions..." className="bg-[#1a1a1a] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                     <button className="flex items-center text-sm text-gray-300 hover:text-white bg-[#1a1a1a] border border-gray-800 px-4 py-2 rounded-lg">
                         Recent
                         <ChevronDownIcon className="w-4 h-4 ml-2" />
                     </button>
                </div>
            </div>

            {/* Competitions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyCompetitions.map((comp, index) => (
                    <CompetitionCard key={index} competition={comp} />
                ))}
            </div>
        </div>
    );
};

export default CompetitionView;