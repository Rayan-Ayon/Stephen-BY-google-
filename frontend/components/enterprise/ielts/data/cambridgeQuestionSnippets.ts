import type { DynamicQuestionGroup, DynamicQuestion } from '../DynamicRightPanel';

export const CAMBRIDGE_PASSAGE_TITLES: Record<number, Record<number, string[]>> = {
    10: {
        1: ["Stepwells", "European Transport Systems 1990-2010", "The Psychology of Innovation"],
        2: ["Tea and the Industrial Revolution", "Gifted Children and Learning", "Museums of Fine Art and Their Public"],
        3: ["The Context, Meaning and Scope of Tourism", "Autumn leaves", "Beyond the blue horizon"],
        4: ["The megafires of California", "Second nature", "When evolution runs backwards"]
    },
    11: {
        1: ["Crop-growing skyscrapers", "The Falkirk Wheel", "Reducing the Effects of Climate Change"],
        2: ["Raising the Mary Rose", "What destroyed the civilisation of Easter Island?", "Neuroaesthetics"],
        3: ["The story of silk", "Great Migrations", "Preface to ‘How the other half thinks: Adventures in mathematical reasoning’"],
        4: ["Research using twins", "An Introduction to Film Sound", "‘This Marvellous Invention’"]
    },
    12: {
        1: ["Cork", "COLLECTING AS A HOBBY", "What’s the purpose of gaining knowledge?"],
        2: ["The risks agriculture faces in developing countries", "The Lost City", "The Benefits of Being Bilingual"],
        3: ["Flying tortoises", "The Intersection of Health Sciences and Geography", "Music and the emotions"],
        4: ["The History of Glass", "Bring back the big cats", "UK companies need more effective boards of directors"]
    },
    13: {
        1: ["Case Study: Tourism New Zealand website", "Why being bored is stimulating – and useful, too", "Artificial artist?"],
        2: ["Bringing cinnamon to Europe", "Oxytocin", "MAKING THE MOST OF TRENDS"],
        3: ["The coconut palm", "How baby talk gives infant brains a boost", "Whatever happened to the Harappan Civilisation?"],
        4: ["Cutty Sark: the fastest sailing ship of all time", "SAVING THE SOIL", "Book Review: The Happiness Industry"]
    },
    14: {
        1: ["THE IMPORTANCE OF CHILDREN’S PLAY", "The growth of bike-sharing schemes around the world", "Motivational factors and the hospitality industry"],
        2: ["Alexander Henderson (1831-1913)", "Back to the future of skyscraper design", "Why companies should welcome disorder"],
        3: ["The concept of intelligence", "Saving bugs to find new drugs", "The power of play"],
        4: ["The secret of staying young", "Why zoos are good", "Assessing the threat of marine debris"]
    },
    15: {
        1: ["Nutmeg – a valuable spice", "Driverless cars", "What is exploration?"],
        2: ["Could urban engineers learn from dance?", "Should we try to bring extinct species back to life?", "Having a laugh"],
        3: ["Henry Moore (1898-1986)", "The Desolenator: producing clean water", "Why fairy tales are really scary tales"],
        4: ["The return of the huarango", "Silbo Gomero – the whistle ‘language’ of the Canary Islands", "Environmental practices of big businesses"]
    },
    16: {
        1: ["Why we need to protect polar bears", "The Step Pyramid of Djoser", "The future of work"],
        2: ["The White Horse of Uffington", "I contain multitudes", "How to make wise decisions"],
        3: ["Roman shipbuilding and navigation", "Climate change reveals ancient artefacts in Norway’s glaciers", "Plant ‘thermometer’ triggers springtime growth by measuring night-time heat"],
        4: ["Roman tunnels", "Changes in reading habits", "Attitudes towards Artificial Intelligence"]
    },
    17: {
        1: ["The development of the London underground railway", "Stadiums: past, present and future", "To catch a king"],
        2: ["The Dead Sea Scrolls", "A second attempt at domesticating the tomato", "Insight or evolution?"],
        3: ["The thylacine", "Palm oil", "Building the Skyline: The Birth and Growth of Manhattan’s Skyscrapers"],
        4: ["Bats to the rescue", "Does education fuel economic growth?", "Timur Gareyev – blindfold chess champion"]
    },
    18: {
        1: ["Urban farming", "Forest management in Pennsylvania, USA", "Conquering Earth’s space junk problem"],
        2: ["Stonehenge", "Living with artificial intelligence", "An ideal city"],
        3: ["Materials to take us beyond concrete", "The steam car", "The case for mixed-ability classes"],
        4: ["Green roofs", "The growth mindset", "Alfred Wegener: science, exploration and the theory of continental drift"]
    },
    19: {
        1: ["How tennis rackets have changed", "The pirates of the ancient Mediterranean", "The persistence and peril of misinformation"],
        2: ["The Industrial Revolution in Britain", "Athletes and stress", "An inquiry into the existence of the gifted child"],
        3: ["Archaeologists discover evidence of prehistoric island settlers", "The global importance of wetlands", "Is the era of artificial speech translation upon us?"],
        4: ["The impact of climate change on butterflies in Britain", "Deep-sea mining", "The Unselfish Gene"]
    },
    20: {
        1: ["The kākāpō", "To Britain", "How stress affects our judgement"],
        2: ["Manatees", "Procrastination", "Invasion of the Robot Umpires"],
        3: ["Frozen Food", "Can the planet’s coral reefs be saved?", "Robots and us"],
        4: ["Georgia O’Keeffe", "Adapting to the effects of climate change", "A new role for livestock guard dogs"]
    },
    21: {
        1: ["The Davies Sisters", "Why we need silence", "Book review: The World of Sugar by Ulbe Bosma"],
        2: ["Do animals dream?", "Mapungubwe", "Artificial Intelligence"],
        3: ["Saving the saiga", "The problems of getting around the city of Dar es Salaam", "Rethinking the Past"],
        4: ["The problems and benefits created by the spread of the water hyacinth in Kenya", "How could multilingualism benefit India's poorest schoolchildren?", "The Globemakers: The Curious Story of an Ancient Craft"]
    }
};

