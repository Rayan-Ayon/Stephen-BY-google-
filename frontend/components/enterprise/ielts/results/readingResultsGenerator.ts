import { ExamResultsPayload, PassageReviewData, ResultQuestionItem } from './readingResultsTypes';
import { CAMBRIDGE_7_TEST_1_PASSAGES, C7_T1_EXPLANATIONS } from './cambridge7Test1Explanations';
import { rawToBand } from '../ieltsShared';

// Cambridge 7 Test 1 static questions definition
const C7_T1_QUESTION_DEFS: Array<{
  id: string;
  num: number;
  text: string;
  correct: string;
  groupType: ResultQuestionItem['groupType'];
  passageNum: number;
}> = [
  // Passage 1 (1–13)
  { id: 'q1', num: 1, text: 'Examples of wildlife other than bats which do not rely on vision to navigate by', correct: 'B', groupType: 'MATCHING_INFORMATION', passageNum: 1 },
  { id: 'q2', num: 2, text: 'How early mammals avoided dying out', correct: 'A', groupType: 'MATCHING_INFORMATION', passageNum: 1 },
  { id: 'q3', num: 3, text: 'Why bats hunt in the dark', correct: 'A', groupType: 'MATCHING_INFORMATION', passageNum: 1 },
  { id: 'q4', num: 4, text: 'How a particular discovery has helped our understanding of bats', correct: 'E', groupType: 'MATCHING_INFORMATION', passageNum: 1 },
  { id: 'q5', num: 5, text: 'Early military uses of echolocation', correct: 'D', groupType: 'MATCHING_INFORMATION', passageNum: 1 },
  { id: 'q6', num: 6, text: 'Facial vision: comparable to pain from a [6] arm or leg', correct: 'phantom', groupType: 'SUMMARY_COMPLETION', passageNum: 1 },
  { id: 'q7', num: 7, text: 'Ability actually comes from perceiving [7] through the ears', correct: 'echoes', groupType: 'SUMMARY_COMPLETION', passageNum: 1 },
  { id: 'q8', num: 8, text: 'Instruments which calculated the [8] of the seabed', correct: 'depth', groupType: 'SUMMARY_COMPLETION', passageNum: 1 },
  { id: 'q9', num: 9, text: 'Wartime application in devices for finding [9]', correct: 'submarines', groupType: 'SUMMARY_COMPLETION', passageNum: 1 },
  { id: 'q10', num: 10, text: 'Long before the invention of radar [10] had perfected the system', correct: 'natural selection', groupType: 'SENTENCE_COMPLETION', passageNum: 1 },
  { id: 'q11', num: 11, text: 'Radar is an inaccurate term for bats because they do not use [11]', correct: 'radio waves', groupType: 'SENTENCE_COMPLETION', passageNum: 1 },
  { id: 'q12', num: 12, text: 'Radar and sonar are based on similar [12]', correct: 'mathematical theories', groupType: 'SENTENCE_COMPLETION', passageNum: 1 },
  { id: 'q13', num: 13, text: 'The word "echolocation" was first used by someone who was an [13]', correct: 'zoologist', groupType: 'SENTENCE_COMPLETION', passageNum: 1 },

  // Passage 2 (14–26)
  { id: 'q14', num: 14, text: 'Section A - Choose the correct heading', correct: 'A description of ancient water supplies', groupType: 'MATCHING_HEADINGS', passageNum: 2 },
  { id: 'q15', num: 15, text: 'Section C - Choose the correct heading', correct: 'The relevance to health', groupType: 'MATCHING_HEADINGS', passageNum: 2 },
  { id: 'q16', num: 16, text: 'Section D - Choose the correct heading', correct: 'Environmental effects', groupType: 'MATCHING_HEADINGS', passageNum: 2 },
  { id: 'q17', num: 17, text: 'Section E - Choose the correct heading', correct: "Scientists' call for revision of policy", groupType: 'MATCHING_HEADINGS', passageNum: 2 },
  { id: 'q18', num: 18, text: 'Section F - Choose the correct heading', correct: 'A surprising downward trend in demand for water', groupType: 'MATCHING_HEADINGS', passageNum: 2 },
  { id: 'q19', num: 19, text: 'Section G - Choose the correct heading', correct: 'An explanation for reduced water use', groupType: 'MATCHING_HEADINGS', passageNum: 2 },
  { id: 'q20', num: 20, text: 'Section H - Choose the correct heading', correct: 'The need to raise standards', groupType: 'MATCHING_HEADINGS', passageNum: 2 },
  { id: 'q21', num: 21, text: 'Water use per person is higher in the industrial world than it was in Ancient Rome.', correct: 'NO', groupType: 'YES_NO_NOT_GIVEN', passageNum: 2 },
  { id: 'q22', num: 22, text: 'Feeding increasing populations is possible due primarily to improved irrigation systems.', correct: 'YES', groupType: 'YES_NO_NOT_GIVEN', passageNum: 2 },
  { id: 'q23', num: 23, text: 'Modern water systems imitate those of the ancient Greeks and Romans.', correct: 'NOT GIVEN', groupType: 'YES_NO_NOT_GIVEN', passageNum: 2 },
  { id: 'q24', num: 24, text: 'Industrial growth is increasing the overall demand for water.', correct: 'NO', groupType: 'YES_NO_NOT_GIVEN', passageNum: 2 },
  { id: 'q25', num: 25, text: 'Modern technologies have led to reduction in the domestic water consumption.', correct: 'YES', groupType: 'YES_NO_NOT_GIVEN', passageNum: 2 },
  { id: 'q26', num: 26, text: 'In the future, governments should maintain ownership of water infrastructures.', correct: 'NOT GIVEN', groupType: 'YES_NO_NOT_GIVEN', passageNum: 2 },

  // Passage 3 (27–40)
  { id: 'q27', num: 27, text: 'The book Educating Psyche is mainly concerned with', correct: 'ways of learning which are not traditional', groupType: 'MULTIPLE_CHOICE', passageNum: 3 },
  { id: 'q28', num: 28, text: 'Lozanov’s theory claims that, when we try to remember things,', correct: 'unimportant details are the easiest to recall', groupType: 'MULTIPLE_CHOICE', passageNum: 3 },
  { id: 'q29', num: 29, text: 'In this passage, the author uses the examples of a book and a lecture to illustrate that', correct: 'his theory about methods of learning is valid', groupType: 'MULTIPLE_CHOICE', passageNum: 3 },
  { id: 'q30', num: 30, text: 'Lozanov claims that teachers should train students to', correct: 'think about something other than the curriculum content', groupType: 'MULTIPLE_CHOICE', passageNum: 3 },
  { id: 'q31', num: 31, text: 'In the example of suggestopedic teaching in the fourth paragraph, the only variable that changes is the music.', correct: 'FALSE', groupType: 'YES_NO_NOT_GIVEN', passageNum: 3 },
  { id: 'q32', num: 32, text: 'Prior to the suggestopedia class, students are made aware that the language experience will be demanding.', correct: 'FALSE', groupType: 'YES_NO_NOT_GIVEN', passageNum: 3 },
  { id: 'q33', num: 33, text: 'In the follow-up class, the teaching activities are similar to those used in conventional classes.', correct: 'TRUE', groupType: 'YES_NO_NOT_GIVEN', passageNum: 3 },
  { id: 'q34', num: 34, text: 'As an indirect benefit, students notice improvements in their memory.', correct: 'NOT GIVEN', groupType: 'YES_NO_NOT_GIVEN', passageNum: 3 },
  { id: 'q35', num: 35, text: 'Teachers say they prefer suggestopedia to traditional approaches to language teaching.', correct: 'NOT GIVEN', groupType: 'YES_NO_NOT_GIVEN', passageNum: 3 },
  { id: 'q36', num: 36, text: 'Students in a suggestopedia class retain more new vocabulary than those in ordinary classes.', correct: 'TRUE', groupType: 'YES_NO_NOT_GIVEN', passageNum: 3 },
  { id: 'q37', num: 37, text: 'Lozanov acknowledged that the [37] surrounding suggestion is also a placebo', correct: 'ritual', groupType: 'SUMMARY_COMPLETION', passageNum: 3 },
  { id: 'q38', num: 38, text: 'Like any [38], it must be dispensed with authority to be effective', correct: 'placebo', groupType: 'SUMMARY_COMPLETION', passageNum: 3 },
  { id: 'q39', num: 39, text: 'Few teachers are able to emulate the [39] results of Lozanov', correct: 'spectacular', groupType: 'SUMMARY_COMPLETION', passageNum: 3 },
  { id: 'q40', num: 40, text: 'Mediocre results can be attributed to [40] implementation without faith', correct: 'unspectacular', groupType: 'SUMMARY_COMPLETION', passageNum: 3 },
];

