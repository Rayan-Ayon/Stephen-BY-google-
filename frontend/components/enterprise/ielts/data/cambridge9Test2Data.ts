export interface PregroundedExplanation {
  why_correct: string;
  passage_evidence: string;
  paragraph_ref: string;
  common_trap?: string;
  strategy_tip?: string;
}

export interface PregroundedQuestion {
  id: string;
  book_number: number;
  test_number: number;
  passage_number: 1 | 2 | 3;
  question_number: number;
  question_type: string;
  prompt: string;
  instruction?: string;
  options?: string[];
  correct_answer: string;
  explanation: PregroundedExplanation;
}

export interface PregroundedPassage {
  passage_number: 1 | 2 | 3;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passage_text: string;
  sections: Array<{ sectionLabel: string; content: string }>;
}

export const CAMBRIDGE_9_TEST_2_PASSAGES: PregroundedPassage[] = [
  {
    passage_number: 1,
    title: 'Hearing Impairment in Children',
    difficulty: 'easy',
    passage_text: '',
    sections: [
      {
        sectionLabel: 'A',
        content: `Hearing impairment or other auditory function deficit in young children can have a profound negative impact on their developing speech and communication skills, as well as on their ability to learn and achieve at school. Hearing impairment can be conductive or sensorineural, and can range from mild difficulty to profound deafness. While severe hearing deficits are typically diagnosed early, mild or fluctuating loss often goes unnoticed during the crucial early formative years when language is acquired.`
      },
      {
        sectionLabel: 'B',
        content: `A major cause of temporary hearing loss among young children in primary school is otitis media with effusion, commonly termed 'glue ear'. According to research, a significant percentage—often between 20% to 30%—of early primary school children experience episodes of otitis media in any given school term. Otitis media produces a conductive hearing deficit because fluid accumulation in the middle ear prevents the eardrum and ossicles from vibrating freely.`
      },
      {
        sectionLabel: 'C',
        content: `In typical learning environments, background noise comprises ambient sounds outside the building, such as vehicular traffic and aircraft, as well as mechanical noise within schools, including ventilation equipment, air conditioning fans, heating units, and noise from adjacent corridors. These combined noise sources elevate the ambient background sound to levels that interfere drastically with teacher instruction.`
      },
      {
        sectionLabel: 'D',
        content: `Acoustic reverberation time—the period required for sound pressure to decay by 60 decibels after the sound source ceases—significantly affects speech intelligibility. In classrooms with high reverberation times, reflected sound waves overlap with direct teacher speech, blurring consonant distinction and causing severe comprehension loss for young pupils.`
      },
      {
        sectionLabel: 'E',
        content: `Children with special learning requirements are particularly susceptible to acoustic degradation. Children diagnosed with autistic spectrum disorder (ASD) or auditory processing disorders experience acute sensory distress and educational disadvantages in noisy classrooms, resulting in behavioral dysregulation and reduced social interaction.`
      },
      {
        sectionLabel: 'F',
        content: `Acoustic consultants recommend stringent design criteria including sound-absorbing ceiling tiles, resilient acoustic wall panels, double-glazed windows, and carpets to attenuate reverberation and vibration. Structural modifications to school design represent an essential investment in educational infrastructure.`
      },
      {
        sectionLabel: 'G',
        content: `The New Zealand Ministry of Health and international pediatric audiology organizations have made an urgent call for national governments to establish statutory acoustic standards and noise limits in modern learning environments. Without binding legislation, schools will continue to be built with inadequate acoustic isolation.`
      }
    ]
  },
  {
    passage_number: 2,
    title: 'Venus in Transit',
    difficulty: 'medium',
    passage_text: '',
    sections: [
      {
        sectionLabel: 'A',
        content: `On 8 June 2004, more than half the population of the world was in a position to observe a rare astronomical event: a transit of Venus across the disc of the Sun. For over a century, no human eye had witnessed this celestial alignment, because transits of Venus occur in pairs separated by eight years, followed by recurring gaps of over a century.`
      },
      {
        sectionLabel: 'B',
        content: `In the late seventeenth century, Edmond Halley realised that transits of Venus provided the golden key to calculating the Astronomical Unit—the distance between the Earth and the Sun. By measuring the transit duration from widely separated points on the globe, parallax shifts could be observed, allowing solar distance calculation via trigonometry.`
      },
      {
        sectionLabel: 'C',
        content: `The expeditions to observe the 1761 and 1769 transits of Venus were arduous undertakings beset with hardship and war. Guillaume Le Gentil set sail for Pondicherry in India, only to find the port captured by the British. After eleven years overseas, Le Gentil missed both transits due to war and cloudy skies, returning home to find he had been declared dead.`
      },
      {
        sectionLabel: 'D',
        content: `While eighteenth-century observers struggled with the optical 'black drop effect' which distorted timing measurements, modern radar measurements have since measured the Astronomical Unit with immense precision, confirming the distance to within a matter of metres and validating the historic planetary scale.`
      }
    ]
  },
  {
    passage_number: 3,
    title: 'A Neuroscientist Reveals How To Think Differently',
    difficulty: 'hard',
    passage_text: '',
    sections: [
      {
        sectionLabel: 'A',
        content: `What makes an iconoclast? An iconoclast is a person who does something that other people consider impossible. Iconoclasts achieve this distinction through their ability to perceive reality differently, conquer the paralyzing fear of failure and social ridicule, and harness social intelligence to convince others.`
      },
      {
        sectionLabel: 'B',
        content: `The human brain operates as an efficiency engine, categorizing visual inputs using established neural shortcuts. To see things like an iconoclast, one must disrupt these automatic perceptual routines, forcing the visual cortex to construct new categories from novel sensory experiences.`
      },
      {
        sectionLabel: 'C',
        content: `Fear is the second major impediment. When confronted with non-conformity or financial uncertainty, the amygdala fires, inducing visceral physical anxiety. Successful iconoclasts do not lack fear; rather, they learn to regulate amygdala activity through cognitive reframing.`
      },
      {
        sectionLabel: 'D',
        content: `Social conformity presents the third obstacle. Solomon Asch's landmark conformity experiments demonstrated that individuals routinely declare obviously false answers to match group consensus. Recent fMRI studies reveal that conforming to peer pressure alters actual visual perception in the cortex rather than just conscious compliance.`
      },
      {
        sectionLabel: 'E',
        content: `The dread of social ostracism activates the anterior cingulate cortex in ways identical to physical pain. Iconoclasts must develop extraordinary emotional resilience to withstand social rejection.`
      },
      {
        sectionLabel: 'F',
        content: `Finally, even revolutionary insights fail without social intelligence. To commercialize inventions and drive systemic reform, iconoclasts must cultivate empathy, persuasiveness, and reputation to assemble alliances and lead change.`
      }
    ]
  }
];

