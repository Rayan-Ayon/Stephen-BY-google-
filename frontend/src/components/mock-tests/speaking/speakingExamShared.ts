import { supabase } from '@/supabaseClient';

export interface SpeakingQuestionItem {
    id: string;
    source_type: 'cambridge' | 'mock_series';
    book_or_set_number: number;
    test_number: number;
    module_type: 'academic' | 'general';
    part_number: 1 | 2 | 3;
    topic_title: string;
    cue_card_topic?: string | null;
    prompts: string[];
}

export interface SpeakingTestData {
    sourceType: 'cambridge' | 'mock_series';
    bookNumber: number;
    testNumber: number;
    category: 'academic' | 'general';
    title: string;
    part1: {
        title: string;
        questions: string[];
    };
    part2: {
        title: string;
        topic: string;
        prompts: string[];
    };
    part3: {
        title: string;
        questions: string[];
    };
}

export interface SpeakingEvaluation {
    overallBand: number;
    fluency: {
        score: number;
        relevance?: any[];
        logical_sequencing?: any[];
        topic_development?: any[];
    };
    lexical: {
        score: number;
        diversity_and_advanced_words?: string[];
        accuracy?: string[];
    };
    grammar: {
        score: number;
        sentence_complexity?: string[];
        errors?: string[];
    };
    pronunciation: {
        score: number;
        individual_sounds?: string[];
        word_stress?: string[];
        rhythm_intonation?: string[];
    };
    transcript: string;
    what_you_did_well: string[];
    areas_to_improve: string[];
}

// ── Authentic Cambridge & Mock Tests Speaking Question Bank ─────────────────

