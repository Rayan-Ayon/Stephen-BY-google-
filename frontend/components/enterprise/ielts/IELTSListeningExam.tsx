import React, { useEffect, useRef, useState } from 'react';
import { addAttempt, rawToBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';

const Wifi = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
);
const Bell = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const Menu = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const Check = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const Speaker = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 9v6h4l5 5V4L7 9H3z"></path><path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z"></path></svg>
);

export const LISTENING_PART1_DATA = {
    title: 'Phone call about second-hand furniture',
    instructions: 'Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.',
    answers: {
        1: 'round',
        2: '2 years / two years / 2 yrs',
        3: '6 / six',
        4: 'leather',
        5: 'good / excellent',
        6: 'lock',
        7: '15 / 15.00',
        8: '21',
        9: 'left',
        10: 'post office / Post Office',
    } as Record<number, string>,
};

export const LISTENING_PART2_DATA = {
    q11_15: {
        instruction: 'Who is responsible for each area? Choose the correct answer for each person and move it into the gap.',
        people: [
            { id: 11, name: 'Mary Brown' },
            { id: 12, name: 'John Stevens' },
            { id: 13, name: 'Alison Jones' },
            { id: 14, name: 'Tim Smith' },
            { id: 15, name: 'Jenny James' },
        ],
        options: ['Finance', 'Food', 'Health', "Kids' Counselling", 'Organisation', 'Rooms', 'Sport', 'Trips'],
    },
    q16_20: {
        instruction: 'Label the map. Choose the correct answer and move it into the gap.',
        options: ['Cookery room', 'Games room', 'Kitchen', 'Pottery room', 'Sports complex', 'Staff accommodation'],
    },
    answers: {
        11: 'Finance',
        12: 'Health',
        13: "Kids' Counselling",
        14: 'Organisation',
        15: 'Trips',
        16: 'Sports complex',
        17: 'Staff accommodation',
        18: 'Cookery room',
        19: 'Kitchen',
        20: 'Games room',
    } as Record<number, string>,
};

export const LISTENING_PART3_DATA = {
    q21_25: {
        instruction: 'Which feature do the speakers identify for each of the following categories of fossil? Choose the correct answer for each fossil category and move it into the gap.',
        categories: [
            { id: 21, name: 'Impression fossils' },
            { id: 22, name: 'Cast fossils' },
            { id: 23, name: 'Permineralisation fossils' },
            { id: 24, name: 'Compaction fossils' },
            { id: 25, name: 'Fusain fossils' },
        ],
        options: [
            'They are a very rare type of plant fossil.',
            'They do not contain any organic matter.',
            'They are found in soft, wet ground.',
            'They can be found far from normal fossil areas.',
            'They are three-dimensional.',
            'They provide information about plant cells.',
        ],
    },
    q26_30: {
        title: 'Procedure for detecting life on another planet',
        instruction: 'Complete the flow-chart. Choose the correct answer and move it into the gap.',
        options: ['contamination', 'vehicle', 'heat', 'results', 'radiation', 'site', 'microbes', 'water'],
    },
    answers: {
        21: 'They do not contain any organic matter.',
        22: 'They are three-dimensional.',
        23: 'They provide information about plant cells.',
        24: 'They can be found far from normal fossil areas.',
        25: 'They are a very rare type of plant fossil.',
        26: 'site',
        27: 'radiation',
        28: 'heat',
        29: 'microbes',
        30: 'results',
    } as Record<number, string>,
};

export const LISTENING_PART4_DATA = {
    q31_32: {
        instruction: 'Choose the correct answer.',
        questions: [
            {
                id: 31,
                text: 'Participants in the Learner Persistence study were all drawn from the same',
                options: [
                    'age group.',
                    'geographical area.',
                    'socio-economic level.',
                ],
            },
            {
                id: 32,
                text: 'The study showed that when starting their course, older students were most concerned about',
                options: [
                    'effects on their home life.',
                    'implications for their future career.',
                    'financial constraints.',
                ],
            },
        ],
    },
    q33_37: {
        title: 'Research findings',
        instruction: 'Complete the table. Write ONE WORD ONLY for each answer.',
        headers: ['', 'Social and Environmental Factors', 'Other Factors', 'Personal Characteristics'],
        rows: [
            {
                level: 'First level of importance',
                social: 'Effective support',
                other: 'Perceived success in study',
                personal: { prefix: 'Enjoyment of a', slotId: 33, suffix: '' },
            },
            {
                level: 'Second level of importance',
                social: { prefix: 'Positive experiences at', slotId: 34, suffix: '' },
                other: { prefix: 'Good', slotId: 35, suffix: '' },
                personal: { prefix: 'Many', slotId: 36, suffix: 'in daily life' },
            },
            {
                level: 'Third level of importance',
                social: { prefix: 'Good interaction with the', slotId: 37, suffix: '' },
                other: 'No family problems',
                personal: 'Capacity for multi-tasking',
            },
        ],
    },
    q38_40: {
        title: 'Recommendations',
        instruction: 'Complete the notes. Write ONE WORD ONLY for each answer.',
        notes: [
            { id: 38, prefix: 'Ask new students to complete questionnaires to gauge their level of', suffix: '.' },
            { id: 39, prefix: 'Train selected students to act as', suffix: '.' },
            { id: 40, prefix: 'Outside office hours, offer', suffix: 'help.' },
        ],
    },
    answers: {
        31: 'geographical area.',
        32: 'effects on their home life.',
        33: 'challenge',
        34: 'school',
        35: 'health',
        36: 'roles',
        37: 'teacher',
        38: 'motivation',
        39: 'mentors',
        40: 'online',
    } as Record<number, string>,
};

