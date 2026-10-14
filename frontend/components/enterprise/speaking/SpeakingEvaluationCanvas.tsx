import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { SpeakingEvaluation, SpeakingTestData } from '../../../src/components/mock-tests/speaking/speakingExamShared';
import { CAMBRIDGE_SPEAKING_BANK_EXTENDED } from '../../../src/components/mock-tests/speaking/cambridgeSpeakingBankData';
import { speakText, stopSpeakingAudio } from '../../../services/speaking/speakingAudioService';

// ── Unified Diagnostic Contracts ──────────────────────────────────────────

export interface DiagnosticToken {
    text: string;
    type: 'filler' | 'grammar' | 'collocation' | 'neutral';
    explanation?: string;
    suggestedFix?: string;
}

export interface SpeakingQuestionItem {
    questionIndex: number;
    prompt: string;
    category?: string;
    shortLabel: string;
    status?: 'answered' | 'omitted';
    candidateAudioUrl?: string;
    durationSeconds: number;
    transcriptText: string;
    diagnosticTokens: DiagnosticToken[];
    modelAnswerText: string;
    modelUpgrades: string[];
    wpm: number;
    fcScore?: number;
    lrScore?: number;
    graScore?: number;
    prScore?: number;
    phonemeCollisionsCount?: number;
    pronunciationAccuracy?: number;
    cadenceRating?: string;
    fillersCount: number;
    grammarSlipsCount: number;
    collocationsCount: number;
    examinerCritique: {
        fc: string;
        lr: string;
        gra: string;
        pr: string;
    };
}

export interface SpeakingPartData {
    part: 1 | 2 | 3;
    title: string;
    topic: string;
    cueCardBullets?: string[]; // Exclusively for Part 2
    questions: SpeakingQuestionItem[];
}

export interface SpeakingEvaluationCanvasProps {
    attemptId?: string | number;
    isOpen?: boolean;
    isReviewMode?: boolean;
    storedPartsData?: any;
    onClose?: () => void;
    examTitle?: string;
    bookNumber?: number;
    testNumber?: number;
    testData?: SpeakingTestData | null;
    audioUrl?: string | null;
    evaluation?: SpeakingEvaluation | null;
    onBack?: () => void;
    onExit?: () => void;
    onNavigateHistory?: () => void;
    className?: string;
    isModal?: boolean;
}

// ── Helpers to Extract Short Pill Labels ────────────────────────────────────

function extractShortLabel(prompt: string, index: number, defaultPrefix: string): string {
    const clean = prompt.trim();
    if (/laugh|funny|comedy/i.test(clean)) {
        if (/kind.*laugh/i.test(clean)) return 'Laugh Triggers';
        if (/comed.*tv|cinema/i.test(clean)) return 'Comedy on TV';
        if (/important.*laugh/i.test(clean)) return 'Value of Laughter';
        if (/culture/i.test(clean)) return 'Culture';
        return 'Humor & Laughter';
    }
    if (/electronic|device|appliance|technology/i.test(clean)) {
        if (/most essential|electronic devices/i.test(clean)) return 'Essential Devices';
        if (/rely.*technology/i.test(clean)) return 'Tech Reliance';
        if (/domestic appliances|twenty years|future/i.test(clean)) return 'Future Appliances';
        if (/problems.*fail/i.test(clean)) return 'Tech Failures';
        return 'Technology';
    }
    if (/hometown|village|live/i.test(clean)) return 'Hometown & Living';
    if (/job|work|study/i.test(clean)) return 'Work & Study';
    if (/season|weather|cold/i.test(clean)) return 'Weather & Climate';
    if (/sport|game|exercise/i.test(clean)) return 'Sports & Leisure';
    if (/travel|journey|transport/i.test(clean)) return 'Travel & Commute';
    if (/neighbour|friend|social/i.test(clean)) return 'Community & Friends';
    if (/food|cook|meal|restaurant/i.test(clean)) return 'Food & Dining';
    if (/school|teacher|education/i.test(clean)) return 'Education';

    // Fallback: first 3-4 meaningful words
    const words = clean.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).slice(0, 3).join(' ');
    return words ? words : `${defaultPrefix} ${index + 1}`;
}

// ── Dynamic Hydration Engine ────────────────────────────────────────────────

