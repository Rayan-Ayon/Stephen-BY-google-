import React, { useState } from 'react';
import { WRITING_PROMPTS, type WritingPrompt } from '../../../data/writingPrompts';

const ClockIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const PencilIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

interface WritingDashboardProps {
    onStartExam?: (mode: string, timeMinutes: number) => void;
}

const TASK_TYPES = [
    { key: 'task2', label: 'Task 2' },
    { key: 'task1-academic', label: 'Task 1 (Academic)' },
    { key: 'task1-general', label: 'Task 1 (General)' },
];

const WritingDashboard: React.FC<WritingDashboardProps> = ({ onStartExam }) => {
    const [selectedTaskType, setSelectedTaskType] = useState('task2');
    const [randomFilter, setRandomFilter] = useState<'type' | 'topic'>('type');
    const [collection, setCollection] = useState<'cambridge' | 'actual' | 'forecast'>('cambridge');

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-sm">L</span>
                    <span className="font-semibold text-slate-800">LexiBot</span>
                    <span className="text-xs font-semibold text-slate-500 tracking-wider ml-1">| POWERED BY AI</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-3">
                    IELTS Writing <span className="text-teal-700">Mock Tests & Practice</span>
                </h1>
                <p className="text-slate-500 text-center max-w-2xl mx-auto text-sm mb-12">
                    Practise Task 1 and Task 2 with Cambridge prompts, real test questions, and predictions — and get an estimated band score the moment you submit.
                </p>
            </div>

            {/* Filters Section */}
            <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 tracking-wider mb-3">TASK TYPE</p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {TASK_TYPES.map((tt) => {
                        const isActive = selectedTaskType === tt.key;
                        return (
                            <button
                                key={tt.key}
                                onClick={() => setSelectedTaskType(tt.key)}
                                className={`rounded-xl p-4 flex justify-between items-center transition-colors ${
                                    isActive
                                        ? 'border-2 border-teal-700 text-slate-900 font-semibold shadow-sm bg-white'
                                        : 'border border-slate-200 text-slate-500 font-medium hover:border-slate-300 bg-white cursor-pointer'
                                }`}
                            >
                                <span>{tt.label}</span>
                                {isActive ? (
                                    <span className="w-5 h-5 rounded-full border-2 border-teal-700 flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 rounded-full bg-teal-700" />
                                    </span>
                                ) : (
                                    <span className="w-5 h-5 rounded-full border-2 border-slate-300" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Secondary Filters */}
                <div className="flex items-start gap-12 mb-8">
                    <div>
                        <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">RANDOM</p>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setRandomFilter('type')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    randomFilter === 'type' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'
                                }`}
                            >
                                By Type
                            </button>
                            <button
                                onClick={() => setRandomFilter('topic')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    randomFilter === 'topic' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'
                                }`}
                            >
                                By Topic
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">COLLECTION</p>
                        <div className="flex gap-4 text-sm font-medium">
                            <button
                                onClick={() => setCollection('cambridge')}
                                className={collection === 'cambridge' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'}
                            >
                                Cambridge
                            </button>
                            <button
                                onClick={() => setCollection('actual')}
                                className={collection === 'actual' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'}
                            >
                                Actual Test
                            </button>
                            <button
                                onClick={() => setCollection('forecast')}
                                className={collection === 'forecast' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'}
                            >
                                Forecast
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {WRITING_PROMPTS.map((prompt) => (
                    <WritingPromptCard key={prompt.id} prompt={prompt} onStartExam={onStartExam} />
                ))}
            </div>
        </div>
    );
};

const WritingPromptCard: React.FC<{ prompt: WritingPrompt; onStartExam?: (mode: string, timeMinutes: number) => void }> = ({ prompt, onStartExam }) => {
    return (
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex gap-2 mb-3">
                <span className="border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{prompt.taskType}</span>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{prompt.timeLabel}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{prompt.title}</h3>
            <p className="text-teal-700 text-[10px] font-bold tracking-wider uppercase mb-3">{prompt.category}</p>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">{prompt.description}</p>
            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => onStartExam?.(prompt.mode, prompt.timeMinutes)}
                    className="flex-1 bg-teal-700 text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-800 transition-colors"
                >
                    <ClockIcon />
                    Mock Test
                </button>
                <button
                    onClick={() => onStartExam?.('practice', prompt.timeMinutes)}
                    className="flex-1 border border-slate-200 text-slate-700 text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                    <PencilIcon />
                    Practice
                </button>
            </div>
        </div>
    );
};

export default WritingDashboard;
