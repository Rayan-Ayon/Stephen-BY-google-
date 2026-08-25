import React, { useState, useRef, useEffect } from 'react';
import { addAttempt, rawToBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';
import IeltsExamOptionsModal from '../../exam/IeltsExamOptionsModal';
import { Part2Content, ANSWER_HEADINGS, MULTI_SELECT_GROUPS, GROUP_ANSWERS, GAP_FILL, GAP_ANSWERS, type PartContentHandle } from './ReadingPart2';
import { Part3Content, PART3_TITLE, PART3_PASSAGE, PART3_ANSWERS, PART3_TFNG } from './ReadingPart3';
const Wifi = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
);
const Bell = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const Menu = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const Edit = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const Check = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
interface ReadingQuestion {
    id: number;
    part: 1 | 2 | 3;
    type: 'tfng' | 'gap' | 'mcq' | 'heading' | 'multiselect';
    prompt?: string;
    answer: string;
    options?: string[];
}

interface ReadingPart {
    id: 1 | 2 | 3;
    title: string;
    instructions: string;
    text: string;
}

const PASSAGE_P1 = `Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Poland in 1867, she is famous for her work on radioactivity, and was twice a winner of the Nobel Prize. With her husband, Pierre Curie, and Henri Becquerel, she was awarded the 1903 Nobel Prize for Physics, and was then sole winner of the 1911 Nobel Prize for Chemistry. She was the first woman to win a Nobel Prize.

From childhood, Marie was remarkable for her prodigious memory, and at the age of 16 won a gold medal on completion of her secondary education. Because her father lost his savings through bad investment, she then had to take work as a teacher. From her earnings she was able to finance her sister Bronia’s medical studies in Paris, on the understanding that Bronia would, in turn, later help her to get an education.

In 1891 this promise was fulfilled and Marie went to Paris and began to study at the Sorbonne (the University of Paris). She often worked far into the night and lived on little more than bread and butter and tea. She came first in the examination in the physical sciences in 1893, and in 1894 was placed second in the examination in mathematical sciences. It was not until the spring of that year that she was introduced to Pierre Curie.

Their marriage in 1895 marked the start of a partnership that was soon to achieve results of world significance. Following Henri Becquerel’s discovery in 1896 of a new phenomenon, which Marie later called ‘radioactivity’, Marie Curie decided to find out if the radioactivity discovered in uranium was to be found in other elements. She discovered that this was true for thorium.

Turning her attention to minerals, she found her interest drawn to pitchblende, a mineral whose radioactivity, superior to that of pure uranium, could be explained only by the presence in the ore of small quantities of an unknown substance of very high activity. Pierre Curie joined her in the work that she had undertaken to resolve this problem, and that led to the discovery of the new elements, polonium and radium. While Pierre Curie devoted himself chiefly to the physical study of the new radiations, Marie Curie struggled to obtain pure radium in the metallic state. This was achieved with the help of the chemist André-Louis Debierne, one of Pierre Curie’s pupils. Based on the results of this research, Marie Curie received her Doctorate of Science, and in 1903 Marie and Pierre shared with Becquerel the Nobel Prize for Physics for the discovery of radioactivity.

The births of Marie’s two daughters, Irène and Eve, in 1897 and 1904 failed to interrupt her scientific work. She was appointed lecturer in physics at the École Normale Supérieure for girls in Sèvres, France (1900), and introduced a method of teaching based on experimental demonstrations. In December 1904 she was appointed chief assistant in the laboratory directed by Pierre Curie.

The sudden death of her husband in 1906 was a bitter blow to Marie Curie, but was also a turning point in her career: henceforth she was to devote all her energy to completing alone the scientific work that they had undertaken. On May 13, 1906, she was appointed to the professorship that had been left vacant on her husband’s death, becoming the first woman to teach at the Sorbonne. In 1911 she was awarded the Nobel Prize for Chemistry for the isolation of a pure form of radium.

During World War I, Marie Curie, with the help of her daughter Irène, devoted herself to the development of the use of X-radiography, including the mobile units which came to be known as ‘Little Curies’, used for the treatment of wounded soldiers. In 1918 the Radium Institute, whose staff Irène had joined, began to operate in earnest, and became a centre for nuclear physics and chemistry. Marie Curie, now at the highest point of her fame and, from 1922, a member of the Academy of Medicine, researched the chemistry of radioactive substances and their medical applications.

In 1921, accompanied by her two daughters, Marie Curie made a triumphant journey to the United States to raise funds for research on radium. Women there presented her with a gram of radium for her campaign. Marie also gave lectures in Belgium, Brazil, Spain and Czechoslovakia and, in addition, had the satisfaction of seeing the development of the Curie Foundation in Paris, and the inauguration in 1932 in Warsaw of the Radium Institute, where her sister Bronia became director.

One of Marie Curie’s outstanding achievements was to have understood the need to accumulate intense radioactive sources, not only to treat illness but also to maintain an abundant supply for research. The existence in Paris at the Radium Institute of a stock of 1.5 grams of radium made a decisive contribution to the success of the experiments undertaken in the years around 1930. This work prepared the way for the discovery of the neutron by Sir James Chadwick and, above all, for the discovery in 1934 by Irène and Frédéric Joliot-Curie of artificial radioactivity. A few months after this discovery, Marie Curie died as a result of leukaemia caused by exposure to radiation.`;

