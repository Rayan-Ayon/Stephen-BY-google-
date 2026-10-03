import React, { useState, useEffect, useRef } from 'react';
import { Users, Search, Bell, X, CheckCircle2, BookOpen, Headphones, Mic, PenTool, ExternalLink, Sparkles, GraduationCap } from 'lucide-react';
import { useAuth } from '../authContext';
import UpdatesDropdown from './UpdatesDropdown';
import TeacherReviewModal from './enterprise/ielts/TeacherReviewModal';
import {
  listTeacherReviews,
  markTeacherReviewRead,
  markAllTeacherReviewsRead,
  subscribeTeacherReviews,
  timeAgo,
  TeacherReviewNotification,
} from '@/lib/teacherReviewNotifications';

interface DashboardTopHeaderProps {
  userEmail?: string;
  onNavigate?: (view: string) => void;
}

interface NotificationItem {
  id: string;
  type: 'evaluation' | 'audio' | 'community';
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'evaluation',
    title: 'Faculty Evaluation Approved',
    description: 'Dr. Stephen Vance evaluated your Cambridge 18 Task 2 essay. Band 7.5 awarded.',
    time: '12m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'audio',
    title: 'Speaking Audit Ready',
    description: '15s voice note critique attached on Fluency & Lexical Coherence.',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'community',
    title: 'Cohort Community Mention',
    description: 'Tanvir Ahmed replied to your question in Academic Doubt & Q&A Forum.',
    time: '3h ago',
    unread: true,
  },
];

const SEARCH_ITEMS = [
  { title: 'Cambridge 18 - Test 2: Writing Task 2', category: 'Writing Module', icon: PenTool, key: 'writing_lab' },
  { title: 'Academic Reading Full Mock Test', category: 'Reading Hub', icon: BookOpen, key: 'reading_hub' },
  { title: 'Speaking Simulation Part 2 Cue Cards', category: 'Speaking Studio', icon: Mic, key: 'speaking_studio' },
  { title: 'Listening Section 1-4 Complete Exam', category: 'Listening Engine', icon: Headphones, key: 'listening_engine' },
  { title: 'Cohort Delta Community Hub', category: 'Community', icon: Users, key: 'community' },
  { title: 'Daily Mission & Study Plan', category: 'Study Plan', icon: Sparkles, key: 'study_plan' },
  { title: 'Billing & Subscriptions (Pro Upgrade)', category: 'Account & Plans', icon: Sparkles, key: 'subscriptions' },
  { title: 'Free Content Library (Curated Videos)', category: 'Study Material', icon: BookOpen, key: 'content_library' },
];

