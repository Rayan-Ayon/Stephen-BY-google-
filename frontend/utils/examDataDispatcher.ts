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
            // Find exam by title/test_id
            const { data: examData, error: examErr } = await supabase
                .from('exams')
                .select('*')
                .or(`id.eq.${testId},title.ilike.%${testId}%`)
                .maybeSingle();

            if (examErr || !examData) return null;

            const { data: passages } = await supabase
                .from('passages')
                .select('*')
                .eq('exam_id', (examData as any).id)
                .order('part_number', { ascending: true });

            return passages && passages.length > 0 ? passages : null;
        }

        if (moduleType === 'listening') {
            const { data: sections } = await supabase
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
