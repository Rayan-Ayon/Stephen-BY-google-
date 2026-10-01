import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Sparkles,
  CheckCircle2,
  Pin,
  Filter,
  Plus,
  Search,
  Check,
  Award,
  ChevronDown,
  ChevronUp,
  User,
  ShieldCheck,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { DiscussionPost, DiscussionReply } from '@/types/community';
import { INITIAL_POSTS } from './mockCommunityData';
import { obsidianTokens } from './obsidianTokens';
import { supabase } from '@/lib/supabaseClient';

const CATEGORIES = [
  'All',
  'Writing-Task-1',
  'Writing-Task-2',
  'Reading-TFNG',
  'Speaking-Part-3',
  'Grammar',
  'Collocations'
] as const;

interface AcademicQAForumProps {
  onSelectPost?: (post: DiscussionPost) => void;
  cohortId?: string;
}

export const AcademicQAForum: React.FC<AcademicQAForumProps> = ({
  onSelectPost,
  cohortId = 'c8888888-8888-4888-8888-888888888888'
}) => {
  const [posts, setPosts] = useState<DiscussionPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<any>('Writing-Task-2');
  const [submitting, setSubmitting] = useState(false);

  // Reply State
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replySubmitting, setReplySubmitting] = useState<Record<string, boolean>>({});

  // Upvoted posts local state tracker
  const [upvotedPostIds, setUpvotedPostIds] = useState<Set<string>>(new Set());

  // Load from Supabase with optimistic fallback
  useEffect(() => {
    let isMounted = true;
    const loadDiscussions = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('cohort_posts')
          .select('*, replies:cohort_post_replies(*)')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0 && isMounted) {
          const mapped: DiscussionPost[] = data.map((item: any) => ({
            id: item.id,
            cohortId: item.cohort_id || cohortId,
            authorName: item.author_name || 'Academic Scholar',
            authorAvatar: item.author_avatar,
            authorRole: item.author_role || 'student',
            tag: item.tag || 'Writing-Task-2',
            title: item.title,
            content: item.content,
            upvotes: item.upvotes || 0,
            isMentorPinned: !!item.is_pinned,
            isMentorVerified: !!item.is_mentor_verified,
            replyCount: item.replies?.length || item.reply_count || 0,
            createdAt: item.created_at,
            replies: item.replies?.map((r: any) => ({
              id: r.id,
              postId: item.id,
              authorName: r.author_name,
              authorAvatar: r.author_avatar,
              content: r.content,
              isMentorAnswer: !!r.is_mentor_answer,
              createdAt: r.created_at
            }))
          }));
          setPosts(mapped);
        }
      } catch (err) {
        // Fallback to rich initial mock dataset
        if (isMounted) {
          setPosts(INITIAL_POSTS);
        }
      }
    };

    loadDiscussions();
    return () => {
      isMounted = false;
    };
  }, [cohortId]);

  // Upvote Handler
  const handleUpvote = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isUpvoted = upvotedPostIds.has(postId);

    setUpvotedPostIds((prev) => {
      const next = new Set(prev);
      if (isUpvoted) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            upvotes: isUpvoted ? Math.max(0, p.upvotes - 1) : p.upvotes + 1
          };
        }
        return p;
      })
    );

    try {
      await (supabase as any).rpc('increment_post_upvote', { post_id: postId });
    } catch {
      // optimistic update maintained
    }
  };

  // Submit New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);
    const newPostItem: DiscussionPost = {
      id: `post-${Date.now()}`,
      cohortId,
      authorName: 'Nafis Rayan',
      authorRole: 'student',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      tag: selectedTag,
      title: newTitle.trim(),
      content: newContent.trim(),
      upvotes: 1,
      isMentorPinned: false,
      isMentorVerified: false,
      replyCount: 0,
      replies: [],
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setPosts((prev) => [newPostItem, ...prev]);
    setUpvotedPostIds((prev) => new Set(prev).add(newPostItem.id));
    setNewTitle('');
    setNewContent('');
    setIsComposing(false);
    setSubmitting(false);

    try {
      await (supabase as any).from('cohort_posts').insert([
        {
          cohort_id: cohortId,
          author_name: newPostItem.authorName,
          author_avatar: newPostItem.authorAvatar,
          author_role: newPostItem.authorRole,
          tag: newPostItem.tag,
          title: newPostItem.title,
          content: newPostItem.content,
          upvotes: 1
        }
      ]);
    } catch (err) {
      console.warn('Post saved in local session state:', err);
    }
  };

  // Submit Reply to Post
  const handleCreateReply = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const replyText = replyTextMap[postId];
    if (!replyText || !replyText.trim()) return;

    setReplySubmitting((prev) => ({ ...prev, [postId]: true }));

    const newReply: DiscussionReply = {
      id: `reply-${Date.now()}`,
      postId,
      authorName: 'Nafis Rayan',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      content: replyText.trim(),
      isMentorAnswer: false,
      createdAt: new Date().toISOString()
    };

    // Update in local state
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedReplies = [...(p.replies || []), newReply];
          return {
            ...p,
            replyCount: updatedReplies.length,
            replies: updatedReplies
          };
        }
        return p;
      })
    );

    setReplyTextMap((prev) => ({ ...prev, [postId]: '' }));
    setReplySubmitting((prev) => ({ ...prev, [postId]: false }));

    try {
      await (supabase as any).from('cohort_post_replies').insert([
        {
          post_id: postId,
          author_name: newReply.authorName,
          author_avatar: newReply.authorAvatar,
          content: newReply.content,
          is_mentor_answer: false
        }
      ]);
    } catch (err) {
      console.warn('Reply saved in session:', err);
    }
  };

  // Filtered list
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' ||
      post.tag.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner & Action Bar */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Academic Q&amp;A &amp; Doubt Forum
            </h2>
            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 text-xs rounded-full font-mono">
              {posts.length} Threads
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Submit IELTS strategy doubts, debate Cambridge answer keys, and receive verified answers from Dr. Stephen Vance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsComposing((prev) => !prev)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isComposing ? 'Close Composer' : 'Ask Question'}</span>
          </button>
        </div>
      </div>

      {/* New Question Form Composer */}
      {isComposing && (
        <form
          onSubmit={handleCreatePost}
          className="bg-[#111827] border border-amber-500/30 rounded-2xl p-6 shadow-lg shadow-amber-500/5 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Draft Your Academic Question</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Category:</span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-1.5 text-slate-200 font-medium focus:outline-hidden focus:border-amber-500"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    #{cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="e.g. Cambridge 18 Test 2 Task 2 — How to counter-argue without weakening thesis?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Provide background context, quotes from the passage, or sentences you are analyzing..."
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 resize-none leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Publishing...' : 'Publish to Batch'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills & Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>#{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Q&amp;A topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-slate-700"
          />
        </div>
      </div>

      {/* Posts Thread List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">No questions found in this category</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to raise a question or doubt in #{activeCategory} for peer discussion and mentor review.
            </p>
            <button
              onClick={() => setIsComposing(true)}
              className="mt-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs rounded-xl hover:bg-amber-500/20 transition-colors"
            >
              Ask First Question
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            const isUpvoted = upvotedPostIds.has(post.id);
            const isMentor = post.authorRole === 'mentor';

            return (
              <div
                key={post.id}
                className={`bg-[#111827] border transition-all duration-200 rounded-2xl overflow-hidden ${
                  post.isMentorPinned
                    ? 'border-amber-500/40 shadow-sm shadow-amber-500/5'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Main Post Card Header & Content */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => {
                    setExpandedPostId(isExpanded ? null : post.id);
                    onSelectPost?.(post);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Author Meta */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {post.authorAvatar ? (
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                            {post.authorName.charAt(0)}
                          </div>
                        )}
                        {isMentor && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-500 text-slate-950 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-200">
                            {post.authorName}
                          </span>
                          {isMentor ? (
                            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                              Mentor
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-400 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md">
                              Student
                            </span>
                          )}

                          {post.isMentorPinned && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                              <Pin className="w-2.5 h-2.5" />
                              Pinned Directive
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span className="text-amber-400/90 font-medium">#{post.tag}</span>
                        </div>
                      </div>
                    </div>

                    {/* Upvote & Verification Pill */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {post.isMentorVerified && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mentor Verified</span>
                        </div>
                      )}

                      <button
                        onClick={(e) => handleUpvote(post.id, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isUpvoted
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                        <span>{post.upvotes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Title & Content */}
                  <div className="mt-3.5 space-y-1.5">
                    <h3 className="text-base font-bold text-slate-100 hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Footer Meta: Reply Count & Expansion Toggle */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 hover:text-slate-200">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>{post.replyCount || 0} answers</span>
                      </span>

                      {post.replies && post.replies.some((r) => r.isMentorAnswer) && (
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Check className="w-3 h-3 text-amber-400" />
                          Includes mentor answer
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200 font-medium">
                      <span>{isExpanded ? 'Collapse thread' : 'View full discussion'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Thread Pane */}
                {isExpanded && (
                  <div className="bg-slate-900/70 border-t border-slate-800/90 p-5 space-y-5 animate-in fade-in duration-150">
                    {/* Full question body */}
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </div>

                    {/* Replies List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Thread Answers ({post.replies?.length || 0})
                        </span>
                      </div>

                      {post.replies && post.replies.length > 0 ? (
                        post.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`p-4 rounded-xl border space-y-2 ${
                              reply.isMentorAnswer
                                ? 'bg-amber-500/5 border-amber-500/20'
                                : 'bg-[#111827] border-slate-800/80'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {reply.authorAvatar ? (
                                  <img
                                    src={reply.authorAvatar}
                                    alt={reply.authorName}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">
                                    {reply.authorName.charAt(0)}
                                  </div>
                                )}
                                <span className="text-xs font-bold text-slate-200">
                                  {reply.authorName}
                                </span>
                                {reply.isMentorAnswer && (
                                  <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-md flex items-center gap-1">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    Mentor Verified Answer
                                  </span>
                                )}
                              </div>

                              <span className="text-[10px] text-slate-500">
                                {new Date(reply.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                              {reply.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          No replies yet. Be the first to share an answer or insight!
                        </p>
                      )}
                    </div>

                    {/* Quick Reply Form */}
                    <form
                      onSubmit={(e) => handleCreateReply(post.id, e)}
                      className="flex items-center gap-2 pt-2"
                    >
                      <input
                        type="text"
                        placeholder="Contribute your answer or debate this topic..."
                        value={replyTextMap[post.id] || ''}
                        onChange={(e) =>
                          setReplyTextMap((prev) => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))
                        }
                        className="flex-1 bg-[#111827] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={replySubmitting[post.id] || !(replyTextMap[post.id] || '').trim()}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                      >
                        <Send className="w-3 h-3" />
                        <span>Answer</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
