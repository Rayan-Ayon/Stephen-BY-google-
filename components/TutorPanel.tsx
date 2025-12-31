
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChatIcon, FlashcardIcon, QuizIcon, PodcastIcon, SummaryIcon, NotesIcon, 
    MinimizeIcon, PlusIcon, HistoryIcon, 
    MindMapIcon, TimelineIcon, SearchIcon, WaveformIcon, PaperclipIcon, MicIcon,
    ChevronDownIcon, SendIcon, MaximizeIcon as FullSizeIcon, MessageCircleIcon,
    GlobeIcon, CheckCircleIcon, BookOpenIcon, ClockIcon, SettingsIcon,
    BrainIcon, LoadingSpinnerIcon, XIcon, MicOffIcon, ChevronLeftIcon,
    FlowChartIcon, BarChartIcon, LineChartIcon, PieChartIcon, VennDiagramIcon,
    AdjustIcon, CheckIcon, QuizIcon as QuizIconAlt, MaximizeIcon, PodcastIcon as PodcastIconAlt
} from './icons';
import { FlashcardModal, QuizModal, PodcastModal, SummaryModal, CustomPromptModal } from './modals';

type ActiveTab = 'Chat' | 'Flashcards' | 'Quizzes' | 'Podcast' | 'Summary' | 'Notes';

interface TutorPanelProps {
    isPanelExpanded: boolean;
    setIsPanelExpanded: (isExpanded: boolean) => void;
}

const tabs: { name: ActiveTab; icon: React.ReactElement }[] = [
    { name: 'Chat', icon: <MessageCircleIcon className="w-5 h-5" /> },
    { name: 'Flashcards', icon: <FlashcardIcon className="w-5 h-5" /> },
    { name: 'Quizzes', icon: <QuizIcon className="w-5 h-5" /> },
    { name: 'Podcast', icon: <PodcastIcon className="w-5 h-5" /> },
    { name: 'Summary', icon: <SummaryIcon className="w-5 h-5" /> },
];

const models = [
    { name: 'Auto', free: true },
    { name: 'Gemini 3 Flash', free: true },
    { name: 'Claude 4.5 Sonnet', free: false },
    { name: 'GPT-5.2', free: false },
    { name: 'Gemini 3 Pro', free: false },
    { name: 'Grok 4.1', free: false },
];

const VerticalBlinkingBars = () => {
    const [opacities, setOpacities] = useState([0.2, 0.2, 0.2]);

    useEffect(() => {
        const intervals = [0, 1, 2].map((i) => {
            return setInterval(() => {
                setOpacities(prev => {
                    const next = [...prev];
                    next[i] = Math.random() > 0.4 ? 1 : 0.2;
                    return next;
                });
            }, 300 + Math.random() * 500);
        });
        return () => intervals.forEach(clearInterval);
    }, []);

    return (
        <div className="flex items-center space-x-2 px-4">
            {opacities.map((op, i) => (
                <motion.div
                    key={i}
                    animate={{ opacity: op }}
                    className="w-3.5 h-6 bg-[#10b981] rounded-[4px] shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    transition={{ duration: 0.2 }}
                />
            ))}
        </div>
    );
};

const CreationBox: React.FC<{
    title: string;
    description: string;
    onAdjust: () => void;
    children: React.ReactNode;
}> = ({ title, description, onAdjust, children }) => (
    <div className="dark:bg-[#111] bg-white border dark:border-white/5 border-neutral-200 rounded-[28px] p-8 mb-4 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-gray-700 shadow-sm">
        <div className="flex-1">
            <h3 className="text-[20px] font-bold dark:text-white text-black mb-1 tracking-tight">{title}</h3>
            <p className="text-[14px] dark:text-gray-500 text-neutral-400 font-medium leading-relaxed">
                {description}
            </p>
        </div>
        <div className="flex items-center space-x-4 shrink-0">
            <button 
                onClick={onAdjust} 
                className="p-3 text-gray-500 hover:text-white transition-colors border dark:border-white/5 rounded-xl hover:bg-white/5"
            >
                <AdjustIcon className="w-6 h-6" />
            </button>
            {children}
        </div>
    </div>
);

