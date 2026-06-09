
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { 
    ArrowUpIcon, BrainIcon, SparkleIcon, QuizIcon, FlashcardIcon, 
    SummaryIcon, PodcastIcon, PlusIcon, CheckCircleIcon, PlayIcon,
    PauseIcon, SpeakerWaveIcon, RefreshIcon, ChevronLeftIcon, ChevronRightIcon,
    LinkIcon, MicIcon, XIcon, CheckIcon, ChevronDownIcon,
    MindMapIcon, GlobeIcon, TimelineIcon, WaveformIcon,
    MaximizeIcon, CopyIcon, DotsHorizontalIcon, AdjustIcon, WrenchIcon,
    BookOpenIcon, FileTextIcon, SearchIcon, ClockIcon, ShareIcon,
    FlowChartIcon, BarChartIcon, LineChartIcon, PieChartIcon, VennDiagramIcon
} from './icons';
import { QuizModal, FlashcardModal, SummaryModal, PodcastModal } from './modals';
import { FlashcardReviewController, demoCards, CardData } from './FlashcardUI';
import { HistoryItem } from './Dashboard';
import { toast } from 'sonner';

// Toast guard - prevents crash if sonner not initialized
const safeToast = {
    error: (msg: string) => {
        if (typeof toast?.error === 'function') {
            try { toast.error(msg); } catch (e) { console.warn('Toast error failed:', e); }
        }
    },
    success: (msg: string) => {
        if (typeof toast?.success === 'function') {
            try { toast.success(msg); } catch (e) { console.warn('Toast success failed:', e); }
        }
    },
    loading: (msg: string, opts?: any) => {
        if (typeof toast?.loading === 'function') {
            try { 
                return toast.loading(msg, opts); 
            } catch (e) { console.warn('Toast loading failed:', e); }
        }
    },
    info: (msg: string) => {
        if (typeof toast?.info === 'function') {
            try { toast.info(msg); } catch (e) { console.warn('Toast info failed:', e); }
        }
    },
    dismiss: () => {
        try { toast.dismiss(); } catch (e) { /* ignore */ }
    }
};

interface TutorPanelProps {
    isPanelExpanded: boolean;
    setIsPanelExpanded: (expanded: boolean) => void;
    isCoachMode: boolean;
    course?: HistoryItem;
    onSeekTo?: (seconds: number) => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

const models = [
    { name: 'Auto', free: true },
    { name: 'Gemini 3 Flash', free: true },
    { name: 'Claude 4.5 Sonnet', free: false },
    { name: 'GPT-5.2', free: false },
    { name: 'Gemini 3 Pro', free: false },
];

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3 dark:bg-[#1a1a1a] bg-neutral-100 rounded-lg">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
    </div>
);

// Mock Data for "Restored" Feel
const MOCK_QUIZZES = [
    { id: 1, title: "Generative AI Essentials Knowledge", questions: 5, status: "Completed", score: "80%", tags: ["Module 1", "Basics"] },
];

const MOCK_FLASHCARDS = [
    { id: 1, title: "Generative AI Essentials Knowledge", count: 20, lastStudied: "2 days ago", topics: "+146 more topics" }
];

const MOCK_SUMMARY = `## Key Takeaways

**Generative AI** represents a paradigm shift in how we interact with technology. Unlike traditional discriminative models that classify data, generative models create new data instances.

### Core Concepts:

*   **Foundation Models:** Large-scale models trained on vast amounts of data.
*   **Transformers:** The architecture powering most modern LLMs.
*   **Prompt Engineering:** The art of guiding model output.

This course covers the essentials needed to start building your own GenAI applications.`;

const TutorPanel: React.FC<TutorPanelProps> = ({ isPanelExpanded, setIsPanelExpanded, isCoachMode, course, onSeekTo }) => {
    // â”€â”€ Tab Manager State â”€â”€
    interface WorkspaceTab {
        id: string;
        type: 'learn' | 'chat' | 'flashcards' | 'quiz' | 'summary' | 'podcast';
        title: string;
        closable: boolean;
    }

    const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>([
        { id: 'learn', type: 'learn', title: 'Learn Tab', closable: false }
    ]);
    const [activeTabId, setActiveTabId] = useState('learn');
    const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
    
    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [selectedModel, setSelectedModel] = useState('Auto');
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    
    // Context Menu State
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuStep, setContextMenuStep] = useState<'main' | 'study_tools'>('main');
    
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const modelMenuRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Feature Data States (Initialized with mock data to "restore" old elements)
    const [quizzes, setQuizzes] = useState<any[]>(MOCK_QUIZZES.map(q => ({ ...q, generatedAt: Date.now() })));
    const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
    const [quizViewingState, setQuizViewingState] = useState<'none' | 'generating' | 'active'>('none');
    const [quizData, setQuizData] = useState<any[]>([]);
    const [expandedHint, setExpandedHint] = useState<string | null>(null);
    const [pendingQuizGenerationId, setPendingQuizGenerationId] = useState<number | null>(null);
    
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [activeDeckId, setActiveDeckId] = useState<number | null>(null);
    const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const [summary, setSummary] = useState<string | null>(null);
    const [isAutoSummary, setIsAutoSummary] = useState(false);
    const [selectedSummaryType, setSelectedSummaryType] = useState('Detailed Summary');
    const [summaryDropdownOpen, setSummaryDropdownOpen] = useState(false);
    
    const [podcast, setPodcast] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Loading State for Tabs
    const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

    // Modal States
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showFlashcardModal, setShowFlashcardModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [showPodcastModal, setShowPodcastModal] = useState(false);

