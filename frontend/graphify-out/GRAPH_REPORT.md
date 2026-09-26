# Graph Report - frontend  (2026-09-27)

## Corpus Check
- 165 files · ~348,627 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1603 nodes · 2668 edges · 102 communities (95 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7e56eed`
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
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]

## God Nodes (most connected - your core abstractions)
1. `XIcon()` - 24 edges
2. `ChevronDownIcon()` - 21 edges
3. `BookOpenIcon()` - 21 edges
4. `CheckCircleIcon()` - 20 edges
5. `HistoryItem` - 18 edges
6. `PlusIcon()` - 16 edges
7. `compilerOptions` - 16 edges
8. `GlobeIcon()` - 14 edges
9. `ChevronLeftIcon()` - 14 edges
10. `IeltsSkill` - 13 edges

## Surprising Connections (you probably didn't know these)
- `AISpeakingPartnerView()` --calls--> `useAuth()`  [INFERRED]
  src/components/ai-speaking-partner/AISpeakingPartnerView.tsx → authContext.tsx
- `DashboardProps` --references--> `Theme`  [EXTRACTED]
  components/Dashboard.tsx → App.tsx
- `EnterpriseViewProps` --references--> `Theme`  [EXTRACTED]
  components/EnterpriseView.tsx → App.tsx
- `LandingPageProps` --references--> `Theme`  [EXTRACTED]
  components/LandingPage.tsx → App.tsx
- `WorkspaceDropdownProps` --references--> `Theme`  [EXTRACTED]
  components/WorkspaceDropdown.tsx → App.tsx

## Import Cycles
- 1-file cycle: `components/ai-speaking-partner/AISpeakingPartnerView.tsx -> components/ai-speaking-partner/AISpeakingPartnerView.tsx`
- 1-file cycle: `components/ai-speaking-partner/index.ts -> components/ai-speaking-partner/index.ts`
- 1-file cycle: `components/mock-tests/speaking/SpeakingExamWorkspace.tsx -> components/mock-tests/speaking/SpeakingExamWorkspace.tsx`
- 1-file cycle: `components/mock-tests/speaking/SpeakingHubView.tsx -> components/mock-tests/speaking/SpeakingHubView.tsx`
- 1-file cycle: `components/mock-tests/speaking/index.ts -> components/mock-tests/speaking/index.ts`
- 1-file cycle: `components/mock-tests/speaking/speakingExamShared.ts -> components/mock-tests/speaking/speakingExamShared.ts`
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanel.tsx -> components/Dashboard.tsx`
- 3-file cycle: `components/Dashboard.tsx -> components/Workspace.tsx -> components/TutorPanelErrorBoundary.tsx -> components/Dashboard.tsx`
- 3-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> App.tsx`
- 3-file cycle: `App.tsx -> components/Dashboard.tsx -> components/WorkspaceDropdown.tsx -> App.tsx`
- 3-file cycle: `App.tsx -> components/LandingPage.tsx -> components/EnterpriseView.tsx -> App.tsx`
- 4-file cycle: `App.tsx -> components/Dashboard.tsx -> components/Sidebar.tsx -> components/WorkspaceDropdown.tsx -> App.tsx`

## Communities (102 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (20): allFormalSourcesList, defaultPreferences, domainOptions, gridEvents, heroEvents, historyBenchmarks, CompetitionEvent, CompetitionSource (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (10): CirclePlusIcon(), LoadingSpinnerIcon(), MicOffIcon(), MindMapIcon(), QuizIcon(), SummaryIcon(), TimelineIcon(), WaveformIcon() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.24
Nodes (6): BookmarkIcon(), HeartIcon(), basePosts, mentorBorderColors, storiesData, tierBorderColor

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (36): DashboardViewProps, AddCoursesIcon(), CalendarIcon(), ChevronRightIcon(), ClockIcon(), CreditCardIcon(), CubeIcon(), DatabaseIcon() (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (22): defaultOnboardingData, Expert, filters, filterTypeMap, initialExperts, AdjustIcon(), AlertIcon(), BookOpenIcon() (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (21): ModuleHistoryItem, ModuleHistoryProps, STATUS_LABEL, StatusFilter, BundleAnalysis, BundleSectionAnalysis, ResolvedAnalysis, EQUIPMENT_CHECKS (+13 more)

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
Cohesion: 0.06
Nodes (30): ACCURACY_ERRORS, AccuracyError, GrammarEvaluationCardProps, SENTENCE_PROOFS, SentenceProof, ChatMessage, ChatRole, ConnectionStatus (+22 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (12): PauseIcon(), EvaluationItem, NavGroup, NavLeaf, OwnerApprovalItem, RbacTier, ReviewSubmission, SegmentKey (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (26): addAttempt(), ATTEMPTS_KEY, clampBand(), clearAttempts(), clearAttemptsByBundle(), clearAttemptsBySkill(), DEMO_TITLES, DiagnosticSubSkill (+18 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): AddProjectModalProps, categoryOptions, courseOptions, moduleOptions, seedProjects, ProjectCard, ProjectCategory, ProjectMeta (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (19): ACTIVE_IDS, ALL_IDS, DynamicListeningQuestion, DynamicListeningQuestionGroup, DynamicListeningSection, IELTSListeningExamProps, LISTENING_PART1_DATA, LISTENING_PART2_DATA (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (3): ScoreFilter, StreaksViewProps, TimeFilter

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (6): CATEGORIES, INITIAL_BOOKS, KnowledgeBook, ParsedRule, PRIORITIES, STRICTNESS_OPTIONS

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (15): CAMBRIDGE_7_TEST_2_ANSWERS_KEY, CAMBRIDGE_7_TEST_2_RIGHT_PANEL, CAMBRIDGE_7_TEST_3_ANSWERS_KEY, CAMBRIDGE_7_TEST_3_RIGHT_PANEL, CAMBRIDGE_7_TEST_4_ANSWERS_KEY, CAMBRIDGE_7_TEST_4_RIGHT_PANEL, MOCK_DICTIONARY, PART_2_HEADINGS (+7 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (17): IELTSReadingExamProps, buildBilingual(), buildSegments(), formatClock(), SimulationProps, TASK2_PROMPTS, WritingCriteria, IELTSSpeakingExamProps (+9 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (22): dependencies, framer-motion, @google/genai, lucide-react, react, react-dom, react-player, sonner (+14 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (15): BASE_CARDS, CardFormat, COHORT_ERRORS, CohortError, Deck, DeckCategory, DECKS, EXTRA_CARDS (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (10): AISpeakingPartnerView(), AppContent(), AuthContext, AuthContextType, AuthProvider(), useAuth(), AISpeakingPartnerView(), root (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.15
Nodes (8): seedMethodsLm1, DiagnosticsSidebarProps, categoryMeta, MethodologyGridProps, seedMethods, LearningEngineState, LearningMethod, MethodCategory

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
Cohesion: 0.10
Nodes (20): defaultConfig, DiscoverViewProps, processingLogs, ChatIcon(), CloudyIcon(), RedditIcon(), ShareIcon(), SunIcon() (+12 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (11): ObjectiveAnalysis, SegmentKind, SpeakingAnalysis, WritingAnalysis, BandPill(), IELTSAnalysisViewProps, segColor, segNote() (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (16): AIIELTSChatbotViewProps, Conversation, Message, QUICK_PROMPTS, RAYAN_RESPONSES, IELTSAdvisorDrawerProps, LocalMessage, QUICK_PROMPTS (+8 more)

### Community 29 - "Community 29"
Cohesion: 0.11
Nodes (4): baseCards, CardData, demoCards, FlashcardReviewController()

### Community 30 - "Community 30"
Cohesion: 0.05
Nodes (17): AIScoringAccordionProps, AISpeakingPartnerViewProps, CallState, ChatMessage, EvalState, Evaluation, Language, LANGUAGE_LABELS (+9 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (10): DoubleChevronDownIcon(), MaximizeIcon(), MinimizeIcon(), ViewSidebarIcon(), UpgradeModal(), Chapter, MOCK_CHAPTERS, MOCK_TRANSCRIPTS (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.05
Nodes (17): AIScoringAccordionProps, AISpeakingPartnerViewProps, CallState, ChatMessage, EvalState, Evaluation, Language, LANGUAGE_LABELS (+9 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (16): ALL_QUESTION_KEYS, ANSWER_HEADINGS, GAP_ANSWERS, GAP_FILL, GapFillQuestion, GROUP_ANSWERS, GROUP_MAP, HEADING_SLOTS (+8 more)

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (7): Candidate, CANDIDATES, INTERVENTION_PILL, InterventionFilter, RISK_PILL, RiskLevel, StatusFilter

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (11): formatClock(), NewSpeakingExamRunner(), NewSpeakingExamRunnerProps, PART1_TOPICS, Part1Topic, PART2_TOPICS, Part2Topic, PART3_TOPICS (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.08
Nodes (27): Message, models, ChevronDownIcon(), ClipboardIcon(), CopyIcon(), FlowChartIcon(), LineChartIcon(), LinkIcon() (+19 more)

### Community 38 - "Community 38"
Cohesion: 0.14
Nodes (4): ActiveTab, AIRewriterViewProps, MOCK_EVALUATION, TaskType

### Community 39 - "Community 39"
Cohesion: 0.07
Nodes (25): carouselItems, BarChartIcon(), ChevronLeftIcon(), EyeIcon(), EyeSlashIcon(), GoogleIcon(), TrendingUpIcon(), adminKeys (+17 more)

### Community 40 - "Community 40"
Cohesion: 0.15
Nodes (9): DAYS_OF_WEEK, LessonTask, SEPTEMBER_GRID, Skill, SKILL_COLORS, SKILL_EMOJI, SKILL_ICON_CIRCLE, STUDY_PLAN_DATA (+1 more)

### Community 41 - "Community 41"
Cohesion: 0.07
Nodes (22): ACADEMIC_BOOKS, BookTest, ExamModeType, GT_BOOKS, LISTEN_DRILLS, LISTENING_SECTION_TITLES, PartPracticeHubProps, PracticeItem (+14 more)

### Community 42 - "Community 42"
Cohesion: 0.12
Nodes (7): AccordionCardProps, DIFFICULTY_MAP, MOCK_SERIES, TestSeries, WRITING_MODES, WritingHubViewProps, WritingMode

### Community 43 - "Community 43"
Cohesion: 0.12
Nodes (7): ACADEMIC_CAMBRIDGE_SERIES, ACADEMIC_MOCK_SERIES, AccordionCardProps, DIFFICULTY_MAP, GT_CAMBRIDGE_SERIES, ReadingHubViewProps, TestSeries

### Community 44 - "Community 44"
Cohesion: 0.17
Nodes (6): ContactUsSlideProps, DebateSession, DebateViewProps, Message, PhoneIcon(), SendIcon()

### Community 45 - "Community 45"
Cohesion: 0.10
Nodes (9): DISABLED_DORMANT_NAV_ITEMS, DORMANT_NAV_KEYS, FeedbackModalProps, faqs, InviteEarnViewProps, DeleteSpaceModal(), ShareSpaceModal(), guideSections (+1 more)

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
Cohesion: 0.20
Nodes (7): BUNDLE_HEX, IELTSDashboardProps, SKILL_HEX, SKILLS, TOKEN_TYPE_COLOR, DIAGNOSTIC_SUBSKILLS, MISTAKE_TOKENS

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (7): Theme, DashboardProps, EnterpriseViewProps, SidebarProps, SpaceViewProps, WorkspaceDropdownProps, Space

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
Cohesion: 0.11
Nodes (29): ActivationView(), ActivationViewProps, OrgAuthModal(), OrgAuthModalProps, InstitutionalDashboard(), activateTenant(), addLibraryItem(), addPartnershipRequest() (+21 more)

### Community 57 - "Community 57"
Cohesion: 0.25
Nodes (7): AddContentViewProps, HistoryItem, HistoryViewProps, TutorPanelProps, CinematicContentPanelProps, WorkspaceProps, LandingViewProps

### Community 58 - "Community 58"
Cohesion: 0.25
Nodes (3): Props, State, TutorPanelErrorBoundary

### Community 59 - "Community 59"
Cohesion: 0.08
Nodes (23): AuthGatewayProps, DynamicQuestion, DynamicQuestionGroup, DynamicRightPanelProps, MaraAvatarProps, CAMBRIDGE_SPEAKING_BANK, fetchSpeakingExamData(), generateFallbackTest() (+15 more)

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (3): description, name, requestFramePermissions

### Community 63 - "Community 63"
Cohesion: 0.15
Nodes (8): days, durations, metrics, Mission, mockData, modules, priorities, timeBlocks

### Community 64 - "Community 64"
Cohesion: 0.13
Nodes (17): Dashboard(), EnterpriseSandboxViewProps, LEADERBOARD_DATA, WorkspaceDropdown(), IELTSEvaluationHub(), INDIVIDUAL_WORKSPACE, KNOWN_WORKSPACE_CODES, KnownWorkspaceEntry (+9 more)

### Community 65 - "Community 65"
Cohesion: 0.17
Nodes (8): metrics, MockTest, StatusFilter, statusOptions, tests, TestStatus, TypeFilter, typeOptions

### Community 66 - "Community 66"
Cohesion: 0.29
Nodes (4): containerVariants, itemVariants, reasoningSteps, ReasoningViewProps

### Community 67 - "Community 67"
Cohesion: 0.15
Nodes (8): AuthType, AuthOverlayProps, ArrowUpRightIcon(), EdgramIcon(), MoonIcon(), QuestionMarkIcon(), LandingPageProps, universities

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
Cohesion: 0.16
Nodes (17): IELTSListeningExam(), IELTSReadingExam(), rawToBand(), C7_T1_EXPLANATIONS, CAMBRIDGE_7_TEST_1_PASSAGES, ReadingExamResultsViewProps, styles, VOCAB_LOOKUP (+9 more)

### Community 72 - "Community 72"
Cohesion: 0.12
Nodes (14): HawkingFabProps, Message, RAYAN_FALLBACKS, STARTER_PROMPTS, BrainIcon(), CheckIcon(), DebatePodiumIcon(), FlashIcon() (+6 more)

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

### Community 79 - "Community 79"
Cohesion: 0.17
Nodes (7): socialIcons, CompassIcon(), FacebookIcon(), HomeIcon(), InstagramIcon(), LayersIcon(), TiktokIcon()

### Community 80 - "Community 80"
Cohesion: 0.13
Nodes (15): ArrowUpIcon(), BuildingLibraryIcon(), ClipboardCheckIcon(), FlashcardIcon(), LogoutIcon(), PlusSquareIcon(), PodcastIcon(), ShieldCheckIcon() (+7 more)

### Community 81 - "Community 81"
Cohesion: 0.21
Nodes (12): DeviceCheckWizard(), DeviceCheckWizardProps, ExamInstructionsScreen(), ExamInstructionsScreenProps, INSTRUCTION_DATA, ModuleType, ExamLauncherFlow(), ExamLauncherFlowProps (+4 more)

### Community 82 - "Community 82"
Cohesion: 0.22
Nodes (7): BriefcaseIcon(), DollarIcon(), ReelsIcon(), difficultyColor, mockBounties, mockCourses, statusColor

### Community 83 - "Community 83"
Cohesion: 0.29
Nodes (4): DotsHorizontalIcon(), dayData, RoadmapDayProps, RoadmapViewProps

### Community 84 - "Community 84"
Cohesion: 0.13
Nodes (8): FlaskIcon(), MapPinIcon(), MicroscopeIcon(), SearchIcon(), Application, Lab, MOCK_APPLICATIONS, MOCK_LABS

### Community 85 - "Community 85"
Cohesion: 0.14
Nodes (7): ACADEMIC_CAMBRIDGE_SERIES, ACADEMIC_MOCK_SERIES, AccordionCardProps, DIFFICULTY_MAP, GT_CAMBRIDGE_SERIES, SpeakingHubViewProps, TestSeries

### Community 86 - "Community 86"
Cohesion: 0.22
Nodes (5): AddCoursesViewProps, initialCourses, dummyAnswers, QAViewProps, questions

### Community 87 - "Community 87"
Cohesion: 0.25
Nodes (5): ExamPaperPenIcon(), FileTextIcon(), LockClosedIcon(), VideoCameraIcon(), CourseOutlineViewProps

### Community 88 - "Community 88"
Cohesion: 0.29
Nodes (5): Bounty, Course, FeedConfig, Post, Story

### Community 92 - "Community 92"
Cohesion: 0.40
Nodes (3): INITIAL_TICKETS, SupportTicket, SupportViewProps

## Knowledge Gaps
- **640 isolated node(s):** `AuthContextType`, `AuthContext`, `Message`, `Conversation`, `RAYAN_RESPONSES` (+635 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `supabase` connect `Community 59` to `Community 39`, `Community 14`, `Community 17`, `Community 18`, `Community 21`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Community 21` to `Community 33`, `Community 18`, `Community 12`, `Community 30`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `IeltsBundleId` connect `Community 5` to `Community 7`, `Community 12`, `Community 46`, `Community 51`, `Community 27`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `AuthContextType`, `AuthContext`, `Message` to the rest of the system?**
  _640 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06641604010025062 - nodes in this community are weakly interconnected._