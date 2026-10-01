import React, { useState, useRef } from 'react';
import {
  PinnedTaskCard,
  BenchmarkShowcaseCard,
  DiscussionArena
} from './centerFeedComponents';
import {
  CohortMetadata,
  BenchmarkItem,
  DiscussionPost
} from '@/types/community';

interface CenterFeedProps {
  cohort: CohortMetadata;
  benchmark: BenchmarkItem;
  posts: DiscussionPost[];
  activeTag: string;
  onSelectTag: (tag: string) => void;
  onPostClick: (post: DiscussionPost) => void;
  onBenchmarkClick: (benchmark: BenchmarkItem) => void;
  onCreatePost: (newPost: { title: string; content: string; tag: any }) => Promise<void>;
  onUpvotePost: (postId: string) => void;
  onSubmitMission?: () => void;
}

export const CenterFeed: React.FC<CenterFeedProps> = ({
  cohort,
  benchmark,
  posts,
  activeTag,
  onSelectTag,
  onPostClick,
  onBenchmarkClick,
  onCreatePost,
  onUpvotePost,
  onSubmitMission
}) => {
  return (
    <div className="space-y-6">
      {/* Component 3: Pinned Mentor Task Card */}
      <PinnedTaskCard
        mentor={cohort.mentor}
        mission={cohort.dailyMission}
        onSubmitMission={onSubmitMission}
      />

      {/* Component 4: Benchmark of the Week (Spotlight Showcase) */}
      <BenchmarkShowcaseCard
        benchmark={benchmark}
        onReviewFull={onBenchmarkClick}
      />

      {/* Component 5: Cohort Doubt & Discussion Arena */}
      <DiscussionArena
        posts={posts}
        activeTag={activeTag}
        onSelectTag={onSelectTag}
        onPostClick={onPostClick}
        onCreatePost={onCreatePost}
        onUpvotePost={onUpvotePost}
      />
    </div>
  );
};

export default CenterFeed;
