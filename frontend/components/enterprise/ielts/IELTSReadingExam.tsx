import React, { useEffect, useRef, useState } from 'react';
import { addAttempt, rawToBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';

type QuestionType = 'tfng' | 'gap' | 'mcq' | 'heading';
type TestState = 'lobby' | 'active' | 'evaluating' | 'completed';
type ThemeId = 'default' | 'bw' | 'yb';

interface ReadingQuestion {
    id: number;
    part: 1 | 2 | 3;
    type: QuestionType;
    prompt: string;
    answer: string;
    options?: string[];
}

interface ReadingPart {
    id: 1 | 2 | 3;
    title: string;
    text: string;
}

const PASSAGE_P1 = `Cities around the world are turning to vertical forests as a response to rising temperatures and shrinking green space. These high-rise buildings, wrapped in hundreds of trees and thousands of shrubs, act as living filters. They absorb carbon dioxide, release oxygen, and reduce the surface temperature of the surrounding streets by several degrees.

The first completed vertical forest, the Bosco Verticale in Milan, was finished in 2014 and contains more than 900 trees. Architects argue that such buildings create habitats for birds and insects, improving urban biodiversity. However, critics point out that the maintenance costs are high. Irrigation systems, pruning schedules, and structural weight all demand constant attention from specialists.

Despite these challenges, interest in the concept has spread rapidly. Developers in Asia and Latin America have adapted the model to local climates, choosing native plant species that need less water. Some studies suggest that a single vertical forest can remove up to 30 tonnes of carbon every year. Whether this justifies the initial construction expense remains a matter of debate.`;

const PASSAGE_P2 = `The idea of treating every field the same way is slowly being replaced by a more precise approach. Precision farming uses satellite imagery, soil sensors, and GPS-guided machinery to apply water, fertiliser, and pesticides exactly where and when they are needed. Instead of treating an entire field as a single unit, the technology divides it into small management zones, each monitored and treated separately.

The economic case for the new methods is compelling. Studies in the United States show that growers using precision techniques can cut fertiliser use by up to 20 per cent while raising yields by roughly the same margin. Equipment makers now sell combines and sprayers that adjust application rates on the move, using real-time data from on-board sensors to save money on every pass across the field.

There are, however, serious obstacles to adoption. The sensors, software, and training needed to interpret the data are expensive, and many smallholders in developing countries lack both the capital and the expertise. Critics also warn that the technology concentrates power in the hands of a few large agribusinesses, deepening inequality in rural areas rather than helping the farmers who need it most.

Looking ahead, researchers are pairing precision data with machine learning to forecast crop diseases before they spread. Early field trials suggest that such systems could cut pesticide use dramatically. Whether these tools will be adopted widely, however, depends on whether their benefits reach small farms as well as vast commercial estates.`;

const PASSAGE_P3 = `Modern society often treats sleep as a luxury it can no longer afford, yet a growing body of research suggests that chronic sleep deprivation is reshaping everything from workplace productivity to public health. Adults who consistently sleep fewer than seven hours a night are significantly more likely to develop hypertension, diabetes, and mood disorders, according to a large-scale study published in 2023.

Some companies have begun to treat sleep as a performance issue rather than a personal one. A number of global firms now offer 'sleep policies' that discourage late-night emails and fund fatigue-awareness training. Early adopters report measurable gains in attention and decision-making, although critics argue that such schemes amount to little more than corporate surveillance of private habits.

On the scientific side, researchers are exploring whether drugs that mimic the brain's natural sleep chemicals could one day replace rest. So far the results have been disappointing: pharmaceutical 'sleep substitutes' improve alertness for a few hours but do not reproduce the restorative functions of deep sleep, which appear essential for memory consolidation.

Ultimately, the evidence points in one direction: there is no substitute for consistent, uninterrupted rest. The question for policymakers is not whether sleep matters, but how far the state should go in protecting it — from delaying school start times to regulating shift work.`;

const PARTS: ReadingPart[] = [
    { id: 1, title: 'Vertical Forests', text: PASSAGE_P1 },
    { id: 2, title: 'The Rise of Precision Farming', text: PASSAGE_P2 },
    { id: 3, title: 'The Sleep Revolution', text: PASSAGE_P3 },
];

interface HeadingItem {
    id: string;
    text: string;
}

const HEADINGS: HeadingItem[] = [
    { id: 'A', text: 'How precision farming works' },
    { id: 'B', text: 'The economic benefits of precise application' },
    { id: 'C', text: 'The barriers facing smaller farmers' },
    { id: 'D', text: 'Predicting problems before they appear' },
    { id: 'E', text: 'The environmental cost of modern agriculture' },
];

const QUESTIONS: ReadingQuestion[] = [
    { id: 1, part: 1, type: 'tfng', prompt: 'The Bosco Verticale was the first vertical forest ever proposed by an architect.', answer: 'false' },
    { id: 2, part: 1, type: 'tfng', prompt: 'Vertical forests reduce surrounding street temperatures by several degrees.', answer: 'true' },
    { id: 3, part: 1, type: 'tfng', prompt: 'All developers have abandoned the vertical forest model because of maintenance costs.', answer: 'false' },
    { id: 4, part: 1, type: 'gap', prompt: 'A single vertical forest can remove up to ____ tonnes of carbon per year.', answer: '30' },
    { id: 5, part: 1, type: 'gap', prompt: 'The Bosco Verticale was completed in the year ____.', answer: '2014' },
    { id: 6, part: 2, type: 'heading', prompt: 'Match the heading to Paragraph 1.', answer: 'a' },
    { id: 7, part: 2, type: 'heading', prompt: 'Match the heading to Paragraph 2.', answer: 'b' },
    { id: 8, part: 2, type: 'heading', prompt: 'Match the heading to Paragraph 3.', answer: 'c' },
    { id: 9, part: 2, type: 'heading', prompt: 'Match the heading to Paragraph 4.', answer: 'd' },
    { id: 10, part: 3, type: 'mcq', prompt: 'According to the passage, adults who sleep fewer than seven hours a night are more likely to develop…', answer: 'c', options: ['Financial problems and job loss', 'Heart disease and stroke', 'Hypertension, diabetes, and mood disorders', 'Short-term memory loss'] },
    { id: 11, part: 3, type: 'mcq', prompt: 'What do critics say about corporate "sleep policies"?', answer: 'b', options: ['They are too expensive to maintain', 'They interfere with employees\u2019 private lives', 'They have no measurable effect on attention', 'They only benefit senior managers'] },
    { id: 12, part: 3, type: 'mcq', prompt: 'What have researchers discovered about sleep-substitute drugs?', answer: 'c', options: ['They fully replace the functions of deep sleep', 'They work best when combined with regular rest', 'They raise alertness briefly but do not restore deep sleep', 'They have already passed large clinical trials'] },
    { id: 13, part: 3, type: 'mcq', prompt: 'What does the author suggest is the main question for policymakers?', answer: 'a', options: ['Deciding how far the state should go in protecting sleep', 'Funding more research into sleep-substitute drugs', 'Banning late-night emails in all companies', 'Reducing school hours across the country'] },
];

const TYPE_LABELS: Record<QuestionType, string> = {
    tfng: 'True / False / Not Given',
    gap: 'Gap Fill',
    mcq: 'Multiple Choice',
    heading: 'Matching Headings',
};

const CRITERIA_LABELS: Record<QuestionType, string> = {
    tfng: 'TFNG Traps',
    gap: 'Gap-Fill Word Forms',
    mcq: 'Multiple Choice',
    heading: 'Matching Headings',
};

const TFNG_LABELS: Record<string, string> = {
    true: 'True',
    false: 'False',
    ng: 'Not Given',
};

const normalize = (s: string) => s.trim().toLowerCase();

interface HighlightRange {
    paragraph: number;
    start: number;
    end: number;
    color: 'yellow' | 'blue';
}

interface HighlightSegment {
    text: string;
    highlighted: boolean;
    color?: 'yellow' | 'blue';
}

const buildHighlightSegments = (text: string, ranges: HighlightRange[]): HighlightSegment[] => {
    if (ranges.length === 0) return [{ text, highlighted: false }];
    const sorted = [...ranges].sort((a, b) => a.start - b.start || a.end - b.end);
    const merged: HighlightRange[] = [];
    for (const r of sorted) {
        const prev = merged[merged.length - 1];
        if (prev && r.start < prev.end) prev.end = Math.max(prev.end, r.end);
        else merged.push({ ...r });
    }
    const segments: HighlightSegment[] = [];
    let cursor = 0;
    for (const r of merged) {
        if (r.start > cursor) segments.push({ text: text.slice(cursor, r.start), highlighted: false });
        segments.push({ text: text.slice(r.start, r.end), highlighted: true, color: r.color });
        cursor = r.end;
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), highlighted: false });
    return segments;
};

