
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, StarIcon, CheckCircleIcon, PlusIcon, LinkIcon } from './icons';
import { HistoryItem } from './Dashboard';

interface ModalProps {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    ctaText: string;
    onCtaClick: () => void;
    ctaDisabled?: boolean;
}

const BaseModal: React.FC<ModalProps> = ({ onClose, title, children, ctaText, onCtaClick, ctaDisabled = false }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative dark:bg-[#1a1a1a] bg-white dark:text-gray-300 text-neutral-800 w-full max-w-lg rounded-2xl border dark:border-gray-800 border-neutral-200 shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b dark:border-gray-800 border-neutral-200">
                    <h2 className="text-xl font-semibold dark:text-white text-black" style={{ fontFamily: "'Lora', serif" }}>{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full dark:hover:bg-gray-700 hover:bg-neutral-200 transition-colors"><XIcon className="w-5 h-5" /></button>
                </div>
                <div className="p-6">{children}</div>
                <div className="flex justify-end p-6 border-t dark:border-gray-800 border-neutral-200 space-x-4">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold rounded-lg border dark:border-gray-700 border-neutral-300 dark:hover:bg-gray-800 hover:bg-neutral-100 transition-colors">Cancel</button>
                    <button onClick={onCtaClick} disabled={ctaDisabled} className="px-5 py-2.5 text-sm font-semibold rounded-lg dark:bg-white dark:text-black bg-black text-white dark:hover:bg-gray-200 hover:bg-neutral-800 transition-colors dark:disabled:bg-gray-600 disabled:bg-neutral-300 disabled:cursor-not-allowed">{ctaText}</button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Specific Modals ---

export const PasteUrlModal: React.FC<{ onClose: () => void, onCourseCreated: (course: HistoryItem) => void; }> = ({ onClose, onCourseCreated }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        if (!url || isLoading) return;
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newCourse: HistoryItem = {
                id: Date.now(),
                title: 'New Course From URL',
                description: `This course was generated from the provided URL: ${url}.`,
                type: url.includes('youtube.com') ? 'video' : 'article',
                time: 'Just now',
                videoUrl: url.includes('youtube.com') ? url.replace('watch?v=', 'embed/') : 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                day: 1,
                totalDays: 7,
                depth: 10,
                level: 'Intermediate',
                learningReason: 'To explore a new topic from a web resource.',
            };
            setIsLoading(false);
            onCourseCreated(newCourse);
            onClose();
        }, 1500);
    };

    return (
        <BaseModal title="Create course from link" ctaText={isLoading ? "Creating..." : "Create"} onCtaClick={handleSubmit} onClose={onClose} ctaDisabled={isLoading}>
            <p className="text-sm dark:text-gray-400 text-neutral-500 mb-4">Add any link, like a YouTube video, a PDF, or an article, and we'll create a personalized course for you.</p>
            <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste any link here..."
                    className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl py-3 pl-12 pr-4 text-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
            </div>
        </BaseModal>
    );
};

export const FlashcardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <BaseModal title="Create Flashcard Set" ctaText="Create Set" onCtaClick={onClose} onClose={onClose}>
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Number of flashcards *</label>
                <input type="text" placeholder="e.g. 10" className="mt-2 w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
                <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Select topics</label>
                <div className="mt-2 p-3 dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg">
                    <span className="text-sm text-gray-500">Optional: Select concepts to focus on</span>
                </div>
            </div>
            <div>
                <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">What should the flashcard focus on?</label>
                <textarea placeholder="Focus on the parts that are about..." rows={3} className="mt-2 w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
            </div>
        </div>
    </BaseModal>
);

