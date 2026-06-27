
export type ProjectType = 'course' | 'outer';
export type ProjectCategory = 'Chats' | 'Recalls' | 'Debates' | 'Presentation' | 'Q&A' | 'Instant describe';
export type ProjectStatus = 'incomplete' | 'complete';

export interface ProjectMeta {
    courseName?: string;
    moduleNo?: string;
    projectNo?: string;
    completionRate: number;
    architecturalScore: number;
}

export interface ProjectCard {
    id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    type: ProjectType;
    category: ProjectCategory;
    timestamp: string;
    meta: ProjectMeta;
}
