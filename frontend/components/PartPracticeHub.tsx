import React, { useState, useMemo } from 'react';
import IELTSReadingExam from './enterprise/ielts/IELTSReadingExam';
import IELTSListeningExam from './enterprise/ielts/IELTSListeningExam';
import IELTSWritingExam from './enterprise/ielts/IELTSWritingExam';
import IELTSSpeakingExam from './enterprise/ielts/IELTSSpeakingExam';

/* ─── Types ─── */
type PracticeTab = 'parts' | 'question_types';
type ExamModeType = 'academic' | 'general';
type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';

interface PracticeItem {
    skill: SkillType;
    bookId: string;
    testIndex: number;
    partIndex: number;
    title: string;
}

interface QuestionTypeDrill {
    id: string;
    skill: 'reading' | 'listening' | 'writing';
    title: string;
    drillsCount: number;
    questionsCount: number;
    description: string;
}

interface BookTest {
    bookId: string;
    bookNumber: number | string;
    bookTitle: string;
    category: 'cambridge' | 'mock_series';
    tests: { testIndex: number; label: string }[];
}

interface PartPracticeHubProps {
    userEmail?: string;
}

/* ─── Skill Config ─── */
const SKILL_CONFIG: Record<SkillType, { label: string; subtitle: string; color: string; borderActive: string; bgActive: string; iconBg: string; iconColor: string; parts: number; partLabel: string }> = {
    reading: { label: 'Reading', subtitle: '20 min / part', color: 'blue', borderActive: 'border-blue-500/80', bgActive: 'bg-[#141519]', iconBg: 'bg-blue-950/60', iconColor: 'text-blue-400', parts: 3, partLabel: 'Passage' },
    listening: { label: 'Listening', subtitle: '10 min / part', color: 'emerald', borderActive: 'border-emerald-500/80', bgActive: 'bg-[#141519]', iconBg: 'bg-emerald-950/60', iconColor: 'text-emerald-400', parts: 4, partLabel: 'Section' },
    writing: { label: 'Writing', subtitle: '30 min / part', color: 'amber', borderActive: 'border-amber-500/80', bgActive: 'bg-[#141519]', iconBg: 'bg-amber-950/60', iconColor: 'text-amber-400', parts: 2, partLabel: 'Task' },
    speaking: { label: 'Speaking', subtitle: '~8 min / part', color: 'purple', borderActive: 'border-purple-500/80', bgActive: 'bg-[#141519]', iconBg: 'bg-purple-950/60', iconColor: 'text-purple-400', parts: 3, partLabel: 'Part' },
};

const SKILL_INFO_BANNER: Record<SkillType, { text: string; tag: string; borderColor: string; bgColor: string; textColor: string }> = {
    reading: { text: 'Practice individual reading passages and sharpen comprehension skills', tag: '~20 min per part', borderColor: 'border-blue-500/20', bgColor: 'bg-blue-950/20', textColor: 'text-blue-300' },
    listening: { text: 'Tackle single listening sections with audio playback and auto-scoring', tag: '~10 min per part', borderColor: 'border-emerald-500/20', bgColor: 'bg-emerald-950/20', textColor: 'text-emerald-300' },
    writing: { text: 'Practice Task 1 or Task 2 independently with AI-powered grading', tag: '~30 min per part', borderColor: 'border-amber-500/20', bgColor: 'bg-amber-950/20', textColor: 'text-amber-300' },
    speaking: { text: 'Record and get AI feedback on any individual speaking part', tag: '~8 min per part', borderColor: 'border-purple-500/20', bgColor: 'bg-purple-950/20', textColor: 'text-purple-300' },
};

/* ─── Reading passage titles ─── */
const READING_PASSAGE_TITLES = [
    'The life and work of Marie Curie',
    'The Physics of Traffic Behavior',
    'Plain English',
];

