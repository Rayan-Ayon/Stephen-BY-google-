import React from 'react';

interface ExamModeSelectionScreenProps {
  module: 'listening' | 'writing';
  bookNumber?: number;
  testNumber?: number;
  sourceType?: 'cambridge' | 'mock_series';
  category?: 'academic' | 'general';
  onSelectExamMode: () => void;
  onBack?: () => void;
  onExit?: () => void;
}

export const ExamModeSelectionScreen: React.FC<ExamModeSelectionScreenProps> = ({
  module,
  bookNumber = 7,
  testNumber = 1,
  sourceType = 'cambridge',
  category = 'academic',
  onSelectExamMode,
  onBack,
  onExit,
}) => {
  const isListening = module === 'listening';

  const seriesName = sourceType === 'mock_series'
    ? `IELTSly Mock Series ${bookNumber}`
    : `Cambridge IELTS ${bookNumber}`;
  const testName = `Test ${String(testNumber).padStart(2, '0')}`;
  const categoryLabel = category === 'general' ? 'General Training' : 'Academic';

  const mainTitle = isListening
    ? `${seriesName} · Listening ${testName}`
    : `Choose your writing experience`;

  const breadcrumbTag = isListening ? '🎧 LISTENING' : '✏️ WRITING';

  return (
    <div className="min-h-full bg-[#FAFAFA] dark:bg-[#0A0B0E] text-gray-900 dark:text-zinc-100 font-sans p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack || onExit}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Instructions
          </button>
          <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
            {seriesName} · {testName} ({categoryLabel})
          </div>
        </div>

        {/* Main Title Section */}
        <div className="text-center max-w-xl mx-auto pt-2 pb-4">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
            {breadcrumbTag}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {mainTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-2 leading-relaxed">
            Choose the experience that matches today's goal. Both modes use the same questions, scoring, autosave, and results.
          </p>
        </div>

        {/* ── 2 Mode Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Card 1: Practice Mode (Disabled / Inactive) ── */}
          <div className="bg-white dark:bg-[#121319] border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 opacity-60 cursor-not-allowed relative flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg text-gray-500 dark:text-zinc-400">
                  📖
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                  LEARN WITH SUPPORT
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Practice Mode
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Use the familiar IELTSly workspace with transcripts and practice-friendly tools.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 dark:text-zinc-400 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{isListening ? 'Current Listening interface' : 'Current Writing interface'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{isListening ? 'Transcript and learning support' : 'Drafting and AI vocabulary prompts'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <span>Flexible self-paced workflow</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                disabled
                className="w-full bg-gray-900 dark:bg-zinc-800 text-white font-bold py-3 rounded-xl opacity-50 cursor-not-allowed text-center text-xs sm:text-sm"
              >
                Choose Practice Mode
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Reserved for future guided practice release
              </p>
            </div>
          </div>

          {/* ── Card 2: Exam Mode (Active / Clickable) ── */}
          <div className={`bg-white dark:bg-[#121319] border-2 ${
            isListening ? 'border-emerald-500 shadow-emerald-500/10' : 'border-blue-500 shadow-blue-500/10'
          } rounded-2xl p-6 shadow-md hover:shadow-lg transition-all relative flex flex-col justify-between`}>
            {/* Top Badge */}
            <div className={`absolute top-4 right-4 ${
              isListening ? 'bg-emerald-700' : 'bg-blue-700'
            } text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-xs`}>
              ✨ TEST-DAY FEEL
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${
                  isListening ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                } flex items-center justify-center text-lg`}>
                  🖥️
                </div>
              </div>

              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  isListening ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'
                }`}>
                  {isListening ? 'COMPUTER-DELIVERED SIMULATION' : 'EXAM SIMULATION'}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isListening ? 'Exam Mode' : 'Real CD IELTS Mode'}
                </h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {isListening
                    ? 'Train in a focused test-day interface with one-play audio and strict exam controls.'
                    : 'A strict, desktop-first simulation of the computer-delivered IELTS writing experience.'}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-700 dark:text-zinc-300 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                {isListening ? (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>One-play audio with volume control only</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>Official-style question dock & navigation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>Two-minute final review check</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Candidate check and official test instructions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Fixed countdown timer and automatic submission</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Review flags, question navigation and live word count</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={onSelectExamMode}
                className={`w-full ${
                  isListening
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                } text-white font-bold py-3.5 rounded-xl transition-all text-center text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2`}
              >
                <span>{isListening ? 'Choose Exam Mode' : 'Choose Real CD IELTS Mode'}</span>
                <span>→</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Recommended for realistic score benchmarking
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-between text-xs text-gray-400">
          <button
            onClick={onExit}
            className="hover:text-gray-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Cancel and return to hub
          </button>
          <span>Official Cambridge Standards</span>
        </div>

      </div>
    </div>
  );
};

export default ExamModeSelectionScreen;
