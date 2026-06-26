import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClipboardCheckIcon,
  UploadIcon,
  FileTextIcon,
  CheckCircleIcon,
  LogoutIcon,
  FlashcardIcon,
  PodcastIcon,
  TrashIcon,
  BookOpenIcon,
} from './icons';
import {
  getLibraryItems,
  addLibraryItem,
  updateLibraryItemStatus,
  removeLibraryItem,
  LibraryItem,
} from '../utils/mockDb';

type OrgTab = 'learner_activity' | 'skills_benchmarking' | 'utilization' | 'content_curator';

interface SkillRow {
  domain: string;
  employeesEngaged: number;
  aiProficiencyIndex: number;
  status: 'cutting_edge' | 'competitive' | 'emerging' | 'lagging';
}

const statusConfig: Record<SkillRow['status'], { label: string; classes: string }> = {
  cutting_edge: {
    label: 'Cutting-edge',
    classes: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  competitive: {
    label: 'Competitive',
    classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  emerging: {
    label: 'Emerging',
    classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  lagging: {
    label: 'Lagging',
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
};

const skillData: SkillRow[] = [
  { domain: 'Machine Learning & AI', employeesEngaged: 142, aiProficiencyIndex: 87, status: 'cutting_edge' },
  { domain: 'Data Engineering', employeesEngaged: 98, aiProficiencyIndex: 64, status: 'competitive' },
  { domain: 'Cloud Infrastructure', employeesEngaged: 73, aiProficiencyIndex: 42, status: 'emerging' },
  { domain: 'Legacy Systems', employeesEngaged: 31, aiProficiencyIndex: 18, status: 'lagging' },
];

const OrgManagerView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<OrgTab>('skills_benchmarking');
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [currentStepLabel, setCurrentStepLabel] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tabs: { key: OrgTab; icon: React.ReactNode; label: string }[] = [
    { key: 'learner_activity', icon: <BuildingLibraryIcon className="w-4 h-4" />, label: 'Learner Activity' },
    { key: 'skills_benchmarking', icon: <ShieldCheckIcon className="w-4 h-4" />, label: 'Skills Benchmarking' },
    { key: 'utilization', icon: <UsersIcon className="w-4 h-4" />, label: 'Utilization' },
    { key: 'content_curator', icon: <ClipboardCheckIcon className="w-4 h-4" />, label: 'Content Curator' },
  ];

  // Initial load from localStorage
  useEffect(() => {
    setLibraryItems(getLibraryItems());
  }, []);

  // Orchestrated multi-stage pipeline when processingId changes
  useEffect(() => {
    if (!processingId) return;
    const id = processingId;

    const step1 = setTimeout(() => {
      setCurrentStepLabel('[1/3] 📄 Parsing document text structure...');
      updateLibraryItemStatus(id, 'parsing', 'processing');
      setLibraryItems(getLibraryItems());
    }, 0);

    const step2 = setTimeout(() => {
      setCurrentStepLabel('[2/3] 🤖 Generating multi-agent vector embeddings...');
      updateLibraryItemStatus(id, 'vectorizing', 'processing');
      setLibraryItems(getLibraryItems());
    }, 2000);

    const step3 = setTimeout(() => {
      setCurrentStepLabel('[3/3] 🎙️ Synthesizing dynamic audio podcast...');
      updateLibraryItemStatus(id, 'synthesizing', 'processing');
      setLibraryItems(getLibraryItems());
    }, 4500);

    const complete = setTimeout(() => {
      const flashcardCount = Math.floor(Math.random() * 8) + 8;
      const items = getLibraryItems();
      const idx = items.findIndex(i => i.id === id);
      if (idx !== -1) {
        items[idx].currentStep = 'complete';
        items[idx].status = 'ready';
        items[idx].flashcardCount = flashcardCount;
        localStorage.setItem('stephen_mock_library', JSON.stringify(items));
      }
      setLibraryItems(getLibraryItems());
      setProcessingId(null);
      setCurrentStepLabel('');
    }, 6500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(complete);
    };
  }, [processingId]);

  const renderMetrics = () => (
    <div className="grid grid-cols-3 gap-5">
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-3">
          Total Enrolled Staff/Students
        </p>
        <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
          142<span className="text-base font-normal text-neutral-500"> / 500</span>
        </p>
        <p className="text-[11px] text-neutral-500 mt-1.5 mb-2">Seats Occupied</p>
        <div className="h-1.5 rounded-full bg-[#1A1A1A] overflow-hidden">
          <div className="h-full rounded-full bg-[#FF5500]" style={{ width: '28.4%' }} />
        </div>
      </div>
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-2">
          Average AI Study Velocity
        </p>
        <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
          14.6 <span className="text-base font-normal text-neutral-500">hrs / week</span>
        </p>
        <p className="text-sm text-[#FF5500] mt-1.5 font-medium">+8.2% vs last month</p>
      </div>
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-2">
          AI Knowledge Spaces Generated
        </p>
        <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
          38 <span className="text-base font-normal text-neutral-500">Active Safe Hubs</span>
        </p>
        <p className="text-sm text-[#FF5500] mt-1.5 font-medium">+12 new this quarter</p>
      </div>
    </div>
  );

  const renderSkillsGraph = () => (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-neutral-300 mb-5" style={{ fontFamily: "'Lora', serif" }}>
        Division Competency Overview
      </h3>
      <div className="space-y-4">
        {skillData.map((s) => (
          <div key={s.domain}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-neutral-300">{s.domain}</span>
              <span className="text-[#FF5500] font-bold" style={{ fontFamily: "'Lora', serif" }}>
                {s.aiProficiencyIndex}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-[#1A1A1A] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#FF5500] transition-all duration-700"
                style={{ width: `${s.aiProficiencyIndex}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillsTable = () => (
    <table className="w-full">
      <thead>
        <tr className="text-left text-[10px] uppercase tracking-[0.15em] text-neutral-500 border-b border-[#1A1A1A]">
          <th className="px-6 py-4 font-semibold">Domain / Tech</th>
          <th className="px-6 py-4 font-semibold">Total Employees Engaged</th>
          <th className="px-6 py-4 font-semibold">AI Proficiency Index</th>
          <th className="px-6 py-4 font-semibold">Status</th>
        </tr>
      </thead>
      <tbody>
        {skillData.map((row) => {
          const cfg = statusConfig[row.status];
          return (
            <tr key={row.domain} className="border-b border-[#1A1A1A] last:border-b-0">
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-white">{row.domain}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-neutral-300">{row.employeesEngaged}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
                  {row.aiProficiencyIndex}
                </span>
                <span className="text-xs text-neutral-500 ml-1">/ 100</span>
                <div className="h-1 rounded-full bg-[#1A1A1A] mt-1.5 max-w-[120px]">
                  <div
                    className="h-full rounded-full bg-[#FF5500]"
                    style={{ width: `${row.aiProficiencyIndex}%` }}
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.classes}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    row.status === 'cutting_edge' ? 'bg-green-400' :
                    row.status === 'competitive' ? 'bg-yellow-400' :
                    row.status === 'emerging' ? 'bg-orange-400' : 'bg-red-400'
                  }`} />
                  {cfg.label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderCoreView = () => (
    <div className="space-y-8">
      {renderMetrics()}

      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1A1A1A]">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
            Skills Benchmarking
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            High-level overview of your organization's skill profile relative to active AI-first curriculums.
          </p>
        </div>
        {renderSkillsTable()}
        <div className="px-6 py-5 border-t border-[#1A1A1A]">
          {renderSkillsGraph()}
        </div>
      </div>
    </div>
  );

  const renderUtilizationView = () => (
    <div className="space-y-6">
      <p className="text-sm text-neutral-400">Seat allocation and resource utilization across departments.</p>
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
        <div className="space-y-5">
          {[
            { dept: 'Computer Science', allocated: 120, used: 98 },
            { dept: 'Electrical Engineering', allocated: 80, used: 62 },
            { dept: 'Mathematics', allocated: 60, used: 45 },
            { dept: 'Physics', allocated: 40, used: 28 },
          ].map((d) => (
            <div key={d.dept}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-neutral-300">{d.dept}</span>
                <span className="text-neutral-500">{d.used} / {d.allocated} seats</span>
              </div>
              <div className="h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FF5500] transition-all"
                  style={{ width: `${(d.used / d.allocated) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelected = (file: File) => {
    const newItem: LibraryItem = {
      id: `lib_${Date.now()}`,
      title: file.name,
      fileSize: formatFileSize(file.size),
      status: 'processing',
      currentStep: 'idle',
      flashcardCount: 0,
      timestamp: new Date().toISOString(),
    };
    addLibraryItem(newItem);
    setLibraryItems(getLibraryItems());
    setProcessingId(newItem.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileSelected(files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
      e.target.value = '';
    }
  };

  const renderContentCuratorView = () => (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.docx,.mp4,.mp3"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Drag-and-Drop Upload Zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        className={`bg-[#0A0A0A] border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? 'border-[#FF5500] bg-[#FF5500]/5'
            : 'border-[#333333] hover:border-[#FF5500]/50'
        }`}
      >
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          className="w-14 h-14 rounded-xl bg-[#FF5500]/10 flex items-center justify-center mx-auto mb-4"
        >
          <UploadIcon className="w-7 h-7 text-[#FF5500]" />
        </motion.div>
        <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "'Lora', serif" }}>
          Upload Corporate Knowledge Assets
        </h3>
        <p className="text-xs text-neutral-500 mb-2">PDF, TXT, DOCX, MP4 — up to 500 MB per file</p>
        <p className="text-[10px] text-neutral-600 mb-5">Drag & drop or click to browse</p>
        <button
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                     bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500]
                     hover:bg-[#FF5500]/20 transition-all duration-200"
        >
          <UploadIcon className="w-4 h-4" />
          Choose Files
        </button>
      </motion.div>

      {/* Processing Status Card */}
      {processingId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            <span className="text-sm font-medium text-white">Processing...</span>
          </div>
          <p className="text-xs text-neutral-400 font-mono pl-5">{currentStepLabel}</p>
          <div className="h-1.5 rounded-full bg-[#1A1A1A] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#FF5500]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6.5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}

      {/* Knowledge Base Asset Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-[0.12em]">
            Knowledge Base ({libraryItems.length} assets)
          </h3>
        </div>

        {libraryItems.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 text-center">
            <BookOpenIcon className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No knowledge assets yet.</p>
            <p className="text-xs text-neutral-600 mt-1">Upload your first document above.</p>
          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.15em] text-neutral-500 border-b border-[#1A1A1A]">
                  <th className="px-5 py-4 font-semibold w-[40%]">Asset Name</th>
                  <th className="px-5 py-4 font-semibold w-[12%]">File Size</th>
                  <th className="px-5 py-4 font-semibold w-[18%]">Status</th>
                  <th className="px-5 py-4 font-semibold w-[15%]">Flashcards</th>
                  <th className="px-5 py-4 font-semibold w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {libraryItems.map((item) => {
                  const isProcessing = item.status === 'processing';
                  return (
                    <tr key={item.id} className="border-b border-[#1A1A1A] last:border-b-0 group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 flex items-center justify-center shrink-0">
                            <FileTextIcon className="w-4 h-4 text-[#FF5500]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-[260px]">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-neutral-600 mt-0.5">
                              {new Date(item.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-400">{item.fileSize}</span>
                      </td>
                      <td className="px-5 py-4">
                        {isProcessing ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Processing...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                            <CheckCircleIcon className="w-3 h-3" />
                            Ready
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <FlashcardIcon className="w-4 h-4 text-neutral-500" />
                          <span className={`text-sm font-bold ${isProcessing ? 'text-neutral-600' : 'text-white'}`}>
                            {isProcessing ? '—' : item.flashcardCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            disabled={isProcessing}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                              isProcessing
                                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-50'
                                : 'bg-[#FF5500]/10 text-[#FF5500] hover:bg-[#FF5500]/20'
                            }`}
                          >
                            <PodcastIcon className="w-3.5 h-3.5" />
                            Play Podcast
                          </button>
                          <button
                            disabled={isProcessing}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                              isProcessing
                                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-50'
                                : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                            }`}
                          >
                            <FlashcardIcon className="w-3.5 h-3.5" />
                            Flashcards
                          </button>
                          <button
                            onClick={() => {
                              removeLibraryItem(item.id);
                              setLibraryItems(getLibraryItems());
                            }}
                            className="ml-1 p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#000000] text-white">
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col flex-shrink-0">
        <div className="px-6 py-7 border-b border-[#1A1A1A]">
          <h2 className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "'Lora', serif" }}>
            Stephen
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF5500] font-semibold mt-1.5">
            for Enterprise
          </p>
        </div>

        <div className="px-4 py-3 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_6px_rgba(255,85,0,0.5)]" />
            <span className="text-xs text-neutral-400 font-medium">Dhaka University</span>
          </div>
          <p className="text-[10px] text-neutral-600 mt-0.5 ml-4">Active Instance</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20'
                  : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1A1A1A]">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-2 text-left text-sm text-neutral-500 hover:text-white transition-colors duration-200 px-1 py-1"
          >
            <LogoutIcon className="w-4 h-4" />
            Exit Console
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
              {activeTab === 'learner_activity' && 'Learner Activity'}
              {activeTab === 'skills_benchmarking' && 'Skills Benchmarking'}
              {activeTab === 'utilization' && 'Seat Utilization'}
              {activeTab === 'content_curator' && 'Content Curator'}
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              {activeTab === 'learner_activity' && 'Engagement hour analytics across your institution.'}
              {activeTab === 'skills_benchmarking' && 'Institutional skill profile relative to AI-first curriculums.'}
              {activeTab === 'utilization' && 'Seat allocation checks and resource distribution.'}
              {activeTab === 'content_curator' && 'Manage custom private uploaded PDFs, videos, and resources.'}
            </p>
          </div>

          {activeTab === 'learner_activity' && renderCoreView()}
          {activeTab === 'skills_benchmarking' && renderCoreView()}
          {activeTab === 'utilization' && renderUtilizationView()}
          {activeTab === 'content_curator' && renderContentCuratorView()}
        </div>
      </main>
    </div>
  );
};

export default OrgManagerView;
