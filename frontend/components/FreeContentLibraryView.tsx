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

interface FreeContentLibraryViewProps {
  userEmail?: string;
}

export default function FreeContentLibraryView({ userEmail }: FreeContentLibraryViewProps) {
  const [activeModule, setActiveModule] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(MODULE_00_DATA[0].videos[0]);
  const [activeSubTopicId, setActiveSubTopicId] = useState<string>('0.1');
  const [embedFailed, setEmbedFailed] = useState<boolean>(false);

  const currentModuleData = activeModule === 0 ? MODULE_00_DATA : activeModule === 1 ? MODULE_01_DATA : activeModule === 2 ? READING_MODULE_DATA : activeModule === 3 ? WRITING_MODULE_DATA : activeModule === 4 ? SPEAKING_MODULE_DATA : activeModule === 5 ? GRAMMAR_MODULE_DATA : activeModule === 6 ? VOCABULARY_MODULE_DATA : activeModule === 7 ? PRONUNCIATION_MODULE_DATA : activeModule === 8 ? TEST_TAKING_STRATEGY_MODULE_DATA : activeModule === 9 ? MOCKTEST_MODULE_DATA : POST_TEST_MODULE_DATA;
  const moduleTitle = activeModule === 0 ? 'IELTS পরিচিতি' : activeModule === 1 ? 'Listening Module' : activeModule === 2 ? 'Reading Module' : activeModule === 3 ? 'Writing Module' : activeModule === 4 ? 'Speaking Module' : activeModule === 5 ? 'Grammar Foundations' : activeModule === 6 ? 'Vocabulary Building' : activeModule === 7 ? 'Pronunciation Training' : activeModule === 8 ? 'Test-Taking Strategy' : activeModule === 9 ? 'Mock Tests & Practice Library' : 'Result, EOR & Retake';
  const moduleEmoji = activeModule === 0 ? '🌸' : activeModule === 1 ? '🎧' : activeModule === 2 ? '📖' : activeModule === 3 ? '📝' : activeModule === 4 ? '🎙' : activeModule === 5 ? '📐' : activeModule === 6 ? '🔤' : activeModule === 7 ? '🗣️' : activeModule === 8 ? '🎯' : activeModule === 9 ? '🧪' : '📋';

  const handleSubTopicClick = (subTopicId: string) => {
    setActiveSubTopicId(subTopicId);
    const element = document.getElementById(`subtopic-${subTopicId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleModuleSwitch = (module: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => {
    setActiveModule(module);
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
        <div className="flex-1 min-w-0 space-y-8 overflow-y-auto pr-2">
          
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

        {/* RIGHT SIDEBAR: COURSE MODULES DRAWER */}
        <div className="w-full lg:w-80 flex-shrink-0 overflow-y-auto pl-2 border-l border-neutral-800">
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