const LISTENING_SECTION_TITLES = [
    'Section 1 — Social conversation',
    'Section 2 — Monologue',
    'Section 3 — Academic discussion',
    'Section 4 — Academic lecture',
];

const WRITING_TASK_TITLES = [
    'Task 1 — Report / Chart',
    'Task 2 — Essay',
];

const SPEAKING_PART_TITLES = [
    'Part 1 — Introduction & Interview',
    'Part 2 — Long Turn (Cue Card)',
    'Part 3 — Two-way Discussion',
];

/* ─── Question Type Drills ─── */
const READING_DRILLS: QuestionTypeDrill[] = [
    { id: 'r-tfng', skill: 'reading', title: 'True / False / Not Given', drillsCount: 12, questionsCount: 60, description: 'Read the statement and decide if it is True, False, or Not Given based on the passage.' },
    { id: 'r-heading', skill: 'reading', title: 'Matching Headings', drillsCount: 8, questionsCount: 32, description: 'Match the correct heading to each paragraph or section of the passage.' },
    { id: 'r-mcq', skill: 'reading', title: 'Multiple Choice', drillsCount: 10, questionsCount: 40, description: 'Select the correct answer from the given options for each question.' },
    { id: 'r-mcq-multi', skill: 'reading', title: 'Multiple Choice (Multiple Answers)', drillsCount: 6, questionsCount: 18, description: 'Select two or more correct answers from the list of options.' },
    { id: 'r-sentence', skill: 'reading', title: 'Sentence Completion', drillsCount: 9, questionsCount: 45, description: 'Complete the sentences using words from the reading passage.' },
    { id: 'r-summary', skill: 'reading', title: 'Summary Completion', drillsCount: 8, questionsCount: 40, description: 'Fill in the gaps in a summary using words from the passage.' },
    { id: 'r-note', skill: 'reading', title: 'Note Completion', drillsCount: 5, questionsCount: 20, description: 'Complete the notes with information from the reading passage.' },
    { id: 'r-table', skill: 'reading', title: 'Table Completion', drillsCount: 5, questionsCount: 25, description: 'Fill in the table cells using information from the passage.' },
    { id: 'r-flow', skill: 'reading', title: 'Flow Chart Completion', drillsCount: 4, questionsCount: 16, description: 'Complete the flow chart using details from the reading passage.' },
    { id: 'r-diagram', skill: 'reading', title: 'Diagram Label Completion', drillsCount: 4, questionsCount: 16, description: 'Label the diagram using information from the passage.' },
    { id: 'r-match-feat', skill: 'reading', title: 'Matching Features', drillsCount: 6, questionsCount: 30, description: 'Match descriptions or features to the correct items in the passage.' },
    { id: 'r-match-info', skill: 'reading', title: 'Matching Information', drillsCount: 5, questionsCount: 25, description: 'Identify which paragraph contains the given information.' },
    { id: 'r-match-endings', skill: 'reading', title: 'Matching Sentence Endings', drillsCount: 5, questionsCount: 25, description: 'Complete sentence endings using the correct options from the passage.' },
    { id: 'r-short', skill: 'reading', title: 'Short-Answer Questions', drillsCount: 6, questionsCount: 18, description: 'Answer questions using words directly from the passage.' },
    { id: 'r-yesno', skill: 'reading', title: 'Yes / No / Not Given', drillsCount: 7, questionsCount: 35, description: 'Determine if the writer agrees, disagrees, or does not mention each statement.' },
];