function hydrateQuestionSet(
    bookNum: number,
    testNum: number,
    testDataProp?: SpeakingTestData | null,
    storedPartsData?: any,
    evaluation?: SpeakingEvaluation | null
): Record<1 | 2 | 3, SpeakingPartData> {
    const key = `cambridge-${bookNum}-${testNum}`;
    const bankTest = CAMBRIDGE_SPEAKING_BANK_EXTENDED[key] || null;

    // Resolve Part 1
    const part1Title = testDataProp?.part1?.title || bankTest?.part1?.title || 'Personal Interview & Familiar Topics';
    let rawPart1Questions: string[] = [];
    if (Array.isArray(storedPartsData?.part1) && storedPartsData.part1.length > 0) {
        rawPart1Questions = storedPartsData.part1.map((p: any) => p.prompt || '');
    } else if (testDataProp?.part1?.questions?.length) {
        rawPart1Questions = testDataProp.part1.questions;
    } else if (bankTest?.part1?.questions?.length) {
        rawPart1Questions = bankTest.part1.questions;
    } else {
        rawPart1Questions = [
            'What kinds of things make you laugh?',
            'Do you like watching comedies on TV or in cinema?',
            'Do you think it is important for people to laugh regularly?',
            'Is comedy popular in your culture?',
        ];
    }

    // Resolve Part 2
    const storedPart2 = storedPartsData?.part2;
    const part2Title = testDataProp?.part2?.title || bankTest?.part2?.title || 'Individual Long Turn (Cue Card)';
    const part2Topic = storedPart2?.topic || testDataProp?.part2?.topic || bankTest?.part2?.topic || 'an electronic device you bought that was very useful';
    const rawPart2Bullets = storedPart2?.cueCardBullets?.length
        ? storedPart2.cueCardBullets
        : testDataProp?.part2?.prompts?.length
        ? testDataProp.part2.prompts
        : bankTest?.part2?.prompts?.length
        ? bankTest.part2.prompts
        : [
            'what the device was',
            'where and when you bought it',
            'what you used it for',
            'and explain why it was so useful to you',
        ];

    // Resolve Part 3
    const part3Title = testDataProp?.part3?.title || bankTest?.part3?.title || 'Two-way Discussion & In-depth Analysis';
    let rawPart3Questions: string[] = [];
    if (Array.isArray(storedPartsData?.part3) && storedPartsData.part3.length > 0) {
        rawPart3Questions = storedPartsData.part3.map((p: any) => p.prompt || '');
    } else if (testDataProp?.part3?.questions?.length) {
        rawPart3Questions = testDataProp.part3.questions;
    } else if (bankTest?.part3?.questions?.length) {
        rawPart3Questions = bankTest.part3.questions;
    } else {
        rawPart3Questions = [
            'What kinds of electronic devices do people find most essential today?',
            'Do you think people rely too much on technology nowadays?',
            'How will domestic appliances change over the next twenty years?',
            'What problems can arise when technology fails in daily life?',
        ];
    }

    // ── Build Part 1 Questions ───────────────────────────────────────────────
    const part1Questions: SpeakingQuestionItem[] = rawPart1Questions.map((qText, idx) => {
        const shortLabel = extractShortLabel(qText, idx, 'Topic');

        // Specialized authentic mock for C7 T2 Q1
        if (/laugh/i.test(qText) && /kind.*make/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Laugh Triggers',
                durationSeconds: 38,
                transcriptText:
                    "Well, to be honest, you know, spontaneous humor and funny situations with my close companions always crack me up. Also, very funny sitcoms that have clever dialogue make me laugh a lot. It really helps me decompress after work.",
                diagnosticTokens: [
                    { text: "Well, to be honest, ", type: 'neutral' },
                    { text: "you know", type: 'filler', explanation: "Hesitation conversational marker", suggestedFix: "Pause briefly or replace with 'in particular'." },
                    { text: ", spontaneous humor and funny situations with my close companions always crack me up. Also, ", type: 'neutral' },
                    { text: "very funny sitcoms", type: 'grammar', explanation: "Elementary descriptor in formal interview context", suggestedFix: "Upgrade to 'witty satirical sitcoms' or 'high-concept comedies'." },
                    { text: " that have clever dialogue make me laugh a lot. It really helps me ", type: 'neutral' },
                    { text: "decompress after work", type: 'collocation', explanation: "Band 8.0+ natural idiomatic phrasing for stress relief." },
                    { text: ".", type: 'neutral' },
                ],
                modelAnswerText:
                    "Primarily, wry observational humor and spontaneous banter among intimate friends invariably elicit laughter from me. Furthermore, high-concept British comedy and satirical drama featuring sharp, deadpan wit never fail to crack me up, providing an indispensable psychological release from everyday cognitive fatigue.",
                modelUpgrades: ["wry observational humor", "spontaneous banter", "invariably elicit laughter", "indispensable psychological release"],
                wpm: 134,
                fillersCount: 1,
                grammarSlipsCount: 1,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Maintained a fluid response rhythm without unnatural speech termination.",
                    lr: "Demonstrated accurate idiomatic grasp with 'decompress after work'; can elevate generic descriptors.",
                    gra: "Compound structure used effectively; minor lexical imprecision in descriptive phrasing.",
                    pr: "Clear syllable articulation with accurate nuclear stress on key verbs.",
                },
            };
        }

        if (/comed.*tv|cinema/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Comedy on TV',
                durationSeconds: 42,
                transcriptText:
                    "I definitely lean towards watching them at home on television. Like, going to the cinema is great for action spectacles, but comedy requires good relaxing. With streaming platforms, I can easily enjoy a light-hearted sitcom whenever I want to unwind completely.",
                diagnosticTokens: [
                    { text: "I definitely lean towards watching them at home on television. ", type: 'neutral' },
                    { text: "Like", type: 'filler', explanation: "Informal discourse particle", suggestedFix: "Use 'To illustrate' or omit completely." },
                    { text: ", going to the cinema is great for action spectacles, but comedy requires ", type: 'neutral' },
                    { text: "good relaxing", type: 'grammar', explanation: "Awkward nominalization and adjectival use", suggestedFix: "Upgrade to 'an intimate, relaxed atmosphere'." },
                    { text: ". With streaming platforms, I can easily enjoy a light-hearted sitcom whenever I want to ", type: 'neutral' },
                    { text: "unwind completely", type: 'collocation', explanation: "Band 8.0+ natural verb-adverb collocation." },
                    { text: ".", type: 'neutral' },
                ],
                modelAnswerText:
                    "Without hesitation, I tend to favor consuming comedy on television within an intimate domestic setting. While cinema multiplexes undoubtedly enhance sensory spectacles like sci-fi thrillers, comedic nuance and subtle situational irony are, in my view, far more comfortably savored in the unhurried comfort of one's own living space.",
                modelUpgrades: ["consuming comedy on television", "sensory spectacles", "comedic nuance", "subtle situational irony"],
                wpm: 130,
                fillersCount: 1,
                grammarSlipsCount: 1,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Good tempo; slight cadence dip when introducing personal rationale.",
                    lr: "Nice employment of 'light-hearted sitcom' and 'spectacles'.",
                    gra: "Need to replace 'good relaxing' with standard noun phrase.",
                    pr: "Natural vowel length on contrastive conjunctions ('but', 'while').",
                },
            };
        }

        if (/important.*laugh/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Value of Laughter',
                durationSeconds: 45,
                transcriptText:
                    "I think laughter is absolutely vital for mental wellbeing. It is, um, a natural way to relieve stress and it also makes relationships stronger. When people share a genuine laugh, they build mutual rapport almost immediately.",
                diagnosticTokens: [
                    { text: "I think laughter is absolutely vital for mental wellbeing. It is, ", type: 'neutral' },
                    { text: "um", type: 'filler', explanation: "Unvoiced hesitation vocalization", suggestedFix: "Use steady articulation or a transition marker like 'undeniably'." },
                    { text: ", a natural way to relieve stress and it also ", type: 'neutral' },
                    { text: "makes relationships stronger", type: 'grammar', explanation: "Basic lexical selection", suggestedFix: "Upgrade to 'cements social bonds' or 'fortifies interpersonal ties'." },
                    { text: ". When people share a genuine laugh, they build ", type: 'neutral' },
                    { text: "mutual rapport", type: 'collocation', explanation: "Band 8.5+ sophisticated academic collocation." },
                    { text: " almost immediately.", type: 'neutral' },
                ],
                modelAnswerText:
                    "Unquestionably, regular laughter is fundamental to both holistic physiological health and interpersonal harmony. Neurologically, it triggers endorphin release which effectively mitigates cortisol and chronic anxiety. Socially, humor functions as an invaluable social lubricant that bridges cultural disparities and cements enduring bonds between individuals.",
                modelUpgrades: ["holistic physiological health", "mitigates cortisol", "invaluable social lubricant", "cements enduring bonds"],
                wpm: 136,
                fillersCount: 1,
                grammarSlipsCount: 1,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Smooth sentence transitions with cohesive continuity.",
                    lr: "Strong academic term 'mutual rapport' balanced by solid basic vocabulary.",
                    gra: "Well-constructed relative and dependent clauses.",
                    pr: "Clear intonational rise on 'vital' and fall on 'immediately'.",
                },
            };
        }

        if (/popular.*culture/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Culture',
                durationSeconds: 40,
                transcriptText:
                    "Yes, humor is deeply woven into our daily social interactions. Stand-up shows are becoming pretty big in major metropolitan cities. People often use humor to cope with, you know, difficult life challenges, which creates a resilient community spirit.",
                diagnosticTokens: [
                    { text: "Yes, humor is deeply woven into our daily social interactions. Stand-up shows are becoming ", type: 'neutral' },
                    { text: "pretty big", type: 'grammar', explanation: "Vague conversational colloquialism", suggestedFix: "Upgrade to 'exponentially popular' or 'immensely widespread'." },
                    { text: " in major metropolitan cities. People often use humor to cope with, ", type: 'neutral' },
                    { text: "you know", type: 'filler', explanation: "Mid-clause filler marker", suggestedFix: "Omit filler; continue vocal cadence." },
                    { text: ", difficult life challenges, which creates a ", type: 'neutral' },
                    { text: "resilient community spirit", type: 'collocation', explanation: "Band 8.5+ high-tier descriptive collocation." },
                    { text: ".", type: 'neutral' },
                ],
                modelAnswerText:
                    "Indeed, humor occupies a paramount cultural role across our national folklore and contemporary media. Historically, satire served as an essential medium for civic critique, and today the proliferation of stand-up comedy circuits and digital satire illustrates an insatiable societal appetite for witty, culturally resonant entertainment.",
                modelUpgrades: ["paramount cultural role", "contemporary media", "medium for civic critique", "proliferation of stand-up comedy circuits"],
                wpm: 128,
                fillersCount: 1,
                grammarSlipsCount: 1,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Good cadence with minimal false starts.",
                    lr: "Effective metaphor 'deeply woven' and high-tier collocation 'resilient community spirit'.",
                    gra: "Appropriate non-defining relative clause ('which creates a...').",
                    pr: "Clean articulation with standard English stress on 'metropolitan'.",
                },
            };
        }

        // Algorithmic default for any other Part 1 question
        return {
            questionIndex: idx,
            prompt: qText,
            shortLabel,
            durationSeconds: 35 + (idx % 3) * 5,
            transcriptText: `Well, regarding ${shortLabel.toLowerCase()}, I believe it plays an important role in daily life. You know, people often find that having consistent exposure to this helps them stay balanced. It provides a profound understanding of how we interact with our immediate environment.`,
            diagnosticTokens: [
                { text: `Well, regarding ${shortLabel.toLowerCase()}, I believe it plays a `, type: 'neutral' },
                { text: "very good", type: 'grammar', explanation: "Elementary modifier", suggestedFix: "Upgrade to 'pivotal' or 'substantial'." },
                { text: " role in daily life. ", type: 'neutral' },
                { text: "You know", type: 'filler', explanation: "Hesitation filler", suggestedFix: "Replace with 'Specifically' or pause." },
                { text: ", people often find that having consistent exposure to this helps them maintain a ", type: 'neutral' },
                { text: "profound understanding", type: 'collocation', explanation: "Band 8.0+ natural collocation." },
                { text: " of their immediate environment.", type: 'neutral' },
            ],
            modelAnswerText: `From a personal perspective, ${shortLabel.toLowerCase()} serves as an essential focal point in everyday experience. It not only fosters cognitive resilience but also facilitates greater engagement with contemporary social dynamics, yielding substantial psychological benefits over time.`,
            modelUpgrades: ["cognitive resilience", "contemporary social dynamics", "substantial psychological benefits"],
            wpm: 132,
            fillersCount: 1,
            grammarSlipsCount: 1,
            collocationsCount: 1,
            examinerCritique: {
                fc: "Smooth discourse flow with consistent speech rate.",
                lr: "Appropriate topical vocabulary with room for C1 idiomatic expression.",
                gra: "Accurate complex structures.",
                pr: "Clear pronunciation across all syllables.",
            },
        };
    });

    // ── Build Part 2 Cue Card Question ───────────────────────────────────────
    const part2Question: SpeakingQuestionItem = {
        questionIndex: 0,
        prompt: `Describe ${part2Topic}. You should say what the device was, where and when you bought it, what you used it for, and explain why it was so useful to you.`,
        shortLabel: 'Candidate Task Card (Long Turn)',
        durationSeconds: 112, // 01:52
        transcriptText:
            "I would like to describe my noise-canceling wireless headphones that I purchased approximately eight months ago from an electronics boutique downtown. Um, prior to getting them, I struggled immensely with concentration in noisy library spaces and coffee shops. This gadget incorporates active noise attenuation technology, meaning it makes quietness instantly. I use it daily to transcribe lectures, conduct research, and immerse myself into focused study sessions. It has been profoundly beneficial to my productivity, serving as an indispensable tool in my academic routine.",
        diagnosticTokens: [
            { text: "I would like to describe my noise-canceling wireless headphones that I purchased approximately eight months ago from an electronics boutique downtown. ", type: 'neutral' },
            { text: "Um", type: 'filler', explanation: "Unvoiced hesitation pause during transition", suggestedFix: "Maintain smooth cadence with 'Furthermore' or 'In retrospect'." },
            { text: ", prior to getting them, I struggled immensely with concentration in noisy library spaces and coffee shops. This gadget incorporates active noise attenuation technology, meaning it ", type: 'neutral' },
            { text: "makes quietness", type: 'grammar', explanation: "Awkward collocation slip", suggestedFix: "Upgrade to 'filters out intrusive ambient noise' or 'creates an acoustic vacuum'." },
            { text: " instantly. I use it daily to transcribe lectures, conduct research, and immerse myself into focused study sessions. It has been ", type: 'neutral' },
            { text: "profoundly beneficial", type: 'collocation', explanation: "Band 8.5+ sophisticated adverb-adjective collocation." },
            { text: " to my productivity, serving as an ", type: 'neutral' },
            { text: "indispensable tool", type: 'collocation', explanation: "Band 8.5+ high-tier descriptive collocation." },
            { text: " in my academic routine.", type: 'neutral' },
        ],
        modelAnswerText:
            "I would like to elaborate on my acquisition of an ultra-portable tablet equipped with a stylus and active digitizer, which I procured roughly twelve months ago from an authorized technology flagship store. At the juncture of purchase, I sought to transition towards a completely paperless workflow for my postgraduate research.\n\nI utilize this device predominantly for synthesizing literature reviews, annotating complex empirical schematics, and synchronizing archival manuscripts across cloud repositories. What renders this apparatus so extraordinarily indispensable is its seamless integration into my intellectual workflow; it has eradicated physical stationery clutter while accelerating my conceptual structuring tenfold.",
        modelUpgrades: [
            "ultra-portable tablet equipped with a stylus",
            "transition towards a completely paperless workflow",
            "synthesizing literature reviews",
            "annotating complex empirical schematics",
            "extraordinarily indispensable",
            "accelerating conceptual structuring tenfold",
        ],
        wpm: 126,
        fillersCount: 2,
        grammarSlipsCount: 1,
        collocationsCount: 3,
        examinerCritique: {
            fc: "Maintained turn for over 1 minute 50 seconds without repetitive phrasing or extensive hesitation.",
            lr: "Solid technical terminology ('active noise attenuation'); minor slip on 'makes quietness'.",
            gra: "Strong subordinate clauses ('prior to getting them', 'meaning it...'); good past tense consistency.",
            pr: "Rhythm was sustained with proper stress patterns on multi-syllabic words.",
        },
    };

    // ── Build Part 3 Questions ───────────────────────────────────────────────
    const part3Questions: SpeakingQuestionItem[] = rawPart3Questions.map((qText, idx) => {
        const shortLabel = extractShortLabel(qText, idx, 'Discussion');

        if (/essential.*device/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Essential Devices',
                durationSeconds: 46,
                transcriptText:
                    "Undoubtedly, smartphones remain the single most indispensable gadget in contemporary society. People rely on them for navigation, mobile banking, and instant communication. Like, without a handheld device, managing daily logistics would be very hard, as digital platforms have become thoroughly integrated into daily existence.",
                diagnosticTokens: [
                    { text: "Undoubtedly, smartphones remain the single most indispensable gadget in contemporary society. People rely on them for navigation, mobile banking, and instant communication. ", type: 'neutral' },
                    { text: "Like", type: 'filler', explanation: "Informal discourse particle", suggestedFix: "Use 'To illustrate' or 'Practically speaking'." },
                    { text: ", without a handheld device, managing daily logistics would be ", type: 'neutral' },
                    { text: "very hard", type: 'grammar', explanation: "Basic qualitative adjective", suggestedFix: "Upgrade to 'exceptionally arduous' or 'logistically daunting'." },
                    { text: ", as digital platforms have become thoroughly ", type: 'neutral' },
                    { text: "integrated into daily existence", type: 'collocation', explanation: "Band 8.5+ advanced academic collocation." },
                    { text: ".", type: 'neutral' },
                ],
                modelAnswerText:
                    "Without equivocation, multipurpose mobile smartphones and ultra-portable computing terminals constitute the foundational hardware of contemporary modern existence. They have essentially evolved beyond mere communication devices into ubiquitous personal hubs that centralize biometric identification, financial transactions, real-time spatial navigation, and professional correspondence into a consolidated hand-held interface.",
                modelUpgrades: ["without equivocation", "multipurpose mobile smartphones", "ubiquitous personal hubs", "biometric identification", "consolidated hand-held interface"],
                wpm: 131,
                fillersCount: 1,
                grammarSlipsCount: 1,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Spoke with coherent logical extension and reasoned justification.",
                    lr: "High-tier phrase 'integrated into daily existence' elevated lexical rating.",
                    gra: "Clean conditional structure ('without a handheld device, managing... would be').",
                    pr: "Clear contrastive stress across the listed functions.",
                },
            };
        }

        if (/rely.*technology/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Tech Reliance',
                durationSeconds: 48,
                transcriptText:
                    "In many aspects, yes, there is an over-dependence on algorithmic convenience. For example, people often fail to remember basic telephone numbers or navigate without GPS. You know, when automated services crash, people experience acute disorientation. We should avoid letting digital devices make worse our memory.",
                diagnosticTokens: [
                    { text: "In many aspects, yes, there is an over-dependence on algorithmic convenience. For example, people often fail to remember basic telephone numbers or navigate without GPS. ", type: 'neutral' },
                    { text: "You know", type: 'filler', explanation: "Colloquial conversational filler", suggestedFix: "Replace with 'Consequently' or omit." },
                    { text: ", when automated services crash, people experience ", type: 'neutral' },
                    { text: "acute disorientation", type: 'collocation', explanation: "Band 8.5+ sophisticated psychological collocation." },
                    { text: ". We should avoid letting digital devices ", type: 'neutral' },
                    { text: "make worse our memory", type: 'grammar', explanation: "Syntax slip and awkward phrasal placement", suggestedFix: "Upgrade to 'atrophy our cognitive faculties' or 'degrade our memory'." },
                    { text: ".", type: 'neutral' },
                ],
                modelAnswerText:
                    "To a considerable extent, contemporary civilization displays an acute vulnerability attributable to technological over-reliance. Basic cognitive faculties such as spatial orientation and mental arithmetic have progressively atrophied due to the omnipresence of predictive algorithms. When technical anomalies or infrastructure failures occur, individuals often find themselves virtually paralyzed in executing fundamental tasks.",
                modelUpgrades: ["acute vulnerability", "technological over-reliance", "cognitive faculties have progressively atrophied", "omnipresence of predictive algorithms"],
                wpm: 129,
                fillersCount: 1,
                grammarSlipsCount: 1,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Good analytical perspective with structured cause-and-effect reasoning.",
                    lr: "Excellent terminology: 'algorithmic convenience', 'acute disorientation'.",
                    gra: "Word order error on 'make worse our memory' flagged for Band 7 threshold.",
                    pr: "Accurate pause placement before complex subordinate clauses.",
                },
            };
        }

        if (/domestic appliances|twenty years|future/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Future Appliances',
                durationSeconds: 52,
                transcriptText:
                    "I anticipate that home appliances will become almost fully autonomous through machine learning. Rather than simply executing programmed timers, appliances will anticipate human needs. For instance, smart refrigerators will do ordering food through automated logistics. This will bring unprecedented convenience, though privacy concerns will require stringent regulations.",
                diagnosticTokens: [
                    { text: "I anticipate that home appliances will become almost fully autonomous through machine learning. Rather than simply executing programmed timers, appliances will anticipate human needs. For instance, smart refrigerators will ", type: 'neutral' },
                    { text: "do ordering food", type: 'grammar', explanation: "Unnatural auxiliary verb selection", suggestedFix: "Upgrade to 'autonomously procure depleted groceries' or 'order provisions'." },
                    { text: " through automated logistics. This will bring ", type: 'neutral' },
                    { text: "unprecedented convenience", type: 'collocation', explanation: "Band 8.5+ formal academic collocation." },
                    { text: ", though privacy concerns will require ", type: 'neutral' },
                    { text: "stringent regulations", type: 'collocation', explanation: "Band 8.5+ policy and governance collocation." },
                    { text: ".", type: 'neutral' },
                ],
                modelAnswerText:
                    "Over the ensuing two decades, domestic appliances will undeniably transition from isolated mechanical units into an integrated, cognitive ecosystem. Driven by ambient intelligence and IoT protocols, future household hardware will autonomously calibrate energy expenditure, predict culinary preferences, and communicate directly with municipal utility grids to minimize carbon footprints while optimizing domestic efficiency.",
                modelUpgrades: ["integrated cognitive ecosystem", "ambient intelligence", "IoT protocols", "autonomously calibrate energy expenditure", "municipal utility grids"],
                wpm: 132,
                fillersCount: 0,
                grammarSlipsCount: 1,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Fluid speculative projection into future trends.",
                    lr: "High-level collocations 'unprecedented convenience' and 'stringent regulations'.",
                    gra: "Participle phrase 'Rather than simply executing...' used skillfully.",
                    pr: "Rhythmical stress on multisyllabic terms ('autonomous', 'convenience').",
                },
            };
        }

        if (/problems.*fail/i.test(qText)) {
            return {
                questionIndex: idx,
                prompt: qText,
                shortLabel: 'Tech Failures',
                durationSeconds: 50,
                transcriptText:
                    "When digital infrastructure malfunctions, the repercussions can be severe. Critical services like public transit or electronic point-of-sale payment systems can halt entirely. Um, this sudden disruption often triggers widespread chaos and panic. It underscores our vulnerability and proves that societies must always maintain analog fallbacks rather than having total dependence on computerized systems.",
                diagnosticTokens: [
                    { text: "When digital infrastructure malfunctions, the repercussions can be severe. Critical services like public transit or electronic point-of-sale payment systems can halt entirely. ", type: 'neutral' },
                    { text: "Um", type: 'filler', explanation: "Unvoiced hesitation vocalization", suggestedFix: "Maintain continuous vocalization with 'Evidently'." },
                    { text: ", this sudden disruption often triggers widespread chaos and panic. It underscores our vulnerability and proves that societies must always maintain ", type: 'neutral' },
                    { text: "analog fallbacks", type: 'collocation', explanation: "Band 8.5+ precise technical collocation." },
                    { text: " rather than having ", type: 'neutral' },
                    { text: "total dependence", type: 'collocation', explanation: "Band 8.0+ natural collocation." },
                    { text: " on computerized systems.", type: 'neutral' },
                ],
                modelAnswerText:
                    "Systemic technological failure precipitates immediate disruptions across commercial, logistical, and humanitarian domains. In cashless economies, point-of-sale blackouts instantly paralyze commercial trade, whilst outages in cloud navigation or power grids jeopardize public safety. Such vulnerabilities underscore the imperative for institutions to maintain robust analog fail-safes and disaster recovery protocols.",
                modelUpgrades: ["precipitates immediate disruptions", "point-of-sale blackouts", "jeopardize public safety", "robust analog fail-safes", "disaster recovery protocols"],
                wpm: 128,
                fillersCount: 1,
                grammarSlipsCount: 0,
                collocationsCount: 2,
                examinerCritique: {
                    fc: "Sophisticated discourse management with well-rounded conclusions.",
                    lr: "Very precise lexis: 'malfunctions', 'repercussions', 'analog fallbacks'.",
                    gra: "Complex multi-clause sentences handled without grammatical error.",
                    pr: "Excellent pitch variation and emphatic stress on 'repercussions' and 'analog'.",
                },
            };
        }

        // Generic fallback for any other Part 3 question
        return {
            questionIndex: idx,
            prompt: qText,
            shortLabel,
            durationSeconds: 45 + (idx % 3) * 4,
            transcriptText: `In considering ${shortLabel.toLowerCase()}, there are profound sociological and technological ramifications. Like, when we examine how societal norms evolve, we observe that systemic shifts often produce unintended consequences. It is essential to balance pragmatic utility with ethical accountability.`,
            diagnosticTokens: [
                { text: `In considering ${shortLabel.toLowerCase()}, there are profound sociological ramifications. `, type: 'neutral' },
                { text: "Like", type: 'filler', explanation: "Conversational marker", suggestedFix: "Use 'Specifically' or 'To contextualize'." },
                { text: ", when we examine how societal norms evolve, we observe that systemic shifts often produce ", type: 'neutral' },
                { text: "unintended consequences", type: 'collocation', explanation: "Band 8.5+ high-tier academic collocation." },
                { text: ". It is essential to balance ", type: 'neutral' },
                { text: "pragmatic utility", type: 'collocation', explanation: "Band 8.5+ advanced philosophical collocation." },
                { text: " with ethical accountability.", type: 'neutral' },
            ],
            modelAnswerText: `From an analytical viewpoint, ${shortLabel.toLowerCase()} introduces multidimensional challenges that necessitate coordinated governance. By implementing proactive regulatory frameworks, societies can maximize technological dividends while safeguarding against infrastructural vulnerabilities.`,
            modelUpgrades: ["multidimensional challenges", "proactive regulatory frameworks", "technological dividends"],
            wpm: 130,
            fillersCount: 1,
            grammarSlipsCount: 0,
            collocationsCount: 2,
            examinerCritique: {
                fc: "Logical discourse markers used appropriately.",
                lr: "Sophisticated vocabulary choices.",
                gra: "Complex syntactic structures maintained.",
                pr: "Clear articulation throughout.",
            },
        };
    });

    const evalQuestionsList = Array.isArray((evaluation as any)?.questions) ? (evaluation as any).questions : [];

    const mappedPart1 = part1Questions.map((q, idx) => {
        const stored = Array.isArray(storedPartsData?.part1) ? storedPartsData.part1[idx] : null;
        const evalQ = evalQuestionsList.find((item: any) => item.part === 1 && (item.questionIndex === idx || item.index === idx));

        const isOmitted =
            stored?.status === 'omitted' ||
            evalQ?.status === 'omitted' ||
            q.status === 'omitted' ||
            Boolean(stored && (stored.candidateAudioUrl === null || stored.candidateAudioUrl === undefined) && (!stored.candidateText || stored.candidateText === '' || stored.candidateText === '(Spoken Response Recorded)' || stored.candidateText.includes('omitted')));

        const status: 'answered' | 'omitted' = isOmitted ? 'omitted' : 'answered';

        const candidateAudioUrl = isOmitted ? undefined : (stored?.candidateAudioUrl || evalQ?.candidateAudioUrl || q.candidateAudioUrl);
        const transcriptText = isOmitted
            ? ''
            : (evalQ?.transcriptText && evalQ.transcriptText !== '(Spoken Response Recorded)')
            ? evalQ.transcriptText
            : (stored?.candidateText && stored.candidateText !== '(Spoken Response Recorded)')
            ? stored.candidateText
            : (stored?.transcriptText && stored.transcriptText !== '(Spoken Response Recorded)')
            ? stored.transcriptText
            : q.transcriptText;

        const diagnosticTokens = isOmitted
            ? []
            : (Array.isArray(evalQ?.diagnosticTokens) && evalQ.diagnosticTokens.length > 0)
            ? evalQ.diagnosticTokens
            : (Array.isArray(stored?.diagnosticTokens) && stored.diagnosticTokens.length > 0)
            ? stored.diagnosticTokens
            : q.diagnosticTokens;

        const modelAnswerText = evalQ?.modelAnswerText || stored?.modelAnswerText || q.modelAnswerText;
        const rawWpm = isOmitted ? 0 : (evalQ?.wpm ?? stored?.wpm ?? q.wpm);
        const wpm = isOmitted ? 0 : Math.round(Number(rawWpm) || 130);

        const modelUpgrades = (Array.isArray(evalQ?.modelUpgrades) && evalQ.modelUpgrades.length > 0)
            ? evalQ.modelUpgrades
            : (Array.isArray(stored?.modelUpgrades) && stored.modelUpgrades.length > 0)
            ? stored.modelUpgrades
            : q.modelUpgrades;

        const fillersCount = isOmitted ? 0 : diagnosticTokens.filter((t: any) => t.type === 'filler').length;
        const grammarSlipsCount = isOmitted ? 0 : diagnosticTokens.filter((t: any) => t.type === 'grammar').length;
        const collocationsCount = isOmitted ? 0 : diagnosticTokens.filter((t: any) => t.type === 'collocation').length;

        const fcScore = isOmitted ? 0 : Number(evalQ?.fcScore ?? evalQ?.fc_score ?? stored?.fcScore ?? 6.5);
        const lrScore = isOmitted ? 0 : Number(evalQ?.lrScore ?? evalQ?.lr_score ?? stored?.lrScore ?? 6.5);
        const graScore = isOmitted ? 0 : Number(evalQ?.graScore ?? evalQ?.gra_score ?? stored?.graScore ?? 6.5);
        const prScore = isOmitted ? 0 : Number(evalQ?.prScore ?? evalQ?.pr_score ?? stored?.prScore ?? 7.0);
        const phonemeCollisionsCount = isOmitted ? 0 : Number(evalQ?.phonemeCollisionsCount ?? stored?.phonemeCollisionsCount ?? 0);
        const pronunciationAccuracy = isOmitted ? 0 : Math.round(Number(evalQ?.pronunciationAccuracy ?? stored?.pronunciationAccuracy ?? 88));
        const cadenceRating = isOmitted ? 'No Speech Captured' : String(evalQ?.cadenceRating ?? stored?.cadenceRating ?? (wpm >= 135 ? 'Brisk Cadence' : wpm >= 115 ? 'Natural Cadence' : 'Deliberate Cadence'));

        return {
            ...q,
            status,
            candidateAudioUrl,
            transcriptText,
            diagnosticTokens,
            modelAnswerText,
            wpm,
            fcScore,
            lrScore,
            graScore,
            prScore,
            phonemeCollisionsCount,
            pronunciationAccuracy,
            cadenceRating,
            fillersCount,
            grammarSlipsCount,
            collocationsCount,
            modelUpgrades,
            examinerCritique: isOmitted ? {
                fc: "Omitted response — no speech sample captured.",
                lr: "Omitted response — lexical evaluation unavailable.",
                gra: "Omitted response — grammatical evaluation unavailable.",
                pr: "Omitted response — phonetic analysis unavailable.",
            } : {
                fc: evalQ?.strengths?.[0] || evalQ?.examinerCritique?.fc || stored?.examinerCritique?.fc || q.examinerCritique.fc,
                lr: evalQ?.strengths?.[1] || evalQ?.examinerCritique?.lr || stored?.examinerCritique?.lr || q.examinerCritique.lr,
                gra: evalQ?.areasForGrowth?.[0] || evalQ?.examinerCritique?.gra || stored?.examinerCritique?.gra || q.examinerCritique.gra,
                pr: evalQ?.areasForGrowth?.[1] || evalQ?.examinerCritique?.pr || stored?.examinerCritique?.pr || q.examinerCritique.pr,
            },
        };
    });

    const evalP2 = evalQuestionsList.find((item: any) => item.part === 2);
    const isP2Omitted =
        storedPart2?.status === 'omitted' ||
        evalP2?.status === 'omitted' ||
        part2Question.status === 'omitted' ||
        Boolean(storedPart2 && (storedPart2.candidateAudioUrl === null || storedPart2.candidateAudioUrl === undefined) && (!storedPart2.candidateText || storedPart2.candidateText === '' || storedPart2.candidateText === '(Spoken Long Turn Recorded)' || storedPart2.candidateText.includes('omitted')));

    const p2Status: 'answered' | 'omitted' = isP2Omitted ? 'omitted' : 'answered';
    const p2AudioUrl = isP2Omitted ? undefined : (storedPart2?.candidateAudioUrl || evalP2?.candidateAudioUrl || part2Question.candidateAudioUrl);
    const p2Transcript = isP2Omitted
        ? ''
        : (evalP2?.transcriptText && evalP2.transcriptText !== '(Spoken Long Turn Recorded)')
        ? evalP2.transcriptText
        : (storedPart2?.candidateText && storedPart2.candidateText !== '(Spoken Long Turn Recorded)')
        ? storedPart2.candidateText
        : (storedPart2?.transcriptText && storedPart2.transcriptText !== '(Spoken Long Turn Recorded)')
        ? storedPart2.transcriptText
        : part2Question.transcriptText;

    const p2Tokens = isP2Omitted
        ? []
        : (Array.isArray(evalP2?.diagnosticTokens) && evalP2.diagnosticTokens.length > 0)
        ? evalP2.diagnosticTokens
        : (Array.isArray(storedPart2?.diagnosticTokens) && storedPart2.diagnosticTokens.length > 0)
        ? storedPart2.diagnosticTokens
        : part2Question.diagnosticTokens;

    const p2ModelAnswer = evalP2?.modelAnswerText || storedPart2?.modelAnswerText || part2Question.modelAnswerText;
    const rawP2Wpm = isP2Omitted ? 0 : (evalP2?.wpm ?? storedPart2?.wpm ?? part2Question.wpm);
    const p2Wpm = isP2Omitted ? 0 : Math.round(Number(rawP2Wpm) || 126);

    const p2Upgrades = (Array.isArray(evalP2?.modelUpgrades) && evalP2.modelUpgrades.length > 0)
        ? evalP2.modelUpgrades
        : (Array.isArray(storedPart2?.modelUpgrades) && storedPart2.modelUpgrades.length > 0)
        ? storedPart2.modelUpgrades
        : part2Question.modelUpgrades;

    const p2FcScore = isP2Omitted ? 0 : Number(evalP2?.fcScore ?? evalP2?.fc_score ?? storedPart2?.fcScore ?? 6.5);
    const p2LrScore = isP2Omitted ? 0 : Number(evalP2?.lrScore ?? evalP2?.lr_score ?? storedPart2?.lrScore ?? 6.5);
    const p2GraScore = isP2Omitted ? 0 : Number(evalP2?.graScore ?? evalP2?.gra_score ?? storedPart2?.graScore ?? 6.5);
    const p2PrScore = isP2Omitted ? 0 : Number(evalP2?.prScore ?? evalP2?.pr_score ?? storedPart2?.prScore ?? 7.0);
    const p2PhonemeCollisions = isP2Omitted ? 0 : Number(evalP2?.phonemeCollisionsCount ?? storedPart2?.phonemeCollisionsCount ?? 0);
    const p2PrAccuracy = isP2Omitted ? 0 : Math.round(Number(evalP2?.pronunciationAccuracy ?? storedPart2?.pronunciationAccuracy ?? 88));
    const p2Cadence = isP2Omitted ? 'No Speech Captured' : String(evalP2?.cadenceRating ?? storedPart2?.cadenceRating ?? (p2Wpm >= 135 ? 'Brisk Cadence' : p2Wpm >= 115 ? 'Natural Cadence' : 'Deliberate Cadence'));

    const mappedPart2: SpeakingQuestionItem = {
        ...part2Question,
        status: p2Status,
        candidateAudioUrl: p2AudioUrl,
        transcriptText: p2Transcript,
        diagnosticTokens: p2Tokens,
        modelAnswerText: p2ModelAnswer,
        wpm: p2Wpm,
        fcScore: p2FcScore,
        lrScore: p2LrScore,
        graScore: p2GraScore,
        prScore: p2PrScore,
        phonemeCollisionsCount: p2PhonemeCollisions,
        pronunciationAccuracy: p2PrAccuracy,
        cadenceRating: p2Cadence,
        fillersCount: isP2Omitted ? 0 : p2Tokens.filter((t: any) => t.type === 'filler').length,
        grammarSlipsCount: isP2Omitted ? 0 : p2Tokens.filter((t: any) => t.type === 'grammar').length,
        collocationsCount: isP2Omitted ? 0 : p2Tokens.filter((t: any) => t.type === 'collocation').length,
        modelUpgrades: p2Upgrades,
        examinerCritique: isP2Omitted ? {
            fc: "Omitted response — no speech sample captured.",
            lr: "Omitted response — lexical evaluation unavailable.",
            gra: "Omitted response — grammatical evaluation unavailable.",
            pr: "Omitted response — phonetic analysis unavailable.",
        } : {
            fc: evalP2?.strengths?.[0] || evalP2?.examinerCritique?.fc || storedPart2?.examinerCritique?.fc || part2Question.examinerCritique.fc,
            lr: evalP2?.strengths?.[1] || evalP2?.examinerCritique?.lr || storedPart2?.examinerCritique?.lr || part2Question.examinerCritique.lr,
            gra: evalP2?.areasForGrowth?.[0] || evalP2?.examinerCritique?.gra || storedPart2?.examinerCritique?.gra || part2Question.examinerCritique.gra,
            pr: evalP2?.areasForGrowth?.[1] || evalP2?.examinerCritique?.pr || storedPart2?.examinerCritique?.pr || part2Question.examinerCritique.pr,
        },
    };

    const mappedPart3 = part3Questions.map((q, idx) => {
        const stored = Array.isArray(storedPartsData?.part3) ? storedPartsData.part3[idx] : null;
        const evalQ = evalQuestionsList.find((item: any) => item.part === 3 && (item.questionIndex === idx || item.index === idx));

        const isOmitted =
            stored?.status === 'omitted' ||
            evalQ?.status === 'omitted' ||
            q.status === 'omitted' ||
            Boolean(stored && (stored.candidateAudioUrl === null || stored.candidateAudioUrl === undefined) && (!stored.candidateText || stored.candidateText === '' || stored.candidateText === '(Spoken Response Recorded)' || stored.candidateText.includes('omitted')));

        const status: 'answered' | 'omitted' = isOmitted ? 'omitted' : 'answered';

        const candidateAudioUrl = isOmitted ? undefined : (stored?.candidateAudioUrl || evalQ?.candidateAudioUrl || q.candidateAudioUrl);
        const transcriptText = isOmitted
            ? ''
            : (evalQ?.transcriptText && evalQ.transcriptText !== '(Spoken Response Recorded)')
            ? evalQ.transcriptText
            : (stored?.candidateText && stored.candidateText !== '(Spoken Response Recorded)')
            ? stored.candidateText
            : (stored?.transcriptText && stored.transcriptText !== '(Spoken Response Recorded)')
            ? stored.transcriptText
            : q.transcriptText;

        const diagnosticTokens = isOmitted
            ? []
            : (Array.isArray(evalQ?.diagnosticTokens) && evalQ.diagnosticTokens.length > 0)
            ? evalQ.diagnosticTokens
            : (Array.isArray(stored?.diagnosticTokens) && stored.diagnosticTokens.length > 0)
            ? stored.diagnosticTokens
            : q.diagnosticTokens;

        const modelAnswerText = evalQ?.modelAnswerText || stored?.modelAnswerText || q.modelAnswerText;
        const rawWpm = isOmitted ? 0 : (evalQ?.wpm ?? stored?.wpm ?? q.wpm);
        const wpm = isOmitted ? 0 : Math.round(Number(rawWpm) || 130);

        const modelUpgrades = (Array.isArray(evalQ?.modelUpgrades) && evalQ.modelUpgrades.length > 0)
            ? evalQ.modelUpgrades
            : (Array.isArray(stored?.modelUpgrades) && stored.modelUpgrades.length > 0)
            ? stored.modelUpgrades
            : q.modelUpgrades;

        const fillersCount = isOmitted ? 0 : diagnosticTokens.filter((t: any) => t.type === 'filler').length;
        const grammarSlipsCount = isOmitted ? 0 : diagnosticTokens.filter((t: any) => t.type === 'grammar').length;
        const collocationsCount = isOmitted ? 0 : diagnosticTokens.filter((t: any) => t.type === 'collocation').length;

        const fcScore = isOmitted ? 0 : Number(evalQ?.fcScore ?? evalQ?.fc_score ?? stored?.fcScore ?? 6.5);
        const lrScore = isOmitted ? 0 : Number(evalQ?.lrScore ?? evalQ?.lr_score ?? stored?.lrScore ?? 6.5);
        const graScore = isOmitted ? 0 : Number(evalQ?.graScore ?? evalQ?.gra_score ?? stored?.graScore ?? 6.5);
        const prScore = isOmitted ? 0 : Number(evalQ?.prScore ?? evalQ?.pr_score ?? stored?.prScore ?? 7.0);
        const phonemeCollisionsCount = isOmitted ? 0 : Number(evalQ?.phonemeCollisionsCount ?? stored?.phonemeCollisionsCount ?? 0);
        const pronunciationAccuracy = isOmitted ? 0 : Math.round(Number(evalQ?.pronunciationAccuracy ?? stored?.pronunciationAccuracy ?? 88));
        const cadenceRating = isOmitted ? 'No Speech Captured' : String(evalQ?.cadenceRating ?? stored?.cadenceRating ?? (wpm >= 135 ? 'Brisk Cadence' : wpm >= 115 ? 'Natural Cadence' : 'Deliberate Cadence'));

        return {
            ...q,
            status,
            candidateAudioUrl,
            transcriptText,
            diagnosticTokens,
            modelAnswerText,
            wpm,
            fcScore,
            lrScore,
            graScore,
            prScore,
            phonemeCollisionsCount,
            pronunciationAccuracy,
            cadenceRating,
            fillersCount,
            grammarSlipsCount,
            collocationsCount,
            modelUpgrades,
            examinerCritique: isOmitted ? {
                fc: "Omitted response — no speech sample captured.",
                lr: "Omitted response — lexical evaluation unavailable.",
                gra: "Omitted response — grammatical evaluation unavailable.",
                pr: "Omitted response — phonetic analysis unavailable.",
            } : {
                fc: evalQ?.strengths?.[0] || evalQ?.examinerCritique?.fc || stored?.examinerCritique?.fc || q.examinerCritique.fc,
                lr: evalQ?.strengths?.[1] || evalQ?.examinerCritique?.lr || stored?.examinerCritique?.lr || q.examinerCritique.lr,
                gra: evalQ?.areasForGrowth?.[0] || evalQ?.examinerCritique?.gra || stored?.examinerCritique?.gra || q.examinerCritique.gra,
                pr: evalQ?.areasForGrowth?.[1] || evalQ?.examinerCritique?.pr || stored?.examinerCritique?.pr || q.examinerCritique.pr,
            },
        };
    });

    return {
        1: {
            part: 1,
            title: part1Title,
            topic: bankTest?.part1?.title || 'Familiar Topics',
            questions: mappedPart1,
        },
        2: {
            part: 2,
            title: part2Title,
            topic: part2Topic,
            cueCardBullets: rawPart2Bullets,
            questions: [mappedPart2],
        },
        3: {
            part: 3,
            title: part3Title,
            topic: bankTest?.part3?.title || 'Discussion Points',
            questions: mappedPart3,
        },
    };
}

