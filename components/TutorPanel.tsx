import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatIcon, FlashcardIcon, QuizIcon, PodcastIcon, SummaryIcon, NotesIcon, MaximizeIcon, MinimizeIcon, PlusIcon, HistoryIcon, TrashIcon, CopyIcon, SendIcon } from './icons';
import { FlashcardModal, QuizModal, PodcastModal, SummaryModal } from './modals';

type ActiveTab = 'Chat' | 'Flashcards' | 'Quizzes' | 'Podcast' | 'Summary' | 'Notes';
type ModalState = { type: 'flashcards' | 'quiz' | 'podcast' | 'summary' | null; isOpen: boolean };

interface TutorPanelProps {
    isPanelExpanded: boolean;
    setIsPanelExpanded: (isExpanded: boolean) => void;
}

// FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const tabs: { name: ActiveTab; icon: React.ReactElement }[] = [
    { name: 'Chat', icon: <ChatIcon className="w-5 h-5" /> },
    { name: 'Flashcards', icon: <FlashcardIcon className="w-5 h-5" /> },
    { name: 'Quizzes', icon: <QuizIcon className="w-5 h-5" /> },
    { name: 'Podcast', icon: <PodcastIcon className="w-5 h-5" /> },
    { name: 'Summary', icon: <SummaryIcon className="w-5 h-5" /> },
    { name: 'Notes', icon: <NotesIcon className="w-5 h-5" /> },
];

const ChatPanel: React.FC = () => (
    <div className="flex flex-col h-full p-4">
        <div className="text-center py-12 flex-grow flex flex-col justify-center items-center">
             <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4"><ChatIcon className="w-8 h-8 text-gray-400" /></div>
            <h3 className="font-semibold text-white">Learn with the AI Tutor</h3>
        </div>
        <div className="relative">
             <input type="text" placeholder="Learn anything" className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
             <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-200 text-black hover:bg-white"><SendIcon className="w-5 h-5" /></button>
        </div>
    </div>
);

const NotesPanel: React.FC = () => (
     <div className="flex flex-col h-full p-4">
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
            <p>Start typing... (use '/' for commands)</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
            <button className="px-4 py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-600">Notes Floater</button>
            <button className="px-4 py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center"><CopyIcon className="w-4 h-4 mr-2" />Copy Notes</button>
        </div>
    </div>
);

const GenericPanel: React.FC<{ name: string, onAdjust: () => void }> = ({ name, onAdjust }) => (
    <div className="flex flex-col h-full p-4 items-center justify-center">
        <p className="text-gray-400 mb-4">{name} generated for this lesson.</p>
        <button onClick={onAdjust} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Adjust</button>
    </div>
);

const TutorPanel: React.FC<TutorPanelProps> = ({ isPanelExpanded, setIsPanelExpanded }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Chat');
    const [modalState, setModalState] = useState<ModalState>({ type: null, isOpen: false });
    
    const openModal = (type: ModalState['type']) => setModalState({ type, isOpen: true });
    const closeModal = () => setModalState({ type: null, isOpen: false });

    const renderPanelContent = () => {
        switch (activeTab) {
            case 'Chat': return <ChatPanel />;
            case 'Notes': return <NotesPanel />;
            case 'Flashcards': return <GenericPanel name="Flashcards" onAdjust={() => openModal('flashcards')} />;
            case 'Quizzes': return <GenericPanel name="Quizzes" onAdjust={() => openModal('quiz')} />;
            case 'Podcast': return <GenericPanel name="Podcast" onAdjust={() => openModal('podcast')} />;
            case 'Summary': return <GenericPanel name="Summary" onAdjust={() => openModal('summary')} />;
            default: return null;
        }
    };
    
    return (
        <>
            <motion.div
                layout
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`relative flex flex-col h-full bg-[#1a1a1a] border border-gray-800 rounded-2xl ${isPanelExpanded ? 'w-[45vw]' : 'w-96'}`}
            >
                <header className="flex items-center justify-between p-2 border-b border-gray-800 shrink-0">
                    <div className="flex items-center space-x-1">
                        {tabs.map(tab => (
                            <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === tab.name ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                                {activeTab === tab.name && <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>}
                                {tab.icon}
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                        <button className="hover:text-white p-1.5 rounded-md hover:bg-gray-800"><PlusIcon className="w-5 h-5" /></button>
                        <button className="hover:text-white p-1.5 rounded-md hover:bg-gray-800"><HistoryIcon className="w-5 h-5" /></button>
                        <button onClick={() => setIsPanelExpanded(!isPanelExpanded)} className="hover:text-white p-1.5 rounded-md hover:bg-gray-800">
                            {isPanelExpanded ? <MinimizeIcon className="w-5 h-5" /> : <MaximizeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto">
                    {renderPanelContent()}
                </div>
            </motion.div>

            <AnimatePresence>
                {modalState.isOpen && modalState.type === 'flashcards' && <FlashcardModal onClose={closeModal} />}
                {modalState.isOpen && modalState.type === 'quiz' && <QuizModal onClose={closeModal} />}
                {modalState.isOpen && modalState.type === 'podcast' && <PodcastModal onClose={closeModal} />}
                {modalState.isOpen && modalState.type === 'summary' && <SummaryModal onClose={closeModal} />}
            </AnimatePresence>
        </>
    );
};

export default TutorPanel;