const CAMBRIDGE_SPEAKING_BANK: Record<string, Omit<SpeakingTestData, 'sourceType' | 'bookNumber' | 'testNumber' | 'category'>> = {
    // Cambridge 7
    'cambridge-7-1': {
        title: 'Cambridge 7 Test 1',
        part1: {
            title: 'Hometown & Accommodation',
            questions: [
                'What kind of place is your hometown or village?',
                'What is the most interesting part of your town or village?',
                'What kind of jobs do the people in your town or village do?',
                'Would you say it is a good place to live? Why?',
                'Tell me about the kind of accommodation you live in.',
                'How long have you lived there?',
            ],
        },
        part2: {
            title: 'A Teacher Who Influenced You',
            topic: 'a teacher who has greatly influenced you in your education',
            prompts: [
                'where you met them',
                'what subject they taught',
                'what was special about them',
                'and explain why this person influenced you so much',
            ],
        },
        part3: {
            title: 'Developments in Education',
            questions: [
                'How has teaching changed in your country in the last few decades?',
                'What is the effect of modern technology on education in your opinion?',
                'What changes do you think there will be in education in the future?',
                'How can a country improve its education system?',
            ],
        },
    },
    'cambridge-7-2': {
        title: 'Cambridge 7 Test 2',
        part1: {
            title: 'Laughing & Free Time',
            questions: [
                'What kinds of things make you laugh?',
                'Do you like watching comedies on TV or in cinema?',
                'Do you think it is important for people to laugh regularly?',
                'Is comedy popular in your culture?',
            ],
        },
        part2: {
            title: 'An Electronic Device',
            topic: 'an electronic device you bought that was very useful',
            prompts: [
                'what the device was',
                'where and when you bought it',
                'what you used it for',
                'and explain why it was so useful to you',
            ],
        },
        part3: {
            title: 'Technology and Daily Life',
            questions: [
                'What kinds of electronic devices do people find most essential today?',
                'Do you think people rely too much on technology nowadays?',
                'How will domestic appliances change over the next twenty years?',
                'What problems can arise when technology fails in daily life?',
            ],
        },
    },
    'cambridge-7-3': {
        title: 'Cambridge 7 Test 3',
        part1: {
            title: 'Cold Weather & Seasons',
            questions: [
                'What is your favourite season of the year?',
                'What do you usually do when the weather is very cold?',
                'Does cold weather affect people’s mood in your opinion?',
                'Have you ever seen snow or experienced extreme weather?',
            ],
        },
        part2: {
            title: 'A Historic Building',
            topic: 'a historic building or monument you visited',
            prompts: [
                'where it was located',
                'what it looked like',
                'what happened there historically',
                'and explain what impressed you most about it',
            ],
        },
        part3: {
            title: 'Historic Preservation',
            questions: [
                'Why is it important to protect historic buildings?',
                'Should governments spend public money preserving historic sites or building new infrastructure?',
                'How can old monuments be made attractive to younger generations?',
                'Does mass tourism pose a threat to historical landmarks?',
            ],
        },
    },
    'cambridge-7-4': {
        title: 'Cambridge 7 Test 4',
        part1: {
            title: 'Sports & Games',
            questions: [
                'Did you enjoy sports when you were in school?',
                'What games or sports are most popular in your country?',
                'Do you prefer playing sports or watching them on television?',
                'What are the health benefits of regular exercise?',
            ],
        },
        part2: {
            title: 'A Long Journey',
            topic: 'a long journey you took that you found interesting',
            prompts: [
                'where you travelled to',
                'how you travelled',
                'who you travelled with',
                'and explain why this journey was particularly interesting',
            ],
        },
        part3: {
            title: 'Travel and Public Transport',
            questions: [
                'Why do people travel more nowadays than they used to in the past?',
                'What can governments do to improve public transportation systems?',
                'How does long-distance commuting affect people’s quality of life?',
                'Will supersonic or high-speed rail replace air travel in the future?',
            ],
        },
    },

    // Cambridge 8
    'cambridge-8-1': {
        title: 'Cambridge 8 Test 1',
        part1: {
            title: 'Neighbourhood & Friends',
            questions: [
                'Can you describe the neighbourhood where you grew up?',
                'Do you think your neighbourhood is a friendly place?',
                'How often do you talk to your neighbours?',
                'What facilities would make your neighbourhood better?',
            ],
        },
        part2: {
            title: 'An Artist or Musician',
            topic: 'an artist, musician, or performer you admire',
            prompts: [
                'who this person is',
                'what kind of work or performance they do',
                'when you first learned about them',
                'and explain why you admire their talent',
            ],
        },
        part3: {
            title: 'Art & Cultural Heritage',
            questions: [
                'Why do you think art education is valuable in schools?',
                'Should art and cultural events be subsidized by the state?',
                'How has the internet changed the way people experience music and art?',
                'Does art reflect society or shape society?',
            ],
        },
    },

    // Cambridge 18
    'cambridge-18-1': {
        title: 'Cambridge 18 Test 1',
        part1: {
            title: 'Reading & Books',
            questions: [
                'Do you enjoy reading books in your free time?',
                'What kinds of books do you prefer reading?',
                'Did you read many books when you were a child?',
                'Do you prefer physical printed books or e-books?',
            ],
        },
        part2: {
            title: 'A Time You Made a Promise',
            topic: 'a time when you made a promise to someone',
            prompts: [
                'whom you made the promise to',
                'what the promise was about',
                'why you made this promise',
                'and explain whether it was easy or difficult to keep it',
            ],
        },
        part3: {
            title: 'Trust and Commitments',
            questions: [
                'Why is keeping promises so crucial in personal relationships?',
                'What consequences happen when businesses fail to honor their promises to customers?',
                'Are younger people less likely to make long-term commitments than older generations?',
                'Should promises made verbally have legal weight?',
            ],
        },
    },

    // Mock Series
    'mock_series-1-1': {
        title: 'IELTS Dynasty Mock Series 1 Test 1',
        part1: {
            title: 'Work, Study & Daily Routine',
            questions: [
                'Do you work or are you a student?',
                'What do you find most interesting about your job or course?',
                'What does a typical morning look like for you?',
                'Would you like to change anything about your daily schedule?',
            ],
        },
        part2: {
            title: 'A Skill You Learned',
            topic: 'an important skill you learned recently',
            prompts: [
                'what the skill was',
                'when and how you learned it',
                'who helped or taught you',
                'and explain how this skill has helped you in life',
            ],
        },
        part3: {
            title: 'Lifelong Learning & Adaptability',
            questions: [
                'Why has lifelong learning become essential in the modern workforce?',
                'What role do practical skills play compared to academic degrees?',
                'How will artificial intelligence transform the skills needed for future careers?',
                'Can older adults learn new digital tools as effectively as younger people?',
            ],
        },
    },
};

