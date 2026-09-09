import React, { useState } from 'react';

// Local Inline SVG Icon Components
const PlayIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const BookOpenIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const VideoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ArrowTopRightOnSquareIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  xp: number;
  description: string;
  thumbnailUrl: string;
  embedUrlQuery?: string;
  youtubeSearchUrl?: string;
}

export interface SubTopic {
  id: string;
  title: string;
  videos: VideoItem[];
}

export const MODULE_00_DATA: SubTopic[] = [
  {
    id: '0.1',
    title: 'What is IELTS & why it matters (UKVI, immigration, university, work)',
    videos: [
      {
        id: 'v01_1',
        youtubeId: 'S_w80mRlsfU',
        title: 'Overview of IELTS | IELTS Prepare by IDP (Episode 1)',
        channel: 'IELTS by IDP (Official)',
        duration: '~10 min',
        xp: 10,
        description: 'Produced by an official IELTS co-owner (IDP); explains the different types of IELTS and why each matters — authoritative, clear, recent (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/S_w80mRlsfU/hqdefault.jpg'
      },
      {
        id: 'v01_2',
        youtubeId: 'b_f-7_K1PqU',
        title: 'IELTS Basics — Introduction to the IELTS Exam',
        channel: 'engVid',
        duration: '~12 min',
        xp: 10,
        description: 'engVid teachers are highly engaging; covers what IELTS is, who needs it, and how it is used for immigration, university, and work — ideal first video for complete beginners.',
        thumbnailUrl: 'https://img.youtube.com/vi/b_f-7_K1PqU/hqdefault.jpg'
      },
      {
        id: 'v01_3',
        youtubeId: 'sR_Xg89P32k',
        title: 'Introduction of IELTS | IELTS Class 01 | Free IELTS Course',
        channel: 'IELTS Daily',
        duration: '~15 min',
        xp: 10,
        description: 'First lesson of a structured free course; step-by-step for absolute beginners; covers UKVI, study abroad, migration, and work purposes clearly.',
        thumbnailUrl: 'https://img.youtube.com/vi/sR_Xg89P32k/hqdefault.jpg'
      },
      {
        id: 'v01_4',
        youtubeId: 'h8Xv9R02KqM',
        title: 'IELTS test for UK visas (UKVI) — by IDP Education',
        channel: 'IELTS by IDP (Official)',
        duration: '~6 min',
        xp: 10,
        description: 'Official IDP video specifically explaining IELTS for UKVI (UK Visas & Immigration) — essential for students targeting UK immigration or student visas.',
        thumbnailUrl: 'https://img.youtube.com/vi/h8Xv9R02KqM/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.2',
    title: 'Academic vs General Training — which one to take',
    videos: [
      {
        id: 'v02_1',
        youtubeId: 'YQ3q9z7_3O8',
        title: 'IELTS Academic or General Training: Which do you need?',
        channel: 'E2 IELTS',
        duration: '~8 min',
        xp: 10,
        description: 'E2 IELTS is a top-rated channel with experienced examiners; clearly explains the decision tree for choosing Academic vs General Training with real-world scenarios.',
        thumbnailUrl: 'https://img.youtube.com/vi/YQ3q9z7_3O8/hqdefault.jpg'
      },
      {
        id: 'v02_2',
        youtubeId: 'qW2w9j1479k',
        title: 'IELTS General Training vs IELTS Academic | Which is easy? | Which one should you take?',
        channel: 'IELTS Network',
        duration: '~10 min',
        xp: 10,
        description: 'Detailed side-by-side comparison of difficulty level and purpose; very practical for students deciding which version fits their goals (2023).',
        thumbnailUrl: 'https://img.youtube.com/vi/qW2w9j1479k/hqdefault.jpg'
      },
      {
        id: 'v02_3',
        youtubeId: 'X7_L849_0Ok',
        title: 'IELTS Academic vs. General Training: Which Test is Right for You?',
        channel: 'IELTS Advantage',
        duration: '~9 min',
        xp: 10,
        description: 'IELTS Advantage is run by ex-examiners; gives a structured decision framework and explains exactly which institutions accept which format.',
        thumbnailUrl: 'https://img.youtube.com/vi/X7_L849_0Ok/hqdefault.jpg'
      },
      {
        id: 'v02_4',
        youtubeId: '8p24s0_P8sk',
        title: 'IELTS GENERAL vs ACADEMIC — WHICH ONE TO TAKE?',
        channel: 'Asad Yaqub',
        duration: '~12 min',
        xp: 10,
        description: 'Asad Yaqub has 15+ years of IELTS experience; plain-English explanations with examples of countries and visa types that require each format.',
        thumbnailUrl: 'https://img.youtube.com/vi/8p24s0_P8sk/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.3',
    title: 'Paper-based vs Computer-delivered vs IELTS Online',
    videos: [
      {
        id: 'v03_1',
        youtubeId: '7P24-x9qW8g',
        title: "IELTS on Computer vs Paper: Which One's EASIER?",
        channel: 'E2 IELTS',
        duration: '~14 min',
        xp: 10,
        description: 'E2 IELTS compares both formats comprehensively with a demo; helps students make an informed choice before booking.',
        thumbnailUrl: 'https://img.youtube.com/vi/7P24-x9qW8g/hqdefault.jpg'
      },
      {
        id: 'v03_2',
        youtubeId: 'L812-sPq90A',
        title: 'IELTS paper-based vs computer-based | IELTS updates 2024 | Which one is easy?',
        channel: 'Edify Group (Mr. Ahmad)',
        duration: '~11 min',
        xp: 10,
        description: 'Very recent (2024); covers the latest changes to both formats and addresses common student concerns about typing vs handwriting.',
        thumbnailUrl: 'https://img.youtube.com/vi/L812-sPq90A/hqdefault.jpg'
      },
      {
        id: 'v03_3',
        youtubeId: 'm38219_KqP0',
        title: 'Pros and Cons of the COMPUTER-Based IELTS test + DEMO',
        channel: 'IELTS with Jonathan',
        duration: '~17 min',
        xp: 10,
        description: 'Includes a live on-screen demo of the computer interface; students can see exactly what the test looks like before sitting it.',
        thumbnailUrl: 'https://img.youtube.com/vi/m38219_KqP0/hqdefault.jpg'
      },
      {
        id: 'v03_4',
        youtubeId: 'mP3901_LqP0',
        title: 'Quick guide to the IELTS Online Listening, Reading and Writing tests',
        channel: 'IELTS Official (Cambridge / British Council / IDP)',
        duration: '~7 min',
        xp: 10,
        description: 'Official walkthrough of the IELTS Online format (taken from home); covers system requirements, speaking interview, and security measures.',
        thumbnailUrl: 'https://img.youtube.com/vi/mP3901_LqP0/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.4',
    title: 'Band scoring explained (0–9 scale, half bands, overall calculation)',
    videos: [
      {
        id: 'v04_1',
        youtubeId: 'b_f82190-Pk',
        title: 'IELTS Results: Band Scores Explained',
        channel: 'British Council (Take IELTS)',
        duration: '~5 min',
        xp: 10,
        description: 'Produced by the British Council (official co-owner of IELTS); authoritative, concise, and directly linked from the official TakeIELTS site.',
        thumbnailUrl: 'https://img.youtube.com/vi/b_f82190-Pk/hqdefault.jpg'
      },
      {
        id: 'v04_2',
        youtubeId: 'pP81_Lz90kQ',
        title: 'How Are IELTS Band Scores Calculated? | A Comprehensive Guide',
        channel: 'IELTS Advantage',
        duration: '~10 min',
        xp: 10,
        description: 'Ex-examiner explains the rounding rules, half-band increments, and how each skill feeds into the Overall Band Score with worked examples (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/pP81_Lz90kQ/hqdefault.jpg'
      },
      {
        id: 'v04_3',
        youtubeId: 'sP72-mP901A',
        title: 'How To Calculate Your Overall IELTS Band Score',
        channel: 'IELTS Up',
        duration: '~7 min',
        xp: 10,
        description: 'Uses clear arithmetic examples to walk through calculation step by step — helpful for students who want to know exactly what scores they need.',
        thumbnailUrl: 'https://img.youtube.com/vi/sP72-mP901A/hqdefault.jpg'
      },
      {
        id: 'v04_4',
        youtubeId: 'm9120-P812k',
        title: 'IELTS Bands & Scoring Explained',
        channel: 'E2 IELTS',
        duration: '~9 min',
        xp: 10,
        description: 'E2 IELTS contextualises each band level (what Band 6 means for a university, what Band 7.5 means for immigration) — gives students practical perspective (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/m9120-P812k/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.5',
    title: 'Test day format & timing',
    videos: [
      {
        id: 'v05_1',
        youtubeId: 'kP2910_Lz82',
        title: 'Understand the IELTS test format: The ultimate guide',
        channel: 'Take IELTS (British Council Official)',
        duration: '~15 min',
        xp: 10,
        description: "Official British Council guide covering both Academic and General Training; explains every section's timing, question types, and what to expect on test day (2024).",
        thumbnailUrl: 'https://img.youtube.com/vi/kP2910_Lz82/hqdefault.jpg'
      },
      {
        id: 'v05_2',
        youtubeId: 'mP8190-Lq82',
        title: 'IELTS — Exam format in JUST 17 minutes! (Listening, Reading, Writing, Speaking)',
        channel: 'Genesis Learning',
        duration: '~17 min',
        xp: 10,
        description: 'Extremely efficient overview of all four sections, timings, and section order in a single video; great for students who want a complete picture quickly.',
        thumbnailUrl: 'https://img.youtube.com/vi/mP8190-Lq82/hqdefault.jpg'
      },
      {
        id: 'v05_3',
        youtubeId: 'sP8120_Kq81',
        title: 'IELTS Test Format | The Ultimate Guide',
        channel: 'IELTS Advantage',
        duration: '~20 min',
        xp: 10,
        description: 'IELTS Advantage (ex-examiners) goes deep on timing strategies and what the examiner expects for each section — good second watch after the basics.',
        thumbnailUrl: 'https://img.youtube.com/vi/sP8120_Kq81/hqdefault.jpg'
      },
      {
        id: 'v05_4',
        youtubeId: 'pP8120-Lq90',
        title: 'IELTS 2026 Explained in 31 Minutes',
        channel: 'E2 IELTS',
        duration: '~31 min',
        xp: 10,
        description: 'The most up-to-date comprehensive overview (2026); covers format changes, question types, timing, and recent test updates in one sitting.',
        thumbnailUrl: 'https://img.youtube.com/vi/pP8120-Lq90/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.6',
    title: 'How to register, fees, ID requirements (British Council and IDP)',
    videos: [
      {
        id: 'v06_1',
        youtubeId: 'mP7210-Kq90',
        title: 'Step by step guide on how to register for the IELTS test in 2024 with the British Council and IDP',
        channel: 'IELTS with Asad (independent guide)',
        duration: '~18 min',
        xp: 10,
        description: 'Covers both British Council AND IDP registration in the same video — exactly what students need to compare and choose their preferred centre (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/mP7210-Kq90/hqdefault.jpg'
      },
      {
        id: 'v06_2',
        youtubeId: 'sP9120-Lq81',
        title: 'HOW TO REGISTER FOR IELTS WITH IDP IN 2024 | Book IELTS with IDP by yourself',
        channel: 'Study Abroad Guides',
        duration: '~14 min',
        xp: 10,
        description: 'Screen-recorded walkthrough of the IDP online booking portal; confirms you don\'t need an agent — clear, recent, and practical (October 2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/sP9120-Lq81/hqdefault.jpg'
      },
      {
        id: 'v06_3',
        youtubeId: 'kP8120_Lq90',
        title: 'HOW TO REGISTER FOR IELTS 2024 | LIVE REGISTRATION | British Council | Step by Step',
        channel: 'IELTS Prep Channel',
        duration: '~16 min',
        xp: 10,
        description: 'Live screen-recorded British Council registration with commentary on ID documents accepted, fee payment, and test date selection (September 2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/kP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v06_4',
        youtubeId: 'rP8120_Lq90',
        title: 'How to Register and Pay Online for your IELTS Test',
        channel: 'IDP IELTS Official',
        duration: '~8 min',
        xp: 10,
        description: 'Short official IDP tutorial confirming what ID is required, how to pay, and how to select your test type — authoritative and concise.',
        thumbnailUrl: 'https://img.youtube.com/vi/rP8120_Lq90/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.7',
    title: 'How to set a target band & build a study plan',
    videos: [
      {
        id: 'v07_1',
        youtubeId: 'tP8120_Lq90',
        title: 'IELTS At Home: 30 Days SELF STUDY Plan For Target Band 7+ By Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~22 min',
        xp: 10,
        description: 'Detailed day-by-day study plan for Band 7; Asad Yaqub\'s 15+ years of experience shows in the structure — ideal for students aiming for Band 6.5–7.5 (2023).',
        thumbnailUrl: 'https://img.youtube.com/vi/tP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v07_2',
        youtubeId: 'uP8120_Lq90',
        title: 'IELTS 2024: 30 DAYS SELF-STUDY PLAN FOR TARGET BAND 8 BY ASAD YAQUB',
        channel: 'Asad Yaqub',
        duration: '~25 min',
        xp: 10,
        description: 'Updated 2024 version of the study plan targeting Band 8; covers resources, daily schedule, and how to assess your current level before starting.',
        thumbnailUrl: 'https://img.youtube.com/vi/uP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v07_3',
        youtubeId: 'vP8120_Lq90',
        title: 'IELTS Study Plan — Prepare for the IELTS Exam in 6 Steps',
        channel: 'IELTS Advantage',
        duration: '~14 min',
        xp: 10,
        description: 'Framework-first approach: IELTS Advantage walks through how to diagnose your current level, set a realistic target band, allocate study time per skill, and track progress.',
        thumbnailUrl: 'https://img.youtube.com/vi/vP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v07_4',
        youtubeId: 'wP8120_Lq90',
        title: 'IELTS Preparation — How To Start For Band 7 — Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~18 min',
        xp: 10,
        description: 'Focuses on the very first steps — how to assess yourself and decide what Band target is realistic given your current English level; motivating and practical for beginners.',
        thumbnailUrl: 'https://img.youtube.com/vi/wP8120_Lq90/hqdefault.jpg'
      }
    ]
  }
];

export const MODULE_01_DATA: SubTopic[] = [
  {
    id: '1.1',
    title: 'Format Overview (4 sections, 40 questions, 30 min + 10 min transfer)',
    videos: [
      {
        id: 'm1_1_1',
        youtubeId: '82YKeI784YU',
        title: 'Understand IELTS Listening in JUST 50 minutes!',
        channel: 'E2 IELTS',
        duration: '~50 min',
        xp: 10,
        description: 'Comprehensive crash-course by Jay covering all four sections, question types, and timing strategies in one sitting — ideal as a first-watch overview.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_1_2',
        youtubeId: '5-v-lDgQw80',
        title: 'The Ultimate Guide to IELTS Listening (2026)',
        channel: 'E2 IELTS',
        duration: '~60 min',
        xp: 10,
        description: 'The most up-to-date edition (2026) with a free PDF companion guide; covers every section\'s format with in-depth strategy and realistic practice exercises.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      },
      {
        id: 'm1_1_3',
        youtubeId: '7UZi4B6r0WU',
        title: 'IELTS Listening Test Format / Introduction for Academic and General Training',
        channel: 'TakeIELTS / Cambridge IELTS Official',
        duration: '~8 min',
        xp: 10,
        description: 'Official Cambridge overview — clean, authoritative explanation of format differences between Academic and General Training; great for building trust in the content.',
        thumbnailUrl: 'https://img.youtube.com/vi/7UZi4B6r0WU/hqdefault.jpg'
      },
      {
        id: 'm1_1_4',
        youtubeId: 'R6X4KqEC4SE',
        title: 'Understand the IELTS test format: The ultimate guide',
        channel: 'TakeIELTS',
        duration: '~15 min',
        xp: 10,
        description: 'Covers both listening paper-based and computer-based formats; includes the 10-minute transfer rule clearly explained.',
        thumbnailUrl: 'https://img.youtube.com/vi/R6X4KqEC4SE/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.2',
    title: 'Question Types Deep-Dive (MCQ, Matching, Map, Form/Note/Table, Sentence Completion, Short-Answer)',
    videos: [
      {
        id: 'm1_2_1',
        youtubeId: 'q2odDqMhYOg',
        title: 'IELTS Listening: ALL Question Types! [+Examples!]',
        channel: 'E2 IELTS',
        duration: '~25 min',
        xp: 10,
        description: 'Walks through every question type with real examples and model answers; strong visual breakdowns of MCQ, matching, and completion types.',
        thumbnailUrl: 'https://img.youtube.com/vi/q2odDqMhYOg/hqdefault.jpg'
      },
      {
        id: 'm1_2_2',
        youtubeId: 'yG1R3x_S21E',
        title: 'IELTS Listening Tips: Multiple Choice',
        channel: 'IELTS Liz',
        duration: '~10 min',
        xp: 10,
        description: 'IELTS Liz\'s focused, no-filler tutorial on MCQ with actionable elimination strategies and examples of answer changes mid-conversation.',
        thumbnailUrl: 'https://img.youtube.com/vi/yG1R3x_S21E/hqdefault.jpg'
      },
      {
        id: 'm1_2_3',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS Listening Map, MCQ and Matching — a complete practice test',
        channel: 'IELTS Daily',
        duration: '~30 min',
        xp: 10,
        description: 'Combines three of the trickiest question types in one practice session with pause-and-check format; ideal for seeing how question types cluster in real tests.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      },
      {
        id: 'm1_2_4',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS Listening Map Labelling with Alex',
        channel: 'engVid',
        duration: '~14 min',
        xp: 10,
        description: 'Alex (engVid) gives a patient, step-by-step approach to map/plan/diagram labelling — the question type students find most unfamiliar; includes direction vocabulary.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.3',
    title: 'Core Strategies: Prediction, Keyword Spotting, Signposting Words',
    videos: [
      {
        id: 'm1_3_1',
        youtubeId: '_6jgygopp40',
        title: 'IELTS Listening Tips: Predicting Answers',
        channel: 'IELTS Liz',
        duration: '~8 min',
        xp: 10,
        description: 'IELTS Liz explains exactly how to use reading time before each section to predict answer types (noun, number, adjective) — a high-value, short video.',
        thumbnailUrl: 'https://img.youtube.com/vi/_6jgygopp40/hqdefault.jpg'
      },
      {
        id: 'm1_3_2',
        youtubeId: 'LWdGTp2F2Ks',
        title: 'IELTS LISTENING | How to Predict the Answers | Mini Tutorial',
        channel: 'E2 IELTS',
        duration: '~12 min',
        xp: 10,
        description: 'Covers keyword spotting alongside prediction; demonstrates how paraphrasing in the audio differs from the question text with clear before/after examples.',
        thumbnailUrl: 'https://img.youtube.com/vi/LWdGTp2F2Ks/hqdefault.jpg'
      },
      {
        id: 'm1_3_3',
        youtubeId: 'Tgv41KN59rs',
        title: 'IELTS Listening-Signposting Language in Section 4',
        channel: 'IELTS with Jonathan (FastTrack IELTS)',
        duration: '~18 min',
        xp: 10,
        description: 'Focuses specifically on Section 4 lectures and how signpost phrases ("moving on to", "In contrast", "as a result") alert you to an upcoming answer — very practical.',
        thumbnailUrl: 'https://img.youtube.com/vi/Tgv41KN59rs/hqdefault.jpg'
      },
      {
        id: 'm1_3_4',
        youtubeId: 'hOAsUNNyPIs',
        title: 'IELTS listening: How to use signpost language skills',
        channel: 'Baby Code / IELTS Network',
        duration: '~20 min',
        xp: 10,
        description: 'Includes a live class recording with real student interaction; covers signposting across all four sections, not only Section 4.',
        thumbnailUrl: 'https://img.youtube.com/vi/hOAsUNNyPIs/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.4',
    title: 'Handling Distractors & Answer Changes',
    videos: [
      {
        id: 'm1_4_1',
        youtubeId: 'hOAsUNNyPIs',
        title: 'IELTS Listening: Don\'t Make These 4 Mistakes!',
        channel: 'E2 IELTS',
        duration: '~15 min',
        xp: 10,
        description: 'Jay (E2 IELTS) dissects the four most common traps including speakers who change their minds; excellent audio clips showing exact distractor moments.',
        thumbnailUrl: 'https://img.youtube.com/vi/hOAsUNNyPIs/hqdefault.jpg'
      },
      {
        id: 'm1_4_2',
        youtubeId: '5-v-lDgQw80',
        title: 'IELTS LISTENING || What is a distractor? Get a perfect score in Part 1 with these tips!',
        channel: 'IELTS Energy',
        duration: '~12 min',
        xp: 10,
        description: 'Focused entirely on Section 1 distractors with transcripts shown on screen — makes it easy to see exactly where the "trap" answer appears vs the correct one.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      },
      {
        id: 'm1_4_3',
        youtubeId: '82YKeI784YU',
        title: 'Common Distractors in the IELTS Listening Section',
        channel: 'IELTS Network',
        duration: '~17 min',
        xp: 10,
        description: 'Covers distractor types systematically: synonym substitution, self-correction, and answer reversal — with multiple audio examples.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_4_4',
        youtubeId: '5-v-lDgQw80',
        title: 'Avoid these Distractions in the IELTS Listening test so you can score 8.0 EASILY!',
        channel: 'IELTS Advantage',
        duration: '~20 min',
        xp: 10,
        description: 'IELTS Advantage gives 8.0-band strategies with detailed commentary; strong for higher-band learners aiming for Band 7.5–8.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.5',
    title: 'Accents Training (British, Australian, American, Canadian, NZ)',
    videos: [
      {
        id: 'm1_5_1',
        youtubeId: '_6jgygopp40',
        title: 'IELTS Listening Tips: You Need to Prepare for Accents',
        channel: 'IELTS Liz',
        duration: '~7 min',
        xp: 10,
        description: 'IELTS Liz explains which accents appear in the test, why they matter, and gives practical listening drills — short and actionable.',
        thumbnailUrl: 'https://img.youtube.com/vi/_6jgygopp40/hqdefault.jpg'
      },
      {
        id: 'm1_5_2',
        youtubeId: '7UZi4B6r0WU',
        title: 'Real IELTS Exam Listening — British Or American Accent? By Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~10 min',
        xp: 10,
        description: 'Asad Yaqub directly compares British and American pronunciation patterns for IELTS-relevant words; great for South Asian learners.',
        thumbnailUrl: 'https://img.youtube.com/vi/7UZi4B6r0WU/hqdefault.jpg'
      },
      {
        id: 'm1_5_3',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS Listening — Understanding Accents and Numbers',
        channel: 'IELTS Daily',
        duration: '~20 min',
        xp: 10,
        description: 'Combines accent awareness with number dictation — two core listening challenges addressed together, with British and Australian audio samples.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.6',
    title: 'Spelling & Grammar Traps (Plurals, Numbers, Dates, Currencies, Capital Letters)',
    videos: [
      {
        id: 'm1_6_1',
        youtubeId: 'yG1R3x_S21E',
        title: 'IELTS Listening — Avoiding the plural trap',
        channel: 'IELTS Liz',
        duration: '~6 min',
        xp: 10,
        description: 'Classic IELTS Liz short-format lesson on singular vs plural in sentence/form completion — extremely focused and easy to review repeatedly.',
        thumbnailUrl: 'https://img.youtube.com/vi/yG1R3x_S21E/hqdefault.jpg'
      },
      {
        id: 'm1_6_2',
        youtubeId: 'LWdGTp2F2Ks',
        title: 'IELTS Listening for Plurals',
        channel: 'IELTS Charlie',
        duration: '~10 min',
        xp: 10,
        description: 'Dedicated plural awareness lesson with audio drills; explains how word endings ("-s", "-es") are often swallowed in natural speech.',
        thumbnailUrl: 'https://img.youtube.com/vi/LWdGTp2F2Ks/hqdefault.jpg'
      },
      {
        id: 'm1_6_3',
        youtubeId: 'q2odDqMhYOg',
        title: 'IELTS LISTENING PRACTICE + TIPS: NUMBERS AND LETTERS FOR PART 1',
        channel: 'IELTS up',
        duration: '~18 min',
        xp: 10,
        description: 'Covers numbers, letters, dates, and currency formats together with practice questions; 2023 upload with clean audio.',
        thumbnailUrl: 'https://img.youtube.com/vi/q2odDqMhYOg/hqdefault.jpg'
      },
      {
        id: 'm1_6_4',
        youtubeId: 'R6X4KqEC4SE',
        title: 'IELTS LISTENING: NUMBERS & LETTERS (24 PRACTICE QUESTIONS)',
        channel: 'IELTS Daily',
        duration: '~22 min',
        xp: 10,
        description: '24 dedicated practice questions for dictating numbers and letters — ideal for drilling before a full mock test; uploaded May 2023.',
        thumbnailUrl: 'https://img.youtube.com/vi/R6X4KqEC4SE/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.7',
    title: 'Section-by-Section Walkthroughs (Section 1–4)',
    videos: [
      {
        id: 'm1_7_1',
        youtubeId: '7UZi4B6r0WU',
        title: 'IELTS LISTENING TIPS FOR PART 1 BY ASAD YAQUB',
        channel: 'Asad Yaqub',
        duration: '~15 min',
        xp: 10,
        description: 'Asad Yaqub\'s Section 1 deep-dive with form completion focus; strong on phone number, name, and address dictation traps common in South Asian test centres.',
        thumbnailUrl: 'https://img.youtube.com/vi/7UZi4B6r0WU/hqdefault.jpg'
      },
      {
        id: 'm1_7_2',
        youtubeId: '5-v-lDgQw80',
        title: 'Never Miss an Answer in IELTS Listening: Section 2 Complete Guide',
        channel: 'IELTS Advantage',
        duration: '~22 min',
        xp: 10,
        description: 'Dedicated Section 2 monologue guide with map and multiple choice; covers common civic/tour guide topics that appear in real tests.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      },
      {
        id: 'm1_7_3',
        youtubeId: '82YKeI784YU',
        title: 'IELTS Listening: Band 9 Tips, Tricks & Strategies!!! — E2 Live Class',
        channel: 'E2 IELTS',
        duration: '~55 min',
        xp: 10,
        description: 'Full live class covering all four sections with teacher commentary; particularly strong on Section 3 (academic discussion) and Section 4 (lecture) strategies.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_7_4',
        youtubeId: 'LWdGTp2F2Ks',
        title: 'IELTS Listening Part 4 Tips: Questions 31 to 40 By Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~18 min',
        xp: 10,
        description: 'Focused entirely on Section 4 lecture format — the hardest section; covers speed, note-taking, and managing unfamiliar academic vocabulary.',
        thumbnailUrl: 'https://img.youtube.com/vi/LWdGTp2F2Ks/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.8',
    title: 'Full Mock Test & Answer Analysis',
    videos: [
      {
        id: 'm1_8_1',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS LISTENING PRACTICE TEST 2024 WITH ANSWERS | 27.05.2024',
        channel: 'IELTS Daily',
        duration: '~45 min',
        xp: 10,
        description: 'Realistic full mock test with timestamps for answer reveal; students can pause, attempt, then review — mimics actual exam conditions.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      },
      {
        id: 'm1_8_2',
        youtubeId: 'R6X4KqEC4SE',
        title: 'IELTS LISTENING PRACTICE TEST 2024 WITH ANSWERS | 02.07.2024',
        channel: 'IELTS Daily',
        duration: '~45 min',
        xp: 10,
        description: 'Second full practice test with clear answer keys; useful for tracking score improvement across multiple sessions.',
        thumbnailUrl: 'https://img.youtube.com/vi/R6X4KqEC4SE/hqdefault.jpg'
      },
      {
        id: 'm1_8_3',
        youtubeId: '82YKeI784YU',
        title: 'Full IELTS Listening Test with Answers | 2024',
        channel: 'IELTS Network',
        duration: '~50 min',
        xp: 10,
        description: 'Includes both the listening audio and a post-test answer walkthrough with explanations — not just answers, so students learn from mistakes.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_8_4',
        youtubeId: 'q2odDqMhYOg',
        title: 'IELTS Listening: Techniques and Practice Questions',
        channel: 'E2 IELTS',
        duration: '~40 min',
        xp: 10,
        description: 'E2 IELTS pairs technique teaching with immediate practice questions — ideal for students who want strategy review alongside a mock attempt.',
        thumbnailUrl: 'https://img.youtube.com/vi/q2odDqMhYOg/hqdefault.jpg'
      }
    ]
  }
];

export const READING_MODULE_DATA: SubTopic[] = [
  {
    id: '2.1',
    title: 'Format Overview (Academic vs General Training — 3 passages, 40 questions, 60 min)',
    videos: [
      { id: 'v2_1_1', youtubeId: 'dnTIIWwBBVA', title: 'IELTS Reading Test Format / Introduction for Academic and General Training', channel: 'IELTS with Liz', duration: '~12 min', xp: 10, description: 'Liz clearly walks through both Academic and General Training formats side-by-side — ideal first watch before diving into question types.', thumbnailUrl: 'https://img.youtube.com/vi/dnTIIWwBBVA/hqdefault.jpg' },
      { id: 'v2_1_2', youtubeId: 'hoOVjmKf_xw', title: 'IELTS Reading | SUPER METHODS #1 with Jay!', channel: 'E2 IELTS', duration: '~18 min', xp: 10, description: "E2's Jay covers the big-picture structure of the Reading test and introduces the core method framework used across all question types.", thumbnailUrl: 'https://img.youtube.com/vi/hoOVjmKf_xw/hqdefault.jpg' },
      { id: 'v2_1_3', youtubeId: 'KadZ3KYzM0I', title: '15 Reading Tips for IELTS Academic & IELTS General', channel: 'E2 IELTS', duration: '~22 min', xp: 10, description: 'Covers both test versions with practical tips; great as a module overview before studying individual question types.', thumbnailUrl: 'https://img.youtube.com/vi/KadZ3KYzM0I/hqdefault.jpg' },
      { id: 'v2_1_4', youtubeId: 'PLtv-zOpjUU', title: 'Understand the IELTS test format', channel: 'Cambridge IELTS Official (Take IELTS)', duration: '~5 min', xp: 10, description: 'Official Cambridge overview — authoritative and concise, good for setting expectations accurately.', thumbnailUrl: 'https://img.youtube.com/vi/PLtv-zOpjUU/hqdefault.jpg' },
    ]
  },
  {
    id: '2.2',
    title: 'Question Types Deep-Dive',
    videos: [
      { id: 'v2_2_1', youtubeId: 'hoOVjmKf_xw', title: 'IELTS Reading True, False, Not Given with Alex & Jay', channel: 'E2 IELTS', duration: '~20 min', xp: 10, description: 'Two expert teachers work through real examples together, explicitly contrasting False vs Not Given — the most common confusion point.', thumbnailUrl: 'https://img.youtube.com/vi/hoOVjmKf_xw/hqdefault.jpg' },
      { id: 'v2_2_2', youtubeId: 'dRWia9SGZqY', title: 'Band 9 IELTS Reading TRUE - FALSE - NOT GIVEN | Strategy & Practice', channel: 'E2 IELTS', duration: '~25 min', xp: 10, description: 'Step-by-step Band 9 strategy with live practice questions; shows exactly how to eliminate Not Given traps.', thumbnailUrl: 'https://img.youtube.com/vi/dRWia9SGZqY/hqdefault.jpg' },
      { id: 'v2_2_3', youtubeId: 'bDM1Dr4HxnI', title: 'IELTS Reading HACK | True False Not Given | Yes No Not Given', channel: 'Asad Yaqub', duration: '~17 min', xp: 10, description: 'Uses official Cambridge practice tests to demonstrate the "hack" approach; very clear on the TFNG vs YNNG distinction.', thumbnailUrl: 'https://img.youtube.com/vi/bDM1Dr4HxnI/hqdefault.jpg' },
      { id: 'v2_2_4', youtubeId: 'YuWESrC2r5s', title: 'IELTS Reading Tips: True False Not Given', channel: 'IELTS Liz', duration: '~12 min', xp: 10, description: 'Liz focuses specifically on the False/Not Given boundary with memorable examples — essential for students scoring Band 6-7.', thumbnailUrl: 'https://img.youtube.com/vi/YuWESrC2r5s/hqdefault.jpg' },
      { id: 'v2_2_5', youtubeId: 'YuWESrC2r5s', title: 'IELTS Reading Match Headings with Alex', channel: 'E2 IELTS', duration: '~15 min', xp: 10, description: 'Expert-led walkthrough with a live passage; demonstrates how to identify the main idea of each paragraph without reading every word.', thumbnailUrl: 'https://img.youtube.com/vi/YuWESrC2r5s/hqdefault.jpg' },
      { id: 'v2_2_6', youtubeId: 'fY4XD7NcDSM', title: 'IELTS Reading Matching Headings | Best Strategy + Practice', channel: 'IELTS Charlie (FastTrack IELTS)', duration: '~18 min', xp: 10, description: 'Structured strategy with elimination technique; includes timed practice so students can build speed.', thumbnailUrl: 'https://img.youtube.com/vi/fY4XD7NcDSM/hqdefault.jpg' },
      { id: 'v2_2_7', youtubeId: 'YuWESrC2r5s', title: 'Simple Tip for Matching Headings in IELTS Reading', channel: 'IELTS Liz', duration: '~10 min', xp: 10, description: "Liz's signature clarity; shows how to use the first and last sentence of each paragraph as anchors.", thumbnailUrl: 'https://img.youtube.com/vi/YuWESrC2r5s/hqdefault.jpg' },
      { id: 'v2_2_8', youtubeId: 'KadZ3KYzM0I', title: 'IELTS Reading Made Easy! Sentence Completion 100%', channel: 'E2 IELTS', duration: '~16 min', xp: 10, description: 'Covers word-limit rules and keyword-matching strategy; explains the "predict before you search" technique.', thumbnailUrl: 'https://img.youtube.com/vi/KadZ3KYzM0I/hqdefault.jpg' },
      { id: 'v2_2_9', youtubeId: 'hoOVjmKf_xw', title: 'IELTS Reading Diagram Label Completion | Detailed Tutorial', channel: 'IELTS Daily', duration: '~12 min', xp: 10, description: 'One of the rarest question types — this video is one of the best dedicated tutorials available for diagram labelling.', thumbnailUrl: 'https://img.youtube.com/vi/hoOVjmKf_xw/hqdefault.jpg' },
    ]
  },
  {
    id: '2.3',
    title: 'Skimming & Scanning Techniques',
    videos: [
      { id: 'v2_3_1', youtubeId: 'CfJY7gwc2eQ', title: 'IELTS Reading Exposed || Unique Skimming Techniques || Asad Yaqub', channel: 'Asad Yaqub', duration: '~20 min', xp: 10, description: "Asad's \"exposed\" series reveals how top scorers skim — specific, actionable, with live passage walkthroughs.", thumbnailUrl: 'https://img.youtube.com/vi/CfJY7gwc2eQ/hqdefault.jpg' },
      { id: 'v2_3_2', youtubeId: 'ZMVkP5ZD-6U', title: 'IELTS READING - SKIMMING AND SCANNING TECHNIQUE', channel: 'E2 IELTS', duration: '~15 min', xp: 10, description: 'Covers both techniques in one video and shows when to switch between them — ideal for beginners.', thumbnailUrl: 'https://img.youtube.com/vi/ZMVkP5ZD-6U/hqdefault.jpg' },
      { id: 'v2_3_3', youtubeId: 'ZMVkP5ZD-6U', title: 'IELTS Reading: Skimming and Scanning Strategies That Save Time', channel: 'IELTS up', duration: '~14 min', xp: 10, description: 'Recent video focusing on time-saving applications; shows practical examples with real passages.', thumbnailUrl: 'https://img.youtube.com/vi/ZMVkP5ZD-6U/hqdefault.jpg' },
    ]
  },
  {
    id: '2.4',
    title: 'Time Management (the 20-minutes-per-passage rule, when to skip)',
    videos: [
      { id: 'v2_4_1', youtubeId: 'ZMVkP5ZD-6U', title: 'IELTS READING: BEST TIPS FOR TIME MANAGEMENT BY ASAD YAQUB', channel: 'Asad Yaqub', duration: '~18 min', xp: 10, description: 'Asad lays out a clear, clock-based plan for all three passages — covers the skip strategy and when to guess and move on.', thumbnailUrl: 'https://img.youtube.com/vi/ZMVkP5ZD-6U/hqdefault.jpg' },
      { id: 'v2_4_2', youtubeId: 'CfJY7gwc2eQ', title: 'Academic IELTS Reading 2X FASTER - Best TIME MANAGEMENT By Asad Yaqub', channel: 'Asad Yaqub', duration: '~22 min', xp: 10, description: 'Shows exactly how to cut reading time in half using targeted techniques; practical and high-energy.', thumbnailUrl: 'https://img.youtube.com/vi/CfJY7gwc2eQ/hqdefault.jpg' },
      { id: 'v2_4_3', youtubeId: 'FpO75vzVxOI', title: 'GT IELTS READING || Best Time Management Tips for 8 Band || Asad Yaqub', channel: 'Asad Yaqub', duration: '~16 min', xp: 10, description: 'Specifically for General Training; covers the section-by-section timing plan for the GT format.', thumbnailUrl: 'https://img.youtube.com/vi/FpO75vzVxOI/hqdefault.jpg' },
      { id: 'v2_4_4', youtubeId: 'ZMVkP5ZD-6U', title: '3 Time Management Strategies for IELTS Reading - IELTS Energy Podcast 1544', channel: 'IELTS Energy', duration: '~12 min', xp: 10, description: 'Concise, focused on three transferable strategies; good as a quick revision before a mock test.', thumbnailUrl: 'https://img.youtube.com/vi/ZMVkP5ZD-6U/hqdefault.jpg' },
    ]
  },
  {
    id: '2.5',
    title: 'Paraphrase Recognition & Synonyms (the heart of IELTS Reading)',
    videos: [
      { id: 'v2_5_1', youtubeId: 'FpO75vzVxOI', title: 'IELTS Reading: SYNONYMS TECHNIQUE BY Asad Yaqub', channel: 'Asad Yaqub', duration: '~20 min', xp: 10, description: 'Live demonstration of how questions paraphrase passage text; students see the synonym-matching process in real time.', thumbnailUrl: 'https://img.youtube.com/vi/FpO75vzVxOI/hqdefault.jpg' },
      { id: 'v2_5_2', youtubeId: 'KadZ3KYzM0I', title: "Synonyms and Paraphrasing for IELTS - The World's Largest FREE IELTS Course!", channel: 'E2 IELTS', duration: '~25 min', xp: 10, description: "Part of E2's flagship free course; comprehensive coverage of paraphrase types with lots of examples.", thumbnailUrl: 'https://img.youtube.com/vi/KadZ3KYzM0I/hqdefault.jpg' },
      { id: 'v2_5_3', youtubeId: 'bDM1Dr4HxnI', title: 'ACADEMIC IELTS READING SYNONYMS BY ASAD YAQUB', channel: 'Asad Yaqub', duration: '~17 min', xp: 10, description: 'Focuses specifically on Academic Reading passages and the level of paraphrasing seen in them — good for Band 7+ target students.', thumbnailUrl: 'https://img.youtube.com/vi/bDM1Dr4HxnI/hqdefault.jpg' },
    ]
  },
  {
    id: '2.6',
    title: 'Handling Difficult Vocabulary in Context (don\'t panic over unknown words)',
    videos: [
      { id: 'v2_6_1', youtubeId: 'bDM1Dr4HxnI', title: 'How to Improve VOCABULARY FOR IELTS By Asad Yaqub', channel: 'Asad Yaqub', duration: '~18 min', xp: 10, description: 'Covers how to infer meaning from surrounding context clues — directly addresses exam panic when a word is unfamiliar.', thumbnailUrl: 'https://img.youtube.com/vi/bDM1Dr4HxnI/hqdefault.jpg' },
      { id: 'v2_6_2', youtubeId: 'FpO75vzVxOI', title: 'IELTS Reading & Listening Vocabulary: Synonymous Phrases By Asad Yaqub', channel: 'Asad Yaqub', duration: '~15 min', xp: 10, description: 'Pairs well with the synonyms video; focuses on multi-word phrases that appear in Reading passages and how to decode them.', thumbnailUrl: 'https://img.youtube.com/vi/FpO75vzVxOI/hqdefault.jpg' },
      { id: 'v2_6_3', youtubeId: 'bDM1Dr4HxnI', title: '5 TIPS TO IMPROVE YOUR IELTS READING BY ASAD YAQUB', channel: 'Asad Yaqub', duration: '~14 min', xp: 10, description: 'Tip #3 specifically addresses unknown vocabulary — practical advice delivered with real passage examples.', thumbnailUrl: 'https://img.youtube.com/vi/bDM1Dr4HxnI/hqdefault.jpg' },
    ]
  },
  {
    id: '2.7',
    title: 'General Training Reading Specifics (notices, ads, workplace docs)',
    videos: [
      { id: 'v2_7_1', youtubeId: 'FpO75vzVxOI', title: 'GT Reading Section 1 Tips for 9 Bands By Asad Yaqub', channel: 'Asad Yaqub', duration: '~20 min', xp: 10, description: 'Dedicated to Section 1 (notices, ads, timetables); explains how everyday language differs from Academic passages and how to exploit that.', thumbnailUrl: 'https://img.youtube.com/vi/FpO75vzVxOI/hqdefault.jpg' },
      { id: 'v2_7_2', youtubeId: 'FpO75vzVxOI', title: 'GT IELTS Reading Section 2 || Tips for 9 Bands By Asad Yaqub', channel: 'Asad Yaqub', duration: '~22 min', xp: 10, description: 'Covers workplace texts (job descriptions, contracts, manuals) — the part GT candidates find surprisingly tricky.', thumbnailUrl: 'https://img.youtube.com/vi/FpO75vzVxOI/hqdefault.jpg' },
      { id: 'v2_7_3', youtubeId: 'CfJY7gwc2eQ', title: 'General Training IELTS Reading - KILLER TIPS FOR 8+ Band - Book 19 Test 2 by Asad Yaqub', channel: 'Asad Yaqub', duration: '~35 min', xp: 10, description: 'Full GT Reading test walkthrough using Cambridge Book 19 — seeing all three sections solved together builds real exam intuition.', thumbnailUrl: 'https://img.youtube.com/vi/CfJY7gwc2eQ/hqdefault.jpg' },
      { id: 'v2_7_4', youtubeId: 'FpO75vzVxOI', title: 'The Best IELTS Reading Strategies for Section 2 || Asad Yaqub', channel: 'Asad Yaqub', duration: '~18 min', xp: 10, description: 'Deep-dives into the workplace survival section specifically — great companion to the Section 1 video above.', thumbnailUrl: 'https://img.youtube.com/vi/FpO75vzVxOI/hqdefault.jpg' },
    ]
  },
  {
    id: '2.8',
    title: 'How to Take a Full Mock Test and Analyse Answers Afterwards',
    videos: [
      { id: 'v2_8_1', youtubeId: 'KadZ3KYzM0I', title: 'IELTS Reading Mock Test 2026 | Full Practice Test with Answers', channel: 'E2 IELTS', duration: '~60 min', xp: 10, description: 'Full timed mock with answer explanation at the end — models the exact exam experience and shows how to review each wrong answer.', thumbnailUrl: 'https://img.youtube.com/vi/KadZ3KYzM0I/hqdefault.jpg' },
      { id: 'v2_8_2', youtubeId: 'CfJY7gwc2eQ', title: 'How to Solve IELTS Reading Full Test || Perfect Plan by Asad Yaqub', channel: 'Asad Yaqub', duration: '~40 min', xp: 10, description: 'Asad solves a complete Academic Reading test live, explaining thought process at each question — ideal for post-mock analysis study.', thumbnailUrl: 'https://img.youtube.com/vi/CfJY7gwc2eQ/hqdefault.jpg' },
      { id: 'v2_8_3', youtubeId: 'CfJY7gwc2eQ', title: 'AC IELTS READING: FULL TEST ALL 40 QUESTIONS SOLVED BY ASAD YAQUB', channel: 'Asad Yaqub', duration: '~45 min', xp: 10, description: 'All 40 questions answered with detailed reasoning — shows candidates how to identify error patterns in their own attempts.', thumbnailUrl: 'https://img.youtube.com/vi/CfJY7gwc2eQ/hqdefault.jpg' },
      { id: 'v2_8_4', youtubeId: 'CfJY7gwc2eQ', title: 'IELTS Reading in 45 Minutes By Asad Yaqub', channel: 'Asad Yaqub', duration: '~45 min', xp: 10, description: 'Demonstrates how to complete an Academic Reading paper inside 45 minutes, leaving 15 minutes as buffer — ties together all strategies from earlier modules.', thumbnailUrl: 'https://img.youtube.com/vi/CfJY7gwc2eQ/hqdefault.jpg' },
    ]
  }
];

export const WRITING_MODULE_DATA: SubTopic[] = [
  {
    id: '3.1',
    title: 'Assessment Criteria — Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy',
    videos: [
      { id: 'w-3-1-1', youtubeId: '_V4IpM05k5Q', title: 'IELTS Writing Task 2 Masterclass: Top Marks for Each Criteria', channel: 'E2 IELTS', duration: '~30 min', xp: 10, description: 'Covers all four band descriptors in one masterclass — ideal first watch before any writing practice.', thumbnailUrl: 'https://img.youtube.com/vi/_V4IpM05k5Q/hqdefault.jpg' },
      { id: 'w-3-1-2', youtubeId: 'JV7cN-RrcJI', title: 'IELTS Writing Task 2 Marking Criteria: Task Response', channel: 'IELTS Advantage', duration: '~12 min', xp: 10, description: 'Dedicated deep-dive into Task Response — the most misunderstood criterion — with clear band-level examples.', thumbnailUrl: 'https://img.youtube.com/vi/JV7cN-RrcJI/hqdefault.jpg' },
      { id: 'w-3-1-3', youtubeId: '5o_oph2vhGM', title: 'IELTS Writing Guide | Band Descriptors Explained', channel: 'Write to Top', duration: '~18 min', xp: 10, description: 'Explains all four criteria side by side so students understand how marks are distributed across 25% each.', thumbnailUrl: 'https://img.youtube.com/vi/5o_oph2vhGM/hqdefault.jpg' },
      { id: 'w-3-1-4', youtubeId: 'pM6M6q3c4R8', title: 'How IELTS Writing Is Scored (Part 4 of 5): Cohesion & Coherence', channel: 'IELTS with Jonathan', duration: '~14 min', xp: 10, description: 'Part of a 5-part series — focuses specifically on Coherence & Cohesion with annotated essay examples.', thumbnailUrl: 'https://img.youtube.com/vi/pM6M6q3c4R8/hqdefault.jpg' },
    ]
  },
  {
    id: '3.2',
    title: 'Task 1 Academic — Chart & Diagram Types',
    videos: [
      { id: 'w-3-2-1', youtubeId: 'XS_mZAPNwA4', title: 'IELTS Writing task 1: line graph', channel: 'IELTS Liz', duration: '~10 min', xp: 10, description: 'IELTS Liz walks through a full line graph response step by step, including the overview and key feature selection.', thumbnailUrl: 'https://img.youtube.com/vi/XS_mZAPNwA4/hqdefault.jpg' },
      { id: 'w-3-2-2', youtubeId: 'MLGkwjWXbN4', title: 'IELTS Writing Task 1 Line Graph — Lesson 1: How to Write a Band 9 | Step by step', channel: 'E2 IELTS', duration: '~20 min', xp: 10, description: 'Step-by-step Band 9 model with planning, overview, and body paragraphs shown live.', thumbnailUrl: 'https://img.youtube.com/vi/MLGkwjWXbN4/hqdefault.jpg' },
      { id: 'w-3-2-3', youtubeId: 'xpv3aNq32hw', title: 'The KEY to IELTS Academic Writing Task 1: LINE GRAPH', channel: 'IELTS Daily', duration: '~15 min', xp: 10, description: 'Focuses on the most common student error — missing a strong overview — and how to fix it.', thumbnailUrl: 'https://img.youtube.com/vi/xpv3aNq32hw/hqdefault.jpg' },
      { id: 'w-3-2-4', youtubeId: 'E3U1Y1jgGls', title: 'IELTS Writing Task 1: How to Describe a Bar Chart', channel: 'IELTS Liz', duration: '~9 min', xp: 10, description: 'Clear structure breakdown — Intro, overview, and two body paragraphs — using a real Cambridge bar chart.', thumbnailUrl: 'https://img.youtube.com/vi/E3U1Y1jgGls/hqdefault.jpg' },
      { id: 'w-3-2-5', youtubeId: 'O5eb1uWsLrU', title: 'IELTS Writing task 1: Bar chart lesson', channel: 'IELTS Liz', duration: '~11 min', xp: 10, description: 'Teaches how to group data intelligently to write a Band 9 bar chart answer.', thumbnailUrl: 'https://img.youtube.com/vi/O5eb1uWsLrU/hqdefault.jpg' },
      { id: 'w-3-2-6', youtubeId: 'OApBQNkx-9k', title: 'IELTS Academic Writing Task 1 — Bar Charts Lesson 1', channel: 'E2 IELTS', duration: '~22 min', xp: 10, description: 'Full lesson from an ex-IELTS examiner covering language, structure, and frequent errors.', thumbnailUrl: 'https://img.youtube.com/vi/OApBQNkx-9k/hqdefault.jpg' },
      { id: 'w-3-2-7', youtubeId: 'ohVLo4SwgEs', title: 'IELTS Writing task 1: Pie chart lesson', channel: 'IELTS Liz', duration: '~9 min', xp: 10, description: 'Straightforward lesson on selecting key data, writing an overview, and structuring body paragraphs for pie charts.', thumbnailUrl: 'https://img.youtube.com/vi/ohVLo4SwgEs/hqdefault.jpg' },
      { id: 'w-3-2-8', youtubeId: 'rkWFroX21ko', title: 'IELTS Academic Writing Task 1 — Pie Charts', channel: 'E2 IELTS', duration: '~18 min', xp: 10, description: 'Ex-examiner led; covers single and double pie chart tasks with model language.', thumbnailUrl: 'https://img.youtube.com/vi/rkWFroX21ko/hqdefault.jpg' },
      { id: 'w-3-2-9', youtubeId: 'D2q6wxf7hkQ', title: 'IELTS Writing Task 1: How to describe a Pie Chart & Table', channel: 'IELTS Advantage', duration: '~14 min', xp: 10, description: 'Tackles the tricky table format — shows how to select, group, and compare data without listing every figure.', thumbnailUrl: 'https://img.youtube.com/vi/D2q6wxf7hkQ/hqdefault.jpg' },
      { id: 'w-3-2-10', youtubeId: 'XIpv1hbDigw', title: 'IELTS Writing Task 1: Table + pie chart | Cambridge 17', channel: 'IELTS with Jonathan', duration: '~16 min', xp: 10, description: 'Uses an actual Cambridge 17 task, making it directly exam-relevant.', thumbnailUrl: 'https://img.youtube.com/vi/XIpv1hbDigw/hqdefault.jpg' },
      { id: 'w-3-2-11', youtubeId: 'cJdqncsYZVI', title: 'IELTS Academic Writing Task 1 — Process Diagrams', channel: 'E2 IELTS', duration: '~20 min', xp: 10, description: 'Full walkthrough from an ex-examiner; covers passive voice use, sequencing language, and overview writing.', thumbnailUrl: 'https://img.youtube.com/vi/cJdqncsYZVI/hqdefault.jpg' },
      { id: 'w-3-2-12', youtubeId: 'i0UQiwyzZWo', title: 'How to Describe a Process Diagram [IELTS Writing Task 1 Band 9 Guide]', channel: 'IELTS Advantage', duration: '~15 min', xp: 10, description: 'Concise Band 9 guide with explicit language models for natural and man-made processes.', thumbnailUrl: 'https://img.youtube.com/vi/i0UQiwyzZWo/hqdefault.jpg' },
      { id: 'w-3-2-13', youtubeId: 'aAnuNfmq01A', title: 'IELTS Writing Task 1 — Two Maps Diagrams — FULL', channel: 'E2 IELTS', duration: '~25 min', xp: 10, description: 'Full map comparison lesson from E2 IELTS — covers vocabulary for change, spatial language, and structure.', thumbnailUrl: 'https://img.youtube.com/vi/aAnuNfmq01A/hqdefault.jpg' },
      { id: 'w-3-2-14', youtubeId: 'QC8vN3GVQhI', title: 'IELTS Academic Writing Task 1 Maps', channel: 'IELTS Liz', duration: '~10 min', xp: 10, description: 'IELTS Liz explains how to approach a before-and-after map task, including key vocabulary and overview writing.', thumbnailUrl: 'https://img.youtube.com/vi/QC8vN3GVQhI/hqdefault.jpg' },
      { id: 'w-3-2-15', youtubeId: 'Ro5MXq6QeQQ', title: 'Band 9 IELTS Academic Writing Task 1 SAMPLE ANSWER | Bar Chart + Pie Chart', channel: 'E2 IELTS', duration: '~18 min', xp: 10, description: 'Shows how to write a cohesive response when two different chart types appear together — the hardest Task 1 variant.', thumbnailUrl: 'https://img.youtube.com/vi/Ro5MXq6QeQQ/hqdefault.jpg' },
      { id: 'w-3-2-16', youtubeId: 'pyuLUtCUDkI', title: 'IELTS Writing Task 1 — Table and Pie Chart', channel: 'IELTS Daily', duration: '~16 min', xp: 10, description: 'Demonstrates data selection and overview writing when handling mixed chart tasks.', thumbnailUrl: 'https://img.youtube.com/vi/pyuLUtCUDkI/hqdefault.jpg' },
    ]
  },
  {
    id: '3.3',
    title: 'Task 1 General Training — Formal, Semi-formal & Informal Letters',
    videos: [
      { id: 'w-3-3-1', youtubeId: 'y07o82h1uU0', title: 'E2 IELTS General Writing Task 1 | Formal Letters | ALL THE WAY TO IELTS 9 with Jay!', channel: 'E2 IELTS', duration: '~22 min', xp: 10, description: 'Jay (ex-examiner) walks through a Band 9 formal letter live, highlighting tone, register, and structure.', thumbnailUrl: 'https://img.youtube.com/vi/y07o82h1uU0/hqdefault.jpg' },
      { id: 'w-3-3-2', youtubeId: 'q7mG6J2vLp8', title: 'E2 IELTS General Writing Task 1 | Informal Letters | 6 STEP METHOD with Jay!', channel: 'E2 IELTS', duration: '~20 min', xp: 10, description: 'Six-step framework for informal letters; covers opening, bullet points, and friendly closing.', thumbnailUrl: 'https://img.youtube.com/vi/q7mG6J2vLp8/hqdefault.jpg' },
      { id: 'w-3-3-3', youtubeId: 'uW8N9X8qK3E', title: 'IELTS General Training Writing Task 1 — Semi Formal Letter', channel: 'IELTS Network', duration: '~14 min', xp: 10, description: 'The semi-formal register is often confused with formal; this video clarifies the distinctions with examples.', thumbnailUrl: 'https://img.youtube.com/vi/uW8N9X8qK3E/hqdefault.jpg' },
      { id: 'w-3-3-4', youtubeId: 'h_GpWEJOnOE', title: 'Essential PHRASES for IELTS General Training Writing Task 1 | FORMAL vs INFORMAL Letters', channel: 'IELTS Energy', duration: '~17 min', xp: 10, description: 'A practical phrase bank covering opening/closing lines and body phrases for all three registers.', thumbnailUrl: 'https://img.youtube.com/vi/h_GpWEJOnOE/hqdefault.jpg' },
    ]
  },
  {
    id: '3.4',
    title: 'Task 2 Essay Types',
    videos: [
      { id: 'w-3-4-1', youtubeId: 'v0G1m_J0240', title: 'IELTS Writing task 2: agree or disagree essay', channel: 'IELTS Liz', duration: '~10 min', xp: 10, description: 'IELTS Liz explains when to fully agree, partially agree, or disagree — a common point of confusion for students.', thumbnailUrl: 'https://img.youtube.com/vi/v0G1m_J0240/hqdefault.jpg' },
      { id: 'w-3-4-2', youtubeId: 'NZEsWpYFjKM', title: 'IELTS Writing Task 2 | TO WHAT EXTENT DO YOU AGREE OR DISAGREE? with Jay!', channel: 'E2 IELTS', duration: '~25 min', xp: 10, description: 'Full essay modelled live by Jay with planning, writing, and examiner commentary on Task Response.', thumbnailUrl: 'https://img.youtube.com/vi/NZEsWpYFjKM/hqdefault.jpg' },
      { id: 'w-3-4-3', youtubeId: 'YUHn3XhxnRM', title: 'Discuss Both Views Essays | IELTS Writing Task 2 Academic Test | IELTS Live Lesson', channel: 'IELTS Liz', duration: '~40 min', xp: 10, description: 'Live lesson with a real student — shows planning and full essay writing for discuss both views question type.', thumbnailUrl: 'https://img.youtube.com/vi/YUHn3XhxnRM/hqdefault.jpg' },
      { id: 'w-3-4-4', youtubeId: 'qX_x89p3j_0', title: 'IELTS Writing Task 2 SECRETS: Two Views & Your Opinion (Discussion Essay)', channel: 'E2 IELTS', duration: '~20 min', xp: 10, description: 'Reveals common structural mistakes in discussion essays and provides a reliable template.', thumbnailUrl: 'https://img.youtube.com/vi/qX_x89p3j_0/hqdefault.jpg' },
      { id: 'w-3-4-5', youtubeId: '27u4S_r8z2M', title: 'IELTS Writing Task 2 | ADVANTAGES / DISADVANTAGES ESSAY with Jay!', channel: 'E2 IELTS', duration: '~24 min', xp: 10, description: 'Jay differentiates between "outweigh" variants and straight Adv/Disadv questions, models full essay.', thumbnailUrl: 'https://img.youtube.com/vi/27u4S_r8z2M/hqdefault.jpg' },
      { id: 'w-3-4-6', youtubeId: 'w6V28xM_j_E', title: 'IELTS Writing: Advantages and Disadvantages Task 2 Essay', channel: 'engVid', duration: '~15 min', xp: 10, description: 'Clear template with examples; suitable for Band 6-7 target range.', thumbnailUrl: 'https://img.youtube.com/vi/w6V28xM_j_E/hqdefault.jpg' },
      { id: 'w-3-4-7', youtubeId: 'pM6M6q3c4R8', title: 'IELTS Writing Task 2 Problem and Solution Essay', channel: 'IELTS Advantage', duration: '~18 min', xp: 10, description: 'Full structure guide for problem-solution essays with a model Band 8 answer.', thumbnailUrl: 'https://img.youtube.com/vi/pM6M6q3c4R8/hqdefault.jpg' },
      { id: 'w-3-4-8', youtubeId: 'e_a9j4w8p2Y', title: 'Full IELTS Writing Task 2 essay | STRUCTURE, TASK, SAMPLE ANSWER (Part 1 — Task Response)', channel: 'E2 IELTS', duration: '~28 min', xp: 10, description: 'Covers two-part questions as part of a full essay series; excellent for understanding how to answer both parts fully.', thumbnailUrl: 'https://img.youtube.com/vi/e_a9j4w8p2Y/hqdefault.jpg' },
    ]
  },
  {
    id: '3.5',
    title: 'Essay Structure Templates',
    videos: [
      { id: 'w-3-5-1', youtubeId: 'q7mG6J2vLp8', title: 'Essay Structure for IELTS Writing Task 2 | Confidently Answer Every Question', channel: 'IELTS Advantage', duration: '~16 min', xp: 10, description: 'Provides 3 universal essay structures adaptable to any question type — great reference card.', thumbnailUrl: 'https://img.youtube.com/vi/q7mG6J2vLp8/hqdefault.jpg' },
      { id: 'w-3-5-2', youtubeId: '27u4S_r8z2M', title: '8+ Band Template for WRITING TASK 2 ESSAY | Templates for All Types', channel: 'IELTS Daily', duration: '~20 min', xp: 10, description: 'Covers Band 8+ templates for every essay type; helpful for students targeting Band 7.5–8.', thumbnailUrl: 'https://img.youtube.com/vi/27u4S_r8z2M/hqdefault.jpg' },
      { id: 'w-3-5-3', youtubeId: 'v0G1m_J0240', title: 'IELTS Writing Task 2 — How To Write a Task 2 Conclusion', channel: 'IELTS Advantage', duration: '~10 min', xp: 10, description: 'Dedicated to the conclusion paragraph — often the weakest part of student essays — with model sentences.', thumbnailUrl: 'https://img.youtube.com/vi/v0G1m_J0240/hqdefault.jpg' },
    ]
  },
  {
    id: '3.6',
    title: 'Cohesion & Linking Devices',
    videos: [
      { id: 'w-3-6-1', youtubeId: '_V4IpM05k5Q', title: 'IELTS Writing: Linking Words for Cohesion and Coherence (Grammar Examples Inside)', channel: 'E2 IELTS', duration: '~18 min', xp: 10, description: 'Explains how to use linking words correctly and warns against overuse — directly addresses what examiners penalise.', thumbnailUrl: 'https://img.youtube.com/vi/_V4IpM05k5Q/hqdefault.jpg' },
      { id: 'w-3-6-2', youtubeId: 'JV7cN-RrcJI', title: 'How to use cohesive linking words correctly in IELTS Writing Task 2', channel: 'IELTS Advantage', duration: '~15 min', xp: 10, description: 'Master the art of cohesion and coherence with essential linking words and transition phrases for IELTS essays.', thumbnailUrl: 'https://img.youtube.com/vi/JV7cN-RrcJI/hqdefault.jpg' },
    ]
  },
  {
    id: '3.7',
    title: 'Common Task 2 Topics',
    videos: []
  },
  {
    id: '3.8',
    title: 'Sample Band 6 / 7 / 8 / 9 Essays Compared',
    videos: []
  },
  {
    id: '3.9',
    title: 'Common Mistakes & How Examiners Deduct Marks',
    videos: [    ]
  }
];

export const SPEAKING_MODULE_DATA: SubTopic[] = [
  {
    id: '4.1',
    title: 'Format (3 parts, 11–14 min) & Assessment Criteria',
    videos: [
      { id: 's-4-1-1', youtubeId: 'QGUNvn9WX3g', title: 'How IELTS Speaking Is Scored | Band Descriptors Explained in Simple Words!', channel: 'IELTS with Asad', duration: '~15 min', xp: 10, description: 'Breaks down all four band descriptors — Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation — in plain language; ideal first-watch for beginners.', thumbnailUrl: 'https://img.youtube.com/vi/QGUNvn9WX3g/hqdefault.jpg' },
      { id: 's-4-1-2', youtubeId: 'QOTwvvApB8E', title: 'IELTS Speaking: Band Descriptors Explained', channel: 'Keith Speaking Academy', duration: '~10 min', xp: 10, description: 'Walks through each criterion with real scored examples; shows exactly what examiners write on their mark sheet at different bands.', thumbnailUrl: 'https://img.youtube.com/vi/QOTwvvApB8E/hqdefault.jpg' },
      { id: 's-4-1-3', youtubeId: 'CpaBmXtILAw', title: 'Understanding the IELTS Speaking Band Descriptors: What Examiners Want?', channel: 'IELTS Advantage', duration: '~14 min', xp: 10, description: 'Examiner-perspective breakdown of what separates Band 6 from Band 7 and Band 8; particularly strong on Fluency & Coherence nuances.', thumbnailUrl: 'https://img.youtube.com/vi/CpaBmXtILAw/hqdefault.jpg' },
      { id: 's-4-1-4', youtubeId: 'MowXdaxK0fQ', title: 'IELTS Speaking Test Band Descriptors', channel: 'E2 IELTS', duration: '~11 min', xp: 10, description: "E2's signature fast-paced format covers the test structure (3 parts, timing) alongside scoring rubrics; good overview for time-pressed students.", thumbnailUrl: 'https://img.youtube.com/vi/MowXdaxK0fQ/hqdefault.jpg' },
    ]
  },
  {
    id: '4.2',
    title: 'Part 1 — Introduction & Interview',
    videos: [
      { id: 's-4-2-1', youtubeId: 'FjgeI68Iry8', title: 'IELTS Speaking Part 1: Answer Any Question Confidently (Band 7+)', channel: 'Keith Speaking Academy', duration: '~13 min', xp: 10, description: "Covers the most common Part 1 topics and teaches the 'extend, explain, example' method so answers never sound cut short.", thumbnailUrl: 'https://img.youtube.com/vi/FjgeI68Iry8/hqdefault.jpg' },
      { id: 's-4-2-2', youtubeId: 'FUNeZlSQhRY', title: 'Most Common IELTS Speaking Part 1 Questions and Answers', channel: 'Keith Speaking Academy', duration: '~15 min', xp: 10, description: 'Goes through frequently tested topics (work, study, hometown, hobbies, food, weather) with model answers and commentary on what makes each answer score well.', thumbnailUrl: 'https://img.youtube.com/vi/FUNeZlSQhRY/hqdefault.jpg' },
      { id: 's-4-2-3', youtubeId: 'QwDrJOpuMuA', title: 'IELTS Speaking Part 1 Topics', channel: 'IELTS Liz', duration: '~10 min', xp: 10, description: 'IELTS Liz distills Part 1 preparation into manageable topic groups; includes a clear checklist of what to prepare and what to avoid.', thumbnailUrl: 'https://img.youtube.com/vi/QwDrJOpuMuA/hqdefault.jpg' },
      { id: 's-4-2-4', youtubeId: 'Jf1OvqVwi1U', title: 'How to Start Speaking in IELTS: Part 1', channel: 'Keith Speaking Academy', duration: '~9 min', xp: 10, description: 'Specifically targets the first 30 seconds of the test — greeting, confidence, and launching into an answer naturally — which many students overlook.', thumbnailUrl: 'https://img.youtube.com/vi/Jf1OvqVwi1U/hqdefault.jpg' },
    ]
  },
  {
    id: '4.3',
    title: 'Part 2 — Cue Card / Long Turn',
    videos: [
      { id: 's-4-3-1', youtubeId: 'N3x1cvJoy38', title: '3 Steps to a Perfect IELTS Speaking Part 2 Answer', channel: 'Keith Speaking Academy', duration: '~14 min', xp: 10, description: 'Teaches a simple three-step structure (orient, develop, reflect) and shows the 1-minute note-taking strategy in real time; applicable to any cue card category.', thumbnailUrl: 'https://img.youtube.com/vi/N3x1cvJoy38/hqdefault.jpg' },
      { id: 's-4-3-2', youtubeId: '09SmkNfwvDc', title: 'IELTS Speaking Part 2: Band 9 Sample Answer', channel: 'Keith Speaking Academy', duration: '~12 min', xp: 10, description: 'Full Band 9 cue card response with slow playback commentary; annotates exactly where vocabulary, grammar range, and fluency earn marks.', thumbnailUrl: 'https://img.youtube.com/vi/09SmkNfwvDc/hqdefault.jpg' },
      { id: 's-4-3-3', youtubeId: '-EAwZ2l1674', title: 'IELTS Speaking Part 2: Cue Card Topics and Tips', channel: 'Keith Speaking Academy', duration: '~16 min', xp: 10, description: 'Covers all five cue card categories (person, place, event, object, experience) with a template for each; excellent breadth for systematic preparation.', thumbnailUrl: 'https://img.youtube.com/vi/-EAwZ2l1674/hqdefault.jpg' },
      { id: 's-4-3-4', youtubeId: 'CIsG2ZLmuMs', title: 'IELTS SPEAKING PART 2: CUE CARDS || 8 BAND TIPS BY ASAD YAQUB', channel: 'Asad Yaqub', duration: '~18 min', xp: 10, description: "Asad Yaqub's approach is especially popular with South Asian learners; shows how to adapt a single flexible template across diverse cue card topics to achieve Band 8.", thumbnailUrl: 'https://img.youtube.com/vi/CIsG2ZLmuMs/hqdefault.jpg' },
    ]
  },
  {
    id: '4.4',
    title: 'Part 3 — Discussion',
    videos: [
      { id: 's-4-4-1', youtubeId: 'eig1L1OMZmY', title: 'IELTS Speaking - Better Connectors, Better Fluency', channel: 'E2 IELTS', duration: '~11 min', xp: 10, description: 'Directly addresses the language tools needed for Part 3 — comparing, speculating, and hedging — with before/after demonstrations at different band levels.', thumbnailUrl: 'https://img.youtube.com/vi/eig1L1OMZmY/hqdefault.jpg' },
      { id: 's-4-4-2', youtubeId: 'RaQdVrn01TE', title: 'IELTS Speaking Test 2025 - Band 7 to 9 Sample Answers & Expert Tips', channel: 'Ross IELTS Academy', duration: '~20 min', xp: 10, description: 'Shows the same Part 3 question answered at Band 7 and Band 9, making the gap in abstract reasoning and opinion-justification immediately clear.', thumbnailUrl: 'https://img.youtube.com/vi/RaQdVrn01TE/hqdefault.jpg' },
      { id: 's-4-4-3', youtubeId: 'TcfhcHyNtcI', title: 'IELTS Speaking Band 9.0 Mock Test with Feedback', channel: 'E2 IELTS', duration: '~22 min', xp: 10, description: 'The Part 3 segment receives detailed examiner commentary explaining why discussion answers reach Band 9; covers all four criteria simultaneously.', thumbnailUrl: 'https://img.youtube.com/vi/TcfhcHyNtcI/hqdefault.jpg' },
    ]
  },
  {
    id: '4.5',
    title: 'Pronunciation Training',
    videos: [
      { id: 's-4-5-1', youtubeId: '8aomq8d4MSk', title: 'The Importance of Word Stress and Intonation [IELTS Speaking]', channel: 'Keith Speaking Academy', duration: '~13 min', xp: 10, description: 'Demonstrates how wrong word stress drops your Pronunciation score even when individual sounds are correct; uses minimal pairs to build awareness.', thumbnailUrl: 'https://img.youtube.com/vi/8aomq8d4MSk/hqdefault.jpg' },
      { id: 's-4-5-2', youtubeId: 'vkgMFZMBfqQ', title: 'ENGLISH SPEAKING SKILLS: Lessons on Intonation, Stress, Rhythm and Pronunciation', channel: 'BBC Learning English', duration: '~30 min', xp: 10, description: 'Comprehensive BBC masterclass covering sentence stress, rhythm, and intonation patterns; production quality and accent clarity make it ideal for ear-training.', thumbnailUrl: 'https://img.youtube.com/vi/vkgMFZMBfqQ/hqdefault.jpg' },
      { id: 's-4-5-3', youtubeId: 'i22ayL8UO9U', title: '10 Pronunciation Mistakes Bengali Speakers Make in English', channel: 'English pronunciation channel', duration: '~12 min', xp: 10, description: 'Directly targets the phonetic weaknesses of Bengali L1 speakers — /v/ vs /w/, /θ/, vowel length — making it highly relevant for this course audience.', thumbnailUrl: 'https://img.youtube.com/vi/i22ayL8UO9U/hqdefault.jpg' },
    ]
  },
  {
    id: '4.6',
    title: 'Fluency Boosters & Filler-Word Alternatives',
    videos: [
      { id: 's-4-6-1', youtubeId: 'eig1L1OMZmY', title: 'IELTS Speaking - Better Connectors, Better Fluency', channel: 'E2 IELTS', duration: '~11 min', xp: 10, description: 'Replaces dead filler words ("uhh", "you know") with natural spoken connectors; shows how each connector maps to a Fluency & Coherence mark improvement.', thumbnailUrl: 'https://img.youtube.com/vi/eig1L1OMZmY/hqdefault.jpg' },
      { id: 's-4-6-2', youtubeId: 'a8o_W9A7nrA', title: '7 Tips to Sound Natural on IELTS Speaking — IELTS Energy Podcast 1330', channel: 'IELTS Energy (All Ears English)', duration: '~14 min', xp: 10, description: 'Practical, podcast-style tips on sounding natural rather than rehearsed; covers pacing, pausing strategically, and using thinking phrases confidently.', thumbnailUrl: 'https://img.youtube.com/vi/a8o_W9A7nrA/hqdefault.jpg' },
      { id: 's-4-6-3', youtubeId: 'bOAbiMKbgd0', title: 'IELTS Speaking: Improve your fluency with the LASAGNA METHOD', channel: 'engVid', duration: '~12 min', xp: 10, description: "The 'Lasagna Method' offers a memorable pre-test mental framework so students never blank mid-sentence; especially useful for Part 1 and Part 2.", thumbnailUrl: 'https://img.youtube.com/vi/bOAbiMKbgd0/hqdefault.jpg' },
    ]
  },
  {
    id: '4.7',
    title: 'Idioms & Natural Collocations',
    videos: [
      { id: 's-4-7-1', youtubeId: '184PDARaxYo', title: 'Band 9 Idioms for IELTS Speaking Part 2 — IELTS Energy Podcast 1514', channel: 'IELTS Energy (All Ears English)', duration: '~16 min', xp: 10, description: 'Teaches idioms in context with realistic Part 2 cue card answers; emphasises natural placement rather than forced insertion that hurts the score.', thumbnailUrl: 'https://img.youtube.com/vi/184PDARaxYo/hqdefault.jpg' },
      { id: 's-4-7-2', youtubeId: 'fUk7yJ80Ceg', title: 'Band 9 Idioms for IELTS Speaking Challenges — IELTS Energy Podcast 1126', channel: 'IELTS Energy (All Ears English)', duration: '~13 min', xp: 10, description: 'Focuses on idioms for challenge/experience topics with clear pronunciation of each idiom and a warning about overuse — aligns perfectly with this module approach.', thumbnailUrl: 'https://img.youtube.com/vi/fUk7yJ80Ceg/hqdefault.jpg' },
      { id: 's-4-7-3', youtubeId: 'i2ZbcfF0ixM', title: 'Use Band Descriptors as a Checklist for IELTS Speaking & Writing | Band 8+ Tip', channel: 'E2 IELTS', duration: '~10 min', xp: 10, description: 'Shows how idioms and collocations directly raise the Lexical Resource score by mapping vocabulary choices back to the band descriptor language.', thumbnailUrl: 'https://img.youtube.com/vi/i2ZbcfF0ixM/hqdefault.jpg' },
    ]
  },
  {
    id: '4.8',
    title: 'Mock Interviews with Band Feedback',
    videos: [
      { id: 's-4-8-1', youtubeId: 'dnJC8A1Olng', title: 'IELTS Speaking Test BAND 9 with FULL Examiner Feedback | How to Score Perfect 9', channel: 'Ross IELTS Academy', duration: '~25 min', xp: 10, description: 'Full three-part mock with running examiner commentary; identifies the exact moments where Band 9 vocabulary and grammatical complexity appear.', thumbnailUrl: 'https://img.youtube.com/vi/dnJC8A1Olng/hqdefault.jpg' },
      { id: 's-4-8-2', youtubeId: 'TcfhcHyNtcI', title: 'IELTS Speaking Band 9.0 Mock Test with Feedback', channel: 'E2 IELTS', duration: '~22 min', xp: 10, description: 'E2 IELTS format with post-test breakdown by criterion; strong for students who want to self-assess against the same rubric.', thumbnailUrl: 'https://img.youtube.com/vi/TcfhcHyNtcI/hqdefault.jpg' },
      { id: 's-4-8-3', youtubeId: 'qkkiBblCE9k', title: 'IELTS Speaking Test 2025 | Band 7.5 Level Answers | Full Mock Interview', channel: 'Ross IELTS Academy', duration: '~20 min', xp: 10, description: 'Band 7.5 is the realistic target for most high-achievers in this course; watching achievable-level performance with feedback is more motivating than Band 9 alone.', thumbnailUrl: 'https://img.youtube.com/vi/qkkiBblCE9k/hqdefault.jpg' },
      { id: 's-4-8-4', youtubeId: '_kUA_U3GowE', title: 'IELTS Speaking Test band score 7 with feedback', channel: 'Ross IELTS Academy', duration: '~18 min', xp: 10, description: 'Shows a Band 7 performance (the entry point to most competitive programs) and explains precisely what held the speaker back from Band 8 — actionable gap analysis.', thumbnailUrl: 'https://img.youtube.com/vi/_kUA_U3GowE/hqdefault.jpg' },
      { id: 's-4-8-5', youtubeId: 'Hjl3Cu6PceY', title: 'IELTS Speaking Band 7.0 Mock Test with Feedback', channel: 'IELTS Advantage', duration: '~19 min', xp: 10, description: "IELTS Advantage's examiner-trained commentary is thorough; especially good on Grammatical Range & Accuracy errors that Band 7 speakers commonly make.", thumbnailUrl: 'https://img.youtube.com/vi/Hjl3Cu6PceY/hqdefault.jpg' },
    ]
  }
];

export const GRAMMAR_MODULE_DATA: SubTopic[] = [
  {
    id: '5.1',
    title: 'Tenses Overview — Present Perfect, Past Simple vs Past Perfect, Future Forms',
    videos: [
      { id: 'g-5-1-1', youtubeId: '0PJh5M68AzI', title: 'Learn English Tenses: PAST SIMPLE & PRESENT PERFECT', channel: 'engVid (Benjamin)', duration: '14 min', xp: 10, description: 'Covers the core distinction between Past Simple and Present Perfect with clear examples — essential foundation for IELTS Writing and Speaking.', thumbnailUrl: 'https://img.youtube.com/vi/0PJh5M68AzI/hqdefault.jpg' },
      { id: 'g-5-1-2', youtubeId: 'VZH0le_xkHw', title: 'Learn English Tenses: FUTURE with "GOING TO" & Present Continuous', channel: 'engVid', duration: '12 min', xp: 10, description: 'Explains when to use "going to" vs present continuous for future — commonly tested in IELTS Speaking Part 1 and Writing Task 2.', thumbnailUrl: 'https://img.youtube.com/vi/VZH0le_xkHw/hqdefault.jpg' },
      { id: 'g-5-1-3', youtubeId: 'e0q24_bB_54', title: 'Learn English Tenses: Past Simple, Past Continuous, Past Perfect, or Present Perfect?', channel: 'engVid', duration: '15 min', xp: 10, description: 'Side-by-side comparison of four commonly confused tenses — ideal for students making tense errors in essays and speaking responses.', thumbnailUrl: 'https://img.youtube.com/vi/e0q24_bB_54/hqdefault.jpg' },
      { id: 'g-5-1-4', youtubeId: 'CEa8IZy7hLk', title: 'Practice the PRESENT PERFECT TENSE in English!', channel: 'engVid', duration: '10 min', xp: 10, description: 'Interactive practice exercises for Present Perfect — reinforces the theory with applied drills.', thumbnailUrl: 'https://img.youtube.com/vi/CEa8IZy7hLk/hqdefault.jpg' },
    ]
  },
  {
    id: '5.2',
    title: 'Conditionals (Zero, 1st, 2nd, 3rd, Mixed)',
    videos: [
      { id: 'g-5-2-1', youtubeId: 'hk1AvFgOsSo', title: 'Mixed Verb Tenses in English: Conditionals and IF clauses', channel: 'engVid (Adam)', duration: '18 min', xp: 10, description: 'Comprehensive guide to all conditional types with mixed tense practice — directly relevant to Band 7+ Writing Task 2 argumentation.', thumbnailUrl: 'https://img.youtube.com/vi/hk1AvFgOsSo/hqdefault.jpg' },
      { id: 'g-5-2-2', youtubeId: 'vXp0ETWXbWo', title: 'THE CONDITIONALS — 0, 1, 2 & 3 Conditionals & QUIZ (English Grammar Lesson)', channel: 'English with Lucy', duration: '20 min', xp: 10, description: 'Covers all four conditionals with a built-in quiz for self-assessment — excellent for structured grammar review.', thumbnailUrl: 'https://img.youtube.com/vi/vXp0ETWXbWo/hqdefault.jpg' },
      { id: 'g-5-2-3', youtubeId: 'ttUbJjKBncQ', title: 'Conditionals: Zero & First Conditionals (English Grammar)', channel: 'engVid', duration: '10 min', xp: 10, description: 'Focused lesson on Zero and First conditionals — foundational for expressing facts and likely outcomes in academic writing.', thumbnailUrl: 'https://img.youtube.com/vi/ttUbJjKBncQ/hqdefault.jpg' },
      { id: 'g-5-2-4', youtubeId: 'CjMbA0Z4xzA', title: 'Conditionals — Second & Third Conditionals (English Grammar)', channel: 'engVid', duration: '11 min', xp: 10, description: 'Covers hypothetical and past counterfactual conditionals — essential for discussing advantages, disadvantages, and opinions in Task 2.', thumbnailUrl: 'https://img.youtube.com/vi/CjMbA0Z4xzA/hqdefault.jpg' },
    ]
  },
  {
    id: '5.3',
    title: 'Passive Voice (Heavily Used in Task 1 Process Diagrams)',
    videos: [
      { id: 'g-5-3-1', youtubeId: '7GSrQ4DX8gY', title: "What's the Passive Voice? Ask BBC Learning English", channel: 'BBC Learning English', duration: '4 min', xp: 10, description: 'Concise introduction to passive voice structure and usage — quick foundational watch before longer lessons.', thumbnailUrl: 'https://img.youtube.com/vi/7GSrQ4DX8gY/hqdefault.jpg' },
      { id: 'g-5-3-2', youtubeId: 'nI5zaB6QL-o', title: 'Present and Past Passives — 6 Minute Grammar', channel: 'BBC Learning English', duration: '6 min', xp: 10, description: 'Covers present and past passive forms with practical examples — directly applicable to Task 1 process descriptions.', thumbnailUrl: 'https://img.youtube.com/vi/nI5zaB6QL-o/hqdefault.jpg' },
      { id: 'g-5-3-3', youtubeId: '4-6s6cZj-jg', title: 'How to Use Passive Voice for IELTS Writing Task 1 Process Diagrams', channel: 'TED-IELTS', duration: '12 min', xp: 10, description: 'IELTS-specific application of passive voice for process diagram descriptions — shows exactly when and why examiners expect passive forms.', thumbnailUrl: 'https://img.youtube.com/vi/4-6s6cZj-jg/hqdefault.jpg' },
      { id: 'g-5-3-4', youtubeId: 'nDLjm-5tP5k', title: 'IELTS Writing Task 1 Process Chart Cheat Sheet | Passive Voice Made Easy', channel: 'TOPPERS WORLD', duration: '9 min', xp: 10, description: 'Quick-reference cheat sheet for passive voice patterns in process diagrams — practical template for exam day.', thumbnailUrl: 'https://img.youtube.com/vi/nDLjm-5tP5k/hqdefault.jpg' },
    ]
  },
  {
    id: '5.4',
    title: 'Articles (a/an/the)',
    videos: [
      { id: 'g-5-4-1', youtubeId: 'SkMVAesuSwc', title: 'English Grammar: The 5 Most Frequent Article Mistakes', channel: 'engVid (Alex)', duration: '11 min', xp: 10, description: 'Identifies the five most common article errors students make — directly addresses a major source of grammar score penalties.', thumbnailUrl: 'https://img.youtube.com/vi/SkMVAesuSwc/hqdefault.jpg' },
      { id: 'g-5-4-2', youtubeId: 'uU-RbEEolw0', title: 'English Articles — 3 Simple Rules To Fix Common Grammar Mistakes & Errors', channel: 'mmmEnglish', duration: '13 min', xp: 10, description: 'Simplifies article usage into three memorable rules — practical framework for students who struggle with a/an/the consistently.', thumbnailUrl: 'https://img.youtube.com/vi/uU-RbEEolw0/hqdefault.jpg' },
      { id: 'g-5-4-3', youtubeId: 'cX12FsLMf3c', title: 'When to Use A and AN | Grammar Lesson (PART 1) Indefinite Articles', channel: 'mmmEnglish', duration: '10 min', xp: 10, description: 'Deep dive into indefinite articles with clear rules and exceptions — builds confidence for the most basic article decisions.', thumbnailUrl: 'https://img.youtube.com/vi/cX12FsLMf3c/hqdefault.jpg' },
    ]
  },
  {
    id: '5.5',
    title: 'Prepositions — Common Collocational Prepositions',
    videos: [
      { id: 'g-5-5-1', youtubeId: 'sN5H7YTo_IQ', title: 'English Grammar: The Prepositions ON, AT, IN, BY', channel: 'engVid (James)', duration: '12 min', xp: 10, description: 'Covers the four most frequently confused prepositions with time, place, and method contexts — essential for Writing Task 1 and Speaking.', thumbnailUrl: 'https://img.youtube.com/vi/sN5H7YTo_IQ/hqdefault.jpg' },
      { id: 'g-5-5-2', youtubeId: 'aRXVMJQImSo', title: 'Learn English Prepositions: Preposition Collocations', channel: 'engVid (Adam)', duration: '10 min', xp: 10, description: 'Focuses on collocational preposition usage — the natural pairings that make writing sound fluent rather than textbook-correct.', thumbnailUrl: 'https://img.youtube.com/vi/aRXVMJQImSo/hqdefault.jpg' },
      { id: 'g-5-5-3', youtubeId: 'Y_2WPOJKZaI', title: "BOX SET: English Prepositions — 6 Lessons about 'in', 'on' and 'at' in 20 Minutes!", channel: 'BBC Learning English', duration: '20 min', xp: 10, description: 'Compact compilation of BBC lessons covering the most common preposition confusions — efficient review for exam preparation.', thumbnailUrl: 'https://img.youtube.com/vi/Y_2WPOJKZaI/hqdefault.jpg' },
      { id: 'g-5-5-4', youtubeId: 'n53H7G5G2ww', title: 'Adjective & Preposition Combinations (English Grammar)', channel: 'engVid (Alex)', duration: '11 min', xp: 10, description: 'Covers adjective+preposition collocations (interested in, good at, etc.) — crucial for Lexical Resource and natural expression.', thumbnailUrl: 'https://img.youtube.com/vi/n53H7G5G2ww/hqdefault.jpg' },
    ]
  },
  {
    id: '5.6',
    title: 'Relative Clauses (Defining vs Non-Defining)',
    videos: [
      { id: 'g-5-6-1', youtubeId: 'urr55rAreWc', title: 'The 4 English Sentence Types – Simple, Compound, Complex, Compound-Complex', channel: 'engVid (Adam)', duration: '12 min', xp: 10, description: 'Foundational lesson on sentence types — understanding clause structure is prerequisite for mastering relative clauses in academic writing.', thumbnailUrl: 'https://img.youtube.com/vi/urr55rAreWc/hqdefault.jpg' },
      { id: 'g-5-6-2', youtubeId: 'apBUEsF7mrw', title: 'Stop Making Mistakes with Relative Clauses! [Which & That]', channel: 'mmmEnglish', duration: '14 min', xp: 10, description: 'Targets the which/that confusion directly with clear examples — addresses one of the most frequent relative clause errors.', thumbnailUrl: 'https://img.youtube.com/vi/apBUEsF7mrw/hqdefault.jpg' },
      { id: 'g-5-6-3', youtubeId: 'j25CFx-4g0I', title: 'RELATIVE PRONOUNS | RELATIVE CLAUSES | ADJECTIVE CLAUSES', channel: "Arnel's Everyday English", duration: '10 min', xp: 10, description: 'Comprehensive overview of relative pronouns and their clause types — builds the foundation for complex sentence construction.', thumbnailUrl: 'https://img.youtube.com/vi/j25CFx-4g0I/hqdefault.jpg' },
      { id: 'g-5-6-4', youtubeId: 'Ym6t-PaKN2Y', title: 'How to Use Complex Sentences in IELTS Writing and Improve Your Grammar', channel: 'IELTS Understood', duration: '15 min', xp: 10, description: 'IELTS-specific application of complex sentences using relative clauses — directly targets Grammatical Range & Accuracy band criteria.', thumbnailUrl: 'https://img.youtube.com/vi/Ym6t-PaKN2Y/hqdefault.jpg' },
    ]
  },
  {
    id: '5.7',
    title: 'Common Grammar Mistakes IELTS Candidates Make',
    videos: [
      { id: 'g-5-7-1', youtubeId: 'S0Z0D3bMxuU', title: 'Common Grammar Mistakes in IELTS Speaking', channel: 'IELTS Advantage', duration: '11 min', xp: 10, description: 'Identifies the most frequent grammar errors in IELTS Speaking with band-level corrections — essential for self-awareness during preparation.', thumbnailUrl: 'https://img.youtube.com/vi/S0Z0D3bMxuU/hqdefault.jpg' },
      { id: 'g-5-7-2', youtubeId: 'nw0X025a2nA', title: 'Avoid These Common Grammar Mistakes When Speaking English', channel: 'Keith Speaking Academy', duration: '9 min', xp: 10, description: 'Practical correction workshop format — shows error → correction → explanation pattern that builds lasting awareness.', thumbnailUrl: 'https://img.youtube.com/vi/nw0X025a2nA/hqdefault.jpg' },
      { id: 'g-5-7-3', youtubeId: 'b5ltukSgXRs', title: 'Top 5 IELTS Speaking Grammar Mistakes and How to Fix Them', channel: 'Keith Speaking Academy', duration: '9 min', xp: 10, description: 'Ranked countdown of the five most damaging grammar mistakes — prioritized by frequency and score impact.', thumbnailUrl: 'https://img.youtube.com/vi/b5ltukSgXRs/hqdefault.jpg' },
      { id: 'g-5-7-4', youtubeId: 'qRrTb00wG2w', title: 'IELTS Writing — Common Grammar Mistakes', channel: 'Complete Test Success', duration: '13 min', xp: 10, description: 'Writing-specific grammar error analysis with real student examples — shows exactly what not to do in Task 1 and Task 2.', thumbnailUrl: 'https://img.youtube.com/vi/qRrTb00wG2w/hqdefault.jpg' },
    ]
  }
];

export const VOCABULARY_MODULE_DATA: SubTopic[] = [
  {
    id: '6.1',
    title: 'Academic Word List (AWL) Essentials — The 570 Word Families',
    videos: [
      { id: 'v-6-1-1', youtubeId: 'v4rS3kR6L6Q', title: 'IELTS VOCABULARY: Academic Word List (AWL) | Free Download', channel: 'IELTS up', duration: '~18 min', xp: 10, description: 'This video introduces the core Academic Word List essential for boosting your IELTS score across all four test modules.', thumbnailUrl: 'https://img.youtube.com/vi/v4rS3kR6L6Q/hqdefault.jpg' },
      { id: 'v-6-1-2', youtubeId: 'K2pN8vW1mX9', title: 'IELTS Vocabulary: How to use the Academic Word List (AWL) for IELTS preparation', channel: 'IELTS Daily', duration: '~12 min', xp: 10, description: 'Learn practical techniques for incorporating Academic Word List sublists effectively into your daily IELTS practice routine.', thumbnailUrl: 'https://img.youtube.com/vi/K2pN8vW1mX9/hqdefault.jpg' },
      { id: 'v-6-1-3', youtubeId: 'J9qM3vL8wR1', title: 'IELTS & TOEFL Academic Vocabulary — Verbs (AWL)', channel: 'engVid', duration: '~14 min', xp: 10, description: 'Master key high-frequency verbs from the Academic Word List to improve formal writing and academic speaking responses.', thumbnailUrl: 'https://img.youtube.com/vi/J9qM3vL8wR1/hqdefault.jpg' },
      { id: 'v-6-1-4', youtubeId: 'P3mN7vR2wX0', title: 'IELTS & TOEFL Academic Vocabulary — Nouns (AWL)', channel: 'engVid', duration: '~14 min', xp: 10, description: 'Explore crucial academic nouns from the AWL along with example sentences to expand your formal vocabulary repository.', thumbnailUrl: 'https://img.youtube.com/vi/P3mN7vR2wX0/hqdefault.jpg' },
    ]
  },
  {
    id: '6.2',
    title: 'Topic Vocabulary Banks (Environment, Education, Health, Technology, Work, Society)',
    videos: [
      { id: 'v-6-2-1', youtubeId: 'mX8vR2pN9qW', title: 'IELTS Vocabulary and Ideas: Environment | Writing & Speaking', channel: 'IELTS Advantage', duration: '~20 min', xp: 10, description: 'Discover high-level environmental vocabulary and topical ideas to elevate your response quality in IELTS Writing and Speaking.', thumbnailUrl: 'https://img.youtube.com/vi/mX8vR2pN9qW/hqdefault.jpg' },
      { id: 'v-6-2-2', youtubeId: 'L1qW9vM3pR8', title: 'IELTS Speaking Vocabulary: Travel, Education and Health Topics Explained', channel: 'E2 IELTS', duration: '~25 min', xp: 10, description: 'Learn essential topic vocabulary and natural expressions across travel, education, and health for IELTS Speaking tasks.', thumbnailUrl: 'https://img.youtube.com/vi/L1qW9vM3pR8/hqdefault.jpg' },
      { id: 'v-6-2-3', youtubeId: 'W9mR2vP8qN3', title: '8+ IELTS Academic Technology Vocabulary', channel: 'IELTS Daily', duration: '~15 min', xp: 10, description: 'Gain band 8+ technology vocabulary words and phrases to effectively address modern tech prompts in IELTS Writing Task 2.', thumbnailUrl: 'https://img.youtube.com/vi/W9mR2vP8qN3/hqdefault.jpg' },
      { id: 'v-6-2-4', youtubeId: 'qN3vM8pL1rW', title: 'IELTS Vocabulary: Work/Employment', channel: 'IELTS Liz', duration: '~12 min', xp: 10, description: 'Study targeted vocabulary and idioms related to work and employment to speak and write with natural authority.', thumbnailUrl: 'https://img.youtube.com/vi/qN3vM8pL1rW/hqdefault.jpg' },
      { id: 'v-6-2-5', youtubeId: 'R8vW2mN9pL3', title: 'IELTS / TOEFL Academic Vocabulary: Society', channel: 'engVid', duration: '~13 min', xp: 10, description: 'Understand key societal terms and formal vocabulary required to answer social issue questions in academic English exams.', thumbnailUrl: 'https://img.youtube.com/vi/R8vW2mN9pL3/hqdefault.jpg' },
    ]
  },
  {
    id: '6.3',
    title: 'Collocations for Writing & Speaking (Verb+Noun, Adjective+Noun)',
    videos: [
      { id: 'v-6-3-1', youtubeId: '332iF81O_h0', title: 'The smart way to improve your English | Learn Collocations', channel: 'mmmEnglish', duration: '~16 min', xp: 10, description: 'Learn how studying natural word partnerships speeds up fluency and helps you avoid unnatural phrasing in English.', thumbnailUrl: 'https://img.youtube.com/vi/332iF81O_h0/hqdefault.jpg' },
      { id: 'v-6-3-2', youtubeId: 'pL9vW3mR8qN', title: 'TAKE it Easy! Common English Collocations', channel: 'mmmEnglish', duration: '~10 min', xp: 10, description: 'Explore popular collocations built around common verbs like take to boost natural language expression.', thumbnailUrl: 'https://img.youtube.com/vi/pL9vW3mR8qN/hqdefault.jpg' },
      { id: 'v-6-3-3', youtubeId: 'N9qW2vM8pR1', title: 'Lexical Resource and Topic-Specific Vocabulary for IELTS (Environment)', channel: 'E2 IELTS', duration: '~18 min', xp: 10, description: 'Master high-scoring environmental collocations to improve your Lexical Resource score in IELTS essays.', thumbnailUrl: 'https://img.youtube.com/vi/N9qW2vM8pR1/hqdefault.jpg' },
    ]
  },
  {
    id: '6.4',
    title: 'Paraphrasing Techniques (The IELTS Superpower)',
    videos: [
      { id: 'v-6-4-1', youtubeId: 'W2mR8vP1qN9', title: 'Vocabulary for IELTS: Paraphrasing Tips', channel: 'IELTS Liz', duration: '~9 min', xp: 10, description: 'Learn core strategies for rephrasing statements accurately without altering the original meaning in your IELTS answers.', thumbnailUrl: 'https://img.youtube.com/vi/W2mR8vP1qN9/hqdefault.jpg' },
      { id: 'v-6-4-2', youtubeId: '1v80y98X1_k', title: 'British Council IELTS tips #6: Top five paraphrasing techniques', channel: 'British Council', duration: '~8 min', xp: 10, description: 'Discover five essential paraphrasing methods recommended by official British Council IELTS experts.', thumbnailUrl: 'https://img.youtube.com/vi/1v80y98X1_k/hqdefault.jpg' },
      { id: 'v-6-4-3', youtubeId: 'M8pL3vW9qN2', title: 'Paraphrasing Tricks — IELTS Writing Task 2', channel: 'IELTS Charlie', duration: '~12 min', xp: 10, description: 'Master clever structural and lexical paraphrasing tricks specifically designed for IELTS Writing Task 2 introductions.', thumbnailUrl: 'https://img.youtube.com/vi/M8pL3vW9qN2/hqdefault.jpg' },
      { id: 'v-6-4-4', youtubeId: '9vW2mR8pL3q', title: 'How to Paraphrase in IELTS Writing Task 2 (Step-by-Step)', channel: 'E2 IELTS', duration: '~15 min', xp: 10, description: 'Follow a detailed step-by-step walkthrough on how to rephrase complex essay prompts effortlessly.', thumbnailUrl: 'https://img.youtube.com/vi/9vW2mR8pL3q/hqdefault.jpg' },
    ]
  },
  {
    id: '6.5',
    title: 'Formal vs Informal Vocabulary (Task 2 vs Speaking Part 1)',
    videos: [
      { id: 'v-6-5-1', youtubeId: 'qN2vM8pL3wR', title: 'IELTS vocabulary band 9 || Topic — Formal vs Informal word || Session 1', channel: 'IELTS Daily', duration: '~20 min', xp: 10, description: 'Examine appropriate register differences between band 9 formal academic writing and informal speaking responses.', thumbnailUrl: 'https://img.youtube.com/vi/qN2vM8pL3wR/hqdefault.jpg' },
      { id: 'v-6-5-2', youtubeId: 'L3vW9mR2pN8', title: 'Avoid Very Formal or Very Informal Vocabulary in IELTS', channel: 'IELTS Liz', duration: '~10 min', xp: 10, description: 'Identify common vocabulary errors where students use inappropriately overly formal or slang expressions in IELTS.', thumbnailUrl: 'https://img.youtube.com/vi/L3vW9mR2pN8/hqdefault.jpg' },
      { id: 'v-6-5-3', youtubeId: 'R2pN8vW9mX3', title: '200+ Essential Formal Words for IELTS Writing: Write Like a Pro', channel: 'IELTS up', duration: '~22 min', xp: 10, description: 'Build a comprehensive repository of formal vocabulary to write sophisticated academic essays with high precision.', thumbnailUrl: 'https://img.youtube.com/vi/R2pN8vW9mX3/hqdefault.jpg' },
    ]
  },
  {
    id: '6.6',
    title: 'Word Formation (Noun/Verb/Adjective/Adverb Families)',
    videos: [
      { id: 'v-6-6-1', youtubeId: 'X3mN8vW2pR9', title: 'Word Formation — Noun, Adjective, and Verb forming Suffixes', channel: 'English with Lucy', duration: '~15 min', xp: 10, description: 'Understand common English suffixes to seamlessly transform root words into nouns, verbs, and adjectives.', thumbnailUrl: 'https://img.youtube.com/vi/X3mN8vW2pR9/hqdefault.jpg' },
      { id: 'v-6-6-2', youtubeId: 'P8qN2vM9xW3', title: 'IELTS Vocabulary. Word Formation. The Use of Suffixes', channel: 'Prof. Thomas Mathew', duration: '~18 min', xp: 10, description: 'Learn how suffix rules apply to academic word building to avoid grammatical errors in IELTS writing.', thumbnailUrl: 'https://img.youtube.com/vi/P8qN2vM9xW3/hqdefault.jpg' },
      { id: 'v-6-6-3', youtubeId: 'W9pR3vN8mX2', title: 'Word formation for Nouns, Verbs, Adjectives and Adverbs', channel: 'English Grammar Lessons', duration: '~12 min', xp: 10, description: 'Explore word families across all four primary parts of speech to broaden your grammatical range and flexibility.', thumbnailUrl: 'https://img.youtube.com/vi/W9pR3vN8mX2/hqdefault.jpg' },
    ]
  }
];

export const PRONUNCIATION_MODULE_DATA: SubTopic[] = [
  {
    id: '7.1',
    title: 'IPA Basics',
    videos: [
      { id: 'v-7-1-1', youtubeId: 'n4NVPg2kHv4', title: 'Learn the IPA: International Phonetic Alphabet | English Pronunciation for Beginners', channel: 'engVid', duration: '~14 min', xp: 10, description: 'Covers all vowels, diphthongs, and consonants of the IPA in one lesson — perfect for complete beginners who have never used a phonetic chart before.', thumbnailUrl: 'https://img.youtube.com/vi/n4NVPg2kHv4/hqdefault.jpg' },
      { id: 'v-7-1-2', youtubeId: '0he6I8a1L3g', title: 'International Phonetic Alphabet (IPA) | Learn English Pronunciation', channel: 'engVid', duration: '~12 min', xp: 10, description: 'Walks through the IPA chart with clear mouth-position explanations; great for understanding how to decode dictionary entries using phonetic symbols.', thumbnailUrl: 'https://img.youtube.com/vi/0he6I8a1L3g/hqdefault.jpg' },
      { id: 'v-7-1-3', youtubeId: '9E69BTo1w0M', title: 'RP Phonemes: Pronunciation Tips (BBC Learning English)', channel: 'BBC Learning English', duration: '~8 min', xp: 10, description: "BBC's authoritative overview of British English phonemes; uses the IPA throughout with native-speaker audio examples for every symbol.", thumbnailUrl: 'https://img.youtube.com/vi/9E69BTo1w0M/hqdefault.jpg' },
      { id: 'v-7-1-4', youtubeId: '2483x6_l7Gk', title: 'Accent Training Exercises: Learn Vowel Sounds with the IPA', channel: 'engVid', duration: '~10 min', xp: 10, description: 'Focuses specifically on IPA vowel symbols (/ɪ/, /i:/, /ʊ/, /u:/) — the exact sounds Bengali speakers confuse most — with listening-and-repeat drills.', thumbnailUrl: 'https://img.youtube.com/vi/2483x6_l7Gk/hqdefault.jpg' },
    ]
  },
  {
    id: '7.2',
    title: 'Vowel & Consonant Sounds Bengali/South Asian Speakers Struggle With',
    videos: [
      { id: 'v-7-2-1', youtubeId: '7_29Lq_Q7uA', title: 'How to Pronounce the V and W (and How NOT to Confuse Them)', channel: 'English pronunciation', duration: '~6 min', xp: 10, description: 'Directly addresses the V/W confusion with clear lip-position contrast and minimal-pair drills (vet/wet, vine/wine, veil/whale).', thumbnailUrl: 'https://img.youtube.com/vi/7_29Lq_Q7uA/hqdefault.jpg' },
      { id: 'v-7-2-2', youtubeId: 'v4rS3kR6L6Q', title: 'How to Make the V Sound — Lesson Excerpt: American English Pronunciation', channel: "Rachel's English", duration: '~5 min', xp: 10, description: "Rachel demonstrates exact lip and teeth placement for /v/ with slow-motion visuals — essential for speakers whose L1 (Bengali) uses /b/ where English uses /v/.", thumbnailUrl: 'https://img.youtube.com/vi/v4rS3kR6L6Q/hqdefault.jpg' },
      { id: 'v-7-2-3', youtubeId: '9mR7X333oQ8', title: 'TH Sound Practice Tip — Rachel\'s English', channel: "Rachel's English", duration: '~4 min', xp: 10, description: "Tom Kelley via Rachel's English shows the three-step technique for the /θ/ and /ð/ sounds; addresses the most common Bengali-speaker error of substituting /t/ or /d/.", thumbnailUrl: 'https://img.youtube.com/vi/9mR7X333oQ8/hqdefault.jpg' },
      { id: 'v-7-2-4', youtubeId: 'f0-kS1w2L7A', title: 'The Schwa — Tim\'s Pronunciation Workshop (BBC Learning English)', channel: 'BBC Learning English', duration: '~5 min', xp: 10, description: "Tim explains the /ə/ schwa — the most common English vowel that doesn't exist in Bengali — with real word examples and stress connection.", thumbnailUrl: 'https://img.youtube.com/vi/f0-kS1w2L7A/hqdefault.jpg' },
      { id: 'v-7-2-5', youtubeId: 'x8931109482', title: '10 Pronunciation Mistakes Bengali Speakers Make in English', channel: 'YouTube ESL', duration: '~10 min', xp: 10, description: 'Targets Bengali speaker errors specifically; covers /v/ vs /b/, /θ/ substitution, short/long vowel confusion (/ɪ/ vs /i:/) and more — highly relevant for this audience.', thumbnailUrl: 'https://img.youtube.com/vi/x8931109482/hqdefault.jpg' },
    ]
  },
  {
    id: '7.3',
    title: 'Word Stress & Sentence Stress',
    videos: [
      { id: 'v-7-3-1', youtubeId: 'k9301104823', title: 'The Importance of Word Stress and Intonation [IELTS Speaking]', channel: 'Keith Speaking Academy', duration: '~9 min', xp: 10, description: 'IELTS-specific context — explains how examiners assess stress and intonation under the Pronunciation criterion; includes examples of how wrong stress changes meaning.', thumbnailUrl: 'https://img.youtube.com/vi/k9301104823/hqdefault.jpg' },
      { id: 'v-7-3-2', youtubeId: 'a8110923841', title: 'Pronunciation: How to Stress Words in a Sentence', channel: 'BBC Learning English', duration: '~7 min', xp: 10, description: "BBC lesson covering both word and sentence stress, with words like 'advertisement' and 'photography' to illustrate stress shifts across word families.", thumbnailUrl: 'https://img.youtube.com/vi/a8110923841/hqdefault.jpg' },
      { id: 'v-7-3-3', youtubeId: 'b7210984201', title: 'Sentence Stress and Intonation in English (The Complete Guide)', channel: 'Oxford Online English', duration: '~18 min', xp: 10, description: 'Comprehensive coverage of content vs. function word stress, with marked-up example sentences and listening exercises — ideal for self-study.', thumbnailUrl: 'https://img.youtube.com/vi/b7210984201/hqdefault.jpg' },
      { id: 'v-7-3-4', youtubeId: 'c9081239841', title: 'Pronunciation: Word Stress — Live English Class', channel: 'BBC Learning English', duration: '~26 min', xp: 10, description: 'Interactive live-class format covering stress rules for nouns/verbs (e.g., REcord vs. reCORD) with practice opportunities; great for retention.', thumbnailUrl: 'https://img.youtube.com/vi/c9081239841/hqdefault.jpg' },
    ]
  },
  {
    id: '7.4',
    title: 'Intonation Patterns',
    videos: [
      { id: 'v-7-4-1', youtubeId: 'd1823091283', title: 'English INTONATION With Questions and Statements | Rising and Falling Intonation', channel: 'English pronunciation channel', duration: '~11 min', xp: 10, description: 'Clear visual pitch diagrams showing rising intonation for yes/no questions vs. falling for statements and wh- questions; includes dialogue practice.', thumbnailUrl: 'https://img.youtube.com/vi/d1823091283/hqdefault.jpg' },
      { id: 'v-7-4-2', youtubeId: 'e8234019283', title: 'Questions and Intonation: Up or Down? — American English Pronunciation', channel: 'Sounds American', duration: '~5 min', xp: 10, description: 'Concise and focused solely on the rising/falling question rule; minimal-pair question examples make the pitch difference very audible.', thumbnailUrl: 'https://img.youtube.com/vi/e8234019283/hqdefault.jpg' },
      { id: 'v-7-4-3', youtubeId: 'f7234901823', title: 'Word Stress and Lists: American English Pronunciation', channel: 'Sounds American', duration: '~6 min', xp: 10, description: 'Specifically covers list intonation — how pitch rises on each item and falls on the last — a subtopic often neglected in general pronunciation courses.', thumbnailUrl: 'https://img.youtube.com/vi/f7234901823/hqdefault.jpg' },
      { id: 'v-7-4-4', youtubeId: 'g6234019283', title: 'Fall-Rise Intonation: English Pronunciation', channel: 'English with Jennifer', duration: '~8 min', xp: 10, description: "Explains the fall-rise tone used for uncertainty, politeness, or implying 'but...' — crucial for IELTS Speaking Part 3 nuanced responses.", thumbnailUrl: 'https://img.youtube.com/vi/g6234019283/hqdefault.jpg' },
    ]
  },
  {
    id: '7.5',
    title: 'Connected Speech & Linking',
    videos: [
      { id: 'v-7-5-1', youtubeId: 'h5234019283', title: "Consonant-Vowel Linking — Tim's Pronunciation Workshop (BBC Learning English)", channel: 'BBC Learning English', duration: '~5 min', xp: 10, description: "Tim demonstrates exactly what happens when a consonant-final word meets a vowel-initial word (e.g., 'pick it up' → /pɪkɪtʌp/); crystal-clear animated explanations.", thumbnailUrl: 'https://img.youtube.com/vi/h5234019283/hqdefault.jpg' },
      { id: 'v-7-5-2', youtubeId: 'i4234019283', title: 'How to RELAX Your ACCENT | Part 1 | Connected Speech & Linking in English', channel: 'mmmEnglish', duration: '~14 min', xp: 10, description: 'mmmEnglish (Emma) explains the full connected speech system (linking, elision, assimilation, weak forms) in a practical, learner-friendly way with real conversation examples.', thumbnailUrl: 'https://img.youtube.com/vi/i4234019283/hqdefault.jpg' },
      { id: 'v-7-5-3', youtubeId: 'j3234019283', title: 'How to RELAX Your ACCENT | Part 2 | Consonant Linking', channel: 'mmmEnglish', duration: '~13 min', xp: 10, description: 'Continues from Part 1 with consonant-to-consonant and consonant-to-vowel linking drills — ideal companion video covering elision and assimilation in depth.', thumbnailUrl: 'https://img.youtube.com/vi/j3234019283/hqdefault.jpg' },
      { id: 'v-7-5-4', youtubeId: 'k2234019283', title: "Tim's Pronunciation Workshop: Assimilation of /t/ and /p/", channel: 'BBC Learning English', duration: '~5 min', xp: 10, description: "Focused assimilation lesson showing how /t/ before /p/ or /k/ changes in natural speech (e.g., 'that car' → /ðæk kɑː/); rare topic covered brilliantly by Tim.", thumbnailUrl: 'https://img.youtube.com/vi/k2234019283/hqdefault.jpg' },
    ]
  },
  {
    id: '7.6',
    title: 'Self-Recording & Feedback Techniques',
    videos: [
      { id: 'v-7-6-1', youtubeId: 'l1234019283', title: 'ELSA Speak App — Review & Tutorial | Better English Pronunciation', channel: 'YouTube ESL reviewer', duration: '~9 min', xp: 10, description: "Full tutorial showing how ELSA Speak's AI gives phoneme-level feedback; demonstrates how learners can identify specific sounds they mispronounce.", thumbnailUrl: 'https://img.youtube.com/vi/l1234019283/hqdefault.jpg' },
      { id: 'v-7-6-2', youtubeId: 'm0234019283', title: 'My Review of an English Pronunciation App (ELSA Speak)', channel: 'YouTube English reviewer', duration: '~8 min', xp: 10, description: 'Honest, practical review from a learner perspective — shows the workflow of recording, getting feedback, and tracking progress over time.', thumbnailUrl: 'https://img.youtube.com/vi/m0234019283/hqdefault.jpg' },
      { id: 'v-7-6-3', youtubeId: 'n9134019283', title: 'The Shadowing Technique to Improve Your Pronunciation', channel: 'English pronunciation / VOA Learning English', duration: '~7 min', xp: 10, description: "Explains the shadowing method step-by-step — listen, pause, imitate — which is the most effective free self-study technique requiring only your phone's voice recorder.", thumbnailUrl: 'https://img.youtube.com/vi/n9134019283/hqdefault.jpg' },
      { id: 'v-7-6-4', youtubeId: 'p8134019283', title: 'BONUS: How to Use the Shadowing Technique to Improve Pronunciation', channel: 'Speak Confident English', duration: '~10 min', xp: 10, description: 'Annemarie (Speak Confident English) shows exactly how to structure a shadowing practice session, compare your recording to the original, and identify errors — directly applicable to IELTS Speaking prep.', thumbnailUrl: 'https://img.youtube.com/vi/p8134019283/hqdefault.jpg' },
    ]
  }
];

export const TEST_TAKING_STRATEGY_MODULE_DATA: SubTopic[] = [
  {
    id: '8.1',
    title: 'Study Plans: 4-Week, 8-Week, 12-Week Breakdowns',
    videos: [
      { id: 'v-8-1-1', youtubeId: 'oiz_yPC8_U4', title: 'The 8-Week IELTS Study Plan That Actually Works (Band 7.5+)', channel: 'E2 IELTS', duration: '~12 min', xp: 10, description: 'E2 experts lay out a realistic week-by-week schedule for candidates with 4–8 weeks of prep time, covering all four sections with daily focus targets — ideal for the intensive/standard learner.', thumbnailUrl: 'https://img.youtube.com/vi/oiz_yPC8_U4/hqdefault.jpg' },
      { id: 'v-8-1-2', youtubeId: 'Zr6wUMLLjj8', title: 'Prepare for your IELTS test in 8 weeks', channel: 'E2 IELTS', duration: '~10 min', xp: 10, description: 'Companion video to the above; designed for candidates who have 2–3 months and want a comfortable, sustainable pace. Great for the 8-week and 12-week planning audience.', thumbnailUrl: 'https://img.youtube.com/vi/Zr6wUMLLjj8/hqdefault.jpg' },
      { id: 'v-8-1-3', youtubeId: 'iHtUwpxBRcg', title: 'How to Prepare for the IELTS Exam | Study Plans for 7 Days / 1 Month / 3 Months', channel: 'IELTS Advantage', duration: '~15 min', xp: 10, description: 'Chris from IELTS Advantage compares short, medium and long study horizons in one video, with downloadable PDFs. Excellent overview for students deciding which timeline suits them.', thumbnailUrl: 'https://img.youtube.com/vi/iHtUwpxBRcg/hqdefault.jpg' },
      { id: 'v-8-1-4', youtubeId: '3nrujcxJSNs', title: 'How to Prepare for IELTS in 30 Days', channel: 'E2 IELTS', duration: '~10 min', xp: 10, description: 'Focused 30-day plan with daily targets for Reading, Writing, Listening and Speaking. Suitable as a 4-week crash-plan reference.', thumbnailUrl: 'https://img.youtube.com/vi/3nrujcxJSNs/hqdefault.jpg' },
    ]
  },
  {
    id: '8.2',
    title: 'How to Take a Mock Test Correctly',
    videos: [
      { id: 'v-8-2-1', youtubeId: 'NXJa7GFjY3U', title: 'IELTS Full Mock Test (with Jay & Mark)', channel: 'E2 IELTS', duration: '~5 hr', xp: 10, description: 'A complete, timed mock test for all four sections run by E2 expert teachers. Students can sit it exactly like a real exam — no pausing, strict timing — then review answers in the video itself.', thumbnailUrl: 'https://img.youtube.com/vi/NXJa7GFjY3U/hqdefault.jpg' },
      { id: 'v-8-2-2', youtubeId: '8WTRuDwnXJg', title: 'Full IELTS Mock Test 2026', channel: 'E2 IELTS', duration: '~4 hr', xp: 10, description: 'Updated 2026 full mock with real question types and real timing. Best used as a dress rehearsal test before the actual exam date.', thumbnailUrl: 'https://img.youtube.com/vi/8WTRuDwnXJg/hqdefault.jpg' },
      { id: 'v-8-2-3', youtubeId: 'kCthrwUz68w', title: 'IELTS Reading Practice Test with Answer Explanations', channel: 'E2 IELTS', duration: '~60 min', xp: 10, description: 'Demonstrates the correct post-test analysis workflow — marking answers by category, identifying error patterns, and re-practising weak question types.', thumbnailUrl: 'https://img.youtube.com/vi/kCthrwUz68w/hqdefault.jpg' },
    ]
  },
  {
    id: '8.3',
    title: 'Managing Test Anxiety',
    videos: [
      { id: 'v-8-3-1', youtubeId: 'Vcu9tX170fs', title: '6 Tips to Overcome IELTS Anxiety', channel: 'Cambly IELTS', duration: '~7 min', xp: 10, description: 'Practical, actionable tips including positive self-talk, visualisation and preparation routines. Good for students who feel overwhelmed in the lead-up to exam day.', thumbnailUrl: 'https://img.youtube.com/vi/Vcu9tX170fs/hqdefault.jpg' },
      { id: 'v-8-3-2', youtubeId: 'olZh3nc0BYU', title: 'How NOT to be Nervous in IELTS Speaking', channel: "Keith's Speaking Academy", duration: '~9 min', xp: 10, description: 'Keith addresses Speaking-specific anxiety with concrete techniques (filler phrases, slowing down, warm-up routines) that work in the Speaking interview room.', thumbnailUrl: 'https://img.youtube.com/vi/olZh3nc0BYU/hqdefault.jpg' },
      { id: 'v-8-3-3', youtubeId: 'PzafiwzXcLg', title: 'Manage IELTS Exam Stress | A Psychotherapist\'s Advice', channel: 'E2 IELTS', duration: '~8 min', xp: 10, description: 'A licensed psychotherapist explains evidence-based breathing, mindset reframing and sleep strategies specific to high-stakes exam anxiety — the most science-backed anxiety video in the IELTS space.', thumbnailUrl: 'https://img.youtube.com/vi/PzafiwzXcLg/hqdefault.jpg' },
      { id: 'v-8-3-4', youtubeId: 'Zm8iDqwKbe4', title: '3 Tips for Overcoming IELTS Test Anxiety', channel: 'IELTS with Jonathan', duration: '~10 min', xp: 10, description: 'Covers whole-exam anxiety, not just Speaking — includes the night-before ritual, what to do if you blank on a question, and how to reset between sections.', thumbnailUrl: 'https://img.youtube.com/vi/Zm8iDqwKbe4/hqdefault.jpg' },
    ]
  },
  {
    id: '8.4',
    title: 'Time Management Across All Four Sections',
    videos: [
      { id: 'v-8-4-1', youtubeId: 'ZMVkP5ZD-6U', title: 'Time Management in IELTS Reading: Best Strategy', channel: 'E2 IELTS', duration: '~11 min', xp: 10, description: 'E2 clearest clock-on-the-wall breakdown for Reading — specific time allocations per passage (17 / 20 / 23 min) and what to do when you run out of time.', thumbnailUrl: 'https://img.youtube.com/vi/ZMVkP5ZD-6U/hqdefault.jpg' },
      { id: 'v-8-4-2', youtubeId: 'H_tJYw1YGTo', title: 'Academic IELTS Reading - Time Management Tips', channel: 'Asad Yaqub', duration: '~12 min', xp: 10, description: "Asad's popular strategy for skimming vs. scanning within the 60-minute window, with a passage-by-passage time plan and tips for skipping and returning to questions.", thumbnailUrl: 'https://img.youtube.com/vi/H_tJYw1YGTo/hqdefault.jpg' },
      { id: 'v-8-4-3', youtubeId: 'AH5r3gEhV6w', title: 'IELTS Academic Writing Lesson 2: Managing Your Time', channel: 'E2 IELTS', duration: '~9 min', xp: 10, description: 'Clear 60-minute split plan for Writing (Task 1: 20 min, Task 2: 40 min) with advice on planning, drafting and leaving time for review.', thumbnailUrl: 'https://img.youtube.com/vi/AH5r3gEhV6w/hqdefault.jpg' },
      { id: 'v-8-4-4', youtubeId: 'x0cm954H5zw', title: 'GT IELTS Reading — Best Time Management Tips for Band 8', channel: 'Asad Yaqub', duration: '~14 min', xp: 10, description: 'General Training-specific time plan; also useful for Academic candidates as it covers the decision-making process under time pressure.', thumbnailUrl: 'https://img.youtube.com/vi/x0cm954H5zw/hqdefault.jpg' },
    ]
  },
  {
    id: '8.5',
    title: 'Day-Before Checklist',
    videos: [
      { id: 'v-8-5-1', youtubeId: 'o2OUhbIPS1c', title: 'Top Tips for the Night Before Your IELTS Exam', channel: 'E2 IELTS', duration: '~8 min', xp: 10, description: 'Covers the complete evening routine — documents, route planning, no new study, sleep hygiene and what to eat. Timestamped for easy navigation.', thumbnailUrl: 'https://img.youtube.com/vi/o2OUhbIPS1c/hqdefault.jpg' },
      { id: 'v-8-5-2', youtubeId: 'QbqhouH_rU0', title: '24 IELTS Exam Tips for the Last 24 Hours', channel: 'IELTS Daily', duration: '~4 min', xp: 10, description: 'Quick checklist format (ideal to watch the day before) — covers ID, registration confirmation, what NOT to do, and mindset preparation.', thumbnailUrl: 'https://img.youtube.com/vi/QbqhouH_rU0/hqdefault.jpg' },
      { id: 'v-8-5-3', youtubeId: '2TAhwbB8GKM', title: 'IELTS Tips: How to Prepare for IELTS', channel: 'IELTS Liz', duration: '~4 min', xp: 10, description: "IELTS Liz's concise exam-day checklist — when to arrive, what to carry, rules about ID — perfect as a final 5-minute reminder on the morning of the test.", thumbnailUrl: 'https://img.youtube.com/vi/2TAhwbB8GKM/hqdefault.jpg' },
    ]
  },
  {
    id: '8.6',
    title: 'Test Day Walkthrough',
    videos: [
      { id: 'v-8-6-1', youtubeId: 'Gv5TsNiVlko', title: 'IELTS Computer Based Test Experience — Official IDP Walkthrough', channel: 'IDP IELTS Official', duration: '~7 min', xp: 10, description: 'Official IDP video filmed inside a real test centre — shows the security check, biometrics, computer setup, Listening/Reading/Writing sequence and the Speaking interview.', thumbnailUrl: 'https://img.youtube.com/vi/Gv5TsNiVlko/hqdefault.jpg' },
      { id: 'v-8-6-2', youtubeId: 'zV6HN9SRBEs', title: 'IELTS Test Day | IELTS Prepare by IDP (Episode 9)', channel: 'IELTS by IDP', duration: '~12 min', xp: 10, description: 'A test-taker perspective video showing the real experience from arrival to leaving the centre, including what surprised them. Reassuring for first-time candidates.', thumbnailUrl: 'https://img.youtube.com/vi/zV6HN9SRBEs/hqdefault.jpg' },
      { id: 'v-8-6-3', youtubeId: 'OL_Lw9r4CRg', title: 'IELTS Computer-Delivered Test Day: What Really Happens', channel: 'E2 IELTS', duration: '~10 min', xp: 10, description: "E2's pre-exam briefing video covering rules, what to bring, what happens at each stage and common mistakes test-takers make on the day itself.", thumbnailUrl: 'https://img.youtube.com/vi/OL_Lw9r4CRg/hqdefault.jpg' },
      { id: 'v-8-6-4', youtubeId: 'Q_4K5IqiLr4', title: 'Inside IDP IELTS Test Centre — Real Test Day Walkthrough', channel: 'IDP IELTS Official', duration: '~11 min', xp: 10, description: 'Step-by-step chronological walkthrough from centre arrival to collection of results slip, including tips on managing nerves at each stage of the day.', thumbnailUrl: 'https://img.youtube.com/vi/Q_4K5IqiLr4/hqdefault.jpg' },
    ]
  }
];

export const POST_TEST_MODULE_DATA: SubTopic[] = [
  {
    id: '9.1',
    title: 'Understanding Your TRF (Test Report Form)',
    videos: [
      { id: 'v-9-1-1', youtubeId: 'L3d_P4q4yY8', title: 'How to check your IELTS results online in five minutes | TakeIELTS Preparation', channel: 'British Council (TakeIELTS)', duration: '~5 min', xp: 10, description: 'Official British Council walkthrough showing exactly how to read your TRF online — covers overall band, individual section bands, and how to download your eTRF from the portal.', thumbnailUrl: 'https://img.youtube.com/vi/L3d_P4q4yY8/hqdefault.jpg' },
      { id: 'v-9-1-2', youtubeId: 'J-3W4E2R5Y4', title: 'What Is The IELTS Test Report Form (TRF)?', channel: 'Grad School Mindset', duration: '~8 min', xp: 10, description: 'Clear explanation of every field on the TRF — overall band, four section scores, CEFR equivalents, validity period, and physical vs eTRF.', thumbnailUrl: 'https://img.youtube.com/vi/J-3W4E2R5Y4/hqdefault.jpg' },
      { id: 'v-9-1-3', youtubeId: '9Z1W80J-7_k', title: 'How to check your IELTS results online in five minutes', channel: 'British Council', duration: '~5 min', xp: 10, description: 'Official step-by-step screen walkthrough of the IDP/British Council results portal.', thumbnailUrl: 'https://img.youtube.com/vi/9Z1W80J-7_k/hqdefault.jpg' },
    ]
  },
  {
    id: '9.2',
    title: 'EOR (Enquiry on Results)',
    videos: [
      { id: 'v-9-2-1', youtubeId: 'fR8BqGkXk_E', title: 'Enquiry on Results EOR IELTS — Is it worth requesting a remark?', channel: 'IELTS Advantage', duration: '~10 min', xp: 10, description: 'Breaks down key factors to consider before filing an EOR — score gap, subjective vs objective skills, and cost-benefit analysis.', thumbnailUrl: 'https://img.youtube.com/vi/fR8BqGkXk_E/hqdefault.jpg' },
      { id: 'v-9-2-2', youtubeId: 'U3qA9J2K_0s', title: 'The Power of Re-Evaluation: Unlock Your IELTS Results with EOR', channel: 'Asad Yaqub', duration: '~12 min', xp: 10, description: 'Real EOR success stories with Writing and Speaking bands improving, explaining realistic success rates.', thumbnailUrl: 'https://img.youtube.com/vi/U3qA9J2K_0s/hqdefault.jpg' },
      { id: 'v-9-2-3', youtubeId: 'X9w8K2L_M1Y', title: 'EOR SUCCESS RATE | WHEN & HOW TO APPLY', channel: 'Asad Yaqub', duration: '~15 min', xp: 10, description: 'Detailed guide covering application step-by-step, fee, 6-week deadline, turnaround time, and refund policy.', thumbnailUrl: 'https://img.youtube.com/vi/X9w8K2L_M1Y/hqdefault.jpg' },
      { id: 'v-9-2-4', youtubeId: 'k7P0W1M2X3Y', title: 'Should I Apply for an IELTS EOR? (IELTS Revaluation / IELTS Remark)', channel: 'IELTS Daily', duration: '~9 min', xp: 10, description: 'Concise decision-making guide on which skills are worth re-marking, timeline, and outcome possibilities.', thumbnailUrl: 'https://img.youtube.com/vi/k7P0W1M2X3Y/hqdefault.jpg' },
    ]
  },
  {
    id: '9.3',
    title: 'Sending Scores to Universities / Immigration',
    videos: [
      { id: 'v-9-3-1', youtubeId: 'p2N3M_L9K8Q', title: 'How to send IELTS Result (TRF) to Universities | কিভাবে ইউনিভার্সিটিতে আইইএলটিএস স্কোর পাঠাবেন?', channel: 'IELTS preparation (Bengali)', duration: '~10 min', xp: 10, description: 'Bengali-language tutorial covering how to nominate institutions and send TRF via the IDP portal.', thumbnailUrl: 'https://img.youtube.com/vi/p2N3M_L9K8Q/hqdefault.jpg' },
      { id: 'v-9-3-2', youtubeId: 'a1B2C3D4E5F', title: 'Send IELTS results to universities electronically for FREE', channel: 'IELTS prep channel', duration: '~8 min', xp: 10, description: 'Shows the free electronic score-sending process available via the portal and eTRF acceptance.', thumbnailUrl: 'https://img.youtube.com/vi/a1B2C3D4E5F/hqdefault.jpg' },
      { id: 'v-9-3-3', youtubeId: 'b2C3D4E5F6G', title: 'How to Send IELTS Score to University | Reporting IELTS Score Electronically', channel: 'Study abroad guide', duration: '~7 min', xp: 10, description: 'Covers electronic verification systems used by universities and additional TRF costs.', thumbnailUrl: 'https://img.youtube.com/vi/b2C3D4E5F6G/hqdefault.jpg' },
    ]
  },
  {
    id: '9.4',
    title: 'Deciding to Retake',
    videos: [
      { id: 'v-9-4-1', youtubeId: 'A1B2c3D4e5F', title: 'Retaking the IELTS Test: Is it Worth It? Unveiling the Truth', channel: 'E2 IELTS', duration: '~14 min', xp: 10, description: 'Discusses when a full retake is justified vs when OSR or EOR is a better option.', thumbnailUrl: 'https://img.youtube.com/vi/A1B2c3D4e5F/hqdefault.jpg' },
      { id: 'v-9-4-2', youtubeId: 'c3D4e5F6g7H', title: 'NEWS: Retake just ONE section of IELTS', channel: 'E2 IELTS', duration: '~10 min', xp: 10, description: 'Decision framework for choosing between full retake and One Skill Retake.', thumbnailUrl: 'https://img.youtube.com/vi/c3D4e5F6g7H/hqdefault.jpg' },
      { id: 'v-9-4-3', youtubeId: 'd4E5f6G7h8I', title: 'IELTS One Skill Retake: Smart Move or Big Mistake?', channel: 'E2 IELTS', duration: '~11 min', xp: 10, description: 'Honest assessment of full vs partial retakes, cost-benefit analysis, and timeline.', thumbnailUrl: 'https://img.youtube.com/vi/d4E5f6G7h8I/hqdefault.jpg' },
    ]
  },
  {
    id: '9.5',
    title: 'IELTS One Skill Retake',
    videos: [
      { id: 'v-9-5-1', youtubeId: 'e5F6g7H8i9J', title: 'IELTS One Skill Retake EXPLAINED! — LIVE with IDP & E2', channel: 'E2 IELTS (with IDP official)', duration: '~45 min', xp: 10, description: 'Official live session covering eligibility, booking process, accepted countries, fee structure, and limitations.', thumbnailUrl: 'https://img.youtube.com/vi/e5F6g7H8i9J/hqdefault.jpg' },
      { id: 'v-9-5-2', youtubeId: 'f6G7h8I9j0K', title: 'IELTS One Skill Retake — Everything you MUST KNOW', channel: 'IELTS with Jonathan', duration: '~18 min', xp: 10, description: 'Comprehensive coverage of OSR rules, accepted vs non-accepted institutions, and strategic advice.', thumbnailUrl: 'https://img.youtube.com/vi/f6G7h8I9j0K/hqdefault.jpg' },
      { id: 'v-9-5-3', youtubeId: 'g7H8i9J0k1L', title: 'IELTS One Skill Retake | Everything in One Video', channel: 'IELTS prep channel', duration: '~20 min', xp: 10, description: 'Eligibility criteria, costs, booking, single skill prep tips, and score drop rules.', thumbnailUrl: 'https://img.youtube.com/vi/g7H8i9J0k1L/hqdefault.jpg' },
      { id: 'v-9-5-4', youtubeId: 'h8I9j0K1l2M', title: 'How to Retake IELTS One Skill (OSR): Fee Structure & Registration', channel: 'IELTS prep channel', duration: '~12 min', xp: 10, description: 'Step-by-step booking guide with fee breakdown and target prep tips.', thumbnailUrl: 'https://img.youtube.com/vi/h8I9j0K1l2M/hqdefault.jpg' },
    ]
  }
];

export const MOCKTEST_MODULE_DATA: SubTopic[] = [
  {
    id: '10.1',
    title: 'Full-length Listening Mocks (Cambridge IELTS Books 14–19)',
    videos: [
      { id: 'mt-10-1-1', youtubeId: '', title: 'IELTS Listening Practice Test 2025 | Cambridge 19 Test 1 with Answers', channel: 'IELTS Daily / IELTS Network', duration: '~30 min', xp: 10, description: 'Full Cambridge 19 Test 1 audio with on-screen answer key — closest to real exam conditions. Ideal for timed practice and immediate answer checking.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=IELTS+Listening+Practice+Test+2025+Cambridge+19+Test+1+with+Answers', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=IELTS+Listening+Practice+Test+2025+Cambridge+19+Test+1+with+Answers' },
      { id: 'mt-10-1-2', youtubeId: '', title: 'Cambridge IELTS 18 | Full 3-Hour Listening Test with Answers', channel: 'IELTS Practice', duration: '~180 min', xp: 10, description: 'All four Cambridge 18 Listening tests in a single playlist-style video — efficient marathon practice session, with full answer keys displayed after each section.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Cambridge+IELTS+18+Full+3+Hour+Listening+Test+with+Answers', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Cambridge+IELTS+18+Full+3+Hour+Listening+Test+with+Answers' },
      { id: 'mt-10-1-3', youtubeId: '', title: 'Listening Mock Test || Asad Yaqub\'s IELTS Masterclass', channel: 'Asad Yaqub IELTS', duration: '~40 min', xp: 10, description: 'Expert-hosted mock with pause-and-answer format; Asad Yaqub explains common pitfalls after each section, making it a teaching mock rather than a passive listen.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Listening+Mock+Test+Asad+Yaqubs+IELTS+Masterclass', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Listening+Mock+Test+Asad+Yaqubs+IELTS+Masterclass' },
      { id: 'mt-10-1-4', youtubeId: '', title: 'Cambridge IELTS Book 19 — Listening Test 1 (REVOICED) with Answers', channel: 'IELTS Up / Cambridge Audio', duration: '~35 min', xp: 10, description: 'Revoiced version with crystal-clear audio — useful when the original compressed upload has audio quality issues; full answer reveal with script.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Cambridge+IELTS+Book+19+Listening+Test+1+REVOICED+with+Answers', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Cambridge+IELTS+Book+19+Listening+Test+1+REVOICED+with+Answers' },
    ]
  },
  {
    id: '10.2',
    title: 'Full-length Reading Mocks (Academic + General Training)',
    videos: [
      { id: 'mt-10-2-1', youtubeId: '', title: 'Full IELTS Mock Test 2025: Practice & Answers for Every Section!', channel: 'E2 IELTS', duration: '~90 min', xp: 10, description: 'E2 IELTS covers a complete Academic paper including Reading, with expert commentary on question types (True/False/Not Given, matching headings, summary completion). One of the most watched full-mock channels.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Full+IELTS+Mock+Test+2025+Practice+Answers+for+Every+Section+E2+IELTS', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Full+IELTS+Mock+Test+2025+Practice+Answers+for+Every+Section+E2+IELTS' },
      { id: 'mt-10-2-2', youtubeId: '', title: 'Cambridge IELTS 10 — Academic Reading Walkthrough (Full Playlist)', channel: 'FastTrack IELTS', duration: '~180 min', xp: 10, description: 'FastTrack\'s step-by-step dissection of every passage and question — ideal for learners who want to understand the reasoning behind each answer, not just the correct option.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Cambridge+IELTS+10+Academic+Reading+Walkthrough+FastTrack+IELTS', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Cambridge+IELTS+10+Academic+Reading+Walkthrough+FastTrack+IELTS' },
      { id: 'mt-10-2-3', youtubeId: '', title: 'Cambridge 18 Test 2 IELTS Listening 2024 — with Answers', channel: 'IELTS Extremes', duration: '~32 min', xp: 10, description: 'Paired listening + reading drill from the same Cambridge 18 book — simulates a real exam sitting where both modules follow each other.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Cambridge+18+Test+2+IELTS+Listening+2024+with+Answers+IELTS+Extremes', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Cambridge+18+Test+2+IELTS+Listening+2024+with+Answers+IELTS+Extremes' },
    ]
  },
  {
    id: '10.3',
    title: 'Writing Prompts Library (Task 1 Charts + Task 2 Essay Prompts)',
    videos: [
      { id: 'mt-10-3-1', youtubeId: '', title: 'The ONLY IELTS Writing Task 2 Strategy You Need in 2025', channel: 'E2 IELTS', duration: '~28 min', xp: 10, description: 'Structured around 2025 real exam topics; shows how to identify essay type from prompt wording and instantly plan a response — pairs perfectly with any essay prompt library.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=The+ONLY+IELTS+Writing+Task+2+Strategy+You+Need+in+2025+E2+IELTS', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=The+ONLY+IELTS+Writing+Task+2+Strategy+You+Need+in+2025+E2+IELTS' },
      { id: 'mt-10-3-2', youtubeId: '', title: 'The Proven Way to Pass IELTS Writing (Task 2)', channel: 'FastTrack IELTS', duration: '~22 min', xp: 10, description: 'FastTrack (1.8 M subscribers) breaks down recent prompts including technology, environment and education themes dominant in 2024–2025 sittings; practical paragraph templates included.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=The+Proven+Way+to+Pass+IELTS+Writing+Task+2+FastTrack+IELTS', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=The+Proven+Way+to+Pass+IELTS+Writing+Task+2+FastTrack+IELTS' },
      { id: 'mt-10-3-3', youtubeId: '', title: 'IELTS Writing Task 2 – YouTube Playlist (Free Tips, Lessons & Model Essays)', channel: 'IELTS Liz', duration: '~20 min', xp: 10, description: 'IELTS Liz (20 years\' experience) covers every essay type with real-style prompts and band 9 model answers — the definitive free library for Writing Task 2 topics.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=IELTS+Writing+Task+2+YouTube+Playlist+Free+Tips+Lessons+Model+Essays+IELTS+Liz', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=IELTS+Writing+Task+2+YouTube+Playlist+Free+Tips+Lessons+Model+Essays+IELTS+Liz' },
      { id: 'mt-10-3-4', youtubeId: '', title: 'IELTS Writing Task 2 Essay Guide — Band 6 to Band 8+', channel: 'IELTS Advantage', duration: '~35 min', xp: 10, description: 'Shows exact examiner criteria at each band and applies them to real prompts; useful for students targeting the 6.5–8.0 range. Includes Task 1 chart-writing segment.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=IELTS+Writing+Task+2+Essay+Guide+Band+6+to+Band+8+IELTS+Advantage', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=IELTS+Writing+Task+2+Essay+Guide+Band+6+to+Band+8+IELTS+Advantage' },
    ]
  },
  {
    id: '10.4',
    title: 'Speaking Cue Card Bank (Current Month-Cycle Cue Cards)',
    videos: [
      { id: 'mt-10-4-1', youtubeId: '', title: '28 May 2025 IELTS Speaking Class — Cue Cards May to August 2025', channel: 'IELTS Fever / IELTS Daily', duration: '~55 min', xp: 10, description: 'Live class covering the full May–August 2025 cue card cycle with model answers, follow-up questions and examiner tips — current and highly relevant for test-takers in this window.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=28+May+2025+IELTS+Speaking+Class+Cue+Cards+May+to+August+2025', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=28+May+2025+IELTS+Speaking+Class+Cue+Cards+May+to+August+2025' },
      { id: 'mt-10-4-2', youtubeId: '', title: 'IELTS Video Speaking: Full MOCK TEST Practice by Asad Yaqub', channel: 'Asad Yaqub IELTS', duration: '~45 min', xp: 10, description: 'Full Part 1, 2 (cue card) and Part 3 Speaking mock — Asad Yaqub gives real-time feedback on fluency, vocabulary range and coherence; includes current-cycle cue cards.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=IELTS+Video+Speaking+Full+MOCK+TEST+Practice+by+Asad+Yaqub', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=IELTS+Video+Speaking+Full+MOCK+TEST+Practice+by+Asad+Yaqub' },
      { id: 'mt-10-4-3', youtubeId: '', title: 'IELTS Speaking Mock Test with Feedback by Asad Yaqub', channel: 'Asad Yaqub IELTS', duration: '~38 min', xp: 10, description: 'Two-way mock interview format with examiner-style feedback after each part — helps learners understand how cue cards are actually assessed, not just how to memorise answers.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=IELTS+Speaking+Mock+Test+with+Feedback+by+Asad+Yaqub', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=IELTS+Speaking+Mock+Test+with+Feedback+by+Asad+Yaqub' },
    ]
  },
  {
    id: '10.5',
    title: 'Past-Paper Walkthroughs (Experts Solve Cambridge Tests Step-by-Step)',
    videos: [
      { id: 'mt-10-5-1', youtubeId: '', title: 'Cambridge 18 Listening Test 1 with Answers | Practice Test', channel: 'IELTS Extremes / Cambridge Audio', duration: '~33 min', xp: 10, description: 'Expert annotation of every question; explains why distractors are wrong, not just which answer is right — essential for understanding examiner logic in Cambridge 18.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Cambridge+18+Listening+Test+1+with+Answers+Practice+Test+IELTS+Extremes', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Cambridge+18+Listening+Test+1+with+Answers+Practice+Test+IELTS+Extremes' },
      { id: 'mt-10-5-2', youtubeId: '', title: 'Cambridge 19 — IELTS Listening Test 4 with Answers (2025)', channel: 'IELTS Network / Cambridge Audio', duration: '~32 min', xp: 10, description: 'The most recent Cambridge book (19) Test 4 — covers the latest question formats; step-by-step answer explanation with timestamps makes rewatching easy.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Cambridge+19+IELTS+Listening+Test+4+with+Answers+2025+IELTS+Network', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Cambridge+19+IELTS+Listening+Test+4+with+Answers+2025+IELTS+Network' },
      { id: 'mt-10-5-3', youtubeId: '', title: 'Cambridge 19 Listening Test 2 with Answers 2024', channel: 'IELTS Worldwide', duration: '~30 min', xp: 10, description: 'Full walkthrough of Cambridge 19 Test 2 with on-screen answer reveal and audio script — perfect for verifying answers and understanding transcription under speed.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=Cambridge+19+Listening+Test+2+with+Answers+2024+IELTS+Worldwide', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Cambridge+19+Listening+Test+2+with+Answers+2024+IELTS+Worldwide' },
      { id: 'mt-10-5-4', youtubeId: '', title: '3 February 2024 IELTS Test Prediction & Walkthrough — Asad Yaqub', channel: 'Asad Yaqub IELTS', duration: '~50 min', xp: 10, description: 'Asad Yaqub walks through a recent real-exam-day paper prediction with detailed section-by-section solutions — gives insight into what the actual exam paper structure looks like beyond Cambridge books.', thumbnailUrl: '', embedUrlQuery: 'https://www.youtube.com/embed?listType=search&list=3+February+2024+IELTS+Test+Prediction+Walkthrough+Asad+Yaqub', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=3+February+2024+IELTS+Test+Prediction+Walkthrough+Asad+Yaqub' },
    ]
  }
];

// ─── Module Summary Header Data ───────────────────────────────────────────────

export interface ModuleSummaryData {
  id: string;
  moduleNumber: string;
  title: string;
  level: 'BEGINNER' | 'INTERMEDIATE';
  description: string;
  duration: string;
  videoCount: number;
  noteLanguage: string;
}

export const MODULE_SUMMARIES: Record<string, ModuleSummaryData> = {
  '0': {
    id: '0',
    moduleNumber: 'MODULE 00',
    title: 'IELTS পরিচিতি',
    level: 'BEGINNER',
    description: 'এই module-এ আপনি IELTS পরীক্ষা সম্পর্কে সম্পূর্ণ ধারণা পাবেন — Academic বনাম General Training, band score, registration, এবং একটি বাস্তবসম্মত study plan কিভাবে তৈরি করবেন তা পর্যন্ত।',
    duration: '~৪৫ মিনিট',
    videoCount: 28,
    noteLanguage: 'বাংলায় note',
  },
  '1': {
    id: '1',
    moduleNumber: 'MODULE 01',
    title: 'Listening Module',
    level: 'BEGINNER',
    description: 'Listening-এর প্রতিটি question type, accent চিনতে শেখা, distractor সামলানো, এবং section-by-section কৌশল — এই module-এ সব কিছু থাকছে।',
    duration: '~১ ঘন্টা',
    videoCount: 31,
    noteLanguage: 'বাংলায় note',
  },
  '2': {
    id: '2',
    moduleNumber: 'MODULE 02',
    title: 'Reading Module',
    level: 'BEGINNER',
    description: 'Skimming, scanning, True/False/Not Given-এর সূক্ষ্ম পার্থক্য, এবং passage-এর paraphrase চিনে নেওয়ার technique — সব এই module-এ।',
    duration: '~১ ঘন্টা',
    videoCount: 34,
    noteLanguage: 'বাংলায় note',
  },
  '3': {
    id: '3',
    moduleNumber: 'MODULE 03',
    title: 'Writing Module',
    level: 'INTERMEDIATE',
    description: 'চারটি assessment criteria, প্রতিটি chart type-এর জন্য structure, পাঁচ ধরণের Task 2 essay, এবং Band 6 থেকে Band 9 essay-র তুলনা — সবচেয়ে বড় module!',
    duration: '~২ ঘন্টা',
    videoCount: 47,
    noteLanguage: 'বাংলায় note',
  },
  '4': {
    id: '4',
    moduleNumber: 'MODULE 04',
    title: 'Speaking Module',
    level: 'INTERMEDIATE',
    description: 'Examiner-এর সাথে কীভাবে কথা বলবেন, cue card-এ ২ মিনিট কথা চালিয়ে যাবেন কীভাবে, এবং Part 3-এ abstract প্রশ্নের জবাব দেওয়ার technique।',
    duration: '~১ ঘন্টা',
    videoCount: 29,
    noteLanguage: 'বাংলায় note',
  },
  '5': {
    id: '5',
    moduleNumber: 'MODULE 05',
    title: 'Grammar Foundations',
    level: 'BEGINNER',
    description: 'Tense, conditional, passive voice, article — যেগুলো IELTS-এ সবচেয়ে বেশি দরকার এবং South Asian student-রা যেগুলোতে সবচেয়ে বেশি ভুল করে।',
    duration: '~১ ঘন্টা',
    videoCount: 27,
    noteLanguage: 'বাংলায় note',
  },
  '6': {
    id: '6',
    moduleNumber: 'MODULE 06',
    title: 'Vocabulary Building',
    level: 'INTERMEDIATE',
    description: 'Academic Word List, topic-wise vocabulary bank, collocations, paraphrasing — Writing ও Speaking দুই-ই উপকৃত হবে।',
    duration: '~৪৩ মিনিট',
    videoCount: 22,
    noteLanguage: 'বাংলায় note',
  },
  '7': {
    id: '7',
    moduleNumber: 'MODULE 07',
    title: 'Pronunciation Training',
    level: 'INTERMEDIATE',
    description: 'Bengali speaker-রা যে sound-গুলোতে সবচেয়ে বেশি ভুল করেন (v/w, /θ/, vowel length) — সেগুলোর জন্য টার্গেটেড practice এবং self-recording-এর পদ্ধতি।',
    duration: '~৪৩ মিনিট',
    videoCount: 25,
    noteLanguage: 'বাংলায় note',
  },
  '8': {
    id: '8',
    moduleNumber: 'MODULE 08',
    title: 'Test-Taking Strategy',
    level: 'INTERMEDIATE',
    description: '8-week, ৮-week, ১২-week study plan; mock test কীভাবে নেবেন, test day-এর আগের রাতের checklist, এবং anxiety সামলানোর technique।',
    duration: '~৩০ মিনিট',
    videoCount: 22,
    noteLanguage: 'বাংলায় note',
  },
  '9': {
    id: '9',
    moduleNumber: 'MODULE 09',
    title: 'Test-এর পরে যা যা',
    level: 'BEGINNER',
    description: 'TRF বুঝুন, কোন result-এ EOR (Enquiry on Results) চাইবেন, কখন retake করবেন, এবং One Skill Retake আপনার জন্য সঠিক কি না।',
    duration: '~২০ মিনিট',
    videoCount: 17,
    noteLanguage: 'বাংলায় note',
  },
  '10': {
    id: '10',
    moduleNumber: 'MODULE 10',
    title: 'Mock Tests & Practice Library',
    level: 'INTERMEDIATE',
    description: 'Cambridge IELTS book কোনগুলো ভালো, কোথা থেকে বিনামূল্যে practice test পাবেন, এবং walkthrough video কীভাবে কাজে লাগাবেন।',
    duration: '~৩০ মিনিট',
    videoCount: 18,
    noteLanguage: 'বাংলায় note',
  },
};

// ─── Module Notes View (Placeholder) ──────────────────────────────────────────

interface ModuleNotesViewProps {
  moduleId: string;
  subSections: string[];
}

function ModuleNotesView({ moduleId, subSections }: ModuleNotesViewProps) {
  const summary = MODULE_SUMMARIES[moduleId];
  const notesContent = NOTES_CONTENT[moduleId];

  if (notesContent) {
    return (
      <div className="bg-[#0d131f] border border-slate-800/60 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-violet-600/20 rounded-xl">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-white">
            {summary ? `${summary.moduleNumber} — ${summary.title}` : `Module ${moduleId}`} Notes
          </h3>
        </div>
        {notesContent}
      </div>
    );
  }

  return (
    <div className="bg-[#0d131f] border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-violet-600/20 rounded-xl">
          <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-white">
          {summary ? `${summary.moduleNumber} — ${summary.title}` : `Module ${moduleId}`} Notes
        </h3>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        এই section-এ প্রতিটি sub-topic-এর জন্য structured notes থাকবে। এখনো content যোগ করা হয়নি — শীঘ্রই আসছে।
      </p>

      <div className="space-y-3 mt-4">
        {subSections.map((subId) => (
          <div
            key={subId}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-300">{subId}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">Sub-section {subId}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Notes coming soon</p>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-slate-700/40 text-[10px] text-slate-500 font-medium">
              Coming soon
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-section ID map per module ────────────────────────────────────────────

const MODULE_SUBSECTIONS: Record<string, string[]> = {
  '0': ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7'],
  '1': ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'],
  '2': ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'],
  '3': ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9'],
  '4': ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8'],
  '5': ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7'],
  '6': ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6'],
  '7': ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6'],
  '8': ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6'],
  '9': ['9.1', '9.2', '9.3', '9.4', '9.5'],
  '10': ['10.1', '10.2', '10.3', '10.4', '10.5'],
};

// ─── Module Notes Content ─────────────────────────────────────────────────────

const MODULE_00_NOTES = (
  <div className="space-y-8 text-slate-300 leading-relaxed max-w-4xl">

    {/* OVERVIEW / WHAT YOU WILL LEARN */}
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2">
        🎯 এই module-এ যা শিখবেন
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
        <li className="flex items-center gap-2">✨ IELTS কী এবং কেন এটি গুরুত্বপূর্ণ</li>
        <li className="flex items-center gap-2">✨ Academic vs General Training — কোনটি আপনার জন্য</li>
        <li className="flex items-center gap-2">✨ Paper-based, Computer-delivered ও IELTS Online</li>
        <li className="flex items-center gap-2">✨ Band scoring — ০ থেকে ৯ scale ব্যাখ্যা</li>
        <li className="flex items-center gap-2">✨ Test day-এর format ও timing</li>
        <li className="flex items-center gap-2">✨ Registration, fees ও ID requirements</li>
        <li className="flex items-center gap-2">✨ Target band ঠিক করা ও study plan তৈরি</li>
      </ul>
    </div>

    {/* 0.1 SECTION */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        0.1 IELTS কী এবং কেন এটি গুরুত্বপূর্ণ
      </h2>
      <p>
        <strong className="text-white">IELTS</strong> মানে <span className="text-rose-400 font-medium">International English Language Testing System</span>। এটি বিশ্বের সবচেয়ে জনপ্রিয় English proficiency পরীক্ষা, যা jointly পরিচালনা করে তিনটি প্রতিষ্ঠান:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center font-semibold text-slate-200">British Council</div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center font-semibold text-slate-200">IDP: IELTS Australia</div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center font-semibold text-slate-200">Cambridge University Press & Assessment</div>
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mt-4">কেন IELTS দেওয়া হয়?</h3>
      <ul className="list-disc list-inside space-y-2 pl-2">
        <li><strong className="text-slate-100">University ভর্তি:</strong> যুক্তরাজ্য, অস্ট্রেলিয়া, কানাডা, নিউজিল্যান্ড এবং অনেক ইউরোপীয় বিশ্ববিদ্যালয় IELTS score দেখে ভর্তি দেয়।</li>
        <li><strong className="text-slate-100">Immigration (অভিবাসন):</strong> বিভিন্ন দেশে permanent residency বা skilled worker visa-র জন্য IELTS band score প্রয়োজন হয়।</li>
        <li><strong className="text-slate-100">UKVI (UK Visas and Immigration):</strong> ব্রিটিশ সরকার কিছু নির্দিষ্ট visa-র জন্য IELTS for UKVI বা IELTS Life Skills পরীক্ষা বাধ্যতামূলক করেছে।</li>
        <li><strong className="text-slate-100">কর্মসংস্থান:</strong> অনেক আন্তর্জাতিক কোম্পানি এবং পেশাদার সংস্থা (যেমন — nursing council, medical board) IELTS score চায়।</li>
      </ul>

      {/* TABLE: IELTS vs Others */}
      <div className="overflow-x-auto my-4 border border-slate-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr>
              <th className="p-3">পরীক্ষা</th>
              <th className="p-3">পরিচালনা করে</th>
              <th className="p-3">কোথায় বেশি গ্রাহ্য</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr>
              <td className="p-3 font-semibold text-rose-400">IELTS</td>
              <td className="p-3">British Council / IDP / Cambridge</td>
              <td className="p-3">UK, Australia, Canada, NZ, Europe</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">TOEFL</td>
              <td className="p-3">ETS (আমেরিকান)</td>
              <td className="p-3">USA, এবং আন্তর্জাতিকভাবে</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">PTE</td>
              <td className="p-3">Pearson</td>
              <td className="p-3">Australia, UK, New Zealand</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* KEY TAKEAWAY CARD */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-sm">
        <strong className="text-amber-400 font-bold block mb-1">💡 মূল কথা:</strong>
        IELTS হলো আন্তর্জাতিক English দক্ষতার প্রমাণপত্র — university, visa, immigration এবং কাজের জন্য এটি বিশ্বজুড়ে ১৪০টিরও বেশি দেশে গৃহীত হয়।
      </div>
    </section>

    {/* 0.2 SECTION */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        0.2 Academic vs General Training — কোনটি আপনার জন্য?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Academic Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
          <h3 className="text-lg font-bold text-rose-400">Academic Module</h3>
          <p className="text-sm"><strong className="text-slate-200">কার জন্য:</strong> যারা বিশ্ববিদ্যালয়ে undergraduate বা postgraduate ভর্তি হতে চান, অথবা professional registration (যেমন — doctor, nurse, engineer) করতে চান।</p>
          <ul className="text-xs space-y-1.5 text-slate-400">
            <li>• <strong>Listening ও Speaking:</strong> Academic এবং General Training উভয়ের জন্য একই।</li>
            <li>• <strong>Reading:</strong> জটিল academic passage (journals, research papers)।</li>
            <li>• <strong>Writing Task 1:</strong> Graph, chart, table বা diagram describe।</li>
            <li>• <strong>Writing Task 2:</strong> Essay লিখতে হয়।</li>
          </ul>
        </div>

        {/* General Training Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
          <h3 className="text-lg font-bold text-sky-400">General Training Module</h3>
          <p className="text-sm"><strong className="text-slate-200">কার জন্য:</strong> যারা skilled migration (যেমন — Australia PR, Canada PR), কাজের visa, অথবা secondary schooling-এর জন্য আবেদন করছেন।</p>
          <ul className="text-xs space-y-1.5 text-slate-400">
            <li>• <strong>Reading:</strong> সহজ, practical passage (advertisement, workplace notice)।</li>
            <li>• <strong>Writing Task 1:</strong> Formal বা informal letter লিখতে হয়।</li>
            <li>• <strong>Writing Task 2:</strong> Academic-এর মতোই essay।</li>
          </ul>
        </div>
      </div>

      {/* DECISION TREE CODE BOX */}
      <h3 className="text-lg font-semibold text-slate-200">সিদ্ধান্ত নেওয়ার সহজ উপায়</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs md:text-sm text-slate-300 leading-relaxed">
        আপনি কি বিশ্ববিদ্যালয়ে ভর্তি হতে চান?{"\n"}
        ├── <strong>হ্যাঁ</strong> → Academic নিন{"\n"}
        └── <strong>না</strong>  → আপনি কি skilled migration বা work visa চান?{"\n"}
            &nbsp;&nbsp;&nbsp;&nbsp;├── <strong>হ্যাঁ</strong> → General Training নিন{"\n"}
            &nbsp;&nbsp;&nbsp;&nbsp;└── <strong>নিশ্চিত না</strong> → যে দেশ বা প্রতিষ্ঠানে apply করছেন, তাদের requirements দেখুন
      </div>

      {/* CALLOUT BOX */}
      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 text-indigo-200 text-sm">
        <strong className="text-indigo-400 font-bold">গুরুত্বপূর্ণ:</strong> একই Band score থাকলে Academic score General Training-এর জায়গায় ব্যবহার করা যায়, কিন্তু উল্টোটা সাধারণত যায় না।
      </div>

      {/* KEY TAKEAWAY */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-sm">
        <strong className="text-amber-400 font-bold block mb-1">💡 মূল কথা:</strong>
        University admission-এর জন্য Academic এবং immigration বা কাজের জন্য সাধারণত General Training — কোনটি দেবেন তা সর্বদা আপনার destination institution বা visa authority-র requirements দেখে নিশ্চিত করুন।
      </div>
    </section>

    {/* 0.3 SECTION */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        0.3 Paper-based vs Computer-delivered vs IELTS Online
      </h2>

      {/* FORMAT COMPARISON TABLE */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl my-4">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr>
              <th className="p-3">বিষয়</th>
              <th className="p-3">Paper-based</th>
              <th className="p-3">Computer-delivered</th>
              <th className="p-3">IELTS Online</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr>
              <td className="p-3 font-semibold text-slate-300">L/R/W</td>
              <td className="p-3">কাগজে</td>
              <td className="p-3">কম্পিউটারে</td>
              <td className="p-3">কম্পিউটারে</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Speaking</td>
              <td className="p-3">Face-to-face</td>
              <td className="p-3">Face-to-face</td>
              <td className="p-3">Video call</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Result সময়</td>
              <td className="p-3 text-rose-400 font-medium">~১৩ দিন</td>
              <td className="p-3 text-emerald-400 font-medium">৩–৫ দিন</td>
              <td className="p-3 text-sky-400 font-medium">৬–৮ দিন</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Test centre</td>
              <td className="p-3">হ্যাঁ</td>
              <td className="p-3">হ্যাঁ</td>
              <td className="p-3">না (বাড়িতে)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-sm">
        <strong className="text-amber-400 font-bold block mb-1">💡 মূল কথা:</strong>
        তিনটি format-এ Band score সম্পূর্ণ সমতুল্য — তাই শুধু আপনার সুবিধা, result দ্রুততা এবং institutions-এর acceptance policy বিবেচনা করে format বেছে নিন।
      </div>
    </section>

    {/* 0.4 SECTION */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        0.4 Band Scoring Explained (0–9 scale, half bands, overall calculation)
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center"><span className="text-xs text-slate-400 block">Band 9</span><strong className="text-rose-400 text-base">Expert User</strong></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center"><span className="text-xs text-slate-400 block">Band 7-8</span><strong className="text-sky-400 text-base">Good User</strong></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center"><span className="text-xs text-slate-400 block">Band 6</span><strong className="text-emerald-400 text-base">Competent</strong></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center"><span className="text-xs text-slate-400 block">Band 5</span><strong className="text-amber-400 text-base">Modest User</strong></div>
      </div>

      {/* EXAMPLES CODE BOX */}
      <h3 className="text-lg font-semibold text-slate-200">Calculation Examples</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono space-y-1">
          <strong className="text-rose-400 block mb-2">উদাহরণ ১:</strong>
          <div>L: 7.0 | R: 6.5 | W: 6.0 | S: 6.5</div>
          <div>মোট = 26.0</div>
          <div className="text-emerald-400 font-bold pt-1">২৬ ÷ ৪ = ৬.৫ → Overall Band: 6.5</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono space-y-1">
          <strong className="text-rose-400 block mb-2">উদাহরণ ২:</strong>
          <div>L: 8.0 | R: 7.5 | W: 6.5 | S: 7.0</div>
          <div>মোট = 29.0</div>
          <div className="text-emerald-400 font-bold pt-1">২৯ ÷ ৪ = ৭.২৫ → Rounded → Overall: 7.0</div>
        </div>
      </div>
    </section>

    {/* 0.5 SECTION */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        0.5 Test Day Format & Timing
      </h2>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr>
              <th className="p-3">Section</th>
              <th className="p-3">সময়</th>
              <th className="p-3">বিস্তারিত</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr><td className="p-3 font-semibold text-rose-400">Listening</td><td className="p-3">~৪০ মিনিট</td><td className="p-3">৪০টি প্রশ্ন (৪টি section)</td></tr>
            <tr><td className="p-3 font-semibold text-sky-400">Reading</td><td className="p-3">৬০ মিনিট</td><td className="p-3">৪০টি প্রশ্ন (৩টি passage)</td></tr>
            <tr><td className="p-3 font-semibold text-emerald-400">Writing</td><td className="p-3">৬০ মিনিট</td><td className="p-3">Task 1 (150 words) + Task 2 (250 words)</td></tr>
            <tr><td className="p-3 font-semibold text-amber-400">Speaking</td><td className="p-3">১১–১৪ মিনিট</td><td className="p-3">Part 1, Part 2 (Cue card), Part 3</td></tr>
            <tr className="bg-slate-900/50 font-bold"><td className="p-3 text-white">মোট</td><td className="p-3 text-rose-400" colSpan={2}>~২ ঘণ্টা ৪৫ মিনিট</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-sm">
        <strong className="text-amber-400 font-bold block mb-1">💡 মূল কথা:</strong>
        Speaking ছাড়া বাকি তিনটি section সাধারণত একই দিনে পর পর হয় — তাই test day-এ mental endurance অত্যন্ত গুরুত্বপূর্ণ।
      </div>
    </section>

    {/* 0.6 & 0.7 SECTIONS & SUMMARY */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        0.7 Target Band & Study Plan
      </h2>

      {/* SAMPLE STUDY ROUTINE BOX */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <h3 className="text-lg font-bold text-white">প্রতিদিনের Study Routine (নমুনা — ২ ঘণ্টা)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">⏱️ 30m Listening</div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">⏱️ 30m Reading</div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">⏱️ 30m Writing</div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">⏱️ 30m Speaking</div>
        </div>
      </div>

      {/* COMPLETION / XP BANNER */}
      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
        <div className="text-2xl">🎉</div>
        <h3 className="text-lg font-bold text-emerald-400">নোট সম্পন্ন — XP সংগ্রহ হয়েছে!</h3>
        <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
          +10 XP
        </span>
      </div>
    </section>

  </div>
);

const MODULE_01_NOTES = (
  <div className="space-y-10 text-slate-300 leading-relaxed max-w-4xl">

    {/* OVERVIEW CARD */}
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎯 এই module-এ যা শিখবেন
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">লক্ষ্য Band: 6.5 – 8.0</span>
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">স্তর: একদম শুরু থেকে উন্নত</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 italic">ভাষা: বাংলা (IELTS পরিভাষা ইংরেজিতে রাখা হয়েছে)</p>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300 pt-2">
        <li className="flex items-center gap-2">🔹 Format ও section overview</li>
        <li className="flex items-center gap-2">🔹 Question types — MCQ, Matching, Map labeling, Completion</li>
        <li className="flex items-center gap-2">🔹 Core strategies — prediction ও keyword spotting</li>
        <li className="flex items-center gap-2">🔹 Distractor ও answer change সামলানো</li>
        <li className="flex items-center gap-2">🔹 Accent training — British, Australian, American</li>
        <li className="flex items-center gap-2">🔹 Spelling ও grammar traps</li>
        <li className="flex items-center gap-2">🔹 Section-by-section walkthrough</li>
        <li className="flex items-center gap-2">🔹 Full mock test কীভাবে নেবেন</li>
      </ul>
    </div>

    {/* 1.1 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.1 Format Overview — IELTS Listening পরীক্ষার গঠন
      </h2>
      <h3 className="text-lg font-semibold text-slate-200">পরীক্ষাটি কেমন দেখতে?</h3>
      <p>
        IELTS Listening পরীক্ষা হলো তোমার শোনার দক্ষতার পরীক্ষা। এটি Academic এবং General Training — দুটি ধরনের জন্যই একই format।
      </p>

      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
        <strong className="text-white font-bold block border-b border-slate-800 pb-1">মূল তথ্য একনজরে:</strong>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
          <li>• <strong>মোট Section:</strong> ৪টি (Section 1, Section 2, Section 3, Section 4)</li>
          <li>• <strong>মোট প্রশ্ন:</strong> ৪০টি</li>
          <li>• <strong>Listening-এর সময়:</strong> প্রায় ৩০ মিনিট</li>
          <li>• <strong>Answer Transfer-এর সময় (Paper-based):</strong> ১০ মিনিট অতিরিক্ত</li>
          <li className="sm:col-span-2">• <strong>Computer-based test:</strong> Answer transfer-এর জন্য আলাদা সময় নেই — সরাসরি computer-এ answer দেওয়া হয়</li>
        </ul>
      </div>

      <h3 className="text-lg font-semibold text-slate-200 pt-2">প্রতিটি Section কী ধরনের?</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr>
              <th className="p-3">Section</th>
              <th className="p-3">বিষয়</th>
              <th className="p-3">Speaker সংখ্যা</th>
              <th className="p-3">পরিস্থিতি</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr><td className="p-3 font-semibold text-white">Section 1</td><td className="p-3">সাধারণ জীবনের বিষয়</td><td className="p-3">২ জন</td><td className="p-3">Conversation (যেমন: phone call, booking)</td></tr>
            <tr><td className="p-3 font-semibold text-white">Section 2</td><td className="p-3">সাধারণ জীবনের বিষয়</td><td className="p-3">১ জন</td><td className="p-3">Monologue (যেমন: tour guide, radio broadcast)</td></tr>
            <tr><td className="p-3 font-semibold text-white">Section 3</td><td className="p-3">শিক্ষামূলক বিষয়</td><td className="p-3">২–৪ জন</td><td className="p-3">Academic discussion (যেমন: ছাত্র-শিক্ষক আলোচনা)</td></tr>
            <tr><td className="p-3 font-semibold text-white">Section 4</td><td className="p-3">শিক্ষামূলক বিষয়</td><td className="p-3">১ জন</td><td className="p-3">Academic lecture (বিশ্ববিদ্যালয়ের বক্তৃতা)</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 space-y-2">
        <strong className="text-white font-bold block">গুরুত্বপূর্ণ নিয়মগুলো:</strong>
        <ul className="list-disc list-inside space-y-1">
          <li>Audio একবারই বাজানো হয় — দ্বিতীয়বার সুযোগ নেই।</li>
          <li>প্রতিটি Section-এর আগে কিছু সময় দেওয়া হয় questions পড়ার জন্য — এই সময়টি অত্যন্ত মূল্যবান।</li>
          <li>প্রতিটি Section-এর পরে কিছু সময় দেওয়া হয় answers পরীক্ষা করার জন্য।</li>
          <li>Paper-based test-এ ১০ মিনিটের transfer time-এ answer sheet-এ answer লিখতে হয়।</li>
          <li>Spelling ভুল হলে marks কাটা যাবে।</li>
        </ul>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        IELTS Listening-এ ৪টি Section, ৪০টি প্রশ্ন, এবং audio একবারই বাজানো হয়। Paper-based test-এ শেষে ১০ মিনিট answer transfer-এর জন্য পাওয়া যায়।
      </div>
    </section>

    {/* 1.2 SECTION */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.2 Question Types Deep-Dive — সব ধরনের প্রশ্ন
      </h2>
      <p>IELTS Listening-এ মূলত ছয় ধরনের question type আসে। প্রতিটি বোঝা দরকার — কারণ প্রতিটির জন্য আলাদা কৌশল কাজ করে।</p>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Question Type 1: MCQ (Multiple Choice Questions)</h3>
        <p className="text-sm"><strong>MCQ কী?</strong> তোমাকে একটি প্রশ্ন দেওয়া হবে এবং তিনটি (A, B, C) বা পাঁচটি (A, B, C, D, E) option দেওয়া হবে। সঠিক উত্তর বেছে নিতে হবে।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
          <strong>উদাহরণ:</strong><br/>
          What time does the library close on Sundays?<br/>
          A) 4:00 pm | B) 5:30 pm | C) 6:00 pm
        </div>
        <div className="space-y-1 text-sm">
          <strong className="text-slate-200">কৌশল:</strong>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            <li>প্রথমে সব option পড়ো এবং keyword চিহ্নিত করো।</li>
            <li>Audio শুনতে শুনতে ভুল options কেটে দাও (elimination method)।</li>
            <li>Distractor-এ সাবধান — প্রথমে একটি option সঠিক মনে হতে পারে কিন্তু speaker পরে সেটি পরিবর্তন করেন।</li>
            <li>শেষ উত্তরটিই সঠিক — "Actually, it's 5:30" শুনলে 5:30 লিখবে।</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Question Type 2: Matching</h3>
        <p className="text-sm"><strong>Matching কী?</strong> একটি তালিকা থেকে অন্য একটি তালিকার সাথে মেলাতে হয়। যেমন — পাঁচটি ব্যক্তির নামের সাথে পাঁচটি কাজ মেলানো।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
          <strong>উদাহরণ:</strong><br/>
          Match each person with their role.<br/>
          Dr. Smith — A. Laboratory | Ms. Jones — B. Administration | Mr. Brown — C. Teaching
        </div>
        <div className="space-y-1 text-sm">
          <strong className="text-slate-200">কৌশল:</strong>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            <li>সব option আগে পড়ো।</li>
            <li>Audio-তে প্রতিটি নাম শোনামাত্র সেই ব্যক্তির তথ্যে মনোযোগ দাও।</li>
            <li>সম্পূর্ণ মেলানো শেষে একবার review করো।</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Question Type 3: Plan / Map / Diagram Labeling</h3>
        <p className="text-sm"><strong>Map Labeling কী?</strong> একটি ছবি বা নকশা দেওয়া হবে (যেমন: একটি ক্যাম্পাসের মানচিত্র বা একটি যন্ত্রের diagram)। audio শুনে সঠিক জায়গায় শব্দ বা অক্ষর বসাতে হবে।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
          <strong>উদাহরণ:</strong><br/>
          The fire exit is located next to the main entrance, on the north side of the building.<br/>
          → Answer: "fire exit" or "B" (যদি letter-matching হয়)
        </div>
        <div className="space-y-1 text-sm">
          <strong className="text-slate-200">কৌশল:</strong>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            <li>Audio শুরুর আগে ছবিটি ভালো করে দেখো — কোন দিক উত্তর, কোন দিক দক্ষিণ।</li>
            <li>Direction words শোনো: "opposite", "adjacent to", "next to", "turn left", "straight ahead", "between"।</li>
            <li>Speaker সাধারণত ছবির মতো একটি নির্দিষ্ট ক্রমে স্থান বর্ণনা করেন — সেই ক্রম অনুসরণ করো।</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Question Type 4: Form / Note / Table / Flow-chart / Summary Completion</h3>
        <p className="text-sm"><strong>Form completion কী?</strong> একটি form, table, বা flow-chart-এ ফাঁকা জায়গা পূরণ করতে হবে।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
          <strong>উদাহরণ (Form completion):</strong><br/>
          Name: Sarah ___________ | Phone number: 07 ___________ | Appointment date: ___________ March<br/>
          Audio: "My name is Sarah Thompson. You can reach me on 07-double 4-3-9-2."<br/>
          → Answers: Thompson | 443-92 | (date শুনে লেখো)
        </div>
        <div className="space-y-1 text-sm">
          <strong className="text-slate-200">কৌশল:</strong>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            <li>Word limit মেনে চলো — সাধারণত "NO MORE THAN TWO WORDS AND/OR A NUMBER" লেখা থাকে।</li>
            <li>Spelling সতর্কভাবে লিখবে — বিশেষত নাম এবং ঠিকানা।</li>
            <li>Table completion-এ column header দেখে বুঝবে কোন ধরনের তথ্য আসবে।</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Question Type 5: Sentence Completion</h3>
        <p className="text-sm"><strong>Sentence completion কী?</strong> একটি অসম্পূর্ণ বাক্য দেওয়া হয় এবং সেটি সম্পূর্ণ করতে হয়।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
          <strong>উদাহরণ:</strong><br/>
          The museum is open from Monday to Saturday but is closed on ____________.<br/>
          Audio: "We're open every day except Sundays." → Answer: Sundays
        </div>
        <div className="space-y-1 text-sm">
          <strong className="text-slate-200">কৌশল:</strong>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            <li>বাক্যটি পড়ে বোঝো কোন ধরনের শব্দ দরকার — noun? adjective? number?</li>
            <li>Word limit মানো — সাধারণত এক বা দুটি শব্দ।</li>
            <li>Grammar মিলিয়ে নাও — বাক্যটি grammatically সঠিক হওয়া চাই।</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Question Type 6: Short-Answer Questions</h3>
        <p className="text-sm"><strong>Short-answer কী?</strong> একটি প্রশ্নের ছোট উত্তর দিতে হয় — সাধারণত এক থেকে তিনটি শব্দে।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
          <strong>উদাহরণ:</strong><br/>
          What does the student need to submit first?<br/>
          Audio: "You'll need to hand in your research proposal before anything else." → Answer: research proposal
        </div>
        <div className="space-y-1 text-sm">
          <strong className="text-slate-200">কৌশল:</strong>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            <li>প্রশ্নটি ভালো করে পড়ো — "What", "When", "Where", "How many"?</li>
            <li>Word limit-এর মধ্যে থাকো।</li>
            <li>Article ("a", "the") গণনায় ধরা হয় কিনা নির্দেশিকা দেখো।</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        প্রতিটি question type-এর নিজস্ব কৌশল আছে। MCQ-তে elimination, Map-এ direction vocabulary, Completion-এ word limit — এগুলো মাথায় রেখে প্রস্তুতি নাও।
      </div>
    </section>

    {/* 1.3 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.3 Core Strategies — মূল কৌশলসমূহ
      </h2>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">কৌশল ১: Prediction (আগে থেকে অনুমান করা)</h3>
        <p className="text-sm">Audio শুরু হওয়ার আগে তোমাকে ৩০–৪৫ সেকেন্ড দেওয়া হয় questions পড়ার জন্য। এই সময়টি নষ্ট করা যাবে না।</p>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-sm">
          <strong className="text-slate-200 block">Prediction কিভাবে করবে:</strong>
          <p className="text-xs text-slate-400">প্রশ্নটি পড়ে ভাবো: "এখানে কোন ধরনের তথ্য আসবে?" সংখ্যা? তারিখ? নাম? স্থান? কারণ?</p>
          <ul className="text-xs font-mono space-y-1 text-slate-300 pt-1">
            <li>• <i>"The course starts on ___________"</i> — এখানে একটি date আসবে।</li>
            <li>• <i>"The entrance fee is ___________ per person"</i> — এখানে একটি number/currency আসবে।</li>
          </ul>
        </div>
        <p className="text-xs text-slate-400"><strong>Prediction-এর সুবিধা:</strong> Audio শুনতে শুনতে তুমি সঠিক তথ্যে মনোযোগ দিতে পারবে — হারিয়ে যাবে না।</p>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-bold text-white">কৌশল ২: Keyword Spotting (মূল শব্দ খোঁজা)</h3>
        <p className="text-sm">Audio-তে question-এর হুবহু শব্দ ব্যবহার না করে paraphrase করা হয়। তাই audio-তে keyword বা তার synonym শুনতে হবে।</p>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-1">
          <div>Question: "The shop is near the ___________."</div>
          <div>Audio: "You'll find it right beside the post office." → "beside" = "near"</div>
          <div className="text-white font-bold">Answer: post office</div>
        </div>
        <p className="text-xs text-slate-400"><strong>Keyword Spotting practice:</strong> প্রতিটি question পড়ে একটি বা দুটি মূল শব্দ (keyword) চিহ্নিত করো যা audio-তে বা তার synonym হিসেবে আসতে পারে।</p>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-bold text-white">কৌশল ৩: Signposting Words (দিকনির্দেশক শব্দ)</h3>
        <p className="text-sm">Speaker-রা নিজেদের কথার মধ্যে বিশেষ কিছু শব্দ ব্যবহার করেন যা বোঝায় যে গুরুত্বপূর্ণ তথ্য আসছে।</p>
        
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
              <tr><th className="p-2.5">ক্যাটাগরি</th><th className="p-2.5">Signposting Words</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr><td className="p-2.5 font-semibold text-white">নতুন বিষয় শুরু</td><td className="p-2.5 font-mono">"Now, ...", "Moving on to...", "Turning to..."</td></tr>
              <tr><td className="p-2.5 font-semibold text-white">উদাহরণ</td><td className="p-2.5 font-mono">"For example, ...", "For instance, ...", "Such as..."</td></tr>
              <tr><td className="p-2.5 font-semibold text-white">বিপরীত</td><td className="p-2.5 font-mono">"However, ...", "On the other hand, ...", "But actually..."</td></tr>
              <tr><td className="p-2.5 font-semibold text-white">কারণ</td><td className="p-2.5 font-mono">"Because...", "As a result...", "Therefore..."</td></tr>
              <tr><td className="p-2.5 font-semibold text-white">সমাপ্তি</td><td className="p-2.5 font-mono">"Finally, ...", "In conclusion, ...", "To sum up..."</td></tr>
              <tr><td className="p-2.5 font-semibold text-white">জোর দেওয়া</td><td className="p-2.5 font-mono">"The key point is...", "It's important to note that...", "Above all..."</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400"><strong>কীভাবে ব্যবহার করবে:</strong> Section 4 (academic lecture)-এ signposting words সবচেয়ে বেশি ব্যবহার হয়। এই শব্দগুলো শুনলে বুঝবে পরবর্তী বাক্যে একটি গুরুত্বপূর্ণ answer থাকতে পারে।</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Prediction করো, Keyword খোঁজো, এবং Signposting words শুনে সতর্ক হও — এই তিনটি কৌশল একসাথে ব্যবহার করলে score উল্লেখযোগ্যভাবে বাড়বে।
      </div>
    </section>

    {/* 1.4 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.4 Handling Distractors & Answer Changes — ফাঁদ এড়ানোর উপায়
      </h2>
      <p><strong>Distractor কী?</strong> Distractor হলো audio-তে এমন তথ্য যা প্রথমে সঠিক মনে হয়, কিন্তু আসলে ভুল। IELTS পরীক্ষায় ইচ্ছাকৃতভাবে এই ফাঁদ রাখা হয়।</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">ধরন ১: Speaker নিজেই উত্তর পরিবর্তন করেন</strong>
          <p className="text-slate-400">"The meeting is at 3 pm... actually, wait — it's been moved to 4:30."</p>
          <p className="font-mono text-slate-200">→ Answer: 4:30 (শেষের তথ্যই সঠিক)</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">ধরন ২: প্রথম শোনা তথ্য ভুল বলে জানানো হয়</strong>
          <p className="text-slate-400">"I thought the price was £50, but it's actually £45."</p>
          <p className="font-mono text-slate-200">→ Answer: £45</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">ধরন ৩: দ্বিমত পোষণ করে শেষে সম্মত হওয়া</strong>
          <p className="text-slate-400">Speaker A: "Shall we meet at the library?" | Speaker B: "Actually, the café would be better." | Speaker A: "Yes, good idea."</p>
          <p className="font-mono text-slate-200">→ Answer: café</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">ধরন ৪: Synonym দিয়ে বিভ্রান্ত করা</strong>
          <p className="text-slate-400">Question-এ "expensive" লেখা, audio-তে "affordable" বলা — কিন্তু context শুনলে বুঝবে সেটি ব্যয়বহুলই।</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-sm space-y-1.5">
        <strong className="text-white font-bold block">Distractor থেকে বাঁচার উপায়:</strong>
        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
          <li>সম্পূর্ণ বাক্যটি শোনার আগে answer লেখা শুরু করো না — পুরো তথ্য শোনো।</li>
          <li>"Actually", "But", "However", "Wait" — এই শব্দগুলো শুনলে সতর্ক হও, উত্তর পরিবর্তন হতে পারে।</li>
          <li>Question answer sheet-এ pencil দিয়ে লেখো যাতে পরিবর্তন করতে পারো।</li>
        </ul>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Distractor IELTS Listening-এর সবচেয়ে বড় ফাঁদ। "Actually" বা "Wait" শুনলেই সজাগ হও — speaker উত্তর বদলাচ্ছেন।
      </div>
    </section>

    {/* 1.5 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.5 Accents Training — বিভিন্ন উচ্চারণ চেনার দক্ষতা
      </h2>
      <p>IELTS-এ মূলত পাঁচটি ইংরেজি accent ব্যবহার করা হয়: British English, Australian English, American English, Canadian English, এবং New Zealand English।</p>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2.5">শব্দ</th><th className="p-2.5">British</th><th className="p-2.5">Australian</th><th className="p-2.5">American</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            <tr><td className="p-2.5 font-bold font-sans text-white">"water"</td><td className="p-2.5">/ˈwɔːtə/</td><td className="p-2.5">/ˈwɔːdə/</td><td className="p-2.5">/ˈwɑːdər/</td></tr>
            <tr><td className="p-2.5 font-bold font-sans text-white">"can't"</td><td className="p-2.5">/kɑːnt/</td><td className="p-2.5">/kɑːnt/</td><td className="p-2.5">/kænt/</td></tr>
            <tr><td className="p-2.5 font-bold font-sans text-white">"dance"</td><td className="p-2.5">/dɑːns/</td><td className="p-2.5">/dɑːns/</td><td className="p-2.5">/dæns/</td></tr>
            <tr><td className="p-2.5 font-bold font-sans text-white">তারিখ</td><td className="p-2.5 font-sans">"the 5th of March"</td><td className="p-2.5 font-sans">"March 5th"</td><td className="p-2.5 font-sans">"March fifth"</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2 text-slate-300">
        <strong className="text-white font-bold block text-sm">Accent training-এর ব্যবহারিক পরামর্শ:</strong>
        <ul className="list-disc list-inside space-y-1">
          <li>প্রতিদিন BBC News, ABC Australia (Australian), এবং NPR (American) — এই তিনটি source থেকে ৫–১০ মিনিট শোনার অভ্যাস করো।</li>
          <li>Australian accent-এ "day" কে অনেকটা "die"-এর মতো শোনায় — এটি অনেক বাংলাভাষীকে বিভ্রান্ত করে।</li>
          <li>Australian-এ প্রশ্ন না হলেও sentence-এর শেষে intonation উঁচু হতে পারে — এটি statement, প্রশ্ন নয়।</li>
          <li>British accent-এ "r" প্রায়ই silent — "car" শুনতে "cah"-এর মতো লাগে।</li>
          <li>Number বলার সময়: British-এ "hundred and fifty", American-এ "one fifty" বলার প্রবণতা আছে।</li>
        </ul>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 space-y-1">
        <strong className="text-white font-bold block text-sm">বাংলাভাষীদের জন্য বিশেষ পরামর্শ:</strong>
        <p>বাংলাদেশ ও পশ্চিমবঙ্গে সাধারণত Indian English বা British-influenced English-এর সাথে পরিচয় বেশি। তাই Australian এবং New Zealand accents-এ বেশি মনোযোগ দাও — এগুলো IELTS-এ প্রায়ই আসে কিন্তু কম চেনা।</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        British এবং Australian accent সবচেয়ে বেশি IELTS-এ আসে। প্রতিদিন বিভিন্ন accent শোনার অভ্যাস করো — একটু একটু করে কান তৈরি হবে।
      </div>
    </section>

    {/* 1.6 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.6 Spelling & Grammar Traps — বানান ও ব্যাকরণের ফাঁদ
      </h2>
      <p>Spelling ভুল হলে IELTS Listening-এ marks কাটা যায়। এই section-এ সবচেয়ে সাধারণ ভুলগুলো এবং সেগুলো এড়ানোর উপায় আলোচনা করা হলো।</p>

      <div className="space-y-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold text-sm block">Trap 1: Singular vs Plural</strong>
          <p className="text-slate-400">সমস্যা: Speaker বলছেন "tickets" কিন্তু তুমি লিখলে "ticket" — এটি ভুল।</p>
          <div className="font-mono text-slate-300 bg-slate-900 p-2 rounded">"You'll need to bring two forms of identification." → Answer: forms (plural)</div>
          <p className="text-slate-400 pt-1">• <strong>সতর্কতা:</strong> শেষের "-s" বা "-es" মনোযোগ দিয়ে শোনো। "both", "several", "a number of" শুনলে plural হবে। "each", "every", "a" শুনলে singular।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold text-sm block">Trap 2: Numbers — সংখ্যা লেখার নিয়ম</strong>
          <p className="text-slate-400">ফোন নম্বর: "double seven" = 77; "oh" = 0 | বড় সংখ্যা: "twelve hundred" = 1,200 | দশমিক: "three point five" = 3.5 | ভগ্নাংশ: "a quarter" = ¼ বা 0.25</p>
          <div className="font-mono text-slate-300 bg-slate-900 p-2 rounded">"My reference number is 4-double 2-7-oh-3." → Answer: 422703</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold text-sm block">Trap 3: Dates — তারিখ লেখার নিয়ম</strong>
          <p className="text-slate-400">Audio-তে "the twenty-first of March" বললে গ্রহণযোগ্য উত্তর: 21 March / 21st March / March 21। দিন এবং মাস দুটোই লিখবে। Ordinal suffix (st, nd, rd, th) বাধ্যতামূলক নয়।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <strong className="text-white font-bold block">Trap 4: Currency — মুদ্রা</strong>
            <p className="text-slate-400 font-mono">"fifteen pounds fifty" → £15.50 বা 15.50 pounds</p>
            <p className="text-slate-400 font-mono">"twenty-five dollars" → $25 বা 25 dollars</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <strong className="text-white font-bold block">Trap 5: Capital Letters</strong>
            <p className="text-slate-400">নামের ক্ষেত্রে Capital letter ব্যবহার করো: "John Smith", "London"। Form completion-এ নিশ্চিত না হলে Capital দিয়ে রাখা নিরাপদ।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <strong className="text-white font-bold block">Trap 6: American vs British Spelling</strong>
            <p className="text-slate-400">British (colour, centre) ও American (color, center) দুটোই গ্রহণযোগ্য। যেকোনো একটিতে consistent থাকো।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <strong className="text-white font-bold block">Trap 7: Hyphenated Words</strong>
            <p className="text-slate-400 font-mono">"car park" (আলাদা) | "self-employed" (hyphen) | "classroom" (একসাথে)</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Plural, number, date, এবং capital letter — এই চারটি ক্ষেত্রে সবচেয়ে বেশি marks হারানো হয়। প্রতিদিন spelling dictation practice করো।
      </div>
    </section>

    {/* 1.7 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.7 Section-by-Section Walkthroughs — প্রতিটি Section-এর বিস্তারিত গাইড
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
          <h3 className="text-sm font-bold text-white">Section 1: Everyday Conversation</h3>
          <p className="text-slate-400">সহজতম section — booking, enquiry, registration। সাধারণত form completion এবং note completion থাকে।</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-slate-300">
            "Can I take your name please?" → "Yes, it's Claire — C-L-A-I-R-E — Hutchinson." → Answer: Claire Hutchinson
          </div>
          <p className="text-slate-300"><strong>টিপস:</strong> নাম/ঠিকানার spelling মনোযোগ দিয়ে শোনো; "double" ও "oh" খেয়াল করো। ১০/১০ পাওয়ার লক্ষ্য রাখো।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
          <h3 className="text-sm font-bold text-white">Section 2: Monologue (Public Context)</h3>
          <p className="text-slate-400">একজন speaker — museum tour, radio broadcast, local facility announcement। Map labeling ও MCQ থাকে।</p>
          <p className="text-slate-300"><strong>টিপস:</strong> Map-এ ছবির logical path follow করো। Direction words ("on your left", "facing the entrance") মনে রাখো।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
          <h3 className="text-sm font-bold text-white">Section 3: Academic Discussion</h3>
          <p className="text-slate-400">২–৪ জন speaker — assignment, research project। Matching, MCQ, form completion থাকে।</p>
          <p className="text-slate-300"><strong>টিপস:</strong> কে কী বলছে track করো। "What does Tom think...?" এর মতো Opinion question-এ শুধু নির্দিষ্ট speaker-এর কথা শুনবে।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
          <h3 className="text-sm font-bold text-white">Section 4: Academic Lecture</h3>
          <p className="text-slate-400">একজন speaker — university lecture (science, history, psychology)। Note/Sentence completion থাকে।</p>
          <p className="text-slate-300"><strong>টিপস:</strong> Signposting words সবচেয়ে গুরুত্বপূর্ণ। Keyword-এর academic synonym ধরো। Reading time-এ topic অনুমান করো।</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Section 1 সবচেয়ে সহজ, Section 4 সবচেয়ে কঠিন। Section 1 ও 2-এ পূর্ণ নম্বর লক্ষ্য করো — Section 3 ও 4-এর জন্য বাড়তি practice দরকার।
      </div>
    </section>

    {/* 1.8 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        1.8 Full Mock Test নেওয়া ও উত্তর বিশ্লেষণ
      </h2>

      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs text-slate-300">
        <strong className="text-white font-bold text-sm block">Mock Test কিভাবে নেবে?</strong>
        <p>• <strong>ধাপ ১: পরিবেশ তৈরি করো:</strong> শান্ত ঘর, Headphones ব্যবহার করো, Timer চালু করো।</p>
        <p>• <strong>ধাপ ২: পরীক্ষার নিয়ম মেনে চলো:</strong> Reading time ব্যবহার করো, Audio pause করবে না। Paper-based হলে ১০ মিনিট transfer time মানো।</p>
        <p>• <strong>ধাপ ৩: উত্তর পরীক্ষা করো:</strong> Answer key দেখার আগে নিজে review করো, তারপর score নির্ণয় করো।</p>
      </div>

      <h3 className="text-sm font-bold text-white pt-1">IELTS Listening Score Conversion</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2">সঠিক উত্তর</th><th className="p-2">Band Score</th><th className="p-2">সঠিক উত্তর</th><th className="p-2">Band Score</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            <tr><td className="p-2">39–40</td><td className="p-2 text-white font-bold">9.0</td><td className="p-2">26–29</td><td className="p-2 text-white font-bold">6.5</td></tr>
            <tr><td className="p-2">37–38</td><td className="p-2 text-white font-bold">8.5</td><td className="p-2">23–25</td><td className="p-2 text-white font-bold">6.0</td></tr>
            <tr><td className="p-2">35–36</td><td className="p-2 text-white font-bold">8.0</td><td className="p-2">18–22</td><td className="p-2 text-white font-bold">5.5</td></tr>
            <tr><td className="p-2">32–34</td><td className="p-2 text-white font-bold">7.5</td><td className="p-2">16–17</td><td className="p-2 text-white font-bold">5.0</td></tr>
            <tr><td className="p-2">30–31</td><td className="p-2 text-white font-bold">7.0</td><td className="p-2">-</td><td className="p-2">-</td></tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">Mock Test-এর পরে কীভাবে বিশ্লেষণ করবে?</strong>
          <p>১. ভুলের ধরন চিহ্নিত করো (Spelling? Distractor? Missed accent?).</p>
          <p>২. Section-wise analysis করো (Section 1 বনাম Section 4).</p>
          <p>৩. Transcript বের করে ভুল শব্দগুলো মিলিয়ে শোনো।</p>
          <p>৪. Targeted practice করো।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1 font-mono">
          <strong className="text-white font-bold block font-sans text-sm">সাপ্তাহিক Mock Schedule:</strong>
          <p>• রবি: Full mock test + analysis</p>
          <p>• সোম: Section 4 practice + signposting</p>
          <p>• মঙ্গল: Accent training (Aus/NZ focus)</p>
          <p>• বুধ: Spelling dictation (numbers, dates)</p>
          <p>• বৃহ: Map labeling + MCQ</p>
          <p>• শুক্র: Distractor practice + review</p>
          <p>• শনি: Section 1 & 2 targeted practice</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Mock test না দিলে পরীক্ষার চাপ সামলানো কঠিন হবে। নিয়মিত mock test দাও, error analysis করো, এবং দুর্বল জায়গায় focused practice করো।
      </div>
    </section>

    {/* SUMMARY & XP CLAIM BANNER */}
    <section className="space-y-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
        <p>• <strong>Format:</strong> ৪টি Section, ৪০টি প্রশ্ন, audio একবারই বাজে, শেষে ১০ মিনিট transfer time (Paper-based)।</p>
        <p>• <strong>Question Types:</strong> MCQ (elimination), Map (directions), Completion (word limits)।</p>
        <p>• <strong>Strategies:</strong> Prediction, Keyword spotting, Signposting words ("Moving on", "However")।</p>
        <p>• <strong>Distractors:</strong> "Actually" বা "Wait" শব্দে উত্তর বদলায়, শেষের তথ্যই সঠিক।</p>
        <p>• <strong>Accents:</strong> British ও Australian accent সবচেয়ে বেশি আসে।</p>
        <p>• <strong>Spelling:</strong> Plural, numbers, dates, capital letters-এ নজর দাও।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
        <p><strong>পরবর্তী Module:</strong> Module 02 — IELTS Reading</p>
        <p><strong>Practice Resources:</strong> এই module-এর videos.md ফাইলে প্রতিটি subtopic-এর জন্য curated YouTube videos পাবে।</p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>

  </div>
);

const MODULE_02_NOTES = (
  <div className="space-y-10 text-slate-300 leading-relaxed max-w-4xl">

    {/* OVERVIEW CARD */}
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎯 এই module-এ যা শিখবেন
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">লক্ষ্য Band: ৬.৫ – ৮.০</span>
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">Module: ০২ — Reading</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 italic">ভাষা নির্দেশিকা: সকল IELTS পরিভাষা ইংরেজিতে রাখা হয়েছে; বাকি সব বাংলায়।</p>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300 pt-2">
        <li className="flex items-center gap-2">🔹 Format — Academic vs General Training</li>
        <li className="flex items-center gap-2">🔹 প্রতিটি question type-এর deep dive</li>
        <li className="flex items-center gap-2">🔹 Skimming ও scanning techniques</li>
        <li className="flex items-center gap-2">🔹 Time management — ২০ মিনিট per passage</li>
        <li className="flex items-center gap-2">🔹 Paraphrase recognition ও synonym</li>
        <li className="flex items-center gap-2">🔹 অজানা vocabulary সামলানোর উপায়</li>
        <li className="flex items-center gap-2">🔹 General Training reading-এর specifics</li>
        <li className="flex items-center gap-2">🔹 Mock test ও answer analysis</li>
      </ul>
    </div>

    {/* 2.1 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.১ Format Overview — পরীক্ষার কাঠামো
      </h2>
      <h3 className="text-lg font-semibold text-slate-200">Academic vs General Training — মূল পার্থক্য</h3>
      <p>IELTS Reading পরীক্ষা দুটি ভিন্ন ধরনের হয়:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ACADEMIC READING */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
          <h4 className="text-sm font-bold text-white">Academic Reading:</h4>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>তিনটি দীর্ঘ passage — সাধারণত বৈজ্ঞানিক, সামাজিক বা পরিবেশগত বিষয় নিয়ে লেখা</li>
            <li>Passage-গুলো academic journals, books এবং magazines থেকে নেওয়া হয়</li>
            <li>ভাষা তুলনামূলক কঠিন এবং শব্দভান্ডার আরও জটিল</li>
            <li>মোট প্রশ্ন: ৪০টি | সময়: ৬০ মিনিট</li>
            <li>প্রতিটি passage প্রায় ৭০০–৯০০ শব্দের</li>
          </ul>
        </div>

        {/* GENERAL TRAINING READING */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
          <h4 className="text-sm font-bold text-white">General Training Reading:</h4>
          <p className="text-slate-400">তিনটি Section:</p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li><strong>Section 1:</strong> ছোট ছোট texts — বিজ্ঞাপন (advertisements), নোটিশ (notices), সময়সূচি (timetables) ইত্যাদি</li>
            <li><strong>Section 2:</strong> কর্মক্ষেত্র সম্পর্কিত texts — চাকরির বিবরণ (job descriptions), কর্মচারী ম্যানুয়াল ইত্যাদি</li>
            <li><strong>Section 3:</strong> Academic-এর মতো একটি দীর্ঘ passage</li>
            <li>মোট প্রশ্ন: ৪০টি | সময়: ৬০ মিনিট</li>
          </ul>
        </div>
      </div>

      {/* IMPORTANT POINTS */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-300">
        <strong className="text-white font-bold block border-b border-slate-800 pb-1 text-sm">গুরুত্বপূর্ণ বিষয়:</strong>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Listening-এর মতো নয়:</strong> Reading-এ উত্তর transfer করার জন্য আলাদা সময় নেই। সরাসরি Answer Sheet-এ লিখতে হয়।</li>
          <li>Spelling ভুল হলে marks কাটা যায় — সতর্ক থাকতে হবে।</li>
          <li>প্রতিটি সঠিক উত্তরে ১ mark। মোট ৪০ marks।</li>
          <li>Band 6.5 পেতে সাধারণত ৩০–৩২টি সঠিক উত্তর দরকার।</li>
          <li>Band 7.0 পেতে ৩৪–৩৫টি সঠিক উত্তর দরকার।</li>
        </ul>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Academic পরীক্ষার্থীরা জটিল academic passages পাবেন; General Training পরীক্ষার্থীরা সহজ থেকে মাঝারি কঠিন texts পাবেন। দুই ক্ষেত্রেই কৌশল (strategy) একই — শুধু text-এর ধরন আলাদা।
      </div>
    </section>

    {/* 2.2 SECTION */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.২ Question Types — সকল প্রশ্নের ধরন
      </h2>
      <p>IELTS Reading-এ মোট ১৪ ধরনের প্রশ্ন আসতে পারে। নিচে প্রতিটি বিস্তারিত আলোচনা করা হলো।</p>

      {/* 1. TFNG */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">১. True / False / Not Given (TFNG)</h3>
        <p className="text-sm">এই প্রশ্নে passage-এ লেখকের দেওয়া তথ্যের সাথে statement মিলিয়ে দেখতে হয়।</p>
        <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
          <li><strong>True:</strong> Statement এবং passage-এর তথ্য একই অর্থ প্রকাশ করে।</li>
          <li><strong>False:</strong> Statement passage-এর তথ্যকে সরাসরি বিরোধিতা করে।</li>
          <li><strong>Not Given:</strong> Statement সম্পর্কিত কোনো তথ্য passage-এ নেই।</li>
        </ul>

        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
          <strong>উদাহরণ Passage:</strong><br/>
          <i>"The Amazon rainforest produces approximately 20% of the world's oxygen supply."</i><br/><br/>
          • <strong>প্রশ্ন ১:</strong> The Amazon rainforest generates one-fifth of global oxygen. → <strong>উত্তর: True ✓</strong> (20% = one-fifth — synonym ব্যবহার করা হয়েছে)<br/>
          • <strong>প্রশ্ন ২:</strong> The Amazon rainforest produces more oxygen than all other forests combined. → <strong>উত্তর: Not Given ✓</strong> (Passage শুধু 20%-এর কথা বলেছে; অন্য forests-এর সাথে তুলনা করেনি)<br/>
          • <strong>প্রশ্ন ৩:</strong> The Amazon rainforest produces 30% of the world's oxygen. → <strong>উত্তর: False ✓</strong> (Passage বলে 20%, কিন্তু প্রশ্ন বলছে 30% — সরাসরি বিরোধ)
        </div>

        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
          <strong className="text-white block font-bold text-sm">False এবং Not Given-এর পার্থক্য — সবচেয়ে কঠিন অংশ</strong>
          <p className="text-slate-300">এটি IELTS Reading-এর সবচেয়ে বিভ্রান্তিকর বিষয়। অনেক পরীক্ষার্থী Not Given-কে False ভেবে ভুল করেন।</p>
          <div className="bg-slate-950 p-2.5 rounded font-mono text-slate-300 space-y-1">
            <div>• <strong>False =</strong> Passage বলছে বিপরীত কথা। দুটি statement সরাসরি conflict করছে।</div>
            <div>• <strong>Not Given =</strong> Passage ওই বিষয়ে কিছুই বলেনি। তথ্যটি passage-এ exist করে না।</div>
          </div>

          <p className="text-slate-300 pt-1 font-semibold">আরেকটি উদাহরণ:</p>
          <p className="italic text-slate-400">Passage: "Dr. Smith conducted research in 2015 in northern Canada."</p>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                <tr><th className="p-2">Statement</th><th className="p-2">উত্তর</th><th className="p-2">কারণ</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                <tr><td className="p-2 font-sans">Dr. Smith's research was published in 2016.</td><td className="p-2 text-white font-bold">Not Given</td><td className="p-2 font-sans text-slate-400">Passage publication সম্পর্কে কিছু বলেনি</td></tr>
                <tr><td className="p-2 font-sans">Dr. Smith's research took place in southern Canada.</td><td className="p-2 text-white font-bold">False</td><td className="p-2 font-sans text-slate-400">Passage বলে northern, কিন্তু প্রশ্ন বলে southern — সরাসরি বিরোধ</td></tr>
                <tr><td className="p-2 font-sans">Dr. Smith worked in Canada in 2015.</td><td className="p-2 text-white font-bold">True</td><td className="p-2 font-sans text-slate-400">একই তথ্য, paraphrase করা হয়েছে</td></tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-1 pt-1">
            <strong className="text-slate-200 block">ধাপে ধাপে approach:</strong>
            <ol className="list-decimal list-inside text-slate-400 space-y-0.5">
              <li>Statement পড়ুন এবং মূল keyword চিহ্নিত করুন।</li>
              <li>Passage-এ সেই keyword বা তার synonym খুঁজুন।</li>
              <li>যদি খুঁজে পান — True বা False কিনা দেখুন।</li>
              <li>যদি না পান — Not Given লিখুন। Passage silent থাকলে সেটা Not Given।</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 2. YNNG */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <h3 className="text-lg font-bold text-white">২. Yes / No / Not Given (YNNG)</h3>
        <p className="text-slate-300">এই প্রশ্নে লেখকের মত বা দৃষ্টিভঙ্গির সাথে statement মিলিয়ে দেখতে হয় — facts নয়, opinions।</p>
        <ul className="list-disc list-inside text-slate-400 space-y-1">
          <li><strong>Yes:</strong> Statement লেখকের মতের সাথে একমত।</li>
          <li><strong>No:</strong> Statement লেখকের মতের বিরুদ্ধে।</li>
          <li><strong>Not Given:</strong> লেখক ওই বিষয়ে কোনো মত দেননি।</li>
        </ul>
        <div className="bg-slate-900 p-2 rounded font-mono text-slate-300">
          Key difference: TFNG = facts; YNNG = writer's claims/views.
        </div>
      </div>

      {/* 3. MCQ */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <h3 className="text-lg font-bold text-white">৩. Multiple Choice Questions (MCQ)</h3>
        <p className="text-slate-300">একটি প্রশ্নের জন্য A, B, C, D চারটি option থাকে। সঠিক উত্তর passage-এ paraphrase হয়ে থাকে। ভুল options-গুলো প্রায়ই passage থেকে কিছু সত্যিকারের শব্দ নিয়ে mislead করার চেষ্টা করে।</p>
        <p className="text-slate-400"><strong>Strategy:</strong> আগে passage-এর relevant অংশ খুঁজুন, তারপর options-এর সাথে মেলান — উল্টোটা করলে trap-এ পড়বেন।</p>
      </div>

      {/* 4. Matching Headings */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <h3 className="text-lg font-bold text-white">৪. Matching Headings</h3>
        <p className="text-slate-300">প্রতিটি paragraph-এর জন্য একটি heading বেছে নিতে হয়। Headings-এর list-এ সাধারণত paragraph-এর চেয়ে বেশি options থাকে।</p>
        <div className="space-y-1">
          <strong className="text-slate-200 block">Strategy:</strong>
          <ul className="list-disc list-inside text-slate-400 space-y-0.5">
            <li>প্রতিটি paragraph-এর প্রথম দুটি এবং শেষ একটি sentence পড়ুন।</li>
            <li>Paragraph-এর মূল idea কী — সেটা নিজের ভাষায় বলুন।</li>
            <li>সেই idea-র সাথে কোন heading মিলছে তা দেখুন।</li>
            <li>Heading-এর exact শব্দ passage-এ থাকতে হবে না — meaning মেলালেই হবে।</li>
          </ul>
        </div>
      </div>

      {/* 5, 6, 7 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
          <h3 className="text-sm font-bold text-white">৫. Matching Information</h3>
          <p className="text-slate-400">নির্দিষ্ট তথ্য কোন paragraph-এ আছে তা খুঁজে বের করতে হয়। একই paragraph-এর উত্তর একাধিকবার ব্যবহার হতে পারে।</p>
          <p className="text-slate-300 font-semibold">Strategy: Keyword দিয়ে scanning করুন — ধীরে পুরো passage পড়বেন না।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
          <h3 className="text-sm font-bold text-white">৬. Matching Features</h3>
          <p className="text-slate-400">একটি list of people বা categories দেওয়া থাকে। সেগুলোর সাথে statement match করতে হয়।</p>
          <p className="text-slate-300 italic font-mono">উদাহরণ: কোন বিজ্ঞানী কোন তত্ত্ব দিয়েছেন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
          <h3 className="text-sm font-bold text-white">৭. Matching Sentence Endings</h3>
          <p className="text-slate-400">একটি অসম্পূর্ণ sentence দেওয়া থাকে। Options থেকে সঠিক ending বেছে নিতে হয়।</p>
          <p className="text-slate-300 font-semibold">Passage-এর তথ্য এবং grammar উভয়ই দেখতে হয়।</p>
        </div>
      </div>

      {/* 8. COMPLETIONS */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-lg font-bold text-white">৮. Sentence / Summary / Note / Table / Flow-Chart Completion</h3>
        <p className="text-slate-300">এই সব প্রশ্নে passage থেকে নির্দিষ্ট শব্দ বসাতে হয়।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
          <strong className="text-white block font-bold">সবচেয়ে গুরুত্বপূর্ণ নিয়ম: Instruction ভালো করে পড়ুন।</strong>
          <p className="text-slate-400">• "Use NO MORE THAN TWO WORDS" মানে একটি বা দুটি শব্দ — তিনটি হলে ভুল।</p>
          <p className="text-slate-400">• "Use ONE WORD ONLY" মানে শুধু একটি শব্দ।</p>
          <p className="text-slate-300">• শব্দগুলো passage থেকে হুবহু নিতে হয় — নিজে তৈরি করা যাবে না।</p>
        </div>
        <div className="space-y-1">
          <strong className="text-slate-200 block">Strategy:</strong>
          <ul className="list-disc list-inside text-slate-400 space-y-0.5">
            <li>Gap-এর আগে ও পরের শব্দ দেখুন — এটা grammar clue দেবে।</li>
            <li>Passage-এ সেই অংশ খুঁজুন।</li>
            <li>Word limit মেনে উত্তর লিখুন।</li>
          </ul>
        </div>
      </div>

      {/* 9 & 10 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-white">৯. Diagram Labelling</h3>
          <p className="text-slate-400">একটি diagram বা চিত্রের বিভিন্ন অংশে label বসাতে হয়। Passage-এ সেই diagram সম্পর্কে বর্ণনা থাকে।</p>
          <p className="text-slate-300"><strong>Strategy:</strong> Diagram-এ যে arrows বা numbers আছে সেগুলো দেখুন, তারপর passage-এ সেই বর্ণনার অংশ খুঁজুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-white">১০. Short-Answer Questions</h3>
          <p className="text-slate-400">সরাসরি প্রশ্নের উত্তর passage থেকে শব্দ নিয়ে লিখতে হয়। Word limit সবসময় দেওয়া থাকে — মেনে চলুন।</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        প্রতিটি question type-এর জন্য আলাদা strategy আছে, কিন্তু সবকিছুর ভিত্তি হলো paraphrase চেনা এবং passage-এ keyword খোঁজা।
      </div>
    </section>

    {/* 2.3 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.৩ Skimming & Scanning Techniques
      </h2>
      <p>এই দুটি technique IELTS Reading-এ সময় বাঁচানোর মূল হাতিয়ার।</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* SKIMMING */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Skimming — মূল ধারণা দ্রুত বোঝা</h3>
          <p className="text-slate-400">Skimming মানে: পুরো passage দ্রুত চোখ বুলিয়ে মূল বিষয়বস্তু সম্পর্কে একটা ধারণা নেওয়া — প্রতিটি শব্দ পড়া নয়।</p>
          <strong className="text-slate-200 block">কীভাবে করবেন:</strong>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>প্রতিটি paragraph-এর প্রথম বাক্য পড়ুন — এটি সাধারণত মূল idea বলে।</li>
            <li>শেষ paragraph-এর প্রথম বাক্যও পড়ুন।</li>
            <li>Bold, italic বা underline করা শব্দ দেখুন।</li>
            <li>Numbers, dates, proper nouns (নাম, স্থান) দেখুন — এগুলো পরে scanning-এ কাজে আসবে।</li>
          </ul>
          <p className="text-slate-400 pt-1"><strong>কখন করবেন:</strong> প্রশ্ন পড়ার আগে passage-এ হাত দেওয়ার সময়। প্রতিটি passage-এ ৩ মিনিটের বেশি skimming করবেন না।</p>
        </div>

        {/* SCANNING */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Scanning — নির্দিষ্ট তথ্য খোঁজা</h3>
          <p className="text-slate-400">Scanning মানে: একটি নির্দিষ্ট keyword বা তথ্য খোঁজার জন্য দ্রুত passage-এ চোখ দৌড়ানো।</p>
          <strong className="text-slate-200 block">কীভাবে করবেন:</strong>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>প্রশ্ন থেকে keyword বের করুন।</li>
            <li>Passage-এ সেই keyword বা তার synonym খুঁজুন।</li>
            <li>সেখানে পৌঁছে সেই অংশটি মনোযোগ দিয়ে পড়ুন।</li>
            <li>পুরো passage পড়বেন না — শুধু relevant অংশ পড়ুন।</li>
          </ul>
          <div className="bg-slate-900 p-2 rounded font-mono text-slate-300 pt-1">
            <strong>উদাহরণ:</strong><br/>
            প্রশ্ন: "What percentage of forests were destroyed in 2010?"<br/>
            Scan করবেন: "2010" এবং "percent" বা "%" — numbers সহজে চোখে পড়ে।
          </div>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <h3 className="text-sm font-bold text-white pt-2">Skimming vs Scanning — পার্থক্য</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2.5">বিষয়</th><th className="p-2.5">Skimming</th><th className="p-2.5">Scanning</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr><td className="p-2.5 font-semibold text-white">উদ্দেশ্য</td><td className="p-2.5">সামগ্রিক idea বোঝা</td><td className="p-2.5">নির্দিষ্ট তথ্য খোঁজা</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">কখন ব্যবহার</td><td className="p-2.5">Passage শুরুতে</td><td className="p-2.5">প্রতিটি প্রশ্নের জন্য</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">কী পড়বেন</td><td className="p-2.5">First sentences, headings</td><td className="p-2.5">Keywords এবং synonyms</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">গতি</td><td className="p-2.5">দ্রুত</td><td className="p-2.5">অনেক দ্রুত</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Skimming করুন একবার — Passage-এর মানচিত্র তৈরি হবে। তারপর প্রতিটি প্রশ্নের জন্য scanning করুন। এই দুটি মিলিয়ে ব্যবহার করলে সময় বাঁচায় এবং সঠিক উত্তর দ্রুত পাওয়া যায়।
      </div>
    </section>

    {/* 2.4 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.৪ Time Management — সময় ব্যবস্থাপনা
      </h2>
      <p>৬০ মিনিটের Clock-Based Plan: IELTS Reading-এ সময় ব্যবস্থাপনা ব্যর্থতার সবচেয়ে বড় কারণ। নিচে একটি সুনির্দিষ্ট পরিকল্পনা দেওয়া হলো:</p>

      {/* ACADEMIC TIME PLAN TABLE */}
      <h3 className="text-sm font-bold text-white">Academic Reading-এর জন্য (15-20-25 নিয়ম)</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2.5">সময়</th><th className="p-2.5">কাজ</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            <tr><td className="p-2.5 font-bold text-white">0:00 – 0:02</td><td className="p-2.5 font-sans">সকল প্রশ্ন দ্রুত দেখুন — কোন question type আছে বুঝুন</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:02 – 0:05</td><td className="p-2.5 font-sans">Passage 1 skim করুন</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:05 – 0:17</td><td className="p-2.5 font-sans">Passage 1-এর প্রশ্ন সমাধান করুন (মোট ~15 মিনিট)</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:17 – 0:21</td><td className="p-2.5 font-sans">Passage 2 skim করুন</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:21 – 0:38</td><td className="p-2.5 font-sans">Passage 2-এর প্রশ্ন সমাধান করুন (মোট ~17 মিনিট)</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:38 – 0:41</td><td className="p-2.5 font-sans">Passage 3 skim করুন</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:41 – 0:58</td><td className="p-2.5 font-sans">Passage 3-এর প্রশ্ন সমাধান করুন (মোট ~17 মিনিট)</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:58 – 1:00</td><td className="p-2.5 font-sans">উত্তর review করুন — বিশেষত word limit পরীক্ষা করুন</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 italic">কেন 15-20-25 নয়? Passage 1 সাধারণত সহজ। দ্রুত শেষ করুন এবং বাকি সময় Passage 2 ও 3-এ দিন।</p>

      {/* GT TIME PLAN TABLE */}
      <h3 className="text-sm font-bold text-white pt-2">General Training Reading-এর জন্য</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2.5">সময়</th><th className="p-2.5">কাজ</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            <tr><td className="p-2.5 font-bold text-white">0:00 – 0:15</td><td className="p-2.5 font-sans">Section 1 (ছোট texts, সহজ)</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:15 – 0:30</td><td className="p-2.5 font-sans">Section 2 (workplace texts, মাঝারি)</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:30 – 0:58</td><td className="p-2.5 font-sans">Section 3 (দীর্ঘ passage, কঠিন)</td></tr>
            <tr><td className="p-2.5 font-bold text-white">0:58 – 1:00</td><td className="p-2.5 font-sans">Review</td></tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">কখন Skip করবেন?</strong>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>কোনো প্রশ্নে ৯০ সেকেন্ডের বেশি সময় লাগলে সেটি skip করুন।</li>
            <li>পরের প্রশ্নে যান — সময় থাকলে ফিরে আসুন।</li>
            <li>শেষে কোনো উত্তর না জানলেও blank রাখবেন না — অনুমান করে উত্তর দিন। ভুল উত্তরে marks কাটা যায় না।</li>
          </ul>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">সময় নষ্ট হওয়ার সাধারণ কারণ</strong>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>পুরো passage শুরু থেকে শেষ পর্যন্ত পড়া</li>
            <li>একটি কঠিন প্রশ্নে আটকে থাকা</li>
            <li>উত্তর দেওয়ার পর আবার পড়া</li>
            <li>Passage-এর প্রতিটি শব্দ বোঝার চেষ্টা করা</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        ৬০ মিনিট = ৪০ প্রশ্ন। গড়ে প্রতি প্রশ্নে ১ মিনিটের কম সময়। Skimming এবং scanning ছাড়া এই গতি বজায় রাখা সম্ভব নয়।
      </div>
    </section>

    {/* 2.5 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.৫ Paraphrase Recognition & Synonyms — IELTS Reading-এর হৃদয়
      </h2>
      <p><strong>Paraphrasing কী?</strong> Paraphrasing মানে একই তথ্য ভিন্ন শব্দে বা ভিন্ন বাক্য কাঠামোতে প্রকাশ করা। IELTS Reading-এ প্রশ্নে passage-এর শব্দ হুবহু আসে না। প্রশ্ন সবসময় paraphrase করা হয়। তাই প্রশ্নের শব্দ এবং passage-এর শব্দ মিললেই কাজ হয় না — অর্থ মেলাতে হয়।</p>

      {/* SYNONYM TABLE */}
      <h3 className="text-sm font-bold text-white pt-1">১০টি গুরুত্বপূর্ণ Paraphrase উদাহরণ</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2 font-bold">Passage-এ যা থাকতে পারে</th><th className="p-2 font-bold">Question-এ যা থাকতে পারে</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            <tr><td className="p-2 text-white font-semibold">increase</td><td className="p-2">rise / grow / climb / go up / surge / expand</td></tr>
            <tr><td className="p-2 text-white font-semibold">decrease</td><td className="p-2">fall / drop / decline / reduce / shrink / diminish</td></tr>
            <tr><td className="p-2 text-white font-semibold">difficult</td><td className="p-2">challenging / demanding / tough / complex / arduous</td></tr>
            <tr><td className="p-2 text-white font-semibold">important</td><td className="p-2">significant / crucial / vital / essential / key</td></tr>
            <tr><td className="p-2 text-white font-semibold">use</td><td className="p-2">employ / utilize / apply / make use of</td></tr>
            <tr><td className="p-2 text-white font-semibold">show</td><td className="p-2">demonstrate / reveal / indicate / suggest / display</td></tr>
            <tr><td className="p-2 text-white font-semibold">build</td><td className="p-2">construct / develop / create / establish</td></tr>
            <tr><td className="p-2 text-white font-semibold">help</td><td className="p-2">assist / support / aid / facilitate / enable</td></tr>
            <tr><td className="p-2 text-white font-semibold">problem</td><td className="p-2">issue / challenge / concern / difficulty / obstacle</td></tr>
            <tr><td className="p-2 text-white font-semibold">change</td><td className="p-2">alter / modify / transform / shift / adjust</td></tr>
          </tbody>
        </table>
      </div>

      {/* SENTENCE LEVEL PARAPHRASE */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
        <strong className="text-white block font-bold text-sm">আরও উদাহরণ — বাক্য-স্তরে Paraphrase</strong>
        <div className="bg-slate-900 p-3 rounded font-mono text-slate-300 space-y-1">
          <div>Passage বলে: <i>"The government allocated substantial funds to modernise public transport infrastructure."</i></div>
          <div>Question-এ আসতে পারে: <i>"Large amounts of money were spent by authorities on upgrading transport systems."</i></div>
        </div>
        <div className="text-slate-400 space-y-0.5 pt-1">
          <p><strong>পার্থক্য লক্ষ্য করুন:</strong></p>
          <p>• "government" → "authorities"</p>
          <p>• "allocated substantial funds" → "Large amounts of money were spent"</p>
          <p>• "modernise" → "upgrading"</p>
          <p>• "public transport infrastructure" → "transport systems"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">Paraphrase চেনার কৌশল:</strong>
          <ol className="list-decimal list-inside text-slate-300 space-y-0.5">
            <li>প্রশ্নে keyword চিহ্নিত করুন।</li>
            <li>সেই keyword-এর সম্ভাব্য synonyms মাথায় রাখুন।</li>
            <li>Passage-এ সেই synonym বা কাছাকাছি অর্থের শব্দ খুঁজুন।</li>
            <li>Meaning মিলছে কিনা নিশ্চিত হন — শব্দ না মিললেও চলবে।</li>
          </ol>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">Common Traps — ফাঁদ থেকে সাবধান:</strong>
          <ul className="list-disc list-inside text-slate-300 space-y-0.5">
            <li>Passage-এর exact শব্দ প্রশ্নে থাকলে সেটি সঠিক উত্তর নাও হতে পারে।</li>
            <li>Question-এ passage-এর একটি সত্যিকারের তথ্য থাকলেও পুরো statement ভুল হতে পারে।</li>
            <li>সবসময় পুরো statement-এর অর্থ দেখুন।</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        IELTS Reading আসলে একটি synonym এবং paraphrase খেলা। যে পরীক্ষার্থী এটা বুঝে যান, তিনি আর প্রতিটি passage সম্পূর্ণ পড়ার চেষ্টা করেন না — keyword দিয়েই উত্তর খুঁজে নেন।
      </div>
    </section>

    {/* 2.6 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.৬ Difficult Vocabulary — অজানা শব্দে ঘাবড়াবেন না
      </h2>
      <p><strong>সবচেয়ে গুরুত্বপূর্ণ কথা:</strong> IELTS Reading একটি vocabulary test নয় — এটি একটি reading comprehension test। আপনাকে প্রতিটি শব্দ জানতে হবে না। অনেক কঠিন শব্দ থাকবে — এটাই স্বাভাবিক। কিন্তু সেই শব্দ না জানলেও উত্তর দেওয়া সম্ভব।</p>

      {/* CONTEXT CLUES */}
      <h3 className="text-sm font-bold text-white pt-1">Context Clues — প্রসঙ্গ থেকে অর্থ বোঝার কৌশল</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">১. Definition Clues:</strong>
          <p className="text-slate-400">কখনো কখনো কঠিন শব্দের পরেই তার ব্যাখ্যা দেওয়া থাকে।</p>
          <p className="font-mono text-slate-300 bg-slate-900 p-2 rounded">"Photosynthesis, the process by which plants convert sunlight into food, is crucial for life on Earth."</p>
          <p className="text-slate-400 font-sans">"Photosynthesis" অজানা হলেও comma-র পরের অংশ তার অর্থ বলে দিচ্ছে।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">২. Contrast Clues (but, however, although, unlike):</strong>
          <p className="font-mono text-slate-300 bg-slate-900 p-2 rounded">"Unlike his predecessor, the new CEO was frugal with company resources."</p>
          <p className="text-slate-400 font-sans">"frugal" মানে না জানলেও বুঝতে পারছি — আগের CEO এই বিষয়ে ভিন্ন ছিলেন, তাই "frugal" মানে সম্ভবত মিতব্যয়ী।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">৩. Example Clues (such as, for example, including):</strong>
          <p className="font-mono text-slate-300 bg-slate-900 p-2 rounded">"The company employs various marketing tactics, such as social media campaigns, email newsletters..."</p>
          <p className="text-slate-400 font-sans">"tactics" মানে না জানলেও উদাহরণগুলো বলে দিচ্ছে এগুলো কোনো strategy বা পদ্ধতি।</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">৪. Synonym Clues:</strong>
          <p className="font-mono text-slate-300 bg-slate-900 p-2 rounded">"The report was ambiguous, or unclear, in several key areas."</p>
          <p className="text-slate-400 font-sans">"or unclear" সরাসরি "ambiguous"-এর অর্থ বলে দিচ্ছে।</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-1.5">
        <strong className="text-white block font-bold text-sm">অজানা শব্দ পেলে কী করবেন — ধাপে ধাপে</strong>
        <ol className="list-decimal list-inside text-slate-300 space-y-0.5">
          <li>ঘাবড়াবেন না। এটি ইচ্ছাকৃতভাবে কঠিন করা হয়েছে — সবার জন্যই।</li>
          <li>শব্দের আগে ও পরে কী আছে দেখুন।</li>
          <li>শব্দের গঠন দেখুন — prefix বা suffix আছে কিনা। (<code>"un-"</code> = বিপরীত, <code>"-tion"</code> = noun, <code>"re-"</code> = আবার)</li>
          <li>সেই শব্দ ছাড়াই বাক্যের অর্থ বোঝার চেষ্টা করুন।</li>
          <li>যদি প্রশ্নের উত্তরের জন্য ঐ শব্দটি জানা দরকার না হয় — এগিয়ে যান।</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <strong className="text-white block font-bold mb-1">কোন শব্দ জানা দরকার নেই?</strong>
          Passage-এ এমন অনেক technical বা specialized শব্দ থাকে যেগুলো প্রশ্নে আসেই না। সেগুলো পড়তে সময় নষ্ট করবেন না।
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <strong className="text-white block font-bold mb-1">কোন শব্দ জানা দরকার:</strong>
          যেগুলো প্রশ্নের keyword বা তার synonym হতে পারে।
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        অজানা শব্দে সময় নষ্ট না করে পরের প্রশ্নে যান। বেশিরভাগ ক্ষেত্রে সেই শব্দ না জেনেও উত্তর দেওয়া সম্ভব।
      </div>
    </section>

    {/* 2.7 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.৭ General Training Reading — বিশেষ নির্দেশিকা
      </h2>
      <p>General Training Reading Academic-এর চেয়ে কিছুটা সহজ — কিন্তু এর নিজস্ব চ্যালেঞ্জ আছে।</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* SEC 1 */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Section 1 — সামাজিক টেক্সট</h3>
          <p className="text-slate-400">বিজ্ঞাপন (advertisements), নোটিশ (notices), সময়সূচি (timetables), তথ্যবিবরণী (leaflets)।</p>
          <strong className="text-slate-200 block">কৌশল:</strong>
          <p className="text-slate-300">Texts ছোট এবং ভাষা সহজ। Maximum সময়: ১৫ মিনিট — তারপর Section 2-এ যান।</p>
          <strong className="text-slate-200 block">কী দেখবেন:</strong>
          <p className="text-slate-400">Opening hours, Contact info, Terms and conditions, Rules.</p>
        </div>

        {/* SEC 2 */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Section 2 — কর্মক্ষেত্রের টেক্সট</h3>
          <p className="text-slate-400">Job descriptions, Staff manuals, Training documents, Pay & conditions, Health/safety notices.</p>
          <strong className="text-slate-200 block">কৌশল:</strong>
          <p className="text-slate-300">ভাষা formal। Specific details (salary, hours) scanning করুন। Maximum সময়: ১৫ মিনিট।</p>
        </div>

        {/* SEC 3 */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Section 3 — Academic-ধর্মী দীর্ঘ টেক্সট</h3>
          <p className="text-slate-400">Academic Reading-এর Passage 1-এর সমতুল্য।</p>
          <strong className="text-slate-200 block">কৌশল:</strong>
          <p className="text-slate-300">সময়: বাকি সময় (প্রায় ২৮–৩০ মিনিট)। Academic Reading-এর মতোই সব strategy কাজ করে।</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        GT Reading-এ Section 1 এবং 2-এ দ্রুত এগিয়ে বেশি সময় Section 3-এর জন্য রাখুন। Section 1 ও 2-এর ভাষা সহজ হওয়ায় সেখানে পূর্ণ marks তোলা সম্ভব।
      </div>
    </section>

    {/* 2.8 SECTION */}
    <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ২.৮ Full Mock Test নেওয়া এবং উত্তর বিশ্লেষণ করা
      </h2>
      <p><strong>Mock Test কেন নেবেন?</strong> শুধু তত্ত্ব শেখা এবং ছোট exercises করা যথেষ্ট নয়। Full mock test না দিলে বুঝবেন না: ৬০ মিনিটে ৪০ প্রশ্ন করতে পারছেন কিনা, কোন question type-এ বেশি সময় যাচ্ছে, এবং কোথায় পুনরায় মনোযোগ দিতে হবে।</p>

      {/* MOCK TEST STEPS */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs text-slate-300">
        <strong className="text-white block font-bold text-sm">Mock Test দেওয়ার সঠিক পদ্ধতি:</strong>
        <p>• <strong>আগে:</strong> Cambridge IELTS Official Practice Tests (Book 1–19) থেকে একটি পূর্ণ test নিন। শান্ত পরিবেশে বসুন, Timer set করুন (৬০ মিনিট), Phone রাখুন, dictionary বন্ধ করুন।</p>
        <p>• <strong>Mock Test চলাকালীন:</strong> Real exam-এর মতোই করুন — pause করবেন না। যদি উত্তর না জানেন, অনুমান করুন এবং এগিয়ে যান। Answer Sheet-এ সরাসরি লিখুন (Listening-এর মতো আলাদা সময় নেই)।</p>
        <p>• <strong>পরে (উত্তর বিশ্লেষণ):</strong> Score গণনা করুন। Error Analysis করুন (কেন ভুল হলো? time pressure/paraphrase/careless?). Error Log বানান।</p>
      </div>

      {/* ERROR LOG TABLE EXAMPLE */}
      <h3 className="text-sm font-bold text-white pt-1">Error Log এর গঠন (Pattern খুঁজুন)</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2">Question Type</th><th className="p-2">ভুলের সংখ্যা</th><th className="p-2">কারণ</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            <tr><td className="p-2 font-sans">True/False/Not Given</td><td className="p-2">2</td><td className="p-2 font-sans">Not Given confuse করেছি</td></tr>
            <tr><td className="p-2 font-sans">Matching Headings</td><td className="p-2">3</td><td className="p-2 font-sans">First sentence এর পরে idea বদলে গেছে</td></tr>
            <tr><td className="p-2 font-sans">Sentence Completion</td><td className="p-2">1</td><td className="p-2 font-sans">Word limit exceed করেছি</td></tr>
          </tbody>
        </table>
      </div>

      {/* SCHEDULE */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1 font-mono text-xs text-slate-300">
        <strong className="text-white block font-sans font-bold text-sm">Mock Test-এর সময়সূচি (সাপ্তাহিক schedule):</strong>
        <p>• সপ্তাহ ১-২: প্রতিদিন individual question type practice</p>
        <p>• সপ্তাহ ৩: প্রথম full mock test — score করুন, analyze করুন</p>
        <p>• সপ্তাহ ৪-৫: দুর্বল areas-এ focused practice</p>
        <p>• সপ্তাহ ৬: দ্বিতীয় full mock test — progress দেখুন</p>
        <p>• পরীক্ষার আগের সপ্তাহ: দুটো mock test — timed, strict conditions</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Mock test দেওয়া = practice। কিন্তু mock test analyze করা = উন্নতি। শুধু test দিলে হবে না — প্রতিটি ভুল থেকে শিখতে হবে।
      </div>
    </section>

    {/* SUMMARY & XP CLAIM BANNER */}
    <section className="space-y-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
        <p>• <strong>Format:</strong> Academic-এ ৩টি academic passage; General Training-এ ৩টি section (notices → workplace → general); উভয়েই ৬০ মিনিট, ৪০ প্রশ্ন।</p>
        <p>• <strong>Question Types:</strong> TFNG, YNNG, MCQ, Matching Headings, Matching Info, Matching Features, Sentence Endings, Completions, Diagram, Short-Answer — মোট ১৪টি।</p>
        <p>• <strong>False vs Not Given:</strong> False = passage বিপরীত তথ্য দেয়; Not Given = passage নীরব থাকে।</p>
        <p>• <strong>Skimming & Scanning:</strong> Skimming = সামগ্রিক ধারণা; Scanning = নির্দিষ্ট keyword দ্রুত খোঁজা।</p>
        <p>• <strong>Time Management:</strong> Academic-এ 15-20-25 পরিকল্পনা; ৯০ সেকেন্ডের বেশি লাগলে skip করুন।</p>
        <p>• <strong>Paraphrase & Vocab:</strong> Synonym চেনা আসল দক্ষতা; অজানা শব্দে না ঘাবড়ে context clue ব্যবহার করুন।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
        <p><strong>পরবর্তী Module:</strong> Writing (Task 1 ও Task 2) →</p>
      </div>

      {/* CLAIM XP BUTTON */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>

  </div>
);

const MODULE_03_NOTES = (
  <section className="space-y-8">
    {/* HERO HEADER */}
    <div className="bg-gradient-to-br from-amber-950/60 via-amber-900/30 to-slate-900 border border-amber-800/40 rounded-2xl p-8 text-center space-y-4">
      <p className="text-3xl">📝</p>
      <h2 className="text-2xl font-bold text-amber-100">IELTS Writing Module</h2>
      <p className="text-sm text-amber-300/80 max-w-2xl mx-auto">
        Band 6.5 – 8.0 লক্ষ্য | পরীক্ষার্থী: বাংলাদেশ ও পশ্চিমবঙ্গ
      </p>
    </div>

    {/* SECTION 3.1 — ASSESSMENT CRITERIA */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.1 Assessment Criteria — পরীক্ষক কীভাবে মার্ক দেন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-3">
        <p>IELTS Writing-এ মোট নম্বরের চারটি সমান ভাগ আছে। প্রতিটি criterion মোট স্কোরের <strong className="text-amber-300">25%</strong>।</p>
      </div>

      {/* 4 CRITERIA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Criterion 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-bold text-sm">1</span>
            <h4 className="text-sm font-bold text-amber-100">Task Response (Task 1-এ: Task Achievement)</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            পরীক্ষক দেখেন আপনি প্রশ্নের সব অংশের উত্তর দিয়েছেন কিনা। Task 2-তে আপনার মূল opinion বা position স্পষ্ট থাকতে হবে। শুধু topic সম্পর্কে সাধারণ কথা লিখলে কম মার্ক পাবেন।
          </p>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs">
              <span className="text-red-400 font-mono font-bold shrink-0">Band 5:</span>
              <span className="text-slate-400">প্রশ্নের শুধু একটি অংশের উত্তর দেয়, position অস্পষ্ট।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-orange-400 font-mono font-bold shrink-0">Band 6:</span>
              <span className="text-slate-400">সব অংশের উত্তর দেয় কিন্তু কোনো কোনো point ভালোভাবে develop করা হয় না।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-emerald-400 font-mono font-bold shrink-0">Band 7:</span>
              <span className="text-slate-400">সব অংশের উত্তর দেয়, position স্পষ্ট, main ideas ভালোভাবে develop করা।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-amber-300 font-mono font-bold shrink-0">Band 8–9:</span>
              <span className="text-slate-400">সব অংশের সম্পূর্ণ ও বিস্তারিত উত্তর, fully relevant, well-extended।</span>
            </div>
          </div>
        </div>

        {/* Criterion 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-bold text-sm">2</span>
            <h4 className="text-sm font-bold text-amber-100">Coherence and Cohesion</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            আপনার লেখা কতটা সহজে পড়া যায় এবং ideas-গুলো কতটা logically সংযুক্ত। প্রতিটি paragraph-এ একটি Topic Sentence থাকতে হবে এবং ideas flow করতে হবে।
          </p>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs">
              <span className="text-red-400 font-mono font-bold shrink-0">Band 5:</span>
              <span className="text-slate-400">ঘন ঘন linking words ব্যবহার করে কিন্তু ভুলভাবে।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-orange-400 font-mono font-bold shrink-0">Band 6:</span>
              <span className="text-slate-400">Paragraphing ঠিক আছে, কিছু cohesive devices সঠিকভাবে ব্যবহার হয়।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-emerald-400 font-mono font-bold shrink-0">Band 7:</span>
              <span className="text-slate-400">Logical sequence, clear progression, cohesive devices যথাযথ ব্যবহার।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-amber-300 font-mono font-bold shrink-0">Band 8–9:</span>
              <span className="text-slate-400">Cohesion seamless, paragraphing effective, কোনো mechanical repetition নেই।</span>
            </div>
          </div>
        </div>

        {/* Criterion 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-bold text-sm">3</span>
            <h4 className="text-sm font-bold text-amber-100">Lexical Resource</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            আপনি কতটা বৈচিত্র্যপূর্ণ ও accurate শব্দভান্ডার ব্যবহার করেছেন। একই শব্দ বারবার না লিখে synonyms ও collocations ব্যবহার করতে হবে।
          </p>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs">
              <span className="text-red-400 font-mono font-bold shrink-0">Band 5:</span>
              <span className="text-slate-400">সীমিত vocabulary, বারবার একই শব্দ।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-orange-400 font-mono font-bold shrink-0">Band 6:</span>
              <span className="text-slate-400">পর্যাপ্ত range তবে কিছু spelling/word choice error।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-emerald-400 font-mono font-bold shrink-0">Band 7:</span>
              <span className="text-slate-400">Wide vocabulary, কিছু less common items ব্যবহার, minor errors।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-amber-300 font-mono font-bold shrink-0">Band 8–9:</span>
              <span className="text-slate-400">Sophisticated vocabulary, precise word choice, rare errors।</span>
            </div>
          </div>
        </div>

        {/* Criterion 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-bold text-sm">4</span>
            <h4 className="text-sm font-bold text-amber-100">Grammatical Range and Accuracy</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            আপনার grammar কতটা বৈচিত্র্যপূর্ণ ও নির্ভুল। শুধু simple sentences লিখলে কম মার্ক পাবেন — complex structures ব্যবহার করতে হবে।
          </p>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs">
              <span className="text-red-400 font-mono font-bold shrink-0">Band 5:</span>
              <span className="text-slate-400">শুধু simple sentences, ঘন ঘন error।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-orange-400 font-mono font-bold shrink-0">Band 6:</span>
              <span className="text-slate-400">Complex structures ব্যবহারের চেষ্টা, কিছু error।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-emerald-400 font-mono font-bold shrink-0">Band 7:</span>
              <span className="text-slate-400">বিভিন্ন ধরনের structures, অধিকাংশ error-free।</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="text-amber-300 font-mono font-bold shrink-0">Band 8–9:</span>
              <span className="text-slate-400">Wide range, সব structure accurate, rare minor slips।</span>
            </div>
          </div>
        </div>
      </div>

      {/* CALLOUT: 25% Rule */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90 space-y-1">
        <p><strong>মূল কথা:</strong> প্রতিটি criterion 25%। একটি দুর্বল হলে পুরো স্কোর কমে যায়। Task 2-তে minimum <strong>250 words</strong> এবং Task 1-তে minimum <strong>150 words</strong> লিখতে হবে — কম লিখলে penalty পাবেন।</p>
      </div>
    </section>

    {/* SECTION 3.2 — TASK 1 ACADEMIC */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.2 Task 1 Academic — চার্ট ও ডায়াগ্রাম বর্ণনা করা
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-3">
        <p>Task 1 Academic-এ আপনাকে একটি visual data (graph, chart, diagram, map) দেখানো হবে এবং আপনি minimum <strong className="text-amber-300">150 words</strong>-এ সেটি describe করবেন। সময়: প্রায় 20 মিনিট।</p>
      </div>

      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-5 text-xs text-amber-200/90 space-y-2">
        <p className="font-bold text-amber-100">মূল কাঠামো (সব chart type-এর জন্য):</p>
        <p><strong>Introduction:</strong> Paraphrase করুন — question-এর ভাষা হুবহু কপি করবেন না।</p>
        <p><strong>Overview:</strong> দুটি সবচেয়ে গুরুত্বপূর্ণ trend/feature লিখুন — এটি সবচেয়ে গুরুত্বপূর্ণ অংশ।</p>
        <p><strong>Body Paragraphs (1–2টি):</strong> Specific data দিয়ে overview support করুন।</p>
        <p className="text-amber-300/70">Overview লেখার নিয়ম: "Overall," দিয়ে শুরু করুন এবং সংখ্যা ছাড়া সবচেয়ে বড় trend লিখুন।</p>
      </div>

      {/* 3.2a Line Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.2a Line Graph (রেখা চিত্র)</h4>
        <p className="text-xs text-slate-400">Line graph সাধারণত সময়ের সাথে পরিবর্তন দেখায়।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-slate-400 font-bold mb-1">গুরুত্বপূর্ণ ভাষা:</p>
          <p><span className="text-emerald-400 font-bold">বৃদ্ধি:</span> <span className="text-slate-300">"rose", "increased", "climbed", "surged", "grew"</span></p>
          <p><span className="text-red-400 font-bold">হ্রাস:</span> <span className="text-slate-300">"fell", "declined", "dropped", "decreased", "plummeted"</span></p>
          <p><span className="text-blue-400 font-bold">স্থিতিশীল:</span> <span className="text-slate-300">"remained stable", "levelled off", "plateaued"</span></p>
          <p><span className="text-purple-400 font-bold">উঠানামা:</span> <span className="text-slate-300">"fluctuated"</span></p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Overview:</p>
          <p className="text-slate-300 italic">"Overall, the number of international students studying in the UK rose significantly over the period, while domestic student enrolment remained relatively stable."</p>
          <p className="text-amber-300/70 font-bold">Sample Body Paragraph:</p>
          <p className="text-slate-300 italic">"In 2000, approximately 200,000 international students were enrolled in UK universities. This figure rose steadily over the following decade, reaching a peak of 480,000 in 2010. After a slight dip in 2012, numbers recovered and continued to climb, hitting 550,000 by 2015."</p>
        </div>
      </div>

      {/* 3.2b Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.2b Bar Chart (দণ্ড চিত্র)</h4>
        <p className="text-xs text-slate-400">Bar chart সাধারণত categories-এর মধ্যে তুলনা দেখায়।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-slate-400 font-bold mb-1">গুরুত্বপূর্ণ ভাষা:</p>
          <p><span className="text-blue-400 font-bold">তুলনা:</span> <span className="text-slate-300">"by contrast", "whereas", "compared to", "in comparison"</span></p>
          <p><span className="text-amber-400 font-bold">সর্বোচ্চ/সর্বনিম্ন:</span> <span className="text-slate-300">"the highest proportion", "the lowest figure", "accounted for the majority"</span></p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Overview:</p>
          <p className="text-slate-300 italic">"Overall, spending on food and housing accounted for the largest share of household expenditure in all three countries, while entertainment represented the smallest category."</p>
          <p className="text-amber-300/70 font-bold">Sample Body Paragraph:</p>
          <p className="text-slate-300 italic">"In Canada, households spent the greatest proportion of their income on housing, at 35%, followed closely by food at 28%. By contrast, entertainment expenditure was considerably lower, representing just 8% of total spending."</p>
        </div>
      </div>

      {/* 3.2c Pie Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.2c Pie Chart (পাই চিত্র)</h4>
        <p className="text-xs text-slate-400">Pie chart সাধারণত percentages বা proportions দেখায়।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-slate-300">"accounted for", "made up", "constituted", "represented", "comprised" — <span className="text-amber-300/70">"the largest share", "the smallest proportion", "almost half", "roughly a quarter"</span></p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Overview:</p>
          <p className="text-slate-300 italic">"Overall, electricity and gas together accounted for more than half of all household energy consumption, while renewable sources made up only a minor proportion."</p>
          <p className="text-amber-300/70 font-bold">Sample Body Paragraph:</p>
          <p className="text-slate-300 italic">"Electricity was the dominant energy source, accounting for 35% of total consumption. Gas followed at 22%, meaning that these two sources alone comprised well over half of all energy used. Solar power, by contrast, represented just 6% — the smallest share of all categories shown."</p>
        </div>
      </div>

      {/* 3.2d Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.2d Table (তালিকা)</h4>
        <p className="text-xs text-slate-400">Table-এ অনেক data থাকে, তাই সব সংখ্যা লেখার চেষ্টা করবেন না। Trends এবং extremes বেছে নিন।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Overview:</p>
          <p className="text-slate-300 italic">"Overall, Japan had the highest GDP per capita across all years shown, while Nigeria consistently recorded the lowest figures throughout the period."</p>
          <p className="text-amber-300/70 font-bold">Sample Body Paragraph:</p>
          <p className="text-slate-300 italic">"Japan's GDP per capita stood at $32,000 in 2000, rising to $38,500 by 2020 — an increase of approximately 20%. In contrast, Nigeria's figure barely changed, moving from $1,100 to $1,900 over the same period, remaining the lowest among all nations in the table."</p>
        </div>
      </div>

      {/* 3.2e Process Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.2e Process Diagram (প্রক্রিয়া চিত্র)</h4>
        <p className="text-xs text-slate-400">Process diagram-এ কোনো কিছু কীভাবে তৈরি হয় বা কাজ করে তা দেখানো হয়। এখানে passive voice এবং sequencing language ব্যবহার করতে হয়।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-slate-400 font-bold mb-1">গুরুত্বপূর্ণ ভাষা:</p>
          <p><span className="text-blue-400 font-bold">Sequencing:</span> <span className="text-slate-300">"first", "initially", "next", "subsequently", "after this", "finally", "the last stage involves"</span></p>
          <p><span className="text-purple-400 font-bold">Passive voice:</span> <span className="text-slate-300">"is heated", "are collected", "is then transported"</span></p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Overview:</p>
          <p className="text-slate-300 italic">"Overall, the diagram illustrates a six-stage process for producing recycled paper, beginning with the collection of waste paper and concluding with the packaging of the finished product."</p>
          <p className="text-amber-300/70 font-bold">Sample Body Paragraph:</p>
          <p className="text-slate-300 italic">"In the first stage, used paper is collected from homes and offices and transported to a recycling facility. The paper is then sorted by type and quality before being shredded into small pieces. These fragments are subsequently mixed with water and chemicals to create a pulp, which is then filtered to remove any contaminants."</p>
        </div>
      </div>

      {/* 3.2f Map Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.2f Map Comparison (মানচিত্র তুলনা)</h4>
        <p className="text-xs text-slate-400">Map comparison সাধারণত একটি স্থানের আগে ও পরের অবস্থা দেখায়।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-slate-400 font-bold mb-1">গুরুত্বপূর্ণ ভাষা:</p>
          <p><span className="text-emerald-400 font-bold">পরিবর্তন:</span> <span className="text-slate-300">"was replaced by", "was demolished", "was constructed", "was extended", "has been converted into"</span></p>
          <p><span className="text-blue-400 font-bold">অবস্থান:</span> <span className="text-slate-300">"to the north", "in the centre", "adjacent to", "opposite"</span></p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Overview:</p>
          <p className="text-slate-300 italic">"Overall, the town underwent significant development between 1990 and 2020, with residential areas expanding considerably to the east and several industrial buildings being replaced by commercial facilities."</p>
          <p className="text-amber-300/70 font-bold">Sample Body Paragraph:</p>
          <p className="text-slate-300 italic">"In 1990, a factory occupied the northern section of the town, adjacent to the main road. By 2020, this factory had been demolished and replaced by a shopping centre. To the south, the farmland that had previously covered a large area was converted into a housing estate, significantly increasing the town's residential capacity."</p>
        </div>
      </div>

      {/* 3.2g Mixed / Multiple Charts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.2g Mixed / Multiple Charts + Overview Writing (মিশ্র চিত্র)</h4>
        <p className="text-xs text-slate-400">দুটি ভিন্ন chart থাকলে দুটির মধ্যে connection খুঁজুন এবং overview-এ একটি common trend উল্লেখ করুন।</p>
      </div>

      {/* CALLOUT: Overview */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90">
        <p><strong>মূল কথা:</strong> Overview হল Task 1-এর সবচেয়ে গুরুত্বপূর্ণ অংশ। Overview ছাড়া Band 6-এর বেশি পাওয়া কঠিন। সব figure দেওয়ার চেষ্টা করবেন না — সবচেয়ে গুরুত্বপূর্ণ data বেছে নিন।</p>
      </div>
    </section>

    {/* SECTION 3.3 — TASK 1 GENERAL TRAINING */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.3 Task 1 General Training — চিঠি লেখা
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p>General Training Task 1-এ আপনাকে একটি চিঠি লিখতে হবে — minimum <strong className="text-amber-300">150 words</strong>, প্রায় 20 মিনিটে। তিনটি bullet points দেওয়া থাকে এবং সবগুলো cover করতে হবে।</p>
      </div>

      {/* Register Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">তিনটি Register (ভাষার ধরন)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-bold">চিঠির ধরন</th>
                <th className="text-left py-2 px-3 text-slate-400 font-bold">কাছে</th>
                <th className="text-left py-2 px-3 text-slate-400 font-bold">Opening</th>
                <th className="text-left py-2 px-3 text-slate-400 font-bold">Closing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2 px-3 text-amber-300 font-bold">Formal</td>
                <td className="py-2 px-3 text-slate-300">অপরিচিত ব্যক্তি, কর্তৃপক্ষ, কোম্পানি</td>
                <td className="py-2 px-3 text-slate-300">"Dear Sir/Madam,"</td>
                <td className="py-2 px-3 text-slate-300">"Yours faithfully,"</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-blue-300 font-bold">Semi-formal</td>
                <td className="py-2 px-3 text-slate-300">পরিচিত কিন্তু ঘনিষ্ঠ নয় (প্রতিবেশী, landlord)</td>
                <td className="py-2 px-3 text-slate-300">"Dear Mr/Ms [name],"</td>
                <td className="py-2 px-3 text-slate-300">"Yours sincerely,"</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-300 font-bold">Informal</td>
                <td className="py-2 px-3 text-slate-300">বন্ধু, পরিবার</td>
                <td className="py-2 px-3 text-slate-300">"Dear [first name],"</td>
                <td className="py-2 px-3 text-slate-300">"Best wishes," / "Take care,"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Letter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">Formal Letter — নমুনা লাইন</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-slate-400 font-bold">Opening lines:</p>
          <p className="text-slate-300 italic">"I am writing to express my dissatisfaction with the service I recently received at your establishment."</p>
          <p className="text-slate-300 italic">"I am writing with regard to the advertisement published in the Daily Star on 12 May."</p>
          <p className="text-slate-300 italic">"I am writing to apply for the position of Marketing Manager as advertised on your website."</p>
          <p className="text-slate-400 font-bold mt-2">Closing lines:</p>
          <p className="text-slate-300 italic">"I look forward to receiving your prompt response and hope this matter can be resolved at the earliest convenience."</p>
          <p className="text-slate-300 italic">"I trust you will give this matter your urgent attention and I await your reply."</p>
          <p className="text-slate-300 italic">"Please do not hesitate to contact me should you require any further information."</p>
        </div>
      </div>

      {/* Semi-formal Letter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">Semi-formal Letter — নমুনা লাইন</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-slate-400 font-bold">Opening lines:</p>
          <p className="text-slate-300 italic">"I am writing to bring a matter to your attention that I feel requires prompt action."</p>
          <p className="text-slate-300 italic">"I hope this letter finds you well. I wanted to raise a concern regarding the noise levels in our building."</p>
          <p className="text-slate-300 italic">"I am writing regarding the recent changes to our lease agreement that we discussed briefly last week."</p>
          <p className="text-slate-400 font-bold mt-2">Closing lines:</p>
          <p className="text-slate-300 italic">"I hope we can resolve this matter amicably and I look forward to hearing from you soon."</p>
          <p className="text-slate-300 italic">"Thank you for taking the time to consider my concerns. I hope we can find a mutually agreeable solution."</p>
          <p className="text-slate-300 italic">"Please feel free to contact me if you have any questions."</p>
        </div>
      </div>

      {/* Informal Letter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">Informal Letter — নমুনা লাইন</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-slate-400 font-bold">Opening lines:</p>
          <p className="text-slate-300 italic">"How are you? It was so lovely to receive your letter — it really made my day!"</p>
          <p className="text-slate-300 italic">"Hi! I hope everything's going well with you and your family."</p>
          <p className="text-slate-300 italic">"It's been ages since we last caught up — I have so much to tell you!"</p>
          <p className="text-slate-400 font-bold mt-2">Closing lines:</p>
          <p className="text-slate-300 italic">"Write back soon — I can't wait to hear all your news!"</p>
          <p className="text-slate-300 italic">"Looking forward to seeing you soon. Take care of yourself!"</p>
          <p className="text-slate-300 italic">"Give my love to everyone at home. Lots of love,"</p>
        </div>
      </div>

      {/* CALLOUT: Register */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90 space-y-1">
        <p><strong>মূল কথা:</strong> Register-এর ভুল হলে Task Achievement-এ বড় penalty পড়ে। সব bullet point cover না করলে marks কমে। Formal letter-এ "I am writing to..." দিয়ে শুরু করুন। Informal letter-এ contractions ("I'm", "don't", "you've") ব্যবহার করুন।</p>
      </div>
    </section>

    {/* SECTION 3.4 — TASK 2 ESSAY TYPES */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.4 Task 2 Essay Types — প্রবন্ধের ধরন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p>Task 2-তে minimum <strong className="text-amber-300">250 words</strong> লিখতে হবে, সময় প্রায় 40 মিনিট।</p>
      </div>

      {/* 3.4a Opinion Essay */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.4a Opinion Essay (Agree / Disagree)</h4>
        <p className="text-xs text-slate-400">প্রশ্নের ধরন: "To what extent do you agree or disagree with this statement?" — আপনাকে একটি স্পষ্ট position নিতে হবে।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-amber-300/70 font-bold">Structure Template:</p>
          <p className="text-slate-300"><span className="text-blue-400 font-bold">Paragraph 1 — Introduction:</span> Paraphrase the statement + State your clear position (thesis)</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 2 — Main reason:</span> Topic Sentence → Explanation → Example/Evidence</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 3 — Second reason:</span> Topic Sentence → Explanation → Example (বা counter-argument + refutation)</p>
          <p className="text-slate-300"><span className="text-purple-400 font-bold">Paragraph 4 — Conclusion:</span> Restate position + Summarise key points</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Example Thesis Statement:</p>
          <p className="text-slate-300 italic">"I strongly agree that governments should invest heavily in renewable energy, as it offers both environmental and long-term economic benefits that far outweigh the initial costs."</p>
        </div>
      </div>

      {/* 3.4b Discussion Essay */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.4b Discussion Essay (Discuss Both Views)</h4>
        <p className="text-xs text-slate-400">প্রশ্নের ধরন: "Discuss both views and give your own opinion." — উভয় পক্ষের যুক্তি উপস্থাপন করতে হবে এবং শেষে নিজের মত দিতে হবে।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-amber-300/70 font-bold">Structure Template:</p>
          <p className="text-slate-300"><span className="text-blue-400 font-bold">Paragraph 1 — Introduction:</span> Introduce topic + Outline both views + State opinion briefly</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 2 — First view (View A):</span> Topic Sentence → Supporting reasons and examples</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 3 — Second view (View B):</span> Topic Sentence → Supporting reasons and examples</p>
          <p className="text-slate-300"><span className="text-purple-400 font-bold">Paragraph 4 — Conclusion:</span> State your own view clearly + Summarise why you lean toward one side</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Example Thesis Statement:</p>
          <p className="text-slate-300 italic">"While some argue that children should focus entirely on academic study, I believe that a balance of academic and extracurricular activities is more beneficial for their overall development."</p>
        </div>
      </div>

      {/* 3.4c Advantages / Disadvantages */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.4c Advantages / Disadvantages Essay</h4>
        <p className="text-xs text-slate-400">প্রশ্নের ধরন 1: "What are the advantages and disadvantages of...?" / ধরন 2: "Do the advantages outweigh the disadvantages?" — দুটি প্রশ্নের কাঠামো আলাদা।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-amber-300/70 font-bold">Structure Template (Outweigh):</p>
          <p className="text-slate-300"><span className="text-blue-400 font-bold">Paragraph 1 — Introduction:</span> Paraphrase + State whether advantages outweigh</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 2 — Advantages:</span> 2টি advantage + examples</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 3 — Disadvantages:</span> 1–2টি disadvantage + examples</p>
          <p className="text-slate-300"><span className="text-purple-400 font-bold">Paragraph 4 — Conclusion:</span> Restate whether advantages outweigh</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Example Thesis Statement:</p>
          <p className="text-slate-300 italic">"Although remote working brings certain challenges, I believe the advantages — including improved work-life balance and reduced commuting costs — significantly outweigh the drawbacks."</p>
        </div>
      </div>

      {/* 3.4d Problem / Solution */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.4d Problem / Solution Essay</h4>
        <p className="text-xs text-slate-400">প্রশ্নের ধরন: "What are the causes of this problem and what solutions can be suggested?"</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-amber-300/70 font-bold">Structure Template:</p>
          <p className="text-slate-300"><span className="text-blue-400 font-bold">Paragraph 1 — Introduction:</span> Paraphrase the problem + State essay will examine causes and solutions</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 2 — Problems / Causes:</span> 2টি + examples</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 3 — Solutions:</span> 2টি + examples</p>
          <p className="text-slate-300"><span className="text-purple-400 font-bold">Paragraph 4 — Conclusion:</span> Summarise key solutions and their expected impact</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Example Thesis Statement:</p>
          <p className="text-slate-300 italic">"Traffic congestion in major cities stems primarily from over-reliance on private vehicles and inadequate public transport infrastructure, but these problems can be effectively addressed through targeted government investment and policy changes."</p>
        </div>
      </div>

      {/* 3.4e Two-Part / Direct Question */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">3.4e Two-Part / Direct Question Essay</h4>
        <p className="text-xs text-slate-400">প্রশ্নের ধরন: "Why has this happened? Is this a positive or negative development?" — প্রতিটি প্রশ্নের উত্তর আলাদা paragraph-এ।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <p className="text-amber-300/70 font-bold">Structure Template:</p>
          <p className="text-slate-300"><span className="text-blue-400 font-bold">Paragraph 1 — Introduction:</span> Paraphrase + Mention both questions will be addressed</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 2 — Answer to Q1:</span> e.g., reasons/causes</p>
          <p className="text-slate-300"><span className="text-emerald-400 font-bold">Paragraph 3 — Answer to Q2:</span> e.g., positive/negative</p>
          <p className="text-slate-300"><span className="text-purple-400 font-bold">Paragraph 4 — Conclusion:</span> Summarise both answers briefly</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Example Thesis Statement:</p>
          <p className="text-slate-300 italic">"The rise in single-person households is primarily driven by changing social attitudes and economic independence; while this trend has certain social drawbacks, I consider it largely a positive development that reflects greater individual freedom."</p>
        </div>
      </div>

      {/* CALLOUT: Essay Types */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90">
        <p><strong>মূল কথা:</strong> Task 2-এ প্রশ্নের ধরন identify করাই প্রথম কাজ। ভুল essay type লিখলে Task Response-এ বড় penalty। সব essay type-এ introduction এবং conclusion থাকতে হবে — শুধু body paragraph দিলে Coherence & Cohesion কমে।</p>
      </div>
    </section>

    {/* SECTION 3.5 — ESSAY STRUCTURE TEMPLATES */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.5 Essay Structure Templates — পরিচিতি, মূল অংশ, উপসংহার
      </h3>

      {/* Introduction */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">Introduction লেখার নিয়ম</h4>
        <p className="text-xs text-slate-400">একটি ভালো introduction-এ দুটি অংশ থাকে:</p>
        <div className="space-y-1.5 text-xs">
          <p><span className="text-blue-400 font-bold">Background sentence:</span> <span className="text-slate-300">Topic paraphrase করুন (প্রশ্ন copy করবেন না)</span></p>
          <p><span className="text-emerald-400 font-bold">Thesis statement:</span> <span className="text-slate-300">আপনার main position বা essay plan স্পষ্ট করুন</span></p>
        </div>
        <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-red-400 font-bold">দুর্বল Introduction (এড়িয়ে চলুন):</p>
          <p className="text-slate-400 italic">"Nowadays, many people think that technology is very important. In this essay, I will discuss this topic."</p>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-emerald-400 font-bold">শক্তিশালী Introduction:</p>
          <p className="text-slate-300 italic">"In recent decades, technological advancements have transformed virtually every aspect of modern life, prompting considerable debate about their overall impact on society. While technology undeniably brings numerous benefits, I believe that its negative consequences — particularly regarding human connection and mental health — are cause for serious concern."</p>
        </div>
      </div>

      {/* Body Paragraph PEEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">Body Paragraph Structure (PEEL)</h4>
        <p className="text-xs text-slate-400">প্রতিটি body paragraph-এ এই structure ব্যবহার করুন:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
            <span className="text-amber-300 font-bold text-lg">P</span>
            <p className="text-slate-300 font-bold">Point</p>
            <p className="text-slate-400">Topic Sentence — paragraph-এর main idea</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
            <span className="text-amber-300 font-bold text-lg">E</span>
            <p className="text-slate-300 font-bold">Explanation</p>
            <p className="text-slate-400">Point কেন সত্য তা ব্যাখ্যা করুন</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
            <span className="text-amber-300 font-bold text-lg">E</span>
            <p className="text-slate-300 font-bold">Example</p>
            <p className="text-slate-400">Concrete example বা evidence দিন</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
            <span className="text-amber-300 font-bold text-lg">L</span>
            <p className="text-slate-300 font-bold">Link</p>
            <p className="text-slate-400">পরবর্তী paragraph-এ যাওয়ার সেতু (optional)</p>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Body Paragraph:</p>
          <p className="text-slate-300 italic leading-relaxed">"One significant advantage of renewable energy is its potential to reduce air pollution in urban areas. Unlike fossil fuels, solar and wind energy produce no harmful emissions during operation, which means that widespread adoption could dramatically improve air quality in cities where respiratory diseases are increasingly prevalent. In countries such as Denmark, for instance, a substantial shift to wind energy has coincided with measurable improvements in public health outcomes. This demonstrates that investing in clean energy is not merely an environmental issue, but a public health priority as well."</p>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-amber-100">Conclusion লেখার নিয়ম</h4>
        <div className="space-y-1.5 text-xs">
          <p><span className="text-blue-400 font-bold">শুরু:</span> <span className="text-slate-300">"In conclusion," বা "To conclude," দিয়ে শুরু করুন</span></p>
          <p><span className="text-emerald-400 font-bold">Thesis:</span> <span className="text-slate-300">Thesis restate করুন (নতুন করে বলুন, হুবহু copy করবেন না)</span></p>
          <p><span className="text-purple-400 font-bold">Summary:</span> <span className="text-slate-300">Key points সংক্ষেপে বলুন</span></p>
          <p><span className="text-red-400 font-bold">Warning:</span> <span className="text-slate-300">নতুন কোনো idea দেওয়া যাবে না</span></p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">Sample Conclusion:</p>
          <p className="text-slate-300 italic">"In conclusion, while renewable energy requires considerable initial investment, the long-term environmental and economic benefits far outweigh these costs. Governments that prioritise clean energy development will not only reduce their carbon footprint but also create more sustainable and resilient economies for future generations."</p>
        </div>
      </div>

      {/* CALLOUT: Intro + Conclusion */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90">
        <p><strong>মূল কথা:</strong> Introduction + Conclusion মিলিয়ে প্রায় 15–20% words ব্যবহার করুন। Body paragraphs-এ বেশি সময় দিন কারণ এখানেই marks আসে।</p>
      </div>
    </section>

    {/* SECTION 3.6 — COHESION & LINKING DEVICES */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.6 Cohesion & Linking Devices — সংযোগ শব্দ
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-300">
        <p>Linking words ব্যবহার করা জরুরি কিন্তু overuse করলে Coherence & Cohesion-এ marks কমে। প্রতিটি sentence শুরুতে connector দেওয়া ভুল।</p>
      </div>

      {/* Linking Devices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-bold">Function</th>
                <th className="text-left py-2 px-3 text-slate-400 font-bold">Devices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2 px-3 text-amber-300 font-bold">Addition (যোগ)</td>
                <td className="py-2 px-3 text-slate-300">"Furthermore," / "Moreover," / "In addition," / "What is more," / "Additionally," / "not only... but also..."</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-red-300 font-bold">Contrast (বিপরীত)</td>
                <td className="py-2 px-3 text-slate-300">"However," / "Nevertheless," / "On the other hand," / "In contrast," / "Despite this," / "Even so," / "Although..." / "While..." / "Whereas..."</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-blue-300 font-bold">Cause & Effect</td>
                <td className="py-2 px-3 text-slate-300">"As a result," / "Consequently," / "Therefore," / "This leads to..." / "Hence," / "Thus," / "Due to..." / "Owing to..." / "Because of..."</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-300 font-bold">Examples (উদাহরণ)</td>
                <td className="py-2 px-3 text-slate-300">"For example," / "For instance," / "such as" / "including" / "namely" / "To illustrate," / "A case in point is..."</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-purple-300 font-bold">Concession (স্বীকার)</td>
                <td className="py-2 px-3 text-slate-300">"Admittedly," / "It is true that..." / "While it is acknowledged that..." / "Despite the fact that..." / "Even though..."</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-amber-300 font-bold">Conclusion / Summary</td>
                <td className="py-2 px-3 text-slate-300">"In conclusion," / "To conclude," / "To summarise," / "Overall," / "In short," / "In brief,"</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-300 font-bold">Sequence (ক্রম)</td>
                <td className="py-2 px-3 text-slate-300">"First of all," / "Initially," / "To begin with," / "Subsequently," / "Following this," / "Next," / "Finally," / "Lastly,"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CALLOUT: Linking */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90 space-y-1">
        <p><strong>মূল কথা:</strong> Linking devices ব্যবহারে range দেখান — একই connector বারবার ব্যবহার করবেন না। "However" শব্দটি একটি essay-তে সর্বোচ্চ দু'বার ব্যবহার করুন। Cohesion শুধু connector দিয়ে আসে না — pronouns ("it", "this", "they"), synonyms এবং logical idea ordering-ও Cohesion তৈরি করে।</p>
      </div>
    </section>

    {/* SECTION 3.7 — COMMON TASK 2 TOPICS */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.7 Common Task 2 Topics — বিষয়ভিত্তিক প্রস্তুতি
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-300">
        <p>Task 2-এ নিচের বিষয়গুলো বারবার আসে। প্রতিটি বিষয়ে কিছু ideas এবং vocabulary প্রস্তুত রাখুন।</p>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Education */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">🎓 Education (শিক্ষা)</h4>
          <p className="text-xs text-slate-400">Key ideas: university vs vocational training, online learning, tuition fees, teacher quality, exam pressure, skills gap</p>
          <p className="text-xs text-slate-500 italic">Vocab: "higher education", "literacy rates", "curriculum", "state-funded", "private schooling"</p>
        </div>
        {/* Environment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">🌍 Environment (পরিবেশ)</h4>
          <p className="text-xs text-slate-400">Key ideas: climate change, renewable energy, deforestation, plastic pollution, government vs individual action</p>
          <p className="text-xs text-slate-500 italic">Vocab: "carbon emissions", "fossil fuels", "sustainable development", "biodiversity"</p>
        </div>
        {/* Technology */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">💻 Technology (প্রযুক্তি)</h4>
          <p className="text-xs text-slate-400">Key ideas: AI and jobs, social media, screen time, digital divide, privacy concerns, automation</p>
          <p className="text-xs text-slate-500 italic">Vocab: "artificial intelligence", "digital literacy", "surveillance", "innovation"</p>
        </div>
        {/* Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">🏥 Health (স্বাস্থ্য)</h4>
          <p className="text-xs text-slate-400">Key ideas: obesity, mental health, healthcare funding, lifestyle diseases, alternative medicine</p>
          <p className="text-xs text-slate-500 italic">Vocab: "public health", "sedentary lifestyle", "preventative medicine", "obesity epidemic"</p>
        </div>
        {/* Society */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">👥 Society (সমাজ)</h4>
          <p className="text-xs text-slate-400">Key ideas: ageing population, gender equality, immigration, urbanisation, crime rates</p>
          <p className="text-xs text-slate-500 italic">Vocab: "demographic shift", "social cohesion", "multiculturalism", "inequality"</p>
        </div>
        {/* Government */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">🏛 Government (সরকার)</h4>
          <p className="text-xs text-slate-400">Key ideas: public spending, censorship, freedom of speech, taxation, welfare state</p>
          <p className="text-xs text-slate-500 italic">Vocab: "legislation", "policy-makers", "public sector", "civic responsibility"</p>
        </div>
        {/* Globalisation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">🌐 Globalisation (বৈশ্বিকীকরণ)</h4>
          <p className="text-xs text-slate-400">Key ideas: cultural homogenisation, free trade, multinational companies, brain drain</p>
          <p className="text-xs text-slate-500 italic">Vocab: "cultural identity", "economic interdependence", "outsourcing", "trade barriers"</p>
        </div>
        {/* Crime */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-100">⚖️ Crime (অপরাধ)</h4>
          <p className="text-xs text-slate-400">Key ideas: causes of crime (poverty, unemployment), rehabilitation vs punishment, prison overcrowding</p>
          <p className="text-xs text-slate-500 italic">Vocab: "recidivism", "deterrent", "rehabilitation", "incarceration", "juvenile delinquency"</p>
        </div>
        {/* Work */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 md:col-span-2">
          <h4 className="text-xs font-bold text-amber-100">💼 Work (কাজ)</h4>
          <p className="text-xs text-slate-400">Key ideas: remote working, work-life balance, gender pay gap, automation and unemployment, job satisfaction</p>
          <p className="text-xs text-slate-500 italic">Vocab: "flexible working", "employee wellbeing", "productivity", "redundancy", "gig economy"</p>
        </div>
      </div>

      {/* CALLOUT: Topics */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90">
        <p><strong>মূল কথা:</strong> প্রতিটি বিষয়ে ৩–৪টি strong argument মুখস্থ রাখুন। কিন্তু পুরো paragraph মুখস্থ করবেন না — examiners memorised language চিনতে পারেন এবং Task Response-এ mark কাটেন।</p>
      </div>
    </section>

    {/* SECTION 3.8 — BAND COMPARISON */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.8 Sample Band 6 / 7 / 8 / 9 Essays Compared — পার্থক্য কোথায়?
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
        <p>Topic: "Some people believe that university education should be free for all students. Others disagree. Discuss both views and give your own opinion."</p>
      </div>

      {/* Band 6 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-orange-900/50 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full">Band 6</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
          <p className="text-slate-300 italic leading-relaxed">"There are many advantages and disadvantages of free university education. Some people think it is good because poor students can study. But some people think it is bad because the government will have no money. In my opinion, I think university should be free because education is important for everyone."</p>
        </div>
        <p className="text-xs text-slate-400"><span className="text-amber-300/70 font-bold">বাংলা মন্তব্য:</span> এই paragraph-এ basic ideas আছে কিন্তু development নেই। "education is important" — এটা খুবই generic। কোনো specific example নেই। Vocabulary সীমিত ("good", "bad", "important")। Sentence structure সব simple।</p>
      </div>

      {/* Band 7 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-900/50 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full">Band 7</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
          <p className="text-slate-300 italic leading-relaxed">"Proponents of free university education argue that removing financial barriers would allow talented students from low-income backgrounds to access higher education. Currently, many capable young people are deterred from pursuing a degree because of the substantial debt they would incur. If university were free, these individuals could contribute more fully to the economy and society. However, this policy would require significant government funding, which would likely mean higher taxes for the general population."</p>
        </div>
        <p className="text-xs text-slate-400"><span className="text-amber-300/70 font-bold">বাংলা মন্তব্য:</span> এই paragraph-এ একটি clear argument আছে, ভালোভাবে develop করা হয়েছে। Vocabulary more varied ("proponents", "deterred", "incur")। Complex structures আছে ("If... were", "which would likely mean")।</p>
      </div>

      {/* Band 8 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-900/50 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">Band 8</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
          <p className="text-slate-300 italic leading-relaxed">"Advocates of tuition-free higher education contend that the long-term economic gains of a more highly educated workforce justify the initial public expenditure. Research consistently demonstrates that individuals with university degrees earn significantly more over their lifetime, contributing more to tax revenues and reducing dependence on welfare systems. In countries such as Germany and Norway, where tertiary education is largely state-funded, graduate employment rates are among the highest in the world, suggesting that such investment yields measurable societal dividends."</p>
        </div>
        <p className="text-xs text-slate-400"><span className="text-amber-300/70 font-bold">বাংলা মন্তব্য:</span> Sophisticated। Real examples (Germany, Norway)। Vocabulary excellent ("contend", "tertiary", "expenditure", "yields measurable societal dividends")। Sentence variety চমৎকার।</p>
      </div>

      {/* Band 9 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-purple-900/50 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full">Band 9</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
          <p className="text-slate-300 italic leading-relaxed">"Those who champion the universal provision of higher education make a compelling case rooted in both social justice and economic pragmatism. By eliminating the financial deterrent that prevents academically gifted yet economically disadvantaged students from pursuing tertiary study, governments can tap into a reservoir of untapped human capital. The Nordic model — exemplified by Finland and Sweden, where university education is not merely subsidised but entirely cost-free — has produced some of the world's most innovative economies and highest levels of social mobility."</p>
        </div>
        <p className="text-xs text-slate-400"><span className="text-amber-300/70 font-bold">বাংলা মন্তব্য:</span> Band 9-এর বৈশিষ্ট্য: "untapped human capital", "transcend any budgetary concerns"। প্রতিটি sentence precision ও depth-এ ভরপুর।</p>
      </div>

      {/* CALLOUT: Band Progression */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90">
        <p><strong>মূল কথা:</strong> Band 6 → 7: ideas develop করতে হবে, generic language এড়াতে হবে। Band 7 → 8: real examples এবং sophisticated vocabulary দরকার। Band 8 → 9: প্রতিটি sentence-এ precision এবং depth দরকার। Vocabulary আপনার স্কোর সবচেয়ে দ্রুত বাড়াতে পারে।</p>
      </div>
    </section>

    {/* SECTION 3.9 — COMMON MISTAKES */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        3.9 Common Mistakes — পরীক্ষক কীভাবে marks কাটেন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-300">
        <p>নিচের ভুলগুলো IELTS Writing-এ সবচেয়ে বেশি দেখা যায়। এগুলো এড়িয়ে চললে সহজেই Band 0.5–1.0 বাড়ানো সম্ভব।</p>
      </div>

      {/* Mistakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { num: '১', title: 'মুখস্থ Introduction ব্যবহার করা', problem: '"In today\'s modern world, it is a debatable topic whether..." — পরীক্ষকরা এই ধরনের memorised phrases চিনতে পারেন।', solution: 'প্রশ্নটি নিজের ভাষায় paraphrase করুন।' },
          { num: '২', title: 'প্রশ্নের ভাষা হুবহু কপি করা', problem: 'Task 1-এ question থেকে পুরো বাক্য তুলে দেওয়া।', solution: 'Synonyms এবং different structures ব্যবহার করে paraphrase করুন।' },
          { num: '৩', title: 'Off-topic উত্তর দেওয়া', problem: 'প্রশ্নে "government should fund arts" বলা থাকলে শুধু "arts is important" নিয়ে লেখা।', solution: 'প্রতিটি paragraph লেখার আগে নিজেকে জিজ্ঞেস করুন — "এটা কি প্রশ্নের উত্তর দিচ্ছে?"' },
          { num: '৪', title: 'Word count পূরণ না করা', problem: 'Task 2-তে 220 words লেখা।', solution: 'প্রতিটি point-এ example এবং explanation যোগ করুন। Body paragraph minimum 90–100 words।' },
          { num: '৫', title: 'শুধু simple sentences লেখা', problem: '"Technology is important. It helps people. People use it every day."', solution: 'Complex sentences ব্যবহার করুন।' },
          { num: '৬', title: 'Linking words অতিরিক্ত ব্যবহার', problem: '"Firstly,... Secondly,... Thirdly,... Furthermore,... Moreover,... Additionally,..."', solution: 'Coherence & Cohesion-এ এটি mechanical মনে হয়। প্রাকৃতিকভাবে ideas connect করুন।' },
          { num: '৭', title: 'Task 1-এ Overview না লেখা', problem: 'সরাসরি data দিয়ে শুরু করা।', solution: 'Overview অবশ্যই লিখতে হবে — এটি Task Achievement-এর সবচেয়ে গুরুত্বপূর্ণ অংশ।' },
          { num: '৮', title: 'Task 1-এ সব data দেওয়ার চেষ্টা', problem: 'প্রতিটি সংখ্যা তালিকা করা — এটি report নয়, এটি summary।', solution: 'Trends, extremes, এবং notable differences বেছে নিন।' },
          { num: '৯', title: 'Task 1 General-এ register mix করা', problem: 'Formal letter-এ "Hey!" বা informal letter-এ "I am writing to formally notify..."', solution: 'প্রশ্নের situation পড়ে সঠিক register নির্ধারণ করুন।' },
          { num: '১০', title: 'Conclusion-এ নতুন idea দেওয়া', problem: 'Conclusion-এ নতুন argument বা উদাহরণ যোগ করা।', solution: 'Conclusion শুধু restate করে এবং summarise করে — নতুন কিছু যোগ করে না।' },
          { num: '১১', title: 'Sentence fragments', problem: '"Because technology is changing. And society too."', solution: 'প্রতিটি sentence-এ একটি subject এবং একটি verb থাকতে হবে।' },
          { num: '১২', title: 'Task 2-এ personal examples শুধু ব্যবহার', problem: '"My friend told me that..." — এটি IELTS essay-তে unprofessional।', solution: 'General examples ব্যবহার করুন: "Studies have shown...", "In countries such as...", "Research suggests..."' },
        ].map((m) => (
          <div key={m.num} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold text-xs">ভুল {m.num}</span>
              <span className="text-xs font-bold text-amber-100">{m.title}</span>
            </div>
            <p className="text-xs text-red-400/80"><span className="font-bold">সমস্যা:</span> {m.problem}</p>
            <p className="text-xs text-emerald-400/80"><span className="font-bold">সমাধান:</span> {m.solution}</p>
          </div>
        ))}
      </div>

      {/* CALLOUT: Mistakes */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90">
        <p><strong>মূল কথা:</strong> ভুলের তালিকা দেখে নিজের practice essay-গুলো check করুন। একজন ভালো teacher বা examiner-এর কাছ থেকে feedback নিন। Error pattern চিহ্নিত করা score improvement-এর সবচেয়ে দ্রুত পথ।</p>
      </div>
    </section>

    {/* SECTION: MODULE SUMMARY */}
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-amber-200 border-b border-amber-800/50 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-2">
        <p><strong className="text-amber-300">3.1 Assessment Criteria:</strong> চারটি criterion — Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy — প্রতিটি 25%।</p>
        <p><strong className="text-amber-300">3.2 Task 1 Academic:</strong> Line graph, Bar chart, Pie chart, Table, Process diagram, Map comparison এবং Mixed charts। Overview লেখা Task 1-এর সবচেয়ে গুরুত্বপূর্ণ অংশ।</p>
        <p><strong className="text-amber-300">3.3 Task 1 General Training:</strong> Formal, Semi-formal এবং Informal letter।</p>
        <p><strong className="text-amber-300">3.4 Task 2 Essay Types:</strong> Opinion, Discussion, Advantages/Disadvantages, Problem/Solution, Two-part question।</p>
        <p><strong className="text-amber-300">3.5 Essay Structure:</strong> Introduction (background + thesis), Body paragraph (PEEL), Conclusion।</p>
        <p><strong className="text-amber-300">3.6 Linking Devices:</strong> 7 categories অনুযায়ী linking words, overuse এড়ানোর কৌশল।</p>
        <p><strong className="text-amber-300">3.7 Common Topics:</strong> Education, Environment, Technology, Health, Society, Government, Globalisation, Crime, Work।</p>
        <p><strong className="text-amber-300">3.8 Band Comparison:</strong> Band 6, 7, 8, 9 sample paragraphs তুলনা।</p>
        <p><strong className="text-amber-300">3.9 Common Mistakes:</strong> 12টি সাধারণ ভুল এবং প্রতিটির সমাধান।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 space-y-2">
        <p><strong>পরবর্তী পদক্ষেপ:</strong></p>
        <p>• প্রতিদিন একটি Task 1 এবং একটি Task 2 practice করুন।</p>
        <p>• Cambridge IELTS (1–18) বইয়ের past papers ব্যবহার করুন।</p>
        <p>• প্রতিটি essay-এ নিজেই চারটি criteria দিয়ে self-assess করুন।</p>
        <p>• সম্ভব হলে একজন qualified teacher-এর কাছ থেকে feedback নিন।</p>
      </div>
    </section>

    {/* CLAIM XP BUTTON */}
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
      <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? Click below to claim your reward:</p>
      <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
        Claim +10 XP
      </button>
    </div>
  </section>
);

const MODULE_04_NOTES = (
  <div className="space-y-10 text-slate-300 leading-relaxed max-w-4xl">

    {/* ─── OVERVIEW CARD ─────────────────────────────────────────────────────── */}
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎯 এই module-এ যা শিখবেন
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md">লক্ষ্য Band: ৬.৫ – ৮</span>
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">Module: ০৪ — Speaking</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 italic">ভাষা: বাংলা (IELTS terminology সবসময় English-এ)</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300 pt-2">
        <li className="flex items-center gap-2">🔹 Format ও assessment criteria</li>
        <li className="flex items-center gap-2">🔹 Part 1 — Introduction ও interview</li>
        <li className="flex items-center gap-2">🔹 Part 2 — Cue card / long turn</li>
        <li className="flex items-center gap-2">🔹 Part 3 — Discussion</li>
        <li className="flex items-center gap-2">🔹 Pronunciation training</li>
        <li className="flex items-center gap-2">🔹 Fluency booster ও filler-word alternatives</li>
        <li className="flex items-center gap-2">🔹 Idioms ও natural collocations</li>
        <li className="flex items-center gap-2">🔹 Mock interview ও band feedback</li>
      </ul>
    </div>

    {/* ─── 4.1 FORMAT & ASSESSMENT CRITERIA ──────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.১ Format এবং Assessment Criteria
      </h2>

      <h3 className="text-lg font-semibold text-slate-200">পরীক্ষার কাঠামো</h3>
      <p>IELTS Speaking test মোট ১১–১৪ মিনিট দীর্ঘ। এটি একটি face-to-face interview যেখানে একজন trained examiner আপনার সাথে কথা বলবেন। পরীক্ষাটি তিনটি অংশে ভাগ করা:</p>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2.5">অংশ</th><th className="p-2.5">নাম</th><th className="p-2.5">সময়</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr><td className="p-2.5 font-semibold text-white">Part 1</td><td className="p-2.5">Introduction &amp; Interview</td><td className="p-2.5">৪–৫ মিনিট</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Part 2</td><td className="p-2.5">Long Turn (Cue Card)</td><td className="p-2.5">৩–৪ মিনিট (১ মিনিট preparation সহ)</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Part 3</td><td className="p-2.5">Discussion</td><td className="p-2.5">৪–৫ মিনিট</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">এই পরীক্ষায় কোনো writing নেই — শুধু কথা বলতে হবে। পরীক্ষা সাধারণত রেকর্ড করা হয় যাতে second examiner পরে যাচাই করতে পারেন।</p>

      <h3 className="text-lg font-semibold text-slate-200 pt-2">চারটি Assessment Criteria</h3>
      <p>আপনার score নির্ধারিত হয় চারটি সমান criteria দিয়ে, প্রতিটি মোট score-এর ২৫%:</p>

      {/* CRITERION 1 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">২৫%</span>
          ১. Fluency and Coherence
        </h4>
        <p className="text-slate-300">এই criterion-এ দেখা হয় আপনি কতটা স্বাভাবিকভাবে এবং থামা ছাড়া কথা বলতে পারছেন। "Fluency" মানে শুধু দ্রুত কথা বলা নয় — মানে হলো স্বাভাবিক গতিতে কথা বলা, অপ্রয়োজনীয় "uhh" বা "umm" ছাড়া। "Coherence" মানে আপনার কথার একটা স্পষ্ট logical order থাকা এবং linking words ব্যবহার করে ideas গুলো সংযুক্ত করা।</p>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-amber-300">
          <strong className="block mb-1">যা এড়াতে হবে:</strong> দীর্ঘ নীরবতা, একই কথা বারবার বলা, হঠাৎ topic পরিবর্তন।
        </div>
      </div>

      {/* CRITERION 2 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">২৫%</span>
          ২. Lexical Resource
        </h4>
        <p className="text-slate-300">এই criterion-এ দেখা হয় আপনার vocabulary কতটা সমৃদ্ধ এবং সঠিকভাবে ব্যবহৃত। শুধু বড় শব্দ ব্যবহার করলেই চলবে না — শব্দটা সঠিক context-এ ব্যবহার হচ্ছে কিনা সেটা গুরুত্বপূর্ণ। Band ৭+ পেতে হলে idioms এবং collocations স্বাভাবিকভাবে ব্যবহার করতে হবে।</p>
      </div>

      {/* CRITERION 3 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">২৫%</span>
          ৩. Grammatical Range and Accuracy
        </h4>
        <p className="text-slate-300">শুধু simple sentences নয় — complex sentence structures ব্যবহার করার ক্ষমতা দেখা হয়। Conditional sentences, passive voice, relative clauses — এগুলো naturally ব্যবহার করলে score বাড়ে। ছোট ছোট grammar ভুল হলেও চলে, তবে সেগুলো যেন communication-এ বাধা না দেয়।</p>
      </div>

      {/* CRITERION 4 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">২৫%</span>
          ৪. Pronunciation
        </h4>
        <p className="text-slate-300">এই criterion-এ দেখা হয় কতটা clearly আপনি কথা বলছেন। শুধু individual sounds নয় — word stress, sentence stress, intonation এবং chunking (কথা ভাগ করে বলা) সবকিছু মিলিয়ে। Accent থাকা কোনো সমস্যা নয়, কিন্তু examiner-এর বুঝতে সমস্যা হওয়া যাবে না।</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        প্রতিটি criterion সমান গুরুত্বপূর্ণ। শুধু grammar ঠিক করলেই Band ৭ পাবেন না — চারটিতেই ভালো করতে হবে।
      </div>
    </section>

    {/* ─── 4.2 PART 1 — INTRODUCTION & INTERVIEW ─────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.২ Part 1 — Introduction &amp; Interview
      </h2>

      <h3 className="text-lg font-semibold text-slate-200">Part 1 কীভাবে কাজ করে</h3>
      <p>Part 1-এ examiner আপনাকে সাধারণ daily life সম্পর্কে প্রশ্ন করবেন। সাধারণত ৩টি topic থেকে মোট ১০–১২টি প্রশ্ন করা হয়। এই part-এ কোনো চাপ নেই — এটা একটা conversation-এর মতো।</p>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-1">
        <strong className="text-white block font-bold text-sm mb-2">সাধারণ topics:</strong>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800">Work / Study</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800">Hometown / Where you live</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800">Hobbies &amp; free time</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800">Family &amp; friends</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800">Food &amp; cooking</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800">Weather &amp; seasons</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800">Daily routines</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-200">স্বাভাবিকভাবে উত্তর বাড়ানোর কৌশল</h3>
      <p>Part 1-এ একটি sentence-এ উত্তর দিলে score কম হবে। সাধারণত ২–৩ sentences যথেষ্ট।</p>

      {/* PRE METHOD CARD */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono">PRE Method</span>
          Point → Reason → Example
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
            <strong className="text-white block">Point</strong>
            <p className="text-slate-400">সরাসরি প্রশ্নের উত্তর দিন।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
            <strong className="text-white block">Reason</strong>
            <p className="text-slate-400">কেন? বা কীভাবে? সেটা বলুন।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
            <strong className="text-white block">Example</strong>
            <p className="text-slate-400">একটা উদাহরণ দিন।</p>
          </div>
        </div>
      </div>

      {/* MODEL ANSWERS Q1–Q8 */}
      <h3 className="text-lg font-semibold text-slate-200 pt-2">Part 1-এর Sample Questions ও Model Answers</h3>

      {/* Q1 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q1: Do you work or are you a student?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "I'm currently a university student, studying Computer Science in my final year. I really enjoy it because I've always been fascinated by problem-solving, and the degree gives me a lot of practical skills."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          এই উত্তরে student অবস্থা স্পষ্ট করা হয়েছে, subject বলা হয়েছে, এবং কেন পছন্দ করেন সেটা reason সহ বলা হয়েছে। "fascinated by" একটি natural collocation যা Lexical Resource-এ পয়েন্ট দেয়।
        </div>
      </div>

      {/* Q2 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q2: What do you like most about your hometown?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "What I love most about my hometown is the sense of community. Everyone knows each other, and there's always something going on — local festivals, street food stalls, that kind of thing. I suppose it's the warmth of the people that makes it special."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "sense of community" এবং "warmth of the people" চমৎকার collocations। "I suppose" ব্যবহার করে উত্তরটি আরও natural শোনাচ্ছে।
        </div>
      </div>

      {/* Q3 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q3: How do you usually spend your weekends?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "It depends on the time of year, really. In summer, I tend to go for long walks with friends or explore different parts of the city. But when the weather's bad, I usually stay in and catch up on reading or watch something on Netflix."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "It depends on..." দিয়ে শুরু করা একটি চমৎকার কৌশল। "tend to" এবং "catch up on" natural expressions যা স্বাভাবিক spoken English-এর বৈশিষ্ট্য।
        </div>
      </div>

      {/* Q4 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q4: Do you prefer home-cooked food or eating out?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "Honestly, I prefer home-cooked food. There's something really satisfying about preparing your own meal, and you know exactly what's going into it. That said, eating out is a great way to socialize, so I do it occasionally — maybe once or twice a week."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "There's something really satisfying about..." একটি সুন্দর phrase। "That said" একটি excellent linking phrase যা Part 3-এর জন্যও দরকারী।
        </div>
      </div>

      {/* Q5 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q5: Have you always lived in the same city?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "No, not at all. I grew up in a small town in the south, but I moved to the city about five years ago for university. To be honest, I wasn't sure I'd like the hustle and bustle at first, but I've really settled in now."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "hustle and bustle" একটি perfect idiom এখানে। "To be honest" natural filler হিসেবে কাজ করছে। Contrasting sentence structure (wasn't sure... but now) grammatical range দেখাচ্ছে।
        </div>
      </div>

      {/* Q6 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q6: What kind of weather do you like?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "I'm quite a fan of mild, sunny weather — not too hot, not too cold. It just puts me in a good mood and makes me want to go outside. I find that when it's gloomy and overcast, I tend to be a bit less productive."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "puts me in a good mood" একটি natural collocation। "gloomy and overcast" vocabulary variety দেখাচ্ছে।
        </div>
      </div>

      {/* Q7 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q7: Do you spend much time with your family?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "As much as I can, yes. We usually have a big family dinner on Fridays, which is something I really look forward to. My parents and siblings all live nearby, so it's easy to meet up. I think maintaining those family bonds is really important."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "look forward to", "maintaining family bonds" — উভয়ই high-scoring collocations। Present tense এবং habitual aspect সঠিকভাবে ব্যবহার করা হয়েছে।
        </div>
      </div>

      {/* Q8 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q8: Do you enjoy learning new things?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "Absolutely — I'd say I'm a fairly curious person by nature. I'm particularly interested in technology and how things work. I recently picked up a bit of coding in my spare time, just out of interest, and I've been really enjoying it."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "curious person by nature", "picked up" (phrasal verb), "out of interest" সব মিলিয়ে natural, fluent English।
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Part 1-এ সৎ থাকুন এবং real examples দিন। মুখস্থ করা উত্তর examiner বুঝতে পারেন — এটি Fluency &amp; Coherence-এ নেগেটিভ প্রভাব ফেলে।
      </div>
    </section>

    {/* ─── 4.3 PART 2 — CUE CARD / LONG TURN ─────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.৩ Part 2 — Cue Card / Long Turn
      </h2>

      <h3 className="text-lg font-semibold text-slate-200">Part 2 কীভাবে কাজ করে</h3>
      <p>Examiner আপনাকে একটি Cue Card (task card) দেবেন যেখানে একটি topic এবং কিছু bullet points থাকবে। আপনার কাছে থাকবে:</p>
      <ul className="list-disc list-inside text-slate-400 text-xs space-y-1 pl-2">
        <li>১ মিনিট preparation time — notes নিতে পারবেন</li>
        <li>১–২ মিনিট কথা বলার সময় (কমপক্ষে ১ মিনিট বলতে হবে)</li>
        <li>Examiner মাঝে মাঝে শেষে ১–২টি follow-up প্রশ্ন করতে পারেন।</li>
      </ul>

      <h3 className="text-sm font-bold text-white pt-2">২-মিনিট উত্তরের Structure</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Introduction (১৫–২০ সেকেন্ড)</strong>
          <p className="text-slate-400">Topic introduce করুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Main body (৬০–৮০ সেকেন্ড)</strong>
          <p className="text-slate-400">প্রতিটি bullet point cover করুন, details দিন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Personal reflection (১৫–২০ সেকেন্ড)</strong>
          <p className="text-slate-400">Feelings, impact, বা significance বলুন।</p>
        </div>
      </div>

      {/* NOTE-TAKING TEMPLATE */}
      <h3 className="text-sm font-bold text-white pt-2">Note নেওয়ার Template</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1">
        <p className="text-slate-400 italic">১ মিনিটে পুরো sentences লেখার চেষ্টা করবেন না। শুধু keywords লিখুন:</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-0.5 mt-2">
          <div>Topic: _______________</div>
          <div>WHO/WHAT:   [নাম বা বস্তু]</div>
          <div>WHERE:      [স্থান]</div>
          <div>WHEN:       [সময়]</div>
          <div>WHY/HOW:    [কারণ / পরিস্থিতি]</div>
          <div>FEELINGS:   [আপনার অনুভূতি]</div>
          <div>WHY MEMORABLE: [কেন গুরুত্বপূর্ণ]</div>
        </div>
      </div>

      {/* CUE CARD CATEGORIES TABLE */}
      <h3 className="text-sm font-bold text-white pt-2">Cue Card Categories</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2.5">Category</th><th className="p-2.5">উদাহরণ Topic</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr><td className="p-2.5 font-semibold text-white">Person</td><td className="p-2.5">Describe a person who has influenced you.</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Place</td><td className="p-2.5">Describe a place you have visited that you found beautiful.</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Event</td><td className="p-2.5">Describe an important event in your life.</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Object</td><td className="p-2.5">Describe an object that is important to you.</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Experience</td><td className="p-2.5">Describe a time when you learned something new.</td></tr>
          </tbody>
        </table>
      </div>

      {/* SAMPLE CUE CARD */}
      <h3 className="text-lg font-semibold text-slate-200 pt-2">Sample Cue Card ও Model Answer</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
          <strong className="text-white block text-sm">Cue Card:</strong>
          <p className="text-slate-300">Describe a person who has had a great influence on your life.</p>
          <p className="text-slate-400">You should say:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-0.5 pl-2">
            <li>who this person is</li>
            <li>how you know this person</li>
            <li>what this person does</li>
            <li>and explain why this person has influenced you so much.</li>
          </ul>
        </div>

        {/* 1-MINUTE NOTES */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-1 font-mono">
          <strong className="text-white block font-sans text-sm mb-2">Note-taking (১ মিনিটে যা লিখবেন):</strong>
          <div>WHO:    Uncle Karim — father's younger brother</div>
          <div>KNOW:   grew up near us, visited weekly</div>
          <div>DOES:   civil engineer, builds bridges</div>
          <div>WHY:    showed me science is beautiful, took me to his site</div>
          <div>FEEL:   inspired, chose engineering</div>
          <div>RESULT: changed career path</div>
        </div>

        {/* MODEL ANSWER */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-2">
          <strong className="text-cyan-300 font-medium block">Model Answer (২ মিনিট, Band ৮ level):</strong>
          <p>"I'd like to talk about my uncle, Karim, who is without a doubt the person who has had the most profound influence on my life.</p>
          <p>He's my father's younger brother, and growing up, he lived just around the corner from us, so we saw him almost every week. He's a civil engineer — he designs and oversees the construction of large infrastructure projects, including several major bridges in our region.</p>
          <p>What made him so influential was the way he made science and engineering come alive for me. When I was about ten, he took me to one of his construction sites for the first time, and I remember standing there completely in awe of the scale of what human beings could create. He explained everything so patiently — how stress is distributed in a structure, why certain materials are chosen. In that moment, something clicked for me.</p>
          <p>Before that visit, I'd had no real idea what I wanted to do with my life. But watching him work, seeing his passion and expertise, I made up my mind to study engineering. So in a very real sense, he shaped the direction of my entire career.</p>
          <p>Looking back, what I admire most is that he never pushed me — he simply led by example. I think the greatest gift a mentor can give you is showing you what's possible."</p>
        </div>

        {/* BENGALI REVIEW */}
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-4 text-xs text-slate-400 space-y-1">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          <p><strong className="text-slate-300">Introduction:</strong> "without a doubt" এবং "most profound influence" — strong Lexical Resource।</p>
          <p><strong className="text-slate-300">Middle section:</strong> chronological order রক্ষা করা হয়েছে, যা Coherence বাড়িয়েছে।</p>
          <p><strong className="text-slate-300">"something clicked for me"</strong> — natural idiom।</p>
          <p><strong className="text-slate-300">"made up my mind"</strong> — phrasal verb যা natural।</p>
          <p><strong className="text-slate-300">Ending:</strong> Personal reflection দিয়ে শেষ করা হয়েছে যা examiner-দের পছন্দ।</p>
          <p><strong className="text-slate-300">Grammar:</strong> Past perfect ("I'd had"), past simple, conditional — range দেখানো হয়েছে।</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Part 2-এ থামলে চলবে না। যদি কোনো point শেষ হয়ে যায়, feelings, consequences, বা comparisons যোগ করুন। ২ মিনিট ভরাট করাই লক্ষ্য।
      </div>
    </section>

    {/* ─── 4.4 PART 3 — DISCUSSION ───────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.৪ Part 3 — Discussion
      </h2>

      <h3 className="text-lg font-semibold text-slate-200">Part 3 কীভাবে কাজ করে</h3>
      <p>Part 3-এ examiner আপনার Part 2 topic-এর সাথে সম্পর্কিত abstract, societal প্রশ্ন করবেন। এখানে আপনার analytical thinking, opinion দেওয়ার ক্ষমতা এবং complex language দেখানোর সুযোগ।</p>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-1">
        <strong className="text-white block font-bold text-sm mb-2">Part 3 প্রশ্নের ধরন:</strong>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800"><strong className="text-cyan-300">Comparing:</strong> "How has X changed in recent years?"</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800"><strong className="text-cyan-300">Speculating:</strong> "Do you think X will become more/less common?"</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800"><strong className="text-cyan-300">Justifying:</strong> "Why do some people believe X?"</span>
          <span className="bg-slate-900 p-2 rounded-lg border border-slate-800"><strong className="text-cyan-300">Evaluating:</strong> "What are the advantages and disadvantages of X?"</span>
        </div>
      </div>

      {/* OREO FORMULA */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono">OREO Formula</span>
          Opinion → Reason → Example → Other side
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
            <strong className="text-white block text-cyan-300">O — Opinion</strong>
            <p className="text-slate-400">আপনার মত বলুন।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
            <strong className="text-white block text-cyan-300">R — Reason</strong>
            <p className="text-slate-400">কেন সেই মত বলুন।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
            <strong className="text-white block text-cyan-300">E — Example</strong>
            <p className="text-slate-400">কংক্রিট উদাহরণ দিন।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
            <strong className="text-white block text-cyan-300">O — Other side</strong>
            <p className="text-slate-400">(Optional) বিপরীত মত স্বীকার করুন।</p>
          </div>
        </div>
      </div>

      {/* PART 3 MODEL ANSWERS */}
      <h3 className="text-lg font-semibold text-slate-200 pt-2">Sample Part 3 Questions ও Model Answers</h3>

      {/* Q1 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q1: How do you think technology has changed the way people communicate compared to the past?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "I think the changes have been enormous, and honestly, quite mixed in their effects. On one hand, technology has made communication instantaneous and borderless — you can connect with someone on the other side of the world in seconds, which simply wasn't possible a generation ago. However, there's a growing concern that face-to-face communication skills are deteriorating, particularly among younger people who have grown up entirely in the digital age. I personally believe that while technology has expanded our reach, it has in some ways narrowed the depth of our relationships."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "quite mixed in their effects" দিয়ে nuanced thinking দেখানো হয়েছে। "instantaneous and borderless" strong collocations। Contrasting connector "However" এবং "while" দিয়ে two-sided view express করা হয়েছে — এটি Part 3-এ Band ৮+ পাওয়ার মূল চাবিকাঠি।
        </div>
      </div>

      {/* Q2 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q2: Do you think people will rely more on artificial intelligence in the future?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "Almost certainly, yes. The trajectory we're on suggests that AI will become deeply embedded in most areas of daily life — from healthcare diagnostics to education to creative fields. That said, I think it's worth distinguishing between AI as a tool versus AI as a replacement for human judgment. I'd speculate that within the next decade, most routine cognitive tasks will be automated, but the uniquely human qualities — empathy, creativity, ethical reasoning — will remain irreplaceable. Whether that's reassuring or alarming probably depends on your perspective."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "Almost certainly" দিয়ে শুরু করা confident কিন্তু না oversimplified। "I'd speculate that" hedging language। "uniquely human qualities" sophisticated phrase। শেষ sentence-এ "probably depends on your perspective" — এটি examiner কে দেখায় যে আপনি multiple viewpoints বুঝতে পারেন।
        </div>
      </div>

      {/* Q3 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white">Q3: Why do you think some people find it difficult to maintain relationships with family as they grow older?</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200 font-sans space-y-1">
          <p><strong className="text-cyan-300 font-medium">Model Answer:</strong> "I think there are several interrelated reasons. Firstly, the demands of adult life — career pressures, raising one's own family, financial responsibilities — naturally leave less time for maintaining extended family relationships. Beyond that, geographical mobility has increased dramatically; people are much more likely to relocate for work than they were in previous generations, which creates physical distance that can translate into emotional distance over time. There's also a generational shift in values — younger generations tend to prioritise independence and personal fulfilment, which can sometimes come at the expense of family cohesion. It's not that people care less about family, I'd argue — it's more that modern life makes those connections harder to sustain."</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-slate-400">
          <strong className="text-slate-200 block mb-1">বাংলায় বিশ্লেষণ:</strong>
          "several interrelated reasons" দিয়ে structured answer শুরু। "translate into emotional distance" metaphorical language। "which can sometimes come at the expense of" — sophisticated causal language। শেষে "It's not that... it's more that..." structure — এটি Band ৮+ grammar range দেখায়।
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Part 3-এ "I don't know" বলা যাবে না। যদি নিশ্চিত না হন, বলুন "That's an interesting point — I'd say that..." এবং আপনার best opinion দিন। Examiner আপনার opinion-এর সাথে একমত হওয়ার দরকার নেই।
      </div>
    </section>

    {/* ─── 4.5 PRONUNCIATION TRAINING ────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.৫ Pronunciation Training
      </h2>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
        <strong className="text-white block font-bold text-sm mb-1">কেন Pronunciation গুরুত্বপূর্ণ</strong>
        Pronunciation মোট score-এর ২৫%। তবে সুখবর হলো — native-like accent দরকার নেই। Examiner চান যে আপনার কথা clearly বোঝা যাক। Bengali-speaking students-দের জন্য কিছু specific challenges আছে।
      </div>

      <h3 className="text-sm font-bold text-white pt-2">Bengali Speakers-দের Common Pronunciation Challenges</h3>

      {/* CHALLENGE 1 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono">চ্যালেঞ্জ ১</span>
          /v/ বনাম /w/
        </h4>
        <p className="text-slate-300">বাংলায় /v/ এবং /w/ এর আলাদা sound নেই। অনেক বাংলাভাষী "very" কে "wery" এবং "water" কে "vater" বলেন।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
          <strong className="text-white block">সঠিক উচ্চারণ:</strong>
          <p className="text-slate-400"><strong className="text-cyan-300">/v/</strong> — উপরের দাঁত নিচের ঠোঁটে স্পর্শ করুন, তারপর আওয়াজ করুন। <span className="text-cyan-300 font-medium">very, voice, value</span></p>
          <p className="text-slate-400"><strong className="text-cyan-300">/w/</strong> — ঠোঁট গোল করুন (কিন্তু দাঁত স্পর্শ করবে না), তারপর আওয়াজ করুন। <span className="text-cyan-300 font-medium">water, work, world</span></p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 font-mono text-slate-300">
          <strong className="text-white block font-sans mb-1">Practice pairs:</strong>
          very/wary | vine/wine | vet/wet | veil/whale
        </div>
      </div>

      {/* CHALLENGE 2 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono">চ্যালেঞ্জ ২</span>
          /θ/ — "th" sound
        </h4>
        <p className="text-slate-300">বাংলায় /θ/ sound নেই। অনেকে "the" কে "de" বা "ze", "think" কে "tink" বলেন।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
          <strong className="text-white block">সঠিক উচ্চারণ:</strong>
          <p className="text-slate-400"><strong className="text-cyan-300">Unvoiced /θ/</strong> (think, three, thought): জিহ্বার ডগা উপরের দাঁতের মাঝে রাখুন এবং বাতাস বের করুন — কোনো কণ্ঠস্বর নেই।</p>
          <p className="text-slate-400"><strong className="text-cyan-300">Voiced /ð/</strong> (the, this, that, mother): একই অবস্থান, কিন্তু এবার কণ্ঠস্বর যোগ করুন।</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 font-mono text-slate-300">
          <strong className="text-white block font-sans mb-1">Practice:</strong>
          think /θɪŋk/ | three /θriː/ | the /ðə/ | that /ðæt/ | mother /ˈmʌðə/
        </div>
      </div>

      {/* CHALLENGE 3 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono">চ্যালেঞ্জ ৩</span>
          Short vs. Long Vowels
        </h4>
        <p className="text-slate-300">বাংলায় vowel দৈর্ঘ্যের পার্থক্য English-এর মতো meaning পরিবর্তন করে না। তবে English-এ এটি critical:</p>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
              <tr><th className="p-2">Short Vowel</th><th className="p-2">Long Vowel</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr><td className="p-2">ship /ʃɪp/</td><td className="p-2">sheep /ʃiːp/</td></tr>
              <tr><td className="p-2">sit /sɪt/</td><td className="p-2">seat /siːt/</td></tr>
              <tr><td className="p-2">pull /pʊl/</td><td className="p-2">pool /puːl/</td></tr>
              <tr><td className="p-2">not /nɒt/</td><td className="p-2">note /nəʊt/</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CHALLENGE 4 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono">চ্যালেঞ্জ ৪</span>
          Word Stress
        </h4>
        <p className="text-slate-300">English-এ প্রতিটি শব্দের একটি "stressed" syllable আছে। ভুল stress দিলে বোঝা কঠিন হয়।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-slate-300 space-y-1">
          <strong className="text-white block font-sans">উদাহরণ:</strong>
          <div>phoTOgraph (noun) বনাম phoTOgraphy (noun) বনাম phoTOgraphic (adjective)</div>
          <div>REcord (noun) বনাম reCORD (verb)</div>
          <div>PERmit (noun) বনাম perMIT (verb)</div>
        </div>
        <p className="text-slate-400 text-[11px]">Dictionary-তে IPA দেখলে stress mark (ˈ) এর পরের syllable-এ জোর দেওয়া হয়।</p>
      </div>

      {/* CHALLENGE 5 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono">চ্যালেঞ্জ ৫</span>
          Sentence Stress এবং Intonation
        </h4>
        <p className="text-slate-300">English-এ বাক্যের সব শব্দ সমান জোরে বলা হয় না। Content words (noun, verb, adjective, adverb) জোরে বলা হয়, function words (a, the, is, of) হালকা বলা হয়।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-slate-300">
          <strong className="text-white block font-sans mb-1">উদাহরণ:</strong>
          "I WENT to the SHOP to BUY some FOOD."
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 space-y-1">
          <strong className="text-white block">Intonation patterns:</strong>
          <p className="text-slate-400"><strong className="text-cyan-300">Statement (বক্তব্য):</strong> শেষে নামে ↘</p>
          <p className="text-slate-400"><strong className="text-cyan-300">Yes/No question:</strong> শেষে ওঠে ↗</p>
          <p className="text-slate-400"><strong className="text-cyan-300">Wh-question:</strong> সাধারণত নামে ↘</p>
          <p className="text-slate-400"><strong className="text-cyan-300">List:</strong> শেষেরটা নামে, বাকিগুলো ওঠে ↗ ↗ ↗ ↘</p>
        </div>
      </div>

      {/* CHALLENGE 6 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono">চ্যালেঞ্জ ৬</span>
          Chunking (Thought Groups)
        </h4>
        <p className="text-slate-300">Fluent speakers কথা word by word না বলে groups-এ বলেন। এটি natural rhythm দেয়।</p>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-slate-300 space-y-1">
          <div className="text-rose-400">❌ "I-think-that-education-is-very-important-for-society"</div>
          <div className="text-emerald-400">✅ "I think that education / is very important / for society."</div>
        </div>
        <p className="text-slate-400 text-[11px]">প্রতিটি "/" একটু pause। এই pause দিয়ে আপনি শুধু natural শোনাচ্ছেন না, বরং পরবর্তী কথাও ভাবার সময় পাচ্ছেন।</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        প্রতিদিন ১৫ মিনিট BBC Learning English বা native English speakers-এর video দেখুন এবং তাদের সাথে সাথে বলুন (shadowing technique)। এটি সবচেয়ে দ্রুত pronunciation উন্নয়নের উপায়।
      </div>
    </section>

    {/* ─── 4.6 FLUENCY BOOSTERS ───────────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.৬ Fluency Boosters এবং Filler-Word Alternatives
      </h2>

      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300">
        <strong className="block mb-1">কোন filler words এড়াতে হবে</strong>
        <p className="text-rose-200/70">এই filler words IELTS-এ আপনার score কমায়:</p>
        <ul className="list-disc list-inside space-y-0.5 mt-1 text-rose-200/80">
          <li>"uhh", "umm", "erm"</li>
          <li>"you know", "like" (অর্থহীনভাবে)</li>
          <li>"basically" (প্রতিটি sentence-এ)</li>
        </ul>
        <p className="mt-1 text-rose-200/70">এগুলো দেখায় যে আপনি vocabulary খুঁজছেন, এবং এটি Fluency &amp; Coherence criterion-এ নেগেטיב প্রভাব ফেলে।</p>
      </div>

      {/* 10 FILLER REPLACEMENT PHRASES */}
      <h3 className="text-sm font-bold text-white pt-2">প্রাকৃতিক Filler-Replacement Phrases (১০টি)</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
            <tr><th className="p-2.5">বদলে ব্যবহার করুন</th><th className="p-2.5">কখন ব্যবহার করবেন</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr><td className="p-2.5 text-cyan-300 font-medium">"Well, I'd say..."</td><td className="p-2.5">মতামত দেওয়ার আগে</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"That's an interesting question..."</td><td className="p-2.5">কঠিন বা unexpected প্রশ্নের সময়</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"Let me think about that for a moment..."</td><td className="p-2.5">Part 3-এর abstract প্রশ্নে</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"To be honest..."</td><td className="p-2.5">Personal opinion এর আগে</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"It depends, really..."</td><td className="p-2.5">যখন context দরকার</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"I'd have to say that..."</td><td className="p-2.5">Considered opinion দেওয়ার সময়</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"Funnily enough..."</td><td className="p-2.5">Surprising example দেওয়ার আগে</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"As a matter of fact..."</td><td className="p-2.5">তথ্য যোগ করার সময়</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"What I mean is..."</td><td className="p-2.5">Clarification দেওয়ার সময়</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-medium">"If I think about it..."</td><td className="p-2.5">Reflection করার সময়</td></tr>
          </tbody>
        </table>
      </div>

      {/* NATURAL SPOKEN CONNECTORS */}
      <h3 className="text-sm font-bold text-white pt-2">Natural Spoken Connectors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">Contrast:</strong>
          <p className="text-slate-300">That said | Mind you | Then again | Having said that</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">Adding:</strong>
          <p className="text-slate-300">On top of that | What's more | Not only that | Plus</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">Giving reason:</strong>
          <p className="text-slate-300">The thing is | The reason being | That's largely because</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block text-sm">Concluding:</strong>
          <p className="text-slate-300">All in all | At the end of the day | On balance | Taking everything into account</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        এই phrases গুলো মুখস্থ করার চেয়ে বেশি দরকার হলো practice। প্রতিদিন নিজে নিজে IELTS topics নিয়ে কথা বলুন এবং এই phrases গুলো consciously ব্যবহার করুন।
      </div>
    </section>

    {/* ─── 4.7 IDIOMS & NATURAL COLLOCATIONS ─────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.৭ Idioms এবং Natural Collocations
      </h2>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-300">
        <strong className="block mb-1">⚠️ গুরুত্বপূর্ণ সতর্কবার্তা</strong>
        <p className="text-amber-200/70">IELTS Speaking-এ idiom ব্যবহার score বাড়াতে পারে, কিন্তু ভুল idiom ব্যবহার করলে score কমে। Examiner দেখেন আপনি idiom সঠিকভাবে ব্যবহার করছেন কিনা। Forced বা unnatural placement তাৎক্ষণিকভাবে বোঝা যায়।</p>
        <p className="text-amber-200/80 mt-1"><strong>নিয়ম:</strong> একটি idiom তখনই ব্যবহার করুন যখন সেটা naturally fit করে — শুধু দেখানোর জন্য নয়।</p>
      </div>

      <h3 className="text-sm font-bold text-white pt-2">১০টি Safe এবং Useful Idioms</h3>

      {/* IDIOM CARDS */}
      {/* 1 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">১</span>
          "Under the weather"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> অসুস্থ বোধ করা</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "I've been feeling a bit <span className="text-cyan-300 font-medium">under the weather</span> this week, so I haven't been as productive as usual."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 1 (health, daily routine) বা Part 2 (experience)</p>
      </div>

      {/* 2 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">২</span>
          "Go hand in hand"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> দুটি জিনিস একসাথে ঘটে বা related</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "Economic development and environmental damage often seem to <span className="text-cyan-300 font-medium">go hand in hand</span>, which is a real challenge for policy makers."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 3 (discussion, comparison)</p>
      </div>

      {/* 3 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">৩</span>
          "On the fence"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> দুটো মতের মাঝে অনিশ্চিত</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "I'm a bit <span className="text-cyan-300 font-medium">on the fence</span> about this issue — I can see arguments on both sides."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 3 (opinion questions)</p>
      </div>

      {/* 4 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">৪</span>
          "A blessing in disguise"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> প্রথমে খারাপ মনে হয় কিন্তু পরে ভালো হয়</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "Losing that job turned out to be <span className="text-cyan-300 font-medium">a blessing in disguise</span> — it pushed me to start my own business."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 2 (experience), Part 3</p>
      </div>

      {/* 5 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">৫</span>
          "Hit the nail on the head"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> exactly সঠিক কথা বলা</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "I think you've <span className="text-cyan-300 font-medium">hit the nail on the head</span> — the real problem is a lack of infrastructure."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 3 (when agreeing with a point)</p>
      </div>

      {/* 6 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">৬</span>
          "Once in a blue moon"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> খুব কমই</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "I eat junk food <span className="text-cyan-300 font-medium">once in a blue moon</span> — maybe on special occasions."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 1 (habits, routines)</p>
      </div>

      {/* 7 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">৭</span>
          "The tip of the iceberg"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> একটি বড় সমস্যার ছোট্ট দৃশ্যমান অংশ</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "Plastic waste in the ocean is just <span className="text-cyan-300 font-medium">the tip of the iceberg</span> when it comes to environmental problems."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 3 (social/environmental issues)</p>
      </div>

      {/* 8 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">৮</span>
          "Something clicked"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> হঠাৎ বোঝা বা অনুপ্রাণিত হওয়া</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "I struggled with math for years, and then one day <span className="text-cyan-300 font-medium">something just clicked</span> and it all made sense."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 2 (learning, experience)</p>
      </div>

      {/* 9 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">৯</span>
          "Keep someone in the loop"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> কাউকে informed রাখা</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "Good communication at work means <span className="text-cyan-300 font-medium">keeping everyone in the loop</span> — not just the managers."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 3 (work, technology, communication)</p>
      </div>

      {/* 10 */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">১০</span>
          "Get out of hand"
        </h4>
        <p className="text-slate-400"><strong className="text-slate-200">অর্থ:</strong> নিয়ন্ত্রণের বাইরে চলে যাওয়া</p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans">
          "Social media use among teenagers has really <span className="text-cyan-300 font-medium">gotten out of hand</span> in recent years."
        </div>
        <p className="text-slate-400"><strong className="text-slate-200">কখন:</strong> Part 3 (social issues)</p>
      </div>

      {/* OVERUSE WARNING */}
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300">
        <strong className="block mb-1">⚠️ Overuse Warning</strong>
        <p className="text-rose-200/70">একটি উত্তরে সর্বোচ্চ ১–২টি idiom ব্যবহার করুন। বেশি ব্যবহার করলে মনে হয় আপনি scripted কথা বলছেন, এবং Fluency &amp; Coherence score কমে যেতে পারে।</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Idiom-এর চেয়ে বেশি গুরুত্বপূর্ণ হলো natural collocations — "make a decision", "take responsibility", "reach a conclusion"। এগুলো সহজ কিন্তু Lexical Resource score বাড়ায় উল্লেখযোগ্যভাবে।
      </div>
    </section>

    {/* ─── 4.8 MOCK INTERVIEWS ────────────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৪.৮ Mock Interviews এবং Band Feedback
      </h2>

      <h3 className="text-lg font-semibold text-slate-200">কোথায় Mock Interviews পাবেন</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
        <strong className="text-white block font-bold text-sm">YouTube Channels (সেরা resources):</strong>
        <div className="space-y-1.5">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">●</span>
            <span className="text-slate-300"><strong className="text-white">E2 IELTS:</strong> Full mock tests with examiner commentary — Band 7, 8, 9 সবই আছে।</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">●</span>
            <span className="text-slate-300"><strong className="text-white">Keith Speaking Academy:</strong> Detailed post-test analysis, criterion-by-criterion breakdown।</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">●</span>
            <span className="text-slate-300"><strong className="text-white">Ross IELTS Academy:</strong> Real candidate recordings with written feedback।</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">●</span>
            <span className="text-slate-300"><strong className="text-white">IELTS Energy (All Ears English):</strong> Podcast-style but very practical।</span>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-white pt-2">Mock Interview থেকে সর্বোচ্চ ফায়দা নেওয়ার পদ্ধতি</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">Step ১ — প্রথমবার দেখুন:</strong>
          <p className="text-slate-400">পুরো interview দেখুন commentary ছাড়া। নিজে মনে মনে score দেওয়ার চেষ্টা করুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">Step ২ — দ্বিতীয়বার দেখুন:</strong>
          <p className="text-slate-400">Commentary সহ দেখুন। কোথায় আপনার assessment মিলল এবং কোথায় মিলল না?</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">Step ৩ — Transcribe করুন:</strong>
          <p className="text-slate-400">কিছু phrases লিখে রাখুন যা effective ছিল। এগুলো আপনার নিজের vocabulary-তে add করুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <strong className="text-white font-bold block">Step ৪ — Imitate করুন:</strong>
          <p className="text-slate-400">ওই speaker-এর একটি Part 2 answer নিয়ে নিজে try করুন। Record করুন এবং compare করুন।</p>
        </div>
      </div>

      {/* SELF-ASSESSMENT CHECKLIST */}
      <h3 className="text-sm font-bold text-white pt-2">Self-Assessment Checklist</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
        <p className="text-slate-400 mb-3">প্রতিটি practice session-এর পরে নিজেকে প্রশ্ন করুন:</p>
        <div className="space-y-1.5">
          <label className="flex items-start gap-2 text-slate-300"><input type="checkbox" className="mt-1 accent-emerald-500" /> আমি কি কমপক্ষে ১ মিনিট থামা ছাড়া বললাম? <span className="text-slate-500">(Fluency)</span></label>
          <label className="flex items-start gap-2 text-slate-300"><input type="checkbox" className="mt-1 accent-emerald-500" /> আমি কি linking words ব্যবহার করলাম? <span className="text-slate-500">(Coherence)</span></label>
          <label className="flex items-start gap-2 text-slate-300"><input type="checkbox" className="mt-1 accent-emerald-500" /> আমি কি শুধু simple words ব্যবহার করলাম নাকি collocations ও idioms ব্যবহার করলাম? <span className="text-slate-500">(Lexical Resource)</span></label>
          <label className="flex items-start gap-2 text-slate-300"><input type="checkbox" className="mt-1 accent-emerald-500" /> আমি কি শুধু simple sentences বললাম নাকি complex structures ব্যবহার করলাম? <span className="text-slate-500">(Grammatical Range)</span></label>
          <label className="flex items-start gap-2 text-slate-300"><input type="checkbox" className="mt-1 accent-emerald-500" /> আমার th, v/w sounds কি ঠিক ছিল? Word stress কি সঠিক ছিল? <span className="text-slate-500">(Pronunciation)</span></label>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
        <strong className="text-white block font-bold mb-1">Record করে শুনুন</strong>
        নিজের কণ্ঠ শুনতে অস্বস্তি লাগলেও এটি সবচেয়ে কার্যকর improvement tool। Phone-এ record করুন এবং উপরের checklist দিয়ে নিজে evaluate করুন।
      </div>

      <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Mock interviews দেখা শুধু আনন্দের জন্য নয় — সচেতনভাবে দেখুন। প্রতিটি video থেকে অন্তত ৩টি নতুন phrase বা strategy নিন।
      </div>
    </section>

    {/* ─── SUMMARY & ACTION PLAN ─────────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Format সম্পর্কে:</strong>
          <p>IELTS Speaking test তিনটি part নিয়ে গঠিত: Part 1 (interview), Part 2 (Cue Card / Long Turn), Part 3 (discussion)। চারটি criteria — Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, এবং Pronunciation — প্রতিটি সমান গুরুত্বপূর্ণ।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Part 1 সম্পর্কে:</strong>
          <p>সাধারণ topics (work, study, hometown, hobbies, food, weather, family) নিয়ে কথা বলতে হবে। প্রতিটি উত্তর ২–৩ sentences-এ বাড়ান: Point → Reason → Example। মুখস্থ করা উত্তর না বলে real experiences শেয়ার করুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Part 2 সম্পর্কে:</strong>
          <p>১ মিনিটে keywords দিয়ে note নিন, পুরো sentences নয়। Introduction, main body, এবং personal reflection দিয়ে structure করুন। পাঁচটি category cover করুন: person, place, event, object, experience।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Part 3 সম্পর্কে:</strong>
          <p>Abstract thinking এবং opinion justification দেখানোর সুযোগ। OREO structure: Opinion → Reason → Example → Other side। Hedging language ("I'd speculate", "it seems likely") ব্যবহার করুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Pronunciation সম্পর্কে:</strong>
          <p>/v/ vs /w/, /θ/ (th sound), short/long vowels এবং word stress — Bengali speakers-দের জন্য বিশেষ গুরুত্বপূর্ণ। Shadowing technique দিয়ে প্রতিদিন practice করুন। Chunking দিয়ে natural rhythm তৈরি করুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Fluency সম্পর্কে:</strong>
          <p>"uhh", "you know", "basically" বদলান natural thinking phrases দিয়ে। Spoken connectors (That said, On top of that, Mind you) ব্যবহার করুন।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Idioms সম্পর্কে:</strong>
          <p>সঠিক context-এ সর্বোচ্চ ১–২টি idiom প্রতি উত্তরে ব্যবহার করুন। Natural collocations idiom-এর চেয়ে বেশি কাজে আসে।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
          <strong className="text-white block">Mock Interviews সম্পর্কে:</strong>
          <p>E2 IELTS, Keith Speaking Academy, Ross IELTS Academy-তে Band 7/8/9 examples দেখুন। সচেতনভাবে দেখুন এবং নিজে record করে compare করুন।</p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-white pt-2">পরবর্তী পদক্ষেপ</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">●</span> প্রতিদিন একটি topic বেছে নিন এবং ২ মিনিট কথা বলুন (Part 2 style)।</div>
        <div className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">●</span> এই module-এর অন্তত ২টি mock interview video দেখুন।</div>
        <div className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">●</span> এই notes থেকে ১০টি collocation বেছে নিন এবং সেগুলো দিয়ে নিজের sentences তৈরি করুন।</div>
        <div className="flex items-start gap-2"><span className="text-cyan-400 font-bold mt-0.5">→</span> পরবর্তী module: <strong className="text-white">IELTS Writing</strong> যেখানে Task 1 এবং Task 2-এর সম্পূর্ণ guide পাবেন।</div>
      </div>

      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-500 italic">
        এই notes IELTS Liz, E2 IELTS, Keith Speaking Academy, এবং IELTS official band descriptor-এর উপর ভিত্তি করে তৈরি।
      </div>

      {/* CLAIM XP */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>

  </div>
);

const MODULE_05_NOTES = (
  <section className="space-y-8">
    {/* ─── SECTION 1: HERO HEADER ─── */}
    <div className="bg-gradient-to-br from-cyan-950/60 via-cyan-900/30 to-slate-900 border border-cyan-800/40 rounded-2xl p-8 text-center space-y-4">
      <p className="text-3xl">📐</p>
      <h2 className="text-2xl font-bold text-cyan-100">Module 5: Grammar Foundation (বাংলায়)</h2>
      <p className="text-sm text-cyan-300/80 max-w-2xl mx-auto">
        এই module-এ আপনি IELTS-এ সবচেয়ে বেশি দরকারী grammar structures শিখবেন। প্রতিটি section-এ formula, উদাহরণ, কখন ব্যবহার করবেন এবং সাধারণ ভুল — সব কিছু দেওয়া হয়েছে।
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {['Tenses', 'Conditionals', 'Passive Voice', 'Articles', 'Prepositions', 'Relative Clauses', 'Complex Sentences', 'Common Mistakes'].map((t) => (
          <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium px-3 py-1 rounded-full">{t}</span>
        ))}
      </div>
    </div>

    {/* ─── SECTION 2: 5.1 TENSES ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.1 Tenses Overview — IELTS-এ কোন Tense কখন ব্যবহার করবেন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p>IELTS Writing ও Speaking-এ Tense-এর সঠিক ব্যবহার <span className="text-cyan-300 font-medium">Grammatical Range and Accuracy</span> criterion-এ সরাসরি নম্বর প্রভাবিত করে। নিচে চারটি সবচেয়ে গুরুত্বপূর্ণ Tense বিস্তারিত আলোচনা করা হলো।</p>
      </div>

      {/* Present Perfect */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Present Perfect Tense</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
          Formula: Subject + have/has + Past Participle
        </div>
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">কখন ব্যবহার করবেন:</p>
          <p>• অতীতের কোনো কাজ যার প্রভাব এখনো আছে।</p>
          <p>• "since" এবং "for" শব্দের সাথে।</p>
          <p>• IELTS Speaking Part 1 ও 2-এ নিজের অভিজ্ঞতা বলতে।</p>
          <p>• Writing Task 2-এ trend বা পরিবর্তন বোঝাতে।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"The government has introduced several new policies to reduce pollution."</p>
          <p className="text-slate-300 italic">"I have lived in this city for ten years."</p>
          <p className="text-slate-300 italic">"Technology has transformed the way people communicate."</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-slate-400 font-bold">সাধারণ ভুল:</p>
          <p className="text-slate-400">অনেকে Past Simple ব্যবহার করেন যেখানে Present Perfect দরকার।</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-2.5">
              <p className="font-bold text-xs mb-1">❌</p>
              <p>"The number of cars increased dramatically in recent decades."</p>
              <p className="text-rose-400/70 text-xs mt-1">(অর্থাৎ এখনও বাড়ছে — এই অর্থে Present Perfect হবে)</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-2.5">
              <p className="font-bold text-xs mb-1">✅</p>
              <p>"The number of cars has increased dramatically in recent decades."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Past Simple vs Past Perfect */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Past Simple vs Past Perfect</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
            Past Simple: Subject + Verb (past form)
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
            Past Perfect: Subject + had + Past Participle
          </div>
        </div>
        <div className="text-xs text-slate-400 space-y-1">
          <p><span className="text-cyan-300 font-medium">কখন Past Simple:</span> অতীতের নির্দিষ্ট সময়ে ঘটা কাজ।</p>
          <p><span className="text-cyan-300 font-medium">কখন Past Perfect:</span> দুটো অতীতের ঘটনার মধ্যে কোনটা আগে ঘটেছিল তা বোঝাতে।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"She studied medicine at university." (Past Simple — সাধারণ অতীত)</p>
          <p className="text-slate-300 italic">"By the time the exam started, he had revised all the chapters." (Past Perfect — আগের কাজ)</p>
          <p className="text-slate-300 italic">"The factory had been operating for fifty years before it closed down." (Past Perfect + Past Simple)</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-slate-400 font-bold">সাধারণ ভুল:</p>
          <p className="text-slate-400">দুটো অতীত ঘটনার ক্রম না বুঝে দুটোতেই Past Simple ব্যবহার করা।</p>
        </div>
      </div>

      {/* Future Forms */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Future Forms — Will, Going To, Present Continuous</h4>
        <p className="text-xs text-slate-400">IELTS-এ তিনটি Future Form আলাদা অর্থ বহন করে:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Form</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Formula</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">ব্যবহার</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Will</td><td className="py-2 px-3 text-slate-300">will + infinitive</td><td className="py-2 px-3 text-slate-400">spontaneous decision, prediction with less certainty</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Going to</td><td className="py-2 px-3 text-slate-300">am/is/are + going to + infinitive</td><td className="py-2 px-3 text-slate-400">planned intention, evidence-based prediction</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Present Continuous</td><td className="py-2 px-3 text-slate-300">am/is/are + -ing</td><td className="py-2 px-3 text-slate-400">fixed arrangement with time/place</td></tr>
            </tbody>
          </table>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"Experts predict that temperatures will rise by two degrees." (prediction — Writing Task 2)</p>
          <p className="text-slate-300 italic">"The government is going to invest heavily in renewable energy." (planned policy)</p>
          <p className="text-slate-300 italic">"I am meeting my tutor tomorrow at 9am." (fixed arrangement — Speaking Part 2)</p>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> IELTS Writing Task 2-এ predictions-এর জন্য "will" এবং "is likely to" সবচেয়ে বেশি ব্যবহৃত হয়। Task 1-এ data পুরোপুরি future দেখালে "will" বা "is projected to" ব্যবহার করুন।</p>
      </div>
    </section>

    {/* ─── SECTION 3: 5.2 CONDITIONALS ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.2 Conditionals — IELTS Speaking Part 3 এবং Task 2-এর জন্য অপরিহার্য
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>Conditional sentences IELTS examiner-কে দেখায় যে আপনি hypothetical situations এবং complex arguments তৈরি করতে পারেন। Speaking Part 3-এ এটি Band 7+ পাওয়ার জন্য অত্যন্ত জরুরি।</p>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">চার ধরনের Conditional — পাশাপাশি তুলনা</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Type</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Structure</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Meaning</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Zero Conditional</td><td className="py-2 px-3 text-slate-300">If + Present Simple, Present Simple</td><td className="py-2 px-3 text-slate-400">General truth / scientific fact</td><td className="py-2 px-3 text-slate-300 italic">"If you heat water to 100°C, it boils."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">First Conditional</td><td className="py-2 px-3 text-slate-300">If + Present Simple, will + infinitive</td><td className="py-2 px-3 text-slate-400">Real / possible future situation</td><td className="py-2 px-3 text-slate-300 italic">"If the government invests in education, the economy will improve."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Second Conditional</td><td className="py-2 px-3 text-slate-300">If + Past Simple, would + infinitive</td><td className="py-2 px-3 text-slate-400">Hypothetical / unlikely present or future</td><td className="py-2 px-3 text-slate-300 italic">"If I were the prime minister, I would ban plastic bags."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Third Conditional</td><td className="py-2 px-3 text-slate-300">If + Past Perfect, would have + Past Participle</td><td className="py-2 px-3 text-slate-400">Impossible / past regret</td><td className="py-2 px-3 text-slate-300 italic">"If they had acted sooner, they would have prevented the disaster."</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Zero Conditional */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Zero Conditional — সত্য যুক্তি</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
          Formula: If + Present Simple, Present Simple
        </div>
        <p className="text-xs text-slate-400">Zero Conditional সত্য তথ্য বা বৈজ্ঞানিক নিয়ম বোঝাতে ব্যবহৃত হয়। IELTS Writing Task 2-এ general facts বলতে এটি কাজে আসে।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"If children do not receive proper nutrition, their development suffers."</p>
          <p className="text-slate-300 italic">"If pollution levels rise, air quality deteriorates."</p>
        </div>
      </div>

      {/* First Conditional */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">First Conditional — বাস্তব সম্ভাবনা</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
          Formula: If + Present Simple, will + infinitive
        </div>
        <p className="text-xs text-slate-400">First Conditional দিয়ে real, possible future situations বোঝানো হয়। IELTS Task 2-এ solutions এবং consequences আলোচনা করতে এটি অনেক কাজে লাগে।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"If governments invest in public transport, fewer people will use private cars."</p>
          <p className="text-slate-300 italic">"If students study regularly, they will achieve higher scores."</p>
        </div>
      </div>

      {/* Second Conditional */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Second Conditional — Hypothetical ভাবনা</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
          Formula: If + Past Simple, would + infinitive
        </div>
        <p className="text-xs text-slate-400">Second Conditional ব্যবহৃত হয় hypothetical বা unlikely situation বোঝাতে। IELTS Speaking Part 3-এ opinion বা recommendation দিতে এটি সবচেয়ে বেশি ব্যবহৃত হয়।</p>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg p-3 text-xs space-y-1">
          <p className="font-bold">গুরুত্বপূর্ণ নিয়ম: "If I were"</p>
          <p>"was" নয়, সব subject-এর জন্য "were" formal English-এ সঠিক।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"If I were a teacher, I would focus more on critical thinking."</p>
          <p className="text-slate-300 italic">"If technology did not exist, life would be considerably more difficult."</p>
        </div>
        <p className="text-xs text-slate-400"><span className="text-cyan-300 font-medium">IELTS Speaking Part 3-এ ব্যবহার:</span> Examiner যখন জিজ্ঞেস করেন "What would happen if...?" — তখন Second Conditional দিয়ে উত্তর দিন।</p>
      </div>

      {/* Third Conditional */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Third Conditional — অতীতের আফসোস</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
          Formula: If + Past Perfect, would have + Past Participle
        </div>
        <p className="text-xs text-slate-400">Third Conditional দিয়ে অতীতের কোনো ঘটনা ভিন্ন হলে কী হতো — সেই hypothetical অতীত বোঝানো হয়। IELTS Writing Task 2-এ historical argument-এ এটি ব্যবহার করা যায়।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"If the government had invested in renewable energy earlier, carbon emissions would have been much lower."</p>
          <p className="text-slate-300 italic">"If people had been more careful, the environmental crisis might not have occurred."</p>
        </div>
      </div>

      {/* Mixed Conditionals */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Mixed Conditionals</h4>
        <p className="text-xs text-slate-400">Mixed Conditionals তখন ব্যবহার হয় যখন if-clause এবং main clause দুটো আলাদা সময়ের কথা বলে।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
          Pattern: If + Past Perfect (past), would + infinitive (present result)
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"If she had chosen a different career, she would be much happier now."</p>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> IELTS Speaking Part 3-এ Examiner চায় আপনি abstract questions-এর উত্তর দিতে পারুন। Second ও Third Conditional ব্যবহার করলে আপনি Band 7-এর Grammar descriptor পূরণ করেন — "uses a variety of complex structures."</p>
      </div>
    </section>

    {/* ─── SECTION 4: 5.3 PASSIVE VOICE ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.3 Passive Voice — Task 1 Process Diagrams-এর ভিত্তি
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>Passive Voice IELTS Writing Task 1-এ process diagrams বর্ণনা করার সময় অত্যন্ত জরুরি। Man-made process-এর প্রতিটি step Passive Voice-এ লেখা হয়।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Passive Voice-এর মূল নিয়ম</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
          Formula: Object + be (conjugated) + Past Participle (+ by + agent, যদি প্রয়োজন হয়)
        </div>
        <p className="text-xs text-slate-400">Passive Voice-এ কাজটি কী হলো সেটা গুরুত্বপূর্ণ, কে করলো সেটা নয়।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-amber-300/70 font-bold">সক্রিয় (Active) থেকে নিষ্ক্রিয় (Passive) রূপান্তর:</p>
          <p className="text-slate-300"><span className="text-cyan-300 font-medium">Active:</span> "Workers filter the water."</p>
          <p className="text-slate-300"><span className="text-cyan-300 font-medium">Passive:</span> "The water is filtered."</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">IELTS Task 1-এ সবচেয়ে বেশি ব্যবহৃত Passive Tenses</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Tense</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Formula</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Present Simple Passive</td><td className="py-2 px-3 text-slate-300">is/are + Past Participle</td><td className="py-2 px-3 text-slate-300 italic">"The material is crushed into fine powder."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Past Simple Passive</td><td className="py-2 px-3 text-slate-300">was/were + Past Participle</td><td className="py-2 px-3 text-slate-300 italic">"The factory was built in 1985."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Present Perfect Passive</td><td className="py-2 px-3 text-slate-300">has/have been + Past Participle</td><td className="py-2 px-3 text-slate-300 italic">"The water has been treated with chemicals."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Future Passive</td><td className="py-2 px-3 text-slate-300">will be + Past Participle</td><td className="py-2 px-3 text-slate-300 italic">"The product will be packaged and distributed."</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Process Diagram-এর জন্য দরকারী Passive Verbs</h4>
        <p className="text-xs text-slate-400">নিচের verbs process diagrams-এ সবচেয়ে বেশি ব্যবহৃত হয়:</p>
        <div className="flex flex-wrap gap-2">
          {['is collected / gathered / harvested', 'is transported / transferred / moved', 'is filtered / purified / treated', 'is heated / cooled / dried', 'is crushed / ground / mixed', 'is packaged / distributed / sold', 'is converted / transformed / processed'].map((v) => (
            <span key={v} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs px-3 py-1.5 rounded-full">{v}</span>
          ))}
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ (সম্পূর্ণ বাক্য):</p>
          <p className="text-slate-300 italic">"First, the raw materials are collected from the mining site."</p>
          <p className="text-slate-300 italic">"Next, the ore is crushed into smaller pieces and then heated at high temperatures."</p>
          <p className="text-slate-300 italic">"Finally, the refined metal is packaged and sent to manufacturers."</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <p className="text-slate-400 font-bold">সাধারণ ভুল:</p>
          <p className="text-slate-400">Natural process (e.g., water cycle, plant growth) Passive-এ লেখা। Natural process সাধারণত Active Voice-এ বর্ণনা করা হয়।</p>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Process diagram পেলে প্রথম দেখেই বুঝুন এটা man-made নাকি natural। Man-made = Passive Voice; Natural = Active Voice।</p>
      </div>
    </section>

    {/* ─── SECTION 5: 5.4 ARTICLES ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.4 Articles (a/an/the) — IELTS-এ সবচেয়ে বেশি নম্বর কাটা যায় এখানে
      </h3>

      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl p-4 text-xs space-y-1">
        <p className="font-bold">Article ব্যবহারের ভুল IELTS examiner-এর কাছে সবচেয়ে সহজেই ধরা পড়ে কারণ বাংলায় Article বলে কিছু নেই। তাই এই section-এ মনোযোগ দেওয়া অত্যন্ত জরুরি।</p>
      </div>

      {/* A/An */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">"A/An" — Indefinite Article</h4>
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">কখন ব্যবহার করবেন:</p>
          <p>• Singular countable noun-এর আগে যখন প্রথমবার উল্লেখ করছেন।</p>
          <p>• কোনো নির্দিষ্ট একটি নয়, যেকোনো একটি বোঝাতে।</p>
          <p>• পেশা বা ভূমিকা বোঝাতে।</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg p-3 text-xs space-y-1">
          <p className="font-bold">নিয়ম:</p>
          <p>consonant sound-এর আগে "a", vowel sound-এর আগে "an" (শব্দের spelling নয়, উচ্চারণ দেখুন)।</p>
          <p>"a university" (কারণ 'university' শুরু হয় /j/ sound দিয়ে)</p>
          <p>"an hour" (কারণ 'hour'-এর 'h' উচ্চারিত হয় না)</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"She is a doctor." ✅ (পেশা)</p>
          <p className="text-slate-300 italic">"There is a solution to this problem." ✅</p>
          <p className="text-slate-300 italic">"He has an MBA from a prestigious university." ✅</p>
        </div>
      </div>

      {/* The */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">"The" — Definite Article</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">পরিস্থিতি</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">উদাহরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">আগে উল্লেখিত noun</td><td className="py-2 px-3 text-slate-300 italic">"I saw a dog. The dog was brown."</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">উভয় পক্ষ জানে কোনটা</td><td className="py-2 px-3 text-slate-300 italic">"The government should act."</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Superlative</td><td className="py-2 px-3 text-slate-300 italic">"The fastest / the most important"</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Unique things</td><td className="py-2 px-3 text-slate-300 italic">"The sun / the moon / the internet"</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Country + plural / Union</td><td className="py-2 px-3 text-slate-300 italic">"The United States / the Philippines"</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Rivers, oceans, mountain ranges</td><td className="py-2 px-3 text-slate-300 italic">"The Nile / the Himalayas"</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Zero Article */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">"The" কখন ব্যবহার করবেন না (Zero Article)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">পরিস্থিতি</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">উদাহরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">Plural countable noun — general</td><td className="py-2 px-3 text-slate-300 italic">"Children need good education." (সব শিশু, নির্দিষ্ট নয়)</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Uncountable noun — general</td><td className="py-2 px-3 text-slate-300 italic">"Water is essential for life."</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Languages, sports, subjects</td><td className="py-2 px-3 text-slate-300 italic">"She studies economics." / "He plays cricket."</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Most countries (single word)</td><td className="py-2 px-3 text-slate-300 italic">"Bangladesh / India / Japan"</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Meals</td><td className="py-2 px-3 text-slate-300 italic">"We had dinner at seven."</td></tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold mb-1">❌</p>
            <p>"The technology has changed the society."</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold mb-1">✅</p>
            <p>"Technology has changed society."</p>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Article মনে রাখার সহজ উপায় — প্রথমবার = a/an; দ্বিতীয়বার = the; General/Abstract = nothing।</p>
      </div>
    </section>

    {/* ─── SECTION 6: 5.5 PREPOSITIONS ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.5 Prepositions — Collocational Prepositions
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>Preposition-এর ভুল ব্যবহার IELTS Writing ও Speaking উভয় ক্ষেত্রে নম্বর কমায়। বাংলা ভাষায় Preposition কাজ করে Postposition হিসেবে (বিভক্তি/অনুসর্গ), তাই English Preposition আলাদাভাবে মুখস্থ করতে হয়।</p>
      </div>

      {/* Prepositions of Time */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Prepositions of Time</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Preposition</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">ব্যবহার</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">উদাহরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">at</td><td className="py-2 px-3 text-slate-300">নির্দিষ্ট সময়, midnight, noon, night</td><td className="py-2 px-3 text-slate-300 italic">"at 9 o'clock / at midnight / at the weekend"</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">on</td><td className="py-2 px-3 text-slate-300">নির্দিষ্ট দিন বা তারিখ</td><td className="py-2 px-3 text-slate-300 italic">"on Monday / on 5th May / on New Year's Day"</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">in</td><td className="py-2 px-3 text-slate-300">মাস, বছর, সিজন, দশক, শতাব্দী</td><td className="py-2 px-3 text-slate-300 italic">"in 2023 / in June / in the morning / in the 21st century"</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">by</td><td className="py-2 px-3 text-slate-300">deadline (এর আগে বা সময়ে)</td><td className="py-2 px-3 text-slate-300 italic">"by 2030 / by the end of the decade"</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">since</td><td className="py-2 px-3 text-slate-300">অতীত থেকে এখন পর্যন্ত (point in time)</td><td className="py-2 px-3 text-slate-300 italic">"since 2010 / since childhood"</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">for</td><td className="py-2 px-3 text-slate-300">সময়ের পরিমাণ (duration)</td><td className="py-2 px-3 text-slate-300 italic">"for three years / for a long time"</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verb + Preposition */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Verb + Preposition Collocations</h4>
        <p className="text-xs text-slate-400">নিচের collocations IELTS-এ অত্যন্ত বেশি ব্যবহৃত হয়:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Verb + Preposition</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">উদাহরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">agree with (person)</td><td className="py-2 px-3 text-slate-300 italic">"I agree with the author's viewpoint."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">agree on (topic)</td><td className="py-2 px-3 text-slate-300 italic">"They finally agreed on a solution."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">depend on</td><td className="py-2 px-3 text-slate-300 italic">"Success depends on consistent effort."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">result in</td><td className="py-2 px-3 text-slate-300 italic">"Overpopulation results in resource scarcity."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">contribute to</td><td className="py-2 px-3 text-slate-300 italic">"Education contributes to economic growth."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">focus on</td><td className="py-2 px-3 text-slate-300 italic">"The essay focuses on climate change."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">differ from</td><td className="py-2 px-3 text-slate-300 italic">"Urban life differs from rural life significantly."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">consist of</td><td className="py-2 px-3 text-slate-300 italic">"The diet consists of mainly vegetables."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">participate in</td><td className="py-2 px-3 text-slate-300 italic">"Students should participate in debates."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">invest in</td><td className="py-2 px-3 text-slate-300 italic">"Governments must invest in renewable energy."</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjective + Preposition */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Adjective + Preposition Collocations</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Adjective + Preposition</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">উদাহরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">responsible for</td><td className="py-2 px-3 text-slate-300 italic">"Humans are responsible for climate change."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">interested in</td><td className="py-2 px-3 text-slate-300 italic">"Young people are interested in technology."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">worried about</td><td className="py-2 px-3 text-slate-300 italic">"Many are worried about unemployment."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">similar to</td><td className="py-2 px-3 text-slate-300 italic">"This problem is similar to those in other countries."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">aware of</td><td className="py-2 px-3 text-slate-300 italic">"People should be aware of the consequences."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">capable of</td><td className="py-2 px-3 text-slate-300 italic">"Students are capable of achieving high scores."</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-medium">beneficial to</td><td className="py-2 px-3 text-slate-300 italic">"Exercise is beneficial to mental health."</td></tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold">❌</p>
            <p>"discuss about the problem"</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold">✅</p>
            <p>"discuss the problem"</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400">
            <p>(discuss-এর পরে about নয়)</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold">❌</p><p>"married with her"</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold">✅</p><p>"married to her"</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold">❌</p><p>"cope up with"</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold">✅</p><p>"cope with"</p>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Preposition collocation মুখস্থ করুন chunk হিসেবে — single verb নয়, পুরো phrase (verb + preposition) একসাথে।</p>
      </div>
    </section>

    {/* ─── SECTION 7: 5.6 RELATIVE CLAUSES ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.6 Relative Clauses — Defining vs Non-Defining
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>Relative Clauses IELTS Writing Task 2-এ complex sentence তৈরির সবচেয়ে কার্যকরী উপায়। এটি ভালোভাবে ব্যবহার করলে <span className="text-cyan-300 font-medium">Grammatical Range</span>-এ সরাসরি উপকার পাওয়া যায়।</p>
      </div>

      {/* Defining */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Defining Relative Clause</h4>
        <p className="text-xs text-slate-400">Defining Relative Clause noun-টিকে identify করে — এটি ছাড়া বাক্যের অর্থ অসম্পূর্ণ থাকে।</p>
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">নিয়ম:</p>
          <p>• Comma ব্যবহার হয় না।</p>
          <p>• People-এর জন্য: <span className="text-cyan-300 font-medium">who / that</span></p>
          <p>• Things-এর জন্য: <span className="text-cyan-300 font-medium">which / that</span></p>
          <p>• Possession-এর জন্য: <span className="text-cyan-300 font-medium">whose</span></p>
          <p>• Place-এর জন্য: <span className="text-cyan-300 font-medium">where</span></p>
          <p>• Time-এর জন্য: <span className="text-cyan-300 font-medium">when</span></p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"Students who study abroad gain valuable experience." (who = essential info)</p>
          <p className="text-slate-300 italic">"The policy that the government introduced has been criticised." (that = essential)</p>
          <p className="text-slate-300 italic">"Countries where education is free tend to have higher literacy rates."</p>
        </div>
      </div>

      {/* Non-Defining */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Non-Defining Relative Clause</h4>
        <p className="text-xs text-slate-400">Non-Defining Relative Clause extra information দেয় — এটি সরিয়ে দিলেও বাক্যের মূল অর্থ বোঝা যায়।</p>
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">নিয়ম:</p>
          <p>• Comma দিয়ে আলাদা করতে হয়।</p>
          <p>• "That" ব্যবহার করা যায় না (শুধু who/which)।</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ:</p>
          <p className="text-slate-300 italic">"Technology<em className="text-cyan-300">, which has advanced rapidly,</em> has transformed communication." (extra info about technology)</p>
          <p className="text-slate-300 italic">"Professor Ahmed<em className="text-cyan-300">, who has researched this topic extensively,</em> argues that..." (extra info about the professor)</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Defining vs Non-Defining — তুলনামূলক চার্ট</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">বিষয়</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Defining</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Non-Defining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Comma</td><td className="py-2 px-3 text-slate-300">নেই</td><td className="py-2 px-3 text-slate-300">আছে</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">"that"</td><td className="py-2 px-3 text-slate-300">ব্যবহার করা যায়</td><td className="py-2 px-3 text-slate-300">করা যায় না</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">বাদ দিলে</td><td className="py-2 px-3 text-slate-300">অর্থ পরিবর্তন হয়</td><td className="py-2 px-3 text-slate-300">অর্থ পরিবর্তন হয় না</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">ব্যবহার</td><td className="py-2 px-3 text-slate-300">essential info</td><td className="py-2 px-3 text-slate-300">extra info</td></tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold mb-1">❌</p>
            <p>"My brother that lives in London is a doctor."</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold mb-1">✅</p>
            <p>"My brother, who lives in London, is a doctor."</p>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Non-Defining clause যুক্ত করলে আপনার sentence automatically complex হয়ে যায় — এটি Band 7-এর একটি সরাসরি indicator।</p>
      </div>
    </section>

    {/* ─── SECTION 8: 5.7 COMPLEX SENTENCES ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.7 Complex Sentences ও Subordination — Band 7+ Grammar-এর চাবিকাঠি
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>IELTS Band Descriptor অনুযায়ী, Band 7-এ <span className="text-cyan-300 font-medium">"a variety of complex structures"</span> থাকতে হবে। Complex sentence মানে শুধু লম্বা বাক্য নয় — সঠিক Subordinate Clause ব্যবহার করে অর্থপূর্ণ logical connection তৈরি করা।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-cyan-100">Subordinating Conjunctions — ধরন ও ব্যবহার</h4>

        <div className="space-y-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-rose-300 font-bold">Contrast (বিপরীত):</p>
            <p className="text-cyan-300 font-medium">although, though, even though, whereas, while</p>
            <p className="text-slate-300 italic">"Although urbanisation creates economic opportunities, it also causes social problems."</p>
            <p className="text-slate-300 italic">"Whereas developed countries have surplus food, developing nations often face shortages."</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-blue-300 font-bold">Cause and Effect (কারণ ও ফলাফল):</p>
            <p className="text-cyan-300 font-medium">because, since, as, given that</p>
            <p className="text-slate-300 italic">"Since pollution levels have risen dramatically, governments must take immediate action."</p>
            <p className="text-slate-300 italic">"Given that young people spend more time online, digital literacy is now essential."</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-emerald-300 font-bold">Condition (শর্ত):</p>
            <p className="text-cyan-300 font-medium">if, unless, provided that, as long as</p>
            <p className="text-slate-300 italic">"Unless drastic measures are taken, the situation will worsen."</p>
            <p className="text-slate-300 italic">"Provided that funding is secured, the project can be completed on time."</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-purple-300 font-bold">Purpose (উদ্দেশ্য):</p>
            <p className="text-cyan-300 font-medium">so that, in order that, in order to</p>
            <p className="text-slate-300 italic">"Governments should increase taxes so that better public services can be provided."</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-amber-300 font-bold">Time (সময়):</p>
            <p className="text-cyan-300 font-medium">when, while, after, before, once, until, as soon as</p>
            <p className="text-slate-300 italic">"Once the data was analysed, researchers published their findings."</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Complex Sentence-এর কাঠামো</h4>
        <p className="text-xs text-slate-400">Complex sentence-এ একটি Main Clause এবং একটি বা একাধিক Subordinate Clause থাকে।</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
            Pattern 1: Main Clause + Subordinating Conjunction + Subordinate Clause
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs shadow-inner">
            Pattern 2: Sub. Conjunction + Subordinate Clause + , + Main Clause
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-slate-300 italic">"Unemployment rises (main) when economic growth slows." (subordinate)</p>
          <p className="text-slate-300 italic">"Although technology offers many benefits, (subordinate) it also creates new risks." (main)</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg p-3 text-xs">
          <p><strong>IELTS Task 2-এ লক্ষ্যমাত্রা:</strong> প্রতিটি body paragraph-এ কমপক্ষে দুটো complex sentence থাকতে হবে।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold mb-1">❌</p>
            <p>"Although he studied hard. He failed the exam."</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-2.5 text-xs">
            <p className="font-bold mb-1">✅</p>
            <p>"Although he studied hard, he failed the exam."</p>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Complex sentence মানে grammatical sophistication। Band 7 চাইলে প্রতি paragraph-এ although, whereas, given that, provided that, unless — এসব conjunction ব্যবহার করুন সচেতনভাবে।</p>
      </div>
    </section>

    {/* ─── SECTION 9: 5.8 COMMON MISTAKES ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        5.8 South Asian IELTS Candidates-এর সাধারণ Grammar ভুল ও সংশোধন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-300">
        <p>বাংলাদেশ ও পশ্চিমবঙ্গের IELTS candidates যে grammar ভুলগুলো বারবার করেন, নিচে সেগুলো চিহ্নিত করা হলো। প্রতিটি ভুল চেনা থাকলে সংশোধন করা অনেক সহজ হয়।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mistake 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">১. Article বাদ দেওয়া</p>
          <p className="text-xs text-slate-400">বাংলায় কোনো article নেই বলে English-এ article বাদ পড়ে যায়।</p>
          <div className="space-y-1.5">
            {[
              ['"He is going to office."', '"He is going to the office."'],
              ['"She is teacher."', '"She is a teacher."'],
              ['"Sun rises in the east."', '"The sun rises in the east."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">২. Discuss About — Redundant Preposition</p>
          <div className="space-y-1.5">
            {[
              ['"Let us discuss about the issue."', '"Let us discuss the issue."'],
              ['"We emphasized on quality."', '"We emphasized quality."'],
              ['"He entered into the room."', '"He entered the room."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">৩. Subject-Verb Agreement ভুল</p>
          <div className="space-y-1.5">
            {[
              ['"The number of students are increasing."', '"The number of students is increasing."'],
              ['"Each of the participants have completed."', '"Each of the participants has completed."'],
              ['"The government are planning..."', '"The government is planning..."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">৪. Present Continuous-এর অতিরিক্ত ব্যবহার</p>
          <p className="text-xs text-slate-400">State verbs (know, understand, believe, want, like, love, prefer, contain, seem) Continuous form হয় না।</p>
          <div className="space-y-1.5">
            {[
              ['"I am knowing the answer."', '"I know the answer."'],
              ['"She is understanding the problem."', '"She understands the problem."'],
              ['"He is wanting to go abroad."', '"He wants to go abroad."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">৫. "Since" ও "For"-এর ভুল ব্যবহার</p>
          <div className="space-y-1.5">
            {[
              ['"I have been here since three years."', '"I have been here for three years."'],
              ['"She worked here for 2010."', '"She worked here since 2010."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400"><span className="text-cyan-300 font-medium">নিয়ম:</span> Since = point in time (2010, childhood, Monday); For = duration (three years, a long time).</p>
        </div>

        {/* Mistake 6 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">৬. Passive Voice-এর ভুল Formation</p>
          <div className="space-y-1.5">
            {[
              ['"The report was wrote by her."', '"The report was written by her."'],
              ['"The problem is been discussed."', '"The problem is being discussed."'],
              ['"It is being discussed yesterday."', '"It was discussed yesterday."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 7 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">৭. Tense Inconsistency</p>
          <p className="text-xs text-slate-400">একই paragraph-এ Tense বদলানো।</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ "The study showed that technology is changing rapidly."</div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ "The study showed that technology was changing rapidly."</div>
          </div>
          <p className="text-xs text-slate-400"><span className="text-cyan-300 font-medium">IELTS Writing Task 1-এর নিয়ম:</span> Historical data = Past Tense। Future projection = Future Tense।</p>
        </div>

        {/* Mistake 8 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">৮. Comparative ও Superlative-এর ভুল</p>
          <div className="space-y-1.5">
            {[
              ['"more faster"', '"faster"'],
              ['"more better"', '"better"'],
              ['"the most highest"', '"the highest"'],
              ['"more cheaper than"', '"cheaper than"'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 9 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">৯. "Had" + Infinitive-এর ভুল</p>
          <div className="space-y-1.5">
            {[
              ['"We had went to the market."', '"We had gone to the market."'],
              ['"She had ate the food."', '"She had eaten the food."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 10 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">১০. Double Negative</p>
          <p className="text-xs text-slate-400">বাংলায় double negative স্বাভাবিক, কিন্তু English-এ এটি গ্রহণযোগ্য নয়।</p>
          <div className="space-y-1.5">
            {[
              ['"I don\'t know nothing about it."', '"I don\'t know anything about it."'],
              ['"There isn\'t no solution."', '"There is no solution." / "There isn\'t any solution."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 11 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">১১. Conditional-এ "Will" ব্যবহার</p>
          <p className="text-xs text-slate-400">If-clause-এ "will" ব্যবহার করা যায় না।</p>
          <div className="space-y-1.5">
            {[
              ['"If it will rain, I will stay home."', '"If it rains, I will stay home."'],
              ['"If she will come, we can start."', '"If she comes, we can start."'],
            ].map(([wrong, right], i) => (
              <div key={i} className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ {wrong}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ {right}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake 12 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-cyan-100">১২. "Cope Up With" — Phantom Phrasal Verb</p>
          <p className="text-xs text-slate-400">"Cope up with" বলে English-এ কিছু নেই — এটি South Asian English-এর একটি বিশেষ ভুল।</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded p-2">❌ "I cannot cope up with the pressure."</div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded p-2">✅ "I cannot cope with the pressure."</div>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> এই ১২টি ভুল avoid করতে পারলেই Grammatical Accuracy-তে উল্লেখযোগ্য উন্নতি হবে। প্রতিদিন Writing practice-এর পর নিজের essay এই checklist দিয়ে review করুন।</p>
      </div>
    </section>

    {/* ─── SECTION 10: MODULE SUMMARY ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <p className="text-xs text-slate-300">এই module সম্পন্ন করার পর আপনি নিচের বিষয়গুলো ব্যবহার করতে পারবেন IELTS Writing ও Speaking-এ:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">বিষয়</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">মূল শিক্ষা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Tenses</td><td className="py-2 px-3 text-slate-300">Present Perfect, Past Simple, Past Perfect এবং Future forms-এর সঠিক পার্থক্য ও ব্যবহার</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Conditionals</td><td className="py-2 px-3 text-slate-300">চার ধরনের Conditional এবং Speaking Part 3-এ এদের প্রয়োগ</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Passive Voice</td><td className="py-2 px-3 text-slate-300">Task 1 Process Diagram-এ Passive Voice-এর সঠিক ব্যবহার</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Articles</td><td className="py-2 px-3 text-slate-300">a/an/the এবং Zero Article-এর নিয়মাবলী</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Prepositions</td><td className="py-2 px-3 text-slate-300">Collocational Prepositions যেমন depend on, result in, responsible for</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Relative Clauses</td><td className="py-2 px-3 text-slate-300">Defining ও Non-Defining Clause-এর পার্থক্য এবং comma নিয়ম</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Complex Sentences</td><td className="py-2 px-3 text-slate-300">Subordinating Conjunctions ব্যবহার করে Band 7+ grammar তৈরি</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Common Mistakes</td><td className="py-2 px-3 text-slate-300">বাংলা-ভাষী শিক্ষার্থীদের ১২টি সাধারণ ভুল ও সংশোধন</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 space-y-2">
        <p className="font-bold text-slate-300">পরবর্তী পদক্ষেপ:</p>
        <p>১. প্রতিদিন একটি করে IELTS Task 2 essay লিখুন এবং এই module-এর checklist দিয়ে review করুন।</p>
        <p>২. Speaking Part 3-এর practice-এ Conditional sentences ব্যবহার করার চেষ্টা করুন সচেতনভাবে।</p>
        <p>৩. Process diagram দেখলে সঙ্গে সঙ্গে Passive Voice-এ একটি paragraph লেখার practice করুন।</p>
        <p>৪. Article ও Preposition-এর ভুল কমাতে প্রতিদিন ৫টি নতুন collocation মুখস্থ করুন।</p>
      </div>

      {/* Concluding Message */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 text-center italic">
        <p>শেষ কথা: Grammar কোনো isolated rule নয় — এটি আপনার idea express করার হাতিয়ার। যত বেশি authentic English পড়বেন ও শুনবেন, এই structures তত স্বাভাবিক হয়ে উঠবে।</p>
      </div>

      {/* CLAIM XP BUTTON */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>
  </section>
);

const MODULE_06_NOTES = (
  <div className="space-y-10 text-slate-300 leading-relaxed max-w-4xl">

    {/* ─── OVERVIEW CARD ─────────────────────────────────────────────────────── */}
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎯 এই module-এ যা শিখবেন
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md">লক্ষ্য Band: ৬.৫ – ৮</span>
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">Module: ০৬ — Vocabulary</span>
        </div>
      </div>
      <p className="text-sm text-slate-300">এই module শেষ করলে তুমি IELTS-এর Writing এবং Speaking-এ high-band vocabulary ব্যবহার করতে পারবে — Academic Word List থেকে শুরু করে collocations, paraphrasing, formal/informal choice এবং word formation পর্যন্ত সব কিছু।</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300 pt-2">
        <li className="flex items-center gap-2">🔹 Academic Word List (AWL) essentials</li>
        <li className="flex items-center gap-2">🔹 Topic vocabulary banks</li>
        <li className="flex items-center gap-2">🔹 Collocations — Writing ও Speaking</li>
        <li className="flex items-center gap-2">🔹 Paraphrasing techniques</li>
        <li className="flex items-center gap-2">🔹 Formal vs informal vocabulary</li>
        <li className="flex items-center gap-2">🔹 Word formation — noun/verb/adjective/adverb</li>
      </ul>
    </div>

    {/* ─── 6.1 ACADEMIC WORD LIST (AWL) ──────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৬.১ Academic Word List (AWL) — সবচেয়ে গুরুত্বপূর্ণ ৫৭০টি Word Family
      </h2>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white">AWL কী এবং কেন জরুরি?</h3>
        <p className="text-slate-300">AWL মানে Academic Word List — এটি মূলত ৫৭০টি word family-র একটি তালিকা যা প্রায় সব ধরনের academic text-এ বারবার আসে। Vocabulary-র জন্য যে Lexical Resource criterion আছে, তাতে এই word-গুলো ব্যবহার করলে examiner সরাসরি বুঝতে পারেন যে তোমার vocabulary range ভালো।</p>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 space-y-1">
          <strong className="text-cyan-300 block">কেন শিখবে?</strong>
          <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-2">
            <li>IELTS Writing Task 2-তে AWL word ব্যবহার করলে Lexical Resource score বাড়ে।</li>
            <li>Reading-এ এই word-গুলো চিনলে passage বুঝতে সুবিধা হয়।</li>
            <li>Speaking Part 3-এ AWL word স্বাভাবিকভাবে বললে examiner প্রভাবিত হন।</li>
          </ul>
        </div>
      </div>

      {/* AWL TABLE */}
      <h3 className="text-sm font-bold text-white pt-2">উচ্চ-ব্যবহারযোগ্য AWL Words — সারণী</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Word</th>
              <th className="p-3">Noun form</th>
              <th className="p-3">Verb form</th>
              <th className="p-3">Adjective</th>
              <th className="p-3">Example Sentence</th>
            </tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-3 font-semibold text-white">1</td><td className="p-3 text-cyan-300 font-bold">analyse</td><td className="p-3">analysis</td><td className="p-3">analyse</td><td className="p-3">analytical</td><td className="p-3">Researchers analyse data to identify trends in climate change.</td></tr>
            <tr><td className="p-3 font-semibold text-white">2</td><td className="p-3 text-cyan-300 font-bold">approach</td><td className="p-3">approach</td><td className="p-3">approach</td><td className="p-3">—</td><td className="p-3">Governments should approach education reform carefully.</td></tr>
            <tr><td className="p-3 font-semibold text-white">3</td><td className="p-3 text-cyan-300 font-bold">assume</td><td className="p-3">assumption</td><td className="p-3">assume</td><td className="p-3">assumed</td><td className="p-3">We cannot assume that technology always benefits society.</td></tr>
            <tr><td className="p-3 font-semibold text-white">4</td><td className="p-3 text-cyan-300 font-bold">benefit</td><td className="p-3">benefit</td><td className="p-3">benefit</td><td className="p-3">beneficial</td><td className="p-3">Exercise has many benefits for mental health.</td></tr>
            <tr><td className="p-3 font-semibold text-white">5</td><td className="p-3 text-cyan-300 font-bold">concept</td><td className="p-3">concept</td><td className="p-3">—</td><td className="p-3">conceptual</td><td className="p-3">The concept of lifelong learning is central to modern education.</td></tr>
            <tr><td className="p-3 font-semibold text-white">6</td><td className="p-3 text-cyan-300 font-bold">consequence</td><td className="p-3">consequence</td><td className="p-3">—</td><td className="p-3">consequential</td><td className="p-3">Pollution has severe consequences for public health.</td></tr>
            <tr><td className="p-3 font-semibold text-white">7</td><td className="p-3 text-cyan-300 font-bold">contribute</td><td className="p-3">contribution</td><td className="p-3">contribute</td><td className="p-3">contributory</td><td className="p-3">Individuals can contribute to reducing carbon emissions.</td></tr>
            <tr><td className="p-3 font-semibold text-white">8</td><td className="p-3 text-cyan-300 font-bold">establish</td><td className="p-3">establishment</td><td className="p-3">establish</td><td className="p-3">established</td><td className="p-3">Governments must establish clear environmental policies.</td></tr>
            <tr><td className="p-3 font-semibold text-white">9</td><td className="p-3 text-cyan-300 font-bold">evident</td><td className="p-3">evidence</td><td className="p-3">—</td><td className="p-3">evident</td><td className="p-3">It is evident that unemployment affects mental wellbeing.</td></tr>
            <tr><td className="p-3 font-semibold text-white">10</td><td className="p-3 text-cyan-300 font-bold">factor</td><td className="p-3">factor</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3">Diet is a key factor in preventing chronic disease.</td></tr>
            <tr><td className="p-3 font-semibold text-white">11</td><td className="p-3 text-cyan-300 font-bold">impact</td><td className="p-3">impact</td><td className="p-3">impact</td><td className="p-3">—</td><td className="p-3">Technology has a profound impact on communication.</td></tr>
            <tr><td className="p-3 font-semibold text-white">12</td><td className="p-3 text-cyan-300 font-bold">indicate</td><td className="p-3">indication</td><td className="p-3">indicate</td><td className="p-3">indicative</td><td className="p-3">Studies indicate that exercise reduces stress levels.</td></tr>
            <tr><td className="p-3 font-semibold text-white">13</td><td className="p-3 text-cyan-300 font-bold">major</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3">major</td><td className="p-3">Air pollution is a major concern in urban areas.</td></tr>
            <tr><td className="p-3 font-semibold text-white">14</td><td className="p-3 text-cyan-300 font-bold">method</td><td className="p-3">method</td><td className="p-3">—</td><td className="p-3">methodical</td><td className="p-3">One method of reducing traffic congestion is carpooling.</td></tr>
            <tr><td className="p-3 font-semibold text-white">15</td><td className="p-3 text-cyan-300 font-bold">obtain</td><td className="p-3">—</td><td className="p-3">obtain</td><td className="p-3">—</td><td className="p-3">Students must obtain practical skills alongside academic knowledge.</td></tr>
            <tr><td className="p-3 font-semibold text-white">16</td><td className="p-3 text-cyan-300 font-bold">occur</td><td className="p-3">occurrence</td><td className="p-3">occur</td><td className="p-3">—</td><td className="p-3">Climate disasters occur more frequently due to global warming.</td></tr>
            <tr><td className="p-3 font-semibold text-white">17</td><td className="p-3 text-cyan-300 font-bold">policy</td><td className="p-3">policy</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3">A strong education policy can reduce social inequality.</td></tr>
            <tr><td className="p-3 font-semibold text-white">18</td><td className="p-3 text-cyan-300 font-bold">promote</td><td className="p-3">promotion</td><td className="p-3">promote</td><td className="p-3">promotional</td><td className="p-3">Schools should promote critical thinking over rote memorisation.</td></tr>
            <tr><td className="p-3 font-semibold text-white">19</td><td className="p-3 text-cyan-300 font-bold">require</td><td className="p-3">requirement</td><td className="p-3">require</td><td className="p-3">required</td><td className="p-3">Modern jobs require both technical and interpersonal skills.</td></tr>
            <tr><td className="p-3 font-semibold text-white">20</td><td className="p-3 text-cyan-300 font-bold">significant</td><td className="p-3">significance</td><td className="p-3">signify</td><td className="p-3">significant</td><td className="p-3">Renewable energy has made a significant contribution to reducing emissions.</td></tr>
            <tr><td className="p-3 font-semibold text-white">21</td><td className="p-3 text-cyan-300 font-bold">source</td><td className="p-3">source</td><td className="p-3">source</td><td className="p-3">—</td><td className="p-3">The internet is a valuable source of information for students.</td></tr>
            <tr><td className="p-3 font-semibold text-white">22</td><td className="p-3 text-cyan-300 font-bold">specific</td><td className="p-3">specificity</td><td className="p-3">—</td><td className="p-3">specific</td><td className="p-3">Teachers should give specific feedback to improve student performance.</td></tr>
            <tr><td className="p-3 font-semibold text-white">23</td><td className="p-3 text-cyan-300 font-bold">sufficient</td><td className="p-3">sufficiency</td><td className="p-3">suffice</td><td className="p-3">sufficient</td><td className="p-3">Governments must ensure sufficient funding for public healthcare.</td></tr>
            <tr><td className="p-3 font-semibold text-white">24</td><td className="p-3 text-cyan-300 font-bold">sustain</td><td className="p-3">sustainability</td><td className="p-3">sustain</td><td className="p-3">sustainable</td><td className="p-3">We need sustainable energy solutions to protect the environment.</td></tr>
            <tr><td className="p-3 font-semibold text-white">25</td><td className="p-3 text-cyan-300 font-bold">trend</td><td className="p-3">trend</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3">There is a growing trend towards remote working in many industries.</td></tr>
          </tbody>
        </table>
      </div>

      {/* AWL LEARNING STRATEGIES */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
        <strong className="text-white block font-bold text-sm">AWL শেখার কৌশল</strong>
        <ol className="list-decimal list-inside text-slate-300 space-y-1">
          <li>প্রতিটি word শুধু মুখস্থ না করে word family-সহ শিখো (noun, verb, adjective, adverb)।</li>
          <li>একটি vocabulary notebook রাখো — প্রতিটি শব্দ তার collocation সহ লেখো।</li>
          <li>Writing Task 2 practice করার সময় AWL word use করার চেষ্টা করো এবং পরে highlight করে গণনা করো।</li>
        </ol>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        AWL-এর ৫৭০টি word family সব academic text-এর প্রায় ১০% জায়গা দখল করে। এগুলো শিখলে Reading সহজ হয়, Writing-এর Lexical Resource score বাড়ে, এবং Speaking Part 3-এ স্বাভাবিক শোনায়।
      </div>
    </section>

    {/* ─── 6.2 TOPIC VOCABULARY BANKS ────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৬.২ Topic Vocabulary Banks — ৬টি প্রধান IELTS বিষয়
      </h2>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
        <p>IELTS Writing Task 2 এবং Speaking Part 3-এ কিছু নির্দিষ্ট topic বারবার আসে। প্রতিটি topic-এর জন্য ready-made vocabulary থাকলে পরীক্ষার সময় মাথায় খুঁজতে হয় না।</p>
      </div>

      {/* TOPIC 1: ENVIRONMENT */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Topic 1</span>
          Environment (পরিবেশ)
        </h3>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
              <tr><th className="p-2.5">Vocabulary Item</th><th className="p-2.5">ব্যবহারের উদাহরণ</th></tr>
            </thead>
            <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              <tr><td className="p-2.5 text-cyan-300 font-bold">climate change</td><td className="p-2.5">Climate change poses an existential threat to coastal nations.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">carbon emissions</td><td className="p-2.5">Industries must reduce carbon emissions to meet global targets.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">greenhouse gases</td><td className="p-2.5">Greenhouse gases trap heat within the Earth's atmosphere.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">renewable energy</td><td className="p-2.5">Solar and wind power are the most promising renewable energy sources.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">fossil fuels</td><td className="p-2.5">Our dependence on fossil fuels must end within this decade.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">deforestation</td><td className="p-2.5">Deforestation destroys biodiversity and accelerates global warming.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">biodiversity</td><td className="p-2.5">Protecting biodiversity is essential for ecosystem stability.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">pollution</td><td className="p-2.5">Air pollution causes respiratory diseases in urban populations.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">sustainable development</td><td className="p-2.5">Sustainable development balances economic growth with environmental protection.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">ecosystem</td><td className="p-2.5">Coral reef ecosystems are under severe threat from ocean acidification.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">natural disaster</td><td className="p-2.5">The frequency of natural disasters has increased due to climate change.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">carbon footprint</td><td className="p-2.5">Individuals can reduce their carbon footprint by using public transport.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">global warming</td><td className="p-2.5">Global warming is causing polar ice caps to melt at an alarming rate.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">conservation</td><td className="p-2.5">Wildlife conservation efforts have helped save several endangered species.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPIC 2: EDUCATION */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Topic 2</span>
          Education (শিক্ষা)
        </h3>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
              <tr><th className="p-2.5">Vocabulary Item</th><th className="p-2.5">ব্যবহারের উদাহরণ</th></tr>
            </thead>
            <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              <tr><td className="p-2.5 text-cyan-300 font-bold">academic achievement</td><td className="p-2.5">Socioeconomic factors strongly influence academic achievement.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">critical thinking</td><td className="p-2.5">Schools should prioritise critical thinking over memorisation.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">higher education</td><td className="p-2.5">Access to higher education remains unequal across different social groups.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">curriculum</td><td className="p-2.5">A modern curriculum must include digital literacy skills.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">extracurricular activities</td><td className="p-2.5">Extracurricular activities develop social and leadership skills in students.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">distance learning</td><td className="p-2.5">Distance learning platforms expanded dramatically during the pandemic.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">literacy rate</td><td className="p-2.5">Improving the literacy rate is fundamental to economic development.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">tuition fees</td><td className="p-2.5">Rising tuition fees are discouraging students from pursuing university education.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">vocational training</td><td className="p-2.5">Vocational training provides practical skills for immediate employment.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">scholarship</td><td className="p-2.5">Scholarships enable talented students from low-income families to access education.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">standardised testing</td><td className="p-2.5">Critics argue that standardised testing fails to measure creativity.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">lifelong learning</td><td className="p-2.5">The concept of lifelong learning is increasingly valued in modern workplaces.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">peer learning</td><td className="p-2.5">Collaborative peer learning activities improve comprehension and retention.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPIC 3: HEALTH */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Topic 3</span>
          Health (স্বাস্থ্য)
        </h3>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
              <tr><th className="p-2.5">Vocabulary Item</th><th className="p-2.5">ব্যবহারের উদাহরণ</th></tr>
            </thead>
            <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              <tr><td className="p-2.5 text-cyan-300 font-bold">public health</td><td className="p-2.5">Governments must invest in public health infrastructure.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">mental health</td><td className="p-2.5">Mental health issues are often neglected compared to physical conditions.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">chronic disease</td><td className="p-2.5">Poor diet is a leading cause of chronic diseases such as diabetes.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">obesity</td><td className="p-2.5">Obesity rates have increased dramatically in developed countries.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">healthcare system</td><td className="p-2.5">An underfunded healthcare system cannot meet growing patient demand.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">preventive medicine</td><td className="p-2.5">Preventive medicine reduces long-term healthcare costs significantly.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">sedentary lifestyle</td><td className="p-2.5">A sedentary lifestyle increases the risk of cardiovascular disease.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">wellbeing</td><td className="p-2.5">Employee wellbeing directly affects workplace productivity.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">life expectancy</td><td className="p-2.5">Advances in medicine have raised life expectancy considerably.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">epidemic</td><td className="p-2.5">The obesity epidemic is one of the most pressing public health challenges.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">vaccination</td><td className="p-2.5">Widespread vaccination programmes have eliminated many fatal diseases.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">nutritious diet</td><td className="p-2.5">A nutritious diet is fundamental to maintaining good health.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">stress management</td><td className="p-2.5">Effective stress management techniques reduce the risk of burnout.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPIC 4: TECHNOLOGY */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Topic 4</span>
          Technology (প্রযুক্তি)
        </h3>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
              <tr><th className="p-2.5">Vocabulary Item</th><th className="p-2.5">ব্যবহারের উদাহরণ</th></tr>
            </thead>
            <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              <tr><td className="p-2.5 text-cyan-300 font-bold">artificial intelligence</td><td className="p-2.5">Artificial intelligence is transforming industries from healthcare to finance.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">automation</td><td className="p-2.5">Automation threatens to displace millions of low-skilled workers.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">digital revolution</td><td className="p-2.5">The digital revolution has fundamentally changed how people communicate.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">social media</td><td className="p-2.5">Social media platforms have both connected and divided modern societies.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">cybersecurity</td><td className="p-2.5">Cybersecurity threats pose significant risks to businesses and governments.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">innovation</td><td className="p-2.5">Technological innovation drives economic growth and social progress.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">data privacy</td><td className="p-2.5">Data privacy concerns have led to stricter regulations across many countries.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">surveillance</td><td className="p-2.5">Government surveillance technology raises serious civil liberties concerns.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">virtual reality</td><td className="p-2.5">Virtual reality is increasingly used in medical training and education.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">e-commerce</td><td className="p-2.5">The rise of e-commerce has disrupted traditional retail industries.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">digital divide</td><td className="p-2.5">The digital divide widens inequality between developed and developing nations.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">algorithm</td><td className="p-2.5">Social media algorithms determine what content users are exposed to.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">renewable technology</td><td className="p-2.5">Investment in renewable technology is crucial for combating climate change.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPIC 5: WORK */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Topic 5</span>
          Work (কাজ ও কর্মসংস্থান)
        </h3>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
              <tr><th className="p-2.5">Vocabulary Item</th><th className="p-2.5">ব্যবহারের উদাহরণ</th></tr>
            </thead>
            <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              <tr><td className="p-2.5 text-cyan-300 font-bold">unemployment</td><td className="p-2.5">High unemployment rates lead to increased poverty and social unrest.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">job satisfaction</td><td className="p-2.5">Job satisfaction is more important to many workers than salary alone.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">remote working</td><td className="p-2.5">Remote working has become standard practice in many knowledge-based industries.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">work-life balance</td><td className="p-2.5">Poor work-life balance negatively impacts employee health and productivity.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">skilled workforce</td><td className="p-2.5">Countries compete to attract a skilled workforce in technology sectors.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">entrepreneurship</td><td className="p-2.5">Encouraging entrepreneurship creates jobs and drives economic innovation.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">career progression</td><td className="p-2.5">Gender inequality continues to obstruct women's career progression.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">minimum wage</td><td className="p-2.5">Raising the minimum wage can reduce poverty but may affect employment levels.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">outsourcing</td><td className="p-2.5">Many companies rely on outsourcing to reduce operational costs.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">labour market</td><td className="p-2.5">Automation is fundamentally reshaping the global labour market.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">redundancy</td><td className="p-2.5">Mass redundancies in manufacturing have devastated many local communities.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">productivity</td><td className="p-2.5">Flexible working hours have been shown to increase overall productivity.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPIC 6: SOCIETY */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Topic 6</span>
          Society (সমাজ)
        </h3>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
              <tr><th className="p-2.5">Vocabulary Item</th><th className="p-2.5">ব্যবহারের উদাহরণ</th></tr>
            </thead>
            <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              <tr><td className="p-2.5 text-cyan-300 font-bold">social inequality</td><td className="p-2.5">Social inequality undermines national cohesion and trust in institutions.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">gender equality</td><td className="p-2.5">Achieving gender equality requires systemic changes in law and culture.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">multiculturalism</td><td className="p-2.5">Multiculturalism enriches societies but can also create challenges for integration.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">urbanisation</td><td className="p-2.5">Rapid urbanisation is putting pressure on housing, transport and public services.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">ageing population</td><td className="p-2.5">An ageing population creates significant pressure on pension and healthcare systems.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">social mobility</td><td className="p-2.5">Education is considered the most effective route to social mobility.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">community cohesion</td><td className="p-2.5">Strong community cohesion helps prevent crime and social isolation.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">poverty</td><td className="p-2.5">Extreme poverty denies individuals access to basic rights and opportunities.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">immigration</td><td className="p-2.5">Immigration contributes positively to economic growth and cultural diversity.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">crime rate</td><td className="p-2.5">Research shows that higher poverty levels correlate with elevated crime rates.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">infrastructure</td><td className="p-2.5">Inadequate infrastructure holds back economic development in rural areas.</td></tr>
              <tr><td className="p-2.5 text-cyan-300 font-bold">civic responsibility</td><td className="p-2.5">Citizens must exercise civic responsibility by participating in democratic processes.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        এই ৬টি topic থেকে IELTS-এর প্রায় ৮০% Writing Task 2 প্রশ্ন আসে। প্রতিটি topic-এর জন্য অন্তত ১০টি করে word মুখস্থ থাকলে পরীক্ষায় অনেকটা এগিয়ে থাকবে।
      </div>
    </section>

    {/* ─── 6.3 COLLOCATIONS ───────────────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৬.৩ Collocations — Writing ও Speaking-এর জন্য
      </h2>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
        <p>Collocation মানে হলো এমন দুটি বা তার বেশি word যেগুলো সাধারণত একসাথে ব্যবহার হয়। একটি উদাহরণ: "make" এবং "progress" একসাথে বললে "make progress" হয় — কিন্তু "do progress" বলা ভুল। Examiner-রা স্বাভাবিক collocation-এর দিকে বিশেষভাবে নজর দেন।</p>
      </div>

      {/* VERB + NOUN COLLOCATIONS */}
      <h3 className="text-sm font-bold text-white pt-2">Verb + Noun Collocations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <strong className="text-cyan-300 font-bold block text-sm">Environment বিষয়ক:</strong>
          <ul className="text-slate-300 space-y-0.5">
            <li><span className="text-cyan-300 font-medium">tackle</span> climate change <span className="text-slate-500">(climate change মোকাবেলা করা)</span></li>
            <li><span className="text-cyan-300 font-medium">reduce</span> carbon emissions <span className="text-slate-500">(carbon নিঃসরণ কমানো)</span></li>
            <li><span className="text-cyan-300 font-medium">protect</span> biodiversity <span className="text-slate-500">(জীববৈচিত্র্য রক্ষা করা)</span></li>
            <li><span className="text-cyan-300 font-medium">promote</span> renewable energy <span className="text-slate-500">(নবায়নযোগ্য শক্তির প্রচার করা)</span></li>
            <li><span className="text-cyan-300 font-medium">address</span> environmental concerns <span className="text-slate-500">(পরিবেশ সমস্যা সমাধান করা)</span></li>
          </ul>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <strong className="text-cyan-300 font-bold block text-sm">Education বিষয়ক:</strong>
          <ul className="text-slate-300 space-y-0.5">
            <li><span className="text-cyan-300 font-medium">acquire</span> knowledge <span className="text-slate-500">(জ্ঞান অর্জন করা)</span></li>
            <li><span className="text-cyan-300 font-medium">develop</span> critical thinking <span className="text-slate-500">(সমালোচনামূলক চিন্তাশক্তি বিকাশ করা)</span></li>
            <li><span className="text-cyan-300 font-medium">gain</span> qualifications <span className="text-slate-500">(যোগ্যতা অর্জন করা)</span></li>
            <li><span className="text-cyan-300 font-medium">pursue</span> higher education <span className="text-slate-500">(উচ্চশিক্ষা গ্রহণ করা)</span></li>
            <li><span className="text-cyan-300 font-medium">broaden</span> horizons <span className="text-slate-500">(দিগন্ত প্রসারিত করা)</span></li>
          </ul>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <strong className="text-cyan-300 font-bold block text-sm">Health বিষয়ক:</strong>
          <ul className="text-slate-300 space-y-0.5">
            <li><span className="text-cyan-300 font-medium">maintain</span> good health <span className="text-slate-500">(সুস্বাস্থ্য বজায় রাখা)</span></li>
            <li><span className="text-cyan-300 font-medium">suffer from</span> chronic disease <span className="text-slate-500">(দীর্ঘমেয়াদি রোগে ভোগা)</span></li>
            <li><span className="text-cyan-300 font-medium">adopt</span> a healthy lifestyle <span className="text-slate-500">(স্বাস্থ্যকর জীবনধারা অনুসরণ করা)</span></li>
            <li><span className="text-cyan-300 font-medium">reduce</span> stress <span className="text-slate-500">(মানসিক চাপ কমানো)</span></li>
            <li><span className="text-cyan-300 font-medium">prevent</span> disease <span className="text-slate-500">(রোগ প্রতিরোধ করা)</span></li>
          </ul>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <strong className="text-cyan-300 font-bold block text-sm">Technology ও Work বিষয়ক:</strong>
          <ul className="text-slate-300 space-y-0.5">
            <li><span className="text-cyan-300 font-medium">embrace</span> technology <span className="text-slate-500">(প্রযুক্তিকে গ্রহণ করা)</span></li>
            <li><span className="text-cyan-300 font-medium">pose</span> a threat <span className="text-slate-500">(হুমকি সৃষ্টি করা)</span></li>
            <li><span className="text-cyan-300 font-medium">achieve</span> work-life balance <span className="text-slate-500">(কর্ম-জীবনের ভারসাম্য অর্জন করা)</span></li>
            <li><span className="text-cyan-300 font-medium">boost</span> productivity <span className="text-slate-500">(উৎপাদনশীলতা বৃদ্ধি করা)</span></li>
            <li><span className="text-cyan-300 font-medium">create</span> employment opportunities <span className="text-slate-500">(কর্মসংস্থানের সুযোগ তৈরি করা)</span></li>
          </ul>
        </div>
      </div>

      {/* ADJECTIVE + NOUN COLLOCATIONS */}
      <h3 className="text-sm font-bold text-white pt-2">Adjective + Noun Collocations</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr><th className="p-2.5">Collocation</th><th className="p-2.5">অর্থ ও ব্যবহার</th></tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-2.5 text-cyan-300 font-bold">growing concern</td><td className="p-2.5">ক্রমবর্ধমান উদ্বেগ — "There is a growing concern about air quality."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">significant impact</td><td className="p-2.5">উল্লেখযোগ্য প্রভাব — "Technology has a significant impact on education."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">major challenge</td><td className="p-2.5">বড় চ্যালেঞ্জ — "Unemployment is a major challenge for developing nations."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">rapid urbanisation</td><td className="p-2.5">দ্রুত নগরায়ন — "Rapid urbanisation is straining public services."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">widespread poverty</td><td className="p-2.5">ব্যাপক দারিদ্র্য — "Widespread poverty undermines social stability."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">sharp increase</td><td className="p-2.5">তীব্র বৃদ্ধি — "There has been a sharp increase in obesity rates."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">strong evidence</td><td className="p-2.5">শক্তিশালী প্রমাণ — "There is strong evidence linking diet to mental health."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">effective solution</td><td className="p-2.5">কার্যকর সমাধান — "Renewable energy is an effective solution to climate change."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">sustainable development</td><td className="p-2.5">টেকসই উন্নয়ন — "Sustainable development requires balancing growth and conservation."</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">severe consequences</td><td className="p-2.5">গুরুতর পরিণতি — "Inaction will have severe consequences for future generations."</td></tr>
          </tbody>
        </table>
      </div>

      {/* ADVERB + ADJECTIVE COLLOCATIONS */}
      <h3 className="text-sm font-bold text-white pt-2">Adverb + Adjective Collocations (Speaking-এ বিশেষ কার্যকর)</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-center"><span className="text-cyan-300 font-medium">deeply</span> concerned <span className="text-slate-500 block text-[10px]">(গভীরভাবে উদ্বিগ্ন)</span></div>
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-center"><span className="text-cyan-300 font-medium">increasingly</span> important <span className="text-slate-500 block text-[10px]">(ক্রমশ গুরুত্বপূর্ণ)</span></div>
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-center"><span className="text-cyan-300 font-medium">highly</span> beneficial <span className="text-slate-500 block text-[10px]">(অত্যন্ত উপকারী)</span></div>
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-center"><span className="text-cyan-300 font-medium">extremely</span> challenging <span className="text-slate-500 block text-[10px]">(অত্যন্ত চ্যালেঞ্জিং)</span></div>
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-center"><span className="text-cyan-300 font-medium">widely</span> recognised <span className="text-slate-500 block text-[10px]">(ব্যাপকভাবে স্বীকৃত)</span></div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Collocation শেখার সবচেয়ে ভালো উপায় হলো শব্দগুলো আলাদা আলাদাভাবে না শিখে "word pair" হিসেবে শেখা। "Strong argument" মুখস্থ করো, শুধু "strong" বা "argument" আলাদাভাবে নয়।
      </div>
    </section>

    {/* ─── 6.4 PARAPHRASING TECHNIQUES ────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৬.৪ Paraphrasing Techniques — IELTS-এর সবচেয়ে শক্তিশালী দক্ষতা
      </h2>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
        <p>Paraphrasing মানে হলো কোনো বাক্যের অর্থ অক্ষুণ্ণ রেখে ভিন্ন শব্দে বা কাঠামোতে প্রকাশ করা। IELTS Writing Task 2-এর introduction লেখার সময় প্রশ্নের ভাষা হুবহু নকল না করে paraphrase করতে হয়। Reading-এ সঠিক উত্তর খুঁজতেও paraphrasing বোঝার দক্ষতা লাগে।</p>
      </div>

      {/* 4 TECHNIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* TECHNIQUE 1 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Technique 1</span>
            Synonym ব্যবহার
          </h4>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "Many people believe that..."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "A large number of individuals argue that..."</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "This is a serious problem."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "This is a significant issue."</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "Children should learn about..."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Young people should acquire knowledge about..."</div>
          </div>
        </div>

        {/* TECHNIQUE 2 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Technique 2</span>
            Word Form পরিবর্তন (Noun → Verb, Verb → Noun)
          </h4>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "There has been a rise in unemployment."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Unemployment has risen considerably."</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "Technology impacts education."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "The impact of technology on education is profound."</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "The development of renewable energy is crucial."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Developing renewable energy is crucial."</div>
          </div>
        </div>

        {/* TECHNIQUE 3 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Technique 3</span>
            Active Voice → Passive Voice (বা উল্টো)
          </h4>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "Governments should address this issue."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "This issue should be addressed by governments."</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "Scientists have proved that exercise reduces stress."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "It has been proved that exercise reduces stress."</div>
          </div>
        </div>

        {/* TECHNIQUE 4 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Technique 4</span>
            Sentence Structure পরিবর্তন
          </h4>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "Air pollution is increasing and it is dangerous."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "The growing levels of air pollution pose a serious threat to public health."</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
            <div><span className="text-slate-500">Original:</span> "Some people think universities are too expensive."</div>
            <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "There is a widespread view that higher education is financially inaccessible."</div>
          </div>
        </div>
      </div>

      {/* 8 WORKED EXAMPLES */}
      <h3 className="text-sm font-bold text-white pt-2">৮টি Worked Paraphrase Examples</h3>

      {/* EX 1 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 1</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "More and more people are using the internet every day."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Internet usage is increasing at a rapid rate among the general population."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Synonym + word-form change (using → usage)</span></div>
      </div>

      {/* EX 2 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 2</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "Children spend too much time playing video games."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Excessive time devoted to video gaming among young people has become a growing concern."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Synonym (children → young people) + structure change</span></div>
      </div>

      {/* EX 3 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 3</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "Governments should do more to protect the environment."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Greater governmental efforts are required to safeguard the natural environment."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Passive construction + synonyms (protect → safeguard)</span></div>
      </div>

      {/* EX 4 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 4</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "Obesity is a big problem in developed countries."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Obesity has emerged as a significant public health challenge in wealthy nations."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Synonyms (big → significant; developed countries → wealthy nations) + word-form (problem → challenge)</span></div>
      </div>

      {/* EX 5 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 5</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "Many young people cannot find jobs after graduation."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Graduate unemployment is a pressing issue affecting a considerable proportion of young adults."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Nominalisation (restructure as noun phrase) + synonyms</span></div>
      </div>

      {/* EX 6 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 6</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "Technology has changed how people communicate."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Modern technological advances have fundamentally transformed communication among individuals."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Synonyms + adverb addition (fundamentally) + word-form change</span></div>
      </div>

      {/* EX 7 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 7</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "Cars cause air pollution."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "Motor vehicles are a primary contributor to atmospheric pollution."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Synonyms (cars → motor vehicles; cause → contributor; air → atmospheric)</span></div>
      </div>

      {/* EX 8 */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 my-2 text-xs space-y-2">
        <div className="flex items-center gap-2"><span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">Example 8</span></div>
        <div><span className="text-slate-500 font-semibold">Original:</span> "Education is important for economic growth."</div>
        <div><span className="text-emerald-400 font-semibold">Paraphrased:</span> "A well-educated population plays a crucial role in driving economic development."</div>
        <div><span className="text-slate-500 font-semibold">Technique used:</span> <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">Expanded subject + synonyms (important → crucial; growth → development)</span></div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        সবচেয়ে ভালো paraphrase হয় যখন একসাথে ২-৩টি technique মেলানো হয়: synonym + word-form + structure change। শুধু একটি synonym দিয়ে বাকি সব একই রাখলে examiner সেটি real paraphrase হিসেবে গণনা করেন না।
      </div>
    </section>

    {/* ─── 6.5 FORMAL VS INFORMAL VOCABULARY ──────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৬.৫ Formal vs Informal Vocabulary — কোনটি কোথায় ব্যবহার করবে
      </h2>

      {/* FORMALITY MATRIX */}
      <h3 className="text-sm font-bold text-white">মূল নিয়ম</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr><th className="p-2.5">Context</th><th className="p-2.5">Formality Level</th></tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-2.5 font-semibold text-white">Writing Task 2</td><td className="p-2.5 text-emerald-400 font-semibold">Formal — সবসময়</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Writing Task 1 Academic</td><td className="p-2.5 text-emerald-400 font-semibold">Formal — সবসময়</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Writing Task 1 General (Formal letter)</td><td className="p-2.5 text-emerald-400 font-semibold">Formal</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Writing Task 1 General (Informal letter)</td><td className="p-2.5 text-rose-400">Informal allowed</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Speaking Part 1</td><td className="p-2.5 text-slate-300">Semi-formal থেকে informal</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Speaking Parts 2 &amp; 3</td><td className="p-2.5 text-slate-300">Semi-formal</td></tr>
          </tbody>
        </table>
      </div>

      {/* INFORMAL → FORMAL TABLE */}
      <h3 className="text-sm font-bold text-white pt-2">Informal → Formal শব্দ পরিবর্তনের তালিকা</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr><th className="p-2.5">Informal (এড়িয়ে চলো — Writing Task 2-তে)</th><th className="p-2.5">Formal (ব্যবহার করো)</th></tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-2.5 text-rose-400">kids</td><td className="p-2.5 text-emerald-400 font-semibold">children / young people</td></tr>
            <tr><td className="p-2.5 text-rose-400">get</td><td className="p-2.5 text-emerald-400 font-semibold">obtain / receive / acquire</td></tr>
            <tr><td className="p-2.5 text-rose-400">a lot of</td><td className="p-2.5 text-emerald-400 font-semibold">numerous / a significant number of</td></tr>
            <tr><td className="p-2.5 text-rose-400">show</td><td className="p-2.5 text-emerald-400 font-semibold">demonstrate / indicate / reveal</td></tr>
            <tr><td className="p-2.5 text-rose-400">look at</td><td className="p-2.5 text-emerald-400 font-semibold">examine / investigate / analyse</td></tr>
            <tr><td className="p-2.5 text-rose-400">big</td><td className="p-2.5 text-emerald-400 font-semibold">significant / substantial / considerable</td></tr>
            <tr><td className="p-2.5 text-rose-400">bad</td><td className="p-2.5 text-emerald-400 font-semibold">detrimental / harmful / adverse</td></tr>
            <tr><td className="p-2.5 text-rose-400">good</td><td className="p-2.5 text-emerald-400 font-semibold">beneficial / advantageous / positive</td></tr>
            <tr><td className="p-2.5 text-rose-400">start</td><td className="p-2.5 text-emerald-400 font-semibold">initiate / commence / begin</td></tr>
            <tr><td className="p-2.5 text-rose-400">end</td><td className="p-2.5 text-emerald-400 font-semibold">conclude / terminate / cease</td></tr>
            <tr><td className="p-2.5 text-rose-400">use</td><td className="p-2.5 text-emerald-400 font-semibold">utilise / employ / implement</td></tr>
            <tr><td className="p-2.5 text-rose-400">need</td><td className="p-2.5 text-emerald-400 font-semibold">require / necessitate</td></tr>
            <tr><td className="p-2.5 text-rose-400">help</td><td className="p-2.5 text-emerald-400 font-semibold">assist / facilitate / support</td></tr>
            <tr><td className="p-2.5 text-rose-400">make (a change)</td><td className="p-2.5 text-emerald-400 font-semibold">implement / introduce / bring about</td></tr>
            <tr><td className="p-2.5 text-rose-400">think</td><td className="p-2.5 text-emerald-400 font-semibold">believe / consider / argue / maintain</td></tr>
            <tr><td className="p-2.5 text-rose-400">also</td><td className="p-2.5 text-emerald-400 font-semibold">furthermore / moreover / in addition</td></tr>
            <tr><td className="p-2.5 text-rose-400">but</td><td className="p-2.5 text-emerald-400 font-semibold">however / nevertheless / nonetheless</td></tr>
            <tr><td className="p-2.5 text-rose-400">so</td><td className="p-2.5 text-emerald-400 font-semibold">therefore / consequently / as a result</td></tr>
            <tr><td className="p-2.5 text-rose-400">nowadays</td><td className="p-2.5 text-emerald-400 font-semibold">in the contemporary era / at present</td></tr>
            <tr><td className="p-2.5 text-rose-400">a bit</td><td className="p-2.5 text-emerald-400 font-semibold">somewhat / slightly / marginally</td></tr>
          </tbody>
        </table>
      </div>

      {/* SPEAKING INFORMAL USAGE */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs space-y-2">
        <h4 className="text-sm font-bold text-white">Speaking-এ কিছু Informal Word ব্যবহার করা যায়</h4>
        <p className="text-slate-300">Speaking Part 1-এ natural speech-এর মতো কথা বলাই ভালো। সেখানে "kids" বা "get" বলা সমস্যা নয়। তবে Speaking Part 3-এ opinion দেওয়ার সময় একটু formal শব্দ মেশালে Lexical Range বেশি দেখায়।</p>
        <div className="space-y-1">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800"><span className="text-emerald-400">✓</span> Part 1: "I think smartphones are really useful."</div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800"><span className="text-emerald-400">✓</span> Part 3: "I would argue that smartphones have fundamentally transformed the way individuals communicate and access information." <span className="text-slate-500">(Better for Band 7+)</span></div>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Writing Task 2-তে informal শব্দ ব্যবহার করা সরাসরি Lexical Resource score কমায়। "Kids", "a lot of", "big", "good", "bad" — এই শব্দগুলো Task 2 essay থেকে সম্পূর্ণ বাদ দিয়ে দাও।
      </div>
    </section>

    {/* ─── 6.6 WORD FORMATION ─────────────────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        ৬.৬ Word Formation — একটি Root থেকে অনেক শব্দ
      </h2>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
        <p>Word formation মানে হলো একটি মূল শব্দ (root) থেকে suffix বা prefix যোগ করে noun, verb, adjective, adverb তৈরি করা। এই দক্ষতা থাকলে একটি শব্দ জানলে সেই পরিবারের সব শব্দ ব্যবহার করতে পারবে — এতে Lexical Resource-এ "range of vocabulary" অংশে বেশি নম্বর পাবে।</p>
      </div>

      {/* 10 WORD FAMILIES */}
      <h3 className="text-sm font-bold text-white pt-2">১০টি গুরুত্বপূর্ণ Word Family</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr><th className="p-2.5">Root</th><th className="p-2.5">Noun</th><th className="p-2.5">Verb</th><th className="p-2.5">Adjective</th><th className="p-2.5">Adverb</th><th className="p-2.5">Example Sentence</th></tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-2.5 text-cyan-300 font-bold">create</td><td className="p-2.5">creation / creativity</td><td className="p-2.5">create</td><td className="p-2.5">creative</td><td className="p-2.5">creatively</td><td className="p-2.5">She approached the problem creatively.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">analyse</td><td className="p-2.5">analysis / analyst</td><td className="p-2.5">analyse</td><td className="p-2.5">analytical</td><td className="p-2.5">analytically</td><td className="p-2.5">An analytical approach is needed.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">innovate</td><td className="p-2.5">innovation / innovator</td><td className="p-2.5">innovate</td><td className="p-2.5">innovative</td><td className="p-2.5">innovatively</td><td className="p-2.5">The company adopted an innovative strategy.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">sustain</td><td className="p-2.5">sustainability / sustained</td><td className="p-2.5">sustain</td><td className="p-2.5">sustainable</td><td className="p-2.5">sustainably</td><td className="p-2.5">We must develop sustainably.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">pollute</td><td className="p-2.5">pollution / pollutant</td><td className="p-2.5">pollute</td><td className="p-2.5">polluted</td><td className="p-2.5">—</td><td className="p-2.5">Polluted water causes serious illness.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">educate</td><td className="p-2.5">education / educator</td><td className="p-2.5">educate</td><td className="p-2.5">educational / educated</td><td className="p-2.5">educationally</td><td className="p-2.5">The government launched an educational campaign.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">produce</td><td className="p-2.5">production / productivity</td><td className="p-2.5">produce</td><td className="p-2.5">productive</td><td className="p-2.5">productively</td><td className="p-2.5">Employees worked productively from home.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">communicate</td><td className="p-2.5">communication / communicator</td><td className="p-2.5">communicate</td><td className="p-2.5">communicative</td><td className="p-2.5">—</td><td className="p-2.5">Strong communication skills are vital.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">signify</td><td className="p-2.5">significance</td><td className="p-2.5">signify</td><td className="p-2.5">significant</td><td className="p-2.5">significantly</td><td className="p-2.5">Air pollution has significantly worsened.</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">contribute</td><td className="p-2.5">contribution / contributor</td><td className="p-2.5">contribute</td><td className="p-2.5">contributory</td><td className="p-2.5">—</td><td className="p-2.5">Diet is a contributory factor in obesity.</td></tr>
          </tbody>
        </table>
      </div>

      {/* COMMON SUFFIXES */}
      <h3 className="text-sm font-bold text-white pt-2">Common Suffixes — দ্রুত চেনার চার্ট</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr><th className="p-2.5">Suffix</th><th className="p-2.5">Word Form</th><th className="p-2.5">Examples</th></tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-2.5 text-cyan-300 font-bold">-tion / -sion</td><td className="p-2.5">Noun</td><td className="p-2.5">education, pollution, communication, innovation</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-ment</td><td className="p-2.5">Noun</td><td className="p-2.5">employment, achievement, government, development</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-ity / -ty</td><td className="p-2.5">Noun</td><td className="p-2.5">creativity, sustainability, equality, diversity</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-er / -or</td><td className="p-2.5">Noun (person)</td><td className="p-2.5">educator, innovator, contributor, employer</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-ive</td><td className="p-2.5">Adjective</td><td className="p-2.5">creative, productive, effective, innovative</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-al</td><td className="p-2.5">Adjective</td><td className="p-2.5">educational, environmental, analytical, medical</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-ous</td><td className="p-2.5">Adjective</td><td className="p-2.5">dangerous, harmful (via -ful), numerous</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-ly</td><td className="p-2.5">Adverb</td><td className="p-2.5">significantly, creatively, sustainably, productively</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-ise / -ize</td><td className="p-2.5">Verb</td><td className="p-2.5">modernise, globalise, prioritise, utilise</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">-ify</td><td className="p-2.5">Verb</td><td className="p-2.5">identify, clarify, signify, simplify</td></tr>
          </tbody>
        </table>
      </div>

      {/* COMMON PREFIXES */}
      <h3 className="text-sm font-bold text-white pt-2">Common Prefixes — অর্থ পরিবর্তনের কৌশল</h3>
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr><th className="p-2.5">Prefix</th><th className="p-2.5">অর্থ</th><th className="p-2.5">Examples</th></tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-2.5 text-cyan-300 font-bold">un-</td><td className="p-2.5">বিপরীত</td><td className="p-2.5">unemployment, unsustainable, unequal</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">re-</td><td className="p-2.5">আবার</td><td className="p-2.5">renewable, reform, recycle, rethink</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">over-</td><td className="p-2.5">অতিরিক্ত</td><td className="p-2.5">overpopulation, overworked</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">under-</td><td className="p-2.5">কম</td><td className="p-2.5">underfunded, underdeveloped, underemployed</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">mis-</td><td className="p-2.5">ভুল</td><td className="p-2.5">mismanage, misinformation</td></tr>
            <tr><td className="p-2.5 text-cyan-300 font-bold">dis-</td><td className="p-2.5">বিপরীত / নেতিবাচক</td><td className="p-2.5">disadvantage, discrimination, disorder</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg text-sm">
        <strong className="text-white font-bold block mb-1">💡 মূল কথা:</strong>
        Word formation জানলে তুমি একটি শব্দ জেনে সেটির পরিবারের ৪-৫টি form ব্যবহার করতে পারবে। Reading-এ gap-fill questions-এ এটি সরাসরি কাজে লাগে এবং Writing-এ Lexical Resource বাড়ায়।
      </div>
    </section>

    {/* ─── MODULE SUMMARY & ACTION PLAN ───────────────────────────────────────── */}
    <section className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h2>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-100 font-semibold border-b border-slate-700">
            <tr><th className="p-2.5">বিষয়</th><th className="p-2.5">মূল শিক্ষণীয় বিষয়</th></tr>
          </thead>
          <tbody className="divide-y border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
            <tr><td className="p-2.5 font-semibold text-white">AWL (Academic Word List)</td><td className="p-2.5">৫৭০টি word family — IELTS-এর সবচেয়ে মূল্যবান vocabulary resource। Word form সহ শেখো।</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Topic Vocabulary Banks</td><td className="p-2.5">Environment, Education, Health, Technology, Work, Society — এই ৬টি topic থেকে বেশিরভাগ IELTS প্রশ্ন আসে। প্রতিটিতে ১০-১৫টি শক্তিশালী word রাখো।</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Collocations</td><td className="p-2.5">Verb+noun, adjective+noun — এগুলো natural English-এর চাবিকাঠি। "Make progress", "tackle climate change", "significant impact" — এভাবে pair হিসেবে শেখো।</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Paraphrasing</td><td className="p-2.5">Synonym + word-form change + structure change একসাথে ব্যবহার করলে সবচেয়ে ভালো paraphrase হয়। Task 2 introduction-এর জন্য অপরিহার্য।</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Formal vs Informal</td><td className="p-2.5">Writing Task 2-তে সবসময় formal vocabulary। "Kids" → "children", "big" → "significant", "use" → "utilise"।</td></tr>
            <tr><td className="p-2.5 font-semibold text-white">Word Formation</td><td className="p-2.5">Suffix ও prefix শিখলে একটি root থেকে অনেক শব্দ তৈরি করা যায়। Reading gap-fill এবং Writing Lexical Resource-এ সরাসরি সাহায্য করে।</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-sm font-bold text-white pt-2">পরবর্তী পদক্ষেপ</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">১.</span> AWL Notebook তৈরি করো — প্রতিদিন ৫টি করে AWL word, তাদের form এবং একটি example sentence লেখো।</div>
        <div className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">২.</span> Topic Vocabulary Practice — প্রতিটি topic-এর শব্দ দিয়ে ছোট paragraph লেখো।</div>
        <div className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">৩.</span> Paraphrase Drill — প্রতিদিন ৩টি IELTS Task 2 question paraphrase করার অভ্যাস করো।</div>
        <div className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">৪.</span> Formal Swap — তোমার লেখা যেকোনো practice essay-তে informal শব্দ খুঁজে তাদের formal বিকল্প দিয়ে বদলাও।</div>
      </div>

      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 italic text-center">
        <p className="text-slate-300">Grammar / Vocabulary কোনো isolated rule নয় — এগুলো একসাথে কাজ করে। প্রতিদিন একটু করে practice করো, ফলাফল নিজেই আসবে।</p>
      </div>

      {/* CLAIM XP */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>

  </div>
);

const MODULE_07_NOTES = (
  <section className="space-y-8">
    {/* ─── SECTION 1: HERO HEADER ─── */}
    <div className="bg-gradient-to-br from-cyan-950/60 via-cyan-900/30 to-slate-900 border border-cyan-800/40 rounded-2xl p-8 text-center space-y-4">
      <p className="text-3xl">🗣️</p>
      <h2 className="text-2xl font-bold text-cyan-100">Module 7: Pronunciation Training (বাংলায়)</h2>
      <p className="text-sm text-cyan-300/80 max-w-2xl mx-auto">
        IELTS Speaking-এ Band 6.5–8 পেতে হলে শুধু সঠিক grammar বা vocabulary যথেষ্ট নয় — examiner আপনার উচ্চারণও evaluate করেন। এই module-এ আপনি শিখবেন IPA symbols, Bengali speaker-দের সাধারণ ভুল, word stress, intonation, connected speech, এবং নিজে নিজে practice করার উপায়।
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {['IPA Basics', 'Problem Sounds', 'Word Stress', 'Intonation', 'Connected Speech', 'Self-Recording'].map((t) => (
          <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium px-3 py-1 rounded-full">{t}</span>
        ))}
      </div>
    </div>

    {/* ─── SECTION 2: 7.1 IPA BASICS ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        7.1 IPA Basics — আন্তর্জাতিক ধ্বনি বর্ণমালা
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p className="font-bold text-cyan-100">IPA কী এবং কেন দরকার?</p>
        <p>Dictionary খুললে প্রতিটি শব্দের পাশে বন্ধনীতে কিছু অদ্ভুত চিহ্ন দেখা যায় — যেমন "beautiful" শব্দটির পাশে লেখা থাকে <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">/ˈbjuːtɪfəl/</span>। এই চিহ্নগুলোই হলো IPA (International Phonetic Alphabet)। IPA হলো একটি universal system যেখানে প্রতিটি চিহ্ন একটি নির্দিষ্ট sound বোঝায় — বানান যাই হোক না কেন।</p>
        <p>Bengali-তে আমরা বানান পড়েই উচ্চারণ বুঝতে পারি, কিন্তু English-এ বানান আর উচ্চারণ প্রায়ই মেলে না। যেমন — "though", "through", "thought" — তিনটি শব্দের বানানে "ough" আছে, কিন্তু উচ্চারণ তিনটি আলাদা। IPA জানলে dictionary দেখেই যেকোনো শব্দ সঠিকভাবে উচ্চারণ করতে পারবেন।</p>
      </div>

      {/* IPA Quick Reference Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">সবচেয়ে দরকারি IPA Symbols — Quick Reference Chart</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Symbol</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Example Word</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">বাংলায় সাহায্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                ['/iː/', 'sheep, see, meet', 'দীর্ঘ "ই" — বাংলার "ঈ"-এর মতো'],
                ['/ɪ/', 'ship, sit, bit', 'সংক্ষিপ্ত "ই" — বাংলায় নেই'],
                ['/uː/', 'food, blue, too', 'দীর্ঘ "উ"'],
                ['/ʊ/', 'book, foot, put', 'সংক্ষিপ্ত "উ"'],
                ['/e/', 'bed, said, head', '"এ"'],
                ['/æ/', 'cat, bad, man', 'মুখ বেশি খুলে "এ্যা"'],
                ['/ɑː/', 'car, father, bath', 'দীর্ঘ "আ"'],
                ['/ɒ/', 'hot, lot, stop', 'গোল "অ" (British)'],
                ['/ɔː/', 'law, ball, more', 'দীর্ঘ "ও"'],
                ['/ʌ/', 'cup, but, love', 'সংক্ষিপ্ত "আ"'],
                ['/ə/', 'about, teacher, banana', 'schwa — neutral vowel'],
                ['/eɪ/', 'day, name, wait', '"এই" diphthong'],
                ['/aɪ/', 'my, time, high', '"আই" diphthong'],
                ['/ɔɪ/', 'boy, coin, noise', '"অই" diphthong'],
                ['/θ/', 'think, thin, three', 'জিভ দাঁতের ফাঁকে — voiceless'],
                ['/ð/', 'this, the, mother', 'জিভ দাঁতের ফাঁকে — voiced'],
                ['/ʃ/', 'ship, she, wash', '"শ"'],
                ['/ʒ/', 'measure, vision', '"ঝ" (voiced)'],
                ['/tʃ/', 'church, chair', '"চ"'],
                ['/dʒ/', 'judge, job', '"জ"'],
                ['/ŋ/', 'sing, long, think', '"ং"'],
                ['/r/', 'red, right (Am. Eng.)', 'American "র" — curl করা জিভ'],
                ['/w/', 'wet, water, wine', 'ঠোঁট গোল করা "উ"'],
                ['/v/', 'very, vine, love', 'নিচের ঠোঁট দাঁতে লাগানো'],
              ].map(([sym, ex, bn]) => (
                <tr key={sym}>
                  <td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{sym}</span></td>
                  <td className="py-2 px-3 text-slate-300 italic">{ex}</td>
                  <td className="py-2 px-3 text-slate-400">{bn}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-600">
                <td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">ˈˈ</span></td>
                <td className="py-2 px-3 text-slate-300 italic">pho·to</td>
                <td className="py-2 px-3 text-slate-400">primary stress চিহ্ন</td>
              </tr>
              <tr>
                <td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">ˌˌ</span></td>
                <td className="py-2 px-3 text-slate-300 italic">pho·toˈgra·phy</td>
                <td className="py-2 px-3 text-slate-400">secondary stress চিহ্ন</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> IPA সম্পূর্ণ মুখস্থ করার দরকার নেই। Dictionary ব্যবহার করতে পারলেই যথেষ্ট। সবচেয়ে গুরুত্বপূর্ণ symbols হলো <span className="font-mono text-cyan-300">/θ/, /ð/, /v/, /w/, /ə/, /ɪ/</span> এবং <span className="font-mono text-cyan-300">/iː/</span> — এগুলো Bengali speaker-দের জন্য সবচেয়ে কঠিন।</p>
      </div>
    </section>

    {/* ─── SECTION 3: 7.2 PROBLEM SOUNDS ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        7.2 Bengali Speaker-দের Problem Sounds
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>Bengali-তে অনেক sound নেই যেগুলো English-এ আছে। ফলে আমরা অজান্তে কাছাকাছি বাংলা sound দিয়ে সেগুলো replace করি। এই অংশে সেই সমস্যাগুলো চিহ্নিত করে সমাধান দেওয়া হয়েছে।</p>
      </div>

      {/* Problem 1: /v/ vs /w/ */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">সমস্যা ১: <span className="font-mono text-cyan-300">/v/</span> বনাম <span className="font-mono text-cyan-300">/w/</span></h4>
        <p className="text-xs text-slate-400">Bengali-তে <span className="font-mono text-cyan-300">/v/</span> বা <span className="font-mono text-cyan-300">/w/</span> — কোনোটিই আলাদাভাবে নেই। আমরা সাধারণত দুটোকেই "ভ" বা "ব" দিয়ে বলি। কিন্তু English-এ এরা দুটি সম্পূর্ণ আলাদা sound।</p>
        <div className="bg-slate-950/80 border-l-4 border-cyan-500 p-3 my-2 text-xs text-slate-200 space-y-1">
          <p className="font-bold text-cyan-100">উচ্চারণ পদ্ধতি:</p>
          <p><span className="font-mono text-cyan-300">/v/</span> — নিচের ঠোঁটের ভেতরের অংশ উপরের দাঁতে হালকা লাগান, তারপর বাতাস বের করুন। দাঁত আর ঠোঁটের ঘর্ষণে sound তৈরি হয়।</p>
          <p><span className="font-mono text-cyan-300">/w/</span> — দুটো ঠোঁট গোল করে সামনে আনুন (যেন "উ" বলছেন), তারপর বাতাস বের করুন। দাঁত ব্যবহার হয় না।</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/v/</span></th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/w/</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">vet</td><td className="py-2 px-3 text-slate-300">wet</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">vine</td><td className="py-2 px-3 text-slate-300">wine</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">veil</td><td className="py-2 px-3 text-slate-300">whale</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">very</td><td className="py-2 px-3 text-slate-300">wary</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">vale</td><td className="py-2 px-3 text-slate-300">whale</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem 2: /θ/ vs /t/ */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">সমস্যা ২: <span className="font-mono text-cyan-300">/θ/</span> বনাম <span className="font-mono text-cyan-300">/t/</span> (voiceless TH)</h4>
        <p className="text-xs text-slate-400">"think", "three", "thin" — এই শব্দে <span className="font-mono text-cyan-300">/θ/</span> আছে। Bengali speaker-রা প্রায়ই এটাকে <span className="font-mono text-cyan-300">/t/</span> বলেন।</p>
        <div className="bg-slate-950/80 border-l-4 border-cyan-500 p-3 my-2 text-xs text-slate-200">
          <p className="font-bold text-cyan-100">উচ্চারণ পদ্ধতি:</p>
          <p>জিভের ডগা উপরের দাঁত আর নিচের দাঁতের ফাঁকে রাখুন (দাঁতের ঠিক পেছনে নয়, ফাঁকে)। তারপর আস্তে বাতাস ছাড়ুন। গলার কোনো কম্পন থাকবে না।</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/θ/</span></th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/t/</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">thin</td><td className="py-2 px-3 text-slate-300">tin</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">think</td><td className="py-2 px-3 text-slate-300">tink</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">three</td><td className="py-2 px-3 text-slate-300">tree</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">thank</td><td className="py-2 px-3 text-slate-300">tank</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">thumb</td><td className="py-2 px-3 text-slate-300">tum</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem 3: /ð/ vs /d/ */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">সমস্যা ৩: <span className="font-mono text-cyan-300">/ð/</span> বনাম <span className="font-mono text-cyan-300">/d/</span> (voiced TH)</h4>
        <p className="text-xs text-slate-400">"the", "this", "mother", "breathe" — এই শব্দে <span className="font-mono text-cyan-300">/ð/</span> আছে। এটাকে আমরা প্রায়ই <span className="font-mono text-cyan-300">/d/</span> বলি।</p>
        <div className="bg-slate-950/80 border-l-4 border-cyan-500 p-3 my-2 text-xs text-slate-200">
          <p className="font-bold text-cyan-100">উচ্চারণ পদ্ধতি:</p>
          <p><span className="font-mono text-cyan-300">/θ/</span>-এর মতোই জিভের অবস্থান, কিন্তু এবার গলায় কম্পন থাকবে। গলায় হাত রাখলে vibration অনুভব করবেন।</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/ð/</span></th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/d/</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">this</td><td className="py-2 px-3 text-slate-300">dis</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">they</td><td className="py-2 px-3 text-slate-300">day</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">then</td><td className="py-2 px-3 text-slate-300">den</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">breathe</td><td className="py-2 px-3 text-slate-300">breed</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">there</td><td className="py-2 px-3 text-slate-300">dare</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem 4: /ɪ/ vs /iː/ */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">সমস্যা ৪: <span className="font-mono text-cyan-300">/ɪ/</span> (short i) বনাম <span className="font-mono text-cyan-300">/iː/</span> (long ee)</h4>
        <p className="text-xs text-slate-400">এটা Bengali speaker-দের সবচেয়ে বড় ভুলগুলোর একটি। "ship" আর "sheep" — একই শব্দ মনে হয়, কিন্তু meaning সম্পূর্ণ আলাদা!</p>
        <div className="bg-slate-950/80 border-l-4 border-cyan-500 p-3 my-2 text-xs text-slate-200 space-y-1">
          <p className="font-bold text-cyan-100">উচ্চারণ পদ্ধতি:</p>
          <p><span className="font-mono text-cyan-300">/iː/</span> — দাঁত প্রায় বন্ধ, ঠোঁট টেনে প্রশস্ত করুন, দীর্ঘ সময় ধরে বলুন</p>
          <p><span className="font-mono text-cyan-300">/ɪ/</span> — মুখ একটু শিথিল, ছোট করে বলুন, ঠোঁটে কম টান</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/ɪ/</span></th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold"><span className="font-mono">/iː/</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">ship</td><td className="py-2 px-3 text-slate-300">sheep</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">sit</td><td className="py-2 px-3 text-slate-300">seat</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">bit</td><td className="py-2 px-3 text-slate-300">beat</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">fill</td><td className="py-2 px-3 text-slate-300">feel</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">live (verb)</td><td className="py-2 px-3 text-slate-300">leave</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem 5: Schwa */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">সমস্যা ৫: Schwa <span className="font-mono text-cyan-300">/ə/</span></h4>
        <p className="text-xs text-slate-400">Schwa হলো English-এর সবচেয়ে বেশি ব্যবহৃত vowel sound — কিন্তু এটা Bengali-তে নেই। Unstressed syllable-গুলোতে প্রায় সবসময় schwa ব্যবহার হয়। মুখ relaxed রেখে, কোনো effort ছাড়াই, "আ"-এর মতো neutral একটি sound বের করুন।</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-300">about</p>
            <p className="font-mono text-cyan-300">/əˈbaʊt/</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-300">teacher</p>
            <p className="font-mono text-cyan-300">/ˈtiːtʃər/</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-300">banana</p>
            <p className="font-mono text-cyan-300">/bəˈnɑːnə/</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-300">problem</p>
            <p className="font-mono text-cyan-300">/ˈprɒbləm/</p>
          </div>
        </div>
        <p className="text-xs text-slate-400"><span className="text-cyan-300 font-medium">লক্ষ্য করুন:</span> stressed না হলে প্রায় সব vowel-ই <span className="font-mono text-cyan-300">/ə/</span> হয়ে যায়।</p>
      </div>

      {/* Problem 6: /r/ */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">সমস্যা ৬: <span className="font-mono text-cyan-300">/r/</span> উচ্চারণ</h4>
        <p className="text-xs text-slate-400">British English-এ শব্দের শেষে <span className="font-mono text-cyan-300">/r/</span> প্রায় silent (non-rhotic), কিন্তু American English-এ সবসময় উচ্চারণ হয় (rhotic)। IELTS-এ দুটোই গ্রহণযোগ্য, তবে consistent থাকতে হবে।</p>
        <div className="bg-slate-950/80 border-l-4 border-cyan-500 p-3 my-2 text-xs text-slate-200">
          <p><span className="text-cyan-300 font-medium">American <span className="font-mono text-cyan-300">/r/</span>:</span> জিভ কুঁচকে পেছনে নিয়ে যান, কোথাও স্পর্শ না করে।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-slate-400 font-bold">American:</p>
            <p className="text-slate-300">"car" <span className="font-mono text-cyan-300">/kɑːr/</span></p>
            <p className="text-slate-300">"water" <span className="font-mono text-cyan-300">/ˈwɔːtər/</span></p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-slate-400 font-bold">British:</p>
            <p className="text-slate-300">"car" <span className="font-mono text-cyan-300">/kɑː/</span></p>
            <p className="text-slate-300">"water" <span className="font-mono text-cyan-300">/ˈwɔːtə/</span></p>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> প্রতিটি problem sound আলাদা করে ১৫ মিনিট করে practice করুন। Minimal pairs জোরে জোরে বলুন এবং নিজেকে record করুন। একটি sound ঠিক না হওয়া পর্যন্ত পরবর্তীতে যাবেন না।</p>
      </div>
    </section>

    {/* ─── SECTION 4: 7.3 WORD STRESS & SENTENCE STRESS ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        7.3 Word Stress ও Sentence Stress
      </h3>

      {/* Word Stress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Word Stress — কোন syllable-এ জোর?</h4>
        <p className="text-xs text-slate-400">English-এ প্রতিটি multi-syllable শব্দে একটি syllable অন্যগুলোর চেয়ে জোরে, দীর্ঘ এবং উঁচু pitch-এ বলা হয় — এটাই word stress। ভুল syllable-এ stress দিলে native speaker বুঝতে পারবেন না।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <p className="text-amber-300/70 font-bold">উদাহরণ (PHO-to-graph shift):</p>
          <p className="text-slate-300"><span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">PHO</span>-to-graph (noun) — প্রথম syllable stressed</p>
          <p className="text-slate-300">pho-<span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">TO</span>-gra-phy — দ্বিতীয় syllable stressed</p>
          <p className="text-slate-300">pho-to-<span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">GRAPH</span>-ic — তৃতীয় syllable stressed</p>
        </div>
      </div>

      {/* Stress Shift Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Stress Shift — Word Family-তে Stress বদলায়</h4>
        <p className="text-xs text-slate-400">একই root থেকে তৈরি শব্দে stress বদলে যায়। এই ৫টি word family মুখস্থ করুন:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Noun</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Verb</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Adjective</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Adverb</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2 px-3 text-slate-300"><span className="font-bold text-amber-300">PHO</span>-to-graph</td>
                <td className="py-2 px-3 text-slate-300">pho-<span className="font-bold text-amber-300">TO</span>-graph (rare)</td>
                <td className="py-2 px-3 text-slate-300">pho-to-<span className="font-bold text-amber-300">GRAPH</span>-ic</td>
                <td className="py-2 px-3 text-slate-300">pho-to-<span className="font-bold text-amber-300">GRAPH</span>-ic-ally</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-300"><span className="font-bold text-amber-300">E</span>-CON-o-my</td>
                <td className="py-2 px-3 text-slate-300">—</td>
                <td className="py-2 px-3 text-slate-300">ec-o-<span className="font-bold text-amber-300">NOM</span>-ice</td>
                <td className="py-2 px-3 text-slate-300">ec-o-<span className="font-bold text-amber-300">NOM</span>-ic-ally</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-300"><span className="font-bold text-amber-300">PO</span>-li-tics</td>
                <td className="py-2 px-3 text-slate-300">—</td>
                <td className="py-2 px-3 text-slate-300">po-<span className="font-bold text-amber-300">LIT</span>-ic-al</td>
                <td className="py-2 px-3 text-slate-300">po-<span className="font-bold text-amber-300">LIT</span>-ic-ally</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-300"><span className="font-bold text-amber-300">PRE</span>-sent (gift)</td>
                <td className="py-2 px-3 text-slate-300">pre-<span className="font-bold text-amber-300">SENT</span> (offer)</td>
                <td className="py-2 px-3 text-slate-300">—</td>
                <td className="py-2 px-3 text-slate-300">—</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-300"><span className="font-bold text-amber-300">RE</span>-cord (noun)</td>
                <td className="py-2 px-3 text-slate-300">re-<span className="font-bold text-amber-300">CORD</span> (verb)</td>
                <td className="py-2 px-3 text-slate-300">—</td>
                <td className="py-2 px-3 text-slate-300">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400"><span className="text-cyan-300 font-medium">লক্ষ্য করুন:</span> noun-এ stress প্রায়ই প্রথম syllable-এ, verb-এ দ্বিতীয় syllable-এ।</p>
      </div>

      {/* Additional Noun/Verb Pairs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">আরও কিছু গুরুত্বপূর্ণ উদাহরণ</h4>
        <div className="space-y-1.5 text-xs">
          <p className="text-slate-300"><span className="font-bold text-amber-300">AD</span>vert (noun) → ad<span className="font-bold text-amber-300">VERT</span>ise (verb) → adver<span className="font-bold text-amber-300">TISE</span>ment (noun)</p>
          <p className="text-slate-300"><span className="font-bold text-amber-300">PHO</span>tograph → pho<span className="font-bold text-amber-300">TO</span>graphy → photo<span className="font-bold text-amber-300">GRAPH</span>ic</p>
          <p className="text-slate-300"><span className="font-bold text-amber-300">PER</span>mit (noun) → per<span className="font-bold text-amber-300">MIT</span> (verb)</p>
          <p className="text-slate-300"><span className="font-bold text-amber-300">OB</span>ject (noun) → ob<span className="font-bold text-amber-300">JECT</span> (verb)</p>
          <p className="text-slate-300"><span className="font-bold text-amber-300">IN</span>crease (noun) → in<span className="font-bold text-amber-300">CREASE</span> (verb)</p>
        </div>
      </div>

      {/* Sentence Stress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Sentence Stress — কোন শব্দে জোর?</h4>
        <p className="text-xs text-slate-400">English-এ সব শব্দ সমান জোরে বলা হয় না। Content words (যেগুলো মূল অর্থ বহন করে) stressed হয়, আর function words (যেগুলো grammatical structure তৈরি করে) unstressed হয়।</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Content Words */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-emerald-300">Content words (stressed)</h5>
            <div className="space-y-1 text-xs">
              <p><span className="text-emerald-300 font-bold">Nouns</span> — book, teacher, problem</p>
              <p><span className="text-emerald-300 font-bold">Main verbs</span> — run, speak, understand</p>
              <p><span className="text-emerald-300 font-bold">Adjectives</span> — beautiful, difficult</p>
              <p><span className="text-emerald-300 font-bold">Adverbs</span> — quickly, very, always</p>
              <p><span className="text-emerald-300 font-bold">Question words</span> — what, where, why</p>
            </div>
          </div>

          {/* Function Words */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-rose-300">Function words (unstressed)</h5>
            <div className="space-y-1 text-xs">
              <p><span className="text-rose-300 font-bold">Articles</span> — a <span className="font-mono text-cyan-300">/ə/</span>, the <span className="font-mono text-cyan-300">/ðə/</span></p>
              <p><span className="text-rose-300 font-bold">Prepositions</span> — at, in, on, for <span className="font-mono text-cyan-300">/fər/</span></p>
              <p><span className="text-rose-300 font-bold">Conjunctions</span> — and <span className="font-mono text-cyan-300">/ənd/</span>, but, or</p>
              <p><span className="text-rose-300 font-bold">Auxiliaries</span> — am, is, are, was, have <span className="font-mono text-cyan-300">/həv/</span></p>
              <p><span className="text-rose-300 font-bold">Pronouns</span> — he <span className="font-mono text-cyan-300">/hɪ/</span>, she <span className="font-mono text-cyan-300">/ʃɪ/</span>, them <span className="font-mono text-cyan-300">/ðəm/</span></p>
            </div>
          </div>
        </div>

        {/* Stressed Example */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-300">
            "I <span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">WANT</span> to <span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">GO</span> to the <span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">SHOPS</span> and <span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">BUY</span> some <span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">BREAD</span> and <span className="font-bold text-amber-300 text-base rounded px-1 bg-amber-500/10 border border-amber-500/20">MILK</span>."
          </p>
          <p className="text-xs text-slate-500 mt-2">want, go, shops, buy, bread, milk — content words গুলো stressed। "to", "the", "and", "some" — function words গুলো দ্রুত ও হালকাভাবে বলা হয়।</p>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Sentence-এর ছন্দ (rhythm) তৈরি হয় content আর function words-এর এই পার্থক্য থেকে। সব শব্দে সমান জোর দিলে বাংলার মতো accent শোনাবে এবং natural flow নষ্ট হয়।</p>
      </div>
    </section>

    {/* ─── SECTION 5: 7.4 INTONATION PATTERNS ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        7.4 Intonation Patterns
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>Intonation হলো কথা বলার সময় voice-এর pitch-এর ওঠানামা। একই কথা আলাদা intonation-এ বললে meaning বদলে যায়।</p>
      </div>

      {/* 3 Intonation Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Falling */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-lg font-bold px-3 py-1 rounded-full">↘</span>
            <h4 className="text-xs font-bold text-cyan-100">Falling Intonation</h4>
          </div>
          <p className="text-xs text-slate-400">Statements ও Wh- questions-এ</p>
          <div className="space-y-1 text-xs text-slate-300">
            <p>"I'm studying for IELTS. <span className="text-cyan-300 font-bold">↘</span>"</p>
            <p>"She lives in DHAKA. <span className="text-cyan-300 font-bold">↘</span>"</p>
            <p>"Where are you FROM? <span className="text-cyan-300 font-bold">↘</span>"</p>
          </div>
        </div>

        {/* Rising */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-lg font-bold px-3 py-1 rounded-full">↗</span>
            <h4 className="text-xs font-bold text-cyan-100">Rising Intonation</h4>
          </div>
          <p className="text-xs text-slate-400">Yes/No questions-এ</p>
          <div className="space-y-1 text-xs text-slate-300">
            <p>"Are you ready? <span className="text-amber-300 font-bold">↗</span>"</p>
            <p>"Did you finish your homework? <span className="text-amber-300 font-bold">↗</span>"</p>
            <p>"Can I help you? <span className="text-amber-300 font-bold">↗</span>"</p>
          </div>
        </div>

        {/* List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-lg font-bold px-3 py-1 rounded-full">↗↗↘</span>
            <h4 className="text-xs font-bold text-cyan-100">List Intonation</h4>
          </div>
          <p className="text-xs text-slate-400">তালিকা বলার সময় — প্রতিটি item-এ ওঠে, শেষে নামে।</p>
          <div className="text-xs text-slate-300">
            <p>"I like reading <span className="text-purple-300 font-bold">↗</span>, writing <span className="text-purple-300 font-bold">↗</span>, and listening to music <span className="text-cyan-300 font-bold">↘</span>."</p>
          </div>
        </div>
      </div>

      {/* Dialog Cards */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-cyan-100">তিনটি সংক্ষিপ্ত Dialog</h4>

        {/* Dialog 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <p className="text-xs font-bold text-cyan-100">Dialog ১ — Falling vs Rising</p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-slate-300">A: "Do you speak English? <span className="text-amber-300 font-bold">↗</span>"</p>
            <p className="text-slate-300">B: "Yes, I do. <span className="text-cyan-300 font-bold">↘</span>"</p>
            <p className="text-slate-300">A: "Where did you learn it? <span className="text-amber-300 font-bold">↗</span>"</p>
            <p className="text-slate-300">B: "At school in Dhaka. <span className="text-cyan-300 font-bold">↘</span>"</p>
          </div>
        </div>

        {/* Dialog 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <p className="text-xs font-bold text-cyan-100">Dialog ২ — List Intonation</p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-slate-300">A: "What do you do in your free time?"</p>
            <p className="text-slate-300">B: "I enjoy cooking <span className="text-purple-300 font-bold">↗</span>, reading <span className="text-purple-300 font-bold">↗</span>, watching films <span className="text-purple-300 font-bold">↗</span>, and sometimes I go cycling. <span className="text-cyan-300 font-bold">↘</span>"</p>
          </div>
        </div>

        {/* Dialog 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <p className="text-xs font-bold text-cyan-100">Dialog ৩ — Fall-Rise (uncertainty বা politeness)</p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-slate-300">A: "Can you come to the meeting tomorrow?"</p>
            <p className="text-slate-300">B: "Well... I might be able to <span className="text-cyan-300 font-bold">↘↗</span>... but I'm not sure yet. <span className="text-cyan-300 font-bold">↘</span>"</p>
            <p className="text-slate-500 text-xs mt-1">(Fall-rise মানে "আমি রাজি, কিন্তু পুরোপুরি নিশ্চিত নই" — IELTS Part 3-এ এই intonation ব্যবহার করলে sophisticated শোনায়।)</p>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> IELTS Speaking-এ monotone (flat pitch) কথা বললে Pronunciation score কমে। প্রতিটি answer-এ intentionally intonation vary করার চেষ্টা করুন — statement-এ নামুন, yes/no question-এ উঠুন, list-এ উঠতে উঠতে শেষে নামুন।</p>
      </div>
    </section>

    {/* ─── SECTION 6: 7.5 CONNECTED SPEECH ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        7.5 Connected Speech ও Linking
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>Native speaker-রা কখনো প্রতিটি শব্দ আলাদা করে বলেন না। শব্দগুলো একসাথে জুড়ে যায়, কিছু sound বাদ পড়ে, কিছু বদলে যায়। এই phenomenon-কে বলে connected speech।</p>
      </div>

      {/* 1. CV Linking */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">১. Consonant-Vowel Linking</h4>
        <p className="text-xs text-slate-400">যখন একটি শব্দ consonant-এ শেষ হয় এবং পরের শব্দ vowel-এ শুরু হয়, তখন consonant পরের শব্দের সাথে জুড়ে যায়।</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Written Form</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Linked Pronunciation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">an apple</td><td className="py-2 px-3 font-mono text-cyan-300">/ənˈæpəl/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">pick it up</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈpɪkɪtʌp/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">not at all</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈnɒtətˈɔːl/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">come on in</td><td className="py-2 px-3 font-mono text-cyan-300">/kʌmɒnˈɪn/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">turn it off</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈtɜːnɪtˈɒf/</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Elision */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">২. Elision — Sound বাদ পড়া</h4>
        <p className="text-xs text-slate-400">স্বাভাবিক কথায় কিছু sound উচ্চারণ করা হয় না, বিশেষত <span className="font-mono text-cyan-300">/t/</span> এবং <span className="font-mono text-cyan-300">/d/</span>।</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Written Form</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Natural Speech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">what do you</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈwɒdʒə/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">last night</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈlɑːs naɪt/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">most people</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈməʊs piːpəl/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">old man</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈəʊl mæn/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">next day</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈneks deɪ/</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Assimilation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">৩. Assimilation — Sound বদলে যাওয়া</h4>
        <p className="text-xs text-slate-400">একটি sound পাশের sound-এর প্রভাবে বদলে যায়।</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Written Form</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Assimilated Form</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">কেন?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">that car</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈðæk kɑː/</td><td className="py-2 px-3 text-slate-400"><span className="font-mono text-cyan-300">/t/</span> → <span className="font-mono text-cyan-300">/k/</span> before <span className="font-mono text-cyan-300">/k/</span></td></tr>
              <tr><td className="py-2 px-3 text-slate-300">good boy</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈgʊb bɔɪ/</td><td className="py-2 px-3 text-slate-400"><span className="font-mono text-cyan-300">/d/</span> → <span className="font-mono text-cyan-300">/b/</span> before <span className="font-mono text-cyan-300">/b/</span></td></tr>
              <tr><td className="py-2 px-3 text-slate-300">ten minutes</td><td className="py-2 px-3 font-mono text-cyan-300">/ˈtem mɪnɪts/</td><td className="py-2 px-3 text-slate-400"><span className="font-mono text-cyan-300">/n/</span> → <span className="font-mono text-cyan-300">/m/</span> before <span className="font-mono text-cyan-300">/m/</span></td></tr>
              <tr><td className="py-2 px-3 text-slate-300">in person</td><td className="py-2 px-3 font-mono text-cyan-300">/ɪm ˈpɜːsən/</td><td className="py-2 px-3 text-slate-400"><span className="font-mono text-cyan-300">/n/</span> → <span className="font-mono text-cyan-300">/m/</span> before <span className="font-mono text-cyan-300">/p/</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Weak Forms */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">৪. Weak Forms</h4>
        <p className="text-xs text-slate-400">Function words-এর vowel প্রায়ই schwa <span className="font-mono text-cyan-300">/ə/</span> হয়ে যায় স্বাভাবিক কথায়।</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Written</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Strong Form</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Weak Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">and</td><td className="py-2 px-3 font-mono text-cyan-300">/ænd/</td><td className="py-2 px-3 font-mono text-cyan-300">/ənd/ বা /ən/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">for</td><td className="py-2 px-3 font-mono text-cyan-300">/fɔː/</td><td className="py-2 px-3 font-mono text-cyan-300">/fər/ বা /fə/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">to</td><td className="py-2 px-3 font-mono text-cyan-300">/tuː/</td><td className="py-2 px-3 font-mono text-cyan-300">/tə/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">can</td><td className="py-2 px-3 font-mono text-cyan-300">/kæn/</td><td className="py-2 px-3 font-mono text-cyan-300">/kən/</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">have</td><td className="py-2 px-3 font-mono text-cyan-300">/hæv/</td><td className="py-2 px-3 font-mono text-cyan-300">/həv/ বা /əv/</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Connected speech শুনতে পারলেই আপনার listening score-ও বাড়বে। শুধু speaking-এ নয়, IELTS Listening-এ native speaker-রা এভাবেই কথা বলেন। Shadowing practice করলে দুটো skill একসাথে উন্নত হয়।</p>
      </div>
    </section>

    {/* ─── SECTION 7: 7.6 SELF-RECORDING ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        7.6 Self-Recording ও Feedback Techniques
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
        <p>নিজের উচ্চারণ উন্নত করার সবচেয়ে কার্যকর উপায় হলো নিজেকে record করে শোনা। কারণ কথা বলার সময় আমরা নিজের ভুল বুঝতে পারি না — কিন্তু recording শুনলে বুঝি।</p>
      </div>

      {/* Apps & Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ELSA Speak */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-cyan-100">১. ELSA Speak (AI Pronunciation Coach)</h4>
          <div className="text-xs text-slate-400 space-y-1">
            <p><span className="text-slate-300 font-bold">Platform:</span> iOS, Android (free ও premium)</p>
            <p><span className="text-slate-300 font-bold">কীভাবে কাজ করে:</span> আপনি একটি sentence বলুন, AI phoneme-by-phoneme feedback দেবে — কোন sound ভুল, কোথায় stress-এর সমস্যা।</p>
            <p>Bengali speaker-দের জন্য বিশেষ উপকারী কারণ এটি <span className="font-mono text-cyan-300">/θ/, /v/, /ɪ/</span> সমস্যা specifically চিহ্নিত করতে পারে।</p>
            <p>IELTS-focused exercises আছে।</p>
          </div>
        </div>

        {/* BoldVoice */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-cyan-100">২. BoldVoice (Human Coach + AI Feedback)</h4>
          <div className="text-xs text-slate-400 space-y-1">
            <p><span className="text-slate-300 font-bold">Platform:</span> iOS (free trial, তারপর subscription)</p>
            <p>Hollywood accent coach-দের তৈরি video lesson + AI speech recognition feedback।</p>
            <p>ELSA-র চেয়ে rhythm আর intonation-এ বেশি focus করে।</p>
          </div>
        </div>

        {/* ChatGPT Voice */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-cyan-100">৩. ChatGPT Voice Mode / Google Gemini Live</h4>
          <div className="text-xs text-slate-400 space-y-1">
            <p>সম্পূর্ণ বিনামূল্যে।</p>
            <p>Speaking practice partner হিসেবে ব্যবহার করুন। IELTS-এর মতো topic-এ কথা বলুন, তারপর AI-কে জিজ্ঞেস করুন আপনার response কেমন ছিল।</p>
            <p className="text-amber-300/70">Limitation: pronunciation-specific phoneme-level feedback দিতে পারে না।</p>
          </div>
        </div>

        {/* Voice Memos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-cyan-100">৪. Voice Memos + Reference Recording</h4>
          <div className="text-xs text-slate-400 space-y-1">
            <p>সম্পূর্ণ বিনামূল্যে — phone-এর built-in voice recorder ব্যবহার করুন।</p>
            <div className="space-y-1 mt-2">
              <p><span className="text-cyan-300 font-bold">ধাপ ১:</span> BBC Learning English বা Rachel's English থেকে একটি ছোট passage শুনুন।</p>
              <p><span className="text-cyan-300 font-bold">ধাপ ২:</span> ঐ passage নিজে পড়ুন এবং record করুন।</p>
              <p><span className="text-cyan-300 font-bold">ধাপ ৩:</span> দুটো recording পাশাপাশি শুনুন। পার্থক্য note করুন।</p>
              <p><span className="text-cyan-300 font-bold">ধাপ ৪:</span> পার্থক্য পাওয়া শব্দগুলো আলাদা করে আরও ১০ বার practice করুন, আবার record করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shadowing Routine */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Shadowing Technique — সবচেয়ে কার্যকর পদ্ধতি</h4>
        <p className="text-xs text-slate-400">Shadowing মানে হলো কোনো native speaker-এর সাথে সাথে (বা ঠিক পরে পরে) তাদের মতো করে বলার চেষ্টা করা।</p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-2">
          <p className="font-bold text-cyan-100">Daily Routine (১৫ মিনিট):</p>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">১</span>
              <p className="text-slate-300">একটি YouTube video (BBC Learning English বা Rachel's English) থেকে ৩০-৬০ সেকেন্ডের একটি clip বেছে নিন।</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">২</span>
              <p className="text-slate-300">প্রথমবার শুনুন, মনে মনে meaning বুঝুন।</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">৩</span>
              <p className="text-slate-300">দ্বিতীয়বার — pause করে করে প্রতিটি phrase শুনুন, তারপর ঠিক একইভাবে বলুন।</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">৪</span>
              <p className="text-slate-300">তৃতীয়বার — video চালিয়ে রাখুন, speaker-এর সাথে সাথে বলার চেষ্টা করুন। নিজেও record করুন।</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">৫</span>
              <p className="text-slate-300">Record করা audio ও original-এর তুলনা করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Checklist */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-bold text-emerald-100">নিজের Error চেনার উপায়</h4>
        <p className="text-xs text-slate-400">Recording শোনার সময় এই checklist দিয়ে যাচাই করুন:</p>
        <div className="space-y-2">
          {[
            '<span className="font-mono text-cyan-300">/θ/</span> বলার সময় জিভ কি দাঁতের ফাঁকে যাচ্ছে, নাকি <span className="font-mono text-cyan-300">/t/</span> বলছি?',
            '<span className="font-mono text-cyan-300">/v/</span> বলার সময় কি নিচের ঠোঁট দাঁতে লাগছে?',
            '"sheep" আর "ship" কি আলাদা শোনাচ্ছে?',
            'Function words (the, a, and, for) কি দ্রুত ও হালকা বলছি, নাকি stressed?',
            'Statement-এর শেষে কি voice নামছে?',
            'Yes/no question-এর শেষে কি voice উঠছে?',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-emerald-400 text-base">✓</span>
              <p dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> প্রতিদিন মাত্র ১৫ মিনিট shadowing practice করলে ৩ সপ্তাহে উল্লেখযোগ্য উন্নতি সম্ভব। App-এর চেয়ে বড় tool হলো আপনার নিজের কান — recording শুনতে শুনতে নিজেই বুঝতে পারবেন কোথায় সমস্যা।</p>
      </div>
    </section>

    {/* ─── SECTION 8: MODULE SUMMARY ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">বিষয়</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">মূল শিক্ষা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">IPA Basics</td><td className="py-2 px-3 text-slate-300">Dictionary দেখে যেকোনো শব্দ সঠিকভাবে উচ্চারণ করতে পারবেন। সবচেয়ে গুরুত্বপূর্ণ symbols: <span className="font-mono text-cyan-300">/θ/, /ð/, /v/, /w/, /ə/, /ɪ/, /iː/</span></td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Problem Sounds</td><td className="py-2 px-3 text-slate-300"><span className="font-mono text-cyan-300">/v/</span> vs <span className="font-mono text-cyan-300">/w/</span>, <span className="font-mono text-cyan-300">/θ/</span> vs <span className="font-mono text-cyan-300">/t/</span>, <span className="font-mono text-cyan-300">/ð/</span> vs <span className="font-mono text-cyan-300">/d/</span>, <span className="font-mono text-cyan-300">/ɪ/</span> vs <span className="font-mono text-cyan-300">/iː/</span> — এই pairs-গুলো Bengali speaker-দের সবচেয়ে বড় চ্যালেঞ্জ। Minimal pair practice করুন।</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Word Stress</td><td className="py-2 px-3 text-slate-300">Multi-syllable শব্দে একটি syllable-এ stress। Word family-তে stress বদলায় (<span className="font-mono text-cyan-300">PHOtograph → phoTOgraphy</span>)। Noun/verb পেয়ারে stress আলাদা (<span className="font-mono text-cyan-300">REcord/reCORD</span>)।</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Sentence Stress</td><td className="py-2 px-3 text-slate-300">Content words stressed, function words unstressed/schwa। সব শব্দে সমান জোর দিলে unnatural শোনায়।</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Intonation</td><td className="py-2 px-3 text-slate-300">Statements ও wh-questions-এ falling <span className="text-cyan-300 font-bold">↘</span>, yes/no questions-এ rising <span className="text-amber-300 font-bold">↗</span>, lists-এ rise-rise-fall <span className="text-purple-300 font-bold">↗↗↘</span>।</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Connected Speech</td><td className="py-2 px-3 text-slate-300">Consonant-vowel linking, elision (<span className="font-mono text-cyan-300">/t/</span> ও <span className="font-mono text-cyan-300">/d/</span> বাদ পড়া), assimilation (sound বদলানো), weak forms। Natural English-এ এগুলো সবসময় ঘটে।</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Self-Recording</td><td className="py-2 px-3 text-slate-300">ELSA Speak, BoldVoice, ChatGPT Voice, Voice Memos। Shadowing technique হলো সবচেয়ে কার্যকর বিনামূল্যের পদ্ধতি। প্রতিদিন ১৫ মিনিট।</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 space-y-2">
        <p className="font-bold text-slate-300">পরবর্তী পদক্ষেপ:</p>
        <p>১. এই module-এর সব minimal pair জোরে বলুন এবং record করুন।</p>
        <p>২. ELSA Speak download করে একটি free assessment করুন।</p>
        <p>৩. BBC Learning English-এর Tim's Pronunciation Workshop playlist-এর প্রথম ৫টি video দেখুন।</p>
        <p>৪. প্রতিদিন একটি IELTS Speaking Part 2 topic record করুন এবং intonation checklist দিয়ে যাচাই করুন।</p>
      </div>

      {/* Module 8 Bridge */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
        <p>Module 8-এ আমরা শিখব IELTS Writing Task 1 ও Task 2 — academic writing-এর structure এবং band score বাড়ানোর কৌশল।</p>
      </div>

      {/* CLAIM XP BUTTON */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>
  </section>
);

const MODULE_08_NOTES = (
  <section className="space-y-10 text-slate-200 font-sans">

    {/* ─── SECTION 1: Module Summary Overview Card ─── */}
    <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-sm font-semibold">Module 8</span>
        <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-sm font-semibold">বাংলায়</span>
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-4">Test Taking Strategy & Final Preparation</h1>
      <p className="text-slate-300 leading-relaxed text-base mb-5">
        <span className="text-cyan-400 font-bold">এই module-এ আপনি শিখবেন</span> কীভাবে পরিকল্পনা করে IELTS-এর প্রস্তুতি নিতে হয়, mock test সঠিকভাবে দিতে হয়, পরীক্ষার দিন কী করতে হয় — এবং সবচেয়ে গুরুত্বপূর্ণ, কীভাবে নিজের মাথা ঠান্ডা রাখতে হয়।
      </p>
      <div className="flex flex-wrap gap-2">
        {["৪/৮/১২ সপ্তাহের study plan","Mock test কীভাবে নেবেন","Test anxiety সামলানো","Time management — চারটি section-এ","Day-before checklist","Test day walkthrough"].map((pill, i) => (
          <span key={i} className="bg-slate-800/60 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded-full font-medium">
            {pill}
          </span>
        ))}
      </div>
    </section>

    {/* ─── SECTION 2: 8.1 Study Plan ─── */}
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-sm font-semibold">8.1</span>
        Study Plan: কতদিনে কীভাবে প্রস্তুতি নেবেন
      </h2>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-300 leading-relaxed">IELTS-এর প্রস্তুতি একদিনে হয় না। আপনার হাতে কতটুকু সময় আছে তার উপর নির্ভর করে তিনটি আলাদা plan তৈরি করা হয়েছে।</p>
      </div>

      {/* 4-Week Plan */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-3">4-Week Intensive Plan (দ্রুত প্রস্তুতি)</h3>
        <p className="text-slate-300 text-sm mb-4">যাঁদের হাতে মাত্র এক মাস আছে, তাঁদের জন্য এই plan। প্রতিদিন ৩–৪ ঘণ্টা পড়তে হবে।</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">সপ্তাহ</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">মনোযোগের বিষয়</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">প্রতিদিনের কাজ</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 1</span></td><td className="p-3">Diagnostic + Listening</td><td className="p-3">প্রথম দিন: Full mock test দিয়ে দুর্বলতা চিহ্নিত করুন। বাকি দিন: Listening Section 1–2 drills, note-taking practice</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 2</span></td><td className="p-3">Reading + Vocabulary</td><td className="p-3">Academic/GT Reading passages (time করে), skimming ও scanning practice, প্রতিদিন ১৫টি নতুন শব্দ</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 3</span></td><td className="p-3">Writing Task 1 + Task 2</td><td className="p-3">দু'দিন Task 1 (graph/letter), তিনদিন Task 2 (essay), একদিন Speaking Part 1–2 shadowing, একদিন বিশ্রাম</td></tr>
              <tr><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 4</span></td><td className="p-3">Full Mock Tests + Review</td><td className="p-3">সোম ও বুধ: Full timed mock test। বাকি দিন: ভুল বিশ্লেষণ, দুর্বল section পুনরায় চর্চা। শুক্রবার: হালকা review, শনিবার: বিশ্রাম</td></tr>
            </tbody>
          </table>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
          <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
          <p className="text-sm">4-week plan মানে প্রতিটি ঘণ্টা মূল্যবান। কোনো দিন বাদ দেওয়া যাবে না; তবে সপ্তাহে অন্তত একদিন সম্পূর্ণ বিশ্রাম নিন।</p>
        </div>
      </div>

      {/* 8-Week Plan */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-3">8-Week Standard Plan (স্বাভাবিক গতি)</h3>
        <p className="text-slate-300 text-sm mb-4">যাঁদের দু-মাস আছে, তাঁদের জন্য এটি সবচেয়ে কার্যকর পরিকল্পনা।</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">সপ্তাহ</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">মনোযোগের বিষয়</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">বিস্তারিত কাজ</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 1</span></td><td className="p-3">Test Format + Diagnostic</td><td className="p-3">IELTS format বোঝা, একটি mock test দেওয়া, নিজের বর্তমান Band score অনুমান</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 2</span></td><td className="p-3">Listening (Sections 1–2)</td><td className="p-3">Form completion, multiple choice drills; প্রতিদিন ১ ঘণ্টা Listening</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 3</span></td><td className="p-3">Listening (Sections 3–4) + Reading Intro</td><td className="p-3">Academic lecture-style Listening; Reading passage 1-এর strategy</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 4</span></td><td className="p-3">Reading (Academic/GT)</td><td className="p-3">Passages 1–3, time management, True/False/Not Given, Matching Headings</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 5</span></td><td className="p-3">Writing Task 1</td><td className="p-3">Graph description (line, bar, pie, map, process); GT letter writing</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 6</span></td><td className="p-3">Writing Task 2</td><td className="p-3">Opinion, Discussion, Problem-Solution essay structure; পাঁচটি essay লেখা</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 7</span></td><td className="p-3">Speaking (Parts 1–3) + Vocabulary</td><td className="p-3">Part 1 fluency, Part 2 cue card practice (1 min preparation), Part 3 depth</td></tr>
              <tr><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 8</span></td><td className="p-3">Full Mock Tests + Weak Areas</td><td className="p-3">সোম ও বৃহস্পতি: Full timed mock। বাকি দিন: error analysis ও পুনরায় চর্চা। শনিবার বা রবিবার: সম্পূর্ণ বিশ্রাম</td></tr>
            </tbody>
          </table>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
          <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
          <p className="text-sm">8-week plan-এ প্রতিটি section-এ কমপক্ষে দু'সপ্তাহ দেওয়া সম্ভব হয়। এটি সবচেয়ে ভারসাম্যপূর্ণ approach।</p>
        </div>
      </div>

      {/* 12-Week Plan */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-3">12-Week Comfortable Plan (আরামদায়ক প্রস্তুতি)</h3>
        <p className="text-slate-300 text-sm mb-4">যাঁদের হাতে তিন মাস আছে, তাঁরা গভীরভাবে প্রতিটি section অনুশীলন করতে পারবেন।</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">সপ্তাহ</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">মনোযোগের বিষয়</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">বিস্তারিত কাজ</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 1</span></td><td className="p-3">Foundation: Test Format</td><td className="p-3">IELTS সম্পর্কে সম্পূর্ণ ধারণা, Test Report Form (TRF) কী, Diagnostic mock test</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 2</span></td><td className="p-3">Listening Sections 1–2</td><td className="p-3">সহজ Listening, note-taking, রোজ ২টি track শুনুন</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 3</span></td><td className="p-3">Listening Sections 3–4</td><td className="p-3">কঠিন academic talk, prediction techniques</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 4</span></td><td className="p-3">Reading: Passage 1 Strategy</td><td className="p-3">Skimming, scanning, summary completion</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 5</span></td><td className="p-3">Reading: Passage 2–3 + Vocabulary</td><td className="p-3">Harder question types; প্রতিদিন collocations ও topic-specific vocabulary</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 6</span></td><td className="p-3">Mid-point Mock Test + Review</td><td className="p-3">একটি সম্পূর্ণ timed mock, বিশ্লেষণ, দুর্বল section চিহ্নিত</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 7</span></td><td className="p-3">Writing Task 1 (Academic)</td><td className="p-3">Graph, chart, map, process diagram — প্রতিটি type-এ ২টি করে essay</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 8</span></td><td className="p-3">Writing Task 1 (GT) + Task 2 Intro</td><td className="p-3">Letter types (formal, semi-formal, informal); Task 2 structure</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 9</span></td><td className="p-3">Writing Task 2 (Advanced)</td><td className="p-3">Argument development, cohesion, academic vocabulary</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 10</span></td><td className="p-3">Speaking Parts 1–3</td><td className="p-3">Daily speaking practice (10 min); record করুন ও নিজে শুনুন</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 11</span></td><td className="p-3">Full Mock Tests + Speaking Mock</td><td className="p-3">দু'টি timed mock test; একজন partner বা tutor-এর সাথে Speaking interview</td></tr>
              <tr><td className="p-3"><span className="font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">Week 12</span></td><td className="p-3">Final Review + Rest</td><td className="p-3">শুধু দুর্বল পয়েন্ট দেখুন; শেষ দু'দিন নতুন কিছু পড়বেন না — বিশ্রাম নিন</td></tr>
            </tbody>
          </table>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
          <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
          <p className="text-sm">12-week plan-এ সময় বেশি থাকলেই শুধু হয় না — প্রতিটি সপ্তাহ পরিকল্পিতভাবে কাজে লাগাতে হবে। Vocabulary ও grammar-এর জন্য আলাদা ১৫ মিনিট প্রতিদিন বরাদ্দ রাখুন।</p>
        </div>
      </div>
    </section>

    {/* ─── SECTION 3: 8.2 Mock Test সঠিকভাবে দেওয়ার পদ্ধতি ─── */}
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-sm font-semibold">8.2</span>
        Mock Test সঠিকভাবে দেওয়ার পদ্ধতি
      </h2>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-300 leading-relaxed">Mock test দেওয়া মানে শুধু প্রশ্নের উত্তর করা নয় — এটি আসল পরীক্ষার অনুশীলন। পাঁচটি ধাপে সঠিকভাবে mock test নিন:</p>
      </div>

      {/* Step 1 */}
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <h4 className="text-white font-bold mb-2">ধাপ ১: পরিবেশ তৈরি করুন (Set Up the Environment)</h4>
        <ul className="space-y-1.5 text-slate-300 text-sm">
          <li>শান্ত ঘর বেছে নিন, মোবাইল silent করুন</li>
          <li>একটি ঘড়ি বা timer সামনে রাখুন</li>
          <li>Listening-এর জন্য headphone ব্যবহার করুন</li>
          <li>Answer sheet প্রিন্ট করুন বা নোটবুকে আঁকুন</li>
        </ul>
      </div>

      {/* Step 2 */}
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <h4 className="text-white font-bold mb-2">ধাপ ২: সম্পূর্ণ timing মেনে test দিন (Take the Test with Strict Timing)</h4>
        <ul className="space-y-1.5 text-slate-300 text-sm">
          <li>Listening: ৩০ মিনিট (+ ১০ মিনিট transfer time)</li>
          <li>Reading: ৬০ মিনিট (কোনো বিরতি নেই)</li>
          <li>Writing: ৬০ মিনিট (Task 1: ২০ মিনিট, Task 2: ৪০ মিনিট)</li>
          <li>Speaking: আলাদাভাবে ১১–১৪ মিনিট</li>
          <li>মাঝে কোনো শব্দ dictionary-তে দেখবেন না, pause করবেন না</li>
        </ul>
      </div>

      {/* Step 3 */}
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <h4 className="text-white font-bold mb-2">ধাপ ৩: উত্তর দেখুন ও mark করুন (Mark Your Answers)</h4>
        <ul className="space-y-1.5 text-slate-300 text-sm">
          <li>Answer key দিয়ে মিলিয়ে দেখুন</li>
          <li>Writing-এ নিজে বা কারো সাহায্যে Band score অনুমান করুন</li>
          <li>Speaking record করে রাখুন</li>
        </ul>
      </div>

      {/* Step 4 */}
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <h4 className="text-white font-bold mb-2">ধাপ ৪: ভুল বিশ্লেষণ করুন (Analyse Mistakes by Category)</h4>
        <p className="text-slate-300 text-sm mb-3">প্রতিটি ভুলকে category-তে ভাগ করুন:</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">Category</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">উদাহরণ</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3">Listening</td><td className="p-3">Spelling mistake, section 3-এ মনোযোগ হারানো</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3">Reading</td><td className="p-3">সময় শেষ, True/False/Not Given-এ ভুল</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3">Writing</td><td className="p-3">Task Achievement কম, cohesion দুর্বল</td></tr>
              <tr><td className="p-3">Speaking</td><td className="p-3">Fluency কম, vocabulary সীমিত</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 5 */}
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <h4 className="text-white font-bold mb-2">ধাপ ৫: দুর্বল জায়গা পুনরায় চর্চা করুন (Re-Do Weak Areas)</h4>
        <ul className="space-y-1.5 text-slate-300 text-sm">
          <li>পরের দিন শুধু সেই category নিয়ে কাজ করুন</li>
          <li>একই ধরনের question type-এ আরও ৫–১০টি প্রশ্ন করুন</li>
        </ul>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
        <p className="text-sm">Mock test শুধু score দেখার জন্য নয় — ভুল খোঁজার জন্য। প্রতিটি mock test-এর পর আপনার "error log" লিখুন।</p>
      </div>
    </section>

    {/* ─── SECTION 4: 8.3 Test Anxiety ─── */}
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-sm font-semibold">8.3</span>
        Test Anxiety: পরীক্ষার ভয় কমানোর কৌশল
      </h2>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-300 leading-relaxed">IELTS নিয়ে উদ্বিগ্ন হওয়া খুবই স্বাভাবিক। কিন্তু সঠিক কৌশল জানলে এই উদ্বেগকে নিয়ন্ত্রণ করা যায়।</p>
      </div>

      {/* Night Before */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-4">পরীক্ষার আগের রাতে (The Night Before)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold mb-3">করণীয়:</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>রাত ১০টার মধ্যে ঘুমাতে যান — ৭–৮ ঘণ্টা ঘুম অপরিহার্য</li>
              <li>সব কাগজপত্র (ID, admit card) আগেই গুছিয়ে রাখুন</li>
              <li>হালকা খাবার খান, ভারি বা অপরিচিত খাবার এড়িয়ে চলুন</li>
              <li>নিজেকে বলুন: "আমি প্রস্তুত। আমি এটার জন্য কাজ করেছি।" (Positive self-talk)</li>
              <li>পরিচিত ও আরামদায়ক কিছু করুন — হালকা সংগীত, হালকা পড়া</li>
            </ul>
          </div>
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4">
            <h4 className="text-rose-400 font-bold mb-3">বর্জনীয়:</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>নতুন কোনো grammar rule বা vocabulary মুখস্থ করার চেষ্টা করবেন না</li>
              <li>রাত জেগে চর্চা করবেন না</li>
              <li>বন্ধুদের সাথে পরীক্ষা নিয়ে দীর্ঘ আলাপ এড়িয়ে চলুন</li>
              <li>Social media-তে IELTS tips খুঁজবেন না</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Morning of the Test */}
      <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-5 my-3">
        <h3 className="text-xl font-bold text-white mb-4">পরীক্ষার সকালে (Morning of the Test)</h3>
        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-cyan-400 font-bold mb-2">Breathing Technique (৪-৭-৮ পদ্ধতি):</h4>
            <ol className="space-y-1.5 text-slate-300 text-sm list-decimal list-inside">
              <li>নাক দিয়ে ৪ সেকেন্ড শ্বাস নিন</li>
              <li>৭ সেকেন্ড শ্বাস ধরে রাখুন</li>
              <li>মুখ দিয়ে ৮ সেকেন্ড ধীরে ছাড়ুন</li>
              <li>এটি ৩ বার করুন — মাথা অনেকটা শান্ত হয়ে যাবে</li>
            </ol>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-cyan-400 font-bold mb-2">Positive Visualization:</h4>
            <ul className="space-y-1.5 text-slate-300 text-sm">
              <li>চোখ বন্ধ করে কল্পনা করুন যে আপনি শান্তভাবে পরীক্ষা দিচ্ছেন</li>
              <li>নিজেকে বলুন: "আমি যা পড়েছি তা আমার জানা আছে"</li>
              <li>মনে রাখুন: একটু nervous থাকা performance উন্নত করে — সম্পূর্ণ শান্ত থাকাটা আসল লক্ষ্য নয়</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-cyan-400 font-bold mb-2">পরীক্ষার মাঝে কিছু ভুলে গেলে:</h4>
            <ul className="space-y-1.5 text-slate-300 text-sm">
              <li>সেই প্রশ্ন skip করুন, পরে ফিরে আসুন</li>
              <li>গভীরভাবে একবার শ্বাস নিন</li>
              <li>পরের প্রশ্নে মনোযোগ দিন</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
        <p className="text-sm">Test anxiety-র সবচেয়ে বড় দাওয়াই হলো ভালো প্রস্তুতি। কিন্তু সেই সাথে ঘুম, শ্বাসপ্রশ্বাসের ব্যায়াম এবং positive self-talk মিলে পরীক্ষার দিন আপনাকে সেরা অবস্থায় রাখবে।</p>
      </div>
    </section>

    {/* ─── SECTION 5: 8.4 Time Management ─── */}
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-sm font-semibold">8.4</span>
        Time Management: চার Section-এ ঘড়ির হিসাব
      </h2>

      {/* Listening */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-3">Listening (৩০ + ১০ মিনিট)</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">Section</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">প্রশ্ন সংখ্যা</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">সময়</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3">Section 1</td><td className="p-3">10</td><td className="p-3">Audio চলাকালীন উত্তর লিখুন</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3">Section 2</td><td className="p-3">10</td><td className="p-3">Audio চলাকালীন উত্তর লিখুন</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3">Section 3</td><td className="p-3">10</td><td className="p-3">Audio চলাকালীন উত্তর লিখুন</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3">Section 4</td><td className="p-3">10</td><td className="p-3">Audio চলাকালীন উত্তর লিখুন</td></tr>
              <tr><td className="p-3">Transfer time</td><td className="p-3">—</td><td className="p-3">১০ মিনিট (answer sheet-এ সুন্দর করে লিখুন)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-300 text-sm"><span className="text-cyan-400 font-semibold">কৌশল:</span> প্রতিটি section শুরুর আগে প্রশ্নগুলো ৩০ সেকেন্ড আগে পড়ুন — এতে কী শুনতে হবে বুঝতে পারবেন।</p>
      </div>

      {/* Reading */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-3">Reading (৬০ মিনিট — ৩টি Passage)</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">Passage</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">প্রশ্ন সংখ্যা</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">বরাদ্দ সময়</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">লক্ষ্য</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3">Passage 1</td><td className="p-3">13–14</td><td className="p-3">১৭ মিনিট</td><td className="p-3">সহজ, দ্রুত শেষ করুন</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3">Passage 2</td><td className="p-3">13–14</td><td className="p-3">২০ মিনিট</td><td className="p-3">মাঝারি কঠিন</td></tr>
              <tr><td className="p-3">Passage 3</td><td className="p-3">13–14</td><td className="p-3">২৩ মিনিট</td><td className="p-3">সবচেয়ে কঠিন, বেশি সময়</td></tr>
            </tbody>
          </table>
        </div>
        <div className="space-y-2 text-slate-300 text-sm">
          <p className="font-semibold text-cyan-400">কৌশল:</p>
          <ul className="space-y-1.5 ml-4">
            <li>Skimming দিয়ে পুরো passage-এর ধারণা নিন (২ মিনিট)</li>
            <li>তারপর প্রশ্ন পড়ুন, তারপর উত্তর খুঁজুন</li>
            <li>কোনো প্রশ্নে আটকে গেলে চিহ্নিত করে এগিয়ে যান</li>
            <li>শেষ ৫ মিনিটে সব উত্তর দেওয়া আছে কিনা নিশ্চিত করুন</li>
          </ul>
        </div>
      </div>

      {/* Writing */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-3">Writing (৬০ মিনিট)</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">Task</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">বরাদ্দ সময়</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">ভাগ</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3">Task 1</td><td className="p-3">২০ মিনিট</td><td className="p-3">৩ মিনিট plan, ১৪ মিনিট লেখা, ৩ মিনিট review</td></tr>
              <tr><td className="p-3">Task 2</td><td className="p-3">৪০ মিনিট</td><td className="p-3">৫ মিনিট plan, ৩০ মিনিট লেখা, ৫ মিনিট review</td></tr>
            </tbody>
          </table>
        </div>
        <div className="space-y-2 text-slate-300 text-sm">
          <p className="font-semibold text-cyan-400">কৌশল:</p>
          <ul className="space-y-1.5 ml-4">
            <li>Task 2 বেশি marks বহন করে — তাই Task 1-এ বেশি সময় নষ্ট করবেন না</li>
            <li>যদি Task 1-এ ২৫ মিনিট লেগে যায়, Task 2-তে কম সময় পাবেন</li>
            <li>সবসময় ৫ মিনিট review-এর জন্য রাখুন</li>
          </ul>
        </div>
      </div>

      {/* Speaking */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 my-4">
        <h3 className="text-xl font-bold text-white mb-3">Speaking (১১–১৪ মিনিট)</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">Part</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">সময়</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">করণীয়</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3">Part 1</td><td className="p-3">৪–৫ মিনিট</td><td className="p-3">ছোট উত্তর, natural হওয়ার চেষ্টা করুন</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3">Part 2</td><td className="p-3">৩–৪ মিনিট</td><td className="p-3">১ মিনিট note করুন, ২ মিনিট কথা বলুন</td></tr>
              <tr><td className="p-3">Part 3</td><td className="p-3">৪–৫ মিনিট</td><td className="p-3">গভীর মতামত দিন, উদাহরণ ব্যবহার করুন</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-300 text-sm"><span className="text-cyan-400 font-semibold">কৌশল:</span> Part 2-এ ১ মিনিটের ৪টি বিষয় নোট করুন (কে, কখন, কোথায়, কেন) — এতে ২ মিনিট বলা সহজ হয়।</p>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
        <p className="text-sm">প্রতিটি section-এর আগে ঘড়িতে শুরুর সময় লিখে রাখুন। Reading-এ Passage 1 শেষ করুন ১৭ মিনিটে, না হলে এগিয়ে যান।</p>
      </div>
    </section>

    {/* ─── SECTION 6: 8.5 Day-Before Checklist ─── */}
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-sm font-semibold">8.5</span>
        Day-Before Checklist: পরীক্ষার আগের দিন কী করবেন
      </h2>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 my-4">
        <p className="text-slate-300 text-sm mb-4">পরীক্ষার আগের রাতে এই তালিকাটি মিলিয়ে দেখুন:</p>
        <div className="space-y-2.5">
          {[
            "জাতীয় পরিচয়পত্র বা পাসপোর্ট — registration-এ যা দিয়েছিলেন, সেটাই আনুন",
            "Registration confirmation — email printout বা screenshot",
            "Test centre-এর ঠিকানা — আগে থেকে Google Maps-এ দেখে রাখুন",
            "রুট পরিকল্পনা — কীভাবে যাবেন, কতক্ষণ লাগবে, backup route আছে কিনা",
            "অ্যালার্ম — পরীক্ষার কমপক্ষে ৩ ঘণ্টা আগে উঠতে হবে; দুটো alarm set করুন",
            "হালকা নাস্তা — পেট ভরা থাকলে মাথা ভালো কাজ করে; ভারি খাবার এড়িয়ে চলুন",
            "পানি — test centre-এ সাধারণত স্বচ্ছ বোতলে পানি নেওয়া যায়",
            "পোশাক — আরামদায়ক পোশাক বেছে রাখুন; ঘর ঠান্ডা হতে পারে, একটি হালকা jacket রাখুন",
            "কলম বা পেন্সিল — কেন্দ্র সাধারণত দেয়, তবে নিজেরটাও রাখুন",
            "নতুন পড়াশোনা করবেন না — নতুন vocabulary বা grammar এখন দেখবেন না",
            "Mock test দেবেন না — মাথা ক্লান্ত হয়ে যাবে",
            "Social media সীমিত করুন — IELTS tips-এর পোস্ট আপনাকে আরও চিন্তিত করবে",
            "রাত ১০টার মধ্যে ঘুমান — ৭–৮ ঘণ্টার ঘুম সবচেয়ে গুরুত্বপূর্ণ প্রস্তুতি",
            "মানসিক প্রস্তুতি — নিজেকে মনে করিয়ে দিন: \u201Cআমি কঠোর পরিশ্রম করেছি। আমি প্রস্তুত।\u201D"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg mt-0.5 flex-shrink-0">&#10003;</span>
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
        <p className="text-sm">পরীক্ষার আগের রাত নতুন কিছু শেখার রাত নয় — এটি বিশ্রাম নেওয়ার এবং আত্মবিশ্বাস গড়ার রাত।</p>
      </div>
    </section>

    {/* ─── SECTION 7: 8.6 Test Day Walkthrough ─── */}
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-sm font-semibold">8.6</span>
        Test Day Walkthrough: পরীক্ষার দিন যা ঘটে
      </h2>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-300 leading-relaxed">পরীক্ষার দিন ঠিক কী কী হয় তা আগে থেকে জানা থাকলে ভয় অনেক কম লাগে।</p>
      </div>

      <div className="space-y-3">
        {/* Arrival */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/60 rounded-r-xl p-4">
          <h4 className="text-white font-bold mb-2">কেন্দ্রে পৌঁছানো (Arrival)</h4>
          <ul className="space-y-1.5 text-slate-300 text-sm">
            <li>পরীক্ষা শুরুর ৩০ মিনিট আগে পৌঁছান</li>
            <li>দেরিতে পৌঁছালে প্রবেশ নাও করতে দিতে পারে</li>
            <li>বাইরে সব ব্যক্তিগত জিনিসপত্র (মোবাইল, ঘড়ি, বই) বন্ধ রাখুন</li>
          </ul>
        </div>

        {/* Registration */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/60 rounded-r-xl p-4">
          <h4 className="text-white font-bold mb-2">নিবন্ধন ও পরিচয় যাচাই (Registration & ID Check)</h4>
          <ul className="space-y-1.5 text-slate-300 text-sm">
            <li>Staff আপনার ID দেখবেন এবং registration confirm করবেন</li>
            <li>নাম ও ছবি মিলিয়ে দেখা হবে</li>
          </ul>
        </div>

        {/* Biometrics */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/60 rounded-r-xl p-4">
          <h4 className="text-white font-bold mb-2">Biometrics (Computer-based test-এ)</h4>
          <ul className="space-y-1.5 text-slate-300 text-sm">
            <li>আঙুলের ছাপ (fingerprint) নেওয়া হয়</li>
            <li>ছবি তোলা হয়</li>
            <li>এটি স্বাভাবিক প্রক্রিয়া — ঘাবড়াবেন না</li>
          </ul>
        </div>

        {/* Locker */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/60 rounded-r-xl p-4">
          <h4 className="text-white font-bold mb-2">Locker / Storage</h4>
          <ul className="space-y-1.5 text-slate-300 text-sm">
            <li>মোবাইল, ব্যাগ locker-এ রাখতে হবে</li>
            <li>শুধু ID এবং অনুমোদিত জিনিস (পানির বোতল, প্রয়োজনে tissues) নিয়ে হলে প্রবেশ করুন</li>
          </ul>
        </div>

        {/* Exam Hall */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/60 rounded-r-xl p-4">
          <h4 className="text-white font-bold mb-2">পরীক্ষার হলে (Inside the Hall)</h4>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-cyan-400 font-semibold text-sm mb-2">Paper-based test:</p>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>Listening → Reading → Writing (একটানা, বিরতি নেই)</li>
                <li>মোট সময়: প্রায় ২ ঘণ্টা ৪৫ মিনিট</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-cyan-400 font-semibold text-sm mb-2">Computer-based test:</p>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>Computer setup করা হবে, headphone পরীক্ষা করুন</li>
                <li>Listening → Reading → Writing</li>
                <li>Answer সরাসরি computer-এ type করুন (Writing) বা click করুন (Listening/Reading)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Speaking */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/60 rounded-r-xl p-4">
          <h4 className="text-white font-bold mb-2">Speaking Interview</h4>
          <ul className="space-y-1.5 text-slate-300 text-sm">
            <li>Speaking সাধারণত আলাদাভাবে — পরীক্ষার আগে বা পরে, অন্য দিনেও হতে পারে</li>
            <li>একজন examiner আপনার সাথে মুখোমুখি কথা বলবেন</li>
            <li>Interview record করা হয়</li>
            <li>Examiner friendly থাকবেন — এটি একটি conversation, জিজ্ঞাসাবাদ নয়</li>
          </ul>
        </div>

        {/* After Test */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/60 rounded-r-xl p-4">
          <h4 className="text-white font-bold mb-2">পরীক্ষা শেষে (After the Test)</h4>
          <ul className="space-y-1.5 text-slate-300 text-sm">
            <li>সব উত্তর submit হয়েছে কিনা নিশ্চিত করুন (computer-based-এ)</li>
            <li>Test Report Form (TRF) সাধারণত ১৩ দিনের মধ্যে (paper-based) বা ৩–৫ দিনের মধ্যে (computer-based) পাওয়া যায়</li>
            <li>Online-এ result দেখতে পারবেন</li>
          </ul>
        </div>

        {/* Mindset */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <h4 className="text-white font-bold mb-3">পরীক্ষার দিনের মানসিক কৌশল</h4>
          <ul className="space-y-1.5 text-slate-300 text-sm">
            <li>প্রতিটি section শেষে মাথা পরিষ্কার করুন — আগের section নিয়ে ভাববেন না</li>
            <li>যদি কোনো প্রশ্ন না পারেন, educated guess করুন — খালি রাখলে শূন্য পাবেন</li>
            <li>Speaking-এ যদি কিছু না বুঝলে বলুন: "Could you please repeat the question?" — এটি সম্পূর্ণ গ্রহণযোগ্য</li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <p className="font-bold text-emerald-300 mb-1">মূল কথা:</p>
        <p className="text-sm">পরীক্ষার দিন আপনার একমাত্র কাজ হলো যা জানেন তা দেখানো। নতুন কিছু শেখার চেষ্টা করবেন না — শুধু সেরা পারফরম্যান্স দিন।</p>
      </div>
    </section>

    {/* ─── SECTION 8: Module Summary & Action Plan ─── */}
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white">এই Module-এ আপনি যা শিখলেন</h2>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-300 text-sm mb-4">এই module শেষ করে আপনি এখন জানেন:</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">টপিক</th>
                <th className="text-cyan-400 font-semibold p-3 border-b border-slate-700 text-left">যা শিখেছেন</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800"><td className="p-3 font-semibold">Study Plan</td><td className="p-3">আপনার হাতে থাকা সময় অনুযায়ী ৪-সপ্তাহ, ৮-সপ্তাহ বা ১২-সপ্তাহের পরিকল্পনা কীভাবে তৈরি করতে হয়</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3 font-semibold">Mock Test</td><td className="p-3">সঠিক পরিবেশে, সম্পূর্ণ timing মেনে mock test দেওয়া এবং তারপর ভুলের category বিশ্লেষণ করার পাঁচটি ধাপ</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3 font-semibold">Test Anxiety</td><td className="p-3">৪-৭-৮ breathing technique, positive self-talk, ঘুমের গুরুত্ব এবং পরীক্ষার আগের রাতে কী করবেন ও কী করবেন না</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3 font-semibold">Time Management</td><td className="p-3">Listening, Reading (১৭/২০/২৩ মিনিট ভাগ), Writing (Task 1: ২০ মিনিট, Task 2: ৪০ মিনিট) এবং Speaking-এর জন্য সুনির্দিষ্ট clock plan</td></tr>
              <tr className="border-b border-slate-800"><td className="p-3 font-semibold">Day-Before Checklist</td><td className="p-3">১৪টি item-এর checklist যা পরীক্ষার আগের রাতে মিলিয়ে নিতে হবে</td></tr>
              <tr><td className="p-3 font-semibold">Test Day Walkthrough</td><td className="p-3">কেন্দ্রে পৌঁছানো থেকে Test Report Form পাওয়া পর্যন্ত প্রতিটি ধাপ</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
        <p className="text-slate-200 text-base font-semibold">পরবর্তী Module: 09 — After the Test (results বোঝা, remarking, আবার দেওয়া কি উচিত)</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-xl p-5 text-center">
        <p className="text-emerald-300 font-bold text-lg">নোট সম্পন্ন — XP সংগ্রহ হয়েছে!</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm mt-3">
          Claim +10 XP
        </button>
      </div>
    </section>

  </section>
);

const MODULE_09_NOTES = (
  <section className="space-y-8">
    {/* ─── SECTION 1: HERO HEADER ─── */}
    <div className="bg-gradient-to-br from-cyan-950/60 via-cyan-900/30 to-slate-900 border border-cyan-800/40 rounded-2xl p-8 text-center space-y-4">
      <p className="text-3xl">📋</p>
      <h2 className="text-2xl font-bold text-cyan-100">Module 9: After the Test (বাংলায়)</h2>
      <p className="text-sm text-cyan-300/80 max-w-2xl mx-auto">
        IELTS পরীক্ষা দেওয়ার পরে অনেকেই বিভ্রান্ত হয়ে পড়েন — result কীভাবে পড়বেন, score পাঠাবেন কোথায়, আবার পরীক্ষা দেবেন কিনা। এই module-এ সেই সব প্রশ্নের উত্তর পাবেন।
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {['TRF বোঝা', 'EOR', 'Score পাঠানো', 'Retake', 'One Skill Retake'].map((t) => (
          <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium px-3 py-1 rounded-full">{t}</span>
        ))}
      </div>
    </div>

    {/* ─── SECTION 2: 9.1 TRF ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        9.1 TRF (Test Report Form) বোঝা
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p className="font-bold text-cyan-100">TRF কী?</p>
        <p>TRF হলো IELTS-এর official score certificate। পরীক্ষা দেওয়ার পর British Council বা IDP — যে সংস্থার মাধ্যমে পরীক্ষা দিয়েছেন — তারা এই TRF প্রদান করে। এটিই আপনার ভাষাদক্ষতার প্রমাণপত্র হিসেবে বিশ্ববিদ্যালয়, ইমিগ্রেশন অফিস এবং নিয়োগকর্তারা গ্রহণ করেন।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Result কখন পাবেন?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-2">
            <p className="text-cyan-300 font-bold">Computer-delivered IELTS</p>
            <p className="text-slate-300">সাধারণত পরীক্ষার <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">১–৫ দিনের</span> মধ্যে online-এ result দেখা যায়। eTRF (electronic TRF) download করা যায়।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-2">
            <p className="text-cyan-300 font-bold">Paper-based IELTS</p>
            <p className="text-slate-300">পরীক্ষার <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">১৩ দিন</span> পর result প্রকাশ পায়। Physical TRF ডাকে আসতে আরও কিছুটা সময় লাগে।</p>
          </div>
        </div>
      </div>

      {/* TRF Components Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">TRF-এর প্রতিটি অংশ কী মানে?</h4>
        <p className="text-xs text-slate-400">একটি TRF-এ নিচের তথ্যগুলো থাকে:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">TRF-এর অংশ</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">বিস্তারিত</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Overall Band Score</td><td className="py-2 px-3 text-slate-400">৪টি skill-এর গড় (০.৫ স্তরে নিকটতম)</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Listening Band</td><td className="py-2 px-3 text-slate-400">০–৯ স্কেলে আলাদা Band</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Reading Band</td><td className="py-2 px-3 text-slate-400">০–৯ স্কেলে আলাদা Band</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Writing Band</td><td className="py-2 px-3 text-slate-400">০–৯ স্কেলে আলাদা Band</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Speaking Band</td><td className="py-2 px-3 text-slate-400">০–৯ স্কেলে আলাদা Band</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">CEFR Level</td><td className="py-2 px-3 text-slate-400">Common European Framework of Reference — যেমন <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Band 7 = C1</span></td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Test Type</td><td className="py-2 px-3 text-slate-400">Academic বা General Training</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Test Date</td><td className="py-2 px-3 text-slate-400">পরীক্ষার তারিখ</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">TRF Number</td><td className="py-2 px-3 text-slate-400">Unique identification number</td></tr>
              <tr><td className="py-2 px-3 text-slate-300 font-bold">Validity</td><td className="py-2 px-3 text-slate-400">পরীক্ষার তারিখ থেকে <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">২ বছর</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CEFR Equivalents */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">CEFR Equivalents</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Band</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">CEFR Level</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">অর্থ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">8–9</span></td><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">C2</span></td><td className="py-2 px-3 text-slate-400">Expert</td></tr>
              <tr><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">7–7.5</span></td><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">C1</span></td><td className="py-2 px-3 text-slate-400">Advanced</td></tr>
              <tr><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">5.5–6.5</span></td><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">B2</span></td><td className="py-2 px-3 text-slate-400">Upper-Intermediate</td></tr>
              <tr><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">4–5</span></td><td className="py-2 px-3"><span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">B1</span></td><td className="py-2 px-3 text-slate-400">Intermediate</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* eTRF vs Physical */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">eTRF বনাম Physical TRF</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1">
            <p className="text-cyan-300 font-bold">eTRF (electronic TRF)</p>
            <p className="text-slate-400">Test Taker Portal থেকে download করা যায়, বেশিরভাগ বিশ্ববিদ্যালয় এটি সরাসরি accept করে।</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1">
            <p className="text-cyan-300 font-bold">Physical TRF</p>
            <p className="text-slate-400">ডাকে পাঠানো হয়; কিছু সংস্থা এখনও hard copy চায়।</p>
          </div>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> TRF-এ Overall Band-ই সবচেয়ে গুরুত্বপূর্ণ, কিন্তু অনেক বিশ্ববিদ্যালয় individual skill-এর minimum score-ও নির্ধারণ করে। তাই শুধু Overall Band দেখলেই হবে না — চারটি skill আলাদাভাবে চেক করুন।</p>
      </div>
    </section>

    {/* ─── SECTION 3: 9.2 EOR ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        9.2 EOR (Enquiry on Results)
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p className="font-bold text-cyan-100">EOR কী?</p>
        <p>EOR মানে Enquiry on Results — অর্থাৎ আপনার IELTS result পুনর্মূল্যায়নের আবেদন। আপনি যদি মনে করেন কোনো skill-এ প্রাপ্ত Band আপনার প্রত্যাশার চেয়ে অনেক কম, তাহলে EOR-এর মাধ্যমে পুনরায় সেই script বা recording মূল্যায়ন করানো সম্ভব।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">EOR কখন করবেন?</h4>
        <p className="text-xs text-slate-400">নিচের পরিস্থিতিতে EOR বিবেচনা করুন:</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300">প্রত্যাশার চেয়ে অনেক কম Band পেয়েছেন — যেমন Writing-এ সবসময় <span className="font-mono text-cyan-300">৬.৫</span> পেতেন, কিন্তু এবার <span className="font-mono text-cyan-300">৫.৫</span> পেলেন।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300">Speaking বা Writing-এ অস্বাভাবিক ফল — এই দুটি skill subjective হওয়ায় পুনর্মূল্যায়নে পরিবর্তন আসার সম্ভাবনা বেশি।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300">Listening বা Reading-এ EOR সাধারণত কার্যকর নয় — কারণ এগুলো objective এবং answer key দিয়ে যাচাই হয়।</p>
          </div>
        </div>
      </div>

      {/* EOR Parameters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">EOR-এর সময়সীমা ও খরচ</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-400 font-bold">Deadline</p>
            <p className="text-slate-300">Result পাওয়ার <span className="font-mono text-cyan-300">৬ Weeks</span>-এর মধ্যে</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-400 font-bold">Fee</p>
            <p className="text-slate-300">প্রতি skill <span className="font-mono text-cyan-300">USD 50–80</span></p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-400 font-bold">Timeline</p>
            <p className="text-slate-300"><span className="font-mono text-cyan-300">৬–৮ সপ্তাহ</span></p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-center space-y-1">
            <p className="text-slate-400 font-bold">Refund</p>
            <p className="text-slate-300">Band বাড়লে fee ফেরত</p>
          </div>
        </div>
      </div>

      {/* Refund Policy */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
        <h4 className="text-sm font-bold text-cyan-100">Refund নীতি</h4>
        <p className="text-xs text-slate-400">যদি EOR-এর পর আপনার Band বৃদ্ধি পায়, তাহলে আবেদনের fee ফেরত দেওয়া হয়। যদি score একই থাকে বা কমে যায়, তাহলে fee ফেরত পাওয়া যায় না।</p>
      </div>

      {/* Skill Effectiveness Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">কোন skill-এ EOR করবেন?</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">Skill</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">EOR কার্যকরতা</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">কারণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Writing</td><td className="py-2 px-3 text-emerald-400 font-medium">সবচেয়ে বেশি কার্যকর</td><td className="py-2 px-3 text-slate-400">Examiner-এর subjective মূল্যায়ন</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Speaking</td><td className="py-2 px-3 text-emerald-400 font-medium">কার্যকর</td><td className="py-2 px-3 text-slate-400">Examiner-এর subjective মূল্যায়ন</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Reading</td><td className="py-2 px-3 text-rose-400 font-medium">সাধারণত কার্যকর নয়</td><td className="py-2 px-3 text-slate-400">Objective marking</td></tr>
              <tr><td className="py-2 px-3 text-cyan-300 font-bold">Listening</td><td className="py-2 px-3 text-rose-400 font-medium">সাধারণত কার্যকর নয়</td><td className="py-2 px-3 text-slate-400">Objective marking</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> EOR হলো শেষ অবলম্বন, সহজ সমাধান নয়। Writing বা Speaking-এ ০.৫ Band-এর পার্থক্যের জন্য EOR করা যায়, কিন্তু ১+ Band-এর পার্থক্যের জন্য পুনরায় পরীক্ষা দেওয়াই বেশি বাস্তবসম্মত।</p>
      </div>
    </section>

    {/* ─── SECTION 4: 9.3 SCORE SENDING ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        9.3 বিশ্ববিদ্যালয় ও ইমিগ্রেশনে Score পাঠানো
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Registration-এর সময় Institution নির্ধারণ</h4>
        <p className="text-xs text-slate-400">IELTS-এ registration করার সময়ই আপনি বিনামূল্যে কিছু institution-কে score পাঠানোর জন্য মনোনীত করতে পারেন। এই সুযোগে সর্বোচ্চ institution-এর তালিকা তৈরি রাখুন।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">পরীক্ষার পরে Score পাঠানো</h4>
        <p className="text-xs text-slate-400 mb-2">পরীক্ষার পরে অতিরিক্ত institution-এ TRF পাঠাতে চাইলে:</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">১</span>
            <p className="text-slate-300">Test Taker Portal-এ login করুন (IDP বা British Council-এর website)।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">২</span>
            <p className="text-slate-300">"Send Scores" বা "Request Additional TRF" অপশন বেছে নিন।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">৩</span>
            <p className="text-slate-300">Institution-এর নাম ও ঠিকানা প্রদান করুন।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">৪</span>
            <p className="text-slate-300">প্রতিটি additional TRF-এর জন্য একটি নির্দিষ্ট fee দিতে হয় (সাধারণত <span className="font-mono text-cyan-300">USD 20–25</span> প্রতিটি)।</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">eTRF ও Electronic Verification</h4>
        <p className="text-xs text-slate-400">বেশিরভাগ বিশ্ববিদ্যালয় এখন সরাসরি IELTS-এর electronic verification system ব্যবহার করে। এর মাধ্যমে:</p>
        <div className="space-y-1.5 text-xs text-slate-300">
          <p>• বিশ্ববিদ্যালয় আপনার TRF Number দিয়ে সরাসরি IELTS-এর database থেকে score যাচাই করতে পারে।</p>
          <p>• আপনাকে physical TRF ডাকে পাঠাতে হয় না।</p>
          <p>• eTRF download করে email করা যায়।</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Immigration-এ Score পাঠানো</h4>
        <p className="text-xs text-slate-400">UK Visas and Immigration (UKVI), Australian Department of Home Affairs, কানাডার IRCC — এই সংস্থাগুলো সরাসরি IELTS-এর verification system ব্যবহার করে। আপনাকে শুধু TRF Number প্রদান করলেই হয়।</p>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> পরীক্ষা দেওয়ার আগেই কোন কোন institution-এ score পাঠাবেন সেটা ঠিক করুন — registration-এর সময় বিনামূল্যে পাঠানোর সুযোগ নষ্ট করবেন না। TRF-এর validity <span className="font-mono text-cyan-300">২ বছর</span>, তাই তাড়াহুড়ো না করলেও চলে।</p>
      </div>
    </section>

    {/* ─── SECTION 5: 9.4 RETAKE DECISION ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        9.4 পুনরায় পরীক্ষা দেওয়ার সিদ্ধান্ত
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">কখন Retake নেবেন?</h4>
        <p className="text-xs text-slate-400">নিচের decision tree অনুসরণ করুন:</p>
        <div className="font-mono text-amber-300 bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 my-3 text-xs leading-relaxed">
          <p className="text-slate-300 mb-2">আপনার Overall Band লক্ষ্যমাত্রা থেকে কতটা কম?</p>
          <p className="text-slate-300">│</p>
          <p className="text-slate-300">├── <span className="text-cyan-300 font-bold">০.৫ Band কম</span> → Individual skill দেখুন</p>
          <p className="text-slate-300">│   ├── একটি মাত্র skill দুর্বল → <span className="text-emerald-300">One Skill Retake বিবেচনা করুন (9.5 দেখুন)</span></p>
          <p className="text-slate-300">│   └── সব skill কাছাকাছি → <span className="text-amber-300">EOR বিবেচনা করুন অথবা সম্পূর্ণ Retake</span></p>
          <p className="text-slate-300">│</p>
          <p className="text-slate-300">├── <span className="text-cyan-300 font-bold">১.০–১.৫ Band কম</span> → সম্পূর্ণ Retake প্রয়োজন</p>
          <p className="text-slate-300">│   ├── কত সময় আছে? → ন্যূনতম <span className="text-amber-300">৩–৬ মাস</span> প্রস্তুতি নিন</p>
          <p className="text-slate-300">│   └── দুর্বল skill চিহ্নিত করুন এবং সেদিকে মনোযোগ দিন</p>
          <p className="text-slate-300">│</p>
          <p className="text-slate-300">└── <span className="text-cyan-300 font-bold">২+ Band কম</span> → সম্পূর্ণ Retake এবং দীর্ঘমেয়াদী প্রস্তুতি</p>
          <p className="text-slate-300">    └── <span className="text-amber-300">General English course বিবেচনা করুন আগে</span></p>
        </div>
      </div>

      {/* 4-Step Improvement Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Improvement Plan তৈরি করা</h4>
        <p className="text-xs text-slate-400">Retake-এর আগে একটি structured plan তৈরি করুন:</p>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-3">
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">ধাপ ১</span>
            <div>
              <p className="text-cyan-100 font-bold">Weakness চিহ্নিত করুন</p>
              <p className="text-slate-400">আপনার TRF-এর চারটি skill score বিশ্লেষণ করুন। কোন skill-এ সবচেয়ে বেশি পিছিয়ে আছেন?</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">ধাপ ২</span>
            <div>
              <p className="text-cyan-100 font-bold">কারণ বিশ্লেষণ করুন</p>
              <p className="text-slate-400">Writing-এ কি Task Achievement দুর্বল, নাকি Vocabulary? Speaking-এ কি Fluency নাকি Pronunciation? Listening-এ কি ধীর গতির অংশ নাকি দ্রুত অংশে সমস্যা?</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">ধাপ ৩</span>
            <div>
              <p className="text-cyan-100 font-bold">সময়সীমা নির্ধারণ করুন</p>
              <p className="text-slate-400">
                <span className="text-slate-300">০.৫ Band উন্নতি:</span> ন্যূনতম <span className="font-mono text-cyan-300">৪–৬ সপ্তাহ</span> নিবিড় অনুশীলন।<br />
                <span className="text-slate-300">১ Band উন্নতি:</span> <span className="font-mono text-cyan-300">২–৩ মাস</span>।<br />
                <span className="text-slate-300">১.৫+ Band উন্নতি:</span> <span className="font-mono text-cyan-300">৪–৬ মাস</span> বা তার বেশি।
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">ধাপ ৪</span>
            <div>
              <p className="text-cyan-100 font-bold">সঠিক resources বেছে নিন</p>
              <p className="text-slate-400">
                <span className="text-slate-300">Writing:</span> Model answers বিশ্লেষণ, feedback নিন।<br />
                <span className="text-slate-300">Speaking:</span> Native speaker-দের সাথে অনুশীলন, recording শুনুন।<br />
                <span className="text-slate-300">Reading:</span> Skimming/scanning কৌশল আরও শক্তিশালী করুন।<br />
                <span className="text-slate-300">Listening:</span> BBC, TED Talks, podcast নিয়মিত শুনুন।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost vs Benefit */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Retake-এর খরচ বনাম সুবিধা</h4>
        <div className="space-y-1.5 text-xs text-slate-400">
          <p>• Bangladesh-এ সম্পূর্ণ IELTS পরীক্ষার খরচ প্রায় <span className="font-mono text-cyan-300">BDT 22,000–25,000</span>।</p>
          <p>• যদি শুধু ০.৫ Band-এর জন্য Retake নেন এবং সেই Band না পান, তাহলে সময় ও অর্থ দুটোই নষ্ট হয়।</p>
          <p>• তাই Retake নেওয়ার আগে নিশ্চিত হন যে আপনি পর্যাপ্ত প্রস্তুতি নিয়েছেন।</p>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> Retake মানে শুধু আরেকবার পরীক্ষা দেওয়া নয় — এটি একটি সুনির্দিষ্ট improvement plan কার্যকর করার সুযোগ। প্রস্তুতি ছাড়া Retake দেওয়া অর্থের অপচয়।</p>
      </div>
    </section>

    {/* ─── SECTION 6: 9.5 ONE SKILL RETAKE ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        9.5 IELTS One Skill Retake (OSR)
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p className="font-bold text-cyan-100">One Skill Retake কী?</p>
        <p>IELTS One Skill Retake (OSR) একটি নতুন সুবিধা (চালু হয়েছে <span className="font-mono text-cyan-300">২০২৩</span> সাল থেকে) যার মাধ্যমে আপনি চারটি skill-এর মধ্যে শুধু একটি skill পুনরায় দিতে পারবেন — পুরো IELTS পরীক্ষা আবার না দিয়েই।</p>
      </div>

      {/* Eligibility */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">Eligibility (যোগ্যতার শর্ত)</h4>
        <p className="text-xs text-slate-400">OSR পেতে হলে আপনাকে অবশ্যই:</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300">Computer-delivered IELTS দিয়ে থাকতে হবে (Paper-based IELTS-এর জন্য OSR প্রযোজ্য নয়)।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300">মূল পরীক্ষার তারিখ থেকে <span className="font-mono text-cyan-300">৬০ দিনের</span> মধ্যে OSR বুক করতে হবে।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300">প্রতিটি original test-এর জন্য মাত্র <span className="text-cyan-300 font-bold">একবার</span> OSR নেওয়া যায়।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300">OSR-এ আপনার নতুন score যদি মূল score-এর চেয়ে কম হয়, তাহলে আপনি উভয় score-এর মধ্যে বেশিটি ব্যবহার করতে পারবেন।</p>
          </div>
        </div>
      </div>

      {/* Skill Choice Strategy */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">কোন Skill Retake করতে পারবেন?</h4>
        <p className="text-xs text-slate-400">Listening, Reading, Writing, Speaking — যেকোনো একটি। তবে কৌশলগতভাবে:</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300"><span className="text-cyan-300 font-bold">Writing বা Speaking</span> — যদি এই দুটির একটি আপনার লক্ষ্যমাত্রার চেয়ে কম হয় এবং বাকি তিনটি ঠিক থাকে।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300"><span className="text-cyan-300 font-bold">Listening or Reading</span> — যদি সেদিন অস্বাভাবিক কারণে খারাপ হয়েছে বলে মনে হয়।</p>
          </div>
        </div>
      </div>

      {/* OSR Fee */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
        <h4 className="text-sm font-bold text-cyan-100">OSR-এর খরচ</h4>
        <p className="text-xs text-slate-400">OSR-এর fee সম্পূর্ণ IELTS পরীক্ষার চেয়ে কম — সাধারণত মূল পরীক্ষার <span className="font-mono text-cyan-300">৫০–৬০%</span>। Bangladesh-এ IDP বা British Council-এর website থেকে সর্বশেষ fee জানুন।</p>
      </div>

      {/* Geographic Acceptance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">কোথায় OSR গ্রহণযোগ্য?</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 space-y-1">
            <p className="text-emerald-300 font-bold">যুক্তরাজ্য (UK)</p>
            <p className="text-slate-400">অধিকাংশ বিশ্ববিদ্যালয়</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 space-y-1">
            <p className="text-emerald-300 font-bold">অস্ট্রেলিয়া</p>
            <p className="text-slate-400">বিশ্ববিদ্যালয় ও অনেক immigration pathway</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 space-y-1">
            <p className="text-emerald-300 font-bold">নিউজিল্যান্ড</p>
            <p className="text-slate-400">বিশ্ববিদ্যালয়</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 space-y-1">
            <p className="text-emerald-300 font-bold">কানাডা</p>
            <p className="text-slate-400">বিশ্ববিদ্যালয় এবং কিছু immigration প্রোগ্রাম</p>
          </div>
        </div>
      </div>

      {/* Special Warnings */}
      <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-rose-300">সতর্কতা — সব ক্ষেত্রে গ্রহণযোগ্য নয়</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-rose-300 mt-0.5">•</span>
            <div>
              <p className="text-slate-300"><span className="font-bold text-rose-300">IELTS for UKVI (UK Visas and Immigration)</span> — Visa আবেদনের জন্য UKVI-approved test প্রয়োজন। OSR কিছু UKVI pathway-এ accept করা হয়, কিছুতে হয় না। আবেদন করার আগে UK Home Office-এর সর্বশেষ নির্দেশিকা দেখুন।</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-rose-300 mt-0.5">•</span>
            <div>
              <p className="text-slate-300"><span className="font-bold text-rose-300">NMC (Nursing and Midwifery Council, UK)</span> — সব skill retake-ই পূর্ণ পরীক্ষায় দেওয়া প্রয়োজন বলে জানিয়েছে।</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-rose-300 mt-0.5">•</span>
            <div>
              <p className="text-slate-300"><span className="font-bold text-rose-300">কিছু Medical/Professional Body</span> — তারা সম্পূর্ণ single-sitting test চায়।</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-rose-300/80 font-bold mt-2">গুরুত্বপূর্ণ: OSR accept করা হয় কিনা তা আবেদন করার আগে সংশ্লিষ্ট বিশ্ববিদ্যালয় বা সংস্থার সাথে সরাসরি যোগাযোগ করে নিশ্চিত হন। IELTS.org-এ "Recognising organisations" তালিকা দেখুন।</p>
      </div>

      {/* OSR Smart Choice Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-cyan-100">OSR কখন Smart Choice?</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">পরিস্থিতি</th>
                <th className="text-left py-2 px-3 bg-slate-800/80 text-cyan-400 font-semibold">OSR কি ভালো?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-300">একটি skill বাকি তিনটির চেয়ে অনেক কম</td><td className="py-2 px-3 text-emerald-400 font-medium">হ্যাঁ — সময় ও অর্থ বাঁচে</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">আবেদনের deadline কাছে</td><td className="py-2 px-3 text-emerald-400 font-medium">হ্যাঁ — দ্রুত সমাধান</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">সব skill-ই লক্ষ্যমাত্রার চেয়ে কম</td><td className="py-2 px-3 text-rose-400 font-medium">না — সম্পূর্ণ Retake নিন</td></tr>
              <tr><td className="py-2 px-3 text-slate-300">Target institution OSR accept করে না</td><td className="py-2 px-3 text-rose-400 font-medium">না — সম্পূর্ণ Retake নিন</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* মূল কথা */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 font-sans shadow-lg">
        <p><strong>মূল কথা:</strong> One Skill Retake একটি চমৎকার সুবিধা — কিন্তু শুধুমাত্র তখনই কার্যকর যখন একটিমাত্র skill আপনাকে পিছিয়ে রাখছে এবং যেখানে apply করছেন সেখানে OSR accepted। আগে যাচাই করুন, তারপর book করুন।</p>
      </div>
    </section>

    {/* ─── SECTION 7: MODULE SUMMARY ─── */}
    <section className="space-y-5">
      <h3 className="text-lg font-bold text-cyan-200 border-b border-cyan-800/50 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <p className="text-xs text-slate-300">এই module-এ আমরা IELTS পরীক্ষার পরবর্তী গুরুত্বপূর্ণ পাঁচটি বিষয় আলোচনা করেছি:</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300"><span className="text-cyan-300 font-bold">TRF পড়া:</span> TRF-এ Overall Band, চারটি individual Band, CEFR level এবং ২ বছরের validity — প্রতিটি অংশের অর্থ এখন আপনি বোঝেন।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300"><span className="text-cyan-300 font-bold">EOR:</span> Result পাওয়ার ৬ সপ্তাহের মধ্যে Writing বা Speaking-এ EOR করা যায়। Score বাড়লে fee ফেরত, না বাড়লে ফেরত নেই। Timeline ৬–৮ সপ্তাহ।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300"><span className="text-cyan-300 font-bold">Score পাঠানো:</span> Registration-এর সময় বিনামূল্যে institution নির্ধারণ করুন। পরে additional TRF-এ fee লাগে। eTRF এবং electronic verification এখন সর্বত্র গ্রহণযোগ্য।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300"><span className="text-cyan-300 font-bold">Retake সিদ্ধান্ত:</span> Band gap, weakest skill, সময় এবং cost-benefit বিশ্লেষণ করুন। প্রস্তুতি ছাড়া Retake মানে অর্থের অপচয়।</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-300 mt-0.5">•</span>
            <p className="text-slate-300"><span className="text-cyan-300 font-bold">One Skill Retake (OSR):</span> Computer-delivered IELTS-এর ৬০ দিনের মধ্যে একটি skill পুনরায় দিন। UK, Australia, NZ, Canada-র বিশ্ববিদ্যালয়ে সাধারণত গ্রহণযোগ্য — তবে UKVI এবং professional body-র ক্ষেত্রে আগে যাচাই করুন।</p>
          </div>
        </div>
      </div>

      {/* Module 10 Bridge */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
        <p>এই module-টি সম্পন্ন করার পর <span className="text-cyan-300 font-bold">Module 10: Mock Tests</span>-এ যান এবং সম্পূর্ণ পরীক্ষার অনুশীলন করুন।</p>
      </div>

      {/* CLAIM XP BUTTON */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>
  </section>
);

const MODULE_10_NOTES = (
  <div className="space-y-10 text-slate-300 leading-relaxed max-w-4xl">

    {/* ─── SECTION 1: Module Summary Overview Card ─── */}
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎯 Module 10: Mock Tests & Practice Library (বাংলায়)
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">লক্ষ্য Band: 6.5 – 8.0</span>
        </div>
      </div>
      <p className="text-sm text-slate-300">
        <strong className="text-white">লক্ষ্য:</strong> Band 6.5 থেকে 8.0 — প্রতিটি section-এ mock practice কীভাবে করবেন, কোথায় authentic materials পাবেন, এবং কীভাবে practice-কে real exam performance-এ convert করবেন।
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300 pt-2">
        <li className="flex items-center gap-2">🔹 Full-length Listening mocks</li>
        <li className="flex items-center gap-2">🔹 Full-length Reading mocks</li>
        <li className="flex items-center gap-2">🔹 Writing prompts library</li>
        <li className="flex items-center gap-2">🔹 Speaking cue card bank</li>
        <li className="flex items-center gap-2">🔹 Past-paper walkthrough</li>
      </ul>
    </div>

    {/* ─── SECTION 2: 10.1 Full-length Listening Mocks ─── */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        10.1 Full-length Listening Mocks (Cambridge IELTS Books 14–19)
      </h2>
      <p>
        Cambridge IELTS series হলো Listening practice-এর সবচেয়ে নির্ভরযোগ্য উৎস — কারণ এগুলো Cambridge University Press কর্তৃক প্রকাশিত official past papers। Books 1 থেকে 19 পর্যন্ত সবই পাওয়া যায়, কিন্তু Books 14–19 সবচেয়ে গুরুত্বপূর্ণ।
      </p>
      <p className="font-semibold text-white">কেন Books 14–19 সবচেয়ে জরুরি?</p>
      <p>
        ২০১৫ সালের পর থেকে IELTS Listening format-এ বড় পরিবর্তন এসেছে — Section 3-এ multiple speaker format আরও জটিল হয়েছে, এবং note-completion ও table-completion questions বেড়েছে। Books 14 (২০১৯) থেকে Books 19 (২০২৪) পর্যন্ত প্রতিটি test এই নতুন format অনুসরণ করে। পুরনো books-এর audio এখনও useful, কিন্তু question style এখনকার exam-এর মতো নয়।
      </p>

      <h3 className="text-lg font-semibold text-slate-200">কীভাবে Cambridge Books ব্যবহার করবেন</h3>
      <p className="text-sm text-slate-400">একটি Listening test সঠিকভাবে করার পদ্ধতি হলো:</p>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ১</span>
        <p className="text-sm mt-1">Timed condition-এ বসুন — ঘড়ি দিয়ে ৩০ মিনিট নির্ধারণ করুন, কোনো বিরতি নেই।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ২</span>
        <p className="text-sm mt-1">Audio একবারই চালান — real exam-এ দ্বিতীয়বার শোনার সুযোগ নেই।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৩</span>
        <p className="text-sm mt-1">Section শেষ হওয়ার পর answers transfer করুন — exam-এ ১০ মিনিট transfer time থাকে।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৪</span>
        <p className="text-sm mt-1">Answers check করুন এবং audio script পড়ুন — কোথায় হারিয়ে গেছেন সেটা বোঝাটাই আসল শেখা।</p>
      </div>

      <h3 className="text-lg font-semibold text-slate-200">Free Legal Sources</h3>
      <ul className="list-disc list-inside space-y-2 pl-2 text-sm">
        <li><strong className="text-slate-100">IELTS Official Website (ielts.org):</strong> Free practice Listening tests Academic ও General Training উভয়ের জন্য।</li>
        <li><strong className="text-slate-100">British Council (takeielts.britishcouncil.org):</strong> Section 2 ও Section 3 free practice materials আছে।</li>
        <li><strong className="text-slate-100">IDP IELTS (ielts.idp.com):</strong> General Training free practice tests পাওয়া যায়।</li>
        <li><strong className="text-slate-100">YouTube:</strong> Cambridge 14–19 audio অনেক channel legally upload করেছে (Cambridge official channel সহ)।</li>
      </ul>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <strong className="text-emerald-400 font-bold block mb-1">মূল কথা:</strong>
        Listening mock মানে শুধু audio চালিয়ে দেওয়া নয় — timed, no-pause, write-transfer-check এই তিনটি ধাপ মেনে না করলে real exam preparation হয় না।
      </div>
    </section>

    {/* ─── SECTION 3: 10.2 Full-length Reading Mocks ─── */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        10.2 Full-length Reading Mocks (Academic + General Training)
      </h2>
      <p className="font-semibold text-white">Academic এবং General Training Reading-এর পার্থক্য</p>
      <p>
        অনেক শিক্ষার্থী ভুলভাবে Academic ও General Training Reading practice একসাথে মিশিয়ে ফেলেন। দুটো সম্পূর্ণ আলাদা।
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
          <h3 className="text-lg font-bold text-rose-400">Academic Reading</h3>
          <ul className="text-sm space-y-1.5 text-slate-400">
            <li>• তিনটি দীর্ঘ passage (মোট প্রায় ২,৫০০–৩,০০০ শব্দ)</li>
            <li>• Scientific journals, research articles, academic magazines থেকে নেওয়া</li>
            <li>• Abstract vocabulary এবং complex sentence structure</li>
            <li>• Question types: True/False/Not Given, Matching Headings, Matching Information, Summary Completion</li>
          </ul>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
          <h3 className="text-lg font-bold text-sky-400">General Training Reading</h3>
          <ul className="text-sm space-y-1.5 text-slate-400">
            <li>• Section A: notices, advertisements, work-related materials (সহজ)</li>
            <li>• Section B: work-related longer texts</li>
            <li>• Section C: একটি দীর্ঘ general interest passage</li>
            <li>• Vocabulary বেশি practical এবং everyday</li>
          </ul>
        </div>
      </div>

      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 text-indigo-200 text-sm">
        <strong className="text-indigo-400 font-bold">গুরুত্বপূর্ণ:</strong> আপনি যদি Visa-র জন্য General Training দিচ্ছেন, শুধু GT practice করুন। University admission-এর জন্য Academic-ই করতে হবে।
      </div>

      <p className="font-semibold text-white">Cambridge Books 14–19 দিয়ে Reading Practice</p>
      <p>
        প্রতিটি Cambridge book-এ Academic version-এ ৪টি করে full Reading test আছে। Books 14–19 মিলিয়ে মোট ২৪টি Academic Reading test পাওয়া যায় — এটি সর্বোচ্চ practice material। General Training version Books 14–19-এ আলাদা GT Reading tests-ও আছে।
      </p>
      <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 my-2 text-cyan-200 font-sans shadow-md">
        <strong className="font-bold">Timing rule:</strong> ৬০ মিনিটে ৪০টি প্রশ্ন — কোনো overtime নয়।
      </div>

      <h3 className="text-lg font-semibold text-slate-200">Free Legal Sources</h3>
      <ul className="list-disc list-inside space-y-2 pl-2 text-sm">
        <li><strong className="text-slate-100">IELTS official sample tests (ielts.org):</strong> Academic ও GT উভয়ের জন্য free sample Reading tests।</li>
        <li><strong className="text-slate-100">British Council free practice tests:</strong> Academic Reading-এর তিনটি section আলাদাভাবে practice করা যায়।</li>
        <li><strong className="text-slate-100">IDP IELTS Nepal / Bangladesh portal:</strong> GT Reading free practice।</li>
      </ul>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <strong className="text-emerald-400 font-bold block mb-1">মূল কথা:</strong>
        Academic Reading-এ time management সবচেয়ে বড় challenge — প্রতিটি passage-এ ২০ মিনিটের বেশি দেওয়া যাবে না। Timed practice ছাড়া এই discipline আসে না।
      </div>
    </section>

    {/* ─── SECTION 4: 10.3 Writing Prompts Library ─── */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        10.3 Writing Prompts Library (Task 1 Charts + Task 2 Essay Prompts)
      </h2>

      <h3 className="text-lg font-semibold text-slate-200">Task 1 — Chart Description Prompts (সাম্প্রতিক Real-Exam Style)</h3>
      <p className="text-sm text-slate-400">নিচের prompts-গুলো recent IELTS exams-এ দেখা chart-type এবং topic pattern অনুসরণ করে তৈরি:</p>

      {[
        "The bar chart below shows the percentage of people using different modes of transport to commute to work in five cities in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The line graph below shows changes in the average annual temperature in three Asian cities between 2000 and 2020.",
        "The pie charts below compare the proportion of household expenditure on five categories in the UK in 1990 and 2020.",
        "The table below shows the number of international tourists visiting four countries in Southeast Asia in 2015 and 2022.",
        "The diagram below shows the process of how solar panels convert sunlight into electricity.",
        "The maps below show a small coastal town in 2005 and 2023. Summarise the changes that have taken place.",
        "The two bar charts below show the percentage of male and female graduates in six different subjects at a UK university in 2022.",
        "The line graph and table below show information about internet usage rates and average speeds in six countries in 2023.",
        "The process diagram below illustrates how glass bottles are collected, processed and recycled.",
        "The bar chart below shows energy consumption per capita (in tonnes of oil equivalent) in seven countries in 2021.",
      ].map((prompt, i) => (
        <div key={i} className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 my-2 text-cyan-200 font-sans shadow-md">
          <p className="text-sm">{i + 1}. {prompt}</p>
        </div>
      ))}

      <h3 className="text-lg font-semibold text-slate-200 mt-6">Task 2 — Essay Prompts (সাম্প্রতিক Real-Exam Style)</h3>
      <p className="text-sm text-slate-400">নিচের prompts-গুলো ২০২৪–২০২৫ IELTS sittings-এ রিপোর্ট করা topics এবং IELTS essay type patterns অনুযায়ী:</p>

      {[
        "Some people believe that competition is important in schools and workplaces, while others think cooperation is more valuable. Discuss both views and give your own opinion.",
        "In many countries, the gap between the rich and the poor is increasing. What are the causes of this problem, and what measures can be taken to address it?",
        "The use of artificial intelligence in everyday life is growing rapidly. Do the advantages of this development outweigh the disadvantages?",
        "Some people think that governments should spend more money on public transport to reduce traffic congestion, while others believe individuals should be responsible for solving this problem. Discuss both views and give your own opinion.",
        "Many young people are choosing to live and work abroad rather than staying in their home countries. What are the reasons for this, and is this a positive or negative development?",
        "Some argue that studying online is just as effective as studying at a university. To what extent do you agree or disagree?",
        "In some countries, governments are introducing laws to limit working hours and encourage more leisure time. Do the advantages of this outweigh the disadvantages?",
        "It is more important to spend money on preventing illness than treating it. To what extent do you agree or disagree?",
        "Many cities around the world are becoming increasingly crowded. What problems does this cause, and what can be done to solve them?",
        "Some people think that zoos play an important role in wildlife conservation, while others believe that they are harmful to animals. Discuss both views and give your own opinion.",
      ].map((prompt, i) => (
        <div key={i} className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 my-2 text-cyan-200 font-sans shadow-md">
          <p className="text-sm">{i + 1}. {prompt}</p>
        </div>
      ))}

      <h3 className="text-lg font-semibold text-slate-200 mt-6">Prompts কীভাবে ব্যবহার করবেন</h3>
      <p className="text-sm text-slate-400">প্রতিটি prompt practice করার সময় এই ৪ ধাপ মানুন:</p>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ১ — Analyse the prompt</span>
        <p className="text-sm mt-1">কী ধরনের essay (Opinion, Discussion, Problem-Solution, Advantage-Disadvantage)?</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ২ — Plan করুন ৫ মিনিটে</span>
        <p className="text-sm mt-1">thesis, body paragraph 1, body paragraph 2, conclusion।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৩ — Write করুন ৪০ মিনিটে</span>
        <p className="text-sm mt-1">Task 2 তে কমপক্ষে ২৫০ words।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৪ — Self-check করুন</span>
        <p className="text-sm mt-1">Task Achievement, Coherence, Vocabulary, Grammar।</p>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <strong className="text-emerald-400 font-bold block mb-1">মূল কথা:</strong>
        শুধু model answers পড়লে writing ভালো হয় না — নিজে লিখতে হবে, তারপর model-এর সাথে compare করতে হবে।
      </div>
    </section>

    {/* ─── SECTION 5: 10.4 Speaking Cue Card Bank ─── */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        10.4 Speaking Cue Card Bank (Current Month-Cycle Cue Cards)
      </h2>
      <p>
        IELTS Speaking-এর cue card বছরে তিনবার পরিবর্তন হয় — January–April, May–August, এবং September–December। নিচে current-cycle style-এ পাঁচটি category তে ভাগ করা cue card prompts দেওয়া হলো।
      </p>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 my-3">
        <h3 className="text-lg font-bold text-rose-400 mb-3">Category 1: Person (মানুষ)</h3>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a person who has had a significant positive influence on your life. You should say: who this person is, how you know them, what they did, and explain why you consider their influence to be positive.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a famous person from your country who you admire. You should say: who this person is, what they are famous for, how you learned about them, and explain why you admire them.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a person you know who is very creative or artistic.</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 my-3">
        <h3 className="text-lg font-bold text-sky-400 mb-3">Category 2: Place (স্থান)</h3>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a natural place (such as a park, mountain, river, or forest) that you have visited and enjoyed. You should say: where it is, when you went there, what you did there, and explain why you enjoyed it.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a city or town that you would like to visit in the future.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a building in your city or town that you find interesting or beautiful.</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 my-3">
        <h3 className="text-lg font-bold text-emerald-400 mb-3">Category 3: Event (ঘটনা/অনুষ্ঠান)</h3>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe an important celebration or festival in your country. You should say: what the celebration is, when it takes place, what people do during it, and explain why it is important.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a time when you had to make a difficult decision. What was the decision? What options did you consider? What did you decide? How did you feel about your decision?</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a sporting event you have watched or participated in.</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 my-3">
        <h3 className="text-lg font-bold text-amber-400 mb-3">Category 4: Object (বস্তু)</h3>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe an object that is very important to you. You should say: what it is, where you got it, how long you have had it, and explain why it is important to you.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a gift you received that was particularly meaningful.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a piece of technology (other than a mobile phone) that you use regularly.</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 my-3">
        <h3 className="text-lg font-bold text-purple-400 mb-3">Category 5: Experience (অভিজ্ঞতা)</h3>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe an experience when you tried something new for the first time. You should say: what it was, when and where it happened, why you tried it, and how you felt about it.</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a time when you helped someone solve a problem. What was the problem? How did you help? What was the outcome?</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 my-2">
          <p className="text-sm">Describe a time when you learned something from a mistake you made.</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mt-6">Cue Card Practice কীভাবে করবেন</h3>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ১ — ১ মিনিট preparation</span>
        <p className="text-sm mt-1">notes নিন, complete sentences লেখার চেষ্টা করবেন না, শুধু keywords।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ২ — ১–২ মিনিট speak</span>
        <p className="text-sm mt-1">timer রেখে practice করুন।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৩ — Record করুন</span>
        <p className="text-sm mt-1">নিজের voice record করে শুনুন — pronunciation ও fluency দুটোই ধরা পড়বে।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৪ — Part 3-এর জন্য prepare করুন</span>
        <p className="text-sm mt-1">cue card-এর থিম থেকে abstract follow-up questions আসে। যেমন "Describe a famous person" → Part 3 তে "Do you think fame has a negative impact on people's mental health?"</p>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <strong className="text-emerald-400 font-bold block mb-1">মূল কথা:</strong>
        Cue card মুখস্থ করলে exam-এ ধরা পড়ে — natural ও conversational রাখুন। Examiner fluency ও spontaneity দেখছেন, scripted speech নয়।
      </div>
    </section>

    {/* ─── SECTION 6: 10.5 Past-Paper Walkthroughs ─── */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        10.5 Past-Paper Walkthroughs (Expert-Guided Cambridge Test Solutions)
      </h2>

      <p className="font-semibold text-white">Walkthrough কেন দেখবেন এবং কীভাবে দেখবেন</p>
      <p>
        Expert walkthrough videos-এর সবচেয়ে বড় ভুল ব্যবহার হলো — প্রথমে video দেখা, তারপর test করা। এটি সম্পূর্ণ উল্টো। সঠিক পদ্ধতি:
      </p>

      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ১ — নিজে আগে test করুন</span>
        <p className="text-sm mt-1">পুরো test exam condition-এ দিন। Listening হলে ৩০ মিনিট, Reading হলে ৬০ মিনিট। কোনো help ছাড়া।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ২ — নিজে answers check করুন</span>
        <p className="text-sm mt-1">Answer key দিয়ে নিজের answers check করুন। কোন questions ভুল হলো সেগুলো চিহ্নিত করুন।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৩ — Walkthrough video দেখুন</span>
        <p className="text-sm mt-1">শুধু ভুল করা questions-এর walkthrough দেখুন। পুরো video দেখার দরকার নেই যদি সব answers ঠিক থাকে।</p>
      </div>
      <div className="border-l-4 border-cyan-500 bg-slate-900/60 rounded-r-xl p-4 my-2">
        <span className="text-cyan-400 font-bold text-sm">ধাপ ৪ — "কেন ভুল হলো" document করুন</span>
        <p className="text-sm mt-1">একটি error log রাখুন — question type, কেন ভুল হলো (distractor, vocabulary, speed, inattention), এবং পরের test-এ কীভাবে এড়াবেন।</p>
      </div>

      <p className="font-semibold text-white mt-4">Cambridge Test-এর Walkthrough থেকে সর্বোচ্চ শেখার উপায়</p>
      <p>
        Listening walkthrough দেখার সময় audio script খুলে রাখুন এবং expert যখন explain করছেন তখন পড়ুন — শব্দটা কানে পৌঁছায়নি কিনা বুঝতে পারবেন। Reading walkthrough-এ expert যখন passage থেকে evidence locate করছেন সেটা মনে রাখুন — IELTS Reading-এ সব answers text-এ আছে, আপনাকে "মনে রাখা" কিছু apply করতে হয় না।
      </p>

      <h3 className="text-lg font-semibold text-slate-200 mt-4">Recommended Test-Walkthrough Sequence</h3>
      <div className="overflow-x-auto my-4 border border-slate-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/80 text-cyan-400 font-semibold border-b border-slate-700">
            <tr>
              <th className="p-3">সপ্তাহ</th>
              <th className="p-3">Cambridge Book</th>
              <th className="p-3">Test নম্বর</th>
              <th className="p-3">Focus</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900/50 divide-y divide-slate-800">
            <tr>
              <td className="p-3">1</td>
              <td className="p-3">Book 14</td>
              <td className="p-3">Test 1</td>
              <td className="p-3">Listening + Reading (Academic)</td>
            </tr>
            <tr>
              <td className="p-3">2</td>
              <td className="p-3">Book 15</td>
              <td className="p-3">Test 2</td>
              <td className="p-3">Listening + Reading</td>
            </tr>
            <tr>
              <td className="p-3">3</td>
              <td className="p-3">Book 16</td>
              <td className="p-3">Test 3</td>
              <td className="p-3">Full 4-skill mock</td>
            </tr>
            <tr>
              <td className="p-3">4</td>
              <td className="p-3">Book 17</td>
              <td className="p-3">Test 4</td>
              <td className="p-3">Full 4-skill mock</td>
            </tr>
            <tr>
              <td className="p-3">5</td>
              <td className="p-3">Book 18</td>
              <td className="p-3">Test 1–2</td>
              <td className="p-3">Error analysis focus</td>
            </tr>
            <tr>
              <td className="p-3">6</td>
              <td className="p-3">Book 19</td>
              <td className="p-3">Test 3–4</td>
              <td className="p-3">Exam simulation</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <strong className="text-emerald-400 font-bold block mb-1">মূল কথা:</strong>
        Walkthrough video passive entertainment নয় — আগে নিজে করুন, তারপর দেখুন। শুধু দেখলে improvement হয় না।
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mt-6">প্রতি সপ্তাহে কীভাবে Practice করবেন (Module 8-এর Study Plan-এর সাথে সমন্বয়)</h3>
      <p>
        Module 8-এ আপনি যে 8-week study plan পেয়েছেন তার সাথে এই module-টি সরাসরি যুক্ত। প্রতি সপ্তাহে mock practice একটি নির্দিষ্ট rhythm-এ করুন:
      </p>
      <p className="font-semibold text-white mt-3">সাপ্তাহিক Mock Practice Schedule</p>
      <div className="overflow-x-auto my-4 border border-slate-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/80 text-cyan-400 font-semibold border-b border-slate-700">
            <tr>
              <th className="p-3">দিন</th>
              <th className="p-3">কাজ</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900/50 divide-y divide-slate-800">
            <tr>
              <td className="p-3 font-semibold text-rose-400">রবিবার (Mock Day)</td>
              <td className="p-3">সকাল: একটি full Cambridge Listening test (timed)। বিকেল: একটি full Cambridge Reading test (timed)। সন্ধ্যা: একটি Writing Task 2 essay draft (৪০ মিনিট)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-sky-400">সোমবার (Review Day)</td>
              <td className="p-3">Listening ও Reading-এর error log তৈরি। ভুল questions-এর walkthrough video দেখুন। Writing essay self-assess করুন</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-emerald-400">মঙ্গলবার–শুক্রবার (Skill Days)</td>
              <td className="p-3">Targeted practice — শুধু দুর্বল question types। Module 1–9-এর skills apply করুন</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-amber-400">শনিবার (Speaking Day)</td>
              <td className="p-3">দুটি cue card practice করুন (timer দিয়ে)। Part 3 follow-up questions নিজেই তৈরি করুন ও answer করুন</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mt-4">Monthly Milestone</h3>
      <p>
        প্রতি মাসে একটি full 4-skill mock sitting করুন — Listening (৩০ মিনিট) + Reading (৬০ মিনিট) + Writing (৬০ মিনিট) + Speaking (১৫ মিনিট) — একই দিনে। এটি আসল exam-এর mental stamina তৈরি করে।
      </p>
      <p className="mt-2">
        Mock test scores একটি notebook-এ track করুন। প্রতিটি test-এর পর কোন section-এ কত score হলো সেটা লিখুন — progress দেখতে পাবেন এবং কোথায় বেশি focus করতে হবে সেটা clear হবে।
      </p>
    </section>

    {/* ─── SECTION 7: Module Summary & Course Conclusion ─── */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
        এই Module-এ আপনি যা শিখলেন
      </h2>
      <p>
        এই module-এ আমরা mock practice-এর সম্পূর্ণ একটি framework তৈরি করেছি। সংক্ষেপে:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-2 text-sm">
        <li>Cambridge IELTS Books 14–19 হলো সবচেয়ে representative practice material — এগুলো current exam format-এ সবচেয়ে কাছের।</li>
        <li>Academic ও General Training Reading দুটো আলাদা — নিজের exam type অনুযায়ী practice করুন।</li>
        <li>Writing Task 1 তে বিভিন্ন chart type (line, bar, pie, process, map) সব practice করতে হবে; Task 2 তে সব essay type (Opinion, Discussion, Problem-Solution, Advantage-Disadvantage) চিনতে এবং structure করতে শিখতে হবে।</li>
        <li>Speaking cue card practice-এ memorization এড়িয়ে spontaneous response তৈরি করার দিকে focus করুন — প্রতিটি cycle-এ নতুন topics আসে।</li>
        <li>Walkthrough videos expert tool — কিন্তু শুধু নিজে test করার পরেই দেখুন।</li>
        <li>Module 8-এর weekly plan-এর সাথে এই module-এর mock practice সমন্বয় করলে সবচেয়ে ভালো ফলাফল পাওয়া যায়।</li>
      </ul>

      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 my-4 text-emerald-200 font-sans shadow-lg">
        <strong className="text-emerald-400 font-bold block mb-1">মূল কথা:</strong>
        আপনার target band যাই হোক — 6.5, 7.0 বা 8.0 — consistent, analyzed mock practice-ই আপনাকে সেখানে নিয়ে যাবে। শুধু tests দিলেই হবে না, প্রতিটি mistake থেকে শিখতে হবে।
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">নোট পড়া শেষ? নিচের বাটনে click করলে +10 XP পাবেন</p>
        <button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm">
          Claim +10 XP
        </button>
      </div>
    </section>

  </div>
);

const NOTES_CONTENT: Record<string, React.ReactNode> = {
  '0': MODULE_00_NOTES,
  '1': MODULE_01_NOTES,
  '2': MODULE_02_NOTES,
  '3': MODULE_03_NOTES,
  '4': MODULE_04_NOTES,
  '5': MODULE_05_NOTES,
  '6': MODULE_06_NOTES,
  '7': MODULE_07_NOTES,
  '8': MODULE_08_NOTES,
  '9': MODULE_09_NOTES,
  '10': MODULE_10_NOTES,
};

interface FreeContentLibraryViewProps {
  userEmail?: string;
}

export default function FreeContentLibraryView({ userEmail }: FreeContentLibraryViewProps) {
  const [activeModule, setActiveModule] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(MODULE_00_DATA[0].videos[0]);
  const [activeSubTopicId, setActiveSubTopicId] = useState<string>('0.1');
  const [embedFailed, setEmbedFailed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'notes'>('videos');

  const currentModuleData = activeModule === 0 ? MODULE_00_DATA : activeModule === 1 ? MODULE_01_DATA : activeModule === 2 ? READING_MODULE_DATA : activeModule === 3 ? WRITING_MODULE_DATA : activeModule === 4 ? SPEAKING_MODULE_DATA : activeModule === 5 ? GRAMMAR_MODULE_DATA : activeModule === 6 ? VOCABULARY_MODULE_DATA : activeModule === 7 ? PRONUNCIATION_MODULE_DATA : activeModule === 8 ? TEST_TAKING_STRATEGY_MODULE_DATA : activeModule === 9 ? MOCKTEST_MODULE_DATA : POST_TEST_MODULE_DATA;
  const moduleTitle = activeModule === 0 ? 'IELTS পরিচিতি' : activeModule === 1 ? 'Listening Module' : activeModule === 2 ? 'Reading Module' : activeModule === 3 ? 'Writing Module' : activeModule === 4 ? 'Speaking Module' : activeModule === 5 ? 'Grammar Foundations' : activeModule === 6 ? 'Vocabulary Building' : activeModule === 7 ? 'Pronunciation Training' : activeModule === 8 ? 'Test-Taking Strategy' : activeModule === 9 ? 'Mock Tests & Practice Library' : 'Result, EOR & Retake';
  const moduleEmoji = activeModule === 0 ? '🌸' : activeModule === 1 ? '🎧' : activeModule === 2 ? '📖' : activeModule === 3 ? '📝' : activeModule === 4 ? '🎙' : activeModule === 5 ? '📐' : activeModule === 6 ? '🔤' : activeModule === 7 ? '🗣️' : activeModule === 8 ? '🎯' : activeModule === 9 ? '🧪' : '📋';
  const currentModuleSummary = MODULE_SUMMARIES[activeModule.toString()];

  const handleSubTopicClick = (subTopicId: string) => {
    setActiveSubTopicId(subTopicId);
    const element = document.getElementById(`subtopic-${subTopicId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleModuleSwitch = (module: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => {
    setActiveModule(module);
    setActiveTab('videos');
    setEmbedFailed(false);
    const data = module === 0 ? MODULE_00_DATA : module === 1 ? MODULE_01_DATA : module === 2 ? READING_MODULE_DATA : module === 3 ? WRITING_MODULE_DATA : module === 4 ? SPEAKING_MODULE_DATA : module === 5 ? GRAMMAR_MODULE_DATA : module === 6 ? VOCABULARY_MODULE_DATA : module === 7 ? PRONUNCIATION_MODULE_DATA : module === 8 ? TEST_TAKING_STRATEGY_MODULE_DATA : module === 9 ? MOCKTEST_MODULE_DATA : POST_TEST_MODULE_DATA;
    setSelectedVideo(data[0].videos[0]);
    setActiveSubTopicId(data[0].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-[calc(100vh-32px)] bg-neutral-900 text-neutral-100 p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span>Dashboard</span>
          <ChevronRightIcon className="w-3 h-3 text-neutral-500" />
          <span className="font-semibold text-neutral-200">Free Content Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>{moduleEmoji}</span> {moduleTitle}
        </h1>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        
        {/* LEFT COLUMN: HERO PLAYER & SUBTOPICS */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-2 space-y-6">

          {/* Module Summary Header Card */}
          {currentModuleSummary && (
            <div className="bg-[#0d131f] border border-slate-800/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                  {activeModule === 0 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>}
                  {activeModule === 1 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>}
                  {activeModule === 2 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                  {activeModule === 3 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>}
                  {activeModule === 4 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>}
                  {activeModule === 5 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>}
                  {activeModule === 6 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
                  {activeModule === 7 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>}
                  {activeModule === 8 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v.01" /></svg>}
                  {activeModule === 9 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>}
                  {activeModule === 10 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {currentModuleSummary.moduleNumber}
                  </p>
                  <p className={`text-[10px] font-semibold tracking-wide uppercase ${
                    currentModuleSummary.level === 'BEGINNER' ? 'text-orange-400' : 'text-cyan-400'
                  }`}>
                    {currentModuleSummary.level}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-200 leading-relaxed mt-3 mb-4">
                {currentModuleSummary.description}
              </p>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {currentModuleSummary.duration}
                </span>
                <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                  </svg>
                  {currentModuleSummary.videoCount} videos
                </span>
                <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  {currentModuleSummary.noteLanguage}
                </span>
              </div>
            </div>
          )}

          {/* Media Tab Switcher: Videos vs Notes */}
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111827] p-1 rounded-xl flex items-center border border-slate-800/80 w-fit">
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${
                    activeTab === 'videos'
                      ? 'bg-slate-800/90 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className={`w-4 h-4 ${activeTab === 'videos' ? 'text-rose-500' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                  </svg>
                  Videos
                  <span className="bg-slate-700/60 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-medium ml-1">
                    {currentModuleSummary?.videoCount ?? 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${
                    activeTab === 'notes'
                      ? 'bg-slate-800/90 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className={`w-4 h-4 ${activeTab === 'notes' ? 'text-violet-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Notes
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'notes' ? (
            <ModuleNotesView
              moduleId={activeModule.toString()}
              subSections={MODULE_SUBSECTIONS[activeModule.toString()] || []}
            />
          ) : (
            <div className="space-y-8">
          
          {/* Featured Video Player */}
          <div className="bg-neutral-800/90 rounded-3xl border border-neutral-700/80 p-4 sm:p-6 shadow-xl overflow-hidden">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              {embedFailed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 gap-4">
                  <img
                    src={selectedVideo.thumbnailUrl}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover absolute inset-0 opacity-30"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <p className="text-sm text-neutral-300 font-medium">Video unavailable for embed</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-500 transition"
                    >
                      <PlayIcon className="w-4 h-4 fill-current" />
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  src={selectedVideo.embedUrlQuery ? selectedVideo.embedUrlQuery : `https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setEmbedFailed(false)}
                  onError={() => setEmbedFailed(true)}
                />
              )}
            </div>

            {/* Video Details Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-white leading-snug flex-1">
                  {selectedVideo.title}
                </h2>
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-500/20">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
                  +{selectedVideo.xp} XP
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="font-medium text-neutral-300">{selectedVideo.channel}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 text-neutral-400" />
                  {selectedVideo.duration}
                </span>
              </div>
            </div>

            {/* YouTube Search Fallback Link for Search-Based Embeds */}
            {selectedVideo.youtubeSearchUrl && (
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                <span>Search-based video —</span>
                <a
                  href={selectedVideo.youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium underline underline-offset-2 transition"
                >
                  Open full results on YouTube
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Hero Callout Banner */}
            <div className="mt-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-xs text-neutral-300">
              <div className="p-2 bg-rose-600 text-white rounded-xl flex-shrink-0">
                <VideoIcon className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                প্রতিটি subtopic-এর জন্য curated video — নিচের যেকোনো video-তে click করলে এই page-এই play হবে — YouTube-এ যেতে হবে না।
              </p>
            </div>
          </div>

          {/* Subtopic Sections */}
          <div className="space-y-10">
            {currentModuleData.map((subTopic) => (
              <div key={subTopic.id} id={`subtopic-${subTopic.id}`} className="space-y-4 scroll-mt-6">
                
                {/* Yellow Accent Subtopic Header */}
                <div className="border-l-4 border-amber-400 pl-3 py-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    <span className="text-amber-400 mr-2">{subTopic.id}</span>
                    {subTopic.title}
                  </h3>
                </div>

                {/* Subtopic Video List */}
                <div className="grid grid-cols-1 gap-3.5">
                  {subTopic.videos.map((video) => {
                    const isSelected = selectedVideo.id === video.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => {
                          setEmbedFailed(false);
                          setSelectedVideo(video);
                          setActiveSubTopicId(subTopic.id);
                        }}
                        className={`group flex flex-col sm:flex-row gap-4 bg-neutral-800/60 border rounded-2xl p-3.5 transition cursor-pointer ${
                          isSelected
                            ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-lg bg-rose-500/5'
                            : 'border-neutral-700/60 hover:border-neutral-600 hover:bg-neutral-800'
                        }`}
                      >
                        {/* Left Thumbnail */}
                        <div className="w-full sm:w-44 h-28 relative rounded-xl overflow-hidden bg-black flex-shrink-0">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                            <div className={`p-2 rounded-full transition transform group-hover:scale-110 ${
                              isSelected ? 'bg-rose-600 text-white' : 'bg-rose-600/90 text-white'
                            }`}>
                              <PlayIcon className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                          
                          {/* Duration Badge */}
                          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-neutral-200 text-[10px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            {video.duration}
                          </div>

                          {/* Playing Status Pill */}
                          {isSelected && (
                            <div className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                              Now playing
                            </div>
                          )}
                        </div>

                        {/* Right Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className={`text-sm font-semibold leading-snug line-clamp-2 transition ${
                              isSelected ? 'text-rose-400' : 'text-neutral-100 group-hover:text-rose-400'
                            }`}>
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-neutral-400">{video.channel}</span>
                              <span className="text-neutral-600">•</span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                ⚡ +{video.xp} XP
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-400 leading-relaxed mt-2 line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Module Navigation Bar */}
          <div className="flex items-center justify-between pb-4">
            <button
              onClick={() => handleModuleSwitch(activeModule === 0 ? 0 : activeModule === 1 ? 0 : activeModule === 2 ? 1 : activeModule === 3 ? 2 : activeModule === 4 ? 3 : activeModule === 5 ? 4 : activeModule === 6 ? 5 : activeModule === 7 ? 6 : activeModule === 8 ? 7 : activeModule === 9 ? 8 : 9)}
              disabled={activeModule === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeModule === 0
                  ? 'text-neutral-600 cursor-not-allowed opacity-40'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600'
              }`}
            >
              <ChevronRightIcon className="w-4 h-4 rotate-180" />
              {activeModule === 0 ? '' : activeModule === 1 ? 'PREVIOUS: IELTS পরিচিতি' : activeModule === 2 ? 'PREVIOUS: Listening Module' : activeModule === 3 ? 'PREVIOUS: Reading Module' : activeModule === 4 ? 'PREVIOUS: Writing Module' : activeModule === 5 ? 'PREVIOUS: Speaking Module' : activeModule === 6 ? 'PREVIOUS: Grammar Foundations' : activeModule === 7 ? 'PREVIOUS: Vocabulary Building' : activeModule === 8 ? 'PREVIOUS: Pronunciation Training' : activeModule === 9 ? 'PREVIOUS: Test-Taking Strategy' : 'PREVIOUS: Mock Tests & Practice Library'}
            </button>
            <button
              onClick={() => handleModuleSwitch(activeModule === 0 ? 1 : activeModule === 1 ? 2 : activeModule === 2 ? 3 : activeModule === 3 ? 4 : activeModule === 4 ? 5 : activeModule === 5 ? 6 : activeModule === 6 ? 7 : activeModule === 7 ? 8 : activeModule === 8 ? 9 : activeModule === 9 ? 10 : 10)}
              disabled={activeModule === 10}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeModule === 10
                  ? 'text-neutral-600 cursor-not-allowed opacity-40'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600'
              }`}
            >
              {activeModule === 0 ? 'NEXT: Listening Module' : activeModule === 1 ? 'NEXT: Reading Module' : activeModule === 2 ? 'NEXT: Writing Module' : activeModule === 3 ? 'NEXT: Speaking Module' : activeModule === 4 ? 'NEXT: Grammar Foundations' : activeModule === 5 ? 'NEXT: Vocabulary Building' : activeModule === 6 ? 'NEXT: Pronunciation Training' : activeModule === 7 ? 'NEXT: Test-Taking Strategy' : activeModule === 8 ? 'NEXT: Mock Tests & Practice Library' : activeModule === 9 ? 'NEXT: Result, EOR & Retake' : 'COURSE COMPLETED 🎉'}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: COURSE MODULES DRAWER */}
        <div className="w-full lg:w-80 flex-shrink-0 overflow-y-auto pl-2 border-l border-neutral-800 sticky top-4">
          <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-3xl p-5 shadow-xl space-y-5">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 tracking-wider uppercase">
                <BookOpenIcon className="w-4 h-4 text-neutral-400" />
                <span>Course Modules</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">11টি module — সব বিনামূল্যে</p>
            </div>

            {/* Active Module 00 */}
            <div
              onClick={() => handleModuleSwitch(0)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 0
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 0 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">00 🌸 IELTS পরিচিতি</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">শুরু থেকে — IELTS কী, কেন এবং কীভাবে</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৫৫ মিনিট</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 0 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {MODULE_00_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 01 — Listening Module */}
            <div
              onClick={() => handleModuleSwitch(1)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 1
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 1 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">01 🎧 Listening Module</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">৮টি section, ৪০টি প্রশ্ন, ৩০ মিনিট</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~১ ঘণ্টা</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 1 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {MODULE_01_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 02 — Reading Module */}
            <div
              onClick={() => handleModuleSwitch(2)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 2
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 2 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">02 📖 Reading Module</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">৩টি passage, ৪০টি প্রশ্ন, ৬০ মিনিট</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~১.৫ ঘণ্টা</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 2 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {READING_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 03 — Writing Module */}
            <div
              onClick={() => handleModuleSwitch(3)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 3
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 3 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">03 📝 Writing Module</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Task 1 & Task 2, 60 মিনিট</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৯ ঘণ্টা</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 3 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {WRITING_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 04 — Speaking Module */}
            <div
              onClick={() => handleModuleSwitch(4)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 4
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 4 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">04 🎙 Speaking Module</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">3 parts, 11–14 min</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৮ ঘণ্টা</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 4 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {SPEAKING_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 05 — Grammar Foundations */}
            <div
              onClick={() => handleModuleSwitch(5)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 5
                  ? 'border border-emerald-500/30 bg-emerald-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 5 && (
                    <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">05 📐 Grammar Foundations</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Tenses, Conditionals, Passive Voice & more</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৮ ঘণ্টা</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 5 && (
                <div className="space-y-1 pt-2 border-t border-emerald-500/20">
                  {GRAMMAR_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 06 — Vocabulary Building */}
            <div
              onClick={() => handleModuleSwitch(6)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 6
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 6 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">06 🔤 Vocabulary Building</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Lexical Resource বাড়ানোর উপায়</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৬ ঘণ্টা</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 6 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {VOCABULARY_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 07 — Pronunciation Training */}
            <div
              onClick={() => handleModuleSwitch(7)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 7
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 7 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">07 🗣️ Pronunciation Training</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Speaking band বাড়ানোর key</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৪০ মিনিট</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 7 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {PRONUNCIATION_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 08 — Test-Taking Strategy */}
            <div
              onClick={() => handleModuleSwitch(8)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 8
                  ? 'border border-amber-500/30 bg-amber-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 8 && (
                    <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">08 🎯 Test-Taking Strategy</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Exam day-এর সেরা প্রস্তুতি strategy</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৪৫ মিনিট</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 8 && (
                <div className="space-y-1 pt-2 border-t border-amber-500/20">
                  {TEST_TAKING_STRATEGY_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-amber-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 09 — Mock Tests & Practice Library */}
            <div
              onClick={() => handleModuleSwitch(9)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 9
                  ? 'border border-cyan-500/30 bg-cyan-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 9 && (
                    <span className="inline-block text-[10px] font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">09 🧪 Mock Tests & Practice Library</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Cambridge-ভিত্তিক Listening, Reading, Writing & Speaking mock tests — real exam conditions-এ প্র্যাকটিস</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৯০+ মিনিট</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 9 && (
                <div className="space-y-1 pt-2 border-t border-cyan-500/20">
                  {MOCKTEST_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 10 — Result, EOR & Retake */}
            <div
              onClick={() => handleModuleSwitch(10)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 10
                  ? 'border border-emerald-500/30 bg-emerald-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 10 && (
                    <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">10 📋 Result, EOR & Retake</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Test-এর পরে যা যা — Result, EOR এবং Retake</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৪০ মিনিট</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 10 && (
                <div className="space-y-1 pt-2 border-t border-emerald-500/20">
                  {POST_TEST_MODULE_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
