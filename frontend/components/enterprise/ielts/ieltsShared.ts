export type IeltsSkill = 'listening' | 'reading' | 'writing' | 'speaking';

export interface IeltsAttempt {
    id: number;
    skill: IeltsSkill;
    band: number;
    score?: number;
    taskType?: 'task1' | 'task2';
    date: string;
    timeSpent?: number;
    criteria?: { label: string; band: number }[];
    bundle?: string;
}

export interface WritingCriteria {
    taskAchievement: number;
    coherence: number;
    lexical: number;
    grammar: number;
}

export const roundToHalf = (v: number) => Math.round(v * 2) / 2;
export const clampBand = (v: number) => Math.max(4, Math.min(9, roundToHalf(v)));

export const ieltsKey = (suffix: string) => `stephen_enterprise_farmgate_ielts_${suffix}`;
export const ATTEMPTS_KEY = ieltsKey('attempts');

export const readJson = <T>(key: string, fallback: T): T => {
    const stored = localStorage.getItem(key);
    if (stored) {
        try {
            return JSON.parse(stored) as T;
        } catch {
            // ignore
        }
    }
    return fallback;
};

export const readAttempts = (): IeltsAttempt[] => readJson<IeltsAttempt[]>(ATTEMPTS_KEY, SEED_ATTEMPTS);

export const persistAttempts = (next: IeltsAttempt[]) => {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next));
};

export const addAttempt = (attempt: IeltsAttempt) => {
    const next = [attempt, ...readAttempts()].slice(0, 60);
    persistAttempts(next);
    return next;
};

export const clearAttempts = () => persistAttempts([]);

export const SEED_ATTEMPTS: IeltsAttempt[] = [
    { id: 1, skill: 'listening', band: 7.0, score: 32, date: 'Jul 28, 2026', timeSpent: 32, criteria: [{ label: 'Detail Recognition', band: 7.5 }, { label: 'Map Labelling', band: 6.5 }, { label: 'Number Capture', band: 7.0 }] },
    { id: 2, skill: 'reading', band: 6.5, score: 27, date: 'Aug 2, 2026', timeSpent: 38, criteria: [{ label: 'Skimming', band: 7.0 }, { label: 'TFNG Traps', band: 5.5 }, { label: 'Gap-Fill', band: 6.5 }] },
    { id: 3, skill: 'writing', band: 6.5, taskType: 'task2', date: 'Aug 9, 2026', timeSpent: 46, criteria: [{ label: 'Task Response', band: 6.5 }, { label: 'Coherence', band: 7.0 }, { label: 'Lexical Range', band: 6.0 }, { label: 'Grammar', band: 6.5 }] },
    { id: 4, skill: 'speaking', band: 7.5, date: 'Aug 14, 2026', timeSpent: 14, criteria: [{ label: 'Fluency', band: 7.5 }, { label: 'Lexical Resource', band: 7.0 }, { label: 'Pronunciation', band: 8.0 }, { label: 'Grammar', band: 7.0 }] },
    { id: 5, skill: 'listening', band: 7.5, score: 34, date: 'Aug 17, 2026', timeSpent: 29, criteria: [{ label: 'Detail Recognition', band: 8.0 }, { label: 'Map Labelling', band: 7.0 }, { label: 'Number Capture', band: 7.5 }] },
    { id: 6, skill: 'reading', band: 7.0, score: 30, date: 'Aug 19, 2026', timeSpent: 35, criteria: [{ label: 'Skimming', band: 7.5 }, { label: 'TFNG Traps', band: 6.5 }, { label: 'Gap-Fill', band: 7.0 }] },
];

export interface DiagnosticSubSkill {
    skill: IeltsSkill;
    subSkill: string;
    weight: number;
    note: string;
}

