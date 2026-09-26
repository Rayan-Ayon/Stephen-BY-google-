import { PassageReviewData, QuestionExplanation } from './readingResultsTypes';

export const CAMBRIDGE_7_TEST_1_PASSAGES: Array<{
  passageNumber: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passageText: Array<{ sectionLabel: string; content: string }>;
}> = [
  {
    passageNumber: 1,
    title: "Let's Go Bats",
    difficulty: 'easy',
    passageText: [
      {
        sectionLabel: 'A',
        content: `Bats have a problem: how to find their way around in the dark. They hunt at night, and cannot use light to help them find prey and avoid obstacles. You might say that this is a problem of their own making, one that they could avoid simply by changing their habits and hunting by day. But the daytime economy is already heavily exploited by other creatures such as birds. Given that there is a living to be made at night, and given that alternative daytime trades are thoroughly occupied, natural selection has favoured bats that make a go of the night-hunting trade. It is probable that the nocturnal trades go way back in the ancestry of all mammals. In the time when the dinosaurs dominated the daytime economy, our mammalian ancestors probably only managed to survive at all because they found ways of scraping a living at night. Only after the mysterious mass extinction of the dinosaurs about 65 million years ago were our ancestors able to emerge into the daylight in any substantial numbers.`
      },
      {
        sectionLabel: 'B',
        content: `Bats have an engineering problem: how to find their way and find their prey in the absence of light. Bats are not the only creatures to face this difficulty today. Obviously the night-flying insects that they prey on must find their way about somehow. Deep-sea fish and whales have little or no light by day or by night. Fish and dolphins that live in extremely muddy water cannot see because, although there is light, it is obstructed and scattered by the dirt in the water. Plenty of other modern animals make their living in conditions where seeing is difficult or impossible.`
      },
      {
        sectionLabel: 'C',
        content: `Given the questions of how to manoeuvre in the dark, what solutions might an engineer consider? The first one that might occur to him is to manufacture light, to use a lantern or a searchlight. Fireflies and some fish (usually with the help of bacteria) have the power to manufacture their own light, but the process seems to consume a large amount of energy. Fireflies use their light for attracting mates. This doesn't require a prohibitive amount of energy: a male's tiny pinprick of light can be seen by a female from some distance on a dark night, since her eyes are exposed directly to the light source itself. However using light to find one's own way around requires vastly more energy, since the eyes have to detect the tiny fraction of the light that bounces off each part of the scene. The light source must therefore be immensely brighter if it is to be used as a headlight to illuminate the path, than if it is to be used as a signal to others. In any event, whether or not the reason is the energy expense, it seems to be the case that, with the possible exception of some weird deep-sea fish, no animal apart from man uses manufactured light to find its way about.`
      },
      {
        sectionLabel: 'D',
        content: `What else might the engineer think of? Well, blind humans sometimes seem to have an uncanny sense of obstacles in their path. It has been given the name 'facial vision', because blind people have reported that it feels a bit like the sense of touch, on the face. One report tells of a totally blind boy who could ride his tricycle at good speed round the block near his home, using facial vision. Experiments showed that, in fact, facial vision is nothing to do with touch or the front of the face, although the sensation may be referred to the front of the face, like the referred pain in a phantom limb. The sensation of facial vision, it turns out, really goes in through the ears. Blind people, without even being aware of the fact, are actually using echoes of their own footsteps and of other sounds, to sense the presence of obstacles. Before this was discovered, engineers had already built instruments to exploit the principle, for example to measure the depth of the sea under a ship. After this technique had been invented, it was only a matter of time before weapons designers adapted it for the detection of submarines. Both sides in the Second World War relied heavily on these devices, under such codenames as Asdic (British) and Sonar (American), as well as Radar (American) or RDF (British), which uses radio echoes rather than sound echoes.`
      },
      {
        sectionLabel: 'E',
        content: `The Sonar and Radar pioneers didn't know it then, but all the world now knows that bats, or rather natural selection working on bats, had perfected the system tens of millions of years earlier, and their radar achieves feats of detection and navigation that would strike an engineer dumb with admiration. It is technically incorrect to talk about bat 'radar', since they do not use radio waves. It is sonar but the underlying mathematical theories of radar and sonar are very similar and much of our scientific understanding of the details of what bats are doing has come from applying radar theory to them. The American zoologist Donald Griffin, who was largely responsible for the discovery of sonar in bats, coined the term 'echolocation' to cover both sonar and radar, whether used by animals or by human instruments.`
      }
    ]
  },
  {
    passageNumber: 2,
    title: "Making Every Drop Count",
    difficulty: 'medium',
    passageText: [
      {
        sectionLabel: 'A',
        content: `The history of human civilisation is entwined with the history of the ways we have learned to manipulate water resources. As towns gradually expanded, water was brought from increasingly remote sources, leading to sophisticated engineering efforts such as dams and aqueducts. At the height of the Roman Empire, nine major systems, with an innovative layout of pipes and well-built sewers, supplied the occupants of Rome with as much water per person as is provided in many parts of the industrial world today.`
      },
      {
        sectionLabel: 'B',
        content: `During the industrial revolution and population explosion of the 19th and 20th centuries, the demand for water rose dramatically. Unprecedented construction of tens of thousands of monumental engineering projects designed to control floods, protect clean water supplies, and provide water for irrigation and hydropower brought great benefits to hundreds of millions of people. Food production has kept pace with soaring populations mainly because of the expansion of artificial irrigation systems that make possible the growth of 40% of the world's food. Nearly one fifth of all the electricity generated worldwide is produced by turbines spun by the power of falling water.`
      },
      {
        sectionLabel: 'C',
        content: `Yet there is a dark side to this picture: despite our progress, half of the world's population still suffers, with water services inferior to those available to the ancient Greeks and Romans. As the United Nations report on access to water reiterated in November 2001, more than one billion people lack access to clean drinking water; some two and a half billion do not have adequate sanitation services. Preventable water-related diseases kill an estimated 10,000 to 20,000 children every day, and the latest evidence suggests that we are falling behind in efforts to solve these problems.`
      },
      {
        sectionLabel: 'D',
        content: `The consequences of our water policies extend beyond jeopardising human health. Tens of millions of people have been forced to move from their homes - often with little warning or compensation - to make way for the reservoirs behind dams. More than 20% of all freshwater fish species are now threatened or endangered because dams and water withdrawals have destroyed the free-flowing river ecosystems where they thrive. Certain irrigation practices degrade soil quality and reduce agricultural productivity. Groundwater aquifers are being pumped down faster than they are naturally replenished in parts of India, China, the USA and elsewhere. And disputes over shared water resources have led to violence and continue to raise local, national and even international tensions.`
      },
      {
        sectionLabel: 'E',
        content: `At the outset of the new millennium, however, the way resource planners think about water is beginning to change. The focus is slowly shifting back to the provision of basic human and environmental needs as top priority - ensuring 'some for all,' instead of 'more for some'. Some water experts are now demanding that existing infrastructure be used in smarter ways rather than building new facilities, which is increasingly considered the option of last, not first, resort. This shift in philosophy has not been universally accepted, and it comes with strong opposition from some established water organisations. Nevertheless, it may be the only way to address successfully the pressing problems of providing everyone with clean water to drink, adequate water to grow food and a life free from preventable water-related illness.`
      },
      {
        sectionLabel: 'F',
        content: `Fortunately - and unexpectedly - the demand for water is not rising as rapidly as some predicted. As a result, the pressure to build new water infrastructures has diminished over the past two decades. Although population, industrial output and economic productivity have continued to soar in developed nations, the rate at which people withdraw water from aquifers, rivers and lakes has slowed. And in a few parts of the world, demand has actually fallen.`
      },
      {
        sectionLabel: 'G',
        content: `What explains this remarkable turn of events? Two factors: people have figured out how to use water more efficiently, and communities are rethinking their priorities for water use. Throughout the first three-quarters of the 20th century, the quantity of freshwater consumed per person doubled on average; in the USA, water withdrawals increased tenfold while the population quadrupled. But since 1980, the amount of water consumed per person has actually decreased, thanks to a range of new technologies that help to conserve water in homes and industry. In 1965, for instance, Japan used approximately 13 million gallons of water to produce $1 million of commercial output; by 1989 this had dropped to 3.5 million gallons (even accounting for inflation) - almost a quadrupling of water productivity. In the USA, water withdrawals have fallen by more than 20% from their peak in 1980.`
      },
      {
        sectionLabel: 'H',
        content: `On the other hand, dams, aqueducts and other kinds of infrastructure will still have to be built, particularly in developing countries where basic human needs have not been met. But such projects must be built to higher specifications and with more accountability to local people and their environment than in the past. And even in regions where new projects seem warranted, we must find ways to meet demands with fewer resources, respecting ecological criteria and to a smaller budget.`
      }
    ]
  },
  {
    passageNumber: 3,
    title: "Educating Psyche",
    difficulty: 'hard',
    passageText: [
      {
        sectionLabel: 'A',
        content: `Educating Psyche by Bernie Neville is a book which looks at radical new approaches to learning, describing the effects of emotion, imagination and the unconscious on learning. One theory discussed in the book is that proposed by George Lozanov, which focuses on the power of suggestion.`
      },
      {
        sectionLabel: 'B',
        content: `Lozanov's instructional technique is based on the evidence that the connections made in the brain through unconscious processing (which he calls non-specific mental reactivity) are more durable than those made through conscious processing. Besides the laboratory evidence for this, we know from our experience that we often remember what we have perceived peripherally, long after we have forgotten what we set out to learn. If we think of a book we studied months or years ago, we will find it easier to recall peripheral details - the colour, the binding, the typeface, the table at the library where we sat while studying it - than the content on which we were concentrating. If we think of a lecture we listened to with great concentration, we will recall the lecturer's appearance and mannerisms, our place in the auditorium, the failure of the air-conditioning, much more easily than the ideas we went to learn. Even if these peripheral details are a bit elusive, they come back readily in hypnosis or when we relive the event imaginatively, as in psychodrama. The details of the content of the lecture, on the other hand, seem to have gone forever.`
      },
      {
        sectionLabel: 'C',
        content: `This phenomenon can be partly attributed to the common counterproductive approach to study (making extreme efforts to memorise, tensing muscles, inducing fatigue), but it also simply reflects the way the brain functions. Lozanov therefore made indirect instruction (suggestion) central to his teaching system. In suggestopedia, as he called his method, consciousness is shifted away from the curriculum to focus on something peripheral. The curriculum then becomes peripheral and is dealt with by the reserve capacity of the brain.`
      },
      {
        sectionLabel: 'D',
        content: `The suggestopedic approach to foreign language learning provides a good illustration. In its most recent variant (1980), it consists of the reading of vocabulary and text while the class is listening to music. The first session is in two parts. In the first part, the music is classical (Mozart, Beethoven, Brahms) and the teacher reads the text slowly and solemnly, with attention to the dynamics of the music. The students follow the text in their books. This is followed by several minutes of silence. In the second part, they listen to baroque music (Bach, Corelli, Handel) while the teacher reads the text in a normal speaking voice. During this time they have their books closed. During the whole of this session, their attention is passive; they listen to the music but make no attempt to learn the material.`
      },
      {
        sectionLabel: 'E',
        content: `Beforehand, the students have been carefully prepared for the language learning experience. Through meeting with the staff and satisfied students they develop the expectation that learning will be easy and pleasant and that they will successfully learn several hundred words of the foreign language during the class. In a preliminary talk, the teacher introduces them to the material to be covered, but does not 'teach' it. Likewise, the students are instructed not to try to learn it during this introduction.`
      },
      {
        sectionLabel: 'F',
        content: `Some hours after the two-part session, there is a follow-up class at which the students are stimulated to recall the material presented. Once again the approach is indirect. The students do not focus their attention on trying to remember the vocabulary, but focus on using the language to communicate (e.g. through games or improvised dramatisations). Such methods are not unusual in language teaching. What is distinctive in the suggestopedic method is that they are devoted entirely to assist recall. The 'learning' of the material is assumed to be automatic and effortless, accomplished while listening to music. The teacher's task is to assist the students to apply what they have learned paraconsciously, and in doing so to make it easily accessible to consciousness. Another difference from conventional teaching is the evidence that students can regularly learn 1000 new words of a foreign language during a suggestopedic session, as well as grammar and idiom.`
      },
      {
        sectionLabel: 'G',
        content: `Lozanov experimented with teaching by direct suggestion during sleep, hypnosis and trance states, but found such procedures unnecessary. Hypnosis, yoga, Silva mind-control, religious ceremonies and faith healing are all associated with successful suggestion, but none of their techniques seem to be essential to it. Such rituals may be seen as placebos. Lozanov acknowledges that the ritual surrounding suggestion in his own system is also a placebo, but maintains that without such a placebo people are unable or afraid to tap the reserve capacity of their brains. Like any placebo, it must be dispensed with authority to be effective. Just as a doctor calls on the full power of autocratic suggestion by insisting that the patient take precisely this white capsule precisely three times a day before meals, Lozanov is categoric in insisting that the suggestopedic session be conducted exactly in the manner designated, by trained and accredited suggestopedic teachers.`
      },
      {
        sectionLabel: 'H',
        content: `While suggestopedia has gained some notoriety through success in the teaching of modern languages, few teachers are able to emulate the spectacular results of Lozanov and his associates. We can, perhaps, attribute mediocre results to an inadequate placebo effect. The students have not developed the appropriate mind set. They are often not motivated to learn through this method. They do not have enough 'faith'. They do not see it as 'real teaching', especially as it does not seem to involve the 'work' they have learned to believe is essential to learning.`
      }
    ]
  }
];

