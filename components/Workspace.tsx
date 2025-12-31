
import React, { useState, useRef, useEffect } from 'react';
import TutorPanel from './TutorPanel';
import { 
    ChevronLeftIcon, ChevronDownIcon, BookOpenIcon, 
    CheckCircleIcon, VideoCameraIcon, XIcon,
    LockClosedIcon, CopyIcon, BookmarkIcon
} from './icons';
import { HistoryItem } from './Dashboard';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

interface WorkspaceProps {
    course: HistoryItem;
    showHeader: boolean;
    onBack?: () => void;
}

interface SidebarItem {
    id: string;
    type: 'video' | 'reading' | 'survey';
    title: string;
    duration: string;
    completed: boolean;
}

interface SidebarModule {
    id: string;
    name: string;
    subtitle: string;
    items: SidebarItem[];
    isLocked?: boolean;
}

// --- Left Sidebar Component ---
const CourseSidebar: React.FC<{ title: string, activeItemId: string, onSelectItem: (id: string) => void }> = ({ title, activeItemId, onSelectItem }) => {
    const [expandedModules, setExpandedModules] = useState<string[]>(['mod1']);

    const modules: SidebarModule[] = [
        {
            id: 'mod1',
            name: "Module 1",
            subtitle: "Introducing data analytics and analytical thinking",
            items: [
                { id: '1-1', type: 'video', title: 'Welcome to the Google Data Analytics Certificate', duration: '9 min', completed: true },
                { id: '1-2', type: 'reading', title: 'Course 1 overview: Set your expectations', duration: '8 min', completed: true },
                { id: '1-3', type: 'video', title: 'Introduction to the course', duration: '4 min', completed: true },
                { id: '1-4', type: 'video', title: 'Get started with your Google Data Analytics Certificate', duration: '2 min', completed: true },
                { id: '1-5', type: 'reading', title: 'Helpful resources and tips', duration: '4 min', completed: true },
            ]
        },
        {
            id: 'mod2',
            name: "Module 2",
            subtitle: "The wonderful world of data",
            isLocked: true,
            items: [
                { id: '2-1', type: 'video', title: 'What is data anyway?', duration: '5 min', completed: false },
                { id: '2-2', type: 'reading', title: 'Data in the real world', duration: '10 min', completed: false },
            ]
        },
        {
            id: 'mod3',
            name: "Module 3",
            subtitle: "Set up your data analytics toolbox",
            isLocked: true,
            items: [
                { id: '3-1', type: 'video', title: 'Software requirements', duration: '3 min', completed: false },
                { id: '3-2', type: 'survey', title: 'Technical baseline survey', duration: '15 min', completed: false },
            ]
        }
    ];

    return (
        <aside className="w-80 h-full flex flex-col border-r dark:border-white/5 border-neutral-200 shrink-0 bg-neutral-50 dark:bg-[#0d0d0d] z-20">
            <div className="p-6 border-b dark:border-white/5 border-neutral-200 flex justify-between items-start">
                <h2 className="text-blue-600 dark:text-blue-400 font-bold text-lg leading-tight" style={{ fontFamily: "'Lora', serif" }}>
                    {title}
                </h2>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {modules.map((mod) => (
                    <div key={mod.id} className="border-b dark:border-white/5 border-neutral-200">
                        <div 
                            onClick={() => setExpandedModules(prev => prev.includes(mod.id) ? prev.filter(m => m !== mod.id) : [...prev, mod.id])}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{mod.name}</p>
                                <p className="text-xs font-bold dark:text-gray-200 text-neutral-800 line-clamp-1">{mod.subtitle}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {mod.isLocked && <LockClosedIcon className="w-3.5 h-3.5 text-gray-600" />}
                                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${expandedModules.includes(mod.id) ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                        <AnimatePresence initial={false}>
                            {expandedModules.includes(mod.id) && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-white dark:bg-[#0d0d0d]">
                                    {mod.items.map((item) => (
                                        <div key={item.id} onClick={() => onSelectItem(item.id)} className={`px-4 py-3 flex items-start space-x-3 cursor-pointer border-l-4 transition-all ${activeItemId === item.id ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-600' : 'border-transparent hover:bg-neutral-50 dark:hover:bg-white/5'}`}>
                                            <div className="mt-0.5 shrink-0">
                                                {item.completed ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-700" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[13px] font-medium leading-snug truncate ${activeItemId === item.id ? 'text-blue-700 dark:text-blue-400' : 'dark:text-gray-300 text-neutral-700'}`}>{item.title}</p>
                                                <div className="flex items-center mt-1 text-[11px] text-gray-500 font-bold uppercase tracking-tight">{item.type} • {item.duration}</div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </aside>
    );
};

// --- Main Learning Content ---
const VideoPlayer: React.FC<{ course: HistoryItem }> = ({ course }) => {
    const [activeTab, setActiveTab] = useState<'Chapters' | 'Transcripts'>('Chapters');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // --- Cinematic Scroll Transitions ---
    // We bind the animation directly to the scroll percentage to ensure frame-by-frame smoothness.
    const { scrollY } = useScroll({ container: scrollContainerRef });
    
    // Transition points: 0 is full size, 250px scroll is final stuck size.
    const scrollRange = [0, 250];
    
    const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const videoWidth = useTransform(smoothScrollY, scrollRange, ["100%", "85%"]);
    const videoHeight = useTransform(smoothScrollY, scrollRange, ["560px", "320px"]);
    const videoBorderRadius = useTransform(smoothScrollY, scrollRange, ["0px", "24px"]);
    const videoPaddingTop = useTransform(smoothScrollY, scrollRange, ["0px", "16px"]);
    const bgOpacity = useTransform(smoothScrollY, scrollRange, [0, 1]);
    
    // The spacer maintains the gap for lower items so they "gradually get up" smoothly.
    const spacerHeight = useTransform(smoothScrollY, scrollRange, ["560px", "320px"]);

    const chapters = [
        { time: "00:00", title: "Generative AI Essentials Course Overview", description: "Andrew Brown introduces the free Generative AI Essentials course, designed to provide essential knowledge for building generative AI applications. This course serves as a prerequisite for his free gen boot camp, where participants will engage in hands-on project building." },
        { time: "00:33", title: "Generative AI Certification Introduction", description: "Andrew Brown introduces the GenAI Essentials certification, a practical course focused on fundamental concepts of machine learning and AI, emphasizing large language models and their applications." },
        { time: "01:07", title: "Purpose of Generative AI Essentials Course", description: "Current courses on GenAI are tailored to specific vendors and often assume prior knowledge, creating significant gaps for learners. The Gen Essentials course aims to provide a comprehensive understanding." }
    ];

    const transcriptData = [
        { time: "0:00", text: "hey it's Andrew Brown and welcome to the free generative AI Essentials course the purpose of this course is to give you comprehensive knowledge so that you can go and start building generative AI applications and in particular this is the prerequisite course for my free gen boot camp where we actually go out and build real projects so I hope you're as excited as I am and you're able to get as as through much of this content uh so you can go build projects with me and I will see you soon okay [Music]" },
        { time: "0:33", text: "hey everyone it's Andrew Brown and welcome to the start of our journey asking the most important question which is first which is what is the genis uh genis gen Essentials certification so this is a practical gen certification teaching you the fundamental concepts of ml AI gen all modalities of gen with a strong focus on llms programmatically working with J workloads uh both with cloud and local l M and it is a cloud vendor agnostic approach so there are other geni certifications out there it us has one" },
        { time: "1:07", text: "Azure has one Nvidia has one and you know what I've made courses for them all and they're okay but they're very very specific to those vendors and they leave out huge huge gaps and they have all these expectations of what you should already know in order to um uh uh to start building with Gen and so the purpose I made this gen Essentials course is so that you have round uh round and Broad knowledge so that you can be successful in any area of gen no matter the technical choice" }
    ];

    return (
        <div ref={scrollContainerRef} className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative dark:bg-[#0b0b0b] bg-white">
            
            {/* The Cinematic Video Wrapper (Sticky) */}
            <motion.div 
                className="sticky top-0 z-50 w-full flex justify-center pointer-events-none"
                style={{ 
                    backgroundColor: `rgba(11, 11, 11, ${bgOpacity.get()})`,
                    paddingTop: videoPaddingTop
                }}
            >
                <motion.div 
                    className="pointer-events-auto shadow-2xl overflow-hidden border dark:border-white/10 border-neutral-200"
                    style={{ 
                        width: videoWidth, 
                        height: videoHeight, 
                        borderRadius: videoBorderRadius,
                    }}
                >
                    <iframe className="w-full h-full" src={course.videoUrl} title="Video" frameBorder="0" allowFullScreen></iframe>
                </motion.div>
            </motion.div>

            {/* 
                Dynamic Layout Spacer: 
                This keeps the content below moving up naturally as the video shrinks, 
                eliminating any blinking or layout jumps.
            */}
            <motion.div style={{ height: spacerHeight }} className="shrink-0 w-full" />

            {/* Lower Stuffs: Title, Coach, and Content */}
            <div className="relative z-10 w-full px-8 pb-32">
                <div className="max-w-4xl mx-auto py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold dark:text-white text-black">Introduction to the course</h1>
                        <button className="flex items-center space-x-2 text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">
                            <BookmarkIcon className="w-5 h-5" />
                            <span>Save note</span>
                        </button>
                    </div>

                    {/* Coach Card - Inspired by screenshot */}
                    <div className="mb-12 p-6 dark:bg-[#151515] bg-neutral-50 rounded-3xl border dark:border-white/5 border-neutral-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold dark:text-white text-black">coach</h3>
                            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-sm dark:text-gray-400 text-neutral-600 mb-6">Let me know if you have any questions about this material. I'm here to help!</p>
                        <div className="flex flex-wrap gap-3">
                             {['Give me practice questions', 'Explain this topic in simple terms', 'Give me a summary', 'Give me real-life examples'].map(btn => (
                                 <button key={btn} className="flex items-center space-x-2 px-4 py-2 rounded-xl border dark:border-blue-500/30 border-blue-200 dark:bg-blue-500/10 bg-blue-50 text-blue-500 text-xs font-bold hover:bg-blue-500/20 transition-all">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                    <span>{btn}</span>
                                 </button>
                             ))}
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="flex items-center justify-between mb-8 border-b dark:border-white/5 border-neutral-200 pb-1">
                        <div className="flex space-x-8">
                            {(['Chapters', 'Transcripts'] as const).map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)} 
                                    className={`relative pb-4 text-sm font-bold transition-colors ${activeTab === tab ? 'dark:text-white text-black' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-black dark:bg-white rounded-full" />
                                    )}
                                </button>
                            ))}
                            <button className="pb-4 text-sm font-bold text-gray-500 hover:text-gray-700">Notes</button>
                            <button className="pb-4 text-sm font-bold text-gray-500 hover:text-gray-700">Downloads</button>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                            <button className="flex items-center space-x-2 px-5 py-2 rounded-xl border dark:border-white/5 bg-neutral-100 dark:bg-[#151515] text-[12px] font-bold text-gray-500">
                                <div className="flex flex-col -space-y-0.5 opacity-60">
                                    <ChevronDownIcon className="w-3 h-3 rotate-180" />
                                    <ChevronDownIcon className="w-3 h-3" />
                                </div>
                                <span>Auto Scroll</span>
                            </button>
                            <button className="p-2.5 rounded-xl border dark:border-white/5 bg-neutral-100 dark:bg-[#151515] text-gray-500">
                                <ChevronDownIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-[800px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Chapters' ? (
                                <motion.div 
                                    key="chapters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="space-y-12 pt-4"
                                >
                                    {chapters.map((ch, i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="mb-4">
                                                <span className="text-[12px] font-black text-gray-400 dark:bg-white/5 bg-neutral-100 border dark:border-white/10 border-neutral-200 px-4 py-2 rounded-lg tracking-widest">{ch.time}</span>
                                            </div>
                                            <h2 className="text-2xl font-bold dark:text-white text-black leading-tight mb-3 group-hover:text-blue-500 transition-colors">{ch.title}</h2>
                                            <p className="text-[16px] dark:text-gray-400 text-gray-600 font-medium leading-relaxed">{ch.description}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="transcripts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="space-y-10 pt-4"
                                >
                                     <div className="flex items-center space-x-4 mb-10">
                                        <span className="text-sm font-bold dark:text-gray-300">Transcript language:</span>
                                        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border dark:border-white/5 bg-neutral-100 dark:bg-white/5 text-sm font-medium">
                                            <span>English (auto)</span>
                                            <ChevronDownIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 ml-auto text-gray-500 hover:text-white"><CopyIcon className="w-6 h-6" /></button>
                                     </div>
                                    {transcriptData.map((tr, i) => (
                                        <div key={i} className="flex items-start group hover:bg-neutral-50 dark:hover:bg-white/[0.02] p-4 -mx-4 rounded-2xl transition-colors cursor-pointer">
                                            <span className="w-16 text-[12px] font-bold text-gray-400 shrink-0 mt-1">{tr.time}</span>
                                            <p className="text-[17px] dark:text-gray-200 text-neutral-800 font-medium leading-relaxed">{tr.text}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Workspace: React.FC<WorkspaceProps> = ({ course, showHeader, onBack }) => {
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [activeSidebarItemId, setActiveSidebarItemId] = useState('1-3');

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden dark:bg-[#0b0b0b] bg-white transition-colors duration-300">
            {showHeader && <CourseHeader course={course} onBack={onBack} />}
            <div className="flex-1 flex overflow-hidden relative">
                <CourseSidebar title={course.title} activeItemId={activeSidebarItemId} onSelectItem={setActiveSidebarItemId} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <VideoPlayer course={course} />
                </div>
                <AnimatePresence>
                    {isAiPanelOpen && (
                        <motion.div initial={{ width: 0 }} animate={{ width: 440 }} exit={{ width: 0 }} className="h-full border-l dark:border-white/5 border-neutral-200 shrink-0 bg-[#0b0b0b] flex flex-col overflow-hidden">
                            <TutorPanel isPanelExpanded={false} setIsPanelExpanded={() => {}} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="fixed bottom-[92px] right-6 z-[60]">
                <button onClick={() => setIsAiPanelOpen(!isAiPanelOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 ${isAiPanelOpen ? 'bg-orange-500 border-orange-400 text-white' : 'bg-black dark:bg-white dark:text-black text-white border-transparent hover:border-orange-500'}`}>
                    <div className="relative w-8 h-8">
                        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full transition-transform duration-500 ${isAiPanelOpen ? 'scale-90 rotate-90' : 'scale-110'}`}>
                            {isAiPanelOpen ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /> : <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />}
                        </svg>
                        {!isAiPanelOpen && <div className="absolute inset-0 bg-blue-400 blur-lg opacity-30 animate-pulse" />}
                    </div>
                </button>
            </div>
        </div>
    );
};

const CourseHeader: React.FC<{ course: HistoryItem; onBack?: () => void }> = ({ course, onBack }) => (
    <header className="flex items-center space-x-3 px-4 py-2.5 border-b dark:border-white/5 border-neutral-200 shrink-0 bg-white dark:bg-[#0b0b0b] z-50">
        <button onClick={onBack} className="p-2 mr-2 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <ChevronLeftIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
        </button>
        <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-[10px] text-white font-bold">S</div>
            <h1 className="text-sm font-bold dark:text-gray-200" style={{ fontFamily: "'Lora', serif" }}>{course.title}</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
             <button className="px-5 py-1.5 rounded-full border border-green-800 bg-green-900/20 text-green-500 font-semibold text-sm transition-all hover:bg-green-900/30">Upgrade</button>
        </div>
    </header>
);

export default Workspace;
