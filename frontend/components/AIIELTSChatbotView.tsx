import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Message {
    id: string;
    sender: 'user' | 'mihu';
    text: string;
    time: string;
}

interface Conversation {
    id: string;
    title: string;
    timestamp: string;
    messages: Message[];
}

/* ─── Mock AI Response Engine ───────────────────────────────────────── */

const MIHU_RESPONSES: Record<string, string> = {
    default: "Great question! As your IELTS tutor, I'd recommend focusing on structured practice. For Band 7+, you need to demonstrate a wide range of vocabulary and grammatical structures. Let me know which specific skill you'd like to work on — Reading, Writing, Listening, or Speaking — and I'll guide you through targeted exercises.",
    task2: "For Task 2 essays, aim for a clear thesis statement in your introduction. Band 8 essays typically have:\n\n• A clear position throughout\n• Well-developed main ideas with specific examples\n• Cohesive paragraphing with logical progression\n• A mix of complex and simple sentence structures\n\nTry writing a 250+ word essay on a recent topic. I can review it for band score estimation!",
    speaking: "For IELTS Speaking, fluency and coherence are key for Band 7+. Here's what examiners look for:\n\n• Speaking at length without noticeable effort\n• Using discourse markers naturally (however, on the other hand)\n• Pronouncing individual sounds clearly\n• Using intonation to convey meaning\n\nShall we practice a Part 1 topic? Try answering: 'Do you enjoy reading? Why or why not?'",
    grammar: "Common IELTS grammar mistakes that lower your band score:\n\n• Subject-verb agreement errors\n• Incorrect article usage (a/an/the)\n• Run-on sentences and comma splices\n• Overuse of passive voice\n\nFor Band 7+, aim for 'a variety of complex structures' including conditionals, relative clauses, and inversion. Practice with sentence transformation exercises!",
    task1: "Task 1 (Academic) requires you to describe visual data in 150+ words. Key strategies:\n\n• Overview paragraph with key trends (2-3 sentences)\n• Group data logically, don't describe every data point\n• Use comparative language: 'significantly higher', 'remained stable'\n• Include at least 3 comparisons\n\nTask 1 (General) is a letter — formal, semi-formal, or informal depending on the prompt.",
    band: "Here's a quick band score breakdown:\n\n• Band 9: Expert user with full operational fluency\n• Band 8: Very good user, occasional inaccuracies\n• Band 7: Good user, generally effective communication\n• Band 6: Competent user, some inaccuracies\n• Band 5: Modest user, partial command of language\n\nMost universities require Band 6.5-7.0. Where are you currently scoring?",
};

function getMihuResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    if (lower.includes('task 2') || lower.includes('essay') || lower.includes('writing')) return MIHU_RESPONSES.task2;
    if (lower.includes('speaking') || lower.includes('part 1') || lower.includes('part 2') || lower.includes('cue card')) return MIHU_RESPONSES.speaking;
    if (lower.includes('grammar') || lower.includes('tense') || lower.includes('sentence')) return MIHU_RESPONSES.grammar;
    if (lower.includes('task 1') || lower.includes('chart') || lower.includes('graph') || lower.includes('diagram')) return MIHU_RESPONSES.task1;
    if (lower.includes('band') || lower.includes('score') || lower.includes('grade')) return MIHU_RESPONSES.band;
    return MIHU_RESPONSES.default;
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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

/* ─── Owl Avatar (Mihu) ─────────────────────────────────────────────── */

const MihuAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-7 h-7 text-sm',
        md: 'w-9 h-9 text-lg',
        lg: 'w-16 h-16 text-3xl',
    };
    return (
        <div className={`${sizeClasses[size]} bg-red-100 rounded-full flex items-center justify-center shadow-sm shrink-0`}>
            🦉
        </div>
    );
};

/* ─── Quick Starter Prompt Card ─────────────────────────────────────── */

const QUICK_PROMPTS = [
    "Help me with Task 2 essay writing",
    "Practice speaking with me",
    "Explain IELTS grammar rules",
    "What's the difference between Task 1 and Task 2?",
];

/* ─── Main Component ────────────────────────────────────────────────── */

interface AIIELTSChatbotViewProps {
    userEmail: string;
}

