
export type MethodCategory = 'execution' | 'deconstruction' | 'compilation' | 'synthesis';

export interface LearningMethod {
    id: string;
    name: string;
    description: string;
    ytVideoId: string;
    applicationSpace: string;
    isDefaultSelected: boolean;
    category: MethodCategory;
}

export interface LearningEngineState {
    selectedMethodIds: string[];
    customFrameworkText: string;
    activeCourseTuningIds: string[];
}