const LISTEN_DRILLS: QuestionTypeDrill[] = [
    { id: 'l-form', skill: 'listening', title: 'Form Completion', drillsCount: 10, questionsCount: 50, description: 'Complete the form using words from the audio recording.' },
    { id: 'l-note', skill: 'listening', title: 'Note Completion', drillsCount: 8, questionsCount: 40, description: 'Fill in the notes with details from the listening audio.' },
    { id: 'l-table', skill: 'listening', title: 'Table Completion', drillsCount: 6, questionsCount: 30, description: 'Complete the table cells using information from the audio.' },
    { id: 'l-flow', skill: 'listening', title: 'Flow-Chart Completion', drillsCount: 5, questionsCount: 20, description: 'Complete the flow chart using details from the listening audio.' },
    { id: 'l-summary', skill: 'listening', title: 'Summary Completion', drillsCount: 6, questionsCount: 30, description: 'Fill in the gaps in a summary using words from the audio.' },
    { id: 'l-sentence', skill: 'listening', title: 'Sentence Completion', drillsCount: 7, questionsCount: 35, description: 'Complete the sentences using words from the listening audio.' },
    { id: 'l-mcq', skill: 'listening', title: 'Multiple Choice', drillsCount: 8, questionsCount: 40, description: 'Select the correct answer from the given options.' },
    { id: 'l-mcq-multi', skill: 'listening', title: 'Multiple Choice (Multiple Answers)', drillsCount: 5, questionsCount: 15, description: 'Select two or more correct answers from the options.' },
    { id: 'l-match', skill: 'listening', title: 'Matching Features', drillsCount: 6, questionsCount: 30, description: 'Match items from the audio to the correct descriptions.' },
    { id: 'l-map', skill: 'listening', title: 'Plan, Map or Diagram Labelling', drillsCount: 4, questionsCount: 20, description: 'Label the plan, map or diagram using details from the audio.' },
    { id: 'l-short', skill: 'listening', title: 'Short-Answer Questions', drillsCount: 5, questionsCount: 15, description: 'Answer questions using words from the listening audio.' },
];

const WRITING_DRILLS: QuestionTypeDrill[] = [
    { id: 'w-academic-report', skill: 'writing', title: 'Academic Report', drillsCount: 8, questionsCount: 8, description: 'Summarise visual information by selecting and reporting the main features.' },
    { id: 'w-bar', skill: 'writing', title: 'Bar Chart', drillsCount: 6, questionsCount: 6, description: 'Describe the data shown in the bar chart and make comparisons.' },
    { id: 'w-line', skill: 'writing', title: 'Line Graph', drillsCount: 5, questionsCount: 5, description: 'Describe trends and changes shown in the line graph.' },
    { id: 'w-pie', skill: 'writing', title: 'Pie Chart', drillsCount: 4, questionsCount: 4, description: 'Describe the proportions shown in the pie chart.' },
    { id: 'w-table-writing', skill: 'writing', title: 'Table', drillsCount: 4, questionsCount: 4, description: 'Describe and compare the data presented in the table.' },
    { id: 'w-map', skill: 'writing', title: 'Map', drillsCount: 3, questionsCount: 3, description: 'Describe changes to a location shown in maps.' },
    { id: 'w-process', skill: 'writing', title: 'Process Diagram', drillsCount: 3, questionsCount: 3, description: 'Describe the stages of a process shown in the diagram.' },
    { id: 'w-multiple-visual', skill: 'writing', title: 'Multiple Visuals', drillsCount: 4, questionsCount: 4, description: 'Describe and compare data from multiple charts or graphs.' },
    { id: 'w-opinion', skill: 'writing', title: 'Opinion Essay', drillsCount: 8, questionsCount: 8, description: 'Write an essay giving your opinion on a statement or argument.' },
    { id: 'w-discussion', skill: 'writing', title: 'Discussion Essay', drillsCount: 7, questionsCount: 7, description: 'Discuss both sides and give your own opinion.' },
    { id: 'w-advantages', skill: 'writing', title: 'Advantages / Disadvantages Essay', drillsCount: 5, questionsCount: 5, description: 'Discuss the advantages and disadvantages of a topic.' },
    { id: 'w-problem-solution', skill: 'writing', title: 'Problem / Solution Essay', drillsCount: 5, questionsCount: 5, description: 'Identify problems and suggest solutions.' },
    { id: 'w-two-part', skill: 'writing', title: 'Two-Part Question Essay', drillsCount: 5, questionsCount: 5, description: 'Answer two related questions in a discursive essay.' },
    { id: 'w-essay', skill: 'writing', title: 'Essay (General)', drillsCount: 6, questionsCount: 6, description: 'Write a general essay on the given topic.' },
];

