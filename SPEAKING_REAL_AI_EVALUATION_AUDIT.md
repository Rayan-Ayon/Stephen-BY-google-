# Forensic Diagnostic Audit: Multi-Question Audio-to-Transcript Pipeline, Gemini Multimodal Evaluation & Analysis Canvas Grounding

**Document Classification:** Technical Architecture & Forensic Diagnostic Report  
**Target Subsystems:** `SpeakingExamWorkspace.tsx`, `speaking.py`, `SpeakingEvaluationCanvas.tsx`, `SpeakingHistoryMatrix.tsx`  
**Execution Mode:** STRICTLY READ-ONLY AUDIT (Zero production code modifications applied)  
**Date of Audit:** October 12, 2026  

---

## Executive Summary

This forensic audit investigates the end-to-end IELTS Speaking pipeline: from live audio capture in the proctored exam workspace (`SpeakingExamWorkspace.tsx`), to backend Gemini multimodal transcription and scoring (`backend/app/api/routes/speaking.py`), and through to the diagnostic visualization and history rehydration views (`SpeakingEvaluationCanvas.tsx` and `SpeakingHistoryMatrix.tsx`).

### Critical Root-Cause Findings

1. **Volatile In-Memory Audio URLs & Single-Question Dropping:**  
   While `SpeakingExamWorkspace.tsx` successfully records audio per prompt into a local JavaScript ref `recordedBlobsRef.current`, on final test submission (`handleSubmitFinalAttempt`), **only the currently active question's audio blob** is submitted to `/api/ielts/evaluate-speaking`. The remaining 8 question audio buffers (across Part 1, Part 2, and Part 3) are completely omitted from backend transmission. Furthermore, the URLs saved in the attempt record are transient `blob:http...` object URLs that expire immediately when the tab closes or reloads.
2. **Backend Single-File & Non-Tokenized Gemini Endpoint:**  
   The backend route `/api/ielts/evaluate-speaking` expects a single file upload (`file: UploadFile`) rather than a multi-part, multi-question audio payload. While Gemini's multimodal audio API (`gemini-3.6-flash` / `gemini-2.0-flash`) is utilized, the model prompt only returns global 4-pillar scores and generic sub-criteria quotes. It does **not** return token-level categorized spans (`filler`, `grammar`, `collocation`) or per-question verbatim transcripts with WPM analytics.
3. **Hardcoded Review Mode Flag & Broken History Unpacking:**  
   When opening historical tests from `SpeakingHistoryMatrix.tsx`, the component hardcodes `isReviewMode={true}` and passes `storedPartsData={selectedAttempt.parts_data}`. However, `selectedAttempt.parts_data` resolves to `null` because `exam_attempts` in Supabase stores the data under `answers_payload`, but the database mapper erroneously queries `row.answers_payload.parts_data`.
4. **Mock Fallback Overwrite in Analysis Canvas:**  
   `hydrateQuestionSet()` in `SpeakingEvaluationCanvas.tsx` ignores candidate audio URLs and real transcripts, hardcoding Cambridge 7 Test 2 mock transcripts ("Laugh Triggers", "Value of Laughter", etc.). Because `isReviewMode` is true, the UI forces the header into `[ CANDIDATE RECORDING ARCHIVE ]` with `ARCHIVE STATUS`, hiding the executive KPI telemetry row (`OVERALL SPEAKING BAND`, `TARGET GAP`, `FLUENCY & PACING`, `PRONUNCIATION`).

---

## 1. File Inventory & Code Locations

The following table catalogs the authoritative file paths, line ranges, and functions governing this pipeline:

