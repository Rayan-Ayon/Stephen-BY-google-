// Supabase Database types for IELTS Writing tables
// Matches: writing_questions, writing_submissions, ai_evaluations

export interface Database {
    public: {
        Tables: {
            writing_questions: {
                Row: {
                    id: string;
                    source_type: 'cambridge' | 'mock_series';
                    book_or_set_number: number;
                    test_number: number;
                    module_type: 'academic' | 'general';
                    task_type: 'task_1' | 'task_2';
                    instruction: string;
                    prompt_text: string;
                    image_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    source_type: 'cambridge' | 'mock_series';
                    book_or_set_number: number;
                    test_number: number;
                    module_type: 'academic' | 'general';
                    task_type: 'task_1' | 'task_2';
                    instruction: string;
                    prompt_text: string;
                    image_url?: string | null;
                    created_at?: string;
                };
                Update: Partial<{
                    id: string;
                    source_type: 'cambridge' | 'mock_series';
                    book_or_set_number: number;
                    test_number: number;
                    module_type: 'academic' | 'general';
                    task_type: 'task_1' | 'task_2';
                    instruction: string;
                    prompt_text: string;
                    image_url: string | null;
                    created_at: string;
                }>;
                Relationships: [];
            };
            writing_submissions: {
                Row: {
                    id: string;
                    user_id: string | null;
                    user_email: string | null;
                    source_type: string;
                    book_or_set_number: number;
                    test_number: number;
                    module_type: string;
                    task1_prompt: string | null;
                    task1_response: string | null;
                    task1_word_count: number | null;
                    task2_prompt: string | null;
                    task2_response: string | null;
                    task2_word_count: number | null;
                    overall_band: number | null;
                    evaluation: Record<string, unknown> | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    user_email?: string | null;
                    source_type: string;
                    book_or_set_number: number;
                    test_number: number;
                    module_type: string;
                    task1_prompt?: string | null;
                    task1_response?: string | null;
                    task1_word_count?: number | null;
                    task2_prompt?: string | null;
                    task2_response?: string | null;
                    task2_word_count?: number | null;
                    overall_band?: number | null;
                    evaluation?: Record<string, unknown> | null;
                    created_at?: string;
                };
                Update: Partial<{
                    id: string;
                    user_id: string | null;
                    user_email: string | null;
                    source_type: string;
                    book_or_set_number: number;
                    test_number: number;
                    module_type: string;
                    task1_prompt: string | null;
                    task1_response: string | null;
                    task1_word_count: number | null;
                    task2_prompt: string | null;
                    task2_response: string | null;
                    task2_word_count: number | null;
                    overall_band: number | null;
                    evaluation: Record<string, unknown> | null;
                    created_at: string;
                }>;
                Relationships: [];
            };
            ai_evaluations: {
                Row: {
                    id: string;
                    submission_id: string;
                    overall_band: number;
                    task_achievement_score: number;
                    coherence_cohesion_score: number;
                    lexical_resource_score: number;
                    grammatical_accuracy_score: number;
                    raw_json_feedback: Record<string, unknown>;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    submission_id: string;
                    overall_band: number;
                    task_achievement_score: number;
                    coherence_cohesion_score: number;
                    lexical_resource_score: number;
                    grammatical_accuracy_score: number;
                    raw_json_feedback: Record<string, unknown>;
                    created_at?: string;
                };
                Update: Partial<{
                    id: string;
                    submission_id: string;
                    overall_band: number;
                    task_achievement_score: number;
                    coherence_cohesion_score: number;
                    lexical_resource_score: number;
                    grammatical_accuracy_score: number;
                    raw_json_feedback: Record<string, unknown>;
                    created_at: string;
                }>;
                Relationships: [
                    {
                        foreignKeyName: 'ai_evaluations_submission_id_fkey';
                        columns: ['submission_id'];
                        isOneToOne: false;
                        referencedRelation: 'writing_submissions';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
    };
}
