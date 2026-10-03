export type ReleaseVisual = 'speaking' | 'dispute' | 'reading';

export interface ReleaseNote {
  id: string;
  date: string;       // display date e.g. "Oct 3, 2026"
  longDate: string;   // e.g. "OCTOBER 3, 2026"
  version: string;
  title: string;
  shortTitle: string;
  description: string;
  highlights: string[];
  visual: ReleaseVisual;
}

export const RELEASES: ReleaseNote[] = [
  {
    id: 'rel-2-4-0',
    date: 'Oct 3, 2026',
    longDate: 'OCTOBER 3, 2026',
    version: '2.4.0',
    title: 'Full-Duplex AI Speaking Voice Integration',
    shortTitle: 'Full-Duplex AI Speaking Voice Integration',
    description:
      'Mohona, your AI speaking partner, now talks and listens at the same time over a realtime audio bridge. You can interrupt naturally, hear her reply with streaming voice, and watch both sides of the conversation appear as live transcript bubbles. We built it because turn-based recording never felt like a real IELTS examiner; students now rehearse in conditions that match test day, and coaching centers get cleaner transcripts to audit.',
    highlights: ['Streaming 16kHz PCM capture', 'Live user & examiner transcripts', 'Natural barge-in support'],
    visual: 'speaking',
  },
  {
    id: 'rel-2-3-0',
    date: 'Oct 1, 2026',
    longDate: 'OCTOBER 1, 2026',
    version: '2.3.0',
    title: 'Interactive Student Dispute & Audio Voice Note Review Suite',
    shortTitle: 'Teacher Re-evaluation & Voice Dispute Engine',
    description:
      'Students can now challenge an AI score with a written note, and faculty re-grade it in a dedicated full-screen workspace. Teachers can record a 15-second voice critique and pin text notes to exact sentences before releasing a verified band. It exists to close the trust gap between instant AI scoring and human judgement: students learn why a score changed, and coaching centers keep a clear audit trail of every override.',
    highlights: ['Full-canvas grading workspace', '15s teacher voice notes', 'Verified score notifications'],
    visual: 'dispute',
  },
  {
    id: 'rel-2-2-0',
    date: 'Sep 28, 2026',
    longDate: 'SEPTEMBER 28, 2026',
    version: '2.2.0',
    title: 'Cambridge 19 Reading Explanations Added',
    shortTitle: 'Cambridge 19 Reading Explanations Added',
    description:
      'Every Cambridge 19 Reading question now ships with a worked explanation that quotes the exact passage evidence behind the correct answer. Wrong answers are mapped to common traps such as paraphrase mismatches and Not Given confusion. Students stop guessing why they lost marks, and tutors can reuse the explanations directly in class instead of writing them from scratch.',
    highlights: ['Passage evidence highlighting', 'Trap-type tagging', 'All 4 Cambridge 19 tests'],
    visual: 'reading',
  },
];

export const LATEST_RELEASE_VERSION = RELEASES[0].version;
export const UPDATES_SEEN_KEY = 'stephen_updates_seen_version';
export const UPDATES_FOCUS_KEY = 'stephen_updates_focus_release';
