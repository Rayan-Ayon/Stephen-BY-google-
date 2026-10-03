import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ProfileUser, CohortMetadata } from '@/types/community';
import { INITIAL_PROFILES } from './mockCommunityData';
import { obsidianTokens } from './obsidianTokens';
import { Search, MessageSquare, Mail, CheckCircle2, Sparkles, User } from 'lucide-react';

interface CohortTopHeaderProps {
  cohort: CohortMetadata;
  onlineCount?: number;
  unreadCount?: number;
  onOpenMessages: () => void;
  onSelectProfile: (member: ProfileUser) => void;
  onStartDirectMessage: (member: ProfileUser) => void;
}

export const CohortTopHeader: React.FC<CohortTopHeaderProps> = ({
  cohort,
  onlineCount = 34,
  unreadCount = 3,
  onOpenMessages,
  onSelectProfile,
  onStartDirectMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ProfileUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic: queries public.profiles with fallback to INITIAL_PROFILES
  useEffect(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      setResults(INITIAL_PROFILES.slice(0, 6));
      return;
    }

    let isCancelled = false;
    setIsSearching(true);

    const performSearch = async () => {
      try {
        const cleanTerm = term.startsWith('@') ? term.substring(1) : term;
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('id, username, full_name, avatar_url, target_band, current_band, streak_count')
          .or(`username.ilike.%${cleanTerm}%,full_name.ilike.%${cleanTerm}%`)
          .limit(8);

        if (!isCancelled) {
          if (!error && data && data.length > 0) {
            const mapped: ProfileUser[] = data.map((d: any) => ({
              id: d.id,
              username: d.username || d.full_name?.toLowerCase().replace(/\s+/g, '_') || 'candidate',
              fullName: d.full_name || 'Candidate',
              avatarUrl: d.avatar_url,
              targetBand: Number(d.target_band) || 7.5,
              currentBand: Number(d.current_band) || 6.5,
              streakCount: Number(d.streak_count) || 0,
              batchName: cohort.name,
            }));
            setResults(mapped);
          } else {
            const filtered = INITIAL_PROFILES.filter(
              (p) =>
                p.username.toLowerCase().includes(cleanTerm) ||
                p.fullName.toLowerCase().includes(cleanTerm)
            );
            setResults(filtered);
          }
        }
      } catch {
        if (!isCancelled) {
          const cleanTerm = term.startsWith('@') ? term.substring(1) : term;
          const filtered = INITIAL_PROFILES.filter(
            (p) =>
              p.username.toLowerCase().includes(cleanTerm) ||
              p.fullName.toLowerCase().includes(cleanTerm)
          );
          setResults(filtered);
        }
      } finally {
        if (!isCancelled) setIsSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 150);
    return () => {
      isCancelled = true;
      clearTimeout(debounce);
    };
  }, [searchQuery, cohort.name]);

  const isMac = typeof window !== 'undefined' && navigator.platform?.toUpperCase().indexOf('MAC') >= 0;

  return (
    <header className="sticky top-0 z-40 bg-[#0D0F12]/95 backdrop-blur-md border-b border-[#222732] px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-[1680px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* ====================================================================
            HEADER LEFT COLUMN: BATCH IDENTITY & MENTOR META
            ==================================================================== */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <span className="font-black text-sm tracking-tight">#08</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                {cohort.name}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${obsidianTokens.badgeGreen}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                • {onlineCount} Online
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
              <span>Mentor:</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                {cohort.mentor?.name || 'Dr. Stephen Vance'}
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              </span>
              <span className="text-slate-600 font-mono">|</span>
              <span className="text-slate-400 font-medium">Target Band {cohort.targetBand}</span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            HEADER RIGHT UTILITY CLUSTER: SEARCH (Ctrl+K), [💬 Chat], [✉️ DMs]
            ==================================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap lg:flex-nowrap">
          {/* Global Search Bar (Ctrl+K) */}
          <div ref={containerRef} className="relative w-full sm:w-80 md:w-96">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search @username or name... (Ctrl+K)"
                className="w-full bg-[#15181E] border border-[#222732] text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-14 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600/70 focus:ring-1 focus:ring-rose-600/30 transition-all shadow-inner"
              />
              <span className="absolute right-2 px-1.5 py-0.5 rounded bg-[#181C24] border border-[#222732] text-[10px] font-mono text-slate-400 select-none">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </span>
            </div>

            {/* Global Search Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#15181E] border border-[#222732] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2.5 border-b border-[#222732] flex items-center justify-between text-[11px] text-slate-400 px-3">
                  <span>{searchQuery ? 'Search Results' : 'Suggested Batch Candidates'}</span>
                  {isSearching && <span className="text-amber-400 animate-pulse font-mono">Searching...</span>}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#222732]/60 custom-scrollbar">
                  {results.length > 0 ? (
                    results.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="p-3 hover:bg-[#181C24] transition-colors flex items-center justify-between gap-3 group"
                      >
                        <div
                          onClick={() => {
                            onSelectProfile(candidate);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                        >
                          <img
                            src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'}
                            alt={candidate.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-[#222732]"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-200 group-hover:text-rose-400 transition-colors truncate">
                                {candidate.fullName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                @{candidate.username}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="text-orange-400 font-semibold">🔥 {candidate.streakCount}d streak</span>
                              <span>•</span>
                              <span>Target Band {candidate.targetBand}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onStartDirectMessage(candidate);
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 text-xs font-bold bg-[#181C24] hover:bg-rose-600 text-slate-300 hover:text-white border border-[#222732] rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Mail className="w-3 h-3" />
                          <span>DM</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No candidates found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Single Unified Entry Button: [ 💬 Messages (3) ] */}
          <button
            onClick={onOpenMessages}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] hover:bg-[#1C212B] text-slate-200 border border-[#222732] hover:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer shrink-0"
            title="Open Unified Messages Workspace"
          >
            <span className="text-base leading-none">💬</span>
            <span>Messages</span>
            {unreadCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default CohortTopHeader;