/* ─── Book Data Generators ─── */
function buildAcademicBooks(): BookTest[] {
    const books: BookTest[] = [];
    // Cambridge 7-21
    for (let i = 7; i <= 21; i++) {
        const testCount = i === 15 ? 3 : 4;
        books.push({
            bookId: `cambridge-${i}-ac`,
            bookNumber: i,
            bookTitle: `Cambridge IELTS ${i}`,
            category: 'cambridge',
            tests: Array.from({ length: testCount }, (_, t) => ({ testIndex: t, label: `Test ${t + 1}` })),
        });
    }
    // Mock Series 1-4
    for (let i = 1; i <= 4; i++) {
        books.push({
            bookId: `mock-series-${i}`,
            bookNumber: i,
            bookTitle: `IELTSly Mock Series ${i}`,
            category: 'mock_series',
            tests: Array.from({ length: 4 }, (_, t) => ({ testIndex: t, label: `Test ${t + 1}` })),
        });
    }
    return books;
}

function buildGTBooks(): BookTest[] {
    const books: BookTest[] = [];
    const testCounts: Record<number, number> = { 7: 2, 8: 2, 9: 2, 10: 2, 15: 3 };
    for (let i = 7; i <= 19; i++) {
        const testCount = testCounts[i] ?? 4;
        books.push({
            bookId: `cambridge-${i}-gt`,
            bookNumber: i,
            bookTitle: `Cambridge IELTS ${i}`,
            category: 'cambridge',
            tests: Array.from({ length: testCount }, (_, t) => ({ testIndex: t, label: `Test ${t + 1}` })),
        });
    }
    return books;
}

const ACADEMIC_BOOKS = buildAcademicBooks();
const GT_BOOKS = buildGTBooks();