export const C7_T1_EXPLANATIONS: Record<number, QuestionExplanation> = {
  1: {
    whyCorrect: `Section B gives several non-bat examples of modern animals that live and navigate without relying on eyesight, including deep-sea fish, whales, and muddy-water dolphins.`,
    passageEvidence: {
      section: 'Section B',
      quote: 'Plenty of other modern animals make their living in conditions where seeing is difficult or impossible.',
      supportingText: "This exact wording supports the stored answer 'B' for Question 1."
    },
    whyOthersWrong: [
      { option: 'Section A', reason: 'Section A focuses only on bats, dinosaurs, and early mammalian ancestors; it does not name other contemporary creatures navigating without sight.' },
      { option: 'Section C', reason: 'Section C explores why manufacturing light like fireflies is energy prohibitive for navigation.' },
      { option: 'Section D', reason: 'Section D describes human facial vision and sonar/radar history.' },
      { option: 'Section E', reason: 'Section E discusses the discovery of echolocation by Griffin.' }
    ],
    commonTraps: [
      { trapWord: 'Fireflies', explanation: 'Mentioned in Section C as producing light, but specifically NOT as navigating without eyesight.' },
      { trapWord: 'Blind humans', explanation: 'Described in Section D, but the prompt asks for "wildlife", ruling out humans.' }
    ],
    strategyTip: "Scan for the prompt's key terms 'wildlife other than bats' and match against synonyms like 'other modern animals' in Section B."
  },
  2: {
    whyCorrect: `Section A explicitly details how early mammalian ancestors scraped a living at night to survive while the dinosaurs dominated the daytime economy.`,
    passageEvidence: {
      section: 'Section A',
      quote: 'In the time when the dinosaurs dominated the daytime economy, our mammalian ancestors probably only managed to survive at all because they found ways of scraping a living at night.',
      supportingText: "This confirms that early mammals avoided dying out by adopting nocturnal habits while dinosaurs controlled the day."
    },
    whyOthersWrong: [
      { option: 'Section B', reason: 'Section B introduces the engineering dilemma of lightless navigation.' },
      { option: 'Section C', reason: 'Section C analyzes artificial lanterns and fireflies.' }
    ],
    strategyTip: "Look for historical/evolutionary references ('ancestors', 'dinosaurs', 'extinction') to immediately pinpoint Section A."
  },
  3: {
    whyCorrect: `Section A explains that bats hunt at night because the daytime economy is already heavily exploited by daytime competitors like birds.`,
    passageEvidence: {
      section: 'Section A',
      quote: 'You might say that this is a problem of their own making... But the daytime economy is already heavily exploited by other creatures such as birds.',
      supportingText: "This shows why bats were forced into nocturnal niches: daytime niches were already fully occupied."
    },
    whyOthersWrong: [
      { option: 'Section B', reason: 'Section B discusses the difficulty of lightless flight, not the root evolutionary motivation.' }
    ],
    strategyTip: "Notice the causal question 'Why bats hunt in the dark' matches Section A's 'Given that alternative daytime trades are thoroughly occupied'."
  },
  4: {
    whyCorrect: `Section E explains how understanding radar theory and applying it to bats helped scientists unlock our understanding of bat sonar.`,
    passageEvidence: {
      section: 'Section E',
      quote: 'much of our scientific understanding of the details of what bats are doing has come from applying radar theory to them.',
      supportingText: "This directly answers how a technological discovery (radar) assisted scientific understanding of biological echolocation."
    },
    strategyTip: "Focus on the keyword 'discovery' and identify where human scientific breakthroughs fed back into zoological comprehension."
  },
  5: {
    whyCorrect: `Section D explains that instruments measuring sea depth and detecting submarines in WWII under names like Asdic and Sonar were early military uses.`,
    passageEvidence: {
      section: 'Section D',
      quote: 'After this technique had been invented, it was only a matter of time before weapons designers adapted it for the detection of submarines.',
      supportingText: "Identifies WWII military applications (Asdic, Sonar, Radar) adapted by weapons designers."
    },
    strategyTip: "Scan for military vocabulary such as 'weapons designers', 'submarines', and 'Second World War'."
  },
  6: {
    whyCorrect: `Section D mentions that facial vision sensation can be referred to the front of the face, 'like the referred pain in a phantom limb'.`,
    passageEvidence: {
      section: 'Section D',
      quote: 'although the sensation may be referred to the front of the face, like the referred pain in a phantom limb.',
      supportingText: "Only the word 'phantom' precedes 'limb' (or 'arm or leg') grammatically and factually."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Must be an adjective modifying 'arm or leg'; 'phantom' fits the exact phrase 'phantom limb'."
    },
    strategyTip: "Note that 'arm or leg' in the summary paraphrases the passage's 'limb'."
  },
  7: {
    whyCorrect: `Section D states that blind people are actually using 'echoes' of their own footsteps and of other sounds.`,
    passageEvidence: {
      section: 'Section D',
      quote: 'Blind people, without even being aware of the fact, are actually using echoes of their own footsteps and of other sounds, to sense the presence of obstacles.',
      supportingText: "The sensation actually enters through the ears as reflected sound/echoes."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Direct object of perceiving; 'echoes' is the exact plural noun in the text."
    },
    strategyTip: "Identify what is perceived 'through the ears'—the passage explicitly says 'echoes'."
  },
  8: {
    whyCorrect: `Section D mentions that early instruments exploited the principle 'to measure the depth of the sea under a ship'.`,
    passageEvidence: {
      section: 'Section D',
      quote: 'engineers had already built instruments to exploit the principle, for example to measure the depth of the sea under a ship.',
      supportingText: "'Calculated the depth of the seabed' mirrors 'measure the depth of the sea'."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Noun following 'calculated the'; 'depth' fits both grammar and meaning."
    },
    strategyTip: "'Calculate' in the prompt paraphrases 'measure' in the text."
  },
  9: {
    whyCorrect: `Section D explains that weapons designers adapted the technique 'for the detection of submarines'.`,
    passageEvidence: {
      section: 'Section D',
      quote: 'weapons designers adapted it for the detection of submarines.',
      supportingText: "'Devices for finding submarines' directly paraphrases 'detection of submarines'."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Noun following preposition 'finding'; 'submarines' is the target vessel."
    },
    strategyTip: "'Finding' replaces 'detection' in the summary gap."
  },
  10: {
    whyCorrect: `Section E specifies that 'natural selection working on bats, had perfected the system tens of millions of years earlier'.`,
    passageEvidence: {
      section: 'Section E',
      quote: 'all the world now knows that bats, or rather natural selection working on bats, had perfected the system tens of millions of years earlier',
      supportingText: "'Natural selection' perfected the system long before humans developed radar."
    },
    completionGuidance: {
      wordLimit: 'NO MORE THAN TWO WORDS',
      grammarNote: "Subject noun phrase completing 'Long before the invention of radar [natural selection] had perfected...'."
    },
    strategyTip: "Copy only the exact two-word term directly from the passage."
  },
  11: {
    whyCorrect: `Section E explains that bats do not use 'radio waves', which is why bat 'radar' is technically a misnomer.`,
    passageEvidence: {
      section: 'Section E',
      quote: 'It is technically incorrect to talk about bat "radar", since they do not use radio waves.',
      supportingText: "They use sound waves, not electromagnetic radio waves."
    },
    completionGuidance: {
      wordLimit: 'NO MORE THAN TWO WORDS',
      grammarNote: "Noun phrase following 'do not use'."
    },
    strategyTip: "Look for 'technically incorrect' to locate what bats do not emit."
  },
  12: {
    whyCorrect: `Section E states that 'the underlying mathematical theories of radar and sonar are very similar'.`,
    passageEvidence: {
      section: 'Section E',
      quote: 'the underlying mathematical theories of radar and sonar are very similar',
      supportingText: "The similarity between radar and sonar lies in their mathematical theories."
    },
    completionGuidance: {
      wordLimit: 'NO MORE THAN TWO WORDS',
      grammarNote: "Compound noun phrase completing 'similar [mathematical theories]'."
    },
    strategyTip: "Match 'similar' in the sentence to 'very similar' in the passage."
  },
  13: {
    whyCorrect: `Section E introduces Donald Griffin as an 'American zoologist'.`,
    passageEvidence: {
      section: 'Section E',
      quote: 'The American zoologist Donald Griffin, who was largely responsible for the discovery of sonar in bats, coined the term "echolocation"',
      supportingText: "Donald Griffin was a zoologist."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Profession noun qualifying Donald Griffin."
    },
    strategyTip: "Identify the profession preceding the named researcher Donald Griffin."
  },
  14: {
    whyCorrect: `Paragraph A describes how ancient Rome built nine major systems with an innovative layout of pipes and sewers that supplied ample water.`,
    passageEvidence: {
      section: 'Paragraph A',
      quote: 'At the height of the Roman Empire, nine major systems, with an innovative layout of pipes and well-built sewers, supplied the occupants of Rome with as much water per person as is provided in many parts of the industrial world today.',
      supportingText: "Clearly matches Heading: 'A description of ancient water supplies'."
    },
    strategyTip: "Match Roman Empire pipes/aqueducts with 'ancient water supplies'."
  },
  15: {
    whyCorrect: `Paragraph C details how lack of clean drinking water and sanitation causes preventable water-related diseases that kill 10,000 to 20,000 children daily.`,
    passageEvidence: {
      section: 'Paragraph C',
      quote: 'Preventable water-related diseases kill an estimated 10,000 to 20,000 children every day',
      supportingText: "Directly relates to health impacts."
    },
    strategyTip: "Notice disease and child mortality link to 'relevance to health'."
  },
  16: {
    whyCorrect: `Paragraph D outlines ecological catastrophes: 20% of freshwater fish threatened, soil degradation, falling aquifers, and destroyed river ecosystems.`,
    passageEvidence: {
      section: 'Paragraph D',
      quote: 'More than 20% of all freshwater fish species are now threatened or endangered because dams and water withdrawals have destroyed the free-flowing river ecosystems',
      supportingText: "Encompasses environmental devastation caused by damming and overuse."
    },
    strategyTip: "Identify biodiversity loss and ecosystem destruction under 'Environmental effects'."
  },
  17: {
    whyCorrect: `Paragraph E highlights how water experts are demanding a fundamental shift in philosophy: meeting basic needs first and rethinking infrastructure priorities.`,
    passageEvidence: {
      section: 'Paragraph E',
      quote: 'Some water experts are now demanding that existing infrastructure be used in smarter ways rather than building new facilities',
      supportingText: "Corresponds to 'Scientists' call for revision of policy'."
    },
    strategyTip: "Connect 'water experts demanding' to 'scientists call for revision'."
  },
  18: {
    whyCorrect: `Paragraph F notes the unexpected finding that water demand is no longer soaring at previous projected rates, even falling in some regions.`,
    passageEvidence: {
      section: 'Paragraph F',
      quote: 'Fortunately - and unexpectedly - the demand for water is not rising as rapidly as some predicted.',
      supportingText: "Matches 'A surprising downward trend in demand for water'."
    },
    strategyTip: "'Unexpectedly' mirrors 'surprising' in the heading."
  },
  19: {
    whyCorrect: `Paragraph G asks 'What explains this remarkable turn of events?' and answers with efficiency technologies and community conservation.`,
    passageEvidence: {
      section: 'Paragraph G',
      quote: 'Two factors: people have figured out how to use water more efficiently, and communities are rethinking their priorities for water use.',
      supportingText: "Directly provides the explanation for reduced water use."
    },
    strategyTip: "The opening rhetorical question signals an explanatory section."
  },
  20: {
    whyCorrect: `Paragraph H argues future projects in developing countries must be built to higher specifications, with greater local accountability and environmental standards.`,
    passageEvidence: {
      section: 'Paragraph H',
      quote: 'But such projects must be built to higher specifications and with more accountability to local people and their environment than in the past.',
      supportingText: "Directly aligns with 'The need to raise standards'."
    },
    strategyTip: "'Higher specifications' and 'more accountability' equate to 'raising standards'."
  },
  21: {
    whyCorrect: `Paragraph A explicitly states that ancient Rome supplied as much water per person as is provided in many parts of the industrial world today, contradicting the claim that it is higher today.`,
    passageEvidence: {
      section: 'Paragraph A',
      quote: 'supplied the occupants of Rome with as much water per person as is provided in many parts of the industrial world today.',
      supportingText: "Because it was 'as much', the claim that industrial use is higher is NO."
    },
    strategyTip: "'As much as' directly contradicts 'higher than'."
  },
  22: {
    whyCorrect: `Paragraph B confirms that food production kept pace with population growth mainly due to the expansion of artificial irrigation systems.`,
    passageEvidence: {
      section: 'Paragraph B',
      quote: 'Food production has kept pace with soaring populations mainly because of the expansion of artificial irrigation systems',
      supportingText: "'Mainly because of' validates 'due primarily to'."
    },
    strategyTip: "Recognize that 'primarily' is a synonym for 'mainly'."
  },
  23: {
    whyCorrect: `Paragraph C says modern services are 'inferior' to ancient Greeks and Romans, but never discusses whether modern engineers imitate or copy ancient design blueprints.`,
    passageEvidence: {
      section: 'Paragraph C',
      quote: 'with water services inferior to those available to the ancient Greeks and Romans.',
      supportingText: "There is no information regarding imitation of ancient systems."
    },
    strategyTip: "Do not assume imitation just because ancient and modern standards are compared."
  },
  24: {
    whyCorrect: `Paragraphs F and G demonstrate that while industrial output has continued to soar, water demand and withdrawals have actually fallen or slowed down.`,
    passageEvidence: {
      section: 'Paragraph F',
      quote: 'Although population, industrial output and economic productivity have continued to soar in developed nations, the rate at which people withdraw water from aquifers, rivers and lakes has slowed.',
      supportingText: "Hence, industrial growth is not increasing overall water demand."
    },
    strategyTip: "Watch out for contrasting conjunctions like 'Although... soared, withdrawals have slowed'."
  },
  25: {
    whyCorrect: `Paragraph G explicitly states that new technologies help to conserve water in homes, causing domestic consumption per person to decrease.`,
    passageEvidence: {
      section: 'Paragraph G',
      quote: 'the amount of water consumed per person has actually decreased, thanks to a range of new technologies that help to conserve water in homes and industry.',
      supportingText: "Confirms YES."
    },
    strategyTip: "'Conserve water in homes' corresponds to 'reduction in domestic water consumption'."
  },
  26: {
    whyCorrect: `Paragraph H discusses building infrastructure with more accountability to local people, but says nothing about whether governments should retain state ownership.`,
    passageEvidence: {
      section: 'Paragraph H',
      quote: 'such projects must be built to higher specifications and with more accountability to local people',
      supportingText: "Government ownership is never mentioned in the text."
    },
    strategyTip: "If the topic (government ownership) is absent from the author's arguments, mark NOT GIVEN."
  },
  27: {
    whyCorrect: `The first paragraph defines the book as looking at 'radical new approaches to learning', which corresponds to non-traditional learning ways.`,
    passageEvidence: {
      section: 'Paragraph A',
      quote: 'Educating Psyche by Bernie Neville is a book which looks at radical new approaches to learning, describing the effects of emotion, imagination and the unconscious on learning.',
      supportingText: "'Radical new approaches' = ways of learning that are not traditional."
    },
    whyOthersWrong: [
      { option: 'the power of suggestion in learning', reason: "That is only Lozanov's theory within the book, not the entire subject of Bernie Neville's book." }
    ],
    strategyTip: "Distinguish between the overarching book's thesis and one specific researcher's theory discussed within it."
  },
  28: {
    whyCorrect: `Paragraph B demonstrates that peripheral, unimportant details (the color of binding, table location) are remembered long after main content is forgotten.`,
    passageEvidence: {
      section: 'Paragraph B',
      quote: 'we will find it easier to recall peripheral details - the colour, the binding, the typeface, the table at the library... than the content on which we were concentrating.',
      supportingText: "Unimportant peripheral details are easiest to recall."
    },
    strategyTip: "'Peripheral details' means auxiliary, unimportant background details."
  },
  29: {
    whyCorrect: `Paragraph B provides the book and lecture examples to show our everyday experience confirms that unconscious/peripheral processing occurs readily.`,
    passageEvidence: {
      section: 'Paragraph B',
      quote: 'Besides the laboratory evidence for this, we know from our experience that we often remember what we have perceived peripherally',
      supportingText: "Serves to validate the theory using everyday real-world examples."
    },
    strategyTip: "Look at the introductory sentence of Paragraph B to find the purpose of the illustrations."
  },
  30: {
    whyCorrect: `Paragraph C states that in suggestopedia, consciousness is shifted away from the curriculum so the reserve capacity of the brain handles it.`,
    passageEvidence: {
      section: 'Paragraph C',
      quote: 'consciousness is shifted away from the curriculum to focus on something peripheral. The curriculum then becomes peripheral and is dealt with by the reserve capacity of the brain.',
      supportingText: "Students are trained to focus their conscious minds away from curriculum content."
    },
    strategyTip: "Focus on 'consciousness is shifted away from the curriculum'."
  },
  31: {
    whyCorrect: `Paragraph D states that in the second part, not only does the music change from classical to baroque, but the teacher also switches from reading solemnly to speaking in a normal voice, and students close their books.`,
    passageEvidence: {
      section: 'Paragraph D',
      quote: 'In the second part, they listen to baroque music... while the teacher reads the text in a normal speaking voice. During this time they have their books closed.',
      supportingText: "Multiple variables change (music, vocal tone, books open/closed), so claiming only music changes is FALSE."
    },
    strategyTip: "Check for absolute qualifiers like 'only variable'."
  },
  32: {
    whyCorrect: `Paragraph E explains that students are given the expectation that learning will be 'easy and pleasant', not demanding.`,
    passageEvidence: {
      section: 'Paragraph E',
      quote: 'Through meeting with the staff and satisfied students they develop the expectation that learning will be easy and pleasant',
      supportingText: "'Easy and pleasant' directly contradicts 'demanding'."
    },
    strategyTip: "Notice how 'demanding' conflicts directly with 'easy and pleasant'."
  },
  33: {
    whyCorrect: `Paragraph F notes that in the follow-up class, students use games and improvised dramatisations, adding: 'Such methods are not unusual in language teaching.'`,
    passageEvidence: {
      section: 'Paragraph F',
      quote: 'Such methods are not unusual in language teaching.',
      supportingText: "Not unusual means they are similar to conventional language teaching activities."
    },
    strategyTip: "Double negative 'not unusual' means common/conventional."
  },
  34: {
    whyCorrect: `The text discusses memory capacity during classes, but never mentions whether students report noticing improvements in their general everyday memory as a side benefit.`,
    passageEvidence: {
      section: 'Paragraph F',
      quote: 'The teacher\'s task is to assist the students to apply what they have learned paraconsciously',
      supportingText: "Everyday memory side benefits are not addressed."
    },
    strategyTip: "Beware of plausible real-world assumptions that lack textual confirmation."
  },
  35: {
    whyCorrect: `Paragraph H notes that few teachers are able to emulate Lozanov's results, but does not provide survey data on whether teachers prefer this over traditional pedagogy.`,
    passageEvidence: {
      section: 'Paragraph H',
      quote: 'few teachers are able to emulate the spectacular results of Lozanov and his associates.',
      supportingText: "Teacher preference is NOT GIVEN."
    },
    strategyTip: "Failure to emulate does not indicate preference or lack of preference."
  },
  36: {
    whyCorrect: `Paragraph F states that students can regularly learn 1000 new words of a foreign language during a session, which is noted as a marked difference from conventional teaching.`,
    passageEvidence: {
      section: 'Paragraph F',
      quote: 'Another difference from conventional teaching is the evidence that students can regularly learn 1000 new words of a foreign language during a suggestopedic session',
      supportingText: "They retain significantly more vocabulary than in ordinary classrooms."
    },
    strategyTip: "Contrast with conventional teaching highlights vocabulary retention superiority."
  },
  37: {
    whyCorrect: `Paragraph G describes hypnotic trance states, yoga, and religious ceremonies as rituals that function as placebos.`,
    passageEvidence: {
      section: 'Paragraph G',
      quote: 'Such rituals may be seen as placebos. Lozanov acknowledges that the ritual surrounding suggestion in his own system is also a placebo',
      supportingText: "Lozanov admits that the ritual surrounding his system is a placebo."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Must choose exact word 'ritual' from provided list."
    },
    strategyTip: "Look for the exact word 'ritual' in Paragraph G."
  },
  38: {
    whyCorrect: `Paragraph G continues that just as a doctor dispenses a white capsule with authority, the procedure works as a placebo to tap brain reserves.`,
    passageEvidence: {
      section: 'Paragraph G',
      quote: 'Like any placebo, it must be dispensed with authority to be effective.',
      supportingText: "The system functions as a placebo to unlock confidence."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Noun 'placebo' from the summary word box."
    },
    strategyTip: "'Placebo' is explicitly repeated three times in Paragraph G."
  },
  39: {
    whyCorrect: `Paragraph H states that few teachers are able to emulate the 'spectacular' results achieved by Lozanov.`,
    passageEvidence: {
      section: 'Paragraph H',
      quote: 'few teachers are able to emulate the spectacular results of Lozanov and his associates.',
      supportingText: "Lozanov achieved spectacular results."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Adjective modifying results."
    },
    strategyTip: "Matches 'spectacular' directly from Paragraph H."
  },
  40: {
    whyCorrect: `Paragraph H contrasts Lozanov's spectacular success with the mediocre or unspectacular results attained by other teachers.`,
    passageEvidence: {
      section: 'Paragraph H',
      quote: 'We can, perhaps, attribute mediocre results to an inadequate placebo effect.',
      supportingText: "Other teachers achieve mediocre / unspectacular outcomes."
    },
    completionGuidance: {
      wordLimit: 'ONE WORD ONLY',
      grammarNote: "Adjective 'unspectacular' chosen from choices list to paraphrase 'mediocre'."
    },
    strategyTip: "The choices list contains 'unspectacular' which matches 'mediocre' in the text."
  }
};
