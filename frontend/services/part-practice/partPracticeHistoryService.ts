import { supabase } from '@/lib/supabaseClient';

export type PartPracticeSkill = 'reading' | 'listening' | 'writing' | 'speaking';
export type PartPracticeAttemptType = 'part' | 'question_type';
export type PartPracticeStatus = 'TARGET' | 'GOOD' | 'DEVELOP' | 'AT_RISK';

export interface PartPracticeQuestionTelemetry {
    qNum: number;
    prompt: string;
    type?: string;
    candidate_answer: string;
    correct_answer: string;
    is_correct: boolean;
    is_omitted?: boolean;
    explanation?: string;
    evidence?: string;
    timestamp?: string;
}

export interface PartPracticeAttempt {
    id: string;
    user_id?: string;
    user_email?: string;
    attempt_type: PartPracticeAttemptType;
    module: PartPracticeSkill;
    book_number: number;
    test_number: number;
    part_number: number;
    scoped_target: string;
    exam_title: string;
    drill_name?: string;
    source_exam?: string;
    category?: 'academic' | 'general';
    source_type?: 'cambridge' | 'mock_series';
    band_score: number;
    raw_score: number;
    total_questions: number;
    accuracy_percentage: number;
    time_spent_seconds: number;
    status: PartPracticeStatus;
    user_responses: Record<string, any>;
    detailed_results?: {
        questions?: PartPracticeQuestionTelemetry[];
        criteria?: { label: string; score: number }[];
        passage_title?: string;
        passage_text?: string;
        audio_url?: string;
        tapescript?: string;
        candidate_essay?: string;
        model_answer?: string;
        highlights?: Array<{ text: string; type: 'grammar' | 'vocab' | 'strong'; note: string }>;
        transcript?: Array<{ speaker: string; text: string; question?: string }>;
        four_pillars?: {
            ta?: number;
            cc?: number;
            lr?: number;
            gra?: number;
            fc?: number;
            pr?: number;
        };
        strengths?: string[];
        improvements?: string[];
        chart_data?: any;
    };
    created_at: string;
}

const STORAGE_KEY = 'stephen_part_practice_attempts_v1';
export const PART_PRACTICE_UPDATED_EVENT = 'stephen_part_practice_updated';

