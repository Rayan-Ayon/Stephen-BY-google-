import React, { useState, useRef, useEffect } from 'react';
import {
  Pin,
  Sparkles,
  Send,
  MessageSquare,
  ThumbsUp,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  Award,
  ChevronRight,
  Filter,
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import {
  MentorInfo,
  BenchmarkItem,
  DiscussionPost
} from '@/types/community';

/* ============================================================================
   COMPONENT 3: PINNED MENTOR TASK CARD
============================================================================ */
interface PinnedTaskCardProps {
  mentor: MentorInfo;
  mission: {
    title: string;
    description: string;
    submittedCount: number;
    totalAssigned: number;
  };
  onSubmitMission?: () => void;
}

export const PinnedTaskCard: React.FC<PinnedTaskCardProps> = ({
  mentor,
  mission,
  onSubmitMission
}) => {
  const percentage = Math.round((mission.submittedCount / (mission.totalAssigned || 1)) * 100);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 border border-indigo-700/50 shadow-md">
      {/* Decorative gradient blur background */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 rounded-lg">
            <Pin className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            Mentor Priority Directive
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
          <img
            src={mentor.avatarUrl}
            alt={mentor.name}
            className="w-5 h-5 rounded-full object-cover border border-amber-400"
          />
          <span className="text-xs font-bold text-gray-200">{mentor.name}</span>
          <span className="text-[10px] text-amber-400 font-extrabold">Band {mentor.bandScore}</span>
        </div>
      </div>

      {/* Mission Content */}
      <div className="space-y-2 mb-5">
        <h3 className="text-xl font-black text-white tracking-tight leading-snug">
          {mission.title}
        </h3>
        <p className="text-sm text-indigo-200/90 leading-relaxed font-normal">
          {mission.description}
        </p>
      </div>

      {/* Submission Ratio Counter Bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5 mb-5 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-indigo-200">Cohort Submission Quota:</span>
          <span className="font-extrabold text-white text-sm">
            {mission.submittedCount} <span className="text-indigo-300 font-normal">/ {mission.totalAssigned} In</span>{' '}
            <span className="text-amber-400">({percentage}%)</span>
          </span>
        </div>

        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-indigo-300/80 font-medium">
          Due tonight before 11:59 PM • Evaluated by AI & Mentor
        </span>
        <button
          onClick={onSubmitMission}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Submit Daily Mission</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


/* ============================================================================
   COMPONENT 4: BENCHMARK OF THE WEEK (SPOTLIGHT SHOWCASE)
============================================================================ */
interface BenchmarkShowcaseCardProps {
  benchmark: BenchmarkItem;
  onReviewFull?: (benchmark: BenchmarkItem) => void;
}

export const BenchmarkShowcaseCard: React.FC<BenchmarkShowcaseCardProps> = ({
  benchmark,
  onReviewFull
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.warn('Audio play error:', err));
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Benchmark Showcase
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              {benchmark.module} Spotlight
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug">
            {benchmark.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Authored by <span className="font-semibold text-gray-800">{benchmark.studentName}</span>
          </p>
        </div>

        {/* Big Band Score Stamp */}
        <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-indigo-50 to-indigo-100/70 border border-indigo-200 text-indigo-700 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">Official</span>
          <span className="text-2xl font-black text-indigo-900 leading-none">
            {benchmark.bandScore.toFixed(1)}
          </span>
          <span className="text-[10px] font-bold text-indigo-600">Band</span>
        </div>
      </div>

      {/* AI Criteria Sub-Scores Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-2.5 text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">TR (Task)</span>
          <span className="text-base font-extrabold text-gray-900">
            {benchmark.aiSubScores.TR ? benchmark.aiSubScores.TR.toFixed(1) : '8.0'}
          </span>
        </div>
        <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-2.5 text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">CC (Cohesion)</span>
          <span className="text-base font-extrabold text-gray-900">
            {benchmark.aiSubScores.CC ? benchmark.aiSubScores.CC.toFixed(1) : '8.0'}
          </span>
        </div>
        <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-2.5 text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">LR (Lexical)</span>
          <span className="text-base font-extrabold text-gray-900">
            {benchmark.aiSubScores.LR ? benchmark.aiSubScores.LR.toFixed(1) : '8.0'}
          </span>
        </div>
        <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-2.5 text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">GRA (Grammar)</span>
          <span className="text-base font-extrabold text-gray-900">
            {benchmark.aiSubScores.GRA ? benchmark.aiSubScores.GRA.toFixed(1) : '7.5'}
          </span>
        </div>
      </div>

      {/* Model Essay Snippet */}
      <div className="relative bg-slate-50 border border-slate-200/70 rounded-xl p-4 text-xs text-slate-700 leading-relaxed font-serif italic max-h-36 overflow-hidden">
        <p className="line-clamp-4">{benchmark.submissionContent}</p>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      {/* Mentor Feedback Voice Note Audio Player */}
      {benchmark.mentorVoiceNoteUrl && (
        <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-xl p-3 flex items-center justify-between gap-3">
          <audio ref={audioRef} src={benchmark.mentorVoiceNoteUrl} preload="metadata" />
          <button
            onClick={toggleAudio}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-indigo-900 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> Mentor Voice Feedback
              </span>
              <span className="text-indigo-600 font-semibold">{isPlaying ? 'Playing...' : 'Audio Analysis'}</span>
            </div>
            {/* Custom Progress Bar */}
            <div className="w-full h-1.5 bg-indigo-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-200"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reason Pill & Full Review Link */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <p className="text-gray-500 font-medium line-clamp-1 max-w-[70%]">
          💡 <span className="font-semibold text-gray-700">Why it scored Band 8.0:</span> {benchmark.highlightReason}
        </p>

        <button
          onClick={() => onReviewFull?.(benchmark)}
          className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Read Full Analysis</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};


/* ============================================================================
   COMPONENT 5: COHORT DOUBT & DISCUSSION ARENA
============================================================================ */
const TAGS = [
  'All',
  'Writing-Task-1',
  'Writing-Task-2',
  'Reading-TFNG',
  'Speaking-Part-3',
  'Collocations',
  'General'
] as const;

interface DiscussionArenaProps {
  posts: DiscussionPost[];
  activeTag: string;
  onSelectTag: (tag: string) => void;
  onPostClick: (post: DiscussionPost) => void;
  onCreatePost: (newPost: { title: string; content: string; tag: any }) => Promise<void>;
  onUpvotePost: (postId: string) => void;
}

export const DiscussionArena: React.FC<DiscussionArenaProps> = ({
  posts,
  activeTag,
  onSelectTag,
  onPostClick,
  onCreatePost,
  onUpvotePost
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<any>('Writing-Task-2');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);
    try {
      await onCreatePost({
        title: newTitle.trim(),
        content: newContent.trim(),
        tag: selectedTag
      });
      setNewTitle('');
      setNewContent('');
      setIsComposing(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (activeTag === 'All') return true;
    return p.tag === activeTag;
  });

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Title & Compose Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Cohort Doubt & Strategy Arena
          </h3>
          <p className="text-xs text-gray-500">Ask questions, debate logic, and receive verified teacher feedback</p>
        </div>

        <button
          onClick={() => setIsComposing((prev) => !prev)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isComposing ? 'Cancel' : '+ New Question'}</span>
        </button>
      </div>

      {/* Quick Question Composer */}
      {isComposing && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">Select Topic:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-gray-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              {TAGS.filter((t) => t !== 'All').map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="What is your doubt or question? (e.g. Cambridge 18 Test 2 Task 2 argument trap)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-sm font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            required
          />

          <textarea
            placeholder="Elaborate on the specific question, quote, or sentence you are struggling with..."
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{submitting ? 'Publishing...' : 'Publish Question'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Module Pill Tag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer ${
              activeTag === tag
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            No questions found in this category. Be the first to start a discussion!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onPostClick(post)}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-indigo-300 hover:shadow-xs ${
                post.isMentorPinned
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-gray-50/70 border-gray-200/70'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                    #{post.tag}
                  </span>

                  {post.isMentorPinned && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" /> Pinned Guide
                    </span>
                  )}

                  {post.isMentorVerified && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" /> Mentor Verified
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* Title & Preview Content */}
              <h4 className="text-sm font-bold text-gray-900 mb-1 leading-snug hover:text-indigo-600 transition-colors">
                {post.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                {post.content}
              </p>

              {/* Footer: Author, Replies & Upvotes */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[10px] text-gray-700">
                    {post.authorName.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-700 text-[11px]">{post.authorName}</span>
                  {post.authorRole === 'mentor' && (
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                      Mentor
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.replyCount || (post.replies ? post.replies.length : 0)} replies</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpvotePost(post.id);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:border-indigo-300 rounded-lg text-gray-700 font-semibold text-xs transition-colors hover:text-indigo-600 cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{post.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
