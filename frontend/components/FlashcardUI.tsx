import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

// ── Data Types ──────────────────────────────────────────────────────────────
export interface CardData {
  id: string;
  hint?: string;
  question: string;
  answer: string;
  explanation?: string;
  source_chunk_id?: string;
  source_timestamp?: string;
}

const baseCards: CardData[] = [
  {
    id: 'card-1',
    hint: 'Principal Component Analysis (PCA)',
    question: 'What is the primary purpose of Principal Component Analysis (PCA)?',
    answer: 'Dimensionality reduction',
    explanation:
      'Principal Component Analysis (PCA) finds the directions of maximum variance in high-dimensional data and projects it onto a new subspace with fewer dimensions.',
    source_chunk_id: 'chunk-101',
    source_timestamp: '03:25:29',
  },
  {
    id: 'card-2',
    hint: 'Principal Component Analysis (PCA)',
    question: 'How does PCA determine the direction for dimensionality reduction?',
    answer: 'By finding the direction with the largest variance',
    explanation:
      'Without activation functions, a neural network would just be a linear regression model, no matter how many layers it has.',
    source_chunk_id: 'chunk-105',
    source_timestamp: '01:12:45',
  },
  {
    id: 'card-3',
    hint: 'Backpropagation training hurdle',
    question: 'What is the vanishing gradient problem?',
    answer:
      'When gradients become extremely small during backpropagation, preventing earlier layers from updating.',
    explanation:
      'This commonly occurs in deep networks that use sigmoid or tanh activation functions. Solutions include ReLU activations, batch normalisation, and residual connections.',
    source_chunk_id: 'chunk-204',
    source_timestamp: '02:40:15',
  },
];

export const demoCards: CardData[] = Array.from({ length: 42 }).map((_, i) => ({
  ...baseCards[i % baseCards.length],
  id: `card-${i + 1}`,
}));

// ── Inline SVG icons ─────────────────────────────────────────────────────────
const LightbulbIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" /><path d="M10 22h4" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#EAB308' : 'none'} stroke={filled ? '#EAB308' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PencilIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const SidebarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

const DotsVertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const SlidersHorizontalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="4" x2="14" y2="4"/>
    <line x1="10" y1="4" x2="3" y2="4"/>
    <line x1="21" y1="12" x2="12" y2="12"/>
    <line x1="8" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="20" x2="16" y2="20"/>
    <line x1="12" y1="20" x2="3" y2="20"/>
    <line x1="14" y1="2" x2="14" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="14"/>
    <line x1="16" y1="18" x2="16" y2="22"/>
  </svg>
);

const BoxXIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
  </svg>
);

const SproutIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20h10"/>
    <path d="M10 20c5.5-1.25 12-4.25 12-11 0-1-1-1-2 0-2 2-4 3-7 3s-3-2-5-2c0 6.5 0 8.5-2 10"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const FileDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="M12 18v-6"/>
    <path d="m9 15 3 3 3-3"/>
  </svg>
);

