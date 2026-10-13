# ANTI-GRAVITY FORENSIC AUDIT REPORT: SPEAKING STUDIO ANALYSIS UI MOCK VS. REALITY MAPPING

**Date:** October 13, 2026  
**Auditor:** Principal Systems Auditor & Enterprise Data Architect  
**Target Components:**
1. `frontend/components/enterprise/speaking/SpeakingEvaluationCanvas.tsx`
2. `frontend/components/enterprise/speaking/SpeakingAnalysisView.tsx`
3. `frontend/services/speaking/speakingEvaluationService.ts`
4. `backend/app/api/routes/speaking.py` & `backend/app/schemas/speaking.py`
5. Supabase Table: `speaking_attempts` (`evaluation_payload`, `parts_data`)

---

## 1. EXECUTIVE SUMMARY & ARCHITECTURE VERDICT

The IELTS Speaking Post-Exam Analysis Canvas provides a multi-panel diagnostic interface intended to deliver candidate score telemetry, synchronized audio playback, tokenized speech-to-text error analysis, and Band 8.5+ model reconstructions.

A rigorous line-by-line forensic audit of the codebase reveals a **hybrid state**:
- **Core AI scoring, verbatim transcripts, audio persistence, and diagnostic tokenization** are **LIVE and REAL** when backed by Gemini multimodal evaluations and Supabase Storage uploads.
- However, several **critical telemetry indicators and granular sub-metrics** remain **HEURISTIC OR STATIC MOCK PLACEHOLDERS**, particularly target band personalization, phoneme confidence scoring, and right-panel 3x3 sub-criterion score tiles.

Below is the definitive itemization and reality mapping across all four audit areas.

---

## 2. DETAILED FORENSIC AUDIT CHECKLIST

### 2.1 Top KPI Snapshot Telemetry Bar

| Metric / Telemetry Field | Current Implementation Status | Classification | Forensic Code Evidence & Technical Analysis |
| :--- | :--- | :--- | :--- |
| **Overall Speaking Band** | Dynamically resolved from evaluation payload or computed as Cambridge average | **(A) Live Real Data** *(with fallback)* | **Lines 919–921:** `overallBand = Number(resolvedEvaluation?.overallBand ?? resolvedEvaluation?.overall_band ?? 6.5)`. In `backend/app/api/routes/speaking.py`, Gemini multimodal evaluation averages the 4 pillars `(fc + lr + gra + pr) / 4` rounded to the nearest half-band according to official IELTS rounding rules. When viewed without an evaluation run, it defaults to a calibrated baseline `6.5`. |
| **Target Band Gap** | Arithmetic calculation is live; target value is static fallback | **(B) Heuristic / Partial Mock** | **Lines 935–939:** `targetBand = Number(resolvedEvaluation?.targetBand ?? 7.5); bandGap = targetBand - overallBand`. The delta calculation is real math (`targetBand - overallBand`), but `targetBand` defaults to a hardcoded `7.5`. The canvas does not yet query `user_profiles.target_speaking_band` from Supabase to personalize the goal dynamically. |
| **Fluency & Pacing (WPM & Hesitations)** | Computed from AI transcription and tokenized filler analysis | **(A) Live Real Data** *(with fallback)* | **Lines 1076–1082:** Renders `currentQuestion.wpm` and `currentQuestion.fillersCount`. When evaluated through `/api/ielts/evaluate-speaking`, Gemini calculates words-per-minute per turn and counts filler occurrences (`you know`, `um`, `like`) via regex/NLP tokens. Hesitation count is calculated as `diagnosticTokens.filter(t => t.type === 'filler').length`. In bank fallback mode, calibrated Cambridge baseline values (126–134 WPM) are supplied. |
| **Pronunciation Accuracy (%)** | Macro heuristic derived from Gemini Pronunciation Band | **(B) Heuristic Placeholder** | **Lines 940–942, 1094:** `pronunciationAccuracy = Math.round(Number(resolvedEvaluation?.pronunciationAccuracy ?? 88))`. The application does not execute an acoustic forced-alignment phoneme scoring engine (e.g., Kaldi, Wav2Vec2-forced-aligner, or Azure Pronunciation Assessment). Instead, Gemini outputs an estimated percentage or the canvas defaults to `88%`. |

