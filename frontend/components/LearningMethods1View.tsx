
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MethodologyGrid from './learning-methods/MethodologyGrid';
import DiagnosticsSidebar from './learning-methods/DiagnosticsSidebar';
import type { LearningMethod } from './learning-methods/types';

const seedMethodsLm1: LearningMethod[] = [
    {
        id: 'lm1-spaced',
        name: 'Band 8+ Lexical Recall Matrix (SuperMemo-2)',
        tagline: 'Eliminating Vocabulary Decay During High-Stress Writing & Speaking',
        description: 'Trained on thousands of real test scenarios, this algorithm calculates your personal forgetting curve for complex academic collocations and topic-specific idioms. Never freeze during Writing Task 2 or Speaking Part 3 again.',
        ytVideoId: 'dUqRTWCdMt4',
        applicationSpace: 'Writing Task 2 & Speaking Part 3',
        isDefaultSelected: true,
        category: 'compilation',
    },
    {
        id: 'lm1-feynman-ai',
        name: 'Real-Time Speaking Speed & Fluency Conditioning',
        tagline: 'Simulating Examiner Interrogations & Eliminating Hesitation',
        description: 'An AI examiner challenges your positions in real time. It deconstructs weak arguments, flags filler words ("um", "ah", "basically"), and forces you to re-articulate complex abstract concepts under strict 60-second timers.',
        ytVideoId: '_fqkX2bWzXs',
        applicationSpace: 'Speaking Part 2 & Part 3',
        isDefaultSelected: true,
        category: 'deconstruction',
    },
    {
        id: 'lm1-active-recall',
        name: 'Cambridge Mock Ingestion & Mistake Vault',
        tagline: 'Transforming Failed Mock Drops into Muscle Memory',
        description: 'Upload any Cambridge Reading passage or failed essay correction. The system automatically converts your personal errors into rapid-fire active recall drills targeting True/False/Not Given traps and cohesion gaps.',
        ytVideoId: '1epR3dT4uAE',
        applicationSpace: 'Reading & Listening Traps',
        isDefaultSelected: true,
        category: 'execution',
    },
    {
        id: 'lm1-collocation',
        name: 'Cohesion & Advanced Syntactical Mastery Canvas',
        tagline: 'Shifting from Band 6.5 Structural Rigidness to Native-Level Flow',
        description: 'Immerse yourself in complex sentence structures, academic discourse markers, and natural collocations used by native speakers to ensure your Coherence & Cohesion marks hit the Band 8.5 ceiling.',
        ytVideoId: 'DLzxrzS0lwA',
        applicationSpace: 'Writing Task 1 & Task 2',
        isDefaultSelected: true,
        category: 'synthesis',
    },
];

const Lm1ManifestoPanel: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-10"
        >
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                    <h2 className="text-xl font-bold dark:text-white text-black font-serif">The Band 8.0 Crucible: Engineering Mastery from Trial</h2>
                </div>
                <div className="space-y-4 dark:text-gray-400 text-neutral-600 text-sm leading-relaxed pl-4">
                    <p>
                        Achieving an enterprise Band 8.0+ is not a test of memory—it is a high-stakes endurance test under extreme time pressure. From late-night Task 2 essay rewrites to overcome grammar ceilings, to fighting hesitation spikes during live speaking simulation, this framework is engineered to break plateaus.
                    </p>
                    <p>
                        We converted the grueling, 120-day journey of top candidates into 4 AI-driven cognitive execution routines.
                    </p>
                </div>
            </section>
        </motion.div>
    );
};

const LearningMethods1View: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(
        seedMethodsLm1.filter(m => m.isDefaultSelected).map(m => m.id)
    );
    const [customFrameworkText, setCustomFrameworkText] = useState('');

    const handleToggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden dark:bg-black bg-neutral-100 dark:text-gray-300 text-neutral-800">
            {/* Main: 8 cols */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 pt-24 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-black font-serif mb-1">Learning Methods</h1>
                    <p className="text-sm dark:text-gray-500 text-neutral-500">
                        Configure enterprise pedagogical workflows that shape how courses are generated and knowledge is internalized.
                    </p>
                </div>
                <Lm1ManifestoPanel />
                <MethodologyGrid selectedIds={selectedIds} onToggle={handleToggle} methods={seedMethodsLm1} />
            </div>

            {/* Sidebar: 4 cols */}
            <aside className="w-96 border-l dark:border-border border-neutral-200 p-6 pt-24 overflow-y-auto hidden lg:block shrink-0 dark:bg-black bg-neutral-50">
                <DiagnosticsSidebar
                    methods={seedMethodsLm1}
                    selectedIds={selectedIds}
                    customFrameworkText={customFrameworkText}
                    onSaveFramework={setCustomFrameworkText}
                />
            </aside>
        </div>
    );
};

export default LearningMethods1View;
