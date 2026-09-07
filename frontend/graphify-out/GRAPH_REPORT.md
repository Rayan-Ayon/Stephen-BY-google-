# Graph Report - frontend  (2026-09-07)

## Corpus Check
- 111 files · ~192,633 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1180 nodes · 2122 edges · 63 communities (60 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8a8b50c6`
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

## God Nodes (most connected - your core abstractions)
1. `XIcon()` - 23 edges
2. `ChevronDownIcon()` - 21 edges
3. `CheckCircleIcon()` - 19 edges
4. `BookOpenIcon()` - 19 edges
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
- `LandingPageProps` --references--> `Theme`  [EXTRACTED]
  components/LandingPage.tsx → App.tsx
- `WorkspaceDropdownProps` --references--> `Theme`  [EXTRACTED]
  components/WorkspaceDropdown.tsx → App.tsx
- `AuthOverlayProps` --references--> `AuthType`  [EXTRACTED]
  components/AuthOverlay.tsx → App.tsx

## Import Cycles
- 3-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> App.tsx`
- 3-file cycle: `App.tsx -> components/LandingPage.tsx -> components/EnterpriseView.tsx -> App.tsx`
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanel.tsx -> components/Dashboard.tsx`
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanelErrorBoundary.tsx -> components/Dashboard.tsx`
- 4-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> components/WorkspaceDropdown.tsx -> App.tsx`

## Communities (63 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (32): allFormalSourcesList, defaultPreferences, domainOptions, gridEvents, heroEvents, historyBenchmarks, CompetitionEvent, CompetitionSource (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (30): AdjustIcon(), AlertIcon(), CheckCircleIcon(), ChevronRightIcon(), ClockIcon(), DoubleChevronUpIcon(), GlobeIcon(), LockClosedIcon() (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (27): socialIcons, BookmarkIcon(), BriefcaseIcon(), CompassIcon(), DotsHorizontalIcon(), FacebookIcon(), HeartIcon(), InstagramIcon() (+19 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (32): AddCoursesIcon(), CalendarIcon(), ChatIcon(), CrownIcon(), CubeIcon(), DollarIcon(), EdgramIcon(), ExamPaperPenIcon() (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (22): HawkingFabProps, Message, models, ArrowUpIcon(), ArrowUpRightIcon(), BarChartIcon(), BrainIcon(), CheckIcon() (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (18): defaultOnboardingData, Expert, filters, filterTypeMap, initialExperts, ContactUsSlideProps, ChevronDownIcon(), CreditCardIcon() (+10 more)

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
Cohesion: 0.07
Nodes (22): CirclePlusIcon(), CopyIcon(), FlowChartIcon(), LineChartIcon(), LoadingSpinnerIcon(), MicOffIcon(), MindMapIcon(), PieChartIcon() (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (26): ACCURACY_ERRORS, AccuracyError, GrammarEvaluationCardProps, SENTENCE_PROOFS, SentenceProof, ChatMessage, ChatRole, DrawerTab (+18 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (25): ActivationView(), ActivationViewProps, BuildingLibraryIcon(), OrgAuthModal(), OrgAuthModalProps, InstitutionalDashboard(), activateTenant(), addLibraryItem() (+17 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (23): addAttempt(), ATTEMPTS_KEY, clampBand(), clearAttempts(), clearAttemptsByBundle(), clearAttemptsBySkill(), DEMO_TITLES, DiagnosticSubSkill (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (18): defaultConfig, DiscoverViewProps, processingLogs, CloudyIcon(), RedditIcon(), RefreshIcon(), TrendingDownIcon(), XLogoIcon() (+10 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (18): ACTIVE_IDS, ALL_IDS, IELTSListeningExam(), IELTSListeningExamProps, LISTENING_PART1_DATA, LISTENING_PART2_DATA, LISTENING_PART3_DATA, LISTENING_PART4_DATA (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (3): ScoreFilter, StreaksViewProps, TimeFilter

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (6): CATEGORIES, INITIAL_BOOKS, KnowledgeBook, ParsedRule, PRIORITIES, STRICTNESS_OPTIONS

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (15): PARTS, QUESTIONS, ReadingPart, ReadingQuestion, TestState, GAP_FILL, PartContentHandle, PART3_ANSWERS (+7 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (12): buildBilingual(), buildSegments(), TASK2_PROMPTS, WritingCriteria, IELTSWritingExam(), TestState, WRITING_PART1_CHART_DATA, WritingResult (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): dependencies, framer-motion, @google/genai, react, react-dom, react-player, sonner, @supabase/supabase-js (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (15): BASE_CARDS, CardFormat, COHORT_ERRORS, CohortError, Deck, DeckCategory, DECKS, EXTRA_CARDS (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.14
Nodes (13): AuthType, AuthGatewayProps, AuthOverlayProps, EyeIcon(), EyeSlashIcon(), LandingPageProps, root, rootElement (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.14
Nodes (9): ClipboardIcon(), seedMethodsLm1, DiagnosticsSidebarProps, categoryMeta, MethodologyGridProps, seedMethods, LearningEngineState, LearningMethod (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (10): A11Y_CLASSES, A11yState, CONTRAST_CLASS, ContrastMode, contrastOptions, IconProps, IeltsExamOptionsModalProps, TEXTSIZE_CLASS (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (13): Message, models, DeleteSpaceModal(), FlashcardModal(), ModalProps, PasteTextModal(), PasteUrlModal(), PodcastModal() (+5 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (11): FreeContentLibraryViewProps, GRAMMAR_MODULE_DATA, MODULE_00_DATA, MODULE_01_DATA, PRONUNCIATION_MODULE_DATA, READING_MODULE_DATA, SPEAKING_MODULE_DATA, SubTopic (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.10
Nodes (18): adminKeys, aiMetrics, anomalyAlerts, billingData, billingTabs, compilerPipelines, courseCatalog, metrics (+10 more)

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
Nodes (14): IELTSReadingExamProps, SimulationProps, CUE_CARD, formatTime(), IELTS_SpeakingExam(), IELTSSpeakingExamProps, PART1_QUESTIONS, PART3_QUESTIONS (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.12
Nodes (8): DoubleChevronDownIcon(), MaximizeIcon(), MinimizeIcon(), Chapter, MOCK_CHAPTERS, MOCK_TRANSCRIPTS, TranscriptItem, Window

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (6): AISpeakingPartnerViewProps, Language, LANGUAGE_LABELS, Partner, PARTNERS, VoiceMode

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (15): ALL_QUESTION_KEYS, ANSWER_HEADINGS, GAP_ANSWERS, GapFillQuestion, GROUP_ANSWERS, GROUP_MAP, HEADING_SLOTS, HeadingOption (+7 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): ModuleHistoryItem, ModuleHistoryProps, STATUS_LABEL, StatusFilter, BundleAnalysis, BundleSectionAnalysis, ResolvedAnalysis, IeltsAttempt (+3 more)

### Community 36 - "Community 36"
Cohesion: 0.16
Nodes (12): Theme, Dashboard(), DashboardProps, EnterpriseViewProps, SidebarProps, SpaceViewProps, WorkspaceDropdown(), WorkspaceDropdownProps (+4 more)

### Community 37 - "Community 37"
Cohesion: 0.23
Nodes (12): ApiError, AuthSessionData, clearSession(), getAuthErrorMessage(), getSession(), getStoredToken(), isNetworkError(), login() (+4 more)

### Community 38 - "Community 38"
Cohesion: 0.14
Nodes (4): ActiveTab, AIRewriterViewProps, MOCK_EVALUATION, TaskType

### Community 39 - "Community 39"
Cohesion: 0.21
Nodes (8): DISABLED_DORMANT_NAV_ITEMS, DORMANT_NAV_KEYS, FeedbackModalProps, addSpace(), deleteSpace(), getSpaces(), saveSpaces(), updateSpace()

### Community 40 - "Community 40"
Cohesion: 0.19
Nodes (11): EnterpriseSandboxViewProps, LEADERBOARD_DATA, KNOWN_WORKSPACE_CODES, KnownWorkspaceEntry, migrateStored(), readStoredActive(), readStoredWorkspaces(), SEEDED_WORKSPACES (+3 more)

### Community 41 - "Community 41"
Cohesion: 0.14
Nodes (12): ALTERNATE_QUESTIONS, BAND_OPTIONS, CohortBatch, COHORTS, EXAM_OPTIONS, FilterState, INITIAL_QUESTIONS, MODULE_OPTIONS (+4 more)

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (11): EQUIPMENT_CHECKS, IELTSLobbyCardProps, BUNDLES, BundleSection, EXAM_META, formatClock(), SimSectionResult, skillLabels (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (10): AddContentViewProps, HistoryItem, HistoryViewProps, VideoCameraIcon(), TutorPanelProps, Props, State, CinematicContentPanelProps (+2 more)

### Community 44 - "Community 44"
Cohesion: 0.15
Nodes (7): CURRENT_USER, FilterPill, FilterTab, LeaderboardUser, LeaderboardViewProps, MOCK_USERS, TIERS

### Community 45 - "Community 45"
Cohesion: 0.15
Nodes (9): DAYS_OF_WEEK, LessonTask, SEPTEMBER_GRID, Skill, SKILL_COLORS, SKILL_EMOJI, SKILL_ICON_CIRCLE, STUDY_PLAN_DATA (+1 more)

### Community 46 - "Community 46"
Cohesion: 0.18
Nodes (10): AddProjectModalProps, categoryOptions, courseOptions, moduleOptions, seedProjects, ProjectCard, ProjectCategory, ProjectMeta (+2 more)

### Community 47 - "Community 47"
Cohesion: 0.17
Nodes (8): FALLBACK_FARMGATE, IELTSEvaluationHubProps, IeltsNavItem, IeltsView, PRACTICE_ITEMS, SIMULATION_ITEMS, WritingSubView, IELTSExitModalProps

### Community 48 - "Community 48"
Cohesion: 0.20
Nodes (8): BookOpenIcon(), ClipboardCheckIcon(), PodcastIcon(), OrgTab, skillData, SkillRow, statusConfig, LibraryItem

### Community 49 - "Community 49"
Cohesion: 0.24
Nodes (4): WRITING_PROMPTS, WritingPrompt, TASK_TYPES, WritingDashboardProps

### Community 50 - "Community 50"
Cohesion: 0.24
Nodes (9): AnalysisSegment, CRITERION_DETAILS, segColor, segNote(), WritingAnalysisModal(), WritingAnalysisModalProps, WritingCriterion, WritingRewrite (+1 more)

### Community 51 - "Community 51"
Cohesion: 0.22
Nodes (5): AddCoursesViewProps, initialCourses, dummyAnswers, QAViewProps, questions

### Community 52 - "Community 52"
Cohesion: 0.22
Nodes (6): BUNDLE_HEX, SKILL_HEX, SKILLS, TOKEN_TYPE_COLOR, DIAGNOSTIC_SUBSKILLS, MISTAKE_TOKENS

### Community 53 - "Community 53"
Cohesion: 0.22
Nodes (5): skillDotColors, STATUS_LABEL, StatusFilter, TASK_LABELS, WritingHistoryMatrixProps

### Community 54 - "Community 54"
Cohesion: 0.25
Nodes (4): DebateSession, DebateViewProps, Message, LinkIcon()

### Community 55 - "Community 55"
Cohesion: 0.29
Nodes (3): Activity, IndividualSandboxViewProps, PromptEntry

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (4): containerVariants, itemVariants, reasoningSteps, ReasoningViewProps

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (3): description, name, requestFramePermissions

## Knowledge Gaps
- **424 isolated node(s):** `AuthSessionData`, `ApiError`, `Message`, `Conversation`, `MIHU_RESPONSES` (+419 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IeltsBundleId` connect `Community 35` to `Community 7`, `Community 42`, `Community 12`, `Community 47`, `Community 52`, `Community 27`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `XIcon()` connect `Community 5` to `Community 0`, `Community 32`, `Community 2`, `Community 3`, `Community 4`, `Community 1`, `Community 9`, `Community 11`, `Community 13`, `Community 45`, `Community 21`, `Community 24`, `Community 26`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `ChevronDownIcon()` connect `Community 5` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 32`, `Community 36`, `Community 9`, `Community 24`, `Community 26`, `Community 59`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `AuthSessionData`, `ApiError`, `Message` to the rest of the system?**
  _424 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05939716312056738 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06533776301218161 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08048780487804878 - nodes in this community are weakly interconnected._