interface ThemeTokens {
    canvas: string;
    headerBg: string;
    headerBorder: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    borderStrong: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accentText: string;
    accentBg: string;
    chipBg: string;
    chipText: string;
    chipBorder: string;
    chipAnsweredBg: string;
    chipAnsweredText: string;
    chipActiveRing: string;
    inputBg: string;
    inputBorder: string;
    inputFocus: string;
    ph: string;
    markYellow: string;
    markBlue: string;
}

const THEMES: Record<ThemeId, ThemeTokens> = {
    default: {
        canvas: 'bg-[#0b0b0b]',
        headerBg: 'bg-[#141414]',
        headerBorder: 'border-neutral-800',
        surface: 'bg-[#141414]',
        surfaceAlt: 'bg-[#0b0b0b]',
        border: 'border-neutral-800',
        borderStrong: 'border-neutral-600',
        textPrimary: 'text-neutral-100',
        textSecondary: 'text-neutral-300',
        textMuted: 'text-neutral-500',
        accentText: 'text-amber-400',
        accentBg: 'bg-amber-400/10',
        chipBg: 'bg-[#141414]',
        chipText: 'text-neutral-400',
        chipBorder: 'border-neutral-700',
        chipAnsweredBg: 'bg-neutral-900',
        chipAnsweredText: 'text-white',
        chipActiveRing: 'ring-2 ring-amber-400',
        inputBg: 'bg-[#0b0b0b]',
        inputBorder: 'border-neutral-800',
        inputFocus: 'focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30',
        ph: 'placeholder:text-neutral-600',
        markYellow: 'bg-yellow-400/40',
        markBlue: 'bg-sky-500/40',
    },
    bw: {
        canvas: 'bg-white',
        headerBg: 'bg-white',
        headerBorder: 'border-neutral-300',
        surface: 'bg-white',
        surfaceAlt: 'bg-neutral-100',
        border: 'border-neutral-300',
        borderStrong: 'border-neutral-900',
        textPrimary: 'text-black',
        textSecondary: 'text-neutral-800',
        textMuted: 'text-neutral-500',
        accentText: 'text-black',
        accentBg: 'bg-neutral-200',
        chipBg: 'bg-white',
        chipText: 'text-black',
        chipBorder: 'border-neutral-400',
        chipAnsweredBg: 'bg-black',
        chipAnsweredText: 'text-white',
        chipActiveRing: 'ring-2 ring-neutral-900',
        inputBg: 'bg-white',
        inputBorder: 'border-neutral-400',
        inputFocus: 'focus:border-black focus:ring-1 focus:ring-neutral-900',
        ph: 'placeholder:text-neutral-400',
        markYellow: 'bg-yellow-200',
        markBlue: 'bg-sky-200',
    },
    yb: {
        canvas: 'bg-black',
        headerBg: 'bg-black',
        headerBorder: 'border-yellow-500/40',
        surface: 'bg-black',
        surfaceAlt: 'bg-neutral-900',
        border: 'border-yellow-600/40',
        borderStrong: 'border-yellow-400',
        textPrimary: 'text-yellow-50',
        textSecondary: 'text-yellow-100/90',
        textMuted: 'text-yellow-500/70',
        accentText: 'text-yellow-300',
        accentBg: 'bg-yellow-400/10',
        chipBg: 'bg-black',
        chipText: 'text-yellow-200',
        chipBorder: 'border-yellow-600/50',
        chipAnsweredBg: 'bg-yellow-400',
        chipAnsweredText: 'text-black',
        chipActiveRing: 'ring-2 ring-yellow-300',
        inputBg: 'bg-black',
        inputBorder: 'border-yellow-600/50',
        inputFocus: 'focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300/40',
        ph: 'placeholder:text-yellow-600/60',
        markYellow: 'bg-yellow-500/40',
        markBlue: 'bg-sky-500/40',
    },
};

