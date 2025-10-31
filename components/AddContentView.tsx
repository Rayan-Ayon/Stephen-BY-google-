import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import { PasteUrlModal } from './modals';
import { 
    UploadIcon, LinkIcon, MicIcon, ArrowUpIcon, PlusIcon, ClockIcon, 
    ChevronDownIcon, CubeIcon, BrainIcon, ChevronLeftIcon 
} from './icons';
import { GoogleGenAI, Chat } from '@google/genai';

interface AddContentViewProps {
  onCourseCreated: (course: HistoryItem) => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Typing indicator component
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


const AddContentView: React.FC<AddContentViewProps> = ({ onCourseCreated }) => {
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
        });
        setChat(chatInstance);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsLoading(true);
        if (!isChatActive) {
            setIsChatActive(true);
        }

        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            
            let firstChunk = true;
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (firstChunk) {
                    // When the first chunk arrives, add a new model message to the state
                    setMessages(prev => [...prev, { role: 'model', text: chunkText }]);
                    firstChunk = false;
                } else {
                    // For subsequent chunks, append the text to the last message
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
            console.error("Error sending message:", error);
            const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const ActionButton = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
        <button
            onClick={() => title === 'Paste' && setIsPasteModalOpen(true)}
            className="flex items-center text-left p-4 bg-[#1a1a1a] border border-gray-800 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-all duration-300"
        >
            <div className="mr-4 text-gray-400">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </button>
    );

    const renderChatUI = () => {
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        
        return (
            <motion.div 
                key="chat-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col w-full max-w-4xl mx-auto h-full"
            >
                <div className="relative flex items-center justify-center p-4 border-b border-gray-800 shrink-0">
                    <button 
                        onClick={() => setIsChatActive(false)} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-sm text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        <span>Back</span>
                    </button>
                    <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Lora', serif" }}>AI Tutor</h2>
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
                    {isLoading && (!lastMessage || lastMessage.role === 'user') && (
                        <div className="flex items-start gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                               <BrainIcon className="w-5 h-5 text-green-400" />
                            </div>
                            <TypingIndicator />
                        </div>
                    )}
                </div>
                <div className="p-6 pt-2">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a follow-up question..."
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3.5 pl-5 pr-14 text-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                        <button onClick={handleSendMessage} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={isLoading || !inputValue.trim()}>
                            <ArrowUpIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderInitialUI = () => (
         <motion.div
                key="initial-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl"
            >
                <h1 className="text-3xl font-bold text-white mb-6 text-center" style={{ fontFamily: "'Lora', serif" }}>
                    What do you want to learn?
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <ActionButton icon={<UploadIcon className="w-6 h-6" />} title="Upload" subtitle="File, audio, video" />
                    <ActionButton icon={<LinkIcon className="w-6 h-6" />} title="Paste" subtitle="YouTube, website, text" />
                    <ActionButton icon={<MicIcon className="w-6 h-6" />} title="Record" subtitle="Record class, video call" />
                </div>
                
                <div className="relative mb-12">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Learn anything"
                        className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3.5 pl-5 pr-14 text-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                    <button onClick={handleSendMessage} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                        <ArrowUpIcon className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>My Spaces</h2>
                     <button className="flex items-center text-sm text-gray-400 hover:text-white bg-[#1a1a1a] border border-gray-800 px-3 py-1.5 rounded-lg">
                         <ClockIcon className="w-4 h-4 mr-2" />
                         Newest
                         <ChevronDownIcon className="w-4 h-4 ml-1" />
                     </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex flex-col items-center justify-center p-6 bg-[#1a1a1a] border-2 border-dashed border-gray-800 rounded-xl hover:border-gray-700 hover:bg-gray-800/50 transition-all text-gray-500 hover:text-white">
                        <PlusIcon className="w-6 h-6 mb-2" />
                        <span className="font-semibold">Create Space</span>
                    </button>
                    <div className="flex flex-col p-6 bg-[#1a1a1a] border border-gray-800 rounded-xl">
                        <CubeIcon className="w-6 h-6 mb-4 text-gray-400" />
                        <p className="font-semibold text-white">my space</p>
                        <p className="text-sm text-gray-500">0 content</p>
                    </div>
                </div>
            </motion.div>
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto stephen-bg h-full">
            <AnimatePresence mode="wait">
                 {isChatActive ? renderChatUI() : renderInitialUI()}
            </AnimatePresence>
            <AnimatePresence>
                {isPasteModalOpen && (
                    <PasteUrlModal 
                        onClose={() => setIsPasteModalOpen(false)}
                        onCourseCreated={onCourseCreated}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddContentView;