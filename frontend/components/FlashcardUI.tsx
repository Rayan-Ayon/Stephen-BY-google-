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

export const demoCards: CardData[] = [
  {
    id: 'card-1',
    hint: 'Think about dimensionality reduction',
    question: 'What does PCA project data points onto?',
    answer: 'A single dimension that represents the most information',
    explanation:
      'Principal Component Analysis (PCA) finds the directions of maximum variance in high-dimensional data and projects it onto a new subspace with fewer dimensions.',
    source_chunk_id: 'chunk-101',
    source_timestamp: '03:25:29',
  },
  {
    id: 'card-2',
    hint: 'Neural network architecture',
    question: 'What is the primary purpose of an activation function?',
    answer: 'To introduce non-linearity into the output of a neuron',
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

// ── FlippableFlashcard ────────────────────────────────────────────────────────
function FlippableFlashcard({
  card,
  onShowSource,
}: {
  card: CardData;
  onShowSource: (id: string) => void;
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
            <p className="text-[19px] font-medium text-neutral-900 dark:text-neutral-100 text-center leading-relaxed select-none">
              {card.question}
            </p>
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
}: {
  cards: CardData[];
  onBack: () => void;
  onShowSource: (id: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState<'spaced' | 'fast'>('fast');

  if (!cards || cards.length === 0) {
    return <div className="p-4 text-sm text-neutral-500">No cards available</div>;
  }

  const currentCard = cards[currentIndex];
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < cards.length - 1;

  return (
    <div className="flex flex-col w-full gap-4 px-2 py-3">

      {/* ── ROW 1: Header ── */}
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
          <div className="inline-flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setReviewMode('spaced')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                reviewMode === 'spaced'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              Spaced Repetition
            </button>
            <button
              onClick={() => setReviewMode('fast')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
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
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
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

      {/* ── ROW 2: Card ── */}
      <div className="shrink-0">
        <FlippableFlashcard
          key={currentCard.id}
          card={currentCard}
          onShowSource={onShowSource}
        />
      </div>

      {/* ── ROW 3: Footer navigation ── */}
      <div className="flex items-center justify-between shrink-0 px-1">
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
  );
}
