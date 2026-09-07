import React, { useState, useMemo } from 'react';
import IELTSSimulationRunner from './enterprise/ielts/IELTSSimulationRunner';

/* ─── Types ─── */
interface MockBook {
    id: string;
    bookNumber: number | string;
    title: string;
    subtitle: string;
    testCount: number;
    category: 'cambridge' | 'mock_series';
    type: 'academic' | 'general';
    isFeatured?: boolean;
}

interface FullMockTestHubProps {
    userEmail?: string;
    onNavigate?: (viewKey: string) => void;
}

type ViewMode = 'overview' | 'library' | 'book_tests' | 'guidelines';

/* ─── Data Constants ─── */
const ACADEMIC_BOOKS: MockBook[] = [
    { id: 'cambridge-7-ac', bookNumber: 7, title: 'Cambridge IELTS', subtitle: 'The best place to begin your Cambridge practice', testCount: 4, category: 'cambridge', type: 'academic', isFeatured: true },
    ...Array.from({ length: 14 }, (_, i) => ({
        id: `cambridge-${i + 8}-ac`,
        bookNumber: i + 8,
        title: 'Cambridge IELTS',
        subtitle: '4-section test',
        testCount: (i + 8) === 15 ? 3 : 4,
        category: 'cambridge' as const,
        type: 'academic' as const,
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
        id: `mock-series-${i + 1}`,
        bookNumber: i + 1,
        title: 'IELTSly Mock Series',
        subtitle: '4-section test',
        testCount: 4,
        category: 'mock_series' as const,
        type: 'academic' as const,
    })),
];