| Subsystem / Responsibility | File Path | Key Line Ranges | Primary Functions / Symbols |
| :--- | :--- | :--- | :--- |
| **Multi-Question Audio Capture** | `frontend/src/components/mock-tests/speaking/SpeakingExamWorkspace.tsx` | Lines 108–118<br>Lines 457–500<br>Lines 511–529<br>Lines 308–324 | `handleStartAnswer()`<br>`handleStopRecording()`<br>`handleReRecord()`<br>`useEffect([currentPart, questionIndex])` |
| **Final Test Submission & Packaging** | `frontend/src/components/mock-tests/speaking/SpeakingExamWorkspace.tsx` | Lines 648–684<br>Lines 711–747<br>Lines 752–760<br>Lines 783–801 | `handleSubmitFinalAttempt()`<br>`attemptRecord` assembly<br>`localStorage` writing<br>Supabase `exam_attempts` insert |
| **Backend Route & Gemini Ingestion** | `backend/app/api/routes/speaking.py` | Lines 549–608<br>Lines 645–694<br>Lines 722–741<br>Lines 766–790 | `@router.post("/ielts/evaluate-speaking")`<br>`client.files.upload()`<br>`calculate_overall_band()`<br>Supabase persistence |
| **Backend Speaking Schemas** | `backend/app/schemas/speaking.py` | Lines 5–37<br>Lines 38–71<br>Lines 94–115 | `CriteriaBreakdown`<br>`SubCriterionProof`<br>`SpeakingEvaluationResponse` |
| **Analysis Canvas Hydration & UI Modes** | `frontend/components/enterprise/speaking/SpeakingEvaluationCanvas.tsx` | Lines 8–45<br>Lines 98–370<br>Lines 830–845<br>Lines 875–1025<br>Lines 1310–1402 | `hydrateQuestionSet()`<br>`isReviewMode` header toggle<br>Executive KPI vs Archive Strip<br>4-Pillar vs Cambridge Guidelines |
| **Speaking History Matrix Persistence** | `frontend/components/enterprise/speaking/SpeakingHistoryMatrix.tsx` | Lines 46–139<br>Lines 343–350<br>Lines 360–372 | `loadAttempts()` (Supabase + LocalStorage)<br>`[ VIEW ANALYSIS → ]` action<br>Canvas Portal mount |
| **Analysis Wrapper Shell** | `frontend/components/enterprise/speaking/SpeakingAnalysisView.tsx` | Lines 27–64 | `SpeakingAnalysisView` pass-through wrapper |
| **Speaking Shared Types** | `frontend/src/components/mock-tests/speaking/speakingExamShared.ts` | Lines 15–63 | `SpeakingTestData`, `SpeakingEvaluation` |

---

## 2. Forensic Investigation & Findings

### Task A: Audio Capture, Multi-Question Buffer & Upload Audit

#### 1. Audio Capture Mechanics per Part
In `SpeakingExamWorkspace.tsx`:
- **Part 1 (Personal Interview, Q1–Q4):**  
  Each prompt is presented sequentially. When the candidate clicks record (`handleStartAnswer`, line 447), a browser `MediaRecorder` (`audio/webm`, 16 kHz mono) is initiated. When recording stops (`recorder.onstop`, lines 468–484), the audio chunk array is converted into a `Blob`. The blob, its local object URL (`URL.createObjectURL(blob)`), and duration are stored in state and ref:
  ```typescript
  const key = currentPart === 2 ? 'p2' : `p${currentPart}-q${questionIndex}`;
  const next = { ...prev, [key]: { blob, url, duration: dur } };
  recordedBlobsRef.current = next;
  ```
  Part 1 keys are formatted as `p1-q0`, `p1-q1`, `p1-q2`, `p1-q3`.
- **Part 2 (Individual Long Turn / Cue Card):**  
  Part 2 progresses through three sub-phases: `'rules'` $\to$ `'prep'` (60s countdown in total silence) $\to$ `'speaking'`. When candidate records their 1–2 minute monologue, it is saved under the key `'p2'`.
- **Part 3 (Two-way Discussion, Q1–Q4):**  
  Captured identically to Part 1 under keys `p3-q0`, `p3-q1`, `p3-q2`, `p3-q3`.
- **Inter-Question Navigation State:**  
  When navigating using `handleNextQuestion()` / `handlePrevQuestion()`, `useEffect` (lines 308–324) checks `recordedBlobsRef.current[currentKey]`. If a recorded buffer exists for that prompt, it successfully restores `audioBlob`, `audioUrl`, and sets `recordingState = 'recorded'`.

#### 2. The Final Submission Defect in `handleSubmitFinalAttempt()`
When the test concludes, `handleSubmitFinalAttempt()` (lines 648–815) executes with two critical architectural flaws:

1. **Only the Active Question is Sent to AI:**
   Lines 665–674:
   ```typescript
   if (audioBlob) {
       const formData = new FormData();
       formData.append('file', audioBlob, `speaking-attempt-p${currentPart}-q${questionIndex}.webm`);
       formData.append('question_prompt', currentPromptText);
       const response = await fetch('/api/ielts/evaluate-speaking', { method: 'POST', body: formData });
   }
   ```
   `audioBlob` references only the single question active when the submit button was clicked (typically Part 3, Question 4). The other 8 recorded audio files in `recordedBlobsRef.current` are never transmitted to the backend.