const AIIELTSChatbotView: React.FC<AIIELTSChatbotViewProps> = ({ userEmail: _userEmail }) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeChat = conversations.find(c => c.id === activeChatId) ?? null;
    const hasMessages = activeChat && activeChat.messages.length > 0;

    /* ── Auto-scroll to bottom ── */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat?.messages.length, isTyping]);

    /* ── Focus input on mount and when chat changes ── */
    useEffect(() => {
        inputRef.current?.focus();
    }, [activeChatId]);

    /* ── Send message logic ── */
    const sendMessage = useCallback((text: string) => {
        if (!text.trim()) return;

        const now = new Date();
        const userMsg: Message = {
            id: `msg-${Date.now()}-user`,
            sender: 'user',
            text: text.trim(),
            time: formatTime(now),
        };

        let targetChatId = activeChatId;

        setConversations(prev => {
            if (targetChatId) {
                return prev.map(c =>
                    c.id === targetChatId
                        ? { ...c, messages: [...c.messages, userMsg] }
                        : c
                );
            } else {
                const newId = `chat-${Date.now()}`;
                targetChatId = newId;
                const newConv: Conversation = {
                    id: newId,
                    title: text.trim().length > 30 ? text.trim().substring(0, 30) + '...' : text.trim(),
                    timestamp: formatTime(now),
                    messages: [userMsg],
                };
                return [newConv, ...prev];
            }
        });

        if (!activeChatId) {
            setActiveChatId(targetChatId);
        }

        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            const mihuMsg: Message = {
                id: `msg-${Date.now()}-mihu`,
                sender: 'mihu',
                text: getMihuResponse(text),
                time: formatTime(new Date()),
            };
            setConversations(prev =>
                prev.map(c =>
                    c.id === targetChatId
                        ? { ...c, messages: [...c.messages, mihuMsg] }
                        : c
                )
            );
            setIsTyping(false);
        }, 800);
    }, [activeChatId]);

    const handleSend = useCallback(() => {
        sendMessage(inputText);
    }, [inputText, sendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleQuickPrompt = useCallback((prompt: string) => {
        sendMessage(prompt);
    }, [sendMessage]);

    const handleNewChat = useCallback(() => {
        setActiveChatId(null);
        setIsHistoryOpen(false);
    }, []);

    const handleSelectChat = useCallback((chatId: string) => {
        setActiveChatId(chatId);
        setIsHistoryOpen(false);
    }, []);

    const filteredConversations = conversations.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="relative flex h-screen bg-gray-50/50 overflow-hidden">
            {/* ════════════════════════════════════════════════════════════
                SECTION B: MAIN CHAT AREA
            ════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col justify-between items-center px-4 py-6 max-w-4xl mx-auto w-full relative">

                {/* ── Starter Hero Screen ── */}
                {!hasMessages && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="mb-4">
                            <MihuAvatar size="lg" />
                        </div>
                        <h1 className="text-[28px] font-bold text-gray-900 mb-3">
                            How can I help you today?
                        </h1>
                        <p className="text-gray-500 max-w-md text-center text-sm mb-8 leading-relaxed">
                            Hello! I'm Mihu, your personalized IELTS tutor. What would you like to work on today?
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                            {QUICK_PROMPTS.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickPrompt(prompt)}
                                    className="bg-white border border-gray-200/80 hover:border-red-300 hover:shadow-sm rounded-2xl p-4 text-left text-gray-700 text-sm font-medium transition cursor-pointer"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Active Message Stream ── */}
                {hasMessages && (
                    <div className="w-full flex-1 overflow-y-auto space-y-4 px-2 py-4 mb-20">
                        {activeChat!.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start gap-3'}`}
                            >
                                {msg.sender === 'mihu' && <MihuAvatar size="sm" />}
                                <div
                                    className={`${
                                        msg.sender === 'user'
                                            ? 'bg-red-600 text-white rounded-2xl rounded-tr-none px-5 py-3 max-w-[80%] ml-auto text-sm shadow-sm'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-5 py-3 max-w-[80%] text-sm shadow-sm leading-relaxed'
                                    }`}
                                >
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                    <div className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-red-200' : 'text-gray-400'}`}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start items-start gap-3">
                                <MihuAvatar size="sm" />
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    SECTION C: FLOATING BOTTOM INPUT BAR
                ════════════════════════════════════════════════════════════ */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
                    <div className="bg-white border border-gray-200/80 rounded-full p-2 pl-4 pr-3 shadow-lg flex items-center gap-3">
                        <button className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1">
                            <PlusIcon className="w-5 h-5" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Mihu AI..."
                            className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className="bg-gray-100 text-gray-500 hover:bg-red-600 hover:text-white p-2 rounded-full transition disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-gray-500"
                        >
                            <SendIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-gray-400 text-[11px] text-center mt-2">
                        Mihu can make mistakes. Verify important information.
                    </p>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                SECTION A: TOP BAR & HISTORY TOGGLE BUTTON
            ════════════════════════════════════════════════════════════ */}
            <button
                onClick={() => setIsHistoryOpen(prev => !prev)}
                className="absolute top-4 right-6 z-20 hover:bg-gray-100 p-2 rounded-xl transition-colors"
            >
                <HamburgerIcon className="w-5 h-5 text-gray-500" />
            </button>

            {/* ════════════════════════════════════════════════════════════
                SECTION D: SLIDING CHAT HISTORY DRAWER
            ════════════════════════════════════════════════════════════ */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200/80 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h2 className="font-bold text-gray-900 text-base">Chat history</h2>
                            <p className="text-gray-400 text-xs mt-0.5">{conversations.length} conversations</p>
                        </div>
                        <button
                            onClick={() => setIsHistoryOpen(false)}
                            className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={handleNewChat}
                        className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 px-4 rounded-2xl w-full text-center transition flex items-center justify-center gap-2 mt-4"
                    >
                        <PlusIcon className="w-4 h-4" />
                        New chat
                    </button>

                    {/* Search Filter */}
                    <div className="relative mt-3">
                        <SearchIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="bg-gray-100 text-xs rounded-xl pl-9 pr-3 py-2 w-full text-gray-700 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Empty State */}
                    {conversations.length === 0 && (
                        <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center space-y-3 mt-2 bg-gray-50/50">
                            <MessageCircleIcon className="w-8 h-8 text-gray-300 mx-auto" />
                            <p className="font-semibold text-gray-700 text-sm">No chats yet</p>
                            <p className="text-gray-400 text-xs">Start a conversation and it will appear here.</p>
                        </div>
                    )}

                    {/* Populated History */}
                    {filteredConversations.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
                                activeChatId === chat.id
                                    ? 'bg-red-50 border border-red-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                            }`}
                        >
                            <p className="text-sm font-medium text-gray-800 truncate">{chat.title}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{chat.timestamp}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Backdrop overlay when drawer is open */}
            {isHistoryOpen && (
                <div
                    className="fixed inset-0 bg-black/10 z-20 transition-opacity"
                    onClick={() => setIsHistoryOpen(false)}
                />
            )}
        </div>
    );
};

export default AIIELTSChatbotView;