export const DIAGNOSTIC_SUBSKILLS: DiagnosticSubSkill[] = [
    { skill: 'listening', subSkill: 'Detail Recognition', weight: 64, note: 'Misses 2–3 specific facts per Section 3/4' },
    { skill: 'listening', subSkill: 'Number & Price Capture', weight: 71, note: 'Occasional digit transposition under speed' },
    { skill: 'reading', subSkill: 'TFNG Traps', weight: 58, note: 'Confuses FALSE vs NOT GIVEN in 2 of 5 attempts' },
    { skill: 'reading', subSkill: 'Gap-Fill Word Forms', weight: 66, note: 'Plural/tense mismatch in summary completions' },
    { skill: 'writing', subSkill: 'Task Response Logic', weight: 71, note: 'Paragraph focus drifts on Task 2 opinion essays' },
    { skill: 'writing', subSkill: 'Lexical Range', weight: 62, note: 'Repetitive generic lexis ("very", "good", "a lot")' },
    { skill: 'writing', subSkill: 'Grammar Accuracy', weight: 67, note: 'Subject-verb agreement + article slips' },
    { skill: 'speaking', subSkill: 'Fluency Pauses', weight: 69, note: '2+ second hesitation before Part 3 abstractions' },
    { skill: 'speaking', subSkill: 'Pronunciation Stress', weight: 74, note: 'Word-stress errors on multi-syllable items' },
];

export interface MistakeToken {
    token: string;
    type: 'grammar' | 'vocab' | 'logic';
    occurrences: number;
}

export const MISTAKE_TOKENS: MistakeToken[] = [
    { token: '"the the"', type: 'grammar', occurrences: 4 },
    { token: '"peoples"', type: 'grammar', occurrences: 7 },
    { token: '"a increase"', type: 'grammar', occurrences: 3 },
    { token: '"advices"', type: 'grammar', occurrences: 2 },
    { token: '"very good"', type: 'vocab', occurrences: 11 },
    { token: '"a lot"', type: 'vocab', occurrences: 9 },
    { token: 'FALSE vs NOT GIVEN', type: 'logic', occurrences: 5 },
    { token: 'Comma splice in task response', type: 'grammar', occurrences: 6 },
];

