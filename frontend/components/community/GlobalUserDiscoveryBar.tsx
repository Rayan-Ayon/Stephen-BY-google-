import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ProfileUser, CohortMetadata } from '@/types/community';
import { INITIAL_PROFILES } from './mockCommunityData';
import { obsidianTokens } from './obsidianTokens';

interface GlobalUserDiscoveryBarProps {
  cohort: CohortMetadata;
  onSelectMemberForProfile: (member: ProfileUser) => void;
  onStartDirectMessage: (member: ProfileUser) => void;
  onlineCount?: number;
}

export const GlobalUserDiscoveryBar: React.FC<GlobalUserDiscoveryBarProps> = ({
  cohort,
  onSelectMemberForProfile,
  onStartDirectMessage,
  onlineCount = 34,
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
            // Local fallback fuzzy search
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

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Batch Info & Mentor */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-black text-sm tracking-tight">#08</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                {cohort.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {onlineCount} Online
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
              <span>Mentor:</span>
              <span className="text-amber-400 font-medium flex items-center gap-1">
                {cohort.mentor?.name || 'Dr. Stephen Vance'}
                <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-mono">Target Band {cohort.targetBand}</span>
            </div>
          </div>
        </div>

        {/* Right: Global @username Search Bar */}
        <div ref={containerRef} className="relative w-full md:w-80 lg:w-96">
          <div className="relative flex items-center">
            <svg
              className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search by @username or name..."
              className="w-full bg-[#111827] border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-14 py-2 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all shadow-inner"
            />
            <span className="absolute right-2 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-[10px] font-mono text-slate-400 select-none">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </span>
          </div>

          {/* Results Dropdown Modal */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-3">
                <span>{searchQuery ? 'Search Results' : 'Suggested Batch Candidates'}</span>
                {isSearching && <span className="text-amber-400 animate-pulse">Searching...</span>}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                {results.length > 0 ? (
                  results.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-3 hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'}
                          alt={candidate.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700/60 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-100 truncate">
                              {candidate.fullName}
                            </span>
                            {candidate.isMentor && (
                              <span className={obsidianTokens.badgeMentor}>Mentor</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="text-amber-400 font-mono">@{candidate.username}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-300">Band {candidate.currentBand}</span>
                            <span>•</span>
                            <span className="text-orange-400 font-mono">🔥 {candidate.streakCount}d</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onSelectMemberForProfile(candidate);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onStartDirectMessage(candidate);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-[11px] transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.177 49.177 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                          </svg>
                          Message
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No candidates found matching "@{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