2. **Volatile URLs Written to Persistent Storage:**
   Lines 711–745:
   ```typescript
   const blobs = recordedBlobsRef.current;
   candidateAudioUrl: blobs[`p1-q${idx}`]?.url || ...
   ```
   The URLs stored in `parts_data` are `blob:http://localhost:3000/...` strings created by `URL.createObjectURL`. These URLs are tied to the active browser tab's RAM. They are completely invalid once the session ends, page refreshes, or when loaded by a different browser session.
3. **Audio is Never Uploaded to Permanent Storage:**  
   Neither `SpeakingExamWorkspace.tsx` nor the backend uploads the audio files to Supabase Storage (e.g., bucket `speaking-recordings`). As a result, candidate audio is lost forever upon tab closure.

---

### Task B: Gemini Speech-to-Text & Diagnostic Evaluation Pipeline

#### 1. Backend Route Inspection (`backend/app/api/routes/speaking.py`)
- **Endpoint Structure:**  
  The endpoint `@router.post("/ielts/evaluate-speaking")` (lines 549–598) parses either JSON or FormData. In FormData mode:
  ```python
  form_file = form.get("file")
  if isinstance(form_file, UploadFile):
      file = form_file
  ```
  It only receives a **single UploadFile** named `file`. There is no handling for multipart file arrays or multi-question maps.
- **Gemini Model Configuration:**  
  Line 604:
  ```python
  eval_model = GEMINI_MODEL or "gemini-2.0-flash"
  eval_models = [eval_model, "gemini-3.5-flash", "gemini-3.1-flash-lite"]
  ```
  In `backend/app/core/config.py`, `GEMINI_MODEL` is configured as `"gemini-3.6-flash"`.
- **Multimodal Audio Ingestion:**  
  Lines 661–685:  
  The audio file is written to a temporary local disk file, then uploaded directly to Google Gemini's Files API:
  ```python
  uploaded_file = client.files.upload(file=tmp_path)
  response = await client.aio.models.generate_content(
      model=eval_model,
      contents=[
          types.Part.from_uri(file_uri=uploaded_file.uri, mime_type=uploaded_file.mime_type),
          prompt,
      ],
      config=types.GenerateContentConfig(
          system_instruction=SPEAKING_EVAL_SYSTEM_INSTRUCTION,
          response_mime_type="application/json",
          response_schema=SpeakingEvaluationResponse,
      ),
  )
  ```
  Gemini ingests the raw WebM audio directly without an external Speech-to-Text service.

#### 2. Prompt Engineering & Missing Token Tagging Defect
- **Lack of Verbatim Transcription:**  
  The prompt passed to Gemini (lines 664–669) requests:
  > "Listen to the audio recording and provide a detailed evaluation following the official IELTS Speaking band descriptors. Return your evaluation as JSON matching the exact schema."
  
  The model is never instructed to generate a word-for-word verbatim transcription of the candidate's speech. As a result, `response.transcript` is often omitted or contains only high-level summary sentences.
- **Lack of Token-Level Diagnostic Tagging:**  
  In `backend/app/schemas/speaking.py`:
  `SpeakingEvaluationResponse` contains criteria scores (`fc_score`, `lr_score`, etc.) and 15 sub-criterion objects (`SubCriterionProof` with `evidence_quote` and `correction_or_tip`).  
  However, it lacks any structure for:
  * Word-level or span-level tokens (`diagnosticTokens`).
  * Classification tags: `'filler'` (amber hesitation markers), `'grammar'` (red slips), `'collocation'` (green Band 8+ natural phrasings).
  * Words Per Minute (WPM) and pacing telemetry.
  * Question-specific Band 8.5+ model reconstructions.

---

### Task C: UI State Unification in `SpeakingEvaluationCanvas.tsx`

