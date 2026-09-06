import React, { useState } from 'react';

// ── Types ──

type ActiveTab = 'rewrite' | 'generate';
type TaskType = 'task1' | 'task2';

// ── Mock Data ──

const SAMPLE_ESSAY = `Technology has become an integral part of modern society, fundamentally changing how people communicate, work, and access information. While some argue that technology has made life easier and more connected, others believe it has created new problems that did not exist before. This essay will discuss both perspectives and provide examples to support each view.

On the one hand, technology has brought numerous benefits to society. The internet, for example, has made information accessible to anyone with a connection, enabling people to learn new skills and stay informed about global events. Additionally, communication tools like email and social media have made it possible to maintain relationships across long distances, which was much harder in the past.`;

const MOCK_EVALUATION = {
    band: '8.5',
    score: 94,
    pillars: [
        { label: 'Correctness', status: 'All good', fixes: 2, color: 'bg-emerald-500' },
        { label: 'Clarity', status: 'Clear', fixes: 3, color: 'bg-blue-500' },
        { label: 'Engagement', status: 'Very catchy', fixes: 0, color: 'bg-violet-500' },
        { label: 'Delivery', status: 'Formal & Academic', fixes: 0, color: 'bg-orange-500' },
    ],
    suggestions: [
        {
            type: 'vocabulary',
            original: 'good',
            replacement: 'exemplary',
            explanation: 'Stronger academic vocabulary enhances Band 9 lexical resource score.',
        },
        {
            type: 'cohesion',
            original: 'Technology has brought numerous benefits to society. The internet, for example...',
            replacement: 'Technology has brought numerous benefits to society, most notably through the internet, which...',
            explanation: 'Combining these sentences improves cohesion and reduces choppiness.',
        },
    ],
    rewritten: `Technology has become an integral part of modern society, fundamentally transforming how individuals communicate, work, and access information. While proponents argue that technological advancement has ushered in unprecedented convenience and global connectivity, critics contend that it has introduced novel societal challenges. This essay will examine both perspectives with supporting evidence.

On the one hand, technology has brought exemplary benefits to contemporary society. The internet, in particular, has democratized access to information, empowering individuals to acquire new competencies and maintain awareness of global developments. Furthermore, communication platforms such as email and social media have facilitated seamless interpersonal connections across geographical boundaries, a feat that was considerably more arduous in preceding decades.`,
};

// ── Inline SVG Icons ──

const PencilIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
);

const ChevronLeftIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const SparklesIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
    </svg>
);

const ClipboardIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
);

const ArrowUpTrayIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const DocumentTextIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const CheckCircleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ArrowRightIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

// ── Main Component ──

interface AIRewriterViewProps {
    userEmail?: string;
}