const GT_BOOKS: MockBook[] = [
    { id: 'cambridge-7-gt', bookNumber: 7, title: 'Cambridge IELTS', subtitle: 'The best place to begin your Cambridge practice', testCount: 2, category: 'cambridge', type: 'general', isFeatured: true },
    { id: 'cambridge-8-gt', bookNumber: 8, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 2, category: 'cambridge', type: 'general' },
    { id: 'cambridge-9-gt', bookNumber: 9, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 2, category: 'cambridge', type: 'general' },
    { id: 'cambridge-10-gt', bookNumber: 10, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 2, category: 'cambridge', type: 'general' },
    { id: 'cambridge-11-gt', bookNumber: 11, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
    { id: 'cambridge-12-gt', bookNumber: 12, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
    { id: 'cambridge-13-gt', bookNumber: 13, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
    { id: 'cambridge-14-gt', bookNumber: 14, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
    { id: 'cambridge-15-gt', bookNumber: 15, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 3, category: 'cambridge', type: 'general' },
    { id: 'cambridge-16-gt', bookNumber: 16, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
    { id: 'cambridge-17-gt', bookNumber: 17, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
    { id: 'cambridge-18-gt', bookNumber: 18, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
    { id: 'cambridge-19-gt', bookNumber: 19, title: 'Cambridge IELTS', subtitle: '4-section test', testCount: 4, category: 'cambridge', type: 'general' },
];

const SKILL_PILLS = [
    { icon: '🎧', label: 'Listening', duration: '40 min', color: 'emerald' },
    { icon: '📖', label: 'Reading', duration: '60 min', color: 'blue' },
    { icon: '✍️', label: 'Writing', duration: '60 min', color: 'amber' },
    { icon: '🎙️', label: 'Speaking', duration: '~15 min', color: 'purple' },
];

const SECTION_DURATION_ITEMS = [
    { icon: '🎧', label: 'Listening', duration: '40 min', borderColor: 'border-emerald-950/60' },
    { icon: '📖', label: 'Reading', duration: '60 min', borderColor: 'border-blue-950/60' },
    { icon: '✍️', label: 'Writing', duration: '60 min', borderColor: 'border-amber-950/60' },
    { icon: '🎙️', label: 'Speaking', duration: '~15 min', borderColor: 'border-purple-950/60' },
];

/* ─── Main Component ─── */
const FullMockTestHub: React.FC<FullMockTestHubProps> = ({ userEmail, onNavigate }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('overview');
    const [activeTab, setActiveTab] = useState<'academic' | 'general'>('academic');
    const [selectedBook, setSelectedBook] = useState<MockBook | null>(null);
    const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);
    const [showExam, setShowExam] = useState<boolean>(false);

    const books = useMemo(() => activeTab === 'academic' ? ACADEMIC_BOOKS : GT_BOOKS, [activeTab]);
    const totalTests = useMemo(() => books.reduce((sum, b) => sum + b.testCount, 0), [books]);
    const totalHours = useMemo(() => `${Math.round(totalTests * 2.75)}h`, [totalTests]);

    const featuredBook = useMemo(() => books.find(b => b.isFeatured), [books]);
    const gridBooks = useMemo(() => books.filter(b => !b.isFeatured), [books]);

    const openBookTests = (book: MockBook) => {
        setSelectedBook(book);
        setViewMode('book_tests');
    };

    const openGuidelines = (testIdx: number) => {
        setSelectedTestIndex(testIdx);
        setViewMode('guidelines');
    };

    const handleLaunchExam = () => {
        if (selectedBook) {
            sessionStorage.setItem('full_exam_book', selectedBook.id);
            sessionStorage.setItem('full_exam_test_index', String(selectedTestIndex));
            sessionStorage.setItem('full_exam_type', activeTab);
        }
        setShowExam(true);
    };

    /* ─── Exam Mode ─── */
    if (showExam) {
        return (
            <div className="h-[calc(100vh-32px)] bg-[#F2F2F2] flex flex-col overflow-hidden">
                <div className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center gap-4">
                    <button
                        onClick={() => setShowExam(false)}
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                        ← Back to Mock Test Hub
                    </button>
                    <span className="text-sm text-zinc-500">
                        {selectedBook?.category === 'mock_series'
                            ? `${selectedBook.title} ${selectedBook.bookNumber}`
                            : `${selectedBook?.title} ${selectedBook?.bookNumber}`} – Test {selectedTestIndex + 1}
                    </span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <IELTSSimulationRunner
                        bundleId="mock"
                        candidateEmail={userEmail}
                        onFinish={() => setShowExam(false)}
                        onActiveChange={() => {}}
                        exitPulse={false}
                    />
                </div>
            </div>
        );
    }

    /* ─── VIEW: Overview ─── */
    if (viewMode === 'overview') {
        return (
            <div className="min-h-screen bg-[#0B0C0E] p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">Mock Tests</h1>
                        <p className="text-xs text-zinc-400 mt-1">Practice individual skills or take a full 4-section mock test</p>
                    </div>

                    {/* Full Mock Test Hero Card */}
                    <div className="relative bg-[#141519] border border-zinc-800/80 rounded-3xl p-8 overflow-hidden mb-8">
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            {/* Top Badge */}
                            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                                ⚡ COMPREHENSIVE ASSESSMENT
                            </span>

                            {/* Headline */}
                            <h2 className="text-4xl font-extrabold text-white mt-4 tracking-tight">Full Mock Test</h2>
                            <p className="text-zinc-300 text-sm max-w-lg mt-2 leading-relaxed">
                                Simulate the real IELTS exam with all 4 sections in sequence. AI grading and band scores instantly.
                            </p>

                            {/* Skill Pill Tags */}
                            <div className="flex gap-2.5 mt-5 flex-wrap">
                                {SKILL_PILLS.map(pill => (
                                    <span key={pill.label} className={`bg-${pill.color}-950/60 border border-${pill.color}-500/30 text-${pill.color}-300 text-xs px-3 py-1.5 rounded-full font-medium`}>
                                        {pill.icon} {pill.label} · {pill.duration}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => setViewMode('library')}
                                className="mt-7 bg-white hover:bg-zinc-100 text-black font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                            >
                                ► Start Full Test
                            </button>
                        </div>
                    </div>

                    {/* Practice by Skill */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Practice by Skill</h3>
                                <p className="text-xs text-zinc-400 mt-1">Focus on individual sections to improve your weak areas</p>
                            </div>
                            <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-md">4 sections</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Writing */}
                            <button
                                onClick={() => onNavigate?.('writing_lab')}
                                className="bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer text-left"
                            >
                                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium text-sm">Writing</h4>
                                    <p className="text-zinc-500 text-xs mt-0.5">Not tested</p>
                                </div>
                                <span className="text-zinc-500 text-xs">band score →</span>
                            </button>

                            {/* Speaking */}
                            <button
                                onClick={() => onNavigate?.('speaking_studio')}
                                className="bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer text-left"
                            >
                                <div className="bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium text-sm">Speaking</h4>
                                    <p className="text-zinc-500 text-xs mt-0.5">Not tested</p>
                                </div>
                                <span className="text-zinc-500 text-xs">band score →</span>
                            </button>

                            {/* Reading */}
                            <button
                                onClick={() => onNavigate?.('reading_hub')}
                                className="bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer text-left"
                            >
                                <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium text-sm">Reading</h4>
                                    <p className="text-zinc-500 text-xs mt-0.5">Not tested</p>
                                </div>
                                <span className="text-zinc-500 text-xs">band score →</span>
                            </button>

                            {/* Listening */}
                            <button
                                onClick={() => onNavigate?.('listening_engine')}
                                className="bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer text-left"
                            >
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 10a1 1 0 011-1h1a1 1 0 011 1v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-4z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium text-sm">Listening</h4>
                                    <p className="text-zinc-500 text-xs mt-0.5">Not tested</p>
                                </div>
                                <span className="text-zinc-500 text-xs">band score →</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ─── VIEW: Library ─── */
    if (viewMode === 'library') {
        return (
            <div className="min-h-screen bg-[#0B0C0E] p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                            {activeTab === 'academic' ? 'CAMBRIDGE IELTS ACADEMIC' : 'CAMBRIDGE IELTS GENERAL TRAINING'}
                        </span>
                        <button
                            onClick={() => setViewMode('overview')}
                            className="flex items-center gap-2 text-xl font-bold text-white mt-1 hover:text-zinc-300 transition-colors"
                        >
                            ← Full Mock Test Library
                        </button>
                        <p className="text-xs text-zinc-400 mt-1">Complete 4-section IELTS practice tests — Listening, Reading, Writing & Speaking</p>
                    </div>

                    {/* Tab Switcher & Skill Pills */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        <div className="bg-[#141519] border border-zinc-800 p-1 rounded-2xl inline-flex gap-1">
                            <button
                                onClick={() => setActiveTab('academic')}
                                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'academic' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                Academic
                            </button>
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'general' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                General Training
                            </button>
                        </div>

                        <div className="flex gap-2.5 flex-wrap">
                            {SKILL_PILLS.map(pill => (
                                <span key={pill.label} className={`bg-${pill.color}-950/60 border border-${pill.color}-500/30 text-${pill.color}-300 text-xs px-3 py-1.5 rounded-full font-medium`}>
                                    {pill.icon} {pill.label} · {pill.duration}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats Banner */}
                    <div className="bg-[#141519] border border-zinc-800 rounded-2xl p-6 grid grid-cols-3 divide-x divide-zinc-800 mb-6">
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">{books.length}</div>
                            <div className="text-xs text-zinc-400 mt-1">Cambridge Books</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">{totalTests}</div>
                            <div className="text-xs text-zinc-400 mt-1">Full Mock Tests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">{totalHours}</div>
                            <div className="text-xs text-zinc-400 mt-1">Hours of Content</div>
                        </div>
                    </div>

                    {/* Featured Book 7 Hero Card */}
                    {featuredBook && (
                        <div className="bg-[#141519] border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex items-center justify-between mb-8">
                            <div className="flex items-center gap-8">
                                <div>
                                    <span className="text-xs tracking-widest text-zinc-500 font-bold">BOOK</span>
                                    <div className="text-6xl font-black text-white leading-none mt-1">{featuredBook.bookNumber}</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider uppercase">START HERE</span>
                                        <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                            {featuredBook.testCount} Tests
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mt-2">{featuredBook.title}</h3>
                                    <p className="text-sm text-zinc-400 mt-1">{featuredBook.subtitle}</p>
                                    <div className="flex gap-2 mt-3">
                                        {['🎧', '📖', '✍️', '🎙️'].map(icon => (
                                            <span key={icon} className="bg-zinc-800/80 border border-zinc-700/50 p-2 rounded-full text-xs">{icon}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-zinc-400 mb-3">⏱ ~{featuredBook.testCount * 41} min | 📈 0/{featuredBook.testCount} done</div>
                                <button
                                    onClick={() => openBookTests(featuredBook)}
                                    className="bg-white hover:bg-zinc-100 text-black font-bold text-sm px-6 py-2.5 rounded-full cursor-pointer flex items-center gap-1.5 transition-all"
                                >
                                    View Tests →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* All Books Divider */}
                    <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-4 my-6 before:h-px before:flex-1 before:bg-zinc-800 after:h-px after:flex-1 after:bg-zinc-800">
                        ALL BOOKS
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {gridBooks.map(book => (
                            <button
                                key={book.id}
                                onClick={() => openBookTests(book)}
                                className="bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer flex flex-col justify-between transition-all hover:scale-[1.01] text-left"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-xs tracking-widest text-zinc-500 font-bold">BOOK</span>
                                            <div className="text-3xl font-black text-white leading-none mt-1">{book.bookNumber}</div>
                                        </div>
                                        <span className="bg-zinc-800/80 text-zinc-400 text-xs px-2 py-0.5 rounded-md font-semibold">
                                            {book.testCount}T
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mt-3">{book.title}</h4>
                                    <p className="text-xs text-zinc-500 mt-0.5">{book.subtitle}</p>
                                    <div className="flex gap-1.5 mt-3">
                                        {['🎧', '📖', '✍️', '🎙️'].map(icon => (
                                            <span key={icon} className="bg-zinc-800/60 border border-zinc-700/40 p-1.5 rounded-full text-[10px]">{icon}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-xs text-zinc-500 mt-4">📈 0/{book.testCount} done</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ─── VIEW: Book Tests ─── */
    if (viewMode === 'book_tests' && selectedBook) {
        const bookTitle = selectedBook.category === 'mock_series'
            ? `${selectedBook.title} ${selectedBook.bookNumber}`
            : activeTab === 'general' && Number(selectedBook.bookNumber) <= 10
                ? `Cambridge IELTS ${selectedBook.bookNumber} GT`
                : `Cambridge IELTS ${selectedBook.bookNumber}`;
        const durationMin = selectedBook.testCount * 41;

        return (
            <div className="min-h-screen bg-[#0B0C0E] p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                            {activeTab === 'academic' ? 'CAMBRIDGE IELTS ACADEMIC' : 'CAMBRIDGE IELTS GENERAL TRAINING'}
                        </span>
                        <button
                            onClick={() => setViewMode('library')}
                            className="flex items-center gap-2 text-xl font-bold text-white mt-1 hover:text-zinc-300 transition-colors"
                        >
                            ← {selectedBook.category === 'mock_series' ? 'IELTSly Mock Series' : 'Cambridge IELTS'}
                        </button>
                        <p className="text-xs text-zinc-400 mt-1">Select a test to begin your full IELTS practice</p>
                    </div>

                    {/* Skill Legend */}
                    <div className="flex gap-2.5 flex-wrap mb-6">
                        {SKILL_PILLS.map(pill => (
                            <span key={pill.label} className={`bg-${pill.color}-950/60 border border-${pill.color}-500/30 text-${pill.color}-300 text-xs px-3 py-1.5 rounded-full font-medium`}>
                                {pill.icon} {pill.label}
                            </span>
                        ))}
                    </div>

                    {/* Book Title Block */}
                    <div className="mb-6">
                        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                            {activeTab === 'academic' ? 'CAMBRIDGE IELTS ACADEMIC' : 'CAMBRIDGE IELTS GENERAL TRAINING'}
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-1">{bookTitle}</h2>
                        <p className="text-sm text-zinc-400 mt-1">
                            {selectedBook.testCount} full mock tests · 4 sections · ~{durationMin} min each
                        </p>
                    </div>

                    {/* Section Duration Bar */}
                    <div className="grid grid-cols-4 gap-4 my-6">
                        {SECTION_DURATION_ITEMS.map(item => (
                            <div key={item.label} className={`bg-[#141519] border ${item.borderColor} p-4 rounded-xl text-center`}>
                                <div className="text-lg mb-1">{item.icon}</div>
                                <div className="text-xs font-semibold text-zinc-300">{item.label}</div>
                                <div className="text-[10px] text-zinc-500 mt-0.5">{item.duration}</div>
                            </div>
                        ))}
                    </div>

                    {/* Test Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: selectedBook.testCount }, (_, i) => {
                            const testNum = i + 1;
                            const isStartHere = testNum === 1;

                            return (
                                <div
                                    key={testNum}
                                    className="bg-[#141519] border border-zinc-800/80 rounded-2xl p-6 relative flex flex-col justify-between hover:border-zinc-700 transition-all"
                                >
                                    {/* Background Number */}
                                    <div className="text-6xl font-black opacity-90 text-white absolute top-4 left-5 select-none">{testNum}</div>

                                    {/* Top Meta */}
                                    <div className="relative z-10 ml-12">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">TEST {testNum}</span>
                                            <span className="text-xs text-zinc-500">⏱ ~{durationMin} min</span>
                                            {isStartHere && (
                                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">START HERE</span>
                                            )}
                                        </div>
                                        <h3 className="text-white font-bold text-base mt-3">{bookTitle} – Test {testNum}</h3>

                                        {/* Skill Flow */}
                                        <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400">
                                            <span>🎧</span>
                                            <span>→</span>
                                            <span>📖</span>
                                            <span>→</span>
                                            <span>✍️</span>
                                            <span>→</span>
                                            <span>🎙️</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-zinc-800/60 my-4" />

                                    {/* Bottom */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-400">⏱ Not completed</span>
                                        <span className="text-xs text-zinc-500">4 sections · ~{durationMin} min</span>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => openGuidelines(i)}
                                        className="w-full mt-4 bg-white hover:bg-zinc-100 text-black font-bold text-sm py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    >
                                        ► Start Full Test
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    /* ─── VIEW: Guidelines ─── */
    if (viewMode === 'guidelines' && selectedBook) {
        const bookTitle = selectedBook.category === 'mock_series'
            ? `${selectedBook.title} ${selectedBook.bookNumber}`
            : activeTab === 'general' && Number(selectedBook.bookNumber) <= 10
                ? `Cambridge IELTS ${selectedBook.bookNumber} GT`
                : `Cambridge IELTS ${selectedBook.bookNumber}`;
        const testLabel = `${bookTitle} – Test ${selectedTestIndex + 1}`;
        const durationMin = selectedBook.testCount * 41;

        return (
            <div className="min-h-screen bg-[#0B0C0E] p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <button
                            onClick={() => setViewMode('book_tests')}
                            className="flex items-center gap-2 text-xl font-bold text-white hover:text-zinc-300 transition-colors"
                        >
                            ← {testLabel}
                        </button>
                        <p className="text-xs text-zinc-400 mt-1">Test Guidelines</p>
                    </div>

                    {/* Headline */}
                    <div className="mb-6">
                        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                            {activeTab === 'academic' ? 'CAMBRIDGE IELTS ACADEMIC' : 'CAMBRIDGE IELTS GENERAL TRAINING'}
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-1">{testLabel}</h2>
                        <p className="text-sm text-zinc-400 mt-1">Read the guidelines carefully before starting.</p>
                    </div>

                    {/* Card 1: Before You Begin */}
                    <div className="bg-[#141519] border border-zinc-800/80 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                <span className="text-base font-bold text-white">Before You Begin</span>
                            </div>
                            <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-full font-medium">⏱ ~{durationMin} min</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border border-zinc-800/80 rounded-xl p-6 bg-[#18191E]">
                            <div className="text-center">
                                <div className="text-2xl mb-2">📶</div>
                                <p className="text-xs font-semibold text-zinc-300">Stable internet connection</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">🎧</div>
                                <p className="text-xs font-semibold text-zinc-300">Headphones for listening</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">⏱</div>
                                <p className="text-xs font-semibold text-zinc-300">~3 hours free time</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Test Sections */}
                    <div className="bg-[#141519] border border-zinc-800/80 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-white">Test Sections</span>
                            <span className="text-xs text-zinc-400">4 sections · in order</span>
                        </div>

                        <div className="divide-y divide-zinc-800/60 mt-4">
                            {/* Listening */}
                            <div className="flex items-center gap-4 py-4">
                                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                                <span className="text-lg">🎧</span>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">Listening</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">4 audio recordings · 40 questions · No replay</p>
                                </div>
                                <span className="font-bold text-white text-sm">40 min</span>
                            </div>

                            {/* Reading */}
                            <div className="flex items-center gap-4 py-4">
                                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                                <span className="text-lg">📖</span>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">Reading</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        3 passages · 40 questions · {activeTab === 'academic' ? 'Academic' : 'General Training'} texts
                                    </p>
                                </div>
                                <span className="font-bold text-white text-sm">60 min</span>
                            </div>

                            {/* Writing */}
                            <div className="flex items-center gap-4 py-4">
                                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                                <span className="text-lg">✍️</span>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">Writing</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">Task 1 (graph/chart) · Task 2 (essay) · AI graded</p>
                                </div>
                                <span className="font-bold text-white text-sm">60 min</span>
                            </div>

                            {/* Speaking */}
                            <div className="flex items-center gap-4 py-4">
                                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">4</div>
                                <span className="text-lg">🎙️</span>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">Speaking</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">3 parts · Conversational · AI examiner feedback</p>
                                </div>
                                <span className="font-bold text-white text-sm">~15 min</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Launcher */}
                    <div className="sticky bottom-0 bg-[#0B0C0E] pt-4 pb-6">
                        <button
                            onClick={handleLaunchExam}
                            className="w-full bg-white hover:bg-zinc-100 text-black font-extrabold text-base px-8 py-3.5 rounded-full cursor-pointer shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            Begin Full Test →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* Fallback — should never reach here */
    return null;
};

export default FullMockTestHub;
