
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, StarIcon, CheckCircleIcon, PlusIcon, LinkIcon, MicIcon, VideoCameraIcon, FileTextIcon, ClipboardIcon, ChevronDownIcon } from './icons';
import { HistoryItem } from './Dashboard';

interface ModalProps {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    ctaText?: string;
    onCtaClick?: () => void;
    ctaDisabled?: boolean;
    showFooter?: boolean;
    icon?: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ onClose, title, children, ctaText, onCtaClick, ctaDisabled = false, showFooter = true, icon }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative dark:bg-[#0d0d0d] bg-white dark:text-gray-300 text-neutral-800 w-full max-w-[500px] rounded-[32px] border dark:border-white/10 border-neutral-200 shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-8 py-7">
                    <div className="flex flex-col">
                        <h2 className="text-[20px] font-bold dark:text-white text-black tracking-tight">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800/50 transition-colors"><XIcon className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="px-8 pb-8">{children}</div>
                {showFooter && (
                    <div className="px-8 py-6 border-t dark:border-white/5 border-neutral-200 flex justify-end items-center space-x-3">
                         <button onClick={onClose} className="px-6 py-2.5 text-[14px] font-bold rounded-xl dark:bg-[#1a1a1a] bg-neutral-100 dark:text-white text-black hover:opacity-80 transition-all">Cancel</button>
                         {ctaText && (
                            <button onClick={onCtaClick} disabled={ctaDisabled} className="px-6 py-2.5 text-[14px] font-bold rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 shadow-lg">
                                {ctaText}
                            </button>
                         )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export const FlashcardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <BaseModal title="Create Flashcard Set" ctaText="Create Set" onCtaClick={onClose} onClose={onClose}>
        <p className="text-sm dark:text-gray-400 text-neutral-500 -mt-6 mb-8 font-medium">Select specific concepts and customize your flashcard set</p>
        <div className="space-y-6">
            <div>
                <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Number of flashcards <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g., 10" className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-white transition-all text-white" />
            </div>
            <div>
                <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Select topics</label>
                <div className="mt-2 p-3 dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-[12px] font-bold bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-white/5 flex items-center">
                            Selected All Topics <XIcon className="w-3 h-3 ml-2 text-gray-500" />
                        </span>
                        <button className="text-[12px] font-bold text-gray-500 hover:text-white flex items-center">
                            Show all items <ChevronDownIcon className="w-3 h-3 ml-1 -rotate-90" />
                        </button>
                    </div>
                    <XIcon className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-[11px] text-gray-500 mt-2 font-medium">Optional: Select concepts to focus on</p>
            </div>
            <div>
                <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">What should the flashcard focus on?</label>
                <textarea placeholder="Focus on the parts that are about..." rows={4} className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-white transition-all text-white resize-none"></textarea>
            </div>
        </div>
    </BaseModal>
);

export const QuizModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [difficulty, setDifficulty] = useState('Medium');
    const [selectedTypes, setSelectedTypes] = useState(['Multiple Choice']);

    const toggleType = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const typeClasses = (type: string) => `flex-1 text-[13px] font-bold py-3 border rounded-xl transition-all ${
        selectedTypes.includes(type) 
        ? 'dark:bg-[#1a1a1a] border-white text-white' 
        : 'dark:bg-transparent dark:border-gray-800 dark:text-gray-500 hover:border-gray-600'
    }`;

    const diffClasses = (diff: string) => `flex-1 flex items-center justify-center space-x-2 py-3 border rounded-xl transition-all font-bold text-[13px] ${
        difficulty === diff 
        ? 'dark:bg-[#1a1a1a] border-white text-white' 
        : 'dark:bg-transparent dark:border-gray-800 dark:text-gray-500 hover:border-gray-600'
    }`;

    return (
        <BaseModal title="Customize Quiz" ctaText="Generate" onCtaClick={onClose} onClose={onClose}>
             <p className="text-sm dark:text-gray-400 text-neutral-500 -mt-6 mb-8 font-medium">Create quiz sets with preferred question types, difficulty, and more.</p>
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Question Types <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Multiple Choice', 'Free Response', 'True or False', 'Fill in the blank'].map(type => (
                            <button key={type} onClick={() => toggleType(type)} className={typeClasses(type)}>
                                {selectedTypes.includes(type) && <CheckCircleIcon className="w-3.5 h-3.5 inline mr-1.5" />}
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Difficulty <span className="text-red-500">*</span></label>
                    <div className="flex space-x-2">
                         {['Easy', 'Medium', 'Hard'].map((label, index) => (
                             <button key={label} onClick={() => setDifficulty(label)} className={diffClasses(label)}>
                                <div className="flex space-x-0.5">
                                    {[0, 1, 2].map(i => (
                                        <StarIcon key={i} className={`w-3 h-3 ${index >= i ? (difficulty === label ? 'text-yellow-400' : 'text-gray-500') : 'text-transparent'}`} />
                                    ))}
                                </div>
                                <span>{label}</span>
                             </button>
                         ))}
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Number of Questions</label>
                    <input type="text" defaultValue="10" className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-all" />
                </div>
                <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Topics</label>
                    <div className="p-3 dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <span className="text-[12px] font-bold bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-white/5">Selected All Topics x</span>
                            <span className="text-[12px] font-bold text-gray-500">Select topics for this set</span>
                         </div>
                         <XIcon className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">What should the quiz focus on?</label>
                    <textarea placeholder="Focus on the parts that are about..." rows={3} className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-all resize-none"></textarea>
                </div>
            </div>
        </BaseModal>
    );
};

export const PodcastModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [length, setLength] = useState('Default');

    return (
        <BaseModal title="Customize Podcast" ctaText="Generate" onCtaClick={onClose} onClose={onClose}>
            <p className="text-sm dark:text-gray-400 text-neutral-500 -mt-6 mb-8 font-medium">Select specific concepts and voices for your podcast</p>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Voice 1</label>
                         <div className="relative">
                            <select className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-300 rounded-xl p-4 appearance-none text-sm dark:text-white focus:outline-none">
                                <option>Charon</option>
                                <option>Laomedeia</option>
                            </select>
                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                         </div>
                    </div>
                     <div>
                        <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Voice 2</label>
                        <div className="relative">
                            <select className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-300 rounded-xl p-4 appearance-none text-sm dark:text-white focus:outline-none">
                                <option>Laomedeia</option>
                                <option>Charon</option>
                            </select>
                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Length</label>
                    <div className="flex space-x-2">
                        {['Short', 'Default', 'Detailed'].map(len => (
                             <button key={len} onClick={() => setLength(len)} className={`flex-1 py-3 text-[13px] font-bold border rounded-xl transition-all ${length === len ? 'dark:bg-[#1a1a1a] border-white text-white' : 'dark:bg-transparent dark:border-gray-800 dark:text-gray-500'}`}>{len}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Topics (Optional)</label>
                    <div className="p-3 dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <span className="text-[12px] font-bold bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-white/5">Selected All Topics x</span>
                            <span className="text-[12px] font-bold text-gray-500">Show all items ></span>
                         </div>
                         <XIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2 font-medium">Optional: Select concepts to focus on</p>
                </div>
            </div>
        </BaseModal>
    );
}

export const SummaryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('Detailed Summary');
    
    const templates = [
        { id: 'Detailed Summary', title: 'Detailed Summary', desc: 'Comprehensive summary with key points and context' },
        { id: 'Cheat Sheet', title: 'Cheat Sheet', desc: 'Concise bullet points for quick reference' },
        { id: 'Short Summary', title: 'Short Summary', desc: 'Brief overview with essential information only' },
        { id: 'Add Custom Prompt', title: 'Add Custom Prompt', desc: '' }
    ];

    return (
        <BaseModal 
            title="Customize Summary" 
            ctaText="Generate Summary" 
            onCtaClick={onClose} 
            onClose={onClose}
        >
            <p className="text-sm dark:text-gray-500 text-neutral-500 -mt-6 mb-8 font-medium">Select specific prompts and ranges for your summary set</p>
            
            <div className="space-y-6">
                <div>
                    <label className="text-[13px] font-bold dark:text-white text-neutral-800 block mb-4 uppercase tracking-wider">Templates</label>
                    <div className="space-y-2.5">
                        {templates.map(template => (
                            <button 
                                key={template.id} 
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`w-full text-left flex items-start p-4 border rounded-[16px] transition-all duration-200 ${selectedTemplate === template.id ? 'dark:bg-[#1a1a1a] dark:border-white/20 border-gray-300 bg-neutral-50' : 'dark:bg-[#0d0d0d] dark:border-white/5 border-neutral-100'}`}
                            >
                                <div className="mt-1 mr-4 shrink-0">
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${selectedTemplate === template.id ? 'dark:border-white border-black' : 'dark:border-white/20 border-gray-300'}`}>
                                        {selectedTemplate === template.id && <div className="w-2.5 h-2.5 dark:bg-white bg-black rounded-full" />}
                                    </div>
                                </div>
                                <div>
                                    <p className={`font-bold text-[14px] ${selectedTemplate === template.id ? 'dark:text-white text-black' : 'dark:text-gray-400 text-neutral-600'}`}>{template.title}</p>
                                    {template.desc && <p className="text-[12px] text-gray-500 mt-0.5">{template.desc}</p>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[13px] font-bold dark:text-white text-neutral-800 block mb-4 uppercase tracking-wider">Summary Range</label>
                    <div className="space-y-4">
                        <p className="text-xs font-bold dark:text-white">Range 1</p>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <span className="text-[10px] text-gray-500 font-bold block mb-1.5 uppercase">Start</span>
                                <input type="text" defaultValue="00:00:00" className="w-full dark:bg-[#151515] bg-neutral-100 border dark:border-white/5 border-neutral-200 rounded-xl p-4 text-[14px] text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"/>
                            </div>
                            <span className="text-gray-500 mt-6 text-sm font-medium">to</span>
                            <div className="flex-1">
                                <span className="text-[10px] text-gray-500 font-bold block mb-1.5 uppercase">End</span>
                                <input type="text" defaultValue="19:50:05" className="w-full dark:bg-[#151515] bg-neutral-100 border dark:border-white/5 border-neutral-200 rounded-xl p-4 text-[14px] text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"/>
                            </div>
                        </div>
                        <button className="flex items-center text-[13px] font-bold dark:text-white hover:opacity-80 transition-all pt-1">
                            <PlusIcon className="w-4 h-4 mr-2" /> Add Another Range
                        </button>
                        <p className="text-[11px] text-gray-500 italic mt-2">Maximum range: 00:00 to 19:50:05</p>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export const CustomPromptModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // Note: The user requested that clicking "Create Prompt" should open the "Customize Summary" modal.
    // However, I'm keeping this one updated to match Screenshot 184907's design style just in case.
    const [prompt, setPrompt] = useState('');
    const suggestions = [
        "Key Takeaways",
        "Summary for Exam",
        "Study Guide",
        "Detailed Summary",
        "Action Items",
        "Visual Concepts"
    ];

    return (
        <BaseModal title="Custom Summary Prompt" ctaText="Add Prompt" onCtaClick={onClose} onClose={onClose}>
            <p className="text-sm dark:text-gray-400 text-neutral-500 -mt-6 mb-8 font-medium">Tell Hawking what kind of summary you need from this content.</p>
            <div className="space-y-6">
                <div>
                    <label className="text-[13px] font-bold dark:text-white text-neutral-800 block mb-4 uppercase tracking-wider">Suggestions</label>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => setPrompt(tag)}
                                className="px-4 py-2 rounded-full border dark:border-white/10 dark:bg-white/5 bg-neutral-100 text-[12px] font-bold dark:text-gray-400 text-neutral-600 hover:dark:border-white hover:dark:text-white transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-[13px] font-bold dark:text-white text-neutral-800 block mb-3 uppercase tracking-wider">Custom prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Focus on the core concepts and real-world applications of..." 
                        rows={6} 
                        className="w-full dark:bg-[#151515] bg-neutral-100 border dark:border-white/10 border-neutral-200 rounded-[24px] p-6 text-[15px] focus:outline-none focus:ring-1 focus:ring-white transition-all dark:text-white placeholder-[#444] resize-none"
                    />
                </div>
            </div>
        </BaseModal>
    );
};

export const RecordLectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const OptionBox = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
        <button className="w-full flex items-center p-6 mb-3 dark:bg-transparent bg-neutral-50 border dark:border-[#2a2a2a] border-neutral-200 rounded-[28px] hover:border-[#888] transition-all group">
            <div className="mr-6 text-[#666] group-hover:text-white transition-colors">
                {React.cloneElement(icon as React.ReactElement<any>, { className: "w-7 h-7" })}
            </div>
            <div className="text-left">
                <p className="font-bold text-[18px] dark:text-[#eee] text-gray-800 group-hover:text-white transition-colors leading-tight">{title}</p>
                <p className="text-[13px] text-[#666] group-hover:text-[#aaa] transition-colors font-medium mt-0.5">{subtitle}</p>
            </div>
        </button>
    );

    return (
        <BaseModal title="Record Lecture" onClose={onClose} showFooter={false}>
            <div className="mt-1">
                <OptionBox 
                    icon={<MicIcon />} 
                    title="Microphone" 
                    subtitle="Record your voice or class" 
                />
                <OptionBox 
                    icon={<VideoCameraIcon />} 
                    title="Browser Tab" 
                    subtitle="Capture audio playing in a browser tab" 
                />
            </div>
        </BaseModal>
    );
};

export const PasteTextModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <BaseModal 
            title="Paste Text" 
            onClose={onClose} 
            icon={<ClipboardIcon className="w-6 h-6" />}
            ctaText="Add"
            onCtaClick={onClose}
        >
            <p className="text-[14px] dark:text-[#666] text-neutral-500 mb-6 font-medium">Copy and paste text to add as content</p>
            <div className="relative">
                <textarea 
                    placeholder="Paste your notes here" 
                    rows={8} 
                    className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-[#2a2a2a] border-neutral-300 rounded-[24px] p-6 text-md focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all resize-none dark:text-white placeholder-[#444]"
                />
            </div>
        </BaseModal>
    );
};

export const PasteUrlModal: React.FC<{ onClose: () => void, onCourseCreated: (course: HistoryItem) => void; }> = ({ onClose, onCourseCreated }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleSubmit = () => {
        if (!url || isLoading) return;
        setIsLoading(true);
        const videoId = getYouTubeId(url);
        const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : 'https://www.youtube.com/embed/g_IaVepNDT4';

        setTimeout(() => {
            const newCourse: HistoryItem = {
                id: Date.now(),
                title: videoId ? 'New YouTube Course' : 'Personalized Learning Course',
                description: videoId ? `Course created from YouTube video.` : `This course was generated from: ${url}.`,
                type: 'video',
                time: 'Just now',
                videoUrl: embedUrl,
                day: 1, totalDays: 7, depth: 10, level: 'Intermediate', learningReason: 'Exploring web resources.',
            };
            setIsLoading(false);
            onCourseCreated(newCourse);
            onClose();
        }, 1200);
    };

    return (
        <BaseModal title="Create course from link" ctaText={isLoading ? "Creating..." : "Create"} onCtaClick={handleSubmit} onClose={onClose} ctaDisabled={isLoading} icon={<LinkIcon className="w-6 h-6" />}>
            <p className="text-sm dark:text-[#666] text-neutral-500 mb-6 font-medium">Add any link, like a YouTube video, a PDF, or an article, and we'll create a personalized course for you.</p>
            <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste any link here..." className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-[#2a2a2a] border-neutral-300 rounded-[18px] py-4 pl-12 pr-4 text-md focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all dark:text-white" />
            </div>
        </BaseModal>
    );
};

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
                className="relative w-full max-w-md bg-black border border-[#2a2a2a] rounded-3xl p-8 shadow-2xl overflow-hidden z-10"
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

                <div className="space-y-3 mb-8">
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            billingCycle === 'yearly' 
                            ? 'bg-[#0f1f15] border-green-900/50' 
                            : 'bg-[#111] border-[#2a2a2a] hover:border-gray-700'
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
                            : 'bg-[#111] border-[#2a2a2a] hover:border-gray-700'
                        }`}
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
