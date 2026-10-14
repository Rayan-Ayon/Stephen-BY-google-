import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';
import { useRayanChat } from '@/context/RayanChatContext';
import RayanMessageFormatter from './chat/RayanMessageFormatter';
import AIRewriterHistoryModal from './enterprise/writing/AIRewriterHistoryModal';
import SpeakingEvaluationCanvas from './enterprise/speaking/SpeakingEvaluationCanvas';
import WritingAnalysisModal from './enterprise/ielts/WritingAnalysisModal';
import HistoryAnalysisModal from './enterprise/history/HistoryAnalysisModal';

/* ─── Inline SVG Icons ──────────────────────────────────────────────── */

const HamburgerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const MessageCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

/* ─── Owl Avatar (Rayan) ─────────────────────────────────────────────── */

const RayanAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-7 h-7 text-xs',
        md: 'w-9 h-9 text-base',
        lg: 'w-16 h-16 text-3xl',
    };
    return (
        <div className={`${sizeClasses[size]} bg-emerald-950/70 border border-emerald-800/60 rounded-full flex items-center justify-center shadow-md shrink-0 select-none`}>
            🦉
        </div>
    );
};

/* ─── 4 Action Starter Prompts ──────────────────────────────────────── */

const QUICK_PROMPTS = [
    { title: "Task 2 Writing", prompt: "Help me with Task 2 essay writing", desc: "Essay structure, band descriptors, and cohesive argument flow" },
    { title: "Speaking Practice", prompt: "Practice speaking with me", desc: "Fluency drills, Part 1 & 2 topics, and lexical scoring feedback" },
    { title: "Grammar Masterclass", prompt: "Explain IELTS grammar rules", desc: "Complex sentences, conditionals, articles, and band 7+ syntax" },
    { title: "Task 1 vs Task 2", prompt: "What's the difference between Task 1 and Task 2?", desc: "Data trends vs persuasive essays, timing, and word requirements" },
];

/* ─── Main Component ────────────────────────────────────────────────── */

interface AIIELTSChatbotViewProps {
    userEmail?: string;
}

