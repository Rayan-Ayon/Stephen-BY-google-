import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  CohortMetadata,
  CohortMember,
  CohortRecording,
  BenchmarkItem,
  DiscussionPost,
  DiscussionReply,
  ProfileUser,
} from '@/types/community';
import {
  INITIAL_COHORT_DATA,
  INITIAL_MEMBERS,
  INITIAL_RECORDINGS,
  INITIAL_BENCHMARK,
  INITIAL_POSTS,
  INITIAL_PROFILES,
} from './mockCommunityData';
import { obsidianTokens } from './obsidianTokens';
import { CohortTopHeader } from './CohortTopHeader';
import { MentorBroadcastHero } from './MentorBroadcastHero';
import { BenchmarkSpotlightCard } from './BenchmarkSpotlightCard';
import { AcademicForumCard } from './AcademicForumCard';
import { LiveClassBridgeCard } from './LiveClassBridgeCard';
import { CohortTransparencyRoster } from './CohortTransparencyRoster';
import { RealtimeActivityTicker } from './RealtimeActivityTicker';
import { MessagesWorkspaceView } from './MessagesWorkspaceView';
import { PostDrawerModal } from './PostDrawerModal';
import { BenchmarkReviewModal } from './BenchmarkReviewModal';
import { MemberProfileModal } from './MemberProfileModal';

interface CohortCommunityPageProps {
  userEmail?: string;
  cohortId?: string;
}

