import {
    BUNDLES,
    SAMPLE_TASK2,
    skillLabels,
    attemptStatus,
    type IeltsAttempt,
    type IeltsSkill,
    type IeltsBundleId,
} from './ieltsShared';

/* ───────────────────────── Utilities ───────────────────────── */

const seeded = (seed: number) => {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const ALLOCATED_MINUTES: Record<IeltsSkill, number> = {
    listening: 30,
    reading: 60,
    writing: 60,
    speaking: 14,
};

/* ───────────────────────── Types ───────────────────────── */

export interface ObjectiveQuestionType {
    type: string;
    accuracy: number;
    count: number;
    critical: boolean;
}

export interface ObjectivePacing {
    part: string;
    minutes: number;
    avgPerQ: number;
    warning?: string;
}

export interface ObjectiveAnswer {
    q: number;
    your: string;
    correct: string;
    type: string;
    timeSpent: number;
    status: 'correct' | 'incorrect' | 'unanswered';
}

export interface ObjectivePassageCtx {
    heading: string;
    paragraph: string;
    highlight: string;
    trick: string;
}

export interface ObjectiveAnalysis {
    band: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
    timeSpent: number;
    allocated: number;
    questionTypes: ObjectiveQuestionType[];
    pacing: ObjectivePacing[];
    answers: ObjectiveAnswer[];
    passageCtx: ObjectivePassageCtx;
}

export type SegmentKind = 'plain' | 'grammar' | 'vocab' | 'strong';

export interface AnalysisSegment {
    text: string;
    kind: SegmentKind;
}

export interface WritingCriterion {
    code: string;
    name: string;
    band: number;
    note: string;
}

export interface WritingRewrite {
    original: string;
    upgraded: string;
}

export interface WritingTeacher {
    verified: boolean;
    remark: string;
    audioNote: boolean;
}

export interface WritingAnalysis {
    band: number;
    criteria: WritingCriterion[];
    segments: AnalysisSegment[];
    rewrites: WritingRewrite[];
    teacher: WritingTeacher;
}

export interface SpeakingCriterion {
    code: string;
    name: string;
    band: number;
    note: string;
}

export interface SpeakingMarker {
    time: number;
    type: 'pause' | 'filler';
    label: string;
}

export interface SpeakingTranscriptLine {
    text: string;
    kind: 'plain' | 'grammar' | 'pron';
    note?: string;
}

export interface SpeakingMetrics {
    wpm: number;
    pauseFreq: number;
    c1c2Density: number;
}

export interface SpeakingAnalysis {
    band: number;
    criteria: SpeakingCriterion[];
    waveform: number[];
    markers: SpeakingMarker[];
    transcript: SpeakingTranscriptLine[];
    metrics: SpeakingMetrics;
}

export interface BundleSectionAnalysis {
    skill: IeltsSkill;
    label: string;
    band: number;
}

export interface BundleVerdict {
    readiness: number;
    prediction: number;
    focus: string[];
}

export interface BundleAnalysis {
    label: string;
    sections: BundleSectionAnalysis[];
    radar: Record<IeltsSkill, number>;
    verdict: BundleVerdict;
}

export type AnalysisKind = 'objective' | 'writing' | 'speaking' | 'bundle';

export interface ResolvedAnalysis {
    kind: AnalysisKind;
    objective?: ObjectiveAnalysis;
    writing?: WritingAnalysis;
    speaking?: SpeakingAnalysis;
    bundle?: BundleAnalysis;
    skill?: IeltsSkill;
    bundleId?: IeltsBundleId;
    attemptDate?: string;
    title?: string;
}

/* ───────────────────────── Objective ───────────────────────── */

const STR_QUESTIONS = ['T/F/NG', 'Matching Headings', 'Multiple Choice', 'Sentence Completion'];
const LISTEN_QUESTIONS = ['Form Completion', 'Multiple Choice', 'Map Labelling', 'Matching'];

export const buildObjective = (attempt: IeltsAttempt): ObjectiveAnalysis => {
    const rnd = seeded(attempt.id);
    const skill = attempt.skill;
    const band = attempt.band;
    const total = 40;
    const correct = attempt.score != null ? attempt.score : Math.round(clamp((band / 9) * total, 0, total));
    const incorrect = Math.round((total - correct) * (0.55 + rnd() * 0.25));
    const unanswered = Math.max(0, total - correct - incorrect);
    const timeSpent = attempt.timeSpent ?? ALLOCATED_MINUTES[skill];
    const allocated = ALLOCATED_MINUTES[skill];

    const types = (skill === 'listening' ? LISTEN_QUESTIONS : STR_QUESTIONS).map((type) => {
        const base = (band / 9) * 100;
        const accuracy = Math.round(clamp(base + (rnd() * 30 - 15), 22, 98));
        return { type, accuracy, count: 10, critical: accuracy < 60 };
    });

    const pacingParts = skill === 'listening'
        ? ['Part 1', 'Part 2', 'Part 3', 'Part 4']
        : ['Passage 1', 'Passage 2', 'Passage 3'];
    const pacing = pacingParts.map((part, i) => {
        const share = (i + 1) / pacingParts.length;
        const minutes = Math.round((timeSpent * (0.7 + share * 0.6)) / pacingParts.length + rnd() * 2);
        const avgPerQ = Math.round((minutes * 60) / 10);
        const threshold = skill === 'listening' ? 9 : 22;
        const warning = minutes > threshold ? '⚠️ Time Sink' : undefined;
        return { part, minutes, avgPerQ, warning };
    });

    const sampleTypes = skill === 'listening' ? LISTEN_QUESTIONS : STR_QUESTIONS;
    const answers: ObjectiveAnswer[] = Array.from({ length: 10 }, (_, i) => {
        const q = i + 1;
        const type = sampleTypes[i % sampleTypes.length];
        const isCorrect = rnd() < correct / total;
        const isAnswered = rnd() < 0.92;
        const your = isAnswered ? (isCorrect ? 'correct' : 'wrong') : '—';
        const status: ObjectiveAnswer['status'] = !isAnswered ? 'unanswered' : isCorrect ? 'correct' : 'incorrect';
        return { q, your, correct: 'correct', type, timeSpent: Math.round(30 + rnd() * 90), status };
    });

    const passageCtx: ObjectivePassageCtx = {
        heading: skill === 'listening' ? 'Listening — Section 3 Transcript' : 'Reading — Passage 3',
        paragraph:
            'The report noted a substantial drop in participation after the policy change, with figures declining from 62% to 41% over the following twelve months.',
        highlight: 'substantial drop',
        trick: "Passage used 'substantial drop', the question asked for 'significant decrease' — a classic paraphrase trap.",
    };

    return {
        band,
        correct,
        incorrect,
        unanswered,
        total,
        timeSpent,
        allocated,
        questionTypes: types,
        pacing,
        answers,
        passageCtx,
    };
};

/* ───────────────────────── Writing ───────────────────────── */

const GRAMMAR_TOKENS = ['peoples', 'informations', 'equipments', 'advices', 'the the', 'a increase', 'very good', 'a lot'];
const WEAK_VOCAB_TOKENS = ['very', 'good', 'big', 'thing', 'get', 'a lot', 'stuff', 'nice', 'bad'];
const STRONG_TOKENS = [
    'level playing field',
    'significant',
    'substantial',
    'moreover',
    'nevertheless',
    'pivotal role',
    'robust',
    'compelling',
    'underscore',
    'yielding',
];

interface SegHit {
    start: number;
    end: number;
    kind: SegmentKind;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildEssaySegments = (text: string): AnalysisSegment[] => {
    const hits: SegHit[] = [];
    const scan = (tokens: string[], kind: SegmentKind) => {
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
    scan(STRONG_TOKENS, 'strong');

    hits.sort((a, b) => a.start - b.start || a.end - b.end);
    const merged: SegHit[] = [];
    for (const hit of hits) {
        const prev = merged[merged.length - 1];
        if (prev && hit.start < prev.end) {
            prev.end = Math.max(prev.end, hit.end);
            const order: SegmentKind[] = ['grammar', 'strong', 'vocab'];
            if (order.indexOf(hit.kind) > order.indexOf(prev.kind)) prev.kind = hit.kind;
        } else {
            merged.push({ ...hit });
        }
    }

    const segments: AnalysisSegment[] = [];
    let cursor = 0;
    for (const hit of merged) {
        if (hit.start > cursor) segments.push({ text: text.slice(cursor, hit.start), kind: 'plain' });
        segments.push({ text: text.slice(hit.start, hit.end), kind: hit.kind });
        cursor = hit.end;
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), kind: 'plain' });
    return segments;
};

const genCriteria = (
    attempt: IeltsAttempt,
    defaults: { code: string; name: string }[],
): { code: string; name: string; band: number; note: string }[] => {
    const rnd = seeded(attempt.id + defaults.length);
    const present = attempt.criteria && attempt.criteria.length >= 4 ? attempt.criteria : null;
    return defaults.map((d, i) => {
        const band = present ? present[i].band : Math.round(clamp(attempt.band + (rnd() * 1.4 - 0.7), 4, 9) * 2) / 2;
        const note = band >= 7
            ? 'Strong control — minor refinement only.'
            : band >= 6
            ? 'Competent but inconsistent.'
            : 'Frequent slips — targeted drilling needed.';
        return { code: d.code, name: d.name, band, note };
    });
};

export const buildWriting = (attempt: IeltsAttempt): WritingAnalysis => {
    const criteria = genCriteria(attempt, [
        { code: 'TR/TA', name: 'Task Response / Achievement' },
        { code: 'CC', name: 'Coherence & Cohesion' },
        { code: 'LR', name: 'Lexical Resource' },
        { code: 'GRA', name: 'Grammatical Accuracy' },
    ]);

    const rewrites: WritingRewrite[] = [
        {
            original: 'Education is a very important thing in modern society, and many peoples believe that university should be free.',
            upgraded:
                'Education plays a pivotal role in modern society, and a substantial number of people contend that tertiary education ought to be free.',
        },
        {
            original: 'This is a very good thing because it creates a level playing field for everyone.',
            upgraded:
                'This is compelling because it yields a more equitable playing field for all segments of society.',
        },
        {
            original: 'Governments can get a big benefit from an educated population.',
            upgraded:
                'Governments stand to derive significant long-term benefit from a well-educated populace.',
        },
    ];

    const teacher: WritingTeacher = {
        verified: true,
        remark:
            'Solid Task 2 with clear position. Watch "peoples"/"a lot" and push lexical range toward Band 8 collocations. Paragraph 2 is your strongest.',
        audioNote: true,
    };

    return {
        band: attempt.band,
        criteria,
        segments: buildEssaySegments(SAMPLE_TASK2),
        rewrites,
        teacher,
    };
};

/* ───────────────────────── Speaking ───────────────────────── */

export const buildSpeaking = (attempt: IeltsAttempt): SpeakingAnalysis => {
    const rnd = seeded(attempt.id + 7);
    const band = attempt.band;

    const criteria = genCriteria(attempt, [
        { code: 'FC', name: 'Fluency & Coherence' },
        { code: 'LR', name: 'Lexical Resource' },
        { code: 'GRA', name: 'Grammatical Accuracy' },
        { code: 'PR', name: 'Pronunciation & Pace' },
    ]);

    const waveform = Array.from({ length: 64 }, () => Math.round(6 + rnd() * 26));
    const markers: SpeakingMarker[] = [
        { time: 8, type: 'pause', label: '2.4s pause' },
        { time: 19, type: 'filler', label: '“um”' },
        { time: 33, type: 'pause', label: '2.1s pause' },
        { time: 47, type: 'filler', label: '“like”' },
        { time: 56, type: 'pause', label: '2.8s pause' },
    ];

    const transcript: SpeakingTranscriptLine[] = [
        { text: 'I think one of the main reasons is that', kind: 'plain' },
        { text: 'peoples', kind: 'grammar', note: 'Use “people” (uncountable).' },
        { text: 'now choose public transport because it is', kind: 'plain' },
        { text: 'a lot', kind: 'grammar', note: 'Replace with “considerably” for Band 8.' },
        { text: 'faster and', kind: 'plain' },
        { text: 'pro-GRESS', kind: 'pron', note: 'Stress on second syllable: pro-GRESS.' },
        { text: 'cheaper than driving.', kind: 'plain' },
    ];

    const metrics: SpeakingMetrics = {
        wpm: Math.round(95 + (band - 5) * 18 + rnd() * 10),
        pauseFreq: Math.round((3 + (7 - band) * 1.2) * 10) / 10,
        c1c2Density: Math.round(clamp(20 + (band - 5) * 12, 10, 85)),
    };

    return { band, criteria, waveform, markers, transcript, metrics };
};

/* ───────────────────────── Bundle ───────────────────────── */

const bundleIdFromLabel = (label?: string): IeltsBundleId | undefined =>
    BUNDLES.find((b) => b.label === label)?.id;

const buildBundle = (attempts: IeltsAttempt[], bundleId: IeltsBundleId): BundleAnalysis => {
    const bundle = BUNDLES.find((b) => b.id === bundleId) ?? BUNDLES[0];
    const label = bundle.label;
    const bundleAttempts = attempts.filter((a) => a.bundle === label);
    const rnd = seeded(bundleId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));

    const sections: BundleSectionAnalysis[] = bundle.sections.map((section) => {
        const found = bundleAttempts.find((a) => a.skill === section.skill);
        const band = found ? found.band : Math.round(clamp(5.5 + rnd() * 2.5, 4, 9) * 2) / 2;
        return { skill: section.skill, label: section.label, band };
    });

    const radar = {
        listening: sections.find((s) => s.skill === 'listening')?.band ?? Math.round(clamp(5.5 + rnd() * 2.5, 4, 9) * 2) / 2,
        reading: sections.find((s) => s.skill === 'reading')?.band ?? Math.round(clamp(5.5 + rnd() * 2.5, 4, 9) * 2) / 2,
        writing: sections.find((s) => s.skill === 'writing')?.band ?? Math.round(clamp(5.5 + rnd() * 2.5, 4, 9) * 2) / 2,
        speaking: sections.find((s) => s.skill === 'speaking')?.band ?? Math.round(clamp(5.5 + rnd() * 2.5, 4, 9) * 2) / 2,
    } as Record<IeltsSkill, number>;

    const avg = sections.reduce((s, x) => s + x.band, 0) / sections.length;
    const focus = sections
        .filter((s) => s.band < 6.5)
        .map((s) => skillLabels[s.skill]);
    if (focus.length === 0) focus.push('Maintain consistency across all four skills');

    const verdict: BundleVerdict = {
        readiness: Math.round(clamp((avg / 9) * 100, 5, 99)),
        prediction: Math.round(avg * 2) / 2,
        focus,
    };

    return { label, sections, radar, verdict };
};

