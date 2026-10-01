import { supabase } from '../supabaseClient';

export interface ExamDataResult {
    source: 'supabase' | 'static_fallback';
    moduleType: string;
    testId: string;
    isGeneralTraining: boolean;
    data: any;
}

/**
 * Fetch module data from Supabase for a given test
 */
export async function fetchFromSupabase(testId: string, moduleType: string): Promise<any[] | null> {
    try {
        if (moduleType === 'reading') {
            // Parse book and test number if formatted as slug e.g. cambridge-7-test-1
            const bookMatch = testId.match(/cambridge[-_ ]?(\d+)/i) || testId.match(/(\d+)/);
            const testMatch = testId.match(/test[-_ ]?(\d+)/i);
            const bookNum = bookMatch ? parseInt(bookMatch[1], 10) : null;
            const testNum = testMatch ? parseInt(testMatch[1], 10) : 1;
            const hexPrefix = bookNum ? ('c' + bookNum).padEnd(8, '0') : null;
            const hexSuffix = String(testNum).padStart(12, '0');
            const deterministicId = hexPrefix ? `${hexPrefix}-0000-0000-0000-${hexSuffix}` : null;

            let examData: any = null;
            if (deterministicId) {
                const res = await (supabase as any).from('exams').select('*').eq('id', deterministicId).maybeSingle();
                examData = res?.data;
            }

            if (!examData) {
                const query = (supabase as any).from('exams').select('*');
                if (bookNum) {
                    query.ilike('title', `%Cambridge ${bookNum}%`).not('title', 'ilike', '%Listening%').eq('test_number', testNum);
                } else {
                    query.or(`id.eq.${testId},title.ilike.%${testId}%`).not('title', 'ilike', '%Listening%');
                }
                const res = await query.limit(1).maybeSingle();
                examData = res?.data;
            }

            if (!examData) return null;

            const { data: passages } = await (supabase as any)
                .from('passages')
                .select('*')
                .eq('exam_id', (examData as any).id)
                .order('part_number', { ascending: true });

            return passages && passages.length > 0 ? passages : null;
        }

        if (moduleType === 'listening') {
            const { data: sections } = await (supabase as any)
                .from('sections')
                .select('*, question_groups(*, questions(*))')
                .eq('test_id', testId)
                .order('part_number', { ascending: true });

            return sections && sections.length > 0 ? sections : null;
        }

        if (moduleType === 'writing') {
            const { data: questions } = await supabase
                .from('writing_questions')
                .select('*')
                .eq('test_number', parseInt(testId.replace(/\D/g, '') || '1', 10));

            return questions && questions.length > 0 ? questions : null;
        }

        if (moduleType === 'speaking') {
            const { data: questions } = await supabase
                .from('speaking_questions')
                .select('*')
                .eq('test_number', parseInt(testId.replace(/\D/g, '') || '1', 10));

            return questions && questions.length > 0 ? questions : null;
        }

        return null;
    } catch (err) {
        console.warn(`[examDataDispatcher] Error querying Supabase for ${moduleType} / ${testId}:`, err);
        return null;
    }
}

/**
 * Return static mock fallback dataset for modules/tests not populated in Supabase
 */
export function getStaticMockDataFallback(testId: string, moduleType: string, isGeneralTraining: boolean): any {
    switch (moduleType) {
        case 'reading':
            return {
                isStatic: true,
                isGeneralTraining,
                description: 'Static Cambridge reading test dataset',
            };
        case 'listening':
            return {
                isStatic: true,
                useMockFallback: true,
                isGeneralTraining,
            };
        case 'writing':
            return {
                isStatic: true,
                task1Prompt: isGeneralTraining
                    ? 'Write a letter to a friend or organisation...'
                    : 'The chart below shows the number of adults participating in different major sports...',
                task2Prompt: 'Some people believe that university education should be free for everyone...',
            };
        case 'speaking':
            return {
                isStatic: true,
                source: 'cambridge_static_bank',
            };
        default:
            return { isStatic: true, fallback: true };
    }
}

/**
 * Standardized Data Router & Fallback Bridge
 * Ensures academic tests fetch real Supabase data, while unattached or GT tests
 * seamlessly fall back to local static datasets.
 */
export async function getExamData(
    testId: string,
    moduleType: string,
    isGeneralTraining: boolean = false
): Promise<ExamDataResult> {
    // Check if target is Academic and exists in Supabase
    if (!isGeneralTraining && ['reading', 'writing', 'listening'].includes(moduleType)) {
        const supabaseData = await fetchFromSupabase(testId, moduleType);
        if (supabaseData && supabaseData.length > 0) {
            return {
                source: 'supabase',
                moduleType,
                testId,
                isGeneralTraining,
                data: supabaseData,
            };
        }
    }

    // Fallback: Use existing static mock dataset imported from local mock series config
    const fallbackData = getStaticMockDataFallback(testId, moduleType, isGeneralTraining);
    return {
        source: 'static_fallback',
        moduleType,
        testId,
        isGeneralTraining,
        data: fallbackData,
    };
}
