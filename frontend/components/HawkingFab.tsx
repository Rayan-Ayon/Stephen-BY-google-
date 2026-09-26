import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { 
    ArrowUpIcon, XIcon, PlusIcon, AdjustIcon, ChevronDownIcon,
    MicIcon, ProjectIcon, BookOpenIcon, DebatePodiumIcon,
    MessageCircleIcon, FlashIcon, PresentationIcon, UploadIcon, HeadsetIcon
} from './icons';
import { DORMANT_NAV_ENABLED } from './dormantNav';

interface Message {
    role: 'user' | 'model';
    text: string;
    time?: string;
}

interface HawkingFabProps {
    onNavigate: (view: string, data?: any) => void;
}

const STARTER_PROMPTS = [
    "Explain why I got a 0.0 on my reading test",
    "Help me with Task 2 essay writing",
    "Practice speaking with me",
];

const RAYAN_FALLBACKS: Record<string, string> = {
    reading_zero: "Getting a 0.0 on a reading test usually happens due to one of three technical or formatting issues:\n\n1. **Unsubmitted or Timed Out**: Answers were not synced before the timer expired or test session closed.\n2. **Case / Spelling Sensitivity**: Answers with typos or extra spaces (e.g., writing 'True' when 'TRUE' was expected, or exceeding word limits like 'NO MORE THAN TWO WORDS').\n3. **Blank Answer Sheet**: Questions skipped without selecting options in the palette.\n\nDon't worry! Let's review the exact passage and question types you struggled with so we can fix it.",
    task2: "For IELTS Task 2 essays, achieving Band 7+ requires mastering the 4 scoring criteria:\n\n• **Task Achievement (25%)**: Present a clear position throughout, address all prompt parts, and support main ideas.\n• **Coherence & Cohesion (25%)**: Logical 4-paragraph structure (Intro, 2 Body paragraphs, Conclusion) with varied discourse markers.\n• **Lexical Resource (25%)**: Natural collocations and topic-specific vocabulary.\n• **Grammar (25%)**: Mix of complex sentences (conditionals, relative clauses) with high accuracy.\n\nWhat is your essay topic or prompt? Share it here and I'll outline or evaluate it!",
    speaking: "Let's practice IELTS Speaking! In the real exam, examiners grade you on Fluency, Lexical Resource, Grammatical Accuracy, and Pronunciation.\n\nHere is a Part 1 warmup topic:\n**'Do you prefer studying alone or with a group of friends? Why?'**\n\nClick the microphone button to record your voice or type your answer, and I'll give you instant band feedback!",
    default: "Hello! I'm Rayan, your personal IELTS tutor. Whether you need help diagnosing reading scores, structuring Task 2 essays, sharpening speaking fluency, or mastering listening question types, I'm here for you. What would you like to work on right now?"
};

function getRayanFallback(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('0.0') || (q.includes('reading') && (q.includes('zero') || q.includes('score')))) {
        return RAYAN_FALLBACKS.reading_zero;
    }
    if (q.includes('task 2') || q.includes('essay') || q.includes('writing')) {
        return RAYAN_FALLBACKS.task2;
    }
    if (q.includes('speaking') || q.includes('practice speaking') || q.includes('cue card')) {
        return RAYAN_FALLBACKS.speaking;
    }
    return RAYAN_FALLBACKS.default;
}

const RayanAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-7 h-7 text-xs',
        md: 'w-9 h-9 text-base',
        lg: 'w-16 h-16 text-2xl',
    };
    return (
        <div className={`${sizeClasses[size]} rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/50 flex items-center justify-center shrink-0 shadow-sm font-bold text-red-600 dark:text-red-400 select-none`}>
            🦉
        </div>
    );
};

