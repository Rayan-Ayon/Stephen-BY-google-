
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, StarIcon, CheckCircleIcon, PlusIcon, LinkIcon, MicIcon, VideoCameraIcon, FileTextIcon, ClipboardIcon, ChevronDownIcon, GlobeIcon, LockClosedIcon } from './icons';
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
    danger?: boolean;
}

const BaseModal: React.FC<ModalProps> = ({ onClose, title, children, ctaText, onCtaClick, ctaDisabled = false, showFooter = true, icon, danger = false }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                className="relative dark:bg-[#0d0d0d] bg-white dark:text-gray-300 text-neutral-800 w-full max-w-[700px] rounded-[32px] border dark:border-white/10 border-neutral-200 shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-8 py-7">
                    <div className="flex items-center gap-3">
                        {icon && <div className="text-white bg-[#1a1a1a] p-2 rounded-lg border border-white/10">{icon}</div>}
                        <h2 className="text-[20px] font-medium dark:text-white text-black tracking-tight leading-none">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800/50 transition-colors"><XIcon className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="px-8 pb-8">{children}</div>
                {showFooter && (
                    <div className="px-8 py-6 border-t dark:border-white/5 border-neutral-200 flex justify-end items-center space-x-3">
                         {ctaText && (
                            <button 
                                onClick={onCtaClick} 
                                disabled={ctaDisabled} 
                                className={`px-6 py-2.5 text-[14px] font-bold rounded-full transition-colors disabled:opacity-50 shadow-lg ${danger ? 'bg-red-900/80 text-white hover:bg-red-800' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                            >
                                {ctaText}
                            </button>
                         )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export const DeleteSpaceModal: React.FC<{ spaceName: string, onClose: () => void, onDelete: () => void }> = ({ spaceName, onClose, onDelete }) => {
    return (
        <BaseModal 
            title="Are you sure you want to delete this space?" 
            onClose={onClose} 
            ctaText="Delete" 
            onCtaClick={onDelete}
            danger={true}
        >
            <p className="text-sm dark:text-gray-400 text-neutral-500">"{spaceName}" will be permanently deleted.</p>
        </BaseModal>
    );
};

export const ShareSpaceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [access, setAccess] = useState<'private' | 'public'>('private');

    return (
        <BaseModal title="Invite your friends" onClose={onClose} showFooter={false}>
            <div className="space-y-4">
                <button 
                    onClick={() => setAccess('private')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${access === 'private' ? 'dark:bg-[#1a1a1a] dark:border-white/20 bg-neutral-100 border-neutral-300' : 'dark:border-white/5 border-neutral-200 hover:dark:bg-[#111] hover:bg-neutral-50'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full dark:bg-[#222] bg-white">
                            <LockClosedIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm dark:text-white text-black">Private</div>
                            <div className="text-xs text-gray-500">Viewable by yourself only</div>
                        </div>
                    </div>
                    {access === 'private' && <CheckCircleIcon className="w-5 h-5 text-white" />}
                </button>

                <button 
                    onClick={() => setAccess('public')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${access === 'public' ? 'dark:bg-[#1a1a1a] dark:border-white/20 bg-neutral-100 border-neutral-300' : 'dark:border-white/5 border-neutral-200 hover:dark:bg-[#111] hover:bg-neutral-50'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full dark:bg-[#222] bg-white">
                            <GlobeIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm dark:text-white text-black">Public</div>
                            <div className="text-xs text-gray-500">Anyone on the internet with the link can view</div>
                        </div>
                    </div>
                    {access === 'public' && <CheckCircleIcon className="w-5 h-5 text-white" />}
                </button>
            </div>
        </BaseModal>
    );
};

export const FlashcardModal: React.FC<{ onClose: () => void; onConfirm: (settings: { count: number; focus: string }) => void }> = ({ onClose, onConfirm }) => {
    const [count, setCount] = useState('10');
    const [focus, setFocus] = useState('');

    const handleConfirm = () => {
        onConfirm({
            count: parseInt(count) || 10,
            focus: focus.trim()
        });
    };

    return (
        <BaseModal title="Create Flashcard Set" ctaText="Create Set" onCtaClick={handleConfirm} onClose={onClose}>
            <p className="text-sm dark:text-gray-400 text-neutral-500 -mt-6 mb-8 font-medium">Select specific concepts and customize your flashcard set</p>
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-bold dark:text-white text-neutral-800 block mb-2">Number of flashcards <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        placeholder="e.g., 10" 
                        className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-white transition-all text-white" 
                    />
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
                    <textarea 
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        placeholder="Focus on the parts that are about..." 
                        rows={4} 
                        className="w-full dark:bg-[#0d0d0d] bg-white border dark:border-gray-700 border-neutral-300 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-white transition-all text-white resize-none"
                    ></textarea>
                </div>
            </div>
        </BaseModal>
    );
};

export const QuizModal: React.FC<{ onClose: () => void, onGenerate?: (config: { difficulty: string; numQuestions: string; topic: string }) => void }> = ({ onClose, onGenerate }) => {
    const [difficulty, setDifficulty] = useState('Medium');
    const [numQuestions, setNumQuestions] = useState('Standard');
    const [topic, setTopic] = useState('');

    const handleGenerate = () => {
        if (onGenerate) onGenerate({ difficulty, numQuestions, topic });
        onClose();
    };

    const pillClasses = (isSelected: boolean) => `flex-1 py-2.5 text-[13px] font-bold rounded-full border transition-all flex items-center justify-center space-x-1.5 ${
        isSelected 
        ? 'dark:bg-[#1a2333] dark:border-blue-500/30 bg-blue-50 border-blue-200 text-blue-600 dark:text-blue-400' 
        : 'dark:bg-transparent dark:border-gray-800 bg-white border-neutral-200 dark:text-gray-400 text-neutral-600 hover:dark:bg-[#1a1a1a] hover:bg-neutral-50'
    }`;

    return (
        <BaseModal title="Customise quiz" ctaText="Generate" onCtaClick={handleGenerate} onClose={onClose} icon={<FileTextIcon className="w-5 h-5" />}>
            <div className="space-y-6 pt-2">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium dark:text-white text-neutral-800 block mb-3">Number of questions</label>
                        <div className="flex space-x-2">
                            {['Fewer', 'Standard', 'More'].map(opt => {
                                const label = opt === 'Standard' ? 'Standard (default)' : opt;
                                return (
                                    <button key={opt} onClick={() => setNumQuestions(opt)} className={pillClasses(numQuestions === opt)}>
                                        {numQuestions === opt && <CheckIcon className="w-3.5 h-3.5" />}
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium dark:text-white text-neutral-800 block mb-3">Level of difficulty</label>
                        <div className="flex space-x-2">
                            {['Easy', 'Medium', 'Hard'].map(opt => {
                                const label = opt === 'Medium' ? 'Medium (default)' : opt;
                                return (
                                    <button key={opt} onClick={() => setDifficulty(opt)} className={pillClasses(difficulty === opt)}>
                                        {difficulty === opt && <CheckIcon className="w-3.5 h-3.5" />}
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                <div>
                    <label className="text-sm font-medium dark:text-white text-neutral-800 block mb-3">What should the topic be?</label>
                    <textarea 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Things to try
• Create a quiz to help me prepare for my history exam on Ancient Egypt
• The quiz must have 30 questions (maximum of 50 questions allowed)
• The quiz must be restricted to a specific source (e.g. 'the article about Italy')
• The quiz must focus solely on the key concepts of physics" 
                        rows={6} 
                        className="w-full dark:bg-[#111] bg-white border border-blue-500 rounded-xl p-4 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none font-medium placeholder-gray-500 dark:placeholder-gray-400"
                    ></textarea>
                </div>
            </div>
            {/* Override BaseModal's default CTA button in Footer to make it prominent blue if we can't easily, actually we can just use global CSS or override via onCtaClick since BaseModal might not allow exact color overrides without adding a new prop. Let's add a custom style block to override just this modal's primary button if needed, or update BaseModal if we want. Actually BaseModal uses 'bg-white text-black' by default. Let's hide BaseModal's footer and put our own for exact match. */}
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
                            <span className="text-[12px] font-bold text-gray-500">Show all items {'>'}</span>
                         </div>
                         <XIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2 font-medium">Optional: Select concepts to focus on</p>
                </div>
            </div>
        </BaseModal>
    );
}

export const SummaryModal: React.FC<{ onClose: () => void; onGenerate?: () => void }> = ({ onClose, onGenerate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('Detailed Summary');

    const handleGenerate = () => {
        if (onGenerate) onGenerate();
        onClose();
    };
    
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
            onCtaClick={handleGenerate} 
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

export const PasteUrlModal: React.FC<{ onClose: () => void, onCourseCreated: (course: { id: number; title: string; description: string; type: string; time: string; videoUrl?: string; thumbnailUrl?: string; isStructured?: boolean }) => void }> = ({ onClose, onCourseCreated }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleSubmit = async () => {
        if (!url || isLoading) return;
        setIsLoading(true);
        
        const videoId = getYouTubeId(url) || 'g_IaVepNDT4';
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        
        let videoTitle = `Video: ${videoId}`;
        
        // Fetch real title from YouTube oEmbed API
        try {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const response = await fetch(oembedUrl);
            if (response.ok) {
                const data = await response.json();
                videoTitle = data.title || videoTitle;
            }
        } catch (error) {
            console.error('Failed to fetch video title:', error);
        }

        setTimeout(() => {
            setIsLoading(false);
            const course = {
                id: Date.now(),
                title: videoTitle,
                description: 'YouTube Video',
                type: 'video',
                time: 'Just now',
                videoUrl: embedUrl,
                thumbnailUrl: thumbnailUrl,
                isStructured: false
            };
            onCourseCreated(course);
            onClose();
        }, 800);
    };

    return (
        <BaseModal 
            title="YouTube, Website" 
            onClose={onClose} 
            showFooter={false}
            icon={<LinkIcon className="w-5 h-5 text-white" />}
        >
            <p className="text-[13px] text-[#999] mb-6 leading-relaxed">
                YouTube (videos & playlists), websites, arXiv, and public file URLs: .pdf, .docx, .pptx, .mp3, .mp4
            </p>
            <div className="space-y-4">
                <input 
                    type="text" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    placeholder="https://youtu.be/..." 
                    className="w-full bg-transparent border border-[#333] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-gray-500 transition-all text-white placeholder-[#444]" 
                    autoFocus
                />
                <button 
                    onClick={handleSubmit}
                    disabled={!url || isLoading}
                    className={`w-full py-3 font-bold rounded-xl transition-all duration-200 ${
                        !url || isLoading 
                        ? 'bg-[#333] text-[#666] cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                >
                    {isLoading ? "Adding..." : "Add"}
                </button>
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
