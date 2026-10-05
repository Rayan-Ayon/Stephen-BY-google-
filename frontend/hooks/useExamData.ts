import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getSnippetQuestionsForExam, getSnippetAnswersKey } from '@/components/enterprise/ielts/data/cambridgeQuestionSnippets';
import { CAMBRIDGE_7_TEST_1_PASSAGES, C7_T1_EXPLANATIONS } from '@/components/enterprise/ielts/results/cambridge7Test1Explanations';
import { rawToBand } from '@/components/enterprise/ielts/ieltsShared';

export interface ReadingPassageItem {
  passage_number: number;
  title: string;
  passage_text: string;
  difficulty?: string;
  sections?: Array<{ sectionLabel: string; content: string }>;
}

export interface ReadingQuestionItem {
  question_number: number;
  passage_number: number;
  question_type: string;
  prompt_text: string;
  instruction?: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  explanation_text?: string;
  candidate_answer?: string;
  is_correct?: boolean;
  evidence_quote?: string;
  evidence_section?: string;
  why_others_wrong?: Array<{ option: string; reason: string }>;
  common_traps?: Array<{ trapWord: string; explanation: string }>;
  strategy_tip?: string;
  completion_guidance?: { wordLimit: string; grammarNote: string };
}

export interface UseReadingExamDataOptions {
  bookNumber?: number;
  testNumber?: number;
  attemptId?: string | number;
  initialAnswers?: Record<string | number, string>;
  testTitle?: string;
}

export interface UseReadingExamDataResult {
  loading: boolean;
  error: string | null;
  passages: ReadingPassageItem[];
  questions: ReadingQuestionItem[];
  candidateAnswers: Record<string, string>;
  correctCount: number;
  bandScore: number;
  attemptId: string | null;
  refetch: () => Promise<void>;
}

export function parseSectionsFromText(text: string): Array<{ sectionLabel: string; content: string }> {
  if (!text) return [{ sectionLabel: 'A', content: '' }];

  const cleaned = text.replace(/<style[^>]*>.*?<\/style>/gis, '').replace(/<script[^>]*>.*?<\/script>/gis, '');
  const pTagRegex = /<(?:p|div)[^>]*>(.*?)<\/(?:p|div)>/gis;
  const blocks: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = pTagRegex.exec(cleaned)) !== null) {
    const rawInner = m[1].trim();
    if (rawInner) blocks.push(rawInner);
  }

  const rawList = blocks.length > 0 ? blocks : cleaned.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  const singleLetterRegex = /^\s*(?:<strong>|<b>)?\s*(?:(?:Section|Paragraph)\s+)?([A-I])\s*(?:<\/strong>|<\/b>)?\s*$/i;
  const leadingLetterRegex = /^\s*(?:<strong>|<b>)?\s*(?:(?:Section|Paragraph)\s+)?([A-I])\s*(?:[:.]|<\/strong>|<\/b>|<br\s*\/?>)\s*(.*)$/is;

  // First pass: check if any block has explicit section markers
  let hasExplicitHeaders = false;
  for (const item of rawList) {
    const stripped = item.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
    if (singleLetterRegex.test(stripped) || leadingLetterRegex.test(item)) {
      hasExplicitHeaders = true;
      break;
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const sections: Array<{ sectionLabel: string; content: string }> = [];

  if (hasExplicitHeaders) {
    let currentLabel = '';
    let currentContent: string[] = [];

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      const stripped = item.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
      if (!stripped) continue;

      const singleMatch = stripped.match(singleLetterRegex);
      if (singleMatch) {
        if (currentLabel && currentContent.length > 0) {
          sections.push({ sectionLabel: currentLabel, content: currentContent.join('\n\n') });
        }
        currentLabel = singleMatch[1].toUpperCase();
        currentContent = [];
        continue;
      }

      const leadingMatch = item.match(leadingLetterRegex);
      if (leadingMatch) {
        if (currentLabel && currentContent.length > 0) {
          sections.push({ sectionLabel: currentLabel, content: currentContent.join('\n\n') });
        }
        currentLabel = leadingMatch[1].toUpperCase();
        const contentPart = leadingMatch[2].replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
        currentContent = [contentPart];
        continue;
      }

      if (!currentLabel) {
        currentLabel = alphabet[sections.length] || String(sections.length + 1);
      }
      currentContent.push(stripped);
    }

    if (currentLabel && currentContent.length > 0) {
      sections.push({ sectionLabel: currentLabel, content: currentContent.join('\n\n') });
    }
  } else {
    // Each paragraph is its own section
    rawList.forEach((item, idx) => {
      const stripped = item.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
      if (stripped.length > 20) {
        sections.push({
          sectionLabel: alphabet[idx] || String(idx + 1),
          content: stripped,
        });
      }
    });
  }

  if (sections.length > 0) return sections;
  return [{ sectionLabel: 'A', content: cleaned.replace(/<\/?[^>]+(>|$)/g, ' ').trim() }];
}

