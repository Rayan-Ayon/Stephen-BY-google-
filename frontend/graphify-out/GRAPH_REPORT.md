# Graph Report - frontend  (2026-09-10)

## Corpus Check
- 133 files · ~286,956 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1451 nodes · 2436 edges · 77 communities (76 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4c1787e`
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
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
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
- `EnterpriseViewProps` --references--> `Theme`  [EXTRACTED]
  components/EnterpriseView.tsx → App.tsx
- `DashboardProps` --references--> `Theme`  [EXTRACTED]
  components/Dashboard.tsx → App.tsx
- `LandingPageProps` --references--> `Theme`  [EXTRACTED]
  components/LandingPage.tsx → App.tsx
- `WorkspaceDropdownProps` --references--> `Theme`  [EXTRACTED]
  components/WorkspaceDropdown.tsx → App.tsx
- `AuthOverlayProps` --references--> `AuthType`  [EXTRACTED]
  components/AuthOverlay.tsx → App.tsx

## Import Cycles
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanel.tsx -> components/Dashboard.tsx`
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanelErrorBoundary.tsx -> components/Dashboard.tsx`
- 3-file cycle: `App.tsx -> components/Dashboard.tsx -> components/WorkspaceDropdown.tsx -> App.tsx`
- 3-file cycle: `App.tsx -> components/LandingPage.tsx -> components/EnterpriseView.tsx -> App.tsx`
- 3-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> App.tsx`
- 4-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> components/WorkspaceDropdown.tsx -> App.tsx`

## Communities (77 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (31): allFormalSourcesList, defaultPreferences, domainOptions, gridEvents, heroEvents, historyBenchmarks, CompetitionEvent, CompetitionSource (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (23): CirclePlusIcon(), CopyIcon(), FlowChartIcon(), LineChartIcon(), LoadingSpinnerIcon(), MicOffIcon(), MindMapIcon(), PaperclipIcon() (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (29): ContactUsSlideProps, socialIcons, BookmarkIcon(), BriefcaseIcon(), CompassIcon(), DotsHorizontalIcon(), FacebookIcon(), HeartIcon() (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (34): AddCoursesIcon(), CalendarIcon(), ChatIcon(), CrownIcon(), CubeIcon(), DollarIcon(), EdgramIcon(), ExamPaperPenIcon() (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (23): defaultOnboardingData, Expert, filters, filterTypeMap, initialExperts, EnterpriseViewProps, AdjustIcon(), AlertIcon() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (22): ModuleHistoryItem, ModuleHistoryProps, STATUS_LABEL, StatusFilter, BundleAnalysis, BundleSectionAnalysis, ResolvedAnalysis, EQUIPMENT_CHECKS (+14 more)

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
Cohesion: 0.12
Nodes (13): PauseIcon(), EvaluationItem, NavGroup, NavLeaf, OwnerApprovalItem, RbacTier, ReviewSubmission, SegmentKey (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (20): addAttempt(), ATTEMPTS_KEY, clearAttempts(), clearAttemptsByBundle(), clearAttemptsBySkill(), DEMO_TITLES, DiagnosticSubSkill, ExamMeta (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (19): HawkingFabProps, Message, models, FlashIcon(), HeadsetIcon(), PresentationIcon(), ProjectIcon(), AddProjectModalProps (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (15): ACTIVE_IDS, ALL_IDS, IELTSListeningExamProps, LISTENING_PART1_DATA, LISTENING_PART2_DATA, LISTENING_PART3_DATA, LISTENING_PART4_DATA, MAP_SLOTS (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (3): ScoreFilter, StreaksViewProps, TimeFilter

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (6): CATEGORIES, INITIAL_BOOKS, KnowledgeBook, ParsedRule, PRIORITIES, STRICTNESS_OPTIONS

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (7): PARTS, QUESTIONS, ReadingPart, ReadingQuestion, TestState, GAP_FILL, GROUP_ANSWERS

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (13): buildBilingual(), buildSegments(), TASK2_PROMPTS, WritingCriteria, IELTSWritingExam(), IELTSWritingExamProps, TestState, WRITING_PART1_CHART_DATA (+5 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): dependencies, framer-motion, @google/genai, react, react-dom, react-player, sonner, @supabase/supabase-js (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (15): BASE_CARDS, CardFormat, COHORT_ERRORS, CohortError, Deck, DeckCategory, DECKS, EXTRA_CARDS (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.19
Nodes (10): AuthType, AuthGatewayProps, AuthOverlayProps, EyeIcon(), EyeSlashIcon(), GoogleIcon(), LandingPageProps, getAuthErrorMessage() (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.13
Nodes (10): ClipboardIcon(), VideoCameraIcon(), seedMethodsLm1, DiagnosticsSidebarProps, categoryMeta, MethodologyGridProps, seedMethods, LearningEngineState (+2 more)

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
Cohesion: 0.11
Nodes (19): defaultConfig, DiscoverViewProps, processingLogs, CloudyIcon(), GlobeIcon(), RedditIcon(), RefreshIcon(), TrendingDownIcon() (+11 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (11): ObjectiveAnalysis, SegmentKind, SpeakingAnalysis, WritingAnalysis, BandPill(), IELTSAnalysisViewProps, segColor, segNote() (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (5): AIIELTSChatbotViewProps, Conversation, Message, MIHU_RESPONSES, QUICK_PROMPTS

### Community 29 - "Community 29"
Cohesion: 0.11
Nodes (4): baseCards, CardData, demoCards, FlashcardReviewController()

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): IELTSReadingExamProps, clampBand(), evaluateWritingText(), roundToHalf(), SimulationProps, CUE_CARD, formatTime(), IELTS_SpeakingExam() (+8 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.08
Nodes (18): AddContentViewProps, AddCoursesViewProps, initialCourses, HistoryItem, HistoryViewProps, BookOpenIcon(), DoubleChevronDownIcon(), MaximizeIcon() (+10 more)

### Community 33 - "Community 33"
Cohesion: 0.05
Nodes (20): AIScoringAccordionProps, AISpeakingPartnerViewProps, CallState, ChatMessage, EvalState, Evaluation, Language, LANGUAGE_LABELS (+12 more)

### Community 34 - "Community 34"
Cohesion: 0.13
Nodes (14): ALL_QUESTION_KEYS, ANSWER_HEADINGS, GAP_ANSWERS, GapFillQuestion, GROUP_MAP, HEADING_SLOTS, HeadingOption, HEADINGS (+6 more)

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
Cohesion: 0.10
Nodes (19): BarChartIcon(), adminKeys, aiMetrics, anomalyAlerts, billingData, billingTabs, compilerPipelines, courseCatalog (+11 more)

### Community 40 - "Community 40"
Cohesion: 0.15
Nodes (9): DAYS_OF_WEEK, LessonTask, SEPTEMBER_GRID, Skill, SKILL_COLORS, SKILL_EMOJI, SKILL_ICON_CIRCLE, STUDY_PLAN_DATA (+1 more)

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
Cohesion: 0.07
Nodes (21): Message, models, DebateSession, DebateViewProps, Message, BrainIcon(), CheckIcon(), LinkIcon() (+13 more)

### Community 45 - "Community 45"
Cohesion: 0.17
Nodes (8): ChevronDownIcon(), CreditCardIcon(), DatabaseIcon(), FileTextIcon(), PaletteIcon(), faqs, InviteEarnViewProps, SettingsModalProps

### Community 46 - "Community 46"
Cohesion: 0.17
Nodes (8): FALLBACK_FARMGATE, IELTSEvaluationHubProps, IeltsNavItem, IeltsView, PRACTICE_ITEMS, SIMULATION_ITEMS, WritingSubView, IELTSExitModalProps

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
Cohesion: 0.22
Nodes (6): BUNDLE_HEX, SKILL_HEX, SKILLS, TOKEN_TYPE_COLOR, DIAGNOSTIC_SUBSKILLS, MISTAKE_TOKENS

### Community 52 - "Community 52"
Cohesion: 0.13
Nodes (14): Theme, Dashboard(), DashboardProps, DISABLED_DORMANT_NAV_ITEMS, DORMANT_NAV_KEYS, SidebarProps, SpaceViewProps, SpeakUIRestoreProps (+6 more)

### Community 53 - "Community 53"
Cohesion: 0.24
Nodes (4): WRITING_PROMPTS, WritingPrompt, TASK_TYPES, WritingDashboardProps

### Community 54 - "Community 54"
Cohesion: 0.22
Nodes (5): skillDotColors, STATUS_LABEL, StatusFilter, TASK_LABELS, WritingHistoryMatrixProps

### Community 55 - "Community 55"
Cohesion: 0.29
Nodes (3): Activity, IndividualSandboxViewProps, PromptEntry

### Community 56 - "Community 56"
Cohesion: 0.08
Nodes (37): ActivationView(), ActivationViewProps, BuildingLibraryIcon(), ClipboardCheckIcon(), PodcastIcon(), OrgAuthModal(), OrgAuthModalProps, OrgTab (+29 more)

### Community 57 - "Community 57"
Cohesion: 0.17
Nodes (5): ErrorBoundary, root, rootElement, initMockDb(), WorkspaceProvider()

### Community 58 - "Community 58"
Cohesion: 0.25
Nodes (3): Props, State, TutorPanelErrorBoundary

### Community 59 - "Community 59"
Cohesion: 0.16
Nodes (12): DashboardViewProps, ClockIcon(), FireIcon(), HeadphonesIcon(), LightningIcon(), MicIcon(), PencilIcon(), PenIcon() (+4 more)

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (3): description, name, requestFramePermissions

### Community 63 - "Community 63"
Cohesion: 0.15
Nodes (8): days, durations, metrics, Mission, mockData, modules, priorities, timeBlocks

### Community 64 - "Community 64"
Cohesion: 0.19
Nodes (11): EnterpriseSandboxViewProps, LEADERBOARD_DATA, KNOWN_WORKSPACE_CODES, KnownWorkspaceEntry, migrateStored(), readStoredActive(), readStoredWorkspaces(), SEEDED_WORKSPACES (+3 more)

### Community 65 - "Community 65"
Cohesion: 0.17
Nodes (8): metrics, MockTest, StatusFilter, statusOptions, tests, TestStatus, TypeFilter, typeOptions

### Community 66 - "Community 66"
Cohesion: 0.29
Nodes (4): containerVariants, itemVariants, reasoningSteps, ReasoningViewProps

### Community 67 - "Community 67"
Cohesion: 0.10
Nodes (10): FeedbackModalProps, ArrowUpRightIcon(), DebatePodiumIcon(), FlashcardIcon(), LockClosedIcon(), PlusSquareIcon(), QuestionMarkIcon(), SparkleIcon() (+2 more)

### Community 68 - "Community 68"
Cohesion: 0.18
Nodes (7): metrics, Part, partOptions, Recording, recordings, Status, statusOptions

### Community 69 - "Community 69"
Cohesion: 0.22
Nodes (7): BATCH_OPTIONS, Candidate, CANDIDATES, Status, STATUS_ICON, STATUS_OPTIONS, STATUS_STYLES

### Community 70 - "Community 70"
Cohesion: 0.22
Nodes (7): CERT_TEMPLATES, FontFamily, FONTS, LOGO_SIZES, LogoSize, Tab, TABS

### Community 71 - "Community 71"
Cohesion: 0.67
Nodes (3): IELTSListeningExam(), IELTSReadingExam(), rawToBand()

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
- **581 isolated node(s):** `AuthSessionData`, `ApiError`, `Message`, `Conversation`, `MIHU_RESPONSES` (+576 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IeltsBundleId` connect `Community 5` to `Community 7`, `Community 12`, `Community 46`, `Community 51`, `Community 27`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Theme` connect `Community 52` to `Community 3`, `Community 67`, `Community 4`, `Community 21`, `Community 57`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `AuthSessionData`, `ApiError`, `Message` to the rest of the system?**
  _581 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06105457909343201 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07056451612903226 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06938020351526364 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07439613526570048 - nodes in this community are weakly interconnected._