export const PART4_IDS = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40];

const PART1_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const PART2_IDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const PART3_IDS = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const ALL_IDS = [...PART1_IDS, ...PART2_IDS, ...PART3_IDS, ...PART4_IDS];
const ACTIVE_IDS: Record<number, number[]> = { 1: PART1_IDS, 2: PART2_IDS, 3: PART3_IDS, 4: PART4_IDS };
const PART_RANGE: Record<number, string> = { 1: '1–10', 2: '11–20', 3: '21–30', 4: '31–40' };

const MAP_SLOTS: { id: number; left: string; top: string }[] = [
    { id: 18, left: '49%', top: '10%' },
    { id: 19, left: '82%', top: '22%' },
    { id: 16, left: '49%', top: '42%' },
    { id: 17, left: '17%', top: '56%' },
    { id: 20, left: '82%', top: '48%' },
];

const MapSVG: React.FC = () => (
    <svg viewBox="0 0 640 480" className="w-full h-auto" role="img" aria-label="Camp map">
        <rect x={24} y={36} width={180} height={78} fill="#F9F9F9" stroke="#999999" strokeWidth={1.5} />
        <text x={114} y={70} textAnchor="middle" fontSize={12} fill="#333333">Girls'</text>
        <text x={114} y={88} textAnchor="middle" fontSize={12} fill="#333333">Accommodation</text>

        <rect x={24} y={160} width={180} height={78} fill="#F9F9F9" stroke="#999999" strokeWidth={1.5} />
        <text x={114} y={196} textAnchor="middle" fontSize={12} fill="#333333">Boys'</text>
        <text x={114} y={214} textAnchor="middle" fontSize={12} fill="#333333">Accommodation</text>

        <rect x={430} y={36} width={186} height={60} fill="#F9F9F9" stroke="#999999" strokeWidth={1.5} />
        <text x={523} y={72} textAnchor="middle" fontSize={12} fill="#333333">Staff Lounge</text>

        <rect x={430} y={108} width={186} height={52} fill="#F9F9F9" stroke="#999999" strokeWidth={1.5} />
        <text x={523} y={140} textAnchor="middle" fontSize={12} fill="#333333">Art Room</text>

        <rect x={430} y={172} width={186} height={52} fill="#F9F9F9" stroke="#999999" strokeWidth={1.5} />
        <text x={523} y={204} textAnchor="middle" fontSize={12} fill="#333333">Craft Room</text>

        <rect x={230} y={140} width={176} height={120} fill="#EAF6E7" stroke="#8FBF87" strokeWidth={1.5} />
        <text x={318} y={176} textAnchor="middle" fontSize={12} fill="#4A7B44">Garden</text>

        <rect x={24} y={300} width={592} height={84} fill="#F9F9F9" stroke="#999999" strokeWidth={1.5} />
        <line x1={221} y1={300} x2={221} y2={384} stroke="#999999" strokeWidth={1.5} />
        <line x1={418} y1={300} x2={418} y2={384} stroke="#999999" strokeWidth={1.5} />
        <text x={122} y={344} textAnchor="middle" fontSize={12} fill="#333333">Main Hall</text>
        <text x={319} y={342} textAnchor="middle" fontSize={12} fill="#333333">Co-ordinator's</text>
        <text x={319} y={360} textAnchor="middle" fontSize={12} fill="#333333">Office</text>
        <text x={505} y={344} textAnchor="middle" fontSize={12} fill="#333333">Reception</text>
    </svg>
);

const normalize = (s: string) => s.trim().toLowerCase();

const WAVEBARS = [10, 18, 26, 14, 30, 22, 12, 28, 16, 24, 20, 10, 26, 18, 30, 14, 22, 12, 28, 16];

type TestState = 'lobby' | 'active' | 'evaluating' | 'completed';

