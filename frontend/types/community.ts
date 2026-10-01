export interface MentorInfo {
  id: string;
  name: string;
  avatarUrl: string;
  bandScore: number;
  verified: boolean;
  title?: string;
}

export interface CohortMetadata {
  id: string;
  name: string;
  description: string;
  mentor: MentorInfo;
  targetBand: number;
  currentAvgBand: number;
  liveMeetingUrl: string;
  nextLiveSession: string; // ISO string
  dailyMission: {
    title: string;
    description: string;
    submittedCount: number;
    totalAssigned: number;
  };
}

export interface CohortMember {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  streakCount: number;
  latestMockBand: number;
  targetScore?: number;
  dailyStatus: 'completed' | 'pending' | 'at_risk';
  dailySubmissionText?: string;
  role?: 'student' | 'mentor' | 'assistant';
  lastActiveAt?: string;
}

export interface CohortRecording {
  id: string;
  cohortId?: string;
  title: string;
  recordingUrl: string;
  durationMinutes: number;
  conductedAt: string;
  timestamps: Array<{ time: string; label: string }>;
}

export interface BenchmarkItem {
  id: string;
  studentName: string;
  studentAvatar?: string;
  module: 'writing' | 'speaking' | 'reading' | 'listening';
  title: string;
  bandScore: number;
  submissionContent: string;
  aiSubScores: {
    TR?: number;
    CC?: number;
    LR?: number;
    GRA?: number;
  };
  mentorVoiceNoteUrl?: string;
  highlightReason: string;
  createdAt: string;
}

export interface DiscussionReply {
  id: string;
  postId: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  isMentorAnswer: boolean;
  createdAt: string;
}

export interface DiscussionPost {
  id: string;
  cohortId?: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'mentor';
  tag: 'Writing-Task-1' | 'Writing-Task-2' | 'Reading-TFNG' | 'Speaking-Part-3' | 'Collocations' | 'General';
  title: string;
  content: string;
  upvotes: number;
  isMentorPinned: boolean;
  isMentorVerified: boolean;
  replyCount: number;
  replies?: DiscussionReply[];
  createdAt: string;
}

export interface ActivityTickerItem {
  id: string;
  cohortId?: string;
  userId?: string;
  userName: string;
  activityType: string;
  description: string;
  createdAt: string;
}

export type ConversationType = 'cohort_group' | 'direct_message';

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  lastReadAt?: string;
  joinedAt?: string;
  profile?: ProfileUser;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  cohortId?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  lastMessage?: ChatMessageItem;
  recipient?: ProfileUser;
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderUsername?: string;
  senderAvatar?: string;
  senderRole?: 'mentor' | 'faculty' | 'student';
  content?: string;
  audioUrl?: string;
  mediaUrl?: string;
  isPinned?: boolean;
  createdAt: string;
}

export interface ProfileUser {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  targetBand: number;
  currentBand: number;
  streakCount: number;
  batchName?: string;
  isMentor?: boolean;
  isFaculty?: boolean;
}