export const DashboardTopHeader: React.FC<DashboardTopHeaderProps> = ({ userEmail, onNavigate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [teacherReviews, setTeacherReviews] = useState<TeacherReviewNotification[]>(() => listTeacherReviews());
  const [selectedTeacherReview, setSelectedTeacherReview] = useState<TeacherReviewNotification | null>(null);

  useEffect(() => {
    const unsub = subscribeTeacherReviews(() => {
      setTeacherReviews(listTeacherReviews());
    });
    return unsub;
  }, []);

  const unreadTeacherReviews = teacherReviews.filter((r) => r.unread);
  const unreadTeacherCount = unreadTeacherReviews.length;
  const unreadCount = notifications.filter((n) => n.unread).length + unreadTeacherCount;

  // Resolve user display name and avatar
  const resolvedUsername =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.user_name ||
    (userEmail ? userEmail.split('@')[0] : 'ayonburg');

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    (user as any)?.avatar_url;

  // Global key listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Click outside listener for notifications dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen]);

  const handleCommunityNavigation = () => {
    if (onNavigate) {
      onNavigate('community');
    }
    try {
      window.history.pushState({}, '', '/portal/community');
    } catch {}
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    markAllTeacherReviewsRead();
    setTeacherReviews(listTeacherReviews());
  };

  const filteredSearchResults = SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-4 border-b border-[#222732] mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        
        {/* =========================================================================
            LEFT CLUSTER: [ 👥 Community ] & [ 🔍 Search... (Ctrl+K) ]
            ========================================================================= */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Community Quick Gateway */}
          <button
            onClick={handleCommunityNavigation}
            className="bg-[#15181E] text-slate-200 border border-[#222732] hover:bg-[#1C212B] hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm group"
          >
            <Users className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
            <span>Community</span>
          </button>

          {/* Global Search Bar Trigger */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="bg-[#15181E] border border-[#222732] hover:border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:border-rose-500/50 flex items-center justify-between cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5 text-slate-400 text-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-xs sm:text-sm truncate select-none">
                Search tests, modules...
              </span>
            </div>
            <span className="bg-[#0D0F12] border border-[#222732] text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT CLUSTER: [ ⚡ Updates ] & [ 🔔 ] & [ User Profile Card ]
            ========================================================================= */}
        <div className="flex items-center gap-3 relative ml-auto">
          
          {/* Top Header "Updates" Button & Quick Dropdown */}
          <UpdatesDropdown onNavigate={onNavigate} />

          {/* Notification Bell Button */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              aria-label="Notifications"
              className="bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white p-2.5 rounded-xl relative transition-all hover:border-slate-700 shadow-sm cursor-pointer"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadCount > 0 && (
                unreadTeacherCount > 0 ? (
                  <span className="bg-amber-500 text-black font-extrabold text-[10px] px-1.5 py-0.2 rounded-full absolute -top-1 -right-1 border border-[#0D0F12] shadow-lg shadow-amber-500/20 animate-pulse">
                    +{unreadCount}
                  </span>
                ) : (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full absolute -top-1 -right-1 border border-[#0D0F12] shadow-sm">
                    +{unreadCount}
                  </span>
                )
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {isNotificationsOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#15181E] border border-[#222732] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#222732] mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Recent Activity &amp; Alerts
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar">
                  {/* High Priority Teacher Review Cards */}
                  {teacherReviews.map((tr) => (
                    <div
                      key={tr.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        tr.unread
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-[#15181E] border-[#222732] opacity-80'
                      } space-y-2`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider">
                          <GraduationCap className="w-3 h-3" />
                          Teacher Verified Score Available
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {timeAgo(tr.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        <strong className="text-white font-semibold">{tr.teacherName}</strong> updated your{' '}
                        <span className="text-amber-300 font-medium">{tr.testTitle}</span> score to{' '}
                        <span className="text-emerald-400 font-bold">Band {tr.teacherBand.toFixed(1)}</span> and attached a voice note.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          markTeacherReviewRead(tr.id);
                          setTeacherReviews(listTeacherReviews());
                          setIsNotificationsOpen(false);
                          setSelectedTeacherReview(tr);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span>View Faculty Feedback &amp; Score</span>
                        <span>→</span>
                      </button>
                    </div>
                  ))}

                  {/* Standard System Notifications */}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border transition-all ${
                        n.unread
                          ? 'bg-[#181C24] border-rose-500/20'
                          : 'bg-[#111318] border-[#222732] opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-100">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-[#222732] text-center">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      if (onNavigate) onNavigate('history');
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View All Audit Records →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div
            onClick={() => onNavigate && onNavigate('profile_workspace')}
            className="flex items-center gap-3 bg-[#15181E] border border-[#222732] px-3.5 py-1.5 rounded-2xl hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
          >
            {/* Text Column (Left Side of Card) */}
            <div className="text-right">
              <div className="text-sm font-bold text-white leading-tight group-hover:text-rose-400 transition-colors">
                {resolvedUsername}
              </div>
              <div className="text-xs text-slate-400 font-medium leading-tight">
                Free Plan • Band 7.5
              </div>
            </div>

            {/* Avatar Circle (Right Side of Card) */}
            <div className="relative shrink-0">
              {avatarUrl && !avatarError ? (
                <img
                  src={avatarUrl}
                  alt={resolvedUsername}
                  onError={() => setAvatarError(true)}
                  className="w-9 h-9 rounded-full object-cover border border-[#222732] group-hover:border-rose-500/50 transition-colors"
                />
              ) : (
                <div className="bg-rose-950/40 text-rose-400 border border-rose-800/40 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm select-none">
                  {resolvedUsername.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#15181E] absolute -bottom-0.5 -right-0.5" />
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          GLOBAL SEARCH COMMAND PALETTE MODAL (Ctrl+K / ⌘K)
          ========================================================================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
          <div className="bg-[#15181E] border border-[#222732] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-[#222732] flex items-center gap-3 bg-[#111318]">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Cambridge tests, modules, vocabulary drills, community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white text-sm placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E222B] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filtered Search Results */}
            <div className="p-3 max-h-80 overflow-y-auto space-y-1.5">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider px-3 py-1">
                Suggested Platforms &amp; Tests
              </div>
              {filteredSearchResults.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsSearchOpen(false);
                      if (onNavigate) onNavigate(item.key);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#1C212B] transition-colors flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0D0F12] border border-[#222732] flex items-center justify-center text-slate-400 group-hover:text-rose-400 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.category}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}

              {filteredSearchResults.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No matching IELTS modules found for "{searchQuery}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#0D0F12] border-t border-[#222732] flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span>Navigate: <kbd className="px-1 py-0.5 rounded bg-[#181C24] border border-[#222732] text-slate-400">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[#181C24] border border-[#222732] text-slate-400">↓</kbd></span>
                <span>Select: <kbd className="px-1 py-0.5 rounded bg-[#181C24] border border-[#222732] text-slate-400">↵</kbd></span>
              </div>
              <div>Press <kbd className="px-1 py-0.5 rounded bg-[#181C24] border border-[#222732] text-slate-400">ESC</kbd> to close</div>
            </div>
          </div>
        </div>
      )}
      {/* Student-Facing Teacher Review Modal */}
      {selectedTeacherReview && (
        <TeacherReviewModal
          review={selectedTeacherReview}
          onClose={() => setSelectedTeacherReview(null)}
        />
      )}
    </div>
  );
};

export default DashboardTopHeader;
