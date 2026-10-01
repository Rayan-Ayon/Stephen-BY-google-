import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  CohortMetadata,
  CohortMember,
  CohortRecording,
  BenchmarkItem,
  DiscussionPost,
  DiscussionReply,
  ProfileUser
} from '@/types/community';
import {
  INITIAL_COHORT_DATA,
  INITIAL_MEMBERS,
  INITIAL_RECORDINGS,
  INITIAL_BENCHMARK,
  INITIAL_POSTS,
  INITIAL_PROFILES
} from './mockCommunityData';
import { obsidianTokens } from './obsidianTokens';
import { GlobalUserDiscoveryBar } from './GlobalUserDiscoveryBar';
import { CohortBatchChat } from './CohortBatchChat';
import { DirectMessagingPanel } from './DirectMessagingPanel';
import { BatchClassroomView } from './BatchClassroomView';
import { AcademicQAForum } from './AcademicQAForum';
import { PostDrawerModal } from './PostDrawerModal';
import { BenchmarkReviewModal } from './BenchmarkReviewModal';
import { MemberProfileModal } from './MemberProfileModal';
import {
  MessageSquare,
  Mail,
  GraduationCap,
  Lightbulb,
  Radio,
  Sparkles
} from 'lucide-react';

export type CommunityTab = 'chat' | 'dms' | 'classroom' | 'qa';

interface CohortCommunityPageProps {
  userEmail?: string;
  cohortId?: string;
}