    // RAG Flashcard State
    type IndexStatus = 'idle' | 'checking' | 'indexing' | 'ready' | 'error';
    const [indexStatus, setIndexStatus] = useState<IndexStatus>('idle');
    const [generatedCards, setGeneratedCards] = useState<CardData[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [flashcardSettings, setFlashcardSettings] = useState({ count: 10, focus: '' });

    // Summary State
    const [summaryData, setSummaryData] = useState<{ paragraph: string; bullets: { text: string; timestamp: string }[] } | null>(null);
    const [isSummaryGenerating, setIsSummaryGenerating] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [summaries, setSummaries] = useState<any[]>([]);
    const [pendingSummaryTabId, setPendingSummaryTabId] = useState<string | null>(null);

    // Computed: Combined My Sets sorted by newest first
    const mySets = useMemo(() => {
        const all = [
            ...flashcards.map(f => ({ ...f, type: 'flashcards' })),
            ...quizzes.map(q => ({ ...q, type: 'quiz' })),
            ...summaries.map(s => ({ ...s, type: 'summary' })),
        ];
        return all.sort((a, b) => (b.generatedAt || 0) - (a.generatedAt || 0));
    }, [flashcards, quizzes, summaries]);

    // â”€â”€ Tab Manager Helpers â”€â”€
    const openFeatureTab = (type: WorkspaceTab['type'], title: string) => {
        const existing = workspaceTabs.find(t => t.type === type);
        if (existing) {
            setActiveTabId(existing.id);
            return;
        }
        const newTab: WorkspaceTab = {
            id: `${type}-${Date.now()}`,
            type,
            title,
            closable: true,
        };
        setWorkspaceTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
        
        // Auto-generate summary when opening summary tab
        if (type === 'summary') {
            setPendingSummaryTabId(newTab.id);
        }
    };

    const closeTab = (tabId: string) => {
        const tab = workspaceTabs.find(t => t.id === tabId);
        if (!tab || !tab.closable) return;
        const newTabs = workspaceTabs.filter(t => t.id !== tabId);
        setWorkspaceTabs(newTabs);
        if (activeTabId === tabId) {
            setActiveTabId('learn');
        }
    };

    const handleGenerateQuiz = async (config?: { difficulty?: string; numQuestions?: string; topic?: string }) => {
        const videoId = getVideoId(course?.videoUrl || '');
        if (!videoId) {
            safeToast.error("No video loaded. Please open a video first.");
            return;
        }

        setLoadedTabs(prev => { const next = new Set(prev); next.delete('quiz'); return next; });
        openFeatureTab('quiz', 'Quiz');
        setQuizViewingState('generating');
        setQuizData([]);
        setActiveQuizId(null);

        const pendingId = Date.now();
        setPendingQuizGenerationId(pendingId);

        try {
            if (indexStatus !== 'ready') {
                await handleAnalyzeVideo();
            }

            const res = await fetch('/api/video/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId,
                    forceRefresh: true,
                    count: parseInt(config?.numQuestions ?? '5'),
                    focus: config?.topic ?? '',
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Quiz generation failed (${res.status}): ${errText}`);
            }

            const response = await res.json();
            const rawQuestions: any[] = response?.data?.quiz ?? [];

            if (rawQuestions.length === 0) {
                throw new Error("AI returned no questions. Please try again.");
            }

            const mappedQuestions = rawQuestions.map((q: any, idx: number) => ({
                id: `q${idx + 1}`,
                question: q.question ?? '',
                options: Array.isArray(q.options) ? q.options : [],
                correct: q.correct ?? 0,
                hint: q.hint ?? '',
                source_chunk_id: q.source_chunk_id ?? '',
            }));

            const newQuizId = Date.now();
            const newQuizMeta = {
                id: newQuizId,
                title: config?.topic ? `Quiz: ${config.topic}` : course?.title ?? 'Quiz',
                questions: mappedQuestions.length,
                status: 'Not Started',
                score: 'N/A',
                generatedAt: Date.now(),
            };

            setQuizData(mappedQuestions);
            setQuizzes(prev => [newQuizMeta, ...prev]);
            setActiveQuizId(newQuizId);
            setQuizAnswers({});
            setExpandedHint(null);
            setQuizViewingState('active');

            safeToast.success(`Quiz ready! ${mappedQuestions.length} questions generated.`);

        } catch (err: any) {
            setQuizViewingState('none');
            setQuizData([]);
            setActiveQuizId(null);

            const msg = err?.message ?? 'Quiz generation failed.';

            if (msg.includes('503') || msg.includes('502')) {
                safeToast.error("AI service is busy. Please try again in a moment.");
            } else if (msg.includes('401') || msg.includes('403')) {
                safeToast.error("API key issue. Check your OpenRouter key in backend .env.");
            } else if (msg.includes('timeout') || msg.includes('network')) {
                safeToast.error("Connection timed out. Check your internet and try again.");
            } else {
                safeToast.error(msg);
            }
        } finally {
            setPendingQuizGenerationId(null);
        }
    };

    const getActiveTabType = (): string => {
        const tab = workspaceTabs.find(t => t.id === activeTabId);
        return tab?.type || 'learn';
    };

    const handleTabDragStart = (tabId: string) => {
        setDraggedTabId(tabId);
    };

    const handleTabDragOver = (e: React.DragEvent, targetTabId: string) => {
        e.preventDefault();
        if (!draggedTabId || draggedTabId === targetTabId) return;
        const dragIndex = workspaceTabs.findIndex(t => t.id === draggedTabId);
        const targetIndex = workspaceTabs.findIndex(t => t.id === targetTabId);
        if (dragIndex === -1 || targetIndex === -1) return;
        const reordered = [...workspaceTabs];
        const [removed] = reordered.splice(dragIndex, 1);
        reordered.splice(targetIndex, 0, removed);
        setWorkspaceTabs(reordered);
    };

    const handleTabDragEnd = () => {
        setDraggedTabId(null);
    };

    // Helper: Extract videoId from URL
    const getVideoId = (url: string): string => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : '';
    };

    // Helper: Parse timestamp to seconds
    const parseTimestampToSeconds = (ts: string): number => {
        if (!ts) return 0;
        const parts = ts.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 0;
    };

    // Check index status on video change
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const checkIndexStatus = async () => {
            const videoId = getVideoId(course?.videoUrl || '');
            if (!videoId || !isMounted) return;
            
            setIndexStatus('checking');
            
            try {
                const res = await fetch(`/api/video/index-status?videoId=${videoId}`, {
                    signal: controller.signal
                });
                const data = await res.json();
                if (isMounted) {
                    setIndexStatus(data?.isIndexed ? 'ready' : 'idle');
                }
            } catch {
                if (isMounted) {
                    setIndexStatus('idle');
                }
            }
        };
        
        if (course?.videoUrl) {
            checkIndexStatus();
        }
        
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [course?.videoUrl]);

    // Restore flashcards from cache on video change (localStorage first, then backend)
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const restoreFlashcards = async () => {
            const videoId = getVideoId(course?.videoUrl || '');
            if (!videoId || !isMounted) return;

            // Layer 1: Check localStorage (instant, no network)
            const localCacheKey = `stephen_flashcards_${videoId}`;
            try {
                const localData = localStorage.getItem(localCacheKey);
                if (localData && isMounted) {
                    const parsed = JSON.parse(localData);
                    if (Array.isArray(parsed.cards) && parsed.cards.length > 0) {
                        console.log('ðŸ“¦ Restored', parsed.cards.length, 'flashcards from localStorage');
                        setGeneratedCards(parsed.cards);
                        setFlashcards([{
                            id: 1,
                            title: parsed.title || course?.title || 'Flashcard Set',
                            count: parsed.cards.length,
                            lastStudied: parsed.lastStudied || 'Recently',
                            topics: `${parsed.cards.length} cards`,
                            generatedAt: parsed.generatedAt || Date.now(),
                        }]);
                        return; // Done â€” no need to hit backend
                    }
                }
            } catch (e) {
                console.warn('localStorage flashcard cache read failed:', e);
            }

            // Layer 2: Fallback to backend GET (if localStorage is empty)
            try {
                const res = await fetch(
                    `/api/video/features?videoId=${videoId}&type=flashcards`,
                    { signal: controller.signal }
                );
                if (!res.ok || !isMounted) return;

                const result = await res.json();
                console.log('ðŸ“¡ Backend cache response:', result?.cached, 'cards:', result?.data?.flashcards?.length ?? 0);

                if (result?.cached && result?.data?.flashcards && isMounted) {
                    const cachedCards: CardData[] = result.data.flashcards.map(
                        (card: any, index: number) => ({
                            id: `cached-${Date.now()}-${index}`,
                            question: card?.question ?? '',
                            answer: card?.answer ?? '',
                            explanation: undefined,
                            source_chunk_id: card?.source_chunk_id ?? '',
                            source_timestamp: card?.source_timestamp ?? '0:00',
                        })
                    );

                    setGeneratedCards(cachedCards);
                    setFlashcards([{
                        id: 1,
                        title: course?.title || 'Flashcard Set',
                        count: cachedCards.length,
                        lastStudied: result.createdAt
                            ? new Date(result.createdAt).toLocaleDateString()
                            : 'Recently',
                        topics: `${cachedCards.length} cards`,
                        generatedAt: Date.now(),
                    }]);

                    // Backfill localStorage for next time
                    localStorage.setItem(localCacheKey, JSON.stringify({
                        cards: cachedCards,
                        title: course?.title || 'Flashcard Set',
                        generatedAt: Date.now(),
                    }));

                    console.log('ðŸ“¦ Loaded', cachedCards.length, 'cards from backend + saved to localStorage');
                }
            } catch (err: any) {
                if (err?.name !== 'AbortError') {
                    console.warn('Backend flashcard cache fetch failed:', err);
                }
            }
        };

        if (course?.videoUrl) {
            restoreFlashcards();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [course?.videoUrl, course?.title]);

    // Restore summary from cache on video change
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const restoreSummary = async () => {
            const videoId = getVideoId(course?.videoUrl || '');
            if (!videoId || !isMounted) return;

            // Layer 1: Check localStorage
            const localCacheKey = `stephen_summary_${videoId}`;
            try {
                const localData = localStorage.getItem(localCacheKey);
                if (localData && isMounted) {
                    const parsed = JSON.parse(localData);
                    if (parsed.paragraph || (parsed.bullets && parsed.bullets.length > 0)) {
                        console.log('ðŸ“¦ Restored summary from localStorage');
                        setSummaryData(parsed);
                        
                        // Add to summaries for My Sets
                        if (!summaries.find(s => s.videoId === videoId)) {
                            setSummaries(prev => [{
                                id: `summary-${Date.now()}`,
                                videoId,
                                title: course?.title || 'Summary',
                                count: parsed.bullets?.length || 0,
                                lastStudied: 'Recently',
                                type: 'summary',
                                data: parsed,
                                generatedAt: Date.now()
                            }, ...prev]);
                        }
                        return;
                    }
                }
            } catch (e) {
                console.warn('localStorage summary cache read failed:', e);
            }

            // Layer 2: Fallback to backend GET
            try {
                const res = await fetch(
                    `/api/video/features?videoId=${videoId}&type=summary`,
                    { signal: controller.signal }
                );
                if (!res.ok || !isMounted) return;

                const result = await res.json();
                if (result?.cached && result?.data && isMounted) {
                    const data = {
                        paragraph: result.data.paragraph || '',
                        bullets: result.data.bullets || []
                    };
                    setSummaryData(data);
                    // Backfill localStorage
                    localStorage.setItem(localCacheKey, JSON.stringify(data));
                    console.log('ðŸ“¦ Loaded summary from backend');
                }
            } catch (err: any) {
                if (err?.name !== 'AbortError') {
                    console.warn('Backend summary cache fetch failed:', err);
                }
            }
        };

        if (course?.videoUrl) {
            restoreSummary();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [course?.videoUrl]);

    // Auto-generate summary when opening summary tab
    useEffect(() => {
        if (pendingSummaryTabId && !isSummaryGenerating && !summaryData) {
            setPendingSummaryTabId(null);
            handleGenerateSummary();
        }
    }, [pendingSummaryTabId, isSummaryGenerating, summaryData]);

    // Handle Analyze Video (first-time indexing)
    const handleAnalyzeVideo = async () => {
        const videoId = getVideoId(course?.videoUrl ?? '');
        if (!videoId) {
            safeToast.error("Unable to identify video");
            return;
        }
        
        setIndexStatus('indexing');
        safeToast.loading("Teaching the AI about this video... this takes a moment");
        
        try {
            const res = await fetch('/api/video/index-transcript', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId, forceRefresh: false })
            });
            
            if (!res.ok) throw new Error("Indexing failed");
            
            setIndexStatus('ready');
            // Dismiss ALL toasts before showing success
            safeToast.dismiss();
            safeToast.success("Video analyzed! You can now generate flashcards.");
        } catch {
            setIndexStatus('error');
            safeToast.dismiss();
            safeToast.error("Failed to analyze video. Please try again.");
        }
    };

    // Handle Generate Flashcards (main flow)
    const handleGenerateFlashcards = async () => {
        const videoId = getVideoId(course?.videoUrl || '');
        if (!videoId) {
            safeToast.error("Unable to identify video");
            return;
        }
        
        // If not indexed, trigger indexing first
        if (indexStatus !== 'ready') {
            await handleAnalyzeVideo();
            if (indexStatus !== 'ready') return;
        }
        
        setIsGenerating(true);
        
        // IMMEDIATELY show card UI with demo cards while loading
        setActiveDeckId(1);
        setGeneratedCards(demoCards); // Show demo immediately!
        
        safeToast.loading("Generating your custom flashcard set...", { duration: 3000 });
        
        // Get transcript from localStorage if available
        const cacheKey = `stephen_transcript_${videoId}`;
        let transcriptData = null;
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed?.transcript && parsed.transcript.length > 0) {
                    transcriptData = parsed.transcript;
                    console.log('ðŸ“¡ Using cached transcript with', transcriptData.length, 'segments');
                }
            }
        } catch (e) {
            console.warn('Could not get transcript from localStorage:', e);
        }
        
        try {
            console.log('ðŸ“¡ Calling flashcards API with videoId:', videoId);
            const res = await fetch('/api/video/flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    videoId, 
                    forceRefresh: true,
                    count: flashcardSettings?.count ?? 10,
                    focus: flashcardSettings?.focus ?? '',
                    transcript: transcriptData
                })
            });
            
            console.log('ðŸ“¡ Response status:', res.status);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('ðŸ“¡ API Error:', errorText);
                throw new Error(`Failed to generate: ${res.status}`);
            }
            
            const response = await res.json();
            console.log('ðŸ“¡ Response data:', JSON.stringify(response).slice(0, 500));
            
            const backendCards = response?.data?.flashcards || [];
            console.log('ðŸ“¡ Backend cards count:', backendCards.length);
            
            // Map to CardData interface - safe with Array.isArray
            const mappedCards: CardData[] = Array.isArray(backendCards) 
                ? backendCards.map((card: any, index: number) => ({
                    id: `generated-${Date.now()}-${index}`,
                    question: card?.question ?? '',
                    answer: card?.answer ?? '',
                    explanation: undefined,
                    source_chunk_id: card?.source_chunk_id ?? '',
                    source_timestamp: card?.source_timestamp ?? '0:00'
                }))
                : [];
            
            // REPLACE demo cards with real ones (or keep demo if empty)
            if (mappedCards.length > 0) {
                setGeneratedCards(mappedCards);
                setFlashcards([{
                    id: 1,
                    title: course?.title || 'Flashcard Set',
                    count: mappedCards.length,
                    lastStudied: 'Just now',
                    topics: `${mappedCards.length} cards`,
                    generatedAt: Date.now(),
                }]);
                
                // Persist to localStorage for instant restore on re-visit
                const localCacheKey = `stephen_flashcards_${videoId}`;
                try {
                    localStorage.setItem(localCacheKey, JSON.stringify({
                        cards: mappedCards,
                        title: course?.title || 'Flashcard Set',
                        generatedAt: Date.now(),
                    }));
                    console.log('ðŸ’¾ Saved', mappedCards.length, 'flashcards to localStorage');
                } catch (e) {
                    console.warn('Failed to save flashcards to localStorage:', e);
                }
                
                console.log('ðŸ“¡ Replaced demo cards with real data');
            } else {
                console.log('ðŸ“¡ API returned no cards, keeping demo cards');
            }
            
            // Dismiss loading toast and show result
            safeToast.dismiss();
            
            if (mappedCards.length > 0) {
                safeToast.success(`Created ${mappedCards.length} flashcards!`);
            } else {
                safeToast.info("Showing demo flashcards. Try generating again!");
            }
            
        } catch (err: any) {
            // Dismiss loading toast on error
            safeToast.dismiss();
            
            const msg = err?.message || "Generation failed";
            
            if (msg.includes('SiliconFlow') || msg.includes('embedding')) {
                safeToast.error("AI service unavailable. Please try again.");
            } else if (msg.includes('Chroma') || msg.includes('vector')) {
                safeToast.error("Database connection failed. Please refresh.");
            } else {
safeToast.error(msg);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle Generate Summary
    const handleGenerateSummary = async () => {
        const videoId = getVideoId(course?.videoUrl || '');
        if (!videoId) {
            safeToast.error("Unable to identify video");
            return;
        }

        // Check if indexed first
        if (indexStatus !== 'ready') {
            await handleAnalyzeVideo();
            if (indexStatus !== 'ready') return;
        }

        setIsSummaryGenerating(true);
        safeToast.loading("Generating your summary...", { duration: 3000 });

        // Get cached transcript
        const cacheKey = `stephen_transcript_${videoId}`;
        let transcriptData = null;
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed?.transcript && parsed.transcript.length > 0) {
                    transcriptData = parsed.transcript;
                }
            }
        } catch (e) {
            console.warn('Could not get transcript from localStorage:', e);
        }

        try {
            const res = await fetch('/api/video/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    videoId, 
                    forceRefresh: true,
                    transcript: transcriptData
                })
            });

            if (!res.ok) throw new Error(`Failed: ${res.status}`);

            const response = await res.json();
            const data = {
                paragraph: response?.data?.paragraph || '',
                bullets: response?.data?.bullets || []
            };

            setSummaryData(data);
            setSummaryError(null);

            // Add to summaries for My Sets
            setSummaries(prev => {
                const filtered = prev.filter(s => s.videoId !== videoId);
                return [{
                    id: `summary-${Date.now()}`,
                    videoId,
                    title: course?.title || 'Summary',
                    count: data.bullets.length,
                    lastStudied: 'Just now',
                    type: 'summary',
                    data,
                    generatedAt: Date.now()
                }, ...filtered];
            });

            // Persist to localStorage
            const localCacheKey = `stephen_summary_${videoId}`;
            localStorage.setItem(localCacheKey, JSON.stringify(data));

            safeToast.dismiss();
            safeToast.success(data.bullets.length > 0 ? `Generated ${data.bullets.length} key points!` : 'Summary generated!');
        } catch (err: any) {
            safeToast.dismiss();
            setSummaryError(err?.message || "Summary generation failed");
            safeToast.error(err?.message || "Summary generation failed. Try again later.");
        } finally {
            setIsSummaryGenerating(false);
        }
    };

    // Handle Show Source (video seek)
    const handleShowSource = (chunkId: string) => {
        if (!chunkId) return;
        
        const card = generatedCards?.find?.((c: CardData) => c?.source_chunk_id === chunkId);
        if (!card?.source_timestamp) return;
        
        const seconds = parseTimestampToSeconds(card.source_timestamp);
        
        // Safe callback - ensure onSeekTo exists before calling
        if (typeof onSeekTo === 'function') {
            try { onSeekTo(seconds); } catch (e) { console.warn('Seek failed:', e); }
        }
    };

    // Initialize GenAI
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "undefined") {
            console.warn("GEMINI_API_KEY is missing or invalid. AI features in TutorPanel will be disabled.");
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const chatInstance = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: "You are an AI tutor helping a student with their course material. Be helpful, concise, and encouraging.",
                },
            });
            setChat(chatInstance);
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI in TutorPanel:", error);
        }
    }, []);

    // Simulate Loading for Tabs
    useEffect(() => {
        const currentType = getActiveTabType();
        if (['quiz', 'flashcards', 'podcast'].includes(currentType) && !loadedTabs.has(currentType)) {
            const timer = setTimeout(() => {
                setLoadedTabs(prev => new Set(prev).add(currentType));
            }, 1500); // 1.5s Shimmer Effect
            return () => clearTimeout(timer);
        }
    }, [activeTabId, loadedTabs]);

    // Outside click handlers
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
                setIsModelMenuOpen(false);
            }
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setIsContextMenuOpen(false);
                // Reset menu state when closing
                setTimeout(() => setContextMenuStep('main'), 200); 
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Chat Auto-scroll
    useEffect(() => {
        if (getActiveTabType() === 'chat' && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading, activeTabId]);

    // Podcast Progress Simulation
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chat) return;

        const userText = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = '48px';
        }

        try {
            const stream = await chat.sendMessageStream({ message: userText });
            let firstChunk = true;
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (firstChunk) {
                    setMessages(prev => [...prev, { role: 'model', text: chunkText }]);
                    firstChunk = false;
                } else {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage && lastMessage.role === 'model') {
                            lastMessage.text += chunkText;
                        }
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    // --- Create Card Component (Reusable) ---
    const CreateCard = ({ title, desc, rightElement }: { title: string, desc: string, rightElement: React.ReactNode }) => (
        <div className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 mb-8 flex items-center justify-between shadow-sm">
            <div className="flex-1 pr-4">
                <h3 className="text-base font-bold dark:text-white text-black mb-1">{title}</h3>
                <p className="text-xs dark:text-gray-400 text-neutral-500 leading-relaxed">{desc}</p>
            </div>
            <div className="shrink-0">
                {rightElement}
            </div>
        </div>
    );

    // --- Generate Header for Flashcards/Quiz/Podcast ---
    const GenerateHeader = ({ onAdjust }: { onAdjust: () => void }) => {
        const currentStatus = indexStatus ?? 'idle';
        const isDisabled = currentStatus === 'checking' || currentStatus === 'indexing' || isGenerating;
        
        return (
            <div className="flex items-center space-x-3">
                <button 
                    onClick={onAdjust}
                    disabled={currentStatus !== 'ready'}
                    className={`p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors ${
                        currentStatus !== 'ready' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <AdjustIcon className="w-5 h-5" />
                </button>
                
                {currentStatus === 'idle' || currentStatus === 'error' ? (
                    <button 
                        onClick={handleAnalyzeVideo}
                        disabled={currentStatus === 'checking'}
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-full text-xs hover:bg-green-700 transition-colors"
                    >
                        {currentStatus === 'error' ? 'Retry Analysis' : 'Analyze Video'}
                    </button>
                ) : (
                    <button 
                        onClick={handleGenerateFlashcards}
                        disabled={isDisabled}
                        className={`px-6 py-2 bg-white text-black font-bold rounded-full text-xs transition-all ${
                            isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                        }`}
                    >
                        {currentStatus === 'indexing' ? 'Analyzing...' : 
                         currentStatus === 'checking' ? 'Checking...' : 
                         isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                )}
            </div>
        );
    };

    // --- Summary Header ---
    const SummaryHeaderRight = () => (
        <div className="flex items-center space-x-3">
            <button 
                onClick={() => setShowSummaryModal(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
                <AdjustIcon className="w-5 h-5" />
            </button>
            <div className="relative">
                <div className="flex items-center bg-white dark:bg-white text-black rounded-full p-1 h-10 shadow-sm border border-transparent hover:border-gray-200 transition-all">
                    <button className="px-4 text-[13px] font-bold h-full flex items-center min-w-[120px] cursor-not-allowed opacity-90">
                        {selectedSummaryType}
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button 
                        onClick={() => setSummaryDropdownOpen(!summaryDropdownOpen)}
                        className="w-8 h-full flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ml-1"
                    >
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>
                <AnimatePresence>
                    {summaryDropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden py-1"
                        >
                            {['Detailed Summary', 'Cheat Sheet', 'Short Summary'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { 
                                        setSelectedSummaryType(opt); 
                                        setSummaryDropdownOpen(false); 
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                    {opt}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    // --- Shimmer Skeleton Component ---
    const renderShimmer = () => (
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Create Card Skeleton */}
            <div className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 mb-8 h-24 relative overflow-hidden">
                 <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>
            
            {/* List Header Skeleton */}
            <div className="h-4 w-32 dark:bg-[#1a1a1a] bg-neutral-200 rounded mb-4 relative overflow-hidden">
                 <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-500/10 to-transparent"></div>
            </div>

            {/* List Items Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 h-24 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    </div>
                ))}
            </div>
             <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );

    // --- Content Renderers ---

    const renderChatEmptyState = () => (
        <div className="flex flex-col items-center justify-center flex-1 h-full py-10 px-6">
            <div className="mb-8 opacity-20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-700 dark:to-neutral-900 flex items-center justify-center">
                    <BrainIcon className="w-8 h-8 text-neutral-500 dark:text-neutral-400" />
                </div>
            </div>
            <h3 className="text-xl font-bold dark:text-gray-300 text-neutral-600 mb-10 tracking-tight">Learn with Stephen</h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-md">
                <button onClick={() => { openFeatureTab('quiz', 'Quiz'); setShowQuizModal(true); }} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <QuizIcon className="w-4 h-4" /> <span>Quiz</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <MindMapIcon className="w-4 h-4" /> <span>Mind Map</span>
                </button>
                <button onClick={() => setIsVoiceMode(true)} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <WaveformIcon className="w-4 h-4" /> <span>Voice Mode</span>
                </button>
                <button onClick={() => { openFeatureTab('flashcards', 'Flashcards'); setShowFlashcardModal(true); }} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <FlashcardIcon className="w-4 h-4" /> <span>Flashcards</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <GlobeIcon className="w-4 h-4" /> <span>Search</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <TimelineIcon className="w-4 h-4" /> <span>Timeline</span>
                </button>
            </div>
        </div>
    );

    const renderVoiceModeOverlay = () => (
        <div className="absolute inset-0 z-50 bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center">
            <button onClick={() => setIsVoiceMode(false)} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                <XIcon className="w-6 h-6 text-black dark:text-white" />
            </button>
            
            <div className="flex items-center justify-center space-x-3 mb-8">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Listening...</h2>
            <p className="text-gray-500 text-sm">Speak clearly into your microphone</p>
        </div>
    );

    const renderLearnTab = () => (
        <div className="flex flex-col h-full">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Generate Section */}
                <div>
                    <h3 className="text-sm font-bold dark:text-gray-400 text-gray-500 mb-3 uppercase tracking-wider">Generate</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { type: 'podcast' as const, label: 'Podcast', icon: <PodcastIcon className="w-5 h-5" />, color: 'text-purple-500' },
                            { type: 'summary' as const, label: 'Summary', icon: <SummaryIcon className="w-5 h-5" />, color: 'text-blue-500' },
                            { type: 'quiz' as const, label: 'Quiz', icon: <QuizIcon className="w-5 h-5" />, color: 'text-orange-500' },
                            { type: 'flashcards' as const, label: 'Flashcards', icon: <FlashcardIcon className="w-5 h-5" />, color: 'text-red-500' },
                            { type: 'chat' as const, label: 'Chat', icon: <BrainIcon className="w-5 h-5" />, color: 'text-cyan-500' },
                        ].map((feature) => (
                            <button
                                key={feature.label}
                                onClick={() => openFeatureTab(feature.type, feature.label)}
                                className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-800 border-neutral-200 dark:bg-[#1a1a1a] bg-white hover:border-gray-400 dark:hover:border-gray-600 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className={feature.color}>{feature.icon}</span>
                                    <span className="text-sm font-bold dark:text-white text-black">{feature.label}</span>
                                </div>
                                <AdjustIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* My Sets Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold dark:text-gray-400 text-gray-500 uppercase tracking-wider">My Sets</h3>
                    </div>
                    
                    {mySets.length > 0 && mySets.map((item: any) => {
                        const icons = {
                            'flashcards': <FlashcardIcon className="w-5 h-5 text-red-500 shrink-0" />,
                            'quiz': pendingQuizGenerationId !== null
                            ? (
                                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                                </div>
                            )
                            : <QuizIcon className="w-5 h-5 text-orange-500 shrink-0" />,
                            'summary': <SummaryIcon className="w-5 h-5 text-blue-500 shrink-0" />,
                        };
                        const titleMap = {
                            'flashcards': `${item.count} cards Â· ${item.lastStudied}`,
                            'quiz': `${item.questions} questions Â· ${item.score}`,
                            'summary': `${item.count} points Â· ${item.lastStudied}`,
                        };
                        
                        return (
                            <button
                                key={`${item.type}-${item.id}`}
                                onClick={() => {
                                    if (item.type === 'flashcards') {
                                        setActiveDeckId(item.id);
                                        openFeatureTab('flashcards', item.title || 'Flashcard Set');
                                    } else if (item.type === 'quiz') {
                                        setActiveQuizId(item.id);
                                        openFeatureTab('quiz', item.title || 'Quiz');
                                    } else if (item.type === 'summary') {
                                        openFeatureTab('summary', item.title || 'Summary');
                                    }
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-left mb-2"
                            >
                                {icons[item.type]}
                                <div className="min-w-0">
                                    <p className="text-sm font-bold dark:text-white text-black truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500">{titleMap[item.type]}</p>
                                </div>
                            </button>
                        );
                    })}

                    {mySets.length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-6">No generated sets yet. Click a feature above to get started.</p>
                    )}
                </div>
            </div>

            {/* Chat Input â€” pinned at bottom of Learn Tab */}
            <div className="shrink-0 p-4 border-t dark:border-white/10 border-neutral-200">
                <div className="flex items-center gap-2 dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl px-4 py-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                        placeholder="Ask anything"
                        className="flex-1 bg-transparent text-sm dark:text-white text-black placeholder-gray-500 outline-none"
                    />
                    <button
                        onClick={() => openFeatureTab('chat', 'Chat')}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold hover:opacity-80 transition-opacity"
                    >
                        <SparkleIcon className="w-3.5 h-3.5" />
                        AI
                    </button>
                </div>
            </div>
        </div>
    );

    const renderChat = () => (
        <div className="flex flex-col h-full relative">
            <AnimatePresence>
                {isVoiceMode && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50"
                    >
                        {renderVoiceModeOverlay()}
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? renderChatEmptyState() : (
                    <>
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <BrainIcon className="w-4 h-4 text-orange-500" />
                                    </div>
                                )}
                                <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-800 dark:text-gray-200 rounded-bl-none border dark:border-white/5 border-neutral-200'
                                }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start gap-3">
                                 <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <BrainIcon className="w-4 h-4 text-orange-500" />
                                </div>
                                <TypingIndicator />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Cinematic Input Area */}
            <div className="p-4 pt-2 dark:bg-[#0a0a0a] bg-white">
                <div className="relative dark:bg-[#151515] bg-neutral-100 border dark:border-white/5 border-neutral-200 rounded-[26px] p-1.5 shadow-lg">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={handleInput}
                        onKeyPress={handleKeyPress}
                        placeholder="Learn anything"
                        className="w-full bg-transparent border-none focus:outline-none text-[15px] dark:text-white text-black placeholder-gray-500 px-4 py-3 resize-none"
                        rows={1}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    <div className="flex items-center justify-between px-2 pb-1.5 pt-1">
                        <div className="flex items-center space-x-2">
                            <div className="relative" ref={modelMenuRef}>
                                <button 
                                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full dark:bg-white/5 bg-white border dark:border-white/5 border-gray-200 text-[11px] font-bold dark:text-gray-300 text-gray-700 hover:dark:bg-white/10 hover:bg-gray-50 transition-colors"
                                >
                                    <span>{selectedModel}</span>
                                    <ChevronDownIcon className="w-3 h-3 opacity-50" />
                                </button>
                                <AnimatePresence>
                                    {isModelMenuOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full left-0 mb-2 w-48 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                        >
                                            {models.map((m) => (
                                                <button 
                                                    key={m.name}
                                                    onClick={() => { setSelectedModel(m.name); setIsModelMenuOpen(false); }}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] dark:text-gray-300 text-gray-700 hover:dark:bg-white/5 hover:bg-gray-100 transition-colors"
                                                >
                                                    <span className={selectedModel === m.name ? "font-bold text-orange-500" : ""}>{m.name}</span>
                                                    {selectedModel === m.name && <CheckIcon className="w-3 h-3 text-orange-500" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            <div className="relative" ref={contextMenuRef}>
                                <button 
                                    onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
                                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full dark:bg-white/5 bg-white border dark:border-white/5 border-gray-200 text-[11px] font-bold dark:text-gray-300 text-gray-700 hover:dark:bg-white/10 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="opacity-50">@</span>
                                    <span>Add Context</span>
                                </button>
                                <AnimatePresence>
                                    {isContextMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full left-0 mb-3 w-64 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                                        >
                                            <div className="p-3 border-b dark:border-white/5 border-gray-100">
                                                <div className="relative">
                                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search" 
                                                        className="w-full bg-transparent pl-8 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-500 focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="p-2 overflow-y-auto max-h-72 custom-scrollbar">
                                                {contextMenuStep === 'main' ? (
                                                    <motion.div 
                                                        key="main"
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        exit={{ x: -20, opacity: 0 }}
                                                        className="space-y-3"
                                                    >
                                                        {/* Recents */}
                                                        <div>
                                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">Recents</div>
                                                            <button className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <FileTextIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                                <span className="text-xs dark:text-gray-300 text-gray-700 truncate">What is Artificial Intel...</span>
                                                            </button>
                                                            <button className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <PlayIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                                <span className="text-xs dark:text-gray-300 text-gray-700 truncate">I Tested Google's Gem...</span>
                                                            </button>
                                                            <button className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <GlobeIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                                <span className="text-xs dark:text-gray-300 text-gray-700 truncate">YouLearn: Your Perso...</span>
                                                            </button>
                                                        </div>

                                                        {/* Context */}
                                                        <div>
                                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">Context</div>
                                                            <button className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <div className="flex items-center space-x-2">
                                                                    <BrainIcon className="w-4 h-4 text-green-500" />
                                                                    <span className="text-xs font-bold dark:text-white text-black">Learn+</span>
                                                                    <span className="text-[9px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-300">Built In</span>
                                                                </div>
                                                                <CheckIcon className="w-3.5 h-3.5 text-gray-400" />
                                                            </button>
                                                            <button className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <GlobeIcon className="w-4 h-4 text-blue-500" />
                                                                <span className="text-xs font-medium dark:text-gray-300 text-gray-700 group-hover:dark:text-white">Search</span>
                                                            </button>
                                                            <button className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <BookOpenIcon className="w-4 h-4 text-red-500" />
                                                                <span className="text-xs font-medium dark:text-gray-300 text-neutral-700 group-hover:dark:text-white">Study Mode</span>
                                                            </button>
                                                        </div>

                                                        {/* Other Tools */}
                                                        <div>
                                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">Other Tools</div>
                                                            <button 
                                                                onClick={() => setContextMenuStep('study_tools')}
                                                                className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group"
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <WrenchIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                                    <span className="text-xs font-medium dark:text-gray-300 text-gray-700 group-hover:dark:text-white">Study tools</span>
                                                                </div>
                                                                <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500" />
                                                            </button>
                                                            <button className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <div className="flex items-center space-x-2">
                                                                    <AdjustIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                                    <span className="text-xs font-medium dark:text-gray-300 text-gray-700 group-hover:dark:text-white">Chat instructions</span>
                                                                </div>
                                                                <span className="text-[10px] text-gray-500 font-bold">1</span>
                                                            </button>
                                                            <button className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group">
                                                                <div className="flex items-center space-x-2">
                                                                    <ClockIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                                    <span className="text-xs font-medium dark:text-gray-300 text-gray-700 group-hover:dark:text-white">Recents</span>
                                                                </div>
                                                                <span className="text-[10px] text-gray-500 font-bold">3</span>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="study_tools"
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        exit={{ x: 20, opacity: 0 }}
                                                        className="space-y-1"
                                                    >
                                                        <button 
                                                            onClick={() => setContextMenuStep('main')}
                                                            className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group mb-2"
                                                        >
                                                            <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                                                            <span className="text-xs font-bold text-gray-500 group-hover:dark:text-white">Study tools</span>
                                                        </button>
                                                        
                                                        {[
                                                            { name: 'Quiz', icon: <QuizIcon className="w-4 h-4" /> },
                                                            { name: 'Flashcards', icon: <FlashcardIcon className="w-4 h-4" /> },
                                                            { name: 'Mind Map', icon: <MindMapIcon className="w-4 h-4" /> },
                                                            { name: 'Flow Chart', icon: <FlowChartIcon className="w-4 h-4 text-green-500" /> },
                                                            { name: 'Timeline', icon: <TimelineIcon className="w-4 h-4" /> },
                                                            { name: 'Bar Chart', icon: <BarChartIcon className="w-4 h-4" /> },
                                                            { name: 'Line Chart', icon: <LineChartIcon className="w-4 h-4" /> },
                                                            { name: 'Pie Chart', icon: <PieChartIcon className="w-4 h-4" /> },
                                                            { name: 'Venn Diagram', icon: <VennDiagramIcon className="w-4 h-4" /> },
                                                        ].map((tool) => (
                                                            <button 
                                                                key={tool.name}
                                                                className="w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg hover:dark:bg-white/5 hover:bg-gray-50 transition-colors text-left group"
                                                            >
                                                                <div className="text-gray-400 group-hover:text-white">
                                                                    {tool.icon}
                                                                </div>
                                                                <span className="text-xs font-medium dark:text-gray-300 text-gray-700 group-hover:dark:text-white">{tool.name}</span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <LinkIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <MicIcon className="w-4 h-4" />
                            </button>
                            {inputValue.trim() ? (
                                <button onClick={handleSendMessage} className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md">
                                    <ArrowUpIcon className="w-4 h-4" />
                                </button>
                            ) : (
                                <button onClick={() => setIsVoiceMode(true)} className="flex items-center space-x-2 px-3 py-1.5 rounded-full dark:bg-white/10 bg-black text-white text-[11px] font-bold hover:opacity-90 transition-opacity">
                                    <WaveformIcon className="w-3 h-3" />
                                    <span>Voice</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderQuiz = () => {
        // BRANCH A - Generating state (bypasses loadedTabs check for instant shimmer)
        if (quizViewingState === 'generating') {
            return (
                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500" />
                        <span className="text-gray-400 text-sm font-medium">
                            Generating your quiz with OpenRouter AI...
                        </span>
                    </div>
                    <div className="w-full space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 h-[120px] relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                            </div>
                        ))}
                    </div>
                    <style>{`
                        @keyframes shimmer {
                            100% { transform: translateX(100%); }
                        }
                    `}</style>
                </div>
            );
        }

        // BRANCH B - Tab not yet loaded
        if (!loadedTabs.has('quiz')) return renderShimmer();

        // BRANCH C - Active quiz session
        if (quizViewingState === 'active') {
            const activeQuiz = quizzes.find(q => q.id === activeQuizId);
            if (!activeQuiz) {
                setQuizViewingState('none');
                return null;
            }
            return (
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => setQuizViewingState('none')} className="flex items-center text-xs font-bold text-gray-500 hover:text-white">
                            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                        </button>
                        <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded uppercase">Question 1/5</span>
                    </div>
                    <div className="p-5 rounded-2xl dark:bg-[#1a1a1a] bg-neutral-50 border dark:border-gray-800 border-neutral-200">
                        <h4 className="font-bold dark:text-white text-black mb-4 text-lg">{quizData[0]?.question || ''}</h4>
                        <div className="space-y-3">
                            {(quizData[0]?.options || []).map((opt: string, i: number) => (
                                <button 
                                    key={i}
                                    onClick={() => setQuizAnswers({...quizAnswers, [activeQuiz.id]: i})}
                                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center ${
                                        quizAnswers[activeQuiz.id] === i 
                                        ? 'border-orange-500 bg-orange-500/10 dark:text-white text-black' 
                                        : 'dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                        quizAnswers[activeQuiz.id] === i ? 'border-orange-500' : 'border-gray-400'
                                    }`}>
                                        {quizAnswers[activeQuiz.id] === i && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                    </div>
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6">
                            <button 
                                onClick={() => setExpandedHint(expandedHint === 'q1' ? null : 'q1')}
                                className="w-full py-3 dark:bg-[#222] bg-neutral-200 rounded-2xl flex items-center justify-center space-x-2 hover:opacity-80 transition-opacity"
                            >
                                <span className="text-sm font-bold dark:text-gray-300 text-gray-700">Hint</span>
                                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedHint === 'q1' ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {expandedHint === 'q1' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-3"
                                    >
                                        <div className="dark:bg-[#1a1a24] bg-blue-50 border dark:border-blue-900/30 border-blue-200 rounded-2xl p-4 flex items-start space-x-3">
                                            <div className="shrink-0 mt-0.5">
                                                <SparkleIcon className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <p className="text-sm dark:text-gray-300 text-blue-900 leading-relaxed font-medium">
                                                {quizData[0]?.hint || ''}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">Next Question</button>
                        </div>
                    </div>
                </div>
            );
        }

        // BRANCH D - Idle / list view (default)
        return (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <CreateCard 
                    title="Create Quiz" 
                    desc="Create quiz sets with preferred question types, difficulty, and more."
                    rightElement={<GenerateHeader onAdjust={() => setShowQuizModal(true)} />}
                />
                
                {activeQuizId === null && (
                    <div className="space-y-4">
                        {quizzes.map((q) => (
                            <div 
                                key={q.id}
                                onClick={() => setActiveQuizId(q.id)}
                                className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 cursor-pointer hover:border-orange-500 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold dark:text-white text-black text-sm group-hover:text-orange-500 transition-colors">{q.title}</h4>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-[10px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-md">Score: {q.score}</span>
                                    <span className="text-[10px] text-gray-500">{q.questions} questions</span>
                                    <span className="text-[10px] text-gray-500">{q.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
;

    const renderFlashcards = () => {
        if (!loadedTabs?.has('flashcards')) return renderShimmer();

        const isReviewMode = activeDeckId && (generatedCards?.length ?? 0) > 0;

        return (
            <div className="flex-1 min-h-0 flex flex-col">
                {/* â”€â”€ Deck list view (Generate box + My Flashcards) â”€â”€ */}
                {!isReviewMode && (
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-6">
                        <CreateCard 
                            title="Create Flashcard" 
                            desc="Create a flashcard set with preferred number of cards, types of topics, and more."
                            rightElement={<GenerateHeader onAdjust={() => setShowFlashcardModal(true)} />}
                        />
                        {flashcards.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold dark:text-gray-400 text-gray-600">My Flashcards</h4>
                                {flashcards.map(deck => (
                                    <div 
                                        key={deck?.id}
                                        onClick={() => {
                                            setActiveDeckId(deck?.id);
                                        }}
                                        className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 cursor-pointer hover:border-orange-500 transition-all group"
                                    >
                                        <h4 className="font-bold dark:text-white text-black text-sm mb-3 group-hover:text-orange-500 transition-colors">{deck?.title}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[10px] font-bold text-purple-400 bg-purple-900/30 px-2 py-1 rounded-md border border-purple-500/20">Cards for today: {deck?.count} cards</span>
                                            <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded-md border border-blue-500/20">Selected All Topics</span>
                                            <span className="text-[10px] font-bold text-gray-500 py-1">{deck?.topics}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* â”€â”€ Flashcard review view (Generate box hidden) â”€â”€ */}
                {isReviewMode && (
                    <div className="flex-1 min-h-0 flex flex-col">
                        <FlashcardReviewController 
                            cards={generatedCards ?? []}
                            onBack={() => { 
                                setActiveDeckId(null); 
                            }}
                            onShowSource={handleShowSource}
                            isGenerating={isGenerating}
                        />
                    </div>
                )}
            </div>
        );
    };

    const renderSummary = () => {
        const hasSummary = summaryData && (summaryData.paragraph || (summaryData.bullets && summaryData.bullets.length > 0));
        
        return (
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with back button */}
                <div className="shrink-0 px-4 py-3 border-b dark:border-white/10 border-neutral-200 flex items-center justify-between">
                    <button 
                        onClick={() => setActiveTabId('learn')}
                        className="flex items-center gap-2 text-sm dark:text-gray-400 text-gray-600 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Back to Learn
                    </button>
                    {hasSummary && (
                        <button 
                            onClick={() => handleGenerateSummary()}
                            disabled={isSummaryGenerating}
                            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                        >
                            {isSummaryGenerating ? 'Regenerating...' : 'Regenerate'}
                        </button>
                    )}
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isSummaryGenerating && (
                        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-4">Generating summary...</p>
                        </div>
                    )}
                    
                    {summaryError && !isSummaryGenerating && (
                        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 text-center">
                            <p className="text-red-500 text-sm mb-4">{summaryError}</p>
                            <button 
                                onClick={() => {
                                    setSummaryError(null);
                                    handleGenerateSummary();
                                }}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    
                    {hasSummary && !isSummaryGenerating && !summaryError && (
                        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
                            {/* Paragraph */}
                            {summaryData.paragraph && (
                                <div className="text-base leading-relaxed dark:text-gray-300 text-gray-700">
                                    {summaryData.paragraph}
                                </div>
                            )}
                            
                            {/* Bullets with timestamps */}
                            {summaryData.bullets && summaryData.bullets.length > 0 && (
                                <div className="space-y-3">
                                    {summaryData.bullets.map((bullet, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <span className="shrink-0 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            </span>
                                            <div className="flex-1">
                                                <span className="text-sm dark:text-gray-300 text-gray-700">{bullet.text}</span>
                                                {bullet.timestamp && (
                                                    <span className="ml-2 text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                                                        {bullet.timestamp}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="mt-6 flex justify-end space-x-2 pt-4 border-t dark:border-gray-700 border-gray-200">
                                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"><CopyIcon className="w-4 h-4" /></button>
                                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"><ShareIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}
                    
                    {!hasSummary && !isSummaryGenerating && !summaryError && (
                        <div className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-8 text-center">
                            <p className="text-sm text-gray-500">Generating summary...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderPodcast = () => {
        if (!loadedTabs.has('podcast')) return renderShimmer();

        return (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <CreateCard 
                    title="Create Podcast" 
                    desc="Turn your content into an engaging audio conversation with two speakers."
                    rightElement={<GenerateHeader onAdjust={() => setShowPodcastModal(true)} />}
                />
                
                <div className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-pink-600 mb-6 flex items-center justify-center shadow-lg relative">
                        {isPlaying ? (
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4].map(i => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: [10, 30, 10] }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                        className="w-1.5 bg-white rounded-full"
                                    />
                                ))}
                            </div>
                        ) : (
                            <SpeakerWaveIcon className="w-10 h-10 text-white" />
                        )}
                        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                    </div>
                    <h3 className="text-lg font-bold dark:text-white text-black mb-1">Generative AI Essentials</h3>
                    <p className="text-xs text-gray-500 mb-6">Episode 1 â€¢ 12 min</p>
                    
                    <div className="w-full max-w-sm flex items-center space-x-4">
                        <span className="text-xs text-gray-500 font-mono">00:00</span>
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">12:00</span>
                    </div>

                    <div className="flex items-center space-x-6 mt-6">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors"><RefreshIcon className="w-5 h-5 transform -scale-x-100" /></button>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors"><RefreshIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Main Render ---
    return (
        <div className={`h-full flex flex-col dark:bg-[#0a0a0a] bg-white border-l dark:border-white/10 border-neutral-200 transition-all duration-300 relative z-40 ${isPanelExpanded ? 'w-full' : 'w-full'} pt-20`}>
            
            {/* Dynamic Tab Bar (Browser-style) */}
            <div className="flex items-center px-2 py-2 border-b dark:border-white/10 border-neutral-200 overflow-x-auto no-scrollbar gap-1 shrink-0">
                {workspaceTabs.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    const isDragging = tab.id === draggedTabId;
                    return (
                        <div
                            key={tab.id}
                            draggable={workspaceTabs.length > 1}
                            onDragStart={() => handleTabDragStart(tab.id)}
                            onDragOver={(e) => handleTabDragOver(e, tab.id)}
                            onDragEnd={handleTabDragEnd}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none max-w-[160px] group ${
                                isDragging ? 'opacity-50' : ''
                            } ${
                                isActive
                                ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-sm border dark:border-white/5 border-gray-200'
                                : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                            }`}
                        >
                            {isActive && (
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] shrink-0" />
                            )}
                            <span className="truncate">{tab.title}</span>
                            {tab.closable && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                                    className="shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                                >
                                    <XIcon className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    );
                })}
                {/* "+" Add Tab Button */}
                <button
                    onClick={() => setActiveTabId('learn')}
                    className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
                {/* Fullscreen toggle */}
                <button
                    onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                    className="shrink-0 ml-auto p-1.5 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                    <MaximizeIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTabId}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        {getActiveTabType() === 'learn' && renderLearnTab()}
                        {getActiveTabType() === 'chat' && renderChat()}
                        {getActiveTabType() === 'quiz' && renderQuiz()}
                        {getActiveTabType() === 'flashcards' && renderFlashcards()}
                        {getActiveTabType() === 'summary' && renderSummary()}
                        {getActiveTabType() === 'podcast' && renderPodcast()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showQuizModal && <QuizModal onClose={() => setShowQuizModal(false)} onGenerate={handleGenerateQuiz} />}
                {showFlashcardModal && (
                    <FlashcardModal 
                        onClose={() => setShowFlashcardModal(false)}
                        onConfirm={(settings) => {
                            setFlashcardSettings(settings);
                            // One-click: close modal + trigger generation
                            handleGenerateFlashcards();
                        }}
                    />
                )}
                {showSummaryModal && <SummaryModal onClose={() => setShowSummaryModal(false)} onGenerate={handleGenerateSummary} />}
                {showPodcastModal && <PodcastModal onClose={() => setShowPodcastModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default TutorPanel;