export const CohortCommunityPage: React.FC<CohortCommunityPageProps> = ({
  userEmail,
  cohortId = 'c8888888-8888-4888-8888-888888888888',
}) => {
  // Master Cohort State
  const [cohort, setCohort] = useState<CohortMetadata>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('stephen_active_pinned_directive');
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...INITIAL_COHORT_DATA,
            dailyMission: {
              title: parsed.title,
              description: parsed.description,
              submittedCount: parsed.submittedCount ?? 0,
              totalAssigned: parsed.totalAssigned ?? 50,
            }
          };
        }
      }
    } catch (e) {}
    return INITIAL_COHORT_DATA;
  });
  const [members, setMembers] = useState<CohortMember[]>(INITIAL_MEMBERS);
  const [recordings, setRecordings] = useState<CohortRecording[]>(INITIAL_RECORDINGS);
  const [benchmark, setBenchmark] = useState<BenchmarkItem>(INITIAL_BENCHMARK);
  const [posts, setPosts] = useState<DiscussionPost[]>(INITIAL_POSTS);

  // Sync pinned directive live
  useEffect(() => {
    const handleMissionSync = () => {
      try {
        const stored = localStorage.getItem('stephen_active_pinned_directive');
        if (stored) {
          const parsed = JSON.parse(stored);
          setCohort((prev) => ({
            ...prev,
            dailyMission: {
              title: parsed.title,
              description: parsed.description,
              submittedCount: parsed.submittedCount ?? 0,
              totalAssigned: parsed.totalAssigned ?? 50,
            }
          }));
        }
      } catch (e) {}
    };

    window.addEventListener('stephen_mission_published', handleMissionSync);
    window.addEventListener('storage', handleMissionSync);
    return () => {
      window.removeEventListener('stephen_mission_published', handleMissionSync);
      window.removeEventListener('storage', handleMissionSync);
    };
  }, []);

  // Unified Navigation Viewport: 'HQ' (Main Community HQ) | 'MESSAGES' (Full-Page Messaging Center)
  const [activeView, setActiveView] = useState<'HQ' | 'MESSAGES'>('HQ');
  const [messagingConvId, setMessagingConvId] = useState<string>('conv-cohort-group');
  const [messagingTargetUser, setMessagingTargetUser] = useState<ProfileUser | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  // Modals state for drill-down inspection
  const [selectedPost, setSelectedPost] = useState<DiscussionPost | null>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkItem | null>(null);
  const [selectedMember, setSelectedMember] = useState<CohortMember | null>(null);

  // Sync URL query params with active modals / views
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
      // Non-browser fallback
    }
  }, []);

  // Handle URL params on load and browser navigation
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view');
        const chatParam = params.get('chat');
        const dmParam = params.get('dm');
        const postId = params.get('post');
        const bmId = params.get('benchmark');
        const memId = params.get('member');

        if (viewParam === 'messages' || chatParam === 'open' || chatParam === 'true') {
          setActiveView('MESSAGES');
          setMessagingConvId('conv-cohort-group');
        }

        if (dmParam) {
          setActiveView('MESSAGES');
          const cleanDm = dmParam.toLowerCase();
          const found = INITIAL_PROFILES.find(
            (p) =>
              p.username?.toLowerCase() === cleanDm ||
              p.id?.toLowerCase() === cleanDm ||
              p.fullName?.toLowerCase().includes(cleanDm.replace(/-/g, ' '))
          );
          if (found) {
            setMessagingTargetUser(found);
            setMessagingConvId(`dm-${found.username || found.id}`);
          } else {
            const dynamicUser: ProfileUser = {
              id: dmParam,
              fullName: dmParam.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              username: dmParam.toLowerCase().replace(/\s+/g, ''),
              avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
              batchName: 'Farmgate Cohort #08',
              targetBand: 7.5,
              currentBand: 6.0,
              streakCount: 4,
            };
            setMessagingTargetUser(dynamicUser);
            setMessagingConvId(`dm-${dynamicUser.username}`);
          }
        }

        if (postId) {
          const found = posts.find((p) => p.id === postId);
          if (found) setSelectedPost(found);
        }

        if (bmId) {
          setSelectedBenchmark(benchmark);
        }

        if (memId) {
          const foundMem = members.find((m) => m.userId === memId || m.id === memId);
          if (foundMem) {
            setSelectedMember(foundMem);
          } else {
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
                dailyStatus: 'completed',
              });
            }
          }
        }
      } catch (err) {
        console.warn('URL sync issue:', err);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [posts, members, benchmark]);

  // Convert ProfileUser or CohortMember for Profile Modal
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
        dailyStatus: 'completed',
      };
      setSelectedMember(converted);
      updateUrlParam('member', p.username || p.id);
    }
  };

  const handleCloseProfileModal = () => {
    setSelectedMember(null);
    updateUrlParam('member', null);
  };

  // Direct Message Initiator: switches to full-page Messaging Workspace with user selected
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
        batchName: 'Batch #08',
      };
    }

    setMessagingTargetUser(profile);
    setMessagingConvId(`dm-${profile.username || profile.id}`);
    setActiveView('MESSAGES');
    updateUrlParam('view', 'messages');
    updateUrlParam('dm', profile.username);
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
            replyCount: nextReplies.length,
          };
        }
        return p;
      })
    );
  };

  // ========================================================================
  // VIEWPORT CONDITIONAL: FULL-PAGE MESSAGES WORKSPACE
  // ========================================================================
  if (activeView === 'MESSAGES') {
    return (
      <MessagesWorkspaceView
        cohort={cohort}
        userEmail={userEmail}
        initialConvId={messagingConvId}
        targetUser={messagingTargetUser}
        onBackToHq={() => {
          setActiveView('HQ');
          setMessagingTargetUser(null);
          updateUrlParam('view', null);
          updateUrlParam('dm', null);
          updateUrlParam('chat', null);
        }}
        onSelectProfile={handleOpenProfileModal}
      />
    );
  }

  // ========================================================================
  // DEFAULT VIEWPORT: 2-COLUMN COMMUNITY HEADQUARTERS
  // ========================================================================
  return (
    <div className={`min-h-screen ${obsidianTokens.pageBg} flex flex-col`}>
      {/* ====================================================================
          TOP BAR & NAVIGATION ORCHESTRATION (Batch identity + Search + [ 💬 Messages (3) ])
          ==================================================================== */}
      <CohortTopHeader
        cohort={cohort}
        onlineCount={34}
        unreadCount={unreadCount}
        onOpenMessages={() => {
          setActiveView('MESSAGES');
          setMessagingConvId('conv-cohort-group');
          updateUrlParam('view', 'messages');
        }}
        onSelectProfile={handleOpenProfileModal}
        onStartDirectMessage={handleStartDirectMessage}
      />

      {/* ====================================================================
          MAIN COHORT HEADQUARTERS ARCHITECTURE
          Clean 2-Column Executive Headquarters Layout:
          - Left Column (65% Width): Academic Directives, Benchmarks & Q&A
          - Right Column (35% Width): Live Sync, Transparency Roster & Activity
          ==================================================================== */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================================================================
              LEFT COLUMN: MAIN CONTENT FEED (65% Width -> 8 cols on lg)
              ================================================================ */}
          <section className="lg:col-span-8 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] pr-3 custom-scrollbar">
            {/* 1. Mentor Broadcast & Daily Mission Hero Card */}
            <MentorBroadcastHero
              mentor={cohort.mentor}
              mission={cohort.dailyMission}
              onSubmitMission={() => {
                setActiveView('MESSAGES');
                setMessagingConvId('conv-cohort-group');
                updateUrlParam('view', 'messages');
              }}
            />

            {/* 2. Benchmark of the Week Spotlight */}
            <BenchmarkSpotlightCard
              benchmark={benchmark}
              onReviewFull={handleOpenBenchmark}
            />

            {/* 3. Academic Doubt & Q&A Forum */}
            <AcademicForumCard
              posts={posts}
              onOpenPostDrawer={handleOpenPost}
              onUpvote={handleUpvotePost}
              onReplyAdded={handleReplyAdded}
            />
          </section>

          {/* ================================================================
              RIGHT COLUMN: SIDEBAR PANEL (35% Width -> 4 cols on lg)
              ================================================================ */}
          <aside className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] pl-3 custom-scrollbar">
            {/* 4. Live Class Bridge Card */}
            <LiveClassBridgeCard
              meetingUrl={cohort.liveMeetingUrl}
              nextSessionIso={cohort.nextLiveSession}
              recordings={recordings}
              onSelectTimestamp={(rec) => {
                if (rec.recordingUrl) {
                  window.open(rec.recordingUrl, '_blank');
                }
              }}
            />

            {/* 5. Cohort Transparency Matrix (Peer Accountability Roster) */}
            <CohortTransparencyRoster
              members={members}
              onSelectMember={handleOpenProfileModal}
              onStartDirectMessage={handleStartDirectMessage}
            />

            {/* 6. Real-Time Activity Ticker */}
            <RealtimeActivityTicker cohortId={cohort.id} />
          </aside>
        </div>
      </main>

      {/* ====================================================================
          PERSISTENT MODALS (?post, ?benchmark, ?member)
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
