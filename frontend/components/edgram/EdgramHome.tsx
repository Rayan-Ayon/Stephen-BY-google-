
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { VideoCameraIcon, LightningIcon, HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, DotsHorizontalIcon } from '../icons';
import { Post, Story, FeedConfig } from './types';
import FeedPost from './FeedPost';

const mentorBorderColors: Record<string, string> = {
    stephian: 'border-amber-500',
    peer: 'border-blue-500',
    expert: 'border-emerald-500',
};

const storiesData: Story[] = [
    { username: 'Your Story', isUser: true, img: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=100&auto=format&fit=crop' },
    { username: 'alice_codes', isUser: false, img: 'https://picsum.photos/seed/501/100/100', isLiveSession: true, mentorTier: 'stephian', isTakingCalls: true },
    { username: 'dr_smith', isUser: false, img: 'https://picsum.photos/seed/502/100/100', isLiveSession: false, mentorTier: 'expert', isTakingCalls: true },
    { username: 'jenny_peer', isUser: false, img: 'https://picsum.photos/seed/503/100/100', isLiveSession: false, mentorTier: 'peer', isTakingCalls: false },
    { username: 'tutor_ray', isUser: false, img: 'https://picsum.photos/seed/504/100/100', isLiveSession: true, mentorTier: 'stephian', isTakingCalls: true },
    { username: 'prof_wu', isUser: false, img: 'https://picsum.photos/seed/505/100/100', isLiveSession: false, mentorTier: 'expert', isTakingCalls: true },
    { username: 'peer_maria', isUser: false, img: 'https://picsum.photos/seed/506/100/100', isLiveSession: true, mentorTier: 'peer', isTakingCalls: false },
    { username: 'dev_ankit', isUser: false, img: 'https://picsum.photos/seed/507/100/100', isLiveSession: false, mentorTier: 'stephian', isTakingCalls: true },
    { username: 'lin_peer', isUser: false, img: 'https://picsum.photos/seed/508/100/100', isLiveSession: true, mentorTier: 'peer', isTakingCalls: true },
    { username: 'raman_expert', isUser: false, img: 'https://picsum.photos/seed/509/100/100', isLiveSession: false, mentorTier: 'expert', isTakingCalls: false },
];

const basePosts: Post[] = [
    { id: 1, username: 'alice_codes', userImage: 'https://picsum.photos/seed/51/100/100', hoursAgo: 1, image: 'https://picsum.photos/seed/51/600/600', caption: 'Just finished a deep dive into transformer attention mechanisms! #AI #learning', likes: 1420, comments: 34, courseId: 'course_1', courseName: 'Learn Rust in 7 Days', mentorTier: 'stephian', tags: ['Rust', 'Systems'] },
    { id: 2, username: 'dr_smith', userImage: 'https://picsum.photos/seed/52/100/100', hoursAgo: 2, image: 'https://picsum.photos/seed/52/600/600', caption: 'New paper on mechanistic interpretability just dropped. Let me know if you need a walkthrough.', likes: 2340, comments: 56, consultantId: 'cons_2', consultantName: 'Architecture Review', mentorTier: 'expert', tags: ['Research', 'Interpretability'] },
    { id: 3, username: 'jenny_peer', userImage: 'https://picsum.photos/seed/53/100/100', hoursAgo: 3, image: 'https://picsum.photos/seed/53/600/600', caption: 'Exploring the depths of quantum computing today. Mind-bending! 🤯 #learning #AI', likes: 890, comments: 12, tags: ['Quantum', 'Computing'] },
    { id: 4, username: 'tutor_ray', userImage: 'https://picsum.photos/seed/54/100/100', hoursAgo: 5, image: 'https://picsum.photos/seed/54/600/600', caption: 'Debugging session went great — helped a peer fix their recursive algorithm!', likes: 560, comments: 8, courseId: 'course_2', courseName: 'Level 4 Python Peer Help', mentorTier: 'stephian', tags: ['Python', 'Debugging'] },
    { id: 5, username: 'prof_wu', userImage: 'https://picsum.photos/seed/55/100/100', hoursAgo: 6, image: 'https://picsum.photos/seed/55/600/600', caption: 'My quantum lab setup for this semester\'s research project. #STEM', likes: 3120, comments: 87, consultantId: 'cons_5', consultantName: 'Research Supervision', mentorTier: 'expert', tags: ['Quantum', 'Research'] },
    { id: 6, username: 'peer_maria', userImage: 'https://picsum.photos/seed/56/100/100', hoursAgo: 8, image: 'https://picsum.photos/seed/56/600/600', caption: 'Study group notes on linear algebra — sharing is caring! 📚', likes: 430, comments: 15, tags: ['Math', 'Study'] },
    { id: 7, username: 'dev_ankit', userImage: 'https://picsum.photos/seed/57/100/100', hoursAgo: 10, image: 'https://picsum.photos/seed/57/600/600', caption: 'Built a full-stack app with Next.js and Prisma. Happy to review PRs!', likes: 1870, comments: 42, courseId: 'course_3', courseName: 'Next.js Architecture Review', mentorTier: 'stephian', tags: ['Next.js', 'Full Stack'] },
    { id: 8, username: 'lin_peer', userImage: 'https://picsum.photos/seed/58/100/100', hoursAgo: 12, image: 'https://picsum.photos/seed/58/600/600', caption: 'NLP project update — building a sentiment analyzer from scratch!', likes: 720, comments: 23, tags: ['NLP', 'Python'] },
];

const EdgramHome: React.FC<{ feedConfig: FeedConfig }> = ({ feedConfig }) => {
    const rankedPosts = useMemo(() => {
        const educationWeight = feedConfig.education / 100;
        return [...basePosts].sort((a, b) => {
            const aBoost = (a.courseId || a.consultantId ? educationWeight : 0) + (a.tags ? a.tags.length * 0.05 : 0);
            const bBoost = (b.courseId || b.consultantId ? educationWeight : 0) + (b.tags ? b.tags.length * 0.05 : 0);
            return (bBoost - aBoost) || (b.likes - a.likes);
        });
    }, [feedConfig.education]);

    return (
        <div className="w-full max-w-lg mx-auto py-6 pt-16 space-y-4 dark:text-white text-black">
            {/* Stories Section */}
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-1 border-b dark:border-gray-800 border-neutral-200">
                {storiesData.map((story, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group relative">
                        <div className={`p-[3px] rounded-full ${
                            story.isUser
                                ? 'bg-transparent border border-gray-300 dark:border-gray-600'
                                : story.mentorTier
                                ? `bg-transparent border-2 ${mentorBorderColors[story.mentorTier]}`
                                : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'
                        }`}>
                            <div className="p-[2px] rounded-full bg-white dark:bg-black">
                                <img src={story.img} alt={story.username} className="w-16 h-16 rounded-full object-cover transition-transform group-hover:scale-105" />
                            </div>
                        </div>
                        {/* LIVE / HELP badge */}
                        {(story.isLiveSession || story.isTakingCalls) && (
                            <span className={`absolute -bottom-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                                story.isLiveSession
                                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                                    : 'bg-amber-500 text-black border-amber-400'
                            }`}>
                                {story.isLiveSession ? 'LIVE' : 'HELP'}
                            </span>
                        )}
                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate w-16 text-center pt-0.5">{story.username}</span>
                    </div>
                ))}
            </div>

            {/* Posts Feed */}
            {rankedPosts.map((post, index) => (
                <FeedPost key={post.id} post={post} index={index} />
            ))}
        </div>
    );
};

export default EdgramHome;