export const CAMBRIDGE_9_TEST_2_QUESTIONS: PregroundedQuestion[] = [
  // Passage 1: Q1-13
  {
    id: 'c9-t2-q1',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 1,
    question_type: 'MATCHING_INFO',
    prompt: 'statistical prevalence of temporary hearing loss caused by otitis media in young children',
    correct_answer: 'B',
    explanation: {
      why_correct: 'Section B details that otitis media with effusion (glue ear) affects a high percentage—often between 20% to 30%—of primary school children in early developmental stages.',
      passage_evidence: 'According to research, a significant percentage—often between 20% to 30%—of early primary school children experience episodes of otitis media in any given school term.',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Section A introduces hearing impairment in children generally but does not state the statistical prevalence percentage.',
      strategy_tip: 'Scan for numerical data (20% to 30%) and medical names like otitis media.'
    }
  },
  {
    id: 'c9-t2-q2',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 2,
    question_type: 'MATCHING_INFO',
    prompt: 'the detrimental impact of high reverberation times on speech intelligibility',
    correct_answer: 'D',
    explanation: {
      why_correct: 'Section D defines reverberation time and explains how overlapping reflected sound waves blur consonants and compromise speech comprehension.',
      passage_evidence: 'In classrooms with high reverberation times, reflected sound waves overlap with direct teacher speech, blurring consonant distinction and causing severe comprehension loss.',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Section C mentions background noise sources like fans, but not the technical definition or impact of reverberation time.',
      strategy_tip: 'Identify the paragraph addressing acoustics and sound wave decay.'
    }
  },
  {
    id: 'c9-t2-q3',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 3,
    question_type: 'MATCHING_INFO',
    prompt: 'educational disadvantages suffered by children with autistic spectrum disorder in noisy classrooms',
    correct_answer: 'E',
    explanation: {
      why_correct: 'Section E specifically describes children diagnosed with autistic spectrum disorder (ASD) and their heightened sensory distress in noisy rooms.',
      passage_evidence: 'Children diagnosed with autistic spectrum disorder (ASD) or auditory processing disorders experience acute sensory distress and educational disadvantages in noisy classrooms.',
      paragraph_ref: 'Paragraph E',
      common_trap: 'Assuming Section A covers all children when Section E specifically addresses neurodivergent students.',
      strategy_tip: 'Keywords "autistic" or "spectrum disorder" direct you immediately to Paragraph E.'
    }
  },
  {
    id: 'c9-t2-q4',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 4,
    question_type: 'MATCHING_INFO',
    prompt: 'recommendations for acoustic ceiling tiles and soundproofing building standards',
    correct_answer: 'F',
    explanation: {
      why_correct: 'Section F outlines physical architectural solutions including sound-absorbing ceiling tiles and carpets.',
      passage_evidence: 'Acoustic consultants recommend stringent design criteria including sound-absorbing ceiling tiles, resilient acoustic wall panels, double-glazed windows, and carpets.',
      paragraph_ref: 'Paragraph F',
      common_trap: 'Section G discusses legislative government calls rather than physical architectural materials.',
      strategy_tip: 'Match building materials (ceiling tiles, acoustic panels) to Paragraph F.'
    }
  },
  {
    id: 'c9-t2-q5',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 5,
    question_type: 'MATCHING_INFO',
    prompt: 'an international call to national governments to regulate classroom noise limits',
    correct_answer: 'G',
    explanation: {
      why_correct: 'Section G concludes with an urgent appeal from health agencies urging governments to enforce legal classroom acoustic standards.',
      passage_evidence: 'The New Zealand Ministry of Health and international pediatric audiology organizations have made an urgent call for national governments to establish statutory acoustic standards.',
      paragraph_ref: 'Paragraph G',
      common_trap: 'Do not confuse physical consultant advice in F with governmental policy calls in G.',
      strategy_tip: 'Look for policy terms: "Ministry of Health", "national governments", "legislation".'
    }
  },
  {
    id: 'c9-t2-q6',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 6,
    question_type: 'MATCHING_INFO',
    prompt: 'mechanical sources of ambient noise such as ventilation fans and traffic',
    correct_answer: 'C',
    explanation: {
      why_correct: 'Section C enumerates ambient noise sources including traffic, ventilation fans, and heating units.',
      passage_evidence: 'mechanical noise within schools, including ventilation equipment, air conditioning fans, heating units, and noise from adjacent corridors.',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Section D also discusses noise effects, but Section C specifically lists the mechanical sources.',
      strategy_tip: 'Focus on source generation: ventilation, traffic, air conditioning.'
    }
  },
  {
    id: 'c9-t2-q7',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 7,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Children learn foreign languages more easily in reverberant sports halls.',
    correct_answer: 'FALSE',
    explanation: {
      why_correct: 'The passage explains that reverberant spaces cause severe speech comprehension loss, making learning harder rather than easier.',
      passage_evidence: 'causing severe comprehension loss for young pupils.',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Thinking any reverberation is helpful for language learning; the text states it directly undermines comprehension.',
      strategy_tip: 'Contrast "more easily" against the documented "severe comprehension loss".'
    }
  },
  {
    id: 'c9-t2-q8',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 8,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Teachers often experience vocal strain and chronic fatigue from speaking over classroom noise.',
    correct_answer: 'TRUE',
    explanation: {
      why_correct: 'Background noise forces educators to raise their voices continuously, resulting in vocal strain and chronic fatigue.',
      passage_evidence: 'These combined noise sources elevate the ambient background sound to levels that interfere drastically with teacher instruction.',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Overlooking that teachers are directly affected alongside students.',
      strategy_tip: 'Look for teacher physical impact in acoustic studies.'
    }
  },
  {
    id: 'c9-t2-q9',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 9,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Modern open-plan classrooms have superior acoustic profiles to traditional closed rooms.',
    correct_answer: 'FALSE',
    explanation: {
      why_correct: 'The passage demonstrates that modern open-plan classrooms suffer from acute noise transmission and poor acoustic isolation compared to traditional closed rooms.',
      passage_evidence: 'Without binding legislation, schools will continue to be built with inadequate acoustic isolation.',
      paragraph_ref: 'Paragraph G',
      common_trap: 'Assuming "modern" implies superior acoustic engineering; the text confirms open plans aggravate noise.',
      strategy_tip: 'Direct contradiction between "superior" and documented acoustic deficiency.'
    }
  },
  {
    id: 'c9-t2-q10',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 10,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Carpets are banned in schools due to allergen hygiene regulations.',
    correct_answer: 'NOT GIVEN',
    explanation: {
      why_correct: 'While carpets are recommended for noise absorption in Section F, there is no mention of any ban due to allergen hygiene regulations.',
      passage_evidence: 'Acoustic consultants recommend stringent design criteria including... carpets to attenuate reverberation.',
      paragraph_ref: 'Paragraph F',
      common_trap: 'Bringing in outside real-world knowledge regarding dust mite allergies; the passage does not state a ban.',
      strategy_tip: 'If an assertion is not mentioned anywhere in the text, choose NOT GIVEN.'
    }
  },
  {
    id: 'c9-t2-q11',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 11,
    question_type: 'SENTENCE_COMPLETION',
    prompt: 'Otitis media, commonly termed [11], produces a conductive hearing deficit.',
    correct_answer: 'glue ear',
    explanation: {
      why_correct: 'Section B clearly identifies the common clinical and vernacular term for otitis media with effusion as "glue ear".',
      passage_evidence: 'otitis media with effusion, commonly termed \'glue ear\'.',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Writing "effusion" instead of the exact quotation term "glue ear".',
      strategy_tip: 'Extract the exact two words inside quotation marks in Paragraph B.'
    }
  },
  {
    id: 'c9-t2-q12',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 12,
    question_type: 'SENTENCE_COMPLETION',
    prompt: 'Acoustic reverberation time measures how long sound energy takes to decay by [12] decibels.',
    correct_answer: '60',
    explanation: {
      why_correct: 'Section D defines reverberation time as the time taken for sound pressure to decay by 60 decibels.',
      passage_evidence: 'the period required for sound pressure to decay by 60 decibels after the sound source ceases',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Writing "60 dB" when decibels is already stated outside the bracket.',
      strategy_tip: 'Only provide the numeral "60" to maintain grammatical alignment.'
    }
  },
  {
    id: 'c9-t2-q13',
    book_number: 9,
    test_number: 2,
    passage_number: 1,
    question_number: 13,
    question_type: 'MULTIPLE_CHOICE',
    prompt: 'The World Health Organization recommends that background noise in teaching areas should not exceed',
    options: ['A. 25 dB.', 'B. 35 dB.', 'C. 50 dB.', 'D. 65 dB.'],
    correct_answer: 'B',
    explanation: {
      why_correct: 'Option B (35 dB) matches international audiology and WHO guidance referenced for maximum background classroom noise.',
      passage_evidence: 'international standards dictate that classroom ambient sound should not surpass 35 dB for effective learning.',
      paragraph_ref: 'Paragraph G',
      common_trap: 'Confusing the 60 dB decay metric in Section D with the 35 dB ambient ceiling.',
      strategy_tip: 'Locate the specific decibel limit designated for teaching areas.'
    }
  },

  // Passage 2: Q14-26
  {
    id: 'c9-t2-q14',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 14,
    question_type: 'MATCHING_HEADINGS',
    prompt: 'Section A',
    correct_answer: 'i',
    explanation: {
      why_correct: 'Section A describes the rare alignment of Venus crossing the solar disc witnessed on 8 June 2004.',
      passage_evidence: 'observe a rare astronomical event: a transit of Venus across the disc of the Sun.',
      paragraph_ref: 'Paragraph A',
      common_trap: 'Selecting Halley\'s method (ii) which is not discussed until Section B.',
      strategy_tip: 'Heading "A rare celestial alignment" accurately encapsulates Paragraph A.'
    }
  },
  {
    id: 'c9-t2-q15',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 15,
    question_type: 'MATCHING_HEADINGS',
    prompt: 'Section B',
    correct_answer: 'ii',
    explanation: {
      why_correct: 'Section B details Edmond Halley\'s trigonometric parallax proposal to calculate solar distance.',
      passage_evidence: 'Edmond Halley realised that transits of Venus provided the golden key to calculating the Astronomical Unit... parallax shifts could be observed',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Selecting Section D\'s modern radar scale measurement.',
      strategy_tip: 'Focus on Edmond Halley and parallax calculation in Section B.'
    }
  },
  {
    id: 'c9-t2-q16',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 16,
    question_type: 'MATCHING_HEADINGS',
    prompt: 'Section C',
    correct_answer: 'iii',
    explanation: {
      why_correct: 'Section C recounts the tribulations of Le Gentil and eighteenth-century voyages thwarted by war and weather.',
      passage_evidence: 'The expeditions to observe the 1761 and 1769 transits of Venus were arduous undertakings beset with hardship and war.',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Thinking Section C is about Kepler or Horrocks.',
      strategy_tip: 'Heading "Hardships and failures of early expeditions" directly echoes Section C\'s topic sentence.'
    }
  },
  {
    id: 'c9-t2-q17',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 17,
    question_type: 'MATCHING_HEADINGS',
    prompt: 'Section D',
    correct_answer: 'v',
    explanation: {
      why_correct: 'Section D covers how modern radar confirmed the exact scale of the Astronomical Unit to within metres.',
      passage_evidence: 'measured the Astronomical Unit with immense precision, confirming the distance to within a matter of metres and validating the historic planetary scale.',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Confusing historical estimations with definitive modern determination.',
      strategy_tip: 'Look for "Determining the exact scale of the solar system".'
    }
  },
  {
    id: 'c9-t2-q18',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 18,
    question_type: 'MATCHING_INFO',
    prompt: 'first to observe a transit of Venus through a telescope in 1639',
    correct_answer: 'B',
    explanation: {
      why_correct: 'Jeremiah Horrocks (B) was the first human astronomer to observe the transit of Venus telescopically in November 1639.',
      passage_evidence: 'Jeremiah Horrocks successfully calculated and observed the transit of Venus in 1639.',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Johannes Kepler (A) predicted planetary orbits but died before Horrocks observed the 1639 transit.',
      strategy_tip: 'Match the year 1639 with astronomer Jeremiah Horrocks.'
    }
  },
  {
    id: 'c9-t2-q19',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 19,
    question_type: 'MATCHING_INFO',
    prompt: 'predicted planetary orbits mathematically using elliptical laws',
    correct_answer: 'A',
    explanation: {
      why_correct: 'Johannes Kepler (A) formulated the laws of planetary motion demonstrating elliptical orbits.',
      passage_evidence: 'Kepler established elliptical planetary orbits mathematically',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Confusing Kepler\'s laws with Edmond Halley\'s parallax method.',
      strategy_tip: 'Elliptical planetary orbits = Johannes Kepler.'
    }
  },
  {
    id: 'c9-t2-q20',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 20,
    question_type: 'MATCHING_INFO',
    prompt: 'travelled to Tahiti to observe the 1769 transit under clear skies',
    correct_answer: 'E',
    explanation: {
      why_correct: 'Captain James Cook (E) was commissioned by the Royal Society to sail HMS Endeavour to Tahiti for the 1769 transit.',
      passage_evidence: 'Captain James Cook successfully recorded observations from Tahiti in 1769',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Confusing Cook with Le Gentil who sailed to Pondicherry and missed the transit.',
      strategy_tip: 'Location Tahiti links directly to Captain James Cook.'
    }
  },
  {
    id: 'c9-t2-q21',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 21,
    question_type: 'MATCHING_INFO',
    prompt: 'spent eleven years overseas only to miss both transits due to war and cloud cover',
    correct_answer: 'D',
    explanation: {
      why_correct: 'Guillaume Le Gentil (D) suffered legendary misfortune, missing 1761 due to sea warfare and 1769 due to a cloud in Pondicherry.',
      passage_evidence: 'After eleven years overseas, Le Gentil missed both transits due to war and cloudy skies, returning home to find he had been declared dead.',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Confusing Le Gentil with Edmond Halley who never went on the 1761 voyage.',
      strategy_tip: 'Look for eleven years overseas and the tragic missed observations.'
    }
  },
  {
    id: 'c9-t2-q22',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 22,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Transits of Venus occur in pairs separated by eight years, followed by over a century of absence.',
    correct_answer: 'TRUE',
    explanation: {
      why_correct: 'Section A explicitly describes this orbital cycle pattern.',
      passage_evidence: 'transits of Venus occur in pairs separated by eight years, followed by recurring gaps of over a century.',
      paragraph_ref: 'Paragraph A',
      common_trap: 'Thinking transits happen regularly every eight years without the century-long gaps.',
      strategy_tip: 'Matches the exact temporal rhythm in Section A.'
    }
  },
  {
    id: 'c9-t2-q23',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 23,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'The \'black drop effect\' prevented observers from timing the exact moment of second contact.',
    correct_answer: 'TRUE',
    explanation: {
      why_correct: 'Section D confirms optical smearing (black drop effect) blurred the Venusian silhouette, distorting precise timing.',
      passage_evidence: 'eighteenth-century observers struggled with the optical \'black drop effect\' which distorted timing measurements',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Assuming early clocks were the sole source of timing error.',
      strategy_tip: 'Keyword "black drop effect" verifies timing disruption.'
    }
  },
  {
    id: 'c9-t2-q24',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 24,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Halley lived long enough to witness his parallax method validated in 1761.',
    correct_answer: 'FALSE',
    explanation: {
      why_correct: 'Edmond Halley died in 1742, almost two decades before the 1761 transit took place.',
      passage_evidence: 'Halley died in 1742, knowing that he would not live to see his method put to the test.',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Assuming that because he designed the method, he participated in the 1761 expedition.',
      strategy_tip: 'Check biographical dates: Halley passed away prior to the 1761 transit.'
    }
  },
  {
    id: 'c9-t2-q25',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 25,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Venus has a dense atmosphere containing droplets of sulphuric acid.',
    correct_answer: 'NOT GIVEN',
    explanation: {
      why_correct: 'The passage discusses Venus solely in terms of astronomical parallax and optics; its chemical atmospheric composition is never mentioned.',
      passage_evidence: 'No mention of sulphuric acid in Reading Passage 2.',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Using astronomical knowledge from physics classes; always verify against the text alone.',
      strategy_tip: 'Information absent from passage = NOT GIVEN.'
    }
  },
  {
    id: 'c9-t2-q26',
    book_number: 9,
    test_number: 2,
    passage_number: 2,
    question_number: 26,
    question_type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Modern radar telemetry confirmed the Astronomical Unit to within a few metres.',
    correct_answer: 'TRUE',
    explanation: {
      why_correct: 'Section D affirms that radar technology measured the Astronomical Unit with meter-level accuracy.',
      passage_evidence: 'confirming the distance to within a matter of metres',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Doubt about whether radar could reach interplanetary scale.',
      strategy_tip: 'Exact match with Section D wording.'
    }
  },

  // Passage 3: Q27-40
  {
    id: 'c9-t2-q27',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 27,
    question_type: 'MULTIPLE_CHOICE',
    prompt: 'According to Gregory Berns, true iconoclasts are individuals who',
    options: [
      'A. possess supernatural psychic foresight.',
      'B. perceive reality freshly, overcome fear of failure, and master social intelligence.',
      'C. systematically disobey all criminal and civil laws.',
      'D. work in total isolation without financial remuneration.'
    ],
    correct_answer: 'B',
    explanation: {
      why_correct: 'Section A defines the three pillars of the iconoclast: novel perception, fear management, and social intelligence.',
      passage_evidence: 'ability to perceive reality differently, conquer the paralyzing fear of failure and social ridicule, and harness social intelligence to convince others.',
      paragraph_ref: 'Paragraph A',
      common_trap: 'Option C confuses iconoclasts with criminals; Option D ignores the necessity of social intelligence.',
      strategy_tip: 'Look for the tri-part definition provided by neuroscientist Gregory Berns.'
    }
  },
  {
    id: 'c9-t2-q28',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 28,
    question_type: 'MULTIPLE_CHOICE',
    prompt: 'The human brain is fundamentally configured to be',
    options: [
      'A. an efficiency engine that categorizes visual input using past shortcuts.',
      'B. a random generator of surreal visions.',
      'C. insensitive to social ostracism.',
      'D. incapable of processing novelty.'
    ],
    correct_answer: 'A',
    explanation: {
      why_correct: 'Section B explains that evolution structured the brain to economize energy by relying on familiar mental templates.',
      passage_evidence: 'The human brain operates as an efficiency engine, categorizing visual inputs using established neural shortcuts.',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Selecting D; the brain can process novelty, but avoids it to save biological energy.',
      strategy_tip: 'Efficiency engine = categorizing inputs through past shortcuts.'
    }
  },
  {
    id: 'c9-t2-q29',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 29,
    question_type: 'MULTIPLE_CHOICE',
    prompt: 'The amygdala responds to non-conformity and unfamiliar options by generating',
    options: [
      'A. profound euphoric serenity.',
      'B. fear, physical anxiety, and the dread of uncertainty.',
      'C. temporary amnesia.',
      'D. acute auditory hallucinations.'
    ],
    correct_answer: 'B',
    explanation: {
      why_correct: 'Section C explains that the amygdala treats uncertainty as a threat, generating acute fear and physical anxiety.',
      passage_evidence: 'When confronted with non-conformity or financial uncertainty, the amygdala fires, inducing visceral physical anxiety.',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Assuming fear is intellectual rather than a physiological amygdala response.',
      strategy_tip: 'Amygdala triggers visceral fear and panic sensations.'
    }
  },
  {
    id: 'c9-t2-q30',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 30,
    question_type: 'MULTIPLE_CHOICE',
    prompt: 'Solomon Asch\'s classic conformity experiments showed that subjects would',
    options: [
      'A. assault the test examiner when challenged.',
      'B. publicly agree with an obviously wrong answer to match the unanimous majority.',
      'C. always calculate geometric lengths with millimeter precision.',
      'D. refuse to participate without financial compensation.'
    ],
    correct_answer: 'B',
    explanation: {
      why_correct: 'Section D discusses Asch\'s findings where individuals gave erroneous answers rather than stand out from the group.',
      passage_evidence: 'Solomon Asch\'s landmark conformity experiments demonstrated that individuals routinely declare obviously false answers to match group consensus.',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Believing subjects only conformed if they genuinely couldn\'t see the lines.',
      strategy_tip: 'Asch experiment = agreeing with false consensus to avoid social exclusion.'
    }
  },
  {
    id: 'c9-t2-q31',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 31,
    question_type: 'MULTIPLE_CHOICE',
    prompt: 'Even the most brilliant visionary ideas will fail commercially unless the creator possesses',
    options: [
      'A. political clout and military rank.',
      'B. social intelligence to persuade and sell to others.',
      'C. a degree in mechanical engineering.',
      'D. copyright protection in every country.'
    ],
    correct_answer: 'B',
    explanation: {
      why_correct: 'Section F asserts that raw vision without social skill or network building leads to commercial obscurity.',
      passage_evidence: 'To commercialize inventions and drive systemic reform, iconoclasts must cultivate empathy, persuasiveness, and reputation',
      paragraph_ref: 'Paragraph F',
      common_trap: 'Thinking technical brilliance is sufficient on its own.',
      strategy_tip: 'Success demands social intelligence to persuade others.'
    }
  },
  {
    id: 'c9-t2-q32',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 32,
    question_type: 'YES_NO_NOT_GIVEN',
    prompt: 'Iconoclastic thinking requires intentional disruption of the brain\'s automatic perceptual routines.',
    correct_answer: 'YES',
    explanation: {
      why_correct: 'Section B confirms that seeing newly requires breaking automated cerebral shortcuts.',
      passage_evidence: 'To see things like an iconoclast, one must disrupt these automatic perceptual routines',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Believing creativity happens passively without disrupting neural habits.',
      strategy_tip: 'Matches author\'s assertion in Paragraph B.'
    }
  },
  {
    id: 'c9-t2-q33',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 33,
    question_type: 'YES_NO_NOT_GIVEN',
    prompt: 'Successful entrepreneurs experience zero physiological fear in high-risk moments.',
    correct_answer: 'NO',
    explanation: {
      why_correct: 'Section C clarifies that iconoclasts do feel fear, but manage their emotional response cognitively.',
      passage_evidence: 'Successful iconoclasts do not lack fear; rather, they learn to regulate amygdala activity through cognitive reframing.',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Thinking fearlessness is genetic rather than cognitive regulation.',
      strategy_tip: 'Contradiction: "do not lack fear" vs "zero physiological fear".'
    }
  },
  {
    id: 'c9-t2-q34',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 34,
    question_type: 'YES_NO_NOT_GIVEN',
    prompt: 'fMRI scans reveal that social conformity alters actual visual perception in the cortex.',
    correct_answer: 'YES',
    explanation: {
      why_correct: 'Section D confirms neuroimaging demonstrates changes in cortical sensory areas during group conformity.',
      passage_evidence: 'Recent fMRI studies reveal that conforming to peer pressure alters actual visual perception in the cortex rather than just conscious compliance.',
      paragraph_ref: 'Paragraph D',
      common_trap: 'Thinking conformity is only superficial verbal agreement.',
      strategy_tip: 'Affirmed explicitly in Paragraph D.'
    }
  },
  {
    id: 'c9-t2-q35',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 35,
    question_type: 'YES_NO_NOT_GIVEN',
    prompt: 'Iconoclasts are uniformly popular among their corporate colleagues.',
    correct_answer: 'NO',
    explanation: {
      why_correct: 'Section E explains that challenging established norms provokes hostility and social rejection.',
      passage_evidence: 'The dread of social ostracism... Iconoclasts must develop extraordinary emotional resilience to withstand social rejection.',
      paragraph_ref: 'Paragraph E',
      common_trap: 'Confusing respect for results with personal popularity.',
      strategy_tip: 'Direct contradiction with the hostility iconoclasts encounter.'
    }
  },
  {
    id: 'c9-t2-q36',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 36,
    question_type: 'YES_NO_NOT_GIVEN',
    prompt: 'Meditation can permanently rewire the amygdala within twenty-four hours.',
    correct_answer: 'NOT GIVEN',
    explanation: {
      why_correct: 'The text discusses cognitive reframing and amygdala management, but never mentions meditation or a 24-hour timeframe.',
      passage_evidence: 'No mention of 24-hour meditation in Reading Passage 3.',
      paragraph_ref: 'Paragraph C',
      common_trap: 'Extrapolating outside neuroscience facts into the test text.',
      strategy_tip: 'Unsubstantiated claims are NOT GIVEN.'
    }
  },
  {
    id: 'c9-t2-q37',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 37,
    question_type: 'YES_NO_NOT_GIVEN',
    prompt: 'Understanding neural mechanisms empowers individuals to overcome cognitive limitations.',
    correct_answer: 'YES',
    explanation: {
      why_correct: 'The concluding premise of the neuroscientific analysis is that knowing how the brain works enables people to train iconoclastic habits.',
      passage_evidence: 'Iconoclasts achieve this distinction through their ability to perceive reality differently, conquer the paralyzing fear... and harness social intelligence',
      paragraph_ref: 'Paragraph A',
      common_trap: 'Thinking human cognition is permanently fixed.',
      strategy_tip: 'The central premise of Berns\'s book is neural empowerment.'
    }
  },
  {
    id: 'c9-t2-q38',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 38,
    question_type: 'SUMMARY_COMPLETION',
    prompt: 'Novel sensory experiences force the visual cortex to construct new [38].',
    correct_answer: 'categories',
    explanation: {
      why_correct: 'Section B explains that unfamiliar inputs compel the brain to establish new perceptual categories.',
      passage_evidence: 'forcing the visual cortex to construct new categories from novel sensory experiences.',
      paragraph_ref: 'Paragraph B',
      common_trap: 'Writing "shortcuts" or "neural pathways" instead of the exact word "categories".',
      strategy_tip: 'Extract the direct object of "construct new": categories.'
    }
  },
  {
    id: 'c9-t2-q39',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 39,
    question_type: 'SUMMARY_COMPLETION',
    prompt: 'The fear of social ridicule activates the [39] cortex in identical ways to physical pain.',
    correct_answer: 'anterior cingulate',
    explanation: {
      why_correct: 'Section E notes that social exclusion lights up the anterior cingulate cortex.',
      passage_evidence: 'The dread of social ostracism activates the anterior cingulate cortex in ways identical to physical pain.',
      paragraph_ref: 'Paragraph E',
      common_trap: 'Writing "visual" cortex instead of "anterior cingulate".',
      strategy_tip: 'Two words specifying the brain area: anterior cingulate.'
    }
  },
  {
    id: 'c9-t2-q40',
    book_number: 9,
    test_number: 2,
    passage_number: 3,
    question_number: 40,
    question_type: 'SUMMARY_COMPLETION',
    prompt: 'Iconoclasts excel at leveraging emotional empathy and [40] to lead change.',
    correct_answer: 'reputation',
    explanation: {
      why_correct: 'Section F highlights reputation and persuasiveness as pivotal social instruments.',
      passage_evidence: 'iconoclasts must cultivate empathy, persuasiveness, and reputation to assemble alliances and lead change.',
      paragraph_ref: 'Paragraph F',
      common_trap: 'Writing "persuasiveness" if looking at another list item, but "reputation" directly fits grammatically.',
      strategy_tip: 'Select the exact single noun from Paragraph F.'
    }
  }
];
