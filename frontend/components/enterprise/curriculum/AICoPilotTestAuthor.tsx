import React, { useState, useCallback, useMemo } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

export interface QuestionItem {
    id: string;
    type: 'TFNG' | 'Sentence Completion' | 'Multiple Choice' | 'Matching Headings';
    targetBand: string;
    sourceProvenance: string;
    passageExcerpt: string;
    questionText: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
    isEditing?: boolean;
}

export interface CohortBatch {
    id: string;
    name: string;
    studentCount: number;
}

export interface FilterState {
    exam: string;
    module: string;
    targetBand: string;
    repository: string;
}

/* ─── Constants ─────────────────────────────────────────────────────── */

const EXAM_OPTIONS = ['IELTS Academic', 'IELTS General', 'TOEFL iBT', 'GRE General'];
const MODULE_OPTIONS = ['Reading', 'Listening', 'Writing Task 1', 'Writing Task 2'];
const BAND_OPTIONS = ['Band 6.0 - 6.5', 'Band 6.5 - 7.0', 'Band 7.0 - 7.5', 'Band 8.0+'];
const REPO_OPTIONS = ['All Banks (Verified)', 'Cambridge Series (10-18)', 'Past Real Retests', 'Instrumental Private Bank'];

const COHORTS: CohortBatch[] = [
    { id: 'EXEC-BATCH-A', name: 'EXEC-BATCH-A', studentCount: 32 },
    { id: 'EXEC-BATCH-B', name: 'EXEC-BATCH-B', studentCount: 28 },
    { id: 'EXEC-BATCH-C', name: 'EXEC-BATCH-C', studentCount: 41 },
];

const TYPE_COLORS: Record<string, string> = {
    TFNG: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    'Sentence Completion': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    'Multiple Choice': 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    'Matching Headings': 'bg-violet-500/10 text-violet-400 border border-violet-500/30',
};

const TYPE_DISTRIBUTION_COLORS: Record<string, string> = {
    TFNG: 'bg-emerald-400',
    'Sentence Completion': 'bg-cyan-400',
    'Multiple Choice': 'bg-amber-400',
    'Matching Headings': 'bg-violet-400',
};

const INITIAL_QUESTIONS: QuestionItem[] = [
    {
        id: 'q1',
        type: 'TFNG',
        targetBand: '6.5',
        sourceProvenance: 'Cambridge 15 Test 3 Passage 1',
        passageExcerpt: 'The development of modern aviation in the early 20th century transformed global commerce, enabling faster transport of goods and people across continents. Airlines quickly became essential for international trade, though the initial costs of aircraft production limited widespread adoption to wealthy nations.',
        questionText: 'Early aviation primarily impacted agricultural export routes.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'The passage discusses general commerce and trade but does not specifically mention agricultural export routes.',
    },
    {
        id: 'q2',
        type: 'Sentence Completion',
        targetBand: '7.0',
        sourceProvenance: 'Historical Retest Bank (2022)',
        passageExcerpt: 'Pioneers of early flight faced numerous technical challenges, from unreliable engine performance to inadequate navigation instruments. The unpredictable nature of atmospheric conditions proved to be the most persistent obstacle, often grounding flights for days at a time.',
        questionText: 'Complete the sentence using NO MORE THAN TWO WORDS: The primary obstacle for early aviators was unpredictable ________________.',
        correctAnswer: 'weather patterns',
        explanation: 'The passage states atmospheric conditions were the most persistent obstacle, paraphrased as weather patterns.',
    },
    {
        id: 'q3',
        type: 'Multiple Choice',
        targetBand: '7.5',
        sourceProvenance: 'Official Mock Collection V4',
        passageExcerpt: 'Recent archaeological findings suggest that ancient irrigation systems were significantly more complex than previously assumed. Excavations in Mesopotamia revealed a dual-canal network where the primary channels carried water to fields while secondary channels served a different, previously unrecognized function.',
        questionText: 'What was the primary purpose of the secondary canal network?',
        options: ['A) Flood prevention', 'B) Direct crop hydration', 'C) Sediment collection', 'D) Neighboring trade supply'],
        correctAnswer: 'B) Direct crop hydration',
        explanation: 'The passage implies secondary channels directly served the fields, distinguishing them from primary transport channels.',
    },
    {
        id: 'q4',
        type: 'Matching Headings',
        targetBand: '6.5',
        sourceProvenance: 'Cambridge 17 Test 1',
        passageExcerpt: 'Section B explores the socio-economic impacts of urban green spaces on property values. Studies consistently show that proximity to parks and gardens increases residential prices by 8-20%, with the effect being most pronounced in densely populated metropolitan areas.',
        questionText: 'Choose the correct heading for Section B.',
        correctAnswer: 'vi) Financial dividends of urban foliage',
        explanation: 'Section B discusses economic benefits (property value increases) of urban green spaces.',
    },
];

