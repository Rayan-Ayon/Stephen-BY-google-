import { supabase } from '@/supabaseClient';

export interface SpeakingQuestionItem {
    id: string;
    source_type: 'cambridge' | 'mock_series';
    book_or_set_number: number;
    test_number: number;
    module_type: 'academic' | 'general';
    part_number: 1 | 2 | 3;
    topic_title: string;
    cue_card_topic?: string | null;
    prompts: string[];
}

export interface SpeakingTestData {
    sourceType: 'cambridge' | 'mock_series';
    bookNumber: number;
    testNumber: number;
    category: 'academic' | 'general';
    title: string;
    part1: {
        title: string;
        questions: string[];
    };
    part2: {
        title: string;
        topic: string;
        prompts: string[];
    };
    part3: {
        title: string;
        questions: string[];
    };
}

export interface SpeakingEvaluation {
    overallBand: number;
    overall_band?: number;
    fcScore?: number;
    lrScore?: number;
    graScore?: number;
    prScore?: number;
    fc_score?: number;
    lr_score?: number;
    gra_score?: number;
    pr_score?: number;
    targetBand?: number;
    targetGap?: number;
    wpm?: number;
    pronunciationAccuracy?: number;
    phonemeCollisionsCount?: number;
    cadenceRating?: string;
    fluency?: {
        score: number;
        relevance?: any[];
        logical_sequencing?: any[];
        topic_development?: any[];
    };
    lexical?: {
        score: number;
        diversity_and_advanced_words?: string[];
        accuracy?: string[];
    };
    grammar?: {
        score: number;
        sentence_complexity?: string[];
        errors?: string[];
    };
    pronunciation?: {
        score: number;
        individual_sounds?: string[];
        word_stress?: string[];
        rhythm_intonation?: string[];
    };
    transcript?: string;
    what_you_did_well?: string[];
    areas_to_improve?: string[];
    strengths?: string[];
    improvements?: string[];
    feedback?: string;
    questions?: any[];
}

import { CAMBRIDGE_SPEAKING_BANK_EXTENDED } from './cambridgeSpeakingBankData';

// ── Authentic Cambridge & Mock Tests Speaking Question Bank ─────────────────

export const CAMBRIDGE_SPEAKING_BANK: Record<string, Omit<SpeakingTestData, 'sourceType' | 'bookNumber' | 'testNumber' | 'category'>> = {
    ...CAMBRIDGE_SPEAKING_BANK_EXTENDED,

    // Mock Series
    'mock_series-1-1': {
        title: 'IELTS Dynasty Mock Series 1 Test 1',
        part1: {
            title: 'Work, Study & Daily Routine',
            questions: [
                'Do you work or are you a student?',
                'What do you find most interesting about your job or course?',
                'What does a typical morning look like for you?',
                'Would you like to change anything about your daily schedule?',
            ],
        },
        part2: {
            title: 'A Skill You Learned',
            topic: 'an important skill you learned recently',
            prompts: [
                'what the skill was',
                'when and how you learned it',
                'who helped or taught you',
                'and explain how this skill has helped you in life',
            ],
        },
        part3: {
            title: 'Lifelong Learning & Adaptability',
            questions: [
                'Why has lifelong learning become essential in the modern workforce?',
                'What role do practical skills play compared to academic degrees?',
                'How will artificial intelligence transform the skills needed for future careers?',
                'Can older adults learn new digital tools as effectively as younger people?',
            ],
        },
    },
};

// Generic generator for books that don't have hardcoded bank entries
function generateFallbackTest(sourceType: 'cambridge' | 'mock_series', bookNumber: number, testNumber: number, category: 'academic' | 'general'): SpeakingTestData {
    const isCambridge = sourceType === 'cambridge';
    const displaySource = isCambridge ? `Cambridge IELTS ${bookNumber}` : `IELTS Dynasty Mock ${bookNumber}`;
    const testTitle = `${displaySource} Test ${testNumber}`;

    return {
        sourceType,
        bookNumber,
        testNumber,
        category,
        title: testTitle,
        part1: {
            title: `Part 1: Personal Interview (${isCambridge ? 'Cambridge ' + bookNumber : 'Mock ' + bookNumber})`,
            questions: [
                `Let's begin by discussing where you live. What kind of area is it?`,
                `What do you like most about your local community?`,
                `Do you often spend your weekends outdoors or indoors? Why?`,
                `How do you usually stay in touch with your friends and family?`,
                `Do you prefer taking trips to natural landscapes or visiting busy modern cities?`,
            ],
        },
        part2: {
            title: `Part 2: Long Turn — Cue Card (${testTitle})`,
            topic: `a significant project, trip, or personal accomplishment you are proud of`,
            prompts: [
                'what the project or accomplishment was',
                'when you worked on it or achieved it',
                'what challenges you had to overcome',
                'and explain why this achievement was important to you',
            ],
        },
        part3: {
            title: `Part 3: Discussion & Analysis (${testTitle})`,
            questions: [
                'In what ways do personal challenges contribute to a person’s growth?',
                'How does modern society define success compared to previous generations?',
                'Should educational systems place more emphasis on resilience and teamwork?',
                'How do global communications influence the career ambitions of young people today?',
            ],
        },
    };
}

/**
 * Fetch speaking questions for a specific test from Supabase,
 * with fallback to the authentic Cambridge question bank.
 */
export async function fetchSpeakingExamData(
    sourceType: 'cambridge' | 'mock_series',
    bookNumber: number,
    testNumber: number,
    category: 'academic' | 'general' = 'academic'
): Promise<SpeakingTestData> {
    const key = `${sourceType}-${bookNumber}-${testNumber}`;
    const fallback = CAMBRIDGE_SPEAKING_BANK[key]
        ? {
            sourceType,
            bookNumber,
            testNumber,
            category,
            ...CAMBRIDGE_SPEAKING_BANK[key],
        }
        : generateFallbackTest(sourceType, bookNumber, testNumber, category);

    try {
        const { data, error } = await supabase
            .from('speaking_questions')
            .select('*')
            .eq('source_type', sourceType)
            .eq('book_or_set_number', bookNumber)
            .eq('test_number', testNumber);

        const rows = (data || []) as any[];
        if (rows.length === 0) {
            return fallback;
        }

        const part1Row = rows.find((r: any) => r.part_number === 1);
        const part2Row = rows.find((r: any) => r.part_number === 2);
        const part3Row = rows.find((r: any) => r.part_number === 3);

        const parsePrompts = (raw: any): string[] => {
            if (Array.isArray(raw)) return raw;
            if (typeof raw === 'string') {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                } catch {
                    return [raw];
                }
            }
            return [];
        };

        return {
            sourceType,
            bookNumber,
            testNumber,
            category,
            title: `${sourceType === 'cambridge' ? 'Cambridge' : 'Mock'} ${bookNumber} Test ${testNumber}`,
            part1: {
                title: part1Row?.topic_title || fallback.part1.title,
                questions: part1Row ? parsePrompts(part1Row.prompts) : fallback.part1.questions,
            },
            part2: {
                title: part2Row?.topic_title || fallback.part2.title,
                topic: part2Row?.cue_card_topic || fallback.part2.topic,
                prompts: part2Row ? parsePrompts(part2Row.prompts) : fallback.part2.prompts,
            },
            part3: {
                title: part3Row?.topic_title || fallback.part3.title,
                questions: part3Row ? parsePrompts(part3Row.prompts) : fallback.part3.questions,
            },
        };
    } catch (err) {
        console.warn('Supabase speaking questions fetch failed, using authentic fallback:', err);
        return fallback;
    }
}