/* ─── Main Component ─── */
const PartPracticeHub: React.FC<PartPracticeHubProps> = ({ userEmail }) => {
    const [activeTab, setActiveTab] = useState<PracticeTab>('parts');
    const [examMode, setExamMode] = useState<ExamModeType>('academic');
    const [selectedSkill, setSelectedSkill] = useState<SkillType>('reading');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
    const [selectedTest, setSelectedTest] = useState<{ bookId: string; testIndex: number } | null>(null);
    const [activeExam, setActiveExam] = useState<PracticeItem | QuestionTypeDrill | null>(null);

    const books = useMemo(() => examMode === 'academic' ? ACADEMIC_BOOKS : GT_BOOKS, [examMode]);

    const filteredBooks = useMemo(() => {
        if (!searchQuery.trim()) return books;
        const q = searchQuery.toLowerCase();
        return books.filter(b => b.bookTitle.toLowerCase().includes(q) || String(b.bookNumber).includes(q));
    }, [books, searchQuery]);

    const selectedBookData = useMemo(() => {
        if (!selectedTest) return null;
        return books.find(b => b.bookId === selectedTest.bookId) ?? null;
    }, [books, selectedTest]);

    const skillConfig = SKILL_CONFIG[selectedSkill];
    const partCount = skillConfig.parts;
    const partLabel = skillConfig.partLabel;

    const getPartTitles = () => {
        switch (selectedSkill) {
            case 'reading': return READING_PASSAGE_TITLES;
            case 'listening': return LISTENING_SECTION_TITLES;
            case 'writing': return WRITING_TASK_TITLES;
            case 'speaking': return SPEAKING_PART_TITLES;
        }
    };

    const handleBookClick = (bookId: string) => {
        setExpandedBookId(prev => prev === bookId ? null : bookId);
    };

    const handleTestSelect = (bookId: string, testIndex: number) => {
        setSelectedTest({ bookId, testIndex });
    };

    const handlePartClick = (partIndex: number) => {
        const titles = getPartTitles();
        const bookTitle = selectedBookData?.bookTitle ?? 'Practice';
        const testLabel = selectedTest ? `Test ${selectedTest.testIndex + 1}` : '';
        setActiveExam({
            skill: selectedSkill,
            bookId: selectedTest?.bookId ?? '',
            testIndex: selectedTest?.testIndex ?? 0,
            partIndex,
            title: `${bookTitle} ${testLabel} — ${partLabel} ${partIndex + 1}`,
        });
    };

    const handleDrillClick = (drill: QuestionTypeDrill) => {
        setActiveExam(drill);
    };

    /* ─── Exam Runner ─── */
    if (activeExam) {
        return (
            <div className="h-[calc(100vh-32px)] bg-[#F2F2F2] flex flex-col overflow-hidden">
                <div className="bg-[#141519] border-b border-zinc-800 px-6 py-3 flex items-center justify-between shrink-0">
                    <button
                        onClick={() => setActiveExam(null)}
                        className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2 bg-zinc-800/60 px-3 py-1.5 rounded-lg border border-zinc-700/50 transition-all"
                    >
                        ← Back to Part Practice
                    </button>
                    <div className="text-sm font-semibold text-zinc-200">
                        {'bookId' in activeExam
                            ? activeExam.title
                            : `${activeExam.skill.toUpperCase()} — ${activeExam.title}`}
                    </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {activeExam.skill === 'reading' && (
                        <IELTSReadingExam candidateEmail={userEmail} />
                    )}
                    {activeExam.skill === 'listening' && (
                        <IELTSListeningExam candidateEmail={userEmail} />
                    )}
                    {activeExam.skill === 'writing' && (
                        <IELTSWritingExam candidateEmail={userEmail} />
                    )}
                    {activeExam.skill === 'speaking' && (
                        <IELTSSpeakingExam candidateEmail={userEmail} />
                    )}
                </div>
            </div>
        );
    }

    /* ─── Main Hub View ─── */
    return (
        <div className="min-h-screen bg-[#0B0C0E] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-white">Part Practice</h1>
                        <p className="text-xs text-zinc-400 mt-1">Choose any section, book, and individual part</p>
                    </div>
                    {/* Mode Switcher */}
                    <div className="bg-[#141519] border border-zinc-800 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => setExamMode('academic')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${examMode === 'academic' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Academic
                        </button>
                        <button
                            onClick={() => setExamMode('general')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${examMode === 'general' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                        >
                            General Training
                        </button>
                    </div>
                </div>

                {/* Sub-Tab Switcher */}
                <div className="bg-[#141519] border border-zinc-800 p-1 rounded-xl inline-flex gap-1 mb-6">
                    <button
                        onClick={() => setActiveTab('parts')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'parts' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Parts
                    </button>
                    <button
                        onClick={() => setActiveTab('question_types')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'question_types' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Question types
                    </button>
                </div>

                {/* ═══ PARTS TAB ═══ */}
                {activeTab === 'parts' && (
                    <>
                        {/* Skill Selection Cards */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {(Object.keys(SKILL_CONFIG) as SkillType[]).map(skill => {
                                const cfg = SKILL_CONFIG[skill];
                                const isActive = selectedSkill === skill;
                                return (
                                    <button
                                        key={skill}
                                        onClick={() => setSelectedSkill(skill)}
                                        className={`rounded-2xl p-4 border transition-all text-left ${isActive ? `${cfg.borderActive} ${cfg.bgActive}` : 'border-zinc-800/80 bg-[#141519] hover:border-zinc-700'}`}
                                    >
                                        <div className={`${cfg.iconBg} ${cfg.iconColor} p-2.5 rounded-xl w-fit mb-3`}>
                                            {skill === 'reading' && (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            )}
                                            {skill === 'listening' && (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 10a1 1 0 011-1h1a1 1 0 011 1v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-4z" /></svg>
                                            )}
                                            {skill === 'writing' && (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            )}
                                            {skill === 'speaking' && (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                            )}
                                        </div>
                                        <h3 className="text-white font-semibold text-sm">{cfg.label}</h3>
                                        <p className="text-zinc-500 text-xs mt-0.5">{cfg.subtitle}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Skill Info Banner */}
                        {(() => {
                            const info = SKILL_INFO_BANNER[selectedSkill];
                            return (
                                <div className={`${info.bgColor} ${info.borderColor} border rounded-xl p-4 mb-6 flex items-center justify-between`}>
                                    <p className={`${info.textColor} text-sm`}>{info.text}</p>
                                    <span className={`${info.textColor} text-xs font-medium bg-white/5 px-2.5 py-1 rounded-full`}>{info.tag}</span>
                                </div>
                            );
                        })()}

                        {/* Split Panel */}
                        <div className="flex gap-6 min-h-[500px]">
                            {/* Left Panel — Book Tree */}
                            <div className="w-[320px] shrink-0">
                                {/* Search */}
                                <div className="relative mb-4">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <input
                                        type="text"
                                        placeholder="Search books..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#141519] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>

                                {/* Book List */}
                                <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
                                    {filteredBooks.map(book => {
                                        const isExpanded = expandedBookId === book.bookId;
                                        const hasTestSelected = selectedTest?.bookId === book.bookId;
                                        return (
                                            <div key={book.bookId}>
                                                <button
                                                    onClick={() => handleBookClick(book.bookId)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${hasTestSelected ? 'bg-zinc-800/60 border border-zinc-700/50' : 'hover:bg-zinc-800/40 border border-transparent'}`}
                                                >
                                                    <svg className={`w-4 h-4 shrink-0 text-zinc-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{book.bookTitle}</p>
                                                        <p className="text-[11px] text-zinc-500">{book.tests.length} tests</p>
                                                    </div>
                                                </button>
                                                {isExpanded && (
                                                    <div className="ml-6 pl-3 border-l border-zinc-800 space-y-0.5 py-1">
                                                        {book.tests.map(test => {
                                                            const isSelected = selectedTest?.bookId === book.bookId && selectedTest?.testIndex === test.testIndex;
                                                            return (
                                                                <button
                                                                    key={test.testIndex}
                                                                    onClick={() => handleTestSelect(book.bookId, test.testIndex)}
                                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-xs ${isSelected ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'}`}
                                                                >
                                                                    <span>{test.label}</span>
                                                                    <span className="text-zinc-600 text-[10px]">{partCount} {partLabel.toLowerCase()}s</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Panel — Content */}
                            <div className="flex-1 min-w-0">
                                {!selectedTest ? (
                                    /* Empty State */
                                    <div className="border border-dashed border-zinc-800 rounded-2xl bg-[#0F1012] flex flex-col items-center justify-center p-12 text-center h-full">
                                        <div className={`${skillConfig.iconBg} ${skillConfig.iconColor} p-4 rounded-2xl mb-4`}>
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Select a Cambridge Book</h3>
                                        <p className="text-sm text-zinc-500 max-w-sm mb-6">Browse the book tree on the left to find the exact part to practise.</p>
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {['Cambridge IELTS 7', 'Cambridge IELTS 8', 'Cambridge IELTS 9', 'Cambridge IELTS 10'].map(label => {
                                                const num = parseInt(label.split(' ').pop() || '7');
                                                const book = books.find(b => b.bookNumber === num);
                                                if (!book) return null;
                                                return (
                                                    <button
                                                        key={label}
                                                        onClick={() => { handleBookClick(book.bookId); setSearchQuery(''); }}
                                                        className="bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-700/50 transition-all"
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    /* Test Selected State */
                                    <>
                                        {/* Header Banner */}
                                        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4 mb-6">
                                            <div className={`${skillConfig.iconBg} ${skillConfig.iconColor} p-2.5 rounded-xl`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wide">{selectedBookData?.bookTitle}</h3>
                                                <p className="text-xs text-zinc-400 mt-0.5">Test {selectedTest.testIndex + 1} — {partLabel}</p>
                                            </div>
                                        </div>

                                        {/* Part Cards */}
                                        <div className="space-y-3">
                                            {Array.from({ length: partCount }, (_, i) => {
                                                const titles = getPartTitles();
                                                const title = titles[i] || `${partLabel} ${i + 1}`;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handlePartClick(i)}
                                                        className="w-full bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex items-center gap-4 transition-all text-left"
                                                    >
                                                        <div className={`${skillConfig.iconBg} ${skillConfig.iconColor} w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0`}>
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-white font-semibold text-sm">{partLabel} {i + 1}</h4>
                                                            <p className="text-zinc-500 text-xs mt-0.5 truncate">{title}</p>
                                                        </div>
                                                        <span className="text-zinc-600 text-xs shrink-0">⏱ {selectedSkill === 'reading' ? '20 min' : selectedSkill === 'listening' ? '10 min' : selectedSkill === 'writing' ? '30 min' : '~8 min'}</span>
                                                        <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ═══ QUESTION TYPES TAB ═══ */}
                {activeTab === 'question_types' && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-white">Practice by question type</h2>
                            <p className="text-xs text-zinc-400 mt-1">Choose a Reading, Listening, or Writing question family. Practice with authentic Cambridge context and focused feedback.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Reading Drills */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="bg-blue-500/10 border border-blue-500/20 p-1.5 rounded-lg text-blue-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </span>
                                    Reading
                                </h3>
                                <div className="space-y-2">
                                    {READING_DRILLS.map(drill => (
                                        <button
                                            key={drill.id}
                                            onClick={() => handleDrillClick(drill)}
                                            className="w-full bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-3 transition-all text-left"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white capitalize">{drill.title}</h4>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">{drill.drillsCount} drills · {drill.questionsCount} questions</p>
                                                <p className="text-[11px] text-zinc-600 mt-1 line-clamp-1">{drill.description}</p>
                                            </div>
                                            <div className="bg-zinc-800/80 hover:bg-zinc-700 text-blue-400 p-2 rounded-lg shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Listening Drills */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="bg-emerald-500/10 border border-emerald-500/20 p-1.5 rounded-lg text-emerald-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 10a1 1 0 011-1h1a1 1 0 011 1v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-4z" /></svg>
                                    </span>
                                    Listening
                                </h3>
                                <div className="space-y-2">
                                    {LISTEN_DRILLS.map(drill => (
                                        <button
                                            key={drill.id}
                                            onClick={() => handleDrillClick(drill)}
                                            className="w-full bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-3 transition-all text-left"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white capitalize">{drill.title}</h4>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">{drill.drillsCount} drills · {drill.questionsCount} questions</p>
                                                <p className="text-[11px] text-zinc-600 mt-1 line-clamp-1">{drill.description}</p>
                                            </div>
                                            <div className="bg-zinc-800/80 hover:bg-zinc-700 text-emerald-400 p-2 rounded-lg shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Writing Drills */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="bg-amber-500/10 border border-amber-500/20 p-1.5 rounded-lg text-amber-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </span>
                                    Writing
                                </h3>
                                <div className="space-y-2">
                                    {WRITING_DRILLS.map(drill => (
                                        <button
                                            key={drill.id}
                                            onClick={() => handleDrillClick(drill)}
                                            className="w-full bg-[#141519] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-3 transition-all text-left"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white capitalize">{drill.title}</h4>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">{drill.drillsCount} drills · {drill.questionsCount} questions</p>
                                                <p className="text-[11px] text-zinc-600 mt-1 line-clamp-1">{drill.description}</p>
                                            </div>
                                            <div className="bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 p-2 rounded-lg shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PartPracticeHub;