const ALTERNATE_QUESTIONS: Omit<QuestionItem, 'id' | 'isEditing'>[] = [
    {
        type: 'TFNG',
        targetBand: '6.5',
        sourceProvenance: 'Cambridge 16 Test 2 Passage 2',
        passageExcerpt: 'The invention of the printing press in the 15th century democratized access to knowledge, reducing the cost of book production by over 80% within two decades.',
        questionText: 'The printing press made books cheaper for wealthy merchants first.',
        correctAnswer: 'FALSE',
        explanation: 'The passage states knowledge was democratized, implying broad access, not limited to the wealthy.',
    },
    {
        type: 'Sentence Completion',
        targetBand: '7.0',
        sourceProvenance: 'Past Real Retest (2023)',
        passageExcerpt: 'Marine biologists have discovered that coral reefs exhibit a form of collective memory, allowing them to adapt to temperature changes over successive generations through epigenetic mechanisms.',
        questionText: 'Complete the sentence using NO MORE THAN TWO WORDS: Coral reefs adapt to temperature changes through ________________ mechanisms.',
        correctAnswer: 'epigenetic mechanisms',
        explanation: 'Directly stated in the passage.',
    },
    {
        type: 'Multiple Choice',
        targetBand: '7.5',
        sourceProvenance: 'Cambridge 14 Test 1 Passage 3',
        passageExcerpt: 'Urban planning in Scandinavian cities has prioritized pedestrian infrastructure since the 1970s, resulting in measurable improvements in public health outcomes and community cohesion.',
        questionText: 'What has been the main benefit of Scandinavian pedestrian-first planning?',
        options: ['A) Reduced vehicle emissions', 'B) Improved public health', 'C) Lower construction costs', 'D) Increased tourism revenue'],
        correctAnswer: 'B) Improved public health',
        explanation: 'The passage directly links pedestrian infrastructure to public health improvements.',
    },
];

/* ─── Component ─────────────────────────────────────────────────────── */

