
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { ArrowUpIcon, XIcon, BrainIcon } from './icons';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const HawkingFab: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello. I am Hawking. How can I assist your studies today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Initialize Chat
    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are Hawking, an intelligent, concise, and helpful AI tutor assistant residing in a floating window. You help students with quick questions, definitions, and calculations. Keep answers brief unless asked to elaborate.",
            },
        });
        setChat(chatInstance);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chat) return;

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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
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
                        className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[60vh] max-h-[600px] bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-neutral-50 dark:bg-[#1f1f1f]">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="font-bold font-serif text-lg text-black dark:text-white">Hawking</span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#1a1a1a]">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-orange-500 text-white rounded-br-none' 
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
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask Hawking..."
                                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-100 dark:bg-[#0d0d0d] border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-black focus:ring-1 focus:ring-orange-500 outline-none text-sm dark:text-white transition-all"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ArrowUpIcon className="w-4 h-4" />
                                </button>
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
                
                {/* Notification dot example (optional) */}
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
            </motion.button>
        </>
    );
};

export default HawkingFab;
