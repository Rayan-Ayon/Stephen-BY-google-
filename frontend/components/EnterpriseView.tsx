import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircleIcon, 
    ChevronRightIcon, 
    TrendingUpIcon, 
    UsersIcon, 
    ShieldCheckIcon, 
    TrophyIcon, 
    BookOpenIcon, 
    GlobeIcon, 
    SettingsIcon, 
    AdjustIcon 
} from './icons';
import { Theme } from '../App';
import { addPartnershipRequest } from '../utils/mockDb';

interface EnterpriseViewProps {
    theme: Theme;
    onStartLearning: () => void;
    type: 'business' | 'team' | 'universities' | 'government';
}

const EnterpriseView: React.FC<EnterpriseViewProps> = ({ theme, onStartLearning, type }) => {
    // Onboarding Steps: 1 = Landing, 2 = Pricing Grid, 3 = Intake Form
    const [step, setStep] = useState<number>(1);
    
    // Interactive states for Pricing (Step 2)
    const [seatCount, setSeatCount] = useState<number>(2);
    const [billingPeriod, setBillingPeriod] = useState<'quarterly' | 'annually'>('annually');
    
    // Interactive states for Intake Form (Step 3)
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        orgType: 'University',
        country: 'United States'
    });
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Price Calculations (Standard Coursera Teams price is $319/seat/year)
    const annualPricePerSeat = 319;
    const quarterlyPricePerSeat = 99; // $99 per seat per quarter equivalent
    const calculatedPrice = billingPeriod === 'annually' 
        ? seatCount * annualPricePerSeat 
        : seatCount * quarterlyPricePerSeat * 4;

    const handleIncrement = () => {
        setSeatCount(prev => prev + 1);
    };

    const handleDecrement = () => {
        setSeatCount(prev => (prev > 2 ? prev - 1 : 2));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        
        if (!formValues.firstName.trim()) errors.firstName = 'First name is required';
        if (!formValues.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formValues.email.trim()) errors.email = 'Email address is required';
        else if (!/\S+@\S+\.\S+/.test(formValues.email)) errors.email = 'Email is invalid';
        if (!formValues.phone.trim()) errors.phone = 'Phone number is required';
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        addPartnershipRequest({
            name: `${formValues.firstName} ${formValues.lastName}`.trim(),
            email: formValues.email,
            orgName: formValues.orgType,
            phone: formValues.phone,
        });

        setIsSubmitted(true);
    };

    // Reset flow helper
    const handleReset = () => {
        setStep(1);
        setIsSubmitted(false);
        setFormValues({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            orgType: 'University',
            country: 'United States'
        });
        setFormErrors({});
        setSeatCount(2);
    };

    return (
        <div className="w-full min-h-screen bg-[#0B0F19] text-gray-200 font-sans flex flex-col justify-center items-center py-24 px-4 md:px-8 select-none">
            <div className="w-full max-w-6xl">
                
                {/* --- Step Indicator / Progress Bar --- */}
                <div className="flex justify-between items-center mb-12 max-w-md mx-auto relative px-2">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#334155] -translate-y-1/2 z-0" />
                    <div 
                        className="absolute left-0 top-1/2 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                    
                    {[1, 2, 3].map((s) => (
                        <button
                            key={s}
                            onClick={() => s < step && setStep(s)}
                            disabled={s >= step}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all duration-300 z-10 ${
                                step === s 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                : step > s 
                                ? 'bg-blue-950 border-blue-600 text-blue-400 cursor-pointer'
                                : 'bg-[#1E293B] border-[#334155] text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* --- Main Sub-Flow Animations Wrapper --- */}
                <AnimatePresence mode="wait">
                    
                    {/* --- STEP 1: The B2B Landing Canvas --- */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                        >
                            {/* Left Text Column */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="inline-flex items-center space-x-2 bg-blue-950/50 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-blue-400 uppercase">
                                    <GlobeIcon className="w-3.5 h-3.5" />
                                    <span>Stephen for Enterprise</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-medium leading-[1.15]" style={{ fontFamily: "'Lora', serif" }}>
                                    The expert-powered learning platform that drives business growth
                                </h1>
                                <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                                    Our platform delivers expert-led courses, tailored learning paths, and AI tools to help organizations drive workforce growth globally.
                                </p>
                                
                                <div className="space-y-4 pt-2">
                                    {[
                                        "Build in-demand skills with world-class content",
                                        "Comprehensive learning platform with tailored paths",
                                        "Customize training programs with AI-powered tools"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start space-x-3.5">
                                            <CheckCircleIcon className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-300 font-medium text-base md:text-lg">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6">
                                    <button 
                                        onClick={() => setStep(2)}
                                        className="group bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.35)] flex items-center space-x-3 hover:translate-x-1"
                                    >
                                        <span>Book a Demo</span>
                                        <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Right Image Canvas & Quote Overlay */}
                            <div className="lg:col-span-5 relative h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden border border-[#334155] shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" 
                                    alt="Business Professional" 
                                    className="w-full h-full object-cover filter brightness-90 contrast-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-[#1E293B]/80 backdrop-blur-md border border-[#334155] p-6 rounded-xl shadow-lg">
                                        <p className="text-white font-serif italic text-base leading-relaxed">
                                            "Stephen Enterprise helped us scale our AI capabilities 3x faster than projected."
                                        </p>
                                        <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-3">
                                            — CTO, TechGlobal
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- STEP 2: The Multi-Tier Pricing Grid --- */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-4 max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-serif text-white" style={{ fontFamily: "'Lora', serif" }}>
                                    Choose the right enterprise learning solution for your workforce
                                </h2>
                                <p className="text-gray-400 text-base md:text-lg">
                                    Scale from small teams to global institutions with flexible learning plans.
                                </p>
                            </div>

                            {/* Seat Counter Component */}
                            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 max-w-md mx-auto text-center space-y-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                                <h3 className="text-gray-300 font-semibold text-lg">
                                    How many learners need access?
                                </h3>
                                
                                <div className="flex items-center justify-center space-x-6">
                                    <button 
                                        onClick={handleDecrement}
                                        className="w-12 h-12 rounded-xl bg-[#0B0F19] hover:bg-[#0B0F19]/80 border border-[#334155] hover:border-gray-500 flex items-center justify-center text-xl font-bold text-white transition-all active:scale-95"
                                    >
                                        −
                                    </button>
                                    
                                    <span className="text-4xl font-mono font-bold text-white min-w-[70px]">
                                        {seatCount}
                                    </span>
                                    
                                    <button 
                                        onClick={handleIncrement}
                                        className="w-12 h-12 rounded-xl bg-[#0B0F19] hover:bg-[#0B0F19]/80 border border-[#334155] hover:border-gray-500 flex items-center justify-center text-xl font-bold text-white transition-all active:scale-95"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <p className="text-xs text-gray-500">
                                    Min seats: 2 &bull; Shift focus to Enterprise card at 50+ seats
                                </p>
                            </div>

                            {/* Dual Card Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto pt-4">
                                
                                {/* Card A: Stephen for Teams */}
                                <div 
                                    className={`rounded-2xl border p-8 flex flex-col justify-between transition-all duration-500 relative overflow-hidden ${
                                        seatCount < 50 
                                        ? 'bg-[#1E293B] border-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.15)] scale-[1.02]' 
                                        : 'bg-[#1E293B]/40 border-[#334155] opacity-50 scale-95 pointer-events-none'
                                    }`}
                                >
                                    {seatCount < 50 && (
                                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
                                            Recommended
                                        </div>
                                    )}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-serif text-white font-semibold">Stephen for Teams</h3>
                                            <p className="text-sm text-gray-400 mt-2">Best for smaller teams, 2-49 learners</p>
                                        </div>

                                        <div className="border-t border-[#334155] pt-6 space-y-2">
                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-4xl font-bold text-white">${annualPricePerSeat}</span>
                                                <span className="text-sm text-gray-400">USD / seat / year</span>
                                            </div>
                                            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                                                Total Billed: ${calculatedPrice.toLocaleString()} USD / year
                                            </p>
                                        </div>

                                        <ul className="space-y-4 text-sm text-gray-300 border-t border-[#334155] pt-6">
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Access our full library of expert-led business content</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Role-based learning paths tailored to your team's goals</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Hands-on coding labs, assessments, and quizzes</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Admin dashboard to track learning progress & ROI</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-8">
                                        <button 
                                            disabled={seatCount >= 50}
                                            onClick={() => setStep(3)}
                                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                                                seatCount < 50
                                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-[#0B0F19] text-gray-500 border border-[#334155]'
                                            }`}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>

                                {/* Card B: Stephen for Enterprise */}
                                <div 
                                    className={`rounded-2xl border p-8 flex flex-col justify-between transition-all duration-500 relative overflow-hidden ${
                                        seatCount >= 50 
                                        ? 'bg-[#1E293B] border-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.15)] scale-[1.02]' 
                                        : 'bg-[#1E293B]/40 border-[#334155] opacity-50 scale-95'
                                    }`}
                                >
                                    {seatCount >= 50 && (
                                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
                                            Recommended
                                        </div>
                                    )}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-serif text-white font-semibold">Stephen for Enterprise</h3>
                                            <p className="text-sm text-gray-400 mt-2">Best for larger teams, 50+ learners</p>
                                        </div>

                                        <div className="border-t border-[#334155] pt-6 space-y-2">
                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-4xl font-bold text-white">Custom</span>
                                                <span className="text-sm text-gray-400">tiered pricing</span>
                                            </div>
                                            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                                                Custom integration & support plans
                                            </p>
                                        </div>

                                        <ul className="space-y-4 text-sm text-gray-300 border-t border-[#334155] pt-6">
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span className="text-white font-medium">Everything in Teams, plus:</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span>SSO, API, and LMS integrations that fit existing systems</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Dedicated Customer Success Manager and onboarding</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Custom course building and exclusive AI tutor extensions</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-8">
                                        <button 
                                            onClick={() => setStep(3)}
                                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                                                seatCount >= 50
                                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-[#0B0F19]/60 hover:bg-[#0B0F19] text-gray-300 border border-[#334155]'
                                            }`}
                                        >
                                            Contact Sales
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}

                    {/* --- STEP 3: The Premium Dark Intake Form --- */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                        >
                            {/* Left Text / Info Panel */}
                            <div className="lg:col-span-5 space-y-6">
                                <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight" style={{ fontFamily: "'Lora', serif" }}>
                                    Build the skills your workforce needs next
                                </h2>
                                <p className="text-gray-400 text-base leading-relaxed">
                                    Stephen helps universities, corporations, and bootcamps prepare employees and students with AI-first curriculums.
                                </p>
                                
                                <div className="space-y-4 pt-4">
                                    {[
                                        "Reduce time to competence by targeting role-critical skill gaps.",
                                        "Accelerate transformation by aligning learning to priorities.",
                                        "Prove proficiency with trusted assessments and credentials.",
                                        "Improve productivity by building on-the-job capability and confidence."
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-start space-x-3">
                                            <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-300 leading-relaxed">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Intake Container */}
                            <div className="lg:col-span-7">
                                <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 md:p-10 shadow-2xl relative min-h-[450px] flex flex-col justify-center">
                                    
                                    <AnimatePresence mode="wait">
                                        {!isSubmitted ? (
                                            <motion.form 
                                                key="form"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onSubmit={handleFormSubmit}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-xl font-bold text-white border-b border-[#334155] pb-4 mb-2">
                                                    Partnership Request Form
                                                </h3>

                                                {/* First & Last Name */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            First Name
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            name="firstName"
                                                            value={formValues.firstName}
                                                            onChange={handleInputChange}
                                                            className={`w-full p-4 rounded-xl border bg-[#0B0F19] text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                                                                formErrors.firstName ? 'border-red-500/80' : 'border-[#334155] focus:border-blue-500'
                                                            }`} 
                                                            placeholder="John"
                                                        />
                                                        {formErrors.firstName && (
                                                            <p className="text-xs text-red-500 font-semibold">{formErrors.firstName}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            Last Name
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            name="lastName"
                                                            value={formValues.lastName}
                                                            onChange={handleInputChange}
                                                            className={`w-full p-4 rounded-xl border bg-[#0B0F19] text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                                                                formErrors.lastName ? 'border-red-500/80' : 'border-[#334155] focus:border-blue-500'
                                                            }`} 
                                                            placeholder="Doe"
                                                        />
                                                        {formErrors.lastName && (
                                                            <p className="text-xs text-red-500 font-semibold">{formErrors.lastName}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Email & Phone */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            Work Email Address
                                                        </label>
                                                        <input 
                                                            type="email" 
                                                            name="email"
                                                            value={formValues.email}
                                                            onChange={handleInputChange}
                                                            className={`w-full p-4 rounded-xl border bg-[#0B0F19] text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                                                                formErrors.email ? 'border-red-500/80' : 'border-[#334155] focus:border-blue-500'
                                                            }`} 
                                                            placeholder="john@organization.com"
                                                        />
                                                        {formErrors.email && (
                                                            <p className="text-xs text-red-500 font-semibold">{formErrors.email}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            Phone Number
                                                        </label>
                                                        <input 
                                                            type="tel" 
                                                            name="phone"
                                                            value={formValues.phone}
                                                            onChange={handleInputChange}
                                                            className={`w-full p-4 rounded-xl border bg-[#0B0F19] text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                                                                formErrors.phone ? 'border-red-500/80' : 'border-[#334155] focus:border-blue-500'
                                                            }`} 
                                                            placeholder="+1 (555) 000-0000"
                                                        />
                                                        {formErrors.phone && (
                                                            <p className="text-xs text-red-500 font-semibold">{formErrors.phone}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Org Type & Country */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            Organization Type
                                                        </label>
                                                        <select 
                                                            name="orgType"
                                                            value={formValues.orgType}
                                                            onChange={handleInputChange}
                                                            className="w-full p-4 rounded-xl border border-[#334155] bg-[#0B0F19] text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                        >
                                                            <option value="University">University</option>
                                                            <option value="Coding Bootcamp">Coding Bootcamp</option>
                                                            <option value="Corporate Team">Corporate Team</option>
                                                            <option value="Government Agency">Government Agency</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            Country
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            name="country"
                                                            value={formValues.country}
                                                            onChange={handleInputChange}
                                                            className="w-full p-4 rounded-xl border border-[#334155] bg-[#0B0F19] text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                            placeholder="United States"
                                                        />
                                                    </div>
                                                </div>

                                                <p className="text-[10px] text-gray-500 leading-normal">
                                                    By submitting your info in the form above, you agree to our <span className="underline hover:text-white cursor-pointer">Terms of Use</span> and <span className="underline hover:text-white cursor-pointer">Privacy Notice</span>. We may use this info to contact you and/or use data from third parties to personalize your experience.
                                                </p>

                                                <div className="pt-2">
                                                    <button 
                                                        type="submit"
                                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </motion.form>
                                        ) : (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center space-y-6 py-12"
                                            >
                                                <div className="w-16 h-16 bg-blue-950 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                                    <CheckCircleIcon className="w-8 h-8 text-blue-500" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="text-2xl font-serif text-white font-semibold">
                                                        Request Received Successfully
                                                    </h3>
                                                    <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
                                                        Thank you for reaching out! A Stephen business representative will contact you within 24 hours to discuss options for your {formValues.orgType}.
                                                    </p>
                                                </div>
                                                <div className="pt-4">
                                                    <button
                                                        onClick={handleReset}
                                                        className="px-6 py-3 border border-[#334155] hover:border-gray-500 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300"
                                                    >
                                                        Submit Another Request
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default EnterpriseView;
