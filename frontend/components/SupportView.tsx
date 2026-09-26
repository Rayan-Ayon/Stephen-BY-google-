import React, { useState } from 'react';
import { toast } from 'sonner';

export interface SupportTicket {
  id: string; // e.g., "#54"
  subject: string; // e.g., "Problem while using Listening Full Test"
  productArea: 
    | 'Account / login'
    | 'Dashboard / navigation'
    | 'Mock tests / practice'
    | 'AI grading / feedback'
    | 'Speaking / audio'
    | 'Payments / subscription'
    | 'Performance / display'
    | 'Other';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  whatWentWrong: string;
  stepsToReproduce?: string;
  expectedBehaviour?: string;
  actualBehaviour?: string;
  attachments?: File[];
  status: 'active' | 'resolved' | 'closed';
  stageLabel: 'Awaiting staff' | 'Under review' | 'Resolved' | 'Closed';
  createdAt: string; // Timestamp e.g., "9/27/2026, 1:05:30 AM"
}

interface SupportViewProps {
  userEmail?: string;
  onNavigate?: (view: string) => void;
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: '#54',
    subject: 'Problem while using Listening Full Test',
    productArea: 'Mock tests / practice',
    impact: 'Medium',
    whatWentWrong: 'Problem while using Listening Full Test',
    status: 'active',
    stageLabel: 'Awaiting staff',
    createdAt: '9/27/2026, 1:05:30 AM',
  }
];

export const SupportView: React.FC<SupportViewProps> = ({ userEmail: _userEmail, onNavigate: _onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'closed'>('active');
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [productArea, setProductArea] = useState<SupportTicket['productArea']>('Other');
  const [impact, setImpact] = useState<SupportTicket['impact']>('Medium');
  const [whatWentWrong, setWhatWentWrong] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehaviour, setExpectedBehaviour] = useState('');
  const [actualBehaviour, setActualBehaviour] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered tickets
  const filteredTickets = tickets.filter(t => t.status === activeTab);

  const resetForm = () => {
    setSubject('');
    setProductArea('Other');
    setImpact('Medium');
    setWhatWentWrong('');
    setStepsToReproduce('');
    setExpectedBehaviour('');
    setActualBehaviour('');
    setAttachments([]);
    setIsDiagnosticsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      setAttachments(filesArray);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Find the highest existing ticket id number
      const existingNumbers = tickets.map(t => parseInt(t.id.replace('#', ''), 10)).filter(n => !isNaN(n));
      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 55;

      const now = new Date();
      const timestamp = now.toLocaleString();

      const newTicket: SupportTicket = {
        id: `#${nextNumber}`,
        subject: subject.trim(),
        productArea,
        impact,
        whatWentWrong,
        stepsToReproduce,
        expectedBehaviour,
        actualBehaviour,
        attachments,
        status: 'active',
        stageLabel: 'Awaiting staff',
        createdAt: timestamp,
      };

      setTickets(prev => [newTicket, ...prev]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      resetForm();
      setActiveTab('active');
      toast.success('Support report submitted successfully');
    }, 600);
  };

  return (
    <div className="min-h-full bg-[#FAFAFA] text-gray-900 font-sans pb-24">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto px-6 pt-5 pb-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="hover:text-gray-700 cursor-pointer">Overview</span>
          <span>&gt;</span>
          <span className="text-gray-800 font-medium">Support</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Quick guide</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Support tickets</h1>
            <p className="text-sm text-gray-500 mt-1">Report technical problems and follow every update privately.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl px-5 py-2.5 font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <span className="text-base leading-none">+</span>
            <span>Report a problem</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-red-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'resolved'
                ? 'bg-red-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'closed'
                ? 'bg-red-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Closed
          </button>
        </div>

        {/* Tickets List Area */}
        <div className="space-y-3">
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                className="rounded-2xl border border-gray-200/90 bg-white p-5 flex items-center justify-between shadow-sm hover:border-gray-300 transition-all"
              >
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    {ticket.id} · {ticket.subject}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Open · {ticket.createdAt}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                    {ticket.stageLabel}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-sm">
              <p className="text-gray-400 text-sm">No reports in this view</p>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          REPORT A TECHNICAL PROBLEM MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Report a technical problem</h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg text-lg leading-none cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Problem while using Listening Full Test"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              {/* Product Area & Impact 2-Column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Product area
                  </label>
                  <select
                    value={productArea}
                    onChange={e => setProductArea(e.target.value as SupportTicket['productArea'])}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all cursor-pointer"
                  >
                    <option value="Account / login">Account / login</option>
                    <option value="Dashboard / navigation">Dashboard / navigation</option>
                    <option value="Mock tests / practice">Mock tests / practice</option>
                    <option value="AI grading / feedback">AI grading / feedback</option>
                    <option value="Speaking / audio">Speaking / audio</option>
                    <option value="Payments / subscription">Payments / subscription</option>
                    <option value="Performance / display">Performance / display</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Impact
                  </label>
                  <select
                    value={impact}
                    onChange={e => setImpact(e.target.value as SupportTicket['impact'])}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* What went wrong? */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  What went wrong?
                </label>
                <textarea
                  rows={3}
                  value={whatWentWrong}
                  onChange={e => setWhatWentWrong(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-y"
                />
              </div>

              {/* Steps to reproduce */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Steps to reproduce
                </label>
                <textarea
                  rows={3}
                  value={stepsToReproduce}
                  onChange={e => setStepsToReproduce(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-y"
                />
              </div>

              {/* Expected vs Actual Behaviour (2-Column) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Expected behaviour
                  </label>
                  <textarea
                    rows={3}
                    value={expectedBehaviour}
                    onChange={e => setExpectedBehaviour(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Actual behaviour
                  </label>
                  <textarea
                    rows={3}
                    value={actualBehaviour}
                    onChange={e => setActualBehaviour(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-y"
                  />
                </div>
              </div>

              {/* Screenshots (optional) */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 mb-1.5">
                  <span>📎</span>
                  <span>Screenshots (optional)</span>
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 transition-colors">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-500 truncate">
                    {attachments.length > 0
                      ? `${attachments.length} file(s) selected`
                      : 'No file chosen'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Up to 5 JPEG, PNG, or WebP images, 5 MB each. Images are re-encoded to remove metadata.
                </p>
              </div>

              {/* Diagnostics Accordion */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => setIsDiagnosticsOpen(prev => !prev)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-medium text-gray-700 hover:bg-gray-100/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px]">{isDiagnosticsOpen ? '▼' : '►'}</span>
                    <span>Diagnostics that will be included</span>
                  </span>
                </button>
                {isDiagnosticsOpen && (
                  <div className="px-4 pb-3 pt-1 border-t border-gray-200/80 bg-white font-mono text-[11px] text-gray-600 space-y-1">
                    <p><span className="font-semibold text-gray-700">App URL:</span> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">User Agent:</span> {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Screen Resolution:</span> {typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Viewport:</span> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Timestamp:</span> {new Date().toISOString()}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-6 cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit report</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportView;
