import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ReasoningViewProps {
    topic: string;
    onFinish: () => void;
}

const reasoningSteps = [
    "Thinking...",
    "Finding best way to learn Machine Learning",
    "Searching for perfect fit learning methods",
    "Applying spaced repetition, active recall, interleaving",
    "Structuring 7-day scientific roadmap",
    "Adjusting depth for basic understanding",
    "Gathering free YouTube resources",
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

const ShimmerBar = () => (
    <div className="absolute top-0 left-0 w-full h-full bg-transparent overflow-hidden rounded-md">
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    </div>
);

const ReasoningView: React.FC<ReasoningViewProps> = ({ topic, onFinish }) => {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 4000); // Wait for animation to complete
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-center">
            <h1 className="text-2xl font-semibold dark:text-white text-black mb-12 capitalize">{topic}</h1>
            
            <motion.div
                className="space-y-4 w-full max-w-md relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {reasoningSteps.map((step, index) => (
                    <motion.div key={step} variants={itemVariants} className="flex items-center space-x-4">
                         <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                            {index < reasoningSteps.length - 1 && <div className="w-px h-6 bg-gray-700"></div>}
                        </div>
                        <div className="relative text-left dark:text-gray-300 text-neutral-700">
                             <span className="opacity-0">{step}</span> {/* For layout spacing */}
                            <span className="absolute inset-0">{step}</span>
                            <ShimmerBar />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            <div className="w-full max-w-md mt-8 h-2 rounded-full overflow-hidden dark:bg-gray-800 bg-neutral-200">
                 <div className="h-full bg-orange-500 animate-progress"></div>
            </div>
             <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(200%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 4s linear;
                }
            `}</style>
        </div>
    );
};

export default ReasoningView;