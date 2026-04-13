import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './icons';

const guideSections = [
    {
        segment: 'Add Content',
        items: [
            { name: 'Upload, paste, or record', content: { title: 'Upload, Paste, or Record', description: 'Easily add your learning materials. Upload files from your computer, paste text directly, or record lectures and meetings on the fly. Stephen organizes everything for you.', image: 'https://images.unsplash.com/photo-1588196749107-45b06f52e414?q=80&w=2074&auto=format&fit=crop' } },
            { name: 'Website links', content: { title: 'Learn from Website Links', description: 'Found an interesting article or a useful website? Just paste the link, and Stephen will turn it into an interactive learning module, complete with summaries, flashcards, and quizzes.', image: 'https://images.unsplash.com/photo-1509926941594-7936c3e390ab?q=80&w=2070&auto=format&fit=crop' } },
            { name: 'Record Lectures & Meetings', content: { title: 'Record Lectures & Meetings', description: 'Never miss a detail. Record your classes or online meetings directly within the app. Stephen transcribes the audio and makes it searchable and ready for study.', image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop' } },
            { name: 'Ask questions with images', content: { title: 'Ask Questions with Images', description: 'Stuck on a diagram or a visual problem? Upload an image and ask questions about it. Our AI can analyze visual information to help you understand complex concepts.', image: 'https://images.unsplash.com/photo-1614926852362-9175f567b5b2?q=80&w=2070&auto=format&fit=crop' } },
        ]
    },
    {
        segment: 'Chat',
        items: [
            { name: 'Chat with AI', content: { title: 'Chat with AI Tutor', description: 'Engage in a conversation with your AI tutor. Ask anything about your study materials, get instant explanations, and explore topics in depth through natural dialogue.', image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop' } },
            { name: 'Mention Tools in Chat', content: { title: 'Mention Tools in Chat', description: 'Supercharge your chat by mentioning tools. Type "@" to access special functions like summarizing a section, creating a quiz on the spot, or defining a term.', image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=2070&auto=format&fit=crop' } },
            { name: 'Visualize Chemical Structures', content: { title: 'Visualize Chemical Structures', description: 'Studying chemistry? Ask the AI to visualize molecules and chemical structures. Get interactive 3D models to better understand complex compounds.', image: 'https://images.unsplash.com/photo-1576092762791-9c2201b5514a?q=80&w=2070&auto=format&fit=crop' } },
            { name: 'Ask about any content', content: { title: 'Ask About Any Content', description: 'Your curiosity has no limits. Highlight any piece of text, diagram, or formula from your materials and ask for clarification. The AI provides context-aware answers.', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop' } },
        ]
    },
    {
        segment: 'Summary, Chapters, Transcripts',
        items: [
            { name: 'Generate summaries, chapters, and transcript', content: { title: 'Automated Summaries, Chapters, and Transcripts', description: 'Save time and focus on what matters. Stephen automatically generates detailed summaries, creates logical chapters from long texts or videos, and provides accurate transcripts for all your audio/video content.', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop' } },
        ]
    }
];

const QuickGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeItem, setActiveItem] = useState(guideSections[0].items[0]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="dark:bg-[#0d0d0d] bg-white dark:text-gray-300 text-neutral-800 w-[90vw] h-[90vh] max-w-7xl rounded-2xl border dark:border-gray-800 border-neutral-200 shadow-2xl flex overflow-hidden relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full dark:hover:bg-gray-700 hover:bg-neutral-200 transition-colors">
                    <XIcon className="w-6 h-6" />
                </button>
                
                {/* Left Sidebar */}
                <aside className="w-80 dark:bg-[#131313] bg-neutral-100 border-r dark:border-gray-800/50 border-neutral-200 p-6 flex flex-col shrink-0 overflow-y-auto">
                    <h2 className="text-2xl font-bold dark:text-white text-black mb-8" style={{ fontFamily: "'Lora', serif" }}>Quick Guide</h2>
                    <nav className="flex flex-col space-y-4">
                        {guideSections.map(section => (
                            <div key={section.segment}>
                                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">{section.segment}</h3>
                                <div className="flex flex-col space-y-1">
                                    {section.items.map(item => (
                                        <button 
                                            key={item.name}
                                            onClick={() => setActiveItem(item)}
                                            className={`w-full text-left text-sm p-2 rounded-md transition-colors ${
                                                activeItem.name === item.name 
                                                ? 'dark:bg-gray-700 bg-neutral-300 dark:text-white text-black font-semibold' 
                                                : 'dark:text-gray-400 text-neutral-600 dark:hover:bg-gray-800 hover:bg-neutral-200 dark:hover:text-white hover:text-black'
                                            }`}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="text-4xl font-bold dark:text-white text-black mb-4" style={{ fontFamily: "'Lora', serif" }}>{activeItem.content.title}</h1>
                            <p className="dark:text-gray-400 text-neutral-500 mb-8 max-w-3xl">{activeItem.content.description}</p>
                            <div className="w-full aspect-video rounded-xl dark:bg-gray-800 bg-neutral-200 overflow-hidden">
                                <img src={activeItem.content.image} alt={activeItem.content.title} className="w-full h-full object-cover"/>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </motion.div>
        </motion.div>
    );
};

export default QuickGuideModal;