function normalize(s: string): string {
  return (s || '').trim().toLowerCase();
}

function checkAnswerMatch(userAns: string, correctAns: string): boolean {
  const normUser = normalize(userAns);
  const normCorrect = normalize(correctAns);
  if (!normUser || !normCorrect) return false;

  if (normUser === normCorrect) return true;

  // Single letter vs option matching e.g. "b" vs "B" or "b. ..."
  if (normUser.length === 1 && normCorrect.toLowerCase().startsWith(normUser)) return true;
  if (normCorrect.length === 1 && normUser.toLowerCase().startsWith(normCorrect)) return true;

  // True/Yes and False/No aliases
  if ((normUser === 'yes' && normCorrect === 'true') || (normUser === 'true' && normCorrect === 'yes')) return true;
  if ((normUser === 'no' && normCorrect === 'false') || (normUser === 'false' && normCorrect === 'no')) return true;

  // Partial Roman numeral handling for headings
  const romanMap: Record<string, string> = {
    'i': '1', 'ii': '2', 'iii': '3', 'iv': '4', 'v': '5',
    'vi': '6', 'vii': '7', 'viii': '8', 'ix': '9', 'x': '10'
  };
  if (romanMap[normUser] && normCorrect.includes(romanMap[normUser])) return true;

  return false;
}