const PARTS: ReadingPart[] = [
    { id: 1, title: 'The life and work of Marie Curie', instructions: 'Read the text and answer questions 1–13.', text: PASSAGE_P1 },
    { id: 2, title: 'The Physics of Traffic Behavior', instructions: 'Read the text and answer questions 14–26.', text: '' },
    { id: 3, title: PART3_TITLE, instructions: 'Read the text and answer questions 27–40.', text: PART3_PASSAGE },
];

const QUESTIONS: ReadingQuestion[] = [
    { id: 1, part: 1, type: 'tfng', prompt: 'Marie Curie’s husband was a joint winner of both Marie’s Nobel Prizes.', answer: 'false' },
    { id: 2, part: 1, type: 'tfng', prompt: 'Marie became interested in science when she was a child.', answer: 'ng' },
    { id: 3, part: 1, type: 'tfng', prompt: 'Marie was able to attend the Sorbonne because of her sister’s financial contribution.', answer: 'true' },
    { id: 4, part: 1, type: 'tfng', prompt: 'Marie stopped doing research for several years when her children were born.', answer: 'false' },
    { id: 5, part: 1, type: 'tfng', prompt: 'Marie took over the teaching position her husband had held.', answer: 'true' },
    { id: 6, part: 1, type: 'tfng', prompt: 'Marie’s sister Bronia studied the medical uses of radioactivity.', answer: 'ng' },
    { id: 7, part: 1, type: 'gap', prompt: 'Marie Curie’s research on radioactivity.\n\nWhen she discovered that radioactivity was not restricted to uranium, she began researching ____', answer: 'minerals' },
    { id: 8, part: 1, type: 'gap', prompt: 'She found that pitchblende was highly radioactive because it contained ____', answer: 'elements' },
    { id: 9, part: 1, type: 'gap', prompt: 'In 1911 she won her second Nobel Prize for isolating ____', answer: 'radium' },
    { id: 10, part: 1, type: 'gap', prompt: 'She developed X-radiography for the medical treatment of ____', answer: 'soldiers' },
    { id: 11, part: 1, type: 'gap', prompt: 'She collected a large supply of radioactive sources to be used for ____', answer: 'illness' },
    { id: 12, part: 1, type: 'gap', prompt: 'In the US, women gave her a gram of ____', answer: 'radium' },
    { id: 13, part: 1, type: 'gap', prompt: 'She saw the Radium Institute established in Paris, and another in ____', answer: 'warsaw' },
];

// Real INSPERA-style questions for part 2 (matching headings 14-17, multi-select 18-23, summary gap-fill 24-26)
for (const key of Object.keys(ANSWER_HEADINGS)) {
    QUESTIONS.push({ id: Number(key), part: 2, type: 'heading', answer: ANSWER_HEADINGS[key] });
}
for (const group of MULTI_SELECT_GROUPS) {
    for (const qid of group.questionIds) {
        QUESTIONS.push({ id: qid, part: 2, type: 'multiselect', answer: GROUP_ANSWERS[String(qid)] });
    }
}
for (const q of GAP_FILL) {
    QUESTIONS.push({ id: q.questionId, part: 2, type: 'gap', answer: GAP_ANSWERS[String(q.questionId)] });
}