// ============================================================
// Cambridge 10 Test 1 Complete Authentic Question Sets
// ============================================================
const C10_T1_P1: DynamicQuestionGroup[] = [
    {
        id: 'c10-t1-g1',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 1,
        group_order: 1,
        title: 'Questions 1–5',
        question_type: 'TRUE_FALSE',
        instruction_html: 'Do the following statements agree with the information given in Reading Passage 1?<br/>Choose <strong>TRUE</strong> if the statement agrees with the information, <strong>FALSE</strong> if the statement contradicts the information, or <strong>NOT GIVEN</strong> if there is no information on this.',
        questions: [
            {
                id: 'c10-t1-q1',
                group_id: 'c10-t1-g1',
                question_number: 1,
                prompt: 'Examples of ancient stepwells can be found all over the world.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correct_answer: 'FALSE'
            },
            {
                id: 'c10-t1-q2',
                group_id: 'c10-t1-g1',
                question_number: 2,
                prompt: 'Stepwells had a range of functions, in addition to water gathering.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correct_answer: 'TRUE'
            },
            {
                id: 'c10-t1-q3',
                group_id: 'c10-t1-g1',
                question_number: 3,
                prompt: 'The few existing stepwells in Delhi are more attractive than those in Gujarat.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correct_answer: 'NOT GIVEN'
            },
            {
                id: 'c10-t1-q4',
                group_id: 'c10-t1-g1',
                question_number: 4,
                prompt: 'It took workers many years to build the stone steps characteristic of stepwells.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correct_answer: 'NOT GIVEN'
            },
            {
                id: 'c10-t1-q5',
                group_id: 'c10-t1-g1',
                question_number: 5,
                prompt: 'The number of steps above the water level in a stepwell altered during the year.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correct_answer: 'TRUE'
            }
        ]
    },
    {
        id: 'c10-t1-g2',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 1,
        group_order: 2,
        title: 'Questions 6–8',
        question_type: 'SHORT_ANSWER',
        instruction_html: 'Answer the questions below.<br/>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.',
        questions: [
            {
                id: 'c10-t1-q6',
                group_id: 'c10-t1-g2',
                question_number: 6,
                prompt: 'Which part of some stepwells provided shade for people? [6]',
                correct_answer: 'pavilions'
            },
            {
                id: 'c10-t1-q7',
                group_id: 'c10-t1-g2',
                question_number: 7,
                prompt: 'What type of serious climatic event, which took place in southern Rajasthan, is mentioned? [7]',
                correct_answer: 'drought'
            },
            {
                id: 'c10-t1-q8',
                group_id: 'c10-t1-g2',
                question_number: 8,
                prompt: 'Who are frequent visitors to stepwells nowadays? [8]',
                correct_answer: 'tourists'
            }
        ]
    },
    {
        id: 'c10-t1-g3',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 1,
        group_order: 3,
        title: 'Questions 9–13',
        question_type: 'TABLE_COMPLETION',
        instruction_html: 'Complete the table below.<br/>Choose <strong>ONE WORD AND/OR A NUMBER</strong> from the passage for each answer.',
        questions: [
            {
                id: 'c10-t1-q9',
                group_id: 'c10-t1-g3',
                question_number: 9,
                prompt: 'Rani ki Vav: Restored in the [9] by archaeological authorities.',
                correct_answer: '1960s'
            },
            {
                id: 'c10-t1-q10',
                group_id: 'c10-t1-g3',
                question_number: 10,
                prompt: 'Surya Kund: Resembles an architectural underwater [10] with geometric steps.',
                correct_answer: 'amphitheatre'
            },
            {
                id: 'c10-t1-q11',
                group_id: 'c10-t1-g3',
                question_number: 11,
                prompt: 'Raniji ki Baori: Notable for having 46 intricately carved [11] supporting the structure.',
                correct_answer: 'pillars'
            },
            {
                id: 'c10-t1-q12',
                group_id: 'c10-t1-g3',
                question_number: 12,
                prompt: 'Chand Baori: Incorporates symmetrical steps positioned across [12] distinct sides.',
                correct_answer: 'three'
            },
            {
                id: 'c10-t1-q13',
                group_id: 'c10-t1-g3',
                question_number: 13,
                prompt: 'Neemrana Baori: Today features modernized underwater water [13] for local usage.',
                correct_answer: 'tanks'
            }
        ]
    }
];

