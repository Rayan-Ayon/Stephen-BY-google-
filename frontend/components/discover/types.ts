
export type SourceType = 'youtube' | 'twitter' | 'reddit' | 'news' | 'journal';

export interface DiscoverCard {
    id: string;
    title: string;
    summary: string;
    sourceUrl: string;
    sourceType: SourceType;
    sourceName: string;
    timestamp: string;
    thumbnailUrl: string;
    metrics: {
        likes?: number;
        shares?: number;
        citations?: number;
    };
}

export interface SourceConfig {
    youtube: string[];
    twitter: string[];
    reddit: string[];
    news: string[];
    journal: string[];
}

export type DiscoverPhase = 'welcome' | 'onboarding' | 'processing' | 'feed';
