# Graph Report - frontend  (2026-09-10)

## Corpus Check
- 133 files · ~285,643 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1485 nodes · 2473 edges · 72 communities (70 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dedee45a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]

## God Nodes (most connected - your core abstractions)
1. `XIcon()` - 24 edges
2. `ChevronDownIcon()` - 21 edges
3. `BookOpenIcon()` - 21 edges
4. `CheckCircleIcon()` - 19 edges
5. `HistoryItem` - 18 edges
6. `PlusIcon()` - 16 edges
7. `compilerOptions` - 16 edges
8. `GlobeIcon()` - 14 edges
9. `IeltsSkill` - 13 edges
10. `ChevronLeftIcon()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `DashboardProps` --references--> `Theme`  [EXTRACTED]
  components/Dashboard.tsx → App.tsx
- `EnterpriseViewProps` --references--> `Theme`  [EXTRACTED]
  components/EnterpriseView.tsx → App.tsx
- `SidebarProps` --references--> `Theme`  [EXTRACTED]
  components/Sidebar.tsx → App.tsx
- `WorkspaceDropdownProps` --references--> `Theme`  [EXTRACTED]
  components/WorkspaceDropdown.tsx → App.tsx
- `AuthOverlayProps` --references--> `AuthType`  [EXTRACTED]
  components/AuthOverlay.tsx → App.tsx

## Import Cycles
- 3-file cycle: `App.tsx -> components/LandingPage.tsx -> components/EnterpriseView.tsx -> App.tsx`
- 3-file cycle: `App.tsx -> components/Dashboard.tsx -> components/WorkspaceDropdown.tsx -> App.tsx`
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanelErrorBoundary.tsx -> components/Dashboard.tsx`
- 3-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> App.tsx`
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanel.tsx -> components/Dashboard.tsx`
- 4-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> components/WorkspaceDropdown.tsx -> App.tsx`

## Communities (72 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (26): allFormalSourcesList, defaultPreferences, domainOptions, gridEvents, heroEvents, historyBenchmarks, CompetitionEvent, CompetitionSource (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (24): CirclePlusIcon(), CopyIcon(), FlowChartIcon(), LineChartIcon(), LoadingSpinnerIcon(), MicOffIcon(), MindMapIcon(), PaperclipIcon() (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (25): socialIcons, BookmarkIcon(), BriefcaseIcon(), CompassIcon(), DotsHorizontalIcon(), FacebookIcon(), HeartIcon(), InstagramIcon() (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (34): AddCoursesIcon(), CalendarIcon(), ChatIcon(), CrownIcon(), CubeIcon(), DebatePodiumIcon(), DollarIcon(), EdgramIcon() (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (19): defaultOnboardingData, Expert, filters, filterTypeMap, initialExperts, AdjustIcon(), AlertIcon(), BookOpenIcon() (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (17): ModuleHistoryItem, ModuleHistoryProps, STATUS_LABEL, StatusFilter, BundleSectionAnalysis, ResolvedAnalysis, EQUIPMENT_CHECKS, IELTSLobbyCardProps (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (11): certificates, MockTestRecord, mockTests, peerNetwork, PrivacyLevel, skills, SkillTelemetry, TargetUniversity (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (30): ALLOCATED_MINUTES, AnalysisKind, buildBundle(), buildEssaySegments(), buildObjective(), buildSpeaking(), buildWriting(), bundleIdFromLabel() (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (17): AssignedTask, BatchNotice, InlineCampusIcon(), NOTICE, PASSPORT, PROFILE, QA_THREADS, QaReply (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (12): BAND_MOCK_USERS, CURRENT_STREAK_USER, CURRENT_XP_USER, FilterTab, LeaderboardUser, LeaderboardViewProps, STREAK_GLOBAL_USERS, StreakScope (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (26): ACCURACY_ERRORS, AccuracyError, GrammarEvaluationCardProps, SENTENCE_PROOFS, SentenceProof, ChatMessage, ChatRole, DrawerTab (+18 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (32): accessSegments, allowedNavKeysFor(), buildMember(), courseModules, defaultPermissionsFor(), engagementTabs, EvaluationItem, identityProviders (+24 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (24): addAttempt(), ATTEMPTS_KEY, clampBand(), clearAttempts(), clearAttemptsByBundle(), clearAttemptsBySkill(), DEMO_TITLES, DiagnosticSubSkill (+16 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (24): HawkingFabProps, Message, models, ArrowUpIcon(), BarChartIcon(), FlashIcon(), HeadsetIcon(), PresentationIcon() (+16 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (16): IELTSExitModalProps, ACTIVE_IDS, ALL_IDS, IELTSListeningExamProps, LISTENING_PART1_DATA, LISTENING_PART2_DATA, LISTENING_PART3_DATA, LISTENING_PART4_DATA (+8 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (3): ScoreFilter, StreaksViewProps, TimeFilter

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (6): CATEGORIES, INITIAL_BOOKS, KnowledgeBook, ParsedRule, PRIORITIES, STRICTNESS_OPTIONS

### Community 17 - "Community 17"
Cohesion: 0.13
Nodes (9): IELTSListeningExam(), IELTSReadingExam(), PARTS, QUESTIONS, ReadingPart, ReadingQuestion, TestState, rawToBand() (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.14
Nodes (8): buildBilingual(), buildSegments(), TASK2_PROMPTS, WritingCriteria, IELTSWritingExam(), TestState, WRITING_PART1_CHART_DATA, WritingResult

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): dependencies, framer-motion, @google/genai, react, react-dom, react-player, sonner, @supabase/supabase-js (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (15): BASE_CARDS, CardFormat, COHORT_ERRORS, CohortError, Deck, DeckCategory, DECKS, EXTRA_CARDS (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.24
Nodes (7): AuthGatewayProps, EyeIcon(), EyeSlashIcon(), GoogleIcon(), getAuthErrorMessage(), isNetworkError(), supabase

### Community 22 - "Community 22"
Cohesion: 0.14
Nodes (9): VideoCameraIcon(), seedMethodsLm1, DiagnosticsSidebarProps, categoryMeta, MethodologyGridProps, seedMethods, LearningEngineState, LearningMethod (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (10): A11Y_CLASSES, A11yState, CONTRAST_CLASS, ContrastMode, contrastOptions, IconProps, IeltsExamOptionsModalProps, TEXTSIZE_CLASS (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.13
Nodes (6): AccordionCardProps, CAMBRIDGE_SERIES, DIFFICULTY_MAP, ListeningHubViewProps, MOCK_SERIES, TestSeries

### Community 25 - "Community 25"
Cohesion: 0.07
Nodes (19): FreeContentLibraryViewProps, GRAMMAR_MODULE_DATA, MOCKTEST_MODULE_DATA, MODULE_00_DATA, MODULE_01_DATA, MODULE_SUBSECTIONS, MODULE_SUMMARIES, ModuleNotesViewProps (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.05
Nodes (38): defaultConfig, DiscoverViewProps, processingLogs, CloudyIcon(), GlobeIcon(), RedditIcon(), RefreshIcon(), TrendingDownIcon() (+30 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (12): BundleAnalysis, ObjectiveAnalysis, SegmentKind, SpeakingAnalysis, WritingAnalysis, BandPill(), IELTSAnalysisViewProps, segColor (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (5): AIIELTSChatbotViewProps, Conversation, Message, MIHU_RESPONSES, QUICK_PROMPTS

### Community 29 - "Community 29"
Cohesion: 0.05
Nodes (18): baseCards, CardData, demoCards, FlashcardReviewController(), ChevronLeftIcon(), ChevronRightIcon(), DAYS_OF_WEEK, LessonTask (+10 more)

### Community 30 - "Community 30"
Cohesion: 0.10
Nodes (16): SpeakUIRestoreProps, IELTSReadingExamProps, formatClock(), SimulationProps, CUE_CARD, formatTime(), IELTS_SpeakingExam(), IELTSSpeakingExamProps (+8 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.05
Nodes (24): AddContentViewProps, AddCoursesViewProps, initialCourses, HistoryItem, HistoryViewProps, DoubleChevronDownIcon(), MaximizeIcon(), MinimizeIcon() (+16 more)

### Community 33 - "Community 33"
Cohesion: 0.05
Nodes (20): AIScoringAccordionProps, AISpeakingPartnerViewProps, CallState, ChatMessage, EvalState, Evaluation, Language, LANGUAGE_LABELS (+12 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (15): ALL_QUESTION_KEYS, ANSWER_HEADINGS, GAP_ANSWERS, GAP_FILL, GapFillQuestion, GROUP_ANSWERS, GROUP_MAP, HEADING_SLOTS (+7 more)

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (7): Candidate, CANDIDATES, INTERVENTION_PILL, InterventionFilter, RISK_PILL, RiskLevel, StatusFilter

### Community 36 - "Community 36"
Cohesion: 0.07
Nodes (17): formatClock(), NewSpeakingExamRunner(), NewSpeakingExamRunnerProps, PART1_TOPICS, Part1Topic, PART2_TOPICS, Part2Topic, PART3_TOPICS (+9 more)

### Community 37 - "Community 37"
Cohesion: 0.23
Nodes (12): ApiError, AuthSessionData, clearSession(), getAuthErrorMessage(), getSession(), getStoredToken(), isNetworkError(), login() (+4 more)

### Community 38 - "Community 38"
Cohesion: 0.14
Nodes (4): ActiveTab, AIRewriterViewProps, MOCK_EVALUATION, TaskType

### Community 39 - "Community 39"
Cohesion: 0.20
Nodes (12): ClipboardCheckIcon(), OrgTab, skillData, SkillRow, statusConfig, InstitutionalDashboard(), addLibraryItem(), getLibraryItems() (+4 more)

### Community 40 - "Community 40"
Cohesion: 0.33
Nodes (4): MOCK_SAMPLES, MockSample, QR_PATTERN, Stage

### Community 41 - "Community 41"
Cohesion: 0.09
Nodes (18): ACADEMIC_BOOKS, BookTest, ExamModeType, GT_BOOKS, LISTEN_DRILLS, LISTENING_SECTION_TITLES, PartPracticeHubProps, PracticeItem (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.11
Nodes (8): AccordionCardProps, CAMBRIDGE_SERIES, DIFFICULTY_MAP, MOCK_SERIES, TestSeries, WRITING_MODES, WritingHubViewProps, WritingMode

### Community 43 - "Community 43"
Cohesion: 0.12
Nodes (6): AccordionCardProps, CAMBRIDGE_SERIES, DIFFICULTY_MAP, MOCK_SERIES, ReadingHubViewProps, TestSeries

### Community 44 - "Community 44"
Cohesion: 0.06
Nodes (24): Message, models, ContactUsSlideProps, DebateSession, DebateViewProps, Message, BrainIcon(), CheckIcon() (+16 more)

### Community 45 - "Community 45"
Cohesion: 0.12
Nodes (12): AuthType, Theme, AuthOverlayProps, DashboardProps, EnterpriseViewProps, ArrowUpRightIcon(), BuildingLibraryIcon(), QuestionMarkIcon() (+4 more)

### Community 47 - "Community 47"
Cohesion: 0.20
Nodes (9): PartContentHandle, PART3_ANSWERS, PART3_SUMMARY, PART3_TFNG, Part3Content, Part3ContentProps, Part3TFNGQuestion, SummarySegment (+1 more)

### Community 48 - "Community 48"
Cohesion: 0.14
Nodes (12): ALTERNATE_QUESTIONS, BAND_OPTIONS, CohortBatch, COHORTS, EXAM_OPTIONS, FilterState, INITIAL_QUESTIONS, MODULE_OPTIONS (+4 more)

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (7): ACADEMIC_BOOKS, FullMockTestHubProps, GT_BOOKS, MockBook, SECTION_DURATION_ITEMS, SKILL_PILLS, ViewMode

### Community 50 - "Community 50"
Cohesion: 0.24
Nodes (9): AnalysisSegment, CRITERION_DETAILS, segColor, segNote(), WritingAnalysisModal(), WritingAnalysisModalProps, WritingCriterion, WritingRewrite (+1 more)

### Community 51 - "Community 51"
Cohesion: 0.11
Nodes (13): BUNDLE_HEX, SKILL_HEX, SKILLS, TOKEN_TYPE_COLOR, BUNDLES, DIAGNOSTIC_SUBSKILLS, IeltsAttempt, MISTAKE_TOKENS (+5 more)

### Community 52 - "Community 52"
Cohesion: 0.19
Nodes (9): DISABLED_DORMANT_NAV_ITEMS, DORMANT_NAV_KEYS, faqs, InviteEarnViewProps, addSpace(), deleteSpace(), getSpaces(), saveSpaces() (+1 more)

### Community 55 - "Community 55"
Cohesion: 0.29
Nodes (3): Activity, IndividualSandboxViewProps, PromptEntry

### Community 56 - "Community 56"
Cohesion: 0.17
Nodes (17): ActivationView(), ActivationViewProps, OrgAuthModal(), activateTenant(), addPartnershipRequest(), approvePartnershipRequest(), defaultInstitutionalSpace, defaultLibraryItem (+9 more)

### Community 57 - "Community 57"
Cohesion: 0.17
Nodes (5): ErrorBoundary, root, rootElement, initMockDb(), WorkspaceProvider()

### Community 59 - "Community 59"
Cohesion: 0.08
Nodes (21): DashboardViewProps, ClockIcon(), CreditCardIcon(), DatabaseIcon(), FileTextIcon(), FireIcon(), HeadphonesIcon(), LightningIcon() (+13 more)

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (3): description, name, requestFramePermissions

### Community 63 - "Community 63"
Cohesion: 0.15
Nodes (8): days, durations, metrics, Mission, mockData, modules, priorities, timeBlocks

### Community 64 - "Community 64"
Cohesion: 0.07
Nodes (27): Dashboard(), EnterpriseSandboxViewProps, LEADERBOARD_DATA, WorkspaceDropdown(), WRITING_PROMPTS, WritingPrompt, FALLBACK_FARMGATE, IELTSEvaluationHub() (+19 more)

### Community 65 - "Community 65"
Cohesion: 0.17
Nodes (8): metrics, MockTest, StatusFilter, statusOptions, tests, TestStatus, TypeFilter, typeOptions

### Community 67 - "Community 67"
Cohesion: 0.15
Nodes (9): FeedbackModalProps, FlashcardIcon(), PlusSquareIcon(), PodcastIcon(), SparkleIcon(), UploadIcon(), SidebarProps, SpaceViewProps (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.18
Nodes (7): metrics, Part, partOptions, Recording, recordings, Status, statusOptions

### Community 69 - "Community 69"
Cohesion: 0.22
Nodes (7): BATCH_OPTIONS, Candidate, CANDIDATES, Status, STATUS_ICON, STATUS_OPTIONS, STATUS_STYLES

### Community 70 - "Community 70"
Cohesion: 0.22
Nodes (7): CERT_TEMPLATES, FontFamily, FONTS, LOGO_SIZES, LogoSize, Tab, TABS

### Community 73 - "Community 73"
Cohesion: 0.25
Nodes (6): ENTRIES, METRICS, ModuleFilter, ReviewEntry, STATUS_PILL, StatusFilter

### Community 75 - "Community 75"
Cohesion: 0.29
Nodes (5): Invoice, invoices, Plan, plans, statusConfig

### Community 76 - "Community 76"
Cohesion: 0.29
Nodes (4): ENTRIES, FilterStatus, QueueEntry, statusColors

### Community 77 - "Community 77"
Cohesion: 0.29
Nodes (5): MisconceptionEntry, MOCK_DATA, MODULES, STATUS_STYLES, STATUSES

## Knowledge Gaps
- **597 isolated node(s):** `AuthSessionData`, `ApiError`, `Message`, `Conversation`, `MIHU_RESPONSES` (+592 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IeltsBundleId` connect `Community 5` to `Community 64`, `Community 7`, `Community 12`, `Community 51`, `Community 27`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `CheckCircleIcon()` connect `Community 4` to `Community 0`, `Community 1`, `Community 32`, `Community 3`, `Community 39`, `Community 11`, `Community 44`, `Community 13`, `Community 22`, `Community 26`, `Community 59`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `BookOpenIcon()` connect `Community 4` to `Community 32`, `Community 1`, `Community 2`, `Community 3`, `Community 39`, `Community 11`, `Community 13`, `Community 22`, `Community 26`, `Community 59`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `AuthSessionData`, `ApiError`, `Message` to the rest of the system?**
  _597 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06818181818181818 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08367071524966262 - nodes in this community are weakly interconnected._