export const CohortCommunityPage: React.FC<CohortCommunityPageProps> = ({
  userEmail,
  cohortId = 'c8888888-8888-4888-8888-888888888888'
}) => {
  // Navigation tab state ('chat' | 'dms' | 'classroom' | 'qa')
  const [activeTab, setActiveTab] = useState<CommunityTab>('chat');

  // Master State
  const [cohort, setCohort] = useState<CohortMetadata>(INITIAL_COHORT_DATA);
  const [members, setMembers] = useState<CohortMember[]>(INITIAL_MEMBERS);
  const [recordings, setRecordings] = useState<CohortRecording[]>(INITIAL_RECORDINGS);
  const [benchmark, setBenchmark] = useState<BenchmarkItem>(INITIAL_BENCHMARK);
  const [posts, setPosts] = useState<DiscussionPost[]>(INITIAL_POSTS);

  // DM state
  const [dmTargetUser, setDmTargetUser] = useState<ProfileUser | null>(null);
  const [unreadDmCount, setUnreadDmCount] = useState<number>(3);

  // Modals state
  const [selectedPost, setSelectedPost] = useState<DiscussionPost | null>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkItem | null>(null);
  const [selectedMember, setSelectedMember] = useState<CohortMember | null>(null);

  // Sync URL query params with active tab & modals
  const updateUrlParam = useCallback((param: string, value: string | null) => {
    try {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set(param, value);
      } else {
        url.searchParams.delete(param);
      }
      window.history.pushState({}, '', url.toString());
    } catch {
      // non-browser or test environment fallback
    }
  }, []);

  // Handle URL params on load and popstate
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as CommunityTab | null;
        if (tabParam && ['chat', 'dms', 'classroom', 'qa'].includes(tabParam)) {
          setActiveTab(tabParam);
        }

        const postId = params.get('post');
        const bmId = params.get('benchmark');
        const memId = params.get('member');

        if (postId) {
          const found = posts.find((p) => p.id === postId);
          if (found) setSelectedPost(found);
        } else {
          setSelectedPost(null);
        }

        if (bmId) {
          setSelectedBenchmark(benchmark);
        } else {
          setSelectedBenchmark(null);
        }

        if (memId) {
          const foundMem = members.find((m) => m.userId === memId || m.id === memId);
          if (foundMem) {
            setSelectedMember(foundMem);
          } else {
            // Check profiles
            const foundProfile = INITIAL_PROFILES.find((p) => p.id === memId || p.username === memId);
            if (foundProfile) {
              setSelectedMember({
                id: foundProfile.id,
                userId: foundProfile.id,
                userName: foundProfile.fullName,
                avatarUrl: foundProfile.avatarUrl,
                streakCount: foundProfile.streakCount,
                latestMockBand: foundProfile.currentBand,
                targetScore: foundProfile.targetBand,
                dailyStatus: 'completed'
              });
            }
          }
        } else {
          setSelectedMember(null);
        }
      } catch (err) {
        console.warn('URL sync issue:', err);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [posts, members, benchmark]);

  // Tab switch handler
  const handleTabChange = (tab: CommunityTab) => {
    setActiveTab(tab);
    updateUrlParam('tab', tab);
  };

  // Convert ProfileUser or CohortMember to CohortMember for Profile Modal
  const handleOpenProfileModal = (memberOrProfile: CohortMember | ProfileUser) => {
    if ('userName' in memberOrProfile) {
      setSelectedMember(memberOrProfile as CohortMember);
      updateUrlParam('member', memberOrProfile.userId || memberOrProfile.id);
    } else {
      const p = memberOrProfile as ProfileUser;
      const converted: CohortMember = {
        id: p.id,
        userId: p.id,
        userName: p.fullName || `@${p.username}`,
        avatarUrl: p.avatarUrl,
        streakCount: p.streakCount || 0,
        latestMockBand: p.currentBand || 6.5,
        targetScore: p.targetBand || 7.5,
        dailyStatus: 'completed'
      };
      setSelectedMember(converted);
      updateUrlParam('member', p.username || p.id);
    }
  };

  const handleCloseProfileModal = () => {
    setSelectedMember(null);
    updateUrlParam('member', null);
  };

  // Direct Message Initiator from Search / Member Cards
  const handleStartDirectMessage = (memberOrProfile: CohortMember | ProfileUser) => {
    let profile: ProfileUser;
    if ('username' in memberOrProfile) {
      profile = memberOrProfile as ProfileUser;
    } else {
      const m = memberOrProfile as CohortMember;
      profile = {
        id: m.userId || m.id,
        username: m.userName.toLowerCase().replace(/\s+/g, '_'),
        fullName: m.userName,
        avatarUrl: m.avatarUrl,
        targetBand: m.targetScore || 7.5,
        currentBand: m.latestMockBand || 6.5,
        streakCount: m.streakCount || 0,
        batchName: 'Batch #08'
      };
    }

    setDmTargetUser(profile);
    setActiveTab('dms');
    updateUrlParam('tab', 'dms');
  };

  // Benchmark Modal Handlers
  const handleOpenBenchmark = (bm: BenchmarkItem) => {
    setSelectedBenchmark(bm);
    updateUrlParam('benchmark', bm.id);
  };

  const handleCloseBenchmark = () => {
    setSelectedBenchmark(null);
    updateUrlParam('benchmark', null);
  };

  // Post Modal Handlers
  const handleOpenPost = (post: DiscussionPost) => {
    setSelectedPost(post);
    updateUrlParam('post', post.id);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
    updateUrlParam('post', null);
  };

  const handleUpvotePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const handleReplyAdded = (postId: string, newReply: DiscussionReply) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextReplies = [...(p.replies || []), newReply];
          return {
            ...p,
            replies: nextReplies,
            replyCount: nextReplies.length
          };
        }
        return p;
      })
    );
  };

  return (
    <div className={`min-h-screen ${obsidianTokens.pageBg} p-4 md:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto`}>
      {/* ====================================================================
          TIER 1: PERSISTENT TOP BAR (Global @username Discovery + Cohort Meta)
          ==================================================================== */}
      <GlobalUserDiscoveryBar
        cohort={cohort}
        onSelectMemberForProfile={handleOpenProfileModal}
        onStartDirectMessage={handleStartDirectMessage}
        onlineCount={34}
      />

      {/* ====================================================================
          TIER 2: SUB-NAV TABS ("Linear-Meets-Slack" 2-Tier Architecture)
          ==================================================================== */}
      <div className={obsidianTokens.subNavContainer}>
        {/* Tab 1: Cohort Chat */}
        <button
          onClick={() => handleTabChange('chat')}
          className={`cursor-pointer ${activeTab === 'chat' ? obsidianTokens.tabActive : obsidianTokens.tabInactive}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Cohort Chat</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Tab 2: Direct Messages */}
        <button
          onClick={() => handleTabChange('dms')}
          className={`cursor-pointer ${activeTab === 'dms' ? obsidianTokens.tabActive : obsidianTokens.tabInactive}`}
        >
          <Mail className="w-4 h-4" />
          <span>Direct Messages</span>
          {unreadDmCount > 0 && (
            <span className="px-1.5 py-0.2 text-[11px] font-black rounded-full bg-amber-500 text-slate-950">
              {unreadDmCount}
            </span>
          )}
        </button>

        {/* Tab 3: Batch Classroom */}
        <button
          onClick={() => handleTabChange('classroom')}
          className={`cursor-pointer ${activeTab === 'classroom' ? obsidianTokens.tabActive : obsidianTokens.tabInactive}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Batch Classroom</span>
        </button>

        {/* Tab 4: Q&A Forum */}
        <button
          onClick={() => handleTabChange('qa')}
          className={`cursor-pointer ${activeTab === 'qa' ? obsidianTokens.tabActive : obsidianTokens.tabInactive}`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Q&amp;A Forum</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
            {posts.length}
          </span>
        </button>
      </div>

      {/* ====================================================================
          ACTIVE WORKSPACE VIEW (Renders cleanly based on selected Sub-Nav Tab)
          ==================================================================== */}
      <main className="w-full">
        {activeTab === 'chat' && (
          <div className="animate-in fade-in duration-200">
            <CohortBatchChat
              cohort={cohort}
              userEmail={userEmail}
              onSelectMemberForProfile={handleOpenProfileModal}
              onStartDirectMessage={handleStartDirectMessage}
            />
          </div>
        )}

        {activeTab === 'dms' && (
          <div className="animate-in fade-in duration-200">
            <DirectMessagingPanel
              userEmail={userEmail}
              targetUser={dmTargetUser}
              onClearTargetUser={() => setDmTargetUser(null)}
              onSelectMemberForProfile={handleOpenProfileModal}
            />
          </div>
        )}

        {activeTab === 'classroom' && (
          <div className="animate-in fade-in duration-200">
            <BatchClassroomView
              cohort={cohort}
              members={members}
              benchmark={benchmark}
              onOpenBenchmarkModal={handleOpenBenchmark}
              onSelectMemberForProfile={handleOpenProfileModal}
              onStartDirectMessage={handleStartDirectMessage}
            />
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="animate-in fade-in duration-200">
            <AcademicQAForum
              cohortId={cohort.id}
              onSelectPost={handleOpenPost}
            />
          </div>
        )}
      </main>

      {/* ====================================================================
          PERSISTENT MODALS & DRAWERS (?post, ?benchmark, ?member)
          ==================================================================== */}
      <PostDrawerModal
        post={selectedPost}
        onClose={handleClosePost}
        onUpvote={handleUpvotePost}
        onReplyAdded={handleReplyAdded}
      />

      <BenchmarkReviewModal
        benchmark={selectedBenchmark}
        onClose={handleCloseBenchmark}
      />

      <MemberProfileModal
        member={selectedMember}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
};

export default CohortCommunityPage;