/* ───────────────────────── Dispatch / Resolve ───────────────────────── */

export const resolveAnalysis = (
    opts: { attemptId?: number; bundleId?: IeltsBundleId },
    allAttempts: IeltsAttempt[],
): ResolvedAnalysis => {
    if (opts.bundleId) {
        const data = buildBundle(allAttempts, opts.bundleId);
        return { kind: 'bundle', bundle: data, bundleId: opts.bundleId, title: data.label };
    }

    const attempt = opts.attemptId != null ? allAttempts.find((a) => a.id === opts.attemptId) : undefined;
    if (!attempt) {
        return { kind: 'objective', objective: buildObjective({ id: opts.attemptId ?? 1, skill: 'reading', band: 6.5, date: '' }) };
    }

    const bundleId = attempt.bundle ? bundleIdFromLabel(attempt.bundle) : undefined;
    if (bundleId) {
        const data = buildBundle(allAttempts, bundleId);
        return { kind: 'bundle', bundle: data, bundleId, attemptDate: attempt.date, title: data.label };
    }

    if (attempt.skill === 'writing') {
        return { kind: 'writing', writing: buildWriting(attempt), skill: 'writing', attemptDate: attempt.date, title: attempt.title };
    }
    if (attempt.skill === 'speaking') {
        return { kind: 'speaking', speaking: buildSpeaking(attempt), skill: 'speaking', attemptDate: attempt.date, title: attempt.title };
    }
    return {
        kind: 'objective',
        objective: buildObjective(attempt),
        skill: attempt.skill,
        attemptDate: attempt.date,
        title: attempt.title,
    };
};
