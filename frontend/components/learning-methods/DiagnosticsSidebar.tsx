
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LearningMethod } from './types';
import { BookOpenIcon, ClipboardIcon, SettingsIcon, CheckCircleIcon } from '../icons';

interface DiagnosticsSidebarProps {
    methods: LearningMethod[];
    selectedIds: string[];
    customFrameworkText: string;
    onSaveFramework: (text: string) => void;
}

const DiagnosticsSidebar: React.FC<DiagnosticsSidebarProps> = ({
    methods,
    selectedIds,
    customFrameworkText,
    onSaveFramework,
}) => {
    const [localText, setLocalText] = useState(customFrameworkText);
    const [saved, setSaved] = useState(false);
    const activeMethods = methods.filter(m => selectedIds.includes(m.id));

    const handleSave = () => {
        onSaveFramework(localText);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-5">
            {/* Active Course Building Blocks */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-5 shadow-sm"
            >
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <BookOpenIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold dark:text-white text-black text-sm">Active Building Blocks</h3>
                </div>

                {activeMethods.length === 0 ? (
                    <p className="text-xs dark:text-gray-600 text-neutral-400 italic">
                        No methods selected. Toggle methodologies above to populate your learning stack.
                    </p>
                ) : (
                    <div className="space-y-2.5">
                        <AnimatePresence mode="popLayout">
                            {activeMethods.map(m => (
                                <motion.div
                                    key={m.id}
                                    layout
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-3 dark:bg-emerald-500/5 bg-emerald-50 dark:border-emerald-500/20 border-emerald-500/30 rounded-lg px-3.5 py-2.5 border"
                                >
                                    <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold dark:text-white text-black truncate">{m.name}</p>
                                        <p className="text-[10px] dark:text-gray-500 text-neutral-500 truncate">{m.applicationSpace}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div className="pt-2 flex items-center justify-between text-xs dark:text-gray-600 text-neutral-500">
                            <span>{activeMethods.length} method{activeMethods.length !== 1 ? 's' : ''} active</span>
                            <span className="dark:text-emerald-400 text-emerald-600 font-medium">
                                {activeMethods.length === 4 ? 'Full stack' : `${4 - activeMethods.length} more available`}
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Inject Custom Learning Rules */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-5 shadow-sm"
            >
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                        <ClipboardIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold dark:text-white text-black text-sm">Inject Custom Learning Rules</h3>
                </div>

                <p className="text-xs dark:text-gray-500 text-neutral-500 mb-3 leading-relaxed">
                    Write markdown strings describing your personal learning workflows, preferences, or constraints.
                    These will be injected into course generation prompts.
                </p>

                <textarea
                    value={localText}
                    onChange={e => setLocalText(e.target.value)}
                    placeholder={`e.g. "I prefer visual explanations over text. For any new topic, first find a 3Blue1Brown-style animation, then read the paper, then implement from scratch."`}
                    className="w-full h-28 dark:bg-black bg-neutral-50 border dark:border-white/10 border-gray-200 rounded-xl px-4 py-3 text-sm dark:text-gray-300 text-neutral-700 placeholder-gray-500 resize-none focus:outline-none focus:border-emerald-500/50 transition-colors custom-scrollbar"
                />

                <button
                    onClick={handleSave}
                    disabled={localText === customFrameworkText && saved}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saved ? (
                        <>
                            <CheckCircleIcon className="w-4 h-4" />
                            Saved
                        </>
                    ) : (
                        <>
                            <SettingsIcon className="w-4 h-4" />
                            Save Framework Rules
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
};

export default DiagnosticsSidebar;
