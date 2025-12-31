
import React, { useState, useCallback, useEffect, useRef } from 'react';
import TutorPanel from './TutorPanel';
import { ChevronLeftIcon, ArrowUpIcon, ChevronDownIcon, BookOpenIcon, DoubleChevronUpIcon, DoubleChevronDownIcon, CopyIcon } from './icons';
import { HistoryItem } from './Dashboard';

interface WorkspaceProps {
    course: HistoryItem;
    showHeader: boolean;
}

const CourseHeader: React.FC<{ course: HistoryItem }> = ({ course }) => {
    return (
        <header className="flex items-center space-x-3 px-4 py-2.5 border-b dark:border-white/5 border-neutral-200 shrink-0">
             <button className="p-2 mr-2 dark:hover:bg-white/5 rounded-lg transition-colors">
                <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-[10px] text-white font-bold">S</div>
                <h1 className="text-sm font-bold dark:text-gray-200" style={{ fontFamily: "'Lora', serif" }}>
                    {course.title}
                </h1>
            </div>
        </header>
    );
};

const VideoPlayer: React.FC<{ course: HistoryItem, isCollapsed: boolean, onToggleCollapse: () => void }> = ({ course, isCollapsed, onToggleCollapse }) => {
    const [activeTab, setActiveTab] = useState('Chapters');
    const [activeChapterIndex, setActiveChapterIndex] = useState(0); 
    const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0);
    
    return (
        <div className="flex flex-col h-full overflow-hidden w-full ml-auto">
            {!isCollapsed && (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative mb-6 border dark:border-white/5 shrink-0 transition-all duration-200">
                    <iframe
                        className="w-full h-full"
                        src={course.videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="flex items-center space-x-2 dark:bg-white/5 bg-neutral-100 p-1.5 rounded-full border dark:border-white/5">
                        <button 
                            onClick={() => setActiveTab('Chapters')} 
                            className={`flex items-center space-x-2.5 px-6 py-2.5 rounded-full text-[14px] font-bold transition-all ${activeTab === 'Chapters' ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-md' : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            {activeTab === 'Chapters' ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                            ) : (
                                <BookOpenIcon className="w-4.5 h-4.5" />
                            )}
                            <span>Chapters</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('Transcripts')} 
                            className={`flex items-center space-x-2.5 px-6 py-2.5 rounded-full text-[14px] font-bold transition-all ${activeTab === 'Transcripts' ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-md' : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            {activeTab === 'Transcripts' ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                            ) : (
                                <div className="text-md font-black w-4.5 text-center">T</div>
                            )}
                            <span>Transcripts</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                         {activeTab === 'Transcripts' && (
                             <button className="p-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 text-gray-500 hover:text-white transition-all">
                                <CopyIcon className="w-5 h-5" />
                            </button>
                         )}
                        <button className="flex items-center space-x-3 px-6 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 text-[14px] font-bold text-gray-500 hover:text-white transition-all">
                            <div className="flex flex-col -space-y-1.5 opacity-60">
                                <ChevronDownIcon className="w-3.5 h-3.5 rotate-180" />
                                <ChevronDownIcon className="w-3.5 h-3.5" />
                            </div>
                            <span>Auto Scroll</span>
                        </button>
                         <button 
                            onClick={onToggleCollapse}
                            className="p-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 text-gray-500 hover:text-white transition-all"
                         >
                            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    {activeTab === 'Chapters' ? (
                        <div className="space-y-8">
                             <div className={`space-y-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${activeChapterIndex === 0 ? 'dark:bg-white/[0.04] bg-neutral-100 dark:border-white/10 border-neutral-300 shadow-sm scale-[1.01]' : 'border-transparent'}`} onClick={() => setActiveChapterIndex(0)}>
                                <div className="flex items-center space-x-4">
                                    <span className="text-[11px] font-bold text-gray-500 dark:bg-white/5 border dark:border-white/5 px-3 py-1 rounded-lg">00:00</span>
                                </div>
                                <h2 className="text-xl font-bold dark:text-white text-black leading-tight">Generative AI Essentials Course Overview</h2>
                                <p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed font-medium">Andrew Brown introduces the free Generative AI Essentials course designed to provide essential knowledge for building generative AI applications. This course serves as a prerequisite for his free gen boot camp, where participants will engage in hands-on project building.</p>
                             </div>
                             
                             <div className={`space-y-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${activeChapterIndex === 1 ? 'dark:bg-white/[0.04] bg-neutral-100 dark:border-white/10 border-neutral-300 shadow-sm scale-[1.01]' : 'border-transparent'}`} onClick={() => setActiveChapterIndex(1)}>
                                <div className="flex items-center space-x-4">
                                    <span className="text-[11px] font-bold text-gray-500 dark:bg-white/5 border dark:border-white/5 px-3 py-1 rounded-lg">00:33</span>
                                </div>
                                <h2 className="text-xl font-bold dark:text-white text-black leading-tight">Generative AI Certification Introduction</h2>
                                <p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed font-medium">Andrew Brown introduces the GenAI Essentials certification, a practical course focused on fundamental concepts of machine learning and AI, emphasizing large language models and their applications. This certification takes a cloud vendor-agnostic approach.</p>
                             </div>

                             <div className={`space-y-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${activeChapterIndex === 2 ? 'dark:bg-white/[0.04] bg-neutral-100 dark:border-white/10 border-neutral-300 shadow-sm scale-[1.01]' : 'border-transparent'}`} onClick={() => setActiveChapterIndex(2)}>
                                <div className="flex items-center space-x-4">
                                    <span className="text-[11px] font-bold text-gray-500 dark:bg-white/5 border dark:border-white/5 px-3 py-1 rounded-lg">01:07</span>
                                </div>
                                <h2 className="text-xl font-bold dark:text-white text-black leading-tight">Purpose of Generative AI Essentials Course</h2>
                                <p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed font-medium">Current courses on GenAI are tailored to specific vendors and often assume prior knowledge, creating significant gaps for learners. The Gen Essentials course aims to provide a comprehensive understanding that equips participants with skills to excel.</p>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-8 pb-12">
                             <div className={`flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${activeTranscriptIndex === 0 ? 'dark:bg-white/[0.04] bg-neutral-100 dark:border-white/10 border-neutral-300 shadow-sm scale-[1.01]' : 'border-transparent'}`} onClick={() => setActiveTranscriptIndex(0)}>
                                <div className="flex items-center">
                                    <span className="text-[11px] font-bold text-gray-500 dark:bg-white/5 border dark:border-white/5 px-3 py-1 rounded-lg">00:00</span>
                                </div>
                                <p className="text-md dark:text-gray-200 text-neutral-800 leading-relaxed font-medium">hey it's Andrew Brown and welcome to the free generative AI Essentials course the purpose of this course is to give you comprehensive knowledge so that you can go and start building generative AI applications and in particular this is the prerequisite course for my free gen boot camp where we actually go out and build real projects...</p>
                             </div>

                             <div className={`flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${activeTranscriptIndex === 1 ? 'dark:bg-white/[0.04] bg-neutral-100 dark:border-white/10 border-neutral-300 shadow-sm scale-[1.01]' : 'border-transparent'}`} onClick={() => setActiveTranscriptIndex(1)}>
                                <div className="flex items-center">
                                    <span className="text-[11px] font-bold text-gray-500 dark:bg-white/5 border dark:border-white/5 px-3 py-1 rounded-lg">00:33</span>
                                </div>
                                <p className="text-md dark:text-gray-200 text-neutral-800 leading-relaxed font-medium">hey everyone it's Andrew Brown and welcome to the start of our journey asking the most important question which is first which is what is the genis uh genis gen Essentials certification so this is a practical gen certification teaching you the fundamental concepts of ml AI gen all modalities of gen with a strong focus on llms...</p>
                             </div>

                             <div className={`flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${activeTranscriptIndex === 2 ? 'dark:bg-white/[0.04] bg-neutral-100 dark:border-white/10 border-neutral-300 shadow-sm scale-[1.01]' : 'border-transparent'}`} onClick={() => setActiveTranscriptIndex(2)}>
                                <div className="flex items-center">
                                    <span className="text-[11px] font-bold text-gray-500 dark:bg-white/5 border dark:border-white/5 px-3 py-1 rounded-lg">01:07</span>
                                </div>
                                <p className="text-md dark:text-gray-200 text-neutral-800 leading-relaxed font-medium">Azure has one Nvidia has one and you know what I've made courses for them all and they're okay but they're very very specific to those vendors and they leave out huge huge gaps and they have all these expectations of what you should already know in order to um uh uh to start building with Gen...</p>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Workspace: React.FC<WorkspaceProps> = ({ course, showHeader }) => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const [splitWidth, setSplitWidth] = useState(50);
    const [isVideoCollapsed, setIsVideoCollapsed] = useState(false);
    const isResizing = useRef(false);

    const startResizing = useCallback(() => {
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
    }, []);

    const stopResizing = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 80) {
            setSplitWidth(newWidth);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden dark:bg-[#0a0a0a] bg-white transition-colors duration-300">
            {showHeader && <CourseHeader course={course} />}
            <div className="flex-1 flex gap-0 overflow-hidden relative">
                <div 
                    className="h-full flex flex-col pt-1 pl-6 pr-2 overflow-hidden"
                    style={{ width: `${splitWidth}%` }}
                >
                    <VideoPlayer 
                        course={course} 
                        isCollapsed={isVideoCollapsed} 
                        onToggleCollapse={() => setIsVideoCollapsed(!isVideoCollapsed)} 
                    />
                </div>
                <div 
                    onMouseDown={startResizing}
                    className="w-1 flex flex-col items-center justify-center cursor-col-resize z-20 group relative"
                >
                    <div className="w-[1px] h-full dark:bg-white/[0.03] bg-neutral-200 group-hover:bg-orange-500 transition-colors"></div>
                </div>
                <div 
                    className="h-full flex flex-col pt-1 pl-2 pr-6 overflow-hidden"
                    style={{ width: `${100 - splitWidth}%` }}
                >
                    <TutorPanel isPanelExpanded={isPanelExpanded} setIsPanelExpanded={setIsPanelExpanded} />
                </div>
            </div>
        </div>
    );
};

export default Workspace;