interface HighlightMenu {
    x: number;
    y: number;
    kind: 'passage' | 'question';
    part: number;
    paragraph: number;
    qid?: number;
    start: number;
    end: number;
}

const TEXT_SIZE_CLASSES = {
    sm: 'text-[13px]',
    md: 'text-[15px]',
    lg: 'text-[17px]',
};

interface IELTSReadingExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
}

const IELTSReadingExam: React.FC<IELTSReadingExamProps> = ({ candidateEmail, simulation }) => {
    const passageEls = useRef<Record<number, HTMLParagraphElement | null>>({});
    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const rightPaneRef = useRef<HTMLDivElement>(null);
    const splitAreaRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [answers, setAnswers] = useState<string[]>(() => QUESTIONS.map(() => ''));
    const [highlights, setHighlights] = useState<Record<number, HighlightRange[]>>({ 1: [], 2: [], 3: [] });
    const [qHighlights, setQHighlights] = useState<Record<number, HighlightRange[]>>({});
    const [activePart, setActivePart] = useState<1 | 2 | 3>(1);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [reviewed, setReviewed] = useState<number[]>([]);
    const [selectedHeading, setSelectedHeading] = useState<string | null>(null);
    const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');
    const [themeId, setThemeId] = useState<ThemeId>('default');
    const [split, setSplit] = useState(50);
    const [menu, setMenu] = useState<HighlightMenu | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [resultCriteria, setResultCriteria] = useState<{ label: string; band: number }[]>([]);
    const [elapsed, setElapsed] = useState(0);
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [showExitModal, setShowExitModal] = useState(false);

    const t = THEMES[themeId];
    const timeLimit = simulation ? simulation.timeLimitSeconds : 20 * 60;
    const locked = submitted || testState !== 'active';
    const isEvaluating = testState === 'evaluating';
    const remaining = Math.max(0, timeLimit - elapsed);
    const lowTime = remaining <= 300;
    const activeQuestions = QUESTIONS.filter((q) => q.part === activePart);
    const answeredCount = answers.filter((a) => a !== '').length;
    const textSizeCls = TEXT_SIZE_CLASSES[textSize];

    const qIndex = (id: number) => QUESTIONS.findIndex((x) => x.id === id);

    useEffect(() => {
        if (testState !== 'active' || submitted) return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [testState, submitted]);

    useEffect(() => {
        if (openDropdown == null) return;
        const onDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!dropdownRef.current?.contains(target)) setOpenDropdown(null);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [openDropdown]);

    const closeMenu = () => setMenu(null);

    const openMenuFrom = (
        container: HTMLElement,
        range: Range,
        spec: { part: number; paragraph: number; qid?: number }
    ) => {
        const pre = range.cloneRange();
        pre.selectNodeContents(container);
        pre.setEnd(range.startContainer, range.startOffset);
        const start = pre.toString().length;
        const end = start + range.toString().length;
        if (end <= start) return;
        const rect = range.getBoundingClientRect();
        setMenu({
            x: Math.max(4, Math.min(rect.left, window.innerWidth - 260)),
            y: Math.max(8, rect.top - 48),
            kind: spec.qid != null ? 'question' : 'passage',
            part: spec.part,
            paragraph: spec.paragraph,
            qid: spec.qid,
            start,
            end,
        });
    };

    const handlePassageSelect = (e: React.MouseEvent<HTMLElement>, spec: { part: number; paragraph: number }) => {
        if (locked) return;
        const container = e.currentTarget;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        if (!container.contains(range.commonAncestorContainer)) return;
        openMenuFrom(container, range, spec);
        e.stopPropagation();
    };

    const handleQuestionSelect = (e: React.MouseEvent<HTMLParagraphElement>, qid: number) => {
        if (locked) return;
        const container = e.currentTarget;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        if (!container.contains(range.commonAncestorContainer)) return;
        openMenuFrom(container, range, { part: QUESTIONS[qIndex(qid)].part, paragraph: 0, qid });
        e.stopPropagation();
    };

    const applyHighlight = (m: HighlightMenu, color: 'yellow' | 'blue') => {
        if (m.kind === 'passage') {
            setHighlights((prev) => ({
                ...prev,
                [m.part]: [...(prev[m.part] || []), { paragraph: m.paragraph, start: m.start, end: m.end, color }],
            }));
        } else {
            const qid = m.qid as number;
            setQHighlights((prev) => ({
                ...prev,
                [qid]: [...(prev[qid] || []), { paragraph: 0, start: m.start, end: m.end, color }],
            }));
        }
        closeMenu();
    };

    const clearHighlight = (m: HighlightMenu) => {
        if (m.kind === 'passage') {
            setHighlights((prev) => ({
                ...prev,
                [m.part]: (prev[m.part] || []).filter(
                    (r) => !(r.paragraph === m.paragraph && r.start < m.end && m.start < r.end)
                ),
            }));
        } else {
            const qid = m.qid as number;
            setQHighlights((prev) => ({
                ...prev,
                [qid]: (prev[qid] || []).filter((r) => !(r.start < m.end && m.start < r.end)),
            }));
        }
        closeMenu();
    };

    const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rect = splitAreaRef.current?.getBoundingClientRect();
        if (!rect) return;
        const move = (ev: PointerEvent) => {
            const pct = ((ev.clientX - rect.left) / rect.width) * 100;
            setSplit(Math.min(70, Math.max(30, pct)));
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    };

    const setAnswer = (id: number, value: string) => {
        const idx = qIndex(id);
        if (idx < 0) return;
        const next = [...answers];
        next[idx] = value;
        setAnswers(next);
    };

    const toggleReview = (id: number) => {
        setReviewed((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
    };

    const assignHeading = (qid: number, letter: string) => {
        if (locked) return;
        setAnswer(qid, letter);
    };

    const handleHeadingDrop = (e: React.DragEvent, qid: number) => {
        e.preventDefault();
        const h = e.dataTransfer.getData('text/plain');
        if (h) assignHeading(qid, h);
    };

    const clickAssign = (qid: number) => {
        if (selectedHeading) {
            assignHeading(qid, selectedHeading);
            setSelectedHeading(null);
        }
    };

    const goToQuestion = (q: ReadingQuestion) => {
        const partChanged = q.part !== activePart;
        setActivePart(q.part);
        setActiveId(q.id);
        if (partChanged) rightPaneRef.current?.scrollTo({ top: 0 });
        const scroll = () => questionRefs.current[q.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (partChanged) window.setTimeout(scroll, 60);
        else scroll();
    };

    const submit = (force = false) => {
        if (locked) return;
        setTestState('evaluating');
        window.setTimeout(() => {
            const total = QUESTIONS.length;
            const correct = QUESTIONS.reduce((acc, q) => {
                return acc + (normalize(answers[qIndex(q.id)]) === q.answer ? 1 : 0);
            }, 0);
            const scaled = Math.round((correct / total) * 40);
            const typeGroups: QuestionType[] = ['tfng', 'gap', 'heading', 'mcq'];
            const criteria = typeGroups
                .map((grp) => {
                    const qs = QUESTIONS.filter((x) => x.type === grp);
                    if (qs.length === 0) return null;
                    const c = qs.reduce((a, x) => a + (normalize(answers[qIndex(x.id)]) === x.answer ? 1 : 0), 0);
                    return { label: CRITERIA_LABELS[grp], band: rawToBand(Math.round((c / qs.length) * 40)) };
                })
                .filter((x): x is { label: string; band: number } => x != null);
            const timeSpent = Math.max(1, Math.round(elapsed / 60));
            const band = rawToBand(scaled);
            if (simulation) {
                simulation.onComplete({ skill: 'reading', band, score: correct, criteria, timeSpent });
            } else {
                setScore(correct);
                setResultCriteria(criteria);
                addAttempt({
                    id: Date.now(),
                    skill: 'reading',
                    band,
                    score: correct,
                    timeSpent,
                    criteria,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
            }
            setSubmitted(true);
            setTestState('completed');
        }, 900);
    };

    useEffect(() => {
        if (simulation && testState === 'active' && elapsed >= timeLimit) submit(true);
    }, [elapsed, testState, simulation, timeLimit]);

    const startExam = () => {
        if (simulation) return;
        setTestState('active');
    };

    const resetExam = () => {
        setAnswers(QUESTIONS.map(() => ''));
        setHighlights({ 1: [], 2: [], 3: [] });
        setQHighlights({});
        setActivePart(1);
        setActiveId(null);
        setOpenDropdown(null);
        setReviewed([]);
        setSelectedHeading(null);
        setTextSize('md');
        setThemeId('default');
        setSplit(50);
        setSubmitted(false);
        setScore(null);
        setResultCriteria([]);
        setElapsed(0);
        setTestState('lobby');
        setShowExitModal(false);
    };

    const handleExit = () => {
        if (simulation) {
            setShowExitModal(false);
            simulation.onExit?.();
        } else {
            resetExam();
        }
    };

    if (testState === 'lobby') {
        return (
            <IELTSLobbyCard
                skill="reading"
                candidateEmail={candidateEmail || ''}
                title="Reading Hub"
                subtitle="Passage scanning with highlight tooling, matching headings, and TFNG practice."
                onStart={startExam}
            />
        );
    }

    const part = PARTS[activePart - 1];
    const partAnswered = activeQuestions.filter((q) => answers[qIndex(q.id)] !== '').length;
    const band = score != null ? rawToBand(Math.round((score / QUESTIONS.length) * 40)) : null;

    const renderSegments = (segs: HighlightSegment[]) =>
        segs.map((s, i) =>
            s.highlighted ? (
                <mark key={i} className={`${s.color === 'blue' ? t.markBlue : t.markYellow} rounded-sm px-0.5`}>
                    {s.text}
                </mark>
            ) : (
                <span key={i}>{s.text}</span>
            )
        );

    const renderPassageText = (p: ReadingPart) => {
        const ranges = (highlights[p.id] || []).filter((r) => r.paragraph === 0);
        const segs = buildHighlightSegments(p.text, ranges);
        return (
            <p
                ref={(el) => { passageEls.current[p.id] = el; }}
                onMouseUp={(e) => handlePassageSelect(e, { part: p.id, paragraph: 0 })}
                className={`${textSizeCls} whitespace-pre-line leading-relaxed ${t.textSecondary} select-text`}
            >
                {renderSegments(segs)}
            </p>
        );
    };

    const renderPart2Paragraphs = () => {
        const paragraphs = PASSAGE_P2.split('\n\n');
        return paragraphs.map((para, i) => {
            const qid = 6 + i;
            const idx = qIndex(qid);
            const heading = answers[idx];
            const headingObj = HEADINGS.find((h) => h.id === heading);
            const segs = buildHighlightSegments(para, (highlights[2] || []).filter((r) => r.paragraph === i));
            return (
                <div key={i} className="mb-6">
                    <p
                        onMouseUp={(e) => handlePassageSelect(e, { part: 2, paragraph: i })}
                        className={`${textSizeCls} leading-relaxed ${t.textSecondary} select-text`}
                    >
                        {renderSegments(segs)}
                    </p>
                    <div
                        onDrop={(e) => handleHeadingDrop(e, qid)}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                        onClick={() => clickAssign(qid)}
                        className={`mt-2 rounded-md border-2 border-dashed px-3 py-1.5 flex items-center gap-2 text-[11px] cursor-pointer transition-colors ${
                            heading ? 'border-emerald-400/50 bg-emerald-400/5' : t.chipBorder + ' ' + t.surfaceAlt
                        }`}
                    >
                        <span className={`uppercase tracking-wider ${t.textMuted} font-semibold`}>Heading</span>
                        <span className={heading ? 'text-emerald-400' : t.textMuted}>
                            {heading ? `${heading}. ${headingObj?.text}` : selectedHeading ? `Click to assign ${selectedHeading}` : 'Drop heading here'}
                        </span>
                    </div>
                </div>
            );
        });
    };

    const renderTfng = (q: ReadingQuestion, idx: number) => {
        const open = openDropdown === q.id;
        return (
            <div className="relative" ref={(el) => { if (openDropdown === q.id) dropdownRef.current = el; }}>
                <button
                    onClick={() => setOpenDropdown(open ? null : q.id)}
                    disabled={locked}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-sm outline-none ${t.inputBg} ${t.inputBorder} ${open ? t.inputFocus : ''} ${t.textPrimary} disabled:opacity-50 transition-colors`}
                >
                    <span className={answers[idx] ? '' : t.textMuted}>
                        {answers[idx] ? TFNG_LABELS[answers[idx]] : 'Select an answer…'}
                    </span>
                    <span className={t.textMuted}>▾</span>
                </button>
                {open && (
                    <div className={`absolute z-10 left-0 right-0 mt-1 rounded-lg border ${t.border} ${t.surfaceAlt} shadow-xl overflow-hidden`}>
                        {(['true', 'false', 'ng'] as const).map((opt) => {
                            const sel = normalize(answers[idx]) === opt;
                            return (
                                <button
                                    key={opt}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        if (!locked) {
                                            setAnswer(q.id, opt);
                                            setOpenDropdown(null);
                                        }
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between transition-colors ${sel ? t.accentText + ' bg-amber-400/10' : t.textSecondary + ' hover:bg-amber-400/10'}`}
                                >
                                    <span>{TFNG_LABELS[opt]}</span>
                                    {sel && <span>●</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderGap = (q: ReadingQuestion, idx: number) => (
        <input
            value={answers[idx]}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            disabled={locked}
            placeholder="Type your answer…"
            className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${t.inputBg} ${t.inputBorder} ${t.inputFocus} ${t.textPrimary} ${t.ph} disabled:opacity-50 transition-colors`}
        />
    );

    const renderMcq = (q: ReadingQuestion, idx: number) => (
        <div className="space-y-2">
            {q.options?.map((opt, oi) => {
                const letter = String.fromCharCode(65 + oi);
                const sel = normalize(answers[idx]) === letter.toLowerCase();
                return (
                    <button
                        key={letter}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            if (!locked) setAnswer(q.id, letter);
                        }}
                        disabled={locked}
                        className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                            sel ? 'bg-amber-400/10 border-amber-400/50' : t.surfaceAlt + ' ' + t.border + ' hover:border-amber-400/40'
                        } ${t.textSecondary} disabled:opacity-50`}
                    >
                        <span className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-[10px] font-semibold ${sel ? 'bg-amber-400 text-black border-amber-400' : t.chipBorder + ' ' + t.textMuted}`}>
                            {letter}
                        </span>
                        <span>{opt}</span>
                    </button>
                );
            })}
        </div>
    );

    const renderHeading = (q: ReadingQuestion, idx: number) => {
        const heading = answers[idx];
        const headingObj = HEADINGS.find((h) => h.id === heading);
        return (
            <div
                onDrop={(e) => handleHeadingDrop(e, q.id)}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                onClick={() => clickAssign(q.id)}
                className={`rounded-lg border-2 border-dashed p-3 text-center text-sm cursor-pointer transition-colors ${
                    heading ? 'border-emerald-400/50 bg-emerald-400/5' : t.chipBorder + ' ' + t.surfaceAlt
                }`}
            >
                {heading ? (
                    <span className={t.textSecondary}>
                        <span className="font-mono mr-1 text-emerald-400">{heading}.</span>
                        {headingObj?.text}
                    </span>
                ) : (
                    <span className={t.textMuted}>
                        {selectedHeading ? `Click to assign heading ${selectedHeading}` : 'Drop heading here or click a heading chip below'}
                    </span>
                )}
            </div>
        );
    };

    const renderAnswer = (q: ReadingQuestion, idx: number) => {
        if (q.type === 'tfng') return renderTfng(q, idx);
        if (q.type === 'gap') return renderGap(q, idx);
        if (q.type === 'mcq') return renderMcq(q, idx);
        return renderHeading(q, idx);
    };

    const renderQuestion = (q: ReadingQuestion) => {
        const idx = qIndex(q.id);
        const isActive = activeId === q.id;
        const flagged = reviewed.includes(q.id);
        const promptSegs = buildHighlightSegments(q.prompt, qHighlights[q.id] || []);
        return (
            <div
                key={q.id}
                ref={(el) => { questionRefs.current[q.id] = el; }}
                onClick={() => setActiveId(q.id)}
                className={`rounded-xl border p-4 ${t.surface} ${isActive ? t.chipActiveRing : t.border} transition-shadow`}
            >
                <div className="flex items-center justify-between gap-3 mb-3">
                    <span className={`text-[10px] uppercase tracking-wider ${t.textMuted} font-semibold`}>
                        Question {q.id} · {TYPE_LABELS[q.type]}
                    </span>
                    <button
                        onClick={() => toggleReview(q.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider border transition-colors ${
                            flagged ? 'text-amber-400 border-amber-400/40 bg-amber-400/10' : t.textMuted + ' ' + t.border + ' hover:' + t.textPrimary
                        }`}
                    >
                        ⚑ {flagged ? 'Flagged' : 'Review'}
                    </button>
                </div>
                <p
                    onMouseUp={(e) => handleQuestionSelect(e, q.id)}
                    className={`${textSizeCls} ${t.textSecondary} mb-3 select-text`}
                >
                    {renderSegments(promptSegs)}
                </p>
                {renderAnswer(q, idx)}
            </div>
        );
    };

    const renderChip = (q: ReadingQuestion) => {
        const idx = qIndex(q.id);
        const answered = answers[idx] !== '';
        const flagged = reviewed.includes(q.id);
        const active = activeId === q.id;
        return (
            <button
                key={q.id}
                onClick={() => goToQuestion(q)}
                title={`Question ${q.id}${answered ? ' · answered' : ''}${flagged ? ' · flagged' : ''}`}
                className={`w-8 h-8 flex items-center justify-center text-[11px] font-mono border relative transition-all border-b-2 ${
                    flagged ? 'rounded-full' : 'rounded-md'
                } ${
                    answered
                        ? `${t.chipAnsweredBg} ${t.chipAnsweredText} border-b-amber-400`
                        : `${t.chipBg} ${t.chipText} ${t.chipBorder}`
                } ${active ? t.chipActiveRing : ''}`}
            >
                {q.id}
                {flagged && <span className="absolute -top-1.5 -right-1.5 text-[9px] text-amber-400">⚑</span>}
            </button>
        );
    };

    return (
        <div className={`flex flex-col h-full ${t.canvas} ${t.textPrimary}`} onMouseUp={closeMenu}>
            <header className={`shrink-0 border-b ${t.headerBorder} ${t.headerBg} px-4 py-2.5 flex items-center justify-between gap-4`}>
                <div className="flex items-center gap-4 min-w-0">
                    {testState === 'active' && (
                        <button
                            onClick={() => setShowExitModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-[11px] text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        >
                            <span>⬅️</span> Exit Exam
                        </button>
                    )}
                    <div className="min-w-0">
                        <p className={`text-[10px] uppercase tracking-wider ${t.textMuted} font-semibold truncate`}>
                            {candidateEmail || 'farmgate@stephen.ai'} · Candidate ID
                        </p>
                        <p className="text-sm font-semibold truncate">
                            Reading — Part {activePart} · {part.title}
                        </p>
                    </div>
                    <div className={`hidden md:flex items-center gap-0.5 rounded-lg border ${t.border} p-0.5`}>
                        {(['sm', 'md', 'lg'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setTextSize(s)}
                                className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider transition-colors ${textSize === s ? t.accentText + ' ' + t.accentBg : t.textMuted}`}
                            >
                                {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
                            </button>
                        ))}
                    </div>
                    <div className={`hidden xl:flex items-center gap-0.5 rounded-lg border ${t.border} p-0.5`}>
                        {([['default', 'Default'], ['bw', 'Black on White'], ['yb', 'Yellow on Black']] as [ThemeId, string][]).map(([id, label]) => (
                            <button
                                key={id}
                                onClick={() => setThemeId(id)}
                                className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider transition-colors ${themeId === id ? t.accentText + ' ' + t.accentBg : t.textMuted}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={`rounded-lg border px-3 py-1.5 text-center shrink-0 ${t.border} ${lowTime && testState === 'active' ? 'animate-pulse border-red-500/40 bg-red-500/10' : ''}`}>
                    <p className={`text-[10px] uppercase tracking-wider ${t.textMuted} font-semibold`}>Time Remaining</p>
                    <p className={`font-mono text-sm ${lowTime && testState === 'active' ? 'text-red-500' : ''}`}>
                        {formatClock(remaining)}
                    </p>
                </div>
            </header>

            {submitted && !simulation && score != null && band != null ? (
                <div className={`flex-1 min-h-0 overflow-y-auto p-6 md:p-8 ${t.surface}`}>
                    <div className="max-w-2xl mx-auto rounded-2xl border border-amber-500/20 bg-[#141414] p-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                                <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Reading Band</p>
                                <p className="text-3xl font-semibold tracking-tight text-amber-400">{band.toFixed(1)}</p>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <p className="text-sm text-neutral-300">
                                    Raw score: <span className="font-mono text-white">{score}/{QUESTIONS.length}</span> scaled against the 40-item band scale.
                                </p>
                                <p className="text-xs text-neutral-600 mt-1">
                                    Time: {Math.max(1, Math.round(elapsed / 60))} min · Attempt logged to the IELTS tracker.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
                            {resultCriteria.map((c, i) => (
                                <div key={i} className="rounded-lg border border-neutral-800 bg-[#0b0b0b] px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wider text-neutral-500">{c.label}</p>
                                    <p className="text-sm font-mono text-amber-400 mt-0.5">{c.band.toFixed(1)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div ref={splitAreaRef} className="flex-1 min-h-0 flex">
                        <div style={{ width: `${split}%` }} className="h-full min-w-0 flex flex-col">
                            <div className={`shrink-0 border-b ${t.headerBorder} ${t.headerBg} px-4 py-2 flex items-center justify-between gap-2`}>
                                <span className={`text-[10px] uppercase tracking-wider ${t.textMuted} font-semibold`}>
                                    Reading Passage · Part {activePart}
                                </span>
                                <span className={`text-[11px] font-mono ${t.textMuted}`}>
                                    {part.text.trim().split(/\s+/).length} words
                                </span>
                            </div>
                            <div className={`flex-1 min-h-0 overflow-y-auto ${t.surface} p-5`} onScroll={closeMenu}>
                                {activePart === 2 ? renderPart2Paragraphs() : renderPassageText(part)}
                            </div>
                        </div>

                        <div
                            onPointerDown={startResize}
                            className="w-1.5 shrink-0 cursor-col-resize select-none border-x border-neutral-800 hover:bg-amber-400/50 transition-colors"
                        />

                        <div className="flex-1 h-full min-w-0 flex flex-col">
                            <div className={`shrink-0 border-b ${t.headerBorder} ${t.headerBg} px-4 py-2 flex items-center justify-between gap-2`}>
                                <span className={`text-[10px] uppercase tracking-wider ${t.textMuted} font-semibold`}>
                                    Questions {activeQuestions[0]?.id}–{activeQuestions[activeQuestions.length - 1]?.id}
                                </span>
                                <span className={`text-[11px] font-mono ${t.textMuted}`}>
                                    {partAnswered}/{activeQuestions.length} answered
                                </span>
                            </div>
                            <div ref={rightPaneRef} className={`flex-1 min-h-0 overflow-y-auto ${t.surface} p-4 space-y-4`} onScroll={closeMenu}>
                                {activePart === 2 && (
                                    <div className={`rounded-xl border ${t.border} ${t.surfaceAlt} p-3`}>
                                        <p className={`text-[10px] uppercase tracking-wider ${t.textMuted} font-semibold mb-2`}>
                                            Heading Bank · drag onto a paragraph or click then click a paragraph
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {HEADINGS.map((h) => (
                                                <button
                                                    key={h.id}
                                                    draggable
                                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', h.id)}
                                                    onClick={() => setSelectedHeading((sel) => (sel === h.id ? null : h.id))}
                                                    className={`px-2.5 py-1.5 rounded-md border text-[11px] cursor-grab transition-colors ${
                                                        selectedHeading === h.id
                                                            ? 'bg-amber-400/10 border-amber-400/50 ' + t.accentText
                                                            : t.chipBg + ' ' + t.chipBorder + ' ' + t.textSecondary + ' hover:border-amber-400/40'
                                                    }`}
                                                >
                                                    <span className="font-mono mr-1">{h.id}.</span>
                                                    {h.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeQuestions.map(renderQuestion)}
                            </div>
                        </div>
                    </div>

                    <footer className={`shrink-0 border-t ${t.headerBorder} ${t.headerBg} px-4 py-3`}>
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <span className={`text-[10px] uppercase tracking-wider ${t.textMuted} font-semibold`}>Question Navigator</span>
                            <div className="flex items-center gap-3">
                                <span className={`text-[11px] font-mono ${t.textMuted}`}>{answeredCount}/{QUESTIONS.length} answered</span>
                                {reviewed.length > 0 && <span className={`text-[11px] font-mono ${t.textMuted}`}>{reviewed.length} flagged</span>}
                                <button
                                    onClick={() => submit(false)}
                                    disabled={locked}
                                    className="px-4 py-2 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200 disabled:opacity-50"
                                >
                                    {isEvaluating ? 'Submitting…' : simulation ? 'Submit Section' : 'Submit'}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-start gap-6 overflow-x-auto pb-1">
                            {PARTS.map((p) => (
                                <div key={p.id} className="shrink-0">
                                    <button
                                        onClick={() => setActivePart(p.id)}
                                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${activePart === p.id ? t.accentText + ' ' + t.accentBg : t.textMuted}`}
                                    >
                                        Part {p.id} · {p.title}
                                    </button>
                                    <div className="flex gap-1.5 mt-1.5">
                                        {QUESTIONS.filter((q) => q.part === p.id).map(renderChip)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </footer>
                </>
            )}

            {menu && (
                <div
                    className="fixed z-50 flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-900 px-2 py-1.5 shadow-2xl"
                    style={{ top: menu.y, left: menu.x }}
                    onMouseUp={(e) => e.stopPropagation()}
                >
                    <button
                        onMouseDown={(e) => { e.preventDefault(); applyHighlight(menu, 'yellow'); }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-neutral-200 hover:bg-white/10 transition-colors"
                    >
                        <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" /> Highlight
                    </button>
                    <button
                        onMouseDown={(e) => { e.preventDefault(); applyHighlight(menu, 'blue'); }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-neutral-200 hover:bg-white/10 transition-colors"
                    >
                        <span className="w-3 h-3 rounded-sm bg-sky-500 inline-block" /> Blue
                    </button>
                    <span className="w-px h-4 bg-neutral-700" />
                    <button
                        onMouseDown={(e) => { e.preventDefault(); clearHighlight(menu); }}
                        className="px-2.5 py-1 rounded-md text-[11px] text-neutral-200 hover:bg-white/10 transition-colors"
                    >
                        Clear Highlight
                    </button>
                </div>
            )}

            <IELTSExitModal
                open={showExitModal}
                onConfirm={handleExit}
                onCancel={() => setShowExitModal(false)}
            />
        </div>
    );
};

export default IELTSReadingExam;