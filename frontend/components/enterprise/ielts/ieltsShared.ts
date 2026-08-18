export type IeltsSkill = 'listening' | 'reading' | 'writing' | 'speaking';

export interface IeltsAttempt {
    id: number;
    skill: IeltsSkill;
    band: number;
    score?: number;
    taskType?: 'task1' | 'task2';
    date: string;
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
    { id: 1, skill: 'listening', band: 7.0, score: 32, date: 'Jul 28, 2026' },
    { id: 2, skill: 'reading', band: 6.5, score: 27, date: 'Aug 2, 2026' },
    { id: 3, skill: 'writing', band: 6.5, taskType: 'task2', date: 'Aug 9, 2026' },
    { id: 4, skill: 'speaking', band: 7.5, date: 'Aug 14, 2026' },
    { id: 5, skill: 'listening', band: 7.5, score: 34, date: 'Aug 17, 2026' },
    { id: 6, skill: 'reading', band: 7.0, score: 30, date: 'Aug 19, 2026' },
];

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