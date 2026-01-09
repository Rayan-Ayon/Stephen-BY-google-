
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ChevronDownIcon, PlusIcon } from './icons';

const faqs = [
    {
        question: "What do I get with the Pro plan?",
        answer: "With the Pro plan on Stephen, you get unlimited uploads, pastes, and recordings, along with unlimited AI chats (100 per day when using Learn+ mode). You can generate unlimited quizzes, unlimited practice exams, and create up to 12 podcasts per day. The plan supports file uploads of up to 2000 pages or 300 MB each, plus you get 10 courses and 20 placement tests per month, and unlimited course cards. This feature-rich plan empowers flexible, high-level learning and makes it easy to study, review, and master materials seamlessly."
    },
    {
        question: "What do I get with the Team plan?",
        answer: "The Team plan includes everything in the Pro plan, plus powerful tools for collaboration and management. Enjoy scalable discounts as your team grows, a single consolidated invoice for the whole team, and shared workspaces to learn and build together. You can easily add or remove members and set custom permissions to match each person's role.\n\nHave questions? We’re here to help, just email us at nawal@youlearn.ai"
    },
    {
        question: "What payment methods do you offer?",
        answer: "We support payments via major wallets, credit cards, and select country-specific methods, including Apple Pay, Google Pay, Link, Amazon Pay, Cash App Pay, Alipay, and WeChat Pay."
    },
    {
        question: "Can I cancel my Stephen plan at any time?",
        answer: "Yes, you can cancel your Stephen plan at any time and there are no cancellation fees. If you decide to cancel, you'll still have access to your plan's features until the end of your current billing cycle."
    },
    {
        question: "Do you offer student discount?",
        answer: "Student Discount\nYes! Students get a 20% discount on our Pro plan. Sign up with a .edu email and the discount will automatically be applied. If your student email does not end with a .edu please contact us at \"nawal@youlearn.ai\" and we will arrange it for you."
    },
    {
        question: "What is your refund policy?",
        answer: "Refund\nWhat is the refund policy for users with free trials?\nWe offer a 7-day free trial with full access to our services. If you do not cancel before the trial period ends, your subscription will automatically renew at the regular rate. Because full access is granted during the trial, refunds are not provided once the billing period begins.\n\nWhat if I subscribe directly?\nDirect subscribers are protected by a 7-day money-back guarantee from the first payment date.\n\nHow about for renewals?\nAll subscription renewals are non-refundable. Customers are responsible for canceling their subscriptions before the next billing date to avoid additional charges.\n\nHow can I request a refund?\nEmail nawal@youlearn.ai from your account email within 7 days of payment, including your reason. Refunds are processed to your original payment method within 5–7 business days.\n\nWhat about Team Plans?\nUp to 199 seats: Same 7-day refund window applies.\n200+ seats (annual): Refunds aren’t automatic — contact us to discuss eligibility. We recommend starting with a smaller or monthly plan first."
    }
];

const PricingView = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="flex-1 overflow-y-auto h-full dark:bg-[#0d0d0d] bg-neutral-50 dark:text-white text-black">
            <div className="max-w-5xl mx-auto px-6 py-16">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Lora', serif" }}>
                        Save hours, learn smarter.
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Enjoy endless content uploads, chats, voice mode, recorded lectures, and more.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-gray-200 dark:bg-[#1a1a1a] p-1 rounded-full flex items-center relative">
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all z-10 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            Pay Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all z-10 flex items-center ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            Pay Yearly <span className="ml-2 text-xs text-green-400 font-bold">Save 40%</span>
                        </button>
                        <motion.div 
                            className="absolute top-1 bottom-1 bg-black dark:bg-[#262626] rounded-full shadow-sm"
                            initial={false}
                            animate={{
                                left: billingCycle === 'monthly' ? '4px' : '50%',
                                width: billingCycle === 'monthly' ? 'calc(50% - 8px)' : 'calc(50% - 4px)',
                                x: billingCycle === 'monthly' ? 0 : 0
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* Pro Plan */}
                    <div className="bg-white dark:bg-white text-black rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">Pro <span className="text-sm font-normal text-gray-500">Billed {billingCycle === 'yearly' ? 'Annually' : 'Monthly'}</span></h3>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Popular</span>
                        </div>
                        <div className="flex items-baseline mb-2">
                            <span className="text-5xl font-bold font-serif">৳{billingCycle === 'yearly' ? '598' : '850'}</span>
                            <span className="text-gray-500 ml-2">/ month</span>
                        </div>
                        <p className="text-gray-600 mb-8 border-b border-gray-200 pb-8">Learn at the highest level.</p>
                        
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-black shrink-0 mr-3" />
                                <span className="text-sm font-medium"><strong>Unlimited</strong> uploads, pastes, and records</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-black shrink-0 mr-3" />
                                <span className="text-sm font-medium"><strong>Unlimited</strong> AI chats (100 / day with <span className="underline decoration-dotted">Learn+</span> mode)</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-black shrink-0 mr-3" />
                                <span className="text-sm font-medium"><strong>Unlimited</strong> quiz generation</span>
                            </li>
                        </ul>

                        <div className="bg-gray-100 rounded-2xl p-6 mt-auto text-center">
                             <button className="flex items-center justify-center w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                Select Plan <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Team Plan */}
                    <div className="bg-white dark:bg-[#111111] dark:text-white text-black border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">Team <span className="text-sm font-normal text-gray-500">Billed {billingCycle === 'yearly' ? 'Annually' : 'Monthly'}</span></h3>
                        </div>
                        <div className="flex items-baseline mb-1">
                            <span className="text-5xl font-bold font-serif">৳{billingCycle === 'yearly' ? '437' : '650'}</span>
                            <span className="text-gray-500 ml-2">/ month / seat</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Minimum 3 seats required</p>
                        <p className="text-gray-500 mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">For study groups and teams.</p>
                        
                        <div className="mb-4 text-sm font-bold">Everything in Pro +</div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-white shrink-0 mr-3" />
                                <span className="text-sm font-medium">Discounts scale with <strong>team size</strong></span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-white shrink-0 mr-3" />
                                <span className="text-sm font-medium"><strong>Centralized</strong> team billing</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-white shrink-0 mr-3" />
                                <span className="text-sm font-medium"><strong>Shared</strong> spaces</span>
                            </li>
                        </ul>

                         <div className="bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl p-6 mt-auto text-center">
                             <button className="flex items-center justify-center w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                Choose Team <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
                        <p className="text-gray-500 text-sm">Can't find the answer here? <a href="#" className="underline hover:text-white">Contact us</a></p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
                                >
                                    <span className="font-semibold text-lg">{faq.question}</span>
                                    <ChevronDownIcon 
                                        className={`w-5 h-5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-gray-400 pb-4 whitespace-pre-line text-sm leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PricingView;
