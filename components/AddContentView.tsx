
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import { PasteUrlModal, RecordLectureModal, PasteTextModal } from './modals';
import { 
    UploadIcon, LinkIcon, MicIcon, ArrowUpIcon, PlusIcon, ClockIcon, 
    ChevronDownIcon, CubeIcon, BrainIcon, ChevronLeftIcon, ClipboardIcon, CheckIcon
} from './icons';
import { GoogleGenAI, Chat } from '@google/genai';

interface AddContentViewProps {
  onCourseCreated: (course: HistoryItem) => void;
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
    { name: 'Grok 4.1', free: false },
];

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3 dark:bg-[#1a1a1a] bg-neutral-100 rounded-lg">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
    </div>
);

const AddContentView: React.FC<AddContentViewProps> = ({ onCourseCreated }) => {
    const [isPasteUrlModalOpen, setIsPasteUrlModalOpen] = useState(false);
    const [isPasteTextModalOpen, setIsPasteTextModalOpen] = useState(false);
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState('Auto');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { thinkingConfig: { thinkingBudget: 0 } },
        });
        setChat(chatInstance);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputContainerRef.current && !inputContainerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                setIsModelDropdownOpen(false);
            }
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
                setIsModelDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsLoading(true);
        if (!isChatActive) setIsChatActive(true);

        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
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
                        if (lastMessage && lastMessage.role === 'model') lastMessage.text += chunkText;
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
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

    const tooltips: Record<string, string> = {
        'Upload': 'PDF, PPT, DOC, TXT, Audio, Video, Image',
        'Link': 'YouTube Link / Playlist, Website URL, Doc, ArXiv, Audio, Video link, Etc',
        'Paste': 'Paste text content directly',
        'Record': 'Capture your lectures in real-time through microphone or browser tab'
    };

    const ActionButton = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
        <div className="relative w-full">
            <AnimatePresence>
                {activeTooltip === title && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 px-6 py-3 bg-[#111] border border-white/10 rounded-[20px] text-[13px] text-gray-300 whitespace-nowrap z-[100] shadow-2xl flex items-center space-x-4 pointer-events-none"
                    >
                        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5 text-[#555]" })}
                        <span className="font-medium">{tooltips[title]}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onMouseEnter={() => {
                    tooltipTimeoutRef.current = setTimeout(() => {
                        setActiveTooltip(title);
                    }, 1000);
                }}
                onMouseLeave={() => {
                    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                    setActiveTooltip(null);
                }}
                onClick={() => {
                    if (title === 'Link') setIsPasteUrlModalOpen(true);
                    if (title === 'Paste') setIsPasteTextModalOpen(true);
                    if (title === 'Record') setIsRecordModalOpen(true);
                }}
                className="group relative flex flex-col items-start p-4 dark:bg-[#121212] bg-white border dark:border-[#1e1e1e] border-gray-200 rounded-[24px] transition-colors duration-200 hover:border-gray-500 w-full h-[110px] overflow-hidden"
            >
                <div className="flex items-center justify-between w-full mb-3">
                    <div className="text-gray-500 dark:text-[#444] group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200 ease-in-out">
                        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
                    </div>
                </div>
                <div className="text-left relative z-10">
                    <p className="font-bold text-[14px] dark:text-[#888] text-gray-600 group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] transition-all duration-200 ease-in-out leading-tight">{title}</p>
                    <p className="text-[12px] dark:text-[#444] text-gray-400 mt-1 transition-all duration-200 ease-in-out font-semibold group-hover:text-white/70">{subtitle}</p>
                </div>
            </button>
        </div>
    );

    const renderChatUI = () => (
        <motion.div key="chat-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col w-full max-w-2xl mx-auto h-full">
            <div className="relative flex items-center justify-center p-4 border-b dark:border-gray-800 border-neutral-200 shrink-0">
                <button onClick={() => setIsChatActive(false)} className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-sm text-gray-400 dark:hover:text-white hover:text-black p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-neutral-200 transition-colors">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    <span>Back</span>
                </button>
                <h2 className="text-lg font-semibold dark:text-white text-black" style={{ fontFamily: "'Lora', serif" }}>AI Tutor</h2>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                <BrainIcon className="w-5 h-5 text-orange-500" />
                            </div>
                        )}
                        <div className={`p-4 rounded-2xl max-w-lg ${msg.role === 'user' ? 'dark:bg-gray-700 bg-neutral-800 text-white rounded-br-none' : 'dark:bg-[#1a1a1a] bg-neutral-100 border dark:border-gray-800 border-neutral-200 dark:text-gray-300 text-neutral-800 rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && (
                            <img className="w-8 h-8 rounded-full shrink-0" src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" alt="User avatar" />
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                           <BrainIcon className="w-5 h-5 text-orange-400" />
                        </div>
                        <TypingIndicator />
                    </div>
                )}
            </div>
            <div className="p-6 pt-2">
                <div className="relative max-w-2xl mx-auto">
                    <textarea 
                        ref={textareaRef} 
                        rows={1}
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        onKeyPress={handleKeyPress} 
                        placeholder="Ask a follow-up question..." 
                        className="w-full dark:bg-[#111] bg-white border dark:border-[#222] border-neutral-200 rounded-[28px] py-4 pl-8 pr-14 text-md focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all shadow-sm resize-none" 
                    />
                    <button onClick={handleSendMessage} className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center rounded-full dark:bg-[#1a1a1a] bg-neutral-800 dark:text-white text-white hover:opacity-90 transition-opacity disabled:opacity-50" disabled={isLoading || !inputValue.trim()}>
                        <ArrowUpIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderInitialUI = () => (
         <motion.div key="initial-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-2xl flex flex-col items-center pt-12">
                <h1 className="text-3xl md:text-5xl font-medium text-black dark:text-white mb-14 text-center tracking-tight" style={{ fontFamily: "'Lora', serif" }}>
                    What should we learn, Fatema?
                </h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 w-full px-4">
                    <ActionButton icon={<UploadIcon />} title="Upload" subtitle="File, audio, video" />
                    <ActionButton icon={<LinkIcon />} title="Link" subtitle="YouTube, Website" />
                    <ActionButton icon={<ClipboardIcon />} title="Paste" subtitle="Copied Text" />
                    <ActionButton icon={<MicIcon />} title="Record" subtitle="Record Lecture" />
                </div>
                
                <div className="relative mb-28 w-full px-4">
                    <div 
                        ref={inputContainerRef}
                        className={`relative dark:bg-[#111] bg-white border border-gray-200 dark:border-[#1e1e1e] shadow-sm overflow-hidden transition-none ${
                            isFocused || inputValue.trim() ? 'rounded-[28px] p-1' : 'rounded-full px-2 py-0.5'
                        }`}
                    >
                        <textarea 
                            ref={textareaRef} 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            onKeyPress={handleKeyPress} 
                            onFocus={() => setIsFocused(true)}
                            placeholder="Learn anything" 
                            className={`w-full bg-transparent border-none focus:outline-none text-lg dark:text-white text-black placeholder-[#444] px-5 py-3.5 resize-none transition-none`} 
                            style={{ minHeight: isFocused || inputValue.trim() ? '72px' : '56px' }}
                        />
                        
                        {(isFocused || inputValue.trim()) && (
                            <div className="flex items-center justify-between px-3 pb-2 transition-none">
                                <div className="flex items-center space-x-2 relative" ref={modelDropdownRef}>
                                    <button 
                                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                        className="flex items-center space-x-2 px-4 py-1.5 rounded-full dark:bg-white/[0.03] bg-neutral-100 text-gray-500 text-[12px] font-bold dark:hover:text-white hover:text-black transition-colors"
                                    >
                                        <span>{selectedModel}</span>
                                        <ChevronDownIcon className={`w-3 h-3 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isModelDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.1 }}
                                                className="absolute bottom-full left-0 mb-3 w-56 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-[20px] shadow-2xl overflow-hidden py-1.5 z-50"
                                            >
                                                {models.map((m) => (
                                                    <button 
                                                        key={m.name}
                                                        onClick={() => { setSelectedModel(m.name); setIsModelDropdownOpen(false); }}
                                                        className="w-full flex items-center justify-between px-5 py-2.5 text-[13px] dark:text-gray-300 text-gray-700 dark:hover:bg-white/[0.04] hover:bg-neutral-100 transition-colors group"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-4 h-4 flex items-center justify-center">
                                                                {selectedModel === m.name && <CheckIcon className="w-3.5 h-3.5 dark:text-white text-black" />}
                                                            </div>
                                                            <span className={`${selectedModel === m.name ? "font-bold dark:text-white text-black" : "font-medium"}`}>{m.name}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <button className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full dark:bg-white/[0.03] bg-neutral-100 text-gray-500 text-[12px] font-bold dark:hover:text-white hover:text-black transition-colors">
                                        <span className="text-base font-light">@</span>
                                        <span>Add Context</span>
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={handleSendMessage} 
                                    disabled={isLoading || !inputValue.trim()}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${inputValue.trim() ? 'bg-black dark:bg-[#333] text-white' : 'bg-[#e5e7eb] dark:bg-[#1a1a1a] text-gray-400 cursor-not-allowed'}`}
                                >
                                    <ArrowUpIcon className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        )}

                        {!isFocused && !inputValue.trim() && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e5e7eb] dark:bg-[#1a1a1a] text-gray-400 cursor-not-allowed">
                                    <ArrowUpIcon className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8 w-full px-4">
                     <h2 className="text-xl font-bold text-black dark:text-white" style={{ fontFamily: "'Lora', serif" }}>Spaces</h2>
                     <button className="flex items-center text-[10px] dark:text-[#555] text-neutral-500 dark:hover:text-[#aaa] hover:text-black dark:bg-[#111] bg-white border dark:border-[#1e1e1e] border-neutral-200 px-3 py-1.5 rounded-[12px] font-bold uppercase tracking-[0.1em] transition-all hover:border-[#333]">
                         <ClockIcon className="w-3.5 h-3.5 mr-2" />
                         Newest
                         <ChevronDownIcon className="w-3.5 h-3.5 ml-1" />
                     </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full px-4 pb-24">
                    <button className="flex flex-col items-center justify-center p-8 bg-transparent border border-dashed dark:border-[#1e1e1e] border-neutral-300 rounded-[28px] dark:hover:border-[#444] hover:border-neutral-400 dark:hover:bg-white/[0.02] hover:bg-neutral-100 transition-all text-[#444] dark:hover:text-white hover:text-black group">
                        <PlusIcon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-bold text-[10px] uppercase tracking-[0.15em] text-[#555] group-hover:text-white transition-colors duration-300">Create Space</span>
                    </button>
                    <div className="flex flex-col p-8 dark:bg-[#121212] bg-white border dark:border-[#1e1e1e] border-gray-200 rounded-[28px] group cursor-pointer hover:border-[#444] transition-all duration-300 shadow-sm">
                        <CubeIcon className="w-6 h-6 mb-4 text-[#444] group-hover:text-white transition-colors duration-300" />
                        <p className="font-bold text-[15px] dark:text-[#888] text-gray-800 leading-tight group-hover:text-white transition-colors duration-300">Untitled Space</p>
                        <p className="text-[10px] text-[#444] mt-1.5 font-bold uppercase tracking-widest group-hover:text-[#888] transition-colors duration-300">0 content</p>
                    </div>
                </div>
            </motion.div>
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto h-full dark:bg-[#0b0b0b] bg-white transition-colors duration-500">
            <AnimatePresence mode="wait">
                 {isChatActive ? renderChatUI() : renderInitialUI()}
            </AnimatePresence>
            <AnimatePresence>
                {isPasteUrlModalOpen && <PasteUrlModal onClose={() => setIsPasteUrlModalOpen(false)} onCourseCreated={onCourseCreated} />}
                {isPasteTextModalOpen && <PasteTextModal onClose={() => setIsPasteTextModalOpen(false)} />}
                {isRecordModalOpen && <RecordLectureModal onClose={() => setIsRecordModalOpen(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default AddContentView;