export const QuizModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [difficulty, setDifficulty] = useState(2);
    return (
        <BaseModal title="Customize Quiz" ctaText="Generate" onCtaClick={onClose} onClose={onClose}>
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Question Types *</label>
                    <div className="mt-2 flex space-x-2">
                        {['Multiple Choice', 'Free Response', 'True or False', 'Fill in the blank'].map(type => (
                            <button key={type} className="flex-1 text-sm py-2.5 border dark:border-gray-700 border-neutral-300 rounded-lg dark:hover:bg-gray-800 hover:bg-neutral-100 data-[active=true]:bg-orange-500/20 data-[active=true]:border-orange-500 dark:data-[active=true]:text-orange-300 data-[active=true]:text-orange-600" data-active={type === 'Multiple Choice' || type === 'Free Response'}>{type}</button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Difficulty *</label>
                    <div className="mt-2 flex space-x-2">
                         {['Easy', 'Medium', 'Hard'].map((label, index) => (
                             <button key={label} onClick={() => setDifficulty(index + 1)} className="flex-1 flex items-center justify-center space-x-1 py-2.5 border dark:border-gray-700 border-neutral-300 rounded-lg dark:hover:bg-gray-800 hover:bg-neutral-100 data-[active=true]:bg-orange-500/20 data-[active=true]:border-orange-500 dark:data-[active=true]:text-orange-300 data-[active=true]:text-orange-600" data-active={difficulty === index + 1}>
                                <StarIcon className={`w-4 h-4 ${difficulty >= index + 1 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                                <span>{label}</span>
                             </button>
                         ))}
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Number of Questions</label>
                    <input type="text" defaultValue="10" className="mt-2 w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">What should the quiz focus on?</label>
                    <textarea placeholder="Focus on the parts that are about..." rows={3} className="mt-2 w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
            </div>
        </BaseModal>
    );
};

export const PodcastModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <BaseModal title="Customize Podcast" ctaText="Generate" onCtaClick={onClose} onClose={onClose}>
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Voice 1</label>
                     <select className="mt-2 w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Charon</option>
                        <option>Laomedeia</option>
                    </select>
                </div>
                 <div>
                    <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Voice 2</label>
                    <select className="mt-2 w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Laomedeia</option>
                        <option>Charon</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Length</label>
                <div className="mt-2 flex space-x-2">
                    {['Short', 'Default', 'Detailed'].map(len => (
                         <button key={len} className="flex-1 text-sm py-2.5 border dark:border-gray-700 border-neutral-300 rounded-lg dark:hover:bg-gray-800 hover:bg-neutral-100 data-[active=true]:bg-orange-500/20 data-[active=true]:border-orange-500 dark:data-[active=true]:text-orange-300 data-[active=true]:text-orange-600" data-active={len === 'Default'}>{len}</button>
                    ))}
                </div>
            </div>
            <div>
                <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Topics (Optional)</label>
                <div className="mt-2 p-3 dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg">
                    <span className="text-sm text-gray-500">Optional: Select concepts to focus on</span>
                </div>
            </div>
        </div>
    </BaseModal>
);

export const SummaryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('Detailed Summary');
    return (
    <BaseModal title="Customize Summary" ctaText="Generate Summary" onCtaClick={onClose} onClose={onClose}>
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Templates</label>
                <div className="mt-2 space-y-2">
                    {[
                        { title: 'Detailed Summary', desc: 'Comprehensive summary with key points and context.' },
                        { title: 'Cheat Sheet', desc: 'Concise bullet points for quick reference.' },
                        { title: 'Short Summary', desc: 'Brief overview with essential information only.' }
                    ].map(template => (
                         <button key={template.title} onClick={() => setSelectedTemplate(template.title)} className="w-full text-left flex items-start p-3 border dark:border-gray-700 border-neutral-300 rounded-lg dark:hover:bg-gray-800 hover:bg-neutral-100 data-[active=true]:bg-orange-500/20 data-[active=true]:border-orange-500" data-active={selectedTemplate === template.title}>
                             <div className="mt-1 mr-3">
                                <div className={`w-5 h-5 rounded-full border-2 ${selectedTemplate === template.title ? 'border-orange-400 bg-orange-400' : 'dark:border-gray-600 border-neutral-400'} flex items-center justify-center`}>
                                   {selectedTemplate === template.title && <div className="w-2 h-2 dark:bg-[#1a1a1a] bg-white rounded-full"></div>}
                                </div>
                             </div>
                             <div>
                                 <p className="font-semibold dark:text-white text-black">{template.title}</p>
                                 <p className="text-sm dark:text-gray-400 text-neutral-500">{template.desc}</p>
                             </div>
                         </button>
                    ))}
                </div>
            </div>
            <div>
                 <label className="text-sm font-medium dark:text-gray-300 text-neutral-800">Summary Range</label>
                 <div className="mt-2 flex items-center space-x-2">
                    <input type="text" defaultValue="00:00:00" className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 text-center"/>
                    <span className="text-gray-500">to</span>
                    <input type="text" defaultValue="29:03:16" className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-lg p-3 text-center"/>
                 </div>
                 <button className="mt-2 flex items-center text-sm text-orange-400 hover:text-orange-300"><PlusIcon className="w-4 h-4 mr-1" /> Add Another Range</button>
            </div>
        </div>
    </BaseModal>
)};

export const UpgradeModal: React.FC<{ onClose: () => void, onNavigateToPricing: () => void }> = ({ onClose, onNavigateToPricing }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-black border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden z-10"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <XIcon className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Lora', serif" }}>Upgrade Your Plan</h2>
                    <p className="text-gray-400 text-sm">
                        Join over <span className="bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded font-bold">2 Million</span> learning smarter
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300"><strong className="text-white">Unlimited</strong> uploads, pastes, and records</span>
                    </div>
                    <div className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300"><strong className="text-white">Unlimited</strong> AI chats (<strong className="text-white">100</strong> / day with <strong className="text-white underline decoration-dotted">Learn+</strong> mode)</span>
                    </div>
                    <div className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300"><strong className="text-white">Unlimited</strong> quiz generation</span>
                    </div>
                    <div className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300"><strong className="text-white">Unlimited</strong> practice exams</span>
                    </div>
                    <div className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300"><strong className="text-white">12 podcasts</strong> / day</span>
                    </div>
                    <div className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Upload files, each up to <strong className="text-white">2000</strong> pages / 300 MB in size</span>
                    </div>
                </div>

                {/* Billing Options */}
                <div className="space-y-3 mb-8">
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            billingCycle === 'yearly' 
                            ? 'bg-[#0f1f15] border-green-900/50' 
                            : 'bg-[#111] border-gray-800 hover:border-gray-700'
                        }`}
                    >
                        <div className="flex items-center">
                            <span className={`font-semibold ${billingCycle === 'yearly' ? 'text-green-400' : 'text-gray-400'}`}>Annual</span>
                            <span className="ml-3 text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full border border-green-800/50">Save 40%</span>
                        </div>
                        <span className={`font-bold ${billingCycle === 'yearly' ? 'text-green-400' : 'text-gray-400'}`}>৳598 / month</span>
                    </button>

                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            billingCycle === 'monthly' 
                            ? 'bg-[#1a1a1a] border-gray-600' 
                            : 'bg-[#111] border-gray-800 hover:border-gray-700'
                        }`}
                        style={billingCycle === 'monthly' ? { backgroundColor: '#1a1a1a', borderColor: '#555' } : {}}
                    >
                        <div className="flex items-center">
                            <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
                        </div>
                        <span className={`font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>৳979 / month</span>
                    </button>
                </div>

                <button className="w-full py-4 bg-white text-black font-bold text-base rounded-xl hover:bg-gray-200 transition-colors">
                    Select Plan
                </button>

                <div className="mt-6 text-center text-xs text-gray-500">
                    Need a team plan? <button onClick={() => { onClose(); onNavigateToPricing(); }} className="text-white underline hover:text-gray-300 transition-colors">Click here.</button>
                </div>
            </motion.div>
        </div>
    );
};