const HawkingFab: React.FC<HawkingFabProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    
    // Tools & Plus menus
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [activeTool, setActiveTool] = useState<{name: string, icon: React.ReactNode} | null>(null);

    // Audio / Voice recording state
    const [isRecording, setIsRecording] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const toolsMenuRef = useRef<HTMLDivElement>(null);
    const plusMenuRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    // Initialize Gemini AI
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "undefined") {
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const chatInstance = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: "You are Rayan, an elite personal IELTS tutor and mentor. You assist students preparing for the IELTS exam (Academic and General Training). You specialize in Reading diagnostics, Task 1 & Task 2 essay writing, Speaking fluency & mock interviews, and Listening strategies. Keep answers encouraging, structured, practical, and focused on maximizing their band score.",
                },
            });
            setChat(chatInstance);
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI in Rayan chatbot:", error);
        }
    }, []);

    // Speech Recognition Setup
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSpeechSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                const currentText = finalTranscript || interimTranscript;
                if (currentText) {
                    setInputValue(prev => {
                        const trimmed = prev.trim();
                        return trimmed ? `${trimmed} ${currentText.trim()}` : currentText.trim();
                    });
                }
            };

            recognition.onerror = (e: any) => {
                console.warn('Speech recognition error:', e);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleRecording = () => {
        if (!speechSupported) {
            // Simulated voice recording state if Web Speech is blocked in browser
            if (!isRecording) {
                setIsRecording(true);
                setInputValue("Speaking practice: I would like to improve my IELTS speaking score.");
                setTimeout(() => setIsRecording(false), 3000);
            } else {
                setIsRecording(false);
            }
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsRecording(true);
            } catch (err) {
                console.warn('Could not start speech recognition:', err);
                setIsRecording(false);
            }
        }
    };

    // Outside Click Handling
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
            if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
                setIsPlusMenuOpen(false);
            }
            if (inputContainerRef.current && !inputContainerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen, isLoading]);

    const handleSendMessage = async (textToSend?: string) => {
        const text = (textToSend || inputValue).trim();
        if (!text || isLoading) return;

        // Tool Redirection Logic
        if (activeTool?.name === 'Debate') {
            setIsOpen(false);
            onNavigate('debate', { initialMessage: text });
            setInputValue('');
            setActiveTool(null);
            return;
        }
        if (!DORMANT_NAV_ENABLED && activeTool?.name === 'Add Courses') {
            setIsOpen(false);
            onNavigate('add_courses', { topic: text });
            setInputValue('');
            setActiveTool(null);
            return;
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text, time: timeStr }]);
        setIsLoading(true);

        if (chat) {
            try {
                const stream = await chat.sendMessageStream({ message: text });
                let firstChunk = true;
                for await (const chunk of stream) {
                    const chunkText = chunk.text;
                    if (firstChunk) {
                        setMessages(prev => [...prev, { role: 'model', text: chunkText, time: timeStr }]);
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
                console.error("Rayan AI Error:", error);
                const fallback = getRayanFallback(text);
                setMessages(prev => [...prev, { role: 'model', text: fallback, time: timeStr }]);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Offline / Fallback Response
            setTimeout(() => {
                const fallback = getRayanFallback(text);
                setMessages(prev => [...prev, { role: 'model', text: fallback, time: timeStr }]);
                setIsLoading(false);
            }, 600);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toolsList = [
        { name: 'Add Project', icon: <ProjectIcon className="w-4 h-4" /> },
        { name: 'Add Content', icon: <PlusIcon className="w-4 h-4" /> },
        ...(DORMANT_NAV_ENABLED ? [] : [{ name: 'Add Courses', icon: <BookOpenIcon className="w-4 h-4" /> }]),
        { name: 'Debate', icon: <DebatePodiumIcon className="w-4 h-4" /> },
        { name: 'Q&A', icon: <MessageCircleIcon className="w-4 h-4" /> },
        { name: 'Instant describe', icon: <FlashIcon className="w-4 h-4" /> },
        { name: 'Presentation', icon: <PresentationIcon className="w-4 h-4" /> }
    ];

    const handleToolClick = (toolName: string) => {
        setIsToolsOpen(false);
        const tool = toolsList.find(t => t.name === toolName);
        if (tool) {
            setActiveTool(tool);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-[92vw] sm:w-[420px] h-[72vh] max-h-[620px] bg-white dark:bg-[#121318] rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col z-50 overflow-hidden"
                    >
                        {/* ── Header: Rayan & Close ── */}
                        <div className="p-4 border-b border-gray-100 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-[#15161D]">
                            <div className="flex items-center gap-3">
                                <RayanAvatar size="sm" />
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                        Rayan
                                    </h3>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                        Your personal IELTS tutor
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ── Messages & Starter Area ── */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FCFCFD] dark:bg-[#0E0F14] relative">
                            {/* Starter Greeting Screen (When no messages yet) */}
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-2 py-6">
                                    <div className="mb-3">
                                        <RayanAvatar size="lg" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Hi, I'm Rayan!
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 mb-6 max-w-xs leading-relaxed">
                                        Your personal IELTS tutor. Ask me anything.
                                    </p>

                                    {/* 3 Quick Starter Prompt Pills */}
                                    <div className="w-full space-y-2">
                                        {STARTER_PROMPTS.map((prompt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(prompt)}
                                                className="w-full bg-white dark:bg-[#16171E] border border-gray-200/90 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/60 rounded-full px-4 py-2.5 text-xs text-left text-gray-700 dark:text-zinc-300 font-medium hover:text-red-600 dark:hover:text-white shadow-xs hover:shadow-sm transition-all cursor-pointer truncate"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                                                msg.role === 'user' 
                                                    ? 'bg-red-600 text-white rounded-br-none' 
                                                    : 'bg-white dark:bg-[#171821] border border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 rounded-bl-none'
                                            }`}>
                                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                                {msg.time && (
                                                    <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-red-200' : 'text-gray-400'}`}>
                                                        {msg.time}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start items-center gap-2">
                                            <RayanAvatar size="sm" />
                                            <div className="bg-white dark:bg-[#171821] border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 flex space-x-1.5 shadow-xs">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-75"></div>
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-150"></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* ── Input Bar ── */}
                        <div className="p-3 bg-white dark:bg-[#14151C] border-t border-gray-100 dark:border-zinc-800/80">
                            {/* Live Audio Equalizer / Waveform when Recording */}
                            {isRecording && (
                                <div className="mb-2 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-between text-xs text-red-600 dark:text-red-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                                        <span className="font-semibold text-[11px]">Listening to your voice...</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1 h-5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                                        <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '75ms' }} />
                                    </div>
                                </div>
                            )}

                            <div 
                                ref={inputContainerRef}
                                className={`relative bg-gray-50 dark:bg-[#0E0F14] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xs transition-all ${
                                    isFocused || inputValue.trim() ? 'ring-1 ring-red-400/50 border-red-300 dark:border-red-900/60' : ''
                                }`}
                            >
                                <textarea 
                                    ref={textareaRef} 
                                    value={inputValue} 
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                                    }} 
                                    onKeyPress={handleKeyPress}
                                    onFocus={() => setIsFocused(true)}
                                    placeholder="Message Rayan..."
                                    className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 px-4 pt-3 pb-2 resize-none font-medium leading-relaxed" 
                                    rows={1}
                                    style={{ minHeight: isFocused || inputValue.trim() ? '56px' : '44px' }}
                                />
                                
                                <div className="flex items-center justify-between px-3 pb-2">
                                    <div className="flex items-center space-x-1.5">
                                        {/* Plus Menu Button */}
                                        <div className="relative" ref={plusMenuRef}>
                                            <button 
                                                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                                                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors cursor-pointer"
                                                title="Add attachments"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                            <AnimatePresence>
                                                {isPlusMenuOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full left-0 mb-2 w-44 bg-white dark:bg-[#1A1B24] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                                    >
                                                        {[
                                                            { label: 'Upload files', icon: <UploadIcon className="w-3.5 h-3.5" /> },
                                                            { label: 'Add from Drive', icon: <div className="w-3.5 h-3.5 text-green-500"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l3.43 6h11.72l6.55-11.5-3.42-6H7.71zm8.87 1.5l3.4 6-3.27 5.75H5.43L8.7 5h7.88zm-6.55 1.7L4.57 16h6.86l5.46-9.28H10.03z"/></svg></div> },
                                                        ].map((item) => (
                                                            <button 
                                                                key={item.label}
                                                                onClick={() => setIsPlusMenuOpen(false)}
                                                                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                                                            >
                                                                <div className="opacity-80">{item.icon}</div>
                                                                <span className="font-medium">{item.label}</span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        
                                        {/* Tools Dropdown Button */}
                                        <div className="relative" ref={toolsMenuRef}>
                                            <button 
                                                onClick={() => setIsToolsOpen(!isToolsOpen)}
                                                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-colors text-[11px] font-bold cursor-pointer ${
                                                    isToolsOpen 
                                                        ? 'bg-gray-200 dark:bg-zinc-800 border-gray-400 dark:border-zinc-700 text-gray-900 dark:text-white' 
                                                        : 'hover:bg-gray-200 dark:hover:bg-zinc-800/80 border-transparent text-gray-500 dark:text-zinc-400'
                                                }`}
                                            >
                                                <AdjustIcon className="w-3 h-3" />
                                                <span>Tools</span>
                                                <ChevronDownIcon className={`w-2.5 h-2.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            <AnimatePresence>
                                                {isToolsOpen && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#1A1B24] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                                    >
                                                        {toolsList.map((tool) => (
                                                            <button 
                                                                key={tool.name}
                                                                onClick={() => handleToolClick(tool.name)}
                                                                className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                                                            >
                                                                <div className="text-gray-500 dark:text-zinc-400">{tool.icon}</div>
                                                                <span className="font-medium">{tool.name}</span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Active Tool Chip */}
                                        <AnimatePresence>
                                            {activeTool && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                                    className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-[10px] font-bold text-red-700 dark:text-red-300"
                                                >
                                                    <span className="scale-75">{activeTool.icon}</span>
                                                    <span>{activeTool.name}</span>
                                                    <button 
                                                        onClick={() => setActiveTool(null)}
                                                        className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 text-red-600 dark:text-red-400 cursor-pointer"
                                                    >
                                                        <XIcon className="w-2.5 h-2.5" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    {/* Right Side: Microphone Button & Send Button */}
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={toggleRecording}
                                            className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                                isRecording 
                                                    ? 'bg-red-500/20 text-red-600 ring-2 ring-red-500 animate-pulse' 
                                                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                                            }`}
                                            title={isRecording ? 'Stop listening' : 'Start voice input'}
                                        >
                                            <MicIcon className="w-4 h-4" />
                                        </button>

                                        <button 
                                            onClick={() => handleSendMessage()}
                                            disabled={isLoading || !inputValue.trim()}
                                            className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                                inputValue.trim() 
                                                    ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' 
                                                    : 'bg-transparent text-gray-400 opacity-50 cursor-not-allowed'
                                            }`}
                                            title="Send message"
                                        >
                                            <ArrowUpIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Universal Floating Headset Button (FAB) ── */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#111827] hover:bg-black text-white shadow-2xl flex items-center justify-center z-50 group transition-all border border-zinc-700/60 cursor-pointer"
                title="Open Rayan IELTS Tutor"
            >
                <HeadsetIcon className="w-6 h-6 group-hover:scale-110 transition-transform text-white" />
                
                {/* Red Pulse Notification Dot */}
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
            </motion.button>
        </>
    );
};

export default HawkingFab;
