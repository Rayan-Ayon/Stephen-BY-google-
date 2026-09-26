import React from 'react';

export type ModuleType = 'listening' | 'reading' | 'writing' | 'speaking';

interface ExamInstructionsScreenProps {
  module: ModuleType;
  bookNumber?: number;
  testNumber?: number;
  sourceType?: 'cambridge' | 'mock_series';
  category?: 'academic' | 'general';
  onStart: () => void;
  onExit?: () => void;
}

const INSTRUCTION_DATA: Record<ModuleType, {
  tag: string;
  title: string;
  subtitle: string;
  steps: string[];
  expectations: { title: string; content: string }[];
  callout: { title: string; text: string; icon: string; style: string };
  badgeColor: string;
}> = {
  listening: {
    tag: 'BEFORE YOU BEGIN',
    title: 'Listening Test Instructions',
    subtitle: '4 audio sections, 40 questions — listen closely, you only get one play.',
    steps: [
      'Wait for the audio to begin — each section plays once',
      'Read the questions before each section so you know what to listen for',
      'Write your answers directly as you listen — use abbreviations if needed',
      'Answers are accepted in any case (UPPER or lower)',
      'Write NO MORE THAN THREE WORDS AND/OR A NUMBER unless stated',
      'Spelling must be correct — incorrect spelling will not receive marks',
      'Review your answers at the end before submitting',
      'Click the Submit button once all answers are filled in',
    ],
    expectations: [
      {
        title: 'Section 1 & 2 (Everyday Social Contexts)',
        content: 'Section 1 is a two-person conversation; Section 2 is a monologue. Generally easier — tests basic information comprehension and detail retrieval.'
      },
      {
        title: 'Section 3 & 4 (Educational & Training Contexts)',
        content: 'Section 3 is a multi-person academic discussion; Section 4 is a university lecture. Requires following complex arguments and abstract ideas.'
      }
    ],
    callout: {
      title: 'Audio & Equipment',
      text: 'Ensure headphones are connected and volume is set before starting. Each track plays once and cannot be replayed during the test.',
      icon: '🎧',
      style: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200'
    },
    badgeColor: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
  },
  writing: {
    tag: 'BEFORE YOU BEGIN',
    title: 'Writing Test Instructions',
    subtitle: 'Understand the tasks and manage your 60 minutes wisely.',
    steps: [
      'Read both Task 1 and Task 2 carefully before starting',
      'Plan your response briefly — a few key points is enough',
      'Write at least 150 words for Task 1 and at least 250 words for Task 2',
      'Follow the task instructions exactly — describe what is asked',
      'Task 2 carries double the marks — spend ~40 minutes on it',
      'Write in full sentences. Do NOT use bullet points or note form',
      'Aim for coherence, cohesion, and a range of vocabulary',
      'Review both tasks before clicking Submit',
    ],
    expectations: [
      {
        title: 'Writing Task 1 (Report / Summary / Letter)',
        content: 'Describe, summarise, or explain visual information — a graph, table, chart, or diagram — in at least 150 words. A formal or semi-formal academic style is expected.'
      },
      {
        title: 'Writing Task 2 (Discursive Essay)',
        content: 'Write an essay responding to a point of view, argument, or problem in at least 250 words. Requires a well-structured, coherent argument with supporting examples.'
      }
    ],
    callout: {
      title: 'Time Management & Instant AI Evaluation',
      text: 'You have 60 minutes total. Spend ~20 minutes on Task 1 and ~40 minutes on Task 2, reflecting mark weighting. AI grades your response instantly upon submission.',
      icon: '⏱️',
      style: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200'
    },
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
  },
  reading: {
    tag: 'BEFORE YOU BEGIN',
    title: 'Reading Test Instructions',
    subtitle: '3 passages, 40 questions, 60 minutes — scan smart and score high.',
    steps: [
      'Manage your time strictly — allocate ~20 minutes per passage',
      'Skim each passage quickly (2–3 minutes) before tackling questions',
      'Underline key terms and look for synonyms in the text',
      'Follow word count instructions carefully (e.g. NO MORE THAN TWO WORDS)',
      'Check True / False / Not Given vs Yes / No / Not Given distinctions',
      'Do not leave any question unanswered; there is no negative marking',
      'Verify spelling directly copied from the text',
      'Review your answer sheet before clicking Submit',
    ],
    expectations: [
      {
        title: 'Passage 1 & 2 (Factual & Analytical Articles)',
        content: 'Passage 1 features descriptive text of general interest. Passage 2 contains detailed factual and analytical discussion from educational or work topics.'
      },
      {
        title: 'Passage 3 (Complex Academic Discourse)',
        content: 'Passage 3 is a comprehensive academic research text with intricate arguments. Remember to pace yourself: Passage 3 is usually the most challenging.'
      }
    ],
    callout: {
      title: 'Navigation & Timing Advice',
      text: 'There is no extra transfer time for Reading. Enter answers directly into the question fields as you work through each passage.',
      icon: '📖',
      style: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200'
    },
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
  },
  speaking: {
    tag: 'BEFORE YOU BEGIN',
    title: 'Speaking Test Instructions',
    subtitle: '3 parts, ~15 minutes — speak naturally, fluently, and with confidence.',
    steps: [
      'Test your headset and microphone before entering the speaking room',
      'Part 1: Answer personal and everyday questions in 2–3 full sentences',
      'Part 2: Use your 1-minute prep time to take notes for the cue card',
      'Part 2: Speak for 1 to 2 minutes continuously without pausing',
      'Part 3: Elaborate on abstract discussion topics with reasons and examples',
      'Speak clearly into the microphone at a natural conversational pace',
      'Maintain fluency even if you make minor grammar slips',
      'Listen carefully to each examiner prompt before answering',
    ],
    expectations: [
      {
        title: 'Part 1: Introduction & Interview (4–5 min)',
        content: 'Familiar everyday topics like your hometown, studies, work, hobbies, and leisure activities.'
      },
      {
        title: 'Part 2 & 3: Long Turn & Deep Discussion (9–10 min)',
        content: 'Part 2 cue card presentation with 1 min prep, followed by Part 3 abstract two-way discussion extending the topic.'
      }
    ],
    callout: {
      title: 'Speech Recording & AI Evaluation',
      text: 'Your voice will be analyzed across Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation.',
      icon: '🎙️',
      style: 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-200'
    },
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400'
  }
};