const AIRewriterView: React.FC<AIRewriterViewProps> = ({ userEmail }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('rewrite');
    const [inputText, setInputText] = useState('');
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [taskType, setTaskType] = useState<TaskType>('task2');
    const [questionText, setQuestionText] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);

    const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

    const handleTrySample = () => {
        setInputText(SAMPLE_ESSAY);
        setIsEvaluated(true);
    };

    const handleRewrite = () => {
        if (inputText.trim()) setIsEvaluated(true);
    };

    const handleGenerate = () => {
        if (questionText.trim()) setIsGenerated(true);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 max-w-5xl mx-auto space-y-6">

            {/* ═══ 2.1 HEADER & MODE SWITCHER ═══ */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-[24px] font-bold text-gray-900">AI Rewriter</h1>
                    <span className="bg-red-100 text-red-600 font-bold text-xs px-2.5 py-0.5 rounded-full">PRO</span>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500 hidden sm:block">Advanced writing enhancement</p>
                    <button className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
                        <ChevronLeftIcon className="w-4 h-4" />
                        Back
                    </button>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="max-w-md mx-auto bg-gray-100/80 p-1 rounded-full flex shadow-inner">
                <button
                    onClick={() => setActiveTab('rewrite')}
                    className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeTab === 'rewrite'
                            ? 'bg-white text-red-600 shadow'
                            : 'text-gray-600 hover:text-gray-900 font-medium'
                    }`}
                >
                    Rewrite Sample
                </button>
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`flex-1 py-2 rounded-full text-sm transition-all ${
                        activeTab === 'generate'
                            ? 'bg-white text-red-600 shadow font-semibold'
                            : 'text-gray-600 hover:text-gray-900 font-medium'
                    }`}
                >
                    Generate Answer
                </button>
            </div>

            {/* ═══ 2.2 TAB 1: REWRITE SAMPLE ═══ */}
            {activeTab === 'rewrite' && (
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT PANEL — INPUT */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between min-h-[520px]">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                        <DocumentTextIcon className="w-4 h-4 text-red-500" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">Original Text</h3>
                                </div>
                                <button onClick={handleTrySample} className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
                                    Try Sample Essay
                                </button>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    setIsEvaluated(false);
                                }}
                                placeholder="Paste your essay here..."
                                className="w-full flex-1 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 text-sm text-gray-700 leading-relaxed min-h-[320px]"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-gray-400 font-medium">{wordCount} words</span>
                            <button
                                onClick={handleRewrite}
                                disabled={!inputText.trim()}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition flex items-center gap-2"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                Rewrite & Evaluate
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL — ENHANCEMENT & SCORE */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm min-h-[520px]">
                        {!isEvaluated ? (
                            /* Empty State */
                            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                    <PencilIcon className="w-7 h-7 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-700">Ready to enhance</h3>
                                    <p className="text-sm text-gray-400 mt-1">Your enhanced text and score will appear here.</p>
                                </div>
                            </div>
                        ) : (
                            /* Evaluated State */
                            <div className="space-y-5">
                                {/* Band Score Dial */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-100">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">IELTS Band Score</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-0.5">Band {MOCK_EVALUATION.band} <span className="text-lg text-gray-400">/ 9.0</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Quality</p>
                                        <p className="text-2xl font-bold text-emerald-600 mt-0.5">{MOCK_EVALUATION.score}<span className="text-sm text-gray-400">/100</span></p>
                                    </div>
                                </div>

                                {/* 4 Grammarly Pillars */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    {MOCK_EVALUATION.pillars.map((p) => (
                                        <div key={p.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-700">{p.label}</p>
                                                <p className="text-[10px] text-gray-400">{p.status}{p.fixes > 0 ? ` · ${p.fixes} fixes` : ''}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Suggestion Cards */}
                                <div className="space-y-2.5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Suggestions</p>
                                    {MOCK_EVALUATION.suggestions.map((s, i) => (
                                        <div key={i} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    {s.type === 'vocabulary' ? 'Vocabulary Upgrade' : 'Cohesion'}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2 text-xs">
                                                <span className="text-gray-400 line-through">{s.original}</span>
                                                <ArrowRightIcon className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                                <span className="text-emerald-600 font-semibold">{s.replacement}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-500">{s.explanation}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Rewritten Output */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Band 9 Rewrite</p>
                                        <button className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
                                            <ClipboardIcon className="w-3.5 h-3.5" />
                                            Copy Band 9 Rewrite
                                        </button>
                                    </div>
                                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {MOCK_EVALUATION.rewritten}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ 2.3 TAB 2: GENERATE ANSWER ═══ */}
            {activeTab === 'generate' && (
                <div className="max-w-xl mx-auto space-y-6">

                    {/* Hero Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center space-y-6">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <SparklesIcon className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-[24px] font-bold text-gray-900">IELTS Model Answer Generator</h2>
                            <p className="text-sm text-gray-500 mt-1">Create Band 9.0 answers for your practice questions</p>
                        </div>

                        {/* Task Selector */}
                        <div className="max-w-xs mx-auto bg-gray-100/80 p-1 rounded-full flex">
                            <button
                                onClick={() => setTaskType('task1')}
                                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                                    taskType === 'task1'
                                        ? 'bg-white text-slate-900 shadow'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Task 1
                            </button>
                            <button
                                onClick={() => setTaskType('task2')}
                                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                                    taskType === 'task2'
                                        ? 'bg-white text-slate-900 shadow'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Task 2
                            </button>
                        </div>

                        {/* Image Dropzone */}
                        <div className="border-2 border-dashed border-gray-200 hover:border-red-300 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 transition-colors">
                            <ArrowUpTrayIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-600">Upload question image</p>
                            <p className="text-[11px] text-gray-400 mt-1">PNG, JPG up to 5MB · drag & drop or click</p>
                        </div>

                        {/* Question Textarea */}
                        <textarea
                            value={questionText}
                            onChange={(e) => {
                                setQuestionText(e.target.value);
                                setIsGenerated(false);
                            }}
                            placeholder="Enter the full Task 2 question here..."
                            className="border border-gray-200 rounded-2xl p-4 w-full h-32 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 text-gray-700 resize-none"
                        />

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!questionText.trim()}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl w-full shadow-lg transition flex items-center justify-center gap-2"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            Generate Answer
                        </button>
                    </div>

                    {/* Generated Output Drawer */}
                    {isGenerated && (
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">Band 9.0 Model Response</h3>
                                </div>
                                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                                    <ClipboardIcon className="w-3.5 h-3.5" />
                                    Copy
                                </button>
                            </div>

                            {/* Categorized Response */}
                            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Introduction</p>
                                    <p>In contemporary society, the role of technology has become a subject of considerable debate. While some maintain that it has fundamentally improved quality of life, others argue it has introduced unprecedented challenges. This essay will examine both perspectives.</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Body Paragraph 1</p>
                                    <p>On the one hand, technological advancement has yielded exemplary benefits. The internet has democratized access to information, empowering individuals worldwide to acquire knowledge and skills previously confined to formal institutions. Furthermore, digital communication platforms have facilitated seamless global connectivity.</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Body Paragraph 2</p>
                                    <p>Conversely, critics contend that excessive reliance on technology has engendered significant societal concerns. The proliferation of social media, for instance, has been linked to rising rates of anxiety and diminished interpersonal interaction, particularly among younger demographics.</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Conclusion</p>
                                    <p>In conclusion, while technology presents both advantages and disadvantages, its judicious application holds the potential to substantially enhance human welfare. The key lies in maintaining a balanced approach that maximizes benefits while mitigating adverse effects.</p>
                                </div>
                            </div>

                            {/* Vocabulary Highlight */}
                            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Key Examiner Vocabulary & Collocations</p>
                                <div className="flex flex-wrap gap-2">
                                    {['exemplary benefits', 'democratized access', 'unprecedented challenges', 'judicious application', 'diminished interpersonal', 'proliferation of'].map((phrase) => (
                                        <span key={phrase} className="text-xs font-medium text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">{phrase}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIRewriterView;
