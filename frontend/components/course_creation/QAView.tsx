import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon, CheckCircleIcon } from '../icons';

interface QAViewProps {
    topic: string;
    onFinish: () => void;
}

const questions = [
    "Why do you want to learn this?",
    "How much depth do you want to go?",
    "How much time daily will you dedicate?",
    "Do you prefer free, paid, or both types of resources?",
];

const dummyAnswers = [
    "I want to learn machine learning",
    "like about 20%",
    "kind of 3 hours",
    "free resources"
];


const QAView: React.FC<QAViewProps> = ({ topic, onFinish }) => {
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [answers, activeQuestionIndex]);

    const handleSendAnswer = () => {
        const currentAnswer = inputValue || dummyAnswers[activeQuestionIndex];
        setAnswers(prev => [...prev, currentAnswer]);
        setInputValue('');
        
        setTimeout(() => {
            if (activeQuestionIndex < questions.length - 1) {
                setActiveQuestionIndex(prev => prev + 1);
            } else {
                onFinish();
            }
        }, 800);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendAnswer();
        }
    };
    
    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                    {questions.slice(0, activeQuestionIndex + 1).map((q, index) => (
                        <motion.div 
                            key={q}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-4 flex justify-between items-center">
                                <p className="dark:text-gray-200 text-neutral-800">{q}</p>
                                {answers.length > index && 
                                    <motion.div initial={{scale:0}} animate={{scale:1}}>
                                        <CheckCircleIcon className="w-6 h-6 text-orange-500" />
                                    </motion.div>
                                }
                            </div>
                            {answers[index] && (
                                <motion.div 
                                    className="flex justify-end mt-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="dark:bg-[#1f1f1f] bg-neutral-100 border dark:border-gray-700 border-neutral-200 rounded-xl p-4 max-w-md text-right dark:text-gray-300 text-neutral-700">
                                        {answers[index]}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>
            <div className="p-6 pt-2">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your answer..."
                        className="w-full dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl py-3.5 pl-5 pr-14 text-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        disabled={answers.length !== activeQuestionIndex}
                    />
                    <button 
                        onClick={handleSendAnswer} 
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:bg-gray-500"
                        disabled={answers.length !== activeQuestionIndex}
                    >
                        <ArrowUpIcon className="w-5 h-5" />
                    </button>
                </div>
                 <p className="text-xs text-center text-gray-500 mt-3">Stephen can make mistakes. Check important info.</p>
            </div>
        </div>
    );
};

export default QAView;