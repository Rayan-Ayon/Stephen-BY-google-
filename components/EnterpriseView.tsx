
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, SearchIcon, ChevronRightIcon, TrendingUpIcon, UsersIcon, ShieldCheckIcon, TrophyIcon, BookOpenIcon, VideoCameraIcon, FileTextIcon, GlobeIcon, SettingsIcon, LockClosedIcon, AdjustIcon } from './icons';
import { Theme } from '../App';

interface EnterpriseViewProps {
    theme: Theme;
    onStartLearning: () => void;
    type: 'business' | 'team' | 'universities' | 'government';
}

const EnterpriseView: React.FC<EnterpriseViewProps> = ({ theme, onStartLearning, type }) => {
    
    // --- Render Functions for different types ---

    const renderBusinessContent = () => (
        <>
            {/* Hero Section - Business */}
            <section className="relative overflow-hidden py-20 lg:py-32 px-6">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className={`text-4xl lg:text-6xl font-medium mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            The expert-powered learning platform that drives business growth
                        </h1>
                        <p className="text-lg mb-8 opacity-80 leading-relaxed max-w-lg">
                            Our platform delivers expert-led courses, tailored learning paths, and AI tools to help organizations drive workforce growth globally.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                            {[
                                "Build in-demand skills with world-class content",
                                "Comprehensive learning platform with tailored paths",
                                "Customize training programs with AI-powered tools"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                    <CheckCircleIcon className="w-6 h-6 text-blue-500 shrink-0" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button className="bg-[#0056D2] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#00419e] transition-colors shadow-lg shadow-blue-900/20">
                            Book a Demo
                        </button>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" 
                            alt="Business Professional" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                                <p className="text-white font-serif italic text-lg">"Stephen Enterprise helped us scale our AI capabilities 3x faster than projected."</p>
                                <p className="text-white/70 text-sm mt-2 font-bold">— CTO, TechGlobal</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-black text-white py-16 px-6 border-y border-white/10">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                    <div className="px-4 py-4">
                        <div className="text-5xl font-bold mb-2">25%</div>
                        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Increased Productivity</p>
                    </div>
                    <div className="px-4 py-4">
                        <div className="text-5xl font-bold mb-2">38%</div>
                        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Higher Retention</p>
                    </div>
                    <div className="px-4 py-4">
                        <div className="text-5xl font-bold mb-2">97%</div>
                        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Employee Engagement</p>
                    </div>
                </div>
            </section>

            {/* Skill Tracks */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    <div className="mb-16">
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Choose the right Skills Track
                        </h2>
                        <p className="opacity-70 max-w-2xl text-lg">
                            Focused, measurable journeys powered by our leading online learning platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                title: 'Data Skills Track', 
                                desc: 'Strengthen data-driven decision-making with paths in analytics, management, and automation.',
                                color: 'bg-blue-600',
                                icon: <TrendingUpIcon className="w-8 h-8 text-white" />
                            },
                            { 
                                title: 'IT Skills Track', 
                                desc: 'Protect your organization with cybersecurity, IT operations, and network administration paths.',
                                color: 'bg-yellow-500',
                                icon: <ShieldCheckIcon className="w-8 h-8 text-white" />
                            },
                            { 
                                title: 'GenAI Skills Track', 
                                desc: 'Empower every team with generative AI paths to drive innovation and automate tasks.',
                                color: 'bg-pink-600',
                                icon: <UsersIcon className="w-8 h-8 text-white" />
                            }
                        ].map((track, i) => (
                            <div key={i} className={`rounded-2xl p-8 border ${theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'} hover:shadow-2xl transition-all group relative overflow-hidden`}>
                                <div className={`w-16 h-16 rounded-2xl ${track.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {track.icon}
                                </div>
                                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{track.title}</h3>
                                <p className="opacity-70 mb-8 leading-relaxed h-24">{track.desc}</p>
                                <button className={`flex items-center font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-black'} group-hover:underline`}>
                                    Explore Track <ChevronRightIcon className="w-4 h-4 ml-2" />
                                </button>
                                <div className={`absolute top-0 right-0 w-32 h-32 ${track.color} opacity-5 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );

    const renderTeamContent = () => (
        <>
            {/* Hero Section - Teams */}
            <section className={`relative overflow-hidden py-20 lg:py-32 px-6 ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'}`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className={`text-4xl lg:text-6xl font-medium mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Train your team.<br/>Grow your business.
                        </h1>
                        <p className="text-lg mb-8 opacity-80 leading-relaxed max-w-lg">
                            Give your team the structure, content, and flexibility to build lasting skills at scale with Stephen for Teams.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                            {[
                                "Access our full library of enterprise content",
                                "Earn globally recognized Professional Certificates",
                                "Go from purchase to learning in one day",
                                "Upskill 5 to 125 employees"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                    <CheckCircleIcon className="w-6 h-6 text-blue-600 shrink-0" />
                                    <span className="font-medium opacity-90">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <button className="bg-[#0056D2] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#00419e] transition-colors shadow-lg shadow-blue-900/20">
                                Buy Now
                            </button>
                            <span className="text-sm opacity-60">$319 per user for 12 months — 14-day refund guarantee</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                            alt="Team Collaboration" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Blue Stats Bar */}
            <section className="bg-[#00255d] text-white py-12 px-6">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                    <div className="px-4 py-4">
                        <div className="text-4xl font-bold mb-2">25%</div>
                        <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Increased employee productivity</p>
                    </div>
                    <div className="px-4 py-4">
                        <div className="text-4xl font-bold mb-2">38%</div>
                        <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Higher employee retention</p>
                    </div>
                    <div className="px-4 py-4">
                        <div className="text-4xl font-bold mb-2">97%</div>
                        <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Employee engagement in non-mandatory training</p>
                    </div>
                </div>
            </section>

            {/* Partner Logos */}
            <section className={`py-16 px-6 ${theme === 'dark' ? 'bg-[#111]' : 'bg-white'}`}>
                <div className="container mx-auto text-center">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-10">Our content is powered by over 325+ leading university and industry partners</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Stanford', 'Duke', 'Google', 'IBM', 'Imperial College', 'Penn'].map(logo => (
                            <div key={logo} className="flex items-center justify-center font-bold text-xl font-serif">
                                {logo}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Props Section */}
            <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'}`}>
                <div className="container mx-auto">
                    <div className="mb-16 max-w-2xl">
                        <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Equip your team to drive business outcomes — at scale and with in-demand skills.
                        </h2>
                        <p className="opacity-70 text-lg">
                            Deliver practical, job-relevant learning experiences with professional content and courses from university and industry experts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                        {[
                            { 
                                icon: <TrophyIcon className="w-8 h-8" />, 
                                title: "Build in-demand skills fast", 
                                desc: "Upskill teams in business, tech, and data with high-impact content from leading institutions." 
                            },
                            { 
                                icon: <ChevronRightIcon className="w-8 h-8" />, 
                                title: "Drive measurable results", 
                                desc: "Improve productivity, reduce attrition, and upskill seamlessly with an intuitive and self-service platform." 
                            },
                            { 
                                icon: <CheckCircleIcon className="w-8 h-8" />, 
                                title: "Customize learning for your team", 
                                desc: "Use AI-powered tools to create tailored, multilingual, role-specific learning paths." 
                            },
                            { 
                                icon: <TrendingUpIcon className="w-8 h-8" />, 
                                title: "Keep teams motivated for you", 
                                desc: "Boost completion rates with certificates and badges that are recognized in the industry." 
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-white/10' : 'bg-blue-100 text-blue-600'}`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.title}</h3>
                                    <p className="opacity-70 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Retention Feature Highlight */}
            <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-[#111]' : 'bg-white'}`}>
                <div className="container mx-auto">
                    <div className={`rounded-3xl p-8 md:p-16 border ${theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-gray-50 border-gray-200'} flex flex-col md:flex-row items-center gap-12`}>
                        <div className="flex-1 space-y-6">
                            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                                Keep your best people longer and help them grow
                            </h2>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Employee Engagement</p>
                            <ul className="space-y-4">
                                {[
                                    "165+ Professional Certificates from top institutions",
                                    "Personalized AI guidance to accelerate skill growth",
                                    "Increase positive business impact through continuous learning"
                                ].map((pt, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                                        <span>{pt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" className="w-full h-full object-cover" alt="Happy Team" />
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Insights Stats Section */}
            <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'}`}>
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Build skills that matter and track your progress with it
                        </h2>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-60">Skill Development</p>
                        <ul className="space-y-4 opacity-80">
                            <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 mr-3 mt-0.5" /> 72% of US CEOs prioritise generative AI as a top investment</li>
                            <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 mr-3 mt-0.5" /> 60% of employees need retraining by 2026 to stay competitive</li>
                            <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 mr-3 mt-0.5" /> 70%+ of employees using GenAI expect it to boost skills, creativity, and work quality</li>
                        </ul>
                        <button className="text-blue-600 font-bold hover:underline pt-2">Buy now</button>
                    </div>
                    <div className="flex-1 bg-white p-2 rounded-xl shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                         {/* Abstract Chart Representation */}
                         <div className="bg-gray-50 p-6 rounded-lg">
                             <div className="flex justify-between mb-8">
                                 <div className="w-1/3 space-y-2">
                                     <div className="h-4 bg-gray-200 rounded w-full"></div>
                                     <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                 </div>
                                 <div className="w-10 h-10 rounded-full bg-blue-100"></div>
                             </div>
                             <div className="grid grid-cols-3 gap-4 h-32 items-end">
                                 <div className="bg-blue-500 h-1/2 rounded-t"></div>
                                 <div className="bg-blue-400 h-3/4 rounded-t"></div>
                                 <div className="bg-blue-600 h-full rounded-t"></div>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-[#00255d] text-white py-24 px-6 text-center">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Lora', serif" }}>
                        Ready to take the next step for your team?
                    </h2>
                    <p className="text-lg opacity-80 mb-10">
                        Stephen for Teams gives you the structure, content, and flexibility to build lasting skills at scale.
                    </p>
                    <button className="bg-white text-[#00255d] font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                        Get Started
                    </button>
                    <p className="mt-4 text-sm opacity-60">$319 per user for 12 months — 14-day refund guarantee</p>
                </div>
            </section>
        </>
    );

    const renderUniversitiesContent = () => (
        <>
            {/* Hero Section */}
            <section className={`relative overflow-hidden ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'} py-12 lg:py-24 px-6`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:pr-12"
                    >
                        <h1 className={`text-4xl lg:text-6xl font-bold mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Empower employability with online learning for universities
                        </h1>
                        <p className="text-lg mb-8 opacity-80 leading-relaxed">
                            Equip students with the most in-demand skills and prepare them for job success.
                        </p>
                        <button className="bg-[#0056D2] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#00419e] transition-colors shadow-lg shadow-blue-900/20">
                            Contact us
                        </button>
                        <div className="mt-4">
                            <a href="#" className="text-[#0056D2] font-semibold text-sm hover:underline">See your options, compare plans</a>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                            alt="University Students" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar (Black Background) */}
            <section className="bg-[#111] text-white py-16 px-6">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
                    <div className="px-4 py-2">
                        <div className="text-5xl font-bold mb-3">76%</div>
                        <p className="text-sm text-gray-400">Students are 76% more likely to enroll in a degree program that offers industry micro-credentials</p>
                    </div>
                    <div className="px-4 py-2">
                        <div className="text-5xl font-bold mb-3">88%</div>
                        <p className="text-sm text-gray-400">of employers believe that Professional Certificates strengthen a candidate’s job application</p>
                    </div>
                    <div className="px-4 py-2">
                        <div className="text-5xl font-bold mb-3">90%</div>
                        <p className="text-sm text-gray-400">of students agree that a Professional Certificate will help them secure a job</p>
                    </div>
                </div>
            </section>

            {/* Catalog Logos */}
            <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#000]' : 'bg-white'}`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Offer students 10,600+ courses from 350+ leading universities and industry partners
                        </h2>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Michigan', 'Google', 'UCSD', 'Microsoft', 'IBM', 'Intel', 'Meta', 'AWS'].map(logo => (
                            <div key={logo} className="h-12 flex items-center justify-center font-bold text-lg border border-gray-200 dark:border-gray-800 rounded p-2 text-center">
                                {logo}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Academy Feature */}
            <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'}`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg order-2 lg:order-1">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Career Academy" />
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Prepare your students for in-demand jobs
                        </h2>
                        <p className="mb-6 opacity-80">Strengthen student employability with skills training from the world’s leading companies.</p>
                        <p className="font-semibold mb-4">With Career Academy, enable your students to:</p>
                        <ul className="space-y-3 mb-8">
                            {[
                                "Earn a Professional Certificate designed to get them job-ready",
                                "Gain common job skills employers demand",
                                "Showcase skill mastery with a portfolio of work",
                                "Explore a range of in-demand roles across industries"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start text-sm">
                                    <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <a href="#" className="text-blue-600 font-bold hover:underline flex items-center">
                            Learn more about Career Academy <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Certificates Video Section */}
            <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#000]' : 'bg-white'}`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">PROFESSIONAL CERTIFICATES</p>
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Learn why students and employers value Professional Certificates
                        </h2>
                        <p className="opacity-80 mb-6 leading-relaxed">
                            A survey of 5,000 students and employers in 11 countries finds that the majority value Professional Certificates for driving employment outcomes. Professional Certificates help students demonstrate to employers that they are qualified and job-ready.
                        </p>
                        <p className="opacity-80 mb-8 leading-relaxed">
                            Use these insights to enhance your curriculum, and strengthen employment outcomes.
                        </p>
                        <a href="#" className="text-blue-600 font-bold hover:underline flex items-center">
                            Get report <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </a>
                    </div>
                    <div className="relative h-[350px] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Video Thumbnail" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white group-hover:bg-white/50 transition-colors">
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blue Curriculum Section */}
            <section className="bg-[#0056D2] text-white py-20 px-6">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Lora', serif" }}>
                            Expand your curriculum with a university learning platform that empowers faculty
                        </h2>
                        <p className="opacity-90 mb-6 text-lg">
                            Deliver practical, job-relevant learning experiences with professional content and courses from university and industry experts.
                        </p>
                        <p className="opacity-90 text-lg">
                            Strengthen your university’s programs with a higher education learning platform that bridges academics and employability.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div>
                            <div className="w-12 h-12 mb-4 border-2 border-white rounded flex items-center justify-center">
                                <BookOpenIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">World-Class Content</h3>
                            <p className="text-sm opacity-80">Connect students to a wide range of content from hundreds of industry leaders and universities.</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 mb-4 border-2 border-white rounded flex items-center justify-center">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Guided Projects</h3>
                            <p className="text-sm opacity-80">Give students hands-on projects and job-relevant experiences through a higher education learning platform that prepares them for career success.</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 mb-4 border-2 border-white rounded flex items-center justify-center">
                                <TrophyIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Professional Certificates</h3>
                            <p className="text-sm opacity-80">Help your students grow job confidence, apply learning, and hone critical skills in high-growth fields.</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 mb-4 border-2 border-white rounded flex items-center justify-center">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">LMS Integration</h3>
                            <p className="text-sm opacity-80">Simplify teaching and learning by connecting Coursera to your learning management system for higher education for a seamless digital experience.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners & Testimonial */}
            <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'}`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <div className="grid grid-cols-2 gap-8 mb-12 opacity-70 grayscale">
                            <div className="font-bold text-xl flex items-center"><span className="text-3xl mr-2">M</span> Michigan</div>
                            <div className="font-bold text-xl">Imperial College</div>
                            <div className="font-bold text-xl">Melbourne</div>
                            <div className="font-bold text-xl">Manipal</div>
                        </div>
                        <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Here’s how innovative universities are using Coursera for Campus
                        </h2>
                        <blockquote className="text-lg italic opacity-80 mb-8 border-l-4 border-blue-500 pl-6">
                            "Coursera gives us confidence that we’re providing our students high-quality education that furthers their career opportunities. Without Coursera, we couldn’t become 'University 4.0,' because we couldn’t develop courses so quickly on our own."
                        </blockquote>
                        <div className="flex items-center">
                            <div className="mr-4">
                                {/* Logo placeholder */}
                                <div className="font-bold uppercase text-xs tracking-widest text-gray-500">IITU University</div>
                            </div>
                            <div>
                                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Yevgenia D.</p>
                                <p className="text-xs text-gray-500">Vice-Rector for Science and International Collaboration</p>
                                <p className="text-xs text-gray-500">International Information Technology University (IITU)</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:pl-12">
                        <h2 className={`text-4xl font-bold mb-10 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Join colleges and universities worldwide that choose Coursera for Campus
                        </h2>
                        <div className="p-8 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 italic text-gray-600 dark:text-gray-300">
                            "No one professor or university can offer the breadth of choices students have with Coursera. And since they can find courses relevant to their industry, Coursera is a great bridge between the classroom and the workplace."
                            <div className="mt-6 not-italic flex items-center">
                                <div className="w-10 h-10 bg-purple-900 text-white flex items-center justify-center font-bold text-xs rounded mr-3">IVEY</div>
                                <div>
                                    <p className="font-bold text-black dark:text-white text-sm">Lameck O.</p>
                                    <p className="text-xs text-gray-500">Lecturer and IT project manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reports Cards */}
            <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#000]' : 'bg-white'}`}>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-[#00255d] text-white rounded-xl overflow-hidden flex flex-col">
                        <div className="p-8 pb-12 flex-1">
                            <h3 className="text-2xl font-bold mb-4">The Micro-Credentials Impact Report 2025: Insights from Students and Employers</h3>
                            <p className="opacity-80 text-sm mb-6">Explore global data on career and academic outcomes, credit-bearing and GenAI credentials, and more.</p>
                        </div>
                        <div className="p-8 pt-0 mt-auto">
                            <a href="#" className="font-bold text-sm hover:underline">Get report →</a>
                        </div>
                        <div className="h-2 bg-blue-400 w-1/3"></div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-[#f5f7fa] dark:bg-[#1a1a1a] p-8 rounded-xl flex flex-col border border-gray-200 dark:border-gray-800">
                        <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Global Skills Report 2025</h3>
                        <p className="opacity-70 text-sm mb-8 flex-1">Discover the critical skills people need to thrive in a changing world. Explore insights drawn from 170M+ Coursera learners and key economic indices.</p>
                        <a href="#" className="text-blue-600 font-bold text-sm hover:underline">Learn More →</a>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-[#f5f7fa] dark:bg-[#1a1a1a] p-8 rounded-xl flex flex-col border border-gray-200 dark:border-gray-800">
                        <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>EU AI Act Playbook</h3>
                        <p className="opacity-70 text-sm mb-8 flex-1">Ensure your organisation is compliant with Article 4 of the EU AI Act and gain actionable insights to ensure teams use AI safely and ethically.</p>
                        <a href="#" className="text-blue-600 font-bold text-sm hover:underline">Learn More →</a>
                    </div>
                </div>
            </section>

            {/* Contact Form Reused */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-16">
                    <div className="flex-1">
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Get in touch with our sales team
                        </h2>
                        <p className="mb-6 font-semibold opacity-80">Learn more about how you can:</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3" /> Connect curriculum to careers</li>
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3" /> Strengthen employment outcomes</li>
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3" /> Enhance learning experiences</li>
                        </ul>
                    </div>
                    <div className="flex-1">
                        <div className={`p-8 border rounded-xl shadow-lg ${theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">First Name</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Last Name</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Work Email Address</label>
                                    <input type="email" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Phone Number</label>
                                    <input type="tel" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Institution Type</label>
                                    <select className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none"><option>University</option></select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Institution Name</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Job Role</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Department</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1 mb-4">
                                <label className="text-xs font-bold opacity-70">Which best describes your needs?</label>
                                <select className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none"><option>Curriculum expansion</option></select>
                            </div>
                            <div className="space-y-1 mb-6">
                                <label className="text-xs font-bold opacity-70">Country</label>
                                <select className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none"><option>United States</option></select>
                            </div>
                            
                            <p className="text-[10px] opacity-60 mb-6 leading-tight">By submitting your info in the form above, you agree to our Terms of Use and Privacy Notice. We may use this info to contact you and/or use data from third parties to personalize your experience.</p>

                            <button className="w-full py-3 bg-[#0056D2] text-white font-bold rounded-lg hover:bg-[#00419e] transition-colors">
                                Request info
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    const renderGovernmentContent = () => (
        <>
            {/* Hero Section */}
            <section className={`relative overflow-hidden ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'} py-12 lg:py-24 px-6`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:pr-12"
                    >
                        <h1 className={`text-4xl lg:text-5xl font-bold mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Accelerate public sector growth with a learning platform for government
                        </h1>
                        <p className="text-lg mb-8 opacity-80 leading-relaxed">
                            Drive sustainable economic growth and build a competitive workforce with a government e-learning platform featuring courses from leading universities and companies. Coursera partners with over 900 governmental organizations in 100+ countries to deliver training for government employees and empower citizens with job-ready skills.
                        </p>
                        <button className="bg-[#0056D2] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#00419e] transition-colors shadow-lg shadow-blue-900/20">
                            Learn More
                        </button>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2532&auto=format&fit=crop" 
                            alt="Government Meeting" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar (Black Background) */}
            <section className="bg-[#111] text-white py-16 px-6">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
                    <div className="px-4 py-2">
                        <div className="text-5xl font-bold mb-3">5X</div>
                        <p className="text-sm text-gray-400">Hiring for skills is five times more predictive of job performance than hiring for education</p>
                    </div>
                    <div className="px-4 py-2">
                        <div className="text-5xl font-bold mb-3">32%</div>
                        <p className="text-sm text-gray-400">of the world's population is not online showing a large digital divide</p>
                    </div>
                    <div className="px-4 py-2">
                        <div className="text-5xl font-bold mb-3">39%</div>
                        <p className="text-sm text-gray-400">of workers' existing skills will change or be outdated by 2030</p>
                    </div>
                </div>
            </section>

            {/* High Quality Content */}
            <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#000]' : 'bg-white'}`}>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">HIGH-QUALITY CONTENT</p>
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Empower government teams with access to world-class content from the world’s most trusted companies and universities.
                        </h2>
                        <p className="opacity-80 mb-6 leading-relaxed">
                            Stay ahead of emerging technology by upskilling and reskilling civil servants and citizens with in-demand skills. Quickly launch industry-recognized courses and credentials from over 350+ leading companies and universities.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Offer job-aligned training to close digital skill gaps quickly",
                                "Access diverse content formats, from video clips to microcredentials, tailored to learner preferences",
                                "Offer learning in over 25 languages to support learners in their native tongue",
                                "Explore Skills Tracks for role-specific skills mastery across in-demand job roles"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start text-sm">
                                    <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-8 items-center opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Logos for Gov Section */}
                        {['Microsoft', 'NVIDIA', 'AWS', 'Adobe', 'Google', 'IBM', 'DeepLearning.AI', 'Goodwill'].map(logo => (
                            <div key={logo} className="h-16 flex items-center justify-center font-bold text-lg border border-gray-200 dark:border-gray-800 rounded p-4 text-center">
                                {logo}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blue Features Section */}
            <section className="bg-[#0056D2] text-white py-20 px-6">
                <div className="container mx-auto">
                    <div className="max-w-2xl mb-16">
                        <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Lora', serif" }}>
                            Government training built for impact
                        </h2>
                        <p className="opacity-90 text-lg">
                            Build in-demand skills with engaging, trusted content taught by expert instructors to transform your workforce. Our platform allows program administrators to easily integrate Coursera into existing learning ecosystems and tailor training to improve workforce readiness.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex gap-4">
                            <div className="shrink-0"><GlobeIcon className="w-10 h-10" /></div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">Offer learning in 25+ languages</h3>
                                <p className="opacity-80 text-sm">Provide training in learners’ native-tongue with access to 5,500+ courses in Arabic, Spanish, French, German, Thai, Urdu, and more.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0"><SettingsIcon className="w-10 h-10" /></div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">Integrate into your ecosystem</h3>
                                <p className="opacity-80 text-sm">Easily connect our learning platform for government with 30+ LMS and LXP systems to unify data, streamline management, and monitor workforce development in a single dashboard.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0"><AdjustIcon className="w-10 h-10" /></div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">Customize training</h3>
                                <p className="opacity-80 text-sm">Accelerate content creation and curation with AI-powered tools on our government e-learning platform to tailor learning to your organization's goals and workforce needs.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0"><ShieldCheckIcon className="w-10 h-10" /></div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">Secure practice</h3>
                                <p className="opacity-80 text-sm">Promote real-world application with hands-on practice in secure, private LLM environments, reducing time from learning to on-the-job application.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Tracks */}
            <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#f5f7fa]'}`}>
                <div className="container mx-auto">
                    <div className="mb-12">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">EXPLORE SKILLS TRACKS</p>
                        <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Choose the right Skills Track to fit your public sector needs
                        </h2>
                        <p className="opacity-70 max-w-3xl">Every Coursera Skills Track delivers a focused, measurable learning journey to help you equip job seekers and civil servants with in-demand skills to prepare them for jobs in fast-changing industries like government, healthcare, manufacturing, finance, and professional services.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Track 1 */}
                        <div className={`p-8 rounded-xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} flex flex-col`}>
                            <div className="h-40 mb-6 bg-gradient-to-r from-blue-900 to-teal-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                                 {/* Abstract Graphic */}
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                 <TrendingUpIcon className="w-16 h-16 text-white relative z-10" />
                            </div>
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">UNCOVER INSIGHTS</p>
                            <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Data Skills Track</h3>
                            <p className="text-sm opacity-70 mb-6 flex-grow">Strengthen decision-making with learning paths in business analytics, data management, and workflow automation.</p>
                            <a href="#" className="text-blue-600 font-bold text-sm hover:underline flex items-center">Master essential data skills <ChevronRightIcon className="w-4 h-4 ml-1"/></a>
                        </div>
                        {/* Track 2 */}
                        <div className={`p-8 rounded-xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} flex flex-col`}>
                            <div className="h-40 mb-6 bg-gradient-to-r from-yellow-500 to-green-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                 <ShieldCheckIcon className="w-16 h-16 text-white relative z-10" />
                            </div>
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">MODERNIZE SYSTEMS</p>
                            <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>IT Skills Track</h3>
                            <p className="text-sm opacity-70 mb-6 flex-grow">Bolster security and optimize tech stacks with learning paths in cybersecurity, IT operations, and network administration.</p>
                            <a href="#" className="text-blue-600 font-bold text-sm hover:underline flex items-center">Explore IT learning solutions <ChevronRightIcon className="w-4 h-4 ml-1"/></a>
                        </div>
                        {/* Track 3 */}
                        <div className={`p-8 rounded-xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} flex flex-col`}>
                            <div className="h-40 mb-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                 <UsersIcon className="w-16 h-16 text-white relative z-10" />
                            </div>
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">DRIVE DIGITAL TRANSFORMATION</p>
                            <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>GenAI Skills Track</h3>
                            <p className="text-sm opacity-70 mb-6 flex-grow">Empower teams across job functions and career levels with learning paths in generative AI.</p>
                            <a href="#" className="text-blue-600 font-bold text-sm hover:underline flex items-center">Explore AI innovation <ChevronRightIcon className="w-4 h-4 ml-1"/></a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-16">
                    <div className="flex-1">
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                            Ready to learn more?
                        </h2>
                        <p className="mb-6 opacity-80 leading-relaxed">
                            Let's connect to discuss how Coursera can help you upskill and reskill job seekers, public servants, and citizens to thrive in the digital economy.
                        </p>
                        <p className="mb-4 font-semibold opacity-80">Discover how we partner with workforce development organizations and public sector agencies to:</p>
                        <ul className="space-y-3 mb-10">
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3" /> Build in-demand skills for changing labor market needs</li>
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3" /> Engage and retain mission-driven talent</li>
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3" /> Drive sustainable economic growth</li>
                        </ul>
                        
                        <p className="text-sm font-semibold opacity-70 mb-6">Join over 900 organizations, including federal agencies, think tanks, and non-profits, who have partnered with Coursera to transform their workforce.</p>
                        <div className="grid grid-cols-3 gap-6 opacity-60 grayscale">
                             {/* Placeholder logos */}
                             {['AARP', 'Dubai Police', 'National Bank', 'Health Ministry', 'NTI', 'European Bank'].map((l, i) => (
                                 <div key={i} className="h-10 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-center text-xs font-bold text-center p-1">{l}</div>
                             ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className={`p-8 border rounded-xl shadow-lg ${theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">First Name</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Last Name</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Work Email</label>
                                    <input type="email" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Phone Number</label>
                                    <input type="tel" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Organization Type</label>
                                    <select className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none"><option>Government</option></select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Job Title</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Organization Name</label>
                                    <input type="text" className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Organization Size</label>
                                    <select className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none"><option>100-500</option></select>
                                </div>
                            </div>
                            <div className="space-y-1 mb-6">
                                <label className="text-xs font-bold opacity-70">Country</label>
                                <select className="w-full p-3 border rounded-lg bg-transparent text-sm focus:ring-2 ring-blue-500 outline-none"><option>United States</option></select>
                            </div>
                            
                            <p className="text-[10px] opacity-60 mb-6 leading-tight">By submitting your info in the form above, you agree to our Terms of Use and Privacy Notice. We may use this info to contact you and/or use data from third parties to personalize your experience.</p>

                            <button className="w-full py-3 bg-[#0056D2] text-white font-bold rounded-lg hover:bg-[#00419e] transition-colors">
                                Request info
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    const renderGenericContent = () => (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center p-8">
                <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>
                    Stephen for {type.charAt(0).toUpperCase() + type.slice(1)}
                </h2>
                <p className="opacity-70 text-lg mb-8">Transforming education and governance with AI-powered learning.</p>
                <button className="bg-[#0056D2] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#00419e] transition-colors">
                    Contact Sales
                </button>
            </div>
        </div>
    );

    // --- Main Render ---
    return (
        <div className={`w-full ${theme === 'dark' ? 'text-gray-200' : 'text-neutral-800'}`}>
            {type === 'business' && renderBusinessContent()}
            {type === 'team' && renderTeamContent()}
            {type === 'universities' && renderUniversitiesContent()}
            {type === 'government' && renderGovernmentContent()}

            {/* Reusing existing form from Business view for consistency at bottom for Generic or Business/Team pages if needed, 
                but universities and government have their own specific one above. We can conditionally render the generic one.
            */}
            {(type === 'business') && (
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className={`rounded-[32px] p-8 md:p-16 border ${theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
                        <div className="text-center mb-12">
                            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Lora', serif" }}>Ready to learn more?</h2>
                            <p className="opacity-70">Connect with us to discuss how Stephen Enterprise can help you.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60">First Name</label>
                                <input type="text" className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}`} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Last Name</label>
                                <input type="text" className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}`} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Work Email</label>
                                <input type="email" className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}`} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Phone</label>
                                <input type="tel" className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}`} />
                            </div>
                        </div>
                        
                        <div className="space-y-2 mb-8">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Organization Type</label>
                            <select className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}`}>
                                <option>Business / Corporation</option>
                                <option>University / College</option>
                                <option>Government</option>
                            </select>
                        </div>

                        <button className="w-full py-4 bg-[#0056D2] text-white font-bold rounded-xl hover:bg-[#00419e] transition-colors shadow-lg">
                            Submit Request
                        </button>
                    </div>
                </div>
            </section>
            )}
        </div>
    );
};

export default EnterpriseView;
