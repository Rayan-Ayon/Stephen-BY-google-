

import React from 'react';
// FIX: Import Variants type from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';
import { Theme } from '../App';
import { SunIcon, MoonIcon, BrainIcon, UploadIcon, FlashcardIcon, TrophyIcon, EdgramIcon, DebatePodiumIcon } from './icons';

interface LandingPageProps {
  onStartLearning: () => void;
  toggleTheme: () => void;
  theme: Theme;
}

// FIX: Changed icon prop type from React.ReactElement to React.ReactElement<any> to allow passing a className prop via React.cloneElement.
const FeatureCard = ({ icon, title, description, theme }: { icon: React.ReactElement<any>, title: string, description: string, theme: Theme }) => (
    <motion.div 
        className={`rounded-xl p-6 text-center border ${theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800/60' : 'bg-neutral-100/50 border-neutral-200/80'}`}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.2 }}
    >
        <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-200'}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}` })}
        </div>
        <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>{title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{description}</p>
    </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning, toggleTheme, theme }) => {
    const navLinks = ['Collab', 'Features', 'Pricing', 'Community'];
    
    // FIX: Explicitly type variants with Variants to prevent TypeScript errors.
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // FIX: Explicitly type variants with Variants to prevent TypeScript errors.
    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <div className={`w-full min-h-screen ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
            <header className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>Stephen</div>
                        <nav className="hidden md:flex items-center space-x-6">
                            {navLinks.map(link => (
                                <a key={link} href="#" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'} transition-colors`}>{link}</a>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className={`p-2 rounded-full ${theme === 'dark' ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-500 hover:bg-neutral-200'} transition-colors`}>
                            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={onStartLearning} className={`px-4 py-2 text-sm font-semibold rounded-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                            Sign Up
                        </button>
                         <button onClick={onStartLearning} className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[#FF5A1A] hover:opacity-90 transition-opacity">
                            Login
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <motion.section 
                    className="relative text-center py-48 md:py-64 px-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-medium mb-6" 
                        // FIX: Corrected a typo in the fontFamily value. It had an extra single quote.
                        style={{ fontFamily: "'Lora', serif", color: theme === 'dark' ? '#f5f5f5' : '#171717' }}
                    >
                        Your gateway to<br/>world-class<br/>learning.
                    </motion.h1>
                    <motion.p variants={itemVariants} className={`max-w-xl mx-auto text-lg mb-10 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Personalized, scientific, real-world learning — at your pace.
                    </motion.p>
                    <motion.div variants={itemVariants} className="flex justify-center items-center space-x-4">
                         <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className={`font-semibold px-6 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'border-neutral-700 text-white hover:bg-neutral-800' : 'border-neutral-300 text-black hover:bg-neutral-100'}`}
                        >
                            See Features
                        </button>
                        <button
                            onClick={onStartLearning}
                            className="bg-[#FF5A1A] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Start Learning
                        </button>
                    </motion.div>
                </motion.section>

                {/* Features Section */}
                <section id="features" className={`py-24 px-4 ${theme === 'dark' ? 'bg-black/50' : 'bg-white'}`}>
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>Unlock Your Learning Potential</h2>
                            <p className={`${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'} mt-4 max-w-xl mx-auto`}>
                                From lectures to articles, Stephen provides a suite of powerful tools to help you master any subject.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard 
                                theme={theme}
                                icon={<UploadIcon />}
                                title="Flexible Content"
                                description="Upload files, paste links from YouTube or articles, or record lectures directly. Your content, your course."
                            />
                             <FeatureCard 
                                theme={theme}
                                icon={<BrainIcon />}
                                title="AI-Powered Tutor"
                                description="Engage in dynamic conversations with an AI that understands your material and helps you learn faster."
                            />
                             <FeatureCard 
                                theme={theme}
                                icon={<FlashcardIcon />}
                                title="Smart Study Tools"
                                description="Automatically generate flashcards, quizzes, podcasts, and summaries tailored to your learning style."
                            />
                             <FeatureCard 
                                theme={theme}
                                icon={<TrophyIcon />}
                                title="Competitions"
                                description="Test your skills and knowledge against peers in exciting academic and practical competitions."
                            />
                             <FeatureCard 
                                theme={theme}
                                icon={<EdgramIcon />}
                                title="Edgram Social Learning"
                                description="Share your learning journey, discover what others are studying, and connect with a community of learners."
                            />
                             <FeatureCard 
                                theme={theme}
                                icon={<DebatePodiumIcon />}
                                title="Debate Arena"
                                description="Sharpen your critical thinking by debating complex topics with a sophisticated AI opponent."
                            />
                        </div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-24 text-center px-4">
                     <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-6`} style={{ fontFamily: "'Lora', serif" }}>Ready to Transform How You Learn?</h2>
                     <button
                        onClick={onStartLearning}
                        className="bg-[#FF5A1A] text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Get Started for Free
                    </button>
                </section>
            </main>

            <footer className={`border-t ${theme === 'dark' ? 'border-neutral-800/50' : 'border-neutral-200/80'} py-8`}>
                <div className={`container mx-auto text-center text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    &copy; {new Date().getFullYear()} Stephen AI. All rights reserved.
                </div>
            </footer>
        {/* FIX: Corrected a closing div tag typo. */}
        </div>
    );
};

export default LandingPage;