---

### 2.2 4-Pillar Criterion Overview Cards (FC, LR, GRA, PR)

| Pillar Metric | Current Implementation Status | Classification | Forensic Code Evidence & Technical Analysis |
| :--- | :--- | :--- | :--- |
| **Fluency & Coherence (FC)** | Parsed from multimodal evaluation response payload | **(A) Live Real Data** | Evaluated via Gemini based on speech continuity, silence length, and connector usage (`fcScore` or `fluency.score`). Default fallback: `6.5`. |
| **Lexical Resource (LR)** | Parsed from multimodal evaluation response payload | **(A) Live Real Data** | Evaluated based on vocabulary range, idiomatic expressions, and collocation accuracy (`lrScore` or `lexical.score`). Default fallback: `6.0`. |
| **Grammar Accuracy (GRA)** | Parsed from multimodal evaluation response payload | **(A) Live Real Data** | Evaluated based on clause subordination, tense consistency, and error frequency (`graScore` or `grammar.score`). Default fallback: `6.5`. |
| **Pronunciation (PR)** | Parsed from multimodal evaluation response payload | **(A) Live Real Data** | Evaluated based on overall intelligibility, rhythm, and stress patterns (`prScore` or `pronunciation.score`). Default fallback: `7.0`. |

*Forensic Note:* When an evaluation completes via `SpeakingExamWorkspace.tsx` $\to$ `/api/ielts/evaluate-speaking`, all 4 pillar scores are genuinely generated by Gemini against official IELTS descriptors and stored in `speaking_attempts.evaluation_payload`.

---

### 2.3 Question-by-Question Inspector & Tabs (Part 1, Part 2, Part 3)