function getBandLabel(band: number): string {
  if (band >= 9.0) return 'Expert User';
  if (band >= 8.0) return 'Very Good User';
  if (band >= 7.0) return 'Good User';
  if (band >= 6.0) return 'Competent User';
  if (band >= 5.0) return 'Modest User';
  if (band >= 4.0) return 'Limited User';
  if (band >= 3.0) return 'Extremely Limited User';
  if (band >= 2.0) return 'Intermittent User';
  return 'Non User';
}

export function generateExamResultsPayload(
  sessionId: string,
  testTitle: string,
  userAnswers: Record<number, string>,
  timeSpentSeconds: number,
  answersKeyOverrides?: Record<number, string>
): ExamResultsPayload {
  const passagesMap: Record<number, ResultQuestionItem[]> = { 1: [], 2: [], 3: [] };
  let correctCount = 0;

  // Breakdown aggregators
  const typeCounters: Record<string, { correct: number; total: number }> = {
    'Matching': { correct: 0, total: 0 },
    'Gap Fill': { correct: 0, total: 0 },
    'Short Answer': { correct: 0, total: 0 },
    'Multiple Choice': { correct: 0, total: 0 }
  };

  const passageCounters: Record<number, { correct: number; total: number }> = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 }
  };

  for (const qDef of C7_T1_QUESTION_DEFS) {
    const rawUserAns = userAnswers[qDef.num];
    const userAns = rawUserAns && rawUserAns.trim() !== '' ? rawUserAns.trim() : null;
    const expectedAns = (answersKeyOverrides && answersKeyOverrides[qDef.num]) || qDef.correct;
    const isCorrect = userAns !== null && checkAnswerMatch(userAns, expectedAns);

    if (isCorrect) {
      correctCount++;
    }

    // Category mapping
    let categoryKey = 'Multiple Choice';
    if (qDef.groupType === 'MATCHING_INFORMATION' || qDef.groupType === 'MATCHING_HEADINGS') {
      categoryKey = 'Matching';
    } else if (qDef.groupType === 'SUMMARY_COMPLETION') {
      categoryKey = 'Gap Fill';
    } else if (qDef.groupType === 'SENTENCE_COMPLETION' || qDef.groupType === 'YES_NO_NOT_GIVEN') {
      categoryKey = 'Short Answer';
    } else {
      categoryKey = 'Multiple Choice';
    }

    typeCounters[categoryKey].total += 1;
    if (isCorrect) typeCounters[categoryKey].correct += 1;

    passageCounters[qDef.passageNum].total += 1;
    if (isCorrect) passageCounters[qDef.passageNum].correct += 1;

    const explanation = C7_T1_EXPLANATIONS[qDef.num] || {
      whyCorrect: `The correct answer is "${expectedAns}" as supported directly by the passage text in Section ${qDef.passageNum === 1 ? 'B' : qDef.passageNum === 2 ? 'C' : 'D'}.`,
      passageEvidence: {
        section: `Section ${qDef.passageNum === 1 ? 'B' : qDef.passageNum === 2 ? 'C' : 'D'}`,
        quote: `Direct evidence confirms the targeted IELTS solution '${expectedAns}'.`,
        supportingText: `This exact wording supports the stored answer '${expectedAns}' for Question ${qDef.num}.`
      },
      strategyTip: "Identify keywords in the question stem and locate their synonyms in the passage."
    };

    const questionItem: ResultQuestionItem = {
      id: qDef.id,
      questionNumber: qDef.num,
      questionText: qDef.text,
      userAnswer: userAns,
      correctAnswer: expectedAns,
      isCorrect,
      groupType: qDef.groupType,
      explanation
    };

    passagesMap[qDef.passageNum].push(questionItem);
  }

  const bandScore = rawToBand(correctCount);
  const bandLabel = getBandLabel(bandScore);

  const questionTypeBreakdown = [
    {
      typeLabel: 'Matching',
      correct: typeCounters['Matching'].correct,
      total: typeCounters['Matching'].total,
      status: (typeCounters['Matching'].correct / (typeCounters['Matching'].total || 1) >= 0.8
        ? 'Mastered'
        : typeCounters['Matching'].correct / (typeCounters['Matching'].total || 1) >= 0.5
        ? 'Moderate'
        : 'Needs Work') as 'Needs Work' | 'Moderate' | 'Mastered'
    },
    {
      typeLabel: 'Gap Fill',
      correct: typeCounters['Gap Fill'].correct,
      total: typeCounters['Gap Fill'].total,
      status: (typeCounters['Gap Fill'].correct / (typeCounters['Gap Fill'].total || 1) >= 0.8
        ? 'Mastered'
        : typeCounters['Gap Fill'].correct / (typeCounters['Gap Fill'].total || 1) >= 0.5
        ? 'Moderate'
        : 'Needs Work') as 'Needs Work' | 'Moderate' | 'Mastered'
    },
    {
      typeLabel: 'Short Answer',
      correct: typeCounters['Short Answer'].correct,
      total: typeCounters['Short Answer'].total,
      status: (typeCounters['Short Answer'].correct / (typeCounters['Short Answer'].total || 1) >= 0.8
        ? 'Mastered'
        : typeCounters['Short Answer'].correct / (typeCounters['Short Answer'].total || 1) >= 0.5
        ? 'Moderate'
        : 'Needs Work') as 'Needs Work' | 'Moderate' | 'Mastered'
    },
    {
      typeLabel: 'Multiple Choice',
      correct: typeCounters['Multiple Choice'].correct,
      total: typeCounters['Multiple Choice'].total,
      status: (typeCounters['Multiple Choice'].correct / (typeCounters['Multiple Choice'].total || 1) >= 0.8
        ? 'Mastered'
        : typeCounters['Multiple Choice'].correct / (typeCounters['Multiple Choice'].total || 1) >= 0.5
        ? 'Moderate'
        : 'Needs Work') as 'Needs Work' | 'Moderate' | 'Mastered'
    }
  ];

  const passageBreakdown = [
    {
      passageNumber: 1,
      title: CAMBRIDGE_7_TEST_1_PASSAGES[0].title,
      correct: passageCounters[1].correct,
      total: passageCounters[1].total,
      status: (passageCounters[1].correct / (passageCounters[1].total || 1) >= 0.8
        ? 'Excellent'
        : passageCounters[1].correct / (passageCounters[1].total || 1) >= 0.5
        ? 'Good'
        : 'Needs Focus') as 'Needs Focus' | 'Good' | 'Excellent'
    },
    {
      passageNumber: 2,
      title: CAMBRIDGE_7_TEST_1_PASSAGES[1].title,
      correct: passageCounters[2].correct,
      total: passageCounters[2].total,
      status: (passageCounters[2].correct / (passageCounters[2].total || 1) >= 0.8
        ? 'Excellent'
        : passageCounters[2].correct / (passageCounters[2].total || 1) >= 0.5
        ? 'Good'
        : 'Needs Focus') as 'Needs Focus' | 'Good' | 'Excellent'
    },
    {
      passageNumber: 3,
      title: CAMBRIDGE_7_TEST_1_PASSAGES[2].title,
      correct: passageCounters[3].correct,
      total: passageCounters[3].total,
      status: (passageCounters[3].correct / (passageCounters[3].total || 1) >= 0.8
        ? 'Excellent'
        : passageCounters[3].correct / (passageCounters[3].total || 1) >= 0.5
        ? 'Good'
        : 'Needs Focus') as 'Needs Focus' | 'Good' | 'Excellent'
    }
  ];

  const passages: PassageReviewData[] = CAMBRIDGE_7_TEST_1_PASSAGES.map((p) => ({
    id: `passage-${p.passageNumber}`,
    passageNumber: p.passageNumber,
    title: p.title,
    difficulty: p.difficulty,
    passageText: p.passageText,
    questions: passagesMap[p.passageNumber] || []
  }));

  return {
    sessionId,
    testTitle,
    submittedAt: new Date().toISOString(),
    timeSpentSeconds,
    totalQuestions: 40,
    correctCount,
    bandScore,
    bandLabel,
    questionTypeBreakdown,
    passageBreakdown,
    passages
  };
}
