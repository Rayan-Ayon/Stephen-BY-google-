
export interface Story {
    username: string;
    isUser: boolean;
    img: string;
    isLiveSession?: boolean;
    mentorTier?: 'stephian' | 'peer' | 'expert';
    isTakingCalls?: boolean;
}

export interface Post {
    id: number;
    username: string;
    userImage: string;
    hoursAgo: number;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    courseId?: string;
    courseName?: string;
    consultantId?: string;
    consultantName?: string;
    mentorTier?: 'stephian' | 'peer' | 'expert';
    tags?: string[];
}

export interface Course {
    id: number;
    title: string;
    instructor: string;
    price: number;
    enrolled: number;
    rating: number;
    image: string;
}

export interface Bounty {
    id: number;
    title: string;
    description: string;
    reward: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Open' | 'In Progress' | 'Resolved';
}

export interface FeedConfig {
    discovery: number;
    video: number;
    education: number;
}