#### 1. The Condition Governing Header & KPI Telemetry
Lines 835–950 in `SpeakingEvaluationCanvas.tsx` show the root cause of the offline placeholder display:
```tsx
// Header Badge Toggle (lines 835-843)
{isReviewMode ? (
    <span className="... bg-amber-500/10 text-amber-400 border-amber-500/30">
        [ CANDIDATE RECORDING ARCHIVE ]
    </span>
) : (
    <span className="... bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
        VERIFIED AI ASSESSMENT
    </span>
)}

// Executive KPI Strip Toggle (lines 875-952)
{isReviewMode ? (
    // Renders 4-Card Candidate Recording Archive strip:
    // 1. ARCHIVE STATUS ("3 Parts Complete")
    // 2. INTERVIEW DURATION ("12m 45s Elapsed")
    // 3. AUDIO RECORDING ("Saved 00:38")
    // 4. EVALUATION STATE ("Review Only · AI Scoring Deferred")
) : (
    // Renders 4-Card Executive AI Telemetry strip:
    // 1. OVERALL SPEAKING BAND ("Band 6.5 / 9.0 · CEFR B2")
    // 2. TARGET BAND GAP ("-1.0 · Target 7.5")
    // 3. FLUENCY & PACING ("132 WPM · 1 hesitation pause")
    // 4. PRONUNCIATION ACCURACY ("88% Accuracy · Clean Stress")
)}
```

#### 2. Why the Offline Header Rendered Instead of the Real Score
The canvas has a boolean prop `isReviewMode?: boolean` (defaulting to `false`).
1. In `SpeakingHistoryMatrix.tsx` line 367, whenever a user clicks `[ VIEW ANALYSIS → ]`, it explicitly passes:
   `<SpeakingEvaluationCanvas ... isReviewMode={true} />`
2. Because `isReviewMode` is hardcoded to `true`, the canvas assumes the attempt has never been evaluated by AI, unconditionally switching off the entire Executive KPI Telemetry row and showing the "AI Scoring Deferred · Archive Review" placeholder.
3. The component fails to check whether real AI evaluation data actually exists in `props.evaluation` or `props.storedPartsData`.

#### 3. Data Binding Mappings in Left and Right Panes
- **Left Pane (Transcript & Tokens):**  
  `currentQuestion` is resolved from `allPartsData[activePart].questions[activeQuestionIndex]` via `hydrateQuestionSet()` (lines 98–370).
  * `hydrateQuestionSet()` only reads `prompt` from `storedPartsData` (line 111).
  * It completely discards `candidateText`, `candidateAudioUrl`, and `diagnosticTokens` stored in the attempt record.
  * Instead, it evaluates hardcoded regular expressions matching Cambridge 7 Test 2 topics (`/laugh/i`, `/comed.*tv/i`, `/electronic.*device/i`). If matched, it injects static pre-baked mock tokens (lines 173–181). For any other question, it injects a generic placeholder: `"Well, regarding [topic], I believe it plays an important role..."` (lines 303–312).
  * `candidateAudioUrl` on `SpeakingQuestionItem` is never populated by `hydrateQuestionSet()`, so `activeAudioSource` always falls back to the top-level `props.audioUrl`.
- **Right Pane (4-Pillar vs Cambridge Objectives):**  
  Lines 1310–1402 toggle the top section of the right pane based on `isReviewMode`:
  * When `isReviewMode === true`: Displays static Cambridge Examiner Objectives ("Examiner assesses candidate ability to communicate opinions...", lines 1324–1399).
  * When `isReviewMode === false`: Displays the 4-Pillar Evaluator Rubric with sub-metric cards for the active pillar (`expandedPillar`: FC, LR, GRA, PR) with strengths, areas for growth, and booster tips (lines 1403–1564).
  * Below that, lines 1568–1619 display the **Band 8.5+ Model Reconstruction**, but it uses `currentQuestion.modelAnswerText` from the static bank rather than real AI generated rewrites.

---

### Task D: History Matrix Persistence & Round-Trip Rehydration

#### 1. Persistence Serialization in `SpeakingExamWorkspace.tsx`
When `handleSubmitFinalAttempt()` runs, it saves the attempt to two destinations:
1. `localStorage.setItem('speaking_attempts_history', ...)` (lines 752–760)
2. Supabase table `exam_attempts` (lines 785–798):
   ```typescript
   await (supabase as any).from('exam_attempts').insert([{
       test_id: currentExamId,
       module: 'speaking',
       title: attemptRecord.exam_name,
       band_score: 0,                   // <-- Hardcoded 0
       correct_count: 0,
       total_questions: 9,
       time_spent_seconds: elapsedSeconds || 765,
       answers_payload: attemptRecord.parts_data, // <-- Directly assigns parts_data
       book_number: Number(activeBook),
       test_number: Number(activeTest),
       category: category || 'academic',
       status: 'COMPLETED',
   }]);
   ```

