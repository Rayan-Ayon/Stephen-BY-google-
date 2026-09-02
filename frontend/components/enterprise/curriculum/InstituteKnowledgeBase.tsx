import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface ParsedRule {
    id: string;
    chapter: string;
    page: number;
    ruleTitle: string;
    sampleTrigger: string;
    aiFeedbackPreview: string;
}

interface KnowledgeBook {
    id: string;
    title: string;
    category: 'Writing Rules' | 'Answer Keys' | 'Grammar Rules' | 'Lexical Store';
    chunks: number;
    status: 'active' | 'vectorizing' | 'encrypted' | 'paused';
    vectorProgress?: number;
    priority: 'High (Overrides Base)' | 'Medium' | 'Standard';
    lastUpdated: string;
    fileSize: string;
    parsedRules: ParsedRule[];
}

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const INITIAL_BOOKS: KnowledgeBook[] = [
    {
        id: 'book-1',
        title: 'Mentors_IELTS_Writing_Guide.pdf',
        category: 'Writing Rules',
        chunks: 4200,
        status: 'active',
        priority: 'High (Overrides Base)',
        lastUpdated: '2026-08-28',
        fileSize: '18.4 MB',
        parsedRules: [
            {
                id: 'rule-1',
                chapter: 'Chapter 2',
                page: 14,
                ruleTitle: 'Task 2 Introduction Formatting',
                sampleTrigger: 'Student writes a Task 2 introduction with a generic paraphrase',
                aiFeedbackPreview: 'Your introduction lacks a clear thesis statement. A Band 7+ introduction should present a precise position in the second sentence. Refer to the Mentors Writing Guide, Page 14, for the 3-part thesis formula.',
            },
            {
                id: 'rule-2',
                chapter: 'Chapter 4',
                page: 38,
                ruleTitle: 'Overused Transitions List',
                sampleTrigger: 'Student uses "Furthermore" and "Moreover" in consecutive sentences',
                aiFeedbackPreview: "Your essay relies on generic memorized templates. Examiners penalize repetitive connectors. Replace 'Furthermore' with a discourse marker like 'In addition to this' or 'Building on that'. 📌 Reference: Mentors Writing Guide, Page 38",
            },
        ],
    },
    {
        id: 'book-2',
        title: 'Cambridge_18_Official_Answers.pdf',
        category: 'Answer Keys',
        chunks: 1420,
        status: 'encrypted',
        priority: 'Standard',
        lastUpdated: '2026-07-15',
        fileSize: '6.2 MB',
        parsedRules: [],
    },
    {
        id: 'book-3',
        title: 'Executive_Grammar_Mastery_v2.pdf',
        category: 'Grammar Rules',
        chunks: 8630,
        status: 'vectorizing',
        vectorProgress: 84,
        priority: 'High (Overrides Base)',
        lastUpdated: '2026-09-01',
        fileSize: '24.1 MB',
        parsedRules: [],
    },
    {
        id: 'book-4',
        title: 'Task1_Chart_Vocabulary_2026.pdf',
        category: 'Lexical Store',
        chunks: 420,
        status: 'active',
        priority: 'Medium',
        lastUpdated: '2026-08-20',
        fileSize: '2.8 MB',
        parsedRules: [],
    },
];

const CATEGORIES = ['Writing Rules', 'Answer Keys', 'Grammar Rules', 'Lexical Store'] as const;
const PRIORITIES = ['High (Overrides Base)', 'Medium', 'Standard'] as const;
const STRICTNESS_OPTIONS = ['High (Direct Book Match)', 'Balanced (Semantic Match)', 'Flexible (General Alignment)'] as const;

/* ─── Inline SVG Icons ──────────────────────────────────────────────── */

const UploadTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <polyline points="7 9 12 4 17 9" />
        <line x1="12" y1="4" x2="12" y2="16" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
);

const SyncIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
    </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const InspectIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
    </svg>
);

const ReindexIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
    </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/* ─── Toast ──────────────────────────────────────────────────────────── */

const InlineToast: React.FC<{ message: string; onDone: () => void }> = ({ message, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 3200);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-zinc-950 font-bold px-5 py-3 rounded-xl text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in fade-in slide-in-from-bottom-2">
            {message}
        </div>
    );
};

/* ─── Main Component ────────────────────────────────────────────────── */

const InstituteKnowledgeBase: React.FC = () => {
    const [books, setBooks] = useState<KnowledgeBook[]>(INITIAL_BOOKS);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadCategory, setUploadCategory] = useState<string>(CATEGORIES[0]);
    const [uploadPriority, setUploadPriority] = useState<string>(PRIORITIES[0]);
    const [strictnessMargin, setStrictnessMargin] = useState<string>(STRICTNESS_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [reindexingId, setReindexingId] = useState<string | null>(null);
    const [reindexProgress, setReindexProgress] = useState(0);
    const [fadingOutId, setFadingOutId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Drag handlers ── */
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const addMockBook = useCallback(() => {
        const id = `book-${Date.now()}`;
        const newBook: KnowledgeBook = {
            id,
            title: `Uploaded_Curriculum_${books.length + 1}.pdf`,
            category: uploadCategory as KnowledgeBook['category'],
            chunks: 0,
            status: 'vectorizing',
            vectorProgress: 0,
            priority: uploadPriority as KnowledgeBook['priority'],
            lastUpdated: new Date().toISOString().split('T')[0],
            fileSize: `${(Math.random() * 20 + 1).toFixed(1)} MB`,
            parsedRules: [],
        };
        setBooks(prev => [newBook, ...prev]);
    }, [books.length, uploadCategory, uploadPriority]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        addMockBook();
    }, [addMockBook]);

    const handleBrowseClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileInput = useCallback(() => {
        addMockBook();
    }, [addMockBook]);

    /* ── Vectorizing progress animation ── */
    useEffect(() => {
        const intervals: ReturnType<typeof setInterval>[] = [];
        books.forEach(b => {
            if (b.status === 'vectorizing' && b.vectorProgress !== undefined && b.vectorProgress < 100) {
                const iv = setInterval(() => {
                    setBooks(prev => prev.map(book => {
                        if (book.id !== b.id || book.status !== 'vectorizing') return book;
                        const next = Math.min((book.vectorProgress ?? 0) + Math.floor(Math.random() * 3) + 1, 100);
                        if (next >= 100) {
                            return { ...book, vectorProgress: 100, status: 'active', chunks: book.chunks > 0 ? book.chunks : Math.floor(Math.random() * 3000) + 500 };
                        }
                        return { ...book, vectorProgress: next };
                    }));
                }, 400);
                intervals.push(iv);
            }
        });
        return () => intervals.forEach(clearInterval);
    }, [books]);

    /* ── Re-index simulation ── */
    const handleReindex = useCallback((bookId: string) => {
        setReindexingId(bookId);
        setReindexProgress(0);
        let progress = 0;
        const iv = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress >= 100) {
                clearInterval(iv);
                setReindexProgress(100);
                setTimeout(() => {
                    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: 'vectorizing', vectorProgress: 0 } : b));
                    setReindexingId(null);
                    setReindexProgress(0);
                }, 300);
            } else {
                setReindexProgress(progress);
            }
        }, 300);
    }, []);

    /* ── Pause / Resume ── */
    const handlePauseResume = useCallback((bookId: string) => {
        setBooks(prev => prev.map(b => {
            if (b.id !== bookId) return b;
            if (b.status === 'vectorizing') return { ...b, status: 'paused' as const, _prevProgress: b.vectorProgress };
            if (b.status === 'paused') return { ...b, status: 'vectorizing' as const, vectorProgress: (b as any)._prevProgress ?? 0 };
            return b;
        }));
    }, []);

    /* ── Purge ── */
    const handlePurge = useCallback((bookId: string) => {
        setFadingOutId(bookId);
        setTimeout(() => {
            setBooks(prev => prev.filter(b => b.id !== bookId));
            setFadingOutId(null);
            if (selectedBookId === bookId) setSelectedBookId(null);
        }, 300);
    }, [selectedBookId]);

    /* ── Sync ── */
    const handleSync = useCallback(() => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setToastMessage('Knowledge Base synced across 12 active Co-Pilots!');
        }, 2000);
    }, []);

    /* ── Save ── */
    const handleSave = useCallback(() => {
        setToastMessage('Grounding parameters saved to IELTS-Eval-v4 vector engine.');
    }, []);

    /* ── Filtered books ── */
    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedBook = books.find(b => b.id === selectedBookId) ?? null;

    /* ── Telemetry metrics ── */
    const activeBooks = books.filter(b => b.status === 'active').length;
    const vectorizingBooks = books.filter(b => b.status === 'vectorizing').length;
    const totalChunks = books.reduce((sum, b) => sum + b.chunks, 0);

    /* ── Status badge helper ── */
    const renderStatusBadge = (book: KnowledgeBook) => {
        switch (book.status) {
            case 'active':
                return (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        ACTIVE CONTEXT
                    </span>
                );
            case 'vectorizing':
                return (
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1.5 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        VECTORIZING ({book.vectorProgress ?? 0}%)
                    </span>
                );
            case 'encrypted':
                return (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        ENCRYPTED & MAPPED
                    </span>
                );
            case 'paused':
                return (
                    <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                        PAUSED
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {toastMessage && <InlineToast message={toastMessage} onDone={() => setToastMessage(null)} />}
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.json" onChange={handleFileInput} />

            {/* ════════════════════════════════════════════════════════════
                SECTION A: HERO HEADER & SYSTEM TELEMETRY STRIP
            ════════════════════════════════════════════════════════════ */}
            <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        KNOWLEDGE BASE INFRASTRUCTURE
                    </span>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">CUSTOM CURRICULUM &amp; QUESTION STORES</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                    Upload proprietary coaching books and PDF guides to ground AI Evaluator feedback in your exact curriculum.
                </p>

                <div className="grid grid-cols-4 gap-4 mt-5">
                    {/* Active Context Injection */}
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4">
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Active Context Injection</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-emerald-400">ENABLED</span>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                    </div>
                    {/* Embedded Books */}
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4">
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Embedded Books</p>
                        <p className="text-sm font-bold text-white">{activeBooks} Active / {vectorizingBooks} Indexing</p>
                    </div>
                    {/* Total Vector Chunks */}
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4">
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Total Vector Chunks</p>
                        <p className="text-sm font-bold text-white">{totalChunks.toLocaleString()} Chunks</p>
                    </div>
                    {/* RAG Engine Version */}
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4">
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">RAG Engine Version</p>
                        <p className="text-sm font-bold text-white font-mono">IELTS-Eval-v4 <span className="text-zinc-500 text-xs">(Local Node)</span></p>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                SECTION B: DRAG & DROP BOOK INGESTION ZONE
            ════════════════════════════════════════════════════════════ */}
            <div
                className={`bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                    isDragging
                        ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
                        : 'border-zinc-700/60 hover:border-zinc-600'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
            >
                <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                        <UploadTrayIcon className={`w-12 h-12 ${isDragging ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                        DRAG &amp; DROP COACHING BOOKS OR PDF GUIDES HERE TO TRAIN AI
                    </h3>
                    <p className="text-xs text-zinc-500 mb-5">
                        Supported formats: PDF, DOCX, JSON (Max file size: 100MB per book)
                    </p>

                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={handleBrowseClick}
                            className="bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/60 rounded-lg px-4 py-2 text-xs font-medium transition-all flex items-center gap-2"
                        >
                            <FolderIcon className="w-3.5 h-3.5" />
                            Browse Local Files
                        </button>

                        <div className="relative">
                            <select
                                value={uploadCategory}
                                onChange={e => setUploadCategory(e.target.value)}
                                className="bg-zinc-950/70 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-100 appearance-none pr-7 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDownIcon className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={uploadPriority}
                                onChange={e => setUploadPriority(e.target.value)}
                                className="bg-zinc-950/70 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-100 appearance-none pr-7 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            >
                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <ChevronDownIcon className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                SECTION C: PROPRIETARY REPOSITORY & VECTOR PIPELINE TABLE
            ════════════════════════════════════════════════════════════ */}
            <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Proprietary Repository &amp; Vector Pipeline</h3>
                    <div className="relative">
                        <SearchIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search books or categories..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-zinc-950/70 border border-zinc-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64"
                        />
                    </div>
                </div>

                <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">File / Book Title</th>
                                <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Category</th>
                                <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Chunks</th>
                                <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Status</th>
                                <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map(book => (
                                <tr
                                    key={book.id}
                                    className={`border-b border-zinc-800 last:border-b-0 transition-all duration-300 ${
                                        fadingOutId === book.id ? 'opacity-0' : 'opacity-100'
                                    } ${
                                        selectedBookId === book.id
                                            ? 'border-l-4 border-emerald-500 bg-zinc-800/40'
                                            : 'hover:bg-zinc-800/20'
                                    }`}
                                >
                                    <td className="px-5 py-4">
                                        <span className="text-white font-medium font-mono text-[11px]">{book.title}</span>
                                        {book.status === 'vectorizing' && book.vectorProgress !== undefined && (
                                            <div className="mt-1.5 w-full max-w-[200px]">
                                                <div className="bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-1.5 rounded-full animate-pulse transition-all duration-300"
                                                        style={{ width: `${book.vectorProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-[10px] text-zinc-600 mt-1">{book.fileSize} · Updated {book.lastUpdated}</p>
                                    </td>
                                    <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">{book.category}</td>
                                    <td className="px-5 py-4 text-zinc-400 font-mono">{book.chunks.toLocaleString()}</td>
                                    <td className="px-5 py-4">
                                        {book.status === 'vectorizing' && reindexingId === book.id
                                            ? (
                                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1.5 animate-pulse">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                                    RE-INDEXING ({reindexProgress}%)
                                                </span>
                                            )
                                            : renderStatusBadge(book)
                                        }
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedBookId(selectedBookId === book.id ? null : book.id)}
                                                className="text-[10px] font-medium text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                                            >
                                                <InspectIcon className="w-3 h-3" />
                                                Inspect
                                            </button>
                                            <button
                                                onClick={() => handleReindex(book.id)}
                                                disabled={reindexingId === book.id}
                                                className="text-[10px] font-medium text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-1 disabled:opacity-30"
                                            >
                                                <ReindexIcon className="w-3 h-3" />
                                                Re-index
                                            </button>
                                            {(book.status === 'vectorizing' || book.status === 'paused') && (
                                                <button
                                                    onClick={() => handlePauseResume(book.id)}
                                                    className="text-[10px] font-medium text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                                                >
                                                    {book.status === 'vectorizing'
                                                        ? <><PauseIcon className="w-3 h-3" /> Pause</>
                                                        : <><PlayIcon className="w-3 h-3" /> Resume</>
                                                    }
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handlePurge(book.id)}
                                                className="text-[10px] font-medium text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
                                            >
                                                <TrashIcon className="w-3 h-3" />
                                                Purge
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBooks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-zinc-600 text-xs">
                                        No books match your search query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                SECTION D: REAL-TIME RULE MAPPING & LIVE EVALUATOR SIMULATOR
            ════════════════════════════════════════════════════════════ */}
            {selectedBook && (
                <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                Real-Time Rule Mapping &amp; Inspector Preview
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1">
                                Selected: <span className="text-emerald-400 font-mono">{selectedBook.title}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedBookId(null)}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Left Column: Parsed Rule Index */}
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Parsed Rule Index (Auto-Extracted)</h4>
                                <div className="relative">
                                    <select
                                        value={strictnessMargin}
                                        onChange={e => setStrictnessMargin(e.target.value)}
                                        className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-[10px] text-zinc-300 appearance-none pr-6 focus:outline-none focus:border-emerald-500 transition-all"
                                    >
                                        {STRICTNESS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    <ChevronDownIcon className="w-3 h-3 text-zinc-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            {selectedBook.parsedRules.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedBook.parsedRules.map(rule => (
                                        <RuleCard key={rule.id} rule={rule} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                                        <SearchIcon className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <p className="text-xs text-zinc-500">No rules parsed yet for this book.</p>
                                    <p className="text-[10px] text-zinc-600 mt-1">Run a full re-index to extract curriculum rules.</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Live Evaluator Behavior Simulation */}
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-5">
                            <h4 className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-4">Live Evaluator Behavior Simulation</h4>

                            {selectedBook.parsedRules.length > 0 ? (
                                <SimulationPreview book={selectedBook} strictness={strictnessMargin} />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                                        <span className="text-lg">🤖</span>
                                    </div>
                                    <p className="text-xs text-zinc-500">Select a rule from the left to simulate evaluator behavior.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                SECTION E: GLOBAL SYNC & CONFIGURATION BAR
            ════════════════════════════════════════════════════════════ */}
            <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-center justify-between sticky bottom-4 z-40">
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/60 rounded-lg px-5 py-2.5 text-xs font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isSyncing ? (
                        <>
                            <span className="h-3.5 w-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <SyncIcon className="w-3.5 h-3.5" />
                            SYNC KNOWLEDGE BASE TO ALL TEACHER CO-PILOTS
                        </>
                    )}
                </button>

                <button
                    onClick={handleSave}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                    <SaveIcon className="w-3.5 h-3.5" />
                    SAVE GROUNDING CONFIGURATION
                </button>
            </div>
        </div>
    );
};

/* ─── Sub-components ────────────────────────────────────────────────── */

const RuleCard: React.FC<{ rule: ParsedRule }> = ({ rule }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`border rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                hovered
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-medium text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                    {rule.chapter}, Page {rule.page}
                </span>
            </div>
            <p className="text-xs font-semibold text-white mb-1">{rule.ruleTitle}</p>
            <p className="text-[10px] text-zinc-500 leading-relaxed">Trigger: {rule.sampleTrigger}</p>
        </div>
    );
};

const SimulationPreview: React.FC<{ book: KnowledgeBook; strictness: string }> = ({ book, strictness }) => {
    const [activeRule, setActiveRule] = useState<ParsedRule | null>(book.parsedRules[0] ?? null);

    useEffect(() => {
        setActiveRule(book.parsedRules[0] ?? null);
    }, [book.id, book.parsedRules]);

    const matchedRule = activeRule ?? book.parsedRules[0];

    return (
        <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">Mock Scenario</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                    When a student makes a <span className="text-amber-400 font-semibold">"{matchedRule?.ruleTitle}"</span> error:
                </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-mono text-zinc-300 leading-relaxed">
                <p className="text-zinc-500 mb-2">{'>'} AI_Evaluator.generate_feedback(</p>
                <p className="pl-4">error_type = "{matchedRule?.ruleTitle}",</p>
                <p className="pl-4">strictness = "{strictness}",</p>
                <p className="pl-4">source_book = "{book.title}"</p>
                <p className="text-zinc-500 mt-2">{'>'} )</p>
                <div className="mt-3 pt-3 border-t border-zinc-800">
                    <p className="text-zinc-300">{matchedRule?.aiFeedbackPreview}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-1 text-[10px] font-medium flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    📌 Reference: {book.title.replace('.pdf', '').replace(/_/g, ' ')}, Page {matchedRule?.page} ({matchedRule?.chapter})
                </span>
            </div>
        </div>
    );
};

export default InstituteKnowledgeBase;
