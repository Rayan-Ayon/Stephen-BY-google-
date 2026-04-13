
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SendIcon, PhoneIcon, XIcon, ChevronDownIcon } from './icons';

interface ContactUsSlideProps {
    onClose: () => void;
}

const ContactUsSlide: React.FC<ContactUsSlideProps> = ({ onClose }) => {
    const [name, setName] = useState('Fatema Farhana');
    const [email, setEmail] = useState('fatema.sociology.du@gmail.com');
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');

    const inputClasses = "w-full dark:bg-[#111] bg-neutral-100 border dark:border-gray-800 border-neutral-200 rounded-xl px-4 py-3 text-sm dark:text-white text-black outline-none focus:ring-1 focus:ring-gray-600 transition-all";
    const labelClasses = "block text-sm font-bold dark:text-white text-gray-900 mb-2";
    const subLabelClasses = "block text-xs text-gray-500 mt-1.5";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-lg dark:bg-[#0b0b0b] bg-white rounded-3xl border dark:border-gray-800 border-neutral-200 shadow-2xl p-8 overflow-y-auto max-h-[90vh]"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="space-y-8 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                placeholder="Fatema Farhana"
                                className={inputClasses}
                            />
                            <span className={subLabelClasses}>Enter your full name</span>
                        </div>
                        <div>
                            <label className={labelClasses}>Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                placeholder="Enter your email"
                                className={inputClasses}
                            />
                            <span className={subLabelClasses}>Enter your email address</span>
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Feedback Type</label>
                        <div className="relative">
                            <select 
                                className={`${inputClasses} appearance-none cursor-pointer`}
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <option value="" disabled>Select feedback type</option>
                                <option value="support">Support</option>
                                <option value="bug">Bug Report</option>
                                <option value="feature">Feature Request</option>
                                <option value="other">Other</option>
                            </select>
                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                        <span className={subLabelClasses}>Choose the type of feedback</span>
                    </div>

                    <div>
                        <label className={labelClasses}>Message</label>
                        <textarea 
                            rows={6}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Hey, I need help with something..."
                            className={`${inputClasses} resize-none`}
                        />
                        <span className={subLabelClasses}>Describe your message in detail</span>
                    </div>

                    <div className="space-y-3 pt-4">
                        <button className="w-full py-3.5 bg-white text-black font-bold rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                            Submit <SendIcon className="w-5 h-5 ml-2" />
                        </button>
                        <button className="w-full py-3.5 dark:bg-[#1a1a1a] bg-neutral-200 dark:text-white text-black font-bold rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity">
                            Schedule <PhoneIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactUsSlide;