export const ExamInstructionsScreen: React.FC<ExamInstructionsScreenProps> = ({
  module,
  bookNumber,
  testNumber,
  sourceType,
  category,
  onStart,
  onExit,
}) => {
  const data = INSTRUCTION_DATA[module];

  const seriesLabel = sourceType === 'mock_series'
    ? `IELTSly Mock Series ${bookNumber || 1}`
    : `Cambridge IELTS ${bookNumber || 7}`;
  const testLabel = `Test ${String(testNumber || 1).padStart(2, '0')}`;
  const categoryLabel = category === 'general' ? 'General Training' : 'Academic';

  return (
    <div className="min-h-full bg-[#FAFAFA] dark:bg-[#0A0B0E] text-gray-900 dark:text-zinc-100 font-sans p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Hub
          </button>
          <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
            {seriesLabel} · {testLabel} ({categoryLabel})
          </div>
        </div>

        {/* ── Banner Header Card ── */}
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 tracking-wider uppercase block mb-1">
              {data.tag}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {data.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">
              {data.subtitle}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 border border-amber-300/60 dark:border-amber-700/50 flex items-center justify-center text-xl shrink-0 self-start sm:self-auto">
            📋
          </div>
        </div>

        {/* ── 2-Column Content Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Step-by-Step (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-[#121319] border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>Your test, step by step</span>
            </h2>
            <div className="space-y-3">
              {data.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-normal">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: What to Expect & Callouts (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Expectations Card */}
            <div className="bg-white dark:bg-[#121319] border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                What to expect
              </h2>
              {data.expectations.map((exp, i) => (
                <div key={i} className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-200">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                    {exp.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Equipment / Strategy Callout Card */}
            <div className={`rounded-2xl border p-5 ${data.callout.style} shadow-xs space-y-1.5`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{data.callout.icon}</span>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {data.callout.title}
                </h4>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {data.callout.text}
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom Action Bar ── */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={onExit}
            className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel & Exit
          </button>
          <button
            onClick={onStart}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-7 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer text-sm"
          >
            <span>▶</span>
            <span>Start the test</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExamInstructionsScreen;
