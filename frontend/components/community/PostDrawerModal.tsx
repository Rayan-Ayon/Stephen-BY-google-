import React, { useState } from 'react';
import { DiscussionPost, DiscussionReply } from '@/types/community';
import { supabase } from '@/lib/supabaseClient';
import { X, MessageSquare, ThumbsUp, Send, CheckCircle2, UserCheck, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostDrawerModalProps {
  post: DiscussionPost | null;
  onClose: () => void;
  onUpvote: (postId: string) => void;
  onReplyAdded: (postId: string, reply: DiscussionReply) => void;
}

export const PostDrawerModal: React.FC<PostDrawerModalProps> = ({
  post,
  onClose,
  onUpvote,
  onReplyAdded
}) => {
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!post) return null;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    const newReply: DiscussionReply = {
      id: 'rep-' + Date.now(),
      postId: post.id,
      authorName: 'Candidate (You)',
      content: replyText.trim(),
      isMentorAnswer: false,
      createdAt: new Date().toISOString()
    };

    try {
      await (supabase as any).from('cohort_replies').insert({
        post_id: post.id,
        content: replyText.trim()
      });
    } catch (err) {
      console.warn('Supabase reply insert note:', err);
    }

    onReplyAdded(post.id, newReply);
    setReplyText('');
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-gray-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              #{post.tag}
            </span>
            {post.isMentorPinned && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
            {post.isMentorVerified && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" /> Mentor Verified
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Post & Replies Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Main Question Post */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-800">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900">{post.authorName}</span>
                  {post.authorRole === 'mentor' && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                      Mentor
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 leading-snug">{post.title}</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 border border-gray-100 rounded-xl p-4">
              {post.content}
            </div>

            {/* Upvote button */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => onUpvote(post.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.upvotes} Upvotes</span>
              </button>
              <span className="text-xs text-gray-400">
                {post.replies?.length || 0} Answers logged
              </span>
            </div>
          </div>

          {/* Answers Divider */}
          <div className="border-t border-gray-200/60 pt-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Discussion & Mentor Solutions
            </h3>

            {post.replies && post.replies.length > 0 ? (
              <div className="space-y-3">
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      reply.isMentorAnswer
                        ? 'bg-indigo-50/60 border-indigo-200'
                        : 'bg-gray-50/70 border-gray-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-[10px] text-indigo-900">
                          {reply.authorName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-900">{reply.authorName}</span>
                        {reply.isMentorAnswer && (
                          <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.2 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Official Mentor Solution
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(reply.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed pl-8">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center">
                No replies yet. Be the first peer to provide insights!
              </p>
            )}
          </div>
        </div>

        {/* Reply Input Footer */}
        <form
          onSubmit={handleSendReply}
          className="p-4 bg-slate-50 border-t border-gray-100 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your response or follow-up question..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Sending...' : 'Reply'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDrawerModal;
