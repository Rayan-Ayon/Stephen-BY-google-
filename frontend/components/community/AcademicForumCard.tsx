import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Plus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  HelpCircle,
  Tag
} from 'lucide-react';
import { DiscussionPost, DiscussionReply } from '@/types/community';
import { obsidianTokens } from './obsidianTokens';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_PILLS = [
  { label: '#All', value: 'All' },
  { label: '#Task2', value: 'Writing-Task-2' },
  { label: '#Reading-TFNG', value: 'Reading-TFNG' },
  { label: '#Speaking-Part-3', value: 'Speaking-Part-3' },
  { label: '#Collocations', value: 'Collocations' }
];

interface AcademicForumCardProps {
  posts: DiscussionPost[];
  onOpenPostDrawer?: (post: DiscussionPost) => void;
  onUpvote?: (postId: string) => void;
  onReplyAdded?: (postId: string, reply: DiscussionReply) => void;
}

export const AcademicForumCard: React.FC<AcademicForumCardProps> = ({
  posts,
  onOpenPostDrawer,
  onUpvote,
  onReplyAdded
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isComposing, setIsComposing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Writing-Task-2');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [inlineReplyText, setInlineReplyText] = useState('');

  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.tag.toLowerCase().includes(activeCategory.toLowerCase().replace('#', ''));
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      cohortId: 'c8888888-8888-4888-8888-888888888888',
      authorName: 'Nafis Rayan',
      authorRole: 'student',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      tag: selectedTag as any,
      title: newTitle.trim(),
      content: newContent.trim(),
      upvotes: 1,
      isMentorPinned: false,
      isMentorVerified: false,
      replyCount: 0,
      replies: [],
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    setNewTitle('');
    setNewContent('');
    setIsComposing(false);
  };

  const handleSendInlineReply = (postId: string) => {
    if (!inlineReplyText.trim()) return;
    const newReply: DiscussionReply = {
      id: `rep-${Date.now()}`,
      postId,
      authorName: 'Nafis Rayan',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      content: inlineReplyText.trim(),
      isMentorAnswer: false,
      createdAt: new Date().toISOString()
    };

    onReplyAdded?.(postId, newReply);
    setInlineReplyText('');
  };

  return (
    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-5">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className={`p-2 rounded-xl flex items-center justify-center ${obsidianTokens.badgeBlue}`}>
            <HelpCircle className="w-4 h-4 text-blue-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Academic Doubt &amp; Q&amp;A Forum
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#181C24] border border-[#222732] text-slate-400 text-xs font-mono font-semibold">
                {posts.length} Threads
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Discuss Cambridge questions, get mentor verifications, and master scoring strategies.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsComposing((prev) => !prev)}
          className={`${obsidianTokens.btnCrimsonSm} flex items-center gap-1.5`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isComposing ? 'Cancel' : 'Ask Question'}</span>
        </button>
      </div>

      {/* Module Category Filter Pills in #181C24 dark buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {CATEGORY_PILLS.map((pill) => {
          const isActive = activeCategory === pill.value;
          return (
            <button
              key={pill.value}
              onClick={() => setActiveCategory(pill.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-950/50 text-rose-400 border border-rose-800/40 shadow-xs'
                  : 'bg-[#181C24] hover:bg-[#202530] text-slate-400 hover:text-slate-200 border border-[#222732]'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Inline Post Composer */}
      {isComposing && (
        <form
          onSubmit={handleCreatePost}
          className="bg-[#181C24] border border-[#222732] rounded-xl p-4.5 space-y-3.5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              New Academic Doubt / Discussion
            </span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-[#15181E] border border-[#222732] text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="Writing-Task-2">#Task2</option>
              <option value="Reading-TFNG">#Reading-TFNG</option>
              <option value="Speaking-Part-3">#Speaking-Part-3</option>
              <option value="Collocations">#Collocations</option>
            </select>
          </div>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What is your academic doubt or Cambridge reference?"
            className="w-full bg-[#12141A] border border-[#222732] text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600/70"
            required
          />

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            placeholder="Add context, mention specific question numbers, or paste your draft paragraph..."
            className="w-full bg-[#12141A] border border-[#222732] text-slate-100 placeholder-slate-500 rounded-xl p-3.5 text-xs sm:text-sm focus:outline-none focus:border-rose-600/70"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
            <button
              type="submit"
              className={`${obsidianTokens.btnCrimsonSm} flex items-center gap-1`}
            >
              <Send className="w-3 h-3" />
              <span>Post to Cohort</span>
            </button>
          </div>
        </form>
      )}

      {/* Post Items Feed */}
      <div className="space-y-3.5">
        {filteredPosts.slice(0, 4).map((post) => {
          const isExpanded = expandedPostId === post.id;
          let timeAgo = 'recently';
          try {
            timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
          } catch {
            // fallback
          }

          return (
            <div
              key={post.id}
              className="bg-[#181C24] border border-[#222732] hover:border-slate-700/80 rounded-xl p-4 transition-all space-y-3"
            >
              {/* Header: Author + Verified Badge + Tag */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face'}
                    alt={post.authorName}
                    className="w-7 h-7 rounded-full object-cover border border-[#222732]"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {post.authorName}
                      </span>
                      {post.isMentorVerified && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[10px] font-bold ${obsidianTokens.badgeGreen}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          Mentor Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{timeAgo}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-[#12141A] border border-[#222732] text-[10px] font-mono text-slate-400">
                  #{post.tag}
                </span>
              </div>

              {/* Title & Content */}
              <div
                onClick={() => onOpenPostDrawer?.(post)}
                className="cursor-pointer group"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Bottom Actions: Upvote + Reply count + Expand button */}
              <div className="flex items-center justify-between pt-1 border-t border-[#222732]/60 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpvote?.(post.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12141A] hover:bg-[#202530] text-slate-300 hover:text-white border border-[#222732] transition-colors cursor-pointer text-xs"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-bold">{post.upvotes}</span>
                  </button>

                  <button
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12141A] hover:bg-[#202530] text-slate-300 hover:text-white border border-[#222732] transition-colors cursor-pointer text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span>{post.replyCount || post.replies?.length || 0} Replies</span>
                  </button>
                </div>

                <button
                  onClick={() => onOpenPostDrawer?.(post)}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  View Discussion &rarr;
                </button>
              </div>

              {/* Expandable Replies View */}
              {isExpanded && (
                <div className="pt-2 border-t border-[#222732]/80 space-y-2.5 animate-in fade-in duration-150">
                  {post.replies && post.replies.length > 0 ? (
                    post.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className={`p-2.5 rounded-lg text-xs ${
                          rep.isMentorAnswer
                            ? 'bg-amber-950/20 border border-amber-800/30'
                            : 'bg-[#12141A] border border-[#222732]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1">
                            {rep.authorName}
                            {rep.isMentorAnswer && (
                              <span className="text-[9px] bg-amber-950/60 text-amber-400 border border-amber-800/40 px-1 rounded">
                                Mentor
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{rep.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No responses yet. Be the first to answer!</p>
                  )}

                  {/* Inline response input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={inlineReplyText}
                      onChange={(e) => setInlineReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendInlineReply(post.id)}
                      placeholder="Write an academic response..."
                      className="flex-1 bg-[#12141A] border border-[#222732] text-xs text-white placeholder-slate-500 rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-600/70"
                    />
                    <button
                      onClick={() => handleSendInlineReply(post.id)}
                      className={`${obsidianTokens.btnCrimsonSm} py-1.5`}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicForumCard;
