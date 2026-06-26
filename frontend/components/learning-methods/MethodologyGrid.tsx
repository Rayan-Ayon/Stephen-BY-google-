
import React from 'react';
import { motion } from 'framer-motion';
import { LearningMethod, MethodCategory } from './types';
import { BookOpenIcon, CheckCircleIcon, VideoCameraIcon } from '../icons';

export const seedMethods: LearningMethod[] = [
    {
        id: 'jit',
        name: 'Just-In-Time Learning',
        description: 'Acquire exactly the knowledge you need, right when you need it. Eliminate context-switching waste by pulling information on demand for immediate application — the modern alternative to "just-in-case" memorization.',
        ytVideoId: 'dUqRTWCdMt4',
        applicationSpace: 'Fast, contextual execution',
        isDefaultSelected: true,
        category: 'execution',
    },
    {
        id: 'feynman',
        name: 'The Feynman Technique',
        description: 'Explain a concept in plain language as if teaching a child. If you cannot simplify it, you do not understand it deeply. This exposes gaps in mental models and builds structural sensitivity to the subject.',
        ytVideoId: '_fqkX2bWzXs',
        applicationSpace: 'Deep structural understanding',
        isDefaultSelected: true,
        category: 'deconstruction',
    },
    {
        id: 'first-principles',
        name: 'First-Principles Deconstruction',
        description: 'Break complex systems down to their fundamental truths, then rebuild from the ground up. Used by engineers at SpaceX and Tesla to bypass analogy-based thinking and discover novel solutions.',
        ytVideoId: '1epR3dT4uAE',
        applicationSpace: 'Complex robotics/AI engineering',
        isDefaultSelected: false,
        category: 'deconstruction',
    },
    {
        id: 'project-based',
        name: 'Project-Based Compilation',
        description: 'Learn by building in public. Ship real artifacts — code, essays, models, designs — and let the feedback loop of creation, failure, and iteration drive mastery. Knowledge compiles through use.',
        ytVideoId: 'DLzxrzS0lwA',
        applicationSpace: 'Building in public',
        isDefaultSelected: true,
        category: 'compilation',
    },
];

const categoryMeta: Record<MethodCategory, { label: string; color: string; bg: string }> = {
    execution: { label: 'Execution', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    deconstruction: { label: 'Deconstruction', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    compilation: { label: 'Compilation', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    synthesis: { label: 'Synthesis', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

interface MethodologyGridProps {
    selectedIds: string[];
    onToggle: (id: string) => void;
}

const MethodologyGrid: React.FC<MethodologyGridProps> = ({ selectedIds, onToggle }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {seedMethods.map((method, idx) => {
                const isSelected = selectedIds.includes(method.id);
                const cat = categoryMeta[method.category];
                return (
                    <motion.div
                        key={method.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.35 }}
                        className={`dark:bg-[#121212] bg-white border rounded-2xl overflow-hidden transition-all ${
                            isSelected
                                ? 'dark:border-emerald-500/40 border-emerald-500/50 shadow-sm shadow-emerald-900/10'
                                : 'dark:border-white/10 border-gray-200'
                        }`}
                    >
                        {/* YouTube Preview */}
                        <div className="relative w-full aspect-video dark:bg-black bg-gray-100">
                            <iframe
                                src={`https://www.youtube.com/embed/${method.ytVideoId}`}
                                title={method.name}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                sandbox="allow-same-origin allow-scripts allow-presentation"
                            />
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold dark:text-white text-black text-sm">{method.name}</h3>
                                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                                        {cat.label}
                                    </span>
                                </div>
                                {/* Toggle Switch */}
                                <button
                                    onClick={() => onToggle(method.id)}
                                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                                        isSelected ? 'bg-emerald-600' : 'dark:bg-neutral-700 bg-neutral-300'
                                    }`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                            isSelected ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <p className="dark:text-gray-400 text-neutral-600 text-xs leading-relaxed">
                                {method.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs dark:text-gray-500 text-neutral-500 pt-1">
                                <VideoCameraIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{method.applicationSpace}</span>
                                {isSelected && (
                                    <span className="ml-auto flex items-center gap-1 text-emerald-400 font-medium">
                                        <CheckCircleIcon className="w-3.5 h-3.5" />
                                        Active
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default MethodologyGrid;