// ── SpacedRepetitionView ──────────────────────────────────────────────────────
function SpacedRepetitionView({ cards }: { cards: CardData[] }) {
  return (
    <div className="flex-1 overflow-y-auto px-1 pb-10 flex flex-col gap-10 mt-2 custom-scrollbar">
      {/* Cards for today */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-100">Cards for today</h2>
          <button className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
            <SlidersHorizontalIcon />
          </button>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-[28px] p-8 flex flex-col items-center">
          <div className="flex items-center justify-center gap-12 w-full max-w-sm mb-8">
            {/* Donut Chart */}
            <div className="w-28 h-28 rounded-full border-[12px] border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
              <span className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">0</span>
            </div>
            {/* Stats */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
                  <BoxXIcon className="text-neutral-400" />
                  <span className="text-[28px] font-bold">20</span>
                </div>
                <span className="text-[14px] font-medium text-neutral-400">Not Studied</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
                  <SproutIcon className="text-green-500" />
                  <span className="text-[28px] font-bold">0</span>
                </div>
                <span className="text-[14px] font-medium text-neutral-400">To review</span>
              </div>
            </div>
          </div>
          <button className="w-full max-w-md bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-semibold py-3.5 rounded-2xl hover:bg-black dark:hover:bg-neutral-200 transition-colors">
            Study Cards
          </button>
        </div>
      </section>

      {/* Deck progress */}
      <section>
        <h2 className="text-[20px] font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Deck progress</h2>
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-[24px] p-5 flex flex-col gap-4">
          <div className="flex gap-5">
            <div className="flex items-center gap-2 text-[15px]">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600 shrink-0"></span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{cards.length}</span>
              <span className="text-neutral-400 font-medium">Not Studied</span>
            </div>
            <div className="flex items-center gap-2 text-[15px]">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">0</span>
              <span className="text-neutral-400 font-medium">To review</span>
            </div>
          </div>
          <div className="w-full h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
             {/* Progress bar fill goes here if we had any */}
          </div>
        </div>
      </section>

      {/* Flashcards */}
      <section>
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-100">
            Flashcards <span className="text-neutral-400 text-[18px] font-medium">({cards.length})</span>
          </h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border-[1.5px] border-dashed border-neutral-300 dark:border-neutral-700 text-[14px] font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <PlusIcon /> Add Card
            </button>
            <button className="p-2 rounded-xl text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <FileDownIcon />
            </button>
          </div>
        </div>
        
        {/* Card List */}
        <div className="flex flex-col gap-4">
          {cards.map((card, i) => (
             <div key={card.id} className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col gap-6">
               {/* Card Header */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <span className="text-[15px] font-medium text-neutral-500">Card {i + 1}</span>
                   <button className="text-neutral-400 hover:text-yellow-500 transition-colors">
                     <StarIcon filled={false} />
                   </button>
                   <span className="px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
                     {card.hint || 'No context'}
                   </span>
                 </div>
                 <button className="text-neutral-400 hover:text-red-500 transition-colors p-1">
                   <TrashIcon />
                 </button>
               </div>
               
               {/* Term */}
               <div className="flex flex-col gap-2">
                 <label className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
                   Term <span className="text-red-500">*</span>
                 </label>
                 <textarea 
                   className="w-full resize-none rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] p-3.5 text-[15px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors min-h-[90px]"
                   defaultValue={card.question}
                 />
               </div>

               {/* Definition */}
               <div className="flex flex-col gap-2">
                 <label className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
                   Definition <span className="text-red-500">*</span>
                 </label>
                 <textarea 
                   className="w-full resize-none rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] p-3.5 text-[15px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors min-h-[90px]"
                   defaultValue={card.answer}
                 />
               </div>

               <div className="mt-1">
                 <button className="text-[14px] font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                   Show more options
                 </button>
               </div>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}


// ── FlippableFlashcard ────────────────────────────────────────────────────────
function FlippableFlashcard({
  card,
  onShowSource,
  isGenerating,
}: {
  card: CardData;
  onShowSource: (id: string) => void;
  isGenerating?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isShowingExplanation, setIsShowingExplanation] = useState(false);

  // Star toggle — stop propagation so it doesn't flip the card
  const stopAndToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred((s) => !s);
  };

  // Clicking anywhere on the card flips it; when flipping back to front,
  // reset the explanation view after the animation completes.
  const handleCardClick = () => {
    setIsFlipped((f) => {
      const nextFlipped = !f;
      if (!nextFlipped) {
        setTimeout(() => setIsShowingExplanation(false), 300);
      }
      return nextFlipped;
    });
  };

  // Toggle explanation without flipping
  const toggleExplanation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowingExplanation((prev) => !prev);
  };

  const faceClass =
    'absolute inset-0 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1c] p-5 flex flex-col overflow-hidden';

  return (
    <div style={{ perspective: '1200px' }} className="w-full" onClick={handleCardClick}>
      <div
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.4,0.2,0.2,1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          height: '340px',
          cursor: 'pointer',
        }}
      >
        {/* ── FRONT: Question ── */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className={faceClass}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="flex items-center gap-1.5 text-[13px] text-neutral-400 dark:text-neutral-500 font-medium select-none">
              <LightbulbIcon />
              {card.hint ? 'Hint' : ''}
            </span>
            <span
              className="flex items-center gap-3 text-neutral-400 dark:text-neutral-500"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={stopAndToggleStar} className="hover:text-yellow-500 transition-colors">
                <StarIcon filled={isStarred} />
              </button>
              <button className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                <PencilIcon />
              </button>
            </span>
          </div>

          {/* Centered question */}
          <div className="flex-1 flex items-center justify-center px-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                <p className="text-[14px] text-neutral-500 dark:text-neutral-400">Generating flashcards...</p>
              </div>
            ) : (
              <p className="text-[19px] font-medium text-neutral-900 dark:text-neutral-100 text-center leading-relaxed select-none">
                {card.question}
              </p>
            )}
          </div>
        </div>

        {/* ── BACK: Answer / Explanation ── */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className={faceClass}
        >
          {/* Top bar */}
          <div className="flex items-center justify-end mb-2 shrink-0">
            <span
              className="flex items-center gap-3 text-neutral-400 dark:text-neutral-500"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={stopAndToggleStar} className="hover:text-yellow-500 transition-colors">
                <StarIcon filled={isStarred} />
              </button>
              <button className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                <PencilIcon />
              </button>
            </span>
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
            {/* Answer or Explanation text */}
            <p className="text-[18px] font-medium text-neutral-900 dark:text-neutral-100 text-center leading-relaxed select-none">
              {isShowingExplanation ? card.explanation : card.answer}
            </p>

            {/* Source pill — only visible on the answer side */}
            {!isShowingExplanation && card.source_timestamp && card.source_chunk_id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowSource(card.source_chunk_id!);
                }}
                className="px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[13px] font-semibold transition-colors"
              >
                {card.source_timestamp}
              </button>
            )}

            {/* Show / Hide Explanation toggle */}
            {card.explanation && (
              <button
                onClick={toggleExplanation}
                className="text-[14px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {isShowingExplanation ? 'Hide Explanation' : 'Show Explanation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FlashcardReviewController ─────────────────────────────────────────────────
export function FlashcardReviewController({
  cards,
  onBack,
  onShowSource,
  isGenerating,
}: {
  cards: CardData[];
  onBack: () => void;
  onShowSource: (id: string) => void;
  isGenerating?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Changed default to 'fast' as requested
  const [reviewMode, setReviewMode] = useState<'spaced' | 'fast'>('fast');

  // Don't show "no cards" - we always have demo cards as fallback
  if (!cards || cards.length === 0) {
    return <div className="p-4 text-sm text-neutral-500">No cards available</div>;
  }

  const currentCard = cards[currentIndex];
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < cards.length - 1;

  return (
    <div className="flex flex-col w-full h-full gap-4 px-2 py-3" style={{ minHeight: 0 }}>

      {/* ── ROW 1: Shared Header ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 pl-2 pr-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[13px] font-medium text-neutral-800 dark:text-neutral-200 transition-colors shrink-0"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Mode toggle – centred */}
        <div className="flex-1 flex justify-center">
          <div className="inline-flex bg-neutral-100 dark:bg-neutral-800/80 rounded-xl p-1 gap-1">
            <button
              onClick={() => setReviewMode('spaced')}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                reviewMode === 'spaced'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              Spaced Repetition
            </button>
            <button
              onClick={() => setReviewMode('fast')}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                reviewMode === 'fast'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              Fast Review
            </button>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            Shortcuts
          </div>
          <button className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
            <SidebarIcon />
          </button>
          <button className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
            <DotsVertIcon />
          </button>
        </div>
      </div>

      {/* ── Content View Switcher ── */}
      {reviewMode === 'fast' ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Card */}
          <div className="shrink-0 mt-2">
            <FlippableFlashcard
              key={currentCard.id}
              card={currentCard}
              onShowSource={onShowSource}
              isGenerating={isGenerating}
            />
          </div>
          {/* Footer nav */}
          <div className="flex items-center justify-between shrink-0 px-1 mt-auto pt-4">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
              {currentIndex + 1} / {cards.length}
            </span>
            <button
              onClick={() => setCurrentIndex((i) => Math.min(cards.length - 1, i + 1))}
              disabled={!canNext}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ── Spaced Repetition: scrollable container ── */
        <div className="flex-1 min-h-0 overflow-y-auto">
          <SpacedRepetitionView cards={cards} />
        </div>
      )}
    </div>
  );
}