#### 2. The Database Deserialization Bug in `SpeakingHistoryMatrix.tsx`
In `SpeakingHistoryMatrix.tsx` (lines 73–106), when querying `exam_attempts`:
```typescript
const mappedDb: SpeakingAttempt[] = dbAttempts.map((row: any) => {
    const payload = row.answers_payload || {};
    return {
        ...
        overall_band: row.overall_band != null ? Number(row.overall_band).toFixed(1) : 'Pending',
        criteria_status: 'Recorded (3 Parts)',
        status: 'COMPLETED',
        parts_data: payload.parts_data || null, // <-- CRITICAL BUG!
        created_at: row.created_at,
    };
});
```
* **The Root Cause:** In `SpeakingExamWorkspace`, `answers_payload` is set directly to `attemptRecord.parts_data` (an object with `{ part1, part2, part3 }`).  
  However, in `SpeakingHistoryMatrix`, it attempts to read `payload.parts_data`.  
  Because `payload` *is* the parts data, `payload.parts_data` is `undefined`!  
  Consequently, `parts_data` is stored as `null` for all attempts retrieved from Supabase.
* **The Canvas Portal Call:**  
  Lines 360–372:
  ```tsx
  <SpeakingEvaluationCanvas
      attemptId={selectedAttempt.id}
      bookNumber={selectedAttempt.book_number}
      testNumber={selectedAttempt.test_number}
      examTitle={selectedAttempt.exam_name}
      isOpen={true}
      isReviewMode={true}                      // <-- Hardcoded review mode
      storedPartsData={selectedAttempt.parts_data} // <-- Passing null!
      onClose={() => setSelectedAttempt(null)}
  />
  ```
  Because `storedPartsData` is `null` and `evaluation` is omitted entirely, `SpeakingEvaluationCanvas` has zero access to actual candidate recordings, transcripts, or AI evaluations, forcing the complete fallback onto mock data.

---

## 3. End-to-End Audio Data Flow Architecture

The diagram below illustrates the target lifecycle of multi-question candidate audio—from browser capture to storage, multimodal evaluation, database persistence, and analysis canvas rehydration:

```
+-------------------------------------------------------------------------------------------------------------+
|                                        BROWSER: SpeakingExamWorkspace                                        |
|                                                                                                             |
|   Part 1 (Q1-Q4)        Part 2 (Cue Card)        Part 3 (Q1-Q4)                                             |
|   [MediaRecorder]       [MediaRecorder]          [MediaRecorder]                                            |
|          |                     |                        |                                                   |
|   `p1-q0`...`p1-q3`           `p2`               `p3-q0`...`p3-q3`                                          |
|   Blobs in Memory       Blob in Memory           Blobs in Memory                                            |
|          \                     |                       /                                                    |
|           +--------------------+----------------------+                                                     |
|                                |                                                                            |
|                                v                                                                            |
|             1. Upload 9 Audio Blobs to Supabase Storage                                                     |
|                Bucket: `speaking-recordings/{userId}/{attemptId}/p1_q0.webm`                                |
|                Get Signed / Public CDN URLs                                                                 |
|                                |                                                                            |
|                                v                                                                            |
|             2. Post Multi-Question Package to Backend                                                       |
|                POST /api/ielts/evaluate-speaking-full                                                       |
|                Payload: MultiQuestionSubmissionPayload (JSON + Audio URLs or Multipart)                     |
+--------------------------------|----------------------------------------------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------------------------------------------------+
|                                  BACKEND: FastAPI + Google Gemini Multi-Turn                                 |
|                                                                                                             |
|   Stage 1: Multimodal Ingestion & Verbatim STT (Gemini 3.6 Flash / 2.0 Flash)                               |
|   - Ingest audio per question $\to$ extract exact candidate transcript with filler tokens ("um", "uh")     |
|   - Calculate exact duration & Speaking Pace (WPM = words / (duration / 60))                                |
|                                |                                                                            |
|   Stage 2: Grounded Diagnostic Evaluation & Token Annotation                                                |
|   - Official Cambridge 4-Pillar Scoring: FC, LR, GRA, PR (Band 4.0 - 9.0 rounded to 0.5)                   |
|   - Diagnostic Token Tagging: Substring matching against transcript:                                        |
|     * 'filler' (amber hesitation marker)                                                                    |
|     * 'grammar' (red morphological/lexical slip)                                                            |
|     * 'collocation' (green Band 8.5+ native phrasing)                                                       |
|   - Band 8.5+ Model Discourse Rewrite per question with lexical upgrades list                               |
|   - Overall Band Calculation: round(((fc + lr + gra + pr) / 4) * 2) / 2                                     |
|                                |                                                                            |
|                                v                                                                            |
|   Stage 3: Persistence to Supabase                                                                          |
|   - `exam_attempts` (module='speaking', band_score=overallBand, answers_payload=unifiedPayload)             |
|   - `speaking_submissions` (15-subcriteria breakdown + tokens + rewrites)                                   |
+--------------------------------|----------------------------------------------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------------------------------------------------+
|                              PRESENTATION: SpeakingEvaluationCanvas & History Matrix                        |
|                                                                                                             |
|   1. SpeakingHistoryMatrix:                                                                                 |
|      - Reads `row.answers_payload` directly (or unwraps `payload.parts_data || payload`)                    |
|      - Distinguishes evaluation state: `isEvaluated = attempt.overall_band > 0`                             |
|      - Passes `evaluation={attempt.evaluation}` and `storedPartsData={attempt.parts_data}`                 |
|                                                                                                             |
|   2. SpeakingEvaluationCanvas:                                                                              |
|      - `isReviewMode` automatically computed: `isReviewMode = !evaluation && overallBand <= 0`             |
|      - Top Badge: `VERIFIED AI ASSESSMENT` (Emerald)                                                        |
|      - KPI Strip: Band 6.5 | Target Gap -1.0 | 134 WPM | 88% Pronunciation                                  |
|      - Left Pane: Audio player loads persistent CDN URL; transcript highlights yellow/red/green tokens      |
|      - Right Pane: Active pillar switcher (FC, LR, GRA, PR) + dynamic Band 8.5+ model answer                |
+-------------------------------------------------------------------------------------------------------------+
```