/* ─── High-Fidelity Initial Seed Attempts ─── */
const SEED_ATTEMPTS: PartPracticeAttempt[] = [
    {
        id: 'ppa-c7-t1-r-p1',
        attempt_type: 'part',
        module: 'reading',
        book_number: 7,
        test_number: 1,
        part_number: 1,
        scoped_target: 'Passage 1 (Q1–13)',
        exam_title: 'Cambridge 7 Test 1 — Passage 1',
        source_exam: 'Cambridge 7 Test 1',
        category: 'academic',
        source_type: 'cambridge',
        band_score: 8.5,
        raw_score: 12,
        total_questions: 13,
        accuracy_percentage: 92,
        time_spent_seconds: 1140, // 19m
        status: 'TARGET',
        created_at: '2026-10-14T03:15:00.000Z',
        user_responses: {
            '1': 'FALSE',
            '2': 'TRUE',
            '3': 'NOT GIVEN',
            '4': 'FALSE',
            '5': '', // Omitted question
            '6': 'navigation',
            '7': 'echolocation',
            '8': 'blindness',
            '9': 'ultrasound',
            '10': 'prey',
            '11': 'depth',
            '12': 'sonar',
            '13': 'distance'
        },
        detailed_results: {
            passage_title: "Passage 1: The life and work of Marie Curie & Let's Go Bats",
            passage_text: `Bats have been engineered by natural selection into remarkably sophisticated radar-like navigators. They fly in absolute darkness without crashing into trees, finding tiny gnats with astonishing ease.

For centuries, researchers puzzled over how nocturnal bats find their way through the pitch black without reliance on standard optical vision. In 1793, Italian scientist Lazzaro Spallanzani discovered that blinded bats could still maneuver obstacles perfectly, whereas bats with plugged ears became totally disoriented.

Modern acoustic analysis proves that microbats emit ultrasonic pulses from their vocal apparatus. As sound waves bounce off surrounding objects, high-frequency auditory receptors calculate the precise distance, size, and flight speed of airborne insects. This physiological capability—termed echolocation—operates on principles analogous to human naval sonar, yet achieves an unprecedented level of computational efficiency within a fraction of a gram of brain tissue.`,
            questions: [
                { qNum: 1, prompt: "Bats navigate exclusively using night-adapted eyesight.", type: "True / False / Not Given", candidate_answer: "FALSE", correct_answer: "FALSE", is_correct: true, explanation: "Text explicitly states bats rely on echolocation rather than optical vision in darkness.", evidence: "blinded bats could still maneuver obstacles perfectly" },
                { qNum: 2, prompt: "Spallanzani's experiments confirmed the auditory basis of bat navigation.", type: "True / False / Not Given", candidate_answer: "TRUE", correct_answer: "TRUE", is_correct: true, explanation: "Bats with plugged ears became disoriented, isolating hearing as essential.", evidence: "bats with plugged ears became totally disoriented" },
                { qNum: 3, prompt: "Spallanzani collaborated with French physicists on ultrasound frequencies.", type: "True / False / Not Given", candidate_answer: "NOT GIVEN", correct_answer: "NOT GIVEN", is_correct: true, explanation: "No French collaboration is documented in the historical record of this passage." },
                { qNum: 4, prompt: "Naval sonar was developed chronologically before the discovery of echolocation.", type: "True / False / Not Given", candidate_answer: "FALSE", correct_answer: "FALSE", is_correct: true, explanation: "Spallanzani's bat experiments occurred in 1793, predating naval sonar." },
                { qNum: 5, prompt: "Natural selection favored high-frequency auditory receptors over heavy optical structures.", type: "True / False / Not Given", candidate_answer: "", correct_answer: "TRUE", is_correct: false, is_omitted: true, explanation: "Question was left unanswered during the timed drill.", evidence: "high-frequency auditory receptors calculate the precise distance" },
                { qNum: 6, prompt: "Bats navigate without colliding through obstacles by using advanced acoustic [6].", type: "Gap Fill", candidate_answer: "navigation", correct_answer: "navigation", is_correct: true, explanation: "Direct noun completion from paragraph 1." },
                { qNum: 7, prompt: "The biological system of ultrasound bounce is formally termed [7].", type: "Gap Fill", candidate_answer: "echolocation", correct_answer: "echolocation", is_correct: true, explanation: "Direct terminology match from paragraph 3." },
                { qNum: 8, prompt: "Spallanzani proved artificial [8] did not impair the flight agility of bats.", type: "Gap Fill", candidate_answer: "blindness", correct_answer: "blindness", is_correct: true, explanation: "Blinded bats maneuvered without restriction." },
                { qNum: 9, prompt: "Vocal cords produce pulses composed of high-pitch [9].", type: "Gap Fill", candidate_answer: "ultrasound", correct_answer: "ultrasound", is_correct: true, explanation: "Direct textual evidence: ultrasonic pulses." },
                { qNum: 10, prompt: "Auditory feedback calculates the motion of target [10].", type: "Gap Fill", candidate_answer: "prey", correct_answer: "prey", is_correct: true, explanation: "Echolocation pinpoints airborne prey." },
                { qNum: 11, prompt: "Echo reflection informs the bat of obstacle [11] and trajectory.", type: "Gap Fill", candidate_answer: "depth", correct_answer: "depth", is_correct: true, explanation: "Direct contextual synonym for dimensional distance." },
                { qNum: 12, prompt: "Human technology modeled after this is naval [12].", type: "Gap Fill", candidate_answer: "sonar", correct_answer: "sonar", is_correct: true, explanation: "Mentioned directly in comparison." },
                { qNum: 13, prompt: "Acoustic receptors determine the exact target [13].", type: "Gap Fill", candidate_answer: "distance", correct_answer: "distance", is_correct: true, explanation: "Auditory receptors calculate precise distance." }
            ]
        }
    },
    {
        id: 'ppa-c7-t1-l-p1',
        attempt_type: 'part',
        module: 'listening',
        book_number: 7,
        test_number: 1,
        part_number: 1,
        scoped_target: 'Part 1 (Q1–10)',
        exam_title: 'Cambridge 7 Test 1 — Part 1',
        source_exam: 'Cambridge 7 Test 1',
        category: 'academic',
        source_type: 'cambridge',
        band_score: 7.0,
        raw_score: 8,
        total_questions: 10,
        accuracy_percentage: 80,
        time_spent_seconds: 580, // ~9.5m
        status: 'GOOD',
        created_at: '2026-10-14T02:40:00.000Z',
        user_responses: {
            '1': 'expensive',
            '2': 'city centre',
            '3': 'waiting time',
            '4': 'door-to-door',
            '5': '', // Omitted question
            '6': '14',
            '7': 'domestic',
            '8': 'Milton',
            '9': 'cab', // Incorrect: expected "taxi"
            '10': '07765 328411'
        },
        detailed_results: {
            audio_url: 'https://hucadzqsqsfqgmwnpipp.supabase.co/storage/v1/object/public/listening-audio/cambridge-7/test-1/full_audio.mp3',
            tapescript: `AGENT: Good morning, City Transport Travel Office. How can I help you today?
CALLER: Hi, I'm arriving at the international airport next Wednesday and need to sort out transport into the city centre.
AGENT: Well, you have several choices. Car hire is available right outside terminal 2, but if you don't want to drive yourself, that can turn out quite expensive.
CALLER: Yes, that would be expensive. What about public transport?
AGENT: The Greyhound express bus runs every thirty minutes direct to the city centre. It takes about forty-five minutes.
CALLER: Sounds reasonable. Does it have long waiting times?
AGENT: Usually minimal waiting time during weekdays. If you have bulky baggage, a door-to-door shuttle service is also available for fourteen pounds.
CALLER: Great. My final destination is the Milton residential quarter. Could you take down my mobile: 07765 328411?`,
            questions: [
                { qNum: 1, prompt: "Car hire: don't want to drive [1]", type: "Form Completion", candidate_answer: "expensive", correct_answer: "expensive", is_correct: true, timestamp: "01:38", explanation: "Speaker confirms rental car with driver is expensive.", evidence: "Yes, that would be expensive." },
                { qNum: 2, prompt: "Greyhound Bus: Direct to the [2]", type: "Form Completion", candidate_answer: "city centre", correct_answer: "city centre", is_correct: true, timestamp: "02:06", explanation: "Direct destination confirmed as city centre.", evidence: "runs every thirty minutes direct to the city centre." },
                { qNum: 3, prompt: "Passenger concern: Long [3]", type: "Form Completion", candidate_answer: "waiting time", correct_answer: "waiting time", is_correct: true, timestamp: "02:42", explanation: "Caller explicitly asks about waiting time.", evidence: "Does it have long waiting times?" },
                { qNum: 4, prompt: "Convenient alternative: [4] shuttle", type: "Form Completion", candidate_answer: "door-to-door", correct_answer: "door-to-door", is_correct: true, timestamp: "03:15", explanation: "Agent specifies a door-to-door shuttle.", evidence: "door-to-door shuttle service is also available" },
                { qNum: 5, prompt: "Shuttle operates from [5] area", type: "Form Completion", candidate_answer: "", correct_answer: "terminal 2", is_correct: false, is_omitted: true, timestamp: "03:45", explanation: "Candidate omitted this question during playback.", evidence: "available right outside terminal 2" },
                { qNum: 6, prompt: "Price of shuttle single ticket: £[6]", type: "Form Completion", candidate_answer: "14", correct_answer: "14", is_correct: true, timestamp: "04:12", explanation: "Agent states fourteen pounds.", evidence: "available for fourteen pounds." },
                { qNum: 7, prompt: "Arrival terminal category: [7] flights", type: "Form Completion", candidate_answer: "domestic", correct_answer: "domestic", is_correct: true, timestamp: "04:38", explanation: "Agent asks whether international or domestic.", evidence: "connecting from domestic terminal" },
                { qNum: 8, prompt: "Drop-off district: [8]", type: "Form Completion", candidate_answer: "Milton", correct_answer: "Milton", is_correct: true, timestamp: "05:02", explanation: "Caller gives neighborhood name Milton.", evidence: "destination is the Milton residential quarter" },
                { qNum: 9, prompt: "Local pickup mode recommendation: [9]", type: "Form Completion", candidate_answer: "cab", correct_answer: "taxi", is_correct: false, timestamp: "05:28", explanation: "Exam key requires authentic term 'taxi'.", evidence: "pre-booked licensed taxi" },
                { qNum: 10, prompt: "Caller contact telephone: [10]", type: "Form Completion", candidate_answer: "07765 328411", correct_answer: "07765 328411", is_correct: true, timestamp: "05:54", explanation: "Digit verbatim match confirmed.", evidence: "mobile: 07765 328411" }
            ]
        }
    },
    {
        id: 'ppa-c7-t1-w-t1',
        attempt_type: 'part',
        module: 'writing',
        book_number: 7,
        test_number: 1,
        part_number: 1,
        scoped_target: 'Task 1 (Academic Report)',
        exam_title: 'Cambridge 7 Test 1 — Task 1',
        source_exam: 'Cambridge 7 Test 1',
        category: 'academic',
        source_type: 'cambridge',
        band_score: 6.5,
        raw_score: 65,
        total_questions: 1,
        accuracy_percentage: 75,
        time_spent_seconds: 1200, // 20m
        status: 'DEVELOP',
        created_at: '2026-10-13T21:10:00.000Z',
        user_responses: {
            essay: `The bar chart compares the number of adult participants in six major sports between 1997 and 2017. Overall, walking was by far the most popular activity in both recorded years, whereas cricket and rugby registered the lowest participation rates.

In 1997, walking attracted approximately 50,000 adults, and this figure experienced a noticeable upward trajectory, reaching nearly 58,000 by 2017. Similarly, swimming stood as the second most favored pursuit, hovering around 35,000 in 1997 before dipping marginally to 32,000 in 2017.

Conversely, team sports exhibited modest participation figures throughout the two-decade span. Football remained relatively stable at just under 20,000 adults in both periods. Meanwhile, both rugby and cricket had under 10,000 players each in 1997, although rugby showed slight growth while cricket experienced a steady downward slide.`
        },
        detailed_results: {
            passage_title: "Task 1: Academic Report — Major Sports Participation (1997 vs 2017)",
            candidate_essay: `The bar chart compares the number of adult participants in six major sports between 1997 and 2017. Overall, walking was by far the most popular activity in both recorded years, whereas cricket and rugby registered the lowest participation rates.

In 1997, walking attracted approximately 50,000 adults, and this figure experienced a noticeable upward trajectory, reaching nearly 58,000 by 2017. Similarly, swimming stood as the second most favored pursuit, hovering around 35,000 in 1997 before dipping marginally to 32,000 in 2017.

Conversely, team sports exhibited modest participation figures throughout the two-decade span. Football remained relatively stable at just under 20,000 adults in both periods. Meanwhile, both rugby and cricket had under 10,000 players each in 1997, although rugby showed slight growth while cricket experienced a steady downward slide.`,
            four_pillars: {
                ta: 6.5,
                cc: 6.5,
                lr: 6.0,
                gra: 7.0
            },
            highlights: [
                { text: "noticeable upward trajectory", type: "strong", note: "Band 8+ dynamic trend collocation." },
                { text: "experienced a downward slide", type: "vocab", note: "Slightly informal idiom. Prefer: 'witnessed a modest contraction'." },
                { text: "hovering around 35,000 in 1997 before dipping marginally", type: "grammar", note: "Complex participial clause demonstrating grammatical range." }
            ],
            model_answer: `The bar chart illustrates the participation levels of adults across six distinct sports categories between 1997 and 2017, measured in thousands.

Overall, walking remained the preeminent physical activity over the two decades, displaying consistent upward growth, whereas field-based team disciplines such as cricket and rugby occupied the lowest tiers of involvement.

In detail, walking commenced at 50,000 participants in 1997 and climbed steadily to peak at 58,000 by 2017. Swimming retained the second highest position despite a nominal decrease from 35,000 to approximately 32,000. 

In stark contrast, engagement in organized team sports was markedly constrained. Football figures remained static at roughly 18,000, while rugby and cricket recorded fewer than 10,000 participants each across both milestones, with cricket experiencing a mild recession to 6,000.`,
            strengths: [
                "Clear overall summary statement isolating highest and lowest metrics.",
                "Accurate data grouping dividing solo activities from team sports."
            ],
            improvements: [
                "Specify unit scale in the introductory overview paragraph.",
                "Incorporate more varied comparative connectors (e.g. 'whereas', 'in stark contrast')."
            ]
        }
    },
    {
        id: 'ppa-c7-t1-s-p2',
        attempt_type: 'part',
        module: 'speaking',
        book_number: 7,
        test_number: 1,
        part_number: 2,
        scoped_target: 'Part 2 (Cue Card)',
        exam_title: 'Cambridge 7 Test 1 — Part 2',
        source_exam: 'Cambridge 7 Test 1',
        category: 'academic',
        source_type: 'cambridge',
        band_score: 7.0,
        raw_score: 70,
        total_questions: 1,
        accuracy_percentage: 82,
        time_spent_seconds: 240, // 4m
        status: 'TARGET',
        created_at: '2026-10-13T19:45:00.000Z',
        user_responses: {
            transcript_text: `I'd like to talk about an energetic community cultural festival that takes place annually in my hometown during late autumn. It's essentially a harvest and music celebration where people from diverse neighborhoods congregate in the central plaza.

I attended this event last November with several close friends from university. What made it particularly vibrant was the sheer variety of live acoustic bands and traditional culinary stalls lined up along the boulevard. The atmosphere was electrifying because local artists performed traditional rhythmic folk tunes infused with modern jazz riffs.

I found the experience thoroughly memorable because it revitalized the local sense of camaraderie after months of routine work. People of all generations were dancing together, and it gave me a renewed appreciation for organic community gatherings.`
        },
        detailed_results: {
            passage_title: "Part 2: Long Turn (Cue Card) — Describe an energetic event or festival you attended",
            four_pillars: {
                fc: 7.0,
                lr: 7.0,
                gra: 7.0,
                pr: 7.5
            },
            transcript: [
                { speaker: "Examiner", text: "Please talk about an energetic community event or festival you attended. You have 1 to 2 minutes." },
                { speaker: "Candidate", text: "I'd like to talk about an energetic community cultural festival that takes place annually in my hometown during late autumn. It's essentially a harvest and music celebration where people from diverse neighborhoods congregate in the central plaza..." }
            ],
            highlights: [
                { text: "congregate in the central plaza", type: "strong", note: "High-level lexis indicating natural fluency." },
                { text: "revitalized the local sense of camaraderie", type: "strong", note: "Band 8 collocation demonstrating abstract expressive range." },
                { text: "sheer variety of live acoustic bands", type: "strong", note: "Native-like precision in descriptive discourse." }
            ],
            strengths: [
                "Smooth topic development covering all cue card bullet prompts without hesitation.",
                "Natural intonation patterns with dynamic stress on descriptive adjectives."
            ],
            improvements: [
                "Use a wider selection of concession markers (e.g. 'granted that', 'nonetheless').",
                "Extend hypothetical discourse frames (e.g. 'Had I not attended, I would have missed...')."
            ]
        }
    },
    /* ─── Question Types View Seeds ─── */
    {
        id: 'ppa-qt-r-tfng-c7',
        attempt_type: 'question_type',
        module: 'reading',
        book_number: 7,
        test_number: 1,
        part_number: 1,
        scoped_target: 'Passage 1 (Q1–5)',
        exam_title: 'Cambridge 7 Test 1 — Part 1',
        drill_name: 'True / False / Not Given',
        source_exam: 'Cambridge 7 Test 1 — Part 1',
        category: 'academic',
        source_type: 'cambridge',
        band_score: 8.0,
        raw_score: 5,
        total_questions: 5,
        accuracy_percentage: 100,
        time_spent_seconds: 360,
        status: 'TARGET',
        created_at: '2026-10-14T01:20:00.000Z',
        user_responses: {
            '1': 'FALSE',
            '2': 'TRUE',
            '3': 'NOT GIVEN',
            '4': 'FALSE',
            '5': 'TRUE'
        },
        detailed_results: {
            passage_title: "Drill: True / False / Not Given — Bats & Echolocation (Cambridge 7)",
            questions: [
                { qNum: 1, prompt: "Bats navigate exclusively using night-adapted eyesight.", type: "True / False / Not Given", candidate_answer: "FALSE", correct_answer: "FALSE", is_correct: true, explanation: "Text states bats rely on ultrasound echolocation." },
                { qNum: 2, prompt: "Spallanzani's experiments confirmed the auditory basis of bat navigation.", type: "True / False / Not Given", candidate_answer: "TRUE", correct_answer: "TRUE", is_correct: true, explanation: "Disoriented flight with plugged ears proved auditory dependency." },
                { qNum: 3, prompt: "Spallanzani collaborated with French physicists on ultrasound frequencies.", type: "True / False / Not Given", candidate_answer: "NOT GIVEN", correct_answer: "NOT GIVEN", is_correct: true, explanation: "No mention of French collaboration in source text." },
                { qNum: 4, prompt: "Naval sonar was developed chronologically before the discovery of echolocation.", type: "True / False / Not Given", candidate_answer: "FALSE", correct_answer: "FALSE", is_correct: true, explanation: "1793 discoveries occurred well before 20th century naval sonar." },
                { qNum: 5, prompt: "Auditory receptors calculate airborne prey trajectory.", type: "True / False / Not Given", candidate_answer: "TRUE", correct_answer: "TRUE", is_correct: true, explanation: "Direct match with paragraph 3." }
            ]
        }
    },
    {
        id: 'ppa-qt-l-form-c7',
        attempt_type: 'question_type',
        module: 'listening',
        book_number: 7,
        test_number: 1,
        part_number: 1,
        scoped_target: 'Part 1 (Q1–8)',
        exam_title: 'Cambridge 7 Test 1 — Section 1',
        drill_name: 'Form Completion',
        source_exam: 'Cambridge 7 Test 1 — Part 1',
        category: 'academic',
        source_type: 'cambridge',
        band_score: 7.5,
        raw_score: 7,
        total_questions: 8,
        accuracy_percentage: 88,
        time_spent_seconds: 450,
        status: 'TARGET',
        created_at: '2026-10-13T16:15:00.000Z',
        user_responses: {
            '1': 'expensive',
            '2': 'city centre',
            '3': 'waiting time',
            '4': 'door-to-door',
            '5': '14',
            '6': 'Milton',
            '7': 'licensed taxi',
            '8': '07765 328411'
        },
        detailed_results: {
            passage_title: "Drill: Form Completion — Transport Enquiry (Cambridge 7)",
            audio_url: 'https://hucadzqsqsfqgmwnpipp.supabase.co/storage/v1/object/public/listening-audio/cambridge-7/test-1/full_audio.mp3',
            questions: [
                { qNum: 1, prompt: "Car hire with chauffeur: [1]", candidate_answer: "expensive", correct_answer: "expensive", is_correct: true, timestamp: "01:38" },
                { qNum: 2, prompt: "Greyhound express to [2]", candidate_answer: "city centre", correct_answer: "city centre", is_correct: true, timestamp: "02:06" },
                { qNum: 3, prompt: "Expected [3] between buses", candidate_answer: "waiting time", correct_answer: "waiting time", is_correct: true, timestamp: "02:42" },
                { qNum: 4, prompt: "Door-to-[4] luggage service", candidate_answer: "door-to-door", correct_answer: "door-to-door", is_correct: true, timestamp: "03:15" },
                { qNum: 5, prompt: "Shuttle flat fare: £[5]", candidate_answer: "14", correct_answer: "14", is_correct: true, timestamp: "04:12" },
                { qNum: 6, prompt: "Destination district: [6]", candidate_answer: "Milton", correct_answer: "Milton", is_correct: true, timestamp: "05:02" },
                { qNum: 7, prompt: "Alternative vehicle: licensed [7]", candidate_answer: "licensed taxi", correct_answer: "taxi", is_correct: false, timestamp: "05:28" },
                { qNum: 8, prompt: "Passenger contact number: [8]", candidate_answer: "07765 328411", correct_answer: "07765 328411", is_correct: true, timestamp: "05:54" }
            ]
        }
    },
    {
        id: 'ppa-qt-w-bar-c7',
        attempt_type: 'question_type',
        module: 'writing',
        book_number: 7,
        test_number: 1,
        part_number: 1,
        scoped_target: 'Task 1 (Bar Chart)',
        exam_title: 'Cambridge 7 Test 1 — Task 1',
        drill_name: 'Bar Chart',
        source_exam: 'Cambridge 7 Test 1 — Task 1',
        category: 'academic',
        source_type: 'cambridge',
        band_score: 6.5,
        raw_score: 65,
        total_questions: 1,
        accuracy_percentage: 75,
        time_spent_seconds: 1100,
        status: 'DEVELOP',
        created_at: '2026-10-12T14:30:00.000Z',
        user_responses: {
            essay: "The bar chart provides comparative telemetry on sports participation among adults in 1997 and 2017..."
        },
        detailed_results: {
            passage_title: "Drill: Bar Chart Analysis — Adult Sports Participation",
            four_pillars: { ta: 6.5, cc: 6.5, lr: 6.0, gra: 7.0 }
        }
    }
];

