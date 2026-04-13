
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { 
    ArrowUpIcon, XIcon, BrainIcon, PlusIcon, AdjustIcon, ChevronDownIcon,
    MicIcon, CheckIcon, ProjectIcon, BookOpenIcon, DebatePodiumIcon,
    MessageCircleIcon, FlashIcon, PresentationIcon, UploadIcon
} from './icons';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface HawkingFabProps {
    onNavigate: (view: string, data?: any) => void;
}

const models = [
    { name: 'Auto', free: true },
    { name: 'Gemini 3 Flash', free: true },
    { name: 'Claude 4.5 Sonnet', free: false },
    { name: 'GPT-5.2', free: false },
    { name: 'Gemini 3 Pro', free: false },
    { name: 'Grok 4.1', free: false },
];

const HawkingFab: React.FC<HawkingFabProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Persona State
    const [persona, setPersona] = useState<'Hawking' | 'Stephen'>('Hawking');
    const [stephenLoaded, setStephenLoaded] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello. I am Hawking. How can I assist your studies today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    
    // UI State for dropdowns (Mirroring ProjectsView)
    const [selectedModel, setSelectedModel] = useState('Auto');
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [activeTool, setActiveTool] = useState<{name: string, icon: React.ReactNode} | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const modelMenuRef = useRef<HTMLDivElement>(null);
    const toolsMenuRef = useRef<HTMLDivElement>(null);
    const plusMenuRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "You are Hawking, an intelligent, concise, and helpful AI tutor assistant residing in a floating window. You help students with quick questions, definitions, and calculations. Keep answers brief unless asked to elaborate.",
            },
        });
        setChat(chatInstance);
    }, []);

    // Outside Click Handling
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
                setIsModelMenuOpen(false);
            }
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
    }, [messages, isOpen, isSwitching]);

    const handlePersonaSwitch = () => {
        if (persona === 'Hawking') {
            if (!stephenLoaded) {
                setPersona('Stephen');
                setIsSwitching(true);
                setTimeout(() => {
                    setIsSwitching(false);
                    setStephenLoaded(true);
                    setMessages(prev => [...prev, { role: 'model', text: "Stephen here. Ready to dive deeper?" }]);
                }, 1500);
            } else {
                setPersona('Stephen');
            }
        } else {
            setPersona('Hawking');
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chat) return;

        // Tool Redirection Logic - Identical to ProjectsView
        if (activeTool?.name === 'Debate') {
            setIsOpen(false);
            onNavigate('debate', { initialMessage: inputValue });
            setInputValue('');
            setActiveTool(null);
            return;
        }
        if (activeTool?.name === 'Add Courses') {
            setIsOpen(false);
            onNavigate('add_courses', { topic: inputValue });
            setInputValue('');
            setActiveTool(null);
            return;
        }

        const userText = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

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
            console.error("Hawking Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I encountered a singularity. Please try again." }]);
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

    const toolsList = [
        { name: 'Add Project', icon: <ProjectIcon className="w-4 h-4" /> },
        { name: 'Add Content', icon: <PlusIcon className="w-4 h-4" /> },
        { name: 'Add Courses', icon: <BookOpenIcon className="w-4 h-4" /> },
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
                        className="fixed bottom-24 right-6 w-[90vw] md:w-[420px] h-[70vh] max-h-[600px] bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-neutral-50 dark:bg-[#1f1f1f]">
                            {/* Toggle Switch */}
                            <div 
                                className="relative bg-gray-200 dark:bg-black rounded-full p-1 flex items-center cursor-pointer select-none h-8 w-40" 
                                onClick={handlePersonaSwitch}
                            >
                                <motion.div 
                                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-[#333] rounded-full shadow-sm"
                                    initial={false}
                                    animate={{ x: persona === 'Hawking' ? 0 : '100%' }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                                <div className="flex w-full justify-between items-center text-[11px] font-bold z-10 px-1">
                                    <span className={`w-1/2 text-center transition-colors ${persona === 'Hawking' ? 'text-black dark:text-white' : 'text-gray-500'}`}>Hawking</span>
                                    <span className={`w-1/2 text-center transition-colors ${persona === 'Stephen' ? 'text-black dark:text-white' : 'text-gray-500'}`}>Stephen</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#1a1a1a] relative">
                            {isSwitching ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="flex justify-start">
                                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-2xl rounded-bl-none w-3/4"></div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl rounded-br-none w-1/2"></div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl rounded-bl-none w-5/6"></div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                                msg.role === 'user' 
                                                    ? 'bg-black text-white rounded-br-none' 
                                                    : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 rounded-bl-none'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 flex space-x-1">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Chat Input Area (Replicated from ProjectsView) */}
                        <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800">
                            <div 
                                ref={inputContainerRef}
                                className={`relative dark:bg-[#111] bg-neutral-50 border border-gray-200 dark:border-[#1e1e1e] shadow-sm transition-all duration-300 ${
                                    isFocused || inputValue.trim() ? 'rounded-[20px] ring-1 ring-neutral-300 dark:ring-white/10' : 'rounded-[20px]'
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
                                    placeholder={persona === 'Hawking' ? "Ask Hawking..." : "Ask Stephen..."}
                                    className={`w-full bg-transparent border-none focus:outline-none text-sm text-black dark:text-white placeholder-gray-500 px-4 py-3 resize-none transition-all font-medium`} 
                                    rows={1}
                                    style={{ minHeight: isFocused || inputValue.trim() ? '60px' : '48px' }}
                                />
                                
                                <div className={`flex items-center justify-between px-3 pb-2 transition-opacity duration-200 ${isFocused || inputValue.trim() ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                    <div className="flex items-center space-x-1">
                                        {/* Plus Menu */}
                                        <div className="relative" ref={plusMenuRef}>
                                            <button 
                                                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                                                className="p-1.5 rounded-full dark:hover:bg-white/10 hover:bg-neutral-200 text-gray-500 transition-colors"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                            <AnimatePresence>
                                                {isPlusMenuOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full left-0 mb-2 w-40 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                                                    >
                                                        {[
                                                            { label: 'Upload files', icon: <UploadIcon className="w-3 h-3" /> },
                                                            { label: 'Add from Drive', icon: <div className="w-3 h-3 text-green-500"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l3.43 6h11.72l6.55-11.5-3.42-6H7.71zm8.87 1.5l3.4 6-3.27 5.75H5.43L8.7 5h7.88zm-6.55 1.7L4.57 16h6.86l5.46-9.28H10.03z"/></svg></div> },
                                                        ].map((item) => (
                                                            <button 
                                                                key={item.label}
                                                                onClick={() => setIsPlusMenuOpen(false)}
                                                                className="w-full flex items-center space-x-2 px-3 py-2 text-xs dark:text-gray-300 text-gray-700 hover:dark:bg-white/5 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <div className="dark:text-white text-black opacity-70">{item.icon}</div>
                                                                <span className="font-medium">{item.label}</span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        
                                        {/* Tools Dropdown */}
                                        <div className="relative" ref={toolsMenuRef}>
                                            <button 
                                                onClick={() => setIsToolsOpen(!isToolsOpen)}
                                                className={`flex items-center space-x-1.5 px-2 py-1 rounded-full border transition-colors text-[10px] font-bold ${isToolsOpen ? 'dark:bg-white/10 bg-neutral-200 border-gray-400 dark:border-white/20 text-black dark:text-white' : 'dark:hover:bg-white/10 hover:bg-neutral-200 border-transparent text-gray-500'}`}
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
                                                        className="absolute bottom-full left-0 mb-2 w-48 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                                    >
                                                        {toolsList.map((tool) => (
                                                            <button 
                                                                key={tool.name}
                                                                onClick={() => handleToolClick(tool.name)}
                                                                className="w-full flex items-center space-x-2 px-3 py-2 text-xs dark:text-gray-300 text-gray-700 hover:dark:bg-white/5 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <div className="text-gray-500 dark:text-gray-400">{tool.icon}</div>
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
                                                    className="flex items-center space-x-1 px-2 py-1 rounded-full dark:bg-[#2a2a2a] bg-gray-200 border dark:border-white/10 border-gray-300 text-[10px] font-bold dark:text-white text-black"
                                                >
                                                    <div className="dark:text-white text-black scale-75">
                                                        {activeTool.icon}
                                                    </div>
                                                    <span>{activeTool.name}</span>
                                                    <button 
                                                        onClick={() => setActiveTool(null)}
                                                        className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 text-gray-500 dark:text-gray-400"
                                                    >
                                                        <XIcon className="w-2.5 h-2.5" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <div className="relative" ref={modelMenuRef}>
                                            <button 
                                                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                                className="flex items-center space-x-1 text-[10px] font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                                            >
                                                <span>{selectedModel}</span>
                                                <ChevronDownIcon className={`w-2.5 h-2.5 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            <AnimatePresence>
                                                {isModelMenuOpen && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full right-0 mb-2 w-40 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                                    >
                                                        {models.map((m) => (
                                                            <button 
                                                                key={m.name}
                                                                onClick={() => { setSelectedModel(m.name); setIsModelMenuOpen(false); }}
                                                                className="w-full flex items-center justify-between px-3 py-2 text-[11px] dark:text-gray-300 text-gray-700 hover:dark:bg-white/5 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <span className={selectedModel === m.name ? "font-bold text-orange-500" : ""}>{m.name}</span>
                                                                {selectedModel === m.name && <CheckIcon className="w-3 h-3 text-orange-500" />}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <button className="p-1.5 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                            <MicIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={handleSendMessage}
                                            disabled={isLoading || !inputValue.trim()}
                                            className={`p-1.5 rounded-full transition-all ${inputValue.trim() ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-transparent text-gray-600'}`}
                                        >
                                            <ArrowUpIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {!isFocused && !inputValue.trim() && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-3 pointer-events-none">
                                        <div className="flex items-center space-x-1 text-[10px] font-bold text-gray-500">
                                            <span>{selectedModel}</span>
                                            <ChevronDownIcon className="w-2.5 h-2.5" />
                                        </div>
                                        <MicIcon className="w-4 h-4 text-gray-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button (FAB) */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-xl flex items-center justify-center z-50 group hover:shadow-2xl hover:shadow-orange-500/20 transition-all border-2 border-transparent hover:border-orange-500"
            >
                <span className="font-serif font-bold text-2xl group-hover:scale-110 transition-transform">H</span>
                
                {/* Notification dot */}
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
            </motion.button>
        </>
    );
};

export default HawkingFab;
