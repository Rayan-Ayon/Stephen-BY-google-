
import React, { useState, useCallback, useEffect, useRef } from 'react';
import TutorPanel from './TutorPanel';
import { 
    ChevronLeftIcon, DoubleChevronUpIcon, DoubleChevronDownIcon, SparkleIcon, ChevronDownIcon, CheckCircleIcon,
    FileTextIcon, LockClosedIcon, XIcon, ViewSidebarIcon, MaximizeIcon, MinimizeIcon, BookOpenIcon, ShareIcon
} from './icons';
import { HistoryItem } from './Dashboard';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { UpgradeModal } from './modals';

interface WorkspaceProps {
    course: HistoryItem;
    showHeader: boolean;
    onBack?: () => void;
}

// --- Components for Unstructured (Add Content) View ---
// ... (ChapterList and TranscriptList remain unchanged) ...
const ChapterList = () => {
    const chapters = [
        { 
            time: "00:00", 
            title: "Generative AI Essentials Course Overview", 
            desc: "Andrew Brown introduces the free Generative AI Essentials course, designed to provide essential knowledge for building generative AI applications. This course serves as a prerequisite for his free gen boot camp, where participants will engage in hands-on project building. Excitement is expressed for the upcoming content and collaborative projects." 
        },
        { 
            time: "00:33", 
            title: "Generative AI Certification Introduction", 
            desc: "Andrew Brown introduces the GenAI Essentials certification, a practical course focused on fundamental concepts of machine learning and AI, emphasizing large language models and their applications. This certification takes a cloud vendor-agnostic approach and is designed for programmatic work with both cloud and local environments." 
        },
        { 
            time: "01:07", 
            title: "Purpose of Generative AI Essentials Course", 
            desc: "Current courses on GenAI are tailored to specific vendors and often assume prior knowledge, creating significant gaps for learners. The Gen Essentials course aims to provide a comprehensive understanding that equips participants with the necessary skills to excel in any area of Generative AI, regardless of their technical background." 
        },
        { 
            time: "01:38", 
            title: "Certification Course Structure and Updates", 
            desc: "The exam code for the Pro Gen Essentials course is exp geni 001, which is currently viewed as a beta version. The instructor plans to release an updated version, 002, incorporating additional information, although the current course is competitive with other certifications." 
        },
        { 
            time: "02:04", 
            title: "Preparation for Generative AI Boot Camp", 
            desc: "The release of the GenAI Essentials course will initially have some gaps that will be addressed through upcoming updates based on feedback, as the field is rapidly evolving. This certification is designed for those preparing for the free Gen Boot Camp, which requires some coding familiarity for successful completion. Enrolling in the course prior to the boot camp is highly recommended to avoid potential struggles." 
        },
        { 
            time: "02:57", 
            title: "Understanding Generative AI Solutions", 
            desc: "Maximize your learning by taking the GenAI Essentials course, which equips you with broad technical knowledge to navigate various solutions. As the industry evolves, having the flexibility to choose between cloud or local services and understanding implementation costs and security is critical. This course aims to provide the insights needed for informed decision-making, ensuring you can deliver secure and budget-conscious generative workloads." 
        },
        { 
            time: "03:58", 
            title: "Generative AI Implementation and Development", 
            desc: "The focus of this course is on building practical applications for people, leveraging a developer's background to emphasize hands-on learning. It includes lots of implementation and development activities, which can be tackled directly or observed in videos if participants find them challenging." 
        },
        { 
            time: "04:23", 
            title: "Generative AI Roadmap and Learning Model", 
            desc: "The focus is on maximizing knowledge acquisition in minimal time; stress is not encouraged if certain tasks seem overwhelming. The certification course is designed to enhance confidence and provide essential tools for beginners in Generative AI, based on the ProGen maturity learning model." 
        }
    ];

    return (
        <div className="flex-1 w-full pb-20">
            <div className="space-y-3">
                {chapters.map((ch, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="dark:bg-[#161616] bg-white border dark:border-white/5 border-neutral-200 rounded-[16px] p-5 transition-all duration-200 cursor-pointer group hover:bg-[#1f1f1f] hover:border-neutral-500/30 dark:hover:border-white/20 hover:shadow-xl hover:scale-[1.005]"
                    >
                        <div className="flex items-center space-x-3 mb-2.5">
                            <span className="px-2 py-0.5 dark:bg-[#222] bg-neutral-200 rounded text-[11px] font-mono font-bold text-gray-500 group-hover:text-white group-hover:bg-green-600 transition-colors duration-300">{ch.time}</span>
                        </div>
                        <h4 className="text-[15px] font-bold dark:text-gray-100 text-neutral-800 mb-2 leading-snug group-hover:text-white transition-colors">{ch.title}</h4>
                        <p className="text-[13px] dark:text-gray-400 text-neutral-600 leading-relaxed group-hover:text-gray-300 transition-colors">{ch.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const TranscriptList = () => {
    const transcripts = [
        { t: "00:00", text: "hey it's Andrew Brown and welcome to the free generative AI Essentials course the purpose of this course is to give you comprehensive knowledge so that you can go and start building generative AI applications and in particular this is the prerequisite course for my free gen boot camp where we actually go out and build real projects so I hope you're as excited as I am and you're able to get as as through much of this content uh so you can go build projects with me and I will see you soon okay [Music]" },
        { t: "00:33", text: "hey everyone it's Andrew Brown and welcome to the start of our journey asking the most important question which is first which is what is the genis uh genis gen Essentials certification so this is a practical gen certification teaching you the fundamental concepts of ml AI gen all modalities of gen with a strong focus on llms programmatically working with J workloads uh both with cloud and local l M and it is a cloud vendor agnostic approach so there are other geni certifications out there it us has one" },
        { t: "01:07", text: "Azure has one Nvidia has one and you know what I've made courses for them all and they're okay but they're very very specific to those vendors and they leave out huge huge gaps and they have all these expectations of what you should already know in order to um uh uh to start building with Gen and so the purpose I made this gen Essentials course is so that you have round uh round and Broad knowledge so that you can be successful in any area of gen no matter the technical choice" },
        { t: "01:38", text: "and to me that is super super important I'm going to get my head out of the way here so the course code for the exam Pro gen Essentials is exp geni 001 I do want to point out that this course I kind of feel as like a beta course at this point and so I'm hoping at some point I will release a version 002 and include all of the information that I want to actually include in this course course it's still really good comparative to other certifications it'll definitely blow it" },
        { t: "02:04", text: "out of the water but I you know I just want to say that the release of this course will have some gaps and they will be addressed in minor updates as we receive feedback so pay attention to updates or upcoming road maps um for this content because this is not a oneandone course we're going to have to come back to it and continuously update it because gen is moving very very quickly okay but let's continue on so who's the certification for we'll consider the examp Pro gen Essentials if" },
        { t: "02:31", text: "you are preparing for the preit knowledge to take the free gen boot camp so you can be successful in its completion and Grading for my boot camps we go and we build we hit the ground running and so my expectation is that you can code you have General familiarity with the stuff you have uh knowledge under you so this thing is going to prepare you if you do not take this course before my free gen boot camp you're going to be struggling a little bit uh you can still do the free gen" },
        { t: "02:57", text: "boot camp but um you if you want to maximize uh uh how much you learn please please please go through this course um and it's going to help you out okay uh another reason you should consider taking the uh exam Pro gen Essentials if you need Broad and practical knowledge understanding gen Solutions so you have the technical flexibility to move in any technical Direction right now geni we don't know what direction it's going do you use cloud services do you do local local LMS should you be fine tuning should you be" },
        { t: "03:27", text: "using rag um how much does it cost how do you secure it there's so many questions um that uh that that need to be answered and this is my explo exploration think of it like a CTO trying to explore and evaluate for for the company I'm coming back to you with all that information so that you can make informed decisions and have confidence building with jny so I'm hoping that's what I achieve throughout this course you need to focus on implementation deliver gen workloads that are both secure and in budget at" }
    ];

    return (
        <div className="flex-1 w-full pb-20">
            <div className="space-y-3">
                {transcripts.map((item, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        key={i} 
                        className="dark:bg-[#161616] bg-white border dark:border-white/5 border-neutral-200 rounded-[16px] p-5 transition-all duration-200 cursor-pointer group hover:bg-[#1f1f1f] hover:border-neutral-500/30 dark:hover:border-white/20 hover:shadow-xl hover:scale-[1.005]"
                    >
                        <span className="inline-block px-2 py-0.5 mb-2 dark:bg-[#222] bg-neutral-200 rounded text-[11px] font-mono font-bold text-gray-500 group-hover:text-white group-hover:bg-green-600 transition-colors duration-300">{item.t}</span>
                        <p className="text-[14px] dark:text-gray-300 text-neutral-700 leading-relaxed group-hover:dark:text-gray-100 transition-colors">{item.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const CinematicContentPanel: React.FC<{ course: HistoryItem, onBack?: () => void, isFullWidth: boolean }> = ({ course, onBack, isFullWidth }) => {
    const [activeTab, setActiveTab] = useState<'Chapters' | 'Transcripts'>('Chapters');
    const [isShrunk, setIsShrunk] = useState(false);
    
    // Add scroll handler to detect when to shrink video - Only for Structured Courses
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!course.isStructured) return;

        const threshold = 60;
        if (e.currentTarget.scrollTop > threshold && !isShrunk) {
            setIsShrunk(true);
        } else if (e.currentTarget.scrollTop <= threshold && isShrunk) {
            setIsShrunk(false);
        }
    };

    // --- Dimension Logic ---
    
    const isStructured = course.isStructured;

    const getVideoHeight = () => {
        if (isStructured) {
            return isShrunk ? 100 : 450;
        }
        // Unstructured behavior (as previous)
        if (isFullWidth) return '55vh';
        return 'auto';
    };

    const getVideoWidth = () => {
        if (isStructured) {
            // Always keep some padding/margins for structured course
            return 'calc(100% - 3rem)'; 
        }
        // Unstructured
        if (isFullWidth) return '100%';
        return 'calc(100% - 2rem)';
    };

    const getVideoRadius = () => {
        if (isStructured) {
            // Always rounded for structured
            return 24;
        }
        // Unstructured
        if (isFullWidth) return 0;
        return 24;
    };

    const getVideoMargin = () => {
        if (isStructured) {
            // Always margin for structured
            return '1.5rem auto';
        }
        // Unstructured
        if (isFullWidth) return 0;
        return '1rem auto';
    };

    const getAspectRatio = () => {
        if (isStructured) return 'unset';
        if (isFullWidth) return 'unset';
        return '16/9';
    }

    return (
        <div className="flex-1 flex flex-col h-full dark:bg-black bg-white overflow-hidden relative">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b dark:border-white/10 border-neutral-200 shrink-0 z-30 bg-white dark:bg-black transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                    <button 
                        onClick={onBack} 
                        className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold dark:text-white text-black truncate pr-4">
                        {course.title}
                    </h1>
                </div>
            </header>

            {/* Video Player Container - Animates layout props */}
            <motion.div 
                layout
                initial={false}
                animate={{ 
                    height: getVideoHeight(),
                    borderRadius: getVideoRadius(),
                }}
                style={{
                    width: getVideoWidth(),
                    margin: getVideoMargin(),
                    alignSelf: 'center',
                    aspectRatio: getAspectRatio()
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`overflow-hidden bg-black shadow-2xl relative shrink-0 group z-20`}
            >
                <iframe className="w-full h-full" src={course.videoUrl} title="Video" frameBorder="0" allowFullScreen></iframe>
            </motion.div>

            {/* Scrollable Content Area */}
            <div 
                className="flex-1 overflow-y-auto custom-scrollbar w-full z-10"
                onScroll={handleScroll}
            >
                <div className={`w-full mx-auto ${isFullWidth && !isStructured ? 'px-8' : 'px-4 max-w-[1600px]'} transition-all duration-300`}>
                    {/* Sub-Video Tabs Bar */}
                    <div className="flex items-center justify-between py-4 shrink-0 gap-4 flex-wrap w-full sticky top-0 bg-white dark:bg-black z-10">
                        <div className="flex items-center space-x-1 dark:bg-white/5 bg-neutral-100 p-1 rounded-full border dark:border-white/5 border-neutral-200">
                            <button 
                                onClick={() => setActiveTab('Chapters')}
                                className={`flex items-center space-x-2.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'Chapters' ? 'dark:bg-white/10 bg-white dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {activeTab === 'Chapters' ? (
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                ) : (
                                    <BookOpenIcon className="w-4 h-4" />
                                )}
                                <span>Chapters</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('Transcripts')}
                                className={`flex items-center space-x-2.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'Transcripts' ? 'dark:bg-white/10 bg-white dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {activeTab === 'Transcripts' ? (
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                ) : (
                                    <span className="text-sm font-bold opacity-60 font-serif">T</span>
                                )}
                                <span>Transcripts</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-2 px-4 py-2 dark:bg-white/5 bg-neutral-100 border dark:border-white/5 border-neutral-200 rounded-xl text-[12px] font-bold text-gray-300 hover:border-gray-600 transition-colors">
                                <div className="w-3.5 h-3.5 border-2 border-gray-600 rounded-sm" />
                                <span>Auto Scroll</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full min-h-0">
                        <div className="w-full max-w-5xl flex flex-col">
                            <AnimatePresence mode="wait">
                                {activeTab === 'Chapters' ? (
                                    <motion.div 
                                        key="chapters" 
                                        initial={{ opacity: 0, x: -20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: -20 }} 
                                        className="w-full flex flex-col"
                                    >
                                        <ChapterList />
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="transcripts" 
                                        initial={{ opacity: 0, x: 20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: 20 }} 
                                        className="w-full flex flex-col"
                                    >
                                        <TranscriptList />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseraSidebar = ({ title, onClose, onBack }: { title: string, onClose: () => void, onBack?: () => void }) => {
    const [activeItemId, setActiveItemId] = useState('data-analytics-everyday');
    const [expandedModules, setExpandedModules] = useState<string[]>(['mod1']);

    const toggleModule = (modId: string) => {
        setExpandedModules(prev => prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]);
    };

    const modules = [
        {
            id: 'mod1',
            title: 'Module 1',
            subtitle: 'Introducing data analytics and analytical thinking',
            locked: false,
            items: [
                { id: 'welcome', name: 'Welcome to the Google Data Analytics Certificate', duration: '9 min', type: 'Video', completed: true },
                { id: 'overview', name: 'Course 1 overview: Set your expectations', duration: '8 min', type: 'Reading', completed: true },
                { id: 'intro', name: 'Introduction to the course', duration: '4 min', type: 'Video', completed: true },
                { id: 'get-started', name: 'Get started with your Google Data Analytics Certificate', duration: '2 min', type: 'Video', completed: true },
                { id: 'resources', name: 'Helpful resources and tips', duration: '4 min', type: 'Reading', completed: true },
                { id: 'evaluate', name: 'Evaluate your current data analytics skills', duration: '4 min', type: 'Reading', completed: true },
                { id: 'survey', name: 'Google Data Analytics Certificate participant entry survey', duration: '10 min', type: 'Ungraded Plugin', completed: false },
                { id: 'data-analytics-everyday', name: 'Data analytics in everyday life', duration: '4 min', type: 'Video', completed: false }, // ACTIVE
                { id: 'identify-data', name: 'Identify data types in a spreadsheet', duration: '30 min', type: 'Practice Assignment', completed: false },
                { id: 'new-perspectives', name: 'New data perspectives', duration: '8 min', type: 'Reading', completed: false },
                { id: 'approach-tasks', name: 'How data analysts approach tasks', duration: '8 min', type: 'Reading', completed: false },
                { id: 'dimensions', name: 'Cassie: Dimensions of data analytics', duration: '4 min', type: 'Video', completed: false },
                { id: 'origins', name: 'Origins of the data analysis process', duration: '8 min', type: 'Reading', completed: false },
                { id: 'ecosystem', name: 'What is the data ecosystem?', duration: '4 min', type: 'Video', completed: false },
                { id: 'informs-decisions', name: 'How data informs better decisions', duration: '4 min', type: 'Video', completed: false },
                { id: 'expect-moving', name: 'What to expect moving forward', duration: '1 min', type: 'Video', completed: false },
                { id: 'glossary', name: 'Glossary terms from course 1, module 1', duration: '4 min', type: 'Reading', completed: false },
                { id: 'strategies', name: 'Assessment-taking strategies', duration: '4 min', type: 'Reading', completed: false },
                { id: 'challenge', name: 'Module 1 challenge', duration: '40 min', type: 'Graded Assignment', completed: false },
            ]
        },
        {
            id: 'mod2',
            title: 'Module 2',
            subtitle: 'The wonderful world of data',
            locked: true,
            items: []
        },
        {
            id: 'mod3',
            title: 'Module 3',
            subtitle: 'Set up your data analytics toolbox',
            locked: true,
            items: []
        },
        {
            id: 'mod4',
            title: 'Module 4',
            subtitle: 'Become a fair and impactful data professional',
            locked: true,
            items: []
        }
    ];

    return (
        <aside className="w-[350px] shrink-0 h-full border-r dark:border-white/10 border-neutral-200 overflow-y-auto bg-white dark:bg-[#0d0d0d] custom-scrollbar flex flex-col relative z-20">
             <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onBack} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-black dark:hover:text-white">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-black dark:hover:text-white">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <h2 className="text-[17px] font-bold dark:text-blue-500 text-blue-700 leading-snug">{title}</h2>
             </div>

             <div className="flex-1">
                {modules.map((mod) => (
                    <div key={mod.id} className={`border-t dark:border-white/5 border-neutral-100 ${mod.locked ? 'bg-neutral-50 dark:bg-[#111]' : ''}`}>
                        <button 
                            onClick={() => !mod.locked && toggleModule(mod.id)}
                            className={`w-full p-4 flex items-start justify-between cursor-pointer text-left ${mod.locked ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}
                        >
                            <div className="flex-1 pr-4">
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">{mod.title}</span>
                                <h4 className="text-[15px] font-bold dark:text-white text-black leading-tight">{mod.subtitle}</h4>
                            </div>
                            <div className="mt-1">
                                {mod.locked ? (
                                    <LockClosedIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedModules.includes(mod.id) ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        </button>

                        <AnimatePresence initial={false}>
                            {expandedModules.includes(mod.id) && !mod.locked && (
                                <motion.div 
                                    initial={{ height: 0 }} 
                                    animate={{ height: 'auto' }} 
                                    exit={{ height: 0 }} 
                                    className="overflow-hidden"
                                >
                                    {mod.items.map((item) => {
                                        const isActive = activeItemId === item.id;
                                        return (
                                            <button 
                                                key={item.id} 
                                                onClick={() => setActiveItemId(item.id)}
                                                className={`group flex items-start w-full text-left py-3.5 transition-all relative ${isActive ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}
                                            >
                                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                                                <div className="flex shrink-0 mt-0.5 ml-5 mr-3">
                                                    {item.completed ? (
                                                        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                                                            <CheckCircleIcon className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${isActive ? 'border-blue-600' : 'border-neutral-300 dark:border-gray-600'}`} />
                                                    )}
                                                </div>
                                                <div className="pr-4">
                                                    <p className={`text-[13px] font-medium leading-tight mb-1 ${isActive ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[11px] text-gray-500 font-medium flex items-center">
                                                        <span>{item.type}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{item.duration}</span>
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
             </div>
        </aside>
    );
};

// --- Main Workspace with Resizable Divider ---

const Workspace: React.FC<WorkspaceProps> = ({ course, onBack }) => {
    const [panelWidth, setPanelWidth] = useState(480);
    const [isResizing, setIsResizing] = useState(false);
    const [isTutorOpen, setIsTutorOpen] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    
    // Structured Sidebar State
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

    const startResizing = useCallback((e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 320 && newWidth < window.innerWidth * 0.7) {
                setPanelWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div className={`flex h-full w-full overflow-hidden dark:bg-black bg-white transition-colors duration-300 relative ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
            
            {/* Global Workspace Header - Top Right (Upgrade & Share) - Always Visible, Highest Z-Index */}
            <div className="absolute top-4 right-6 z-[60] flex items-center gap-2">
                <button 
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="px-4 py-1.5 rounded-full border border-green-800 bg-green-900/20 text-green-500 hover:bg-green-900/40 font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm"
                >
                    Upgrade
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border dark:border-white/10 border-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300 text-xs font-bold rounded-lg transition-colors bg-white dark:bg-black">
                    <ShareIcon className="w-3.5 h-3.5" />
                    Share
                </button>
            </div>

            {/* Left Sidebar (For Structured Courses Only) */}
            <AnimatePresence mode="wait">
                {course.isStructured && isLeftSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 350, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="h-full shrink-0 relative z-30"
                    >
                        <CourseraSidebar title={course.title} onClose={() => setIsLeftSidebarOpen(false)} onBack={onBack} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Middle Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                 {/* Left Sidebar Toggle Button (Only when structured and closed) */}
                 {course.isStructured && !isLeftSidebarOpen && (
                    <div className="absolute top-4 left-4 z-50">
                         <button 
                            onClick={() => setIsLeftSidebarOpen(true)}
                            className="p-2 bg-white dark:bg-[#1a1a1a] rounded-full shadow-md border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <ViewSidebarIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <CinematicContentPanel 
                    course={course} 
                    onBack={onBack} 
                    isFullWidth={!isTutorOpen && (!course.isStructured || !isLeftSidebarOpen)} 
                />
            </div>
            
            {/* Right Panel Resizer */}
            {isTutorOpen && (
                <div 
                    onMouseDown={startResizing}
                    className="w-1.5 hover:w-2 bg-transparent hover:bg-blue-500/20 cursor-col-resize transition-all shrink-0 z-50 group flex items-center justify-center"
                >
                    <div className="w-px h-full bg-neutral-200 dark:bg-white/5 group-hover:bg-blue-500/50" />
                </div>
            )}

            {/* Right Tutor Panel - Visible in both Structured and Unstructured modes */}
            <AnimatePresence mode="wait">
                {isTutorOpen && (
                    <motion.div 
                        initial={{ width: panelWidth, opacity: 1 }}
                        animate={{ width: panelWidth, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{ width: panelWidth }} 
                        className="shrink-0 h-full overflow-hidden"
                    >
                        <TutorPanel isPanelExpanded={false} setIsPanelExpanded={() => {}} isCoachMode={false} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Sidebar FAB (Using SparkleIcon) - Z-Index lower than global buttons but higher than content */}
            <motion.button 
                onClick={() => setIsTutorOpen(!isTutorOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`absolute bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50 transition-all border-2 ${
                    isTutorOpen 
                    ? 'bg-white text-black border-transparent hover:border-gray-300' 
                    : 'bg-black dark:bg-white text-white dark:text-black border-transparent hover:border-gray-500'
                }`}
            >
                 <SparkleIcon className="w-8 h-8" />
            </motion.button>

            <AnimatePresence>
                {isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} onNavigateToPricing={() => {}} />}
            </AnimatePresence>
        </div>
    );
};

export default Workspace;