// Generic generator for books that don't have hardcoded bank entries
function generateFallbackTest(sourceType: 'cambridge' | 'mock_series', bookNumber: number, testNumber: number, category: 'academic' | 'general'): SpeakingTestData {
    const isCambridge = sourceType === 'cambridge';
    const displaySource = isCambridge ? `Cambridge IELTS ${bookNumber}` : `IELTS Dynasty Mock ${bookNumber}`;
    const testTitle = `${displaySource} Test ${testNumber}`;

    return {
        sourceType,
        bookNumber,
        testNumber,
        category,
        title: testTitle,
        part1: {
            title: `Part 1: Personal Interview (${isCambridge ? 'Cambridge ' + bookNumber : 'Mock ' + bookNumber})`,
            questions: [
                `Let's begin by discussing where you live. What kind of area is it?`,
                `What do you like most about your local community?`,
                `Do you often spend your weekends outdoors or indoors? Why?`,
                `How do you usually stay in touch with your friends and family?`,
                `Do you prefer taking trips to natural landscapes or visiting busy modern cities?`,
            ],
        },
        part2: {
            title: `Part 2: Long Turn — Cue Card (${testTitle})`,
            topic: `a significant project, trip, or personal accomplishment you are proud of`,
            prompts: [
                'what the project or accomplishment was',
                'when you worked on it or achieved it',
                'what challenges you had to overcome',
                'and explain why this achievement was important to you',
            ],
        },
        part3: {
            title: `Part 3: Discussion & Analysis (${testTitle})`,
            questions: [
                'In what ways do personal challenges contribute to a person’s growth?',
                'How does modern society define success compared to previous generations?',
                'Should educational systems place more emphasis on resilience and teamwork?',
                'How do global communications influence the career ambitions of young people today?',
            ],
        },
    };
}

/**
 * Fetch speaking questions for a specific test from Supabase,
 * with fallback to the authentic Cambridge question bank.
 */
export async function fetchSpeakingExamData(
    sourceType: 'cambridge' | 'mock_series',
    bookNumber: number,
    testNumber: number,
    category: 'academic' | 'general' = 'academic'
): Promise<SpeakingTestData> {
    const key = `${sourceType}-${bookNumber}-${testNumber}`;
    const fallback = CAMBRIDGE_SPEAKING_BANK[key]
        ? {
            sourceType,
            bookNumber,
            testNumber,
            category,
            ...CAMBRIDGE_SPEAKING_BANK[key],
        }
        : generateFallbackTest(sourceType, bookNumber, testNumber, category);

    try {
        const { data, error } = await supabase
            .from('speaking_questions')
            .select('*')
            .eq('source_type', sourceType)
            .eq('book_or_set_number', bookNumber)
            .eq('test_number', testNumber);

        const rows = (data || []) as any[];
        if (rows.length === 0) {
            return fallback;
        }

        const part1Row = rows.find((r: any) => r.part_number === 1);
        const part2Row = rows.find((r: any) => r.part_number === 2);
        const part3Row = rows.find((r: any) => r.part_number === 3);

        const parsePrompts = (raw: any): string[] => {
            if (Array.isArray(raw)) return raw;
            if (typeof raw === 'string') {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                } catch {
                    return [raw];
                }
            }
            return [];
        };

        return {
            sourceType,
            bookNumber,
            testNumber,
            category,
            title: `${sourceType === 'cambridge' ? 'Cambridge' : 'Mock'} ${bookNumber} Test ${testNumber}`,
            part1: {
                title: part1Row?.topic_title || fallback.part1.title,
                questions: part1Row ? parsePrompts(part1Row.prompts) : fallback.part1.questions,
            },
            part2: {
                title: part2Row?.topic_title || fallback.part2.title,
                topic: part2Row?.cue_card_topic || fallback.part2.topic,
                prompts: part2Row ? parsePrompts(part2Row.prompts) : fallback.part2.prompts,
            },
            part3: {
                title: part3Row?.topic_title || fallback.part3.title,
                questions: part3Row ? parsePrompts(part3Row.prompts) : fallback.part3.questions,
            },
        };
    } catch (err) {
        console.warn('Supabase speaking questions fetch failed, using authentic fallback:', err);
        return fallback;
    }
}
