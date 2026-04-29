import React, { useState, useCallback, useEffect, useRef } from 'react';
import TutorPanel from './TutorPanel';
import TutorPanelErrorBoundary from './TutorPanelErrorBoundary';
import { 
    ChevronLeftIcon, DoubleChevronUpIcon, DoubleChevronDownIcon, SparkleIcon, ChevronDownIcon, CheckCircleIcon,
    FileTextIcon, LockClosedIcon, XIcon, ViewSidebarIcon, MaximizeIcon, MinimizeIcon, BookOpenIcon, ShareIcon
} from './icons';
import { HistoryItem } from './Dashboard';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { UpgradeModal } from './modals';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}



interface WorkspaceProps {
    course: HistoryItem;
    showHeader: boolean;
    onBack?: () => void;
}

interface TranscriptItem {
    start: number;
    text: string;
    duration?: number;
}

interface Chapter {
    title: string;
    time: string;
    desc: string;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
};

const MOCK_CHAPTERS: Chapter[] = [
    { time: "00:00", title: "Introduction", desc: "Welcome to the course overview and what you'll learn." },
    { time: "02:30", title: "Getting Started", desc: "Setting up your environment and prerequisites." },
    { time: "05:00", title: "Core Concepts", desc: "Deep dive into the main topics and fundamentals." },
    { time: "10:00", title: "Practical Examples", desc: "Hands-on examples and code demonstrations." },
    { time: "15:00", title: "Advanced Topics", desc: "Advanced techniques and best practices." },
    { time: "20:00", title: "Conclusion", desc: "Summary and next steps for learning." }
];

const MOCK_TRANSCRIPTS: TranscriptItem[] = [
    { start: 0, text: "Welcome to this comprehensive course. In this video, we'll cover all the essential topics you need to get started." },
    { start: 5, text: "Let's begin by understanding the fundamental concepts that will serve as the foundation for your learning journey." },
    { start: 10, text: "Now let's dive into the practical examples that will help you apply what you've learned in real-world scenarios." },
    { start: 15, text: "As we move forward, we'll explore more advanced topics and techniques that will take your skills to the next level." },
    { start: 20, text: "Thank you for watching! Don't forget to like and subscribe for more content." }
];

const groupTranscripts = (transcripts: TranscriptItem[], itemsPerGroup: number = 5): TranscriptItem[] => {
    if (transcripts.length === 0) return [];
    const grouped: TranscriptItem[] = [];
    for (let i = 0; i < transcripts.length; i += itemsPerGroup) {
        const group = transcripts.slice(i, i + itemsPerGroup);
        const combinedText = group.map(t => t.text).join(' ');
        grouped.push({
            start: group[0].start,
            text: combinedText,
            duration: group.reduce((sum, t) => sum + (t.duration || 0), 0)
        });
    }
    return grouped;
};

