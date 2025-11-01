import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../App';
import { SunIcon, MoonIcon, BrainIcon, UploadIcon, FlashcardIcon, TrophyIcon, EdgramIcon, DebatePodiumIcon } from './icons';

interface LandingPageProps {
  onStartLearning: () => void;
  toggleTheme: () => void;
  theme: Theme;
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactElement, title: string, description: string }) => (
    <motion.div 
        className="bg-[#1a1a1a]/50 backdrop-blur-sm border border-gray-800/60 rounded-xl p-6 text-center"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.2 }}
    >
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-700/50 rounded-lg">
            {React.cloneElement(icon, { className: "w-6 h-6 text-green-400" })}
        </div>
        <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Lora', serif" }}>{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning, toggleTheme, theme }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <div className="w-full min-h-screen stephen-bg text-gray-300">
            <header className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>Stephen</div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={onStartLearning} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                            Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <motion.section 
                    className="relative text-center py-40 md:py-56 px-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0d] opacity-50"></div>
                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6" 
                        style={{ fontFamily: "'Lora', serif" }}
                    >
                        Your Gateway to <span className="text-green-400">World-Class Learning</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-gray-400 mb-8">
                        Stephen transforms any content into personalized courses, interactive chats, and quizzes, powered by cutting-edge AI.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <button
                            onClick={onStartLearning}
                            className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-transform hover:scale-105"
                        >
                            Start Learning
                        </button>
                    </motion.div>
                </motion.section>

                {/* Features Section */}
                <section id="features" className="py-24 px-4 bg-[#131313]/50">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>Unlock Your Learning Potential</h2>
                            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                                From lectures to articles, Stephen provides a suite of powerful tools to help you master any subject.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<UploadIcon />}
                                title="Flexible Content"
                                description="Upload files, paste links from YouTube or articles, or record lectures directly. Your content, your course."
                            />
                             <FeatureCard 
                                icon={<BrainIcon />}
                                title="AI-Powered Tutor"
                                description="Engage in dynamic conversations with an AI that understands your material and helps you learn faster."
                            />
                             <FeatureCard 
                                icon={<FlashcardIcon />}
                                title="Smart Study Tools"
                                description="Automatically generate flashcards, quizzes, podcasts, and summaries tailored to your learning style."
                            />
                             <FeatureCard 
                                icon={<TrophyIcon />}
                                title="Competitions"
                                description="Test your skills and knowledge against peers in exciting academic and practical competitions."
                            />
                             <FeatureCard 
                                icon={<EdgramIcon />}
                                title="Edgram Social Learning"
                                description="Share your learning journey, discover what others are studying, and connect with a community of learners."
                            />
                             <FeatureCard 
                                icon={<DebatePodiumIcon />}
                                title="Debate Arena"
                                description="Sharpen your critical thinking by debating complex topics with a sophisticated AI opponent."
                            />
                        </div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-24 text-center px-4">
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Lora', serif" }}>Ready to Transform How You Learn?</h2>
                     <button
                        onClick={onStartLearning}
                        className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-transform hover:scale-105"
                    >
                        Get Started for Free
                    </button>
                </section>
            </main>

            <footer className="border-t border-gray-800/50 py-8">
                <div className="container mx-auto text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Stephen AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