interface IELTSListeningExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
    onActiveChange?: (active: boolean) => void;
}

const IELTSListeningExam: React.FC<IELTSListeningExamProps> = ({ candidateEmail, simulation, onActiveChange }) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activePart, setActivePart] = useState<1 | 2 | 3 | 4>(1);
    const [activeId, setActiveId] = useState<number>(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [elapsed, setElapsed] = useState(0);
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [showExitModal, setShowExitModal] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [picked, setPicked] = useState<string | null>(null);
    const scrollRefs = useRef<Record<number, HTMLElement | null>>({});

    const TOTAL = 180;
    const timeLimit = simulation ? simulation.timeLimitSeconds : 30 * 60;
    const locked = testState !== 'active';
    const pct = Math.min(100, (progress / TOTAL) * 100);

    useEffect(() => {
        if (testState !== 'active') return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [testState]);

    useEffect(() => {
        if (!playing || locked) return;
        const id = window.setInterval(() => {
            setProgress((p) => (p >= TOTAL ? 0 : p + 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, [playing, locked]);

    const setAnswer = (id: number, value: string) => {
        if (locked) return;
        setAnswers((prev) => ({ ...prev, [id]: value }));
        setActiveId(id);
    };

    const partOf = (id: number): 1 | 2 | 3 | 4 => (id <= 10 ? 1 : id <= 20 ? 2 : id <= 30 ? 3 : 4);

    const goTo = (id: number) => {
        setActivePart(partOf(id));
        setActiveId(id);
        window.setTimeout(() => {
            scrollRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
    };

    const navigatePart = (dir: 1 | -1) => {
        const next = activePart + dir;
        if (next >= 1 && next <= 4) setActivePart(next as 1 | 2 | 3 | 4);
    };

    const countAnswered = (ids: number[]) => ids.filter((id) => answers[id] && answers[id].trim() !== '').length;
    const p1Count = countAnswered(PART1_IDS);
    const p2Count = countAnswered(PART2_IDS);
    const p3Count = countAnswered(PART3_IDS);
    const p4Count = countAnswered(PART4_IDS);

    const assignOption = (slotId: number, option: string) => {
        if (locked) return;
        if (option === '' || answers[slotId] === option) {
            setAnswer(slotId, '');
            return;
        }
        for (const id of ALL_IDS) {
            if (id !== slotId && answers[id] === option) setAnswer(id, '');
        }
        setAnswer(slotId, option);
    };

    const handleSlotClick = (slotId: number) => {
        if (locked) return;
        setActiveId(slotId);
        if (answers[slotId]) {
            setAnswer(slotId, '');
            return;
        }
        if (picked) {
            assignOption(slotId, picked);
            setPicked(null);
        }
    };

    const handleSlotDrop = (e: React.DragEvent, slotId: number) => {
        e.preventDefault();
        const option = e.dataTransfer.getData('text/plain');
        if (option) {
            assignOption(slotId, option);
            setPicked(null);
        }
    };

    const isCorrect = (input: string, key: string) => {
        const inp = normalize(input);
        return key.split('/').map((v) => normalize(v)).includes(inp);
    };

    const submit = (force = false) => {
        if (locked) return;
        setPlaying(false);
        setTestState('evaluating');
        window.setTimeout(() => {
            const correct =
                Object.keys(LISTENING_PART1_DATA.answers).reduce((acc, k) => {
                    const id = Number(k);
                    return acc + (isCorrect(answers[id] || '', LISTENING_PART1_DATA.answers[id]) ? 1 : 0);
                }, 0) +
                Object.keys(LISTENING_PART2_DATA.answers).reduce((acc, k) => {
                    const id = Number(k);
                    return acc + (normalize(answers[id] || '') === normalize(LISTENING_PART2_DATA.answers[id]) ? 1 : 0);
                }, 0) +
                Object.keys(LISTENING_PART3_DATA.answers).reduce((acc, k) => {
                    const id = Number(k);
                    return acc + (normalize(answers[id] || '') === normalize(LISTENING_PART3_DATA.answers[id]) ? 1 : 0);
                }, 0) +
                Object.keys(LISTENING_PART4_DATA.answers).reduce((acc, k) => {
                    const id = Number(k);
                    return acc + (normalize(answers[id] || '') === normalize(LISTENING_PART4_DATA.answers[id]) ? 1 : 0);
                }, 0);
            const timeSpent = Math.max(1, Math.round(elapsed / 60));
            if (simulation) {
                simulation.onComplete({ skill: 'listening', band: rawToBand(correct), score: correct, timeSpent });
            } else {
                setScore(correct);
                addAttempt({
                    id: Date.now(),
                    skill: 'listening',
                    band: rawToBand(correct),
                    score: correct,
                    timeSpent,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
            }
            setTestState('completed');
        }, 900);
    };

    useEffect(() => {
        if (simulation && testState === 'active' && elapsed >= timeLimit) submit(true);
    }, [elapsed, testState, simulation, timeLimit]);

    useEffect(() => {
        onActiveChange?.(testState === 'active' || testState === 'evaluating');
    }, [testState, onActiveChange]);

    const startExam = () => {
        if (simulation) return;
        setTestState('active');
    };

    const resetExam = () => {
        setPlaying(false);
        setProgress(0);
        setActivePart(1);
        setActiveId(1);
        setAnswers({});
        setPicked(null);
        setScore(null);
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
                skill="listening"
                candidateEmail={candidateEmail || ''}
                title="Listening Engine"
                subtitle="Integrated audio simulation with 4-section note-taking practice."
                onStart={startExam}
            />
        );
    }

    if (testState === 'evaluating') {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F2F2]">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full border border-[#CCCCCC]">
                    <h2 className="text-2xl font-bold text-[#0072CE] mb-4">Exam Completed</h2>
                    <p className="text-neutral-600">Evaluating your answers...</p>
                </div>
            </div>
        );
    }

    if (testState === 'completed') {
        const band = score != null ? rawToBand(score) : null;
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F2F2]">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full border border-[#CCCCCC]">
                    <h2 className="text-2xl font-bold text-[#0072CE] mb-4">Exam Completed</h2>
                    <p className="text-lg text-neutral-800 mb-2">Score: <strong>{score}</strong> / {ALL_IDS.length}</p>
                    <p className="text-lg text-neutral-800 mb-6">Band: <strong>{band?.toFixed(1)}</strong></p>
                    <button
                        onClick={() => setTestState('lobby')}
                        className="px-6 py-2 bg-[#0072CE] text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Return to Lobby
                    </button>
                </div>
            </div>
        );
    }

    const bannerText = `Listen and answer questions ${PART_RANGE[activePart]}.`;

    const GapInput: React.FC<{ id: number }> = ({ id }) => (
        <input
            ref={(el) => { scrollRefs.current[id] = el; }}
            type="text"
            value={answers[id] || ''}
            onChange={(e) => setAnswer(id, e.target.value)}
            onFocus={() => setActiveId(id)}
            disabled={locked}
            placeholder={String(id)}
            className={`inline-block h-8 px-2 min-w-[120px] max-w-[160px] border rounded-none bg-white font-mono text-center text-sm focus:outline-none focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE] ${
                activeId === id ? 'border-[#0072CE] ring-1 ring-[#0072CE] bg-[#D0E8FF]' : 'border-gray-400'
            } ${locked ? 'opacity-60' : ''}`}
        />
    );

    const DropSlot: React.FC<{ id: number; className?: string; style?: React.CSSProperties; inline?: boolean }> = ({ id, className = '', style, inline }) => (
        <div
            ref={(el) => { scrollRefs.current[id] = el; }}
            onClick={() => handleSlotClick(id)}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
            onDrop={(e) => handleSlotDrop(e, id)}
            style={style}
            className={`${
                inline ? 'inline-flex items-center justify-center h-8 min-w-[120px] align-middle' : 'flex items-center justify-center h-9 min-w-[140px]'
            } px-2 rounded-md text-sm font-semibold cursor-pointer transition-colors border-2 ${
                answers[id] ? 'border-solid border-[#0072CE] bg-[#D0E8FF] text-neutral-800' : 'border-dashed border-gray-400 bg-white text-neutral-400'
            } ${locked ? 'opacity-60' : ''} ${className}`}
        >
            {answers[id] ? <span className="text-neutral-800">{answers[id]}</span> : <span className="font-mono">{id}</span>}
        </div>
    );

    const OptionPill: React.FC<{ option: string; full?: boolean }> = ({ option, full }) => {
        const used = ALL_IDS.some((id) => answers[id] === option);
        const selected = picked === option;
        return (
            <button
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', option)}
                onClick={() => setPicked((p) => (p === option ? null : option))}
                disabled={used || locked}
                className={`px-3 py-2 rounded-md border text-[13px] transition-colors ${
                    selected
                        ? 'border-[#0072CE] bg-[#D0E8FF] text-neutral-900 ring-1 ring-[#0072CE]'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#0072CE]'
                } ${used ? 'opacity-40 pointer-events-none bg-neutral-100' : ''} ${locked ? 'opacity-60' : ''} ${full ? 'w-full text-left' : ''}`}
            >
                {option}
            </button>
        );
    };

    const renderCell = (cell: string | { prefix: string; slotId: number; suffix: string }) =>
        typeof cell === 'string' ? (
            <span>{cell}</span>
        ) : (
            <span className="inline-flex items-center gap-2">
                {cell.prefix} <GapInput id={cell.slotId} /> {cell.suffix}
            </span>
        );

    return (
        <div className="flex flex-col h-full bg-[#FFFFFF] text-black font-sans min-w-0" style={{ flex: 1 }}>
            {/* Top Navigation Bar */}
            <header className="shrink-0 h-14 border-b border-[#E5E7EB] bg-[#FFFFFF] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <span className="text-[#D32F2F] text-2xl font-black tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>IELTS<sup className="text-sm">™</sup></span>
                    <div className="ml-2">
                        <span className="block text-sm font-semibold text-black tracking-wide">Test taker ID</span>
                        <span className={`flex items-center gap-1.5 text-[11px] mt-0.5 ${playing ? 'text-[#0072CE]' : 'text-neutral-400'}`}>
                            <Speaker size={14} className={playing ? 'animate-pulse' : ''} />
                            {playing ? '🔊 Audio is Playing' : '🔇 Audio Paused'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-5 text-black">
                    <Wifi size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <Bell size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <Menu size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E5E7EB] text-[11px] text-neutral-700 hover:bg-[#D1D5DB] transition-colors">
                        Notes / Help
                    </button>
                </div>
            </header>

            {/* Task Context Banner */}
            <div className="shrink-0 bg-[#F5F5F5] border border-[#E5E7EB] px-6 py-4 mx-4 mt-4 rounded-md">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold mb-1">Part {activePart}</h2>
                        <p className="text-sm text-neutral-800">{bannerText}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => setPlaying((p) => !p)}
                            disabled={locked}
                            className="w-9 h-9 rounded-full bg-[#0072CE] text-white flex items-center justify-center text-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {playing ? '❚❚' : '▶'}
                        </button>
                        <button
                            onClick={() => setShowExitModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#CCCCCC] text-[11px] text-neutral-600 hover:text-red-600 hover:border-red-400 transition-colors"
                        >
                            <span>⬅️</span> Exit Exam
                        </button>
                        <div className={`rounded-md border bg-white px-3 py-1.5 text-center ${elapsed >= timeLimit - 300 ? 'border-red-400 animate-pulse' : 'border-[#CCCCCC]'}`}>
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Time Remaining</p>
                            <p className={`font-mono text-sm ${elapsed >= timeLimit - 300 ? 'text-red-600' : 'text-neutral-800'}`}>{formatClock(Math.max(0, timeLimit - elapsed))}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                    <div className="h-1 rounded bg-[#E5E7EB] overflow-hidden flex-1">
                        <div className="h-full bg-[#0072CE] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 shrink-0">track {Math.floor(progress / 60)}:{String(progress % 60).padStart(2, '0')} / 3:00</span>
                    <span className="hidden lg:flex items-end gap-0.5 h-6 shrink-0">
                        {WAVEBARS.slice(0, 12).map((h, i) => (
                            <span
                                key={i}
                                className={`w-[3px] rounded-full transition-all duration-150 ${playing ? 'bg-[#0072CE]/70' : 'bg-neutral-300'}`}
                                style={{ height: playing ? `${Math.max(4, ((h + (progress + i) % 8)) % 28)}px` : '3px' }}
                            />
                        ))}
                    </span>
                </div>
            </div>

            {/* Question Workspace — Single Scrollable Sheet */}
            {activePart === 1 ? (
                <div className="flex-1 min-h-0 overflow-y-auto bg-[#FFFFFF] custom-scrollbar">
                    <div className="max-w-3xl mx-auto px-8 py-6">
                        <h4 className="font-bold text-base mb-1">Questions 1–10</h4>
                        <p className="text-sm text-neutral-700 mb-5">{LISTENING_PART1_DATA.instructions}</p>
                        <h3 className="font-bold text-base mb-5">{LISTENING_PART1_DATA.title}</h3>

                        <div className="space-y-7 text-[15px]">
                            <div>
                                <p className="font-semibold mb-2">Dining table</p>
                                <ul className="space-y-1.5">
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> <GapInput id={1} /> <span>shape</span></li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> medium size</li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> <GapInput id={2} /> <span>old</span></li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> price: £25.00</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-semibold mb-2">Dining chairs</p>
                                <ul className="space-y-1.5">
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> set of <GapInput id={3} /> <span>chairs</span></li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> seats covered in <GapInput id={4} /> <span>material</span></li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> in <GapInput id={5} /> <span>condition</span></li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> price: £20.00</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-semibold mb-2">Desk</p>
                                <ul className="space-y-1.5">
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> length: 1 metre 20</li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> 3 drawers. Top drawer has a <GapInput id={6} />.</li>
                                    <li className="flex items-center gap-2"><span className="text-neutral-400">-</span> price: £<GapInput id={7} /></li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-semibold mb-2">Address</p>
                                <p className="flex items-center gap-2"><GapInput id={8} /> <span>Old Lane, Stonethorpe</span></p>
                            </div>

                            <div>
                                <p className="font-semibold mb-2">Directions</p>
                                <p className="leading-relaxed">
                                    Take the Hawcroft road out of Stonethorpe. Go past the secondary school, then turn <GapInput id={9} /> at the crossroads. House is down this road, opposite the <GapInput id={10} />.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : activePart === 2 ? (
                <div className="flex-1 min-h-0 overflow-y-auto bg-[#FFFFFF] custom-scrollbar">
                    <div className="max-w-4xl mx-auto px-8 py-6 space-y-9">
                        <section>
                            <h4 className="font-bold text-base mb-1">Questions 11–15</h4>
                            <p className="text-sm text-neutral-700 mb-5">{LISTENING_PART2_DATA.q11_15.instruction}</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    {LISTENING_PART2_DATA.q11_15.people.map((person) => (
                                        <div key={person.id} className="flex items-center gap-3">
                                            <span className="w-36 shrink-0 text-[15px] font-medium text-neutral-800">{person.name}</span>
                                            <DropSlot id={person.id} className="flex-1" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-700 mb-2">Staff Responsibilities</p>
                                    <div className="flex flex-wrap gap-2">
                                        {LISTENING_PART2_DATA.q11_15.options.map((opt) => (
                                            <OptionPill key={opt} option={opt} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold text-base mb-1">Questions 16–20</h4>
                            <p className="text-sm text-neutral-700 mb-5">{LISTENING_PART2_DATA.q16_20.instruction}</p>
                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,230px)] gap-6">
                                <div className="relative border border-neutral-300 rounded-lg bg-white">
                                    <MapSVG />
                                    {MAP_SLOTS.map((s) => (
                                        <DropSlot key={s.id} id={s.id} className="absolute w-[150px] -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: s.left, top: s.top }} />
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-700 mb-2">Options</p>
                                    <div className="flex flex-wrap lg:flex-col gap-2">
                                        {LISTENING_PART2_DATA.q16_20.options.map((opt) => (
                                            <OptionPill key={opt} option={opt} full />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            ) : activePart === 3 ? (
                <div className="flex-1 min-h-0 overflow-y-auto bg-[#FFFFFF] custom-scrollbar">
                    <div className="max-w-4xl mx-auto px-8 py-6 space-y-9">
                        <section>
                            <h4 className="font-bold text-base mb-1">Questions 21–25</h4>
                            <p className="text-sm text-neutral-700 mb-5">{LISTENING_PART3_DATA.q21_25.instruction}</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    {LISTENING_PART3_DATA.q21_25.categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center gap-3">
                                            <span className="w-44 shrink-0 text-[15px] font-medium text-neutral-800">{cat.name}</span>
                                            <DropSlot id={cat.id} className="flex-1" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-700 mb-2">Features</p>
                                    <div className="space-y-2">
                                        {LISTENING_PART3_DATA.q21_25.options.map((opt) => (
                                            <OptionPill key={opt} option={opt} full />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold text-base mb-1">Questions 26–30</h4>
                            <h3 className="font-bold text-base mb-1">{LISTENING_PART3_DATA.q26_30.title}</h3>
                            <p className="text-sm text-neutral-700 mb-5">{LISTENING_PART3_DATA.q26_30.instruction}</p>
                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,230px)] gap-6">
                                <div className="space-y-2">
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">A spacecraft lands on a planet and sends out a rover.</div>
                                    <div className="text-center text-neutral-400 text-lg font-bold">↓</div>
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">The rover is directed to a <DropSlot id={26} inline className="w-40" /> which has organic material.</div>
                                    <div className="text-center text-neutral-400 text-lg font-bold">↓</div>
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">It collects a sample from below the surface (in order to avoid the effects of <DropSlot id={27} inline className="w-40" />).</div>
                                    <div className="text-center text-neutral-400 text-lg font-bold">↓</div>
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">The soil and rocks are checked to look for evidence of fossils.</div>
                                    <div className="text-center text-neutral-400 text-lg font-bold">↓</div>
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">The sample is converted to powder.</div>
                                    <div className="text-center text-neutral-400 text-lg font-bold">↓</div>
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">The sample is subjected to <DropSlot id={28} inline className="w-40" />.</div>
                                    <div className="text-center text-neutral-400 text-lg font-bold">↓</div>
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">A mass spectrometer is used to search for potential proof of life, e.g. <DropSlot id={29} inline className="w-40" />.</div>
                                    <div className="text-center text-neutral-400 text-lg font-bold">↓</div>
                                    <div className="rounded-md border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed">The <DropSlot id={30} inline className="w-40" /> are compared with existing data from Earth.</div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-700 mb-2">Options</p>
                                    <div className="flex flex-wrap lg:flex-col gap-2">
                                        {LISTENING_PART3_DATA.q26_30.options.map((opt) => (
                                            <OptionPill key={opt} option={opt} full />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            ) : activePart === 4 ? (
                <div className="flex-1 min-h-0 overflow-y-auto bg-[#FFFFFF] custom-scrollbar">
                    <div className="max-w-4xl mx-auto px-8 py-6 space-y-9">
                        <section>
                            <h4 className="font-bold text-base mb-1">Questions 31–32</h4>
                            <p className="text-sm text-neutral-700 mb-5">{LISTENING_PART4_DATA.q31_32.instruction}</p>
                            {LISTENING_PART4_DATA.q31_32.questions.map((q) => (
                                <div key={q.id} ref={(el) => { scrollRefs.current[q.id] = el; }} className="mb-5">
                                    <p className="mb-3 text-[15px]">
                                        <span className="font-bold">{q.id}.</span> <span>{q.text}</span>
                                    </p>
                                    <div className="space-y-2 ml-7">
                                        {q.options.map((opt) => {
                                            const selected = answers[q.id] === opt;
                                            return (
                                                <label
                                                    key={opt}
                                                    className={`flex items-center gap-3 rounded border px-3 py-2 text-[15px] cursor-pointer transition-colors ${
                                                        selected
                                                            ? 'border-[#0072CE] bg-[#D0E8FF]/40'
                                                            : 'border-neutral-300 bg-white hover:border-[#0072CE]'
                                                    } ${locked ? 'opacity-60' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`q${q.id}`}
                                                        value={opt}
                                                        checked={selected}
                                                        disabled={locked}
                                                        onChange={() => setAnswer(q.id, opt)}
                                                        className="accent-[#0072CE] w-4 h-4 shrink-0"
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section>
                            <h4 className="font-bold text-base mb-1">Questions 33–37</h4>
                            <p className="text-sm text-neutral-700 mb-4">{LISTENING_PART4_DATA.q33_37.instruction}</p>
                            <h3 className="font-bold text-base text-center mb-4">{LISTENING_PART4_DATA.q33_37.title}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-400">
                                    <thead>
                                        <tr>
                                            {LISTENING_PART4_DATA.q33_37.headers.map((h, i) => (
                                                <th
                                                    key={i}
                                                    className={`border border-gray-400 px-3 py-2 text-left font-bold text-sm ${i === 0 ? 'w-48' : ''}`}
                                                >
                                                    {i === 0 ? 'Level of importance' : h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {LISTENING_PART4_DATA.q33_37.rows.map((row, ri) => (
                                            <tr key={ri}>
                                                <td className="border border-gray-400 px-3 py-2 text-[15px] font-medium">{row.level}</td>
                                                <td className="border border-gray-400 px-3 py-2 text-[15px]">{renderCell(row.social)}</td>
                                                <td className="border border-gray-400 px-3 py-2 text-[15px]">{renderCell(row.other)}</td>
                                                <td className="border border-gray-400 px-3 py-2 text-[15px]">{renderCell(row.personal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold text-base mb-1">Questions 38–40</h4>
                            <p className="text-sm text-neutral-700 mb-4">{LISTENING_PART4_DATA.q38_40.instruction}</p>
                            <h3 className="font-bold text-base mb-3">{LISTENING_PART4_DATA.q38_40.title}</h3>
                            <ul className="space-y-3 text-[15px] list-disc pl-5">
                                {LISTENING_PART4_DATA.q38_40.notes.map((n) => (
                                    <li key={n.id}>
                                        {n.prefix} <GapInput id={n.id} /> {n.suffix}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            ) : (
                <div className="flex-1 min-h-0 overflow-y-auto bg-[#FFFFFF] custom-scrollbar">
                    <div className="max-w-3xl mx-auto px-8 py-6">
                        <h4 className="font-bold text-base mb-1">Questions {PART_RANGE[activePart]}</h4>
                        <p className="text-sm text-neutral-700 mb-6">{bannerText}</p>
                        <div className="rounded-lg border border-dashed border-neutral-300 bg-[#F9F9F9] p-10 text-center">
                            <p className="text-3xl mb-2 opacity-50">🎧</p>
                            <p className="text-sm text-neutral-500">Part {activePart} audio and questions are not part of this build yet.</p>
                            <p className="text-xs text-neutral-400 mt-1">Switch back to an earlier part to answer its questions.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Official Bottom Question Deck (Footer) */}
            <footer className="shrink-0 h-12 bg-white border-t border-[#E5E7EB] flex items-center justify-between px-2 w-full z-10">
                <div className="flex items-center gap-5 h-full flex-1 px-4 overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setActivePart(1)}
                            className={`text-sm font-bold ${activePart === 1 ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                        >
                            Part 1 <span className="text-xs font-normal text-neutral-400">{p1Count}/10</span>
                        </button>
                        {activePart === 1 && (
                            <div className="flex items-center gap-1">
                                {PART1_IDS.map((id) => {
                                    const active = activePart === 1 && activeId === id;
                                    const done = !!(answers[id] && answers[id].trim() !== '');
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => goTo(id)}
                                            title={`Question ${id}`}
                                            className={`relative w-7 h-8 flex flex-col items-center justify-center text-xs font-mono font-semibold transition-all ${
                                                active
                                                    ? 'border-2 border-[#0072CE] bg-[#D0E8FF] text-black'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        >
                                            {done && !active && <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7D32]" />}
                                            {done && active && <div className="absolute -top-[2px] -left-[2px] -right-[2px] h-[3px] bg-[#2E7D32]" />}
                                            <span className={done && !active ? 'mt-1' : ''}>{id}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setActivePart(2)}
                            className={`text-sm font-bold ${activePart === 2 ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                        >
                            Part 2 <span className="text-xs font-normal text-neutral-400">{p2Count}/10</span>
                        </button>
                        {activePart === 2 && (
                            <div className="flex items-center gap-1">
                                {PART2_IDS.map((id) => {
                                    const active = activePart === 2 && activeId === id;
                                    const done = !!(answers[id] && answers[id].trim() !== '');
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => goTo(id)}
                                            title={`Question ${id}`}
                                            className={`relative w-7 h-8 flex flex-col items-center justify-center text-xs font-mono font-semibold transition-all ${
                                                active
                                                    ? 'border-2 border-[#0072CE] bg-[#D0E8FF] text-black'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        >
                                            {done && !active && <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7D32]" />}
                                            {done && active && <div className="absolute -top-[2px] -left-[2px] -right-[2px] h-[3px] bg-[#2E7D32]" />}
                                            <span className={done && !active ? 'mt-1' : ''}>{id}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setActivePart(3)}
                            className={`text-sm font-bold ${activePart === 3 ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                        >
                            Part 3 <span className="text-xs font-normal text-neutral-400">{p3Count}/10</span>
                        </button>
                        {activePart === 3 && (
                            <div className="flex items-center gap-1">
                                {PART3_IDS.map((id) => {
                                    const active = activePart === 3 && activeId === id;
                                    const done = !!(answers[id] && answers[id].trim() !== '');
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => goTo(id)}
                                            title={`Question ${id}`}
                                            className={`relative w-7 h-8 flex flex-col items-center justify-center text-xs font-mono font-semibold transition-all ${
                                                active
                                                    ? 'border-2 border-[#0072CE] bg-[#D0E8FF] text-black'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        >
                                            {done && !active && <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7D32]" />}
                                            {done && active && <div className="absolute -top-[2px] -left-[2px] -right-[2px] h-[3px] bg-[#2E7D32]" />}
                                            <span className={done && !active ? 'mt-1' : ''}>{id}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setActivePart(4)}
                            className={`text-sm font-bold ${activePart === 4 ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                        >
                            Part 4 <span className="text-xs font-normal text-neutral-400">{p4Count}/10</span>
                        </button>
                        {activePart === 4 && (
                            <div className="flex items-center gap-1">
                                {PART4_IDS.map((id) => {
                                    const active = activePart === 4 && activeId === id;
                                    const done = !!(answers[id] && answers[id].trim() !== '');
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => goTo(id)}
                                            title={`Question ${id}`}
                                            className={`relative w-7 h-8 flex flex-col items-center justify-center text-xs font-mono font-semibold transition-all ${
                                                active
                                                    ? 'border-2 border-[#0072CE] bg-[#D0E8FF] text-black'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        >
                                            {done && !active && <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7D32]" />}
                                            {done && active && <div className="absolute -top-[2px] -left-[2px] -right-[2px] h-[3px] bg-[#2E7D32]" />}
                                            <span className={done && !active ? 'mt-1' : ''}>{id}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="shrink-0 flex items-center h-full border-l border-[#E5E7EB] pl-2">
                    <button
                        onClick={() => navigatePart(-1)}
                        disabled={activePart === 1}
                        className="bg-[#E5E7EB] hover:bg-[#D0D0D0] text-black w-12 h-10 flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                        ◄
                    </button>
                    <button
                        onClick={() => navigatePart(1)}
                        disabled={activePart === 4}
                        className="bg-black hover:bg-neutral-800 text-white w-12 h-10 flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                        ►
                    </button>
                    <button
                        onClick={() => submit(false)}
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

export default IELTSListeningExam;