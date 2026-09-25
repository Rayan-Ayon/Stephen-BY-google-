import React, { useState, useRef, useEffect, useMemo } from 'react';
import { addAttempt, rawToBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';
import IeltsExamOptionsModal from '../../exam/IeltsExamOptionsModal';
import { supabase } from '../../../supabaseClient';
import DynamicRightPanel, { type DynamicQuestion } from './DynamicRightPanel';

// ── Icons ──
const Check = ({ size = 24, strokeWidth = 3, className = '' }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// ── Dictionary / Vocabulary Lookup Mock ──
const MOCK_DICTIONARY: Record<string, { pos: string; def: string }> = {
    bats: { pos: 'noun', def: 'Nocturnal flying mammals with forelimbs adapted as wings.' },
    navigation: { pos: 'noun', def: 'The act of accurately planning and directing a route.' },
    echolocation: { pos: 'noun', def: 'The location of objects by reflected sound, used by animals such as bats and dolphins.' },
    nocturnal: { pos: 'adjective', def: 'Done, occurring, or active at night.' },
    radar: { pos: 'noun', def: 'A system for detecting the presence, direction, distance, and speed of aircraft, ships, and other objects.' },
    sonar: { pos: 'noun', def: 'A system for the detection of objects underwater and for measuring the water depth by emitting sound pulses.' },
    aqueducts: { pos: 'noun', def: 'Artificial channels for conveying water, typically in the form of a bridge across a valley.' },
    perceive: { pos: 'verb', def: 'Become aware or conscious of something; come to realize or understand.' },
    suggestopedia: { pos: 'noun', def: 'A teaching method based on a modern understanding of how the human brain works and how we learn most effectively.' },
    placebo: { pos: 'noun', def: 'A measure designed to merely calm or please someone, or a substance with no inherent therapeutic value.' },
    subconscious: { pos: 'adjective', def: 'Of or concerning the part of the mind of which one is not fully aware but which influences one\'s actions.' },
    aquifers: { pos: 'noun', def: 'A body of permeable rock which can contain or transmit groundwater.' },
    irrigation: { pos: 'noun', def: 'The supply of water to land or crops to help growth, typically by means of channels.' },
    hydropower: { pos: 'noun', def: 'Hydroelectric power; power derived from the energy of falling or fast-running water.' },
    reiterated: { pos: 'verb', def: 'Say something again or a number of times, typically for emphasis or clarity.' },
    jeopardising: { pos: 'verb', def: 'Put someone or something into a situation in which there is a danger of loss, harm, or failure.' },
    elusive: { pos: 'adjective', def: 'Difficult to find, catch, or achieve.' },
    peripherally: { pos: 'adverb', def: 'At or near the edge or margin; in a secondary or minor way.' },
};

// ── Static Passages for Cambridge 7 Test 1 ──
const STATIC_PASSAGES: Record<number, { title: string; subtitle: string; content_html: string }> = {
    1: {
        title: "Let's Go Bats",
        subtitle: "13 questions • easy",
        content_html: `
<p><strong>A</strong><br/>Bats have a problem: how to find their way around in the dark. They hunt at night, and cannot use light to help them find prey and avoid obstacles. You might say that this is a problem of their own making, one that they could avoid simply by changing their habits and hunting by day. But the daytime economy is already heavily exploited by other creatures such as birds. Given that there is a living to be made at night, and given that alternative daytime trades are thoroughly occupied, natural selection has favoured bats that make a go of the night-hunting trade. It is probable that the nocturnal trades go way back in the ancestry of all mammals. In the time when the dinosaurs dominated the daytime economy, our mammalian ancestors probably only managed to survive at all because they found ways of scraping a living at night. Only after the mysterious mass extinction of the dinosaurs about 65 million years ago were our ancestors able to emerge into the daylight in any substantial numbers.</p>

<p><strong>B</strong><br/>Bats have an engineering problem: how to find their way and find their prey in the absence of light. Bats are not the only creatures to face this difficulty today. Obviously the night-flying insects that they prey on must find their way about somehow. Deep-sea fish and whales have little or no light by day or by night. Fish and dolphins that live in extremely muddy water cannot see because, although there is light, it is obstructed and scattered by the dirt in the water. Plenty of other modern animals make their living in conditions where seeing is difficult or impossible.</p>

<p><strong>C</strong><br/>Given the questions of how to manoeuvre in the dark, what solutions might an engineer consider? The first one that might occur to him is to manufacture light, to use a lantern or a searchlight. Fireflies and some fish (usually with the help of bacteria) have the power to manufacture their own light, but the process seems to consume a large amount of energy. Fireflies use their light for attracting mates. This doesn’t require a prohibitive amount of energy: a male’s tiny pinprick of light can be seen by a female from some distance on a dark night, since her eyes are exposed directly to the light source itself. However using light to find one’s own way around requires vastly more energy, since the eyes have to detect the tiny fraction of the light that bounces off each part of the scene.</p>

<p>The light source must therefore be immensely brighter if it is to be used as a headlight to illuminate the path, than if it is to be used as a signal to others. In any event, whether or not the reason is the energy expense, it seems to be the case that, with the possible exception of some weird deep-sea fish, no animal apart from man uses manufactured light to find its way about.</p>

<p><strong>D</strong><br/>What else might the engineer think of? Well, blind humans sometimes seem to have an uncanny sense of obstacles in their path. It has been given the name ‘facial vision’, because blind people have reported that it feels a bit like the sense of touch, on the face. One report tells of a totally blind boy who could ride his tricycle at good speed round the block near his home, using facial vision. Experiments showed that, in fact, facial vision is nothing to do with touch or the front of the face, although the sensation may be referred to the front of the face, like the referred pain in a phantom limb. The sensation of facial vision, it turns out, really goes in through the ears. Blind people, without even being aware of the fact, are actually using echoes of their own footsteps and of other sounds, to sense the presence of obstacles. Before this was discovered, engineers had already built instruments to exploit the principle, for example to measure the depth of the sea under a ship. After this technique had been invented, it was only a matter of time before weapons designers adapted it for the detection of submarines. Both sides in the Second World War relied heavily on these devices, under such codenames as Asdic (British) and Sonar (American), as well as Radar (American) or RDF (British), which uses radio echoes rather than sound echoes.</p>

<p><strong>E</strong><br/>The Sonar and Radar pioneers didn’t know it then, but all the world now knows that bats, or rather natural selection working on bats, had perfected the system tens of millions of years earlier, and their radar achieves feats of detection and navigation that would strike an engineer dumb with admiration. It is technically incorrect to talk about bat ‘radar’, since they do not use radio waves. It is sonar but the underlying mathematical theories of radar and sonar are very similar and much of our scientific understanding of the details of what bats are doing has come from applying radar theory to them. The American zoologist Donald Griffin, who was largely responsible for the discovery of sonar in bats, coined the term ‘echolocation’ to cover both sonar and radar, whether used by animals or by human instruments.</p>
        `,
    },
    2: {
        title: "Making Every Drop Count",
        subtitle: "13 questions • easy",
        content_html: `
<p><strong>A</strong><br/>The history of human civilisation is entwined with the history of the ways we have learned to manipulate water resources. As towns gradually expanded, water was brought from increasingly remote sources, leading to sophisticated engineering efforts such as dams and aqueducts. At the height of the Roman Empire, nine major systems, with an innovative layout of pipes and well-built sewers, supplied the occupants of Rome with as much water per person as is provided in many parts of the industrial world today.</p>

<p><strong>B</strong><br/>During the industrial revolution and population explosion of the 19th and 20th centuries, the demand for water rose dramatically. Unprecedented construction of tens of thousands of monumental engineering projects designed to control floods, protect clean water supplies, and provide water for irrigation and hydropower brought great benefits to hundreds of millions of people. Food production has kept pace with soaring populations mainly because of the expansion of artificial irrigation systems that make possible the growth of 40 % of the world’s food. Nearly one fifth of all the electricity generated worldwide is produced by turbines spun by the power of falling water.</p>

<p><strong>C</strong><br/>Yet there is a dark side to this picture: despite our progress, half of the world’s population still suffers, with water services inferior to those available to the ancient Greeks and Romans. As the United Nations report on access to water reiterated in November 2001, more than one billion people lack access to clean drinking water; some two and a half billion do not have adequate sanitation services. Preventable water-related diseases kill an estimated 10,000 to 20,000 children every day, and the latest evidence suggests that we are falling behind in efforts to solve these problems.</p>

<p><strong>D</strong><br/>The consequences of our water policies extend beyond jeopardising human health. Tens of millions of people have been forced to move from their homes – often with little warning or compensation – to make way for the reservoirs behind dams. More than 20 % of all freshwater fish species are now threatened or endangered because dams and water withdrawals have destroyed the free-flowing river ecosystems where they thrive. Certain irrigation practices degrade soil quality and reduce agricultural productivity. Groundwater aquifers are being pumped down faster than they are naturally replenished in parts of India, China, the USA and elsewhere. And disputes over shared water resources have led to violence and continue to raise local, national and even international tensions.</p>

<p><strong>E</strong><br/>At the outset of the new millennium, however, the way resource planners think about water is beginning to change. The focus is slowly shifting back to the provision of basic human and environmental needs as top priority – ensuring ‘some for all,’ instead of ‘more for some’. Some water experts are now demanding that existing infrastructure be used in smarter ways rather than building new facilities, which is increasingly considered the option of last, not first, resort. This shift in philosophy has not been universally accepted, and it comes with strong opposition from some established water organisations. Nevertheless, it may be the only way to address successfully the pressing problems of providing everyone with clean water to drink, adequate water to grow food and a life free from preventable water-related illness.</p>

<p><strong>F</strong><br/>Fortunately – and unexpectedly – the demand for water is not rising as rapidly as some predicted. As a result, the pressure to build new water infrastructures has diminished over the past two decades. Although population, industrial output and economic productivity have continued to soar in developed nations, the rate at which people withdraw water from aquifers, rivers and lakes has slowed. And in a few parts of the world, demand has actually fallen.</p>

<p><strong>G</strong><br/>What explains this remarkable turn of events? Two factors: people have figured out how to use water more efficiently, and communities are rethinking their priorities for water use. Throughout the first three-quarters of the 20th century, the quantity of freshwater consumed per person doubled on average; in the USA, water withdrawals increased tenfold while the population quadrupled. But since 1980, the amount of water consumed per person has actually decreased, thanks to a range of new technologies that help to conserve water in homes and industry. In 1965, for instance, Japan used approximately 13 million gallons of water to produce $1 million of commercial output; by 1989 this had dropped to 3.5 million gallons (even accounting for inflation) – almost a quadrupling of water productivity. In the USA, water withdrawals have fallen by more than 20 % from their peak in 1980.</p>

<p><strong>H</strong><br/>On the other hand, dams, aqueducts and other kinds of infrastructure will still have to be built, particularly in developing countries where basic human needs have not been met. But such projects must be built to higher specifications and with more accountability to local people and their environment than in the past. And even in regions where new projects seem warranted, we must find ways to meet demands with fewer resources, respecting ecological criteria and to a smaller budget.</p>
        `,
    },
    3: {
        title: "Educating Psyche",
        subtitle: "14 questions • easy",
        content_html: `
<p>Educating Psyche by Bernie Neville is a book which looks at radical new approaches to learning, describing the effects of emotion, imagination and the unconscious on learning. One theory discussed in the book is that proposed by George Lozanov, which focuses on the power of suggestion.</p>

<p>Lozanov’s instructional technique is based on the evidence that the connections made in the brain through unconscious processing (which he calls non-specific mental reactivity) are more durable than those made through conscious processing. Besides the laboratory evidence for this, we know from our experience that we often remember what we have perceived peripherally, long after we have forgotten what we set out to learn. If we think of a book we studied months or years ago, we will find it easier to recall peripheral details – the colour, the binding, the typeface, the table at the library where we sat while studying it – than the content on which we were concentrating. If we think of a lecture we listened to with great concentration, we will recall the lecturer’s appearance and mannerisms, our place in the auditorium, the failure of the air-conditioning, much more easily than the ideas we went to learn. Even if these peripheral details are a bit elusive, they come back readily in hypnosis or when we relive the event imaginatively, as in psychodrama. The details of the content of the lecture, on the other hand, seem to have gone forever.</p>

<p>This phenomenon can be partly attributed to the common counterproductive approach to study (making extreme efforts to memorise, tensing muscles, inducing fatigue), but it also simply reflects the way the brain functions. Lozanov therefore made indirect instruction (suggestion) central to his teaching system. In suggestopedia, as he called his method, consciousness is shifted away from the curriculum to focus on something peripheral. The curriculum then becomes peripheral and is dealt with by the reserve capacity of the brain.</p>

<p>The suggestopedic approach to foreign language learning provides a good illustration. In its most recent variant (1980), it consists of the reading of vocabulary and text while the class is listening to music. The first session is in two parts. In the first part, the music is classical (Mozart, Beethoven, Brahms) and the teacher reads the text slowly and solemnly, with attention to the dynamics of the music. The students follow the text in their books. This is followed by several minutes of silence. In the second part, they listen to baroque music (Bach, Corelli, Handel) while the teacher reads the text in a normal speaking voice. During this time they have their books closed. During the whole of this session, their attention is passive; they listen to the music but make no attempt to learn the material.</p>

<p>Beforehand, the students have been carefully prepared for the language learning experience. Through meeting with the staff and satisfied students they develop the expectation that learning will be easy and pleasant and that they will successfully learn several hundred words of the foreign language during the class. In a preliminary talk, the teacher introduces them to the material to be covered, but does not ‘teach’ it. Likewise, the students are instructed not to try to learn it during this introduction.</p>

<p>Some hours after the two-part session, there is a follow-up class at which the students are stimulated to recall the material presented. Once again the approach is indirect. The students do not focus their attention on trying to remember the vocabulary, but focus on using the language to communicate (e.g. through games or improvised dramatisations). Such methods are not unusual in language teaching. What is distinctive in the suggestopedic method is that they are devoted entirely to assist recall. The ‘learning’ of the material is assumed to be automatic and effortless, accomplished while listening to music. The teacher’s task is to assist the students to apply what they have learned paraconsciously, and in doing so to make it easily accessible to consciousness. Another difference from conventional teaching is the evidence that students can regularly learn 1000 new words of a foreign language during a suggestopedic session, as well as grammar and idiom.</p>

<p>Lozanov experimented with teaching by direct suggestion during sleep, hypnosis and trance states, but found such procedures unnecessary. Hypnosis, yoga, Silva mind-control, religious ceremonies and faith healing are all associated with successful suggestion, but none of their techniques seem to be essential to it. Such rituals may be seen as placebos. Lozanov acknowledges that the ritual surrounding suggestion in his own system is also a placebo, but maintains that without such a placebo people are unable or afraid to tap the reserve capacity of their brains. Like any placebo, it must be dispensed with authority to be effective. Just as a doctor calls on the full power of autocratic suggestion by insisting that the patient take precisely this white capsule precisely three times a day before meals, Lozanov is categoric in insisting that the suggestopedic session be conducted exactly in the manner designated, by trained and accredited suggestopedic teachers.</p>

<p>While suggestopedia has gained some notoriety through success in the teaching of modern languages, few teachers are able to emulate the spectacular results of Lozanov and his associates. We can, perhaps, attribute mediocre results to an inadequate placebo effect. The students have not developed the appropriate mind set. They are often not motivated to learn through this method. They do not have enough ‘faith’. They do not see it as ‘real teaching’, especially as it does not seem to involve the ‘work’ they have learned to believe is essential to learning.</p>
        `,
    }
};

// ── Headings List for Part 2 Module 1 ──
const PART_2_HEADINGS = [
    "Scientists' call for revision of policy",
    "Addressing the concern over increasing populations",
    "The financial cost of recent technological improvements",
    "The need to raise standards",
    "An explanation for reduced water use",
    "A description of ancient water supplies",
    "Environmental effects",
    "A surprising downward trend in demand for water",
    "The relevance to health"
];

// ── Questions 21-26 Yes/No/Not Given ──
const PART_2_YES_NO = [
    {
        num: 21,
        text: "Water use per person is higher in the industrial world than it was in Ancient Rome.",
        options: ["NOT GIVEN", "YES", "NO"],
    },
    {
        num: 22,
        text: "Feeding increasing populations is possible due primarily to improved irrigation systems.",
        options: ["NOT GIVEN", "YES", "NO"],
    },
    {
        num: 23,
        text: "Modern water systems imitate those of the ancient Greeks and Romans.",
        options: ["NO", "NOT GIVEN", "YES"],
    },
    {
        num: 24,
        text: "Industrial growth is increasing the overall demand for water.",
        options: ["NO", "NOT GIVEN", "YES"],
    },
    {
        num: 25,
        text: "Modern technologies have led to reduction in the domestic water consumption.",
        options: ["NOT GIVEN", "YES", "NO"],
    },
    {
        num: 26,
        text: "In the future, governments should maintain ownership of water infrastructures.",
        options: ["NO", "NOT GIVEN", "YES"],
    },
];

// ── Part 3 Questions 27-30 Multiple Choice ──
const PART_3_MCQ = [
    {
        num: 27,
        text: "The book Educating Psyche is mainly concerned with",
        options: [
            "a particular technique for leaning based on emotions",
            "ways of learning which are not traditional",
            "the power of suggestion in learning",
            "the effects of emotion on the imagination and the unconscious",
        ],
    },
    {
        num: 28,
        text: "Lozanov’s theory claims that, when we try to remember things,",
        options: [
            "peripheral vision is not important",
            "unimportant details are the easiest to recall",
            "concentrating hard produces the best results",
            "the most significant facts are most easily recalled",
        ],
    },
    {
        num: 29,
        text: "In this passage, the author uses the examples of a book and a lecture to illustrate that",
        options: [
            "reading is a better technique for learning than listening",
            "both these are important for developing concentration",
            "we can remember things more easily under hypnosis",
            "his theory about methods of learning is valid",
        ],
    },
    {
        num: 30,
        text: "Lozanov claims that teachers should train students to",
        options: [
            "think about something other than the curriculum content",
            "avoid overloading the capacity of the brain",
            "develop their own sets of indirect instructions",
            "memorise details of the curriculum",
        ],
    },
];

// ── Part 3 Questions 31-36 True/False/Not Given ──
const PART_3_TRUE_FALSE = [
    {
        num: 31,
        text: "In the example of suggestopedic teaching in the fourth paragraph, the only variable that changes is the music.",
        options: ["NOT GIVEN", "TRUE", "FALSE"],
    },
    {
        num: 32,
        text: "Prior to the suggestopedia class, students are made aware that the language experience will be demanding.",
        options: ["FALSE", "NOT GIVEN", "TRUE"],
    },
    {
        num: 33,
        text: "In the follow-up class, the teaching activities are similar to those used in conventional classes.",
        options: ["FALSE", "NOT GIVEN", "TRUE"],
    },
    {
        num: 34,
        text: "As an indirect benefit, students notice improvements in their memory.",
        options: ["NOT GIVEN", "TRUE", "FALSE"],
    },
    {
        num: 35,
        text: "Teachers say they prefer suggestopedia to traditional approaches to language teaching.",
        options: ["NOT GIVEN", "TRUE", "FALSE"],
    },
    {
        num: 36,
        text: "Students in a suggestopedia class retain more new vocabulary than those in ordinary classes.",
        options: ["NOT GIVEN", "TRUE", "FALSE"],
    },
];

// ── Part 3 Questions 37-40 Choices ──
const PART_3_SUMMARY_CHOICES = [
    "placebo", "ritual", "teaching", "appropriate", "lesson", "involved",
    "authoritarian", "unpopular", "spectacular", "well known", "unspectacular"
];

// ── Static Answers Key (Cambridge 7 Test 1) ──
const STATIC_ANSWERS_KEY: Record<number, string> = {
    1: 'D', 2: 'A', 3: 'B', 4: 'A', 5: 'C',
    6: 'phantom', 7: 'echoes', 8: 'depth', 9: 'submarines',
    10: 'natural selection', 11: 'radio waves', 12: 'mathematical theories', 13: 'zoologist',
    14: 'A description of ancient water supplies',
    15: 'The relevance to health',
    16: 'Environmental effects',
    17: "Scientists' call for revision of policy",
    18: 'A surprising downward trend in demand for water',
    19: 'An explanation for reduced water use',
    20: 'The need to raise standards',
    21: 'NO',
    22: 'YES',
    23: 'NOT GIVEN',
    24: 'NO',
    25: 'YES',
    26: 'NOT GIVEN',
    27: 'ways of learning which are not traditional',
    28: 'unimportant details are the easiest to recall',
    29: 'his theory about methods of learning is valid',
    30: 'think about something other than the curriculum content',
    31: 'FALSE',
    32: 'FALSE',
    33: 'TRUE',
    34: 'NOT GIVEN',
    35: 'NOT GIVEN',
    36: 'TRUE',
    37: 'ritual',
    38: 'placebo',
    39: 'spectacular',
    40: 'unspectacular',
};

// ── Cambridge 7 Test 2 Static Question Schema ──
export const CAMBRIDGE_7_TEST_2_RIGHT_PANEL = {
    part1: {
        title: "Secrets of Pagoda Stability",
        subtitle: "13 questions • medium",
        module1: {
            title: "Questions 1-4",
            badge: "YES-NO/NOT GIVEN",
            instructions: "Choose YES if the statement agrees with the information given in the text, choose NO if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.",
            questions: [
                { num: 1, text: "Only two Japanese pagodas have collapsed in 1400 years.", options: ["NO", "NOT GIVEN", "YES"] },
                { num: 2, text: "The Hanshin earthquake of 1995 destroyed the pagoda at the Toji temple.", options: ["NO", "NOT GIVEN", "YES"] },
                { num: 3, text: "The other buildings near the Toji pagoda had been built in the last 30 years.", options: ["NO", "NOT GIVEN", "YES"] },
                { num: 4, text: "The builders of pagodas knew how to absorb some of the power produced by severe weather conditions.", options: ["NOT GIVEN", "YES", "NO"] },
            ],
        },
        module2: {
            title: "Questions 5-10",
            badge: "MATCHING FEATURES",
            instructions: "Choose the correct answer for each item. You may choose any answer more than once.",
            choices: [
                "only Chinese pagodas",
                "only Japanese pagodas",
                "both Chinese and Japanese pagodas",
            ],
            questions: [
                { num: 5, text: "easy interior access to top" },
                { num: 6, text: "tiles on eaves" },
                { num: 7, text: "use as observation post" },
                { num: 8, text: "size of eaves up to half the width of the building" },
                { num: 9, text: "original religious purpose" },
                { num: 10, text: "floors fitting loosely over each other" },
            ],
        },
        module3: {
            title: "Questions 11-13",
            badge: "MULTIPLE CHOICE",
            instructions: "Choose the correct answer.",
            questions: [
                {
                    num: 11,
                    text: "In a Japanese pagoda, the shinbashira",
                    options: [
                        "bends under pressure like a tree",
                        "connects the floors with the foundations",
                        "stops the floors moving too far",
                        "bears the full weight of the building",
                    ],
                },
                {
                    num: 12,
                    text: "Shuzo Ishida performs experiments in order to",
                    options: [
                        "understand ancient mathematics",
                        "improve skyscraper design",
                        "be able to build new pagodas",
                        "learn about the dynamics of pagodas",
                    ],
                },
                {
                    num: 13,
                    text: "The storeys of a Japanese pagoda are",
                    options: [
                        "fitted loosely on top of each other",
                        "joined by special weights",
                        "linked only by wood",
                        "fastened only to the central pillar",
                    ],
                },
            ],
        },
    },
    part2: {
        title: "True Cost of Food",
        subtitle: "13 questions • medium",
        module1: {
            title: "Questions 14-17",
            badge: "MATCHING INFORMATION",
            instructions: "The text has seven sections A-G. Which section contains the following information? Choose the correct sections A-G. You may choose any answer more than once.",
            choices: ["A", "B", "C", "D", "E", "F", "G"],
            questions: [
                { num: 14, text: "a cost involved in purifying domestic water" },
                { num: 15, text: "the stages in the development of the farming industry" },
                { num: 16, text: "the term used to describe hidden costs" },
                { num: 17, text: "one effect of chemicals on water sources" },
            ],
        },
        module2: {
            title: "Questions 18-21",
            badge: "YES-NO/NOT GIVEN",
            instructions: "Choose YES if the statement agrees with the information given in the text, choose NO if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.",
            questions: [
                { num: 18, text: "Several species of wildlife in the British countryside are declining.", options: ["NOT GIVEN", "YES", "NO"] },
                { num: 19, text: "The taste of food has deteriorated in recent years.", options: ["NO", "NOT GIVEN", "YES"] },
                { num: 20, text: "The financial costs of environmental damage are widely recognised.", options: ["NOT GIVEN", "YES", "NO"] },
                { num: 21, text: "One of the costs calculated by Professor Pretty was illness caused by food.", options: ["NO", "NOT GIVEN", "YES"] },
            ],
        },
        module3: {
            title: "Questions 22-26",
            badge: "SUMMARY COMPLETION WOC",
            instructions: "Complete the summary. Write NO MORE THAN THREE WORDS from the text for each answer.",
        },
    },
    part3: {
        title: "Integrated Transport in Makete",
        subtitle: "14 questions • medium",
        module1: {
            title: "Questions 27-30",
            badge: "MATCHING HEADING",
            instructions: "The text has six sections. Choose the correct heading for each section and move it into the gap.",
            choices: [
                "Co-operation of district officials",
                "Role of wheelbarrows and donkeys",
                "Transport improvements in the northern part of the district",
                "Preference for motorised vehicles",
                "Effects of initial MIRTP measures",
                "MIRTP as a future model",
                "Identifying the main transport problems",
                "Initial improvements in mobility and transport modes",
                "Improvements in the rail network",
            ],
            questions: [
                { num: 27, label: "Section B" },
                { num: 28, label: "Section C" },
                { num: 29, label: "Section E" },
                { num: 30, label: "Section F" },
            ],
        },
        module2: {
            title: "Questions 31-35",
            badge: "YES-NO/NOT GIVEN",
            instructions: "Choose YES if the statement agrees with the information given in the text, choose NO if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.",
            questions: [
                { num: 31, text: "MIRTP was divided into five phases.", options: ["NO", "NOT GIVEN", "YES"] },
                { num: 32, text: "Prior to the start of the MIRTP the Makete district was almost inaccessible during the rainy season.", options: ["NO", "NOT GIVEN", "YES"] },
                { num: 33, text: "Phase I of MIRTP consisted of a survey of household expenditure on transport.", options: ["NOT GIVEN", "YES", "NO"] },
                { num: 34, text: "The survey concluded that one-fifth or 20% of the household transport requirement was outside the local area.", options: ["NOT GIVEN", "YES", "NO"] },
                { num: 35, text: "MIRTP hopes to improve the movements of goods from Makete district to the country’s capital.", options: ["NOT GIVEN", "YES", "NO"] },
            ],
        },
        module3: {
            title: "Questions 36-39",
            badge: "MATCHING SENTENCE ENDINGS",
            instructions: "Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.",
            choices: [
                "cost less than locally made wheelbarrows.",
                "provided the people of Makete with experience in running bus and truck services.",
                "was thought to be the most important objective of Phase III.",
                "was done only at the request of local people who were willing to lend a hand.",
                "hindered attempts to make the existing transport services more efficient.",
                "was at first considered by MIRTP to be affordable for the people of the district.",
                "improved paths used for transport up and down hillsides.",
                "was especially successful in the northern part of the district.",
                "was no longer a problem once the roads had been improved.",
                "differed from earlier phases in that the community became less actively involved.",
            ],
            questions: [
                { num: 36, text: "Construction of footbridges, steps and handrails" },
                { num: 37, text: "Frequent breakdown of buses and trucks in Makete" },
                { num: 38, text: "The improvement of secondary roads and paths" },
                { num: 39, text: "The isolation of Makete for part of the year" },
            ],
        },
        module4: {
            title: "Question 40",
            badge: "MULTIPLE CHOICE",
            instructions: "Choose the correct answer.",
            question: {
                num: 40,
                text: "Which of the following phrases best describes the main aim of Reading Passage 3?",
                options: [
                    "to warn that projects such as MIRTP are likely to have serious problems",
                    "to examine how MIRTP promoted the use of donkeys",
                    "to describe how MIRTP was implemented and how successful it was",
                    "to suggest that projects such as MIRTP are needed in other countries",
                ],
            },
        },
    },
};

// ── Static Answers Key (Cambridge 7 Test 2) ──
export const CAMBRIDGE_7_TEST_2_ANSWERS_KEY: Record<number, string> = {
    1: 'YES',
    2: 'NO',
    3: 'NOT GIVEN',
    4: 'YES',
    5: 'only Chinese pagodas',
    6: 'both Chinese and Japanese pagodas',
    7: 'only Chinese pagodas',
    8: 'only Japanese pagodas',
    9: 'both Chinese and Japanese pagodas',
    10: 'only Japanese pagodas',
    11: 'stops the floors moving too far',
    12: 'learn about the dynamics of pagodas',
    13: 'fitted loosely on top of each other',
    14: 'E',
    15: 'F',
    16: 'B',
    17: 'C',
    18: 'YES',
    19: 'NOT GIVEN',
    20: 'NO',
    21: 'YES',
    22: 'food bills',
    23: 'intensive farming',
    24: 'organic farming',
    25: 'Greener Food Standard',
    26: 'farmers and consumers',
    27: 'Identifying the main transport problems',
    28: 'Initial improvements in mobility and transport modes',
    29: 'Effects of initial MIRTP measures',
    30: 'MIRTP as a future model',
    31: 'NO',
    32: 'YES',
    33: 'NOT GIVEN',
    34: 'NO',
    35: 'NOT GIVEN',
    36: 'was done only at the request of local people who were willing to lend a hand.',
    37: 'hindered attempts to make the existing transport services more efficient.',
    38: 'improved paths used for transport up and down hillsides.',
    40: 'to describe how MIRTP was implemented and how successful it was',
};

// ── Cambridge 7 Test 3 Static Question Schema ──
export const CAMBRIDGE_7_TEST_3_RIGHT_PANEL = {
    part1: {
        title: "Ant Intelligence",
        subtitle: "13 questions • easy",
        module1: {
            title: "Questions 1-6",
            badge: "TRUE-FALSE/NOT GIVEN",
            instructions: "Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.",
            questions: [
                { num: 1, text: "Ants use the same channels of communication as humans do.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 2, text: "City life is one factor that encourages the development of intelligence.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 3, text: "Ants can build large cities more quickly than humans do.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 4, text: "Some ants can find their way by making calculations based on distance and position.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 5, text: "In one experiment, foraging teams were able to use their sense of smell to find food.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 6, text: "The essay 'In the company of ants' explores ant communication.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
            ],
        },
        module2: {
            title: "Questions 7-13",
            badge: "SUMMARY COMPLETION WC",
            instructions: "Complete the summary using the list of words. Choose the correct answer and move it into the gap.",
            headerBox: "Ants as farmers",
            choices: [
                "growing", "energy", "aphids", "other species", "cellulose",
                "secretions", "fungi", "fertilizers", "interbreeding", "environment",
                "exchanging", "food", "agricultural", "sustainable", "natural",
            ],
        },
    },
    part2: {
        title: "Population Migration and Genes",
        subtitle: "13 questions • easy",
        module1: {
            title: "Questions 14-19",
            badge: "MATCHING HEADING",
            instructions: "The text has seven sections. Choose the correct heading for each section and move it into the gap.",
            choices: [
                "How analysis of blood-variants measures the closeness of the relationship between different populations",
                "Developments in the methods used to study early population movements",
                "Long-standing questions about prehistoric migration to America",
                "Further genetic evidence relating to the three-wave theory",
                "Indian migration from Canada to the U.S.A.",
                "The results of the research into blood-variants",
                "Dental evidence",
                "Questions about the causes of prehistoric migration to America",
                "Greenberg’s analysis of the dental and linguistic evidence",
            ],
            questions: [
                { num: 14, label: "Passage A" },
                { num: 15, label: "Passage B" },
                { num: 16, label: "Passage C" },
                { num: 17, label: "Passage D" },
                { num: 18, label: "Passage E" },
                { num: 19, label: "Passage F" },
            ],
            example: "Ex: Section G : Conflicting views of the three-wave theory, based on non-genetic Evidence",
        },
        module2: {
            title: "Questions 20-21",
            badge: "MATCHING FEATURES",
            instructions: "Choose the correct answer for each item. The discussion of Williams’s research indicates the periods at which early people are thought to have migrated along certain routes. There are six routes, A-F, marked on the map below.",
            choices: ["A", "B", "C", "D", "E", "F"],
            questions: [
                { num: 20, text: "15,000 or more" },
                { num: 21, text: "600 to 700" },
            ],
        },
        module3: {
            title: "Questions 22-25",
            badge: "MATCHING FEATURES",
            instructions: "Choose the correct answer for each item. You may choose any answer more than once.",
            choices: ["the first wave", "the second wave", "the third wave"],
            questions: [
                { num: 22, text: "Inuit" },
                { num: 23, text: "Apache" },
                { num: 24, text: "Pima-Papago" },
                { num: 25, text: "Ticuna" },
            ],
        },
        module4: {
            title: "Question 26",
            badge: "MULTIPLE CHOICE",
            instructions: "Choose the correct answer.",
            question: {
                num: 26,
                text: "Christy Turner’s research involved the examination of",
                options: [
                    "dental specimens from the majority of prehistoric American",
                    "the eating habits of American and Asian populations",
                    "teeth from both prehistoric and modern Americans and Asians",
                    "thousands of people who live in either the New of the Old World",
                ],
            },
        },
    },
    part3: {
        title: "Protecting Europe’s Forests",
        subtitle: "14 questions • easy",
        module1: {
            title: "Questions 27-33",
            badge: "TRUE-FALSE/NOT GIVEN",
            instructions: "Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.",
            questions: [
                { num: 27, text: "Forest problems of Mediterranean countries are to be discussed at the next meeting of experts.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 28, text: "Problems in Nordic countries were excluded because they are outside the European Economic Community.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 29, text: "Forests are a renewable source of raw material.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 30, text: "The biological functions of forests were recognised only in the twentieth century.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 31, text: "Natural forests still exist in parts of Europe.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 32, text: "Forest policy should be limited by national boundaries.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 33, text: "The Strasbourg conference decided that a forest policy must allow for the possibility of change.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
            ],
        },
        module2: {
            title: "Questions 34-39",
            badge: "MATCHING FEATURES",
            instructions: "Choose the correct answer for each item.",
            choices: [
                "The surviving natural forests of Europe do not need priority treatment.",
                "Soil imbalances such as acidification should be treated with compounds of nitrogen and sulphur.",
                "Skiing should be encouraged in thinly populated areas.",
                "Information is to be systematically gathered on any decline in the condition of forests.",
                "All kinds of species of trees should be preserved.",
                "Information on forest fires should be collected and shared.",
                "Resources should be allocated to research into tree diseases",
                "Research is to be better co-ordinate throughout Europe.",
                "Loss Of leaves from trees should be more extensively and carefully monitored.",
                "Fragile mountain forests should be given priority in research programs.",
            ],
            questions: [
                { num: 34, label: "Resolution 1" },
                { num: 35, label: "Resolution 2" },
                { num: 36, label: "Resolution 3" },
                { num: 37, label: "Resolution 4" },
                { num: 38, label: "Resolution 5" },
                { num: 39, label: "Resolution 6" },
            ],
        },
        module3: {
            title: "Question 40",
            badge: "MULTIPLE CHOICE",
            instructions: "Choose the correct answer.",
            question: {
                num: 40,
                text: "What is the best title for Reading Passage?",
                options: [
                    "Proposals for a world-wide policy on forest management",
                    "The biological, economic and recreational role of forests",
                    "Plans to protect the forests of Europe",
                    "The priority of European research into ecosystems",
                ],
            },
        },
    },
};

// ── Static Answers Key (Cambridge 7 Test 3) ──
export const CAMBRIDGE_7_TEST_3_ANSWERS_KEY: Record<number, string> = {
    1: 'FALSE',
    2: 'TRUE',
    3: 'NOT GIVEN',
    4: 'TRUE',
    5: 'NOT GIVEN',
    6: 'TRUE',
    7: 'cellulose',
    8: 'secretions',
    9: 'fertilizers',
    10: 'exchanging',
    11: 'sustainable',
    12: 'environment',
    13: 'energy',
    14: 'Further genetic evidence relating to the three-wave theory',
    15: 'Dental evidence',
    16: 'Developments in the methods used to study early population movements',
    17: 'Greenberg’s analysis of the dental and linguistic evidence',
    18: 'How analysis of blood-variants measures the closeness of the relationship between different populations',
    19: 'The results of the research into blood-variants',
    20: 'E',
    21: 'D',
    22: 'the second wave',
    23: 'the third wave',
    24: 'the first wave',
    25: 'the first wave',
    26: 'teeth from both prehistoric and modern Americans and Asians',
    27: 'NOT GIVEN',
    28: 'FALSE',
    29: 'TRUE',
    30: 'FALSE',
    31: 'TRUE',
    32: 'FALSE',
    33: 'TRUE',
    34: 'Information is to be systematically gathered on any decline in the condition of forests.',
    35: 'Research is to be better co-ordinate throughout Europe.',
    36: 'Information on forest fires should be collected and shared.',
    37: 'Fragile mountain forests should be given priority in research programs.',
    38: 'All kinds of species of trees should be preserved.',
    39: 'Soil imbalances such as acidification should be treated with compounds of nitrogen and sulphur.',
    40: 'Plans to protect the forests of Europe',
};

// ── Cambridge 7 Test 4 Static Question Schema ──
export const CAMBRIDGE_7_TEST_4_RIGHT_PANEL = {
    part1: {
        title: "Wind-Powered Pyramid Building",
        subtitle: "13 questions • easy",
        module1: {
            title: "Questions 1-7",
            badge: "TRUE-FALSE/NOT GIVEN",
            instructions: "Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.",
            questions: [
                { num: 1, text: "It is generally believed that large numbers of people were needed to build the pyramids.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 2, text: "Clemmons found a strange hieroglyph on the wall of an Egyptian monument.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 3, text: "Gharib had previously done experiments on bird flight.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 4, text: "Gharib and Graff tested their theory before applying it.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 5, text: "The success of the actual experiment was due to the high speed of the wind.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 6, text: "They found that, as the kite flew higher, the wind force got stronger.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 7, text: "The team decided that it was possible to use kites to raise very heavy stones.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
            ],
        },
        module2: {
            title: "Questions 8-13",
            badge: "SUMMARY COMPLETION WOC",
            instructions: "Complete the summary. Write NO MORE THAN TWO WORDS from the text for each answer.",
            headerBox: "Addition evidence for theory of kite lifting",
        },
    },
    part2: {
        title: "Endless Harvest",
        subtitle: "13 questions • easy",
        module1: {
            title: "Questions 14-20",
            badge: "TRUE-FALSE/NOT GIVEN",
            instructions: "Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.",
            questions: [
                { num: 14, text: "The inhabitants of the Aleutian islands renamed their islands Aleyska", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 15, text: "Alaska’s fisheries are owned by some of the world’s largest companies.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 16, text: "Life in Alaska is dependent on salmon.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 17, text: "Ninety per cent of all Pacific salmon caught are sockeye or pink salmon.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 18, text: "More than 320,000 tonnes of salmon were caught in Alaska in 2000.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
                { num: 19, text: "Between 1940 and 1959, there was a sharp decrease in Alaska’s salmon population.", options: ["NOT GIVEN", "TRUE", "FALSE"] },
                { num: 20, text: "During the 1990s, the average number of salmon caught each year was 100 million.", options: ["FALSE", "NOT GIVEN", "TRUE"] },
            ],
        },
        module2: {
            title: "Questions 21-26",
            badge: "MATCHING SENTENCE ENDINGS",
            instructions: "Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.",
            choices: [
                "to stop fish from spawning",
                "to label their products using the MSC logo.",
                "to freeze a huge number of salmon eggs.",
                "to deny certification to the Alaska fisheries.",
                "to be successful.",
                "to recognise fisheries that care for the environment.",
                "to stop people fishing for sport.",
                "to assist the subsistence communities in the region.",
                "to ensure that fish numbers are sufficient to permit fishing.",
                "to close down all fisheries.",
                "to set up environmental protection laws.",
            ],
            questions: [
                { num: 21, text: "In Alaska, biologists keep a check on adult fish" },
                { num: 22, text: "Biologists have the authority" },
                { num: 23, text: "In-Season Abundance-Based Management has allowed the Alaska salmon fisheries" },
                { num: 24, text: "The Marine Stewardship Council (MSC) was established" },
                { num: 25, text: "As a result of the collapse of the salmon runs in 1999, the state decided" },
                { num: 26, text: "In September 2000, the MSC allowed seven Alaska salmon companies" },
            ],
        },
    },
    part3: {
        title: "Effects of Noise",
        subtitle: "14 questions • easy",
        module1: {
            title: "Questions 27-29",
            badge: "MULTIPLE CHOICE",
            instructions: "Choose the correct answer.",
            questions: [
                {
                    num: 27,
                    text: "The writer suggests that people may have difficulty sleeping in the mountains because",
                    options: [
                        "they may be exposed to short bursts of very strange sounds.",
                        "humans prefer to hear a certain amount of noise while they sleep.",
                        "they may have adapted to a higher noise level in the city.",
                        "humans do not prefer peace and quiet to noise.",
                    ],
                },
                {
                    num: 28,
                    text: "In noise experiments, Glass and Singer found that",
                    options: [
                        "physiological arousal prevents the ability to work.",
                        "bursts of noise do not seriously disrupt problem-solving in the long term.",
                        "the physiological arousal of control subjects declined quickly.",
                        "problem-solving is much easier under quiet conditions.",
                    ],
                },
                {
                    num: 29,
                    text: "Researchers discovered that high noise levels are not likely to interfere with the",
                    options: [
                        "tasks of pilots or air traffic controllers.",
                        "ability to repeal numbers while tracking moving lines.",
                        "ability to monitor three dials at once.",
                        "successful performance of a single task.",
                    ],
                },
            ],
        },
        module2: {
            title: "Questions 30-34",
            badge: "SUMMARY COMPLETION WC",
            instructions: "Complete the summary using the list of words. Choose the correct answer and move it into the gap. You may use any words more than once.",
            choices: [
                "intense", "different types of", "unexpected", "the same amount of",
                "performed at about the same level as", "made more mistakes than",
                "no control over", "performed better than", "no", "showed more irritation than",
            ],
        },
        module3: {
            title: "Questions 35-40",
            badge: "MATCHING FEATURES",
            instructions: "Choose the correct answer for each item. You may choose any answer more than once.",
            choices: [
                "Glass and Singer", "None of the above", "Broadbent", "Finkelman and Glass", "Cohen et al.",
            ],
            questions: [
                { num: 35, text: "Subjects exposed to noise find it difficult at first to concentrate on problem-solving tasks" },
                { num: 36, text: "Long-term exposure to noise can produce changes in behavior which can still be observed a year later." },
                { num: 37, text: "The problems associated with exposure to noise do not arise if the subject knows they can make it stop." },
                { num: 38, text: "Exposure to high-pitched noise results in more errors than exposure to low-pitched noise" },
                { num: 39, text: "Subjects find it difficult to perform three tasks at the same time when exposed to noise" },
                { num: 40, text: "Noise affects a subject’s capacity to repeat numbers while carrying out another task." },
            ],
        },
    },
};

export const CAMBRIDGE_7_TEST_4_ANSWERS_KEY: Record<number, string> = {
    1: 'TRUE',
    2: 'FALSE',
    3: 'NOT GIVEN',
    4: 'TRUE',
    5: 'FALSE',
    6: 'NOT GIVEN',
    7: 'TRUE',
    8: 'wooden pulleys',
    9: 'stone',
    10: 'accomplished sailors',
    11: 'modern glider',
    12: 'flight',
    13: 'messages',
    14: 'TRUE',
    15: 'FALSE',
    16: 'TRUE',
    17: 'NOT GIVEN',
    18: 'FALSE',
    19: 'TRUE',
    20: 'FALSE',
    21: 'to ensure that fish numbers are sufficient to permit fishing.',
    22: 'to close down all fisheries.',
    23: 'to be successful.',
    24: 'to recognise fisheries that care for the environment.',
    25: 'to assist the subsistence communities in the region.',
    26: 'to label their products using the MSC logo.',
    27: 'they may have adapted to a higher noise level in the city.',
    28: 'bursts of noise do not seriously disrupt problem-solving in the long term.',
    29: 'successful performance of a single task.',
    30: 'unexpected',
    31: 'the same amount of',
    32: 'performed at about the same level as',
    33: 'made more mistakes than',
    34: 'unexpected',
    35: 'Glass and Singer',
    36: 'Cohen et al.',
    37: 'Glass and Singer',
    38: 'None of the above',
    39: 'Broadbent',
    40: 'Finkelman and Glass',
};

// ── Data Interfaces ──
export interface SupabaseQuestionItem {
    id: string;
    passage_id: string;
    part?: 1 | 2 | 3;
    part_number?: 1 | 2 | 3 | number;
    question_number: number;
    question_type: string;
    section_title?: string;
    section_type?: string;
    instruction_text?: string;
    title_text?: string;
    prompt_text?: string;
    choices?: any;
    example_text?: string;
    correct_answer?: string;
}

const normalize = (s: string) => s.trim().toLowerCase();

interface IELTSReadingExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
    onActiveChange?: (active: boolean) => void;
    onExit?: () => void;
    exitPulse?: boolean;
    sourceType?: 'cambridge' | 'mock_series';
    category?: 'academic' | 'general';
    bookNumber?: number;
    testNumber?: number;
}

const IELTSReadingExam: React.FC<IELTSReadingExamProps> = ({
    candidateEmail,
    simulation,
    onActiveChange,
    onExit,
    sourceType = 'cambridge',
    category = 'academic',
    bookNumber = 7,
    testNumber = 1,
}) => {
    const [testState, setTestState] = useState<'lobby' | 'active' | 'evaluating' | 'completed'>('active');
    const [activePart, setActivePart] = useState<1 | 2 | 3>(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [activeId, setActiveId] = useState<number>(1);
    
    // Split pane width %
    const [split, setSplit] = useState(50);
    const splitAreaRef = useRef<HTMLDivElement>(null);

    // Vocabulary lookup state
    const [vocabEnabled, setVocabEnabled] = useState(false);
    const [selectedVocab, setSelectedVocab] = useState<{ word: string; pos: string; def: string } | null>(null);

    const [showExitModal, setShowExitModal] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [score, setScore] = useState<number | null>(null);

    const isCambridge7Test1 = Number(bookNumber) === 7 && Number(testNumber) === 1;
    const isCambridge7Test2 = Number(bookNumber) === 7 && Number(testNumber) === 2;
    const isCambridge7Test3 = Number(bookNumber) === 7 && Number(testNumber) === 3;
    const isCambridge7Test4 = Number(bookNumber) === 7 && Number(testNumber) === 4;
    const testDifficulty = Number(testNumber) === 1 ? 'easy' : Number(testNumber) === 4 ? 'hard' : 'medium';

    // Supabase Data Fetching State
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [examId, setExamId] = useState<string | null>(null);
    const [passages, setPassages] = useState<any[]>([]);
    const [questions, setQuestions] = useState<SupabaseQuestionItem[]>([]);
    const [answersKey, setAnswersKey] = useState<Record<number, string>>(
        isCambridge7Test4
            ? CAMBRIDGE_7_TEST_4_ANSWERS_KEY
            : isCambridge7Test3
            ? CAMBRIDGE_7_TEST_3_ANSWERS_KEY
            : isCambridge7Test2
            ? CAMBRIDGE_7_TEST_2_ANSWERS_KEY
            : STATIC_ANSWERS_KEY
    );

    // Question Refs for scrolling
    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const timeLimit = simulation ? simulation.timeLimitSeconds : 60 * 60;
    const locked = testState !== 'active';
    const remaining = Math.max(0, timeLimit - elapsed);
    const lowTime = remaining <= 300;

    useEffect(() => {
        setAnswersKey(
            isCambridge7Test4
                ? CAMBRIDGE_7_TEST_4_ANSWERS_KEY
                : isCambridge7Test3
                ? CAMBRIDGE_7_TEST_3_ANSWERS_KEY
                : isCambridge7Test2
                ? CAMBRIDGE_7_TEST_2_ANSWERS_KEY
                : STATIC_ANSWERS_KEY
        );
    }, [isCambridge7Test2, isCambridge7Test3, isCambridge7Test4]);

    // Fetch dynamic exam, passages, and questions from Supabase in background
    useEffect(() => {
        let isMounted = true;
        async function loadSupabaseExamData() {
            try {
                // 1. Fetch Exam
                const { data: examData, error: examErr } = await supabase
                    .from('exams')
                    .select('*')
                    .ilike('title', `%Cambridge ${bookNumber}%`)
                    .eq('test_number', Number(testNumber))
                    .maybeSingle();

                if (examErr || !examData) {
                    if (isMounted) setExamId(null);
                    return;
                }

                if (isMounted) {
                    setExamId((examData as any).id);
                }

                // 2. Fetch Passages
                const { data: passageData, error: passageErr } = await supabase
                    .from('passages')
                    .select('*')
                    .eq('exam_id', (examData as any).id)
                    .order('part_number', { ascending: true });

                if (passageErr) {
                    console.error('Supabase Passages Query Error:', passageErr);
                }

                // 3. Fetch Questions dynamically via sections & question_groups
                const examUuid = (examData as any).id;
                let questionData: any[] = [];
                try {
                    const { data: secData } = await supabase
                        .from('sections')
                        .select('id')
                        .or(`exam_id.eq.${examUuid},test_id.eq.${examUuid}`);

                    const secIds = (secData || []).map((s: any) => s.id);
                    if (secIds.length > 0) {
                        const { data: qgData } = await supabase
                            .from('question_groups')
                            .select('id')
                            .in('section_id', secIds);

                        const groupIds = (qgData || []).map((g: any) => g.id);
                        if (groupIds.length > 0) {
                            const { data: qs } = await supabase
                                .from('questions')
                                .select('*')
                                .in('group_id', groupIds)
                                .order('question_number', { ascending: true });
                            questionData = qs || [];
                        }
                    }
                } catch (qErr) {
                    console.warn('Note on relational question prefetch:', qErr);
                }

                if (isMounted) {
                    if (passageData && passageData.length > 0) setPassages(passageData);
                    if (questionData && questionData.length > 0) setQuestions(questionData);

                    const keyMap: Record<number, string> = {
                        ...(isCambridge7Test4
                            ? CAMBRIDGE_7_TEST_4_ANSWERS_KEY
                            : isCambridge7Test3
                            ? CAMBRIDGE_7_TEST_3_ANSWERS_KEY
                            : isCambridge7Test2
                            ? CAMBRIDGE_7_TEST_2_ANSWERS_KEY
                            : STATIC_ANSWERS_KEY),
                    };
                    (questionData || []).forEach((q: any) => {
                        if (q.question_number && q.correct_answer) {
                            keyMap[q.question_number] = q.correct_answer;
                        }
                    });
                    setAnswersKey(keyMap);
                }
            } catch (err) {
                console.error('Error fetching Supabase exam data:', err);
            }
        }

        loadSupabaseExamData();
        return () => {
            isMounted = false;
        };
    }, [bookNumber, testNumber, isCambridge7Test2, isCambridge7Test3, isCambridge7Test4]);

    useEffect(() => {
        if (testState !== 'active') return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [testState]);

    useEffect(() => {
        onActiveChange?.(testState === 'active' || testState === 'evaluating');
    }, [testState, onActiveChange]);

    // Resizable Splitter
    const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rect = splitAreaRef.current?.getBoundingClientRect();
        if (!rect) return;
        const move = (ev: PointerEvent) => {
            const pct = ((ev.clientX - rect.left) / rect.width) * 100;
            setSplit(Math.min(70, Math.max(30, pct)));
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    };

    const setAnswer = (id: number, value: string) => {
        if (locked) return;
        setAnswers((prev) => ({ ...prev, [id]: value }));
        setActiveId(id);
    };

    const handleExit = () => {
        setShowExitModal(false);
        if (simulation?.onExit) {
            simulation.onExit();
        } else if (onExit) {
            onExit();
        } else {
            setTestState('lobby');
        }
    };

    const submit = () => {
        if (locked) return;
        setTestState('evaluating');
        window.setTimeout(() => {
            let correct = 0;
            for (let id = 1; id <= 40; id++) {
                const userAns = normalize(answers[id] || '');
                const expected = normalize(
                    answersKey[id] ||
                    (isCambridge7Test4
                        ? CAMBRIDGE_7_TEST_4_ANSWERS_KEY[id]
                        : isCambridge7Test3
                        ? CAMBRIDGE_7_TEST_3_ANSWERS_KEY[id]
                        : isCambridge7Test2
                        ? CAMBRIDGE_7_TEST_2_ANSWERS_KEY[id]
                        : STATIC_ANSWERS_KEY[id]) || ''
                );
                if (!userAns || !expected) continue;

                if (userAns === expected) {
                    correct++;
                    continue;
                }

                if (isCambridge7Test2) {
                    if (id === 11 && (userAns === 'c' || userAns.startsWith('c.'))) correct++;
                    else if (id === 12 && (userAns === 'd' || userAns.startsWith('d.'))) correct++;
                    else if (id === 13 && (userAns === 'a' || userAns.startsWith('a.'))) correct++;
                    else if (id === 40 && (userAns === 'c' || userAns.startsWith('c.'))) correct++;
                    else if (id === 22 && (userAns === 'food bills' || userAns === 'costs' || userAns === 'food costs')) correct++;
                    else if (id === 23 && (userAns === 'intensive farming' || userAns === 'modern intensive farming')) correct++;
                    else if (id === 24 && userAns === 'organic farming') correct++;
                    else if (id === 25 && userAns === 'greener food standard') correct++;
                    else if (id === 26 && (userAns === 'farmers and consumers' || userAns === 'consumers and farmers')) correct++;
                    else if (id === 27 && (userAns === 'vii' || userAns === '7')) correct++;
                    else if (id === 28 && (userAns === 'viii' || userAns === '8')) correct++;
                    else if (id === 29 && (userAns === 'v' || userAns === '5')) correct++;
                    else if (id === 30 && (userAns === 'vi' || userAns === '6')) correct++;
                    else if (id === 36 && (userAns === 'd' || userAns.startsWith('d.'))) correct++;
                    else if (id === 37 && (userAns === 'e' || userAns.startsWith('e.'))) correct++;
                    else if (id === 38 && (userAns === 'g' || userAns.startsWith('g.'))) correct++;
                    else if (id === 39 && (userAns === 'i' || userAns.startsWith('i.'))) correct++;
                } else if (isCambridge7Test3) {
                    if (id === 26 && (userAns === 'c' || userAns.startsWith('c.'))) correct++;
                    else if (id === 40 && (userAns === 'c' || userAns.startsWith('c.'))) correct++;
                    else if (id === 14 && (userAns === 'iv' || userAns === '4')) correct++;
                    else if (id === 15 && (userAns === 'vii' || userAns === '7')) correct++;
                    else if (id === 16 && (userAns === 'ii' || userAns === '2')) correct++;
                    else if (id === 17 && (userAns === 'ix' || userAns === '9')) correct++;
                    else if (id === 18 && (userAns === 'i' || userAns === '1')) correct++;
                    else if (id === 19 && (userAns === 'vi' || userAns === '6')) correct++;
                    else if (id === 34 && (userAns === '4' || userAns.startsWith('4.'))) correct++;
                    else if (id === 35 && (userAns === '8' || userAns.startsWith('8.'))) correct++;
                    else if (id === 36 && (userAns === '6' || userAns.startsWith('6.'))) correct++;
                    else if (id === 37 && (userAns === '10' || userAns.startsWith('10.'))) correct++;
                    else if (id === 38 && (userAns === '5' || userAns.startsWith('5.'))) correct++;
                    else if (id === 39 && (userAns === '2' || userAns.startsWith('2.'))) correct++;
                } else if (isCambridge7Test4) {
                    if (id === 8 && (userAns === 'wooden pulleys' || userAns === 'pulleys')) correct++;
                    else if (id === 9 && userAns === 'stone') correct++;
                    else if (id === 10 && (userAns === 'accomplished sailors' || userAns === 'sailors')) correct++;
                    else if (id === 11 && (userAns === 'modern glider' || userAns === 'glider')) correct++;
                    else if (id === 12 && userAns === 'flight') correct++;
                    else if (id === 13 && userAns === 'messages') correct++;
                    else if (id === 27 && (userAns === 'c' || userAns.startsWith('c.'))) correct++;
                    else if (id === 28 && (userAns === 'b' || userAns.startsWith('b.'))) correct++;
                    else if (id === 29 && (userAns === 'd' || userAns.startsWith('d.'))) correct++;
                    else if (id === 34 && (userAns === 'unexpected' || userAns === 'intense')) correct++;
                }
            }
            const timeSpent = Math.max(1, Math.round(elapsed / 60));
            const band = rawToBand(correct);
            if (simulation) {
                simulation.onComplete({ skill: 'reading', band, score: correct, timeSpent, criteria: [] });
            } else {
                setScore(correct);
                addAttempt({
                    id: Date.now(),
                    skill: 'reading',
                    band,
                    score: correct,
                    timeSpent,
                    criteria: [],
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
            }
            setTestState('completed');
        }, 900);
    };

    // 1. Passage matching logic by active part (with robust static fallback)
    const dynamicPassage = passages.find(
        (p) => Number(p.part_number) === Number(activePart)
    );

    const activePassage = {
        title: isCambridge7Test1
            ? (STATIC_PASSAGES[activePart]?.title || `Cambridge 7 Test 1 - Part ${activePart}`)
            : isCambridge7Test2
            ? (dynamicPassage?.title || CAMBRIDGE_7_TEST_2_RIGHT_PANEL[`part${activePart}`]?.title || `Cambridge 7 Test 2 - Part ${activePart}`)
            : isCambridge7Test3
            ? (dynamicPassage?.title || CAMBRIDGE_7_TEST_3_RIGHT_PANEL[`part${activePart}`]?.title || `Cambridge 7 Test 3 - Part ${activePart}`)
            : isCambridge7Test4
            ? (dynamicPassage?.title || CAMBRIDGE_7_TEST_4_RIGHT_PANEL[`part${activePart}`]?.title || `Cambridge 7 Test 4 - Part ${activePart}`)
            : (dynamicPassage?.title || (sourceType === 'cambridge' ? `Cambridge ${bookNumber} Test ${testNumber} - Part ${activePart}` : `Mock Series ${bookNumber} Test ${testNumber} - Part ${activePart}`)),
        subtitle: isCambridge7Test2
            ? (CAMBRIDGE_7_TEST_2_RIGHT_PANEL[`part${activePart}`]?.subtitle || `${activePart === 3 ? 14 : 13} questions • medium`)
            : isCambridge7Test3
            ? (CAMBRIDGE_7_TEST_3_RIGHT_PANEL[`part${activePart}`]?.subtitle || `${activePart === 3 ? 14 : 13} questions • easy`)
            : isCambridge7Test4
            ? (CAMBRIDGE_7_TEST_4_RIGHT_PANEL[`part${activePart}`]?.subtitle || `${activePart === 3 ? 14 : 13} questions • easy`)
            : isCambridge7Test1
            ? (STATIC_PASSAGES[activePart]?.subtitle || `${activePart === 3 ? 14 : 13} questions • easy`)
            : `${activePart === 3 ? 14 : 13} questions • ${testDifficulty}`,
        content_html: isCambridge7Test1
            ? (STATIC_PASSAGES[activePart]?.content_html || '')
            : (dynamicPassage?.content_html || ''),
    };

    const activeQuestions = questions.filter(
        (q) => q.passage_id === dynamicPassage?.id
    );

    const scrollToQuestion = (id: number) => {
        window.setTimeout(() => {
            questionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
    };

    const goTo = (id: number) => {
        setActiveId(id);
        const targetPart: 1 | 2 | 3 = id <= 13 ? 1 : id <= 26 ? 2 : 3;
        if (targetPart !== activePart) {
            setActivePart(targetPart);
        }
        scrollToQuestion(id);
    };

    const navigateQuestion = (dir: 1 | -1) => {
        const nextId = activeId + dir;
        if (nextId >= 1 && nextId <= 40) {
            goTo(nextId);
        }
    };

    const getAnsweredCount = (partId: number) => {
        const minQ = partId === 1 ? 1 : partId === 2 ? 14 : 27;
        const maxQ = partId === 1 ? 13 : partId === 2 ? 26 : 40;
        let count = 0;
        for (let q = minQ; q <= maxQ; q++) {
            if (answers[q] && answers[q].trim() !== '') {
                count++;
            }
        }
        return count;
    };

    const handleTextClick = () => {
        if (!vocabEnabled) return;
        const selection = window.getSelection()?.toString().trim().toLowerCase().replace(/[^a-z]/g, '');
        if (selection && MOCK_DICTIONARY[selection]) {
            setSelectedVocab({
                word: selection,
                pos: MOCK_DICTIONARY[selection].pos,
                def: MOCK_DICTIONARY[selection].def,
            });
        }
    };

    // Generic section blocks for non-Cambridge 7 tests
    const sectionBlocks = useMemo(() => {
        if (activeQuestions.length === 0) return [];

        const blocks: {
            section_title: string;
            section_type: string;
            instruction_text: string;
            title_text?: string;
            question_type: string;
            choice_bank?: string[];
            example_text?: string;
            questions: SupabaseQuestionItem[];
        }[] = [];

        activeQuestions.forEach((q) => {
            const lastBlock = blocks[blocks.length - 1];
            const isSameGroup = lastBlock && 
                ((q.section_title && lastBlock.section_title === q.section_title) ||
                 (q.instruction_text && lastBlock.instruction_text === q.instruction_text) ||
                 (!q.instruction_text && lastBlock.question_type === q.question_type));

            if (isSameGroup) {
                lastBlock.questions.push(q);
                const minNum = lastBlock.questions[0].question_number;
                const maxNum = q.question_number;
                if (!q.section_title) {
                    lastBlock.section_title = minNum === maxNum ? `Question ${minNum}` : `Questions ${minNum}-${maxNum}`;
                }
            } else {
                const minNum = q.question_number;
                const sTitle = q.section_title || `Question ${minNum}`;
                let sType = q.section_type;
                if (!sType) {
                    if (q.question_type === 'choice_bank' || q.question_type === 'matching_info') {
                        sType = 'MATCHING INFORMATION';
                    } else if (q.question_type === 'inline_input' || q.question_type === 'summary_completion') {
                        sType = (q.instruction_text || '').toLowerCase().includes('summary') ? 'SUMMARY COMPLETION' : 'SENTENCE COMPLETION';
                    } else if (q.question_type === 'dropdown') {
                        sType = 'MATCHING INFORMATION';
                    } else if (q.instruction_text?.toUpperCase().includes('TRUE')) {
                        sType = 'TRUE / FALSE / NOT GIVEN';
                    } else if (q.instruction_text?.toUpperCase().includes('YES')) {
                        sType = 'YES / NO / NOT GIVEN';
                    } else {
                        sType = (q.question_type || 'QUESTIONS').toUpperCase();
                    }
                }

                const choices = Array.isArray(q.choices) && q.choices.length > 0 
                    ? q.choices 
                    : (q.question_type === 'choice_bank' || q.question_type === 'matching_info') 
                    ? ['A', 'B', 'C', 'D', 'E'] 
                    : undefined;

                blocks.push({
                    section_title: sTitle,
                    section_type: sType,
                    instruction_text: q.instruction_text || 'Answer the questions below based on the text.',
                    title_text: q.title_text,
                    question_type: q.question_type,
                    choice_bank: choices,
                    example_text: q.example_text,
                    questions: [q],
                });
            }
        });

        blocks.forEach((b) => {
            if (b.questions.length > 1 && b.section_title.startsWith('Question ')) {
                const first = b.questions[0].question_number;
                const last = b.questions[b.questions.length - 1].question_number;
                b.section_title = `Questions ${first}-${last}`;
            }
        });

        return blocks;
    }, [activeQuestions]);

    // Question button renderer for the bottom dock
    const renderQuestionButton = (qId: number) => {
        const isAnswered = Boolean(answers[qId] && answers[qId].trim() !== '');
        const isActive = activeId === qId;

        let btnClass = 'w-7 h-7 rounded border text-xs font-mono font-medium flex items-center justify-center transition-all cursor-pointer ';

        if (isAnswered) {
            if (isActive) {
                btnClass += 'bg-[#0072CE] text-white border-[#0072CE] ring-2 ring-blue-300 font-bold shadow-2xs';
            } else {
                btnClass += 'bg-[#0072CE] text-white border-[#0072CE] font-bold';
            }
        } else if (isActive) {
            btnClass += 'border-[#0072CE] text-[#0072CE] bg-white font-bold ring-1 ring-[#0072CE] shadow-2xs';
        } else {
            btnClass += 'border-gray-200 bg-white text-gray-700 hover:border-gray-300';
        }

        return (
            <button
                key={qId}
                onClick={() => goTo(qId)}
                className={btnClass}
            >
                {qId}
            </button>
        );
    };

    if (testState === 'lobby') {
        return (
            <IELTSLobbyCard
                skill="reading"
                candidateEmail={candidateEmail || ''}
                title={`Cambridge ${bookNumber} · Test ${testNumber} Reading`}
                subtitle="Official split-pane IELTS Academic Reading exam environment."
                onStart={() => setTestState('active')}
            />
        );
    }

    if (testState === 'evaluating' || testState === 'completed') {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F2F2]">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full border border-[#CCCCCC]">
                    <h2 className="text-2xl font-bold text-[#0072CE] mb-4">Exam Completed</h2>
                    {testState === 'evaluating' ? (
                        <p className="text-neutral-600">Evaluating your answers...</p>
                    ) : (
                        <>
                            <p className="text-lg text-neutral-800 mb-2">Score: <strong>{score}</strong> / 40</p>
                            <p className="text-lg text-neutral-800 mb-6">Band: <strong>{rawToBand(score || 0).toFixed(1)}</strong></p>
                            <button onClick={handleExit} className="px-6 py-2 bg-[#0072CE] text-white rounded hover:bg-blue-700 transition-colors font-medium">Back to Reading Hub</button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full relative bg-[#FFFFFF] text-black font-sans min-w-0 overflow-hidden" style={{ flex: 1 }}>
            {/* ── Global Header (Dark Sticky Header Bar) ── */}
            <header className="shrink-0 h-14 bg-[#121212] border-b border-neutral-800 flex items-center justify-between px-6 z-20">
                {/* Left: Exit button + Test title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-800"
                        title="Exit Exam"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>

                    <div>
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            {sourceType === 'cambridge' ? `CAMBRIDGE ${bookNumber}${category === 'general' ? ' (GT)' : ''}` : `MOCK SERIES ${bookNumber}`}
                        </span>
                        <h1 className="text-base font-bold text-white leading-tight">
                            Reading Test {testNumber}
                        </h1>
                    </div>
                </div>

                {/* Right: Autosave + Timer + Submit */}
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">✓ Live Exam Mode</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${lowTime ? 'bg-red-500/10 animate-pulse' : 'bg-neutral-800'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={lowTime ? '#ef4444' : '#9ca3af'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className={`font-mono text-sm ${lowTime ? 'text-red-400' : 'text-white'}`}>{formatClock(remaining)}</span>
                    </div>
                    <button
                        onClick={submit}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-orange-500/20 cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            </header>

            <IeltsExamOptionsModal open={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} />

            {/* ── Main Dual Split-Pane Layout ── */}
            <div className="flex-1 min-h-0 flex relative overflow-hidden bg-[#FFFFFF]" ref={splitAreaRef}>
                
                {/* ── LEFT PANE: PASSAGE ── */}
                <div 
                    style={{ width: `${split}%` }} 
                    className="h-full min-w-0 overflow-y-auto px-8 py-6 custom-scrollbar relative border-r border-[#E5E5E5] bg-white"
                >
                    {/* Top row: Title on left, Vocabulary toggle switch on top right */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">{activePassage.title}</h2>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <span className="text-xs font-medium text-gray-500">Click words for vocabulary</span>
                            <input 
                                type="checkbox" 
                                checked={vocabEnabled} 
                                onChange={(e) => {
                                    setVocabEnabled(e.target.checked);
                                    if (!e.target.checked) setSelectedVocab(null);
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0072CE] relative" />
                        </label>
                    </div>

                    {/* Vocabulary Tooltip Modal / Card */}
                    {selectedVocab && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start justify-between shadow-sm animate-fadeIn">
                            <div>
                                <span className="font-bold text-sm text-[#0072CE] capitalize">{selectedVocab.word}</span>
                                <span className="text-xs text-gray-500 italic ml-2">({selectedVocab.pos})</span>
                                <p className="text-xs text-neutral-700 mt-1">{selectedVocab.def}</p>
                            </div>
                            <button onClick={() => setSelectedVocab(null)} className="text-gray-400 hover:text-black text-xs font-bold px-1">✕</button>
                        </div>
                    )}

                    {/* Passage Content or Fallback Notice */}
                    <div className="space-y-4" onClick={handleTextClick}>
                        {activePassage.content_html ? (
                            <div 
                                className="prose max-w-none text-[15px] leading-[1.8] text-gray-800"
                                dangerouslySetInnerHTML={{ __html: activePassage.content_html }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-300">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0072CE] flex items-center justify-center mb-4 shadow-2xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1.5">Reading Passage Pending</h3>
                                <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-4">
                                    Passage text pending Supabase synchronization for Cambridge {bookNumber} Test {testNumber} Part {activePart}.
                                </p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-2xs">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    Awaiting Database Sync
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── DRAGGABLE DIVIDER ── */}
                <div
                    onPointerDown={startResize}
                    className="w-4 shrink-0 cursor-col-resize select-none flex items-center justify-center group z-10 -ml-2 -mr-2"
                >
                    <div className="w-px h-full bg-[#E5E5E5] group-hover:bg-[#0072CE] transition-colors relative flex items-center justify-center">
                        <div className="absolute w-5 h-7 bg-white border border-[#CCCCCC] rounded flex items-center justify-center shadow-sm text-neutral-400 text-xs group-hover:border-[#0072CE] group-hover:text-[#0072CE]">
                            ↔
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANE: QUESTION DECK ── */}
                <div 
                    style={{ width: `${100 - split}%` }} 
                    className="h-full min-w-0 overflow-y-auto px-8 py-6 bg-white custom-scrollbar relative"
                >
                    {/* Top Header: Main Title & Subtitle */}
                    <div className="mb-6 pb-4 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">{activePassage.title}</h2>
                        <p className="text-sm font-normal text-gray-500 mt-1">{activePassage.subtitle}</p>
                    </div>

                    <DynamicRightPanel
                        examId={examId}
                        partNumber={activePart}
                        answers={answers}
                        onAnswer={setAnswer}
                        activeId={activeId}
                        setActiveId={setActiveId}
                        questionRefs={questionRefs}
                        locked={locked}
                        onDynamicLoaded={(hasGroups, dynamicQs) => {
                            if (hasGroups && dynamicQs.length > 0) {
                                setAnswersKey((prev) => {
                                    const nextKey = { ...prev };
                                    dynamicQs.forEach((q) => {
                                        if (q.question_number && q.correct_answer) {
                                            nextKey[q.question_number] = q.correct_answer;
                                        }
                                    });
                                    return nextKey;
                                });
                            }
                        }}
                        fallback={
                            <>
                                {/* ════ CAMBRIDGE 7 TEST 2 CUSTOM MODULES ════ */}
                                {isCambridge7Test2 && activePart === 1 ? (
                        <div className="space-y-10">
                            {/* Module 1: Questions 1-4 (YES-NO/NOT GIVEN) */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module1.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module1.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    Choose <span className="font-bold">YES</span> if the statement agrees with the information given in the text, choose <span className="font-bold">NO</span> if the statement contradicts the information, or choose <span className="font-bold">NOT GIVEN</span> if there is no information on this.
                                </p>

                                <div className="space-y-6">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module1.questions.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.num}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.text}
                                                </span>
                                            </div>

                                            {/* Stacked Option Cards */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {q.options.map((opt) => {
                                                    const isSelected = answers[q.num] === opt;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnswer(q.num, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 2: Questions 5-10 (MATCHING FEATURES) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module2.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module2.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module2.instructions}
                                </p>

                                {/* CHOICES Container Box */}
                                <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                    <div className="h-px bg-gray-200 my-2" />
                                    <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module2.choices.map((choice, cIdx) => (
                                            <span 
                                                key={cIdx}
                                                className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                {choice}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Question Items with Dashed Dropdown Triggers */}
                                <div className="space-y-4">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module2.questions.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.text}</span>
                                            <select
                                                value={answers[q.num] || ''}
                                                onChange={(e) => setAnswer(q.num, e.target.value)}
                                                onFocus={() => setActiveId(q.num)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0"
                                            >
                                                <option value="">{q.num} — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 3: Questions 11-13 (MULTIPLE CHOICE) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module3.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module3.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module3.instructions}
                                </p>

                                <div className="space-y-6">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part1.module3.questions.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.num}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.text}
                                                </span>
                                            </div>

                                            {/* Stacked Option Cards */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {q.options.map((opt, optIdx) => {
                                                    const letter = String.fromCharCode(65 + optIdx);
                                                    const isSelected = answers[q.num] === opt || answers[q.num] === letter;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnswer(q.num, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                <strong className="mr-1">{letter}.</strong> {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : isCambridge7Test2 && activePart === 2 ? (
                        <div className="space-y-10">
                            {/* Module 1: Questions 14-17 (MATCHING INFORMATION) */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module1.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module1.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                    The text has seven sections <span className="font-bold">A-G</span>. Which section contains the following information? Choose the correct sections <span className="font-bold">A-G</span>. You may choose any answer more than once.
                                </p>

                                {/* CHOICES Container Box */}
                                <div className="border border-gray-200 rounded-2xl p-4 mb-6 bg-white shadow-2xs">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CHOICES</div>
                                    <div className="h-px bg-gray-100 my-2" />
                                    <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                    <div className="flex items-center gap-2">
                                        {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module1.choices.map((choice, cIdx) => (
                                            <div 
                                                key={cIdx}
                                                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-xs font-bold text-gray-700 shadow-2xs cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                {choice}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question Items with Dashed Dropdown Triggers */}
                                <div className="space-y-4">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module1.questions.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.text}</span>
                                            <select
                                                value={answers[q.num] || ''}
                                                onChange={(e) => setAnswer(q.num, e.target.value)}
                                                onFocus={() => setActiveId(q.num)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0"
                                            >
                                                <option value="">{q.num} — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module1.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 2: Questions 18-21 (YES-NO/NOT GIVEN) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module2.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module2.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    Choose <span className="font-bold">YES</span> if the statement agrees with the information given in the text, choose <span className="font-bold">NO</span> if the statement contradicts the information, or choose <span className="font-bold">NOT GIVEN</span> if there is no information on this.
                                </p>

                                <div className="space-y-6">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module2.questions.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.num}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.text}
                                                </span>
                                            </div>

                                            {/* Stacked Option Cards */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {q.options.map((opt) => {
                                                    const isSelected = answers[q.num] === opt;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnswer(q.num, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 3: Questions 22-26 (SUMMARY COMPLETION WOC) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module3.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module3.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part2.module3.instructions}
                                </p>

                                {/* Styled Narrative Paragraph Box */}
                                <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                                    <p className="text-sm leading-[2.6] text-gray-800">
                                        Professor Pretty concludes that our{' '}
                                        <input
                                            id="q22"
                                            ref={(el) => { questionRefs.current[22] = el as any; }}
                                            type="text"
                                            placeholder="22"
                                            value={answers[22] || ''}
                                            onChange={(e) => setAnswer(22, e.target.value)}
                                            onFocus={() => setActiveId(22)}
                                            className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        are higher than most people realise, because we make three different types of payment. He feels it is realistic to suggest that Britain should reduce its reliance on{' '}
                                        <input
                                            id="q23"
                                            ref={(el) => { questionRefs.current[23] = el as any; }}
                                            type="text"
                                            placeholder="23"
                                            value={answers[23] || ''}
                                            onChange={(e) => setAnswer(23, e.target.value)}
                                            onFocus={() => setActiveId(23)}
                                            className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        .
                                    </p>

                                    <p className="text-sm leading-[2.6] text-gray-800">
                                        Although most farmers would be unable to adapt to{' '}
                                        <input
                                            id="q24"
                                            ref={(el) => { questionRefs.current[24] = el as any; }}
                                            type="text"
                                            placeholder="24"
                                            value={answers[24] || ''}
                                            onChange={(e) => setAnswer(24, e.target.value)}
                                            onFocus={() => setActiveId(24)}
                                            className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        , Professor Pretty wants the government to initiate change by establishing what he refers to as a{' '}
                                        <input
                                            id="q25"
                                            ref={(el) => { questionRefs.current[25] = el as any; }}
                                            type="text"
                                            placeholder="25"
                                            value={answers[25] || ''}
                                            onChange={(e) => setAnswer(25, e.target.value)}
                                            onFocus={() => setActiveId(25)}
                                            className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        . He feels this would help to change the attitudes of both{' '}
                                        <input
                                            id="q26"
                                            ref={(el) => { questionRefs.current[26] = el as any; }}
                                            type="text"
                                            placeholder="26"
                                            value={answers[26] || ''}
                                            onChange={(e) => setAnswer(26, e.target.value)}
                                            onFocus={() => setActiveId(26)}
                                            className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : isCambridge7Test2 && activePart === 3 ? (
                        <div className="space-y-10">
                            {/* Module 1: Questions 27-30 (MATCHING HEADING) */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.instructions}
                                </p>

                                {/* CHOICES Container Box */}
                                <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                    <div className="h-px bg-gray-200 my-2" />
                                    <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.choices.map((choice, cIdx) => (
                                            <span 
                                                key={cIdx}
                                                className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                {choice}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Question List with Examples */}
                                <div className="space-y-4">
                                    {/* Callout Example Section A */}
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800">
                                        Example: Section A : Request for improved transport in Makete
                                    </div>

                                    {/* Q27: Section B */}
                                    <div 
                                        ref={(el) => { questionRefs.current[27] = el; }}
                                        className="flex flex-wrap items-baseline gap-4 py-1"
                                        onClick={() => setActiveId(27)}
                                    >
                                        <span className="text-sm text-gray-800 leading-relaxed min-w-[100px] font-medium">Section B</span>
                                        <select
                                            value={answers[27] || ''}
                                            onChange={(e) => setAnswer(27, e.target.value)}
                                            onFocus={() => setActiveId(27)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                        >
                                            <option value="">27 — Choose ˅</option>
                                            {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.choices.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Q28: Section C */}
                                    <div 
                                        ref={(el) => { questionRefs.current[28] = el; }}
                                        className="flex flex-wrap items-baseline gap-4 py-1"
                                        onClick={() => setActiveId(28)}
                                    >
                                        <span className="text-sm text-gray-800 leading-relaxed min-w-[100px] font-medium">Section C</span>
                                        <select
                                            value={answers[28] || ''}
                                            onChange={(e) => setAnswer(28, e.target.value)}
                                            onFocus={() => setActiveId(28)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                        >
                                            <option value="">28 — Choose ˅</option>
                                            {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.choices.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Callout Example Section D */}
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800">
                                        Example: Section D : Government authorities’ instructions
                                    </div>

                                    {/* Q29: Section E */}
                                    <div 
                                        ref={(el) => { questionRefs.current[29] = el; }}
                                        className="flex flex-wrap items-baseline gap-4 py-1"
                                        onClick={() => setActiveId(29)}
                                    >
                                        <span className="text-sm text-gray-800 leading-relaxed min-w-[100px] font-medium">Section E</span>
                                        <select
                                            value={answers[29] || ''}
                                            onChange={(e) => setAnswer(29, e.target.value)}
                                            onFocus={() => setActiveId(29)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                        >
                                            <option value="">29 — Choose ˅</option>
                                            {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.choices.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Q30: Section F */}
                                    <div 
                                        ref={(el) => { questionRefs.current[30] = el; }}
                                        className="flex flex-wrap items-baseline gap-4 py-1"
                                        onClick={() => setActiveId(30)}
                                    >
                                        <span className="text-sm text-gray-800 leading-relaxed min-w-[100px] font-medium">Section F</span>
                                        <select
                                            value={answers[30] || ''}
                                            onChange={(e) => setAnswer(30, e.target.value)}
                                            onFocus={() => setActiveId(30)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                        >
                                            <option value="">30 — Choose ˅</option>
                                            {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module1.choices.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Module 2: Questions 31-35 (YES-NO/NOT GIVEN) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module2.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module2.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    Choose <span className="font-bold">YES</span> if the statement agrees with the information given in the text, choose <span className="font-bold">NO</span> if the statement contradicts the information, or choose <span className="font-bold">NOT GIVEN</span> if there is no information on this.
                                </p>

                                <div className="space-y-6">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module2.questions.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.num}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.text}
                                                </span>
                                            </div>

                                            {/* Stacked Option Cards */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {q.options.map((opt) => {
                                                    const isSelected = answers[q.num] === opt;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnswer(q.num, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 3: Questions 36-39 (MATCHING SENTENCE ENDINGS) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module3.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module3.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module3.instructions}
                                </p>

                                {/* CHOICES Container Box */}
                                <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                    <div className="h-px bg-gray-200 my-2" />
                                    <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module3.choices.map((choice, cIdx) => (
                                            <span 
                                                key={cIdx}
                                                className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                <strong className="mr-1">{String.fromCharCode(65 + cIdx)}.</strong> {choice}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Question Items with Dashed Dropdown Triggers */}
                                <div className="space-y-4">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module3.questions.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.text}</span>
                                            <select
                                                value={answers[q.num] || ''}
                                                onChange={(e) => setAnswer(q.num, e.target.value)}
                                                onFocus={() => setActiveId(q.num)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0 max-w-xs"
                                            >
                                                <option value="">{q.num} — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module3.choices.map((opt, optIdx) => {
                                                    const letter = String.fromCharCode(65 + optIdx);
                                                    return (
                                                        <option key={opt} value={opt}>
                                                            {letter}. {opt}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 4: Question 40 (MULTIPLE CHOICE) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module4.title}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module4.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module4.instructions}
                                </p>

                                <div 
                                    ref={(el) => { questionRefs.current[40] = el; }}
                                    className="space-y-3"
                                    onClick={() => setActiveId(40)}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                            40
                                        </span>
                                        <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                            {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module4.question.text}
                                        </span>
                                    </div>

                                    {/* Stacked Option Cards */}
                                    <div className="space-y-2 pt-1 pl-9">
                                        {CAMBRIDGE_7_TEST_2_RIGHT_PANEL.part3.module4.question.options.map((opt, optIdx) => {
                                            const letter = String.fromCharCode(65 + optIdx);
                                            const isSelected = answers[40] === opt || answers[40] === letter;
                                            return (
                                                <label
                                                    key={opt}
                                                    className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                        isSelected 
                                                            ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                            : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                    }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAnswer(40, opt);
                                                    }}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                        <strong className="mr-1">{letter}.</strong> {opt}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : isCambridge7Test3 ? (
                        /* ════ CAMBRIDGE 7 TEST 3 CUSTOM MODULES ════ */
                        activePart === 1 ? (
                            <div className="space-y-10">
                                {/* Module 1: Questions 1-6 (TRUE-FALSE/NOT GIVEN) */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module1.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module1.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module1.instructions}
                                    </p>

                                    <div className="space-y-6">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module1.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="space-y-3"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                        {q.num}
                                                    </span>
                                                    <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                        {q.text}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 pt-1 pl-9">
                                                    {q.options.map((opt) => {
                                                        const isSelected = answers[q.num] === opt;
                                                        return (
                                                            <label
                                                                key={opt}
                                                                className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                    isSelected 
                                                                        ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                        : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                                }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAnswer(q.num, opt);
                                                                }}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </div>
                                                                <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                    {opt}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 2: Questions 7-13 (SUMMARY COMPLETION WC) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.instructions}
                                    </p>

                                    {/* Section Header Box */}
                                    <div className="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-4">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.headerBox}
                                    </div>

                                    {/* CHOICES Container Box */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Narrative Card with Embedded Dropdowns */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                                        <p className="text-sm leading-[2.6] text-gray-800">
                                            Ants have sophisticated methods of farming, including herding livestock and growing crops, which are in many ways similar to those used in human agriculture. The ants cultivate a large number of different species of edible fungi which convert{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[7] = el as any; }}
                                                value={answers[7] || ''}
                                                onChange={(e) => setAnswer(7, e.target.value)}
                                                onFocus={() => setActiveId(7)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">7 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            into a form which they can digest. They use their own natural{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[8] = el as any; }}
                                                value={answers[8] || ''}
                                                onChange={(e) => setAnswer(8, e.target.value)}
                                                onFocus={() => setActiveId(8)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">8 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            as weed-killers and also use unwanted materials as{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[9] = el as any; }}
                                                value={answers[9] || ''}
                                                onChange={(e) => setAnswer(9, e.target.value)}
                                                onFocus={() => setActiveId(9)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">9 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            . Genetic analysis shows they constantly upgrade these fungi by developing new species and by{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[10] = el as any; }}
                                                value={answers[10] || ''}
                                                onChange={(e) => setAnswer(10, e.target.value)}
                                                onFocus={() => setActiveId(10)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">10 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            species with neighboring ant colonies. In fact, the farming methods of ants could be said to be more advanced than human agribusiness, since they use{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[11] = el as any; }}
                                                value={answers[11] || ''}
                                                onChange={(e) => setAnswer(11, e.target.value)}
                                                onFocus={() => setActiveId(11)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">11 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            methods, they do not affect the{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[12] = el as any; }}
                                                value={answers[12] || ''}
                                                onChange={(e) => setAnswer(12, e.target.value)}
                                                onFocus={() => setActiveId(12)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">12 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            and do not waste{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[13] = el as any; }}
                                                value={answers[13] || ''}
                                                onChange={(e) => setAnswer(13, e.target.value)}
                                                onFocus={() => setActiveId(13)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">13 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part1.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : activePart === 2 ? (
                            <div className="space-y-10">
                                {/* Module 1: Questions 14-19 (MATCHING HEADING) */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module1.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module1.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module1.instructions}
                                    </p>

                                    {/* CHOICES Container Box */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module1.choices.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Questions 14-19 Items with Example */}
                                    <div className="space-y-4">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module1.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="flex flex-wrap items-baseline gap-4 py-1"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <span className="text-sm text-gray-800 leading-relaxed min-w-[100px] font-medium">{q.label}</span>
                                                <select
                                                    value={answers[q.num] || ''}
                                                    onChange={(e) => setAnswer(q.num, e.target.value)}
                                                    onFocus={() => setActiveId(q.num)}
                                                    className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                                >
                                                    <option value="">{q.num} — Choose ˅</option>
                                                    {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module1.choices.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}

                                        {/* Example Callout */}
                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module1.example}
                                        </div>
                                    </div>
                                </div>

                                {/* Module 2: Questions 20-21 (MATCHING FEATURES WITH MEDIA PLACEHOLDER) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module2.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module2.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module2.instructions}
                                    </p>

                                    {/* Dynamic Map Media Placeholder Card */}
                                    <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-lg p-6 text-center text-blue-700 my-4 shadow-2xs">
                                        <div className="text-sm font-bold">[ Route Map Diagram Placeholder ]</div>
                                        <p className="text-xs text-blue-600 mt-1">Map illustration showing Routes A-F will load dynamically from Supabase storage.</p>
                                    </div>

                                    {/* CHOICES Container Box */}
                                    <div className="border border-gray-200 rounded-2xl p-4 mb-6 bg-white shadow-2xs">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-100 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex items-center gap-2">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module2.choices.map((choice, cIdx) => (
                                                <div 
                                                    key={cIdx}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-xs font-bold text-gray-700 shadow-2xs cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Questions 20-21 Items */}
                                    <div className="space-y-4">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module2.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.text}</span>
                                                <select
                                                    value={answers[q.num] || ''}
                                                    onChange={(e) => setAnswer(q.num, e.target.value)}
                                                    onFocus={() => setActiveId(q.num)}
                                                    className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0"
                                                >
                                                    <option value="">{q.num} — Choose ˅</option>
                                                    {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module2.choices.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 3: Questions 22-25 (MATCHING FEATURES) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module3.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module3.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module3.instructions}
                                    </p>

                                    {/* CHOICES Container Box */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module3.choices.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Questions 22-25 Items */}
                                    <div className="space-y-4">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module3.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.text}</span>
                                                <select
                                                    value={answers[q.num] || ''}
                                                    onChange={(e) => setAnswer(q.num, e.target.value)}
                                                    onFocus={() => setActiveId(q.num)}
                                                    className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0"
                                                >
                                                    <option value="">{q.num} — Choose ˅</option>
                                                    {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module3.choices.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 4: Question 26 (MULTIPLE CHOICE) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module4.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module4.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module4.instructions}
                                    </p>

                                    <div 
                                        ref={(el) => { questionRefs.current[26] = el; }}
                                        className="space-y-3"
                                        onClick={() => setActiveId(26)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                26
                                            </span>
                                            <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module4.question.text}
                                            </span>
                                        </div>

                                        <div className="space-y-2 pt-1 pl-9">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part2.module4.question.options.map((opt, optIdx) => {
                                                const letter = String.fromCharCode(65 + optIdx);
                                                const isSelected = answers[26] === opt || answers[26] === letter;
                                                return (
                                                    <label
                                                        key={opt}
                                                        className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                            isSelected 
                                                                ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                        }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAnswer(26, opt);
                                                        }}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                            <strong className="mr-1">{letter}.</strong> {opt}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Module 1: Questions 27-33 (TRUE-FALSE/NOT GIVEN) */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module1.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module1.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module1.instructions}
                                    </p>

                                    <div className="space-y-6">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module1.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="space-y-3"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                        {q.num}
                                                    </span>
                                                    <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                        {q.text}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 pt-1 pl-9">
                                                    {q.options.map((opt) => {
                                                        const isSelected = answers[q.num] === opt;
                                                        return (
                                                            <label
                                                                key={opt}
                                                                className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                    isSelected 
                                                                        ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                        : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                                }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAnswer(q.num, opt);
                                                                }}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </div>
                                                                <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                    {opt}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 2: Questions 34-39 (MATCHING FEATURES) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module2.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module2.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module2.instructions}
                                    </p>

                                    {/* CHOICES Container Box */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module2.choices.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <strong className="mr-1">{cIdx + 1}.</strong> {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Questions 34-39 Items */}
                                    <div className="space-y-4">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module2.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <span className="text-sm text-gray-800 leading-relaxed font-medium">{q.label}</span>
                                                <select
                                                    value={answers[q.num] || ''}
                                                    onChange={(e) => setAnswer(q.num, e.target.value)}
                                                    onFocus={() => setActiveId(q.num)}
                                                    className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0 max-w-sm"
                                                >
                                                    <option value="">{q.num} — Choose ˅</option>
                                                    {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module2.choices.map((opt, optIdx) => (
                                                        <option key={opt} value={opt}>
                                                            {optIdx + 1}. {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 3: Question 40 (MULTIPLE CHOICE) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module3.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module3.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module3.instructions}
                                    </p>

                                    <div 
                                        ref={(el) => { questionRefs.current[40] = el; }}
                                        className="space-y-3"
                                        onClick={() => setActiveId(40)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                40
                                            </span>
                                            <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module3.question.text}
                                            </span>
                                        </div>

                                        <div className="space-y-2 pt-1 pl-9">
                                            {CAMBRIDGE_7_TEST_3_RIGHT_PANEL.part3.module3.question.options.map((opt, optIdx) => {
                                                const letter = String.fromCharCode(65 + optIdx);
                                                const isSelected = answers[40] === opt || answers[40] === letter;
                                                return (
                                                    <label
                                                        key={opt}
                                                        className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                            isSelected 
                                                                ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                        }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAnswer(40, opt);
                                                        }}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                            <strong className="mr-1">{letter}.</strong> {opt}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : isCambridge7Test4 ? (
                        /* ════ CAMBRIDGE 7 TEST 4 CUSTOM MODULES ════ */
                        activePart === 1 ? (
                            <div className="space-y-10">
                                {/* Module 1: Questions 1-7 (TRUE-FALSE/NOT GIVEN) */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module1.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module1.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module1.instructions}
                                    </p>

                                    <div className="space-y-6">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module1.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="space-y-3"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                        {q.num}
                                                    </span>
                                                    <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                        {q.text}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 pt-1 pl-9">
                                                    {q.options.map((opt) => {
                                                        const isSelected = answers[q.num] === opt;
                                                        return (
                                                            <label
                                                                key={opt}
                                                                className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                    isSelected 
                                                                        ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                        : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                                }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAnswer(q.num, opt);
                                                                }}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </div>
                                                                <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                    {opt}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 2: Questions 8-13 (SUMMARY COMPLETION WOC / TEXT INPUT) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module2.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module2.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module2.instructions}
                                    </p>

                                    {/* Section Header Box */}
                                    <div className="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-4">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part1.module2.headerBox}
                                    </div>

                                    {/* Narrative Card with embedded <input /> fields */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                                        <p className="text-sm leading-[2.6] text-gray-800">
                                            The Egyptians had{' '}
                                            <input
                                                id="q8"
                                                ref={(el) => { questionRefs.current[8] = el as any; }}
                                                type="text"
                                                placeholder="8"
                                                value={answers[8] || ''}
                                                onChange={(e) => setAnswer(8, e.target.value)}
                                                onFocus={() => setActiveId(8)}
                                                className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                            />{' '}
                                            , which could lift large pieces of{' '}
                                            <input
                                                id="q9"
                                                ref={(el) => { questionRefs.current[9] = el as any; }}
                                                type="text"
                                                placeholder="9"
                                                value={answers[9] || ''}
                                                onChange={(e) => setAnswer(9, e.target.value)}
                                                onFocus={() => setActiveId(9)}
                                                className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                            />{' '}
                                            , and they knew how to use the energy of the wind from their skill as{' '}
                                            <input
                                                id="q10"
                                                ref={(el) => { questionRefs.current[10] = el as any; }}
                                                type="text"
                                                placeholder="10"
                                                value={answers[10] || ''}
                                                onChange={(e) => setAnswer(10, e.target.value)}
                                                onFocus={() => setActiveId(10)}
                                                className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                            />{' '}
                                            . The discovery on one pyramid of an object which resembled a{' '}
                                            <input
                                                id="q11"
                                                ref={(el) => { questionRefs.current[11] = el as any; }}
                                                type="text"
                                                placeholder="11"
                                                value={answers[11] || ''}
                                                onChange={(e) => setAnswer(11, e.target.value)}
                                                onFocus={() => setActiveId(11)}
                                                className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                            />{' '}
                                            suggests they may have experimented with{' '}
                                            <input
                                                id="q12"
                                                ref={(el) => { questionRefs.current[12] = el as any; }}
                                                type="text"
                                                placeholder="12"
                                                value={answers[12] || ''}
                                                onChange={(e) => setAnswer(12, e.target.value)}
                                                onFocus={() => setActiveId(12)}
                                                className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                            />{' '}
                                            . In addition, over two thousand years ago kites used in china as weapons, as well as for sending{' '}
                                            <input
                                                id="q13"
                                                ref={(el) => { questionRefs.current[13] = el as any; }}
                                                type="text"
                                                placeholder="13"
                                                value={answers[13] || ''}
                                                onChange={(e) => setAnswer(13, e.target.value)}
                                                onFocus={() => setActiveId(13)}
                                                className="inline-block align-middle w-36 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                            />{' '}
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : activePart === 2 ? (
                            <div className="space-y-10">
                                {/* Module 1: Questions 14-20 (TRUE-FALSE/NOT GIVEN) */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module1.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module1.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module1.instructions}
                                    </p>

                                    <div className="space-y-6">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module1.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="space-y-3"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                        {q.num}
                                                    </span>
                                                    <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                        {q.text}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 pt-1 pl-9">
                                                    {q.options.map((opt) => {
                                                        const isSelected = answers[q.num] === opt;
                                                        return (
                                                            <label
                                                                key={opt}
                                                                className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                    isSelected 
                                                                        ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                        : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                                }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAnswer(q.num, opt);
                                                                }}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </div>
                                                                <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                    {opt}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 2: Questions 21-26 (MATCHING SENTENCE ENDINGS) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module2.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module2.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module2.instructions}
                                    </p>

                                    {/* CHOICES Container Box */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module2.choices.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <strong className="mr-1">{cIdx + 1}.</strong> {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Questions 21-26 Items */}
                                    <div className="space-y-4">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module2.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.text}</span>
                                                <select
                                                    value={answers[q.num] || ''}
                                                    onChange={(e) => setAnswer(q.num, e.target.value)}
                                                    onFocus={() => setActiveId(q.num)}
                                                    className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0 max-w-sm"
                                                >
                                                    <option value="">{q.num} — Choose ˅</option>
                                                    {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part2.module2.choices.map((opt, optIdx) => (
                                                        <option key={opt} value={opt}>
                                                            {optIdx + 1}. {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Module 1: Questions 27-29 (MULTIPLE CHOICE) */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module1.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module1.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module1.instructions}
                                    </p>

                                    <div className="space-y-6">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module1.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="space-y-3"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                        {q.num}
                                                    </span>
                                                    <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                        {q.text}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 pt-1 pl-9">
                                                    {q.options.map((opt, optIdx) => {
                                                        const letter = String.fromCharCode(65 + optIdx);
                                                        const isSelected = answers[q.num] === opt || answers[q.num] === letter;
                                                        return (
                                                            <label
                                                                key={opt}
                                                                className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                    isSelected 
                                                                        ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                        : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                                }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAnswer(q.num, opt);
                                                                }}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </div>
                                                                <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                    <strong className="mr-1">{letter}.</strong> {opt}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module 2: Questions 30-34 (SUMMARY COMPLETION WC) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.instructions}
                                    </p>

                                    {/* CHOICES Container Box */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.choices.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Narrative Card with Embedded Dropdowns */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                                        <p className="text-sm leading-[2.6] text-gray-800">
                                            Glass and Singer (1972) showed that situations in which there is intense noise have less effect on performance than circumstances in which{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[30] = el as any; }}
                                                value={answers[30] || ''}
                                                onChange={(e) => setAnswer(30, e.target.value)}
                                                onFocus={() => setActiveId(30)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">30 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            noise occurs. Subjects were divided into groups to perform a task. Some heard loud bursts of noise, others soft. For some subjects, the noise was predictable, while for others its occurrence was random. All groups were exposed to{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[31] = el as any; }}
                                                value={answers[31] || ''}
                                                onChange={(e) => setAnswer(31, e.target.value)}
                                                onFocus={() => setActiveId(31)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">31 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            noise. The predictable noise group{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[32] = el as any; }}
                                                value={answers[32] || ''}
                                                onChange={(e) => setAnswer(32, e.target.value)}
                                                onFocus={() => setActiveId(32)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">32 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            the unpredictable noise group on this task. In the second part of the experiment, the four groups were given a proofreading task to complete under conditions of no noise. They were required to check written material for errors. The group which had been exposed to unpredictable noise{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[33] = el as any; }}
                                                value={answers[33] || ''}
                                                onChange={(e) => setAnswer(33, e.target.value)}
                                                onFocus={() => setActiveId(33)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">33 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            the group which had been exposed to predictable noise. The group which had been exposed to loud predictable noise performed better than those who had heard soft, unpredictable bursts. The results suggest that{' '}
                                            <select
                                                ref={(el) => { questionRefs.current[34] = el as any; }}
                                                value={answers[34] || ''}
                                                onChange={(e) => setAnswer(34, e.target.value)}
                                                onFocus={() => setActiveId(34)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                            >
                                                <option value="">34 — Choose ˅</option>
                                                {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module2.choices.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>{' '}
                                            noise produces fatigue but that this manifests itself later.
                                        </p>
                                    </div>
                                </div>

                                {/* Module 3: Questions 35-40 (MATCHING FEATURES) */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module3.title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module3.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module3.instructions}
                                    </p>

                                    {/* CHOICES Container Box */}
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module3.choices.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Questions 35-40 Items */}
                                    <div className="space-y-4">
                                        {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module3.questions.map((q) => (
                                            <div 
                                                key={q.num}
                                                ref={(el) => { questionRefs.current[q.num] = el; }}
                                                className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                                onClick={() => setActiveId(q.num)}
                                            >
                                                <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.text}</span>
                                                <select
                                                    value={answers[q.num] || ''}
                                                    onChange={(e) => setAnswer(q.num, e.target.value)}
                                                    onFocus={() => setActiveId(q.num)}
                                                    className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0 max-w-xs"
                                                >
                                                    <option value="">{q.num} — Choose ˅</option>
                                                    {CAMBRIDGE_7_TEST_4_RIGHT_PANEL.part3.module3.choices.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    ) : activePart === 1 && (isCambridge7Test1 || sectionBlocks.length === 0) ? (
                        <div className="space-y-10">
                            {/* Module A: Questions 1–5 (Matching Information) */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Questions 1–5</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">MATCHING INFORMATION</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                    The text has <span className="font-bold">five</span> sections <span className="font-bold">A-E</span>. Which section contains the following information? Choose the correct sections <span className="font-bold">A-E</span>. You may choose any answer more than once.
                                </p>

                                {/* Choice Bank Container */}
                                <div className="border border-gray-200 rounded-2xl p-4 mb-6 bg-white shadow-2xs">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CHOICES</div>
                                    <div className="h-px bg-gray-100 my-2" />
                                    <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                    <div className="flex items-center gap-2">
                                        {['D', 'A', 'B', 'A', 'C', 'E'].map((choice, cIdx) => (
                                            <div 
                                                key={cIdx}
                                                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-xs font-bold text-gray-700 shadow-2xs cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                {choice}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Questions 1–5 items */}
                                <div className="space-y-4">
                                    {[
                                        { num: 1, text: 'Examples of wildlife other than bats which do not rely on vision to navigate by' },
                                        { num: 2, text: 'How early mammals avoided dying out' },
                                        { num: 3, text: 'Why bats hunt in the dark' },
                                        { num: 4, text: 'How a particular discovery has helped our understanding of bats' },
                                        { num: 5, text: 'Early military uses of echolocation' },
                                    ].map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="flex flex-wrap items-baseline gap-2 pt-1"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <span className="text-sm text-gray-800 leading-relaxed">{q.text}</span>
                                            <div className="relative inline-block">
                                                <select
                                                    value={answers[q.num] || ''}
                                                    onChange={(e) => setAnswer(q.num, e.target.value)}
                                                    onFocus={() => setActiveId(q.num)}
                                                    className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                                >
                                                    <option value="">{q.num} — Choose ˅</option>
                                                    {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module B: Questions 6–9 (Summary Completion WOC) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Questions 6–9</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SUMMARY COMPLETION WOC</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4">
                                    Complete the summary. Write <span className="font-bold">ONE WORD ONLY</span> from the text for each answer.
                                </p>

                                {/* Summary Card with Centered Title */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-center text-gray-800 text-sm my-3">Facial Vision</h4>
                                    <p className="text-sm leading-[2.4] text-gray-800">
                                        Blind people report that so-called 'facial vision' is comparable to the sensation of touch on the face. In fact, the sensation is more similar to the way in which pain from a{' '}
                                        <input
                                            ref={(el) => { questionRefs.current[6] = el as any; }}
                                            type="text"
                                            placeholder="6"
                                            value={answers[6] || ''}
                                            onChange={(e) => setAnswer(6, e.target.value)}
                                            onFocus={() => setActiveId(6)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        arm or leg might be felt. The ability actually comes from perceiving{' '}
                                        <input
                                            ref={(el) => { questionRefs.current[7] = el as any; }}
                                            type="text"
                                            placeholder="7"
                                            value={answers[7] || ''}
                                            onChange={(e) => setAnswer(7, e.target.value)}
                                            onFocus={() => setActiveId(7)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        through the ears. However, even before this was understood, the principle had been applied in the design of instruments which calculated the{' '}
                                        <input
                                            ref={(el) => { questionRefs.current[8] = el as any; }}
                                            type="text"
                                            placeholder="8"
                                            value={answers[8] || ''}
                                            onChange={(e) => setAnswer(8, e.target.value)}
                                            onFocus={() => setActiveId(8)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        of the seabed. This was followed by a wartime application in devices for finding{' '}
                                        <input
                                            ref={(el) => { questionRefs.current[9] = el as any; }}
                                            type="text"
                                            placeholder="9"
                                            value={answers[9] || ''}
                                            onChange={(e) => setAnswer(9, e.target.value)}
                                            onFocus={() => setActiveId(9)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        .
                                    </p>
                                </div>
                            </div>

                            {/* Module C: Questions 10–13 (Sentence Completion) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">Questions 10–13</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SENTENCE COMPLETION</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4">
                                    Complete the sentences. Write <span className="font-bold">NO MORE THAN TWO WORDS</span> from the text for each answer.
                                </p>

                                <div className="space-y-4">
                                    {/* Q10 */}
                                    <div ref={(el) => { questionRefs.current[10] = el; }} className="text-sm leading-[2.4] text-gray-800">
                                        Long before the invention of radar{' '}
                                        <input
                                            type="text"
                                            placeholder="10"
                                            value={answers[10] || ''}
                                            onChange={(e) => setAnswer(10, e.target.value)}
                                            onFocus={() => setActiveId(10)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        had resulted in a sophisticated radar-like system in bats.
                                    </div>

                                    {/* Q11 */}
                                    <div ref={(el) => { questionRefs.current[11] = el; }} className="text-sm leading-[2.4] text-gray-800">
                                        Radar is an inaccurate term when referring to bats because{' '}
                                        <input
                                            type="text"
                                            placeholder="11"
                                            value={answers[11] || ''}
                                            onChange={(e) => setAnswer(11, e.target.value)}
                                            onFocus={() => setActiveId(11)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        are not used in their navigation system.
                                    </div>

                                    {/* Q12 */}
                                    <div ref={(el) => { questionRefs.current[12] = el; }} className="text-sm leading-[2.4] text-gray-800">
                                        Radar and sonar are based on similar{' '}
                                        <input
                                            type="text"
                                            placeholder="12"
                                            value={answers[12] || ''}
                                            onChange={(e) => setAnswer(12, e.target.value)}
                                            onFocus={() => setActiveId(12)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        .
                                    </div>

                                    {/* Q13 */}
                                    <div ref={(el) => { questionRefs.current[13] = el; }} className="text-sm leading-[2.4] text-gray-800">
                                        The word 'echolocation' was first used by someone working as a{' '}
                                        <input
                                            type="text"
                                            placeholder="13"
                                            value={answers[13] || ''}
                                            onChange={(e) => setAnswer(13, e.target.value)}
                                            onFocus={() => setActiveId(13)}
                                            className="inline-block align-middle w-32 h-7 mx-1 px-2 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                                        />{' '}
                                        .
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activePart === 2 && (isCambridge7Test1 || sectionBlocks.length === 0) ? (
                        /* ════ PART 2 MODULES (Questions 14–26) ════ */
                        <div className="space-y-10">
                            {/* Module 1: Questions 14–20 (MATCHING HEADING) */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Questions 14–20</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">MATCHING HEADING</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                    The text has <span className="font-bold">eight</span> sections. Choose the correct heading for each section and move it into the gap.
                                </p>

                                {/* CHOICES Container Box */}
                                <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 mb-6 shadow-2xs">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                    <div className="h-px bg-gray-200 my-2" />
                                    <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PART_2_HEADINGS.map((heading, hIdx) => (
                                            <span 
                                                key={hIdx}
                                                className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                {heading}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Question List (Paragraphs A - H) */}
                                <div className="space-y-4">
                                    {/* Paragraph A */}
                                    <div 
                                        ref={(el) => { questionRefs.current[14] = el; }}
                                        className="flex flex-wrap items-baseline gap-4 py-1"
                                        onClick={() => setActiveId(14)}
                                    >
                                        <span className="text-sm text-gray-800 leading-relaxed min-w-[100px]">Paragraph A</span>
                                        <select
                                            value={answers[14] || ''}
                                            onChange={(e) => setAnswer(14, e.target.value)}
                                            onFocus={() => setActiveId(14)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                        >
                                            <option value="">14 — Choose ˅</option>
                                            {PART_2_HEADINGS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Example Answer: Paragraph B */}
                                    <div className="py-2 text-sm font-bold text-gray-900">
                                        Example Answer: Paragraph B: How a global challenge was met
                                    </div>

                                    {/* Paragraphs C to H */}
                                    {[
                                        { num: 15, label: 'Paragraph C' },
                                        { num: 16, label: 'Paragraph D' },
                                        { num: 17, label: 'Paragraph E' },
                                        { num: 18, label: 'Paragraph F' },
                                        { num: 19, label: 'Paragraph G' },
                                        { num: 20, label: 'Paragraph H' },
                                    ].map((item) => (
                                        <div 
                                            key={item.num}
                                            ref={(el) => { questionRefs.current[item.num] = el; }}
                                            className="flex flex-wrap items-baseline gap-4 py-1"
                                            onClick={() => setActiveId(item.num)}
                                        >
                                            <span className="text-sm text-gray-800 leading-relaxed min-w-[100px]">{item.label}</span>
                                            <select
                                                value={answers[item.num] || ''}
                                                onChange={(e) => setAnswer(item.num, e.target.value)}
                                                onFocus={() => setActiveId(item.num)}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                            >
                                                <option value="">{item.num} — Choose ˅</option>
                                                {PART_2_HEADINGS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 2: Questions 21–26 (YES / NO / NOT GIVEN) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Questions 21–26</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">YES-NO/NOT GIVEN</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    Choose <span className="font-bold">YES</span> if the statement agrees with the information given in the text, choose <span className="font-bold">NO</span> if the statement contradicts the information, or choose <span className="font-bold">NOT GIVEN</span> if there is no information on this.
                                </p>

                                <div className="space-y-6">
                                    {PART_2_YES_NO.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.num}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.text}
                                                </span>
                                            </div>

                                            {/* Stacked Option Cards */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {q.options.map((opt) => {
                                                    const isSelected = answers[q.num] === opt;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnswer(q.num, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : activePart === 3 && (isCambridge7Test1 || sectionBlocks.length === 0) ? (
                        /* ════ PART 3 MODULES (Questions 27–40) ════ */
                        <div className="space-y-10">
                            {/* Module 1: Questions 27–30 (MULTIPLE CHOICE) */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Questions 27–30</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">MULTIPLE CHOICE</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    Choose the <span className="font-bold">correct</span> answer.
                                </p>

                                <div className="space-y-6">
                                    {PART_3_MCQ.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.num}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.text}
                                                </span>
                                            </div>

                                            {/* Stacked Option Cards */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {q.options.map((opt) => {
                                                    const isSelected = answers[q.num] === opt;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnswer(q.num, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 2: Questions 31–36 (TRUE / FALSE / NOT GIVEN) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Questions 31–36</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TRUE-FALSE/NOT GIVEN</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    Choose <span className="font-bold">TRUE</span> if the statement agrees with the information given in the text, choose <span className="font-bold">FALSE</span> if the statement contradicts the information, or choose <span className="font-bold">NOT GIVEN</span> if there is no information on this.
                                </p>

                                <div className="space-y-6">
                                    {PART_3_TRUE_FALSE.map((q) => (
                                        <div 
                                            key={q.num}
                                            ref={(el) => { questionRefs.current[q.num] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.num)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.num}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.text}
                                                </span>
                                            </div>

                                            {/* Stacked Option Cards */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {q.options.map((opt) => {
                                                    const isSelected = answers[q.num] === opt;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnswer(q.num, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Module 3: Questions 37–40 (SUMMARY COMPLETION WC - DROPDOWN) */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Questions 37–40</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SUMMARY COMPLETION WC</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                    Complete the summary using the list of words. Choose the correct answer and move it into the gap.
                                </p>

                                {/* Summary Paragraph with Embedded Select Dropdowns */}
                                <div className="space-y-6">
                                    <p className="text-sm leading-[2.6] text-gray-800">
                                        Suggestopedia uses a less direct method of suggestion than other techniques such as hypnosis. However, Lozanov admits that a certain amount of{' '}
                                        <select
                                            ref={(el) => { questionRefs.current[37] = el as any; }}
                                            value={answers[37] || ''}
                                            onChange={(e) => setAnswer(37, e.target.value)}
                                            onFocus={() => setActiveId(37)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                        >
                                            <option value="">37 — Choose ˅</option>
                                            {PART_3_SUMMARY_CHOICES.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>{' '}
                                        is necessary in order to convince students, even if this is just a{' '}
                                        <select
                                            ref={(el) => { questionRefs.current[38] = el as any; }}
                                            value={answers[38] || ''}
                                            onChange={(e) => setAnswer(38, e.target.value)}
                                            onFocus={() => setActiveId(38)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                        >
                                            <option value="">38 — Choose ˅</option>
                                            {PART_3_SUMMARY_CHOICES.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>{' '}
                                        . Furthermore, if the method is to succeed, teachers must follow a set procedure. Although Lozanov’s method has become quite{' '}
                                        <select
                                            ref={(el) => { questionRefs.current[39] = el as any; }}
                                            value={answers[39] || ''}
                                            onChange={(e) => setAnswer(39, e.target.value)}
                                            onFocus={() => setActiveId(39)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                        >
                                            <option value="">39 — Choose ˅</option>
                                            {PART_3_SUMMARY_CHOICES.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>{' '}
                                        , the results of most other teachers using this method have been{' '}
                                        <select
                                            ref={(el) => { questionRefs.current[40] = el as any; }}
                                            value={answers[40] || ''}
                                            onChange={(e) => setAnswer(40, e.target.value)}
                                            onFocus={() => setActiveId(40)}
                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium inline-block align-middle mx-1"
                                        >
                                            <option value="">40 — Choose ˅</option>
                                            {PART_3_SUMMARY_CHOICES.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>{' '}
                                        .
                                    </p>

                                    {/* CHOICES Container Box */}
                                    <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-2xs">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-100 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {PART_3_SUMMARY_CHOICES.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Dynamic exam questions from Supabase */
                        <div className="space-y-10">
                            {sectionBlocks.map((block, bIdx) => (
                                <div key={bIdx} className="pb-10 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{block.section_title}</h3>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{block.section_type}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-6">{block.instruction_text}</p>
                                    {block.title_text && (
                                        <div className="font-bold text-gray-900 mb-4 text-center">
                                            {block.title_text}
                                        </div>
                                    )}

                                    {block.question_type === 'choice_bank' || block.question_type === 'dropdown' || block.question_type === 'matching_info' ? (
                                        <div className="space-y-4">
                                            {block.choice_bank && block.choice_bank.length > 0 && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CHOICES</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {block.choice_bank.map((c, ci) => (
                                                            <span key={ci} className="inline-block bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 shadow-2xs font-medium">
                                                                {c}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {block.questions.map((q) => {
                                                const opts = Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : block.choice_bank || ['A', 'B', 'C', 'D'];
                                                return (
                                                    <div 
                                                        key={q.id} 
                                                        ref={(el) => { questionRefs.current[q.question_number] = el; }} 
                                                        className="flex flex-wrap items-baseline justify-between gap-2 py-2 border-b border-gray-100 last:border-0"
                                                        onClick={() => setActiveId(q.question_number)}
                                                    >
                                                        <span className="text-sm text-gray-800 leading-relaxed max-w-md">{q.prompt_text}</span>
                                                        <select
                                                            value={answers[q.question_number] || ''}
                                                            onChange={(e) => setAnswer(q.question_number, e.target.value)}
                                                            onFocus={() => setActiveId(q.question_number)}
                                                            className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium"
                                                        >
                                                            <option value="">{q.question_number} — Choose ˅</option>
                                                            {opts.map((opt: string) => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {block.questions.map((q) => (
                                                <div 
                                                    key={q.id} 
                                                    ref={(el) => { questionRefs.current[q.question_number] = el; }} 
                                                    className="space-y-2 py-2"
                                                    onClick={() => setActiveId(q.question_number)}
                                                >
                                                    <span className="text-sm text-gray-800 leading-relaxed block font-medium">{q.question_number}. {q.prompt_text}</span>
                                                    <input
                                                        type="text"
                                                        placeholder={String(q.question_number)}
                                                        value={answers[q.question_number] || ''}
                                                        onChange={(e) => setAnswer(q.question_number, e.target.value)}
                                                        className="w-full max-w-sm h-9 px-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                            </>
                        }
                    />
                </div>
            </div>

            {/* ── FOOTER BAR (Strict IELTS Bottom Navigation Dock) ── */}
            <footer className="shrink-0 h-[56px] bg-white border-t border-gray-200 flex items-center justify-between px-6 w-full z-10 select-none">
                
                {/* ── LEFT SECTION ── */}
                <div className="flex items-center gap-6">
                    {activePart === 1 ? (
                        /* Part 1 is Active: Displays Part 1 tab + horizontal list of question buttons 1 through 13 */
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-gray-900">Part 1</span>
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: 13 }, (_, idx) => renderQuestionButton(idx + 1))}
                            </div>
                        </div>
                    ) : activePart === 2 ? (
                        /* Part 2 is Active: Part 1 becomes a compact status pill on the far left */
                        <button
                            onClick={() => { setActivePart(1); goTo(1); }}
                            className="text-left group cursor-pointer"
                        >
                            <div className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Part 1</div>
                            <div className="text-[11px] text-gray-400">{getAnsweredCount(1)} of 13</div>
                        </button>
                    ) : (
                        /* Part 3 is Active: Part 1 and Part 2 shift to compact status pills on the left side */
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => { setActivePart(1); goTo(1); }}
                                className="text-left group cursor-pointer"
                            >
                                <div className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Part 1</div>
                                <div className="text-[11px] text-gray-400">{getAnsweredCount(1)} of 13</div>
                            </button>
                            <button
                                onClick={() => { setActivePart(2); goTo(14); }}
                                className="text-left group cursor-pointer"
                            >
                                <div className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Part 2</div>
                                <div className="text-[11px] text-gray-400">{getAnsweredCount(2)} of 13</div>
                            </button>
                        </div>
                    )}
                </div>

                {/* ── CENTER SECTION ── */}
                {activePart === 2 ? (
                    /* Part 2 is Active: Part 2 expands in place to display question buttons 14 through 26 */
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-gray-900">Part 2</span>
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: 13 }, (_, idx) => renderQuestionButton(idx + 14))}
                        </div>
                    </div>
                ) : (
                    <div />
                )}

                {/* ── RIGHT SECTION & PAGINATION ── */}
                <div className="flex items-center gap-6">
                    {activePart === 1 ? (
                        /* Part 1 is Active: Part 2 (0 of 13) and Part 3 (0 of 14) remain compact status pills on right side */
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => { setActivePart(2); goTo(14); }}
                                className="text-left group cursor-pointer"
                            >
                                <div className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Part 2</div>
                                <div className="text-[11px] text-gray-400">{getAnsweredCount(2)} of 13</div>
                            </button>
                            <button
                                onClick={() => { setActivePart(3); goTo(27); }}
                                className="text-left group cursor-pointer"
                            >
                                <div className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Part 3</div>
                                <div className="text-[11px] text-gray-400">{getAnsweredCount(3)} of 14</div>
                            </button>
                        </div>
                    ) : activePart === 2 ? (
                        /* Part 2 is Active: Part 3 (0 of 14) remains a compact status pill on the right side */
                        <button
                            onClick={() => { setActivePart(3); goTo(27); }}
                            className="text-left group cursor-pointer"
                        >
                            <div className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Part 3</div>
                            <div className="text-[11px] text-gray-400">{getAnsweredCount(3)} of 14</div>
                        </button>
                    ) : (
                        /* Part 3 is Active: Part 3 expands to display question buttons 27 through 40 */
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-gray-900">Part 3</span>
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: 14 }, (_, idx) => renderQuestionButton(idx + 27))}
                            </div>
                        </div>
                    )}

                    {/* Fixed Pagination Arrows */}
                    <div className="flex items-center gap-1.5 shrink-0 pl-3 border-l border-gray-100">
                        <button
                            onClick={() => navigateQuestion(-1)}
                            disabled={activeId <= 1}
                            className="w-8 h-8 rounded-md bg-[#333333] hover:bg-black text-white flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Previous Question"
                        >
                            &lt;
                        </button>
                        <button
                            onClick={() => navigateQuestion(1)}
                            disabled={activeId >= 40}
                            className="w-8 h-8 rounded-md bg-[#222222] hover:bg-black text-white flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Next Question"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </footer>

            <IELTSExitModal
                open={showExitModal}
                onConfirm={handleExit}
                onCancel={() => setShowExitModal(false)}
            />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #E5E5E5;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #CCCCCC;
                }
            `}</style>
        </div>
    );
};

export default IELTSReadingExam;