export const attemptStatus = (band: number): { label: string; color: string } => {
    if (band >= 7) return { label: 'Approved', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
    if (band >= 6) return { label: 'Developing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' };
    return { label: 'At Risk', color: 'text-red-400 bg-red-400/10 border-red-400/20' };
};

export type IeltsBundleId = 'sprint' | 'express' | 'mock';

export interface BundleSection {
    skill: IeltsSkill;
    minutes: number;
    label: string;
}

export interface IeltsBundle {
    id: IeltsBundleId;
    label: string;
    durationLabel: string;
    sections: BundleSection[];
}

export const BUNDLES: IeltsBundle[] = [
    {
        id: 'sprint',
        label: 'Diagnostic Sprint',
        durationLabel: '50 min',
        sections: [
            { skill: 'listening', minutes: 30, label: 'Listening Section' },
            { skill: 'reading', minutes: 20, label: 'Reading Section' },
        ],
    },
    {
        id: 'express',
        label: 'Express Output',
        durationLabel: '45 min',
        sections: [
            { skill: 'writing', minutes: 30, label: 'Writing Task' },
            { skill: 'speaking', minutes: 15, label: 'Speaking Task' },
        ],
    },
    {
        id: 'mock',
        label: 'Full Cambridge Mock',
        durationLabel: '2h 45m',
        sections: [
            { skill: 'listening', minutes: 30, label: 'Listening Section' },
            { skill: 'reading', minutes: 60, label: 'Reading Section' },
            { skill: 'writing', minutes: 60, label: 'Writing Task' },
            { skill: 'speaking', minutes: 15, label: 'Speaking Task' },
        ],
    },
];

export interface SimSectionResult {
    skill: IeltsSkill;
    band: number;
    score?: number;
    criteria?: { label: string; band: number }[];
    timeSpent: number;
}

export interface SimulationProps {
    sectionLabel: string;
    timeLimitSeconds: number;
    onComplete: (result: SimSectionResult) => void;
    onExit?: () => void;
}

export interface ExamMeta {
    durationLabel: string;
    questions: number;
    sections: string;
}

export const EXAM_META: Record<IeltsSkill, ExamMeta> = {
    listening: { durationLabel: '30 minutes', questions: 5, sections: '4 sections' },
    reading: { durationLabel: '20 minutes', questions: 5, sections: '1 passage · 5 questions' },
    writing: { durationLabel: '60 min (Task 2) · 20 min (Task 1)', questions: 1, sections: '1 essay / report' },
    speaking: { durationLabel: '~15 minutes', questions: 7, sections: '3 parts' },
};

export const formatClock = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(sec).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const rawToBand = (score: number): number => {
    if (score >= 39) return 9;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6;
    if (score >= 20) return 5.5;
    if (score >= 16) return 5;
    return 4;
};

export const TASK1_PROMPTS = [
    'The chart below shows the percentage of households with internet access in four countries from 2005 to 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    'The table shows the average number of hours spent on leisure activities per week across different age groups. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    'The diagram shows the process of recycling plastic bottles. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
];

export const TASK2_PROMPTS = [
    'Some people believe that university education should be free for everyone. To what extent do you agree or disagree?',
    'In many countries, remote work is becoming the norm. Discuss the advantages and disadvantages of this trend.',
    'Governments should invest more in public transport than in private road networks. Do you agree or disagree?',
];

export const SAMPLE_TASK1 = `The chart shows the percentage of people who used public transport in four major cities between 2000 and 2020. Overall, the figures for all cities increased over the period, although there were some differences between them.

In London, the percentage rose from 45% in 2000 to 62% in 2020, a growth of 17 percentage points. Paris showed a similar trend, with a increase from 38% to 55%. Meanwhile, Berlin had the highest usage, starting at 52% and reaching 68% by 2020. Tokyo, however, was the most stable, with the figure staying around 60% for most of the period.

The main reason for these increases is that governments have invested a lot in new trains and buses. Many peoples now choose public transport because it is faster and cheaper than driving. In conclusion, the data shows that public transport usage has grown significantly across all four cities.`;

export const SAMPLE_TASK2 = `Education is a very important thing in modern society, and many peoples believe that university education should be free for everyone. I strongly agree with this idea for a number of reasons. First of all, free education can help get a lot of good talent from all parts of society. When students do not have to pay big fees, they can focus on their studies instead of working part-time jobs. This is a very good thing because it creates a level playing field for everyone.

Secondly, governments can get a big benefit from an educated population. Countries with more graduates usually have stronger economies and better public services. For example, Germany and Norway provide free university education, and the the results are clear in their innovation and productivity. However, some people think that free education will reduce the quality of universities. They argue that when students pay money, they value their courses more. This is not always true because many free universities still have very high standards.

In conclusion, I believe that making university education free is a very good investment for any nation. Although there may be some challenges, the long-term benefits for individuals and society are much bigger than the costs. Governments should therefore provide free education to everyone who meets the entry requirements.`;

const WEAK_VOCAB_TOKENS = ['very', 'good', 'big', 'thing', 'get', 'a lot', 'stuff', 'nice', 'bad'];
const GRAMMAR_TOKENS = ['peoples', 'informations', 'equipments', 'advices', 'the the', 'a increase'];

export interface Segment {
    text: string;
    kind: 'plain' | 'vocab' | 'grammar';
}

interface Hit {
    start: number;
    end: number;
    kind: Segment['kind'];
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildSegments = (text: string): Segment[] => {
    const hits: Hit[] = [];
    const scan = (tokens: string[], kind: Hit['kind']) => {
        for (const token of tokens) {
            const re = new RegExp(escapeRegExp(token), 'gi');
            let m: RegExpExecArray | null;
            while ((m = re.exec(text)) !== null) {
                hits.push({ start: m.index, end: m.index + token.length, kind });
                if (m.index === re.lastIndex) re.lastIndex++;
            }
        }
    };
    scan(GRAMMAR_TOKENS, 'grammar');
    scan(WEAK_VOCAB_TOKENS, 'vocab');
    hits.sort((a, b) => a.start - b.start || a.end - b.end);

    const merged: Hit[] = [];
    for (const hit of hits) {
        const prev = merged[merged.length - 1];
        if (prev && hit.start < prev.end) {
            prev.end = Math.max(prev.end, hit.end);
            if (hit.kind === 'grammar') prev.kind = 'grammar';
        } else {
            merged.push({ ...hit });
        }
    }

    const segments: Segment[] = [];
    let cursor = 0;
    for (const hit of merged) {
        if (hit.start > cursor) segments.push({ text: text.slice(cursor, hit.start), kind: 'plain' });
        segments.push({ text: text.slice(hit.start, hit.end), kind: hit.kind });
        cursor = hit.end;
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), kind: 'plain' });
    return segments;
};

