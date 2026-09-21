import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    ChatMessage,
    ConversationSummary,
    sendChatMessage,
    fetchConversations,
    fetchConversationDetails,
    deleteConversation,
} from '../services/chatbotService';

interface IELTSAdvisorDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
    onOpenFullView?: () => void;
}

interface LocalMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    time: string;
    isOffTopic?: boolean;
}

const QUICK_PROMPTS = [
    { label: 'Writing Task 2 Band 8 Strategy', icon: '📝', query: 'What is the step-by-step strategy to score Band 8 in IELTS Writing Task 2?' },
    { label: 'Speaking Part 2 Prep', icon: '🗣️', query: 'How should I structure my 1-minute preparation for IELTS Speaking Part 2?' },
    { label: 'Canada & UK Visa Guide', icon: '🛂', query: 'What are the core student visa financial requirements for the UK and Canada?' },
    { label: 'Reading T/F/NG Tips', icon: '📖', query: 'What are the best tips to avoid confusion between FALSE and NOT GIVEN in IELTS Reading?' },
    { label: 'Master\'s Scholarships', icon: '🎓', query: 'What international scholarships are available for graduate study abroad in 2026?' },
    { label: 'Band 7+ Study Plan', icon: '📅', query: 'Can you create a 6-week IELTS preparation study plan for an overall Band 7.5?' },
];