---

## 4. Technical Data Contract Specifications

### 4.1 Multi-Question Submission Payload

#### TypeScript Specification (Client Submission)
```typescript
export interface CandidateQuestionAudioSubmission {
    part: 1 | 2 | 3;
    questionIndex: number;
    prompt: string;
    audioUrl?: string; // Supabase storage URL if pre-uploaded
    audioBase64?: string; // Fallback if submitted directly as payload
    durationSeconds: number;
}

export interface SpeakingExamSubmissionPayload {
    attemptId: string;
    testId: string;
    bookNumber: number;
    testNumber: number;
    category: 'academic' | 'general';
    timeSpentSeconds: number;
    part1: CandidateQuestionAudioSubmission[];
    part2: {
        topic: string;
        cueCardBullets: string[];
        candidateNotes?: string;
        audioUrl?: string;
        audioBase64?: string;
        durationSeconds: number;
    };
    part3: CandidateQuestionAudioSubmission[];
}
```

#### Python Pydantic Specification (FastAPI Backend)
```python
from typing import List, Optional
from pydantic import BaseModel, Field

class AudioQuestionIn(BaseModel):
    part: int = Field(..., ge=1, le=3)
    question_index: int = Field(..., ge=0)
    prompt: str
    audio_url: Optional[str] = None
    duration_seconds: float = 0.0

class CueCardIn(BaseModel):
    topic: str
    cue_card_bullets: List[str] = []
    candidate_notes: Optional[str] = None
    audio_url: Optional[str] = None
    duration_seconds: float = 0.0

class SpeakingExamSubmissionRequest(BaseModel):
    attempt_id: str
    test_id: str
    book_number: int
    test_number: int
    category: str = "academic"
    time_spent_seconds: int
    part1: List[AudioQuestionIn]
    part2: CueCardIn
    part3: List[AudioQuestionIn]
```

---

### 4.2 Unified Question Diagnostic Schema

This schema unifies verbatim speech-to-text transcripts, classified token annotations, Cambridge criteria scores, and Band 8.5+ model answers.