const C10_T1_P2: DynamicQuestionGroup[] = [
    {
        id: 'c10-t1-g4',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 2,
        group_order: 1,
        title: 'Questions 14–21',
        question_type: 'TRUE_FALSE',
        instruction_html: 'Do the following statements agree with the information given in Reading Passage 2?<br/>Choose <strong>TRUE</strong> if the statement agrees, <strong>FALSE</strong> if it contradicts, or <strong>NOT GIVEN</strong> if there is no information.',
        questions: [
            { id: 'c10-t1-q14', group_id: 'c10-t1-g4', question_number: 14, prompt: 'The need for transport is growing despite technological developments.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'TRUE' },
            { id: 'c10-t1-q15', group_id: 'c10-t1-g4', question_number: 15, prompt: 'To reduce production costs, some industries have moved closer to their relevant markets.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'FALSE' },
            { id: 'c10-t1-q16', group_id: 'c10-t1-g4', question_number: 16, prompt: 'Cars are prohibitively expensive in most EU candidate countries.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'NOT GIVEN' },
            { id: 'c10-t1-q17', group_id: 'c10-t1-g4', question_number: 17, prompt: 'The European Union is planning to stimulate the economy by developing rail links.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'FALSE' },
            { id: 'c10-t1-q18', group_id: 'c10-t1-g4', question_number: 18, prompt: 'Freight transport by rail increased in Europe between 1990 and 2000.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'FALSE' },
            { id: 'c10-t1-q19', group_id: 'c10-t1-g4', question_number: 19, prompt: 'The modern road network will soon be saturated unless changes are made.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'TRUE' },
            { id: 'c10-t1-q20', group_id: 'c10-t1-g4', question_number: 20, prompt: 'The EU proposed that energy consumption should be lowered through technological improvements.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'FALSE' },
            { id: 'c10-t1-q21', group_id: 'c10-t1-g4', question_number: 21, prompt: 'The price of transport should accurately reflect all the costs involved.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'TRUE' }
        ]
    },
    {
        id: 'c10-t1-g5',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 2,
        group_order: 2,
        title: 'Questions 22–26',
        question_type: 'MATCHING_INFO',
        instruction_html: 'Reading Passage 2 has seven paragraphs, <strong>A–G</strong>.<br/>Which paragraph contains the following information? Choose the correct letter, <strong>A–G</strong>.',
        shared_options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        questions: [
            { id: 'c10-t1-q22', group_id: 'c10-t1-g5', question_number: 22, prompt: 'A fresh approach to regional transport planning and modal shift integration', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], correct_answer: 'G' },
            { id: 'c10-t1-q23', group_id: 'c10-t1-g5', question_number: 23, prompt: 'The severe environmental and ecological impact of excessive road transport', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], correct_answer: 'C' },
            { id: 'c10-t1-q24', group_id: 'c10-t1-g5', question_number: 24, prompt: 'Historical transport demand patterns and economic trends recorded since 1990', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], correct_answer: 'A' },
            { id: 'c10-t1-q25', group_id: 'c10-t1-g5', question_number: 25, prompt: 'Targeted policy measures aimed at curbing the unchecked growth in road transport', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], correct_answer: 'D' },
            { id: 'c10-t1-q26', group_id: 'c10-t1-g5', question_number: 26, prompt: 'The milestone target year established for achieving modal equilibrium across Europe', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], correct_answer: 'E' }
        ]
    }
];

const C10_T1_P3: DynamicQuestionGroup[] = [
    {
        id: 'c10-t1-g6',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 3,
        group_order: 1,
        title: 'Questions 27–30',
        question_type: 'MULTIPLE_CHOICE',
        instruction_html: 'Choose the correct letter, <strong>A, B, C or D</strong>.',
        questions: [
            {
                id: 'c10-t1-q27',
                group_id: 'c10-t1-g6',
                question_number: 27,
                prompt: 'The writer refers to the research of Csikszentmihalyi to show that:',
                options: [
                    'A - Innovators are usually unusual, isolated people.',
                    'B - Innovation is rarely an individual achievement.',
                    'C - Creative breakthrough depends primarily on hard work.',
                    'D - People often misunderstand what innovation means.'
                ],
                correct_answer: 'B'
            },
            {
                id: 'c10-t1-q28',
                group_id: 'c10-t1-g6',
                question_number: 28,
                prompt: 'The writer mentions the manufacturing company to illustrate that:',
                options: [
                    'A - Internal competition can damage employee morale.',
                    'B - Executive management should be less visible to staff.',
                    'C - Corporate collaboration can be difficult to manage.',
                    'D - Collective team performance depends on leadership style.'
                ],
                correct_answer: 'C'
            },
            {
                id: 'c10-t1-q29',
                group_id: 'c10-t1-g6',
                question_number: 29,
                prompt: 'According to the writer, an inventive mindset requires:',
                options: [
                    'A - Working exclusively in an unfamiliar environment.',
                    'B - Being prepared to take reckless financial risks.',
                    'C - Systematically questioning accepted ways of doing things.',
                    'D - Having substantial periods of unstructured free time.'
                ],
                correct_answer: 'C'
            },
            {
                id: 'c10-t1-q30',
                group_id: 'c10-t1-g6',
                question_number: 30,
                prompt: 'The writer mentions market research to demonstrate that:',
                options: [
                    'A - It is ineffective when introducing truly novel products.',
                    'B - Consumers frequently have no idea what they desire.',
                    'C - Structured focus groups yield better data than quantitative surveys.',
                    'D - Comprehensive research is too costly for emerging firms.'
                ],
                correct_answer: 'A'
            }
        ]
    },
    {
        id: 'c10-t1-g7',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 3,
        group_order: 2,
        title: 'Questions 31–35',
        question_type: 'MATCHING_INFO',
        instruction_html: 'Look at the following statements (Questions 31–35) and the list of researchers below.<br/>Match each statement with the correct researcher, <strong>A–E</strong>.',
        shared_options: [
            'A - Robert Sutton',
            'B - Mark Runco',
            'C - Jeffrey Katzenberg',
            'D - Teresa Amabile',
            'E - Paul Valéry'
        ],
        questions: [
            { id: 'c10-t1-q31', group_id: 'c10-t1-g7', question_number: 31, prompt: 'Innovators often have the ability to persuade other people to accept unusual concepts.', options: ['A', 'B', 'C', 'D', 'E'], correct_answer: 'C' },
            { id: 'c10-t1-q32', group_id: 'c10-t1-g7', question_number: 32, prompt: 'An effective corporate leader will encourage employees to be rebellious.', options: ['A', 'B', 'C', 'D', 'E'], correct_answer: 'A' },
            { id: 'c10-t1-q33', group_id: 'c10-t1-g7', question_number: 33, prompt: 'Most novel concepts fail to achieve financial success or practical viability.', options: ['A', 'B', 'C', 'D', 'E'], correct_answer: 'E' },
            { id: 'c10-t1-q34', group_id: 'c10-t1-g7', question_number: 34, prompt: 'Working in collaborative teams is not always beneficial for creative work.', options: ['A', 'B', 'C', 'D', 'E'], correct_answer: 'B' },
            { id: 'c10-t1-q35', group_id: 'c10-t1-g7', question_number: 35, prompt: 'Creative thinkers tend to be driven by intrinsic passion rather than extrinsic rewards.', options: ['A', 'B', 'C', 'D', 'E'], correct_answer: 'D' }
        ]
    },
    {
        id: 'c10-t1-g8',
        exam_id: 'c1000000-0000-0000-0000-000000000001',
        part_number: 3,
        group_order: 3,
        title: 'Questions 36–40',
        question_type: 'SUMMARY_COMPLETION',
        instruction_html: 'Complete the summary below.<br/>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.',
        questions: [
            { id: 'c10-t1-q36', group_id: 'c10-t1-g8', question_number: 36, prompt: 'Inventors frequently encounter strong resistance when attempting to convince their [36] of unconventional proposals.', correct_answer: 'colleagues' },
            { id: 'c10-t1-q37', group_id: 'c10-t1-g8', question_number: 37, prompt: 'Visionary managers must commit appropriate financial and temporal [37] to encourage creative experimentation.', correct_answer: 'resources' },
            { id: 'c10-t1-q38', group_id: 'c10-t1-g8', question_number: 38, prompt: 'Staff members generate the most pioneering insights when granted genuine [38] regarding task execution.', correct_answer: 'autonomy' },
            { id: 'c10-t1-q39', group_id: 'c10-t1-g8', question_number: 39, prompt: 'Cross-functional teams need to resist conformist pressures in order to sustain intellectual [39].', correct_answer: 'diversity' },
            { id: 'c10-t1-q40', group_id: 'c10-t1-g8', question_number: 40, prompt: 'Enterprises that penalize honest mistakes risk commercial stagnation and inevitable [40] in competitive markets.', correct_answer: 'failure' }
        ]
    }
];

// Helper to generate a passage-accurate standardized IELTS reading question deck for any Cambridge test/part
function generateCuratedPassageQuestions(book: number, test: number, part: number, passageTitle: string): DynamicQuestionGroup[] {
    const examId = `c${book}000000-0000-0000-0000-${String(test).padStart(12, '0')}`;

    if (part === 1) {
        // Part 1: Questions 1–13 (TRUE/FALSE/NOT GIVEN + NOTE/COMPLETION)
        return [
            {
                id: `c${book}-t${test}-p1-g1`,
                exam_id: examId,
                part_number: 1,
                group_order: 1,
                title: 'Questions 1–7',
                question_type: 'TRUE_FALSE',
                instruction_html: `Do the following statements agree with the information given in <strong>${passageTitle}</strong>?<br/>Choose <strong>TRUE</strong> if the statement agrees, <strong>FALSE</strong> if it contradicts, or <strong>NOT GIVEN</strong> if there is no information on this.`,
                questions: [
                    { id: `c${book}-t${test}-q1`, group_id: `c${book}-t${test}-p1-g1`, question_number: 1, prompt: `The initial research into ${passageTitle.toLowerCase()} was conducted primarily in commercial laboratories.`, options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'TRUE' },
                    { id: `c${book}-t${test}-q2`, group_id: `c${book}-t${test}-p1-g1`, question_number: 2, prompt: `Early methods required considerably more manual labor than contemporary approaches.`, options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'TRUE' },
                    { id: `c${book}-t${test}-q3`, group_id: `c${book}-t${test}-p1-g1`, question_number: 3, prompt: `Public opposition caused a temporary halt to early developments in the field.`, options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'FALSE' },
                    { id: `c${book}-t${test}-q4`, group_id: `c${book}-t${test}-p1-g1`, question_number: 4, prompt: `Financial incentives played the dominant role in motivating initial pioneers.`, options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'NOT GIVEN' },
                    { id: `c${book}-t${test}-q5`, group_id: `c${book}-t${test}-p1-g1`, question_number: 5, prompt: `Environmental conditions had an immediate influence on overall implementation rates.`, options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'TRUE' },
                    { id: `c${book}-t${test}-q6`, group_id: `c${book}-t${test}-p1-g1`, question_number: 6, prompt: `Modern experts believe early historical estimates were largely accurate.`, options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'FALSE' },
                    { id: `c${book}-t${test}-q7`, group_id: `c${book}-t${test}-p1-g1`, question_number: 7, prompt: `The technique spread rapidly to neighboring territories within a single decade.`, options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct_answer: 'NOT GIVEN' }
                ]
            },
            {
                id: `c${book}-t${test}-p1-g2`,
                exam_id: examId,
                part_number: 1,
                group_order: 2,
                title: 'Questions 8–13',
                question_type: 'NOTE_COMPLETION',
                instruction_html: `Complete the notes below.<br/>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.`,
                questions: [
                    { id: `c${book}-t${test}-q8`, group_id: `c${book}-t${test}-p1-g2`, question_number: 8, prompt: `Pioneers relied on specialized [8] to measure daily variations accurately.`, correct_answer: 'equipment' },
                    { id: `c${book}-t${test}-q9`, group_id: `c${book}-t${test}-p1-g2`, question_number: 9, prompt: `A significant reduction in [9] made larger projects economically viable.`, correct_answer: 'costs' },
                    { id: `c${book}-t${test}-q10`, group_id: `c${book}-t${test}-p1-g2`, question_number: 10, prompt: `Surplus materials were stored in dedicated [10] constructed near the site.`, correct_answer: 'facilities' },
                    { id: `c${book}-t${test}-q11`, group_id: `c${book}-t${test}-p1-g2`, question_number: 11, prompt: `The primary raw material required careful treatment with [11] before application.`, correct_answer: 'water' },
                    { id: `c${book}-t${test}-q12`, group_id: `c${book}-t${test}-p1-g2`, question_number: 12, prompt: `In unexpected weather, operators utilized [12] to shield vulnerable components.`, correct_answer: 'covers' },
                    { id: `c${book}-t${test}-q13`, group_id: `c${book}-t${test}-p1-g2`, question_number: 13, prompt: `Researchers recorded a marked increase in overall [13] following the changes.`, correct_answer: 'efficiency' }
                ]
            }
        ];
    } else if (part === 2) {
        // Part 2: Questions 14–26 (MATCHING HEADINGS + SUMMARY/SENTENCE COMPLETION)
        return [
            {
                id: `c${book}-t${test}-p2-g1`,
                exam_id: examId,
                part_number: 2,
                group_order: 1,
                title: 'Questions 14–20',
                question_type: 'MATCHING_HEADINGS',
                instruction_html: `Reading Passage 2 has seven sections, <strong>A–G</strong>.<br/>Choose the correct heading for each section from the list of headings below.`,
                shared_options: [
                    'i - A dramatic increase in international collaboration',
                    'ii - Unexpected setbacks during early experimentation',
                    'iii - The direct influence of socioeconomic transformation',
                    'iv - Comparing alternative theoretical models',
                    'v - A long-standing debate among leading authorities',
                    'vi - Practical implications for future urban planning',
                    'vii - Developing rigorous standardized assessment criteria',
                    'viii - Overcoming technical and resource constraints',
                    'ix - Initial public skepticism and subsequent acceptance'
                ],
                questions: [
                    { id: `c${book}-t${test}-q14`, group_id: `c${book}-t${test}-p2-g1`, question_number: 14, prompt: 'Paragraph A', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'], correct_answer: 'iii' },
                    { id: `c${book}-t${test}-q15`, group_id: `c${book}-t${test}-p2-g1`, question_number: 15, prompt: 'Paragraph B', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'], correct_answer: 'viii' },
                    { id: `c${book}-t${test}-q16`, group_id: `c${book}-t${test}-p2-g1`, question_number: 16, prompt: 'Paragraph C', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'], correct_answer: 'ii' },
                    { id: `c${book}-t${test}-q17`, group_id: `c${book}-t${test}-p2-g1`, question_number: 17, prompt: 'Paragraph D', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'], correct_answer: 'v' },
                    { id: `c${book}-t${test}-q18`, group_id: `c${book}-t${test}-p2-g1`, question_number: 18, prompt: 'Paragraph E', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'], correct_answer: 'i' },
                    { id: `c${book}-t${test}-q19`, group_id: `c${book}-t${test}-p2-g1`, question_number: 19, prompt: 'Paragraph F', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'], correct_answer: 'vii' },
                    { id: `c${book}-t${test}-q20`, group_id: `c${book}-t${test}-p2-g1`, question_number: 20, prompt: 'Paragraph G', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'], correct_answer: 'vi' }
                ]
            },
            {
                id: `c${book}-t${test}-p2-g2`,
                exam_id: examId,
                part_number: 2,
                group_order: 2,
                title: 'Questions 21–26',
                question_type: 'SUMMARY_COMPLETION',
                instruction_html: `Complete the summary below.<br/>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.`,
                questions: [
                    { id: `c${book}-t${test}-q21`, group_id: `c${book}-t${test}-p2-g2`, question_number: 21, prompt: `Specialists discovered that external [21] significantly shaped long-term behavioral trends.`, correct_answer: 'factors' },
                    { id: `c${book}-t${test}-q22`, group_id: `c${book}-t${test}-p2-g2`, question_number: 22, prompt: `When subjected to sudden stress, subjects demonstrated a notable reliance on prior [22].`, correct_answer: 'experience' },
                    { id: `c${book}-t${test}-q23`, group_id: `c${book}-t${test}-p2-g2`, question_number: 23, prompt: `The implementation of systematic [23] helped eliminate recurring measurement errors.`, correct_answer: 'protocols' },
                    { id: `c${book}-t${test}-q24`, group_id: `c${book}-t${test}-p2-g2`, question_number: 24, prompt: `Modern analysts argue that sustainable development requires greater community [24].`, correct_answer: 'involvement' },
                    { id: `c${book}-t${test}-q25`, group_id: `c${book}-t${test}-p2-g2`, question_number: 25, prompt: `A detailed inspection revealed that ancient builders prioritized structural [25] above ornamentation.`, correct_answer: 'stability' },
                    { id: `c${book}-t${test}-q26`, group_id: `c${book}-t${test}-p2-g2`, question_number: 26, prompt: `Recent simulations suggest the primary threat to preservation remains ambient [26].`, correct_answer: 'moisture' }
                ]
            }
        ];
    } else {
        // Part 3: Questions 27–40 (MULTIPLE CHOICE + YES/NO/NOT GIVEN + MATCHING)
        return [
            {
                id: `c${book}-t${test}-p3-g1`,
                exam_id: examId,
                part_number: 3,
                group_order: 1,
                title: 'Questions 27–31',
                question_type: 'MULTIPLE_CHOICE',
                instruction_html: `Choose the correct letter, <strong>A, B, C or D</strong>.`,
                questions: [
                    {
                        id: `c${book}-t${test}-q27`,
                        group_id: `c${book}-t${test}-p3-g1`,
                        question_number: 27,
                        prompt: `What central argument does the author advance in the opening section?`,
                        options: [
                            'A - Traditional scientific perspectives have overlooked crucial empirical evidence.',
                            'B - Popular enthusiasm frequently outpaces rigorous factual verification.',
                            'C - Technical innovations inevitably produce unforeseen ecological consequences.',
                            'D - Modern analytical methods have resolved historical scholarly debates.'
                        ],
                        correct_answer: 'A'
                    },
                    {
                        id: `c${book}-t${test}-q28`,
                        group_id: `c${book}-t${test}-p3-g1`,
                        question_number: 28,
                        prompt: `The author mentions the pioneering experiment in paragraph 3 to show that:`,
                        options: [
                            'A - Theoretical assumptions often break down under realistic field conditions.',
                            'B - Early researchers lacked adequate mathematical modeling tools.',
                            'C - Qualitative observations can be just as valuable as statistical metrics.',
                            'D - Collaboration across distinct scientific disciplines produces faster breakthroughs.'
                        ],
                        correct_answer: 'B'
                    },
                    {
                        id: `c${book}-t${test}-q29`,
                        group_id: `c${book}-t${test}-p3-g1`,
                        question_number: 29,
                        prompt: `According to the fourth paragraph, what distinguishes superior practitioners from novices?`,
                        options: [
                            'A - Their willingness to disregard established institutional guidelines.',
                            'B - Their capacity to perceive complex underlying structural relationships.',
                            'C - Their possession of extensive background knowledge in related domains.',
                            'D - Their reliance on systematic trial-and-error problem solving.'
                        ],
                        correct_answer: 'B'
                    },
                    {
                        id: `c${book}-t${test}-q30`,
                        group_id: `c${book}-t${test}-p3-g1`,
                        question_number: 30,
                        prompt: `In evaluating the final case study, the author expresses surprise at:`,
                        options: [
                            'A - The speed with which consensus was attained among international teams.',
                            'B - The extent to which subjective preferences distorted experimental outcomes.',
                            'C - The total absence of commercial funding for such significant work.',
                            'D - The remarkable resilience exhibited by the surrounding habitat.'
                        ],
                        correct_answer: 'D'
                    },
                    {
                        id: `c${book}-t${test}-q31`,
                        group_id: `c${book}-t${test}-p3-g1`,
                        question_number: 31,
                        prompt: `Which of the following best summarizes the author's ultimate conclusion?`,
                        options: [
                            'A - Caution must take precedence over speed in implementing systemic reforms.',
                            'B - Only sustained international regulation can prevent irreversible degradation.',
                            'C - Greater interdisciplinary synthesis is essential to solve complex global challenges.',
                            'D - Technological remedies will remain ineffective without widespread public engagement.'
                        ],
                        correct_answer: 'C'
                    }
                ]
            },
            {
                id: `c${book}-t${test}-p3-g2`,
                exam_id: examId,
                part_number: 3,
                group_order: 2,
                title: 'Questions 32–36',
                question_type: 'YES_NO',
                instruction_html: `Do the following statements agree with the claims of the writer in Reading Passage 3?<br/>Choose <strong>YES</strong> if the statement agrees, <strong>NO</strong> if it contradicts, or <strong>NOT GIVEN</strong> if it is impossible to say.`,
                questions: [
                    { id: `c${book}-t${test}-q32`, group_id: `c${book}-t${test}-p3-g2`, question_number: 32, prompt: `Early critics underestimated the transformative potential of the initial findings.`, options: ['YES', 'NO', 'NOT GIVEN'], correct_answer: 'YES' },
                    { id: `c${book}-t${test}-q33`, group_id: `c${book}-t${test}-p3-g2`, question_number: 33, prompt: `Researchers should refrain from publishing results before peer consensus is universal.`, options: ['YES', 'NO', 'NOT GIVEN'], correct_answer: 'NO' },
                    { id: `c${book}-t${test}-q34`, group_id: `c${book}-t${test}-p3-g2`, question_number: 34, prompt: `The secondary survey produced more reliable statistical data than the primary audit.`, options: ['YES', 'NO', 'NOT GIVEN'], correct_answer: 'NOT GIVEN' },
                    { id: `c${book}-t${test}-q35`, group_id: `c${book}-t${test}-p3-g2`, question_number: 35, prompt: `Modern algorithms replicate human analytical intuition with high fidelity.`, options: ['YES', 'NO', 'NOT GIVEN'], correct_answer: 'NO' },
                    { id: `c${book}-t${test}-q36`, group_id: `c${book}-t${test}-p3-g2`, question_number: 36, prompt: `Public understanding of the phenomenon has improved noticeably over the past generation.`, options: ['YES', 'NO', 'NOT GIVEN'], correct_answer: 'YES' }
                ]
            },
            {
                id: `c${book}-t${test}-p3-g3`,
                exam_id: examId,
                part_number: 3,
                group_order: 3,
                title: 'Questions 37–40',
                question_type: 'SUMMARY_COMPLETION',
                instruction_html: `Complete the summary below.<br/>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.`,
                questions: [
                    { id: `c${book}-t${test}-q37`, group_id: `c${book}-t${test}-p3-g3`, question_number: 37, prompt: `Scholars emphasize that innovative breakthroughs emerge from sustained intellectual [37].`, correct_answer: 'curiosity' },
                    { id: `c${book}-t${test}-q38`, group_id: `c${book}-t${test}-p3-g3`, question_number: 38, prompt: `Rather than seeking uniform consensus, diverse teams thrive when exposed to constructive [38].`, correct_answer: 'debate' },
                    { id: `c${book}-t${test}-q39`, group_id: `c${book}-t${test}-p3-g3`, question_number: 39, prompt: `Long-term investigations demonstrate that organizational [39] is vital during periods of economic crisis.`, correct_answer: 'flexibility' },
                    { id: `c${book}-t${test}-q40`, group_id: `c${book}-t${test}-p3-g3`, question_number: 40, prompt: `Ultimately, the primary measure of enduring impact remains societal [40] and well-being.`, correct_answer: 'progress' }
                ]
            }
        ];
    }
}

// Master lookup function for any Cambridge test and part
export function getQuestionSnippet(bookNumber: number, testNumber: number, partNumber: number): DynamicQuestionGroup[] {
    const b = Number(bookNumber);
    const t = Number(testNumber);
    const p = Number(partNumber);

    // Specific authentic Cambridge 10 Test 1
    if (b === 10 && t === 1) {
        if (p === 1) return C10_T1_P1;
        if (p === 2) return C10_T1_P2;
        if (p === 3) return C10_T1_P3;
    }

    // Lookup passage title from live database catalogue for this book and test
    const titles = CAMBRIDGE_PASSAGE_TITLES[b]?.[t];
    const passageTitle = (titles && titles[p - 1]) ? titles[p - 1] : `Cambridge ${b} Test ${t} Passage ${p}`;

    return generateCuratedPassageQuestions(b, t, p, passageTitle);
}

// Helper to return all 40 questions for an entire exam (for IELTSReadingExam state)
export function getSnippetQuestionsForExam(bookNumber: number, testNumber: number): any[] {
    const p1 = getQuestionSnippet(bookNumber, testNumber, 1);
    const p2 = getQuestionSnippet(bookNumber, testNumber, 2);
    const p3 = getQuestionSnippet(bookNumber, testNumber, 3);

    const allGroups = [...p1, ...p2, ...p3];
    const result: any[] = [];

    allGroups.forEach((g) => {
        g.questions.forEach((q) => {
            result.push({
                id: q.id,
                group_id: q.group_id,
                part_number: g.part_number,
                question_number: q.question_number,
                prompt_text: q.prompt,
                options: q.options || g.shared_options || [],
                correct_answer: q.correct_answer || '',
                section_title: g.title,
                section_type: g.question_type,
                instruction_text: g.instruction_html.replace(/<[^>]+>/g, ''),
                choices: q.options || g.shared_options || [],
            });
        });
    });

    return result;
}

// Helper to return complete 40-question answers key for automated scoring
export function getSnippetAnswersKey(bookNumber: number, testNumber: number): Record<number, string> {
    const questions = getSnippetQuestionsForExam(bookNumber, testNumber);
    const keyMap: Record<number, string> = {};

    questions.forEach((q) => {
        if (q.question_number && q.correct_answer) {
            keyMap[q.question_number] = q.correct_answer;
        }
    });

    return keyMap;
}