const SummaryView: React.FC<{ onAdjust: () => void }> = ({ onAdjust }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Detailed Summary');
    const [isAutoGenerate, setIsAutoGenerate] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = ['Detailed Summary', 'Cheat Sheet', 'Short Summary'];

    return (
        <div className="flex flex-col p-6 w-full space-y-4">
            <CreationBox 
                title="Create Summary" 
                description="Create summaries with custom prompts and ranges"
                onAdjust={onAdjust}
            >
                <div className="relative" ref={dropdownRef}>
                    <div className="flex items-stretch bg-white rounded-full overflow-hidden shadow-xl border border-white h-11">
                        <button 
                            className="px-6 py-2 bg-white text-black font-bold text-[14px] hover:bg-neutral-100 transition-colors whitespace-nowrap min-w-[140px]"
                            onClick={() => { /* Generate Action */ }}
                        >
                            {selectedOption}
                        </button>
                        <div className="w-[1px] bg-gray-200 my-2"></div>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="px-3 bg-white text-black hover:bg-neutral-100 transition-colors flex items-center justify-center"
                        >
                            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-3 w-64 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-[20px] shadow-2xl overflow-hidden py-2 z-50"
                            >
                                {options.map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => { setSelectedOption(opt); setIsDropdownOpen(false); }}
                                        className={`w-full text-left px-5 py-3 text-[14px] font-bold transition-colors ${selectedOption === opt ? 'dark:text-white text-black dark:bg-white/5 bg-neutral-100' : 'text-gray-500 hover:dark:text-white hover:text-black'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                                <div className="h-px dark:bg-white/5 bg-neutral-100 my-1.5 mx-3" />
                                <button 
                                    onClick={() => { setIsDropdownOpen(false); onAdjust(); }}
                                    className="w-full text-left px-5 py-3 text-[14px] font-bold text-gray-500 hover:dark:text-white hover:text-black transition-colors"
                                >
                                    + Create Prompt
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CreationBox>

            <div className="dark:bg-[#111] bg-white border dark:border-white/5 border-neutral-200 rounded-[28px] p-8 w-full flex justify-between items-center transition-all hover:border-gray-700">
                <div>
                    <h3 className="text-[17px] font-bold dark:text-white text-black mb-1 tracking-tight">Auto-generate summary?</h3>
                    <p className="text-[13px] dark:text-gray-500 text-neutral-400 font-medium">Automatically create a summary as soon as content is uploaded</p>
                </div>
                <button 
                    onClick={() => setIsAutoGenerate(!isAutoGenerate)}
                    className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${isAutoGenerate ? 'bg-orange-500' : 'dark:bg-[#222] bg-neutral-200'}`}
                >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isAutoGenerate ? 'translate-x-5' : ''}`} />
                </button>
            </div>
        </div>
    );
};

const ChatPanel: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('Auto');
    const [voiceModeState, setVoiceModeState] = useState<'idle' | 'session'>('idle');

    const modelMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
                setIsModelMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVoiceStart = () => {
        setVoiceModeState('session');
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Top area remains static */}
            <div className="absolute top-2 right-4 flex items-center space-x-1 z-10">
                <button className="dark:text-gray-500 text-neutral-400 dark:hover:text-white hover:text-black p-1.5 hover:bg-white/5 rounded-lg transition-all">
                    <PlusIcon className="w-4.5 h-4.5" />
                </button>
                <button className="dark:text-gray-500 text-neutral-400 dark:hover:text-white hover:text-black p-1.5 hover:bg-white/5 rounded-lg transition-all">
                    <HistoryIcon className="w-4.5 h-4.5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-10">
                <div className="mb-6 opacity-30">
                    <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M45 20V80M35 25V75M55 35V65" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold dark:text-gray-400 text-neutral-500 mb-10 tracking-tight">Learn with YouLearn</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-sm mb-12">
                    <button className="flex items-center justify-center space-x-2.5 px-5 py-3 rounded-full border dark:border-white/5 dark:bg-white/5 text-[13px] font-bold text-gray-500 hover:text-white transition-all">
                        <QuizIcon className="w-4 h-4" /> <span>Quiz</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2.5 px-5 py-3 rounded-full border dark:border-white/5 dark:bg-white/5 text-[13px] font-bold text-gray-500 hover:text-white transition-all">
                        <MindMapIcon className="w-4 h-4" /> <span>Mind Map</span>
                    </button>
                    <button onClick={handleVoiceStart} className={`flex items-center justify-center space-x-2.5 px-5 py-3 rounded-full border text-[13px] font-bold transition-all ${voiceModeState === 'session' ? 'dark:bg-white/10 bg-neutral-100 text-white border-white/20' : 'dark:border-white/5 dark:bg-white/5 text-gray-500 hover:text-white'}`}>
                        <WaveformIcon className="w-4 h-4" /> <span>Voice Mode</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2.5 px-5 py-3 rounded-full border dark:border-white/5 dark:bg-white/5 text-[13px] font-bold text-gray-500 hover:text-white transition-all">
                        <FlashcardIcon className="w-4 h-4" /> <span>Flashcards</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2.5 px-5 py-3 rounded-full border dark:border-white/5 dark:bg-white/5 text-[13px] font-bold text-gray-500 hover:text-white transition-all">
                        <GlobeIcon className="w-4 h-4" /> <span>Search</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2.5 px-5 py-3 rounded-full border dark:border-white/5 dark:bg-white/5 text-[13px] font-bold text-gray-500 hover:text-white transition-all">
                        <TimelineIcon className="w-4 h-4" /> <span>Timeline</span>
                    </button>
                </div>
            </div>

            {/* Bottom section transitions */}
            <div className="relative w-full px-6 pb-8 flex items-end min-h-[140px]">
                <AnimatePresence mode="wait">
                    {voiceModeState === 'idle' ? (
                        <motion.div 
                            key="standard-input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="w-full flex flex-col dark:bg-[#111] bg-white border dark:border-white/[0.08] border-neutral-200 rounded-[32px] p-2 transition-all focus-within:ring-2 ring-orange-500/20 relative"
                        >
                            <AnimatePresence>
                                {isModelMenuOpen && (
                                    <motion.div 
                                        ref={modelMenuRef}
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute bottom-[calc(100%+12px)] left-2 w-64 dark:bg-[#181818] bg-white border dark:border-white/10 border-neutral-200 rounded-[22px] shadow-2xl overflow-hidden py-1.5 z-50"
                                    >
                                        {models.map((m) => (
                                            <button 
                                                key={m.name}
                                                onClick={() => { setSelectedModel(m.name); setIsModelMenuOpen(false); }}
                                                className="w-full flex items-center justify-between px-5 py-2.5 text-[13px] dark:text-gray-300 text-gray-700 dark:hover:bg-white/[0.04] hover:bg-neutral-100 transition-colors group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        {selectedModel === m.name && <CheckIcon className="w-3.5 h-3.5 dark:text-white text-black" />}
                                                    </div>
                                                    <span className={`${selectedModel === m.name ? "font-bold dark:text-white text-black" : "font-medium"}`}>{m.name}</span>
                                                </div>
                                                {!m.free && <span className="text-[9px] font-bold bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Upgrade</span>}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="px-5 py-4">
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Learn anything" 
                                    className="w-full bg-transparent border-none focus:outline-none text-md dark:text-white placeholder-gray-600 font-medium" 
                                />
                            </div>
                            <div className="flex items-center justify-between px-2 pb-1">
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full dark:bg-white/5 bg-neutral-100 text-gray-500 text-[11px] font-bold hover:dark:text-white transition-colors ${isModelMenuOpen ? 'dark:bg-white/10 bg-neutral-200 dark:text-white text-black' : ''}`}
                                    >
                                        <span>{selectedModel}</span>
                                        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <button 
                                        className="flex items-center space-x-2 px-4 py-2 rounded-full dark:bg-white/5 bg-neutral-100 text-gray-500 text-[11px] font-bold hover:dark:text-white transition-colors"
                                    >
                                        <span className="text-sm font-light">@</span>
                                        <span>Add Context</span>
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2.5 text-gray-500 hover:text-white transition-colors"><PaperclipIcon className="w-5 h-5"/></button>
                                    <button className="p-2.5 text-gray-500 hover:text-white transition-colors"><MicIcon className="w-5 h-5"/></button>
                                    <button 
                                        onClick={handleVoiceStart}
                                        className="flex items-center space-x-2.5 px-6 py-2.5 bg-white text-black font-bold text-[13px] rounded-full hover:bg-neutral-200 transition-colors shadow-lg"
                                    >
                                        <WaveformIcon className="w-4 h-4" />
                                        <span>Voice</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="voice-mode-tray"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="w-full bg-[#111] dark:bg-[#111] rounded-[24px] p-3 flex items-center justify-between border dark:border-white/5 border-neutral-200 shadow-2xl"
                        >
                            <div className="flex items-center">
                                <VerticalBlinkingBars />
                            </div>

                            <div className="flex items-center space-x-3.5 pr-1.5">
                                <div className="flex space-x-2 px-4">
                                    <div className="w-2 h-2 bg-white rounded-full opacity-100" />
                                    <div className="w-2 h-2 bg-white rounded-full opacity-100" />
                                    <div className="w-2 h-2 bg-white rounded-full opacity-100" />
                                </div>
                                <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors border border-white/5">
                                    <MicOffIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setVoiceModeState('idle')}
                                    className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-red-500 transition-colors border border-white/10"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TutorPanel: React.FC<TutorPanelProps> = ({ isPanelExpanded, setIsPanelExpanded }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Chat');
    const [openModal, setOpenModal] = useState<string | null>(null);
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Chat': return <ChatPanel />;
            case 'Flashcards': 
                return (
                    <div className="p-6">
                        <CreationBox 
                            title="Create Flashcard" 
                            description="Create a flashcard set with preferred number of cards, types of topics, and more."
                            onAdjust={() => setOpenModal('flashcard')}
                        >
                            <button className="px-8 py-2.5 bg-white text-black rounded-full font-bold text-[14px] hover:bg-neutral-200 transition-colors shadow-lg">
                                Generate
                            </button>
                        </CreationBox>
                    </div>
                );
            case 'Quizzes':
                return (
                    <div className="p-6">
                        <CreationBox 
                            title="Create Quiz" 
                            description="Create quiz sets with preferred question types, difficulty, and more."
                            onAdjust={() => setOpenModal('quiz')}
                        >
                            <button className="px-8 py-2.5 bg-white text-black rounded-full font-bold text-[14px] hover:bg-neutral-200 transition-colors shadow-lg">
                                Generate
                            </button>
                        </CreationBox>
                    </div>
                );
            case 'Podcast':
                return (
                    <div className="p-6">
                        <CreationBox 
                            title="Create Podcast" 
                            description="Audio overviews"
                            onAdjust={() => setOpenModal('podcast')}
                        >
                            <button className="px-8 py-2.5 bg-white text-black rounded-full font-bold text-[14px] hover:bg-neutral-200 transition-colors shadow-lg">
                                Generate
                            </button>
                        </CreationBox>
                    </div>
                );
            case 'Summary':
                return <SummaryView onAdjust={() => setOpenModal('summary')} />;
            case 'Notes':
                return <div className="p-10 text-center text-gray-500 font-medium">Notes feature coming soon.</div>;
            default: return <ChatPanel />;
        }
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden ${isPanelExpanded ? 'fixed inset-0 z-50 bg-[#0a0a0a] m-6 rounded-[32px] border border-white/5 shadow-2xl' : 'w-full'}`}>
            <header className="flex items-center justify-between p-4 shrink-0 relative">
                <div className="flex items-center space-x-1 dark:bg-white/[0.03] bg-neutral-100 p-1.5 rounded-[20px] border dark:border-white/[0.06] border-neutral-200 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button 
                            key={tab.name} 
                            onClick={() => setActiveTab(tab.name)} 
                            className={`flex items-center space-x-2.5 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all shrink-0 ${activeTab === tab.name ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            {activeTab === tab.name && <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                            {React.cloneElement(tab.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                            <span className="hidden xl:inline">{tab.name}</span>
                        </button>
                    ))}
                    <button 
                        onClick={() => setActiveTab('Notes')}
                        className={`flex items-center space-x-2.5 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all shrink-0 ${activeTab === 'Notes' ? 'dark:bg-white/10 bg-white dark:text-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}
                    >
                         {activeTab === 'Notes' && <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                        <NotesIcon className="w-4.5 h-4.5" />
                        <span className="hidden xl:inline">Notes</span>
                    </button>
                    <button 
                        onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                        className="flex items-center px-4 py-2.5 rounded-xl text-gray-500 hover:text-white transition-all ml-1 shrink-0"
                    >
                        <FullSizeIcon className="w-5 h-5" />
                    </button>
                </div>
            </header>
            <div className="flex-grow overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {openModal === 'flashcard' && <FlashcardModal onClose={() => setOpenModal(null)} />}
                {openModal === 'quiz' && <QuizModal onClose={() => setOpenModal(null)} />}
                {openModal === 'podcast' && <PodcastModal onClose={() => setOpenModal(null)} />}
                {openModal === 'summary' && <SummaryModal onClose={() => setOpenModal(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default TutorPanel;
