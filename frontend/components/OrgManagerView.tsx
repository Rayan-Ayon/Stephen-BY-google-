import React, { useState } from 'react';
import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClipboardCheckIcon,
  UploadIcon,
  FileTextIcon,
  PlayIcon,
  ExamPaperPenIcon,
  CheckCircleIcon,
  LogoutIcon,
} from './icons';

type OrgTab = 'learner_activity' | 'skills_benchmarking' | 'utilization' | 'content_curator';

interface SkillRow {
  domain: string;
  employeesEngaged: number;
  aiProficiencyIndex: number;
  status: 'cutting_edge' | 'competitive' | 'emerging' | 'lagging';
}

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'mp4' | 'docx';
  uploadedAt: string;
  size: string;
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

const mockFiles: UploadedFile[] = [
  { id: 'f1', name: 'Q1_Research_Report.pdf', type: 'pdf', uploadedAt: 'Mar 15, 2026', size: '4.2 MB' },
  { id: 'f2', name: 'Staff_Training_Module.mp4', type: 'mp4', uploadedAt: 'Mar 12, 2026', size: '128 MB' },
  { id: 'f3', name: 'Institutional_Policy.docx', type: 'docx', uploadedAt: 'Feb 28, 2026', size: '1.8 MB' },
];

const fileIcon: Record<UploadedFile['type'], React.ReactNode> = {
  pdf: <FileTextIcon className="w-8 h-8 text-[#FF5500]" />,
  mp4: <PlayIcon className="w-8 h-8 text-[#FF5500]" />,
  docx: <ExamPaperPenIcon className="w-8 h-8 text-[#FF5500]" />,
};

const OrgManagerView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<OrgTab>('skills_benchmarking');

  const tabs: { key: OrgTab; icon: React.ReactNode; label: string }[] = [
    { key: 'learner_activity', icon: <BuildingLibraryIcon className="w-4 h-4" />, label: 'Learner Activity' },
    { key: 'skills_benchmarking', icon: <ShieldCheckIcon className="w-4 h-4" />, label: 'Skills Benchmarking' },
    { key: 'utilization', icon: <UsersIcon className="w-4 h-4" />, label: 'Utilization' },
    { key: 'content_curator', icon: <ClipboardCheckIcon className="w-4 h-4" />, label: 'Content Curator' },
  ];

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

  const renderContentCuratorView = () => (
    <div className="space-y-6">
      <div className="bg-[#0A0A0A] border border-dashed border-[#333333] rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 flex items-center justify-center mx-auto mb-4">
          <UploadIcon className="w-6 h-6 text-[#FF5500]" />
        </div>
        <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "'Lora', serif" }}>
          Upload Corporate Knowledge Assets
        </h3>
        <p className="text-xs text-neutral-500 mb-5">PDF, MP4, DOCX — up to 500 MB per file</p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                           bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500]
                           hover:bg-[#FF5500]/20 transition-all duration-200">
          <UploadIcon className="w-4 h-4" />
          Choose Files
        </button>
      </div>

      <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-[0.12em]">
        Tenant Library ({mockFiles.length} files)
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {mockFiles.map((file) => (
          <div key={file.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 hover:border-[#333] transition-colors">
            <div className="flex items-center gap-3 mb-3">
              {fileIcon[file.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.1em] font-semibold mt-0.5">
                  {file.type.toUpperCase()} · {file.size}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-neutral-600">Uploaded {file.uploadedAt}</p>
          </div>
        ))}
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