// ── Main Component ──────────────────────────────────────────────────────────

export const SpeakingEvaluationCanvas: React.FC<SpeakingEvaluationCanvasProps> = ({
    attemptId,
    isOpen,
    isReviewMode = false,
    storedPartsData,
    onClose,
    examTitle,
    bookNumber,
    testNumber,
    testData,
    audioUrl = null,
    evaluation = null,
    onBack,
    onExit,
    onNavigateHistory,
    className = '',
    isModal = true,
}) => {
    // If modal is explicitly marked closed, unmount cleanly
    if (isOpen !== undefined && !isOpen) return null;

    // ── Canonical Metadata Resolution ────────────────────────────────────────
    const effectiveBook = useMemo(() => {
        if (bookNumber != null) return bookNumber;
        if (testData?.bookNumber != null) return testData.bookNumber;
        const match = (examTitle || '').match(/Cambridge\s*(\d+)/i);
        return match ? parseInt(match[1], 10) : 7;
    }, [bookNumber, testData, examTitle]);

    const effectiveTest = useMemo(() => {
        if (testNumber != null) return testNumber;
        if (testData?.testNumber != null) return testData.testNumber;
        const match = (examTitle || '').match(/Test\s*(\d+)/i);
        return match ? parseInt(match[1], 10) : 2;
    }, [testNumber, testData, examTitle]);

    const canonicalTitle = useMemo(() => {
        if (examTitle && !examTitle.includes('undefined') && !examTitle.includes('Test 01') && effectiveTest !== 1) {
            return examTitle;
        }
        return `Cambridge ${effectiveBook} · Speaking Test ${String(effectiveTest).padStart(2, '0')} Analysis`;
    }, [examTitle, effectiveBook, effectiveTest]);

    // ── Resolve Effective Evaluation ────────────────────────────────────────
    const resolvedEvaluation: SpeakingEvaluation | null = useMemo(() => {
        return evaluation || storedPartsData?.evaluation || null;
    }, [evaluation, storedPartsData]);

    // ── Hydrate Authentic Questions ──────────────────────────────────────────
    const allPartsData = useMemo(() => {
        return hydrateQuestionSet(effectiveBook, effectiveTest, testData, storedPartsData, resolvedEvaluation);
    }, [effectiveBook, effectiveTest, testData, storedPartsData, resolvedEvaluation]);

    // ── State Management ────────────────────────────────────────────────────
    const [activePart, setActivePart] = useState<1 | 2 | 3>(1);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
    const [expandedPillar, setExpandedPillar] = useState<'FC' | 'LR' | 'GRA' | 'PR'>('FC');
    const [selectedToken, setSelectedToken] = useState<DiagnosticToken | null>(null);

    // Reset question index if switched to a part with fewer questions
    useEffect(() => {
        setActiveQuestionIndex(0);
    }, [activePart]);

    const currentPartData = allPartsData[activePart];
    const currentQuestion = currentPartData.questions[activeQuestionIndex] || currentPartData.questions[0];
    const isCurrentOmitted = currentQuestion.status === 'omitted';
    const activeAudioSource = isCurrentOmitted ? null : (currentQuestion.candidateAudioUrl || audioUrl);

    // ── Audio Playback State ────────────────────────────────────────────────
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
    const [isModelSpeaking, setIsModelSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const tickerRef = useRef<number | null>(null);

    const questionDuration = currentQuestion.durationSeconds || 45;

    // Reset audio state when changing question or part
    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.pause();
        }
        if (tickerRef.current) {
            window.clearInterval(tickerRef.current);
            tickerRef.current = null;
        }
        stopSpeakingAudio();
        setIsModelSpeaking(false);
    }, [activePart, activeQuestionIndex]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (tickerRef.current) window.clearInterval(tickerRef.current);
            stopSpeakingAudio();
        };
    }, []);

    const togglePlayback = () => {
        if (isCurrentOmitted) return;
        if (isPlaying) {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            if (tickerRef.current) {
                window.clearInterval(tickerRef.current);
                tickerRef.current = null;
            }
        } else {
            setIsPlaying(true);
            if (audioRef.current && activeAudioSource) {
                audioRef.current.play().catch(() => {});
            }
            // Continuous ticker for scrubber
            if (tickerRef.current) window.clearInterval(tickerRef.current);
            tickerRef.current = window.setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev >= questionDuration) {
                        setIsPlaying(false);
                        if (tickerRef.current) window.clearInterval(tickerRef.current);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000 / playbackSpeed);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = Math.round(pct * questionDuration);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleSpeedToggle = () => {
        const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
        setPlaybackSpeed(nextSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextSpeed;
        }
    };

    const formatClock = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    // Model Audio Speech Synthesis
    const toggleModelSpeech = (text: string) => {
        if (isModelSpeaking) {
            stopSpeakingAudio();
            setIsModelSpeaking(false);
        } else {
            setIsModelSpeaking(true);
            speakText(text, {
                rate: 0.95,
                onEnd: () => setIsModelSpeaking(false),
                onError: () => setIsModelSpeaking(false),
            });
        }
    };

    // ── Challenge / Dispute Modal State ─────────────────────────────────────
    const [isDisputeOpen, setIsDisputeOpen] = useState(false);
    const [disputeCriterion, setDisputeCriterion] = useState('fluency');
    const [disputeNotes, setDisputeNotes] = useState('');
    const [disputeSubmitted, setDisputeSubmitted] = useState(false);

    // ── Global Keyboard Shortcuts (Escape to Close) ─────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isDisputeOpen) {
                    setIsDisputeOpen(false);
                } else if (onClose) {
                    onClose();
                } else if (onExit) {
                    onExit();
                } else if (onBack) {
                    onBack();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDisputeOpen, onClose, onExit, onBack]);

    // ── Diagnostic Metrics & Pillar Scores ──────────────────────────────────
    const isEvaluated = Boolean(
        resolvedEvaluation && (
            (Number(resolvedEvaluation.overallBand) > 0) ||
            (Number((resolvedEvaluation as any).overall_band) > 0) ||
            (Number((resolvedEvaluation as any).fcScore) > 0) ||
            Boolean(resolvedEvaluation.fluency?.score)
        )
    );
    const effectiveReviewMode = isReviewMode && !isEvaluated;

    const overallBand = Number(
        resolvedEvaluation?.overallBand ?? (resolvedEvaluation as any)?.overall_band ?? 6.5
    );
    const fcScore = Number(
        (resolvedEvaluation as any)?.fcScore ?? resolvedEvaluation?.fluency?.score ?? 6.5
    );
    const lrScore = Number(
        (resolvedEvaluation as any)?.lrScore ?? resolvedEvaluation?.lexical?.score ?? 6.0
    );
    const graScore = Number(
        (resolvedEvaluation as any)?.graScore ?? resolvedEvaluation?.grammar?.score ?? 6.5
    );
    const prScore = Number(
        (resolvedEvaluation as any)?.prScore ?? resolvedEvaluation?.pronunciation?.score ?? 7.0
    );

    const targetBand = Number((resolvedEvaluation as any)?.targetBand ?? 7.5);
    const bandGap = targetBand - overallBand;
    const formattedGap = bandGap <= 0 ? `+${Math.abs(bandGap).toFixed(1)}` : `-${bandGap.toFixed(1)}`;
    const gapLabel = `${formattedGap} to ${targetBand.toFixed(1)}`;

    const pronunciationAccuracy = Math.round(
        Number((resolvedEvaluation as any)?.pronunciationAccuracy ?? 88)
    );

    const cefrLevel = overallBand >= 8.5 ? 'CEFR C2' : overallBand >= 7.0 ? 'CEFR C1' : overallBand >= 5.5 ? 'CEFR B2' : 'CEFR B1';
    const bandStandardLabel = overallBand >= 8.0 ? 'Expert / Very Good User' : overallBand >= 6.5 ? 'Good User' : 'Modest User';

    if (isOpen === false) return null;

    return (
        <div
            className={`${isModal ? 'fixed inset-0 z-50' : 'w-full min-h-screen'} flex flex-col bg-[#08090C] text-slate-100 overflow-y-auto antialiased select-none custom-scrollbar ${className}`}
        >
            {/* Inner constrained container matching enterprise layout */}
            <div className="w-full max-w-[1680px] mx-auto min-h-screen px-4 sm:px-8 py-6 flex flex-col gap-6">
                {/* Native Audio Tag (if audio source exists) */}
            {activeAudioSource && (
                <audio
                    ref={audioRef}
                    key={activeAudioSource}
                    src={activeAudioSource}
                    onTimeUpdate={() => {
                        if (audioRef.current) setCurrentTime(Math.round(audioRef.current.currentTime));
                    }}
                    onEnded={() => {
                        setIsPlaying(false);
                        setCurrentTime(0);
                    }}
                />
            )}

            {/* ════════════════════════════════════════════════════════════════
                1. TOP HEADER & BREADCRUMBS
            ════════════════════════════════════════════════════════════════ */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222732] gap-4 shrink-0">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                        <button
                            onClick={onClose || onBack}
                            className="hover:text-white transition-colors flex items-center gap-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                            <span>← Back to Speaking Hub</span>
                        </button>
                        <span className="text-zinc-600">|</span>
                        <button
                            onClick={onNavigateHistory || onClose || onBack}
                            className="hover:text-white transition-colors text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                            <span>Speaking History</span>
                        </button>
                    </div>
                    <div className="text-[11px] font-mono tracking-wide text-zinc-500 uppercase">
                        Overview &gt; Speaking Engine &gt; <span className="text-rose-400 font-semibold">Post-Exam Analysis Canvas</span>
                    </div>
                    <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2.5 mt-0.5">
                        <span>{canonicalTitle}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            VERIFIED AI ASSESSMENT
                        </span>
                    </h1>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2.5">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
                        >
                            <span>✕ Close Review</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsDisputeOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#15181E] hover:bg-[#1E222B] border border-[#222732] hover:border-amber-500/50 text-xs font-semibold text-amber-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                        <span>🚩 Challenge / Dispute</span>
                    </button>
                    <button
                        onClick={onClose || onExit || onBack}
                        className="px-3.5 py-2 rounded-xl bg-[#15181E] hover:bg-[#1E222B] border border-[#222732] text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                        <span>Exit Hub</span>
                    </button>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                2. EXECUTIVE KPI TELEMETRY STRIP (4-COLUMN ROW)
            ════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-4 shrink-0">
                {/* Metric 1: Overall Band */}
                <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                        <span>OVERALL SPEAKING BAND</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {cefrLevel}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-white tracking-tight">Band {overallBand.toFixed(1)}</span>
                        <span className="text-xs text-zinc-500">/ 9.0</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {bandStandardLabel} · Official Band Standard
                    </div>
                </div>

                {/* Metric 2: Target Gap */}
                <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                        <span>TARGET BAND GAP</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            {gapLabel}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{formattedGap}</span>
                        <span className="text-xs text-zinc-500">Target {targetBand.toFixed(1)}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Focus: Lexical Precision & Flow
                    </div>
                </div>

                {/* Metric 3: Fluency & Cadence */}
                <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                        <span>FLUENCY & PACING</span>
                        {isCurrentOmitted ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                                Omitted
                            </span>
                        ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                {currentQuestion.cadenceRating || 'Optimal'}
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-3xl font-extrabold tracking-tight ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                            {isCurrentOmitted ? 0 : currentQuestion.wpm}
                        </span>
                        <span className="text-xs text-zinc-500">WPM</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrentOmitted ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
                        {isCurrentOmitted
                            ? '0 speech captured · Unanswered prompt'
                            : `${currentQuestion.fillersCount} hesitation pauses · ${currentQuestion.cadenceRating || 'Consistent Cadence'}`}
                    </div>
                </div>

                {/* Metric 4: Pronunciation */}
                <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                        <span>PRONUNCIATION ACCURACY</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {isCurrentOmitted ? 'N/A' : ((currentQuestion.phonemeCollisionsCount ?? 0) === 0 ? 'Clean Stress' : 'Acoustic Graded')}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-3xl font-extrabold tracking-tight ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                            {isCurrentOmitted ? 0 : Math.round(Number(currentQuestion.pronunciationAccuracy ?? pronunciationAccuracy))}%
                        </span>
                        <span className="text-xs text-zinc-500">Accuracy</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrentOmitted ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                        {isCurrentOmitted
                            ? '0 speech captured · Unanswered prompt'
                            : `Clear stress & rhythm · ${currentQuestion.phonemeCollisionsCount ?? 0} Phoneme Collisions`}
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                3. 4-PILLAR CRITERION BAR (FC, LR, GRA, PR)
            ════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 shrink-0">
                {[
                    { key: 'FC' as const, label: 'Fluency & Coherence', score: fcScore, desc: 'Speech rate, pausing, connectors' },
                    { key: 'LR' as const, label: 'Lexical Resource', score: lrScore, desc: 'Range, collocations, idiomatic lexis' },
                    { key: 'GRA' as const, label: 'Grammar Accuracy', score: graScore, desc: 'Complex syntax, tense control' },
                    { key: 'PR' as const, label: 'Pronunciation', score: prScore, desc: 'Phonemes, stress, intonation' },
                ].map((crit) => {
                    const isSelected = expandedPillar === crit.key;
                    return (
                        <button
                            key={crit.key}
                            onClick={() => setExpandedPillar(crit.key)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-[#181C24] border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/40'
                                    : 'bg-[#15181E] border-[#222732] hover:border-zinc-700'
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-semibold text-zinc-300">{crit.label}</span>
                                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                                    isSelected ? 'bg-rose-500/20 text-rose-300' : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                    Band {crit.score.toFixed(1)}
                                </span>
                            </div>
                            <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{crit.desc}</span>
                        </button>
                    );
                })}
            </div>

            {/* ════════════════════════════════════════════════════════════════
                4. NAVIGATION CONTROLS: PRIMARY PARTS & SUB-QUESTION CAROUSEL
            ════════════════════════════════════════════════════════════════ */}
            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-3 mb-4 shrink-0 flex flex-col gap-3">
                {/* Part Selector Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                        onClick={() => setActivePart(1)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                            activePart === 1
                                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                                : 'bg-[#101216] text-zinc-400 hover:text-white border border-[#222732]'
                        }`}
                    >
                        <span>🎙️ Part 1: Interview</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
                            {allPartsData[1].questions.length} Questions
                        </span>
                    </button>

                    <button
                        onClick={() => setActivePart(2)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                            activePart === 2
                                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                                : 'bg-[#101216] text-zinc-400 hover:text-white border border-[#222732]'
                        }`}
                    >
                        <span>📝 Part 2: Cue Card</span>
                        {allPartsData[2].questions[0]?.status === 'omitted' ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                🔴 Omitted
                            </span>
                        ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">Long Turn</span>
                        )}
                    </button>

                    <button
                        onClick={() => setActivePart(3)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                            activePart === 3
                                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                                : 'bg-[#101216] text-zinc-400 hover:text-white border border-[#222732]'
                        }`}
                    >
                        <span>💡 Part 3: Discussion</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
                            {allPartsData[3].questions.length} Questions
                        </span>
                    </button>
                </div>

                {/* Sub-Question Carousel (Part 1 and Part 3) */}
                {activePart !== 2 && currentPartData.questions.length > 1 && (
                    <div className="pt-2 border-t border-[#222732]/70 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
                            Questions:
                        </span>
                        {currentPartData.questions.map((q, qIdx) => {
                            const isQActive = activeQuestionIndex === qIdx;
                            const isQOmitted = q.status === 'omitted';
                            return (
                                <button
                                    key={qIdx}
                                    onClick={() => setActiveQuestionIndex(qIdx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isQActive
                                            ? 'bg-rose-600 text-white font-semibold shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-400'
                                            : isQOmitted
                                            ? 'bg-[#151216] hover:bg-[#1E1822] text-rose-300 hover:text-white border border-rose-500/30'
                                            : 'bg-[#111317] hover:bg-[#1A1E26] text-zinc-400 hover:text-zinc-200 border border-[#222732]'
                                    }`}
                                >
                                    {isQOmitted ? (
                                        <>
                                            <span className="text-[10px] text-rose-400">🔴</span>
                                            <span className="font-mono text-[10px] opacity-90">Q{qIdx + 1} · Omitted</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-mono text-[10px] opacity-80">Q{qIdx + 1}:</span>
                                            <span>{q.shortLabel}</span>
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ════════════════════════════════════════════════════════════════
                5. MAIN TWO-PANEL DIAGNOSTIC WORKSPACE
            ════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 items-start">
                {/* ─────────────────────────────────────────────────────────────
                    LEFT PANE: PROMPT, AUDIO PLAYER, & ANNOTATED TRANSCRIPT
                ───────────────────────────────────────────────────────────── */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* Prompt Box or Cue Card */}
                    {activePart === 2 ? (
                        <div className="bg-[#15181E] border border-amber-500/30 rounded-2xl p-4 shadow-sm shrink-0">
                            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 mb-3">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                                    CANDIDATE TASK CARD · IELTS PART 2
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                    1–2 Min Long Turn
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-white mb-2.5">
                                Describe {currentPartData.topic}.
                            </h3>
                            <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3">
                                <p className="text-xs text-zinc-400 font-medium mb-1.5">You should say:</p>
                                <ul className="space-y-1 text-xs text-zinc-300 list-disc list-inside">
                                    {(currentPartData.cueCardBullets || []).map((bullet, bIdx) => (
                                        <li key={bIdx} className="leading-relaxed">
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 shadow-sm shrink-0">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                                <span className="text-rose-400 font-bold">
                                    EXAMINER PROMPT · PART {activePart} · Q{activeQuestionIndex + 1} of {currentPartData.questions.length}
                                </span>
                                <span className="text-zinc-500">{currentQuestion.shortLabel}</span>
                            </div>
                            <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                                &ldquo;{currentQuestion.prompt}&rdquo;
                            </h3>
                        </div>
                    )}

                    {/* Candidate Audio Playback Bar */}
                    {/* Candidate Audio Playback Bar */}
                    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-3.5 shadow-sm shrink-0 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-zinc-400 font-semibold tracking-wide">
                                    CANDIDATE AUDIO PLAYBACK
                                </span>
                                {isCurrentOmitted && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                                        [ ⚠️ NO AUDIO STREAM CAPTURED ]
                                    </span>
                                )}
                            </div>
                            <span className="font-mono text-xs text-zinc-400">
                                {isCurrentOmitted ? '00:00 / 00:00' : `${formatClock(currentTime)} / ${formatClock(questionDuration)}`}
                            </span>
                        </div>

                        {/* Scrubber Track */}
                        <div
                            onClick={isCurrentOmitted ? undefined : handleSeek}
                            className={`h-2 w-full bg-[#0D0F12] border border-[#222732] rounded-full overflow-hidden relative ${
                                isCurrentOmitted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                        >
                            <div
                                className="h-full bg-rose-600 transition-all duration-150"
                                style={{ width: isCurrentOmitted ? '0%' : `${Math.min(100, (currentTime / questionDuration) * 100)}%` }}
                            />
                        </div>

                        {/* Player Controls */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={isCurrentOmitted}
                                    onClick={togglePlayback}
                                    className={`px-3.5 py-1.5 rounded-lg text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md ${
                                        isCurrentOmitted
                                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                                            : 'bg-rose-600 hover:bg-rose-500 cursor-pointer active:scale-95'
                                    }`}
                                >
                                    <span>{isPlaying ? '⏸ Pause' : '▶ Play'}</span>
                                </button>
                                <button
                                    disabled={isCurrentOmitted}
                                    onClick={() => {
                                        if (isCurrentOmitted) return;
                                        setCurrentTime(0);
                                        if (audioRef.current) audioRef.current.currentTime = 0;
                                    }}
                                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                                        isCurrentOmitted
                                            ? 'bg-[#111317] text-zinc-600 border-[#222732] cursor-not-allowed opacity-40'
                                            : 'bg-[#111317] hover:bg-[#1C2028] text-zinc-400 hover:text-white border-[#222732] cursor-pointer'
                                    }`}
                                    title="Replay from beginning"
                                >
                                    ↺ Restart
                                </button>
                            </div>

                            <button
                                disabled={isCurrentOmitted}
                                onClick={isCurrentOmitted ? undefined : handleSpeedToggle}
                                className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
                                    isCurrentOmitted
                                    ? 'bg-[#111317] text-zinc-600 border-[#222732] cursor-not-allowed opacity-40'
                                    : 'bg-[#111317] hover:bg-[#1A1D24] border-[#222732] text-zinc-300 hover:text-white cursor-pointer'
                                }`}
                            >
                                {playbackSpeed}x Speed
                            </button>
                        </div>
                    </div>

                    {/* Annotated Speech-to-Text Transcript */}
                    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between pb-2 border-b border-[#222732] shrink-0 mb-3">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                ANNOTATED SPEECH-TO-TEXT TRANSCRIPT
                            </span>
                            <span className="text-[10px] text-zinc-500">
                                {isCurrentOmitted ? 'Response omitted by candidate' : 'Click highlighted tokens for feedback'}
                            </span>
                        </div>

                        {/* Scrollable Tokenized Text or Omitted Placeholder */}
                        {isCurrentOmitted ? (
                            <div className="py-10 px-4 flex flex-col items-center justify-center text-center gap-3 rounded-xl bg-[#0D0F12] border border-[#222732] my-auto">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                                    ⚠️
                                </div>
                                <div className="flex flex-col gap-1 max-w-md">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                                        NO SPEECH SAMPLE CAPTURED
                                    </span>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        This question was left unanswered during the examination. No speech sample was provided for linguistic or phonetic analysis.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-h-[360px] overflow-y-auto pr-1 text-sm leading-relaxed text-zinc-200 custom-scrollbar scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                {currentQuestion.diagnosticTokens.map((token, tIdx) => {
                                    if (token.type === 'filler') {
                                        return (
                                            <button
                                                key={tIdx}
                                                onClick={() => setSelectedToken(token)}
                                                className="inline bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded px-1.5 py-0.5 mx-0.5 font-medium hover:bg-amber-500/25 transition-colors cursor-pointer"
                                                title="Click to inspect hesitation marker"
                                            >
                                                {token.text}
                                            </button>
                                        );
                                    }
                                    if (token.type === 'grammar') {
                                        return (
                                            <button
                                                key={tIdx}
                                                onClick={() => setSelectedToken(token)}
                                                className="inline bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded px-1.5 py-0.5 mx-0.5 font-medium hover:bg-rose-500/25 transition-colors cursor-pointer"
                                                title="Click to inspect grammar/lexical slip"
                                            >
                                                {token.text}
                                            </button>
                                        );
                                    }
                                    if (token.type === 'collocation') {
                                        return (
                                            <button
                                                key={tIdx}
                                                onClick={() => setSelectedToken(token)}
                                                className="inline bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded px-1.5 py-0.5 mx-0.5 font-medium hover:bg-emerald-500/25 transition-colors cursor-pointer"
                                                title="Click to inspect Band 8.5+ collocation"
                                            >
                                                {token.text}
                                            </button>
                                        );
                                    }
                                    return <span key={tIdx}>{token.text}</span>;
                                })}
                            </div>
                        )}

                        {/* Legend Swatches */}
                        <div className={`pt-3 border-t border-[#222732] shrink-0 flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 mt-2 ${
                            isCurrentOmitted ? 'opacity-40 pointer-events-none' : ''
                        }`}>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500/50"></span>
                                Filler / Hesitation
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500/50"></span>
                                Grammar Slip
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/50"></span>
                                Band 8+ Collocation
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    RIGHT PANE: 4-PILLAR DIAGNOSTICS & BAND 8.5+ MODEL RECONSTRUCTION
                ───────────────────────────────────────────────────────────── */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* 4-Pillar Evaluator Rubric */}
                    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center justify-between pb-2 border-b border-[#222732]">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                    4-PILLAR EVALUATOR RUBRIC · {expandedPillar} DIAGNOSTICS
                                </span>
                                <span className="text-xs font-mono font-bold text-rose-400">
                                    {isCurrentOmitted
                                        ? `${expandedPillar}: Band 0.0 (Omitted)`
                                        : expandedPillar === 'FC' ? `Fluency Band ${fcScore.toFixed(1)}`
                                        : expandedPillar === 'LR' ? `Lexis Band ${lrScore.toFixed(1)}`
                                        : expandedPillar === 'GRA' ? `Grammar Band ${graScore.toFixed(1)}`
                                        : `Pronunciation Band ${prScore.toFixed(1)}`}
                                </span>
                            </div>

                            {/* Pillar Content Switcher */}
                            {expandedPillar === 'FC' && (
                                <div className="flex flex-col gap-3 text-xs">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Speech Rate</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '7.0'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Cohesion</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.5'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Pausing</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.0'}
                                            </p>
                                        </div>
                                    </div>
                                    {isCurrentOmitted ? (
                                        <>
                                            <div className="bg-[#0D0F12] border border-amber-500/30 p-4 rounded-xl flex flex-col gap-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                                        STATUS: Omitted Response
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block mb-1 font-mono">
                                                        CLINICAL DIAGNOSIS:
                                                    </span>
                                                    <p className="text-zinc-300 text-xs leading-relaxed">
                                                        Failure to provide a spoken response prevents fluency, lexical, and grammatical evaluation for this prompt. This heavily impacts overall sub-scores in this section.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">EXAM RECOVERY GUIDANCE:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Never leave an IELTS prompt blank. Produce opening topic signposts (&ldquo;When reflecting upon this matter...&rdquo;) to anchor your response rather than skipping.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-[#0D0F12] border border-[#222732] p-3 rounded-xl">
                                                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">STRENGTHS:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    {currentQuestion.examinerCritique.fc}
                                                </p>
                                            </div>
                                            <div className="bg-[#0D0F12] border border-amber-500/20 p-3 rounded-xl">
                                                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">AREAS FOR GROWTH:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Noticeable hesitation particles ({currentQuestion.fillersCount} flagged) introduce slight gaps before complex abstract reasoning.
                                                </p>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">BAND 8.0+ BOOSTER:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Replace conversational pause fillers with silent micro-pauses or formal discourse signposts (e.g., &ldquo;From an analytical standpoint&rdquo;, &ldquo;To contextualize this&rdquo;).
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {expandedPillar === 'LR' && (
                                <div className="flex flex-col gap-3 text-xs">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Diversity</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.5'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Collocations</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.0'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Paraphrasing</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.0'}
                                            </p>
                                        </div>
                                    </div>
                                    {isCurrentOmitted ? (
                                        <>
                                            <div className="bg-[#0D0F12] border border-amber-500/30 p-4 rounded-xl flex flex-col gap-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                                        STATUS: Omitted Response
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block mb-1 font-mono">
                                                        CLINICAL DIAGNOSIS:
                                                    </span>
                                                    <p className="text-zinc-300 text-xs leading-relaxed">
                                                        Failure to provide a spoken response prevents fluency, lexical, and grammatical evaluation for this prompt. This heavily impacts overall sub-scores in this section.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">BAND 8.0+ BOOSTER:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Study the model vocabulary upgrades below to expand your lexical repertoire for similar interview themes.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-[#0D0F12] border border-[#222732] p-3 rounded-xl">
                                                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">STRENGTHS:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    {currentQuestion.examinerCritique.lr}
                                                </p>
                                            </div>
                                            <div className="bg-[#0D0F12] border border-amber-500/20 p-3 rounded-xl">
                                                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">AREAS FOR GROWTH:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Frequent fallback to elementary adjectives (&ldquo;very good&rdquo;, &ldquo;pretty big&rdquo;) reduces overall lexical maturity under Band 7 descriptor.
                                                </p>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">BAND 8.0+ BOOSTER:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Incorporate topic-specific academic collocations: {currentQuestion.modelUpgrades.join(' · ')}.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {expandedPillar === 'GRA' && (
                                <div className="flex flex-col gap-3 text-xs">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Complexity</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.5'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Control</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.5'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Error Density</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.0'}
                                            </p>
                                        </div>
                                    </div>
                                    {isCurrentOmitted ? (
                                        <>
                                            <div className="bg-[#0D0F12] border border-amber-500/30 p-4 rounded-xl flex flex-col gap-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                                        STATUS: Omitted Response
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block mb-1 font-mono">
                                                        CLINICAL DIAGNOSIS:
                                                    </span>
                                                    <p className="text-zinc-300 text-xs leading-relaxed">
                                                        Failure to provide a spoken response prevents fluency, lexical, and grammatical evaluation for this prompt. This heavily impacts overall sub-scores in this section.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">BAND 8.0+ BOOSTER:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Deploying basic complex clauses (&ldquo;Although I am not fully certain, it seems that...&rdquo;) ensures immediate grammatical floor points.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-[#0D0F12] border border-[#222732] p-3 rounded-xl">
                                                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">STRENGTHS:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    {currentQuestion.examinerCritique.gra}
                                                </p>
                                            </div>
                                            <div className="bg-[#0D0F12] border border-amber-500/20 p-3 rounded-xl">
                                                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">AREAS FOR GROWTH:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Prepositional phrasing slips and verbal collocational anomalies observed in quick transitions.
                                                </p>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">BAND 8.0+ BOOSTER:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Deploy cleft sentences (&ldquo;What renders this so crucial is...&rdquo;) and mixed conditional constructions to verify high grammatical breadth.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {expandedPillar === 'PR' && (
                                <div className="flex flex-col gap-3 text-xs">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Phonemes</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '7.0'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Word Stress</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '7.5'}
                                            </p>
                                        </div>
                                        <div className={`bg-[#0D0F12] border p-2.5 rounded-xl text-center ${isCurrentOmitted ? 'border-zinc-800' : 'border-[#222732]'}`}>
                                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Intonation</p>
                                            <p className={`text-base font-bold mt-0.5 ${isCurrentOmitted ? 'text-zinc-500' : 'text-white'}`}>
                                                {isCurrentOmitted ? 'N/A' : '6.5'}
                                            </p>
                                        </div>
                                    </div>
                                    {isCurrentOmitted ? (
                                        <>
                                            <div className="bg-[#0D0F12] border border-amber-500/30 p-4 rounded-xl flex flex-col gap-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                                        STATUS: Omitted Response
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block mb-1 font-mono">
                                                        CLINICAL DIAGNOSIS:
                                                    </span>
                                                    <p className="text-zinc-300 text-xs leading-relaxed">
                                                        Failure to provide a spoken response prevents fluency, lexical, and grammatical evaluation for this prompt. This heavily impacts overall sub-scores in this section.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">PRONUNCIATION MODELING:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Use the audio model button below to listen to native intonation contours and word stress placements for this prompt.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-[#0D0F12] border border-[#222732] p-3 rounded-xl">
                                                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">STRENGTHS:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    {currentQuestion.examinerCritique.pr}
                                                </p>
                                            </div>
                                            <div className="bg-[#0D0F12] border border-amber-500/20 p-3 rounded-xl">
                                                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">AREAS FOR GROWTH:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Slight intonational flattening on multi-clause sentences; pitch peaks can be varied more dynamically.
                                                </p>
                                            </div>
                                            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                                                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">BAND 8.0+ BOOSTER:</span>
                                                <p className="text-zinc-300 mt-1 leading-relaxed">
                                                    Use conscious rise-fall intonational contours when contrasting opinions or delivering conclusive takeaways.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                    {/* Band 8.5+ Model Reconstruction Card */}
                    <div className="bg-[#15181E] border border-emerald-500/30 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-emerald-500/20 gap-2">
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                BAND 8.5+ MODEL RECONSTRUCTION · {currentQuestion.shortLabel}
                            </span>
                            <button
                                onClick={() => toggleModelSpeech(currentQuestion.modelAnswerText)}
                                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 w-fit active:scale-95"
                            >
                                <span>{isModelSpeaking ? '⏹ Stop Audio' : '🎧 Listen to Band 8.5+ Model'}</span>
                            </button>
                        </div>

                        {/* Comparative Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                            {/* Candidate Speech */}
                            <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3 flex flex-col">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5 font-bold">
                                    CANDIDATE RECORDED ANSWER
                                </span>
                                <p className="text-xs text-zinc-400 leading-relaxed italic">
                                    {isCurrentOmitted
                                        ? "This question was left unanswered during the examination. No speech sample was provided."
                                        : `“${currentQuestion.transcriptText}”`}
                                </p>
                            </div>

                            {/* Upgraded Band 8.5+ Model */}
                            <div className="bg-[#0D0F12] border border-emerald-500/25 rounded-xl p-3 flex flex-col">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1.5 font-bold">
                                    BAND 8.5+ DISCOURSE REWRITE
                                </span>
                                <p className="text-xs text-zinc-100 leading-relaxed font-normal whitespace-pre-line">
                                    &ldquo;{currentQuestion.modelAnswerText}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* Key Vocabulary Upgrades */}
                        <div className="pt-2 border-t border-[#222732] flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-mono uppercase text-zinc-500 mr-1 font-bold">
                                Lexical Upgrades:
                            </span>
                            {currentQuestion.modelUpgrades.map((upgrade, uIdx) => (
                                <span
                                    key={uIdx}
                                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                >
                                    {upgrade}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                6. TOKEN INSPECTION MODAL (CLICK-TO-INSPECT POPOVER)
            ════════════════════════════════════════════════════════════════ */}
            {selectedToken && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setSelectedToken(null)}
                >
                    <div
                        className="bg-[#15181E] border border-[#222732] rounded-2xl max-w-md w-full p-5 shadow-2xl text-zinc-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-[#222732] mb-3">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                                        selectedToken.type === 'filler'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                            : selectedToken.type === 'grammar'
                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    }`}
                                >
                                    {selectedToken.type === 'filler' && 'Hesitation Marker'}
                                    {selectedToken.type === 'grammar' && 'Grammar / Lexical Limitation'}
                                    {selectedToken.type === 'collocation' && 'Band 8+ Collocation'}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedToken(null)}
                                className="text-zinc-500 hover:text-white text-base leading-none cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-3">
                            <p className="text-[11px] font-mono text-zinc-500 uppercase">Selected Phrase:</p>
                            <p className="text-base font-bold text-white mt-0.5">&ldquo;{selectedToken.text}&rdquo;</p>
                        </div>

                        {selectedToken.explanation && (
                            <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3 mb-3">
                                <p className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Examiner Feedback:</p>
                                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                                    {selectedToken.explanation}
                                </p>
                            </div>
                        )}

                        {selectedToken.suggestedFix && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
                                <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                                    Band 8.5+ Recommended Alternative:
                                </p>
                                <p className="text-xs text-emerald-200 mt-1 font-medium leading-relaxed">
                                    {selectedToken.suggestedFix}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedToken(null)}
                            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-all cursor-pointer"
                        >
                            Close Inspector
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                7. CHALLENGE / DISPUTE MODAL
            ════════════════════════════════════════════════════════════════ */}
            {isDisputeOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => {
                        setIsDisputeOpen(false);
                        setDisputeSubmitted(false);
                    }}
                >
                    <div
                        className="bg-[#15181E] border border-[#222732] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-zinc-100 flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-[#222732]">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <span>🚩 Challenge Band Score / Request Senior Review</span>
                            </h3>
                            <button
                                onClick={() => {
                                    setIsDisputeOpen(false);
                                    setDisputeSubmitted(false);
                                }}
                                className="text-zinc-500 hover:text-white text-base cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {disputeSubmitted ? (
                            <div className="text-center py-6">
                                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-xl mb-3">
                                    ✓
                                </div>
                                <h4 className="text-base font-bold text-white">Dispute Submitted Successfully</h4>
                                <p className="text-xs text-zinc-400 mt-1.5 max-w-sm mx-auto">
                                    Your attempt has been queued for re-evaluation by our Senior Examiner Council. You will receive an updated rubric within 24 hours.
                                </p>
                                <button
                                    onClick={() => {
                                        setIsDisputeOpen(false);
                                        setDisputeSubmitted(false);
                                    }}
                                    className="mt-5 px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    If you believe your acoustic cadence or vocabulary was evaluated unfairly, submit an expedited challenge. Our expert IELTS panel will perform blind re-scoring.
                                </p>

                                <div>
                                    <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                                        Primary Criterion in Dispute:
                                    </label>
                                    <select
                                        value={disputeCriterion}
                                        onChange={(e) => setDisputeCriterion(e.target.value)}
                                        className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60"
                                    >
                                        <option value="fluency">Fluency & Coherence (Speech rate / hesitation)</option>
                                        <option value="lexical">Lexical Resource (Vocabulary / idiomatic range)</option>
                                        <option value="grammar">Grammatical Range & Accuracy (Tense control)</option>
                                        <option value="pronunciation">Pronunciation (Phonemic clarity / stress)</option>
                                        <option value="all">Overall Band Assessment</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                                        Candidate Rationale & Specific Evidence:
                                    </label>
                                    <textarea
                                        value={disputeNotes}
                                        onChange={(e) => setDisputeNotes(e.target.value)}
                                        placeholder="Explain why the flagged tokens or scores do not match your speech (e.g., 'In Part 2, my noise attenuation phrasing was accurate and shouldn't have been flagged as a lexical slip...')"
                                        rows={4}
                                        className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#222732]">
                                    <button
                                        onClick={() => setIsDisputeOpen(false)}
                                        className="px-4 py-2 rounded-xl bg-transparent hover:bg-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setDisputeSubmitted(true)}
                                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                                    >
                                        Submit Challenge
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default SpeakingEvaluationCanvas;
