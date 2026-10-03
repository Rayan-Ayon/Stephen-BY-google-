import { CohortMetadata, CohortMember, BenchmarkItem, DiscussionPost, ActivityTickerItem, CohortRecording } from '@/types/community';
import { CANONICAL_20_STUDENTS } from '@/lib/telemetryEgress';

export const INITIAL_COHORT_DATA: CohortMetadata = {
  id: 'c8888888-8888-4888-8888-888888888888',
  name: 'Batch #08 — Target 7.5+ Alpha',
  description: 'Intensive 6-week cohort targeting Band 7.5+ in Academic & General Training IELTS with Dr. Stephen Vance.',
  mentor: {
    id: 'm1111111-1111-4111-1111-111111111111',
    name: 'Dr. Stephen Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    bandScore: 9.0,
    verified: true,
    title: 'Senior IELTS Examiner & Academic Director'
  },
  targetBand: 7.5,
  currentAvgBand: 6.8,
  liveMeetingUrl: 'https://meet.google.com/abc-defg-hij',
  nextLiveSession: new Date(Date.now() + 4 * 3600 * 1000 + 15 * 60 * 1000).toISOString(), // 4h 15m from now
  dailyMission: {
    title: "Tonight's Focus: Cam 18 Task 2 Paraphrasing Traps",
    description: 'Submit your 250-word introduction and body paragraph 1 addressing double-question prompts without lexical repetition.',
    submittedCount: 16,
    totalAssigned: 20
  }
};

export const INITIAL_RECORDINGS: CohortRecording[] = [
  {
    id: 'rec-1',
    cohortId: 'c8888888-8888-4888-8888-888888888888',
    title: 'Task 1 Process Diagram Breakdown & Overview Mastery',
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMinutes: 52,
    conductedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    timestamps: [
      { time: '04:15', label: 'Common Pitfalls in Flowcharts' },
      { time: '18:30', label: 'Passive Voice Structure in Cycles' },
      { time: '35:40', label: 'Student Sample Live Grading' }
    ]
  },
  {
    id: 'rec-2',
    cohortId: 'c8888888-8888-4888-8888-888888888888',
    title: 'Reading TFNG vs Yes/No/Not Given: The Logical Difference',
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMinutes: 64,
    conductedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    timestamps: [
      { time: '02:00', label: 'Fact vs Opinion distinction' },
      { time: '21:15', label: 'Contradiction vs Silence in Text' },
      { time: '44:00', label: 'Speed Scanning Strategy' }
    ]
  },
  {
    id: 'rec-3',
    cohortId: 'c8888888-8888-4888-8888-888888888888',
    title: 'Speaking Part 3: Idiomatic Fluency Without Hesitation',
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMinutes: 48,
    conductedAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    timestamps: [
      { time: '05:10', label: 'Signposting & Discourse Markers' },
      { time: '22:45', label: 'Abstract Thinking Framework' }
    ]
  }
];

// 20 Enrolled Students (Farmgate Executive Batch)
export const INITIAL_MEMBERS: CohortMember[] = CANONICAL_20_STUDENTS.map((item, idx) => ({
  id: item.id,
  userId: item.handle,
  userName: item.name,
  avatarUrl: item.avatarUrl,
  streakCount: item.streak,
  latestMockBand: item.currentBand,
  targetScore: item.targetBand,
  dailyStatus: item.dailyStatus,
  dailySubmissionText: item.dailyStatus === 'completed' ? 'Submitted Cam 18 Task 2' : 'Drafting introduction'
}));

export const INITIAL_BENCHMARK: BenchmarkItem = {
  id: 'bm-801',
  studentName: 'Ayesha Rahman',
  studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  module: 'writing',
  title: 'Norbiton Maps Paraphrase & Industrial Regeneration Overview',
  bandScore: 8.0,
  submissionContent: `The two maps illustrate the principal architectural transformations that transpired in the town of Norbiton from 2019 to the current era, following a comprehensive industrial regeneration project.

Overall, it is manifestly evident that the erstwhile industrial hub has undergone a radical metamorphism, transitioning into a predominantly residential and academic precinct with substantially augmented transport links and community infrastructure.

Examining the layout, the central circular roundabout remains intact; however, a novel arterial dual carriageway now traverses eastward towards the newly constructed university campus and research faculties. Most notably, the clusters of industrial factories that previously populated the riverside have been comprehensively replaced by high-density residential apartments, interspersed with landscaped recreational greenery and pedestrian walkways.`,
  aiSubScores: {
    TR: 8.5,
    CC: 8.0,
    LR: 8.0,
    GRA: 7.5
  },
  mentorVoiceNoteUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  highlightReason: 'Exemplary spatial signposting, varied passive verb forms, and nuanced overview synthesis without redundant detailing.',
  createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
};

