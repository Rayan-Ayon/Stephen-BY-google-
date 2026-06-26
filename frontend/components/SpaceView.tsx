
import React, { useState } from 'react';
import {
  UploadIcon, LinkIcon, ClipboardIcon, MicIcon, ArrowUpIcon,
  PlusIcon, FileTextIcon, SparkleIcon, PlusSquareIcon,
  ShieldCheckIcon, LockClosedIcon, FlashcardIcon, PodcastIcon,
  PlayIcon, BuildingLibraryIcon, TrashIcon,
} from './icons';
import { getLibraryItems, type Space } from '../utils/mockDb';

interface SpaceViewProps {
  space: Space;
}

const ActionCard = ({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) => (
  <button className="flex flex-col items-start p-4 bg-[#111] border border-gray-800 rounded-2xl hover:bg-[#161616] transition-colors text-left group w-full h-28 justify-between">
    <div className="text-gray-400 group-hover:text-white transition-colors">
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
    </div>
    <div>
      <div className="font-semibold text-gray-200 group-hover:text-white text-sm mb-0.5">{label}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  </button>
);

const InstitutionalDashboard: React.FC<{ space: Space }> = ({ space }) => {
  const libraryItems = getLibraryItems();

  return (
    <div className="flex-1 h-full bg-[#0b0b0b] text-white p-8 lg:p-12 overflow-y-auto">
      {/* A. Co-Branded Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Lora', serif" }}>
          Stephen
        </h1>
        <span className="w-[1px] h-6 bg-zinc-800" />
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs px-3 py-1 rounded-full">
          <ShieldCheckIcon className="w-3.5 h-3.5" />
          {space.institutionName || 'Institution'}
        </span>
      </div>

      {/* B. Transparency Privacy Banner */}
      <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <LockClosedIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-zinc-400 text-xs leading-relaxed">
          Institutional Space — Managed by {space.institutionName || 'your institution'}. Learning metrics, exam scores, and assigned material progress within this space are shared with your institution instructors. Personal spaces remain fully private.
        </p>
      </div>

      {/* C. Split-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pane — Curated Knowledge Library */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
              Curated Knowledge Library
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Organize knowledge, organize classes, and materials.</p>
          </div>

          {libraryItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              <BuildingLibraryIcon className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No curated assets yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {libraryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0D0D0D] border border-[#222222] rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <FileTextIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <span className="shrink-0 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-md border border-green-500/20 font-semibold">
                        Ready
                      </span>
                    </div>
                    {/* Audio waveform placeholder SVG */}
                    <div className="flex items-center gap-0.5 h-5 mb-2">
                      {[3, 6, 4, 8, 5, 7, 4, 6, 3, 8, 5, 7, 4, 6, 3].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-emerald-500/30"
                          style={{ height: `${h * 3}px` }}
                        />
                      ))}
                    </div>
                    <button className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                      <PodcastIcon className="w-3.5 h-3.5" />
                      Play Lecture Podcast
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane — Accountability & Tracking Stack */}
        <div className="space-y-4">
          {/* Top Card — Assessment & Progress Tracker */}
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.12em]">
              Assessment & Progress Tracker
            </h3>
            <div className="bg-[#0D0D0D] border border-[#222222] rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">AI Architecture Exam</p>
                <p className="text-[11px] text-zinc-500 mt-1">⏱️ 45m Allocation</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  Pending
                </span>
                <span className="text-zinc-600 group-hover:text-emerald-400 transition-colors text-sm">&gt;</span>
              </div>
            </div>
          </div>

          {/* Bottom Card — Live Analytics */}
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.12em]">
              Live Analytics
            </h3>
            <div>
              <p className="text-[11px] text-zinc-500 mb-1">Time Engaged</p>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
                4.2 <span className="text-base font-normal text-zinc-500">Hours</span>
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] text-zinc-500">Flashcards Mastered</p>
                <span className="text-sm font-bold text-white">14/20</span>
              </div>
              <div className="h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpaceView: React.FC<SpaceViewProps> = ({ space }) => {
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  // Institutional spaces render the branded dashboard
  if (space.isInstitutional) {
    return <InstitutionalDashboard space={space} />;
  }

  // Standard "Let's learn" layout for personal spaces
  return (
    <div className="flex-1 h-full bg-[#0b0b0b] text-white p-8 lg:p-12 flex flex-col overflow-y-auto">
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4 group/header relative"
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <div className="relative">
          <div className={`absolute -top-8 left-0 flex items-center space-x-4 transition-opacity duration-200 ${isHeaderHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button className="flex items-center space-x-1.5 text-gray-400 hover:text-white text-xs font-medium transition-colors">
              <PlusSquareIcon className="w-3.5 h-3.5" />
              <span>Add icon</span>
            </button>
            <button className="flex items-center space-x-1.5 text-gray-400 hover:text-white text-xs font-medium transition-colors">
              <PlusSquareIcon className="w-3.5 h-3.5" />
              <span>Add cover</span>
            </button>
          </div>
          <h1 className="text-3xl font-medium mb-2 text-white font-sans">{space.title}</h1>
          <p className="text-gray-500 text-sm">No description</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors">
            <SparkleIcon className="w-4 h-4 text-purple-400" />
            Learn Tabs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors">
            <FileTextIcon className="w-4 h-4" />
            Create Exam
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#dadada] text-black rounded-lg text-sm font-bold hover:bg-white transition-colors">
            <PlusIcon className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full -mt-10">
        <div className="w-full max-w-4xl border border-gray-800 rounded-[32px] p-8 md:p-12 bg-[#0a0a0a]">
          <h2 className="text-4xl mb-12 font-medium text-center" style={{ fontFamily: "'Lora', serif" }}>Let's learn, Fatema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
            <ActionCard icon={<UploadIcon />} label="Upload" sub="File, audio, video" />
            <ActionCard icon={<LinkIcon />} label="Link" sub="YouTube, Website" />
            <ActionCard icon={<ClipboardIcon />} label="Paste" sub="Copied Text" />
            <ActionCard icon={<MicIcon />} label="Record" sub="Record Lecture" />
          </div>
          <div className="w-full relative group">
            <input
              type="text"
              placeholder="Learn anything"
              className="w-full bg-[#111] border border-gray-800 rounded-2xl py-4 px-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#222] rounded-full text-gray-400 hover:bg-[#333] hover:text-white transition-colors">
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceView;
