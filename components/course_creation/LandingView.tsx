
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem } from '../Dashboard';
import { 
    ChevronDownIcon, ArrowUpIcon, StarIcon, DotsHorizontalIcon, 
    FileTextIcon, VideoCameraIcon, ChevronLeftIcon, ChevronRightIcon, 
    PencilIcon, BrainIcon, CheckIcon, CirclePlusIcon, PaperclipIcon, 
    MessageCircleIcon, WaveformIcon, XIcon, LoadingSpinnerIcon,
    QuizIcon, MindMapIcon, FlashcardIcon, GlobeIcon, TimelineIcon, 
    MicOffIcon, MaximizeIcon, QuizIcon as QuizIconAlt, SummaryIcon, PodcastIcon
} from '../icons';

type Course = {
    org?: string;
    title: string;
    level: string;
    depth: number;
    duration: string;
    completed: number;
    estimatedDate?: string;
    nextStep?: {
        title: string;
        type: string;
        duration: string;
    }
};

interface LandingViewProps {
    onSelectCourse: (course: HistoryItem) => void;
    courses: Course[];
    onStartFlow: (topic: string) => void;
}

const models = [
    { name: 'Auto', free: true },
    { name: 'Gemini 3 Flash', free: true },
    { name: 'Claude 4.5 Sonnet', free: false },
    { name: 'GPT-5.2', free: false },
    { name: 'Gemini 3 Pro', free: false },
    { name: 'Grok 4.1', free: false },
];

const CinematicBlinkingBars = () => {
    const [opacities, setOpacities] = useState([0.3, 0.3, 0.3]);

    useEffect(() => {
        const intervals = [0, 1, 2].map((i) => {
            return setInterval(() => {
                setOpacities(prev => {
                    const next = [...prev];
                    next[i] = Math.random() > 0.6 ? 1 : 0.2;
                    return next;
                });
            }, 300 + Math.random() * 500);
        });
        return () => intervals.forEach(clearInterval);
    }, []);

    return (
        <div className="flex items-center space-x-2.5 px-6">
            {opacities.map((op, i) => (
                <motion.div
                    key={i}
                    animate={{ opacity: op }}
                    className="w-4 h-7 bg-[#10b981] rounded-[4px] shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    transition={{ duration: 0.2 }}
                />
            ))}
        </div>
    );
};

