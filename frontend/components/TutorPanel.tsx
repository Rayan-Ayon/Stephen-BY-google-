
import React, { useState, useEffect, useRef } from 'react';
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

interface TutorPanelProps {
    isPanelExpanded: boolean;
    setIsPanelExpanded: (expanded: boolean) => void;
    isCoachMode: boolean;
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

const TutorPanel: React.FC<TutorPanelProps> = ({ isPanelExpanded, setIsPanelExpanded, isCoachMode }) => {
    const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'flashcards' | 'summary' | 'podcast'>('chat');
    
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
    const [quizzes, setQuizzes] = useState<any[]>(MOCK_QUIZZES);
    const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
    
    const [flashcards, setFlashcards] = useState<any[]>(MOCK_FLASHCARDS);
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

    // Initialize GenAI
    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "You are an AI tutor helping a student with their course material. Be helpful, concise, and encouraging.",
            },
        });
        setChat(chatInstance);
    }, []);

    // Simulate Loading for Tabs
    useEffect(() => {
        if (['quiz', 'flashcards', 'podcast'].includes(activeTab) && !loadedTabs.has(activeTab)) {
            const timer = setTimeout(() => {
                setLoadedTabs(prev => new Set(prev).add(activeTab));
            }, 1500); // 1.5s Shimmer Effect
            return () => clearTimeout(timer);
        }
    }, [activeTab, loadedTabs]);

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
        if (activeTab === 'chat' && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading, activeTab]);

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
    const GenerateHeader = ({ onAdjust }: { onAdjust: () => void }) => (
        <div className="flex items-center space-x-3">
            <button 
                onClick={onAdjust}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
                <AdjustIcon className="w-5 h-5" />
            </button>
            <button 
                disabled 
                className="px-6 py-2 bg-white text-black font-bold rounded-full text-xs cursor-not-allowed opacity-90 hover:opacity-100 transition-opacity"
            >
                Generate
            </button>
        </div>
    );

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
                <button onClick={() => { setActiveTab('quiz'); setShowQuizModal(true); }} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <QuizIcon className="w-4 h-4" /> <span>Quiz</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <MindMapIcon className="w-4 h-4" /> <span>Mind Map</span>
                </button>
                <button onClick={() => setIsVoiceMode(true)} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
                    <WaveformIcon className="w-4 h-4" /> <span>Voice Mode</span>
                </button>
                <button onClick={() => { setActiveTab('flashcards'); setShowFlashcardModal(true); }} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border dark:border-white/5 dark:bg-white/5 bg-neutral-100 border-neutral-200 text-xs font-bold dark:text-gray-400 text-neutral-600 hover:dark:bg-white/10 hover:bg-neutral-200 transition-all">
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
        if (!loadedTabs.has('quiz')) return renderShimmer();

        const activeQuiz = quizzes.find(q => q.id === activeQuizId);
        
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

                {activeQuiz && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setActiveQuizId(null)} className="flex items-center text-xs font-bold text-gray-500 hover:text-white">
                                <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                            </button>
                            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded uppercase">Question 1/5</span>
                        </div>
                        <div className="p-5 rounded-2xl dark:bg-[#1a1a1a] bg-neutral-50 border dark:border-gray-800 border-neutral-200">
                            <h4 className="font-bold dark:text-white text-black mb-4 text-lg">What is the primary function of a Transformer model?</h4>
                            <div className="space-y-3">
                                {['Image Generation', 'Sequence Transduction', 'Database Management', 'Network Routing'].map((opt, i) => (
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
                            <div className="mt-6 flex justify-end">
                                <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">Next Question</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderFlashcards = () => {
        if (!loadedTabs.has('flashcards')) return renderShimmer();

        const dummyCards = [
            { q: "What is Generative AI?", a: "AI that can create new content like text, images, and audio." },
            { q: "Define LLM", a: "Large Language Model - trained on vast amounts of text data." },
            { q: "What is Prompt Engineering?", a: "The art of crafting inputs to get the best outputs from AI." }
        ];
        const currentCards = activeDeckId ? dummyCards : [];

        return (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <CreateCard 
                    title="Create Flashcard" 
                    desc="Create a flashcard set with preferred number of cards, types of topics, and more."
                    rightElement={<GenerateHeader onAdjust={() => setShowFlashcardModal(true)} />}
                />

                {!activeDeckId && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold dark:text-gray-400 text-gray-600 mb-2">My Flashcards</h4>
                        {flashcards.map(deck => (
                            <div 
                                key={deck.id}
                                onClick={() => setActiveDeckId(deck.id)}
                                className="dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 cursor-pointer hover:border-orange-500 transition-all group"
                            >
                                <h4 className="font-bold dark:text-white text-black text-sm mb-3 group-hover:text-orange-500 transition-colors">{deck.title}</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-purple-400 bg-purple-900/30 px-2 py-1 rounded-md border border-purple-500/20">Cards for today: {deck.count} cards</span>
                                    <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded-md border border-blue-500/20">Selected All Topics</span>
                                    <span className="text-[10px] font-bold text-gray-500 py-1">{deck.topics}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeDeckId && (
                    <div className="flex-1 flex flex-col">
                        <button onClick={() => setActiveDeckId(null)} className="flex items-center text-xs font-bold text-gray-500 hover:text-white mb-4">
                            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to Decks
                        </button>
                        
                        <div className="flex-1 flex flex-col items-center justify-center p-4">
                            <div 
                                className="w-full h-64 perspective-1000 cursor-pointer"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <motion.div
                                    className="relative w-full h-full text-center transition-all duration-500 transform-style-3d"
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                >
                                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#1a1a1a] border dark:border-gray-800 border-neutral-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Question</span>
                                        <p className="text-xl font-bold dark:text-white text-black">{currentCards[activeFlashcardIndex]?.q}</p>
                                    </div>
                                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#1a1a1a] border dark:border-gray-800 border-neutral-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm transform rotate-y-180">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Answer</span>
                                        <p className="text-xl font-medium dark:text-gray-200 text-gray-800">{currentCards[activeFlashcardIndex]?.a}</p>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="flex items-center space-x-8 mt-8">
                                <button onClick={(e) => { e.stopPropagation(); setActiveFlashcardIndex(prev => Math.max(0, prev - 1)); setIsFlipped(false); }} disabled={activeFlashcardIndex === 0} className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                                    <ChevronLeftIcon className="w-5 h-5 dark:text-white text-black" />
                                </button>
                                <span className="text-sm font-bold dark:text-white text-black">{activeFlashcardIndex + 1} / {currentCards.length}</span>
                                <button onClick={(e) => { e.stopPropagation(); setActiveFlashcardIndex(prev => Math.min(currentCards.length - 1, prev + 1)); setIsFlipped(false); }} disabled={activeFlashcardIndex === currentCards.length - 1} className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                                    <ChevronRightIcon className="w-5 h-5 dark:text-white text-black" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSummary = () => {
        // Removed shimmer check to show content immediately as requested
        return (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <CreateCard 
                    title="Generate Summary" 
                    desc="Create a summary from content. Choose detailed, cheat sheet, or short formats."
                    rightElement={<SummaryHeaderRight />}
                />
                <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm">
                    <div className="prose dark:prose-invert max-w-none text-sm">
                        <div dangerouslySetInnerHTML={{ __html: MOCK_SUMMARY.replace(/\n/g, '<br/>') }} />
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"><CopyIcon className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"><ShareIcon className="w-4 h-4" /></button>
                    </div>
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
                    <p className="text-xs text-gray-500 mb-6">Episode 1 • 12 min</p>
                    
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
            {/* Header Tabs */}
            <div className="flex items-center px-4 py-3 border-b dark:border-white/10 border-neutral-200 overflow-x-auto no-scrollbar gap-2 shrink-0">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'chat' 
                        ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-sm border dark:border-white/5 border-gray-200' 
                        : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                    }`}
                >
                    {activeTab === 'chat' ? (
                        <div className={`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] mr-2`} />
                    ) : (
                        <BrainIcon className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    <span>Chat</span>
                </button>
                <button 
                    onClick={() => setActiveTab('flashcards')}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'flashcards' 
                        ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-sm border dark:border-white/5 border-gray-200' 
                        : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                    }`}
                >
                    <FlashcardIcon className="w-3.5 h-3.5 mr-1.5" />
                    <span>Flashcards</span>
                </button>
                <button 
                    onClick={() => setActiveTab('quiz')}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'quiz' 
                        ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-sm border dark:border-white/5 border-gray-200' 
                        : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                    }`}
                >
                    <QuizIcon className="w-3.5 h-3.5 mr-1.5" />
                    <span>Quizzes</span>
                </button>
                <button 
                    onClick={() => setActiveTab('podcast')}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'podcast' 
                        ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-sm border dark:border-white/5 border-gray-200' 
                        : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                    }`}
                >
                    <PodcastIcon className="w-3.5 h-3.5 mr-1.5" />
                    <span>Podcast</span>
                </button>
                <button 
                    onClick={() => setActiveTab('summary')}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'summary' 
                        ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-sm border dark:border-white/5 border-gray-200' 
                        : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                    }`}
                >
                    <SummaryIcon className="w-3.5 h-3.5 mr-1.5" />
                    <span>Summary</span>
                </button>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'chat' && renderChat()}
                {activeTab === 'quiz' && renderQuiz()}
                {activeTab === 'flashcards' && renderFlashcards()}
                {activeTab === 'summary' && renderSummary()}
                {activeTab === 'podcast' && renderPodcast()}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showQuizModal && <QuizModal onClose={() => setShowQuizModal(false)} />}
                {showFlashcardModal && <FlashcardModal onClose={() => setShowFlashcardModal(false)} />}
                {showSummaryModal && <SummaryModal onClose={() => setShowSummaryModal(false)} />}
                {showPodcastModal && <PodcastModal onClose={() => setShowPodcastModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default TutorPanel;