const AIIELTSChatbotView: React.FC<AIIELTSChatbotViewProps> = ({ userEmail: _userEmail }) => {
    const {
        messages,
        currentSessionId,
        sessions,
        isLoading,
        isHistoryOpen,
        setIsHistoryOpen,
        sendMessage,
        startNewChat,
        switchSession,
        deleteSession,
        setUserEmail,
    } = useRayanChat();

    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAttemptIdForModal, setSelectedAttemptIdForModal] = useState<string | null>(null);
    const [selectedRewriteIdForModal, setSelectedRewriteIdForModal] = useState<string | null>(null);
    const [modalAttemptData, setModalAttemptData] = useState<{ type: string; data: any } | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync user email if passed as prop
    useEffect(() => {
        if (_userEmail) {
            setUserEmail(_userEmail);
        }
    }, [_userEmail, setUserEmail]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, isLoading]);

    // Focus input and check for pre-populated prompt on mount
    useEffect(() => {
        try {
            const pendingPrompt = sessionStorage.getItem('pending_rayan_prompt') || localStorage.getItem('pending_rayan_prompt');
            if (pendingPrompt) {
                sessionStorage.removeItem('pending_rayan_prompt');
                localStorage.removeItem('pending_rayan_prompt');
                setInputText(pendingPrompt);
            }
        } catch (e) {
            // ignore
        }
        inputRef.current?.focus();
    }, [currentSessionId]);

    /* ── Citation Deep-Link Interceptor ── */
    const handleCitationClick = useCallback((href: string) => {
        if (href.startsWith('#attempt/')) {
            const attemptId = href.replace('#attempt/', '');
            setSelectedAttemptIdForModal(attemptId);
        } else if (href.startsWith('#rewrite/')) {
            const rewriteId = href.replace('#rewrite/', '');
            setSelectedRewriteIdForModal(rewriteId);
        }
    }, []);

    /* ── Load Attempt Data when deep link citation is clicked ── */
    useEffect(() => {
        if (!selectedAttemptIdForModal) {
            setModalAttemptData(null);
            return;
        }
        let cancelled = false;
        const loadAttempt = async () => {
            try {
                // 1. Try exam_attempts
                const { data: examData } = await (supabase as any)
                    .from('exam_attempts')
                    .select('*')
                    .eq('id', selectedAttemptIdForModal)
                    .maybeSingle();

                if (!cancelled && examData) {
                    setModalAttemptData({ type: examData.module || 'reading', data: examData });
                    return;
                }

                // 2. Try part_practice_attempts
                const { data: drillData } = await (supabase as any)
                    .from('part_practice_attempts')
                    .select('*')
                    .eq('id', selectedAttemptIdForModal)
                    .maybeSingle();

                if (!cancelled && drillData) {
                    setModalAttemptData({ type: drillData.module || 'drill', data: drillData });
                    return;
                }

                // 3. Try speaking_submissions
                const { data: spkData } = await (supabase as any)
                    .from('speaking_submissions')
                    .select('*')
                    .or(`id.eq.${selectedAttemptIdForModal},submission_id.eq.${selectedAttemptIdForModal}`)
                    .maybeSingle();

                if (!cancelled && spkData) {
                    setModalAttemptData({ type: 'speaking', data: spkData });
                    return;
                }

                // 4. Try writing_submissions
                const { data: wrtData } = await (supabase as any)
                    .from('writing_submissions')
                    .select('*')
                    .eq('id', selectedAttemptIdForModal)
                    .maybeSingle();

                if (!cancelled && wrtData) {
                    setModalAttemptData({ type: 'writing', data: wrtData });
                    return;
                }
            } catch (err) {
                console.warn('[CHATBOT_INTERCEPTOR] Error fetching attempt detail:', err);
            }
        };
        loadAttempt();
        return () => {
            cancelled = true;
        };
    }, [selectedAttemptIdForModal]);

    const handleSend = useCallback(async () => {
        if (!inputText.trim() || isLoading) return;
        const text = inputText;
        setInputText('');
        await sendMessage(text);
    }, [inputText, isLoading, sendMessage]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const handleQuickPrompt = useCallback(
        (prompt: string) => {
            sendMessage(prompt);
        },
        [sendMessage]
    );

    const filteredSessions = sessions.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasMessages = messages.length > 0;

    return (
        <div className="relative flex h-screen w-full bg-[#0B0C10] text-zinc-100 overflow-hidden font-sans">
            {/* ════════════════════════════════════════════════════════════
                SECTION A: TOP HEADER BAR & HISTORY TOGGLE
            ════════════════════════════════════════════════════════════ */}
            <header className="absolute top-0 left-0 right-0 h-14 bg-[#0E1017]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <RayanAvatar size="sm" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm tracking-tight text-white">Rayan</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                                AI IELTS Tutor
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 hidden sm:block">Perplexity-Grade Diagnostic Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={startNewChat}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/80 border border-zinc-700/60 transition cursor-pointer"
                        title="Start a new chat session"
                    >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">New Chat</span>
                    </button>

                    <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition cursor-pointer border border-transparent hover:border-zinc-700/50"
                        title="Toggle Chat History Drawer"
                        aria-label="Toggle Chat History"
                    >
                        <HamburgerIcon className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* ════════════════════════════════════════════════════════════
                SECTION B: MAIN CHAT CANVAS (PERPLEXITY STYLE)
            ════════════════════════════════════════════════════════════ */}
            <main className="flex-1 flex flex-col items-center w-full pt-16 pb-28 px-4 overflow-y-auto">
                <div className="w-full max-w-3xl flex-1 flex flex-col justify-between py-6">
                    {/* ── Empty Starter State ── */}
                    {!hasMessages && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto animate-fade-in">
                            <div className="mb-5 ring-4 ring-emerald-500/10 rounded-full">
                                <RayanAvatar size="lg" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                                How can I help you today?
                            </h1>
                            <p className="text-zinc-400 max-w-lg text-sm sm:text-base mb-10 leading-relaxed">
                                Hello! I'm Rayan, your personalized IELTS tutor. What would you like to work on today?
                            </p>

                            {/* 4 Clickable Action Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                                {QUICK_PROMPTS.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleQuickPrompt(item.prompt)}
                                        className="group bg-[#12141C] hover:bg-[#181B26] border border-zinc-800/90 hover:border-emerald-500/40 rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer shadow-md hover:shadow-emerald-950/20 flex flex-col justify-between"
                                    >
                                        <div className="flex items-center justify-between w-full mb-1.5">
                                            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
                                                {item.title}
                                            </span>
                                            <SparkleIcon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors mb-1">
                                            "{item.prompt}"
                                        </p>
                                        <p className="text-[11px] text-zinc-400 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Active Conversation Stream (Perplexity Canvas) ── */}
                    {hasMessages && (
                        <div className="w-full space-y-6 py-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${
                                        msg.role === 'user' ? 'items-end' : 'items-start'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        /* User Message Pill */
                                        <div className="max-w-[85%] bg-zinc-800/90 border border-zinc-700/60 text-zinc-100 rounded-2xl rounded-tr-sm px-5 py-3 shadow-md">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            <div className="text-[10px] text-zinc-400 mt-1 text-right">{msg.timestamp}</div>
                                        </div>
                                    ) : (
                                        /* Rayan Assistant Card */
                                        <div className="w-full bg-[#12141C] border border-zinc-800/90 rounded-2xl p-5 shadow-lg relative space-y-3">
                                            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <RayanAvatar size="sm" />
                                                    <span className="text-xs font-bold text-white tracking-wide">Rayan AI Advisor</span>
                                                </div>
                                                <span className="text-[11px] text-zinc-500 font-mono">{msg.timestamp}</span>
                                            </div>

                                            {/* Rich Markdown & Typography Formatter */}
                                            <RayanMessageFormatter
                                                content={msg.content}
                                                onCitationClick={handleCitationClick}
                                            />

                                            {/* Citation Pills Footer if present */}
                                            {msg.citations && msg.citations.length > 0 && (
                                                <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-2">
                                                    <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                                                        Sources & Evidence:
                                                    </span>
                                                    {msg.citations.map((c, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleCitationClick(c.href)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60 hover:text-emerald-300 transition cursor-pointer shadow-xs"
                                                        >
                                                            <span>🔍</span>
                                                            <span>{c.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Loading / Generating State */}
                            {isLoading && (
                                <div className="w-full bg-[#12141C] border border-zinc-800/90 rounded-2xl p-4 shadow-md flex items-center gap-3">
                                    <RayanAvatar size="sm" />
                                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                                        <span>Rayan is synthesizing IELTS diagnostic memory...</span>
                                        <div className="flex space-x-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </main>

            {/* ════════════════════════════════════════════════════════════
                SECTION C: BOTTOM STICKY INPUT BAR (PERPLEXITY STYLE)
            ════════════════════════════════════════════════════════════ */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20">
                <div className="bg-[#141720]/95 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 focus-within:border-emerald-500/60 rounded-2xl p-2.5 pl-4 pr-3 shadow-2xl transition-all flex items-center gap-3">
                    <button
                        type="button"
                        className="text-zinc-400 hover:text-zinc-200 transition p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer"
                        title="Attach context or diagnostic data"
                        onClick={() => handleQuickPrompt("Analyze my latest IELTS test scores")}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message Rayan..."
                        disabled={isLoading}
                        className="w-full bg-transparent focus:outline-none text-sm text-zinc-100 placeholder-zinc-500"
                    />

                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!inputText.trim() || isLoading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition disabled:opacity-40 disabled:hover:bg-emerald-600 cursor-pointer shadow-md disabled:cursor-not-allowed"
                        title="Send query"
                    >
                        <SendIcon className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-zinc-400 text-[11px] text-center mt-2 font-medium">
                    Rayan AI synthesizes your real Cambridge mock attempts, speaking interviews, and essay rewrites.
                </p>
            </div>

            {/* ════════════════════════════════════════════════════════════
                SECTION D: SLIDE-OUT CHAT HISTORY DRAWER
            ════════════════════════════════════════════════════════════ */}
            <aside
                className={`fixed top-0 right-0 h-full w-80 bg-[#10121A] border-l border-zinc-800/90 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="p-5 border-b border-zinc-800/80">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="font-bold text-white text-base tracking-tight">Chat History</h2>
                            <p className="text-zinc-400 text-xs mt-0.5">{sessions.length} sessions saved</p>
                        </div>
                        <button
                            onClick={() => setIsHistoryOpen(false)}
                            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/80 transition cursor-pointer"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={() => {
                            startNewChat();
                            setIsHistoryOpen(false);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl w-full text-center transition flex items-center justify-center gap-2 mt-3 text-xs shadow-md cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        New Chat
                    </button>

                    {/* Search Filter */}
                    <div className="relative mt-3">
                        <SearchIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className="bg-zinc-900 border border-zinc-800 text-xs rounded-xl pl-9 pr-3 py-2 w-full text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                        />
                    </div>
                </div>

                {/* Drawer Session List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    {sessions.length === 0 && (
                        <div className="border border-dashed border-zinc-800 rounded-2xl p-6 text-center space-y-2 mt-4 bg-zinc-900/30">
                            <MessageCircleIcon className="w-8 h-8 text-zinc-600 mx-auto" />
                            <p className="font-semibold text-zinc-300 text-xs">No conversations yet</p>
                            <p className="text-zinc-500 text-[11px]">Start chatting with Rayan to build your history.</p>
                        </div>
                    )}

                    {filteredSessions.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => {
                                switchSession(s.id);
                                setIsHistoryOpen(false);
                            }}
                            className={`group flex items-center justify-between w-full p-3 rounded-xl transition-all cursor-pointer ${
                                currentSessionId === s.id
                                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                                    : 'hover:bg-zinc-900 border border-transparent text-zinc-300'
                            }`}
                        >
                            <div className="truncate flex-1 pr-2">
                                <p className="text-xs font-medium truncate">{s.title || 'Untitled Session'}</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                    {s.updated_at ? new Date(s.updated_at).toLocaleDateString() : ''}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSession(s.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-1 rounded transition-opacity cursor-pointer"
                                title="Delete session"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Backdrop overlay when history drawer is open */}
            {isHistoryOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-20 transition-opacity"
                    onClick={() => setIsHistoryOpen(false)}
                />
            )}

            {/* ════════════════════════════════════════════════════════════
                SECTION E: CITATION OVERLAY MODALS
            ════════════════════════════════════════════════════════════ */}

            {/* Modal 1: Speaking Evaluation Canvas */}
            {modalAttemptData && modalAttemptData.type === 'speaking' && (
                <SpeakingEvaluationCanvas
                    attemptId={selectedAttemptIdForModal || undefined}
                    isOpen={true}
                    evaluation={
                        modalAttemptData.data.raw_json_feedback ||
                        modalAttemptData.data.evaluation ||
                        modalAttemptData.data
                    }
                    onClose={() => {
                        setSelectedAttemptIdForModal(null);
                        setModalAttemptData(null);
                    }}
                />
            )}

            {/* Modal 2: Writing Analysis Modal */}
            {modalAttemptData && modalAttemptData.type === 'writing' && (
                <WritingAnalysisModal
                    isModal={true}
                    attempt={modalAttemptData.data}
                    band={modalAttemptData.data.overall_band || modalAttemptData.data.band_score}
                    onClose={() => {
                        setSelectedAttemptIdForModal(null);
                        setModalAttemptData(null);
                    }}
                />
            )}

            {/* Modal 3: Reading / Listening / Generic Mock Analysis */}
            {modalAttemptData && modalAttemptData.type !== 'speaking' && modalAttemptData.type !== 'writing' && (
                <HistoryAnalysisModal
                    isOpen={true}
                    isModal={true}
                    attemptId={modalAttemptData.data.id}
                    bookNumber={modalAttemptData.data.book_number}
                    testNumber={modalAttemptData.data.test_number}
                    answersPayload={modalAttemptData.data.answers_payload}
                    skillModule={modalAttemptData.data.module}
                    title={modalAttemptData.data.title || modalAttemptData.data.exam_title}
                    onClose={() => {
                        setSelectedAttemptIdForModal(null);
                        setModalAttemptData(null);
                    }}
                />
            )}

            {/* Modal 4: AI Rewriter History */}
            <AIRewriterHistoryModal
                isOpen={Boolean(selectedRewriteIdForModal)}
                onClose={() => setSelectedRewriteIdForModal(null)}
            />
        </div>
    );
};

export default AIIELTSChatbotView;