const CourseCard: React.FC<{ course: Course, onResume: () => void }> = ({ course, onResume }) => {
    return (
        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 mb-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 overflow-hidden">
                        {course.org === 'Google' ? <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-5 h-5" /> : (course.org?.substring(0, 3) || 'SAI')}
                    </div>
                    <span className="text-sm font-medium dark:text-gray-300 text-gray-700">{course.org}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <DotsHorizontalIcon className="w-5 h-5" />
                </button>
            </div>

            <h3 className="text-xl font-bold text-black dark:text-white mb-2 leading-tight">{course.title}</h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-4 space-x-1">
                <span>{course.level}</span>
                <span>•</span>
                <span>{course.completed}% complete</span>
                <span>•</span>
                <span className="text-gray-400">Estimated completion: ({course.estimatedDate || 'Jan 25, 2026'})</span>
            </div>

            <div className="mb-8">
                <div className="w-full h-1.5 dark:bg-gray-800 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#6a4cff] rounded-full transition-all duration-1000"
                        style={{ width: `${course.completed}%` }}
                    ></div>
                </div>
            </div>

            <div className="dark:bg-[#111] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-5 flex items-center justify-between group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="text-gray-400">
                        {course.nextStep?.type === 'Video' ? <VideoCameraIcon className="w-5 h-5" /> : <FileTextIcon className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="font-bold text-black dark:text-white text-sm group-hover:text-[#0056D2] transition-colors">{course.nextStep?.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{course.nextStep?.type} ({course.nextStep?.duration})</p>
                    </div>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onResume(); }}
                    className="px-4 py-2 bg-[#0056D2] hover:bg-[#00419e] text-white text-sm font-bold rounded-lg transition-colors min-w-[100px]"
                >
                    {course.completed > 0 ? 'Resume' : 'Get started'}
                </button>
            </div>
        </div>
    );
};

const GoalsBox = () => (
    <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-bold text-black dark:text-white mb-6">Today's goals</h3>
        <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-sm group cursor-pointer">
                <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center shrink-0 group-hover:bg-orange-500/10 transition-colors">
                    <StarIcon className="w-3 h-3 text-gray-400 group-hover:text-orange-500" />
                </div>
                <span className="text-gray-600 dark:text-gray-300"><span className="underline decoration-dotted">Complete any 3 learning items</span> · 0/3</span>
            </li>
            <li className="flex items-center space-x-3 text-sm group cursor-pointer">
                <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center shrink-0">
                    <StarIcon className="w-3 h-3 text-gray-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">Watch 3 videos · 0/3</span>
            </li>
            <li className="flex items-center space-x-3 text-sm group cursor-pointer">
                <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center shrink-0">
                    <StarIcon className="w-3 h-3 text-gray-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">Complete a module</span>
            </li>
        </ul>
    </div>
);

const CalendarBox = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-black dark:text-white">Learning plan</h3>
                <button><PencilIcon className="w-3.5 h-3.5 text-gray-500 hover:text-black dark:hover:text-white" /></button>
            </div>
            
            <div className="flex items-center justify-between mb-6">
                 <span className="text-sm font-bold dark:text-white">December 2025</span>
                 <div className="flex space-x-4">
                    <button><ChevronLeftIcon className="w-4 h-4 text-gray-500" /></button>
                    <button><ChevronRightIcon className="w-4 h-4 text-gray-500" /></button>
                 </div>
            </div>

            <div className="grid grid-cols-7 gap-y-3 text-center mb-6">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                    <span key={d} className="text-[10px] text-gray-500 font-medium uppercase">{d}</span>
                ))}
                {Array(6).fill(null).map((_, i) => <div key={i}></div>)}
                {days.map(d => (
                    <div key={d} className="relative group cursor-pointer">
                        <span className={`text-xs ${d === 26 ? 'w-6 h-6 flex items-center justify-center border-2 border-[#6a4cff] rounded-full mx-auto font-bold text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{d}</span>
                        {d === 2 && <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1 h-1 bg-[#6a4cff] rounded-full"></div>}
                    </div>
                ))}
            </div>

            <div className="space-y-1 pt-4 border-t dark:border-gray-800">
                <div className="flex items-center text-[10px] text-gray-500">
                    <div className="w-1.5 h-1.5 bg-[#6a4cff] rounded-full mr-2"></div>
                    1+ daily goals completed
                </div>
                <div className="flex items-center text-[10px] text-gray-500">
                    <div className="w-4 h-0.5 bg-[#6a4cff] mr-2"></div>
                    All daily goals completed
                </div>
            </div>
        </div>
    );
};

const LandingView: React.FC<LandingViewProps> = ({ onSelectCourse, courses, onStartFlow }) => {
    const [inputValue, setInputValue] = useState('');
    const [activeTab, setActiveTab] = useState('In Progress');
    const [selectedModel, setSelectedModel] = useState('Auto');
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    
    // Voice Mode States
    const [voiceModeState, setVoiceModeState] = useState<'idle' | 'loading' | 'session'>('idle');
    
    const modelMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
                setIsModelMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVoiceStart = () => {
        setVoiceModeState('loading');
        setTimeout(() => {
            setVoiceModeState('session');
        }, 1500);
    };

    const handleSelectDummyCourse = (course: Course) => {
        const newCourse: HistoryItem = {
            id: Math.floor(Math.random() * 10000),
            title: course.title,
            description: `Generated course for ${course.title}`,
            type: 'video',
            time: 'Existing Course',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            day: 1, totalDays: 30, depth: course.depth, level: course.level,
            learningReason: `Mastering ${course.title}`
        };
        onSelectCourse(newCourse);
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col">
            {/* Massive Header Section */}
            <div className="mb-20 flex flex-col items-center">
                 <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-16 text-center tracking-tight" style={{ fontFamily: "'Lora', serif" }}>
                    Which course are you looking for?
                 </h1>
                
                {/* Modern Cinematic Chatbox Container */}
                <div className="relative w-full max-w-3xl px-4">
                    <AnimatePresence mode="wait">
                        {voiceModeState === 'idle' ? (
                            <motion.div 
                                key="text-mode"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                className="dark:bg-[#181818] bg-white border dark:border-white/10 border-neutral-200 rounded-[36px] p-6 shadow-2xl transition-all focus-within:ring-2 ring-orange-500/20"
                            >
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Write about your desired course..."
                                    rows={1}
                                    className="w-full bg-transparent border-none focus:outline-none text-lg dark:text-white placeholder-neutral-500 font-medium resize-none overflow-hidden mb-6"
                                    style={{ minHeight: '30px' }}
                                />
                                
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-2" ref={modelMenuRef}>
                                        <button className="p-1 rounded-full dark:hover:bg-white/5 hover:bg-neutral-100 text-neutral-500 transition-colors border dark:border-white/10 border-neutral-200">
                                            <CirclePlusIcon className="w-9 h-9" />
                                        </button>
                                        <button className="flex items-center space-x-2 px-4 py-2 rounded-full dark:border-white/10 border-neutral-200 border dark:hover:bg-white/5 hover:bg-neutral-100 text-neutral-400 transition-colors">
                                            <PaperclipIcon className="w-4 h-4" />
                                            <span className="text-[13px] font-bold dark:text-neutral-300 text-neutral-700">Attach</span>
                                        </button>
                                        
                                        <div className="relative">
                                            <button 
                                                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-full dark:border-white/10 border-neutral-200 border dark:hover:bg-white/5 hover:bg-neutral-100 text-neutral-400 transition-colors ${isModelMenuOpen ? 'dark:bg-white/10 bg-neutral-200' : ''}`}
                                            >
                                                <BrainIcon className={`w-4 h-4 transition-colors ${isModelMenuOpen ? 'text-white' : 'text-orange-500'}`} />
                                                <span className={`text-[13px] font-bold ${isModelMenuOpen ? 'dark:text-white text-black' : 'dark:text-neutral-300 text-neutral-700'}`}>{selectedModel}</span>
                                                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180 dark:text-white text-black' : 'text-neutral-500'}`} />
                                            </button>
                                            
                                            <AnimatePresence>
                                                {isModelMenuOpen && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute top-full left-0 mt-3 w-64 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-[22px] shadow-2xl overflow-hidden py-2 z-50"
                                                    >
                                                        {models.map((m) => (
                                                            <button 
                                                                key={m.name}
                                                                onClick={() => { setSelectedModel(m.name); setIsModelMenuOpen(false); }}
                                                                className="w-full flex items-center justify-between px-5 py-3 text-[13px] dark:text-gray-300 text-gray-700 dark:hover:bg-white/[0.04] hover:bg-neutral-100 transition-colors group"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                                        {selectedModel === m.name && <CheckIcon className="w-3.5 h-3.5 dark:text-white text-black" />}
                                                                    </div>
                                                                    <span className={`${selectedModel === m.name ? "font-bold dark:text-white text-black" : "font-medium"}`}>{m.name}</span>
                                                                </div>
                                                                {!m.free && <span className="text-[9px] font-bold bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Upgrade</span>}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button className="flex items-center space-x-2 px-4 py-2 rounded-full dark:border-white/10 border-neutral-200 border dark:hover:bg-white/5 hover:bg-neutral-100 text-neutral-400 transition-colors">
                                            <MessageCircleIcon className="w-4 h-4" />
                                            <span className="text-[13px] font-bold dark:text-neutral-300 text-neutral-700">Chat</span>
                                        </button>
                                        <button 
                                            onClick={handleVoiceStart}
                                            className="p-1 rounded-full border dark:border-white/10 border-neutral-200 dark:hover:bg-white/5 hover:bg-neutral-100 text-neutral-500 transition-colors"
                                        >
                                            <WaveformIcon className="w-9 h-9" />
                                        </button>
                                        <button 
                                            onClick={() => inputValue.trim() && onStartFlow(inputValue)}
                                            disabled={!inputValue.trim()}
                                            className="p-2.5 rounded-full bg-neutral-600/40 text-neutral-400 hover:bg-white hover:text-black transition-all disabled:opacity-30"
                                        >
                                            <ArrowUpIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="voice-interface"
                                initial={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="dark:bg-[#0d0d0d] bg-white border dark:border-white/10 border-neutral-200 rounded-[42px] p-0 shadow-2xl flex flex-col min-h-[580px] w-full relative overflow-hidden"
                            >
                                {/* Top Nav Bar - Exact match to Screenshot 234923 */}
                                <div className="flex items-center space-x-1 p-4 border-b dark:border-white/5 border-neutral-100">
                                    <button className="flex items-center space-x-2.5 px-6 py-2.5 rounded-full dark:bg-white/10 bg-white dark:text-white text-black font-bold text-[14px] shadow-lg border dark:border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                        <span>Chat</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-gray-500 font-bold text-[13px] hover:text-white transition-colors">
                                        <FlashcardIcon className="w-4 h-4" />
                                        <span>Flashcards</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-gray-500 font-bold text-[13px] hover:text-white transition-colors">
                                        <QuizIconAlt className="w-4 h-4" />
                                        <span>Quizzes</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-gray-500 font-bold text-[13px] hover:text-white transition-colors">
                                        <PodcastIcon className="w-4 h-4" />
                                        <span>Podcast</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-gray-500 font-bold text-[13px] hover:text-white transition-colors">
                                        <SummaryIcon className="w-4 h-4" />
                                        <span>Summary</span>
                                    </button>
                                    <div className="flex-grow" />
                                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                        <MaximizeIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Center Area */}
                                <div className="flex flex-col items-center justify-center flex-1 py-14">
                                    <div className="mb-8 opacity-30">
                                         <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M45 20V80M35 25V75M55 35V65" stroke="#888" strokeWidth="14" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[26px] font-bold dark:text-gray-400 text-neutral-500 mb-14 tracking-tight">Learn with YouLearn</h3>
                                    
                                    {/* Tool Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg px-8">
                                        <button className="flex items-center justify-center space-x-3 px-6 py-4 rounded-[22px] border dark:border-white/5 dark:bg-white/5 text-[14px] font-bold text-gray-400 hover:text-white transition-all hover:bg-white/5 border-neutral-200">
                                            <QuizIcon className="w-5 h-5" /> <span>Quiz</span>
                                        </button>
                                        <button className="flex items-center justify-center space-x-3 px-6 py-4 rounded-[22px] border dark:border-white/5 dark:bg-white/5 text-[14px] font-bold text-gray-400 hover:text-white transition-all hover:bg-white/5 border-neutral-200">
                                            <MindMapIcon className="w-5 h-5" /> <span>Mind Map</span>
                                        </button>
                                        <button className="flex items-center justify-center space-x-3 px-6 py-4 rounded-[22px] border dark:border-white/10 dark:bg-white/10 text-[14px] font-bold text-white transition-all bg-white/10 border-neutral-200">
                                            <WaveformIcon className="w-5 h-5" /> <span>Voice Mode</span>
                                        </button>
                                        <button className="flex items-center justify-center space-x-3 px-6 py-4 rounded-[22px] border dark:border-white/5 dark:bg-white/5 text-[14px] font-bold text-gray-400 hover:text-white transition-all hover:bg-white/5 border-neutral-200">
                                            <FlashcardIcon className="w-5 h-5" /> <span>Flashcards</span>
                                        </button>
                                        <button className="flex items-center justify-center space-x-3 px-6 py-4 rounded-[22px] border dark:border-white/5 dark:bg-white/5 text-[14px] font-bold text-gray-400 hover:text-white transition-all hover:bg-white/5 border-neutral-200">
                                            <GlobeIcon className="w-5 h-5" /> <span>Search</span>
                                        </button>
                                        <button className="flex items-center justify-center space-x-3 px-6 py-4 rounded-[22px] border dark:border-white/5 dark:bg-white/5 text-[14px] font-bold text-gray-400 hover:text-white transition-all hover:bg-white/5 border-neutral-200">
                                            <TimelineIcon className="w-5 h-5" /> <span>Timeline</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Cinematic Voice Mode Bottom Bar - Pulse bars match screenshot exactly */}
                                <div className="w-[calc(100%-32px)] mx-4 mb-4 dark:bg-[#151515] bg-neutral-100 rounded-[30px] p-3 flex items-center justify-between border dark:border-white/5 shadow-2xl relative">
                                    <div className="flex items-center">
                                        <CinematicBlinkingBars />
                                    </div>

                                    <div className="flex items-center space-x-4 pr-2">
                                        <div className="flex space-x-2.5 px-6">
                                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                        </div>
                                        <button className="w-14 h-14 flex items-center justify-center rounded-full dark:bg-white/5 bg-white border dark:border-white/5 border-neutral-200 text-gray-400 hover:text-white transition-colors">
                                            <MicOffIcon className="w-6 h-6" />
                                        </button>
                                        <button 
                                            onClick={() => setVoiceModeState('idle')}
                                            className="w-14 h-14 flex items-center justify-center rounded-full dark:bg-white/10 bg-white border dark:border-white/10 border-neutral-200 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <XIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 shrink-0">
                    <GoalsBox />
                    <CalendarBox />
                    <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Last 4 weeks</h4>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-bold dark:text-white text-black">4</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Daily goals completed</p>
                    </div>
                </div>

                {/* Courses Column */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2">
                             <button 
                                onClick={() => setActiveTab('In Progress')}
                                className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'In Progress' ? 'bg-[#313b4e] text-white' : 'text-gray-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
                             >
                                In Progress
                             </button>
                             <button 
                                onClick={() => setActiveTab('Completed')}
                                className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'Completed' ? 'bg-[#313b4e] text-white' : 'text-gray-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
                             >
                                Completed
                             </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'In Progress' ? (
                            <motion.div 
                                key="list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {courses.map((course, index) => (
                                    <CourseCard 
                                        key={index} 
                                        course={course} 
                                        onResume={() => handleSelectDummyCourse(course)} 
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="empty" className="text-center py-20 text-gray-500">
                                <p>You haven't completed any courses yet.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LandingView;