// Cambridge 7 Test 1 static questions definition
const C7_T1_QUESTION_DEFS: Array<{
  num: number;
  text: string;
  correct: string;
  type: string;
  passageNum: number;
  instruction?: string;
}> = [
  // Passage 1 (1–13)
  { num: 1, text: 'Examples of wildlife other than bats which do not rely on vision to navigate by', correct: 'B', type: 'MATCHING_INFORMATION', passageNum: 1, instruction: 'Which paragraph contains the following information?' },
  { num: 2, text: 'How early mammals avoided dying out', correct: 'A', type: 'MATCHING_INFORMATION', passageNum: 1, instruction: 'Which paragraph contains the following information?' },
  { num: 3, text: 'Why bats hunt in the dark', correct: 'A', type: 'MATCHING_INFORMATION', passageNum: 1, instruction: 'Which paragraph contains the following information?' },
  { num: 4, text: 'How a particular discovery has helped our understanding of bats', correct: 'E', type: 'MATCHING_INFORMATION', passageNum: 1, instruction: 'Which paragraph contains the following information?' },
  { num: 5, text: 'Early military uses of echolocation', correct: 'D', type: 'MATCHING_INFORMATION', passageNum: 1, instruction: 'Which paragraph contains the following information?' },
  { num: 6, text: 'Facial vision: comparable to pain from a [6] arm or leg', correct: 'phantom', type: 'SUMMARY_COMPLETION', passageNum: 1, instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage.' },
  { num: 7, text: 'Ability actually comes from perceiving [7] through the ears', correct: 'echoes', type: 'SUMMARY_COMPLETION', passageNum: 1, instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage.' },
  { num: 8, text: 'Instruments which calculated the [8] of the seabed', correct: 'depth', type: 'SUMMARY_COMPLETION', passageNum: 1, instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage.' },
  { num: 9, text: 'Wartime application in devices for finding [9]', correct: 'submarines', type: 'SUMMARY_COMPLETION', passageNum: 1, instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage.' },
  { num: 10, text: 'Long before the invention of radar [10] had perfected the system', correct: 'natural selection', type: 'SENTENCE_COMPLETION', passageNum: 1, instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS.' },
  { num: 11, text: 'Radar is an inaccurate term for bats because they do not use [11]', correct: 'radio waves', type: 'SENTENCE_COMPLETION', passageNum: 1, instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS.' },
  { num: 12, text: 'Radar and sonar are based on similar [12]', correct: 'mathematical theories', type: 'SENTENCE_COMPLETION', passageNum: 1, instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS.' },
  { num: 13, text: 'The word "echolocation" was first used by someone who was an [13]', correct: 'zoologist', type: 'SENTENCE_COMPLETION', passageNum: 1, instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS.' },

  // Passage 2 (14–26)
  { num: 14, text: 'Section A - Choose the correct heading', correct: 'A description of ancient water supplies', type: 'MATCHING_HEADINGS', passageNum: 2, instruction: 'Choose the correct heading for each section from the list of headings.' },
  { num: 15, text: 'Section C - Choose the correct heading', correct: 'The relevance to health', type: 'MATCHING_HEADINGS', passageNum: 2, instruction: 'Choose the correct heading for each section from the list of headings.' },
  { num: 16, text: 'Section D - Choose the correct heading', correct: 'Environmental effects', type: 'MATCHING_HEADINGS', passageNum: 2, instruction: 'Choose the correct heading for each section from the list of headings.' },
  { num: 17, text: 'Section E - Choose the correct heading', correct: "Scientists' call for revision of policy", type: 'MATCHING_HEADINGS', passageNum: 2, instruction: 'Choose the correct heading for each section from the list of headings.' },
  { num: 18, text: 'Section F - Choose the correct heading', correct: 'A surprising downward trend in demand for water', type: 'MATCHING_HEADINGS', passageNum: 2, instruction: 'Choose the correct heading for each section from the list of headings.' },
  { num: 19, text: 'Section G - Choose the correct heading', correct: 'An explanation for reduced water use', type: 'MATCHING_HEADINGS', passageNum: 2, instruction: 'Choose the correct heading for each section from the list of headings.' },
  { num: 20, text: 'Section H - Choose the correct heading', correct: 'The need to raise standards', type: 'MATCHING_HEADINGS', passageNum: 2, instruction: 'Choose the correct heading for each section from the list of headings.' },
  { num: 21, text: 'Water use per person is higher in the industrial world than it was in Ancient Rome.', correct: 'NO', type: 'YES_NO_NOT_GIVEN', passageNum: 2, instruction: 'Do the following statements agree with the claims of the writer?' },
  { num: 22, text: 'Feeding increasing populations is possible due primarily to improved irrigation systems.', correct: 'YES', type: 'YES_NO_NOT_GIVEN', passageNum: 2, instruction: 'Do the following statements agree with the claims of the writer?' },
  { num: 23, text: 'Modern water systems imitate those of the ancient Greeks and Romans.', correct: 'NOT GIVEN', type: 'YES_NO_NOT_GIVEN', passageNum: 2, instruction: 'Do the following statements agree with the claims of the writer?' },
  { num: 24, text: 'Industrial growth is increasing the overall demand for water.', correct: 'NO', type: 'YES_NO_NOT_GIVEN', passageNum: 2, instruction: 'Do the following statements agree with the claims of the writer?' },
  { num: 25, text: 'Modern technologies have led to reduction in the domestic water consumption.', correct: 'YES', type: 'YES_NO_NOT_GIVEN', passageNum: 2, instruction: 'Do the following statements agree with the claims of the writer?' },
  { num: 26, text: 'In the future, governments should maintain ownership of water infrastructures.', correct: 'NOT GIVEN', type: 'YES_NO_NOT_GIVEN', passageNum: 2, instruction: 'Do the following statements agree with the claims of the writer?' },

  // Passage 3 (27–40)
  { num: 27, text: 'The book Educating Psyche is mainly concerned with', correct: 'ways of learning which are not traditional', type: 'MULTIPLE_CHOICE', passageNum: 3, instruction: 'Choose the correct letter, A, B, C or D.' },
  { num: 28, text: 'Lozanov’s theory claims that, when we try to remember things,', correct: 'unimportant details are the easiest to recall', type: 'MULTIPLE_CHOICE', passageNum: 3, instruction: 'Choose the correct letter, A, B, C or D.' },
  { num: 29, text: 'In this passage, the author uses the examples of a book and a lecture to illustrate that', correct: 'his theory about methods of learning is valid', type: 'MULTIPLE_CHOICE', passageNum: 3, instruction: 'Choose the correct letter, A, B, C or D.' },
  { num: 30, text: 'Lozanov claims that teachers should train students to', correct: 'think about something other than the curriculum content', type: 'MULTIPLE_CHOICE', passageNum: 3, instruction: 'Choose the correct letter, A, B, C or D.' },
  { num: 31, text: 'In the example of suggestopedic teaching in the fourth paragraph, the only variable that changes is the music.', correct: 'FALSE', type: 'YES_NO_NOT_GIVEN', passageNum: 3, instruction: 'Do the following statements agree with the information given in Reading Passage 3?' },
  { num: 32, text: 'Prior to the suggestopedia class, students are made aware that the language experience will be demanding.', correct: 'FALSE', type: 'YES_NO_NOT_GIVEN', passageNum: 3, instruction: 'Do the following statements agree with the information given in Reading Passage 3?' },
  { num: 33, text: 'In the follow-up class, the teaching activities are similar to those used in conventional classes.', correct: 'TRUE', type: 'YES_NO_NOT_GIVEN', passageNum: 3, instruction: 'Do the following statements agree with the information given in Reading Passage 3?' },
  { num: 34, text: 'As an indirect benefit, students notice improvements in their memory.', correct: 'NOT GIVEN', type: 'YES_NO_NOT_GIVEN', passageNum: 3, instruction: 'Do the following statements agree with the information given in Reading Passage 3?' },
  { num: 35, text: 'Teachers say they prefer suggestopedia to traditional approaches to language teaching.', correct: 'NOT GIVEN', type: 'YES_NO_NOT_GIVEN', passageNum: 3, instruction: 'Do the following statements agree with the information given in Reading Passage 3?' },
  { num: 36, text: 'Students in a suggestopedia class retain more new vocabulary than those in ordinary classes.', correct: 'TRUE', type: 'YES_NO_NOT_GIVEN', passageNum: 3, instruction: 'Do the following statements agree with the information given in Reading Passage 3?' },
  { num: 37, text: 'Lozanov acknowledged that the [37] surrounding suggestion is also a placebo', correct: 'ritual', type: 'SUMMARY_COMPLETION', passageNum: 3, instruction: 'Complete the summary using the list of words below.' },
  { num: 38, text: 'Like any [38], it must be dispensed with authority to be effective', correct: 'placebo', type: 'SUMMARY_COMPLETION', passageNum: 3, instruction: 'Complete the summary using the list of words below.' },
  { num: 39, text: 'Few teachers are able to emulate the [39] results of Lozanov', correct: 'spectacular', type: 'SUMMARY_COMPLETION', passageNum: 3, instruction: 'Complete the summary using the list of words below.' },
  { num: 40, text: 'Mediocre results can be attributed to [40] implementation without faith', correct: 'unspectacular', type: 'SUMMARY_COMPLETION', passageNum: 3, instruction: 'Complete the summary using the list of words below.' },
];

function normalize(s: string): string {
  return (s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function checkAnswerMatch(userAns: string, correctAns: string): boolean {
  const normUser = normalize(userAns);
  const normCorrect = normalize(correctAns);
  if (!normUser || !normCorrect) return false;
  if (normUser === normCorrect) return true;

  if (normUser.length === 1 && normCorrect.startsWith(normUser)) return true;
  if (normCorrect.length === 1 && normUser.startsWith(normCorrect)) return true;

  if ((normUser === 'yes' && normCorrect === 'true') || (normUser === 'true' && normCorrect === 'yes')) return true;
  if ((normUser === 'no' && normCorrect === 'false') || (normUser === 'false' && normCorrect === 'no')) return true;

  return false;
}

export function useReadingExamData({
  bookNumber: propBookNumber,
  testNumber: propTestNumber,
  attemptId: propAttemptId,
  initialAnswers = {},
  testTitle
}: UseReadingExamDataOptions): UseReadingExamDataResult {
  const resolvedBook = propBookNumber ?? (testTitle ? parseInt(testTitle.match(/Cambridge\s*(\d+)/i)?.[1] || '7', 10) : 7);
  const resolvedTest = propTestNumber ?? (testTitle ? parseInt(testTitle.match(/Test\s*(\d+)/i)?.[1] || '1', 10) : 1);

  const initialAnswersKey = typeof initialAnswers === 'string'
    ? initialAnswers
    : (initialAnswers && typeof initialAnswers === 'object' ? JSON.stringify(initialAnswers) : '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passages, setPassages] = useState<ReadingPassageItem[]>([]);
  const [questions, setQuestions] = useState<ReadingQuestionItem[]>([]);
  const [candidateAnswers, setCandidateAnswers] = useState<Record<string, string>>({});
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [bandScore, setBandScore] = useState<number>(6.5);
  const [attemptId, setAttemptId] = useState<string | null>(propAttemptId ? String(propAttemptId) : null);
  const hasDataRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!hasDataRef.current) {
      setLoading(true);
    }
    setError(null);
    try {
      const book = resolvedBook;
      const test = resolvedTest;
      const testKey = `cambridge-${book}-test-${test}`;
      const examUuidPrefix = `c${book}`.padEnd(8, '0');
      const examId = `${examUuidPrefix}-0000-0000-0000-${String(test).padStart(12, '0')}`;

      // ── 1. Fetch Candidate Answers from Supabase or Local Storage ──
      let loadedAnswers: Record<string, string> = {};
      let resolvedAttemptRow: any = null;

      // Initialize from initialAnswersKey if provided
      if (initialAnswersKey) {
        try {
          const parsed = JSON.parse(initialAnswersKey);
          Object.entries(parsed).forEach(([k, v]) => {
            const cleanKey = k.startsWith('q') ? k : `q${k}`;
            if (v) loadedAnswers[cleanKey] = String(v).trim();
          });
        } catch {}
      }

      // Check Supabase exam_attempts
      try {
        if (propAttemptId) {
          const isUuid = typeof propAttemptId === 'string' && propAttemptId.includes('-');
          if (isUuid) {
            const { data } = await (supabase as any)
              .from('exam_attempts')
              .select('*')
              .eq('id', propAttemptId)
              .maybeSingle();
            resolvedAttemptRow = data;
          }
        }

        if (!resolvedAttemptRow) {
          const { data } = await (supabase as any)
            .from('exam_attempts')
            .select('*')
            .eq('module', 'reading')
            .or(`test_id.ilike.%${testKey}%,test_id.ilike.%c${book}%test%${test}%`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          resolvedAttemptRow = data;
        }
      } catch (err) {
        console.warn('[useExamData] Supabase attempt read note:', err);
      }

      // Fallback to localStorage if no remote row
      if (!resolvedAttemptRow && typeof window !== 'undefined') {
        try {
          const localCache = localStorage.getItem(`exam_attempts_reading_${testKey}`)
            || localStorage.getItem('latest_reading_results')
            || localStorage.getItem('latest_reading_attempt');
          if (localCache) {
            resolvedAttemptRow = JSON.parse(localCache);
          }
        } catch {}
      }

      if (resolvedAttemptRow) {
        if (resolvedAttemptRow.id) setAttemptId(String(resolvedAttemptRow.id));
        const rawAnswers = resolvedAttemptRow.answers_payload || resolvedAttemptRow.answers || {};
        Object.entries(rawAnswers).forEach(([k, v]) => {
          const cleanKey = k.startsWith('q') ? k : `q${k}`;
          if (v) loadedAnswers[cleanKey] = String(v).trim();
        });
      }

      setCandidateAnswers(loadedAnswers);

      // ── 2. Fetch Passages (Left Panel 50%) from Supabase ──
      let loadedPassages: ReadingPassageItem[] = [];

      // A. Try reading_passages table
      try {
        const { data: rpData, error: rpErr } = await (supabase as any)
          .from('reading_passages')
          .select('passage_number, title, passage_text')
          .eq('book_number', book)
          .eq('test_number', test)
          .order('passage_number', { ascending: true });

        if (rpData && rpData.length > 0 && !rpErr) {
          loadedPassages = rpData.map((p: any) => {
            const partNum = Number(p.passage_number);
            const difficulty = partNum === 1 ? 'easy' : partNum === 2 ? 'medium' : 'hard';
            return {
              passage_number: partNum,
              title: p.title || `Passage ${partNum}`,
              difficulty,
              passage_text: p.passage_text || '',
              sections: parseSectionsFromText(p.passage_text || ''),
            };
          });
        }
      } catch {}

      // B. If not in reading_passages, query passages table (180 real passages)
      if (loadedPassages.length === 0) {
        try {
          const { data: pData } = await (supabase as any)
            .from('passages')
            .select('part_number, title, content_html')
            .or(`exam_id.eq.${examId},exam_id.ilike.%c${book}%${test}%`)
            .order('part_number', { ascending: true });

          if (pData && pData.length > 0) {
            loadedPassages = pData.map((p: any) => {
              const partNum = Number(p.part_number);
              const difficulty = partNum === 1 ? 'easy' : partNum === 2 ? 'medium' : 'hard';
              return {
                passage_number: partNum,
                title: p.title || `Passage ${partNum}`,
                difficulty,
                passage_text: p.content_html || '',
                sections: parseSectionsFromText(p.content_html || ''),
              };
            });
          }
        } catch (err) {
          console.warn('[useExamData] Passages table query note:', err);
        }
      }

      // C. Fallback for offline or Book 7 Test 1 static content
      if (loadedPassages.length === 0 || (book === 7 && test === 1 && loadedPassages.some(p => !p.sections || p.sections.length === 0))) {
        if (book === 7 && test === 1) {
          loadedPassages = CAMBRIDGE_7_TEST_1_PASSAGES.map((p) => ({
            passage_number: p.passageNumber,
            title: p.title,
            difficulty: p.difficulty,
            passage_text: p.passageText.map((sec) => `<p><strong>${sec.sectionLabel}</strong><br/>${sec.content}</p>`).join(''),
            sections: p.passageText,
          }));
        } else {
          // Generic placeholder structure
          loadedPassages = [1, 2, 3].map((num) => ({
            passage_number: num,
            title: `Cambridge ${book} Test ${test} — Passage ${num}`,
            difficulty: num === 1 ? 'easy' : num === 2 ? 'medium' : 'hard',
            passage_text: `<p>Passage ${num} content for Cambridge ${book} Test ${test}. Review official test materials for comprehensive passage text.</p>`,
            sections: [{ sectionLabel: 'A', content: `Passage ${num} content for Cambridge ${book} Test ${test}. Review official test materials for comprehensive passage text.` }],
          }));
        }
      }

      setPassages(loadedPassages);

      // ── 3. Fetch Questions (Right Panel 50%) from Supabase ──
      let loadedQuestions: ReadingQuestionItem[] = [];

      // A. Try reading_questions table
      try {
        const { data: rqData, error: rqErr } = await (supabase as any)
          .from('reading_questions')
          .select('question_number, passage_number, question_type, prompt_text, instruction, options, correct_answer, explanation, explanation_text, passage_evidence_quote, evidence_quote, evidence_section')
          .eq('book_number', book)
          .eq('test_number', test)
          .order('question_number', { ascending: true });

        if (rqData && rqData.length > 0 && !rqErr) {
          loadedQuestions = rqData.map((q: any) => {
            const qNum = Number(q.question_number);
            const fallbackExp = C7_T1_EXPLANATIONS[qNum];
            return {
              question_number: qNum,
              passage_number: Number(q.passage_number || 1),
              question_type: q.question_type || 'Reading Question',
              prompt_text: q.prompt_text || `Question ${qNum}`,
              instruction: q.instruction || '',
              options: q.options || [],
              correct_answer: q.correct_answer || '',
              explanation: q.explanation_text || q.explanation || fallbackExp?.whyCorrect || '',
              explanation_text: q.explanation_text || q.explanation || fallbackExp?.whyCorrect || '',
              evidence_quote: q.passage_evidence_quote || q.evidence_quote || fallbackExp?.passageEvidence?.quote || '',
              evidence_section: q.evidence_section || fallbackExp?.passageEvidence?.section || '',
              why_others_wrong: fallbackExp?.whyOthersWrong,
              common_traps: fallbackExp?.commonTraps,
              strategy_tip: fallbackExp?.strategyTip,
              completion_guidance: fallbackExp?.completionGuidance,
            };
          });
        }
      } catch {}

      // B. If not in reading_questions, try sections -> question_groups -> questions
      if (loadedQuestions.length === 0) {
        try {
          const { data: secData } = await (supabase as any)
            .from('sections')
            .select('part_number, passage_title, question_groups(*, questions(*))')
            .or(`test_id.ilike.%c${book}%test%${test}%,exam_id.ilike.%c${book}%${test}%,test_id.ilike.%c0${book}%test%${test}%,exam_id.ilike.%c0${book}%${test}%`)
            .order('part_number', { ascending: true });

          if (secData && secData.length > 0) {
            secData.forEach((sec: any) => {
              const groups = sec.question_groups || [];
              groups.forEach((grp: any) => {
                const qs = grp.questions || [];
                qs.forEach((q: any) => {
                  if (q.question_number) {
                    const qNum = Number(q.question_number);
                    const fallbackExp = C7_T1_EXPLANATIONS[qNum];
                    loadedQuestions.push({
                      question_number: qNum,
                      passage_number: Number(sec.part_number || 1),
                      question_type: grp.question_type || 'Reading Question',
                      prompt_text: q.question_text || q.prompt || `Question ${qNum}`,
                      instruction: grp.instructions || '',
                      options: q.options || grp.choices || [],
                      correct_answer: q.correct_answer || '',
                      explanation: q.explanation || fallbackExp?.whyCorrect || '',
                      explanation_text: q.explanation || fallbackExp?.whyCorrect || '',
                      evidence_quote: q.passage_evidence_quote || fallbackExp?.passageEvidence?.quote || '',
                      evidence_section: q.evidence_section || fallbackExp?.passageEvidence?.section || '',
                      why_others_wrong: fallbackExp?.whyOthersWrong,
                      common_traps: fallbackExp?.commonTraps,
                      strategy_tip: fallbackExp?.strategyTip,
                    });
                  }
                });
              });
            });
          }
        } catch {}
      }

      // C. Fallback: Curated 40-question definitions
      if (loadedQuestions.length === 0) {
        if (book === 7 && test === 1) {
          loadedQuestions = C7_T1_QUESTION_DEFS.map((qDef) => {
            const exp = C7_T1_EXPLANATIONS[qDef.num];
            return {
              question_number: qDef.num,
              passage_number: qDef.passageNum,
              question_type: qDef.type,
              prompt_text: qDef.text,
              instruction: qDef.instruction || '',
              options: [],
              correct_answer: qDef.correct,
              explanation: exp ? exp.whyCorrect : 'Official Cambridge verified response.',
              explanation_text: exp ? exp.whyCorrect : 'Official Cambridge verified response.',
              evidence_quote: exp?.passageEvidence?.quote || '',
              evidence_section: exp?.passageEvidence?.section || '',
              why_others_wrong: exp?.whyOthersWrong,
              common_traps: exp?.commonTraps,
              strategy_tip: exp?.strategyTip,
              completion_guidance: exp?.completionGuidance,
            };
          });
        } else {
          // Use snippet generator for other Cambridge tests
          const snippetQs = getSnippetQuestionsForExam(book, test);
          loadedQuestions = snippetQs.map((sq: any) => ({
            question_number: Number(sq.question_number),
            passage_number: Number(sq.part_number || 1),
            question_type: sq.section_type || 'Reading Question',
            prompt_text: sq.prompt_text || `Question ${sq.question_number}`,
            instruction: sq.instruction_text || '',
            options: sq.choices || [],
            correct_answer: sq.correct_answer || '',
            explanation: `Cambridge ${book} Test ${test} verified key answer.`,
            explanation_text: `Cambridge ${book} Test ${test} verified key answer.`,
            evidence_quote: '',
            evidence_section: '',
          }));
        }
      }

      // ── 4. Map Candidate Responses & Compute Accuracy ──
      loadedQuestions.sort((a, b) => a.question_number - b.question_number);

      let correct = 0;
      const mappedQuestions = loadedQuestions.map((q) => {
        const userRaw = loadedAnswers[`q${q.question_number}`] || loadedAnswers[String(q.question_number)] || '';
        const isMatch = !!userRaw && checkAnswerMatch(userRaw, q.correct_answer || '');
        if (isMatch) correct++;

        return {
          ...q,
          candidate_answer: userRaw,
          is_correct: isMatch,
        };
      });

      const calculatedBand = rawToBand(correct);

      setQuestions(mappedQuestions);
      setCorrectCount(correct);
      setBandScore(Number(resolvedAttemptRow?.band_score) || calculatedBand);
      hasDataRef.current = true;
    } catch (err: any) {
      console.error('[useReadingExamData] Error fetching reading exam data:', err);
      setError(err?.message || 'Failed to load reading exam data');
    } finally {
      setLoading(false);
    }
  }, [resolvedBook, resolvedTest, propAttemptId, initialAnswersKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    passages,
    questions,
    candidateAnswers,
    correctCount,
    bandScore,
    attemptId,
    refetch: fetchData,
  };
}
