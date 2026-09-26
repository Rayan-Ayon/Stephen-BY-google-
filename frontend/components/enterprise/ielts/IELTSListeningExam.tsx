import React, { useEffect, useRef, useState, useMemo } from 'react';
import { supabase } from '../../../supabaseClient';
import { addAttempt, rawToBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSExitModal from './IELTSExitModal';

export interface QuestionGroupMeta {
    part: 1 | 2 | 3 | 4;
    groupIndex: number;
    startQuestion: number;
    endQuestion: number;
    firstQuestionId: number;
    groupId?: string;
}

export interface DynamicListeningQuestion {
    id: string;
    group_id: string;
    question_number: number;
    prompt: string;
    options?: string[];
    correct_answer?: string | null;
    explanation?: string | null;
}

export interface DynamicListeningQuestionGroup {
    id: string;
    section_id?: string;
    exam_id?: string;
    title: string;
    question_type: string;
    instructions: string;
    start_question: number;
    end_question: number;
    choices?: string[];
    metadata?: any;
    questions: DynamicListeningQuestion[];
}

export interface DynamicListeningSection {
    id: string;
    exam_id?: string;
    test_id?: string;
    part_number: number;
    passage_title?: string;
    audio_url?: string;
    total_questions?: number;
    question_groups: DynamicListeningQuestionGroup[];
}

export function parseJsonbArray(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((v) => String(v));
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.map((v) => String(v));
            } catch {
                // fall through
            }
        }
        return [trimmed];
    }
    return [];
}

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

type TestState = 'active' | 'evaluating' | 'completed';

export interface IELTSListeningExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
    onActiveChange?: (active: boolean) => void;
    onExit?: () => void;
    exitPulse?: boolean;
    bookNumber?: number;
    testNumber?: number;
    sourceType?: 'cambridge' | 'mock_series';
    category?: 'academic' | 'general';
    examId?: string;
    testId?: string;
    mode?: 'full_mock' | 'part-practice';
    practicePart?: number;
}

