
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeftIcon, ChevronDownIcon, CheckCircleIcon, 
    VideoCameraIcon, BookOpenIcon, XIcon, LockClosedIcon,
    AdjustIcon, ExamPaperPenIcon, ChevronRightIcon, ClockIcon,
    FileTextIcon, PencilIcon, MessageCircleIcon, PlusIcon
} from '../icons';
import { HistoryItem } from '../Dashboard';

interface CourseOutlineViewProps {
    onBack: () => void;
    onStartLearning: () => void;
    topic: string;
}

const ShimmerBlock = ({ className }: { className: string }) => (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 rounded ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"></div>
    </div>
);

const CourseOutlineView: React.FC<CourseOutlineViewProps> = ({ onBack, onStartLearning, topic }) => {
    const [currentView, setCurrentView] = useState('course_material');
    const [activeModule, setActiveModule] = useState(1);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [showObjectives, setShowObjectives] = useState(false);
    
    // Loading State Logic
    const [isLoading, setIsLoading] = useState(false);
    const [visitedViews, setVisitedViews] = useState<Set<string>>(new Set());

    const handleNavigate = (view: string) => {
        if (view === currentView) return;

        if (view === 'course_material') {
            setCurrentView(view);
            return;
        }

        if (!visitedViews.has(view)) {
            setIsLoading(true);
            setCurrentView(view);
            setTimeout(() => {
                setIsLoading(false);
                setVisitedViews(prev => new Set(prev).add(view));
            }, 1000);
        } else {
            setCurrentView(view);
            setIsLoading(false);
        }
    };

    const handleModuleSelect = (modIndex: number) => {
        handleNavigate('course_material');
        setActiveModule(modIndex + 1);
        setShowObjectives(false);
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    // Define Module Data
    const modulesData: any = {
        1: {
            title: "Introducing data analytics and analytical thinking",
            stats: { video: "46 min video", reading: "56 min reading", quiz: "1 graded assessment" },
            description: "Data helps us make decisions in both everyday life and in business. In this part of the course, you'll learn how data analysts use a variety of tools and skills to inform those decisions. You'll also get to know more about this course and the overall program expectations.",
            objectives: [
                "Define key concepts involved in data analytics including data, data analysis, and data ecosystem",
                "Discuss the use of data in everyday life decisions",
                "Identify the key features of the learning environment and their uses",
                "Describe principles and practices that will help to increase one's chances of success in this certificate",
                "Explain the use of data in organizational decision-making",
                "Describe the key concepts to be discussed in the program, including learning outcomes"
            ],
            sections: [
                {
                    id: 'get-started',
                    title: 'Get started',
                    items: [
                        { title: 'Welcome to the Google Data Analytics Certificate', type: 'Video', duration: '9 min', completed: true },
                        { title: 'Course 1 overview: Set your expectations', type: 'Reading', duration: '8 min', completed: true },
                        { title: 'Introduction to the course', type: 'Video', duration: '4 min', completed: true },
                        { title: 'Get started with your Google Data Analytics Certificate', type: 'Video', duration: '2 min', completed: true },
                        { title: 'Helpful resources and tips', type: 'Reading', duration: '4 min', completed: true },
                        { title: 'Evaluate your current data analytics skills', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Google Data Analytics Certificate participant entry survey', type: 'Ungraded Plugin', duration: '10 min', completed: false, showResume: true },
                    ]
                },
                {
                    id: 'transform-data',
                    title: 'Transform data into insights',
                    items: [
                        { title: 'Data analytics in everyday life', type: 'Video', duration: '4 min', completed: false },
                        { title: 'Identify data types in a spreadsheet', type: 'Practice Assignment', duration: '30 min', completed: false },
                        { title: 'New data perspectives', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'How data analysts approach tasks', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Cassie: Dimensions of data analytics', type: 'Video', duration: '4 min', completed: false },
                    ]
                },
                {
                    id: 'data-ecosystem',
                    title: 'Understand the data ecosystem',
                    items: [
                        { title: 'Origins of the data analysis process', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'What is the data ecosystem?', type: 'Video', duration: '4 min', completed: false },
                        { title: 'How data informs better decisions', type: 'Video', duration: '4 min', completed: false },
                        { title: 'Data and gut instinct', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Test your knowledge on the data ecosystem', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'analyst-skills',
                    title: 'Embrace your data analyst skills',
                    items: [
                        { title: 'Discover data skill sets', type: 'Video', duration: '46 sec', completed: false },
                        { title: 'Key data analyst skills', type: 'Video', duration: '6 min', completed: false },
                        { title: 'Use data analytics skills in a business scenario', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Practice data analyst skills', type: 'Ungraded Plugin', duration: '10 min', completed: false },
                        { title: 'Test your knowledge on data analyst skills', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'analytical-thinking',
                    title: 'Analytical thinking for effective outcomes',
                    items: [
                        { title: 'All about thinking analytically', type: 'Video', duration: '5 min', completed: false },
                        { title: 'Explore core analytical skills', type: 'Video', duration: '4 min', completed: false },
                        { title: 'Use the five whys for root cause analysis', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Data drives successful outcomes', type: 'Video', duration: '4 min', completed: false },
                        { title: 'Witness data magic', type: 'Video', duration: '5 min', completed: false },
                        { title: 'Test your knowledge on analytical thinking and outcomes', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'module-challenge',
                    title: 'Module 1 challenge',
                    rightLabel: '1 graded assessment left',
                    items: [
                        { title: 'What to expect moving forward', type: 'Video', duration: '1 min', completed: false },
                        { title: 'Glossary terms from course 1, module 1', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Assessment-taking strategies', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Module 1 challenge', type: 'Graded Assignment', duration: '40 min', completed: false },
                    ]
                }
            ]
        },
        2: {
            title: "The wonderful world of data",
            stats: { video: "25 min of videos left", reading: "22 min of readings left", quiz: "1 graded assessment left" },
            description: "In this part of the course, you’ll learn about the data life cycle and data analysis process. They are both relevant to your work in this program and on the job. You’ll also be introduced to applications that help guide data through the data analysis process.",
            objectives: [
                "Identify key software applications critical to the work of a data analyst including spreadsheets, databases, query languages, and visualization tools",
                "Identify relationships between the data analysis process and the courses in the Google Data Analytics Certificate",
                "Explain the data analysis process, making specific reference to the ask, prepare, process, analyze, share, and act phases",
                "Discuss the use of data in everyday life decisions",
                "Discuss the role of spreadsheets, query languages, and data visualization tools in data analytics",
                "Discuss the phases of the data life cycle"
            ],
            sections: [
                {
                    id: 'follow-data-life-cycle',
                    title: 'Follow the data life cycle',
                    items: [
                        { title: 'Learn about data phases and tools', type: 'Video', duration: '2 min', completed: false },
                        { title: 'Phases of data analysis', type: 'Ungraded Plugin', duration: '10 min', completed: false },
                        { title: 'Stages of the data life cycle', type: 'Video', duration: '4 min', completed: false },
                        { title: 'Variations of the data life cycle', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Test your knowledge on the data life cycle', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'outline-data-analysis',
                    title: 'Outline the data analysis process',
                    items: [
                        { title: 'The phases of data analysis and this program', type: 'Video', duration: '6 min', completed: false },
                        { title: 'More on the phases of data analysis and this program', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Molly: Example of the data analysis process', type: 'Video', duration: '6 min', completed: false },
                        { title: 'Test your knowledge on the data analysis process', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'data-analysis-toolbox',
                    title: 'The data analysis toolbox',
                    items: [
                        { title: 'Explore data analyst tools', type: 'Video', duration: '6 min', completed: false },
                        { title: 'Key data analyst tools', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Choose the right tool for the job', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Self-Reflection: Review past concepts', type: 'Practice Assignment', duration: '20 min', completed: false },
                        { title: 'Test your knowledge on the data analysis toolbox', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'module-2-challenge',
                    title: 'Module 2 challenge',
                    rightLabel: '1 graded assessment left',
                    items: [
                        { title: 'Glossary terms from course 1, module 2', type: 'Reading', duration: '2 min', completed: false },
                        { title: 'Module 2 challenge', type: 'Graded Assignment', duration: '50 min', completed: false },
                    ]
                }
            ]
        },
        3: {
            title: "Set up your data analytics toolbox",
            stats: { video: "24 min of videos left", reading: "34 min of readings left", quiz: "1 graded assessment left" },
            description: "Spreadsheets, query languages, and data visualization tools are all a big part of a data analyst’s job. In this part of the course, you’ll learn the basic concepts to use them for data analysis. You’ll also understand how they work through interesting examples.",
            objectives: [
                "Describe spreadsheets, query languages, and data visualization tools, giving specific examples",
                "Demonstrate an understanding of the uses, basic features, and functions of a spreadsheet",
                "Explain the basic concepts involved in the use of SQL including specific examples of queries",
                "Identify the basic concepts involved in data visualization, giving specific examples"
            ],
            sections: [
                {
                    id: 'master-spreadsheet-basics',
                    title: 'Master spreadsheet basics',
                    items: [
                        { title: 'The ins and outs of core data tools', type: 'Video', duration: '2 min', completed: false },
                        { title: 'Step-by-Step: Make spreadsheets your friend', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Make spreadsheets your friend', type: 'Video', duration: '8 min', completed: false },
                        { title: 'Hands-On Activity: Generate a chart from a spreadsheet', type: 'Practice Assignment', duration: '1h', completed: false },
                        { title: 'More spreadsheet resources', type: 'Reading', duration: '4 min', completed: false },
                        { title: 'Test your knowledge on spreadsheet basics', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'get-started-sql-viz',
                    title: 'Get started with SQL and data visualization',
                    items: [
                        { title: 'SQL in action', type: 'Video', duration: '3 min', completed: false },
                        { title: 'SQL guide: Getting started', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Angie: Everyday struggles when learning new skills', type: 'Video', duration: '1 min', completed: false },
                        { title: 'Endless SQL possibilities', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Become a data viz whiz', type: 'Video', duration: '5 min', completed: false },
                        { title: 'Plan a data visualization', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Lilah: The power of a visualization', type: 'Video', duration: '2 min', completed: false },
                        { title: 'Test your knowledge on SQL and data visualization', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'module-3-challenge',
                    title: 'Module 3 challenge',
                    rightLabel: '1 graded assessment left',
                    items: [
                        { title: 'Glossary terms from course 1, module 3', type: 'Reading', duration: '2 min', completed: false },
                        { title: 'Module 3 challenge', type: 'Graded Assignment', duration: '50 min', completed: false },
                    ]
                }
            ]
        },
        4: {
            title: "Become a fair and impactful data professional",
            stats: { video: "36 min of videos left", reading: "38 min of readings left", quiz: "1 graded assessment left" },
            description: "In this part of the course, you’ll examine different types of businesses and the jobs and tasks that analysts do for them. You’ll also learn how a Google Data Analytics Certificate will help you meet many of the requirements for an analyst position with these organizations.",
            objectives: [
                "Describe the role of a data analyst with specific reference to job roles",
                "Discuss how the Google Data Analytics Certificate can help a candidate meet the requirements of a given job",
                "Explain how a business task may be appropriate for a data analyst, with reference to fairness and the value of the data analyst",
                "Identify companies that would potentially hire data analysts",
                "Describe how one's prior experiences may be applied to a career as a data analyst",
                "Determine whether the use of data constitutes fair or unfair practices",
                "Understand the different ways organizations use data",
                "Explain the concept of data-driven decision-making including specific examples"
            ],
            sections: [
                {
                    id: 'data-analyst-job-opportunities',
                    title: 'Data analyst job opportunities',
                    items: [
                        { title: "Let's get down to business", type: 'Video', duration: '49 sec', completed: false },
                        { title: 'The job of a data analyst', type: 'Video', duration: '4 min', completed: false },
                        { title: 'Joey: Path to becoming a data analyst', type: 'Video', duration: '2 min', completed: false },
                        { title: 'Self-Reflection: Business use of data', type: 'Practice Assignment', duration: '20 min', completed: false },
                        { title: 'Tony: Supporting careers in data analytics', type: 'Video', duration: '2 min', completed: false },
                        { title: 'Test your knowledge on data analyst roles', type: 'Ungraded Plugin', duration: '10 min', completed: false },
                    ]
                },
                {
                    id: 'importance-fair-business',
                    title: 'The importance of fair business decisions',
                    items: [
                        { title: 'The power of data in business', type: 'Video', duration: '4 min', completed: false },
                        { title: 'Rachel: Data detectives', type: 'Video', duration: '2 min', completed: false },
                        { title: 'Understand data and fairness', type: 'Video', duration: '5 min', completed: false },
                        { title: 'Consider fairness', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Self-Reflection: Business cases', type: 'Practice Assignment', duration: '20 min', completed: false },
                        { title: 'Alex: Fair and ethical data decisions', type: 'Video', duration: '3 min', completed: false },
                        { title: 'Test your knowledge on making fair business decisions', type: 'Practice Assignment', duration: '8 min', completed: false },
                    ]
                },
                {
                    id: 'optional-explore-job',
                    title: 'Optional: Explore your next job',
                    items: [
                        { title: 'Data analysts in different industries', type: 'Video', duration: '5 min', completed: false },
                        { title: 'Data analyst roles and job descriptions', type: 'Reading', duration: '8 min', completed: false },
                        { title: 'Samah: Interview best practices', type: 'Video', duration: '2 min', completed: false },
                        { title: 'Beyond the numbers: A data analyst journey', type: 'Reading', duration: '14 min', completed: false },
                    ]
                },
                {
                    id: 'module-4-challenge',
                    title: 'Module 4 challenge',
                    rightLabel: '1 graded assessment left',
                    items: [
                        { title: 'Glossary terms from course 1, module 4', type: 'Reading', duration: '2 min', completed: false },
                        { title: 'Module 4 challenge', type: 'Graded Assignment', duration: '40 min', completed: false },
                    ]
                },
                {
                    id: 'course-wrap-up',
                    title: 'Course wrap-up',
                    items: [
                        { title: 'Join the community', type: 'Reading', duration: '2 min', completed: false },
                        { title: 'Course 1 glossary', type: 'Reading', duration: '2 min', completed: false },
                        { title: 'Congratulations! Course wrap-up', type: 'Video', duration: '3 min', completed: false },
                        { title: 'Coming up next...', type: 'Reading', duration: '2 min', completed: false },
                    ]
                }
            ]
        }
    };

    // Initialize expanded sections for the current module
    useEffect(() => {
        if (modulesData[activeModule]) {
            setExpandedSections(modulesData[activeModule].sections.map((s:any) => s.id));
        }
    }, [activeModule]);

    // --- Render Functions ---

    const renderGrades = () => {
        if (isLoading) {
            return (
                <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                    <ShimmerBlock className="h-10 w-32 mb-8" />
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <ShimmerBlock className="h-6 w-6 rounded-full" />
                            <ShimmerBlock className="h-4 w-64" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <ShimmerBlock className="h-10 w-10 rounded-full" />
                                    <div>
                                        <ShimmerBlock className="h-4 w-48 mb-2" />
                                        <ShimmerBlock className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <ShimmerBlock className="h-4 w-20" />
                                    <ShimmerBlock className="h-4 w-12" />
                                    <ShimmerBlock className="h-4 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold dark:text-white text-black mb-8">Grades</h1>
                
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4 mb-8 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Due date has passed for 1 assessment items.</span>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-6">Item</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Due</div>
                        <div className="col-span-1">Weight</div>
                        <div className="col-span-1">Grade</div>
                    </div>
                    
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {/* Overdue Item */}
                        <div className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                            <div className="col-span-6 flex items-start gap-3">
                                <div className="mt-0.5">
                                    <ClockIcon className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Module 1 challenge</p>
                                    <p className="text-xs text-gray-500">Graded Assignment</p>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Overdue</span>
                            </div>
                            <div className="col-span-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-medium">Jan 2</div>
                                <div>11:59 PM +06</div>
                            </div>
                            <div className="col-span-1 text-xs text-gray-600 dark:text-gray-400">20%</div>
                            <div className="col-span-1 text-xs text-gray-400">--</div>
                        </div>

                        {/* Locked Items */}
                        {[
                            { name: 'Module 2 challenge', due: 'Jan 6' },
                            { name: 'Module 3 challenge', due: 'Jan 9' },
                            { name: 'Module 4 challenge', due: 'Jan 13' }
                        ].map((item, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                <div className="col-span-6 flex items-start gap-3">
                                    <div className="mt-0.5 p-1 bg-gray-100 dark:bg-gray-800 rounded">
                                        <LockClosedIcon className="w-3 h-3 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{item.name}</p>
                                        <p className="text-xs text-gray-500">Graded Assignment</p>
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-bold">i</div>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Locked</span>
                                </div>
                                <div className="col-span-2 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
                                        <div>
                                            <div className="font-medium">{item.due}</div>
                                            <div>11:59 PM +06</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 text-xs text-gray-600 dark:text-gray-400">{i === 0 || i === 1 ? '30%' : '20%'}</div>
                                <div className="col-span-1 text-xs text-gray-400">--</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderNotes = () => {
        if (isLoading) {
            return (
                <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                    <div className="flex justify-between items-center mb-12">
                        <ShimmerBlock className="h-10 w-32" />
                        <ShimmerBlock className="h-8 w-40" />
                    </div>
                    <div className="flex flex-col items-center justify-center pt-20">
                        <ShimmerBlock className="h-24 w-24 rounded-xl mb-6" />
                        <ShimmerBlock className="h-6 w-96 mb-2" />
                        <ShimmerBlock className="h-4 w-64" />
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-5xl mx-auto h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold dark:text-white text-black">Notes</h1>
                </div>
                
                <div className="mb-12">
                    <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                        <span>Filter: All notes</span>
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                    <div className="relative mb-6">
                        <FileTextIcon className="w-24 h-24 text-black dark:text-white stroke-[1.5]" />
                        <div className="absolute -right-2 -top-2">
                            <PlusIcon className="w-8 h-8 text-black dark:text-white stroke-[3]" />
                        </div>
                        <div className="absolute -right-4 bottom-2 bg-blue-400 w-12 h-2 rounded-full transform -rotate-12"></div>
                        <div className="absolute -right-8 bottom-8 text-black dark:text-white">
                            <PencilIcon className="w-12 h-12 stroke-[1.5]" />
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 text-center">
                        You have not added any notes yet. Notes can be created from video pages.
                    </p>
                </div>
            </div>
        );
    };

    const renderMessages = () => {
        if (isLoading) {
            return (
                <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                    <ShimmerBlock className="h-10 w-40 mb-12" />
                    <div className="flex flex-col items-center justify-center pt-20">
                        <ShimmerBlock className="h-24 w-32 rounded-xl mb-6" />
                        <ShimmerBlock className="h-6 w-64" />
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-5xl mx-auto h-full flex flex-col">
                <h1 className="text-3xl font-bold dark:text-white text-black mb-12">Messages</h1>
                
                <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                    <div className="relative mb-8">
                        {/* Stacked cards illustration */}
                        <div className="w-24 h-16 bg-blue-400 rounded-lg absolute -top-4 -right-4 z-0"></div>
                        <div className="w-24 h-16 bg-blue-200 dark:bg-blue-900 rounded-lg absolute -top-2 -right-2 z-10"></div>
                        <div className="w-24 h-16 bg-white dark:bg-gray-200 border-2 border-black dark:border-gray-600 rounded-lg z-20 relative flex flex-col justify-center px-3 space-y-1.5 shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <div className="h-1 w-12 bg-gray-300 rounded"></div>
                            </div>
                            <div className="h-1 w-full bg-gray-300 rounded"></div>
                            <div className="h-1 w-full bg-gray-300 rounded"></div>
                            <div className="h-1 w-3/4 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        There are no messages yet.
                    </p>
                </div>
            </div>
        );
    };

    const renderCourseMaterial = () => {
        const data = modulesData[activeModule] || modulesData[1];
        
        return (
            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    {/* Module Progress Card */}
                    <div className="dark:bg-[#0a0a0a] bg-white border dark:border-white/10 border-neutral-200 rounded-[24px] p-8 mb-10 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <AdjustIcon className="w-32 h-32 dark:text-white text-black transform rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full dark:bg-white/10 bg-neutral-100 border dark:border-white/5 border-neutral-200 text-[11px] font-bold uppercase tracking-wider dark:text-white text-black">
                                    <span>Module {activeModule}</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold dark:text-white text-black mb-4 leading-tight">{data.title}</h2>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-8 text-[12px] font-bold text-gray-500 dark:text-gray-400">
                                <div className="flex items-center bg-neutral-100 dark:bg-white/5 px-3 py-1.5 rounded-lg"><VideoCameraIcon className="w-4 h-4 mr-2" /> {data.stats.video}</div>
                                <div className="flex items-center bg-neutral-100 dark:bg-white/5 px-3 py-1.5 rounded-lg"><BookOpenIcon className="w-4 h-4 mr-2" /> {data.stats.reading}</div>
                                <div className="flex items-center bg-neutral-100 dark:bg-white/5 px-3 py-1.5 rounded-lg"><ExamPaperPenIcon className="w-4 h-4 mr-2" /> {data.stats.quiz}</div>
                            </div>
                            
                            <div className="mb-8">
                                <p className="text-sm dark:text-gray-400 text-neutral-600 leading-relaxed mb-6 max-w-2xl">
                                    {data.description}
                                </p>
                                
                                <AnimatePresence>
                                    {showObjectives && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-gray-200 dark:border-white/10 pt-6 mt-4">
                                                <h4 className="font-bold text-black dark:text-white mb-4">Learning Objectives</h4>
                                                <ul className="space-y-3">
                                                    {data.objectives.map((obj: string, i: number) => (
                                                        <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                            <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-black dark:bg-white rounded-full shrink-0"></span>
                                                            {obj}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            <button 
                                onClick={() => setShowObjectives(!showObjectives)}
                                className="flex items-center text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors"
                            >
                                <ChevronDownIcon className={`w-4 h-4 mr-1 transition-transform duration-300 ${showObjectives ? 'rotate-180' : ''}`} /> 
                                {showObjectives ? 'Hide Learning Objectives' : 'Show Learning Objectives'}
                            </button>
                        </div>
                    </div>

                    {/* Section Accordions */}
                    <div className="space-y-4 mb-20">
                        {data.sections.map((section: any) => (
                            <div key={section.id} className="dark:bg-[#080808] bg-white border dark:border-white/10 border-neutral-200 rounded-2xl overflow-hidden transition-all hover:border-gray-400 dark:hover:border-gray-700">
                                <button 
                                    onClick={() => toggleSection(section.id)}
                                    className="flex items-center justify-between w-full p-6 text-left group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-1 rounded-full border transition-colors ${expandedSections.includes(section.id) ? 'dark:border-white border-black dark:text-white text-black' : 'border-gray-500 text-gray-500'}`}>
                                            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${expandedSections.includes(section.id) ? 'rotate-180' : 'rotate-0'}`} />
                                        </div>
                                        <span className="text-lg font-bold dark:text-white text-black group-hover:text-orange-500 transition-colors">{section.title}</span>
                                    </div>
                                    {section.rightLabel && (
                                        <span className="text-[11px] font-bold bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full uppercase tracking-wide">{section.rightLabel}</span>
                                    )}
                                </button>
                                
                                <AnimatePresence initial={false}>
                                    {expandedSections.includes(section.id) && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 space-y-1">
                                                <div className="w-px h-full absolute left-[29px] top-0 bg-neutral-200 dark:bg-white/10 z-0" />
                                                {section.items.map((item: any, idx: number) => (
                                                    <div 
                                                        key={idx} 
                                                        onClick={onStartLearning}
                                                        className="flex items-center justify-between p-4 ml-3 hover:bg-neutral-50 dark:hover:bg-white/[0.03] rounded-xl cursor-pointer transition-all group relative z-10"
                                                    >
                                                        <div className="flex items-start space-x-4">
                                                            <div className="mt-1 shrink-0">
                                                                {item.completed ? (
                                                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                                                ) : (
                                                                    <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-gray-700 group-hover:border-orange-500 transition-colors" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-[14px] font-semibold dark:text-gray-200 text-neutral-800 group-hover:text-orange-500 transition-colors leading-tight">{item.title}</p>
                                                                <div className="flex items-center mt-1.5 space-x-2">
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${item.type === 'Video' ? 'bg-blue-500/10 text-blue-500' : item.type === 'Reading' ? 'bg-purple-500/10 text-purple-500' : 'bg-gray-500/10 text-gray-500'}`}>{item.type}</span>
                                                                    <span className="text-[11px] text-gray-400">• {item.duration}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {item.showResume ? (
                                                            <button className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-orange-900/20 transition-all shrink-0 ml-4">
                                                                Resume
                                                            </button>
                                                        ) : (
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar - Sticky Purchase Card */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-6 space-y-6">
                        <div className="dark:bg-[#0a0a0a] bg-white border dark:border-white/10 border-neutral-200 rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <h3 className="text-lg font-bold dark:text-white text-black mb-4 leading-snug relative z-10">Unlock everything this Professional Certificate has to offer</h3>
                            <p className="text-xs dark:text-gray-400 text-neutral-600 mb-6 font-medium relative z-10">You're previewing the first module in this course.</p>
                            
                            <ul className="space-y-4 mb-8 relative z-10">
                                <li className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                                    <span>$20/mo, <span className="text-gray-500">cancel anytime</span></span>
                                </li>
                                <li className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                                    <span>Continue learning with <span className="dark:text-white font-bold">all 8 courses</span></span>
                                </li>
                                <li className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                                    <span>Master skills with <span className="dark:text-white font-bold">Coursera Coach</span></span>
                                </li>
                                <li className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                                    <span>Earn a certificate for your resume</span>
                                </li>
                            </ul>

                            <button className="w-full py-3.5 bg-white dark:bg-white text-black font-bold rounded-xl shadow-lg hover:bg-neutral-200 transition-all text-sm relative z-10">
                                Unlock full access
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full dark:bg-black bg-white overflow-hidden text-neutral-900 dark:text-gray-100">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b dark:border-white/10 border-neutral-200 shrink-0 dark:bg-black bg-white">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 dark:hover:bg-white/10 hover:bg-neutral-100 rounded-full transition-colors group">
                        <ChevronLeftIcon className="w-5 h-5 text-gray-500 group-hover:text-black dark:group-hover:text-white" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center text-[11px] text-white font-bold shadow-lg shadow-orange-900/20">G</div>
                        <h1 className="text-base font-bold dark:text-white text-neutral-900 tracking-tight" style={{ fontFamily: "'Lora', serif" }}>
                            {topic || "Foundations: Data, Data, Everywhere"}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Sidebar Nav - Expanded with Resources and Course Info */}
                <aside className="w-72 border-r dark:border-white/10 border-neutral-200 p-6 flex flex-col shrink-0 overflow-y-auto bg-neutral-50 dark:bg-[#050505] custom-scrollbar">
                    <div className="mb-10">
                        <div className="flex items-center space-x-3 mb-8 p-3 rounded-xl dark:bg-white/5 bg-white border dark:border-white/5 border-neutral-200 shadow-sm">
                            <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-8 h-8" />
                            <div>
                                <h3 className="text-[12px] font-bold dark:text-white leading-tight line-clamp-1">Foundations: Data...</h3>
                                <p className="text-[10px] text-gray-500 font-medium">Google</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <button onClick={() => handleNavigate('course_material')} className="flex items-center justify-between w-full text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider hover:text-black dark:hover:text-white transition-colors">
                                    <div className="flex items-center">Course Material</div>
                                </button>
                                <div className="space-y-1 relative">
                                    {['Module 1', 'Module 2', 'Module 3', 'Module 4'].map((mod, i) => {
                                        const modNum = i + 1;
                                        const isActive = currentView === 'course_material' && activeModule === modNum;
                                        return (
                                            <button 
                                                key={mod} 
                                                onClick={() => handleModuleSelect(i)}
                                                className={`flex items-center space-x-3 w-full text-[13px] py-2 px-3 rounded-lg transition-all relative ${isActive ? 'dark:bg-white/10 bg-neutral-200 dark:text-white text-black font-semibold' : 'text-gray-500 hover:text-neutral-800 dark:hover:text-gray-300'}`}
                                            >
                                                <div className={`w-2.5 h-2.5 rounded-full border-2 z-10 ${isActive ? 'border-orange-500 bg-orange-500' : 'border-neutral-400 dark:border-gray-600 bg-neutral-50 dark:bg-black'}`} />
                                                <span>{mod}</span>
                                                {modNum > 4 && <LockClosedIcon className="w-3 h-3 ml-auto opacity-50" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div className="pt-6 space-y-1 border-t dark:border-white/10 border-neutral-200">
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Tools</p>
                                <button 
                                    onClick={() => handleNavigate('grades')}
                                    className={`block text-[13px] font-medium w-full text-left transition-colors py-2 px-3 rounded-lg ${currentView === 'grades' ? 'bg-neutral-200 dark:bg-white/10 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                                >
                                    Grades
                                </button>
                                <button 
                                    onClick={() => handleNavigate('notes')}
                                    className={`block text-[13px] font-medium w-full text-left transition-colors py-2 px-3 rounded-lg ${currentView === 'notes' ? 'bg-neutral-200 dark:bg-white/10 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                                >
                                    Notes
                                </button>
                                <button 
                                    onClick={() => handleNavigate('messages')}
                                    className={`block text-[13px] font-medium w-full text-left transition-colors py-2 px-3 rounded-lg ${currentView === 'messages' ? 'bg-neutral-200 dark:bg-white/10 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                                >
                                    Messages
                                </button>
                                <button className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white w-full text-left transition-colors py-2 px-3 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg">
                                    Resources
                                </button>
                                <button className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white w-full text-left transition-colors py-2 px-3 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg">
                                    Course Info
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 dark:bg-black bg-white">
                    {currentView === 'grades' && renderGrades()}
                    {currentView === 'notes' && renderNotes()}
                    {currentView === 'messages' && renderMessages()}
                    {currentView === 'course_material' && renderCourseMaterial()}
                </main>
            </div>
        </div>
    );
};

export default CourseOutlineView;