export const IELTSAdvisorDrawer: React.FC<IELTSAdvisorDrawerProps> = ({
    isOpen,
    onClose,
    userEmail = '',
    onOpenFullView,
}) => {
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, isTyping, isOpen]);

    // Focus input on drawer open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
            loadConversations();
        }
    }, [isOpen, userEmail]);

    const loadConversations = async () => {
        try {
            setIsLoadingHistory(true);
            const list = await fetchConversations(userEmail);
            setConversations(list);
        } catch (e) {
            console.warn('Could not load saved conversations from backend:', e);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleSelectConversation = async (convId: string) => {
        try {
            setIsTyping(true);
            setActiveChatId(convId);
            setIsHistoryPanelOpen(false);
            const detail = await fetchConversationDetails(convId);
            const formatted: LocalMessage[] = detail.messages.map((m, idx) => ({
                id: m.id || `msg-${idx}`,
                role: m.role === 'user' ? 'user' : 'model',
                text: m.content,
                time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            }));
            setMessages(formatted);
        } catch (err) {
            console.error('Failed to load conversation details:', err);
        } finally {
            setIsTyping(false);
        }
    };

    const handleNewChat = () => {
        setActiveChatId(null);
        setMessages([]);
        setIsHistoryPanelOpen(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleDeleteConversation = async (e: React.MouseEvent, convId: string) => {
        e.stopPropagation();
        try {
            await deleteConversation(convId);
            setConversations(prev => prev.filter(c => c.conversation_id !== convId));
            if (activeChatId === convId) {
                handleNewChat();
            }
        } catch (err) {
            console.error('Failed to delete conversation:', err);
        }
    };

    const handleSend = async (overrideText?: string) => {
        const text = (overrideText || inputText).trim();
        if (!text || isTyping) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg: LocalMessage = {
            id: `msg-${Date.now()}-u`,
            role: 'user',
            text,
            time: timeStr,
        };

        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInputText('');
        setIsTyping(true);

        try {
            const apiHistory: ChatMessage[] = nextMessages.map(m => ({
                id: m.id,
                role: m.role,
                content: m.text,
            }));

            const res = await sendChatMessage(
                text,
                activeChatId || undefined,
                apiHistory,
                userEmail
            );

            const modelMsg: LocalMessage = {
                id: `msg-${Date.now()}-m`,
                role: 'model',
                text: res.response,
                time: new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOffTopic: res.is_off_topic,
            };

            setMessages(prev => [...prev, modelMsg]);

            if (!activeChatId && res.conversation_id) {
                setActiveChatId(res.conversation_id);
            }
            // Refresh conversation list in background
            loadConversations();
        } catch (err: any) {
            const errorMsg: LocalMessage = {
                id: `msg-${Date.now()}-err`,
                role: 'model',
                text: "I am having trouble connecting to the academic server. Please ensure the backend is running and try again.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.last_message && c.last_message.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over Drawer */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col z-10 border-l border-gray-200 dark:border-neutral-800 transition-transform duration-300">
                {/* ─── Header ─── */}
                <div className="px-5 py-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between bg-gray-50/80 dark:bg-neutral-900/90 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xl shadow-md">
                            🎓
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-gray-900 dark:text-white text-base tracking-tight">
                                    IELTS & Study Abroad AI Advisor
                                </h2>
                                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    Official
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Exam strategies • University admissions • Visa & scholarships
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* History toggle */}
                        <button
                            onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}
                            className={`p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors ${
                                isHistoryPanelOpen ? 'bg-gray-200 dark:bg-neutral-800' : ''
                            }`}
                            title="Conversation History"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        {/* New Chat */}
                        <button
                            onClick={handleNewChat}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                            title="New Chat"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        {/* Full View */}
                        {onOpenFullView && (
                            <button
                                onClick={onOpenFullView}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                                title="Open Fullscreen View"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                        )}

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                            title="Close"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ─── Body Area (Split when history is open) ─── */}
                <div className="flex-1 overflow-hidden relative flex">
                    {/* Conversation History Drawer */}
                    {isHistoryPanelOpen && (
                        <div className="w-64 border-r border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/60 flex flex-col h-full z-20">
                            <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search history..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full text-xs bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {isLoadingHistory && (
                                    <div className="p-4 text-center text-xs text-gray-400">
                                        Loading conversations...
                                    </div>
                                )}
                                {!isLoadingHistory && filteredConversations.length === 0 && (
                                    <div className="p-4 text-center text-xs text-gray-400">
                                        No saved conversations yet.
                                    </div>
                                )}
                                {filteredConversations.map(conv => (
                                    <div
                                        key={conv.conversation_id}
                                        onClick={() => handleSelectConversation(conv.conversation_id)}
                                        className={`group flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                            activeChatId === conv.conversation_id
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800/50'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                                        }`}
                                    >
                                        <div className="truncate flex-1 pr-2">
                                            <div className="truncate font-medium">{conv.title}</div>
                                            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                                {conv.message_count} messages
                                            </div>
                                        </div>
                                        <button
                                            onClick={e => handleDeleteConversation(e, conv.conversation_id)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition-opacity"
                                            title="Delete chat"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-900 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Empty State / Welcome */}
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-lg">
                                        🌍
                                    </div>
                                    <div className="max-w-md">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            How can I assist your IELTS & Study Abroad journey?
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            I am context-restricted to IELTS preparation, band descriptor evaluation, visa rules, and international university admissions.
                                        </p>
                                    </div>

                                    {/* Suggested Prompts */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg pt-2 text-left">
                                        {QUICK_PROMPTS.map((p, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(p.query)}
                                                className="p-3 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition text-left group"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{p.icon}</span>
                                                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                        {p.label}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                    {p.query}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message Stream */}
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-2.5'}`}
                                >
                                    {msg.role === 'model' && (
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow">
                                            🎓
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                                                : msg.isOffTopic
                                                ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-tl-none shadow-sm'
                                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200/60 dark:border-neutral-700/60 shadow-sm'
                                        }`}
                                    >
                                        {msg.isOffTopic && (
                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-1.5">
                                                <span>⚠️</span> Topic Guardrail Active
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                        {msg.time && (
                                            <div
                                                className={`text-[10px] mt-1.5 text-right ${
                                                    msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                                                }`}
                                            >
                                                {msg.time}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex items-start gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow">
                                        🎓
                                    </div>
                                    <div className="bg-gray-100 dark:bg-neutral-800 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-200/60 dark:border-neutral-700/60">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── Floating Input Bar ─── */}
                        <div className="p-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <div className="relative flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about IELTS, study abroad, visas, scholarships..."
                                    className="w-full bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 pr-12 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputText.trim() || isTyping}
                                    className="absolute right-2 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:hover:bg-blue-600"
                                    title="Send message"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400 px-1">
                                <span>🔒 Strict academic & study abroad guardrails enabled</span>
                                <span>Official IELTS Advisor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IELTSAdvisorDrawer;
