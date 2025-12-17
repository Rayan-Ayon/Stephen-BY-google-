import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, DotsHorizontalIcon } from '../icons';

interface RoadmapViewProps {
    onBack: () => void;
}

const dayData = [
    {
        day: 1,
        goal: "Understand what ML really is, how it evolved, and the different types of ML algorithms.",
        concepts: [
            "What is Machine Learning",
            "Algorithm + Data",
            "Supervised vs Unsupervised",
            "Types of ML algorithms"
        ],
        resources: [
            { topics: ["concept", "algorithm"], title: "What is Machine Learning", channel: "3Blue1Brown" },
            { topics: ["basic", "history"], title: "How ML Works", channel: "IBM Technology" }
        ]
    },
    {
        day: 2,
        goal: "Dive into the basics of Python for Machine Learning and set up your development environment.",
        concepts: ["Python Data Types", "NumPy for numerical data", "Pandas for data manipulation", "Jupyter Notebooks"],
        resources: [
            { topics: ["python", "setup"], title: "Python for Data Science - Course for Beginners", channel: "freeCodeCamp.org" },
            { topics: ["numpy", "pandas"], title: "Complete Pandas Tutorial", channel: "Krish Naik" }
        ]
    },
    {
        day: 3,
        goal: "Learn about the foundational supervised learning algorithm: Linear Regression.",
        concepts: ["Cost Function", "Gradient Descent", "Model Evaluation", "R-squared"],
        resources: [
            { topics: ["regression", "math"], title: "Linear Regression, Clearly Explained", channel: "StatQuest with Josh Starmer" },
            { topics: ["code", "sklearn"], title: "Linear Regression with Python Scikit-Learn", channel: "Python Programmer" }
        ]
    },
     {
        day: 4,
        goal: "Explore classification problems with the Logistic Regression algorithm.",
        concepts: ["Sigmoid Function", "Decision Boundary", "Classification Metrics (Accuracy, Precision, Recall)", "Confusion Matrix"],
        resources: [
            { topics: ["logistic", "theory"], title: "Logistic Regression", channel: "Andrew Ng" },
            { topics: ["classification", "code"], title: "Logistic Regression in Python from Scratch", channel: "AssemblyAI" }
        ]
    },
     {
        day: 5,
        goal: "Understand how to prepare and clean data for machine learning models.",
        concepts: ["Handling Missing Values", "Feature Scaling (Normalization, Standardization)", "Categorical Data Encoding", "Train-Test Split"],
        resources: [
            { topics: ["preprocessing", "data"], title: "Feature Engineering for Machine Learning", channel: "Art of Engineering" },
            { topics: ["practical", "cleaning"], title: "Data Cleaning Tutorial", channel: "Alex The Analyst" }
        ]
    },
     {
        day: 6,
        goal: "Get introduced to another powerful supervised learning algorithm: Support Vector Machines (SVM).",
        concepts: ["Maximal Margin Classifier", "Support Vectors", "The Kernel Trick", "Hard vs Soft Margin"],
        resources: [
            { topics: ["svm", "intuition"], title: "Support Vector Machines, Part 1: The Linear Case", channel: "StatQuest with Josh Starmer" },
            { topics: ["kernel", "math"], title: "The Kernel Trick", channel: "ritvikmath" }
        ]
    },
     {
        day: 7,
        goal: "Review the week's concepts and build a simple end-to-end machine learning project.",
        concepts: ["Project Scoping", "Data Collection", "Model Training and Prediction", "Result Interpretation"],
        resources: [
            { topics: ["project", "end-to-end"], title: "Build Your First Machine Learning Project", channel: "Data Professor" },
            { topics: ["review", "concepts"], title: "Machine Learning Roadmap 2024", channel: "Codebasics" }
        ]
    }
];

// FIX: Corrected a TypeScript error by explicitly typing the `RoadmapDay` component with `React.FC`.
// This ensures the special `key` prop is handled correctly by React's typings and not considered
// part of the component's own props, resolving the type assignment error when used in a `.map()` loop.
interface RoadmapDayProps {
    data: typeof dayData[0];
}

const RoadmapDay: React.FC<RoadmapDayProps> = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (data.day - 1) * 0.1 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold dark:text-white text-black" style={{ fontFamily: "'Lora', serif" }}>Day {data.day}</h2>

            <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6">
                <h3 className="font-semibold dark:text-gray-200 text-neutral-800 mb-2">Goal</h3>
                <p className="text-sm dark:text-gray-400 text-neutral-600">{data.goal}</p>
            </div>
            
             <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6">
                <h3 className="font-semibold dark:text-gray-200 text-neutral-800 mb-3">Key Concepts</h3>
                <ul className="space-y-2">
                    {data.concepts.map(concept => (
                        <li key={concept} className="flex items-start">
                            <span className="text-orange-500 mr-3 mt-1">&#9679;</span>
                            <span className="text-sm dark:text-gray-300 text-neutral-700">{concept}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6">
                <h3 className="font-semibold dark:text-gray-200 text-neutral-800 mb-4">Resources</h3>
                <div className="space-y-4">
                    {data.resources.map(res => (
                        <div key={res.title} className="flex items-center dark:bg-[#0d0d0d] bg-neutral-100 rounded-lg p-3">
                            <div className="w-1/4">
                                {res.topics.map(topic => (
                                    <div key={topic} className="flex items-center text-xs dark:text-gray-400 text-neutral-500">
                                        <span className="text-orange-500 mr-2">&#9679;</span>
                                        {topic}
                                    </div>
                                ))}
                            </div>
                            <div className="w-24 h-16 dark:bg-gray-700 bg-neutral-300 rounded mx-4 shrink-0"></div>
                            <div className="flex-grow">
                                <p className="font-semibold dark:text-white text-black text-sm">{res.title}</p>
                                <p className="text-xs dark:text-gray-500 text-neutral-500">{res.channel}</p>
                            </div>
                            <button className="text-gray-500 hover:text-white p-2">
                                <DotsHorizontalIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};


const RoadmapView: React.FC<RoadmapViewProps> = ({ onBack }) => {
    return (
        <div className="h-full w-full max-w-4xl mx-auto flex flex-col">
             <div className="sticky top-0 dark:bg-[#0d0d0d]/80 bg-white/80 backdrop-blur-sm z-10 pt-4 pb-4">
                 <div className="flex items-center justify-between mb-4">
                     <button onClick={onBack} className="flex items-center text-sm dark:text-gray-300 text-neutral-600 hover:text-white">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        Back
                     </button>
                 </div>
                 <p className="text-sm font-medium dark:text-gray-400 text-neutral-500 mb-2">Progress: 0%</p>
                 <div className="w-full h-1.5 dark:bg-gray-800 bg-neutral-200 rounded-full">
                    <div className="h-full w-[0%] bg-orange-500 rounded-full"></div>
                 </div>
             </div>
             <div className="flex-1 overflow-y-auto space-y-12 pb-8">
                {dayData.map(day => (
                    <RoadmapDay key={day.day} data={day} />
                ))}
             </div>
        </div>
    );
};

export default RoadmapView;