/* ─── Local Storage Helpers ─── */
function getLocalAttempts(): PartPracticeAttempt[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ATTEMPTS));
            return SEED_ATTEMPTS;
        }
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return SEED_ATTEMPTS;
    } catch {
        return SEED_ATTEMPTS;
    }
}

function saveLocalAttempts(attempts: PartPracticeAttempt[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
        window.dispatchEvent(new CustomEvent(PART_PRACTICE_UPDATED_EVENT, { detail: attempts }));
    } catch (e) {
        console.warn('[partPracticeHistoryService] Error saving local attempts:', e);
    }
}

/* ─── Service API ─── */
export async function fetchPartPracticeAttempts(options?: {
    module?: string;
    attemptType?: PartPracticeAttemptType;
    userEmail?: string;
}): Promise<PartPracticeAttempt[]> {
    const local = getLocalAttempts();

    try {
        let query = (supabase as any)
            .from('part_practice_attempts')
            .select('*')
            .order('created_at', { ascending: false });

        if (options?.module && options.module !== 'all') {
            query = query.eq('module', options.module);
        }
        if (options?.attemptType) {
            query = query.eq('attempt_type', options.attemptType);
        }

        const { data: dbData, error } = await query.limit(100);

        if (!error && dbData && dbData.length > 0) {
            const seenIds = new Set<string>();
            const merged: PartPracticeAttempt[] = [];

            dbData.forEach((row: any) => {
                const id = String(row.id);
                seenIds.add(id);
                merged.push({
                    id,
                    user_id: row.user_id,
                    user_email: row.user_email,
                    attempt_type: row.attempt_type || 'part',
                    module: row.module,
                    book_number: Number(row.book_number) || 7,
                    test_number: Number(row.test_number) || 1,
                    part_number: Number(row.part_number) || 1,
                    scoped_target: row.scoped_target || `Part ${row.part_number || 1}`,
                    exam_title: row.exam_title || `Cambridge ${row.book_number || 7} Test ${row.test_number || 1}`,
                    drill_name: row.drill_name,
                    source_exam: row.source_exam,
                    category: row.category || 'academic',
                    source_type: row.source_type || 'cambridge',
                    band_score: Number(row.band_score) || 6.5,
                    raw_score: Number(row.raw_score) || 0,
                    total_questions: Number(row.total_questions) || 0,
                    accuracy_percentage: Number(row.accuracy_percentage) || 0,
                    time_spent_seconds: Number(row.time_spent_seconds) || 0,
                    status: (row.status as PartPracticeStatus) || 'TARGET',
                    user_responses: row.user_responses || {},
                    detailed_results: row.detailed_results || {},
                    created_at: row.created_at || new Date().toISOString()
                });
            });

            // Append local attempts that haven't been synced to database yet
            local.forEach(loc => {
                if (!seenIds.has(String(loc.id))) {
                    merged.push(loc);
                }
            });

            return merged;
        }
    } catch (err) {
        console.warn('[partPracticeHistoryService] Supabase fetch fallback to local:', err);
    }

    return local;
}

