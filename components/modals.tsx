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
                className="relative bg-[#1a1a1a] text-gray-300 w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Lora', serif" }}>{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors"><XIcon className="w-5 h-5" /></button>
                </div>
                <div className="p-6">{children}</div>
                <div className="flex justify-end p-6 border-t border-gray-800 space-x-4">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">Cancel</button>
                    <button onClick={onCtaClick} disabled={ctaDisabled} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white text-black hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">{ctaText}</button>
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
            <p className="text-sm text-gray-400 mb-4">Add any link, like a YouTube video, a PDF, or an article, and we'll create a personalized course for you.</p>
            <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste any link here..."
                    className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
            </div>
        </BaseModal>
    );
};

export const FlashcardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <BaseModal title="Create Flashcard Set" ctaText="Create Set" onCtaClick={onClose} onClose={onClose}>
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium">Number of flashcards *</label>
                <input type="text" placeholder="e.g. 10" className="mt-2 w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
                <label className="text-sm font-medium">Select topics</label>
                <div className="mt-2 p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg">
                    <span className="text-sm text-gray-500">Optional: Select concepts to focus on</span>
                </div>
            </div>
            <div>
                <label className="text-sm font-medium">What should the flashcard focus on?</label>
                <textarea placeholder="Focus on the parts that are about..." rows={3} className="mt-2 w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
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
                    <label className="text-sm font-medium">Question Types *</label>
                    <div className="mt-2 flex space-x-2">
                        {['Multiple Choice', 'Free Response', 'True or False', 'Fill in the blank'].map(type => (
                            <button key={type} className="flex-1 text-sm py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800 data-[active=true]:bg-green-500/20 data-[active=true]:border-green-500 data-[active=true]:text-green-300" data-active={type === 'Multiple Choice' || type === 'Free Response'}>{type}</button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium">Difficulty *</label>
                    <div className="mt-2 flex space-x-2">
                         {['Easy', 'Medium', 'Hard'].map((label, index) => (
                             <button key={label} onClick={() => setDifficulty(index + 1)} className="flex-1 flex items-center justify-center space-x-1 py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800 data-[active=true]:bg-green-500/20 data-[active=true]:border-green-500 data-[active=true]:text-green-300" data-active={difficulty === index + 1}>
                                <StarIcon className={`w-4 h-4 ${difficulty >= index + 1 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                                <span>{label}</span>
                             </button>
                         ))}
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium">Number of Questions</label>
                    <input type="text" defaultValue="10" className="mt-2 w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                    <label className="text-sm font-medium">What should the quiz focus on?</label>
                    <textarea placeholder="Focus on the parts that are about..." rows={3} className="mt-2 w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
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
                    <label className="text-sm font-medium">Voice 1</label>
                     <select className="mt-2 w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option>Charon</option>
                        <option>Laomedeia</option>
                    </select>
                </div>
                 <div>
                    <label className="text-sm font-medium">Voice 2</label>
                    <select className="mt-2 w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option>Laomedeia</option>
                        <option>Charon</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="text-sm font-medium">Length</label>
                <div className="mt-2 flex space-x-2">
                    {['Short', 'Default', 'Detailed'].map(len => (
                         <button key={len} className="flex-1 text-sm py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800 data-[active=true]:bg-green-500/20 data-[active=true]:border-green-500 data-[active=true]:text-green-300" data-active={len === 'Default'}>{len}</button>
                    ))}
                </div>
            </div>
            <div>
                <label className="text-sm font-medium">Topics (Optional)</label>
                <div className="mt-2 p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg">
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
                <label className="text-sm font-medium">Templates</label>
                <div className="mt-2 space-y-2">
                    {[
                        { title: 'Detailed Summary', desc: 'Comprehensive summary with key points and context.' },
                        { title: 'Cheat Sheet', desc: 'Concise bullet points for quick reference.' },
                        { title: 'Short Summary', desc: 'Brief overview with essential information only.' }
                    ].map(template => (
                         <button key={template.title} onClick={() => setSelectedTemplate(template.title)} className="w-full text-left flex items-start p-3 border border-gray-700 rounded-lg hover:bg-gray-800 data-[active=true]:bg-green-500/20 data-[active=true]:border-green-500" data-active={selectedTemplate === template.title}>
                             <div className="mt-1 mr-3">
                                <div className={`w-5 h-5 rounded-full border-2 ${selectedTemplate === template.title ? 'border-green-400 bg-green-400' : 'border-gray-600'} flex items-center justify-center`}>
                                   {selectedTemplate === template.title && <div className="w-2 h-2 bg-[#1a1a1a] rounded-full"></div>}
                                </div>
                             </div>
                             <div>
                                 <p className="font-semibold text-white">{template.title}</p>
                                 <p className="text-sm text-gray-400">{template.desc}</p>
                             </div>
                         </button>
                    ))}
                </div>
            </div>
            <div>
                 <label className="text-sm font-medium">Summary Range</label>
                 <div className="mt-2 flex items-center space-x-2">
                    <input type="text" defaultValue="00:00:00" className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 text-center"/>
                    <span className="text-gray-500">to</span>
                    <input type="text" defaultValue="29:03:16" className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 text-center"/>
                 </div>
                 <button className="mt-2 flex items-center text-sm text-green-400 hover:text-green-300"><PlusIcon className="w-4 h-4 mr-1" /> Add Another Range</button>
            </div>
        </div>
    </BaseModal>
)};