#### TypeScript Data Contract
```typescript
export type DiagnosticTokenType = 'neutral' | 'filler' | 'grammar' | 'collocation';

export interface DiagnosticToken {
    text: string;
    type: DiagnosticTokenType;
    explanation?: string;
    suggestedFix?: string;
    startIndex?: number;
    endIndex?: number;
}

export interface QuestionExaminerCritique {
    fc: string; // Fluency & Coherence feedback
    lr: string; // Lexical Resource feedback
    gra: string; // Grammatical Range & Accuracy feedback
    pr: string; // Pronunciation feedback
}

export interface QuestionEvaluationResult {
    part: 1 | 2 | 3;
    questionIndex: number;
    prompt: string;
    shortLabel: string;
    candidateAudioUrl: string;
    durationSeconds: number;
    transcriptText: string;
    wpm: number;
    fillersCount: number;
    grammarSlipsCount: number;
    collocationsCount: number;
    diagnosticTokens: DiagnosticToken[];
    modelAnswerText: string;
    modelUpgrades: string[];
    examinerCritique: QuestionExaminerCritique;
}

export interface ComprehensiveSpeakingEvaluation {
    overallBand: number; // Rounded to nearest 0.5
    targetBand: number; // e.g., 7.5
    targetGap: number; // overallBand - targetBand (e.g. -1.0)
    fcScore: number;
    lrScore: number;
    graScore: number;
    prScore: number;
    averageWpm: number;
    pronunciationAccuracyPercent: number; // e.g., 88
    summaryFeedback: string;
    keyStrengths: string[];
    priorityImprovements: string[];
    questions: {
        part1: QuestionEvaluationResult[];
        part2: QuestionEvaluationResult;
        part3: QuestionEvaluationResult[];
    };
}
```

#### Python Pydantic Schema (Evaluation Response)
```python
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class DiagnosticTokenOut(BaseModel):
    text: str
    type: Literal["neutral", "filler", "grammar", "collocation"]
    explanation: Optional[str] = None
    suggested_fix: Optional[str] = None

class QuestionCritiqueOut(BaseModel):
    fc: str
    lr: str
    gra: str
    pr: str

class EvaluatedQuestionOut(BaseModel):
    part: int
    question_index: int
    prompt: str
    short_label: str
    candidate_audio_url: Optional[str] = ""
    duration_seconds: float
    transcript_text: str
    wpm: int
    fillers_count: int
    grammar_slips_count: int
    collocations_count: int
    diagnostic_tokens: List[DiagnosticTokenOut]
    model_answer_text: str
    model_upgrades: List[str]
    examiner_critique: QuestionCritiqueOut

class ComprehensiveSpeakingEvaluationResponse(BaseModel):
    overall_band: float
    target_band: float = 7.5
    target_gap: float
    fc_score: float
    lr_score: float
    gra_score: float
    pr_score: float
    average_wpm: int
    pronunciation_accuracy_percent: int
    summary_feedback: str
    strengths: List[str]
    improvements: List[str]
    part1: List[EvaluatedQuestionOut]
    part2: EvaluatedQuestionOut
    part3: List[EvaluatedQuestionOut]
```

---

## 5. UI State Unification Plan for `SpeakingEvaluationCanvas.tsx`

To eliminate the offline placeholder header and ensure seamless display of real AI metrics across both newly submitted and historical attempts, the following refactoring roadmap is prescribed:

### Step 1: Intelligent Review Mode Derivation
Replace the rigid boolean `isReviewMode = false` prop with a dynamic state evaluation:
```typescript
// Proposed resolution logic:
const hasValidEvaluation = useMemo(() => {
    if (evaluation && evaluation.overallBand && evaluation.overallBand > 0) return true;
    if (storedPartsData?.evaluation && storedPartsData.evaluation.overallBand > 0) return true;
    return false;
}, [evaluation, storedPartsData]);

// Even if isReviewMode is passed as true from HistoryMatrix, if real evaluation exists,
// display the full diagnostic assessment!
const displayAssessmentDashboard = hasValidEvaluation || (!isReviewMode && evaluation != null);
```

### Step 2: Executive KPI Header Unification
Update the top telemetry strip (lines 875–1025) to bind directly to dynamic evaluated data:
1. **Overall Speaking Band Card:**  
   Display `Band {overallBand.toFixed(1)} / 9.0` with CEFR descriptor (`>= 8.0: C2`, `>= 7.0: C1`, `>= 6.0: B2`, `< 6.0: B1`).
2. **Target Band Gap Card:**  
   Calculate `gap = overallBand - targetBand` (e.g., `6.5 - 7.5 = -1.0`). If gap is negative, render in `text-rose-400`; if zero or positive, render in `text-emerald-400`.