// Real Plain English questions for part 3 (TFNG 27-33, summary gap-fill 34-40)
for (const q of PART3_TFNG) {
    QUESTIONS.push({ id: q.id, part: 3, type: 'tfng', prompt: q.statement, answer: q.answer });
}
for (const qid of [34, 35, 36, 37, 38, 39, 40]) {
    QUESTIONS.push({ id: qid, part: 3, type: 'gap', answer: PART3_ANSWERS[qid] });
}

type TestState = 'lobby' | 'active' | 'evaluating' | 'completed';

interface IELTSReadingExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
    onActiveChange?: (active: boolean) => void;
}

const normalize = (s: string) => s.trim().toLowerCase();

const IELTSReadingExam: React.FC<IELTSReadingExamProps> = ({ candidateEmail, simulation, onActiveChange }) => {
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [activePart, setActivePart] = useState<1 | 2 | 3>(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [split, setSplit] = useState(50);
    const splitAreaRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number>(1);
    
    const [showExitModal, setShowExitModal] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [score, setScore] = useState<number | null>(null);
    const part1Refs = useRef<Record<number, HTMLDivElement | null>>({});
    const contentRef = useRef<PartContentHandle | null>(null);

    const timeLimit = simulation ? simulation.timeLimitSeconds : 60 * 60;
    const locked = testState !== 'active';
    const remaining = Math.max(0, timeLimit - elapsed);
    const lowTime = remaining <= 300;

    useEffect(() => {
        if (testState !== 'active') return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [testState]);

    const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rect = splitAreaRef.current?.parentElement?.getBoundingClientRect();
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
        if (locked) return;
        setAnswers((prev) => ({ ...prev, [id]: value }));
        setActiveId(id);
    };

    const handleExit = () => {
        if (simulation) {
            setShowExitModal(false);
            simulation.onExit?.();
        } else {
            setTestState('lobby');
            setShowExitModal(false);
        }
    };

    useEffect(() => {
        onActiveChange?.(testState === 'active' || testState === 'evaluating');
    }, [testState, onActiveChange]);

    const submit = () => {
        if (locked) return;
        setTestState('evaluating');
        window.setTimeout(() => {
            const correct = QUESTIONS.reduce((acc, q) => {
                return acc + (normalize(answers[q.id] || '') === normalize(q.answer) ? 1 : 0);
            }, 0);
            const timeSpent = Math.max(1, Math.round(elapsed / 60));
            const band = rawToBand(correct);
            if (simulation) {
                simulation.onComplete({ skill: 'reading', band, score: correct, timeSpent, criteria: [] });
            } else {
                setScore(correct);
                addAttempt({
                    id: Date.now(),
                    skill: 'reading',
                    band,
                    score: correct,
                    timeSpent,
                    criteria: [],
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
            }
            setTestState('completed');
        }, 900);
    };

    if (testState === 'lobby') {
        return (
            <IELTSLobbyCard
                skill="reading"
                candidateEmail={candidateEmail || ''}
                title="Inspera Assessment Clone"
                subtitle="1:1 visual clone of the official IDP exam paper engine."
                onStart={() => setTestState('active')}
            />
        );
    }

    if (testState === 'evaluating' || testState === 'completed') {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F2F2]">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full border border-[#CCCCCC]">
                    <h2 className="text-2xl font-bold text-[#0072CE] mb-4">Exam Completed</h2>
                    {testState === 'evaluating' ? (
                        <p className="text-neutral-600">Evaluating your answers...</p>
                    ) : (
                        <>
                            <p className="text-lg text-neutral-800 mb-2">Score: <strong>{score}</strong> / 40</p>
                            <p className="text-lg text-neutral-800 mb-6">Band: <strong>{rawToBand(score || 0).toFixed(1)}</strong></p>
                            <button onClick={() => setTestState('lobby')} className="px-6 py-2 bg-[#0072CE] text-white rounded hover:bg-blue-700 transition-colors">Return to Lobby</button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const currentQuestions = QUESTIONS.filter((q) => q.part === activePart);
    const part = PARTS.find((p) => p.id === activePart)!;

    const scrollToQuestion = (id: number, part: 1 | 2 | 3) => {
        window.setTimeout(() => {
            if (part === 1) {
                part1Refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                contentRef.current?.scrollTo(id);
            }
        }, 80);
    };

    const goTo = (id: number) => {
        const p = (QUESTIONS.find((q) => q.id === id)?.part ?? 1) as 1 | 2 | 3;
        setActiveId(id);
        setActivePart(p);
        scrollToQuestion(id, p);
    };

    const navigateQuestion = (dir: 1 | -1) => {
        const curIdx = QUESTIONS.findIndex(q => q.id === activeId);
        if (curIdx === -1) return;
        const nextIdx = curIdx + dir;
        if (nextIdx >= 0 && nextIdx < QUESTIONS.length) {
            const next = QUESTIONS[nextIdx];
            setActiveId(next.id);
            if (next.part !== activePart) {
                setActivePart(next.part);
            }
            scrollToQuestion(next.id, next.part);
        }
    };

    const tfngOptions = [
        { label: 'TRUE', value: 'true' },
        { label: 'FALSE', value: 'false' },
        { label: 'NOT GIVEN', value: 'ng' }
    ];

    const getAnsweredCount = (partId: number) => {
        return QUESTIONS.filter(q => q.part === partId && answers[q.id] && answers[q.id].trim() !== '').length;
    };
    const getTotalCount = (partId: number) => {
        return QUESTIONS.filter(q => q.part === partId).length;
    };

    return (
        <div className="flex flex-col h-full relative bg-[#FFFFFF] text-black font-sans min-w-0" style={{ flex: 1 }}>
            {/* Top Navigation Bar */}
            <header className="shrink-0 h-[60px] border-b border-[#CCCCCC] bg-[#FFFFFF] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <span className="text-[#D32F2F] text-2xl font-black tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>IELTS<sup className="text-sm">™</sup></span>
                    <span className="text-sm font-semibold text-black tracking-wide ml-2">Test taker ID</span>
                </div>
                <div className="flex items-center gap-5 text-black">
                    <Wifi size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <Bell size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <button onClick={() => setIsOptionsOpen(true)} aria-label="Open options" className="cursor-pointer">
                        <Menu size={20} strokeWidth={2.5} />
                    </button>
                    <Edit size={20} strokeWidth={2.5} className="cursor-pointer" />
                </div>
            </header>

            <IeltsExamOptionsModal open={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} />

            {/* Sub-Header Banner */}
            <div className="shrink-0 bg-[#F5F5F5] border border-[#CCCCCC] px-6 py-4 mx-4 mt-4 rounded-md flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-lg font-bold mb-1">Part {activePart}</h2>
                    <p className="text-sm text-neutral-800">{part.instructions}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#CCCCCC] text-[11px] text-neutral-600 hover:text-red-600 hover:border-red-400 transition-colors"
                    >
                        <span>⬅️</span> Exit Exam
                    </button>
                    <div className={`rounded-md border bg-white px-3 py-1.5 text-center ${lowTime ? 'border-red-400 animate-pulse' : 'border-[#CCCCCC]'}`}>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Time Remaining</p>
                        <p className={`font-mono text-sm ${lowTime ? 'text-red-600' : 'text-neutral-800'}`}>{formatClock(remaining)}</p>
                    </div>
                </div>
            </div>

            {/* Dual Split-Pane Layout */}
            <div className="flex-1 min-h-0 flex mx-4 mb-4 mt-2 border-t border-[#CCCCCC] relative overflow-hidden bg-[#FFFFFF]" ref={splitAreaRef}>
                {activePart === 2 ? (
                    <Part2Content
                        ref={contentRef}
                        candidateEmail={candidateEmail}
                        answers={answers}
                        onAnswer={setAnswer}
                        locked={locked}
                    />
                ) : activePart === 3 ? (
                    <Part3Content
                        ref={contentRef}
                        candidateEmail={candidateEmail}
                        answers={answers}
                        onAnswer={setAnswer}
                        locked={locked}
                    />
                ) : (
                <>
                {/* Left Passage Pane */}
                <div style={{ width: `${split}%` }} className="h-full min-w-0 overflow-y-auto pr-6 pt-4 pb-20 custom-scrollbar">
                    <h3 className="text-[17px] font-bold mb-4">{part.title}</h3>
                    <div className="text-[15px] leading-[1.6] text-neutral-900 whitespace-pre-line">
                        {part.text}
                    </div>
                </div>

                {/* Draggable Splitter Divider */}
                <div
                    onPointerDown={startResize}
                    className="w-8 shrink-0 cursor-col-resize select-none flex items-center justify-center group z-10 -ml-4"
                >
                    <div className="w-px h-full bg-[#CCCCCC] group-hover:bg-[#0072CE] transition-colors relative flex items-center justify-center">
                        <div className="absolute w-6 h-8 bg-white border border-[#CCCCCC] rounded-sm flex items-center justify-center shadow-sm text-neutral-500 text-lg group-hover:border-[#0072CE] group-hover:text-[#0072CE]">
                            ↕
                        </div>
                    </div>
                </div>

                {/* Right Question Pane */}
                <div style={{ width: `${100 - split}%` }} className="h-full min-w-0 overflow-y-auto pl-6 pt-4 pb-20 bg-[#F9F9F9] border-l border-[#CCCCCC] custom-scrollbar relative">
                    <div className="max-w-2xl bg-white p-6 rounded-md shadow-sm border border-[#CCCCCC]">
                        <div className="mb-6">
                            <h4 className="font-bold text-base mb-1">Questions {currentQuestions[0]?.id}–{currentQuestions[currentQuestions.length - 1]?.id}</h4>
                            <p className="text-sm text-neutral-700">
                                {currentQuestions[0]?.type === 'tfng' 
                                    ? 'Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.'
                                    : 'Complete the notes. Write ONE WORD ONLY from the text for each answer.'}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {currentQuestions.map((q) => {
                                const isActive = activeId === q.id;
                                const isAnswered = answers[q.id] && answers[q.id].trim() !== '';

                                return (
                                    <div key={q.id} ref={(el) => { part1Refs.current[q.id] = el; }} className="relative group cursor-pointer" onClick={() => setActiveId(q.id)}>
                                        <div className="flex gap-3 items-start">
                                            {/* Monospaced blue square border for question number (only for TFNG/MCQ) */}
                                            {q.type !== 'gap' && (
                                                <div className={`shrink-0 w-7 h-7 flex items-center justify-center border font-mono text-sm font-semibold ${isActive ? 'border-[#0072CE] text-[#0072CE]' : 'border-neutral-400 text-neutral-800'}`}>
                                                    {q.id}
                                                </div>
                                            )}
                                            
                                            <div className="flex-1">
                                                {q.type === 'tfng' && (
                                                    <div>
                                                        <p className="text-[15px] mb-3 text-neutral-900">{q.prompt}</p>
                                                        <div className="space-y-1">
                                                            {tfngOptions.map(opt => {
                                                                const isSelected = answers[q.id] === opt.value;
                                                                return (
                                                                    <label 
                                                                        key={opt.value} 
                                                                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${isSelected ? 'bg-[#D0E8FF]' : 'hover:bg-neutral-50'}`}
                                                                    >
                                                                        <input 
                                                                            type="radio" 
                                                                            name={`q-${q.id}`} 
                                                                            value={opt.value}
                                                                            checked={isSelected}
                                                                            onChange={(e) => setAnswer(q.id, e.target.value)}
                                                                            className="w-4 h-4 text-[#0072CE] border-neutral-400 focus:ring-[#0072CE]"
                                                                        />
                                                                        <span className="text-[15px]">{opt.label}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {q.type === 'gap' && (
                                                    <div className="text-[15px] leading-loose text-neutral-900 flex items-start gap-3 mt-1">
                                                        <span className="mt-2.5 w-1.5 h-1.5 shrink-0 rounded-full bg-neutral-800" />
                                                        <div className="flex-1">
                                                            {q.prompt?.split('____').map((part, i, arr) => (
                                                                <React.Fragment key={i}>
                                                                    <span className="whitespace-pre-line">{part}</span>
                                                                    {i < arr.length - 1 && (
                                                                        <div className="inline-block mx-2 relative top-1">
                                                                            <input
                                                                                type="text"
                                                                                placeholder={q.id.toString()}
                                                                                value={answers[q.id] || ''}
                                                                                onChange={(e) => setAnswer(q.id, e.target.value)}
                                                                                onFocus={() => setActiveId(q.id)}
                                                                                className={`w-32 px-2 py-1 text-center font-mono border bg-white outline-none transition-shadow placeholder:text-black placeholder:font-bold ${isActive ? 'border-[#0072CE] ring-1 ring-[#0072CE]' : 'border-[#CCCCCC] focus:border-[#0072CE]'}`}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {q.type === 'mcq' && (
                                                    <div>
                                                        <p className="text-[15px] mb-3 text-neutral-900">{q.prompt}</p>
                                                        <div className="space-y-1">
                                                            {q.options?.map((opt, oi) => {
                                                                const letter = String.fromCharCode(97 + oi);
                                                                const isSelected = answers[q.id] === letter;
                                                                return (
                                                                    <label 
                                                                        key={letter} 
                                                                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${isSelected ? 'bg-[#D0E8FF]' : 'hover:bg-neutral-50'}`}
                                                                    >
                                                                        <input 
                                                                            type="radio" 
                                                                            name={`q-${q.id}`} 
                                                                            value={letter}
                                                                            checked={isSelected}
                                                                            onChange={(e) => setAnswer(q.id, e.target.value)}
                                                                            className="w-4 h-4 text-[#0072CE] border-neutral-400 focus:ring-[#0072CE]"
                                                                        />
                                                                        <span className="text-[15px]">{opt}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                    </>
                )}
            </div>

            {/* Official Bottom Question Deck (Footer) */}
            <footer className="shrink-0 h-[60px] bg-white border-t border-[#CCCCCC] flex items-center justify-between px-2 w-full z-10">
                <div className="flex items-center gap-6 h-full overflow-x-auto custom-scrollbar flex-1 px-4">
                    {/* Part Navigation */}
                    {PARTS.map((p) => {
                        const isPartActive = activePart === p.id;
                        const questionsInPart = QUESTIONS.filter(q => q.part === p.id);

                        return (
                            <div key={p.id} className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => setActivePart(p.id)}
                                    className={`text-sm font-bold ${isPartActive ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                                >
                                    Part {p.id}
                                </button>

                                <span className="text-xs font-normal text-neutral-400">
                                    {getAnsweredCount(p.id)} of {getTotalCount(p.id)}
                                </span>

                                {isPartActive && (
                                    <div className="flex items-center gap-1.5 h-full">
                                        {questionsInPart.map(q => {
                                            const isActive = activeId === q.id;
                                            const isAnswered = answers[q.id] && answers[q.id].trim() !== '';
                                            return (
                                                <button
                                                    key={q.id}
                                                    onClick={() => goTo(q.id)}
                                                    className={`relative w-7 h-9 flex flex-col items-center justify-center text-xs font-mono font-semibold transition-all ${isActive ? 'border-2 border-[#0072CE] bg-white text-black' : 'text-neutral-600 hover:bg-neutral-100'}`}
                                                >
                                                    {isAnswered && !isActive && (
                                                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7D32]" />
                                                    )}
                                                    {isAnswered && isActive && (
                                                        <div className="absolute -top-[2px] -left-[2px] -right-[2px] h-[3px] bg-[#2E7D32]" />
                                                    )}
                                                    <span className={isAnswered && !isActive ? 'mt-1' : ''}>{q.id}</span>
                                                    {isAnswered && !isActive && (
                                                        <div className="absolute bottom-1 w-3/4 h-0.5 bg-neutral-300" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Review/Finish Buttons */}
                <div className="shrink-0 flex items-center h-full border-l border-[#CCCCCC] pl-2">
                    <button
                        onClick={() => navigateQuestion(-1)}
                        disabled={activeId <= 1}
                        className="bg-[#E0E0E0] hover:bg-[#D0D0D0] text-black w-12 h-10 flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                        ◄
                    </button>
                    <button
                        onClick={() => navigateQuestion(1)}
                        disabled={activeId >= 40}
                        className="bg-black hover:bg-neutral-800 text-white w-12 h-10 flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                        ►
                    </button>
                    <button
                        onClick={submit}
                        className="w-[60px] h-full bg-[#E0E0E0] hover:bg-[#D0D0D0] flex items-center justify-center transition-colors text-black"
                    >
                        <Check size={24} strokeWidth={3} />
                    </button>
                </div>
            </footer>
            
            <IELTSExitModal
                open={showExitModal}
                onConfirm={handleExit}
                onCancel={() => setShowExitModal(false)}
            />
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #CCCCCC;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #AAAAAA;
                }
            `}</style>
        </div>
    );
};

export default IELTSReadingExam;