export async function recordPartPracticeAttempt(
    data: Omit<PartPracticeAttempt, 'id' | 'created_at'> & { id?: string }
): Promise<PartPracticeAttempt> {
    const id = data.id || `ppa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const created_at = new Date().toISOString();

    const record: PartPracticeAttempt = {
        ...data,
        id,
        created_at
    };

    // Save to local cache first
    const current = getLocalAttempts();
    const updated = [record, ...current.filter(c => c.id !== id)];
    saveLocalAttempts(updated);

    // Sync to Supabase in background
    try {
        await (supabase as any)
            .from('part_practice_attempts')
            .upsert([
                {
                    id: record.id.startsWith('ppa-') ? undefined : record.id,
                    user_id: record.user_id,
                    user_email: record.user_email,
                    attempt_type: record.attempt_type,
                    module: record.module,
                    book_number: record.book_number,
                    test_number: record.test_number,
                    part_number: record.part_number,
                    scoped_target: record.scoped_target,
                    exam_title: record.exam_title,
                    drill_name: record.drill_name,
                    source_exam: record.source_exam,
                    category: record.category,
                    source_type: record.source_type,
                    band_score: record.band_score,
                    raw_score: record.raw_score,
                    total_questions: record.total_questions,
                    accuracy_percentage: record.accuracy_percentage,
                    time_spent_seconds: record.time_spent_seconds,
                    status: record.status,
                    user_responses: record.user_responses,
                    detailed_results: record.detailed_results,
                    created_at: record.created_at
                }
            ]);
    } catch (err) {
        console.warn('[partPracticeHistoryService] Supabase insert warning:', err);
    }

    return record;
}

export async function getPartPracticeAttemptById(id: string): Promise<PartPracticeAttempt | null> {
    const attempts = await fetchPartPracticeAttempts();
    return attempts.find(a => String(a.id) === String(id)) || null;
}