export const buildBilingual = (band: number, words: number): { en: string; bn: string } => {
    if (band >= 8) {
        return {
            en: `Excellent command. ${words} words submitted — your response is well-developed, cohesive, and precise. Maintain this standard in the final assessment.`,
            bn: 'Bhai, dhandho koreche! Apnar lekha clear ar cohesive. Linking words gulo jeno repetitive na hoy khayal korben.',
        };
    }
    if (band >= 7) {
        return {
            en: `Good command. ${words} words submitted — ideas are clear and mostly cohesive with only minor lexical or grammatical slips. Target varied sentence structures next.`,
            bn: 'Bhai, apnar lekha onek strong. Kintu transitions gulo repetitive — "Firstly", "Secondly" bar bar use kora avoid korun. Kichhu complex sentence structure add korle band improve hobe.',
        };
    }
    if (band >= 6) {
        return {
            en: `Competent. ${words} words submitted — arguments are adequate but development is uneven. Tighten paragraph focus and check punctuation-driven errors.`,
            bn: 'Bhai, apnar Task 2 te subject-verb agreement error ache, ar transitions gulo repetitive. Paragraph structure thik ache kintu idea development ektu shukno. Example ar explanation ektu beshi din.',
        };
    }
    return {
        en: `Developing. ${words} words submitted — the response addresses the prompt but needs deeper idea development and stronger cohesive devices. Review band descriptors before the next attempt.`,
        bn: 'Bhai, apnar lekha bojha sombho kintu grammar error beshi ache. Basic tense control korte hobe, ar ekta paragraph e ekta idea rakhen. Common error gulo fix korle band barbe.',
    };
};

export const evaluateWritingText = (text: string): { criteria: WritingCriteria; band: number } => {
    const words = text.trim().split(/\s+/).length;
    const hasParagraphs = text.includes('\n');
    const criteria: WritingCriteria = {
        taskAchievement: clampBand(6.0 + (words % 3) * 0.5),
        coherence: clampBand(6.0 + (hasParagraphs ? 0.5 : 0) + (words % 2) * 0.5),
        lexical: clampBand(5.5 + (words % 4) * 0.5),
        grammar: clampBand(6.0 + (words >= 150 ? 0.5 : -0.5) + (words % 2) * 0.5),
    };
    const band = roundToHalf(
        (criteria.taskAchievement + criteria.coherence + criteria.lexical + criteria.grammar) / 4
    );
    return { criteria, band };
};

export const skillLabels: Record<IeltsSkill, string> = {
    listening: 'Listening',
    reading: 'Reading',
    writing: 'Writing',
    speaking: 'Speaking',
};

export const skillColors: Record<IeltsSkill, string> = {
    listening: 'text-sky-400',
    reading: 'text-emerald-400',
    writing: 'text-amber-400',
    speaking: 'text-violet-400',
};

export const skillDotColors: Record<IeltsSkill, string> = {
    listening: 'bg-sky-400',
    reading: 'bg-emerald-400',
    writing: 'bg-amber-400',
    speaking: 'bg-violet-400',
};