3. **Fluency & Pacing Card:**  
   Bind to `currentQuestion.wpm` (e.g., `134 WPM`) and dynamic filler pause count: `"{currentQuestion.fillersCount} hesitation pauses"`.
4. **Pronunciation Card:**  
   Bind to evaluated pronunciation accuracy (e.g., `88% Accuracy`) and intonation critique from the evaluation payload.

### Step 3: Dynamic Question Hydration Engine Refactor
Refactor `hydrateQuestionSet()` (lines 98–370) to prioritize real data from `storedPartsData`:
```typescript
// If storedPartsData has evaluated questions with transcripts and tokens:
if (storedQuestion && storedQuestion.transcriptText && storedQuestion.diagnosticTokens?.length) {
    return {
        questionIndex: idx,
        prompt: storedQuestion.prompt || qText,
        shortLabel: extractShortLabel(storedQuestion.prompt || qText, idx, 'Topic'),
        candidateAudioUrl: storedQuestion.candidateAudioUrl || '',
        durationSeconds: storedQuestion.durationSeconds || 38,
        transcriptText: storedQuestion.transcriptText,
        diagnosticTokens: storedQuestion.diagnosticTokens,
        modelAnswerText: storedQuestion.modelAnswerText || defaultModelAnswer,
        modelUpgrades: storedQuestion.modelUpgrades || [],
        wpm: storedQuestion.wpm || 130,
        fillersCount: storedQuestion.fillersCount || 0,
        grammarSlipsCount: storedQuestion.grammarSlipsCount || 0,
        collocationsCount: storedQuestion.collocationsCount || 0,
        examinerCritique: storedQuestion.examinerCritique || defaultCritique,
    };
}
// Fall back to bank/mock data ONLY if candidate transcript is absent.
```

### Step 4: Fix History Matrix Unpacking & Serialization
In `SpeakingHistoryMatrix.tsx` (lines 73–106):
```typescript
// Fix database row unpacking:
const payload = row.answers_payload || {};
// Handle both direct parts_data assignment and nested structure:
const resolvedPartsData = payload.parts_data ? payload.parts_data : (payload.part1 ? payload : null);

return {
    ...
    overall_band: row.band_score && row.band_score > 0 ? Number(row.band_score).toFixed(1) : (row.overall_band || 'Pending'),
    parts_data: resolvedPartsData,
    evaluation: row.evaluation || payload.evaluation || null,
};
```
And in the modal invocation (lines 360–372):
```tsx
<SpeakingEvaluationCanvas
    attemptId={selectedAttempt.id}
    bookNumber={selectedAttempt.book_number}
    testNumber={selectedAttempt.test_number}
    examTitle={selectedAttempt.exam_name}
    isOpen={true}
    isReviewMode={selectedAttempt.overall_band === 'Pending' || Number(selectedAttempt.overall_band) === 0}
    storedPartsData={selectedAttempt.parts_data}
    evaluation={selectedAttempt.evaluation}
    onClose={() => setSelectedAttempt(null)}
/>
```

---

## 6. Audit Conclusion & Recommendations

| Item | Current Diagnostic State | Target Implementation State | Priority |
| :--- | :--- | :--- | :--- |
| **Audio Persistence** | Ephemeral `blob:http...` URLs in client memory; discarded on unload | Upload all 9 question WebM files to Supabase Storage bucket `speaking-recordings/` | **P0 (Critical)** |
| **Multi-Question Submission** | Only the last question is sent to AI; 8 questions omitted | Batch submit all questions (P1 Q1–Q4, P2 Cue Card, P3 Q1–Q4) in one structured payload | **P0 (Critical)** |
| **Gemini STT & Grading** | Single-pass global summary without verbatim transcript or tokens | 2-Stage or structured schema: Verbatim STT + WPM + token tagging (`filler`, `grammar`, `collocation`) | **P0 (Critical)** |
| **Canvas UI Header** | Hardcoded to `[ CANDIDATE RECORDING ARCHIVE ]` offline strip | Dynamically evaluate `isEvaluated`; display full executive KPI row for evaluated attempts | **P1 (High)** |
| **History Rehydration** | `answers_payload` read bug resets `parts_data` to null on load | Normalize `payload.parts_data` vs `payload`; pass `evaluation` and CDN audio URLs to Canvas | **P1 (High)** |

*This audit document serves as the foundational architectural blueprint for upgrading the IELTS Speaking evaluation pipeline to production-grade real AI evaluation.*