| Component / Sub-System | Current Implementation Status | Classification | Forensic Code Evidence & Technical Analysis |
| :--- | :--- | :--- | :--- |
| **Question Lists & Prompts** | Hydrated from candidate attempt record or Cambridge test bank | **(A) Live Real Data** | **Lines 108–159, 537–689:** Prompts are dynamically extracted from `storedPartsData` (candidate's actual exam questions). If missing, it falls back to `CAMBRIDGE_SPEAKING_BANK_EXTENDED` indexed by `bookNumber` and `testNumber`. |
| **Audio Playback** | Linked to persistent Supabase Storage URLs | **(A) Live Real Data** | In `SpeakingExamWorkspace.tsx`, audio recordings (`p1-q0..3`, `p2`, `p3-q0..3`) are uploaded to Supabase Storage bucket `speaking_audio` under `attempts/${attemptId}/${key}.webm`. The public/signed URL is passed into `currentQuestion.candidateAudioUrl`. |
| **Annotated Transcript & Tokens** | Parsed from Gemini multimodal transcription and token categorization | **(A) Live Real Data** *(with fallback)* | **Lines 1321–1362:** Each word/phrase is tokenized into `filler`, `grammar`, `collocation`, and `neutral`. In live evaluated mode, Gemini generates the `diagnosticTokens` array with explanations and `suggestedFix`. When un-evaluated, authentic Cambridge benchmark mock tokens are provided. |

---

### 2.4 Evaluator Rubric & Model Reconstructions (Right Panel)

| Diagnostic Widget | Current Implementation Status | Classification | Forensic Code Evidence & Technical Analysis |
| :--- | :--- | :--- | :--- |
| **Pillar Sub-Metric Score Tiles** | Hardcoded numeric values in JSX template | **(B) Mock Placeholder** | **Lines 1404–1416, 1441–1453, 1479–1490, 1515–1527:** While the top-level pillar scores (e.g., Fluency `6.5`) are real, the 3 sub-metrics per pillar (e.g., Speech Rate `7.0`, Cohesion `6.5`, Pausing `6.0`; Diversity `6.5`, Collocations `6.0`, Paraphrasing `6.0`) are **statically hardcoded in the TSX code**! |
| **Examiner Critique Strengths & Growth** | Dynamic LLM critique per question | **(A) Live Real Data** | Mapped from `currentQuestion.examinerCritique` (`fc`, `lr`, `gra`, `pr`), populated by Gemini's multimodal output. |
| **Band 8.5+ Model Discourse Rewrites** | Generated dynamically via LLM prompt per question | **(A) Live Real Data** *(with fallback)* | **Lines 1551–1600:** In live evaluation, Gemini generates `modelAnswerText` and `modelUpgrades` specifically addressing the candidate's prompt and lexical slips. In offline/bank mode, curated Cambridge Band 8.5+ models are provided. |
| **Model Audio Synthesis** | Web Speech API speech synthesis of model text | **(A) Live Real Feature** | Line 869: Uses `speakText(currentQuestion.modelAnswerText)` via browser speech synthesis with play/stop toggle. |

---

## 3. IDENTIFIED MOCK TOUCHPOINTS MATRIX

| Area | Component Element | Reality Level | Root Cause |
| :--- | :--- | :--- | :--- |
| **Top KPI** | Target Band (7.5) | **Mock (B)** | No query to `user_profiles.target_speaking_band` |
| **Top KPI** | Pronunciation Accuracy (88%) | **Heuristic (B)** | No acoustic phoneme forced-alignment engine |
| **Right Panel** | FC Sub-metrics (7.0, 6.5, 6.0) | **Mock (B)** | Hardcoded numbers in TSX card |
| **Right Panel** | LR Sub-metrics (6.5, 6.0, 6.0) | **Mock (B)** | Hardcoded numbers in TSX card |
| **Right Panel** | GRA Sub-metrics (6.5, 6.5, 6.0) | **Mock (B)** | Hardcoded numbers in TSX card |
| **Right Panel** | PR Sub-metrics (7.0, 7.5, 6.5) | **Mock (B)** | Hardcoded numbers in TSX card |

---

## 4. SUPABASE DATABASE SCHEMA SPECIFICATIONS FOR 100% FUNCTIONALITY

To transition all mock touchpoints to 100% live database-grounded functionality, the following schema additions and payload structure must be implemented in Supabase:

### 4.1 Schema Migration (`speaking_attempts` & `user_profiles`)

```sql
-- 1. Ensure user_profiles contains target speaking preferences
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS target_speaking_band numeric(2,1) DEFAULT 7.5,
ADD COLUMN IF NOT EXISTS speaking_weak_pillars text[] DEFAULT ARRAY['lexical', 'pronunciation'];

-- 2. Extend speaking_attempts with granular sub-metrics and omission tracking
ALTER TABLE public.speaking_attempts
ADD COLUMN IF NOT EXISTS pronunciation_accuracy integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS omitted_questions_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_questions_count integer DEFAULT 9,
ADD COLUMN IF NOT EXISTS evaluation_payload jsonb DEFAULT '{}'::jsonb;

-- 3. Index for efficient querying by user and attempt
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_user_created 
ON public.speaking_attempts (user_id, created_at DESC);
```

### 4.2 Standardized `evaluation_payload` JSONB Contract

The `speaking_attempts.evaluation_payload` JSONB document must adhere to this unified schema:

```json
{
  "attempt_id": "c92f8b50-13a8-4c07-b3c9-0a6e5a4d3e21",
  "overall_band": 6.5,
  "target_band": 7.5,
  "target_gap": -1.0,
  "pronunciation_accuracy": 84,
  "pillars": {
    "fc": {
      "band": 6.5,
      "speech_rate": 7.0,
      "cohesion": 6.5,
      "pausing": 6.0
    },
    "lr": {
      "band": 6.0,
      "diversity": 6.5,
      "collocations": 6.0,
      "paraphrasing": 6.0
    },
    "gra": {
      "band": 6.5,
      "complexity": 6.5,
      "control": 6.5,
      "error_density": 6.0
    },
    "pr": {
      "band": 7.0,
      "phonemes": 7.0,
      "word_stress": 7.5,
      "intonation": 6.5
    }
  },
  "questions": [
    {
      "question_id": "p1_q0",
      "part": 1,
      "question_index": 0,
      "prompt": "What kinds of things make you laugh?",
      "short_label": "Laugh Triggers",
      "status": "answered",
      "candidate_audio_url": "https://xyz.supabase.co/storage/v1/object/public/speaking_audio/attempts/c92f8b50/p1-q0.webm",
      "duration_seconds": 38.5,
      "transcript_text": "Well, spontaneous humor and funny situations...",
      "wpm": 134,
      "fillers_count": 1,
      "grammar_slips_count": 1,
      "collocations_count": 2,
      "sub_metrics": {
        "fc_sub": { "speech_rate": 7.5, "cohesion": 7.0, "pausing": 6.5 },
        "lr_sub": { "diversity": 6.5, "collocations": 7.0, "paraphrasing": 6.0 },
        "gra_sub": { "complexity": 7.0, "control": 6.5, "error_density": 6.5 },
        "pr_sub": { "phonemes": 7.5, "word_stress": 7.5, "intonation": 7.0 }
      },
      "diagnostic_tokens": [
        {
          "text": "you know",
          "type": "filler",
          "explanation": "Conversational hesitation marker",
          "suggested_fix": "Pause briefly or replace with formal signpost"
        }
      ],
      "model_answer_text": "Primarily, wry observational humor and spontaneous banter...",
      "model_upgrades": ["wry observational humor", "spontaneous banter"],
      "examiner_critique": {
        "fc": "Maintained a fluid response rhythm without unnatural speech termination.",
        "lr": "Demonstrated accurate idiomatic grasp with 'decompress after work'.",
        "gra": "Compound structure used effectively.",
        "pr": "Clear syllable articulation with accurate nuclear stress."
      }
    },
    {
      "question_id": "p1_q1",
      "part": 1,
      "question_index": 1,
      "prompt": "Do you like watching comedies on TV or in cinema?",
      "short_label": "Comedy on TV",
      "status": "omitted",
      "candidate_audio_url": null,
      "transcript_text": "",
      "wpm": 0,
      "fillers_count": 0,
      "grammar_slips_count": 0,
      "collocations_count": 0,
      "diagnostic_tokens": [],
      "model_answer_text": "Without hesitation, I tend to favor consuming comedy on television...",
      "model_upgrades": ["consuming comedy on television", "sensory spectacles"],
      "metrics": {
        "band_score": 0.0,
        "wpm": 0,
        "reason": "No speech sample captured — question omitted by candidate."
      }
    }
  ]
}
```

---

## 5. ACTIONABLE IMPLEMENTATION ROADMAP

1. **Frontend UI Sub-Metric Wiring:** Bind the 3x3 sub-metric score tiles in `SpeakingEvaluationCanvas.tsx` to read dynamically from `currentQuestion.subMetrics` or `resolvedEvaluation.pillars`, falling back to pillar totals rather than static constants.
2. **Enterprise Omitted Question Protocol:** Implement specialized rendering for questions where `status === 'omitted'`:
   - Red warning indicator on question tabs (`🔴 Q2 · Omitted`).
   - Inert audio player displaying `[ ⚠️ NO AUDIO STREAM CAPTURED ]`.
   - Formal transcript notice: *"This question was left unanswered during the examination. No speech sample was provided for linguistic or phonetic analysis."*
   - Sub-metric tiles displaying `N/A` with `border-zinc-800 text-zinc-500`.
   - Official Band 8.5+ model reconstruction preserved for learning review.
3. **User Profile Integration:** Fetch user's `target_speaking_band` from `user_profiles` to replace the hardcoded `7.5` default.

---
*Report Certified by: Lead Frontend & Backend Architect, Antigravity AI Systems*