const IELTSListeningExam: React.FC<IELTSListeningExamProps> = ({
    candidateEmail,
    simulation,
    onActiveChange,
    onExit,
    exitPulse,
    bookNumber = 7,
    testNumber = 1,
    sourceType = 'cambridge',
    category = 'academic',
    examId,
    testId,
    mode = 'full_mock',
    practicePart = 1,
}) => {
    const isPartPractice = mode === 'part-practice';
    const initialPart: 1 | 2 | 3 | 4 = isPartPractice
        ? (Math.min(4, Math.max(1, Number(practicePart))) as 1 | 2 | 3 | 4)
        : 1;
    const initialQuestionId = (initialPart - 1) * 10 + 1;

    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [activePart, setActivePart] = useState<1 | 2 | 3 | 4>(initialPart);
    const [activeId, setActiveId] = useState<number>(initialQuestionId);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [elapsed, setElapsed] = useState(0);
    const [testState, setTestState] = useState<TestState>('active');
    const [showExitModal, setShowExitModal] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [picked, setPicked] = useState<string | null>(null);
    const scrollRefs = useRef<Record<number, HTMLElement | null>>({});
    const groupRefs = useRef<Record<string, HTMLElement | null>>({});
    const questionViewportRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isPartPractice && practicePart) {
            const p = Math.min(4, Math.max(1, Number(practicePart))) as 1 | 2 | 3 | 4;
            setActivePart(p);
            const firstId = (p - 1) * 10 + 1;
            setActiveId(firstId);
        }
    }, [isPartPractice, practicePart]);

    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showNotepad, setShowNotepad] = useState(false);
    const [notepadNotes, setNotepadNotes] = useState('');
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeGroupIndexInPart, setActiveGroupIndexInPart] = useState<number>(0);
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // Dynamic Supabase test data states
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
    const [hasDynamicData, setHasDynamicData] = useState<boolean>(false);
    const [useMockFallback, setUseMockFallback] = useState<boolean>(false);
    const [dynamicSections, setDynamicSections] = useState<DynamicListeningSection[]>([]);
    const [dynamicAnswersKey, setDynamicAnswersKey] = useState<Record<number, string>>({});

    useEffect(() => {
        let isMounted = true;

        async function fetchListeningData() {
            setIsLoadingData(true);
            try {
                let currentTestId: string | null = examId || testId || null;

                // Standard Cambridge Listening UUID format (e.g. c0700000-0000-0000-0000-000000000001)
                const paddedBook = String(bookNumber).padStart(2, '0');
                const paddedTest = String(testNumber).padStart(12, '0');
                const standardListeningUuid = `c${paddedBook}00000-0000-0000-0000-${paddedTest}`;

                // 1. Strict Module Validation if ID was passed directly
                if (currentTestId) {
                    const { data: exCheck, error: errExCheck } = await (supabase as any)
                        .from('exams')
                        .select('id, title')
                        .eq('id', currentTestId)
                        .maybeSingle();

                    if (errExCheck) {
                        console.error('Supabase query error verifying exam ID:', errExCheck);
                    }

                    if (exCheck) {
                        const titleLower = (exCheck.title || '').toLowerCase();
                        if (titleLower.includes('reading') || (!titleLower.includes('listening') && titleLower.includes('academic'))) {
                            console.warn(`Provided exam ID ${currentTestId} ("${exCheck.title}") is not a Listening exam. Discarding.`);
                            currentTestId = null;
                        }
                    } else {
                        const { data: tCheck, error: errTCheck } = await (supabase as any)
                            .from('tests')
                            .select('id, title')
                            .eq('id', currentTestId)
                            .maybeSingle();

                        if (errTCheck) {
                            console.error('Supabase query error verifying test ID:', errTCheck);
                        }

                        if (tCheck) {
                            const titleLower = (tCheck.title || '').toLowerCase();
                            if (titleLower.includes('reading') || (!titleLower.includes('listening') && titleLower.includes('academic'))) {
                                console.warn(`Provided test ID ${currentTestId} ("${tCheck.title}") is not a Listening test. Discarding.`);
                                currentTestId = null;
                            }
                        }
                    }
                }

                // 2. Strict Querying for Listening Tests/Exams (Filter by Listening, never load Reading)
                if (!currentTestId) {
                    // Query exams table strictly with Listening filter
                    const { data: exListening, error: exErr } = await (supabase as any)
                        .from('exams')
                        .select('id, title, test_number')
                        .ilike('title', `%Cambridge ${bookNumber}%`)
                        .ilike('title', '%Listening%')
                        .eq('test_number', Number(testNumber));

                    if (exErr) {
                        console.error('Supabase query error on exams (strict listening):', exErr);
                    } else if (exListening && exListening.length > 0) {
                        currentTestId = exListening[0].id;
                    }
                }

                if (!currentTestId) {
                    // Query tests table strictly with Listening filter
                    const { data: tList, error: tErr } = await (supabase as any)
                        .from('tests')
                        .select('id, title, test_number')
                        .ilike('title', `%Cambridge ${bookNumber}%`)
                        .ilike('title', '%Listening%');

                    if (tErr) {
                        console.error('Supabase query error on tests (strict listening):', tErr);
                    } else if (tList && tList.length > 0) {
                        const match = tList.find((t: any) =>
                            t.title?.includes(String(testNumber)) || t.test_number === Number(testNumber)
                        ) || tList[0];
                        currentTestId = match.id;
                    }
                }

                // Check standardListeningUuid strictly against exams or tests with Listening title
                if (!currentTestId) {
                    const { data: exStd, error: exStdErr } = await (supabase as any)
                        .from('exams')
                        .select('id, title')
                        .eq('id', standardListeningUuid)
                        .ilike('title', '%Listening%')
                        .maybeSingle();

                    if (exStdErr) {
                        console.error('Supabase query error checking standard listening UUID on exams:', exStdErr);
                    }
                    if (exStd) {
                        currentTestId = standardListeningUuid;
                    } else {
                        const { data: tStd, error: tStdErr } = await (supabase as any)
                            .from('tests')
                            .select('id, title')
                            .eq('id', standardListeningUuid)
                            .ilike('title', '%Listening%')
                            .maybeSingle();

                        if (tStdErr) {
                            console.error('Supabase query error checking standard listening UUID on tests:', tStdErr);
                        }
                        if (tStd) {
                            currentTestId = standardListeningUuid;
                        }
                    }
                }

                // If no valid Listening exam exists in Supabase, do NOT fall back to Reading or generic tables!
                if (!currentTestId) {
                    console.info(`No active Listening exam found in Supabase for Cambridge ${bookNumber} Test ${testNumber}. Rendering pending fallback.`);
                    if (isMounted) {
                        setIsLoadingData(false);
                        setHasDynamicData(false);
                    }
                    return;
                }

                // 3. Fetch sections with nested question_groups and questions for verified listening ID
                let sectionsResult: any[] = [];

                const { data: secByTest, error: errTest } = await (supabase as any)
                    .from('sections')
                    .select('*, question_groups(*, questions(*))')
                    .eq('test_id', currentTestId)
                    .order('part_number', { ascending: true });

                if (errTest) {
                    console.error('Supabase query error fetching sections by test_id:', errTest);
                }

                if (secByTest && secByTest.length > 0) {
                    sectionsResult = secByTest;
                } else {
                    // Attempt to fetch by exam_id
                    const { data: secByExam, error: errExam } = await (supabase as any)
                        .from('sections')
                        .select('*, question_groups(*, questions(*))')
                        .eq('exam_id', currentTestId)
                        .order('part_number', { ascending: true });

                    if (errExam) {
                        console.error('Supabase query error fetching sections by exam_id:', errExam);
                    }
                    if (secByExam && secByExam.length > 0) {
                        sectionsResult = secByExam;
                    }
                }

                // If 0 sections returned, DO NOT fall back to generic test_number or non-listening queries!
                if (sectionsResult.length === 0) {
                    console.info(`No listening sections found for Cambridge ${bookNumber} Test ${testNumber} (resolved ID: ${currentTestId})`);
                    if (isMounted) {
                        setIsLoadingData(false);
                        setHasDynamicData(false);
                    }
                    return;
                }

                // Strict guard: ensure none of the returned sections are Reading passages
                const hasReadingPassage = sectionsResult.some((s: any) =>
                    (s.passage_title || '').toLowerCase().includes('reading passage')
                );
                if (hasReadingPassage) {
                    console.warn(`Query leakage detected: Retrieved sections contained Reading passages for Listening exam. Rejecting.`);
                    if (isMounted) {
                        setIsLoadingData(false);
                        setHasDynamicData(false);
                    }
                    return;
                }

                // 4. Map nested sections, question_groups, and questions into UI state
                const keyMap: Record<number, string> = {};

                const parsedSections: DynamicListeningSection[] = sectionsResult.map((sec: any) => {
                    const rawGroups = (sec.question_groups || []).slice();
                    rawGroups.sort((a: any, b: any) => (a.start_question || 0) - (b.start_question || 0));

                    return {
                        id: sec.id,
                        exam_id: sec.exam_id,
                        test_id: sec.test_id,
                        part_number: Number(sec.part_number) || 1,
                        passage_title: sec.passage_title || sec.title || `Part ${sec.part_number}`,
                        audio_url: sec.audio_url,
                        total_questions: sec.total_questions,
                        question_groups: rawGroups.map((g: any) => {
                            const rawQuestions = (g.questions || []).slice();
                            rawQuestions.sort((a: any, b: any) => (a.question_number || 0) - (b.question_number || 0));

                            rawQuestions.forEach((q: any) => {
                                if (q.question_number && q.correct_answer) {
                                    keyMap[q.question_number] = String(q.correct_answer).trim();
                                }
                            });

                            return {
                                id: g.id,
                                section_id: g.section_id,
                                exam_id: g.exam_id,
                                title: g.title || `Questions ${g.start_question || 1}–${g.end_question || 10}`,
                                question_type: g.question_type || 'NOTE_COMPLETION',
                                instructions: g.instructions || g.instruction_html || '',
                                start_question: g.start_question || 1,
                                end_question: g.end_question || 10,
                                choices: parseJsonbArray(g.choices || g.shared_options),
                                metadata: g.metadata || {},
                                questions: rawQuestions.map((q: any) => ({
                                    id: q.id,
                                    group_id: q.group_id,
                                    question_number: q.question_number,
                                    prompt: q.prompt || q.question_text || '',
                                    options: parseJsonbArray(q.options),
                                    correct_answer: q.correct_answer || null,
                                    explanation: q.explanation || null,
                                })),
                            };
                        }),
                    };
                });

                parsedSections.sort((a, b) => a.part_number - b.part_number);

                if (isMounted) {
                    setDynamicSections(parsedSections);
                    setDynamicAnswersKey(keyMap);
                    const hasQuestions = parsedSections.some((s) => s.question_groups.some((g) => g.questions.length > 0));
                    setHasDynamicData(hasQuestions);
                    if (!hasQuestions) {
                        setUseMockFallback(true);
                    }
                    if (hasQuestions) {
                        const firstSec = parsedSections.find((s) => s.part_number === 1) || parsedSections[0];
                        const firstGrp = firstSec?.question_groups?.[0];
                        if (firstGrp) {
                            setActiveGroupId(firstGrp.id);
                        }
                    }
                    setIsLoadingData(false);
                }
            } catch (err) {
                console.error('Supabase query error in fetchListeningData:', err);
                if (isMounted) {
                    setIsLoadingData(false);
                    setHasDynamicData(false);
                    setUseMockFallback(true);
                }
            }
        }

        fetchListeningData();

        return () => {
            isMounted = false;
        };
    }, [examId, testId, bookNumber, testNumber]);

    // Dynamic question IDs mapping
    const dynamicPartIds: Record<number, number[]> = {
        1: (hasDynamicData && !useMockFallback)
            ? (dynamicSections.find((s) => s.part_number === 1)?.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))?.length
                ? dynamicSections.find((s) => s.part_number === 1)!.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))
                : PART1_IDS)
            : PART1_IDS,
        2: (hasDynamicData && !useMockFallback)
            ? (dynamicSections.find((s) => s.part_number === 2)?.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))?.length
                ? dynamicSections.find((s) => s.part_number === 2)!.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))
                : PART2_IDS)
            : PART2_IDS,
        3: (hasDynamicData && !useMockFallback)
            ? (dynamicSections.find((s) => s.part_number === 3)?.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))?.length
                ? dynamicSections.find((s) => s.part_number === 3)!.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))
                : PART3_IDS)
            : PART3_IDS,
        4: (hasDynamicData && !useMockFallback)
            ? (dynamicSections.find((s) => s.part_number === 4)?.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))?.length
                ? dynamicSections.find((s) => s.part_number === 4)!.question_groups.flatMap((g) => g.questions.map((q) => q.question_number))
                : PART4_IDS)
            : PART4_IDS,
    };

    const allCurrentIds: number[] = [
        ...(dynamicPartIds[1] || []),
        ...(dynamicPartIds[2] || []),
        ...(dynamicPartIds[3] || []),
        ...(dynamicPartIds[4] || []),
    ];

    const activeSection = dynamicSections.find((s) => s.part_number === activePart);
    const activeGroups = activeSection?.question_groups || [];

    // Flat metadata for all question groups across the test (Parts 1 to 4)
    const allGroups: QuestionGroupMeta[] = useMemo(() => {
        if (hasDynamicData && !useMockFallback && dynamicSections.length > 0) {
            const groups: QuestionGroupMeta[] = [];
            dynamicSections.forEach((sec) => {
                const partNum = (Number(sec.part_number) || 1) as 1 | 2 | 3 | 4;
                const sortedGroups = (sec.question_groups || []).slice();
                sortedGroups.sort((a, b) => (a.start_question || 0) - (b.start_question || 0));

                sortedGroups.forEach((g, gIdx) => {
                    const qNums = (g.questions || [])
                        .map((q) => q.question_number)
                        .filter((n): n is number => typeof n === 'number' && !isNaN(n));
                    const startQ = g.start_question || (qNums.length > 0 ? Math.min(...qNums) : 1);
                    const endQ = g.end_question || (qNums.length > 0 ? Math.max(...qNums) : startQ);
                    const firstId = qNums[0] || startQ;
                    groups.push({
                        part: partNum,
                        groupIndex: gIdx,
                        startQuestion: startQ,
                        endQuestion: endQ,
                        firstQuestionId: firstId,
                        groupId: g.id,
                    });
                });
            });
            if (groups.length > 0) return groups;
        }

        // Fallback static mock question groups
        return [
            { part: 1, groupIndex: 0, startQuestion: 1, endQuestion: 10, firstQuestionId: 1, groupId: 'mock-1-0' },
            { part: 2, groupIndex: 0, startQuestion: 11, endQuestion: 15, firstQuestionId: 11, groupId: 'mock-2-0' },
            { part: 2, groupIndex: 1, startQuestion: 16, endQuestion: 20, firstQuestionId: 16, groupId: 'mock-2-1' },
            { part: 3, groupIndex: 0, startQuestion: 21, endQuestion: 25, firstQuestionId: 21, groupId: 'mock-3-0' },
            { part: 3, groupIndex: 1, startQuestion: 26, endQuestion: 30, firstQuestionId: 26, groupId: 'mock-3-1' },
            { part: 4, groupIndex: 0, startQuestion: 31, endQuestion: 32, firstQuestionId: 31, groupId: 'mock-4-0' },
            { part: 4, groupIndex: 1, startQuestion: 33, endQuestion: 37, firstQuestionId: 33, groupId: 'mock-4-1' },
            { part: 4, groupIndex: 2, startQuestion: 38, endQuestion: 40, firstQuestionId: 38, groupId: 'mock-4-2' },
        ];
    }, [hasDynamicData, useMockFallback, dynamicSections]);

    // Groups for the currently active part
    const currentPartGroups = useMemo(() => {
        return allGroups.filter((g) => g.part === activePart);
    }, [allGroups, activePart]);

    // Active group within the current part (isolated to the single selected question group)
    const activeGroup = useMemo(() => {
        if (currentPartGroups.length === 0) return allGroups[0];
        if (activeGroupId) {
            const found = currentPartGroups.find((g) => g.groupId === activeGroupId);
            if (found) return found;
        }
        const clampedIndex = Math.min(Math.max(0, activeGroupIndexInPart), currentPartGroups.length - 1);
        return currentPartGroups[clampedIndex] || currentPartGroups[0];
    }, [currentPartGroups, activeGroupId, activeGroupIndexInPart, allGroups]);

    // Active dynamic question group for the active section (for dynamic rendering)
    const activeDynamicGroup = useMemo(() => {
        if (!activeGroups || activeGroups.length === 0) return null;
        if (activeGroupId) {
            const found = activeGroups.find((g) => g.id === activeGroupId);
            if (found) return found;
        }
        const clampedIndex = Math.min(Math.max(0, activeGroupIndexInPart), activeGroups.length - 1);
        return activeGroups[clampedIndex] || activeGroups[0];
    }, [activeGroups, activeGroupId, activeGroupIndexInPart]);

    // Global index in allGroups across the entire test
    const currentGlobalGroupIndex = useMemo(() => {
        if (!activeGroup) return 0;
        const idx = allGroups.findIndex((g) => g === activeGroup || (g.groupId && g.groupId === activeGroup.groupId));
        return idx !== -1 ? idx : 0;
    }, [allGroups, activeGroup]);

    const prevGroup = currentGlobalGroupIndex > 0 ? allGroups[currentGlobalGroupIndex - 1] : null;
    const nextGroup = currentGlobalGroupIndex < allGroups.length - 1 ? allGroups[currentGlobalGroupIndex + 1] : null;

    const handleScrollToGroup = (targetGroup: QuestionGroupMeta) => {
        setActivePart(targetGroup.part);
        setActiveGroupIndexInPart(targetGroup.groupIndex);
        if (targetGroup.groupId) {
            setActiveGroupId(targetGroup.groupId);
        }
        setActiveId(targetGroup.firstQuestionId);

        if (questionViewportRef.current) {
            questionViewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Scroll listener for sticky header drop-shadow
    useEffect(() => {
        const viewport = questionViewportRef.current;
        if (!viewport) return;

        const handleScroll = () => {
            setIsScrolled(viewport.scrollTop > 10);
        };

        viewport.addEventListener('scroll', handleScroll, { passive: true });
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, []);

    const currentPartTitle = useMemo(() => {
        if (hasDynamicData && !useMockFallback) {
            return activeSection?.passage_title || `Part ${activePart}`;
        }
        if (activePart === 1) return LISTENING_PART1_DATA.title;
        if (activePart === 2) return 'PS Camping Holidays & Camp Layout';
        if (activePart === 3) return 'Fossils & Planetary Life Detection';
        if (activePart === 4) return 'Learner Persistence Study & Research';
        return `Part ${activePart}`;
    }, [hasDynamicData, useMockFallback, activeSection, activePart]);

    const renderStickyHeader = () => (
        <div
            className={`part-sticky-header sticky top-0 z-25 bg-white border-b border-gray-200 px-6 sm:px-8 py-3.5 transition-shadow duration-200 ${
                isScrolled ? 'scrolled shadow-sm' : ''
            }`}
        >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="header-titles">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                        Part {activePart}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                        {currentPartTitle}
                    </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => prevGroup && handleScrollToGroup(prevGroup)}
                        disabled={!prevGroup}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        title={prevGroup ? `Go to previous group (${prevGroup.startQuestion}–${prevGroup.endQuestion})` : 'No previous group'}
                    >
                        ← Previous group
                    </button>
                    <button
                        type="button"
                        onClick={() => nextGroup && handleScrollToGroup(nextGroup)}
                        disabled={!nextGroup}
                        className="bg-[#009688] hover:bg-[#00796b] text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
                        title={nextGroup ? `Go to next group (${nextGroup.startQuestion}–${nextGroup.endQuestion})` : 'Final group'}
                    >
                        {nextGroup
                            ? nextGroup.part !== activePart
                                ? `Next Part (${nextGroup.startQuestion}–${nextGroup.endQuestion}) →`
                                : `Next group ${nextGroup.startQuestion}–${nextGroup.endQuestion} →`
                            : 'Next group →'}
                    </button>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
            if (volume === 0) setVolume(80);
        } else {
            setIsMuted(true);
        }
    };

    const TOTAL = 180;
    const timeLimit = simulation ? simulation.timeLimitSeconds : 30 * 60;
    const locked = testState !== 'active';
    const lowTime = (timeLimit - elapsed) <= 300 && (timeLimit - elapsed) > 0;
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

    const partOf = (id: number): 1 | 2 | 3 | 4 => {
        for (const p of [1, 2, 3, 4] as const) {
            if (dynamicPartIds[p]?.includes(id)) return p;
        }
        return id <= 10 ? 1 : id <= 20 ? 2 : id <= 30 ? 3 : 4;
    };

    const goTo = (id: number) => {
        if (isPartPractice) {
            const allowedIds = dynamicPartIds[activePart] || [];
            if (allowedIds.length > 0 && !allowedIds.includes(id)) {
                return;
            }
        }
        const targetPart = isPartPractice ? activePart : partOf(id);
        if (!isPartPractice) {
            setActivePart(targetPart);
        }
        setActiveId(id);

        const matchedGroup = allGroups.find(
            (g) => g.part === targetPart && id >= g.startQuestion && id <= g.endQuestion
        );
        if (matchedGroup) {
            setActiveGroupIndexInPart(matchedGroup.groupIndex);
            if (matchedGroup.groupId) {
                setActiveGroupId(matchedGroup.groupId);
            }
        }

        window.setTimeout(() => {
            const el = scrollRefs.current[id];
            if (el && questionViewportRef.current) {
                const containerRect = questionViewportRef.current.getBoundingClientRect();
                const elemRect = el.getBoundingClientRect();
                const offset = elemRect.top - containerRect.top + questionViewportRef.current.scrollTop - 90;
                questionViewportRef.current.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
            } else if (questionViewportRef.current) {
                questionViewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 80);
    };

    const navigatePart = (dir: 1 | -1) => {
        if (isPartPractice) return;
        const next = activePart + dir;
        if (next >= 1 && next <= 4) {
            const nextPart = next as 1 | 2 | 3 | 4;
            setActivePart(nextPart);
            const firstId = dynamicPartIds[nextPart]?.[0];
            if (firstId) goTo(firstId);
        }
    };

    const countAnswered = (ids: number[]) => ids.filter((id) => answers[id] && answers[id].trim() !== '').length;

    const assignOption = (slotId: number, option: string) => {
        if (locked) return;
        if (option === '' || answers[slotId] === option) {
            setAnswer(slotId, '');
            return;
        }
        for (const id of allCurrentIds) {
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
        const normKey = normalize(key);
        if (inp === normKey) return true;
        const parts = key.split('/').map((v) => normalize(v));
        if (parts.includes(inp)) return true;
        const cleanKey = normKey.replace(/^[a-z][\.\)\-\:]\s*/i, '');
        const cleanInp = inp.replace(/^[a-z][\.\)\-\:]\s*/i, '');
        if (cleanInp && cleanInp === cleanKey) return true;
        if (/^[a-z]$/i.test(inp) && normKey.startsWith(inp.toLowerCase())) return true;
        return false;
    };

    const submit = (force = false) => {
        if (locked) return;
        setPlaying(false);
        setTestState('evaluating');
        window.setTimeout(() => {
            let correct = 0;
            if (hasDynamicData && !useMockFallback && Object.keys(dynamicAnswersKey).length > 0) {
                for (const [qNumStr, expected] of Object.entries(dynamicAnswersKey)) {
                    const qNum = Number(qNumStr);
                    const userAns = answers[qNum] || '';
                    if (isCorrect(userAns, expected)) {
                        correct++;
                    }
                }
            } else {
                correct =
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
            }

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

    const resetExam = () => {
        setPlaying(false);
        setProgress(0);
        setActivePart(1);
        setActiveGroupIndexInPart(0);
        setActiveGroupId(null);
        setActiveId(1);
        setAnswers({});
        setPicked(null);
        setScore(null);
        setElapsed(0);
        setTestState('active');
        setShowExitModal(false);
    };

    const handleExit = () => {
        setShowExitModal(false);
        if (isPartPractice && onExit) {
            onExit();
            return;
        }
        if (simulation) {
            simulation.onExit?.();
        } else {
            resetExam();
            onExit?.();
        }
    };

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
        const used = allCurrentIds.some((id) => answers[id] === option);
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

    const renderQuestionPill = (id: number) => {
        const isAnswered = !!(answers[id] && answers[id].trim() !== '');
        const isActive = activeId === id;
        let btnClass = 'relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all cursor-pointer select-none ';
        if (isActive) {
            btnClass += 'bg-[#0072CE] text-white font-bold ring-2 ring-blue-300 shadow-sm';
        } else if (isAnswered) {
            btnClass += 'bg-blue-50 text-[#0072CE] border border-blue-200 font-bold';
        } else {
            btnClass += 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50';
        }

        return (
            <button
                key={id}
                onClick={() => goTo(id)}
                className={btnClass}
                title={`Question ${id}`}
            >
                {id}
                {isAnswered && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2E7D32]" />
                )}
            </button>
        );
    };

    // Helper to render prompt with inline gap placeholders like [1], [2] or adjacent gap input
    const renderDynamicPromptWithGaps = (promptText: string, defaultQNum: number) => {
        const hasBracketGap = /\[(\d+)\]/.test(promptText);
        if (hasBracketGap) {
            const parts = promptText.split(/(\[\d+\])/g);
            return (
                <span className="leading-relaxed text-gray-800 text-[15px]">
                    {parts.map((part, pIdx) => {
                        const match = part.match(/^\[(\d+)\]$/);
                        if (match) {
                            const qNum = parseInt(match[1], 10);
                            return <GapInput key={pIdx} id={qNum} />;
                        }
                        return <span key={pIdx}>{part}</span>;
                    })}
                </span>
            );
        }

        return (
            <div className="flex flex-wrap items-center gap-2.5 py-1">
                <span className="font-semibold text-neutral-800 min-w-5">{defaultQNum}.</span>
                <span className="text-[15px] text-gray-800 leading-relaxed">{promptText}</span>
                <GapInput id={defaultQNum} />
            </div>
        );
    };

    // Dynamic question renderer supporting NOTE_COMPLETION, MULTIPLE_CHOICE, MATCHING_FEATURES, MATCHING_ENDINGS, TABLE_COMPLETION, FLOW_CHART, MAP_LABELLING
    const renderDynamicGroup = (group: DynamicListeningQuestionGroup, gIdx: number) => {
        const rawType = (group.question_type || '').toUpperCase();
        const typeLabel = rawType.replace(/_/g, ' ');

        return (
            <div
                key={group.id || gIdx}
                id={`question-group-${activePart}-${gIdx}`}
                data-group-index={gIdx}
                data-part={activePart}
                ref={(el) => { groupRefs.current[`${activePart}-${gIdx}`] = el; }}
                className="question-group-section space-y-6 pb-8 border-b border-gray-100 last:border-b-0"
            >
                <div>
                    <div className="flex items-baseline gap-2 mb-1.5">
                        <h4 className="font-bold text-base text-gray-900">{group.title}</h4>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            {typeLabel}
                        </span>
                    </div>
                    {group.instructions && (
                        <div
                            className="text-sm text-neutral-700 leading-relaxed mb-4 [&>strong]:font-bold [&>em]:italic"
                            dangerouslySetInnerHTML={{ __html: group.instructions }}
                        />
                    )}
                </div>

                {/* Question Type: MULTIPLE_CHOICE */}
                {rawType === 'MULTIPLE_CHOICE' && (
                    <div className="space-y-6">
                        {group.questions.map((q) => {
                            const opts = q.options && q.options.length > 0 ? q.options : (group.choices || []);
                            return (
                                <div key={q.id} ref={(el) => { scrollRefs.current[q.question_number] = el; }} className="space-y-3">
                                    <p className="text-[15px] font-medium text-gray-900 leading-relaxed">
                                        <span className="font-bold mr-1.5">{q.question_number}.</span>
                                        {q.prompt}
                                    </p>
                                    <div className="space-y-2 ml-4 sm:ml-6">
                                        {opts.map((opt, optIdx) => {
                                            const optLetter = String.fromCharCode(65 + optIdx);
                                            const cleanOpt = opt.replace(/^[A-Z][\.\)\-\:]\s*/i, '');
                                            const isSelected =
                                                answers[q.question_number] === opt ||
                                                answers[q.question_number] === optLetter ||
                                                answers[q.question_number] === cleanOpt;
                                            return (
                                                <label
                                                    key={optIdx}
                                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-[14px] cursor-pointer transition-colors ${
                                                        isSelected
                                                            ? 'border-[#0072CE] bg-[#D0E8FF]/40 font-medium text-gray-900'
                                                            : 'border-neutral-300 bg-white hover:border-[#0072CE] text-gray-800'
                                                    } ${locked ? 'opacity-60' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`q${q.question_number}`}
                                                        value={optLetter}
                                                        checked={isSelected}
                                                        disabled={locked}
                                                        onChange={() => setAnswer(q.question_number, optLetter)}
                                                        className="accent-[#0072CE] w-4 h-4 shrink-0"
                                                    />
                                                    <span>
                                                        <strong className="mr-1.5 text-gray-600">{optLetter}.</strong>
                                                        {cleanOpt}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Question Type: MATCHING_FEATURES / MATCHING_ENDINGS / MATCHING */}
                {(rawType === 'MATCHING_FEATURES' || rawType === 'MATCHING_ENDINGS' || rawType === 'MATCHING') && (
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,250px)] gap-6">
                        <div className="space-y-3.5">
                            {group.questions.map((q) => (
                                <div
                                    key={q.id}
                                    ref={(el) => { scrollRefs.current[q.question_number] = el; }}
                                    className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50/80 transition-colors"
                                >
                                    <span className="text-[15px] font-medium text-neutral-800 flex-1">
                                        <span className="font-bold mr-1.5">{q.question_number}.</span>
                                        {q.prompt}
                                    </span>
                                    <DropSlot id={q.question_number} className="w-44 shrink-0" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Options</p>
                            <div className="flex flex-wrap lg:flex-col gap-2 bg-[#F9FAFB] p-3 rounded-xl border border-gray-200">
                                {(group.choices || []).map((opt) => (
                                    <OptionPill key={opt} option={opt} full />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Question Type: FLOW_CHART / FLOW_CHART_COMPLETION */}
                {(rawType === 'FLOW_CHART' || rawType === 'FLOW_CHART_COMPLETION') && (
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)] gap-6">
                        <div className="space-y-2">
                            {group.questions.map((q, idx) => (
                                <React.Fragment key={q.id}>
                                    {idx > 0 && (
                                        <div className="text-center text-neutral-400 text-lg font-bold py-0.5">↓</div>
                                    )}
                                    <div
                                        ref={(el) => { scrollRefs.current[q.question_number] = el; }}
                                        className="rounded-lg border border-neutral-300 bg-[#F9F9F9] px-4 py-3 text-[15px] leading-relaxed flex items-center justify-between gap-3"
                                    >
                                        <span>
                                            <span className="font-bold mr-1.5">{q.question_number}.</span>
                                            {q.prompt}
                                        </span>
                                        <DropSlot id={q.question_number} inline className="w-36 shrink-0" />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                        {group.choices && group.choices.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Choices Pool</p>
                                <div className="flex flex-wrap lg:flex-col gap-2 bg-[#F9FAFB] p-3 rounded-xl border border-gray-200">
                                    {group.choices.map((opt) => (
                                        <OptionPill key={opt} option={opt} full />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Question Type: MAP_LABELLING / DIAGRAM_LABELLING */}
                {(rawType === 'MAP_LABELLING' || rawType === 'DIAGRAM_LABELLING') && (
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)] gap-6">
                        <div className="space-y-4">
                            <div className="relative border border-neutral-300 rounded-lg bg-white overflow-hidden p-2">
                                <MapSVG />
                                {group.questions.map((q, idx) => {
                                    const slotPos = MAP_SLOTS[idx % MAP_SLOTS.length];
                                    return (
                                        <DropSlot
                                            key={q.id}
                                            id={q.question_number}
                                            className="absolute w-[140px] -translate-x-1/2 -translate-y-1/2 z-10"
                                            style={{ left: slotPos.left, top: slotPos.top }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Locations / Labels</p>
                            <div className="flex flex-wrap lg:flex-col gap-2 bg-[#F9FAFB] p-3 rounded-xl border border-gray-200">
                                {(group.choices || []).map((opt) => (
                                    <OptionPill key={opt} option={opt} full />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Question Type: TABLE_COMPLETION */}
                {rawType === 'TABLE_COMPLETION' && (
                    <div className="overflow-x-auto border border-neutral-300 rounded-lg bg-white">
                        <table className="w-full border-collapse">
                            {group.metadata?.headers && Array.isArray(group.metadata.headers) && (
                                <thead>
                                    <tr className="bg-gray-100 border-b border-neutral-300">
                                        {group.metadata.headers.map((h: string, hi: number) => (
                                            <th key={hi} className="px-3 py-2 text-left font-bold text-xs text-gray-700 uppercase tracking-wider border-r border-neutral-300 last:border-r-0">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {group.questions.map((q) => (
                                    <tr key={q.id} className="border-b border-neutral-200 last:border-b-0 hover:bg-gray-50/50">
                                        <td className="px-3 py-2.5 text-sm font-medium text-gray-700 w-16 text-center">
                                            Q{q.question_number}
                                        </td>
                                        <td className="px-3 py-2.5 text-[15px] text-gray-800">
                                            {renderDynamicPromptWithGaps(q.prompt, q.question_number)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Question Type: NOTE_COMPLETION / SENTENCE_COMPLETION / SHORT_ANSWER / Fallback */}
                {rawType !== 'MULTIPLE_CHOICE' &&
                 rawType !== 'MATCHING_FEATURES' &&
                 rawType !== 'MATCHING_ENDINGS' &&
                 rawType !== 'MATCHING' &&
                 rawType !== 'FLOW_CHART' &&
                 rawType !== 'FLOW_CHART_COMPLETION' &&
                 rawType !== 'MAP_LABELLING' &&
                 rawType !== 'DIAGRAM_LABELLING' &&
                 rawType !== 'TABLE_COMPLETION' && (
                    <div className="space-y-4 bg-[#F9FAFB] border border-gray-200 rounded-2xl p-6 shadow-2xs">
                        {group.questions.map((q) => (
                            <div key={q.id} ref={(el) => { scrollRefs.current[q.question_number] = el; }} className="py-1">
                                {renderDynamicPromptWithGaps(q.prompt, q.question_number)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // 1. Loading State Screen (Centered Spinner & Skeleton)
    if (isLoadingData) {
        return (
            <div className="flex flex-col h-full w-full bg-white select-none">
                <header className="shrink-0 h-14 bg-[#121212] border-b border-neutral-800 flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExit}
                            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-800"
                            title="Exit Exam"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {sourceType === 'cambridge' ? `CAMBRIDGE ${bookNumber}` : `MOCK SERIES ${bookNumber}`}
                            </span>
                            <h1 className="text-base font-bold text-white leading-tight">
                                Listening Test {testNumber}
                            </h1>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAFAFA]">
                    <div className="relative mb-5">
                        <div className="w-14 h-14 rounded-full border-4 border-blue-100 border-t-[#0072CE] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0072CE]">
                            🎧
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Loading Listening Exam</h3>
                    <p className="text-sm text-gray-500 max-w-sm text-center mb-6">
                        Fetching dynamic parts, question groups, and audio synchronized from Supabase...
                    </p>
                    <div className="w-full max-w-md space-y-3 bg-white p-5 rounded-xl border border-gray-200 shadow-xs animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                        <div className="h-3 bg-gray-100 rounded w-4/6" />
                        <div className="pt-2 flex gap-2">
                            <div className="h-8 bg-gray-200 rounded w-28" />
                            <div className="h-8 bg-gray-200 rounded w-28" />
                            <div className="h-8 bg-gray-200 rounded w-28" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Empty / Fallback State Screen (Automatically fall back to static mock dataset)
    if (!isLoadingData && !hasDynamicData && !useMockFallback) {
        setUseMockFallback(true);
        return null;
    }

    if (testState === 'evaluating') {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F2F2]">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full border border-[#CCCCCC]">
                    <h2 className="text-2xl font-bold text-[#0072CE] mb-4">Exam Completed</h2>
                    <p className="text-neutral-600">Evaluating your answers...</p>
                </div>
            </div>
        );
    }

    if (testState === 'completed') {
        const band = score != null ? rawToBand(score) : null;
        return (
            <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-[#F2F2F2]">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#0072CE] mb-4">Exam Completed</h2>
                    <p className="text-lg text-neutral-800 mb-2">Score: <strong>{score}</strong> / {allCurrentIds.length}</p>
                    <p className="text-lg text-neutral-800 mb-6">Band: <strong>{band?.toFixed(1)}</strong></p>
                    <button
                        onClick={handleExit}
                        className="px-6 py-2.5 bg-[#0072CE] text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold cursor-pointer shadow-md shadow-blue-500/20"
                    >
                        Back to Listening Hub
                    </button>
                </div>
            </div>
        );
    }

    const bannerText = `Listen and answer questions ${PART_RANGE[activePart]}.`;

    return (
        <div className="flex flex-col h-full w-full relative bg-[#FFFFFF] text-black font-sans min-w-0 overflow-hidden" style={{ flex: 1 }}>
            {/* Unified Reading-Style Top Header Bar */}
            {/* Unified Reading-Style Top Header Bar */}
            <header className="relative shrink-0 h-14 bg-[#121212] border-b border-neutral-800 flex items-center justify-between px-4 sm:px-6 z-20 select-none">
                {/* Top Left: Active test title display */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-800 cursor-pointer"
                        title="Exit Exam"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>

                    <div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            {sourceType === 'cambridge' ? `CAMBRIDGE ${bookNumber}` : `MOCK SERIES ${bookNumber}`}
                        </span>
                        <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                            {isPartPractice ? `Listening Test ${testNumber} · Part ${activePart}` : `Listening Test ${testNumber}`}
                        </h1>
                    </div>
                </div>

                {/* Top Center: Test Timer (Centered Horizontally) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="text-white shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className={`font-bold text-sm sm:text-base text-white tracking-wide ${lowTime ? 'text-red-400 animate-pulse' : ''}`}>
                        {formatClock(Math.max(0, timeLimit - elapsed))} Left
                    </span>
                </div>

                {/* Top Right Controls: Volume + Font Adjuster + Help + Full Screen */}
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                    {/* 1. Speaker icon + Blue volume slider with circular fill track */}
                    <div className="flex items-center gap-2 text-neutral-300">
                        <button
                            onClick={toggleMute}
                            className="p-1 text-white hover:text-blue-400 transition-colors cursor-pointer"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted || volume === 0 ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <line x1="23" y1="9" x2="17" y2="15"></line>
                                    <line x1="17" y1="9" x2="23" y2="15"></line>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                            )}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setVolume(val);
                                if (isMuted && val > 0) setIsMuted(false);
                            }}
                            style={{
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${isMuted ? 0 : volume}%, #E5E7EB ${isMuted ? 0 : volume}%, #E5E7EB 100%)`
                            }}
                            className="ielts-volume-slider w-20 sm:w-28 cursor-pointer focus:outline-none"
                            title={`Volume: ${isMuted ? 0 : volume}%`}
                        />
                    </div>

                    {/* 2. [ A | A | A ] Segmented Font Resizer pill box */}
                    <div className="flex items-center border border-neutral-700 bg-neutral-900/90 rounded-md p-0.5">
                        <button
                            onClick={() => setFontSize('small')}
                            className={`px-2 py-0.5 text-xs font-bold transition-all cursor-pointer ${
                                fontSize === 'small' ? 'bg-white text-black rounded shadow-xs' : 'text-white hover:text-white/80 bg-transparent'
                            }`}
                            title="Small Font"
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('medium')}
                            className={`px-2 py-0.5 text-sm font-bold transition-all cursor-pointer ${
                                fontSize === 'medium' ? 'bg-white text-black rounded shadow-xs' : 'text-white hover:text-white/80 bg-transparent'
                            }`}
                            title="Medium Font (Default)"
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('large')}
                            className={`px-2 py-0.5 text-base font-bold transition-all cursor-pointer ${
                                fontSize === 'large' ? 'bg-white text-black rounded shadow-xs' : 'text-white hover:text-white/80 bg-transparent'
                            }`}
                            title="Large Font"
                        >
                            A
                        </button>
                    </div>

                    {/* 3. Help ? rounded white button */}
                    <button
                        onClick={() => setShowHelpModal(true)}
                        className="px-3 sm:px-3.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs sm:text-sm rounded-md border border-neutral-200 transition-colors shadow-xs cursor-pointer"
                        title="Exam Instructions & Help"
                    >
                        Help ?
                    </button>

                    {/* 4. Full Screen rounded white button with expand icon */}
                    <button
                        onClick={toggleFullscreen}
                        className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs sm:text-sm rounded-md border border-neutral-200 transition-colors shadow-xs cursor-pointer"
                        title="Toggle Full Screen"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                        <span className="hidden xs:inline">{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
                    </button>
                </div>
            </header>

            {/* Question Workspace — Scrollable Viewport with Dynamic Font Scaling */}
            <main
                ref={questionViewportRef}
                className={`flex-1 min-h-0 overflow-y-auto pb-28 bg-[#FFFFFF] custom-scrollbar ielts-question-viewport relative ${
                    fontSize === 'small' ? 'ielts-font-small text-sm' : fontSize === 'large' ? 'ielts-font-large text-lg' : 'ielts-font-medium text-base'
                }`}
                style={{
                    zoom: fontSize === 'small' ? 0.85 : fontSize === 'large' ? 1.18 : 1,
                }}
            >
                {/* Anti-Gravity Sticky Sub-Header Pinned Directly Under Top Navbar */}
                {renderStickyHeader()}

                {hasDynamicData && !useMockFallback ? (
                    <div className="max-w-4xl mx-auto px-8 py-6 space-y-8">
                        {activeDynamicGroup ? (
                            renderDynamicGroup(activeDynamicGroup, activeGroupIndexInPart)
                        ) : (
                            <div className="max-w-3xl mx-auto px-8 py-6">
                                <h4 className="font-bold text-base mb-1">Questions {PART_RANGE[activePart]}</h4>
                                <div className="rounded-lg border border-dashed border-neutral-300 bg-[#F9F9F9] p-10 text-center">
                                    <p className="text-3xl mb-2 opacity-50">🎧</p>
                                    <p className="text-sm text-neutral-500">Part {activePart} questions are not available for this test yet.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : activePart === 1 ? (
                    <div className="max-w-3xl mx-auto px-8 py-6">
                        <div
                            data-group-index={0}
                            data-part={1}
                            className="question-group-section"
                        >
                            <h4 className="font-bold text-base mb-1">Questions 1–10</h4>
                            <p className="text-sm text-neutral-700 mb-5">{LISTENING_PART1_DATA.instructions}</p>

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
                    <div className="max-w-4xl mx-auto px-8 py-6 space-y-9">
                        {activeGroupIndexInPart === 0 ? (
                            <section
                                ref={(el) => { groupRefs.current['2-0'] = el; }}
                                data-group-index={0}
                                data-part={2}
                                className="question-group-section"
                            >
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
                        ) : (
                            <section
                                ref={(el) => { groupRefs.current['2-1'] = el; }}
                                data-group-index={1}
                                data-part={2}
                                className="question-group-section"
                            >
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
                        )}
                    </div>
                ) : activePart === 3 ? (
                    <div className="max-w-4xl mx-auto px-8 py-6 space-y-9">
                        {activeGroupIndexInPart === 0 ? (
                            <section
                                ref={(el) => { groupRefs.current['3-0'] = el; }}
                                data-group-index={0}
                                data-part={3}
                                className="question-group-section"
                            >
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
                        ) : (
                            <section
                                ref={(el) => { groupRefs.current['3-1'] = el; }}
                                data-group-index={1}
                                data-part={3}
                                className="question-group-section"
                            >
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
                        )}
                    </div>
                ) : activePart === 4 ? (
                    <div className="max-w-4xl mx-auto px-8 py-6 space-y-9">
                        {activeGroupIndexInPart === 0 ? (
                            <section
                                ref={(el) => { groupRefs.current['4-0'] = el; }}
                                data-group-index={0}
                                data-part={4}
                                className="question-group-section"
                            >
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
                        ) : activeGroupIndexInPart === 1 ? (
                            <section
                                ref={(el) => { groupRefs.current['4-1'] = el; }}
                                data-group-index={1}
                                data-part={4}
                                className="question-group-section"
                            >
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
                        ) : (
                            <section
                                ref={(el) => { groupRefs.current['4-2'] = el; }}
                                data-group-index={2}
                                data-part={4}
                                className="question-group-section"
                            >
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
                        )}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto px-8 py-6">
                        <h4 className="font-bold text-base mb-1">Questions {PART_RANGE[activePart]}</h4>
                        <p className="text-sm text-neutral-700 mb-6">{bannerText}</p>
                        <div className="rounded-lg border border-dashed border-neutral-300 bg-[#F9F9F9] p-10 text-center">
                            <p className="text-3xl mb-2 opacity-50">🎧</p>
                            <p className="text-sm text-neutral-500">Part {activePart} audio and questions are not part of this build yet.</p>
                            <p className="text-xs text-neutral-400 mt-1">Switch back to an earlier part to answer its questions.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Floating Layered Navigation Buttons (Previous / Next Group) */}
            <div className="fixed bottom-[68px] right-6 z-20 flex items-center gap-2 select-none pointer-events-auto">
                <button
                    onClick={() => prevGroup && handleScrollToGroup(prevGroup)}
                    disabled={!prevGroup}
                    className="w-10 h-10 rounded-lg bg-[#A3A3A3] hover:bg-[#8E8E8E] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
                    title={prevGroup ? `Previous group (${prevGroup.startQuestion}–${prevGroup.endQuestion})` : 'Previous group'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <button
                    onClick={() => nextGroup && handleScrollToGroup(nextGroup)}
                    disabled={!nextGroup}
                    className="w-10 h-10 rounded-lg bg-[#121212] hover:bg-black active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
                    title={nextGroup ? `Next group (${nextGroup.startQuestion}–${nextGroup.endQuestion})` : 'Next group'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </div>

            {/* Pinned Bottom Navigation Dock */}
            <footer className="fixed bottom-0 left-0 right-0 w-full h-[56px] bg-white border-t border-gray-200 flex items-center justify-between px-4 sm:px-6 z-30 select-none shadow-sm">
                {/* Left & Center: Part & Question Palette */}
                <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0 overflow-x-auto no-scrollbar py-1">
                    {(isPartPractice ? [activePart] : ([1, 2, 3, 4] as const)).map((partNum) => {
                        const isCurrentPart = activePart === partNum;
                        const partIds = dynamicPartIds[partNum] || [];
                        const answeredCount = countAnswered(partIds);

                        return (
                            <div key={partNum} className="flex items-center gap-2 shrink-0">
                                {isCurrentPart ? (
                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                        <span className="font-bold text-sm text-gray-900 shrink-0">Part {partNum}</span>
                                        <div className="flex items-center gap-1 sm:gap-1.5">
                                            {partIds.map((id) => renderQuestionPill(id))}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setActivePart(partNum);
                                            if (partIds[0]) goTo(partIds[0]);
                                        }}
                                        className="text-left group cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                                    >
                                        <div className="text-xs font-bold text-gray-700 group-hover:text-[#0072CE] transition-colors">
                                            Part {partNum}
                                        </div>
                                        <div className="text-[11px] text-gray-400">
                                            {answeredCount} of {partIds.length}
                                        </div>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Corner: Notepad and Submit Test buttons */}
                <div className="flex items-center gap-3 shrink-0 pl-3 sm:pl-4">
                    <button
                        onClick={() => setShowNotepad((prev) => !prev)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 border rounded-md text-sm font-semibold transition-colors shadow-xs cursor-pointer ${
                            showNotepad
                                ? 'bg-blue-50 border-[#0072CE] text-[#0072CE]'
                                : 'bg-white border-gray-300 hover:border-gray-400 text-neutral-800'
                        }`}
                        title="Candidate Notepad"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <span>Notepad</span>
                    </button>

                    <button
                        onClick={() => setShowSubmitConfirm(true)}
                        className="px-4 py-1.5 bg-[#00C281] hover:bg-[#00ab72] text-white rounded-md text-sm font-bold transition-colors shadow-xs cursor-pointer"
                    >
                        Submit Test
                    </button>
                </div>
            </footer>

            {/* Candidate Notepad Popup */}
            {showNotepad && (
                <div className="fixed bottom-[68px] right-6 z-40 w-80 sm:w-96 bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-100 border-b border-gray-200 select-none">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Candidate Notepad</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {notepadNotes && (
                                <button
                                    onClick={() => setNotepadNotes('')}
                                    className="text-[11px] text-gray-500 hover:text-red-600 transition-colors font-medium cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={() => setShowNotepad(false)}
                                className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                title="Close Notepad"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={notepadNotes}
                        onChange={(e) => setNotepadNotes(e.target.value)}
                        placeholder="Type notes or keywords here during the listening test... (Notes are saved automatically)"
                        className="w-full h-56 p-3 text-sm font-sans focus:outline-none resize-none bg-[#FFFEF9] text-gray-800 custom-scrollbar leading-relaxed"
                        autoFocus
                    />
                    <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between select-none">
                        <span>Notes are private and will not be submitted</span>
                        <span>{notepadNotes.length} chars</span>
                    </div>
                </div>
            )}

            {/* Help & Instructions Modal */}
            {showHelpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0072CE] flex items-center justify-center font-bold text-sm">?</span>
                                <h2 className="text-base sm:text-lg font-bold text-gray-900">IELTS Listening Help & Instructions</h2>
                            </div>
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-700 custom-scrollbar leading-relaxed">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">1. Test Structure</h3>
                                <p>The Listening test consists of 4 parts with 10 questions each (40 questions total). Time limit is 30 minutes.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">2. Volume & Font Size Controls</h3>
                                <p>Adjust audio volume with the slider in the top right header, or click the speaker icon to mute/unmute. Use the <strong>A A A</strong> font resizer to switch between Small, Medium, and Large text.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">3. Answering Questions</h3>
                                <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                                    <li><strong>Gap fill / Notes:</strong> Type your answer into the blank box. Note word limits carefully.</li>
                                    <li><strong>Drag & Drop / Map:</strong> Drag options into the numbered slots, or click an option and then click the slot.</li>
                                    <li><strong>Multiple Choice:</strong> Click your desired option to select it.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">4. Navigation & Notepad</h3>
                                <p>Use the question palette at the bottom to jump between questions. Use the floating <strong>&lt;</strong> and <strong>&gt;</strong> arrow buttons at the bottom right to navigate parts. Click <strong>Notepad</strong> to make private draft notes.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">5. Submitting</h3>
                                <p>When you have answered and reviewed all questions, click the green <strong>Submit Test</strong> button at the bottom right.</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="px-5 py-2 bg-[#0072CE] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Confirmation Modal */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#00C281] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                            ✓
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Submit?</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            You have answered <span className="font-bold text-gray-900">{countAnswered(allCurrentIds)}</span> of {allCurrentIds.length} questions.
                        </p>
                        {countAnswered(allCurrentIds) < allCurrentIds.length && (
                            <p className="text-xs text-amber-700 font-medium mb-5 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                Warning: You still have {allCurrentIds.length - countAnswered(allCurrentIds)} unanswered question(s).
                            </p>
                        )}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => setShowSubmitConfirm(false)}
                                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                Continue Test
                            </button>
                            <button
                                onClick={() => {
                                    setShowSubmitConfirm(false);
                                    submit(false);
                                }}
                                className="px-5 py-2 bg-[#00C281] hover:bg-[#00ab72] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                            >
                                Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <IELTSExitModal
                open={showExitModal}
                onConfirm={handleExit}
                onCancel={() => setShowExitModal(false)}
            />

            <style>{`
                /* Pinned Header Sub-Container (Anti-Gravity) */
                .part-sticky-header {
                    position: sticky;
                    top: 0;
                    z-index: 25;
                    background-color: #ffffff;
                    border-bottom: 1px solid #e5e7eb;
                    transition: box-shadow 0.2s ease-in-out;
                }

                /* Optional visual drop-shadow when content scrolls under it */
                .part-sticky-header.scrolled {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

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

                /* Dynamic Font Size Scaling across Question Viewport */
                .ielts-font-small {
                    font-size: 85%;
                }
                .ielts-font-medium {
                    font-size: 100%;
                }
                .ielts-font-large {
                    font-size: 118%;
                }

                @supports not (zoom: 1) {
                    .ielts-font-small,
                    .ielts-font-small * {
                        font-size: 0.9em !important;
                    }
                    .ielts-font-large,
                    .ielts-font-large * {
                        font-size: 1.12em !important;
                    }
                }

                /* Volume Range Slider */
                .ielts-volume-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    border-radius: 9999px;
                    height: 6px;
                }
                .ielts-volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background-color: #3B82F6;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
                    transition: transform 0.1s ease;
                }
                .ielts-volume-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                }
                .ielts-volume-slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background-color: #3B82F6;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
                    transition: transform 0.1s ease;
                }
                .ielts-volume-slider::-moz-range-thumb:hover {
                    transform: scale(1.15);
                }
            `}</style>
        </div>
    );
};

export default IELTSListeningExam;