const ChapterList: React.FC<{ chapters: Chapter[]; currentTime: number; onChapterClick: (time: number) => void; autoScroll: boolean }> = ({ chapters, currentTime, onChapterClick, autoScroll }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeIndex = chapters.findIndex((ch, i) => {
        const currentChapterTime = parseTimeToSeconds(ch.time);
        const nextChapterTime = i < chapters.length - 1 ? parseTimeToSeconds(chapters[i + 1].time) : Infinity;
        return currentTime >= currentChapterTime && currentTime < nextChapterTime;
    });

    useEffect(() => {
        if (autoScroll && activeIndex !== -1 && containerRef.current) {
            const elements = containerRef.current.children;
            if (elements[activeIndex]) {
                (elements[activeIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeIndex, autoScroll]);

    return (
        <div className="flex-1 w-full pb-20">
            <div className="space-y-3" ref={containerRef}>
                {chapters.map((ch, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i} 
                            onClick={() => onChapterClick(parseTimeToSeconds(ch.time))}
                            className={`dark:bg-[#161616] bg-white border dark:border-white/5 border-neutral-200 rounded-[16px] p-5 transition-all duration-200 cursor-pointer group hover:bg-[#1f1f1f] hover:border-neutral-500/30 dark:hover:border-white/20 hover:shadow-xl hover:scale-[1.005] ${isActive ? 'bg-green-900/20 border-green-500/50' : ''}`}
                        >
                            <div className="flex items-center space-x-3 mb-2.5">
                                <span className={`px-2 py-0.5 dark:bg-[#222] bg-neutral-200 rounded text-[11px] font-mono font-bold transition-colors duration-300 ${isActive ? 'bg-green-600 text-white' : 'text-gray-500 group-hover:text-white group-hover:bg-green-600'}`}>{ch.time}</span>
                            </div>
                            <h4 className={`text-[15px] font-bold mb-2 leading-snug transition-colors ${isActive ? 'dark:text-green-400 text-green-700' : 'dark:text-gray-100 text-neutral-800 group-hover:text-white'}`}>{ch.title}</h4>
                            <p className={`text-[13px] leading-relaxed transition-colors ${isActive ? 'dark:text-green-300 text-green-800' : 'dark:text-gray-400 text-neutral-600 group-hover:text-gray-300'}`}>{ch.desc}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const TranscriptList: React.FC<{ transcripts: TranscriptItem[]; currentTime: number; onTranscriptClick: (time: number) => void; autoScroll: boolean }> = ({ transcripts, currentTime, onTranscriptClick, autoScroll }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const activeIndex = transcripts.findIndex((t, i) => {
        const nextStart = i < transcripts.length - 1 ? transcripts[i + 1].start : Infinity;
        return currentTime >= t.start && currentTime < nextStart;
    });

    useEffect(() => {
        if (autoScroll && activeIndex !== -1 && containerRef.current) {
            const elements = containerRef.current.children;
            if (elements[activeIndex]) {
                (elements[activeIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeIndex, autoScroll]);

    return (
        <div className="flex-1 w-full pb-20">
            <div className="space-y-3" ref={containerRef}>
                {transcripts.map((item, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            key={i} 
                            onClick={() => onTranscriptClick(item.start)}
                            className={`dark:bg-[#161616] bg-white border dark:border-white/5 border-neutral-200 rounded-[16px] p-5 transition-all duration-200 cursor-pointer group hover:bg-[#1f1f1f] hover:border-neutral-500/30 dark:hover:border-white/20 hover:shadow-xl hover:scale-[1.005] ${isActive ? 'bg-green-900/20 border-green-500/50' : ''}`}
                        >
                            <span className={`inline-block px-2 py-0.5 mb-2 dark:bg-[#222] bg-neutral-200 rounded text-[11px] font-mono font-bold transition-colors duration-300 ${isActive ? 'bg-green-600 text-white' : 'text-gray-500 group-hover:text-white group-hover:bg-green-600'}`}>{formatTime(item.start)}</span>
                            <p className={`text-[14px] leading-relaxed transition-colors ${isActive ? 'dark:text-green-300 text-green-800' : 'dark:text-gray-300 text-neutral-700 group-hover:dark:text-gray-100'}`}>{item.text}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

interface CinematicContentPanelProps {
    course: HistoryItem;
    onBack?: () => void;
    isFullWidth: boolean;
    externalSeekRef?: React.MutableRefObject<((seconds: number) => void) | null> | React.RefObject<((seconds: number) => void) | null>;
}

const CinematicContentPanel: React.FC<CinematicContentPanelProps> = ({ course, onBack, isFullWidth, externalSeekRef }) => {
    const [activeTab, setActiveTab] = useState<'Chapters' | 'Transcripts'>('Chapters');
    const [isShrunk, setIsShrunk] = useState(false);
    const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);
    const [isGeneratingChapters, setIsGeneratingChapters] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const playerRef = useRef<any>(null);
    const [videoId, setVideoId] = useState<string>('');
    const [playerReady, setPlayerReady] = useState(false);

    useEffect(() => {
        const extractVideoId = (url: string): string => {
            const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            return match ? match[1] : '';
        };
        const id = extractVideoId(course.videoUrl);
        setVideoId(id);
    }, [course.videoUrl]);

    useEffect(() => {
        if (!videoId) return;
        
        const loadYouTubeAPI = () => {
            if (window.YT && window.YT.Player) {
                createPlayer();
                return;
            }
            
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            
            window.onYouTubeIframeAPIReady = () => {
                createPlayer();
            };
        };
        
        const createPlayer = () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
            
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId: videoId,
                events: {
                    'onReady': () => {
                        setPlayerReady(true);
                        setCurrentTime(0);
                    },
                    'onStateChange': (event: any) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            startTimeTracking();
                        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                            stopTimeTracking();
                        }
                    }
                }
            });
        };
        
        let timeInterval: NodeJS.Timeout;
        const startTimeTracking = () => {
            if (timeInterval) clearInterval(timeInterval);
            timeInterval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                }
            }, 250);
        };
        
        const stopTimeTracking = () => {
            if (timeInterval) {
                clearInterval(timeInterval);
                timeInterval = undefined;
            }
        };
        
        loadYouTubeAPI();
        
        return () => {
            if (timeInterval) clearInterval(timeInterval);
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    // Expose seek function to parent via ref
    useEffect(() => {
        if (externalSeekRef && playerRef.current) {
            externalSeekRef.current = (seconds: number) => {
                if (playerRef.current) {
                    playerRef.current.seekTo(seconds, 'seconds');
                }
            };
        }
    }, [externalSeekRef, playerReady]);

    useEffect(() => {
        const fetchData = async () => {
            if (!videoId) return;
            
            console.log('Fetching data for videoId:', videoId);
            setError(null);
            
            // Check localStorage cache first
            const cacheKey = `stephen_transcript_${videoId}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                console.log('Using cached transcript from localStorage');
                try {
                    const cached = JSON.parse(cachedData);
                    const transList = cached?.transcript || [];
                    if (transList.length > 0) {
                        const groupedTrans = groupTranscripts(
                            transList.map((t: any) => ({ start: t.start ?? 0, text: t.text ?? '', duration: t.duration ?? 0 })), 
                            5
                        );
                        setTranscripts(groupedTrans);
                        const chapters = generateFallbackChapters(transList);
                        setChapters(chapters);
                        console.log('Loaded from cache - transcripts:', groupedTrans.length, 'chapters:', chapters.length);
                        return;
                    }
                } catch (e) {
                    console.warn('Corrupted localStorage data for', cacheKey, '- clearing');
                    localStorage.removeItem(cacheKey);
                }
            }
            
            // No cache - fetch from API
            setTranscripts([]);
            setChapters([]);
            
            let transList: any[] = [];
            
            try {
                setIsFetchingTranscript(true);
                const transcriptRes = await fetch(`/api/transcript?videoId=${videoId}`);
                console.log('Transcript response status:', transcriptRes.status);
                console.log('Transcript response headers:', Object.fromEntries(transcriptRes.headers.entries()));
                
                if (!transcriptRes.ok) {
                    const errorText = await transcriptRes.text();
                    console.error('Transcript error response:', errorText);
                    throw new Error(`Transcript API failed: ${transcriptRes.status} - ${errorText}`);
                }
                
                const transcriptData = await transcriptRes.json();
                console.log('Transcript data received:', JSON.stringify(transcriptData).slice(0, 500));
                
                if (Array.isArray(transcriptData)) {
                    transList = transcriptData;
                } else if (Array.isArray(transcriptData.transcript)) {
                    transList = transcriptData.transcript;
                } else if (transcriptData.transcript?.snippets) {
                    transList = transcriptData.transcript.snippets;
                } else if (transcriptData.data) {
                    transList = transcriptData.data;
                } else if (transcriptData.snippets) {
                    transList = transcriptData.snippets;
                }
                
                console.log('Normalized transcript count:', transList.length);
                
                if (transList.length === 0) {
                    setError('No transcript available for this video.');
                } else {
                    // Save to localStorage cache
                    localStorage.setItem(cacheKey, JSON.stringify({ transcript: transList }));
                    console.log('Saved transcript to localStorage');
                    
                    const formattedTrans = transList.map((t: any) => ({ 
                        start: t.start ?? 0, 
                        text: t.text ?? '', 
                        duration: t.duration ?? 0 
                    }));
                    
                    const groupedTrans = groupTranscripts(formattedTrans, 5);
                    setTranscripts(groupedTrans);
                    console.log('Set grouped transcripts:', groupedTrans.length, 'boxes');
                    
                    const fallbackChapters = generateFallbackChapters(transList);
                    setChapters(fallbackChapters);
                    console.log('Generated chapters from transcript:', fallbackChapters.length);
                }
            } catch (err: any) {
                console.error('Transcript fetch error:', err);
                setError(err.message || 'Failed to fetch transcript');
            } finally {
                setIsFetchingTranscript(false);
            }
        };
        
        const generateFallbackChapters = (transList: any[]): Chapter[] => {
            if (transList.length === 0) return [];
            const duration = transList[transList.length - 1].start + transList[transList.length - 1].duration;
            const interval = Math.ceil(duration / 6);
            const chapters: Chapter[] = [];
            const labels = ['Introduction', 'Getting Started', 'Core Concepts', 'Practical Examples', 'Advanced Topics', 'Conclusion'];
            
            for (let i = 0; i < 6; i++) {
                const time = i * interval;
                chapters.push({
                    time: formatTime(time),
                    title: labels[i] || `Part ${i + 1}`,
                    desc: `Timestamp: ${formatTime(time)}`
                });
            }
            return chapters;
        };
        
        fetchData();
    }, [videoId]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!course.isStructured) return;
        const threshold = 60;
        if (e.currentTarget.scrollTop > threshold && !isShrunk) {
            setIsShrunk(true);
        } else if (e.currentTarget.scrollTop <= threshold && isShrunk) {
            setIsShrunk(false);
        }
    };

    const isStructured = course.isStructured;

    const getVideoHeight = () => {
        if (isStructured) return isShrunk ? 100 : 450;
        if (isFullWidth) return '55vh';
        return 'auto';
    };

    const getVideoWidth = () => {
        if (isStructured) return 'calc(100% - 3rem)';
        if (isFullWidth) return '100%';
        return 'calc(100% - 2rem)';
    };

    const getVideoRadius = () => {
        if (isStructured) return 24;
        if (isFullWidth) return 0;
        return 24;
    };

    const getVideoMargin = () => {
        if (isStructured) return '1.5rem auto';
        if (isFullWidth) return 0;
        return '1rem auto';
    };

    const getAspectRatio = () => {
        if (isStructured) return 'unset';
        if (isFullWidth) return 'unset';
        return '16/9';
    };

    const handleProgress = (state: any) => {
        if (state && typeof state.playedSeconds === 'number') {
            setCurrentTime(state.playedSeconds);
        }
    };

    const handleChapterClick = (time: number) => {
        playerRef.current?.seekTo(time, 'seconds');
        setCurrentTime(time);
    };

    const handleTranscriptClick = (time: number) => {
        playerRef.current?.seekTo(time, 'seconds');
        setCurrentTime(time);
    };

    return (
        <div className="flex-1 flex flex-col h-full dark:bg-black bg-white overflow-hidden relative">
            <header className="flex items-center justify-between px-6 py-4 border-b dark:border-white/10 border-neutral-200 shrink-0 z-30 bg-white dark:bg-black transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 transition-colors">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold dark:text-white text-black truncate pr-4">{course.title}</h1>
                </div>
            </header>

            <motion.div 
                layout
                initial={false}
                animate={{ height: getVideoHeight(), borderRadius: getVideoRadius() }}
                style={{ width: getVideoWidth(), margin: getVideoMargin(), alignSelf: 'center', aspectRatio: getAspectRatio() }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden bg-black shadow-2xl relative shrink-0 group z-20"
            >
                {videoId && (
                    <div id="youtube-player" className="w-full h-full" />
                )}
            </motion.div>

            <div className="flex-1 overflow-y-auto custom-scrollbar w-full z-10" onScroll={handleScroll}>
                <div className={`w-full mx-auto ${isFullWidth && !isStructured ? 'px-8' : 'px-4 max-w-[1600px]'} transition-all duration-300`}>
                    <div className="flex items-center justify-between py-4 shrink-0 gap-4 flex-wrap w-full sticky top-0 bg-white dark:bg-black z-10">
                        <div className="flex items-center space-x-1 dark:bg-white/5 bg-neutral-100 p-1 rounded-full border dark:border-white/5 border-neutral-200">
                            <button onClick={() => setActiveTab('Chapters')} className={`flex items-center space-x-2.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'Chapters' ? 'dark:bg-white/10 bg-white dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                {activeTab === 'Chapters' ? <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" /> : <BookOpenIcon className="w-4 h-4" />}
                                <span>Chapters</span>
                            </button>
                            <button onClick={() => setActiveTab('Transcripts')} className={`flex items-center space-x-2.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'Transcripts' ? 'dark:bg-white/10 bg-white dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                {activeTab === 'Transcripts' ? <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" /> : <span className="text-sm font-bold opacity-60 font-serif">T</span>}
                                <span>Transcripts</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setAutoScroll(!autoScroll)} className={`flex items-center space-x-2 px-4 py-2 dark:bg-white/5 bg-neutral-100 border dark:border-white/5 border-neutral-200 rounded-xl text-[12px] font-bold transition-colors ${autoScroll ? 'border-green-500 text-green-500' : 'text-gray-300 hover:border-gray-600'}`}>
                                <div className={`w-3.5 h-3.5 border-2 rounded-sm ${autoScroll ? 'border-green-500 bg-green-500' : 'border-gray-600'}`} />
                                <span>Auto Scroll</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full min-h-0">
                        <div className="w-full max-w-5xl flex flex-col">
                            {error && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <p className="text-red-500 dark:text-red-400 text-sm font-medium mb-2">{error}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">Try another video or check if captions are available.</p>
                                </div>
                            )}
                            
                            {isFetchingTranscript && !error && (
                                <div className="flex items-center justify-center py-10">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Fetching transcript...</span>
                                    </div>
                                </div>
                            )}
                            
                            {isGeneratingChapters && !error && (
                                <div className="flex items-center justify-center py-10">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Generating chapters...</span>
                                    </div>
                                </div>
                            )}
                            
                            {!isFetchingTranscript && !error && transcripts.length === 0 && chapters.length === 0 && videoId && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No transcript available for this video.</p>
                                </div>
                            )}
                            
                            {!isFetchingTranscript && !error && (transcripts.length > 0 || chapters.length > 0) && (
                                <AnimatePresence mode="wait">
                                    {activeTab === 'Chapters' ? (
                                        <motion.div key="chapters" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex flex-col">
                                            <ChapterList chapters={chapters} currentTime={currentTime} onChapterClick={handleChapterClick} autoScroll={autoScroll} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="transcripts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="w-full flex flex-col">
                                            <TranscriptList transcripts={transcripts} currentTime={currentTime} onTranscriptClick={handleTranscriptClick} autoScroll={autoScroll} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                            
                            {!isFetchingTranscript && !error && !videoId && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Paste a YouTube link to see transcript and chapters.</p>
                                </div>
                            )}
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
        { id: 'mod1', title: 'Module 1', subtitle: 'Introducing data analytics and analytical thinking', locked: false, items: [
            { id: 'welcome', name: 'Welcome to the Google Data Analytics Certificate', duration: '9 min', type: 'Video', completed: true },
            { id: 'overview', name: 'Course 1 overview: Set your expectations', duration: '8 min', type: 'Reading', completed: true },
            { id: 'intro', name: 'Introduction to the course', duration: '4 min', type: 'Video', completed: true },
            { id: 'get-started', name: 'Get started with your Google Data Analytics Certificate', duration: '2 min', type: 'Video', completed: true },
            { id: 'resources', name: 'Helpful resources and tips', duration: '4 min', type: 'Reading', completed: true },
            { id: 'evaluate', name: 'Evaluate your current data analytics skills', duration: '4 min', type: 'Reading', completed: true },
            { id: 'survey', name: 'Google Data Analytics Certificate participant entry survey', duration: '10 min', type: 'Ungraded Plugin', completed: false },
            { id: 'data-analytics-everyday', name: 'Data analytics in everyday life', duration: '4 min', type: 'Video', completed: false },
            { id: 'identify-data', name: 'Identify data types in a spreadsheet', duration: '30 min', type: 'Practice Assignment', completed: false },
            { id: 'new-perspectives', name: 'New data perspectives', duration: '8 min', type: 'Reading', completed: false },
            { id: 'approach-tasks', name: 'How data analysts approach tasks', duration: '8 min', type: 'Reading', completed: false },
            { id: 'dimensions', name: 'Cassie: Dimensions of data analytics', duration: '4 min', type: 'Video', completed: false },
            { id: 'origins', name: 'Origins of the data analysis process', duration: '8 min', type: 'Reading', completed: false },
            { id: 'ecosystem', name: 'What is the data ecosystem?', duration: '4 min', type: 'Video', completed: false },
            { id: 'informs-decisions', name: 'How data informs better decisions', duration: '4 min', type: 'Video', completed: false },
            { id: 'expect-moving', name: 'What to expect moving forward', duration: '1 min', type: 'Video', completed: false },
            { id: 'glossary', name: 'Glossary terms from course 1, module 1', duration: '4 min', type: 'Reading', completed: false },
            { id: 'strategies', name: 'Assessment-taking strategies', duration: '8 min', type: 'Reading', completed: false },
            { id: 'challenge', name: 'Module 1 challenge', duration: '40 min', type: 'Graded Assignment', completed: false },
        ]},
        { id: 'mod2', title: 'Module 2', subtitle: 'The wonderful world of data', locked: true, items: [] },
        { id: 'mod3', title: 'Module 3', subtitle: 'Set up your data analytics toolbox', locked: true, items: [] },
        { id: 'mod4', title: 'Module 4', subtitle: 'Become a fair and impactful data professional', locked: true, items: [] }
    ];

    return (
        <aside className="w-[350px] shrink-0 h-full border-r dark:border-white/10 border-neutral-200 overflow-y-auto bg-white dark:bg-[#0d0d0d] custom-scrollbar flex flex-col relative z-20">
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onBack} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-black dark:hover:text-white"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-black dark:hover:text-white"><XIcon className="w-5 h-5" /></button>
                </div>
                <h2 className="text-[17px] font-bold dark:text-blue-500 text-blue-700 leading-snug">{title}</h2>
            </div>
            <div className="flex-1">
                {modules.map((mod) => (
                    <div key={mod.id} className={`border-t dark:border-white/5 border-neutral-100 ${mod.locked ? 'bg-neutral-50 dark:bg-[#111]' : ''}`}>
                        <button onClick={() => !mod.locked && toggleModule(mod.id)} className={`w-full p-4 flex items-start justify-between cursor-pointer text-left ${mod.locked ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}>
                            <div className="flex-1 pr-4">
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">{mod.title}</span>
                                <h4 className="text-[15px] font-bold dark:text-white text-black leading-tight">{mod.subtitle}</h4>
                            </div>
                            <div className="mt-1">
                                {mod.locked ? <LockClosedIcon className="w-4 h-4 text-gray-400" /> : <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedModules.includes(mod.id) ? 'rotate-180' : ''}`} />}
                            </div>
                        </button>
                        <AnimatePresence initial={false}>
                            {expandedModules.includes(mod.id) && !mod.locked && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                    {mod.items.map((item) => {
                                        const isActive = activeItemId === item.id;
                                        return (
                                            <button key={item.id} onClick={() => setActiveItemId(item.id)} className={`group flex items-start w-full text-left py-3.5 transition-all relative ${isActive ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}>
                                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                                                <div className="flex shrink-0 mt-0.5 ml-5 mr-3">
                                                    {item.completed ? <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center"><CheckCircleIcon className="w-3.5 h-3.5 text-white" /></div> : <div className={`w-5 h-5 rounded-full border-2 transition-colors ${isActive ? 'border-blue-600' : 'border-neutral-300 dark:border-gray-600'}`} />}
                                                </div>
                                                <div className="pr-4">
                                                    <p className={`text-[13px] font-medium leading-tight mb-1 ${isActive ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>{item.name}</p>
                                                    <p className="text-[11px] text-gray-500 font-medium flex items-center"><span>{item.type}</span><span className="mx-1">�</span><span>{item.duration}</span></p>
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

const Workspace: React.FC<WorkspaceProps> = ({ course, onBack }) => {
    const [panelWidth, setPanelWidth] = useState(480);
    const [isResizing, setIsResizing] = useState(false);
    const [isTutorOpen, setIsTutorOpen] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

    // Ref for video seek function - passed to both CinematicContentPanel and TutorPanel
    const videoSeekRef = useRef<((seconds: number) => void) | null>(null);

    const startResizing = useCallback((e: React.MouseEvent) => { setIsResizing(true); e.preventDefault(); }, []);
    const stopResizing = useCallback(() => { setIsResizing(false); }, []);
    const resize = useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 320 && newWidth < window.innerWidth * 0.7) setPanelWidth(newWidth);
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => { window.removeEventListener('mousemove', resize); window.removeEventListener('mouseup', stopResizing); };
    }, [resize, stopResizing]);

    return (
        <div className={`flex h-full w-full overflow-hidden dark:bg-black bg-white transition-colors duration-300 relative ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
            <div className="absolute top-4 right-6 z-[60] flex items-center gap-2">
                <button onClick={() => setIsUpgradeModalOpen(true)} className="px-4 py-1.5 rounded-full border border-green-800 bg-green-900/20 text-green-500 hover:bg-green-900/40 font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm">Upgrade</button>
                <button className="flex items-center gap-2 px-3 py-1.5 border dark:border-white/10 border-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300 text-xs font-bold rounded-lg transition-colors bg-white dark:bg-black"><ShareIcon className="w-3.5 h-3.5" />Share</button>
            </div>

            <AnimatePresence mode="wait">
                {course.isStructured && isLeftSidebarOpen && (
                    <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 350, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="h-full shrink-0 relative z-30">
                        <CourseraSidebar title={course.title} onClose={() => setIsLeftSidebarOpen(false)} onBack={onBack} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                {course.isStructured && !isLeftSidebarOpen && (
                    <div className="absolute top-4 left-4 z-50">
                        <button onClick={() => setIsLeftSidebarOpen(true)} className="p-2 bg-white dark:bg-[#1a1a1a] rounded-full shadow-md border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"><ViewSidebarIcon className="w-5 h-5" /></button>
                    </div>
                )}
                <CinematicContentPanel 
                            course={course} 
                            onBack={onBack} 
                            isFullWidth={!isTutorOpen && (!course.isStructured || !isLeftSidebarOpen)}
                            externalSeekRef={videoSeekRef}
                        />
            </div>

            {isTutorOpen && (
                <div onMouseDown={startResizing} className="w-1.5 hover:w-2 bg-transparent hover:bg-blue-500/20 cursor-col-resize transition-all shrink-0 z-50 group flex items-center justify-center">
                    <div className="w-px h-full bg-neutral-200 dark:bg-white/5 group-hover:bg-blue-500/50" />
                </div>
            )}

            <AnimatePresence mode="wait">
                {isTutorOpen && (
                    <motion.div initial={{ width: panelWidth, opacity: 1 }} animate={{ width: panelWidth, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} style={{ width: panelWidth }} className="shrink-0 h-full overflow-hidden">
                        <TutorPanelErrorBoundary course={course} onSeekTo={(seconds) => {
                            if (videoSeekRef.current) {
                                videoSeekRef.current(seconds);
                            }
                        }}>
                            <TutorPanel 
                                isPanelExpanded={false} 
                                setIsPanelExpanded={() => {}} 
                                isCoachMode={false}
                                course={course}
                                onSeekTo={(seconds) => {
                                    if (videoSeekRef.current) {
                                        videoSeekRef.current(seconds);
                                    }
                                }}
                            />
                        </TutorPanelErrorBoundary>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button onClick={() => setIsTutorOpen(!isTutorOpen)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.4, ease: "easeInOut" }} className={`absolute bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50 transition-all border-2 ${isTutorOpen ? 'bg-white text-black border-transparent hover:border-gray-300' : 'bg-black dark:bg-white text-white dark:text-black border-transparent hover:border-gray-500'}`}>
                <SparkleIcon className="w-8 h-8" />
            </motion.button>

            <AnimatePresence>{isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} onNavigateToPricing={() => {}} />}</AnimatePresence>
        </div>
    );
};

export default Workspace;