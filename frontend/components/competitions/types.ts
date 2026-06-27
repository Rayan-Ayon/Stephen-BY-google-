
export type CompetitionSource = 'Kaggle' | 'Google' | 'Facebook' | 'Anthropic' | 'Custom Link' | 'All Formal';
export type ExecutionType = 'online' | 'offline';
export type TeamScale = 'solo' | 'small' | 'large';

export interface CompetitionEvent {
    id: string;
    title: string;
    description: string;
    rewardPool: string;
    tags: string[];
    source: CompetitionSource;
    executionType: ExecutionType;
    region?: { country: string; city: string };
    difficulty: number;
    teamConstraints: TeamScale;
    computedWinRate: number;
    daysLeft: number;
    isHighlighted: boolean;
}

export interface PreferenceVector {
    domains: string[];
    sources: CompetitionSource[];
    customSources: string[];
    minPrizeTier: string;
    executionType: ExecutionType;
    targetCountry: string;
    targetCity: string;
    teamScale: TeamScale;
    difficulty: number;
    showAdvanced: boolean;
}