export const INITIAL_POSTS: DiscussionPost[] = [
  {
    id: 'post-1',
    authorName: 'Dr. Stephen Vance',
    authorRole: 'mentor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    tag: 'Writing-Task-2',
    title: 'Avoid this fatal trap in "To What Extent" double-premise prompts!',
    content: 'When a prompt asks "To what extent do you agree or disagree with both statements?", candidates frequently answer only the second half. Ensure every body paragraph directly links back to the primary thesis established in paragraph 1. See my pinned model breakdown below.',
    upvotes: 42,
    isMentorPinned: true,
    isMentorVerified: true,
    replyCount: 9,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-1',
        postId: 'post-1',
        authorName: 'Nafis Rayan',
        content: 'Thank you Dr. Vance! In Cam 18 Test 2, should we dedicate an entire concession paragraph or integrate counterpoints within each body paragraph?',
        isMentorAnswer: false,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      },
      {
        id: 'rep-2',
        postId: 'post-1',
        authorName: 'Dr. Stephen Vance',
        content: 'Integrating a concession clause (e.g., "While critics contend that...") directly before your rebuttal preserves cohesion much better than a detached separate paragraph.',
        isMentorAnswer: true,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Tasnim Haque',
    authorRole: 'student',
    tag: 'Reading-TFNG',
    title: 'Cambridge 17 Test 1 Passage 2: Question 7 "NOT GIVEN" rationale debate',
    content: 'The passage states that "archaeologists discovered timber structures dating back to 400 BC", but question 7 asks whether "timber was the primary building material of the region". Since it only mentions what was found, is this strictly NOT GIVEN or FALSE?',
    upvotes: 18,
    isMentorPinned: false,
    isMentorVerified: true,
    replyCount: 5,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-3',
        postId: 'post-2',
        authorName: 'Dr. Stephen Vance',
        content: 'Spot on! This is strictly NOT GIVEN. The text proves timber was present, but is silent regarding whether it was "primary" compared to stone or thatch.',
        isMentorAnswer: true,
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Ayesha Rahman',
    authorRole: 'student',
    tag: 'Collocations',
    title: 'High-yield collocations for environmental degradation essays (Band 8+)',
    content: 'Compiled this quick cheat sheet from Cambridge 16 & 17 readings:\n• "irreversible ecological disequilibrium"\n• "precipitate environmental depletion"\n• "mitigation strategies that offset anthropogenic emissions"',
    upvotes: 31,
    isMentorPinned: false,
    isMentorVerified: false,
    replyCount: 3,
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_ACTIVITIES: ActivityTickerItem[] = [
  {
    id: 'act-1',
    userName: 'Nafis Rayan',
    activityType: 'test_completed',
    description: 'completed Cambridge 18 Reading Test 2 (Band 7.5)',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'act-2',
    userName: 'Tasnim Haque',
    activityType: 'speaking_started',
    description: 'completed 22m AI Speaking Simulation (Band 7.0)',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'act-3',
    userName: 'Ayesha Rahman',
    activityType: 'xp_earned',
    description: 'earned +150 XP for daily study streak (Day 22 🔥)',
    createdAt: new Date(Date.now() - 19 * 60 * 1000).toISOString()
  },
  {
    id: 'act-4',
    userName: 'Samira Akter',
    activityType: 'test_completed',
    description: 'submitted Task 2 Essay "Urbanization Trends"',
    createdAt: new Date(Date.now() - 34 * 60 * 1000).toISOString()
  },
  {
    id: 'act-5',
    userName: 'Priya Sen',
    activityType: 'test_completed',
    description: 'scored Band 8.0 on Cambridge 16 Listening Section 4',
    createdAt: new Date(Date.now() - 58 * 60 * 1000).toISOString()
  }
];

export const INITIAL_PROFILES = [
  {
    id: 'm1111111-1111-4111-1111-111111111111',
    username: 'stephen_vance',
    fullName: 'Dr. Stephen Vance',
    email: 'stephen.vance@uaiu.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    targetBand: 9.0,
    currentBand: 9.0,
    streakCount: 84,
    batchName: 'Batch #08 — Alpha',
    isMentor: true,
  },
  {
    id: 'u-tanvir',
    username: 'tanvir_ielts',
    fullName: 'Tanvir Hossain',
    email: 'tanvir@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    targetBand: 7.5,
    currentBand: 6.5,
    streakCount: 14,
    batchName: 'Batch #08 — Alpha',
  },
  {
    id: 'u-rayan',
    username: 'rayan_a',
    fullName: 'Nafis Rayan',
    email: 'rayan@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    targetBand: 8.0,
    currentBand: 7.5,
    streakCount: 19,
    batchName: 'Batch #08 — Alpha',
  },
  {
    id: 'u-anika',
    username: 'anika_r',
    fullName: 'Anika Rahman',
    email: 'anika@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
    targetBand: 7.0,
    currentBand: 6.0,
    streakCount: 12,
    batchName: 'Batch #08 — Alpha',
  },
  {
    id: 'u-ayesha',
    username: 'ayesha_r',
    fullName: 'Ayesha Rahman',
    email: 'ayesha@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
    targetBand: 8.5,
    currentBand: 8.0,
    streakCount: 24,
    batchName: 'Batch #08 — Alpha',
  },
  {
    id: 'u-tasnim',
    username: 'tasnim_h',
    fullName: 'Tasnim Haque',
    email: 'tasnim@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    targetBand: 7.5,
    currentBand: 7.0,
    streakCount: 22,
    batchName: 'Batch #08 — Alpha',
  },
  {
    id: 'u-rafiq',
    username: 'rafiq_bd',
    fullName: 'Rafiqul Islam',
    email: 'rafiqul@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    targetBand: 6.5,
    currentBand: 5.5,
    streakCount: 8,
    batchName: 'Batch #08 — Alpha',
  },
  {
    id: 'u-samira',
    username: 'samira_a',
    fullName: 'Samira Akter',
    email: 'samira@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face',
    targetBand: 7.5,
    currentBand: 7.0,
    streakCount: 15,
    batchName: 'Batch #08 — Alpha',
  },
];

export const INITIAL_COHORT_MESSAGES = [
  {
    id: 'msg-c1',
    conversationId: 'conv-cohort-group',
    senderId: 'm1111111-1111-4111-1111-111111111111',
    senderName: 'Dr. Stephen Vance',
    senderUsername: 'stephen_vance',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    senderRole: 'mentor' as const,
    content: 'Good evening Batch #08! Tonight we dissect Cambridge 18 Test 2 Task 2 essays. Watch out for over-generalizing in paragraph 2. Voice brief attached below.',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    isPinned: true,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'msg-c2',
    conversationId: 'conv-cohort-group',
    senderId: 'u-tanvir',
    senderName: 'Tanvir Hossain',
    senderUsername: 'tanvir_ielts',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    senderRole: 'student' as const,
    content: 'Thank you Dr. Stephen! Should we provide a separate paragraph for the counter-argument or embed it within Body 1 as a concession clause?',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'msg-c3',
    conversationId: 'conv-cohort-group',
    senderId: 'u-ayesha',
    senderName: 'Ayesha Rahman',
    senderUsername: 'ayesha_r',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
    senderRole: 'student' as const,
    content: 'I uploaded my benchmark essay in the Batch Classroom tab. Used the 3-part concession thesis formula and scored Band 8.0 on TR/LR!',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'msg-c4',
    conversationId: 'conv-cohort-group',
    senderId: 'm1111111-1111-4111-1111-111111111111',
    senderName: 'Dr. Stephen Vance',
    senderUsername: 'stephen_vance',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    senderRole: 'mentor' as const,
    content: '@tanvir_ielts Embedding it within Body 1 as a concession clause preserves cohesion much better than a separate stub paragraph.',
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'msg-c5',
    conversationId: 'conv-cohort-group',
    senderId: 'u-rayan',
    senderName: 'Nafis Rayan',
    senderUsername: 'rayan_a',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    senderRole: 'student' as const,
    content: 'Just finished the Listening Section 4 dictation exercise. Spelling in the final 3 questions was tricky!',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'dm-stephen',
    type: 'direct_message' as const,
    title: 'Dr. Stephen Vance (Mentor)',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    unreadCount: 1,
    recipient: INITIAL_PROFILES[0],
    lastMessage: {
      id: 'dm-m-1',
      conversationId: 'dm-stephen',
      senderId: 'm1111111-1111-4111-1111-111111111111',
      senderName: 'Dr. Stephen Vance',
      content: 'Great job on Task 2 thesis statement! Keep this academic precision.',
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    }
  },
  {
    id: 'dm-ayesha',
    type: 'direct_message' as const,
    title: 'Ayesha Rahman',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    unreadCount: 0,
    recipient: INITIAL_PROFILES[4],
    lastMessage: {
      id: 'dm-m-3',
      conversationId: 'dm-ayesha',
      senderId: 'u-ayesha',
      senderName: 'Ayesha Rahman',
      content: 'I uploaded my benchmark essay for Task 2. Let me know what you think!',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    }
  },
  {
    id: 'dm-samira',
    type: 'direct_message' as const,
    title: 'Samira Akter',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    unreadCount: 0,
    recipient: INITIAL_PROFILES[7] || {
      id: 'u-samira',
      username: 'samira_a',
      fullName: 'Samira Akter',
      targetBand: 7.5,
      currentBand: 7.0,
      streakCount: 15,
      batchName: 'Batch #08 — Alpha',
    },
    lastMessage: {
      id: 'dm-m-4',
      conversationId: 'dm-samira',
      senderId: 'u-samira',
      senderName: 'Samira Akter',
      content: 'Hey, do you have notes for Part 3?',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    }
  },
  {
    id: 'dm-tanvir',
    type: 'direct_message' as const,
    title: 'Tanvir Hossain',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unreadCount: 2,
    recipient: INITIAL_PROFILES[1],
    lastMessage: {
      id: 'dm-m-2',
      conversationId: 'dm-tanvir',
      senderId: 'u-tanvir',
      senderName: 'Tanvir Hossain',
      content: 'Hey, do you want to do a peer mock test on Speaking Part 2 tonight at 9 PM?',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    }
  }
];