const AICoPilotTestAuthor: React.FC = () => {
    const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
    const [filters, setFilters] = useState<FilterState>({
        exam: 'IELTS Academic',
        module: 'Reading',
        targetBand: 'Band 6.5 - 7.0',
        repository: 'All Banks (Verified)',
    });
    const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedCohorts, setSelectedCohorts] = useState<string[]>(['EXEC-BATCH-B']);
    const [testTitle, setTestTitle] = useState('Weekly Reading Diagnostic - Batch B (Sept 2026)');
    const [timeLimit, setTimeLimit] = useState(20);
    const [passingThreshold, setPassingThreshold] = useState(70);
    const [audioExplanation, setAudioExplanation] = useState(true);
    const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
    const [pdfTab, setPdfTab] = useState<'student' | 'teacher'>('student');

    /* ── Computed metrics ── */
    const avgBand = useMemo(() => {
        if (questions.length === 0) return '0.0';
        const sum = questions.reduce((acc, q) => acc + parseFloat(q.targetBand), 0);
        return (sum / questions.length).toFixed(1);
    }, [questions]);

    const typeDistribution = useMemo(() => {
        const counts: Record<string, number> = {};
        questions.forEach((q) => { counts[q.type] = (counts[q.type] || 0) + 1; });
        return counts;
    }, [questions]);

    /* ── Handlers ── */
    const handleGenerate = useCallback(() => {
        if (!naturalLanguageQuery.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            const alt = ALTERNATE_QUESTIONS[questions.length % ALTERNATE_QUESTIONS.length];
            const newQ: QuestionItem = {
                ...alt,
                id: `q-${Date.now()}`,
                isEditing: false,
            };
            setQuestions((prev) => [...prev, newQ]);
            setNaturalLanguageQuery('');
            setIsGenerating(false);
        }, 1500);
    }, [naturalLanguageQuery, questions.length]);

    const handleSwapQuestion = useCallback((id: string) => {
        setQuestions((prev) => prev.map((q) => {
            if (q.id !== id) return q;
            const alt = ALTERNATE_QUESTIONS[Math.floor(Math.random() * ALTERNATE_QUESTIONS.length)];
            return { ...q, type: alt.type, targetBand: alt.targetBand, sourceProvenance: alt.sourceProvenance, passageExcerpt: alt.passageExcerpt, questionText: alt.questionText, options: alt.options, correctAnswer: alt.correctAnswer, explanation: alt.explanation, isEditing: false };
        }));
    }, []);

    const handleRephraseQuestion = useCallback((id: string) => {
        setQuestions((prev) => prev.map((q) => {
            if (q.id !== id) return q;
            return { ...q, questionText: q.questionText + ' (rephrased)' };
        }));
    }, []);

    const handleRemoveQuestion = useCallback((id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    }, []);

    const handleToggleEdit = useCallback((id: string) => {
        setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, isEditing: !q.isEditing } : q));
    }, []);

    const handleSaveEdit = useCallback((id: string, field: keyof QuestionItem, value: string) => {
        setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, [field]: value, isEditing: false } : q));
    }, []);

    const handleCancelEdit = useCallback((id: string) => {
        setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, isEditing: false } : q));
    }, []);

    const handleCohortToggle = useCallback((cohortId: string) => {
        setSelectedCohorts((prev) => prev.includes(cohortId) ? prev.filter((c) => c !== cohortId) : [...prev, cohortId]);
    }, []);

    /* ── Filter select component ── */
    const FilterSelect: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-all"
            >
                {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    /* ── Render ── */
    return (
        <div className="min-h-full bg-[#0B0F17] text-zinc-100 p-6 lg:p-8">
            {/* ── Header / Hero ── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-mono tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Curriculum Asset Pipeline // AI Co-Pilot Test Authoring Studio
                    </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">AI Co-Pilot Test Author</h1>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                    Query authentic past exam items, curate with human-in-the-loop control, and publish zero-hallucination tests in under 2 minutes.
                </p>
            </div>

            {/* ── Natural Language Prompt Builder ── */}
            <div className="backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] mb-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Natural Language Query Builder</span>
                </div>

                <div className="flex gap-3 mb-4">
                    <textarea
                        value={naturalLanguageQuery}
                        onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                        placeholder='e.g. "Generate 3 TFNG questions about environmental science at Band 7.0 from Cambridge series"'
                        rows={2}
                        className="flex-1 bg-zinc-950/70 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner resize-none"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !naturalLanguageQuery.trim()}
                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path d="M12 2a10 10 0 019.95 9" />
                                </svg>
                                Generating…
                            </>
                        ) : (
                            <>⚡ Generate Curated Drill</>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <FilterSelect label="Exam" value={filters.exam} options={EXAM_OPTIONS} onChange={(v) => setFilters((f) => ({ ...f, exam: v }))} />
                    <FilterSelect label="Module" value={filters.module} options={MODULE_OPTIONS} onChange={(v) => setFilters((f) => ({ ...f, module: v }))} />
                    <FilterSelect label="Target Band" value={filters.targetBand} options={BAND_OPTIONS} onChange={(v) => setFilters((f) => ({ ...f, targetBand: v }))} />
                    <FilterSelect label="Repository" value={filters.repository} options={REPO_OPTIONS} onChange={(v) => setFilters((f) => ({ ...f, repository: v }))} />
                </div>
            </div>

            {/* ── Skill Balance & Analytics Bar ── */}
            <div className="backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
                    </svg>
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Skill Balance & Analytics</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/60">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Total Items</p>
                        <p className="text-xl font-bold text-white">{questions.length}</p>
                    </div>
                    <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/60">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Estimated Average Band</p>
                        <p className="text-xl font-bold text-emerald-400">Band {avgBand}</p>
                    </div>
                    <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/60">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Est. Completion Time</p>
                        <p className="text-xl font-bold text-white">{questions.length * 4} Mins</p>
                    </div>
                    <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/60">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Skill Distribution</p>
                        <div className="flex gap-0.5 h-5 rounded-full overflow-hidden mt-1.5">
                            {Object.entries(typeDistribution).map(([type, count]) => (
                                <div
                                    key={type}
                                    className={`${TYPE_DISTRIBUTION_COLORS[type] || 'bg-zinc-600'} rounded-full transition-all duration-300`}
                                    style={{ width: `${(count / questions.length) * 100}%` }}
                                    title={`${type}: ${count}`}
                                />
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(typeDistribution).map(([type, count]) => (
                                <span key={type} className="text-[9px] text-zinc-500 flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${TYPE_DISTRIBUTION_COLORS[type] || 'bg-zinc-600'}`} />
                                    {type} {Math.round((count / questions.length) * 100)}%
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Interactive Question Canvas ── */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Question Canvas</span>
                    <span className="text-[10px] text-zinc-500 ml-auto">{questions.length} items loaded</span>
                </div>

                {questions.length === 0 && (
                    <div className="backdrop-blur-xl bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center">
                        <p className="text-zinc-500 text-sm">No questions yet. Use the Natural Language Query Builder above to generate items.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all duration-200 relative">
                            {/* Card Header */}
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                                <span className="text-[10px] font-mono text-zinc-500 tracking-wider">ITEM {idx + 1} OF {questions.length}</span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[q.type]}`}>{q.type}</span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Band {q.targetBand}</span>
                                <span className="text-[10px] text-zinc-500 flex items-center gap-1 ml-auto">
                                    <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    {q.sourceProvenance}
                                </span>
                            </div>

                            {/* Passage Excerpt */}
                            {q.passageExcerpt && (
                                <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-3 text-xs text-zinc-300 italic font-serif leading-relaxed mb-3">
                                    {q.passageExcerpt}
                                </div>
                            )}

                            {/* Question & Content */}
                            {q.isEditing ? (
                                <div className="space-y-3 mb-3">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">Question Text</label>
                                        <textarea
                                            defaultValue={q.questionText}
                                            id={`edit-q-${q.id}`}
                                            rows={2}
                                            className="w-full bg-zinc-950/70 border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">Passage Excerpt</label>
                                        <textarea
                                            defaultValue={q.passageExcerpt}
                                            id={`edit-p-${q.id}`}
                                            rows={3}
                                            className="w-full bg-zinc-950/70 border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">Correct Answer</label>
                                        <input
                                            defaultValue={q.correctAnswer}
                                            id={`edit-a-${q.id}`}
                                            className="w-full bg-zinc-950/70 border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const qEl = document.getElementById(`edit-q-${q.id}`) as HTMLTextAreaElement;
                                                const pEl = document.getElementById(`edit-p-${q.id}`) as HTMLTextAreaElement;
                                                const aEl = document.getElementById(`edit-a-${q.id}`) as HTMLInputElement;
                                                handleSaveEdit(q.id, 'questionText', qEl?.value ?? q.questionText);
                                                setQuestions((prev) => prev.map((item) => item.id === q.id ? { ...item, passageExcerpt: pEl?.value ?? item.passageExcerpt, correctAnswer: aEl?.value ?? item.correctAnswer } : item));
                                            }}
                                            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-4 py-1.5 rounded-lg text-xs transition-all"
                                        >
                                            Save Edits
                                        </button>
                                        <button
                                            onClick={() => handleCancelEdit(q.id)}
                                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-semibold px-4 py-1.5 rounded-lg text-xs transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <p className="text-sm text-zinc-200 leading-relaxed mb-2">{q.questionText}</p>
                                    {q.options && (
                                        <div className="space-y-1.5 ml-1">
                                            {q.options.map((opt) => (
                                                <p key={opt} className="text-xs text-zinc-400">{opt}</p>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold px-2.5 py-1 rounded-md text-xs">
                                            {q.correctAnswer}
                                        </span>
                                    </div>
                                    {q.explanation && (
                                        <p className="text-[11px] text-zinc-500 mt-2 italic">{q.explanation}</p>
                                    )}
                                </div>
                            )}

                            {/* Action Toolbar */}
                            {!q.isEditing && (
                                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                                    <button
                                        onClick={() => handleToggleEdit(q.id)}
                                        className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-all flex items-center gap-1.5"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit Text
                                    </button>
                                    <button
                                        onClick={() => handleSwapQuestion(q.id)}
                                        className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-all flex items-center gap-1.5"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 4v6h6" /><path d="M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                                        </svg>
                                        AI Swap
                                    </button>
                                    <button
                                        onClick={() => handleRephraseQuestion(q.id)}
                                        className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-all flex items-center gap-1.5"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        Rephrase Item
                                    </button>
                                    <button
                                        onClick={() => handleRemoveQuestion(q.id)}
                                        className="text-[11px] px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 ml-auto"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Teacher Supervision & Cohort Deployment ── */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-5">
                    <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Teacher Supervision & Cohort Deployment</span>
                </div>

                {/* Test Title */}
                <div className="mb-5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 block">Test Title</label>
                    <input
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        className="w-full bg-zinc-950/70 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                </div>

                {/* Cohort Assignment */}
                <div className="mb-5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Cohort Assignment</label>
                    <div className="flex flex-wrap gap-3">
                        {COHORTS.map((cohort) => (
                            <label
                                key={cohort.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                                    selectedCohorts.includes(cohort.id)
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                        : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCohorts.includes(cohort.id)}
                                    onChange={() => handleCohortToggle(cohort.id)}
                                    className="sr-only"
                                />
                                <span className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${
                                    selectedCohorts.includes(cohort.id) ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
                                }`}>
                                    {selectedCohorts.includes(cohort.id) && (
                                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    )}
                                </span>
                                <span className="text-xs font-medium">{cohort.name}</span>
                                <span className="text-[10px] bg-zinc-800/60 text-zinc-500 px-1.5 py-0.5 rounded-full">{cohort.studentCount}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Controls Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 block">Time Limit</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(Number(e.target.value))}
                                className="w-20 bg-zinc-950/70 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                            <span className="text-xs text-zinc-500">Minutes</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 block">Passing Threshold</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={passingThreshold}
                                onChange={(e) => setPassingThreshold(Number(e.target.value))}
                                className="w-20 bg-zinc-950/70 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                            <span className="text-xs text-zinc-500">%</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 block">Audio Explanation</label>
                        <button
                            onClick={() => setAudioExplanation(!audioExplanation)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${audioExplanation ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${audioExplanation ? 'left-[26px]' : 'left-0.5'}`} />
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" />
                        </svg>
                        Save Draft
                    </button>
                    <button
                        onClick={() => setIsPdfPreviewOpen(true)}
                        className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/40 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                        </svg>
                        Preview & Export PDF
                    </button>
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center gap-2 cursor-pointer">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                        Publish Digitally to Cohorts
                    </button>
                </div>
            </div>

            {/* ── PDF Preview Modal ── */}
            {isPdfPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setIsPdfPreviewOpen(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900">Test Preview</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setPdfTab('student')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${pdfTab === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Student Question Paper
                                    </button>
                                    <button
                                        onClick={() => setPdfTab('teacher')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${pdfTab === 'teacher' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Teacher Answer Key
                                    </button>
                                </div>
                                <button onClick={() => setIsPdfPreviewOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {pdfTab === 'student' ? (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-xl font-bold text-slate-900">{testTitle}</h2>
                                        <p className="text-sm text-slate-500 mt-1">Time Limit: {timeLimit} minutes | Total Questions: {questions.length}</p>
                                    </div>
                                    {questions.map((q, idx) => (
                                        <div key={q.id} className="border border-slate-200 rounded-xl p-4">
                                            <p className="text-sm font-semibold text-slate-900 mb-2">Question {idx + 1} <span className="text-slate-400 font-normal">({q.type} — Band {q.targetBand})</span></p>
                                            <p className="text-sm text-slate-700 leading-relaxed">{q.questionText}</p>
                                            {q.options && (
                                                <div className="mt-2 space-y-1">
                                                    {q.options.map((opt) => (
                                                        <p key={opt} className="text-sm text-slate-600">{opt}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-xl font-bold text-slate-900">Answer Key & Explanations</h2>
                                        <p className="text-sm text-slate-500 mt-1">{testTitle}</p>
                                    </div>
                                    {questions.map((q, idx) => (
                                        <div key={q.id} className="border border-slate-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-semibold text-slate-900">Question {idx + 1}</span>
                                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{q.correctAnswer}</span>
                                            </div>
                                            <p className="text-sm text-slate-700">{q.questionText}</p>
                                            {q.explanation && (
                                                <p className="text-xs text-slate-500 mt-2 italic">{q.explanation}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
                            <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
                                </svg>
                                Download Printable PDF (.pdf)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AICoPilotTestAuthor;
