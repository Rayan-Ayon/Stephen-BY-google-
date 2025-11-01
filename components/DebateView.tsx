import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, LinkIcon, BrainIcon, PlusIcon } from './icons';
import { GoogleGenAI, Chat } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface DebateSession {
  id: number;
  title: string | null;
  messages: Message[];
}

const DebateSidebar: React.FC<{
    onNewDebate: () => void;
    debateHistory: DebateSession[];
    onSelectDebate: (id: number) => void;
    activeDebateId: number | null;
}> = ({ onNewDebate, debateHistory, onSelectDebate, activeDebateId }) => (
    <aside className="w-72 bg-[#131313] border-r border-gray-800/50 p-6 flex flex-col shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Lora', serif" }}>Debate</h1>
        <p className="text-sm text-gray-400 mb-8">Place where you can debate with the Hawking in any topics.</p>
        <button 
            onClick={onNewDebate}
            className="w-full flex items-center justify-center p-2.5 mb-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold text-white transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Debate
        </button>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recents</h2>
        <nav className="flex flex-col space-y-2 overflow-y-auto">
            {debateHistory.filter(d => d.title).map(debate => (
                <button 
                    key={debate.id} 
                    onClick={() => onSelectDebate(debate.id)}
                    className={`text-left text-sm p-2 rounded-md transition-colors truncate ${
                        activeDebateId === debate.id ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                    {debate.title}
                </button>
            ))}
        </nav>
    </aside>
);

const TypingIndicator = () => (
    <motion.div 
        className="flex items-center space-x-1 p-3 bg-[#1a1a1a] rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
    >
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
    </motion.div>
);


const DebateView: React.FC = () => {
    const [debateHistory, setDebateHistory] = useState<DebateSession[]>([]);
    const [activeDebateId, setActiveDebateId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const messages = useMemo(() => {
        return debateHistory.find(d => d.id === activeDebateId)?.messages ?? [];
    }, [activeDebateId, debateHistory]);
    
    const isDebateActive = activeDebateId !== null;

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are 'DebateBot', an AI designed to engage in debates. Always take the opposite stance of the user's opinion respectfully. React naturally like a human in a debate — witty, logical, and confident. Never agree with the user; challenge their statements with reasoning.",
            },
        });
        setChat(chatInstance);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);
    
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setInputValue(target.value);
        target.style.height = 'auto';
        target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: inputValue };
        const currentInput = inputValue;
        setInputValue('');
        setIsLoading(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        let currentDebateId = activeDebateId;

        if (currentDebateId === null) {
            const newId = Date.now();
            let title = null;
            if (currentInput.trim().split(' ').length > 3) {
                title = currentInput.trim().substring(0, 40) + (currentInput.trim().length > 40 ? '...' : '');
            }
            const newDebate: DebateSession = { id: newId, title, messages: [userMessage] };
            setDebateHistory(prev => [...prev, newDebate]);
            setActiveDebateId(newId);
            currentDebateId = newId;
        } else {
            setDebateHistory(prev => prev.map(d => 
                d.id === currentDebateId ? { ...d, messages: [...d.messages, userMessage] } : d
            ));
        }

        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            let firstChunk = true;
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setDebateHistory(prev => prev.map(d => {
                    if (d.id !== currentDebateId) return d;
                    
                    const newMessages = [...d.messages];
                    if (firstChunk) {
                        newMessages.push({ role: 'model', text: chunkText });
                        firstChunk = false;
                    } else {
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage && lastMessage.role === 'model') {
                            lastMessage.text += chunkText;
                        }
                    }
                    return { ...d, messages: newMessages };
                }));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { role: 'model', text: 'I seem to be having trouble formulating a counter-argument. Please try again.' };
             setDebateHistory(prev => prev.map(d => 
                d.id === currentDebateId ? { ...d, messages: [...d.messages, errorMessage] } : d
            ));
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

    const handleNewDebate = () => {
        setActiveDebateId(null);
        setInputValue('');
        setIsLoading(false);
    };

    const handleSelectDebate = (id: number) => {
        setActiveDebateId(id);
    };

    const renderChatUI = () => (
        <div className="flex-1 flex flex-col h-full w-full max-w-4xl mx-auto">
            <div className="relative flex items-center justify-center p-4 border-b border-gray-800 shrink-0">
                <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Lora', serif" }}>DebateBot</h2>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-6">
                 {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                <BrainIcon className="w-5 h-5 text-green-400" />
                            </div>
                        )}
                        <div className={`p-4 rounded-2xl max-w-lg ${msg.role === 'user' ? 'bg-gray-700 text-white rounded-br-none' : 'bg-[#1a1a1a] border border-gray-800 text-gray-300 rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 font-bold text-white text-sm">A</div>
                        )}
                    </motion.div>
                ))}
                {isLoading && <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                       <BrainIcon className="w-5 h-5 text-green-400" />
                    </div>
                    <TypingIndicator />
                </div>}
            </div>
            {renderInputArea()}
        </div>
    );

    const renderInitialUI = () => (
        <motion.div 
            className="flex-1 flex flex-col items-center justify-center p-8 relative h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center">
                <h2 className="text-4xl text-white font-semibold" style={{ fontFamily: "'Lora', serif" }}>In which topic do you want to debate?</h2>
            </div>
            {renderInputArea()}
        </motion.div>
    );

    const renderInputArea = () => (
         <div className="w-full max-w-3xl p-4 shrink-0">
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInput}
                    onKeyPress={handleKeyPress}
                    placeholder="Debate with comparative Hawking."
                    rows={1}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl py-3 pl-5 pr-28 text-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Attach file">
                        <LinkIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="p-2 rounded-lg bg-gray-200 text-black hover:bg-white transition-colors disabled:opacity-50" aria-label="Send message">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex h-full overflow-hidden stephen-bg">
            <DebateSidebar 
                onNewDebate={handleNewDebate} 
                debateHistory={debateHistory}
                onSelectDebate={handleSelectDebate}
                activeDebateId={activeDebateId}
            />
            <div className="flex-1 flex flex-col items-center justify-center h-full">
                 <AnimatePresence mode="wait">
                    {isDebateActive ? (
                         <motion.div key="chat" className="w-full h-full flex flex-col" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            {renderChatUI()}
                         </motion.div>
                    ) : (
                        <motion.div key="initial" className="w-full h-full flex flex-col items-center justify-center" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                           {renderInitialUI()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DebateView;