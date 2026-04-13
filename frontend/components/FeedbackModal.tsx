
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadIcon } from './icons';

interface FeedbackModalProps {
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
    const [feedback, setFeedback] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = () => {
        if (!feedback.trim()) return;
        setSending(true);
        // Simulate API call
        setTimeout(() => {
            setSending(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-10"
            >
                <div className="p-5">
                     <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full h-32 bg-transparent resize-none outline-none text-base placeholder-gray-400 dark:text-white text-black"
                        autoFocus
                    />
                    
                    <div className="flex items-center justify-between mt-4 pt-2">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="flex items-center gap-3">
                             <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <UploadIcon className="w-5 h-5" />
                             </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={!feedback.trim() || sending}
                                className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? 'Sending...' : 'Send feedback'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-4 bg-gray-50 dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 leading-relaxed">
                    <p>
                        Join our <a href="#" className="text-green-600 dark:text-green-500 hover:underline font-medium">Discord Community</a> to connect with other learners, share ideas, and help shape our platform.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default FeedbackModal;
